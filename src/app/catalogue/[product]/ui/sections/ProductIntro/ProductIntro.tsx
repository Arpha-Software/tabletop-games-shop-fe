'use client';

import { Gallery } from '../../components/Gallery'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Title } from '../../components/Title';
import { Rating } from '../../components/Rating';
import { Price } from '../../components/Price';
import { Description } from '../../components/Description';
import { ControlButtons } from '../../components/ControlButtons';
import { useEffect, useState } from 'react';
import { getProductById } from '@/app/actions/products';
import { TProduct } from '@/utils/types';
import { Loader } from '@/app/ui/components/Loader';

type TProps = {
  productId: string;
}

export const ProductIntro = ({ productId }: TProps) => {
  const [product, setProduct] = useState<TProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const categoryId = product?.categories[0].split(' ').join("_").toLowerCase() || '';
  const category = product?.categories[0] || '';

  const links = [
    { href: '/', label: 'Головна' },
    { href: '/catalogue', label: 'Каталог' },
    { href: `/catalogue?category=${categoryId}`, label: category },
    { href: `/catalogue/${productId}`, label: product?.name || '' }
  ]

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
    }

    fetchProduct();
  }, [])

  if (loading) {
    return <Loader className='bg-white z-10'/>
  }
  console.log('product', product)
  return (
    <div className='flex justify-between'>
      <Gallery images={product?.productPhotos && product.productPhotos.length > 0 ? product.productPhotos : ["https://via.placeholder.com/1440", "https://via.placeholder.com/512", "https://via.placeholder.com/512", "https://via.placeholder.com/512"]} />

      <section className='flex flex-col justify-between w-full pl-10'>
        <div>
          <Breadcrumbs links={links} />
          <Title className='mt-10' text={product?.name || ''} />
          <Rating rating={1.7} className='mt-2' />
          <Price price={product?.price || 0} className='mt-6' />
          <Description
            text={product?.description || ''}
            className='mt-6'
          />
        </div>

        <ControlButtons className='mt-6' />
      </section>
    </div>
  )
}
