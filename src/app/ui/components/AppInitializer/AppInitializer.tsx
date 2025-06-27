'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AppInitializer() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // We only want this to run once when the target page (e.g., '/') is loaded.
    // Check if we are on the page we redirected to (e.g., the homepage).
    if (pathname === '/' && sessionStorage.getItem('tabletopShopOpenCartOnLoad') === 'true') {
      // Clear the flag so it doesn't run again on subsequent visits to home.
      sessionStorage.removeItem('tabletopShopOpenCartOnLoad');

      // This client-side router.push('/cart') will now be intercepted
      // by your src/app/@cart/(.)cart/page.tsx and show the modal
      // over the current page (which is now '/').
      router.push('/cart');
    }
  }, [pathname, router]); // Re-run if pathname or router changes

  return null; // This component does not render any UI itself
}
