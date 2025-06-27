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
          <div className={`w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-center justify-items-center gap-5`}>
            {products?.slice(0, 5).map((item, index) => (
              <ProductCard
                key={index}
                item={item}
              />
            ))}
          </div>

          <Button tag={Link} href='/catalogue' className='mx-auto mt-8'>Більше товарів</Button>
        </>
      ) : <Loader />}
    </Container>
  )
}
