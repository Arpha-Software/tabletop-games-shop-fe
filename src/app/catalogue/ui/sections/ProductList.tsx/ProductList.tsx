'use client';

import { ProductCard } from '@/app/ui/components';
import { Loader } from '@/app/ui/components/Loader';
import { Pagination } from '@/app/ui/components/Pagination';
import { Filters } from '../Filters';

import { useProductsContext } from '@/context/product/context';
import { usePagination } from '@/hooks/usePagination';

type TProps = {
  chosenCategory: string;
}

export const ProductList = ({ chosenCategory }: TProps) => {
  const { products, pageable, totalPages, loading, changePage } = useProductsContext();
  const { currentPage, handlePageChange } = usePagination(pageable, changePage);

  return (
    <div className='flex border-y'>
      <div className='w-96 border-r px-16'>
        <Filters chosenCategory={chosenCategory} />
      </div>

      <div className='relative w-full'>
        {(products?.length === 0 && !loading) && <p className='text-center w-full'>No items found</p>}

        {loading && <Loader />}

        {products?.length > 0 && !loading && (
          <div className='flex h-full flex-col justify-between'>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-10'>
              {products?.map((item, index) => (
                <ProductCard
                  key={index}
                  item={item}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <Pagination
                className='mb-10'
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
