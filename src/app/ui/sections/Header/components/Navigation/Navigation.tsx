// src/app/ui/sections/Header/components/Navigation/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { links } from './links';
import styles from './Navigation.module.scss';

export const Navigation = ({ activePath }: { activePath?: string }) => {
  const pathname = usePathname();
  const current = activePath ?? pathname ?? '/';

  // Refs for keyboard nav
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const idx = refs.current.findIndex((el) => el === document.activeElement);
    const count = links.length;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (idx + 1 + count) % count;
      refs.current[next]?.focus();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (idx - 1 + count) % count;
      refs.current[prev]?.focus();
    }
    if (e.key === 'Home') {
      e.preventDefault();
      refs.current[0]?.focus();
    }
    if (e.key === 'End') {
      e.preventDefault();
      refs.current[count - 1]?.focus();
    }
  };

  return (
    <nav aria-label="Головна навігація">
      <ul className="flex items-center gap-2 md:gap-6" onKeyDown={onKeyDown}>
        {links.map(({ url, label }, i) => {
          const active = current.startsWith(url);
          return (
            <li key={url}>
              <Link
                href={url}
                ref={(el) => {
                  // ✅ no return value here
                  refs.current[i] = el;
                }}
                aria-current={active ? 'page' : undefined}
                className={[
                  styles.navLink,
                  'relative group inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium',
                  'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                  active ? 'text-primary' : 'text-gray-700 hover:text-primary',
                ].join(' ')}
              >
                {/* hover pill */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <span className="relative">{label}</span>

                {/* active underline */}
                {active && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-2 right-2 -bottom-1 h-[2px] bg-primary rounded-full"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
