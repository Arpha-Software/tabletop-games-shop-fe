'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartContext } from '@/context/cart/context';
import { Button } from '@/app/ui/components/Button';
import { Text } from '@/utils/ui/Text';
import { cn } from '@/utils/helpers';
import { TProduct } from '@/utils/types';
import { useMemo } from 'react';

type TProps = {
  item: TProduct | null;
  className?: string;
};

export const ProductCard = ({ item, className }: TProps) => {
  const { addItem } = useCartContext();
  if (!item) return null;

  const {
    id,
    name,
    price,
    quantity,
    media,
    averageRating,
    reviewCount,
  } = item;

  // prettify price without breaking locales
  const formattedPrice = useMemo(() => {
    const val = typeof price === 'number' ? price : Number(price || 0);
    try {
      return new Intl.NumberFormat('uk-UA').format(val);
    } catch {
      return val.toString();
    }
  }, [price]);

  const ratingValue =
    typeof averageRating === 'number' && !Number.isNaN(averageRating)
      ? Math.max(0, Math.min(5, averageRating))
      : null;

  const imgSrc =
    media?.mainImgLink ||
    (media?.photos?.length ? media.photos[0] : null) ||
    // subtle neutral placeholder
    'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23f8fafc'/><stop offset='100%' stop-color='%23f1f5f9'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/></svg>`
      );

  const outOfStock = typeof quantity === 'number' ? quantity <= 0 : false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, 1); // ✅ pass the product object, not just id
  };

  return (
    <div
      className={cn(
        'group relative rounded-2xl bg-white border border-gray-100 shadow-card overflow-hidden',
        'transition-all duration-300 hover:shadow-xl hover:-translate-y-[2px]',
        className
      )}
    >
      {/* Image area */}
      <Link href={`/catalogue/${id}`} className="block">
        <div className="relative overflow-hidden">
          {/* aspect ratio box to avoid CLS */}
          <div className="relative w-full aspect-[4/3] bg-gray-50">
            <Image
              src={imgSrc}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={false}
            />
          </div>

          {/* Soft hover veil */}
          <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

          {/* Optional stock badge */}
          {outOfStock ? (
            <span className="absolute top-3 left-3 rounded-full bg-gray-900/80 text-white text-[11px] font-semibold px-2.5 py-1">
              Немає в наявності
            </span>
          ) : (
            <span className="absolute top-3 left-3 rounded-full bg-white/90 text-gray-800 text-[11px] font-semibold px-2.5 py-1 border border-gray-200">
              В наявності
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/catalogue/${id}`} className="block">
          <Text.Paragraph
            className={cn(
              'font-medium text-gray-900 hover:text-primary transition-colors',
              'line-clamp-2'
            )}
            title={name}
          >
            {name}
          </Text.Paragraph>

          {/* Rating */}
          {ratingValue !== null && typeof reviewCount === 'number' && (
            <div className="mt-2 flex items-center gap-2">
              <span aria-hidden className="text-yellow-500 text-base leading-none">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>{i < Math.round(ratingValue) ? '★' : '☆'}</span>
                ))}
              </span>
              <span className="text-gray-800 text-sm font-medium">
                {ratingValue.toFixed(1)}
              </span>
              <span className="text-gray-400 text-sm">({reviewCount})</span>
            </div>
          )}
        </Link>

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between">
          <Text.Span className="text-lg font-bold text-primary">{formattedPrice} ₴</Text.Span>

          <Button
            variant="secondary"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-all',
              'hover:bg-primary hover:text-white',
              outOfStock && 'opacity-60 cursor-not-allowed hover:bg-transparent hover:text-inherit'
            )}
          >
            {outOfStock ? 'Немає' : 'В кошик'}
          </Button>
        </div>
      </div>
    </div>
  );
};
