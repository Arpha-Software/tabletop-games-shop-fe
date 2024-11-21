'use server';

import { cookies } from "next/headers";

export const createProduct = async (data: any) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/products`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to fetch'],
      };
    }

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message],
    };
  }
}

export const getAllProducts = async (page: number) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/products?page=${page}`, {
      headers: {
        "Authorization": `Bearer ${authToken}`,
      }
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to fetch'],
        data: null,
      };
    }

    const data = await response.json();

    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message],
      data: null,
    };
  }
}

export const getProductById = async (id: string) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/products/${id}`, {
      headers: {
        "Authorization": `Bearer ${authToken}`,
      }
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to fetch'],
        data: null,
      };
    }

    const data = await response.json();

    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message],
      data: null,
    };
  }
}
