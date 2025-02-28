'use client';

import { useSearchParams } from "next/navigation";

export const useQuery = (name: string) => {
  const searchParams = useSearchParams();
  const tabSelected = searchParams.get(name);

  return tabSelected;
}
