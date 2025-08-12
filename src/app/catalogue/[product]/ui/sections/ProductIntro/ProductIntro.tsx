// src/app/catalogue/[product]/ui/sections/ProductIntro/ProductIntro.tsx
'use client';

import { useState } from 'react';
import { TProduct } from '@/utils/types';
import { Container } from '@/app/ui/components';
import { Gallery } from '../../components/Gallery';
import { ProductDetails } from '../../components/ProductDetails';
import { ProductTabs } from '../../components/ProductTabs';

type TProps = {
  productId: string;            // keep if children need id
  product: TProduct | null;     // SSR-provided
};

export const ProductIntro = ({ productId, product }: TProps) => {
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [mainProductLoading, setMainProductLoading] = useState(false);

  if (!product) {
    // handle gracefully
    return (
      <Container className="py-16">
        <div className="text-center text-gray-600">Товар не знайдено.</div>
      </Container>
    );
  }

  const mainImg = product.media?.mainImgLink || "https://via.placeholder.com/1440";
  const photos = product.media?.photos && product.media.photos.length > 0
    ? [mainImg, ...product.media.photos]
    : [mainImg];

  return (
    <Container className='flex flex-col gap-10'>
      <div className='flex justify-between'>
        <Gallery images={photos} />
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
