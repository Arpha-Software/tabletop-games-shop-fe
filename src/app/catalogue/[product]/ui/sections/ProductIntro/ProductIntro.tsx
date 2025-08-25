// src/app/catalogue/[product]/ui/sections/ProductIntro/ProductIntro.tsx
'use client';

import { useState } from 'react';
import { TProduct } from '@/utils/types';
import { Container } from '@/app/ui/components';
import { Gallery } from '../../components/Gallery';
import { ProductDetails } from '../../components/ProductDetails';
import { ProductTabs } from '../../components/ProductTabs';

type TProps = { productId: string; product: TProduct | null };

export const ProductIntro = ({ productId, product }: TProps) => {
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [mainProductLoading, setMainProductLoading] = useState(false);

  if (!product) {
    return (
      <Container className="py-16">
        <div className="text-center text-gray-600">Товар не знайдено.</div>
      </Container>
    );
  }

  const mainImg = product.media?.mainImgLink || '';
  const photos = product.media?.photos?.length ? [mainImg, ...product.media.photos] : [mainImg];

  return (
    <Container className="py-8">
      {/* 2 columns: Gallery | Details */}
      <div
        className="
          md:flex gap-20
          lg:gap-10
        "
      >
        {/* Left: gallery column (natural height defines sticky boundary) */}
        <div className="justify-self-center lg:justify-self-start">
          <Gallery images={photos} />
        </div>

        {/* Right: sticky details column */}
        <div className="w-full lg:sticky lg:top-20 self-start max-w-[600px]">
          {/* top offset ~ header height; tweak top value if header changes */}
          <ProductDetails
            product={product}
            productId={productId}
            selectedAddons={selectedAddons}
            setMainProductLoading={setMainProductLoading}
          />
        </div>
      </div>

      <div className="mt-10">
        <ProductTabs
          product={product}
          productId={productId}
          selectedAddons={selectedAddons}
          setSelectedAddons={setSelectedAddons}
          mainProductLoading={mainProductLoading}
        />
      </div>
    </Container>
  );
};
