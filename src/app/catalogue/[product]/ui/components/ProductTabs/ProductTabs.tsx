'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/components';
import { Description } from '../Description';
import { Characteristics } from '../Characteristics';
import { Addons } from '../Addons';
import { Reviews } from '../Reviews';
import { DeliveryInfo } from '../DeliveryInfo';
import { TProduct } from '@/utils/types';

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
        return <Description text={product?.description || ''} className='mt-6' />;
      case 'characteristics':
        return <Characteristics product={product} />;
      case 'addons':
        return <Addons product={product} selectedAddons={selectedAddons} setSelectedAddons={setSelectedAddons} mainProductLoading={mainProductLoading} />;
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
      <div className="border-b flex gap-8">
        {TABS.map(tab => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'plain-focus' : 'plain'}
            className={activeTab === tab.key ? '' : 'text-black'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};
