'use server';

import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitAssignment(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== 'student') {
    return { error: 'No autorizado' };
  }

  const assignmentId = parseInt(formData.get('assignmentId') as string);
  const fileUrl = formData.get('fileUrl') as string; // URL or text
  const content = formData.get('content') as string; // Optional description

  if (!assignmentId || !fileUrl) {
    return { error: 'Faltan campos requeridos' };
  }

  try {
    // Check if submission already exists
    const existing = await prisma.submission.findFirst({
      where: {
        assignmentId,
        studentId: session.user.id,
      },
    });

    if (existing) {
      // Update existing
      await prisma.submission.update({
        where: { id: existing.id },
        data: {
          fileUrl,
          content,
          submittedAt: new Date(),
          status: 'submitted',
        },
      });
    } else {
      // Create new
      await prisma.submission.create({
        data: {
          assignmentId,
          studentId: session.user.id,
          fileUrl,
          content,
          status: 'submitted',
        },
      });
    }
    
    revalidatePath('/courses');
    return { success: true };
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return { error: 'Error al entregar la tarea' };
  }
}
