// src/app/ui/components/AddToWishlistButton/AddToWishlistButton.tsx
'use client';

import { useWishlistContext } from '@/context/wishlist/context';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';
import { useMemo } from 'react';

type TProps = {
  productId: number;
  className?: string;
  size?: 'sm' | 'md'; // visual size
  showLabelOnMd?: boolean; // shows "В обране" text on md+ screens
};

export const AddToWishlistButton = ({
  productId,
  className,
  size = 'md',
  showLabelOnMd = false,
}: TProps) => {
  const { addProduct, removeProduct, isProductInWishlist, loading } = useWishlistContext();
  const isInWishlist = isProductInWishlist(productId);

  const label = useMemo(
    () => (isInWishlist ? 'Видалити з обраного' : 'Додати в обране'),
    [isInWishlist]
  );

  const dims = size === 'sm'
    ? { btn: 'h-9', icon: 18 }
    : { btn: 'h-11', icon: 20 };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) {
      // gentle nudge instead of a persistent "loading" toast
      toast('Зачекайте…', { icon: '⏳', duration: 800 });
      return;
    }
    try {
      if (isInWishlist) {
        await removeProduct(productId);
        toast.success('Видалено з обраного');
      } else {
        await addProduct(productId);
        toast.success('Додано в обране');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Сталася помилка');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-pressed={isInWishlist}
      aria-label={label}
      title={label}
      className={cn(
        // base
        'group inline-flex items-center rounded-full border transition-all duration-200',
        'shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 justify-center',
        // sizing
        dims.btn,
        // colors / states
        isInWishlist
          ? 'bg-rose-50 border-rose-200 hover:bg-rose-100'
          : 'bg-white border-gray-200 hover:bg-gray-50',
        loading && 'opacity-70 cursor-not-allowed',
        className
      )}
    >
      {/* Icon wrapper gives us a subtle pulse on toggle */}
      <span
        className={cn(
          'relative inline-flex items-center justify-center',
          size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'
        )}
      >
        {loading ? (
          <Spinner size={dims.icon} />
        ) : (
          <HeartIcon
            size={dims.icon}
            filled={isInWishlist}
            className={cn(
              'transition-transform duration-200 ease-out',
              'group-active:scale-95',
              isInWishlist ? 'text-rose-600' : 'text-gray-500 group-hover:text-rose-600'
            )}
          />
        )}
        {isInWishlist && !loading && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-rose-200/40 animate-ping"
          />
        )}
      </span>

      {/* Optional text label for md+ screens */}
      {showLabelOnMd && (
        <span
          className={cn(
            'hidden md:inline text-sm',
            isInWishlist ? 'text-rose-700' : 'text-gray-700 group-hover:text-rose-700'
          )}
        >
          {isInWishlist ? 'В обраному' : 'В обране'}
        </span>)}
    </button>
  );
};

function HeartIcon({
  filled,
  className,
  size = 20,
}: {
  filled?: boolean;
  className?: string;
  size?: number;
}) {
  // Feather-style heart path (clean bezier, consistent proportions)
  const d =
    'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z';

  return filled ? (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <path d={d} fill="currentColor" />
    </svg>
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      className="animate-spin text-gray-500"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
