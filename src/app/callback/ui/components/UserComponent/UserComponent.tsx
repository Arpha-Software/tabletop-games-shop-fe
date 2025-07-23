// tabletop-games-shop-fe/src/app/callback/ui/components/UserComponent/UserComponent.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/app/actions/auth'; // Import the signup server action

type TProps = {
  accessToken: string;
}

export const UserComponent = ({ accessToken }: TProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleLogin = async () => { // Create an async function
      console.log('UserComponent: useEffect triggered with accessToken:', accessToken ? 'Present' : 'Missing');
      if (accessToken) {
        try {
          // Call the signup server action to establish the session
          console.log('UserComponent: Calling signup server action with accessToken...');
          // Assuming accessTokenExpirationDate can be omitted or handled with a default in signup
          const signupResult = await signup({ accessToken, accessTokenExpirationDate: Date.now() + 7 * 24 * 60 * 60 * 1000 }); // Passing a dummy expiration for now, ideally derived from access token itself or backend response

          if (signupResult.success) {
            console.log('UserComponent: Signup (session creation) successful. Redirecting to /profile');
            router.push('/profile');
          } else {
            console.error('UserComponent: Failed during signup/session creation:', signupResult);
            router.push(`/login?error='auth_process_failed'}`);
          }
        } catch (e: any) {
          console.error('UserComponent: Error during signup/session creation or redirect:', e);
          router.push('/login?error=auth_process_failed');
        }
      } else {
        console.log('UserComponent: No access token provided. Redirecting to login.');
        router.push('/login?error=auth_failed');
      }
    };

    handleLogin(); // Call the async function
  }, [accessToken, router]);

  return <div>Finalizing login...</div>;
};