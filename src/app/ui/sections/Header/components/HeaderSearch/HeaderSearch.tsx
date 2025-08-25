'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/app/ui/components/Input';
import SearchIcon from '@/public/icons/search.svg';
import { searchProductsQuick } from '@/app/actions/products';
import { TProduct } from '@/utils/types';
import { cn } from '@/utils/helpers';

type Props = { className?: string };

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 opacity-70" viewBox="0 0 24 24" aria-hidden>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const HeaderSearch = ({ className }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TProduct[]>([]);
  const [focusedIdx, setFocusedIdx] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debRef = useRef<number | null>(null);

  // hotkey
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

  // focus input when opening
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(id);
    }
  }, [open]);

  // click-outside closes only the dropdown overlay (not the whole screen catcher)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // debounced query
  useEffect(() => {
    setFocusedIdx(0);
    if (debRef.current) window.clearTimeout(debRef.current);
    if (!open) return;
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    debRef.current = window.setTimeout(async () => {
      try {
        // cancel previous
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setLoading(true);
        const resp = await searchProductsQuick(q, 8);
        if (resp.success) setResults(resp.data || []);
        else setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debRef.current) window.clearTimeout(debRef.current);
    };
  }, [q, open]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Go to catalogue search page with prefilled query
    router.push(`/catalogue?searchQuery=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length) {
        const target = results[focusedIdx] ?? results[0];
        router.push(`/catalogue/${target.id}`);
        setOpen(false);
      } else {
        // fallback: submit full search
        onSubmit(e as any);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const previewOf = (p: TProduct) => {
    const media: any = (p as any).media || {};
    return media.mainImgLink || media.photos?.[0] || '';
  };

  const priceOf = (p: TProduct) => (typeof p.price === 'number' ? `${p.price.toLocaleString('uk-UA')} ₴` : '—');

  const showDropdown = open;

  return (
    <div className={className}>
      {/* Collapsed pill (right side of header) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'hidden md:flex items-center gap-2 pl-3 pr-3.5 rounded-full',
          'border border-gray-200 bg-white shadow-sm',
          'text-xs text-gray-600 hover:text-gray-800 transition-colors',
          open ? 'opacity-0 pointer-events-none' : 'opacity-100 h-full w-full'
        )}
        aria-label="Відкрити пошук"
      >
        <Image src={SearchIcon} alt="" width={16} height={16} />
        <span className="whitespace-nowrap">Пошук</span>
      </button>

      {/* Overlay container (centered) */}
      <div
        className={cn(
          'fixed z-[70]',
          'top-16 md:top-[72px]',
          'left-1/2 -translate-x-1/2',
          'w-[min(780px,calc(100vw-2rem))]',
          'transition-all duration-300',
          showDropdown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden={!showDropdown}
        ref={boxRef}
      >
        {/* Search bar */}
        <form
          onSubmit={onSubmit}
          className={cn(
            'relative rounded-2xl border border-gray-200 bg-white/95 backdrop-blur',
            'shadow-xl ring-1 ring-black/5',
            'transition-[transform,opacity] duration-300',
            showDropdown ? 'scale-100' : 'scale-95'
          )}
        >
          <div className="pl-10 pr-10 py-3">
            <Input
              ref={inputRef}
              placeholder="Пошук ігор, авторів, видавництв…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full bg-transparent border-0 focus:ring-0 text-sm"
            />
          </div>

          {/* Leading icon */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80">
            <Image src={SearchIcon} alt="" width={18} height={18} />
          </span>

          {/* Trailing controls */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {loading ? <Spinner /> : null}
            {q && !loading && (
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
                <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden className="opacity-70 group-hover:opacity-100">
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

        {/* Results dropdown */}
        <div
          className={cn(
            'mt-2 rounded-2xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden',
            // hide block if completely empty AND not loading AND no query
            (!q.trim() && !loading) || !showDropdown ? 'hidden' : 'block'
          )}
        >
          {/* Empty / results */}
          <ul className="max-h-[360px] overflow-y-auto py-1">
            {(!loading && q.trim() && results.length === 0) && (
              <li className="px-4 py-3 text-sm text-gray-500">Нічого не знайдено</li>
            )}

            {results.map((p, i) => {
              const thumb = previewOf(p);
              const active = i === focusedIdx;
              return (
                <li key={p.id}>
                  <Link
                    href={`/catalogue/${p.id}`}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 text-sm',
                      active ? 'bg-gray-50' : 'hover:bg-gray-50'
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <div className="h-10 w-10 rounded-md border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt={p.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {priceOf(p)} {/* · add more minimal meta here if needed */}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Footer: view all */}
          {q.trim() && (
            <div className="border-t border-gray-100 bg-gray-50/60 px-3 py-2 text-right">
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => {
                  router.push(`/catalogue?searchQuery=${encodeURIComponent(q.trim())}`);
                  setOpen(false);
                }}
              >
                Показати всі результати
              </button>
            </div>
          )}
        </div>
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
