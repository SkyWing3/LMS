import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_DOMAIN = 'ucb.edu.bo';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: 'Google OAuth no está configurado en el servidor' },
      { status: 500 }
    );
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`;
  const state = randomBytes(32).toString('hex');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('prompt', 'select_account');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('hd', ALLOWED_DOMAIN);

  const returnToParam = request.nextUrl.searchParams.get('returnTo') || '/';
  const returnTo = returnToParam.startsWith('/') ? returnToParam : '/';

  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set({
    name: 'google_oauth_state',
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  });
  response.cookies.set({
    name: 'google_oauth_return_to',
    value: returnTo,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  });

  return response;
}

