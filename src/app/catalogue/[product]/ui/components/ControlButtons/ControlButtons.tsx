// src/app/catalogue/[product]/ui/components/ControlButtons/ControlButtons.tsx
'use client';

import { Button } from "@/app/ui/components";
import { cn } from "@/utils/helpers";
import { TProduct } from "@/utils/types";
import { useCartContext } from "@/context/cart/context";
import { useState } from "react";
import { AddToWishlistButton } from "@/app/ui/components/AddToWishlistButton";

type TProps = {
  product?: TProduct | null;
  className?: string;
  selectedAddons?: number[];
  setMainProductLoading?: (loading: boolean) => void;
};

export const ControlButtons = ({
  product,
  className,
  selectedAddons = [],
  setMainProductLoading,
}: TProps) => {
  const { addItem } = useCartContext();
  const [loading, setLoading] = useState(false);

  const handle = async (buyNow?: boolean) => {
    if (!product) return;
    setLoading(true);
    setMainProductLoading?.(true);
    await addItem(product.id, 1, { addons: selectedAddons });
    setLoading(false);
    setMainProductLoading?.(false);
    if (buyNow) {
      // TODO: navigate to checkout
    }
  };

  return (
    <div
      className={cn(
        "mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-start",
        className
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Button
          variant="primary"
          className="h-11 w-full sm:w-auto sm:min-w-[160px]"
          onClick={() => handle(true)}
          disabled={loading}
        >
          Купити зараз
        </Button>
        <Button
          variant="secondary"
          className="h-11 w-full sm:w-auto sm:min-w-[140px]"
          onClick={() => handle()}
          disabled={loading}
        >
          В кошик
        </Button>
      </div>
      {product && (
        <AddToWishlistButton
          productId={product.id}
          className="h-11 w-11 shrink-0 rounded-full border border-gray-200 bg-white hover:bg-gray-50 ml-auto sm:ml-2"
        />
      )}
    </div>
  );
};
