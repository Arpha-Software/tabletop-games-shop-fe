// src/hooks/useApi.ts
import { useState, useCallback } from 'react';
// Removed `handleApiError` import if no longer needed for direct redirects from this hook

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useApi = (hookOptions: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Remove getAuthToken function
  // const getAuthToken = (): string | null => { ... };

  const apiCall = useCallback(async (
    url: string,
    fetchOptions: RequestInit = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Remove authToken retrieval and manual header setting.
      // The browser will automatically send HttpOnly cookies with the fetch request.
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
      };

      const response = await fetch(url, {
        ...fetchOptions,
        headers, // Use existing headers, no manual auth token addition here
      });

      if (response.status === 401) {
        // Throw an error here that your RootLayout's ErrorBoundary or a UserContext can catch
        // and handle the redirect using useRouter.
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (hookOptions.onSuccess) {
        hookOptions.onSuccess(data);
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);

      if (hookOptions.onError) {
        hookOptions.onError(err);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    apiCall,
    loading,
    error,
    setError,
  };
};
