'use server';

import zod from 'zod';

import { permanentRedirect, redirect } from 'next/navigation'
import { cookies } from 'next/headers';
import { createSession } from '../lib/session';

const phoneNumberSchema = zod.string()
  .refine(value => /^\+380\d{9}$/.test(value), { message: 'Номер введено неправильно!' })

export async function verifyUser(phoneNumber: string) {
  try {
    const parsedPhoneNumber = phoneNumberSchema.safeParse(phoneNumber);
    const errors = parsedPhoneNumber.error?.errors[0].message;

    if (errors) {
      return { success: false, errors: [errors] };
    }

    const response = await fetch('https://api.vercel.app/blog');

    if (!response.ok) {
      return { success: false, errors: ['Failed to fetch'] };
    }

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
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

    const response = await fetch('https://api.vercel.app/blog');

    if (!response.ok) {
      return { success: false, errors: ['Failed to fetch'] };
    }

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    return { success: false, errors: [error.message] };
  }
}

const userDataSchema =
  zod.object({
    name: zod.string().min(2, { message: "Ім'я: Мінімум 2 символи" }),
    surname: zod.string().min(2, { message: 'Прізвище: Мінімум 2 символи' }),
    email: zod.string().email({ message: 'Введіть коректний email' }),
  })

export const registerUser = async (data: any) => {
  try {
    const parsedData = userDataSchema.safeParse(data);
    const errors = parsedData.error?.errors.map(error => error.message);

    if (errors) {
      return { success: false, errors };
    }

    const response = await fetch('https://api.vercel.app/blog');

    if (!response.ok) {
      return { success: false, errors: ['Failed to fetch'] };
    }

    const authToken = `${data.email}:${data.name}`;
    const authTokenExpirationTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 100).getTime();

    const cookieStore = cookies();
    cookieStore.set({
      name: 'authToken',
      value: authToken,
      expires: authTokenExpirationTime,
      path: '/',
      httpOnly: true,
    });

    const cookieToken = cookieStore.get('authToken');

    if (cookieToken?.value) {
      return {
        success: true,
        errors: [],
      }
    }

    return { success: false, errors: ['Failed to set cookie'] };
  } catch (error: any) {
    return { success: false, errors: [error.message] };
  }
}

export const logout = () => {
  const cookieStore = cookies();

  cookieStore.set({
    name: 'authToken',
    value: '',
    expires: 0,
  });

  redirect('/login');
}

export const changeUserInfo = async (data: any) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/users/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { success: false, errors: ['Failed to fetch'] };
    }

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    return { success: false, errors: [error.message] };
  }
}

export async function signup({ accessToken, accessTokenExpirationDate }: any) {
  const expirationDate = new Date(accessTokenExpirationDate);
  await createSession(accessToken, expirationDate);

  redirect('/profile');
}

export const getCurrentUser = async () => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/users/me`, {
      headers: {
        "Authorization": `Bearer ${authToken}`,
      }
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to fetch'],
        data: null,
      };
    }

    const data = await response.json();

    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    return { success: false, errors: [error.message] };
  }
}
