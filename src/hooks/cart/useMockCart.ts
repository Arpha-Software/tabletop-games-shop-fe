'use client';

import { useState, useEffect } from 'react';
import { TCart, TCartItem, TProduct } from '@/utils/types';
import toast from 'react-hot-toast';

// Mock product data
const mockProducts: TProduct[] = [
  {
    id: 1,
    name: "Назва товару, можливо навіть довга",
    type: {
      id: 1,
      name: "Board Game",
      dimension: { width: 20, weight: 1, length: 20, height: 5 }
    },
    playerNumber: 2,
    playTime: 60,
    description: "A great board game for everyone",
    price: 720,
    rulesLink: "",
    width: 20,
    height: 5,
    length: 20,
    weight: 1,
    quantity: 10,
    mainImgLink: "https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png",
    categories: ["Strategy"],
    genres: ["Family"],
    productPhotos: ["https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png"]
  },
  {
    id: 2,
    name: "Назва товару, можливо навіть довга",
    type: {
      id: 2,
      name: "Card Game",
      dimension: { width: 15, weight: 0.5, length: 15, height: 3 }
    },
    playerNumber: 4,
    playTime: 30,
    description: "An exciting card game",
    price: 720,
    rulesLink: "",
    width: 15,
    height: 3,
    length: 15,
    weight: 0.5,
    quantity: 15,
    mainImgLink: "https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png",
    categories: ["Party"],
    genres: ["Casual"],
    productPhotos: ["https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png"]
  }
];

export const useMockCart = () => {
  const [cart, setCart] = useState<TCart | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    const mockCart: TCart = {
      items: [
        {
          id: 1,
          product: mockProducts[0],
          quantity: 1
        },
        {
          id: 2,
          product: mockProducts[1],
          quantity: 2
        }
      ],
      total: 2160 // 720 + (720 * 2)
    };
    
    setTimeout(() => {
      setCart(mockCart);
      setLoading(false);
    }, 500);
  }, []);

  const addItem = async (productId: number, quantity: number = 1) => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      toast.error('Товар не знайдено');
      return;
    }

    setCart(prevCart => {
      if (!prevCart) {
        return {
          items: [{ id: Date.now(), product, quantity }],
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
  };

  const updateItem = async (itemId: number, quantity: number) => {
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
  };

  const removeItem = async (itemId: number) => {
    setCart(prevCart => {
      if (!prevCart) return null;

      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
    });
    toast.success('Товар видалено з кошика');
  };

  const clearCart = async () => {
    setCart(null);
    toast.success('Кошик очищено');
  };

  const refreshCart = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

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