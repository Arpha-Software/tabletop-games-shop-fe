'use client';

import { useUserContext } from "@/context/user/context";
import { UGonnaNeed } from "../ui/sections/UGonnaNeed";
import { SelectFilter } from "./ui/components/SelectFilter";
import { ProductList } from "./ui/sections/ProductList.tsx"
import { Text } from '@/utils/ui/Text';
import { Button } from "../ui/components";
import { useState } from "react";
import { Sidebar } from "./ui/components/Sidebar";
import { useScrollPrevent } from "@/hooks/useScrollPrevent";

export default function Catalogue(params: any) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  useScrollPrevent(isCreateOpen);
  const chosenCategory = params.searchParams.category;
  const chosenOffer = params.searchParams.offers;
  const filterOptions = [
    { value: '1', label: 'За релевантністю' },
    { value: '2', label: 'За рейтингом' },
    { value: '3', label: 'За популярністю' },
    { value: '4', label: 'Від дешевих до дорогих' },
    { value: '5', label: 'Від дорогих до дешевих' },
  ]

  const { user } = useUserContext();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const handleSidebarOpen = () => {
    setIsCreateOpen(true);
  }

  return (
    <section className="mt-10">
      <Sidebar isOpen={isCreateOpen} setOpen={setIsCreateOpen}/>
      <header className="flex justify-between items-center mb-14 mx-16">
        <Text.Header>Найпопулярніші</Text.Header>
        <div className="flex items-center gap-5">
          {isAdmin && <Button variant="primary" className="px-6 py-2 rounded-lg" onClick={handleSidebarOpen}>Створити</Button>}
          <SelectFilter options={filterOptions}/>
        </div>
      </header>

      <ProductList chosenCategory={chosenCategory} />

      <UGonnaNeed />
    </section>
  );
}
