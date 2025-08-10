// src/utils/helpers/index.ts
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}

export const generateStaticClass = (prefix: string, value: number) => `${prefix}-${value}`;

export const handleAuthError = (error: any) => {
  if (error?.status === 401 || error?.statusCode === 401) {
    throw new Error('Unauthorized');
  }
  return false;
};

export const handleApiError = async (response: Response) => {
  if (response.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const roundToTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;
