'use client';

import { useState, useEffect, useCallback, PropsWithChildren } from 'react';
import { WishlistContext, TWishlist } from './context';
import { getWishlist, addProductToWishlist, removeProductFromWishlist } from '@/app/actions/wishlist';
import toast from 'react-hot-toast';
import { useUserContext } from '../user/context';

type TProps = PropsWithChildren<{}>;

export const WishlistContextProvider = ({ children }: TProps) => {
  const { user } = useUserContext();
  const [wishlist, setWishlist] = useState<TWishlist | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const response = await getWishlist();
    if (response.success) {
      setWishlist(response.data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addProduct = async (productId: number) => {
    if (!user) {
      toast.error('Будь ласка, увійдіть, щоб додати товар до обраного.');
      return;
    }
    const response = await addProductToWishlist(productId);
    if (response.success) {
      setWishlist(response.data);
      toast.success('Товар додано до обраного!');
    } else {
      toast.error(response.errors?.[0] || 'Не вдалося додати товар до обраного.');
    }
  };

  const removeProduct = async (productId: number) => {
    if (!user) return;
    const response = await removeProductFromWishlist(productId);
    if (response.success) {
      setWishlist(prev => prev ? { ...prev, products: prev.products.filter(p => p.id !== productId) } : null);
      toast.success('Товар видалено з обраного.');
    } else {
      toast.error(response.errors?.[0] || 'Не вдалося видалити товар з обраного.');
    }
  };

  const isProductInWishlist = (productId: number): boolean => {
    return !!wishlist?.products.some(p => p.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addProduct, removeProduct, isProductInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
