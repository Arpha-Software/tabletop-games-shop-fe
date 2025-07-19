'use client';

import { Button } from "@/app/ui/components";
import { cn } from "@/utils/helpers";
import { useCartContext } from "@/context/cart/context";
import { TProduct } from "@/utils/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // For Buy Now

type TProps = {
  className?: string;
  product: TProduct | null;
};

export const ControlButtons = ({ className, product }: TProps) => {
  const { addToCart } = useCartContext();
  const router = useRouter();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    } else {
      toast.error("Деталі товару недоступні.");
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      // You might want to redirect to /cart or a /checkout page
      router.push('/cart'); // Opens cart modal
      // toast.info("Додано до кошика, перехід до оформлення (не реалізовано).");
    } else {
      toast.error("Деталі товару недоступні.");
    }
  };

  return (
    <div className={cn("flex gap-4", className)}>
      <Button variant='primary' onClick={handleBuyNow} className="flex-1 py-3">Купити зараз</Button>
      <Button variant='secondary' onClick={handleAddToCart} className="flex-1 py-3">В кошик</Button>
    </div>
  );
};