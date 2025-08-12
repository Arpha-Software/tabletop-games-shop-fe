// src/app/catalogue/ui/sections/Header/SectionHeader.tsx
'use client';

import { SelectFilter } from '../../components/SelectFilter';
import { Text } from '@/utils/ui/Text';
import { useProductsContext } from '@/context/product/context';
import { SORTING_OPTIONS } from '@/utils/constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const SectionHeader = () => {
  const pathname = usePathname();
  const isCatalogue = pathname.startsWith('/catalogue');

  const router = useRouter();
  const sp = useSearchParams();

  // Context (used outside /catalogue)
  const { sort: ctxSort, changeSort } = useProductsContext();

  // When on /catalogue we read the current sort from the URL
  const urlSort = (sp.get('sort') as string) || SORTING_OPTIONS[0].value;
  const selected = isCatalogue ? urlSort : ctxSort;

  const handleChange = (value: string) => {
    if (isCatalogue) {
      const params = new URLSearchParams(sp.toString());
      params.set('sort', value);
      params.set('page', '0'); // reset to first page on sort change
      router.push(`${pathname}?${params.toString()}`);
      return;
    }
    changeSort(value);
  };

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 md:mb-10 px-4 md:px-8 lg:px-16">
      <Text.Header>Найпопулярніші</Text.Header>

      <div className="flex items-center gap-3">
        <SelectFilter
          options={SORTING_OPTIONS}
          selectedValue={selected}
          onValueChange={handleChange}
          className="w-[180px] md:w-[200px]"
        />
      </div>
    </header>
  );
};
