// tabletop-games-shop-fe/src/app/actions/categories.ts
'use server';

import { apiClient } from "@/utils/apiClient";
import { TCategory } from "@/utils/types";
import { cookies } from 'next/headers';

export const getAllCategories = async () => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const headers: HeadersInit = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const raw = await apiClient.get<any>('/api/v1/categories', headers);

    // Support both paginated { content: [...] } and plain [...]
    const list: TCategory[] = Array.isArray(raw?.content)
      ? raw.content
      : Array.isArray(raw)
        ? raw
        : [];

    return { success: true, errors: [], data: list };
  } catch (error: any) {
    console.error("Get All Categories Error:", error);
    return {
      success: false,
      errors: error?.data?.errors || [error?.message || 'Unknown error'],
      data: [],
    };
  }
};

export const createCategory = async (categoryData: Omit<TCategory, 'id'>) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const headers: HeadersInit = {};
    if (!authToken) {
      return { success: false, errors: ['Authentication token not provided for category creation.'] };
    }
    headers['Authorization'] = `Bearer ${authToken}`;

    await apiClient.post<TCategory>('/api/v1/categories', categoryData, headers);
    return { success: true, errors: [] };
  } catch (error: any) {
    console.error("Create Category Error:", error);
    return {
      success: false,
      errors: error?.data?.errors || [error?.message || 'Unknown error'],
    };
  }
};
