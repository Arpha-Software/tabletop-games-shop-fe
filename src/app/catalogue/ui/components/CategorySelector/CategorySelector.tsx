'use client';

import { ChangeEvent, Dispatch, SetStateAction } from "react";

import { Button, Input } from "@/app/ui/components";

import type { TCategory } from "@/utils/types";

export const CategorySelector = ({ label, list, newItem, setNewItem, setList, placeholder, setSelectedItem }: any) => {
  const handleAddItem = (item: string, setItem: Dispatch<SetStateAction<string>>, setList: Dispatch<SetStateAction<any[]>>) => {
    if (item.trim()) {
      setList((prevList) => [...prevList, { id: prevList.length + 1, name: item }]);
      setItem('');
    }
  };

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(e.target.value);
  }

  return (
    <div>
      <label className="text-white mb-2 block">{label}</label>
      {list.length > 0 && (
        <select className="w-full p-2 rounded bg-gray-700 text-white mb-2" onChange={onChange}>
          {list.map((item: TCategory, idx: number) => (
            <option key={idx} value={item.name}>{item.name}</option>
          ))}
        </select>
      )}
      <div className="flex flex-col space-y-2">
        <Input
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={() => handleAddItem(newItem, setNewItem, setList)} variant="secondary" className='w-full text-white'>
          Додати
        </Button>
      </div>
    </div>
  );
};