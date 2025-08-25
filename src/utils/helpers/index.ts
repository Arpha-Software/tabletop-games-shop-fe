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

export function unwrapList<T>(data: unknown): T[] {
  const anyData = data as any;
  if (!anyData) return [];
  if (Array.isArray(anyData)) return anyData as T[];
  if (Array.isArray(anyData?.content)) return anyData.content as T[];
  return [];
}

export const parseRange = (s?: string): [number | '', number | ''] => {
  if (!s) return ['', ''];
  const m = s.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (!m) return ['', ''];
  return [Number(m[1]), Number(m[2])];
};

export const parseFirstInt = (s?: string): number | '' => {
  if (!s) return '';
  const m = s.match(/(\d+)/);
  return m ? Number(m[1]) : '';
};

export const parsePlaytime = (s?: string): [number | '', number | ''] => {
  if (!s) return ['', ''];
  const m = s.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (m) return [Number(m[1]), Number(m[2])];
  const single = s.match(/(\d+)/);
  return single ? [Number(single[1]), Number(single[1])] : ['', ''];
};
