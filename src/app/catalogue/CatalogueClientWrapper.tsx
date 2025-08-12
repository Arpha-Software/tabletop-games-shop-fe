// tabletop-games-shop-fe/src/app/catalogue/CatalogueClientWrapper.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Filters } from './ui/sections/Filters/Filters';
import { ProductList } from './ui/sections/ProductList.tsx';
import { TProduct } from '@/utils/types';
import { FiltersProps } from './ui/sections/Filters/Filters';
import { filtersToSearchParams } from '@/utils/filterToSearchParams';
import { AvailableFilters } from '../actions/products';

// This type definition must match `CatalogueFiltersForPage` in page.tsx
interface CatalogueClientWrapperProps {
  initialProducts: TProduct[];
  initialTotalPages: number;
  initialFilters: FiltersProps['initialFilters'] & {
    sort: string;
    searchQuery: string;
  };
  availableFilters: AvailableFilters;
}

export const CatalogueClientWrapper = ({
  initialProducts,
  initialTotalPages,
  initialFilters,
  availableFilters,
}: CatalogueClientWrapperProps) => {
  const router = useRouter();

  const [currentClientFilters, setCurrentClientFilters] = useState(initialFilters);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCurrentClientFilters(initialFilters);
  }, [initialFilters]);



  const handleFiltersChange = (newFilterValues: Partial<FiltersProps['initialFilters']>) => {
    const updated = { ...currentClientFilters, ...newFilterValues };
    setCurrentClientFilters(updated);
    const params = filtersToSearchParams(updated);
    startTransition(() => {
      router.push(`/catalogue?${params.toString()}`);
    });
  };

  return (
    <>
      {/* was: w-96 border-r px-16 */}
      <div className="w-full md:w-80 lg:w-96 border-r px-4 md:px-6 lg:px-8">
        <Filters
          availableFilters={availableFilters}
          initialFilters={currentClientFilters}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      <div className="flex-1">
        <ProductList
          initialProducts={initialProducts}
          initialTotalPages={initialTotalPages}
          initialFilters={currentClientFilters}
        />
      </div>
    </>
  );
};
