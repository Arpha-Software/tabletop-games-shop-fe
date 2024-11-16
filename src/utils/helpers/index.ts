import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}

export const generateStaticClass = (prefix: string, value: number) => `${prefix}-${value}`;
