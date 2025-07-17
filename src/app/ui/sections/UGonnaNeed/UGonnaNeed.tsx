'use client';

import Link from 'next/link';

import { Button, Container, ProductCard } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';

import { useProductsContext } from '@/context/product/context';
import { Loader } from '../../components/Loader';

export const UGonnaNeed = () => {
  const { products, loading } = useProductsContext();

  return (
    <Container className='relative mt-20'>
      {!loading ? (
        <>
          <Text.Header className='mb-10'>Вам це точно знадобиться</Text.Header>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {products.slice(0, 5).map((item, index) => (
              <ProductCard
                key={item.id || index}
                item={item}
                className="w-full"
              />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button tag={Link} href='/catalogue' className='px-8 py-3'>
              Більше товарів
            </Button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      )}
    </Container>
  )
}
