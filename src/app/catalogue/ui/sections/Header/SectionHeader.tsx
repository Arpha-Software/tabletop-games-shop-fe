// src/app/catalogue/ui/sections/Header/SectionHeader.tsx
'use client';

import { SelectFilter } from "../../components/SelectFilter";
import { Text } from "@/utils/ui/Text";
import { useProductsContext } from "@/context/product/context";
import { SORTING_OPTIONS } from "@/utils/constants";

export const SectionHeader = () => {
  const { sort, changeSort } = useProductsContext(); // ⬅️ беремо sort із контексту

  return (
    <header className="flex justify-between items-center mb-14 mx-16">
      <Text.Header>Найпопулярніші</Text.Header>

      <div className="flex items-center gap-5">
        <SelectFilter
          options={SORTING_OPTIONS}
          selectedValue={sort}             // ⬅️ поточне значення
          onValueChange={changeSort}       // ⬅️ колбек на зміну
        />
      </div>
    </header>
  );
};
