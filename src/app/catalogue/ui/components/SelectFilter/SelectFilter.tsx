'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/utils/helpers';

import ArrowIcon from '@/public/icons/arrowbottom.svg'

type TProps = {
  options: {
    value: string;
    label: string;
  }[];
  className?: string;
};

export const SelectFilter = ({ options, className }: TProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(options[0]);

  const maxHeight = `${options.length * 48 + 2}px`;
  const style = {
    maxHeight: isOpen ? maxHeight : '0px',
    opacity: isOpen ? 1 : 0,
  }

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: { value: string; label: string }) => {
    setSelectedValue(option);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative w-64', className)}>
      <div
        className="border border-secondary-100 bg-secondary-50 rounded-lg px-4 py-3 cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <span>{selectedValue.label}</span>
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
