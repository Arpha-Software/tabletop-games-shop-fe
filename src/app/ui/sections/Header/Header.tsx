'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FavoriteButton,
  ProfileButton,
  Navigation,
  CartButton,
  Container,
  Logo,
} from '@/app/ui/components';
import { HeaderSearch } from './components/HeaderSearch';

export const Header = () => {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50">
      {/* Top accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary/70 via-orange-300 to-primary/70" />

      <header className="relative backdrop-blur-xl bg-white/75 border-b border-gray-100">
        <Container className="py-3 md:py-4">
          <div className="relative flex items-center justify-between gap-3">
            {/* Left: Logo */}
            <Link href="/" aria-label="На головну" className="shrink-0">
              <Logo />
            </Link>

            <section className='flex items-center gap-10'>
              <div
                className={[
                  'hidden md:block transition-opacity duration-200',
                  // while search open, HeaderSearch overlays it; we fade it via css sibling selector
                  // (HeaderSearch is absolutely positioned and does not affect layout)
                ].join(' ')}
                // Note: Navigation itself stays simple; the fading is handled by overlaying search
              >
                <Navigation activePath={pathname} />
              </div>

              {/* Right: actions + collapsible search trigger */}
              <div className="relative flex items-center gap-2">
                {/* Search trigger + overlay lives here (absolutely positioned) */}
                <HeaderSearch className="relative h-12 w-48" />

                <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white shadow-sm p-1 px-3">
                  <ProfileButton />
                  <FavoriteButton />
                  <CartButton />
                </div>
              </div>
            </section>
          </div>
        </Container>
      </header>
    </div>
  );
};
