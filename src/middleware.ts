import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  // No auth logic here since we use localStorage (client-side only)
  // Auth protection is handled client-side in components and API calls
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
