'use client';

import Link from "next/link";
import Image from "next/image";
import { useCartContext } from '@/context/cart/context';
import { Button } from '@/app/ui/components/Button';
import { Text } from '@/utils/ui/Text';

import { cn } from "@/utils/helpers";
import { TProduct } from "@/utils/types";

type TProps = {
  item: TProduct | null;
  className?: string;
}

export const ProductCard = ({
  item,
  className,
}: TProps) => {
  const { addItem } = useCartContext();

  if (!item) {
    return null;
  }

  const { id, name, price } = item;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(id, 1);
  };

  return (
    <div className={cn("group relative bg-white shadow-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300", className)}>
      {/* Product Image */}
      <Link href={`/catalogue/${id}`} className="block">
        <div className="relative overflow-hidden">
          <Image
            src={item.media?.mainImgLink || (item.media?.photos && item.media.photos.length > 0 ? item.media.photos[0] : 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png')} 
            alt={name}
            width={600}
            height={600}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          {/* Overlay for add to cart button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/catalogue/${id}`} className="block">
          <Text.Paragraph className="font-medium text-gray-900 mb-2 hover:text-primary transition-colors overflow-hidden text-ellipsis display-webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical">
            {name}
          </Text.Paragraph>
          {/* Average rating and review count */}
          {(typeof item.averageRating === 'number' && typeof item.reviewCount === 'number') && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500 text-lg">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>{i < Math.round(item.averageRating || 0) ? '★' : '☆'}</span>
                ))}
              </span>
              <span className="text-gray-700 text-sm font-medium">{item.averageRating.toFixed(1)}</span>
              <span className="text-gray-400 text-sm">({item.reviewCount})</span>
            </div>
          )}
        </Link>

        <div className="flex items-center justify-between">
          <Text.Span className="text-lg font-bold text-primary">
            {price} ₴
          </Text.Span>

          <Button
            onClick={(e: React.MouseEvent) => handleAddToCart(e)}
            variant="secondary"
            className="px-4 py-2 text-sm font-medium hover:bg-primary hover:text-white transition-all duration-200"
          >
            В кошик
          </Button>
        </div>
      </div>
    </div>
  )
}
