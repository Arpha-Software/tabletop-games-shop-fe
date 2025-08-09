'use client';

import { useEffect } from 'react';
import { useCartContext } from '@/context/cart/context';
import { CartItem } from '../CartItem';
import { Button } from '@/app/ui/components/Button';
import { Text } from '@/utils/ui/Text';
import { cn } from '@/utils/helpers';
import { Loader } from '@/app/ui/components/Loader';
import { useRouter } from 'next/navigation';

export const CartSidebar = () => {
  const { cart, loading, clearCart, isSidebarOpen, closeSidebar } = useCartContext();
  const router = useRouter();

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

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

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar} 
      />
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out",
        isSidebarOpen ? "transform translate-x-0" : "transform translate-x-full"
      )}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <Text.Header className="text-2xl text-gray-900">Кошик</Text.Header>
            {cart && cart.items.length > 0 && (
              <Text.Span className="text-sm text-gray-500">
                {cart.items.length} товар{cart.items.length === 1 ? '' : cart.items.length < 5 ? 'и' : 'ів'}
              </Text.Span>
            )}
          </div>
          <button 
            onClick={closeSidebar} 
            className="w-10 h-10 flex items-center justify-center text-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200" 
            aria-label="Закрити"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader />
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <Text.Paragraph className="text-gray-500 mb-2">Ваш кошик порожній</Text.Paragraph>
              <Text.Span className="text-sm text-gray-400">Додайте товари, щоб почати покупки</Text.Span>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6 space-y-4">
            <div className="flex justify-between items-center">
              <Text.Paragraph className="text-lg font-semibold text-gray-900">Разом:</Text.Paragraph>
              <Text.Paragraph className="text-2xl font-bold text-primary">
                {cart.total}₴
              </Text.Paragraph>
            </div>
            
            <Button
              onClick={handleCheckout}
              disabled={!cart || cart.items.length === 0}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Оформити замовлення
            </Button>
            
            <button
              onClick={handleClearCart}
              className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors underline py-2"
            >
              Очистити все
            </button>
          </div>
        )}
      </aside>
    </>
  );
}; 