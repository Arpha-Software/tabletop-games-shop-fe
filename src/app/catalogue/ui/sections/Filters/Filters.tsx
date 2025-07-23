// tabletop-games-shop-fe/src/app/catalogue/ui/sections/Filters/Filters.tsx
'use client';

import { useEffect, useState } from 'react';
import { PriceFilter } from '../../components/PriceFilter';
import { CheckboxFilter } from '../../components/CheckboxFilter';
// Removed imports for getAllCategories, getAllGenres, getAllProductTypes
import { TCategory, TGenre, TProductType } from '@/utils/types';
import { Text } from '@/utils/ui/Text';

interface FiltersProps {
  initialCategories: TCategory[];
  initialGenres: TGenre[];
  initialProductTypes: TProductType[];
  initialFilters: { // New prop to receive initial filter values
    minPrice: number;
    maxPrice: number;
    categoryIds: string[];
    genreIds: string[];
    productTypeIds: string[];
  };
}

export const Filters = ({ initialCategories, initialGenres, initialProductTypes, initialFilters }: FiltersProps) => {
  // Initialize state with props, no longer fetching here
  const [categories, setCategories] = useState<TCategory[]>(initialCategories);
  const [genres, setGenres] = useState<TGenre[]>(initialGenres);
  const [productTypes, setProductTypes] = useState<TProductType[]>(initialProductTypes);

  // Manage filter state internally, initialized from initialFilters prop
  const [filters, setFilters] = useState(initialFilters);

  // Removed loading and error states for initial fetch as it's done server-side
  // const [loadingFilters, setLoadingFilters] = useState(true);
  // const [filterError, setFilterError] = useState<string | null>(null);

  // Removed useEffect for fetching filter options
  /*
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoadingFilters(true);
      setFilterError(null);
      try {
        const [categoriesResult, genresResult, productTypesResult] = await Promise.all([
          getAllCategories(),
          getAllGenres(),
          getAllProductTypes(),
        ]);

        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data);
        } else {
          console.error("Failed to load categories for filter:", categoriesResult.errors);
          setFilterError(prev => (prev ? prev + ", Categories failed" : "Categories failed"));
        }

        if (genresResult.success && genresResult.data) {
          setGenres(genresResult.data);
        } else {
          console.error("Failed to load genres for filter:", genresResult.errors);
          setFilterError(prev => (prev ? prev + ", Genres failed" : "Genres failed"));
        }

        if (productTypesResult.success && productTypesResult.data) {
          setProductTypes(productTypesResult.data);
        } else {
          console.error("Failed to load product types for filter:", productTypesResult.errors);
          setFilterError(prev => (prev ? prev + ", Product types failed" : "Product types failed"));
        }
        console.log('GENREEEEES', genresResult)
      } catch (err: any) {
        console.error("Error fetching filter options:", err);
        setFilterError(err.message || "An unexpected error occurred while fetching filter options.");
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchFilterOptions();
  }, []);
  */

  // Callback to update filter state and propagate changes (e.g., to ProductList)
  // This will be handled by the parent Catalogue page's useState and useCallback
  // For now, we'll keep the internal state and assume the parent will handle the propagation.
  const handleFilterChange = (newFilterValues: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilterValues,
    }));
    // TODO: Propagate this change up to the parent Catalogue component
    // The parent Catalogue component will then re-render ProductList with new filters
    // and potentially update URL search params.
  };


  // Map fetched data to the format expected by CheckboxFilter, converting id to string
  const categoryOptions = categories.map(cat => ({ id: String(cat.id), value: cat.name }));
  const genreOptions = genres.map(gen => ({ id: String(gen.id), value: gen.name }));
  const productTypeOptions = productTypes.map(type => ({ id: String(type.id), value: type.name }));

  // Removed loading/error rendering for initial filters as it's handled server-side
  // If there are no initial options, it means the server fetch failed or returned empty.
  if (categories.length === 0 && genres.length === 0 && productTypes.length === 0) {
    return (
      <div className="mt-10 divide-y">
        <Text.Paragraph className="text-center text-red-500 py-4">Не вдалося завантажити опції фільтрів.</Text.Paragraph>
      </div>
    );
  }

  return (
    <div className='mt-10 divide-y'>
      <PriceFilter
        min={0}
        max={20000}
        className='mb-8'
        minVal={filters.minPrice}
        maxVal={filters.maxPrice}
        onMinChange={(val) => handleFilterChange({ minPrice: val })}
        onMaxChange={(val) => handleFilterChange({ maxPrice: val })}
      />

      <CheckboxFilter
        title='Категорія'
        options={categoryOptions}
        chosenValue={filters.categoryIds}
        onChange={(selectedIds) => handleFilterChange({ categoryIds: selectedIds })}
        isOpenDefault
      />

      <CheckboxFilter
        title='Жанр'
        options={genreOptions}
        chosenValue={filters.genreIds}
        onChange={(selectedIds) => handleFilterChange({ genreIds: selectedIds })}
      />

      <CheckboxFilter
        title='Тип Продукту'
        options={productTypeOptions}
        chosenValue={filters.productTypeIds}
        onChange={(selectedIds) => handleFilterChange({ productTypeIds: selectedIds })}
      />
    </div>
  );
};
