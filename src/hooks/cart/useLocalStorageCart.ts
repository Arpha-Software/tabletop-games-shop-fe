// src/hooks/cart/useLocalStorageCart.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { TCart, TCartItem, TProduct } from '@/utils/types';
import toast from 'react-hot-toast';

const CART_STORAGE_KEY = 'tabletop-games-cart';

// Helper functions
const getCartFromStorage = (): TCart | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return null;
  }
};

const saveCartToStorage = (cart: TCart | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (cart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Proper rounding to avoid float issues like 6026.6900000000005
const roundToTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

export const useLocalStorageCart = (products: TProduct[] = []) => {
  const [cart, setCart] = useState<TCart | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize cart from localStorage
  useEffect(() => {
    const storedCart = getCartFromStorage();
    setCart(storedCart);
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      saveCartToStorage(cart);
    }
  }, [cart, loading]);

  const calculateTotal = (items: TCartItem[]) => {
    return roundToTwo(
      items.reduce(
        (sum, item) =>
          sum +
          item.product.price * item.quantity +
          (item.addons ? item.addons.reduce((s, a) => s + a.price, 0) * item.quantity : 0),
        0
      )
    );
  };

  const addItem = useCallback(
    async (productId: number, quantity: number = 1, options?: { addons?: number[] }) => {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        toast.error('Товар не знайдено');
        return;
      }

      let addons: TProduct[] | undefined = undefined;
      if (options?.addons && options.addons.length > 0) {
        addons = products.filter((p) => options.addons!.includes(p.id));
      }

      setCart((prevCart) => {
        if (!prevCart) {
          const newItem: TCartItem = { id: Date.now(), product, quantity, ...(addons ? { addons } : {}) };
          return {
            items: [newItem],
            total: calculateTotal([newItem])
          };
        }

        const existingItem = prevCart.items.find(
          (item) =>
            item.product.id === productId &&
            JSON.stringify(item.addons?.map((a) => a.id).sort()) ===
              JSON.stringify((addons || []).map((a) => a.id).sort())
        );

        if (existingItem) {
          const updatedItems = prevCart.items.map((item) =>
            item.product.id === productId &&
            JSON.stringify(item.addons?.map((a) => a.id).sort()) ===
              JSON.stringify((addons || []).map((a) => a.id).sort())
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          return { items: updatedItems, total: calculateTotal(updatedItems) };
        } else {
          const newItem: TCartItem = { id: Date.now(), product, quantity, ...(addons ? { addons } : {}) };
          const updatedItems = [...prevCart.items, newItem];
          return { items: updatedItems, total: calculateTotal(updatedItems) };
        }
      });

      toast.success('Товар додано до кошика');
    },
    [products]
  );

  const updateItem = useCallback((itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCart((prevCart) => {
      if (!prevCart) return null;

      const updatedItems = prevCart.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );

      return { items: updatedItems, total: calculateTotal(updatedItems) };
    });
  }, []);

  const removeItem = useCallback((itemId: number) => {
    setCart((prevCart) => {
      if (!prevCart) return null;

      const updatedItems = prevCart.items.filter((item) => item.id !== itemId);
      return { items: updatedItems, total: calculateTotal(updatedItems) };
    });

    toast.success('Товар видалено з кошика');
  }, []);

  const clearCart = useCallback(() => {
    setCart(null);
    toast.success('Кошик очищено');
  }, []);

  const refreshCart = useCallback(() => {
    setLoading(true);
    const storedCart = getCartFromStorage();
    setCart(storedCart);
    setLoading(false);
  }, []);

  return {
    cart,
    loading,
    setCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart
  };
};
