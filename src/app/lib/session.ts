import 'server-only';
import { cookies } from 'next/headers';

export async function createSession(accessToken: string, expiresAt?: any) {
  console.log('access token settttttttttttt', accessToken)
  console.log('expiresAt settttttttttttt', expiresAt)
  await cookies().set(
    'authToken',
    accessToken,
    {
      httpOnly: true,
      secure: true,
      expires: expiresAt || '',
      sameSite: 'lax',
      path: '/',
    }
  )
}