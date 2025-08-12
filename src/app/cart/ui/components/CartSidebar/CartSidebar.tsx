// src/app/cart/ui/components/CartSidebar/CartSidebar.tsx
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useCartContext } from '@/context/cart/context';
import { CartItem } from '../CartItem';
import { Button } from '@/app/ui/components/Button';
import { Text } from '@/utils/ui/Text';
import { cn, roundToTwo } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

const SkeletonRow = () => (
  <div className="flex gap-4 p-4">
    <div className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

export const CartSidebar = () => {
  const { cart, loading, clearCart, isSidebarOpen, closeSidebar } = useCartContext();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Prevent background scroll when sidebar is open + focus management
  useEffect(() => {
    if (isSidebarOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // focus the close button when opened
      closeBtnRef.current?.focus();
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isSidebarOpen]);

  // ESC to close
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeSidebar();
  }, [closeSidebar]);

  const handleClearCart = () => {
    if (confirm('Ви впевнені, що хочете очистити кошик?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) return;
    closeSidebar();
    router.push('/checkout');
  };

  const count = cart?.items.length ?? 0;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300',
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden={!isSidebarOpen}
        onClick={closeSidebar}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Кошик"
        className={cn(
          'fixed top-0 right-0 z-[61] h-dvh w-full sm:max-w-md',
          'transition-transform duration-300 ease-out',
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        onKeyDown={onKeyDown}
      >
        <div
          ref={panelRef}
          className="flex h-full flex-col bg-white shadow-2xl rounded-l-2xl border-l border-gray-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 p-5 border-b border-gray-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="min-w-0">
              <Text.Header className="text-2xl leading-7">Кошик</Text.Header>
              <div className="mt-1 inline-flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
                  {count} товар{count === 1 ? '' : count < 5 ? 'и' : 'ів'}
                </span>
              </div>
            </div>

            <button
              ref={closeBtnRef}
              onClick={closeSidebar}
              className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
              aria-label="Закрити кошик"
            >
              <span aria-hidden>×</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="divide-y divide-gray-100">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            ) : !cart || cart.items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5" />
                  </svg>
                </div>
                <Text.Paragraph className="text-gray-600">Ваш кошик порожній</Text.Paragraph>
                <Button
                  tag="a"
                  href="/catalogue"
                  variant="secondary"
                  className="mt-4 px-5 py-2"
                  onClick={closeSidebar}
                >
                  Продовжити покупки
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.items.length > 0 && (
            <div className="border-t border-gray-100 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <Text.Span className="text-gray-600">Сума замовлення</Text.Span>
                <Text.Paragraph className="font-semibold">{roundToTwo(cart.total)} ₴</Text.Paragraph>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={!cart || cart.items.length === 0}
                className="w-full py-3 rounded-xl"
              >
                Оформити замовлення
              </Button>

              <button
                onClick={handleClearCart}
                className="mt-3 w-full text-center text-sm text-gray-500 hover:text-red-600 underline transition-colors"
              >
                Очистити все
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
