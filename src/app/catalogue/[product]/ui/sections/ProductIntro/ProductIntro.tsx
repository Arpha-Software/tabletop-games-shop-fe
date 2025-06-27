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

  const categoryId = product?.categories[0]?.split(' ').join("_").toLowerCase() || '';
  const categoryName = product?.categories[0] || 'Категорія';

  const productName = product?.name || 'Завантаження...';

  const links = [
    { href: '/', label: 'Головна' },
    { href: '/catalogue', label: 'Каталог' },
    { href: `/catalogue?category=${categoryId}`, label: categoryName },
    { href: `/catalogue/${productId}`, label: productName }
  ];

  if (loading) {
    return <Container className='h-[50vh] relative'><Loader /></Container>;
  }

  if (!product) {
    return <Container><p>Товар не знайдено.</p></Container>;
  }

  return (
    <Container className='lg:flex justify-between py-8'>
      <div className='lg:w-1/2'>
        <Gallery images={product.imagesLinks || ["https://via.placeholder.com/512x512", "https://via.placeholder.com/150x150", "https://via.placeholder.com/150x150", "https://via.placeholder.com/150x150"]} />
      </div>

      <section className='flex flex-col justify-between lg:w-1/2 lg:pl-10 mt-6 lg:mt-0'>
        <div>
          <Breadcrumbs links={links} />
          <Title className='mt-6 mb-2' text={product.name} />
          <Rating rating={product.rating || 0} className='mt-2' /> {/* Assuming product has a rating property */}
          <Price price={product.price} className='mt-4 text-3xl' />
          <Description
            text={(product.description || '').slice(0, 250) + ((product.description || '').length > 250 ? '...' : '')}
            className='mt-4 text-sm text-gray-700 leading-relaxed'
          />
        </div>

        <ControlButtons className='mt-8' product={product} />
      </section>
    </Container>
  )
}