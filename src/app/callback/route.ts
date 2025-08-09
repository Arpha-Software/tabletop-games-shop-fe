// src/app/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';

// src/app/callback/route.ts
const toDateUTC = (iso?: string) => {
  if (!iso) return undefined;
  const normalized = /\dZ$/i.test(iso) ? iso : `${iso}Z`; // ensure UTC
  const t = Date.parse(normalized);
  return Number.isNaN(t) ? undefined : new Date(t);
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sp = url.searchParams;

  const accessToken = sp.get('accessToken') ?? undefined;
  const accessTokenExpirationDate = sp.get('accessTokenExpirationDate') ?? undefined;
  const refreshToken = sp.get('refreshToken') ?? undefined;
  const refreshTokenExpirationDate = sp.get('refreshTokenExpirationDate') ?? undefined;
  const redirectTo = sp.get('redirectTo') || '/profile';

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login?error=missing_access_token', req.url));
  }

  const res = NextResponse.redirect(new URL(redirectTo, req.url));
  const common = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' };

  const accessExp = toDateUTC(accessTokenExpirationDate);
  res.cookies.set('authToken', accessToken, { ...common, ...(accessExp ? { expires: accessExp } : {}) });

  if (refreshToken) {
    const refreshExp = toDateUTC(refreshTokenExpirationDate);
    res.cookies.set('refreshToken', refreshToken, { ...common, ...(refreshExp ? { expires: refreshExp } : {}) });
  }

  return res;
}
