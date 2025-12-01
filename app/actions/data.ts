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
      course: true
    }
  });

  return enrollments.map(e => ({
    courseName: e.course.name,
    grade: e.grade || 0, // Final grade
    status: (e.grade || 0) >= 51 ? 'Aprobado' : 'Reprobado',
    progress: e.progress
  }));
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
      exams: true,
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
