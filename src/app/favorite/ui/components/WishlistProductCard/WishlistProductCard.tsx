'use client';

import { ProductCard } from "@/app/ui/components";
import { TProduct } from "@/utils/types";

type TProps = {
  product: TProduct;
  onRemove: (productId: number) => void;
};

export const WishlistProductCard = ({ product, onRemove }: TProps) => {
  return (
    <div className="relative group">
      <ProductCard item={product} className="w-full" />
      <button
        onClick={() => onRemove(product.id)}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Remove from wishlist"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  );
};
