'use client';

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/utils/helpers';
import { tabItems } from '@/utils/constants';

export const TabMenu = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedQuery = searchParams.get('tab') || tabItems[0].id;

  const [selectedItem, setSelectedItem] = useState(selectedQuery);

  const handleSelectItem = (item: string) => {
    router.push(`?tab=${item}`)
    setSelectedItem(item);
  }

  return (
    <section className='flex gap-8 border-b'>
      {tabItems.map(item => (
        <button
          onClick={() => handleSelectItem(item.id)}
          className={cn('block px-6', selectedItem === item.id ? 'text-primary border-b-2 border-primary' : '')}
        >
          {item.label}
        </button>
      ))}
    </section>
  )
}
