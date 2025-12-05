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

import { sendEmailNotification } from '@/lib/email';

export async function gradeExamSubmission(resultId: number, grade: number, feedback: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'teacher') return { error: 'Unauthorized' };

    try {
        const result = await prisma.examResult.update({
            where: { id: resultId },
            data: {
                grade,
                feedback,
                status: 'graded'
            },
            include: {
                student: true,
                exam: {
                    include: {
                        course: true
                    }
                }
            }
        });

        if (result.student.email && result.student.notifications) {
            await sendEmailNotification(
                result.student.email,
                `Calificación publicada: ${result.exam.title}`,
                `Hola ${result.student.name}, tu examen "${result.exam.title}" del curso "${result.exam.course.name}" ha sido calificado. Tu nota es: ${grade}. Comentarios: ${feedback || 'Sin comentarios'}.`,
                `<p>Hola <strong>${result.student.name}</strong>,</p>
                 <p>Tu examen "<strong>${result.exam.title}</strong>" del curso "<strong>${result.exam.course.name}</strong>" ha sido calificado.</p>
                 <p><strong>Nota:</strong> ${grade}</p>
                 <p><strong>Comentarios:</strong> ${feedback || 'Sin comentarios'}</p>`
            );
        }

        revalidatePath('/courses'); // simplified revalidation
        return { success: true };
    } catch (e) {
        console.error('Error grading exam:', e);
        return { error: 'Error grading exam' };
    }
}

export async function gradeAssignmentSubmission(submissionId: number, grade: number, feedback: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'teacher') return { error: 'Unauthorized' };

    try {
        const submission = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                grade,
                feedback,
                status: 'graded'
            },
            include: {
                student: true,
                assignment: {
                    include: {
                        course: true
                    }
                }
            }
        });

        if (submission.student.email && submission.student.notifications) {
             await sendEmailNotification(
                submission.student.email,
                `Calificación publicada: ${submission.assignment.title}`,
                `Hola ${submission.student.name}, tu tarea "${submission.assignment.title}" del curso "${submission.assignment.course.name}" ha sido calificada. Tu nota es: ${grade}. Comentarios: ${feedback || 'Sin comentarios'}.`,
                `<p>Hola <strong>${submission.student.name}</strong>,</p>
                 <p>Tu tarea "<strong>${submission.assignment.title}</strong>" del curso "<strong>${submission.assignment.course.name}</strong>" ha sido calificada.</p>
                 <p><strong>Nota:</strong> ${grade}</p>
                 <p><strong>Comentarios:</strong> ${feedback || 'Sin comentarios'}</p>`
            );
        }

        revalidatePath('/courses');
        return { success: true };
    } catch (e) {
        console.error('Error grading assignment:', e);
        return { error: 'Error grading assignment' };
    }
}