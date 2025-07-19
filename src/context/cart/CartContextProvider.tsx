'use client';

import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { TCartItem, TProduct } from "@/utils/types";
import { CartContext } from "./context";
import toast from "react-hot-toast";

type TProps = PropsWithChildren<{}>;

export const CartContextProvider = ({ children }: TProps) => {
  const [cartItems, setCartItems] = useState<TCartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false); // To handle localStorage only on client side

  useEffect(() => {
    setIsMounted(true);
    const storedCartItems = localStorage.getItem('tabletopShopCartItems');
    if (storedCartItems) {
      try {
        const parsedItems = JSON.parse(storedCartItems);
        if (Array.isArray(parsedItems)) {
          setCartItems(parsedItems);
        }
      } catch (error) {
        console.error("Failed to parse cart items from localStorage", error);
        localStorage.removeItem('tabletopShopCartItems'); // Clear corrupted data
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('tabletopShopCartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = useCallback((product: TProduct, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        toast.success(`${product.name} кількість оновлено!`);
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast.success(`${product.name} додано до кошика!`);
      return [...prevItems, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.error(`${itemToRemove.name} видалено з кошика.`);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.success('Кошик очищено!');
  }, []);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
