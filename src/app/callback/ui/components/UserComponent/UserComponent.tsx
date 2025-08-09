// src/app/callback/ui/components/UserComponent/UserComponent.tsx
'use client';

import { useEffect, useRef } from 'react';
import { signup } from '@/app/actions/auth';

type TProps = {
  accessToken?: string;
  accessTokenExpirationDate?: number; // epoch ms
  refreshToken?: string;
  refreshTokenExpirationDate?: number; // epoch ms
  redirectTo?: string;
};

export const UserComponent = ({
  accessToken,
  accessTokenExpirationDate,
  refreshToken,
  refreshTokenExpirationDate,
  redirectTo = '/profile',
}: TProps) => {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        if (!accessToken) {
          window.location.replace('/login?error=missing_access_token');
          return;
        }

        const res = await signup({
          accessToken,
          accessTokenExpirationDate,
          refreshToken,
          refreshTokenExpirationDate,
        });

        if (res?.success) {
          // ✅ force a full reload so cookies are included on the very first request
          window.location.replace(redirectTo);
        } else {
          window.location.replace('/login?error=signup_failed');
        }
      } catch (e) {
        console.error('UserComponent signup error:', e);
        window.location.replace('/login?error=signup_exception');
      }
    })();
  }, [accessToken, accessTokenExpirationDate, refreshToken, refreshTokenExpirationDate, redirectTo]);

  return <div>Finalizing login…</div>;
};
