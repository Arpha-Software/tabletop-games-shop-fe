import { ProductCard } from '@/app/ui/components';
import { Filters } from '../Filters';

import { catalogueMock } from '@/utils/config';

type TProps = {
  chosenCategory: string;
}

export const ProductList = ({ chosenCategory }: TProps) => {
  const { items } = catalogueMock;

  return (
    <div className='flex border-y'>
      <div className='w-96 border-r px-16'>
        <Filters chosenCategory={chosenCategory} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-10'>
        {items.map(({ title, price, img, href }, index) => (
            <ProductCard
              key={index}
              title={title}
              price={price}
              img={img}
              href={href}
            />
          ))}
      </div>
    </div>
  )
}
