// src/app/ui/sections/Header/components/HeaderSearch.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Input } from '@/app/ui/components/Input';
import SearchIcon from '@/public/icons/search.svg';
// import { useRouter } from 'next/navigation';

type Props = { className?: string };

export const HeaderSearch = ({ className }: Props) => {
  // const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(id);
    }
  }, [open]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // router.push(`/catalogue?searchQuery=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <div className={className}>
      {/* Collapsed pill (right side of header) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          'hidden md:flex items-center gap-2 pl-3 pr-3.5 rounded-full',
          'border border-gray-200 bg-white shadow-sm',
          'text-xs text-gray-600 hover:text-gray-800 transition-colors',
          open ? 'opacity-0 pointer-events-none' : 'opacity-100 h-full w-full',
        ].join(' ')}
        aria-label="Відкрити пошук"
      >
        <Image src={SearchIcon} alt="" width={16} height={16} />
        <span className="whitespace-nowrap">Пошук</span>
      </button>

      {/* Expanded overlay (FIX: centered, clamped width, no overflow) */}
      <div
        className={[
          'fixed z-[70]',
          // position under the sticky header; tweak if your header is taller/shorter
          'top-16 md:top-[72px]',
          'left-1/2 -translate-x-1/2',
          // clamp so it never creates horizontal scroll
          'w-[min(780px,calc(100vw-2rem))]',
          'transition-all duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        aria-hidden={!open}
      >
        <form
          onSubmit={onSubmit}
          className={[
            'relative rounded-2xl border border-gray-200 bg-white/95 backdrop-blur',
            'shadow-xl ring-1 ring-black/5',
            'transition-[transform,opacity] duration-300',
            open ? 'scale-100' : 'scale-95',
          ].join(' ')}
        >
          <div className="pl-10 pr-10 py-3">
            <Input
              ref={inputRef}
              placeholder="Пошук ігор, авторів, видавництв…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-transparent border-0 focus:ring-0 text-sm"
            />
          </div>

          {/* Leading icon */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <Image src={SearchIcon} alt="" width={18} height={18} />
          </span>

          {/* Trailing controls */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ('');
                  inputRef.current?.focus();
                }}
                className="group h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Очистити"
                title="Очистити"
              >
                {/* inline X */}
                <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" className="opacity-70 group-hover:opacity-100">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="hidden md:inline-flex items-center gap-1 text-[10px] text-gray-500 border border-gray-200 rounded px-1.5 py-0.5 hover:bg-gray-50"
              aria-label="Закрити (Escape)"
              title="Закрити (Escape)"
            >
              Esc
            </button>
          </div>
        </form>
      </div>

      {/* Click-catcher */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-[60] cursor-default md:cursor-auto"
          aria-label="Закрити пошук"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
};
