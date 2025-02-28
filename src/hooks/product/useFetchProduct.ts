'use client';

import { useEffect, useState } from "react";

import { getProductById } from "@/app/actions/products";

import { TProduct } from "@/utils/types";

export const useFetchProduct = (id: string) => {
  const [product, setProduct] = useState<TProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);

        if (!response.success) {
          return;
        }

        const data = response.data;

        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [])

  return {
    product,
    loading,
  };
}
