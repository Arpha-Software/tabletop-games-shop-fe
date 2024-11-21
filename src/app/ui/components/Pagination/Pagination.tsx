'use client';

import Image from 'next/image';

import { cn } from '@/utils/helpers';

import ArrowIcon from '@/public/icons/arrowbottom.svg';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  className?: string;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  className,
  onPageChange,
}: PaginationProps) => {
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className={cn("flex items-center justify-center divide-x", className)}>
      <button
        className={cn('px-3 h-12 rounded-l-lg', currentPage === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-orange-500 text-white')}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <Image src={ArrowIcon} alt='arrow' className='-rotate-90'/>
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index;

        return (
          <button
            key={page}
            className={cn('px-4 h-12', page === currentPage ? 'bg-orange-500 text-white' : 'bg-white')}
            onClick={() => handlePageChange(page)}
          >
            {page + 1}
          </button>
        );
      })}

      <button
        className={cn('px-3 h-12 rounded-r-lg', currentPage === totalPages - 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-orange-500 text-white')}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <Image src={ArrowIcon} alt='arrow' className='rotate-90' />
      </button>
    </div>
  );
};
