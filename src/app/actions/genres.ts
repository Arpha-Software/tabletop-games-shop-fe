// tabletop-games-shop-fe/src/app/actions/genres.ts
'use server';

import { apiClient } from "@/utils/apiClient";
import { TGenre } from "@/utils/types"; // Import Genre type
import { cookies } from 'next/headers'; // Import cookies

export const getAllGenres = async () => { // Removed authToken parameter
  try {
    const authToken = cookies().get('authToken')?.value; // Get token from cookie

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const data = await apiClient.get<any>('/api/v1/genres', headers);
    return {
      success: true,
      errors: [],
      data: data.content as TGenre[],
    };
  } catch (error: any) {
    console.error("Get All Genres Error:", error);
    if (error) {
      return {
        success: false,
        errors: error.data?.errors || [error.message],
        data: [],
      };
    }
    return {
      success: false,
      errors: [error.message],
      data: [],
    };
  }
};

export const createGenre = async (genreData: Omit<TGenre, 'id'>) => { // Removed authToken parameter
  try {
    const authToken = cookies().get('authToken')?.value; // Get token from cookie

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else {
      return { success: false, errors: ['Authentication token not provided for genre creation.'] };
    }

    await apiClient.post<TGenre>('/api/v1/genres', genreData, headers);
    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error("Create Genre Error:", error);
    if (error) {
      return {
        success: false,
        errors: error.data?.errors || [error.message],
      };
    }
    return {
      success: false,
      errors: [error.message],
    };
  }
};
