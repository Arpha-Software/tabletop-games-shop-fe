// IMPORTANT: Remove the 'use server'; directive. This file now contains client-side code.

// A helper function to get the token from localStorage on the client-side
const getAuthToken = (): string | null => {
  // Ensure this code only runs in the browser
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
};

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
};

export const getAllProducts = async (page: number) => {
  try {
    const authToken = getAuthToken();
    // Note: Your backend might need to handle unauthenticated requests gracefully
    
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