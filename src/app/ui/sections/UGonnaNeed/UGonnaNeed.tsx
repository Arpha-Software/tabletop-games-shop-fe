// src/app/ui/sections/UGonnaNeed/UGonnaNeed.tsx
'use client';

import Link from 'next/link';
import { Button, Container, Loader, ProductCard } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { useProductsContext } from '@/context/product/context';
import { TProduct } from '@/utils/types';

type Props = {
  items?: TProduct[];
  title?: string;
};

export const UGonnaNeed = ({ items, title = 'Вам це точно знадобиться' }: Props) => {
  const { recommendations, loading } = useProductsContext();

  const list = items ?? recommendations.slice(0, 5);
  const isLoading = items ? false : loading;

  return (
    <Container className='relative mt-20'>
      {!isLoading ? (
        list.length > 0 ? (
          <>
            <Text.Header className='mb-10'>{title}</Text.Header>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {list.map((item) => (
                <ProductCard key={item.id} item={item} className="w-full" />
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Button tag={Link} href='/catalogue' className='px-8 py-3'>
                Більше товарів
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-500">Немає рекомендацій</div>
        )
      ) : (
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      )}
    </Container>
  );
};
