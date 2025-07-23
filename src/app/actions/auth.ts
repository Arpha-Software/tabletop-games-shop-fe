'use server';

import zod from 'zod';
import { redirect } from 'next/navigation';
import { apiClient, ApiError } from '@/utils/apiClient';
import { TUser } from '@/utils/types';
import { createSession } from '../lib/session';
import { cookies } from 'next/headers';

const phoneNumberSchema = zod.string()
  .refine(value => /^\+380\d{9}$/.test(value), { message: 'Номер введено неправильно!' });

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
    if (error instanceof ApiError) {
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
    if (error instanceof ApiError) {
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
    if (error instanceof ApiError) {
      return { success: false, errors: error.data?.errors || [error.message] };
    }
    return { success: false, errors: [error.message] };
  }
};

export const signup = async ({ accessToken, accessTokenExpirationDate }: { accessToken: string, accessTokenExpirationDate: number }) => {
  await createSession(accessToken, new Date(accessTokenExpirationDate));

  return {
    success: true,
    data: { accessToken, accessTokenExpirationDate }, // Still returning, but the primary mechanism is now cookie
  };
};

export const logout = async () => {
  cookies().delete('authToken'); // Clear the cookie when logging out
  redirect('/login');
};

export const getCurrentUser = async () => { // Removed authToken parameter
  try {
    const authToken = cookies().get('authToken')?.value; // Get token from cookie on the server

    if (!authToken) {
      return {
        success: false,
        errors: ['Authentication token not provided.'],
        data: null,
      };
    }

    const data = await apiClient.get<TUser>('/api/v1/users/me', {
      'Authorization': `Bearer ${authToken}`, // Pass token in Authorization header
    });

    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    if (error instanceof ApiError) {
      return {
        success: false,
        errors: error.data?.errors || [error.message],
        data: null,
      };
    }
    return { success: false, errors: [error.message], data: null };
  }
};
