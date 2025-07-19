'use server';

import { cookies } from 'next/headers';
import { performTokenRefreshServer, logoutUserAndRedirectServer } from '@/app/actions/auth';

let refreshPromise: Promise<string | null> | null = null;

async function getNewAccessToken(): Promise<string | null> {
    const cookieStore = cookies();
    const refreshTokenValue = cookieStore.get('refreshToken')?.value;
    // console.log('apiClient.getNewAccessToken: Current refreshToken from cookies:', refreshTokenValue ? `Exists (ends with ...${refreshTokenValue.slice(-6)})` : 'MISSING');
    console.log('apiClient.getNewAccessToken: Current refreshToken from cookies:', refreshTokenValue ? 'Exists' : 'MISSING');


    if (!refreshTokenValue) {
        console.warn('apiClient.getNewAccessToken: No refresh token found. Initiating logout.');
        // No need to await logoutUserAndRedirectServer if we are just returning null
        // and letting the caller handle the unauthenticated state, but if it redirects,
        // the current execution might be moot.
        await logoutUserAndRedirectServer();
        return null;
    }

    if (refreshPromise) {
        console.log('apiClient.getNewAccessToken: Refresh already in progress, returning existing promise.');
        return refreshPromise;
    }

    console.log('apiClient.getNewAccessToken: Starting token refresh.');
    refreshPromise = performTokenRefreshServer(refreshTokenValue)
        .then(newAccessToken => {
            if (!newAccessToken) {
                console.warn('apiClient.getNewAccessToken: performTokenRefreshServer returned null (logout was likely handled by it).');
            } else {
                console.log('apiClient.getNewAccessToken: Token refresh successful, new accessToken obtained.');
            }
            return newAccessToken;
        })
        .catch(error => {
            console.error('apiClient.getNewAccessToken: Error in performTokenRefreshServer promise chain:', error);
            // performTokenRefreshServer should ideally handle its own logout on failure.
            // Calling logoutUserAndRedirectServer here could be a safety net if performTokenRefreshServer throws instead of returning null.
            // However, if performTokenRefreshServer always calls logout on failure and returns null, this might be redundant
            // and could cause issues if redirect is called multiple times.
            // For now, relying on performTokenRefreshServer to manage its own logout.
            return null;
        })
        .finally(() => {
            refreshPromise = null;
        });
    return refreshPromise;
}

export async function fetchWithAuth(
    url: string,
    options: RequestInit = {},
    isRetry: boolean = false
): Promise<Response> {
    const cookieStore = cookies();
    let accessToken = cookieStore.get('accessToken')?.value;
    // console.log(`fetchWithAuth: Requesting ${url}. AccessToken from cookies: ${accessToken ? `Exists (ends with ...${accessToken.slice(-6)})` : 'MISSING'}. isRetry: ${isRetry}`);
    console.log(`fetchWithAuth: Requesting ${url}. AccessToken from cookies: ${accessToken ? 'Exists' : 'MISSING'}. isRetry: ${isRetry}`);


    const headers = new Headers(options.headers);
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }
    if (options.body && typeof options.body === 'string' && !headers.has('Content-Type') && ['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase() || '')) {
        headers.set('Content-Type', 'application/json');
    }

    let response = await fetch(url, { ...options, headers });
    console.log(`fetchWithAuth: Initial response for ${url} - Status: ${response.status}`);

    if (response.status === 401 && !isRetry) {
        console.log(`fetchWithAuth: 401 Unauthorized for ${url}. Attempting token refresh.`);
        const newAccessToken = await getNewAccessToken(); // This might trigger logout if refresh token is bad or refresh fails

        if (newAccessToken) { // Only retry if we successfully got a new access token
            console.log(`fetchWithAuth: Retrying ${url} with new token.`);
            const newHeaders = new Headers(options.headers);
            newHeaders.set('Authorization', `Bearer ${newAccessToken}`);
            if (options.body && typeof options.body === 'string' && !newHeaders.has('Content-Type') && ['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase() || '')) {
                newHeaders.set('Content-Type', 'application/json');
            }
            // Retry the original request. Use direct fetch, not fetchWithAuth, to avoid isRetry confusion here.
            response = await fetch(url, { ...options, headers: newHeaders });
            console.log(`fetchWithAuth: Retry response for ${url} - Status: ${response.status}`);
            return response;
        } else {
            // newAccessToken is null. This means refresh failed AND logout was likely initiated.
            // The original 'response' (which was a 401) will be returned.
            // The calling function (e.g., getCurrentUser) needs to handle non-ok responses.
            console.warn(`fetchWithAuth: Token refresh failed for ${url}. Logout likely initiated. Returning original 401 response.`);
            return response; // Return the original 401 response
        }
    }
    return response;
}
