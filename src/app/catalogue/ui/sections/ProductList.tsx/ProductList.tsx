import { ProductCard } from '@/app/ui/components';
import { Filters } from '../Filters';

import { useEffect, useState } from 'react';
import { getAllProducts } from '@/app/actions/products';

import { TProduct } from '@/utils/types';
import { Loader } from '@/app/ui/components/Loader';

type TProps = {
  chosenCategory: string;
}

export const ProductList = ({ chosenCategory }: TProps) => {
  const [items, setItems] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  console.log('items', items);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllProducts();

        if (!response.success) {
          return;
        }

        const data = response.data.content as TProduct[];

        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  return (
    <div className='flex border-y'>
      <div className='w-96 border-r px-16'>
        <Filters chosenCategory={chosenCategory} />
      </div>

      <div className='relative w-full'>
        {(items.length === 0 && !loading) && <p className='text-center w-full'>No items found</p> }
        {loading && <Loader className='absolute inset-0' />}
        {items.length > 0 && !loading && (
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-10'>
            {items.map((item, index) => (
              <ProductCard
                key={index}
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
