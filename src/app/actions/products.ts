'use server';

import { cookies } from "next/headers";

export const uploadProductImages = async (id: string, files: File[]) => {
  const authToken = cookies().get('authToken')?.value;
  console.log('IMAGES', files)
  // const body = {
  //   type: "image/png",
  //   fileSize: 1,
  //   targetId: id,
  //   targetType: "PRODUCT_MAIN_IMG",
  // }

  // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/files`, {
  //   method: 'POST',
  //   headers: {
  //     "Authorization": `Bearer ${authToken}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(body),
  // });

  // if (!response.ok) {
  //   return {
  //     success: false,
  //     errors: ['Failed to fetch'],
  //   };
  // }
}

export const createProduct = async (data: any) => {
  try {
    const { images, ...restBody } = data;

    const authToken = cookies().get('authToken')?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restBody),
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to fetch'],
      };
    }

    const responseBody = await response.json();

    console.log('response', responseBody);

    await uploadProductImages(responseBody.id, images);

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.log(error)
    return {
      success: false,
      errors: [error.message],
    };
  }
}

export const getAllProducts = async (page: number) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products?page=${page}`, {
      headers: {
        "Authorization": `Bearer ${authToken}`,
      }
    });
    console.log('rrrrr', response)
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products/${id}`, {
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
    console.log('data', data)
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
