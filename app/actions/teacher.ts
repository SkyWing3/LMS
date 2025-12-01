'use server';

import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Resource and Assignment creation remain the same, simplifying for brevity if not changing
export async function createResource(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== 'teacher') {
    return { error: 'No autorizado' };
  }

  const courseId = parseInt(formData.get('courseId') as string);
  const title = formData.get('title') as string;
  const type = formData.get('type') as string;
  const url = formData.get('url') as string;
  const description = formData.get('description') as string;

  if (!courseId || !title || !type || !url) {
    return { error: 'Faltan campos requeridos' };
  }

  try {
    await prisma.material.create({
      data: { courseId, title, type, url },
    });
    revalidatePath('/courses');
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
        weight: 1.0,
      },
    });
    revalidatePath('/courses');
    return { success: true };
  } catch (error) {
    console.error('Error creating assignment:', error);
    return { error: 'Error al crear la tarea' };
  }
}

// UPDATED: Complex Exam Creation
export async function createExamWithQuestions(data: any) {
  const session = await getSession();
  if (!session || session.user.role !== 'teacher') {
    return { error: 'No autorizado' };
  }

  const { courseId, title, date, time, duration, totalPoints, questions } = data;

  if (!courseId || !title || !date || !time || !duration || !totalPoints || !questions) {
    return { error: 'Faltan campos requeridos' };
  }

  const dateTimeString = `${date}T${time}`;
  const examDate = new Date(dateTimeString);

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create Exam
      const exam = await tx.exam.create({
        data: {
          courseId: parseInt(courseId),
          title,
          date: examDate,
          duration: parseInt(duration),
          totalPoints: parseInt(totalPoints),
        },
      });

      // 2. Create Questions
      for (const q of questions) {
        const question = await tx.question.create({
          data: {
            examId: exam.id,
            text: q.text,
            type: q.type,
            points: parseInt(q.points),
          },
        });

        // 3. Create Options if Multiple Choice
        if (q.type === 'MULTIPLE_CHOICE' && q.options) {
          for (const opt of q.options) {
            await tx.questionOption.create({
              data: {
                questionId: question.id,
                text: opt.text,
                isCorrect: opt.isCorrect,
              },
            });
          }
        }
      }
    });

    revalidatePath('/courses');
    return { success: true };
  } catch (error) {
    console.error('Error creating exam with questions:', error);
    return { error: 'Error al crear el examen completo' };
  }
}

// NEW: Grading Actions
export async function getCourseSubmissions(courseId: number) {
    const session = await getSession();
    if (!session || session.user.role !== 'teacher') return null;
  
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        assignments: {
          include: {
            submissions: { include: { student: true } }
          }
        },
        exams: {
          include: {
            results: { include: { student: true } }
          }
        }
      }
    });
    return course;
  }

  export async function getExamSubmissionDetail(examResultId: number) {
    const session = await getSession();
    if (!session || session.user.role !== 'teacher') return null;

    return prisma.examResult.findUnique({
        where: { id: examResultId },
        include: {
            student: true,
            exam: {
                include: {
                    questions: {
                        include: {
                            options: true
                        }
                    }
                }
            },
            answers: true
        }
    });
}

export async function gradeExamSubmission(resultId: number, grade: number, feedback: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'teacher') return { error: 'Unauthorized' };

    try {
        await prisma.examResult.update({
            where: { id: resultId },
            data: {
                grade,
                feedback,
                status: 'graded'
            }
        });
        revalidatePath('/courses'); // simplified revalidation
        return { success: true };
    } catch (e) {
        return { error: 'Error grading exam' };
    }
}

export async function gradeAssignmentSubmission(submissionId: number, grade: number, feedback: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'teacher') return { error: 'Unauthorized' };

    try {
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                grade,
                feedback,
                status: 'graded'
            }
        });
        revalidatePath('/courses');
        return { success: true };
    } catch (e) {
        return { error: 'Error grading assignment' };
    }
}