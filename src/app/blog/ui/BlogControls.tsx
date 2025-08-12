'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebouce';
import { cn } from '@/utils/helpers';

type Props = {
  categories: string[];
  initialSearch: string;
  initialCategory: string;
};

export const BlogControls = ({ categories, initialSearch, initialCategory }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory || 'Всі');
  const debounced = useDebounce(search, 350);

  // Build new URL only when something actually changes (prevents redundant replaces)
  const buildUrl = useMemo(() => {
    return (q: string, cat: string) => {
      const params = new URLSearchParams(sp.toString());
      if (q) params.set('search', q); else params.delete('search');
      if (cat) params.set('category', cat); else params.delete('category');
      params.set('page', '0');
      return `${pathname}?${params.toString()}`;
    };
  }, [pathname, sp]);

  useEffect(() => {
    const url = buildUrl(debounced, category);
    const current = `${pathname}?${sp.toString()}`;
    if (url !== current) {
      router.replace(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, category]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Пошук статей..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <SearchIcon />
        </span>

        {search && (
          <button
            type="button"
            aria-label="Очистити пошук"
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-3 flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            ×
          </button>
        )}
      </div>

      {/* Category chips */}
      {/* <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const active = cat === category;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full border text-xs font-medium transition",
                active
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div> */}
    </div>
  );
};

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="m21 20.3l-4.3-4.3a8 8 0 1 0-1.4 1.4L20.3 21L21 20.3zM10 16a6 6 0 1 1 0-12a6 6 0 0 1 0 12z"
      />
    </svg>
  );
}
