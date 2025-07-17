'use client';

import { Button } from "@/app/ui/components";
import { cn } from "@/utils/helpers";
import { TProduct } from "@/utils/types";
import { useCartContext } from "@/context/cart/context";

type TProps = {
  product?: TProduct;
  className?: string;
}

export const ControlButtons = ({ product, className }: TProps) => {
  const { addItem } = useCartContext();

  const handleAddToCart = () => {
    if (product) {
      addItem(product.id, 1);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product.id, 1);
      // TODO: Redirect to checkout
      console.log('Buy now clicked');
    }
  };

  return (
    <div className={cn("flex gap-4", className)}>
      <Button variant='primary' onClick={handleBuyNow}>Купити зараз</Button>
      <Button variant='secondary' onClick={handleAddToCart}>В кошик</Button>
    </div>
  )
}
