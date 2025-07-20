import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { TProduct } from "@/utils/types";

export type TWishlist = {
  id: number;
  userEmail: string;
  products: TProduct[];
  shareableLink: string;
};

export type TWishlistContext = {
  wishlist: TWishlist | null;
  loading: boolean;
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
  isProductInWishlist: (productId: number) => boolean;
};

export const WishlistContext = createContext<TWishlistContext | undefined>(undefined);

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlistContext must be used within a WishlistContextProvider');
  }
  return context;
};
