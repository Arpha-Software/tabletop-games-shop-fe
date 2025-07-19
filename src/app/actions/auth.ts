// src/app/actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchWithAuth } from '@/app/lib/apiClient';
import { TUser } from '@/utils/types'; // Ensure TUser is correctly defined/imported
import zod from 'zod';

// Schemas
const phoneNumberSchema = zod.string().refine(value => /^\+380\d{9}$/.test(value), { message: 'Номер введено неправильно!' });
const codeSchema = zod.string().refine(value => /^\d{6}$/.test(value), { message: 'Код повинен складатись із 6 символів!' });
const userRegistrationDataSchema = zod.object({
    name: zod.string().min(2, { message: "Ім'я: Мінімум 2 символи" }),
    surname: zod.string().min(2, { message: 'Прізвище: Мінімум 2 символи' }),
    email: zod.string().email({ message: 'Введіть коректний email' }),
});

// --- ADD THESE FUNCTIONS BACK AND ENSURE THEY ARE EXPORTED ---
export async function verifyUser(phoneNumber: string): Promise<{ success: boolean; errors: string[] }> {
  'use server';
  console.log(`auth.ts: verifyUser called with ${phoneNumber}`);
  const parsedPhoneNumber = phoneNumberSchema.safeParse(phoneNumber);
  if (!parsedPhoneNumber.success) {
    return { success: false, errors: [parsedPhoneNumber.error.errors[0].message] };
  }
  // TODO: Replace with actual API call to your backend if this flow is used for non-OAuth login
  // For now, simulating success:
  return { success: true, errors: [] };
}

export async function verifyCode(code: string /*, phoneNumber?: string */): Promise<{ success: boolean; errors: string[]; }> {
  'use server';
  console.log(`auth.ts: verifyCode called with ${code}`);
  const parsedCode = codeSchema.safeParse(code);
  if (!parsedCode.success) {
    return { success: false, errors: [parsedCode.error.errors[0].message] };
  }
  // TODO: Replace with actual API call for non-OAuth login
  // For now, simulating success:
  return { success: true, errors: [] };
}
// --- END OF ADDED/RESTORED FUNCTIONS ---

export async function performTokenRefreshServer(refreshTokenValue: string): Promise<string | null> {
    try {
        console.log('performTokenRefreshServer: Attempting to refresh token.');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: refreshTokenValue }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Refresh API call failed and could not parse error JSON.' }));
            console.error('performTokenRefreshServer: Token refresh API call failed.', response.status, errorData.message);
            await logoutUserAndRedirectServer(); // This will throw redirect, stopping execution
            return null; // Should not be reached if redirect works
        }

        const data = await response.json();
        const cookieStore = cookies();
        const commonCookieOptions = {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as 'lax' | 'strict' | 'none' | undefined,
        };

        if (data.accessToken && data.accessToken.token && data.accessToken.expires) {
            cookieStore.set('accessToken', data.accessToken.token, { ...commonCookieOptions, expires: new Date(data.accessToken.expires) });
            if (data.refreshToken && data.refreshToken.token && data.refreshToken.expires) {
                cookieStore.set('refreshToken', data.refreshToken.token, { ...commonCookieOptions, expires: new Date(data.refreshToken.expires) });
                console.log('performTokenRefreshServer: Both access and new refresh tokens updated.');
            } else {
                console.warn('performTokenRefreshServer: Access token updated, but new refresh token was not provided in response.');
            }
            return data.accessToken.token;
        } else {
            console.error('performTokenRefreshServer: New access token not found in refresh response. Logging out.');
            await logoutUserAndRedirectServer(); // This will throw redirect
            return null; // Should not be reached
        }
    } catch (error: any) {
        console.error('performTokenRefreshServer: Exception during token refresh. Logging out.', error.message, error.stack);
        // Check if error is due to redirect, if so, rethrow, otherwise logout
        if (error.message === 'NEXT_REDIRECT') { // Or however Next.js redirect errors are identified
            throw error;
        }
        await logoutUserAndRedirectServer(); // This will throw redirect
        return null; // Should not be reached
    }
}

export async function logoutUserAndRedirectServer() {
    const cookieStore = cookies();
    console.log('logoutUserAndRedirectServer: Clearing tokens and redirecting to /login.');
    // Set cookies to expire immediately
    const expiryOption = { expires: new Date(0), path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as 'lax' | 'strict' | 'none' | undefined };
    cookieStore.set('accessToken', '', expiryOption);
    cookieStore.set('refreshToken', '', expiryOption);
    redirect('/login'); // This throws a special error that Next.js handles to perform the redirect
}

export async function logout() {
    await logoutUserAndRedirectServer();
}

export const getCurrentUser = async (): Promise<{ success: boolean; errors: string[]; data: TUser | null }> => {
    console.log("getCurrentUser: Attempting to fetch current user.");
    try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/users/me`);
        console.log(`getCurrentUser: Response from fetchWithAuth - Status: ${response.status}, Ok: ${response.ok}`);

        if (!response.ok) {
            let errorMsg = `getCurrentUser: Failed to fetch. Status: ${response.status} from ${response.url}`;
            let responseText = "";
            try {
                // It's crucial to attempt to read the body text first if it might not be JSON
                responseText = await response.text();
                // Now, try to parse it as JSON. If it fails, we have the text.
                const errorBody = JSON.parse(responseText);
                errorMsg = errorBody.message || JSON.stringify(errorBody) || errorMsg;
            } catch (e) {
                // JSON.parse failed, meaning it was likely HTML or other non-JSON content
                console.warn(`getCurrentUser: Received non-JSON error response (status ${response.status}). Body snippet: ${responseText.substring(0, 200)}`);
                errorMsg += `. Response body was not JSON. Snippet: ${responseText.substring(0,100)}`;
            }
            return { success: false, errors: [errorMsg], data: null };
        }

        // Only attempt .json() if response.ok was true
        const data = await response.json();
        console.log("getCurrentUser: Successfully fetched and parsed user data.");
        return { success: true, errors: [], data };

    } catch (error: any) {
        console.error("getCurrentUser: Exception during fetch or JSON parse:", error.message, error.stack);
        if (error.message === 'NEXT_REDIRECT') throw error; // Rethrow redirect errors
        return { success: false, errors: [error.message || 'An unexpected error occurred while fetching user.'], data: null };
    }
};

export const registerUser = async (data: { name: string, surname: string, email: string }) => {
    'use server';
    try {
        const parsedData = userRegistrationDataSchema.safeParse(data);
        if (!parsedData.success) {
            return { success: false, errors: parsedData.error.errors.map(e => e.message) };
        }
        
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsedData.data),
        });

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.json().catch(() => ({ message: "Registration failed and could not parse error" }));
            return { success: false, errors: [errorBody.message || `HTTP Error: ${apiResponse.status}`] };
        }
        const tokenData = await apiResponse.json();

        const cookieStore = cookies();
        const commonCookieOptions = {
            path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as 'lax' | 'strict' | 'none' | undefined,
        };

        if (tokenData.accessToken && tokenData.accessToken.token && tokenData.accessToken.expires) {
            cookieStore.set('accessToken', tokenData.accessToken.token, { ...commonCookieOptions, expires: new Date(tokenData.accessToken.expires) });
        }
        if (tokenData.refreshToken && tokenData.refreshToken.token && tokenData.refreshToken.expires) {
            cookieStore.set('refreshToken', tokenData.refreshToken.token, { ...commonCookieOptions, expires: new Date(tokenData.refreshToken.expires) });
        }
        
        redirect('/');
    } catch (error: any) {
        console.error("Error in registerUser:", error);
        if (error.message === 'NEXT_REDIRECT') throw error;
        return { success: false, errors: [error.message || 'An unexpected error occurred during registration.'] };
    }
};

export async function changeUserInfo(data: Partial<TUser> & { id: string | number }) {
    try {
        const { id, ...payload } = data;
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: 'Failed to update user info' }));
            return { success: false, errors: [errorBody.message || `HTTP error ${response.status}`] };
        }
        const updatedUser = await response.json();
        return { success: true, errors: [], data: updatedUser };
    } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') throw error;
        return { success: false, errors: [error.message || 'An unexpected error occurred'] };
    }
};

export async function signup() { // This is called from the old UserComponent.tsx (if still used) or directly.
  redirect('/profile');
}