'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';
import { useScrollPrevent } from '@/hooks/useScrollPrevent';
import { cn } from '@/utils/helpers';

export const CartSidebarWrapper = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  useScrollPrevent(true);

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50",
          "flex flex-col transition-transform duration-300 ease-in-out transform translate-x-0"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        {children}
      </aside>
    </>
  );
};
