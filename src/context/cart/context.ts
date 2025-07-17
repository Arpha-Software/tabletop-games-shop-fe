import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

import { TPageable, TProduct, TCart, TCartItem } from "@/utils/types";

export type TCartContext = {
  cart: TCart | null;
  loading: boolean;
  setCart: Dispatch<SetStateAction<TCart | null>>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
};

export const CartContext = createContext<TCartContext | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartContextProvider');
  }
  return context;
}; 