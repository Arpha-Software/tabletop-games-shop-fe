import { API_URL } from './constants';

type ApiPlainError = {
  name: 'ApiError';
  message: string;
  statusCode: number;
  data: any;
};

type ExtraInit = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

type RequestOptions = {
  cacheTtlMs?: number;      // how long to keep result in memory
  dedupe?: boolean;         // dedupe concurrent identical requests
  cacheKeyExtras?: string;  // extra salt for key
};

// --- Simple in-memory request cache + inflight dedupe ---
const memCache = new Map<string, { expiry: number; data: any }>();
const inflight = new Map<string, Promise<any>>();

const now = () => Date.now();
const toKey = (
  url: string,
  method: string,
  headers: HeadersInit | undefined,
  body: any,
  extras?: string
) => {
  const h =
    headers instanceof Headers
      ? Object.fromEntries(headers.entries())
      : (headers as Record<string, string>) || {};
  const auth = (h?.Authorization || h?.authorization || '').toString();
  const bodyStr = body == null ? '' : (typeof body === 'string' ? body : JSON.stringify(body));
  return `${method}|${url}|auth:${auth}|body:${bodyStr}|${extras || ''}`;
};

class ApiClient {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private defaultsFor(endpoint: string, method: string): RequestOptions {
    // Sensible defaults
    if (method === 'GET') {
      // cache GETs; categories, filters, etc. benefit a lot
      return { cacheTtlMs: 2 * 60_000, dedupe: true };
    }
    if (method === 'POST' && endpoint.includes('/api/v1/products/filter')) {
      // dedupe concurrent product list fetches; no TTL cache for POST
      return { cacheTtlMs: 0, dedupe: true };
    }
    if (method === 'GET' && endpoint.includes('/api/v1/products/recommendations')) {
      return { cacheTtlMs: 60_000, dedupe: true };
    }
    return { cacheTtlMs: 0, dedupe: true };
  }

  private async _request<T>(
    endpoint: string,
    method: string,
    data?: any,
    customHeaders?: HeadersInit,
    opts?: RequestOptions,
    extraInit?: ExtraInit
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
      credentials: 'include',
      ...(extraInit || {}),
    };

    const effective = { ...this.defaultsFor(endpoint, method), ...(opts || {}) };

    // Cache/Dedupe key
    const key = toKey(url, method, headers, data, effective.cacheKeyExtras);

    // Return cached (if valid)
    if (effective.cacheTtlMs && effective.cacheTtlMs > 0) {
      const hit = memCache.get(key);
      if (hit && hit.expiry > now()) {
        return hit.data as T;
      }
    }

    // Dedupe concurrent identical calls
    if (effective.dedupe && inflight.has(key)) {
      return inflight.get(key) as Promise<T>;
    }

    const p = (async () => {
      try {
        const res = await fetch(url, config);

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
          throw err;
        }

        // cache successful GETs (and any method that opted in)
        if (effective.cacheTtlMs && effective.cacheTtlMs > 0) {
          memCache.set(key, { expiry: now() + effective.cacheTtlMs, data: parsed });
        }

        return (parsed as T) ?? (undefined as unknown as T);
      } catch (e: any) {
        if (e?.name === 'ApiError' && typeof e?.statusCode === 'number') throw e as ApiPlainError;
        throw {
          name: 'ApiError',
          message: `Failed to connect to API: ${e?.message ?? String(e)}`,
          statusCode: 0,
          data: null,
        } satisfies ApiPlainError;
      } finally {
        // remove inflight entry
        if (inflight.get(key)) inflight.delete(key);
      }
    })();

    if (effective.dedupe) inflight.set(key, p);
    return p;
  }

  get<T>(endpoint: string, customHeaders?: HeadersInit, opts?: RequestOptions, extraInit?: ExtraInit) {
    return this._request<T>(endpoint, 'GET', undefined, customHeaders, opts, extraInit);
  }
  post<T>(endpoint: string, data: any, customHeaders?: HeadersInit, opts?: RequestOptions, extraInit?: ExtraInit) {
    return this._request<T>(endpoint, 'POST', data, customHeaders, opts, extraInit);
  }
  put<T>(endpoint: string, data: any, customHeaders?: HeadersInit, opts?: RequestOptions, extraInit?: ExtraInit) {
    return this._request<T>(endpoint, 'PUT', data, customHeaders, opts, extraInit);
  }
  patch<T>(endpoint: string, data: any, customHeaders?: HeadersInit, opts?: RequestOptions, extraInit?: ExtraInit) {
    return this._request<T>(endpoint, 'PATCH', data, customHeaders, opts, extraInit);
  }
  delete<T>(endpoint: string, customHeaders?: HeadersInit, opts?: RequestOptions, extraInit?: ExtraInit) {
    return this._request<T>(endpoint, 'DELETE', undefined, customHeaders, opts, extraInit);
  }
}

export const apiClient = new ApiClient(API_URL);
