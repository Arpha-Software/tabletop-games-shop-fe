'use client';

import { FavoriteButton, ProfileButton, Navigation, CartButton, Container, Logo } from "@/app/ui/components";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50">
      {/* Top border accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary/70 via-orange-300 to-primary/70" />

      {/* Glass header */}
      <header className="backdrop-blur-xl bg-white/75 border-b border-gray-100">
        <Container className="py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Logo */}
            <Link href="/" aria-label="На головну" className="shrink-0">
              <Logo />
            </Link>

            {/* Center: Navigation (hide on small screens if you want) */}
            <nav className="hidden md:block">
              <Navigation activePath={pathname} />
            </nav>

            {/* Right: actions */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white shadow-sm p-1 px-4">
                <ProfileButton />
                <FavoriteButton />
                <CartButton />
              </div>
            </div>
          </div>
        </Container>
      </header>
    </div>
  );
};
