import { getAuthToken } from "@/utils/helpers";

export const getAllProductTypes = async () => {
  const authToken = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/product-types`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product types');
    }

    const data = await response.json();
    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    console.error("Get All Product Types Error:", error);
    return {
      success: false,
      errors: [error.message],
      data: { content: [] },
    };
  }
};

export const createProductType = async (data: any) => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      throw new Error('You must be logged in to create a product type.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/product-types`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product type');
    }

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error("Create Product Type Error:", error);
    return {
      success: false,
      errors: [error.message],
    };
  }
}; 