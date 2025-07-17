import { useState, useCallback } from 'react';
import { handleApiError } from '@/utils/helpers';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useApi = (hookOptions: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('authToken');
  };

  const apiCall = useCallback(async (
    url: string, 
    fetchOptions: RequestInit = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const authToken = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Handle 401 errors by redirecting to login
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return null;
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
  }, []); // Remove hookOptions dependency

  return {
    apiCall,
    loading,
    error,
    setError,
  };
}; 