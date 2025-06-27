'use client'; // Ensure client component for context and event handlers

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/utils/helpers";
import { TProduct } from "@/utils/types";
import { Button } from "@/app/ui/components/Button";
import { useCartContext } from "@/context/cart/context";
import { Text } from "@/utils/ui/Text";

type TProps = {
  item: TProduct | null;
  className?: string;
}

export const ProductCard = ({
  item,
  className,
}: TProps) => {
  const { addToCart } = useCartContext();

  if (!item) {
    return null;
  }

  const { id, name, price, mainImgLink } = item;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
  };

  return (
    <div className={cn(
      "group relative flex flex-col min-w-52 w-full bg-white shadow-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300",
      className
    )}>
      <Link href={`/catalogue/${id}`} className="block">
        <div className="aspect-[4/3] bg-gray-100"> {/* Fixed aspect ratio for image container */}
          <Image
            src={mainImgLink || 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png'}
            alt={name}
            width={300} // Adjust for desired card size
            height={225} // Adjust for 4:3 ratio
            className="w-full h-full object-cover "
          />
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <Text.Paragraph className="text-sm font-medium text-gray-800 mb-1 h-10 overflow-hidden group-hover:text-primary transition-colors">
            {name}
          </Text.Paragraph>
          <Text.Paragraph className="font-semibold text-lg text-gray-900 mt-auto">
            {price} ₴
          </Text.Paragraph>
        </div>
      </Link>
      <div className="p-3 pt-0">
        <Button
          variant="secondary"
          className="w-full text-sm py-2"
          onClick={handleAddToCart}
        >
          В кошик
        </Button>
      </div>
    </div>
  )
}