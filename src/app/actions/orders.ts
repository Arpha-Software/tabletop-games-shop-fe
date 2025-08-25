// src/app/actions/orders.ts
'use server';

import { apiClient } from '@/utils/apiClient';
import { cookies } from 'next/headers';
import { refreshAccessToken } from './auth';


type OrdersFilters = Partial<{
  orderStatus: string; // "NEW" | "CANCELLED" | ...
  id: number | string;
  customerDetails: string;
  user: string;
  createdAt: string;  // ISO date-time
  updatedAt: string;  // ISO date-time
  statusHistory: string;
  deliveryDetails: string;
  orderedItems: string;
}>;

export type PageResponse<T> = {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  // pageable/sort fields omitted for brevity
};

export type BackendStatus =
  | 'NEW' | 'CANCELLED' | 'ON_THE_WAY' | 'WAITING_TAKEOUT' | 'CREATED_CONSIGNMENT'
  | 'CONSIGNMENT_NOT_FOUND' | 'IN_CITY_INTERREGIONAL' | 'IN_CITY_LOCAL' | 'HEADING_TO_CITY'
  | 'IN_CITY_ESTIMATED_DELIVERY' | 'ARRIVED_AT_WAREHOUSE' | 'ARRIVED_AT_LOCKER' | 'RECEIVED'
  | 'RECEIVED_PENDING_PAYMENT' | 'RECEIVED_PAYMENT_ISSUED' | 'PROCESSING' | 'REFUSED_RETURN_ORDERED'
  | 'REFUSED' | 'ADDRESS_CHANGED' | 'STORAGE_ENDED' | 'REVERSE_DELIVERY_CREATED'
  | 'FAILED_DELIVERY_NO_CONTACT' | 'DELIVERY_DATE_CHANGED';

export type OrdersListItem = {
  id: number;
  // the backend returns these flattened address-ish fields (based on your sample)
  city?: string;
  street?: string;
  houseNumber?: string;
  flatNumber?: string;
  department?: string;

  orderStatus: BackendStatus;
  createdAt: string;
  expectedDeliveryDate?: string;
  orderPriceSummary: number;
  orderQuantity: number;

  // sometimes present (needed for details call)
  user?: { id: number } | null;
  userId?: number | null;
};

async function withAutoRefresh<T>(fn: (authToken?: string) => Promise<T>): Promise<T> {
  const token1 = cookies().get('authToken')?.value;
  try {
    return await fn(token1);
  } catch (err: any) {
    if (err?.statusCode === 401) {
      const refreshed = await refreshAccessToken();
      if (!refreshed.success) throw err;
      const token2 = cookies().get('authToken')?.value;
      return await fn(token2);
    }
    throw err;
  }
}

// function normalizePaged(raw: any, defaults: { page: number; size: number; sort: string }): OrdersListResponse {
//   const list = Array.isArray(raw?.content) ? raw.content : Array.isArray(raw) ? raw : [];
//   const page = typeof raw?.number === 'number' ? raw.number : defaults.page;
//   const size = typeof raw?.size === 'number' ? raw.size : defaults.size;
//   const totalPages = typeof raw?.totalPages === 'number' ? raw.totalPages : 1;
//   const totalElements = typeof raw?.totalElements === 'number' ? raw.totalElements : list.length;
//   return { list, page, size, totalPages, totalElements, sort: defaults.sort };
// }

export type OrdersListResponse = PageResponse<OrdersListItem>;

/* ---------- Helpers ---------- */
async function withAuthGet<T>(url: string): Promise<T> {
  const tryOnce = async () => {
    const token = cookies().get('authToken')?.value;
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    return apiClient.get<T>(url, headers);
  };

  try {
    return await tryOnce();
  } catch (err: any) {
    if (err?.statusCode === 401) {
      const refreshed = await refreshAccessToken();
      if (!refreshed.success) throw err;
      return await tryOnce();
    }
    throw err;
  }
}

export async function getOrders(params: {
  page?: number;
  size?: number;
  sort?: string;
  orderStatus?: BackendStatus;
  id?: number;
  createdAtFrom?: string; // YYYY-MM-DD
  createdAtTo?: string;   // YYYY-MM-DD
} = {}) {
  const {
    page = 0,
    size = 10,
    sort = 'createdAt,desc',
    orderStatus,
    id,
    createdAtFrom,
    createdAtTo,
  } = params;

  // backend expects Pageable fields; it also supports filtering via query (per your spec)
  const q = new URLSearchParams();
  q.set('page', String(page));
  q.set('size', String(size));
  q.set('sort', sort);

  if (orderStatus) q.set('orderStatus', orderStatus);
  if (typeof id === 'number' && !Number.isNaN(id)) q.set('id', String(id));

  // If your BE expects a single createdAt param, change to what your controller actually parses.
  // Common approach: pass from/to as separate params or reuse createdAt multiple times; here we pass both.
  if (createdAtFrom) q.set('createdAtFrom', createdAtFrom);
  if (createdAtTo) q.set('createdAtTo', createdAtTo);

  const url = `/api/v1/orders?${q.toString()}`;

  const data = await withAuthGet<OrdersListResponse>(url);
  return { success: true as const, errors: [] as string[], data };
}

export async function getOrderDetails(userId: number, orderId: number) {
  try {
    const raw = await withAutoRefresh(async (authToken) => {
      const headers: HeadersInit = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      return apiClient.get<any>(`/api/v1/users/${userId}/orders/${orderId}`, headers);
    });
    return { success: true as const, errors: [] as string[], data: raw };
  } catch (error: any) {
    console.error('Get Order Details error:', error);
    return { success: false as const, errors: [error?.message || 'Unknown error'], data: null };
  }
}

// If your status update endpoint differs, adjust here.
export async function updateOrderStatus(orderId: number, orderStatus: string) {
  try {
    const result = await withAutoRefresh(async (authToken) => {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      return apiClient.patch<any>(`/api/v1/orders/${orderId}/status`, { orderStatus }, headers);
    });
    return { success: true as const, errors: [] as string[], data: result };
  } catch (error: any) {
    console.error('Update Order Status error:', error);
    return { success: false as const, errors: error?.data?.errors || [error?.message || 'Unknown error'] };
  }
}

export async function getOrdersByUser(
  userId: number,
  params: { page?: number; size?: number; sort?: string } = {}
) {
  const { page = 0, size = 10, sort = 'createdAt,desc' } = params;

  return await withAutoRefresh(async (authToken) => {
    const headers: HeadersInit = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    return apiClient.get<any>(
      `/api/v1/users/${userId}/orders?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`,
      headers
    );
  }).then((data) => ({ success: true, errors: [], data }));
}
