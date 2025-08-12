// src/app/catalogue/ui/sections/ProductList.tsx/ProductList.tsx
'use client';

import { ProductCard } from '@/app/ui/components';
import { Pagination } from '@/app/ui/components/Pagination';
import { TProduct } from '@/utils/types';
import { filtersToSearchParams } from '@/utils/filterToSearchParams';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface ProductListFilters {
  minPrice: number;
  maxPrice: number;
  categoryNames: string[];
  genreNames: string[];
  productTypeNames: string[];
  nameContains: string[];
  languages: string[];
  minPlayerNumberRange: string[];
  maxPlayerNumberRange: string[];
  minAgeRange: string[];
  publisherContains: string[];
  authorContains: string[];
  mechanics: string[];
  sort: string;
  searchQuery: string;
  // optional extras ignored here...
}

type TProps = {
  initialProducts: TProduct[];
  initialTotalPages: number;
  initialFilters: ProductListFilters;
};

export const ProductList = ({ initialProducts, initialTotalPages, initialFilters }: TProps) => {
  const router = useRouter();
  const sp = useSearchParams();
  const currentPage = Number(sp.get('page') ?? '0');
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    const params = filtersToSearchParams({ ...initialFilters });
    params.set('page', String(page));
    startTransition(() => {
      router.push(`/catalogue?${params.toString()}`);
    });
  };

  const products = initialProducts;
  const totalPages = initialTotalPages;

  return (
    <div className="relative w-full">
      {/* subtle overlay while route is pending (works together with loading.tsx) */}
      {isPending && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px]" />
      )}

      {products.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">Товари не знайдено</p>
        </div>
      ) : (
        <>
          <div
            className="
              grid
              grid-cols-1
              xs:grid-cols-2
              sm:grid-cols-2
              md:grid-cols-3
              xl:grid-cols-4
              2xl:grid-cols-5
              gap-4 sm:gap-5 lg:gap-6
              px-4 sm:px-6 lg:px-8
            "
            aria-busy={isPending}
          >
            {products.map((item) => (
              <ProductCard key={item.id} item={item} className="w-full" />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center py-6 lg:py-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
