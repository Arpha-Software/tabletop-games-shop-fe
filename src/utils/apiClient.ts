// src/utils/apiClient.ts
import { API_URL } from './constants';

type ApiPlainError = {
  name: 'ApiError';
  message: string;
  statusCode: number;
  data: any;
};

class ApiClient {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async _request<T>(
    endpoint: string,
    method: string,
    data?: any,
    customHeaders?: HeadersInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(customHeaders instanceof Headers
        ? Object.fromEntries(customHeaders.entries())
        : (customHeaders as Record<string, string>)),
    };

    const config: RequestInit = {
      method,
      headers,
      body: data != null ? JSON.stringify(data) : undefined,
      // ensures browser/server sends same-origin cookies if you ever need them
      credentials: 'include',
    };

    try {
      const res = await fetch(url, config);

      // Try to parse json only if content-type is json and body exists
      const contentType = res.headers.get('content-type') || '';
      const canJson = contentType.includes('application/json');
      const hasBody = res.status !== 204 && res.status !== 205;
      const parsed = hasBody
        ? (canJson ? await res.json().catch(() => null) : await res.text().catch(() => ''))
        : null;

      if (!res.ok) {
        const err: ApiPlainError = {
          name: 'ApiError',
          message: `API Error: ${res.statusText || 'Request failed'}`,
          statusCode: res.status,
          data: parsed,
        };
        throw err; // <- plain object, no instanceof headaches
      }

      // Successful
      return (parsed as T) ?? (undefined as unknown as T);
    } catch (e: any) {
      // If fetch threw (network), normalize to the same shape so callers can handle uniformly
      if (e?.name === 'ApiError' && typeof e?.statusCode === 'number') {
        throw e as ApiPlainError;
      }
      throw {
        name: 'ApiError',
        message: `Failed to connect to API: ${e?.message ?? String(e)}`,
        statusCode: 0,
        data: null,
      } satisfies ApiPlainError;
    }
  }

  get<T>(endpoint: string, customHeaders?: HeadersInit) {
    return this._request<T>(endpoint, 'GET', undefined, customHeaders);
  }
  post<T>(endpoint: string, data: any, customHeaders?: HeadersInit) {
    return this._request<T>(endpoint, 'POST', data, customHeaders);
  }
  put<T>(endpoint: string, data: any, customHeaders?: HeadersInit) {
    return this._request<T>(endpoint, 'PUT', data, customHeaders);
  }
  patch<T>(endpoint: string, data: any, customHeaders?: HeadersInit) {
    return this._request<T>(endpoint, 'PATCH', data, customHeaders);
  }
  delete<T>(endpoint: string, customHeaders?: HeadersInit) {
    return this._request<T>(endpoint, 'DELETE', undefined, customHeaders);
  }
}

export const apiClient = new ApiClient(API_URL);
