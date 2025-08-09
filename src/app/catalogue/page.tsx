// /catalogue/page.tsx
// tabletop-games-shop-fe/src/app/catalogue/page.tsx

import { UGonnaNeed } from "../ui/sections/UGonnaNeed";
import { SectionHeader } from "./ui/sections/Header";
import { Container } from "../ui/components";
import { CatalogueClientWrapper } from './CatalogueClientWrapper';

// Import server actions for data fetching
import { getAllProducts, ProductFilterRequestBody, getAvailableFilters, AvailableFilters } from '@/app/actions/products';
import { TProduct } from '@/utils/types';
import { FiltersProps } from './ui/sections/Filters/Filters';

// Define the type for filter state on the page, reflecting frontend UI structure + sort/search
type CatalogueFiltersForPage = FiltersProps['initialFilters'] & {
  sort: string;
  searchQuery: string;
};

// Helper function to safely get a string array from searchParams, explicitly for string/number values in array format
const getSearchParamsAsArray = (param: string | string[] | undefined): string[] => {
  if (Array.isArray(param)) {
    return param.map(String);
  }
  if (typeof param === 'string' && param !== '') {
    return [param];
  }
  return [];
};

// Helper for converting string[] to a single number (taking the first element if available and converting)
const mapSingleNumber = (arr: string[] | undefined): number | undefined => {
  return arr && arr.length > 0 && !isNaN(Number(arr[0])) ? Number(arr[0]) : undefined;
};

export default async function Catalogue({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Initialize filter state from search params for server-side initial fetch
  // This object now only includes filters supported by the new API
  const initialFrontendFilters: CatalogueFiltersForPage = {
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : 0,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : 20000,
    categoryNames: getSearchParamsAsArray(searchParams['categoryNames']),
    genreNames: getSearchParamsAsArray(searchParams['genreNames']),
    productTypeNames: getSearchParamsAsArray(searchParams['productTypeNames']),
    nameContains: getSearchParamsAsArray(searchParams['nameContains']),
    minPlayerNumberRange: getSearchParamsAsArray(searchParams['minPlayerNumberRange']),
    maxPlayerNumberRange: getSearchParamsAsArray(searchParams['maxPlayerNumberRange']),
    minAgeRange: getSearchParamsAsArray(searchParams['minAgeRange']),
    publisherContains: getSearchParamsAsArray(searchParams['publisherContains']),
    authorContains: getSearchParamsAsArray(searchParams['authorContains']),
    mechanics: getSearchParamsAsArray(searchParams['mechanics']),
    languages: getSearchParamsAsArray(searchParams['languages']), // ⬅️ ДОДАНО
    sort: searchParams.sort ? String(searchParams.sort) : "id,asc",
    searchQuery: searchParams.searchQuery ? String(searchParams.searchQuery) : "",
  };

  // Map the frontend filters to the new backend API filter request body format
  const productFetchFilters: ProductFilterRequestBody & { page?: number; size?: number; sort?: string; } = {
    page: searchParams.page ? Number(searchParams.page) : 0,
    size: 20, // Assuming a default page size for initial load
    sort: initialFrontendFilters.sort,
    name: initialFrontendFilters.searchQuery || undefined, // Use searchQuery for 'name' filter
    minPrice: initialFrontendFilters.minPrice,
    maxPrice: initialFrontendFilters.maxPrice,
    minPlayers: mapSingleNumber(initialFrontendFilters.minPlayerNumberRange),
    maxPlayers: mapSingleNumber(initialFrontendFilters.maxPlayerNumberRange),
    minAge: mapSingleNumber(initialFrontendFilters.minAgeRange),
    categories: initialFrontendFilters.categoryNames.length > 0 ? initialFrontendFilters.categoryNames : undefined,
    genres: initialFrontendFilters.genreNames.length > 0 ? initialFrontendFilters.genreNames : undefined,
    mechanics: initialFrontendFilters.mechanics.length > 0 ? initialFrontendFilters.mechanics : undefined,
    author: initialFrontendFilters.authorContains.length > 0 ? initialFrontendFilters.authorContains[0] : undefined,
    publisher: initialFrontendFilters.publisherContains.length > 0 ? initialFrontendFilters.publisherContains[0] : undefined,
  };


  // Fetch all necessary data on the server
  const [availableFiltersResult, productsResult] = await Promise.all([
    getAvailableFilters(), // Call the new getAvailableFilters action
    getAllProducts(productFetchFilters), // Pass the new filter body
  ]);

  const availableFilters: AvailableFilters = availableFiltersResult.success && availableFiltersResult.data
    ? availableFiltersResult.data
    : {
        categories: [],
        genres: [],
        languages: [],
        mechanics: [],
        publishers: [],
        authors: [],
        minPlayers: 0,
        maxPlayers: 0,
        minAge: 0,
        priceRange: { min: 0, max: 20000 },
      };

  const initialProducts: TProduct[] = productsResult.success && productsResult.data ? productsResult.data.content : [];
  const initialTotalPages: number = productsResult.success && productsResult.data ? productsResult.data.totalPages : 0;

  if (!availableFiltersResult.success) console.error("Server fetch error (Available Filters):", availableFiltersResult.errors);
  if (!productsResult.success) console.error("Server fetch error (Products):", productsResult.errors);

  return (
    <Container className="mt-10">
      <SectionHeader />
      <div className="flex">
        <CatalogueClientWrapper
          initialProducts={initialProducts}
          initialTotalPages={initialTotalPages}
          initialFilters={initialFrontendFilters}
          availableFilters={availableFilters} // Pass the new availableFilters data
        />
      </div>
      <UGonnaNeed />
    </Container>
  );
}
