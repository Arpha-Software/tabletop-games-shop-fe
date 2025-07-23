import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const authToken = req.cookies.get('authToken'); // Get the auth token from cookies

  const { pathname } = req.nextUrl;

  // Define paths that authenticated users should not access
  const protectedAuthPaths = ['/login', '/callback'];

  // If the user has an auth token and is trying to access a protected auth path,
  // redirect them to the profile page.
  if (authToken && protectedAuthPaths.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/profile'; // Redirect to the profile page
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed if no redirection is needed
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all paths except API routes, static files, and image files.
  // We specifically want it to run on /login and /callback.
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
