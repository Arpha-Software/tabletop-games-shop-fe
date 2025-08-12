// src/context/cart/CartContextProvider.tsx
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

  // --- async shims so the signatures match TCartContext ---
  const addItem: TCartContext['addItem'] = async (productOrId, quantity, options) => {
    localStorageCart.addItem(productOrId, quantity, options);
  };

  const updateItem: TCartContext['updateItem'] = async (itemId, quantity) => {
    localStorageCart.updateItem(itemId, quantity);
  };

  const removeItem: TCartContext['removeItem'] = async (itemId) => {
    localStorageCart.removeItem(itemId);
  };

  const clearCart: TCartContext['clearCart'] = async () => {
    localStorageCart.clearCart();
  };

  const refreshCart: TCartContext['refreshCart'] = async () => {
    localStorageCart.refreshCart();
  };

  const contextValue: TCartContext = {
    cart: localStorageCart.cart,
    loading: localStorageCart.loading,
    setCart: localStorageCart.setCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart,
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
