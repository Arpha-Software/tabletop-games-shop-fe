'use client';

import { useState } from "react";

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
  chosenValue?: string[];
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
  chosenValue = [],
  onChange,
}: {
  options: { id: string; value: string }[];
  chosenValue?: string[];
  onChange: (id: string) => void;
}) => {
  return (
    <div>
      {options.map((item) => (
        <div key={item.id}>
          <input
            type="checkbox"
            id={item.id}
            value={item.value}
            checked={chosenValue.includes(item.id)}
            onChange={() => onChange(item.id)}
          />
          <label className="ml-3" htmlFor={item.id}>
            {item.value}
          </label>
        </div>
      ))}
    </div>
  );
};

export const CheckboxFilter = ({ title, options, chosenValue = [], isOpenDefault = false }: TProps) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [selectedValues, setSelectedValues] = useState<string[]>(chosenValue);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedValues((prevValues) =>
      prevValues.includes(id)
        ? prevValues.filter((value) => value !== id)
        : [...prevValues, id]
    );
  };

  return (
    <div className="py-4">
      <CheckboxFilterHeader title={title} isOpen={isOpen} onToggle={handleToggle} />
      {isOpen && <CheckboxFilterContent options={options} chosenValue={selectedValues} onChange={handleCheckboxChange}  />}
    </div>
  );
};
