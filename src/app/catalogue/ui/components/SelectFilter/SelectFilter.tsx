// src/app/catalogue/ui/components/SelectFilter/SelectFilter.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react'; // Import useEffect, useCallback

import { cn } from '@/utils/helpers';

import ArrowIcon from '@/public/icons/arrowbottom.svg'

type TProps = {
  options: {
    value: string;
    label: string;
  }[];
  className?: string;
  selectedValue: string; // Controlled prop for the selected value
  onValueChange: (value: string) => void; // Callback to emit changes
};

export const SelectFilter = ({ options, className, selectedValue, onValueChange }: TProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Internal state for selected value, synced with prop
  const [currentSelectedOption, setCurrentSelectedOption] = useState(() =>
    options.find(option => option.value === selectedValue) || options[0]
  );

  // Sync internal state with external prop
  useEffect(() => {
    setCurrentSelectedOption(options.find(option => option.value === selectedValue) || options[0]);
  }, [selectedValue, options]);


  const maxHeight = `${options.length * 48 + 2}px`; // Assuming 48px per list item
  const style = {
    maxHeight: isOpen ? maxHeight : '0px',
    opacity: isOpen ? 1 : 0,
  }

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleOptionClick = useCallback((option: { value: string; label: string }) => {
    setCurrentSelectedOption(option);
    onValueChange(option.value); // Emit the new value to the parent
    setIsOpen(false);
  }, [onValueChange]);

  return (
    <div className={cn('relative w-64', className)}>
      <div
        className="border border-secondary-100 bg-secondary-50 rounded-lg px-4 py-3 cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <span>{currentSelectedOption.label}</span>
        <div className={cn('transition-transform duration-300', isOpen ? 'rotate-0' : 'rotate-180')}>
          <Image src={ArrowIcon} width={16} height={16} alt="Arrow down" />
        </div>
      </div>
      <ul
        className={`absolute z-10 mt-1 border border-gray-300 bg-white rounded-md w-full shadow-lg transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden`}
        style={style}
      >
        {options.map((option) => (
          <li
            key={option.value}
            className="p-3 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleOptionClick(option)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
