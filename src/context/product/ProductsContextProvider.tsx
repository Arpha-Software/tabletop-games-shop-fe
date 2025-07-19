'use client';

import { PropsWithChildren, useEffect, useState } from "react";

import { getAllProducts, getProductsRecommendations } from "@/app/actions/products";
import { ProductsContext } from "./context";

import { Loader } from "@/app/ui/components/Loader";

import { TPageable, TProduct, TUser } from "@/utils/types";
import { SORTING_OPTIONS } from "@/utils/constants";

type TProps = PropsWithChildren<{}>;

export const ProductsContextProvider = ({ children }: TProps) => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageable, setPageable] = useState<TPageable | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [sort, setSort] = useState(SORTING_OPTIONS[0].value);

  const [recommendations, setRecommendations] = useState<TProduct[]>([]);

  useEffect(() => {
    const fetchAllProducts = async (page: number = 0, sort: string) => {
      try {
        setLoading(true);
        const response = await getAllProducts(page, sort);
        const responseRecommendations = await getProductsRecommendations(page);

        setPageable(response.data.pageable);
        setTotalPages(response.data?.totalPages);
        setTotalElements(response.data?.totalElements);

        setRecommendations(responseRecommendations.data.map((value: any) => value.product));
        setProducts(response.data.content);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllProducts(currentPage, sort);
  }, [currentPage, sort]);

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const changeSort = (sort: string) => {
    setSort(sort);
  }

  return (
    <ProductsContext.Provider value={{ products, recommendations, pageable, totalElements, totalPages, loading, setProducts, setRecommendations, changePage, changeSort }}>
      {children}
    </ProductsContext.Provider>
  );
}
