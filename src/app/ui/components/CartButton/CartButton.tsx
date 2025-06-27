'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartContext } from '@/context/cart/context';
import CartIcon from '@/public/icons/cart.svg';
import { Text } from '@/utils/ui/Text'; // Make sure this path is correct
import { cn } from '@/utils/helpers';

export const CartButton = () => {
  const { getTotalItems } = useCartContext();
  const totalItems = getTotalItems();

  return (
    <Link href="/cart" className="relative flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
      <Image src={CartIcon} alt="Кошик" width={24} height={24} />
      {totalItems > 0 && (
        <div className={cn(
          "absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full",
          "w-5 h-5 flex items-center justify-center leading-none" // ensure text fits
        )}>
          <Text.Span className='text-xs text-white'>{totalItems}</Text.Span>
        </div>
      )}
    </Link>
  );
};
