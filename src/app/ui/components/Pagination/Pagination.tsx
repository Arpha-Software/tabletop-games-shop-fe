// src/app/ui/components/Pagination/Pagination.tsx
'use client';

import Image from 'next/image';
import { cn } from '@/utils/helpers';
import ArrowIcon from '@/public/icons/arrowbottom.svg';

type PaginationProps = {
  currentPage: number;     // zero-based
  totalPages: number;      // total count
  className?: string;
  onPageChange: (page: number) => void; // expects zero-based
};

type PageToken = number | 'dots';

function buildPageTokens(current: number, total: number, siblingCount = 1): PageToken[] {
  // Always show first & last, show siblings around current, collapse others with dots
  const first = 0;
  const last = Math.max(0, total - 1);

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i);
  }

  const start = Math.max(first + 1, current - siblingCount);
  const end = Math.min(last - 1, current + siblingCount);

  const tokens: PageToken[] = [first];
  if (start > first + 1) tokens.push('dots');
  for (let p = start; p <= end; p++) tokens.push(p);
  if (end < last - 1) tokens.push('dots');
  tokens.push(last);
  return tokens;
}

export const Pagination = ({
  currentPage,
  totalPages,
  className,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const canPrev = currentPage > 0;
  const canNext = currentPage < totalPages - 1;
  const tokens = buildPageTokens(currentPage, totalPages, 1);

  const go = (p: number) => {
    if (p >= 0 && p < totalPages && p !== currentPage) onPageChange(p);
  };

  return (
    <nav
      role="navigation"
      aria-label="Пагінація"
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white shadow-sm p-1',
        className
      )}
    >
      {/* Prev */}
      <button
        type="button"
        onClick={() => go(currentPage - 1)}
        disabled={!canPrev}
        className={cn(
          'inline-flex items-center justify-center h-9 w-9 rounded-full transition-colors',
          canPrev ? 'text-gray-700 hover:bg-primary/10' : 'text-gray-300 cursor-not-allowed'
        )}
        aria-label="Попередня сторінка"
      >
        <Image src={ArrowIcon} alt="" className="-rotate-90" />
      </button>

      {/* Pages */}
      <ul className="flex items-center gap-1">
        {tokens.map((t, i) =>
          t === 'dots' ? (
            <li
              key={`dots-${i}`}
              className="px-3 h-9 min-w-9 inline-flex items-center justify-center text-sm text-gray-400"
              aria-hidden="true"
            >
              …
            </li>
          ) : (
            <li key={t}>
              <button
                type="button"
                onClick={() => go(t)}
                aria-current={t === currentPage ? 'page' : undefined}
                className={cn(
                  'h-9 min-w-9 px-3 rounded-full text-sm font-medium transition-colors',
                  t === currentPage
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-primary/10'
                )}
              >
                {t + 1}
              </button>
            </li>
          )
        )}
      </ul>

      {/* Next */}
      <button
        type="button"
        onClick={() => go(currentPage + 1)}
        disabled={!canNext}
        className={cn(
          'inline-flex items-center justify-center h-9 w-9 rounded-full transition-colors',
          canNext ? 'text-gray-700 hover:bg-primary/10' : 'text-gray-300 cursor-not-allowed'
        )}
        aria-label="Наступна сторінка"
      >
        <Image src={ArrowIcon} alt="" className="rotate-90" />
      </button>
    </nav>
  );
};
