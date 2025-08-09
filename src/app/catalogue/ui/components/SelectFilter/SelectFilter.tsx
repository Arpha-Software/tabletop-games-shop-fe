// src/app/catalogue/ui/components/SelectFilter/SelectFilter.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/utils/helpers';
import ArrowIcon from '@/public/icons/arrowbottom.svg';

type Option = { value: string; label: string };

type TProps = {
  options: Option[];
  className?: string;
  selectedValue?: string;                 // зробимо опційним
  onValueChange?: (value: string) => void; // зробимо опційним
};

export const SelectFilter = ({
  options,
  className,
  selectedValue,
  onValueChange,
}: TProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Поточний об’єкт-опція за selectedValue
  const selectedOption = useMemo<Option | undefined>(() => {
    if (!options || options.length === 0) return undefined;
    return options.find(o => o.value === selectedValue) ?? options[0];
  }, [options, selectedValue]);

  // Локальний стан: зберігаємо саме об’єкт, щоб не шукати кожен рендер
  const [currentSelectedOption, setCurrentSelectedOption] = useState<Option | undefined>(selectedOption);

  // Синхронізація при зміні пропсів
  useEffect(() => {
    setCurrentSelectedOption(selectedOption);
  }, [selectedOption]);

  const maxHeight = `${(options?.length ?? 0) * 48 + 2}px`;
  const style = {
    maxHeight: isOpen ? maxHeight : '0px',
    opacity: isOpen ? 1 : 0,
  };

  const toggleDropdown = useCallback(() => {
    if (!options || options.length === 0) return;
    setIsOpen(prev => !prev);
  }, [options]);

  const handleOptionClick = useCallback((option: Option) => {
    setCurrentSelectedOption(option);
    // Викликаємо тільки якщо це функція
    if (typeof onValueChange === 'function') {
      onValueChange(option.value);
    } else {
      // корисно під час дебагу
      // console.warn('[SelectFilter] onValueChange is not provided');
    }
    setIsOpen(false);
  }, [onValueChange]);

  return (
    <div className={cn('relative w-64', className)}>
      <div
        className={cn(
          'border border-secondary-100 bg-secondary-50 rounded-lg px-4 py-3 cursor-pointer flex justify-between items-center',
          !options?.length && 'opacity-60 cursor-not-allowed'
        )}
        onClick={toggleDropdown}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{currentSelectedOption?.label ?? '—'}</span>
        <div className={cn('transition-transform duration-300', isOpen ? 'rotate-0' : 'rotate-180')}>
          <Image src={ArrowIcon} width={16} height={16} alt="Arrow down" />
        </div>
      </div>

      <ul
        className="absolute z-10 mt-1 border border-gray-300 bg-white rounded-md w-full shadow-lg transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden"
        style={style}
        role="listbox"
      >
        {(options ?? []).map((option) => (
          <li
            key={option.value}
            className={cn(
              'p-3 hover:bg-gray-100 cursor-pointer',
              option.value === currentSelectedOption?.value && 'bg-gray-50'
            )}
            onClick={() => handleOptionClick(option)}
            role="option"
            aria-selected={option.value === currentSelectedOption?.value}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
