// src/app/catalogue/[product]/ui/components/Gallery/Gallery.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Preview } from './components/Preview';
import { cn } from '@/utils/helpers';

type TProps = { images: string[] };

const BoxPlaceholder = ({ className }: { className?: string }) => (
  <div className={cn('grid place-items-center rounded-xl border border-secondary-100 bg-secondary-50 text-gray-400', className)}>
    <span className="text-xs">Немає фото</span>
  </div>
);

export const Gallery = ({ images }: TProps) => {
  const normalized = (images || []).filter((s) => !!s && typeof s === 'string');
  const hasAny = normalized.length > 0;

  const [activeIndex, setActiveIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const openPreview = (idx: number) => {
    if (!hasAny) return;
    setActiveIndex(idx);
    setShowPreview(true);
  };

  return (
    <>
      <div className="flex gap-4 md:gap-4">
        {/* MAIN (always square) */}
        <button
          type="button"
          onClick={() => openPreview(activeIndex)}
          aria-label="Відкрити перегляд зображення"
          className={cn(
            'relative overflow-hidden rounded-xl ring-1 ring-gray-200 bg-white',
            'w-[340px] md:w-[420px] lg:w-[516px]',
            'aspect-square' // <-- this ensures width == height
          )}
        >
          {hasAny ? (
            <Image
              src={normalized[Math.min(activeIndex, normalized.length - 1)]}
              alt="Фото товару"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 88vw, (max-width: 1024px) 420px, 516px"
              priority
            />
          ) : (
            <BoxPlaceholder className="w-full h-full" />
          )}
        </button>

        {/* THUMBS (VERTICAL, MD+) */}
        <div className="hidden md:flex md:flex-col gap-3 flex-none w-[96px] lg:w-[120px]">
          {Array.from({ length: 4 }).map((_, i) => {
            const idx = i;
            const src = normalized[idx];
            const active = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Зображення ${idx + 1}`}
                className={cn(
                  'relative w-full aspect-square rounded-lg overflow-hidden ring-1 ring-gray-200 transition',
                  'hover:ring-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30',
                  active ? 'ring-2 ring-primary' : ''
                )}
              >
                {src ? (
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 96px, 120px"
                  />
                ) : (
                  <BoxPlaceholder className="w-full h-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MOBILE THUMBS */}
      <div className="md:hidden mt-3 -mx-1">
        <div className="flex gap-3 overflow-x-auto px-1 snap-x snap-mandatory scrollbar-thin">
          {(hasAny ? normalized : Array.from({ length: 3 })).map((src, idx) => {
            const active = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Зображення ${idx + 1}`}
                className={cn(
                  'relative shrink-0 snap-start rounded-lg overflow-hidden ring-1 ring-gray-200 transition',
                  'hover:ring-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30',
                  active ? 'ring-2 ring-primary' : ''
                )}
                style={{ width: 72, height: 72 }}
              >
                {src ? (
                  <Image src={String(src)} alt="" fill className="object-cover" sizes="72px" />
                ) : (
                  <BoxPlaceholder className="w-full h-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {showPreview &&
        hasAny &&
        createPortal(
          <Preview images={normalized} initialImageIndex={activeIndex} onClose={() => setShowPreview(false)} />,
          document.body
        )}
    </>
  );
};
