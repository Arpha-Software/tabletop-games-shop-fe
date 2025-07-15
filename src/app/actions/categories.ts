// This code should be added to your client-side API file, e.g., src/lib/api.ts

// A helper function to safely get the token from localStorage on the client-side
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
};

// --- CATEGORY API FUNCTIONS ---

export const getAllCategories = async () => {
  const authToken = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/categories`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    console.error("Get All Categories Error:", error);
    return {
      success: false,
      errors: [error.message],
      data: { content: [] }, // Provide a default empty array
    };
  }
};

export const createCategory = async (data: any) => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      throw new Error('You must be logged in to create a category.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/categories`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create category');
    }

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error("Create Category Error:", error);
    return {
      success: false,
      errors: [error.message],
    };
  }
};
