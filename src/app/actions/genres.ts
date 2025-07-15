// This code should be added to your client-side API file, e.g., src/lib/api.ts

// A helper function to safely get the token from localStorage on the client-side
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
};

// --- GENRE API FUNCTIONS ---

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

    // Assuming the backend returns the full data structure you had before
    const data = await response.json();
    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    console.error("Get All Genres Error:", error);
    // Return a default structure on error to prevent crashes
    return {
      success: false,
      errors: [error.message],
      data: { content: [] }, // Provide a default empty array for content
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

    // Return a simple success object
    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error("Create Genre Error:", error);
    // Propagate a simple error object for the UI to handle
    return {
      success: false,
      errors: [error.message],
    };
  }
};
