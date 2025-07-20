'use client';

import { useWishlistContext } from '@/context/wishlist/context';
import Image from 'next/image';
import HeartIcon from '@/public/icons/favourite.svg';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

type TProps = {
  productId: number;
  className?: string;
};

export const AddToWishlistButton = ({ productId, className }: TProps) => {
  const { addProduct, removeProduct, isProductInWishlist, loading } = useWishlistContext();
  const isInWishlist = isProductInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) {
        toast.loading("Зачекайте...");
        return
    }

    if (isInWishlist) {
      removeProduct(productId);
    } else {
      addProduct(productId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-200",
        isInWishlist
          ? 'bg-secondary border-secondary'
          : 'bg-pink-50 border-gray-200 hover:bg-pink-100',
        className
      )}
      aria-label={isInWishlist ? 'Видалити з обраного' : 'Додати до обраного'}
    >
      <Image
        src={HeartIcon}
        alt="Heart Icon"
        width={24}
        height={24}
        className={cn('transition-transform', isInWishlist ? 'text-white' : 'text-secondary')}
        style={{ filter: isInWishlist ? 'brightness(0) invert(1)' : 'none' }}
      />
    </button>
  );
};
