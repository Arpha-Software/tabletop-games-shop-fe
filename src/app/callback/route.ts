// src/app/callback/route.ts
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const accessToken = searchParams.get('accessToken');
    const accessTokenExpirationDate = searchParams.get('accessTokenExpirationDate');
    const refreshToken = searchParams.get('refreshToken');
    const refreshTokenExpirationDate = searchParams.get('refreshTokenExpirationDate');

    const origin = request.nextUrl.origin;

    if (!accessToken || !accessTokenExpirationDate) {
        console.error("Callback Route Handler: OAuth callback is missing accessToken or accessTokenExpirationDate.");
        const loginUrl = new URL('/login', origin);
        loginUrl.searchParams.set('error', 'oauth_missing_token');
        return NextResponse.redirect(loginUrl);
    }

    console.log("Callback Route Handler: Processing OAuth callback. Attempting to set cookies and redirect.");

    try {
        const profileUrl = new URL('/profile', origin);
        const response = NextResponse.redirect(profileUrl);

        const isProduction = process.env.NODE_ENV === 'production';

        const commonCookieOptions: Parameters<typeof response.cookies.set>[2] = {
            path: '/',
            httpOnly: true,
            secure: isProduction, // Only set Secure flag in production
            sameSite: 'lax',
        };

        response.cookies.set('accessToken', accessToken, {
            ...commonCookieOptions,
            expires: new Date(accessTokenExpirationDate),
        });
        console.log("Callback Route Handler: Access token cookie set on response.");

        if (refreshToken && refreshTokenExpirationDate) {
            response.cookies.set('refreshToken', refreshToken, {
                ...commonCookieOptions,
                expires: new Date(refreshTokenExpirationDate),
            });
            console.log("Callback Route Handler: Refresh token cookie set on response.");
        } else {
            console.warn("Callback Route Handler: Refresh token or its expiration date not provided.");
        }

        console.log("Callback Route Handler: Cookies prepared. Returning redirect response to /profile.");
        return response;

    } catch (error: any) {
        console.error("Error during cookie setting or redirect preparation in Route Handler:", error.message, error.stack);
        const loginUrl = new URL('/login', origin);
        loginUrl.searchParams.set('error', 'oauth_processing_error');
        loginUrl.searchParams.set('message', error.message || "Failed to process OAuth callback.");
        return NextResponse.redirect(loginUrl);
    }
}