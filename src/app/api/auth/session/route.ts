import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { accessToken, accessTokenExpirationDate } = await req.json();

    if (!accessToken || !accessTokenExpirationDate) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const expiresAt = new Date(accessTokenExpirationDate);

    const response = NextResponse.json({ success: true });

    await response.cookies.set(
      'authToken',
      accessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
      }
    );

    console.log('Response headers:', response.headers);

    return response;

  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
