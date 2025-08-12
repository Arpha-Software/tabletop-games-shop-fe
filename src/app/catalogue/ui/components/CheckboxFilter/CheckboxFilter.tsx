// src/app/catalogue/ui/components/CheckboxFilter/CheckboxFilter.tsx
'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/utils/helpers';

type TProps = {
  title?: string; // optional (we don’t render it now)
  options: { id: string; value: string }[];
  isOpenDefault?: boolean;
  chosenValue?: string[];
  onChange: (selectedIds: string[]) => void;
};

export const CheckboxFilter = ({ options, chosenValue = [], isOpenDefault = true, onChange }: TProps) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  const handleCheckboxChange = useCallback((id: string, isChecked: boolean) => {
    const next = isChecked ? [...chosenValue, id] : chosenValue.filter(v => v !== id);
    onChange(next);
  }, [chosenValue, onChange]);

  if (!isOpen) return null;

  return (
    <div className="space-y-2">
      {options.map((item) => {
        const checked = chosenValue.includes(item.id);
        return (
          <label key={item.id} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={checked}
              onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
            />
            <span className={cn('text-sm', checked ? 'text-gray-900' : 'text-gray-700')}>{item.value}</span>
          </label>
        );
      })}
    </div>
  );
};
