// tabletop-games-shop-fe/src/app/catalogue/CatalogueClientWrapper.tsx
'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    setCurrentClientFilters(initialFilters);
  }, [initialFilters]);


  const handleFiltersChange = (newFilterValues: Partial<FiltersProps['initialFilters']>) => {
    const updatedFilters = {
      ...currentClientFilters,
      ...newFilterValues,
    };
    setCurrentClientFilters(updatedFilters);

    const newSearchParams = filtersToSearchParams(updatedFilters);

    router.push(`/catalogue?${newSearchParams.toString()}`);
  };

  return (
    <>
      <div className='w-96 border-r px-16'>
        <Filters
          availableFilters={availableFilters}
          initialFilters={currentClientFilters}
          onFiltersChange={handleFiltersChange}
        />
      </div>
      <div className='flex-1'>
        <ProductList
          initialProducts={initialProducts}
          initialTotalPages={initialTotalPages}
          initialFilters={currentClientFilters}
        />
      </div>
    </>
  );
};
