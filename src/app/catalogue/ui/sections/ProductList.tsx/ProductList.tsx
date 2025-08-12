'use client';

import { ProductCard } from '@/app/ui/components';
import { Pagination } from '@/app/ui/components/Pagination';
import { TProduct } from '@/utils/types';
import { filtersToSearchParams } from '@/utils/filterToSearchParams';
import { useSearchParams, useRouter } from 'next/navigation';

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

  // optional extras ignored here
  minPlayTimeRange?: string[];
  maxPlayTimeRange?: string[];
  bggRatingRange?: string[];
  complexityRange?: string[];
  componentsContains?: string[];
  rulesLinkContains?: string[];
  averageRatingRange?: string[];
  reviewCountRange?: string[];
  dimensionWidthRange?: string[];
  dimensionLengthRange?: string[];
  dimensionHeightRange?: string[];
  dimensionWeightRange?: string[];
  createdAtAfter?: string[];
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

  const handlePageChange = (page: number) => {
    const params = filtersToSearchParams({ ...initialFilters });
    params.set('page', String(page));
    router.push(`/catalogue?${params.toString()}`);
  };

  const products = initialProducts;
  const totalPages = initialTotalPages;

  if (products.length === 0) {
    return (
      <div className="relative w-full">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">Товари не знайдено</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="flex h-full flex-col justify-between">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-8">
          {products.map((item) => (
            <ProductCard key={item.id} item={item} className="w-full" />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center pb-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
};
