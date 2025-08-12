'use client';

import { PropsWithChildren, useEffect, useState, useCallback } from "react";
import { getAllProducts, getProductsRecommendations } from "@/app/actions/products";
import { ProductsContext } from "./context";
import { TPageable, TProduct } from "@/utils/types";
import { SORTING_OPTIONS } from "@/utils/constants";
import { usePathname } from "next/navigation";

type TProps = PropsWithChildren<{}>;

export const ProductsContextProvider = ({ children }: TProps) => {
  const pathname = usePathname();

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
      const [resp, rec] = await Promise.all([
        getAllProducts({ page, size: 20, sort: sortValue }),
        getProductsRecommendations(page),
      ]);

      if (!resp || !resp.success) {
        applyEmpty();
        return;
      }

      const list = resp.data?.content ?? [];
      const recList = rec?.data ?? [];

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

  const shouldFetchHere =
    !pathname.startsWith('/catalogue');

  useEffect(() => {
    if (!shouldFetchHere) {
      setLoading(false);
      return;
    }
    fetchProducts(currentPage, sort);
  }, [currentPage, sort, fetchProducts, shouldFetchHere]);

  const changePage = (page: number) => setCurrentPage(page);

  const changeSort = (value: string) => {
    setSort(value);
    setCurrentPage(0);
  };
    console.log('products: ', products)

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
