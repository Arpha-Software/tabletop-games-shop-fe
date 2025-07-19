'use client';

import { useEffect, useState } from 'react';
import { getProductById } from '@/app/actions/products';
import { TProduct } from '@/utils/types';
import { Loader } from '@/app/ui/components/Loader';
import { Container } from '@/app/ui/components';
import { Gallery } from '../../components/Gallery';
import { ProductDetails } from '../../components/ProductDetails';
import { ProductTabs } from '../../components/ProductTabs';

type TProps = {
  productId: string;
};

export const ProductIntro = ({ productId }: TProps) => {
  const [product, setProduct] = useState<TProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [mainProductLoading, setMainProductLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(productId);
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
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return <Loader className='bg-white z-10' />;
  }

  return (
    <Container className='flex flex-col gap-10'>
      <div className='flex justify-between'>
        <Gallery images={product?.media.photos && product.media.photos.length > 0 ? [product?.media.mainImgLink, ...product.media.photos] : [product?.media.mainImgLink || "https://via.placeholder.com/1440"]} />
        <ProductDetails
          product={product}
          productId={productId}
          selectedAddons={selectedAddons}
          setMainProductLoading={setMainProductLoading}
        />
      </div>
      <ProductTabs
        product={product}
        productId={productId}
        selectedAddons={selectedAddons}
        setSelectedAddons={setSelectedAddons}
        mainProductLoading={mainProductLoading}
      />
    </Container>
  );
};
