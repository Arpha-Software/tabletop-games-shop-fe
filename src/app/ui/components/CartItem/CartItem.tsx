'use client';

import Image from 'next/image';
import { useCartContext } from '@/context/cart/context';
import { TCartItem } from '@/utils/types';
import { Button } from '@/app/ui/components/Button/Button';
import { Text } from '@/utils/ui/Text';
import DeleteIcon from '@/public/icons/delete.svg'; // Make sure this icon exists
import { cn } from '@/utils/helpers';

type CartItemProps = {
  item: TCartItem;
};

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCartContext();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      // Or set to 1, depending on desired behavior. Design implies it doesn't go below 1.
      updateQuantity(item.id, 1);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-200 last:border-b-0">
      <Image
        src={item.mainImgLink || 'https://via.placeholder.com/64x80'} // Placeholder with aspect ratio from design
        alt={item.name}
        width={64} // Adjust as per design
        height={80} // Adjust as per design
        className="w-16 h-20 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-grow flex flex-col justify-between min-h-[80px]">
        <div>
          <Text.Paragraph className="font-semibold text-sm leading-tight mb-0.5">
            {item.name}
          </Text.Paragraph>
          {/* Optional secondary text from design */}
          <Text.Paragraph className="text-xs text-gray-500">Назва товару, можливо навіть довга</Text.Paragraph>
        </div>
        <div className="flex items-center mt-1">
          <Button
            variant="base"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className={cn(
                "p-0 border-none bg-green-100 text-green-700 rounded-md w-7 h-7 flex items-center justify-center text-lg hover:bg-green-200",
                item.quantity <= 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200" : ""
            )}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </Button>
          <Text.Span className="mx-2 w-6 text-center font-medium text-sm tabular-nums">{item.quantity}</Text.Span>
          <Button
            variant="base"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="p-0 border-none bg-green-100 text-green-700 rounded-md w-7 h-7 flex items-center justify-center text-lg hover:bg-green-200"
            aria-label="Increase quantity"
          >
            +
          </Button>
        </div>
      </div>
      <div className="text-right flex flex-col items-end justify-between min-h-[80px] ml-2">
        <Text.Paragraph className="font-semibold text-primary whitespace-nowrap">
          {(item.price * item.quantity).toFixed(0)} ₴
        </Text.Paragraph>
        <Button
          variant="base"
          onClick={() => removeFromCart(item.id)}
          className="p-1 mt-auto hover:opacity-75"
          aria-label="Remove item"
        >
          <Image src={DeleteIcon} alt="Видалити" width={18} height={18} />
        </Button>
      </div>
    </div>
  );
};
