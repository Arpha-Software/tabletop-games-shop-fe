// context/product/ProductsContextProvider.tsx
'use client';

import { PropsWithChildren, useEffect, useState, useCallback } from "react";
import { getAllProducts, getProductsRecommendations } from "@/app/actions/products";
import { ProductsContext } from "./context";
import { TPageable, TProduct } from "@/utils/types";
import { SORTING_OPTIONS } from "@/utils/constants";
import { useRouter } from "next/navigation";

type TProps = PropsWithChildren<{}>;

export const ProductsContextProvider = ({ children }: TProps) => {
  const router = useRouter();

  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageable, setPageable] = useState<TPageable | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [sort, setSort] = useState(SORTING_OPTIONS[0].value);
  const [recommendations, setRecommendations] = useState<TProduct[]>([]);

  const applyEmpty = () => {
    setProducts([]);
    setRecommendations([]);
    setTotalPages(0);
    setTotalElements(0);
    setPageable(null);
  };

  const fetchProducts = useCallback(async (page: number, sortValue: string) => {
    try {
      setLoading(true);

      const resp = await getAllProducts({ page, size: 20, sort: sortValue });
      if (!resp || !resp.success) {
        // optional: if unauthorized, send to login — your UserContext already logs it
        if ((resp as any)?.errorCode === 401) {
          // router.push('/login'); // enable if you want
        }
        applyEmpty();
        return;
      }

      const rec = await getProductsRecommendations(page);
      const list = resp.data?.content ?? [];
      const recList = rec?.data?.content ?? [];

      setProducts(list);
      setRecommendations(recList);
      setTotalPages(resp.data?.totalPages ?? 0);
      setTotalElements(list.length);
      setPageable(null);
    } catch (e) {
      console.error(e);
      applyEmpty();
    } finally {
      setLoading(false);
    }
  }, []);

  // initial & pagination
  useEffect(() => {
    fetchProducts(currentPage, sort);
  }, [currentPage, sort, fetchProducts]);

  const changePage = (page: number) => setCurrentPage(page);

  // fire request immediately on sort change + reset page
  const changeSort = (value: string) => {
    setSort(value);
    setCurrentPage(0);
    fetchProducts(0, value); // immediate refetch
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        recommendations,
        pageable,
        totalElements,
        totalPages,
        loading,
        sort,
        setProducts,
        setRecommendations,
        changePage,
        changeSort,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
