import { TCart, TCartItem } from "@/utils/types";

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
};

export const getCart = async (): Promise<{ success: boolean; data?: TCart; errors?: string[] }> => {
  try {
    const authToken = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/cart`, {
      headers,
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to fetch cart'],
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message],
    };
  }
};

export const addToCart = async (productId: number, quantity: number = 1): Promise<{ success: boolean; data?: TCart; errors?: string[] }> => {
  try {
    const authToken = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/cart/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to add item to cart'],
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message],
    };
  }
};

export const updateCartItem = async (itemId: number, quantity: number): Promise<{ success: boolean; data?: TCart; errors?: string[] }> => {
  try {
    const authToken = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/cart/update`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ itemId, quantity }),
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to update cart item'],
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message],
    };
  }
};

export const removeFromCart = async (itemId: number): Promise<{ success: boolean; data?: TCart; errors?: string[] }> => {
  try {
    const authToken = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/cart/remove`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ itemId }),
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to remove item from cart'],
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message],
    };
  }
};

export const clearCart = async (): Promise<{ success: boolean; errors?: string[] }> => {
  try {
    const authToken = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/cart/clear`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to clear cart'],
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message],
    };
  }
}; 