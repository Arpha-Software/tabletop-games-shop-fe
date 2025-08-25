// tabletop-games-shop-fe/src/app/actions/productTypes.ts
'use server';

import { apiClient } from "@/utils/apiClient";
import { TProductType } from "@/utils/types"; // Import ProductType type
import { cookies } from 'next/headers'; // Import cookies

export const getAllProductTypes = async () => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const headers: HeadersInit = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const raw = await apiClient.get<any>('/api/v1/product-types', headers);

    // Нормалізація: або page.content, або одразу масив
    const list: TProductType[] = Array.isArray(raw?.content)
      ? raw.content
      : Array.isArray(raw)
        ? raw
        : [];

    return { success: true, errors: [], data: list };
  } catch (error: any) {
    console.error("Get All Product Types Error:", error);
    return {
      success: false,
      errors: error?.data?.errors || [error?.message || 'Unknown error'],
      data: [],
    };
  }
};

export const createProductType = async (productTypeData: Omit<TProductType, 'id'>) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else {
      return { success: false, errors: ['Authentication token not provided for product type creation.'] };
    }
    const data = {
      name: productTypeData.name,
      width: productTypeData.dimension.width,
      height: productTypeData.dimension.height,
      weight: productTypeData.dimension.weight,
      length: productTypeData.dimension.length,
    }

    console.log('PRODUCT TYPE REQUEST BODY: ', data)
    await apiClient.post<TProductType>('/api/v1/product-types', data, headers);
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
