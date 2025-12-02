'use server'

import prisma from '@/lib/prisma'
import { getUser } from './auth'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { hash, compare } from 'bcryptjs'

export async function getUserProfile() {
  const sessionUser = await getUser()
  if (!sessionUser) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      career: true,
      semester: true,
      profilePicture: true,
      phone: true,
      address: true,
      notifications: true,
      darkMode: true,
      language: true,
    },
  })

  return user
}

export async function updateUserProfile(data: {
  name?: string
  email?: string
  phone?: string
  address?: string
  currentPassword?: string
  newPassword?: string
}) {
  const sessionUser = await getUser()
  if (!sessionUser) {
    return { success: false, error: 'No autenticado' }
  }

  try {
    // Prepare update data
    const updateData: any = {}
    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email
    if (data.phone !== undefined) updateData.phone = data.phone // Allow empty string to clear? Or just update if provided
    if (data.address !== undefined) updateData.address = data.address

    // Handle password update if provided
    if (data.currentPassword && data.newPassword) {
        const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
        if (!user) return { success: false, error: 'Usuario no encontrado' };

        const isValid = await compare(data.currentPassword, user.password);
        if (!isValid) {
            return { success: false, error: 'La contraseña actual es incorrecta' };
        }

        updateData.password = await hash(data.newPassword, 10);
    }

    if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
            where: { id: sessionUser.id },
            data: updateData,
        })
    }

    // Update session if critical info changed
    if ((data.name && data.name !== sessionUser.name) || (data.email && data.email !== sessionUser.email)) {
        const sessionData = {
            user: {
                id: sessionUser.id,
                email: data.email || sessionUser.email,
                name: data.name || sessionUser.name,
                role: sessionUser.role
            }
        }
        const token = await encrypt(sessionData)
        const cookieStore = await cookies()
        cookieStore.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        })
    }

    revalidatePath('/dashboard/profile')
    return { success: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: 'Error al actualizar el perfil' }
  }
}

export async function updateUserSettings(data: {
  notifications?: boolean
  darkMode?: boolean
  language?: string
}) {
  const sessionUser = await getUser()
  if (!sessionUser) {
    return { success: false, error: 'No autenticado' }
  }

  try {
    await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        notifications: data.notifications,
        darkMode: data.darkMode,
        language: data.language,
      },
    })
    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error) {
    console.error('Error updating settings:', error)
    return { success: false, error: 'Error al actualizar la configuración' }
  }
}