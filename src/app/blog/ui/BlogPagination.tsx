'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '@/app/ui/components/Pagination';

export const BlogPagination = ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set('page', String(page));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 p-3">
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
};
