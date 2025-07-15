'use client'

import { useState } from 'react';
import { Container, Button } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { ProductsTab, GenresTab, CategoriesTab, OrdersTab, UsersTab } from './ui/components';

const TABS = [
  { key: 'products', label: 'Товари' },
  { key: 'genres', label: 'Жанри' },
  { key: 'categories', label: 'Категорії' },
  { key: 'orders', label: 'Замовлення' },
  { key: 'users', label: 'Користувачі' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('products');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsTab />;
      case 'genres':
        return <GenresTab />;
      case 'categories':
        return <CategoriesTab />;
      case 'orders':
        return <OrdersTab />;
      case 'users':
        return <UsersTab />;
      default:
        return <ProductsTab />;
    }
  };

  return (
    <Container className="mt-10 mb-16">
      <Text.Header className="mb-8">Адмін-панель</Text.Header>
      <div className="flex gap-4 mb-10">
        {TABS.map(tab => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'primary' : 'secondary'}
            className={activeTab === tab.key ? '' : 'text-black'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-8 min-h-[400px]">
        {renderTabContent()}
      </div>
    </Container>
  );
} 