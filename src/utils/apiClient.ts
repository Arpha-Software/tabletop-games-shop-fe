// src/utils/apiClient.ts

import { API_URL } from './constants'; // Import the API_URL from your config

/**
 * Custom error class for API responses.
 * This allows for more specific error handling based on the API response.
 */
export class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * ApiClient class for centralizing API requests.
 * It handles base URL, authentication headers, and error parsing.
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async _request<T>(
    endpoint: string,
    method: string,
    data?: any,
    customHeaders?: HeadersInit // Now this is the primary way to pass auth token
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(customHeaders instanceof Headers
        ? Object.fromEntries(customHeaders.entries())
        : customHeaders as Record<string, string>),
    };

    // If using HttpOnly cookies, the browser/Next.js's server-side fetch will automatically send them.
    // Explicitly adding Authorization header here is only necessary if your backend
    // specifically expects it even with cookies, or if the token is passed by the caller.
    // Given your previous structure, it seems the backend might expect it.

    const config: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    try {
      const response = await fetch(url, config);

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        responseData = response.statusText || 'Unknown Error';
      }

      if (!response.ok) {
        throw new ApiError(
          `API Error: ${response.statusText || 'Request failed'}`,
          response.status,
          responseData
        );
      }

      console.log('Response OK (2xx status). Status:', response.status);
      return responseData as T;
    } catch (error) {
      console.log('error API CLIENT', error);
      if (error instanceof ApiError) {
        throw error;
      }
      console.error(`Network or unexpected error during ${method} ${url}:`, error);
      throw new Error(`Failed to connect to API: ${(error as Error).message}`);
    }
  }

  /**
   * Performs a GET request.
   * @param endpoint The API endpoint.
   * @param customHeaders Custom headers.
   * @returns A Promise with the response data.
   */
  get<T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> {
    return this._request<T>(endpoint, 'GET', undefined, customHeaders);
  }

  /**
   * Performs a POST request.
   * @param endpoint The API endpoint.
   * @param data The request body.
   * @param customHeaders Custom headers.
   * @returns A Promise with the response data.
   */
  post<T>(endpoint: string, data: any, customHeaders?: HeadersInit): Promise<T> {
    return this._request<T>(endpoint, 'POST', data, customHeaders);
  }

  /**
   * Performs a PUT request.
   * @param endpoint The API endpoint.
   * @param data The request body.
   * @param customHeaders Custom headers.
   * @returns A Promise with the response data.
   */
  put<T>(endpoint: string, data: any, customHeaders?: HeadersInit): Promise<T> {
    return this._request<T>(endpoint, 'PUT', data, customHeaders);
  }

  /**
   * Performs a PATCH request.
   * @param endpoint The API endpoint.
   * @param data The request body.
   * @param customHeaders Custom headers.
   * @returns A Promise with the response data.
   */
  patch<T>(endpoint: string, data: any, customHeaders?: HeadersInit): Promise<T> {
    return this._request<T>(endpoint, 'PATCH', data, customHeaders);
  }

  /**
   * Performs a DELETE request.
   * @param endpoint The API endpoint.
   * @param customHeaders Custom headers.
   * @returns A Promise with the response data.
   */
  delete<T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> {
    return this._request<T>(endpoint, 'DELETE', undefined, customHeaders);
  }
}

// Export a singleton instance of ApiClient
export const apiClient = new ApiClient(API_URL);
