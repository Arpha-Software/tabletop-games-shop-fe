import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}

export const generateStaticClass = (prefix: string, value: number) => `${prefix}-${value}`;

export const handleAuthError = (error: any) => {
  if (error?.status === 401 || error?.statusCode === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }

    window.location.href = '/login';
    return true;
  }
  return false;
};

export const handleApiError = async (response: Response) => {
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }

    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
};
