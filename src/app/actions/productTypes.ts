// tabletop-games-shop-fe/src/app/actions/productTypes.ts
'use server';

import { apiClient } from "@/utils/apiClient";
import { TProductType } from "@/utils/types"; // Import ProductType type
import { cookies } from 'next/headers'; // Import cookies

export const getAllProductTypes = async () => { // Removed authToken parameter
  try {
    const authToken = cookies().get('authToken')?.value; // Get token from cookie

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const data = await apiClient.get<any>('/api/v1/product-types', headers);
    return {
      success: true,
      errors: [],
      data: data.content as TProductType[],
    };
  } catch (error: any) {
    console.error("Get All Product Types Error:", error);
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

export const createProductType = async (productTypeData: Omit<TProductType, 'id'>) => { // Removed authToken parameter
  try {
    const authToken = cookies().get('authToken')?.value; // Get token from cookie

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else {
      return { success: false, errors: ['Authentication token not provided for product type creation.'] };
    }

    await apiClient.post<TProductType>('/api/v1/product-types', productTypeData, headers);
    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error("Create Product Type Error:", error);
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
