'use client';

import { Container } from '@/app/ui/components';
import { CartSidebar } from '../../components/CartSidebar';
import { Text } from '@/utils/ui/Text';
import { cn } from '@/utils/helpers';

type TProps = {
  className?: string;
};

export const CartSection = ({ className }: TProps) => {
  return (
    <Container className={cn("mt-10", className)}>
      <div className="flex gap-8">
        {/* Main Content Area */}
        <div className="flex-1">
          <Text.Header className="mb-8">Кошик</Text.Header>
          
          {/* Placeholder content for the main area */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-100 rounded-lg p-6 h-32 flex items-center justify-center">
              <Text.Paragraph className="text-gray-500">Вибране</Text.Paragraph>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 h-32 flex items-center justify-center">
              <Text.Paragraph className="text-gray-500">Знижки</Text.Paragraph>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 h-32 flex items-center justify-center">
              <Text.Paragraph className="text-gray-500">Пари і пропозиції</Text.Paragraph>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 h-32 flex items-center justify-center">
              <Text.Paragraph className="text-gray-500">Спеціальні</Text.Paragraph>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 h-32 flex items-center justify-center">
              <Text.Paragraph className="text-gray-500">До каталогу</Text.Paragraph>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 h-32 flex items-center justify-center">
              <Text.Paragraph className="text-gray-500">Камероплі</Text.Paragraph>
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="flex-shrink-0">
          <CartSidebar />
        </div>
      </div>
    </Container>
  );
}; 