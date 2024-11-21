'use client';

import { useState } from "react";

import { SelectFilter } from "../../components/SelectFilter";
import { Button } from "@/app/ui/components";
import { Sidebar } from "../Sidebar";

import { Text } from "@/utils/ui/Text";

import { useScrollPrevent } from "@/hooks/useScrollPrevent";
import { useUserContext } from "@/context/user/context";

export const SectionHeader = () => {
  const { isAdmin } = useUserContext();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useScrollPrevent(isCreateOpen);

  const filterOptions = [
    { value: '1', label: 'За релевантністю' },
    { value: '2', label: 'За рейтингом' },
    { value: '3', label: 'За популярністю' },
    { value: '4', label: 'Від дешевих до дорогих' },
    { value: '5', label: 'Від дорогих до дешевих' },
  ]

  const handleSidebarOpen = () => {
    setIsCreateOpen(true);
  }

  return (
    <>
      <Sidebar isOpen={isCreateOpen} setOpen={setIsCreateOpen} />

      <header className="flex justify-between items-center mb-14 mx-16">
        <Text.Header>Найпопулярніші</Text.Header>

        <div className="flex items-center gap-5">
          {isAdmin && <Button variant="primary" className="px-6 py-2 rounded-lg" onClick={handleSidebarOpen}>Створити</Button>}
          <SelectFilter options={filterOptions}/>
        </div>
      </header>
    </>
  )
}