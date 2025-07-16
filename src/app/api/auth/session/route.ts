import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { accessToken, accessTokenExpirationDate } = await req.json();

    if (!accessToken || !accessTokenExpirationDate) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const expiresAt = new Date(accessTokenExpirationDate);

    // Create a response object
    const response = NextResponse.json({ success: true });

    // Set the cookie on the response
    await response.cookies.set(
      'authToken',
      accessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.your-production-domain.com' : 'localhost',
      }
    );

    // Add CORS headers to the response
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    // For debugging: log the headers to see the Set-Cookie header
    console.log('Response headers:', response.headers);

    return response;

  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}