import { getAuthToken } from "@/utils/helpers";

export const createProduct = async (data: any) => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      return { success: false, errors: ['Authentication token not found.'] };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        return {
            success: false,
            errors: errorData.errors || ['Failed to create product'],
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
    };
  }
};

export const getAllProducts = async (page: number) => {
  try {
    const authToken = getAuthToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products?page=${page}`, {
        headers,
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to fetch products'],
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
};

export const getProductById = async (id: string) => {
  try {
    const authToken = getAuthToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products/${id}`, {
        headers,
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to fetch product'],
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
};
