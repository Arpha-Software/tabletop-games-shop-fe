// src/app/catalogue/ui/components/SelectFilter/SelectFilter.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { cn } from '@/utils/helpers';
import ArrowIcon from '@/public/icons/arrowbottom.svg';

type Option = { value: string; label: string };

type TProps = {
  options: Option[];
  className?: string;
  selectedValue?: string;
  onValueChange?: (value: string) => void;
};

export const SelectFilter = ({
  options,
  className,
  selectedValue,
  onValueChange,
}: TProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Current option object
  const selectedOption = useMemo<Option | undefined>(() => {
    if (!options?.length) return undefined;
    return options.find((o) => o.value === selectedValue) ?? options[0];
  }, [options, selectedValue]);

  const [current, setCurrent] = useState<Option | undefined>(selectedOption);

  useEffect(() => setCurrent(selectedOption), [selectedOption]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen]);

  // Keyboard support
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!options?.length) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((p) => !p);
    }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
    if (e.key === 'Escape') setIsOpen(false);
  };

  const toggle = useCallback(() => {
    if (!options?.length) return;
    setIsOpen((p) => !p);
  }, [options]);

  const choose = useCallback(
    (opt: Option) => {
      setCurrent(opt);
      onValueChange?.(opt.value);
      setIsOpen(false);
    },
    [onValueChange]
  );

  return (
    <div ref={rootRef} className={cn('relative z-10', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={toggle}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'h-10 w-full rounded-full border bg-white px-3 text-sm',
          'border-gray-200 text-gray-700 shadow-sm',
          'hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
          !options?.length && 'opacity-60 cursor-not-allowed'
        )}
      >
        <span className="flex items-center justify-between gap-2">
          <span className="truncate">{current?.label ?? '—'}</span>
          <Image
            src={ArrowIcon}
            alt="Відкрити"
            width={16}
            height={16}
            className={cn('transition-transform', isOpen ? 'rotate-0' : 'rotate-180')}
          />
        </span>
      </button>

      {/* Dropdown */}
      <ul
        role="listbox"
        className={cn(
          'absolute right-0 mt-2 w-[min(220px,90vw)] overflow-hidden',
          'rounded-xl border border-gray-200 bg-white shadow-lg',
          'transition-all duration-200 origin-top',
          isOpen ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
        )}
      >
        {(options ?? []).map((opt) => {
          const active = opt.value === current?.value;
          return (
            <li
              key={opt.value}
              role="option"
              aria-selected={active}
              onClick={() => choose(opt)}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer flex items-center justify-between',
                active ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50'
              )}
            >
              <span className="truncate">{opt.label}</span>
              {active && <span className="text-primary text-base leading-none">•</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
