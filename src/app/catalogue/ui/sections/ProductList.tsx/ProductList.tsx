// tabletop-games-shop-fe/src/app/catalogue/ui/sections/ProductList.tsx/ProductList.tsx
'use client';

import { ProductCard } from '@/app/ui/components';
import { Loader } from '@/app/ui/components/Loader';
import { Pagination } from '@/app/ui/components/Pagination';

import { useEffect, useState, useCallback } from 'react';
import { getAllProducts } from '@/app/actions/products';
import { TProduct } from '@/utils/types';

type TProps = {
  initialProducts: TProduct[];
  initialTotalPages: number;
  initialFilters: { // New prop to receive initial filter values
    minPrice: number;
    maxPrice: number;
    categoryIds: string[];
    genreIds: string[];
    productTypeIds: string[];
    searchQuery: string;
    sort: string;
  };
}

export const ProductList = ({ initialProducts, initialTotalPages, initialFilters }: TProps) => {
  // Initialize state with props for initial render
  const [products, setProducts] = useState<TProduct[]>(initialProducts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false); // Initial loading is false as data is provided
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // Start at page 0 for API

  // Function to fetch products based on current filters and page
  // This function will now be used for subsequent client-side fetches (pagination, filter changes)
  const fetchProducts = useCallback(async (page: number, currentFilters: typeof initialFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllProducts({ ...currentFilters, page });

      if (result.success && result.data) {
        setProducts(result.data.content);
        setTotalPages(result.data.totalPages);
      } else {
        console.error("Failed to fetch products:", result.errors);
        setError(result.errors.join(', ') || "Failed to load products.");
        setProducts([]);
        setTotalPages(0);
      }
    } catch (err: any) {
      console.error("Unexpected error fetching products:", err);
      setError(err.message || "An unexpected error occurred while fetching products.");
      setProducts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies on filters or authToken anymore, as filters are passed directly

  // Effect to trigger product fetch on filter changes (from parent) or page changes
  useEffect(() => {
    // When initialFilters change (meaning filters were updated in the parent Catalogue component),
    // we should re-fetch products from page 0 using the new filters.
    setCurrentPage(0);
    fetchProducts(0, initialFilters);
  }, [initialFilters, fetchProducts]); // Depend on initialFilters (which now represents the current filters from parent)

  // Handle page change from Pagination component
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchProducts(page, initialFilters); // Pass current initialFilters for the new page
  }, [fetchProducts, initialFilters]);

  return (
    <div className='relative w-full'>
      {(products.length === 0 && !loading && !error) && (
        <div className="flex items-center justify-center h-64">
          <p className='text-gray-500 text-lg'>Товари не знайдено</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-64">
          <p className='text-red-500 text-lg'>Помилка завантаження товарів: {error}</p>
        </div>
      )}

      {products.length > 0 && !loading && !error && (
        <div className='flex h-full flex-col justify-between'>
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-8'>
            {products.map((item, index) => (
              <ProductCard
                key={item.id || index}
                item={item}
                className="w-full"
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
