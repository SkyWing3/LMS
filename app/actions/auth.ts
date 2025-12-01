'use server';

import { compare } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { encrypt, getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos' };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: 'Usuario no encontrado' };
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    return { error: 'Contraseña incorrecta' };
  }

  // Create session
  const sessionData = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };

  const token = await encrypt(sessionData);
  
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  return { success: true, user: sessionData.user };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return { success: true };
}

export async function getUser() {
  const session = await getSession();
  if (!session) return null;
  return session.user;
}
