import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { encrypt } from '@/lib/auth';

const ALLOWED_DOMAIN = 'ucb.edu.bo';

function buildRedirect(origin: string, path = '/', error?: string) {
  const redirectUrl = new URL(path, origin);
  if (error) {
    redirectUrl.searchParams.set('authError', error);
  }
  return redirectUrl;
}

function cleanupOauthCookies(response: NextResponse) {
  response.cookies.delete('google_oauth_state');
  response.cookies.delete('google_oauth_return_to');
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const response = NextResponse.redirect(buildRedirect(request.nextUrl.origin, '/', 'google_config'));
    cleanupOauthCookies(response);
    return response;
  }

  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthError = searchParams.get('error');

  const storedState = request.cookies.get('google_oauth_state')?.value;
  const returnToCookie = request.cookies.get('google_oauth_return_to')?.value || '/';
  const returnTo = returnToCookie.startsWith('/') ? returnToCookie : '/';

  if (oauthError) {
    const response = NextResponse.redirect(buildRedirect(origin, '/', 'google_cancelled'));
    cleanupOauthCookies(response);
    return response;
  }

  if (!code || !state || !storedState || state !== storedState) {
    const response = NextResponse.redirect(buildRedirect(origin, '/', 'google_state'));
    cleanupOauthCookies(response);
    return response;
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('token_exchange_failed');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token as string | undefined;

    if (!accessToken) {
      throw new Error('token_missing');
    }

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('profile_failed');
    }

    const profile = await profileResponse.json();
    const email = (profile.email as string | undefined)?.toLowerCase();
    const emailVerified = Boolean(profile.email_verified);

    if (!email || !email.endsWith(`@${ALLOWED_DOMAIN}`) || !emailVerified) {
      const response = NextResponse.redirect(buildRedirect(origin, '/', 'google_domain'));
      cleanupOauthCookies(response);
      return response;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const response = NextResponse.redirect(buildRedirect(origin, '/', 'google_not_registered'));
      cleanupOauthCookies(response);
      return response;
    }

    const sessionData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };

    const token = await encrypt(sessionData);

    const response = NextResponse.redirect(buildRedirect(origin, returnTo));
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
      sameSite: 'lax',
    });

    cleanupOauthCookies(response);
    return response;
  } catch (error) {
    const response = NextResponse.redirect(buildRedirect(origin, '/', 'google_unknown'));
    cleanupOauthCookies(response);
    return response;
  }
}
