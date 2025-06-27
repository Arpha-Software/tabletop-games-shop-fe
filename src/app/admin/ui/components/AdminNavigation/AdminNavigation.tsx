'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Text } from '@/utils/ui/Text';
import { cn } from '@/utils/helpers';

const ADMIN_SECTIONS = [
  { id: 'products', label: 'Товари' },
  { id: 'categories', label: 'Категорії' },
  { id: 'genres', label: 'Жанри' },
  { id: 'orders', label: 'Замовлення' },
  { id: 'users', label: 'Користувачі' },
] as const;

export const AdminNavigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSection = searchParams.get('section') || 'products';

  const handleSectionChange = (sectionId: string) => {
    router.push(`/admin?section=${sectionId}`);
  };

  return (
    <div className="mb-8">
      <Text.Header className="text-2xl text-gray-800 mb-6">Адмін Панель</Text.Header>
      
      <nav className="flex gap-4 border-b border-gray-200">
        {ADMIN_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionChange(section.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              currentSection === section.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
}; 