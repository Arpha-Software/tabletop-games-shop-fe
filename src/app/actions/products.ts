import { getAuthToken } from "@/utils/helpers";

export const createProduct = async (productData: any) => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      return { success: false, errors: ['Authentication token not found.'] };
    }

    const response: Response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        errors: errorData.errors || ['Failed to create product'],
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      errors: [],
      data: responseData,
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message],
    };
  }
};

export const getAllProducts = async (page: number, sort: string = "id,asc") => {
  try {
    const authToken = getAuthToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products?page=${page}&sort=${sort}`, {
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

export const getProductsRecommendations = async (page: number) => {
  try {
    const authToken = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products/recommendations?page=${page}`, {
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

export const deleteProduct = async (id: number) => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      return { success: false, errors: ['Authentication token not found.'] };
    }

    const response: Response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products/${id}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { errors: [`${response.status}: ${response.statusText}`] }
        }
        return {
            success: false,
            errors: errorData.errors || ['Failed to delete product'],
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
