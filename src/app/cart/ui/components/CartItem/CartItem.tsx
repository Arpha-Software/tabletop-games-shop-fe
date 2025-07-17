'use client';

import Image from 'next/image';
import { TCartItem } from '@/utils/types';
import { useCartContext } from '@/context/cart/context';
import { cn } from '@/utils/helpers';
import { Text } from '@/utils/ui/Text';

type TProps = {
  item: TCartItem;
  className?: string;
};

export const CartItem = ({ item, className }: TProps) => {
  const { updateItem, removeItem } = useCartContext();
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      updateItem(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className={cn("group flex relative bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200", className)}>
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Image
          src={product.mainImgLink || (product.productPhotos && product.productPhotos.length > 0 ? product.productPhotos[0] : 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png')}
          alt={product.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-lg object-cover shadow-sm"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 ml-4">
        <Text.Paragraph className="font-medium text-gray-900 truncate mb-1">
          {product.name}
        </Text.Paragraph>
        <Text.Span className="text-lg font-bold text-primary">
          {product.price}₴
        </Text.Span>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={quantity <= 1}
        >
          <span className="text-lg font-medium">−</span>
        </button>
        
        <span className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">
          {quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
        >
          <span className="text-lg font-medium">+</span>
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 ml-2"
        aria-label="Remove item"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}; 