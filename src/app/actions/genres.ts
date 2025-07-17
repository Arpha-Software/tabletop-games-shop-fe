import { getAuthToken } from "@/utils/helpers";

export const getAllGenres = async () => {
  const authToken = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/genres`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }

    const data = await response.json();
    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    console.error("Get All Genres Error:", error);
    return {
      success: false,
      errors: [error.message],
      data: { content: [] },
    };
  }
};

export const createGenre = async (data: any) => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      throw new Error('You must be logged in to create a genre.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/genres`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create genre');
    }

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error("Create Genre Error:", error);
    return {
      success: false,
      errors: [error.message],
    };
  }
};
