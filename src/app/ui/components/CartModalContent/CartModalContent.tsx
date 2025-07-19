'use client';

import { useCartContext } from '@/context/cart/context';
import { Button } from '@/app/ui/components/Button/Button';
import { Text } from '@/utils/ui/Text';
import { CartItem } from '../CartItem/CartItem';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/helpers';
import CloseIcon from '@/public/icons/close.svg'; // Assuming a close icon for the modal header
import toast from 'react-hot-toast';
import Image from 'next/image';

export const CartModalContent = () => {
  const { cartItems, clearCart, getTotalPrice } = useCartContext();
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <Text.Header className="text-xl font-primary" id="cart-heading">Кошик</Text.Header>
        <div className='flex items-center'>
          {cartItems.length > 0 && (
            <Button variant="link" onClick={clearCart} className="p-0 text-xs text-gray-500 hover:text-primary mr-3">
              Очистити все
            </Button>
          )}
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 p-1"
            aria-label="Закрити кошик"
          >
            <Image src={CloseIcon} alt="Закрити" width={20} height={20} />
          </button>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex-grow flex items-center justify-center p-4">
          <Text.Paragraph className="text-gray-500">Ваш кошик порожній.</Text.Paragraph>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto p-4 space-y-1"> {/* Reduced space-y for tighter packing */}
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-auto border-t border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <Text.Paragraph className="font-medium text-base">Разом:</Text.Paragraph>
            <Text.Paragraph className="font-semibold text-xl text-primary">
              {totalPrice.toFixed(0)} ₴
            </Text.Paragraph>
          </div>
          <Button
            variant="primary"
            className="w-full py-3 text-base"
            onClick={() => {
              // router.push('/checkout'); // Future: Navigate to checkout
              toast.success('Перехід до оформлення замовлення!');
              handleClose();
            }}
          >
            Оформити замовлення
          </Button>
        </div>
      )}
    </div>
  );
};
