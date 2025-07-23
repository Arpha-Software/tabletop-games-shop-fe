import { UGonnaNeed } from "../ui/sections/UGonnaNeed";
import { ProductList } from "./ui/sections/ProductList.tsx";
import { SectionHeader } from "./ui/sections/Header";
import { Filters } from "./ui/sections/Filters/Filters";
import { Container } from "../ui/components";

// Import server actions for data fetching
import { getAllCategories } from '@/app/actions/categories';
import { getAllGenres } from '@/app/actions/genres';
import { getAllProductTypes } from '@/app/actions/productTypes';
import { getAllProducts } from '@/app/actions/products';
import { TProduct, TCategory, TGenre, TProductType } from '@/utils/types';

// Define the type for filter state (remains the same)
interface CatalogueFilters {
  minPrice: number;
  maxPrice: number;
  categoryIds: string[];
  genreIds: string[];
  productTypeIds: string[];
  searchQuery: string;
  sort: string;
}

// This component is now an async Server Component
export default async function Catalogue({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Initialize filter state from search params for server-side initial fetch
  const initialFilters: CatalogueFilters = {
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : 0,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : 20000,
    categoryIds: typeof searchParams.category === 'string' ? [searchParams.category] : [],
    genreIds: typeof searchParams.genre === 'string' ? [searchParams.genre] : [],
    productTypeIds: typeof searchParams.productType === 'string' ? [searchParams.productType] : [],
    sort: searchParams.sort ? String(searchParams.sort) : "id,asc",
    searchQuery: searchParams.searchQuery ? String(searchParams.searchQuery) : "",
  };

  // Fetch all necessary data on the server
  const [categoriesResult, genresResult, productTypesResult, productsResult] = await Promise.all([
    getAllCategories(),
    getAllGenres(),
    getAllProductTypes(),
    getAllProducts({ ...initialFilters, page: 0 }), // Fetch initial products for page 0
  ]);

  const initialCategories: TCategory[] = categoriesResult.success ? categoriesResult.data : [];
  const initialGenres: TGenre[] = genresResult.success ? genresResult.data : [];
  const initialProductTypes: TProductType[] = productTypesResult.success ? productTypesResult.data : [];
  const initialProducts: TProduct[] = productsResult.success && productsResult.data ? productsResult.data.content : [];
  const initialTotalPages: number = productsResult.success && productsResult.data ? productsResult.data.totalPages : 0;

  if (!categoriesResult.success) console.error("Server fetch error (Categories):", categoriesResult.errors);
  if (!genresResult.success) console.error("Server fetch error (Genres):", genresResult.errors);
  if (!productTypesResult.success) console.error("Server fetch error (Product Types):", productTypesResult.errors);
  if (!productsResult.success) console.error("Server fetch error (Products):", productsResult.errors);

  return (
    <Container className="mt-10">
      <SectionHeader />
      <div className="flex">
        <div className='w-96 border-r px-16'>
          <Filters
            initialCategories={initialCategories}
            initialGenres={initialGenres}
            initialProductTypes={initialProductTypes}
            initialFilters={initialFilters}
          />
        </div>
        <div className='flex-1'>
          <ProductList
            initialProducts={initialProducts}
            initialTotalPages={initialTotalPages}
            initialFilters={initialFilters}
          />
        </div>
      </div>
      <UGonnaNeed />
    </Container>
  );
}
