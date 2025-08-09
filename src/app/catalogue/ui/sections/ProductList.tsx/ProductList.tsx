// /catalogue/ui/sections/ProductList/ProductList.tsx
// tabletop-games-shop-fe/src/app/catalogue/ui/sections/ProductList.tsx/ProductList.tsx
'use client';

import { ProductCard } from '@/app/ui/components';
import { Loader } from '@/app/ui/components/Loader';
import { Pagination } from '@/app/ui/components/Pagination';

import { useEffect, useState, useCallback } from 'react';
import { getAllProducts, ProductFilterRequestBody } from '@/app/actions/products'; // Import ProductFilterRequestBody
import { TProduct } from '@/utils/types';

// Updated ProductListFilters interface to match the new frontend filter structure
interface ProductListFilters {
  minPrice: number;
  maxPrice: number;
  categoryNames: string[];
  genreNames: string[];
  productTypeNames: string[];
  nameContains: string[];
  languages: string[];              // ⬅️ було 'language', робимо так само як в інших
  minPlayerNumberRange: string[];
  maxPlayerNumberRange: string[];
  minAgeRange: string[];
  publisherContains: string[];
  authorContains: string[];
  mechanics: string[];
  sort: string;
  searchQuery: string;

  // Якщо десь є інші, зроби їх опційними:
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
  initialFilters: ProductListFilters; // Use the updated interface
}

export const ProductList = ({ initialProducts, initialTotalPages, initialFilters }: TProps) => {
  const [products, setProducts] = useState<TProduct[]>(initialProducts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Helper for converting string[] to a single number (taking the first element if available and converting)
  const mapSingleNumber = (arr: string[] | undefined): number | undefined => {
    return arr && arr.length > 0 && !isNaN(Number(arr[0])) ? Number(arr[0]) : undefined;
  };
  
  // Helper for converting string[] to a single string (taking the first element if available)
  const mapSingleString = (arr: string[] | undefined): string | undefined => {
    return arr && arr.length > 0 ? arr[0] : undefined;
  };

  const fetchProducts = useCallback(async (page: number, currentFilters: ProductListFilters) => {
    setLoading(true);
    setError(null);
    try {
      // Map the ProductListFilters to ProductFilterRequestBody for the new POST endpoint
      const apiFiltersBody: ProductFilterRequestBody & { page?: number; size?: number; sort?: string; } = {
        page: page, // Pagination as query param
        size: 20, // Assuming default page size
        sort: currentFilters.sort, // Sort as query param
        
        name: currentFilters.searchQuery || undefined, // search query maps to 'name'
        minPrice: currentFilters.minPrice,
        maxPrice: currentFilters.maxPrice,
        minPlayers: mapSingleNumber(currentFilters.minPlayerNumberRange),
        maxPlayers: mapSingleNumber(currentFilters.maxPlayerNumberRange),
        minAge: mapSingleNumber(currentFilters.minAgeRange),
        categories: currentFilters.categoryNames.length > 0 ? currentFilters.categoryNames : undefined,
        genres: currentFilters.genreNames.length > 0 ? currentFilters.genreNames : undefined,
        mechanics: currentFilters.mechanics.length > 0 ? currentFilters.mechanics : undefined,
        author: mapSingleString(currentFilters.authorContains),
        publisher: mapSingleString(currentFilters.publisherContains),
        // The new API endpoint does not include 'language' in the request body.
        // It is provided in the available filters, but not for filtering in the POST request.
      };

      const result = await getAllProducts(apiFiltersBody);

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
  }, []);

  useEffect(() => {
    setProducts(initialProducts);
    setTotalPages(initialTotalPages);
    setCurrentPage(0); // Reset to first page on filter change
    fetchProducts(0, initialFilters);
  }, [initialFilters, fetchProducts, initialProducts, initialTotalPages]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchProducts(page, initialFilters);
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
