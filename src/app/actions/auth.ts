'use server';

import zod from 'zod';
import { redirect } from 'next/navigation';
import { apiClient } from '@/utils/apiClient';
import { TUser } from '@/utils/types';
import { clearSession, createSession, setAccessToken, setRefreshToken } from '../lib/session';
import { cookies } from 'next/headers';

const phoneNumberSchema = zod.string()
  .refine(value => /^\+380\d{9}$/.test(value), { message: 'Номер введено неправильно!' });


export const refreshAccessToken = async () => {
  try {
    const refreshToken = cookies().get('refreshToken')?.value;
    if (!refreshToken) {
      return { success: false, errors: ['Missing refresh token'] as string[] };
    }

    const resp = await apiClient.post<{
      accessToken: string;
      accessTokenExpirationDate?: number;
      refreshToken?: string;
      refreshTokenExpirationDate?: number;
    }>('/api/v1/auth/refresh', { refreshToken });

    // rotate cookies (server-side)
    const accessExp = resp.accessTokenExpirationDate ? new Date(resp.accessTokenExpirationDate) : undefined;
    await (await import('../lib/session')).setAccessToken(resp.accessToken, accessExp);
    if (resp.refreshToken) {
      const refreshExp = resp.refreshTokenExpirationDate ? new Date(resp.refreshTokenExpirationDate) : undefined;
      await (await import('../lib/session')).setRefreshToken(resp.refreshToken, refreshExp);
    }

    // <-- critical: pass the new token back to the caller to use immediately
    return { success: true, errors: [], data: { accessToken: resp.accessToken } };
  } catch (error: any) {
    const errs = error?.data?.errors || [error?.message || 'Refresh failed'];
    return { success: false, errors: errs };
  }
};

export async function verifyUser(phoneNumber: string) {
  try {
    const parsedPhoneNumber = phoneNumberSchema.safeParse(phoneNumber);
    const errors = parsedPhoneNumber.error?.errors[0].message;

    if (errors) {
      return { success: false, errors: [errors] };
    }

    await apiClient.post<void>('/api/v1/auth/verify-phone', { phoneNumber });

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error('Error verifying user phone number:', error);
    if (error) {
      return { success: false, errors: error.data?.errors || [error.message] };
    }
    return { success: false, errors: [error.message] };
  }
}

const codeSchema =
  zod.string()
    .refine(value => /^\d{6}$/.test(value), { message: 'Код повинен складатись із 6 символів!' });

export const verifyCode = async (code: string) => {
  try {
    const parsedCode = codeSchema.safeParse(code);
    const errors = parsedCode.error?.errors[0].message;

    if (errors) {
      return { success: false, errors: [errors] };
    }

    await apiClient.post<void>('/api/v1/auth/verify-code', { code });

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error('Error verifying code:', error);
    if (error) {
      return { success: false, errors: error.data?.errors || [error.message] };
    }
    return { success: false, errors: [error.message] };
  }
};

const userDataSchema =
  zod.object({
    name: zod.string().min(2, { message: "Ім'я: Мінімум 2 символи" }),
    surname: zod.string().min(2, { message: 'Прізвище: Мінімум 2 символи' }),
    email: zod.string().email({ message: 'Введіть коректний email' }),
    password: zod.string().min(6, { message: 'Пароль: Мінімум 6 символів' }),
    phoneNumber: phoneNumberSchema,
  });

export const registerUser = async (data: any) => {
  try {
    const parsedData = userDataSchema.safeParse(data);
    const errors = parsedData.error?.errors.map(error => error.message);

    if (errors) {
      return { success: false, errors };
    }

    const responseData = await apiClient.post<{ token: string, user: TUser }>('/api/v1/auth/register', data);

    // Set the token in an HttpOnly cookie after successful registration
    if (responseData.token && responseData.user) {
      await createSession(responseData.token);
    }

    return {
      success: true,
      errors: [],
      data: responseData,
    };
  } catch (error: any) {
    console.error('Error registering user:', error);
    if (error) {
      return { success: false, errors: error.data?.errors || [error.message] };
    }
    return { success: false, errors: [error.message] };
  }
};

export const signup = async ({
  accessToken,
  accessTokenExpirationDate,
  refreshToken,
  refreshTokenExpirationDate,
}: {
  accessToken: unknown;
  accessTokenExpirationDate?: number;
  refreshToken?: unknown;
  refreshTokenExpirationDate?: number;
}) => {
  const accessExp = accessTokenExpirationDate ? new Date(accessTokenExpirationDate) : undefined;
  const refreshExp = refreshTokenExpirationDate ? new Date(refreshTokenExpirationDate) : undefined;

  // createSession will validate types; if you want explicit checks here too:
  if (typeof accessToken !== 'string' && !(accessToken && typeof accessToken === 'object')) {
    throw new Error(`[signup] accessToken must be string/object`);
  }
  if (refreshToken && typeof refreshToken !== 'string' && !(refreshToken && typeof refreshToken === 'object')) {
    throw new Error(`[signup] refreshToken must be string/object`);
  }

  await createSession(accessToken as any, accessExp, refreshToken as any, refreshExp);
  return { success: true, data: { accessToken: 'set', accessTokenExpirationDate, refreshToken: !!refreshToken ? 'set' : undefined, refreshTokenExpirationDate } };
};

export const logout = async () => {
  await clearSession();
  return { success: true };
};

const tag = '[getCurrentUser]';

const decodeExp = (jwt?: string): number | undefined => {
  try {
    if (!jwt) return;
    const [, payload] = jwt.split('.');
    const json = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    return typeof json?.exp === 'number' ? json.exp : undefined; // seconds
  } catch {
    return;
  }
};

const needsRefresh = (jwt?: string, skewSec = 30) => {
  const exp = decodeExp(jwt);
  if (!exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return exp <= now + skewSec;
};

export const getCurrentUser = async () => {
  const callMe = (token: string) =>
    apiClient.get<TUser>('/api/v1/users/me', { Authorization: `Bearer ${token}` });

  try {
    let token = cookies().get('authToken')?.value;

    // Refresh-first if we don't have a token or it's expiring
    if (!token || needsRefresh(token)) {
      const r = await refreshAccessToken();
      if (!r.success || !r.data?.accessToken) {
        return { success: false, errors: r.errors ?? ['Refresh failed'], data: null };
      }
      token = r.data.accessToken;
    }

    try {
      const data = await callMe(token);
      return { success: true, errors: [], data };
    } catch (e: any) {
      // single 401 retry path
      if (e && e.statusCode === 401) {
        const r = await refreshAccessToken();
        if (!r.success || !r.data?.accessToken) {
          return { success: false, errors: r.errors ?? ['Refresh failed after 401'], data: null };
        }
        const fresh = r.data.accessToken;
        const data = await callMe(fresh);
        return { success: true, errors: [], data };
      }
      throw e;
    }
  } catch (error: any) {
    const msg = error?.data?.detail || error?.message || 'Unknown error';
    return { success: false, errors: [msg], data: null };
  }
};
