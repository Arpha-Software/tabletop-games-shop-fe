// src/app/actions/products.ts
'use server';

import { fetchWithAuth } from '@/app/lib/apiClient'; // Import the utility
import { base64ToArrayBuffer } from "@/utils/helpers";
// cookies from next/headers is not directly needed here if fetchWithAuth handles tokens

// uploadProductImages likely calls an external service (e.g., Azure Blob)
// and might not need our Bearer token. If it does, it would also use fetchWithAuth.
// For now, assuming it's an external, non-auth-bearer call for our API.
export const uploadProductImages = async (id: string, filesResponses: any[], imagesBase64: any[]) => {
  // ... (existing logic for Azure upload, likely using direct fetch)
  // This function does not call your backend API that requires Bearer token, so no change for fetchWithAuth here.
  // ...
  const results = await Promise.all(filesResponses.map(async (fileResponse) => {
    const image = imagesBase64.find((img) => img.uuid === fileResponse.fileUuid);
    if (!image) return { success: false, errors: [`Image ${fileResponse.fileUuid} not found`] };
    const arrayBuffer = base64ToArrayBuffer(image.base64);
    const response = await fetch(fileResponse.fileAccessLink.link, {
      method: 'PUT',
      headers: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': fileResponse.fileAccessLink.fileType },
      body: arrayBuffer,
    });
    return { success: response.ok, errors: response.ok ? [] : ['Upload failed'] };
  }));
  return results;
};


export const createProduct = async (data: any) => {
  try {
    const { imagesBase64, ...restBody } = data;
    const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products`, {
      method: 'POST',
      body: JSON.stringify(restBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create product and parse error response.' }));
      return { success: false, errors: [errorData.message || `HTTP error ${response.status}`] };
    }
    const responseBody = await response.json();
    if (responseBody.fileResponses && imagesBase64 && imagesBase64.length > 0) {
       // Assuming uploadProductImages is still relevant and works as intended
      await uploadProductImages(responseBody.id, responseBody.fileResponses, imagesBase64);
    }
    return { success: true, errors: [], data: responseBody };
  } catch (error: any) {
    console.error('Error in createProduct:', error);
    return { success: false, errors: [error.message || 'An unexpected error occurred'] };
  }
};

export const getAllProducts = async (page: number) => {
  try {
    const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products?page=${page}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch products.' }));
      return { success: false, errors: [errorData.message || `HTTP error ${response.status}`], data: null };
    }
    const data = await response.json();
    return { success: true, errors: [], data };
  } catch (error: any) {
    console.error('Error in getAllProducts:', error);
    return { success: false, errors: [error.message || 'An unexpected error occurred'], data: null };
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch product by ID.' }));
      return { success: false, errors: [errorData.message || `HTTP error ${response.status}`], data: null };
    }
    const data = await response.json();
    return { success: true, errors: [], data };
  } catch (error: any) {
    console.error('Error in getProductById:', error);
    return { success: false, errors: [error.message || 'An unexpected error occurred'], data: null };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete product.' }));
      return { success: false, errors: [errorData.message || `HTTP error ${response.status}`] };
    }
    return { success: true, errors: [] };
  } catch (error: any) {
    console.error('Error in deleteProduct:', error);
    return { success: false, errors: [error.message || 'An unexpected error occurred'] };
  }
};

export const updateProduct = async (productId: string, data: any) => {
  try {
    const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update product.' }));
      return { success: false, errors: [errorData.message || `HTTP error ${response.status}`] };
    }
    const responseData = await response.json();
    return { success: true, errors: [], data: responseData };
  } catch (error: any) {
    console.error('Error in updateProduct:', error);
    return { success: false, errors: [error.message || 'An unexpected error occurred'] };
  }
};

// Apply similar changes to src/app/actions/categories.ts, src/app/actions/genres.ts, etc.
// for any functions making authenticated calls.