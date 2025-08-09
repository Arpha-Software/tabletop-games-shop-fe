'use server';

import { apiClient } from '@/utils/apiClient';
import { cookies } from 'next/headers';
import { refreshAccessToken } from './auth';
import type { CreateOrderPayload } from '@/utils/orderTypes';

// НІЧОГО, крім async-функцій, НЕ експортуємо з цього файлу

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

export async function getOrders(params: { page?: number; size?: number; sort?: string } = {}) {
  const { page = 0, size = 10, sort = 'createdAt,desc' } = params;

  const data = await (async () => {
    const token1 = cookies().get('authToken')?.value;
    try {
      const headers: HeadersInit = {};
      if (token1) headers['Authorization'] = `Bearer ${token1}`;
      return await apiClient.get<any>(`/api/v1/orders?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`, headers);
    } catch (err: any) {
      if (err?.statusCode === 401) {
        const refreshed = await refreshAccessToken();
        if (!refreshed.success) throw err;
        const token2 = cookies().get('authToken')?.value;
        const headers: HeadersInit = token2 ? { 'Authorization': `Bearer ${token2}` } : {};
        return await apiClient.get<any>(`/api/v1/orders?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`, headers);
      }
      throw err;
    }
  })();

  return { success: true, errors: [], data };
}

export async function getOrderDetails(userId: number, orderId: number) {
  const data = await (async () => {
    const token1 = cookies().get('authToken')?.value;
    try {
      const headers: HeadersInit = {};
      if (token1) headers['Authorization'] = `Bearer ${token1}`;
      return await apiClient.get<any>(`/api/v1/users/${userId}/orders/${orderId}`, headers);
    } catch (err: any) {
      if (err?.statusCode === 401) {
        const refreshed = await refreshAccessToken();
        if (!refreshed.success) throw err;
        const token2 = cookies().get('authToken')?.value;
        const headers: HeadersInit = token2 ? { 'Authorization': `Bearer ${token2}` } : {};
        return await apiClient.get<any>(`/api/v1/users/${userId}/orders/${orderId}`, headers);
      }
      throw err;
    }
  })();

  return { success: true, errors: [], data };
}

export async function createOrder(payload: CreateOrderPayload) {
  const data = await withAutoRefresh(async (authToken) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    return apiClient.post<any>('/api/v1/orders', payload, headers);
  });
  return { success: true, errors: [], data };
}
