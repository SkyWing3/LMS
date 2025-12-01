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

  const courseIdVal = formData.get('courseId');
  const title = formData.get('title') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const durationVal = formData.get('duration');
  const totalPointsVal = formData.get('totalPoints');

  if (!courseIdVal) return { error: 'Falta el ID del curso' };
  if (!title) return { error: 'Falta el título' };
  if (!date) return { error: 'Falta la fecha' };
  if (!time) return { error: 'Falta la hora' };
  if (!durationVal) return { error: 'Falta la duración' };
  if (!totalPointsVal) return { error: 'Faltan los puntos totales' };

  const courseId = parseInt(courseIdVal as string);
  const duration = parseInt(durationVal as string);
  const totalPoints = parseInt(totalPointsVal as string);

  if (isNaN(courseId)) return { error: 'ID de curso inválido' };
  if (isNaN(duration)) return { error: 'Duración inválida' };
  if (isNaN(totalPoints)) return { error: 'Puntos totales inválidos' };

  // Combine date and time
  const dateTimeString = `${date}T${time}`;
  const examDate = new Date(dateTimeString);

  if (isNaN(examDate.getTime())) {
      return { error: 'Fecha u hora inválida' };
  }

  try {
    await prisma.exam.create({
      data: {
        courseId,
        title,
        date: examDate,
        duration,
        totalPoints,
        weight: 1.0, // Default weight
      },
    });
    revalidatePath('/courses');
    return { success: true };
  } catch (error) {
    console.error('Error creating exam:', error);
    return { error: 'Error al crear el examen' };
  }
}
