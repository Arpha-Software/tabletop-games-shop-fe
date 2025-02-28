'use client';

import { Gallery } from '../../components/Gallery'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Title } from '../../components/Title';
import { Rating } from '../../components/Rating';
import { Price } from '../../components/Price';
import { Description } from '../../components/Description';
import { ControlButtons } from '../../components/ControlButtons';
import { Loader } from '@/app/ui/components/Loader';
import { useFetchProduct } from '@/hooks/product/useFetchProduct';
import { Container } from '@/app/ui/components';

type TProps = {
  productId: string;
}

export const ProductIntro = ({ productId }: TProps) => {
  const { product, loading } = useFetchProduct(productId);

  const categoryId = product?.categories[0].split(' ').join("_").toLowerCase() || '';
  const category = product?.categories[0] || '';

  const links = [
    { href: '/', label: 'Головна' },
    { href: '/catalogue', label: 'Каталог' },
    { href: `/catalogue?category=${categoryId}`, label: category },
    { href: `/catalogue/${productId}`, label: product?.name || '' }
  ]

  if (loading) {
    return <Loader className='bg-white z-10'/>
  }

  return (
    <Container className='lg:flex justify-between'>
      <Gallery images={["https://via.placeholder.com/1440", "https://via.placeholder.com/512", "https://via.placeholder.com/512", "https://via.placeholder.com/512"]} />

      <section className='flex flex-col justify-between w-full pl-10'>
        <div>
          <Breadcrumbs links={links} />
          <Title className='mt-10' text={product?.name || ''} />
          <Rating rating={1.7} className='mt-2' />
          <Price price={product?.price || 0} className='mt-6' />
          <Description
            text={product?.description.slice(0, 200) + '...' || ''}
            className='mt-6'
          />
        </div>

        <ControlButtons className='mt-6' />
      </section>
    </Container>
  )
}
