// tabletop-games-shop-fe/src/app/actions/genres.ts
'use server';

import { apiClient } from "@/utils/apiClient";
import { TGenre } from "@/utils/types";
import { cookies } from 'next/headers';

export const getAllGenres = async () => {
  try {
    const authToken = cookies().get('authToken')?.value;
    const headers: HeadersInit = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const raw = await apiClient.get<any>('/api/v1/genres', headers);

    // Accept both paged { content: [...] } and plain [...]
    const list: TGenre[] = Array.isArray(raw?.content)
      ? raw.content
      : Array.isArray(raw)
        ? raw
        : [];

    return { success: true, errors: [], data: list };
  } catch (error: any) {
    console.error("Get All Genres Error:", error);
    return {
      success: false,
      errors: error?.data?.errors || [error?.message || 'Unknown error'],
      data: [],
    };
  }
};

export const createGenre = async (genreData: Omit<TGenre, 'id'>) => {
  try {
    const authToken = cookies().get('authToken')?.value;
    const headers: HeadersInit = {};
    if (!authToken) return { success: false, errors: ['Authentication token not provided for genre creation.'] };
    headers['Authorization'] = `Bearer ${authToken}`;

    await apiClient.post<TGenre>('/api/v1/genres', genreData, headers);
    return { success: true, errors: [] };
  } catch (error: any) {
    console.error("Create Genre Error:", error);
    return {
      success: false,
      errors: error?.data?.errors || [error?.message || 'Unknown error'],
    };
  }
};
