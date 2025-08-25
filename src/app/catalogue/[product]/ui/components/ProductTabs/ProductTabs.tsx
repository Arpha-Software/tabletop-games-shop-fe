'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/components';
import { Description } from '../Description';
import { Characteristics } from '../Characteristics';
import { Addons } from '../Addons';
import { Reviews } from '../Reviews';
import { DeliveryInfo } from '../DeliveryInfo';
import { TProduct } from '@/utils/types';
import { cn } from '@/utils/helpers';

type TProps = {
  product: TProduct | null;
  productId: string;
  selectedAddons: number[];
  setSelectedAddons: React.Dispatch<React.SetStateAction<number[]>>;
  mainProductLoading: boolean;
};

const TABS = [
  { key: 'description', label: 'Опис' },
  { key: 'characteristics', label: 'Характеристики' },
  { key: 'addons', label: 'Доповнення' },
  { key: 'reviews', label: 'Відгуки' },
  { key: 'delivery', label: 'Доставка та оплата' },
];

export const ProductTabs = ({ product, productId, selectedAddons, setSelectedAddons, mainProductLoading }: TProps) => {
  const [activeTab, setActiveTab] = useState('description');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return <Description text={product?.description || ''} className="mt-6" />;
      case 'characteristics':
        return <Characteristics product={product} />;
      case 'addons':
        return (
          <Addons
            product={product}
            selectedAddons={selectedAddons}
            setSelectedAddons={setSelectedAddons}
            mainProductLoading={mainProductLoading}
          />
        );
      case 'reviews':
        return <Reviews productId={productId} />;
      case 'delivery':
        return <DeliveryInfo />;
      default:
        return <div className="py-6 text-gray-400">Вміст розділу в розробці</div>;
    }
  };

  return (
    <div>
      {/* Pills / segmented control */}
      <div
        className={cn(
          'inline-flex flex-wrap gap-2 p-1 rounded-full border border-gray-200 bg-gray-50/60',
          'shadow-inner'
        )}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-2 text-sm rounded-full transition-colors',
                active
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-700 hover:text-gray-900'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div>{renderTabContent()}</div>
    </div>
  );
};
