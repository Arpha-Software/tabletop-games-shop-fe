'use client';

import { CartSidebarWrapper } from "@/app/ui/components/CartSidebarWrapper/CartSidebarWrapper";
import { CartModalContent } from "@/app/ui/components/CartModalContent/CartModalContent";

export default function CartModalInterceptPage() {
  return (
    <CartSidebarWrapper>
      <CartModalContent />
    </CartSidebarWrapper>
  );
}
