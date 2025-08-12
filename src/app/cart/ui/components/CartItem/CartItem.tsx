// src/app/cart/ui/components/CartItem/CartItem.tsx
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
    if (newQuantity > 0) updateItem(item.id, newQuantity);
  };

  const handleRemove = () => removeItem(item.id);

  const img =
    product.media?.mainImgLink ||
    (product.media?.photos?.length ? product.media.photos[0] : 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png');

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:shadow-md',
        className
      )}
    >
      {/* Image */}
      <div className="shrink-0">
        <Image
          src={img}
          alt={product.name}
          width={84}
          height={84}
          className="h-20 w-20 rounded-lg object-cover"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <Text.Paragraph className="mb-1 line-clamp-2">{product.name}</Text.Paragraph>
        <Text.Span className="text-primary font-bold">{product.price} ₴</Text.Span>

        {/* Addons */}
        {item.addons?.length ? (
          <div className="mt-2 border-l-2 border-primary/30 pl-3">
            <Text.Span className="block text-xs text-primary font-semibold mb-1">Доповнення</Text.Span>
            <ul className="space-y-0.5">
              {item.addons.map((a) => (
                <li key={a.id} className="text-xs text-gray-700">
                  {a.name} <span className="text-primary font-semibold ml-1">+{a.price} ₴</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* Controls */}
      <div className="ml-2 flex shrink-0 items-center gap-2">
        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="h-8 w-8 rounded-l-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40"
            aria-label="Зменшити кількість"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span
            aria-live="polite"
            className="h-8 min-w-[2rem] px-2 inline-flex items-center justify-center text-sm font-semibold text-gray-800"
          >
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="h-8 w-8 rounded-r-lg text-gray-700 hover:bg-gray-100"
            aria-label="Збільшити кількість"
          >
            +
          </button>
        </div>

        <button
          onClick={handleRemove}
          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          aria-label="Видалити товар"
          title="Видалити"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7m5 4v6m4-6v6M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};
