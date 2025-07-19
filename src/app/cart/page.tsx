'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from '@/app/ui/components/Loader';

export default function CartPageRedirector() {
  const router = useRouter();

  useEffect(() => {
    console.log('CartPageRedirector: Setting flag and redirecting to /');
    sessionStorage.setItem('tabletopShopOpenCartOnLoad', 'true');

    router.replace('/');

  }, [router]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-secondary-50 z-[100]">
      <Loader />
      <p className="mt-24 text-lg text-gray-700">Завантаження кошика...</p>
    </div>
  );
}
