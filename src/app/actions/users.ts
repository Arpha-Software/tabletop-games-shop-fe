// src/app/actions/users.ts
'use server';

import { apiClient } from '@/utils/apiClient';
import { cookies } from 'next/headers';
import { refreshAccessToken } from './auth';

/** Generic pageable wrapper (matches your BE shape) */
export type PageResponse<T> = {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  // pageable/sort omitted
};

/** Minimal admin user shape for the table */
export type TUserAdmin = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
};

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

/**
 * Fetch users with paging/sorting and optional filters.
 * Adjust query param names if your BE expects different ones (e.g. `q` vs separate fields).
 */
export async function getUsers(params: {
  page?: number;
  size?: number;
  sort?: string; // e.g. 'createdAt,desc' or 'id,desc'
  q?: string;    // free-text search across name/email (if BE supports)
  role?: string;
} = {}) {
  const {
    page = 0,
    size = 12,
    sort = 'id,desc',
    q,
    role,
  } = params;

  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('size', String(size));
  qs.set('sort', sort);

  if (q) qs.set('q', q);         // <-- rename/delete if your BE uses a different param
  if (role) qs.set('role', role);

  const url = `/api/v1/users?${qs.toString()}`;
  const data = await withAuthGet<PageResponse<TUserAdmin>>(url);

  return { success: true as const, errors: [] as string[], data };
}

/** Optional details fetch used by the row click */
export async function getUserDetails(userId: number) {
  const url = `/api/v1/users/${userId}`;
  const data = await withAuthGet<TUserAdmin>(url);
  return { success: true as const, errors: [] as string[], data };
}
