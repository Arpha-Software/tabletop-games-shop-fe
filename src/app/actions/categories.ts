// tabletop-games-shop-fe/src/app/actions/categories.ts
'use server';

import { apiClient } from "@/utils/apiClient";
import { TCategory } from "@/utils/types";
import { cookies } from 'next/headers'; // Import cookies

export const getAllCategories = async () => { // Removed authToken parameter
  try {
    const authToken = cookies().get('authToken')?.value; // Get token from cookie

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const data = await apiClient.get<any>('/api/v1/categories', headers);

    return {
      success: true,
      errors: [],
      data: data?.content as TCategory[],
    };
  } catch (error: any) {
    console.error("Get All Categories Error:", error);
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

export const createCategory = async (categoryData: Omit<TCategory, 'id'>) => { // Removed authToken parameter
  try {
    const authToken = cookies().get('authToken')?.value; // Get token from cookie

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else {
      // If token is required for creation, and not found, redirect to login
      // This is a server action, so redirect is appropriate.
      // Alternatively, return an error and let the client handle it.
      // For now, let's return an error for consistency with other actions.
      return { success: false, errors: ['Authentication token not provided for category creation.'] };
    }

    await apiClient.post<TCategory>('/api/v1/categories', categoryData, headers);
    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error("Create Category Error:", error);
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
