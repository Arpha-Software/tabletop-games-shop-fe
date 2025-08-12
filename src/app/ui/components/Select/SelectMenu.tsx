'use client';

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/utils/helpers';

export type SelectOption = {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
};

type Props = {
  name?: string;                 // for form POST (hidden input)
  value?: string | null;
  onChange?: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  withChevron?: boolean;
};

export const SelectMenu = forwardRef<HTMLButtonElement, Props>(function SelectMenu(
  {
    name,
    value,
    onChange,
    options,
    placeholder = 'Обрати…',
    disabled,
    className,
    menuClassName,
    withChevron = true,
  },
  ref
) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const composedRef = (node: HTMLButtonElement) => {
    btnRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as any).current = node;
  };

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const idxByValue = useMemo(
    () => options.findIndex(o => o.value === value),
    [options, value]
  );
  const label = idxByValue >= 0 ? options[idxByValue].label : '';

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (btnRef.current?.contains(t as Node)) return;
      if (listRef.current?.contains(t as Node)) return;
      close();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, close]);

  // open → align activeIndex to current value
  useEffect(() => {
    if (!open) return;
    const initial = idxByValue >= 0 ? idxByValue : options.findIndex(o => !o.disabled);
    setActiveIndex(initial);
    // ensure into view
    queueMicrotask(() => {
      const el = listRef.current?.querySelector<HTMLLIElement>(`li[data-index="${initial}"]`);
      el?.scrollIntoView({ block: 'nearest' });
    });
  }, [open, idxByValue, options]);

  const focusNext = (dir: 1 | -1) => {
    if (!open) setOpen(true);
    let i = activeIndex;
    for (let step = 0; step < options.length; step++) {
      i = (i + dir + options.length) % options.length;
      if (!options[i].disabled) { setActiveIndex(i); break; }
    }
    queueMicrotask(() => {
      const el = listRef.current?.querySelector<HTMLLIElement>(`li[data-index="${i}"]`);
      el?.scrollIntoView({ block: 'nearest' });
    });
  };

  const selectAt = (i: number) => {
    const opt = options[i];
    if (!opt || opt.disabled) return;
    onChange?.(opt.value);
    close();
    setFocused(false);
    btnRef.current?.blur();
  };

  return (
    <div className={cn('relative', className)}>
      {/* hidden input for forms */}
      {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}

      <button
        ref={composedRef}
        type="button"
        disabled={disabled}
        className={cn(
          'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-900',
          'placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-primary/40 focus:border-primary/50',
          'relative pr-9', // space for chevron
          disabled && 'cursor-not-allowed opacity-60'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        onFocus={() => { setFocused(true); }}
        onBlur={() => setTimeout(() => { setFocused(false); setOpen(false); }, 120)}
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); focusNext(1); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); focusNext(-1); }
          else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!open) setOpen(true);
            else if (activeIndex >= 0) selectAt(activeIndex);
          } else if (e.key === 'Escape') {
            e.preventDefault();
            close();
          }
        }}
      >
        <span className={cn('block text-left truncate', !label && 'text-gray-400')}>
          {label || placeholder}
        </span>

        {withChevron && (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2',
              'inline-flex h-4 w-4 items-center justify-center'
            )}
          >
            {/* chevron icon */}
            <svg
              className={cn('h-4 w-4 transition-transform', open ? 'rotate-180' : 'rotate-0')}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
            </svg>
          </span>
        )}
      </button>

      {open && (
        <div className={cn('absolute left-0 right-0 top-full mt-1 z-50', menuClassName)}>
          <div className="rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
            <ul
              ref={listRef}
              role="listbox"
              className="max-h-64 overflow-y-auto py-1"
              aria-activedescendant={activeIndex >= 0 ? `opt-${activeIndex}` : undefined}
            >
              {options.map((o, i) => {
                const selected = o.value === value;
                const active = i === activeIndex;
                return (
                  <li
                    id={`opt-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={selected}
                    key={o.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (o.disabled) return;
                      selectAt(i);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      'px-3 py-2 text-sm cursor-pointer flex items-center gap-2',
                      o.disabled && 'opacity-50 cursor-not-allowed',
                      active ? 'bg-gray-50' : 'bg-white'
                    )}
                  >
                    <span className={cn('truncate', selected && 'font-medium')}>{o.label}</span>
                    {o.hint ? <span className="ml-auto text-[11px] text-gray-400">{o.hint}</span> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
});
