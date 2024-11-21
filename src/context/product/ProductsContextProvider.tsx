'use client';

import { PropsWithChildren, useEffect, useState } from "react";

import { getAllProducts } from "@/app/actions/products";
import { ProductsContext } from "./context";

import { Loader } from "@/app/ui/components/Loader";

import { TPageable, TProduct, TUser } from "@/utils/types";

type TProps = PropsWithChildren<{}>;

export const ProductsContextProvider = ({ children }: TProps) => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageable, setPageable] = useState<TPageable | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    const fetchAllProducts = async (page: number = 0) => {
      try {
        setLoading(true);
        const response = await getAllProducts(page);

        setPageable(response.data.pageable);
        setTotalPages(response.data?.totalPages);
        setTotalElements(response.data?.totalElements);

        setProducts(response.data.content);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllProducts(currentPage);
  }, [currentPage]);

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <ProductsContext.Provider value={{ products, pageable, totalElements, totalPages, loading, setProducts, changePage }}>
      {children}
    </ProductsContext.Provider>
  );
}
