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

// NEW: Student Exam Actions
export async function getExamDetailsForStudent(examId: number) {
    const session = await getSession();
    if (!session || session.user.role !== 'student') return null;

    return prisma.exam.findUnique({
        where: { id: examId },
        include: {
            questions: {
                include: {
                    options: {
                        select: { id: true, text: true } // Hide isCorrect
                    }
                }
            }
        }
    });
}

export async function submitExam(examId: number, answers: any[]) {
    const session = await getSession();
    if (!session || session.user.role !== 'student') return { error: 'Unauthorized' };

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Create Result
            const result = await tx.examResult.create({
                data: {
                    examId,
                    studentId: session.user.id,
                    status: 'submitted',
                    grade: 0 // Placeholder, will update after auto-grading or manual
                }
            });

            // 2. Save Answers
            for (const ans of answers) {
                await tx.studentAnswer.create({
                    data: {
                        examResultId: result.id,
                        questionId: ans.questionId,
                        text: ans.text || null, // For Open
                        optionId: ans.optionId || null // For MC
                    }
                });
            }
            
            // Optional: Auto-grade MC questions here if desired
        });

        revalidatePath('/courses');
        return { success: true };
    } catch (error) {
        console.error("Error submitting exam", error);
        return { error: 'Failed to submit exam' };
    }
}