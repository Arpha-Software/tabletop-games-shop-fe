'use client';

import Image from 'next/image'
import { useCartContext } from '@/context/cart/context';
import CartIcon from '@/public/icons/cart.svg';

export const CartButton = () => {
  const { cart, openSidebar } = useCartContext();
  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <button 
      type="button" 
      onClick={openSidebar} 
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 group"
      aria-label="Відкрити кошик"
    >
      <Image 
        src={CartIcon} 
        alt="Cart" 
        width={24} 
        height={24} 
        className="transition-transform duration-200 group-hover:scale-110" 
      />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
