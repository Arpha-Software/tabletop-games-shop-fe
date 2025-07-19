'use client';

import { useSearchParams } from 'next/navigation';
import { ProductManagement } from '../../components/ProductManagement/ProductManagement';
import { CategoryManagement } from '../../components/CategoryManagement/CategoryManagement';
import { GenreManagement } from '../../components/GenreManagement/GenreManagement';
import { OrderManagement } from '../../components/OrderManagement/OrderManagement';
import { UserManagement } from '../../components/UserManagement/UserManagement';

export const AdminPanel = () => {
  const searchParams = useSearchParams();
  const currentSection = searchParams.get('section') || 'products';

  const renderSection = () => {
    switch (currentSection) {
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'genres':
        return <GenreManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <ProductManagement />;
    }
  };

  return (
    <div className="w-full p-5 bg-gray-50 rounded-lg shadow-lg">
      {renderSection()}
    </div>
  );
};
