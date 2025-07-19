'use client';

import { useState, useCallback } from 'react';
import { CartContext, TCartContext } from './context';
import { useLocalStorageCart } from '@/hooks/cart/useLocalStorageCart';
import { useProductsContext } from '@/context/product/context';

type TProps = {
  children: React.ReactNode;
};

export const CartContextProvider = ({ children }: TProps) => {
  const { products } = useProductsContext();
  const localStorageCart = useLocalStorageCart(products);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const contextValue: TCartContext = {
    ...localStorageCart,
    isSidebarOpen,
    openSidebar,
    closeSidebar,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
