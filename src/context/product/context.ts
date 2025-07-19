import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

import { TPageable, TProduct } from "@/utils/types";

export type TProductsContext = {
  products: TProduct[];
  recommendations: TProduct[];
  pageable: TPageable | null;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  setProducts: Dispatch<SetStateAction<any>>;
  setRecommendations: Dispatch<SetStateAction<any>>;
  changePage: (page: number) => void;
  changeSort: (sort: string) => void;
}

export const ProductsContext = createContext<TProductsContext | null>(null);

export const useProductsContext = () => {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsContextProvider');
  }

  return context;
}
