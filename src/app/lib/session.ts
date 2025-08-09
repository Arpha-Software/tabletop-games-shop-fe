// src/app/lib/session.ts
import 'server-only';
import { cookies } from 'next/headers';

const isProd = process.env.NODE_ENV === 'production';

function ensureString(name: string, v: unknown): string {
  if (typeof v === 'string') return v;
  // try to salvage common shapes
  if (v && typeof v === 'object') {
    const obj = v as any;
    if (typeof obj.token === 'string') return obj.token;
    if (typeof obj.accessToken === 'string') return obj.accessToken;
  }
  throw new Error(`[cookies] ${name} must be a string, got: ${typeof v}`);
}

export async function setAccessToken(accessToken: unknown, expiresAt?: Date) {
  const value = ensureString('authToken', accessToken); // ✅ enforce string
  await cookies().set('authToken', value, {
    httpOnly: true,
    secure: isProd,
    ...(expiresAt ? { expires: expiresAt } : {}),
    sameSite: 'lax',
    path: '/',
  });
}

export async function setRefreshToken(refreshToken: unknown, expiresAt?: Date) {
  const value = ensureString('refreshToken', refreshToken); // ✅ enforce string
  await cookies().set('refreshToken', value, {
    httpOnly: true,
    secure: isProd,
    ...(expiresAt ? { expires: expiresAt } : {}),
    sameSite: 'lax',
    path: '/',
  });
}

export async function createSession(accessToken: unknown, accessExpiresAt?: Date, refreshToken?: unknown, refreshExpiresAt?: Date) {
  await setAccessToken(accessToken, accessExpiresAt);
  if (refreshToken) await setRefreshToken(refreshToken, refreshExpiresAt);
}

export async function clearSession() {
  const c = cookies();
  c.delete('authToken');
  c.delete('refreshToken');
}
