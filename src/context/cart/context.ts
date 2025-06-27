import { TCartItem, TProduct } from "@/utils/types";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type TCartContext = {
  cartItems: TCartItem[];
  addToCart: (product: TProduct, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  // Note: isCartOpen and setCartOpen might be handled by routing for intercepted modals
  // If you need a programmatic way to open/close a non-intercepted cart, keep them.
  // For now, focusing on intercepted route modal.
};

export const CartContext = createContext<TCartContext | null>(null);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartContextProvider");
  }
  return context;
};