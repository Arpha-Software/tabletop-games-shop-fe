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
        {(products.length === 0 && !loading) && (
          <div className="flex items-center justify-center h-64">
            <p className='text-gray-500 text-lg'>Товари не знайдено</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        )}

        {products.length > 0 && !loading && (
          <div className='flex h-full flex-col justify-between'>
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-8'>
              {products.map((item, index) => (
                <ProductCard
                  key={item.id || index}
                  item={item}
                  className="w-full"
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center pb-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
