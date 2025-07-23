// src/app/catalogue/ui/components/CheckboxFilter/CheckboxFilter.tsx
'use client';

import { useState, useEffect, useCallback } from "react"; // Import useEffect and useCallback

import { cn } from "@/utils/helpers";

import ArrowBottomIcon from "@/public/icons/arrowbottom.svg";
import Image from "next/image";

type TProps = {
  title: string;
  options: {
    id: string;
    value: string;
  }[];
  isOpenDefault?: boolean;
  chosenValue?: string[]; // Controlled prop for selected values
  onChange: (selectedIds: string[]) => void; // Callback to emit changes
};

const CheckboxFilterHeader = ({
  title,
  isOpen,
  onToggle,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className={cn("flex justify-between items-center select-none cursor-pointer", isOpen ? "mb-3" : "")} onClick={onToggle}>
      <p className="font-medium">{title}</p>
      <button type="button" onClick={onToggle}>
        <Image
          src={ArrowBottomIcon}
          alt="arrow bottom icon"
          width={24}
          height={24}
          className={`h-4 w-4 transform transition-transform duration-400 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
};

const CheckboxFilterContent = ({
  options,
  chosenValue = [], // Use chosenValue prop
  onChange, // Use onChange prop
}: {
  options: { id: string; value: string }[];
  chosenValue: string[]; // Explicitly chosenValue is always an array
  onChange: (id: string, isChecked: boolean) => void; // Callback now includes isChecked
}) => {
  return (
    <div>
      {options.map((item) => (
        <div key={item.id} className="flex items-center mb-2"> {/* Added flex and margin for better layout */}
          <input
            type="checkbox"
            id={item.id}
            value={item.id} // Use id as value for checkbox
            checked={chosenValue.includes(item.id)}
            onChange={(e) => onChange(item.id, e.target.checked)} // Pass id and checked state
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer" // Tailwind for styling
          />
          <label className="ml-3 text-gray-700 cursor-pointer" htmlFor={item.id}> {/* Tailwind for styling */}
            {item.value}
          </label>
        </div>
      ))}
    </div>
  );
};

export const CheckboxFilter = ({ title, options, chosenValue = [], isOpenDefault = false, onChange }: TProps) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  // selectedValues is now derived from chosenValue prop
  // const [selectedValues, setSelectedValues] = useState<string[]>(chosenValue);

  // Sync internal isOpen state with prop if it's meant to be controlled externally
  // useEffect(() => {
  //   setIsOpen(isOpenDefault);
  // }, [isOpenDefault]);

  // If chosenValue can change externally, you might need an effect to sync it
  // But typically, the parent will pass the updated chosenValue, and this component just renders it.

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleCheckboxChange = useCallback((id: string, isChecked: boolean) => {
    // Determine new set of selected values
    const newSelectedValues = isChecked
      ? [...chosenValue, id]
      : chosenValue.filter((value) => value !== id);

    onChange(newSelectedValues); // Emit the new array of selected IDs to the parent
  }, [chosenValue, onChange]); // Depend on chosenValue and onChange

  return (
    <div className="py-4">
      <CheckboxFilterHeader title={title} isOpen={isOpen} onToggle={handleToggle} />
      {isOpen && (
        <CheckboxFilterContent
          options={options}
          chosenValue={chosenValue} // Pass the controlled prop
          onChange={handleCheckboxChange}
        />
      )}
    </div>
  );
};
