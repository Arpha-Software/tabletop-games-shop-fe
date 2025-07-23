'use server';

import { apiClient, ApiError } from "@/utils/apiClient";
import { TProduct } from "@/utils/types";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface ProductFilters {
  page?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  categories?: string[];
  genres?: string[];
  productTypeIds?: string[];
  searchQuery?: string;
  complexity?: number;
  components?: string;
  language?: string;
  minPlayerNumber?: string;
  type?: string;
}

export const createProduct = async (productData: any) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else {
      return { success: false, errors: ['Authentication token not provided for product creation.'] };
    }

    const responseData = await apiClient.post<TProduct>('/api/v1/products', productData, headers);
    return {
      success: true,
      errors: [],
      data: responseData,
    };
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error instanceof ApiError) {
      if (error.statusCode === 401) {
        redirect('/login');
      }
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

export const getAllProducts = async (filters: ProductFilters) => { // Removed authToken parameter
  try {
    const authToken = cookies().get('authToken')?.value; // Get token from cookie

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Construct query parameters from filters
    const queryParams = new URLSearchParams();
    if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
    filters.categories?.forEach(id => queryParams.append('categories', id));
    filters.genres?.forEach(id => queryParams.append('genres', id));
    filters.productTypeIds?.forEach(id => queryParams.append('productTypeIds', id));
    if (filters.searchQuery) queryParams.append('searchQuery', filters.searchQuery);

    const queryString = queryParams.toString();
    const endpoint = `/api/v1/products${queryString ? `?${queryString}` : ''}`;

    const data = await apiClient.get<{ content: TProduct[], totalPages: number }>(endpoint, headers);
    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    console.error('Error fetching all products:', error);
    if (error instanceof ApiError) {
      if (error.statusCode === 401) {
        redirect('/login'); // Perform server-side redirect for 401
      }
      return {
        success: false,
        errors: error.data?.errors || [error.message],
        data: { content: [], totalPages: 0 }, // Ensure consistent return type
      };
    }
    return {
      success: false,
      errors: [error.message],
      data: { content: [], totalPages: 0 }, // Ensure consistent return type
    };
  }
};

export const getProductsRecommendations = async (page: number) => { // Removed authToken parameter
  try {
    const authToken = cookies().get('authToken')?.value; // Get token from cookie

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const data = await apiClient.get<{ content: TProduct[], totalPages: number }>(`/api/v1/products/recommendations?page=${page}`, headers);
    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    console.error('Error fetching product recommendations:', error);
    if (error instanceof ApiError) {
      if (error.statusCode === 401) {
        redirect('/login'); // Perform server-side redirect for 401
      }
      return {
        success: false,
        errors: error.data?.errors || [error.message],
        data: { content: [], totalPages: 0 },
      };
    }
    return {
      success: false,
      errors: [error.message],
      data: { content: [], totalPages: 0 },
    };
  }
};

export const getProductById = async (id: string) => { // Removed authToken parameter
  try {
    const authToken = cookies().get('authToken')?.value; // Get token from cookie

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const data = await apiClient.get<TProduct>(`/api/v1/products/${id}`, headers);
    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    console.error(`Error fetching product with ID ${id}:`, error);
    if (error instanceof ApiError) {
      if (error.statusCode === 401) {
        redirect('/login'); // Perform server-side redirect for 401
      }
      return {
        success: false,
        errors: error.data?.errors || [error.message],
        data: null,
      };
    }
    return {
      success: false,
      errors: [error.message],
      data: null,
    };
  }
};

export const deleteProduct = async (id: number) => { // Removed authToken parameter
  try {
    const authToken = cookies().get('authToken')?.value; // Get token from cookie

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else {
      return { success: false, errors: ['Authentication token not provided for product deletion.'] };
    }

    await apiClient.delete<void>(`/api/v1/products/${id}`, headers);
    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      if (error.statusCode === 401) {
        redirect('/login');
      }
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
