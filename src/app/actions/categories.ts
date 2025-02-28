'use server';

import { cookies } from "next/headers";

export const getAllCategories = async () => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/categories`, {
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

export const createCategory = async (data: any) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/categories`, {
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
