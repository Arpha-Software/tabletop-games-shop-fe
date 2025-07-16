import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const protectedRoutes = ['/profile', '/favorites']
const publicRoutes = ['/login']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // const isProtectedRoute = protectedRoutes.includes(path);
  // const isPublicRoute = publicRoutes.includes(path);

  // const authToken = (await cookies()).get('authToken')?.value;

  // if (isProtectedRoute && !authToken) {
  //   return NextResponse.redirect(new URL('/login', req.nextUrl))
  // }

  // if (
  //   isPublicRoute &&
  //   authToken &&
  //   !req.nextUrl.pathname.startsWith('/profile')
  // ) {
  //   return NextResponse.redirect(new URL('/profile', req.nextUrl))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
