'use client';

import { useState, useEffect, useCallback } from 'react';
import { TCart, TCartItem, TProduct } from '@/utils/types';
import toast from 'react-hot-toast';

const CART_STORAGE_KEY = 'tabletop-games-cart';

// Helper functions for localStorage
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

  const addItem = useCallback(async (productId: number, quantity: number = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      toast.error('Товар не знайдено');
      return;
    }

    setCart(prevCart => {
      if (!prevCart) {
        const newItem: TCartItem = { id: Date.now(), product, quantity };
        return {
          items: [newItem],
          total: product.price * quantity
        };
      }

      const existingItem = prevCart.items.find(item => item.product.id === productId);
      if (existingItem) {
        const updatedItems = prevCart.items.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        };
      } else {
        const newItem: TCartItem = { id: Date.now(), product, quantity };
        return {
          items: [...prevCart.items, newItem],
          total: prevCart.total + (product.price * quantity)
        };
      }
    });
    
    toast.success('Товар додано до кошика');
  }, [products]);

  const updateItem = useCallback(async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCart(prevCart => {
      if (!prevCart) return null;

      const updatedItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );

      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
    });
  }, []);

  const removeItem = useCallback(async (itemId: number) => {
    setCart(prevCart => {
      if (!prevCart) return null;

      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
    });
    
    toast.success('Товар видалено з кошика');
  }, []);

  const clearCart = useCallback(async () => {
    setCart(null);
    toast.success('Кошик очищено');
  }, []);

  const refreshCart = useCallback(async () => {
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