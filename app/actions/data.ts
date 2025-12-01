'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// --- STUDENT ACTIONS ---

export async function getStudentCourses() {
  const session = await getSession();
  if (!session || session.user.role !== 'student') return [];

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          teacher: true,
          enrollments: true, // to count students
        }
      }
    }
  });

  return enrollments.map(e => ({
    id: e.course.id,
    name: e.course.name,
    code: e.course.code,
    teacher: e.course.teacher.name,
    schedule: 'Por definir', // Schedule not in DB yet, mocked
    students: e.course.enrollments.length,
    progress: e.progress,
    color: 'bg-blue-500' // Mocked color
  }));
}

export async function getStudentGrades() {
  const session = await getSession();
  if (!session || session.user.role !== 'student') return [];

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          assignments: {
            include: {
              submissions: {
                where: { studentId: session.user.id }
              }
            }
          },
          exams: {
            include: {
              results: {
                where: { studentId: session.user.id }
              }
            }
          }
        }
      }
    }
  });

  return enrollments.map(e => {
    // Calculate weighted average
    let totalWeight = 0;
    let weightedSum = 0;
    const gradesDetails: any[] = [];

    // Process assignments
    e.course.assignments.forEach(a => {
      const submission = a.submissions[0];
      if (submission && submission.grade !== null) {
        const score = submission.grade;
        const max = a.totalPoints;
        const weight = a.weight;
        
        // Normalize score to 0-100 scale for calculation
        const normalizedScore = (score / max) * 100;
        
        weightedSum += normalizedScore * weight;
        totalWeight += weight;

        gradesDetails.push({
          type: a.title,
          score: score,
          max: max,
          weight: weight * 100, // Display as percentage
          date: a.dueDate.toLocaleDateString()
        });
      }
    });

    // Process exams
    e.course.exams.forEach(ex => {
      const result = ex.results[0];
      if (result && result.grade !== null) {
        const score = result.grade;
        const max = ex.totalPoints;
        const weight = ex.weight;

        const normalizedScore = (score / max) * 100;

        weightedSum += normalizedScore * weight;
        totalWeight += weight;

        gradesDetails.push({
          type: ex.title,
          score: score,
          max: max,
          weight: weight * 100,
          date: ex.date.toLocaleDateString()
        });
      }
    });

    const average = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
    
    // Determine trend (mock logic for now, real trend would need historical data)
    const trend = average >= 51 ? 'up' : 'down';

    return {
      id: e.course.id,
      name: e.course.name,
      code: e.course.code,
      grades: gradesDetails,
      average: parseFloat(average.toFixed(1)),
      trend: trend
    };
  });
}

// --- TEACHER ACTIONS ---

export async function getTeacherCourses() {
  const session = await getSession();
  if (!session || session.user.role !== 'teacher') return [];

  const courses = await prisma.course.findMany({
    where: { teacherId: session.user.id },
    include: {
      enrollments: true
    }
  });

  return courses.map(c => ({
    id: c.id,
    name: c.name,
    code: c.code,
    students: c.enrollments.length,
    description: c.description
  }));
}

// --- SHARED ACTIONS ---

export async function getCourseDetails(courseId: number) {
  const session = await getSession();
  if (!session) return null;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: true,
      assignments: {
        include: {
          submissions: {
            where: { studentId: session.user.id }
          }
        }
      },
      exams: {
        include: {
          results: {
            where: { studentId: session.user.id }
          }
        }
      },
      materials: true
    }
  });

  if (!course) return null;

  return {
    ...course,
    assignments: course.assignments.map(a => ({
      ...a,
      status: a.submissions.length > 0 ? a.submissions[0].status : 'pending'
    }))
  };
}

// --- ADMIN ACTIONS ---

export async function getAllUsers() {
  const session = await getSession();
  if (!session || session.user.role !== 'admin') return [];
  return prisma.user.findMany();
}

export async function getAllCourses() {
  const session = await getSession();
  if (!session || session.user.role !== 'admin') return [];
  return prisma.course.findMany({ include: { teacher: true } });
}
