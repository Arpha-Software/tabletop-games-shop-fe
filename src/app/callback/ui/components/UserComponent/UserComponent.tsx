'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type TProps = {
  accessToken: string;
}

export const UserComponent = ({ accessToken }: TProps) => {
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      // Store the token in localStorage
      localStorage.setItem('authToken', accessToken);
      
      // Redirect to the profile page
      router.push('/profile');
    } else {
      // Handle cases where the token is missing
      router.push('/login?error=auth_failed');
    }
  }, [accessToken, router]);

  return <div>Finalizing login...</div>;
};
