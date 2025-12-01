'use server';

import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createResource(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== 'teacher') {
    return { error: 'No autorizado' };
  }

  const courseId = parseInt(formData.get('courseId') as string);
  const title = formData.get('title') as string;
  const type = formData.get('type') as string;
  const url = formData.get('url') as string; // Assuming URL input for now
  const description = formData.get('description') as string;

  if (!courseId || !title || !type || !url) {
    return { error: 'Faltan campos requeridos' };
  }

  try {
    await prisma.material.create({
      data: {
        courseId,
        title,
        type,
        url,
        // description is not in schema for Material, ignoring for now or check schema
      },
    });
    revalidatePath('/courses'); // Revalidate necessary paths
    return { success: true };
  } catch (error) {
    console.error('Error creating resource:', error);
    return { error: 'Error al crear el recurso' };
  }
}

export async function createAssignment(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== 'teacher') {
    return { error: 'No autorizado' };
  }

  const courseId = parseInt(formData.get('courseId') as string);
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const dueDate = formData.get('dueDate') as string;
  const totalPoints = parseInt(formData.get('totalPoints') as string);

  if (!courseId || !title || !dueDate || !totalPoints) {
    return { error: 'Faltan campos requeridos' };
  }

  try {
    await prisma.assignment.create({
      data: {
        courseId,
        title,
        description,
        dueDate: new Date(dueDate),
        totalPoints,
        weight: 1.0, // Default weight
      },
    });
    revalidatePath('/courses');
    return { success: true };
  } catch (error) {
    console.error('Error creating assignment:', error);
    return { error: 'Error al crear la tarea' };
  }
}

export async function createExam(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== 'teacher') {
    return { error: 'No autorizado' };
  }

  const courseId = parseInt(formData.get('courseId') as string);
  const title = formData.get('title') as string;
  // description not in Exam schema
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const duration = parseInt(formData.get('duration') as string);
  const totalPoints = parseInt(formData.get('totalPoints') as string);

  if (!courseId || !title || !date || !time || !duration || !totalPoints) {
    return { error: 'Faltan campos requeridos' };
  }

  // Combine date and time
  const dateTimeString = `${date}T${time}`;
  const examDate = new Date(dateTimeString);

  try {
    await prisma.exam.create({
      data: {
        courseId,
        title,
        date: examDate,
        duration, // minutes or hours? Schema said minutes usually, let's assume minutes or handle effectively
        totalPoints,
      },
    });
    revalidatePath('/courses');
    return { success: true };
  } catch (error) {
    console.error('Error creating exam:', error);
    return { error: 'Error al crear el examen' };
  }
}
