'use client';

import { Button } from "@/app/ui/components";
import { cn } from "@/utils/helpers";
import { TProduct } from "@/utils/types";
import { useCartContext } from "@/context/cart/context";
import { useState } from "react";

type TProps = {
  product?: TProduct | null;
  className?: string;
  selectedAddons?: number[];
  setMainProductLoading?: (loading: boolean) => void;
}

export const ControlButtons = ({ product, className, selectedAddons = [], setMainProductLoading }: TProps) => {
  const { addItem } = useCartContext();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (product) {
      setLoading(true);
      setMainProductLoading?.(true);
      // Pass add-ons as a property (cart logic should group them)
      await addItem(product.id, 1, { addons: selectedAddons });
      setLoading(false);
      setMainProductLoading?.(false);
    }
  };

  const handleBuyNow = async () => {
    if (product) {
      setLoading(true);
      setMainProductLoading?.(true);
      await addItem(product.id, 1, { addons: selectedAddons });
      setLoading(false);
      setMainProductLoading?.(false);
      // TODO: Redirect to checkout
      console.log('Buy now clicked');
    }
  };

  return (
    <div className={cn("flex gap-4", className)}>
      <Button variant='primary' onClick={handleBuyNow} disabled={loading}>Купити зараз</Button>
      <Button variant='secondary' onClick={handleAddToCart} disabled={loading}>В кошик</Button>
    </div>
  )
}
