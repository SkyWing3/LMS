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
    const totalAssignments = e.course.assignments.length;
    const totalExams = e.course.exams.length;
    const totalItems = totalAssignments + totalExams;

    const submittedAssignments = e.course.assignments.filter(a => a.submissions.length > 0).length;
    const submittedExams = e.course.exams.filter(ex => ex.results.length > 0).length;
    const completedItems = submittedAssignments + submittedExams;

    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
        id: e.course.id,
        name: e.course.name,
        code: e.course.code,
        teacher: e.course.teacher.name,
        schedule: 'Por definir', // Schedule not in DB yet, mocked
        students: e.course.enrollments.length,
        progress: progress,
        color: 'bg-blue-500' // Mocked color
    };
  });
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

// --- DASHBOARD ACTIONS ---

export async function getDashboardStats() {
  const session = await getSession();
  if (!session) return null;

  const userId = session.user.id;
  const role = session.user.role;

  if (role === 'student') {
    // 1. Active Courses
    const activeCoursesCount = await prisma.enrollment.count({
      where: { userId }
    });

    // 2. Pending Tasks (Assignments due in the future with no submission)
    const pendingTasksCount = await prisma.assignment.count({
      where: {
        course: {
          enrollments: {
            some: { userId }
          }
        },
        dueDate: { gte: new Date() },
        submissions: {
          none: { studentId: userId }
        }
      }
    });

    // 3. Average Grade (Simple average of final grades in enrollments)
    // Note: This is a simplification. Real calculation is complex.
    // Using existing getStudentGrades logic would be better but heavy. 
    // Let's calculate a simple average of all graded submissions for now.
    const gradedSubmissions = await prisma.submission.findMany({
      where: { studentId: userId, grade: { not: null } },
      select: { grade: true, assignment: { select: { totalPoints: true } } }
    });
    
    let totalScore = 0;
    let totalMax = 0;
    gradedSubmissions.forEach(s => {
        if (s.grade !== null) {
            totalScore += s.grade;
            totalMax += s.assignment.totalPoints;
        }
    });
    const averageGrade = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

    // 4. Upcoming Exams
    const upcomingExamsCount = await prisma.exam.count({
      where: {
        course: {
          enrollments: {
            some: { userId }
          }
        },
        date: { gte: new Date() }
      }
    });

    return {
      activeCourses: activeCoursesCount,
      pendingTasks: pendingTasksCount,
      averageGrade: averageGrade,
      upcomingExams: upcomingExamsCount
    };

  } else if (role === 'teacher') {
    // 1. Active Courses
    const activeCoursesCount = await prisma.course.count({
      where: { teacherId: userId }
    });

    // 2. Total Students (Unique students across all courses)
    const courses = await prisma.course.findMany({
      where: { teacherId: userId },
      select: { enrollments: { select: { userId: true } } }
    });
    const studentIds = new Set<number>();
    courses.forEach(c => c.enrollments.forEach(e => studentIds.add(e.userId)));
    const totalStudentsCount = studentIds.size;

    // 3. Pending Grades (Submissions with status 'submitted')
    const pendingGradesCount = await prisma.submission.count({
      where: {
        assignment: {
          course: { teacherId: userId }
        },
        status: 'submitted'
      }
    });

    return {
      activeCourses: activeCoursesCount,
      totalStudents: totalStudentsCount,
      pendingGrades: pendingGradesCount,
      upcomingClasses: 0 // Mocked for now
    };

  } else if (role === 'admin') {
    const totalUsers = await prisma.user.count();
    const totalCourses = await prisma.course.count();
    
    return {
      totalUsers,
      totalCourses,
      activeSessions: 15, // Mocked
      systemStatus: 'Normal' // Mocked
    };
  }
  
  return null;
}

export async function getRecentActivity() {
  const session = await getSession();
  if (!session) return [];
  
  const userId = session.user.id;
  const role = session.user.role;

  if (role === 'student') {
    // Combine recent graded submissions and new materials
    const recentGrades = await prisma.submission.findMany({
      where: { 
        studentId: userId, 
        status: 'graded' 
      },
      take: 3,
      orderBy: { submittedAt: 'desc' }, // Ideally gradedAt, but using submittedAt for now
      include: { assignment: { include: { course: true } } }
    });

    const recentMaterials = await prisma.material.findMany({
      where: {
        course: {
          enrollments: { some: { userId } }
        }
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { course: true }
    });

    const activity = [
        ...recentGrades.map(g => ({
            id: `grade-${g.id}`,
            type: 'grade',
            title: 'Nueva calificación',
            description: `Has recibido una calificación en ${g.assignment.title}`,
            course: g.assignment.course.name,
            time: g.submittedAt, // Should be gradedAt
            icon: 'award'
        })),
        ...recentMaterials.map(m => ({
            id: `material-${m.id}`,
            type: 'material',
            title: 'Nuevo material',
            description: `Se ha publicado nuevo material: ${m.title}`,
            course: m.course.name,
            time: m.createdAt,
            icon: 'book'
        }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

    return activity;

  } else if (role === 'teacher') {
    // Recent submissions from students
    const recentSubmissions = await prisma.submission.findMany({
        where: {
            assignment: {
                course: { teacherId: userId }
            },
            status: 'submitted'
        },
        take: 5,
        orderBy: { submittedAt: 'desc' },
        include: { 
            student: true,
            assignment: { include: { course: true } }
        }
    });

    return recentSubmissions.map(s => ({
        id: `sub-${s.id}`,
        type: 'submission',
        title: 'Nueva entrega',
        description: `${s.student.name} ha entregado ${s.assignment.title}`,
        course: s.assignment.course.name,
        time: s.submittedAt,
        icon: 'file-text'
    }));
  } else if (role === 'admin') {
    // Recent users and courses
    const newUsers = await prisma.user.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
    });
    
    return newUsers.map(u => ({
        id: `user-${u.id}`,
        type: 'user',
        title: 'Nuevo usuario',
        description: `Se ha registrado ${u.name} como ${u.role}`,
        course: 'Sistema',
        time: u.createdAt,
        icon: 'user-plus'
    }));
  }

  return [];
}

export async function getUpcomingEvents() {
    const session = await getSession();
    if (!session) return [];
    
    const userId = session.user.id;
    const role = session.user.role;
    
    if (role === 'student') {
        const assignments = await prisma.assignment.findMany({
            where: {
                course: { enrollments: { some: { userId } } },
                dueDate: { gte: new Date() }
            },
            take: 3,
            orderBy: { dueDate: 'asc' },
            include: { course: true }
        });

        const exams = await prisma.exam.findMany({
            where: {
                course: { enrollments: { some: { userId } } },
                date: { gte: new Date() }
            },
            take: 3,
            orderBy: { date: 'asc' },
            include: { course: true }
        });

        const events = [
            ...assignments.map(a => ({
                id: `assign-${a.id}`,
                title: a.title,
                date: a.dueDate,
                course: a.course.name,
                type: 'Tarea'
            })),
            ...exams.map(e => ({
                id: `exam-${e.id}`,
                title: e.title,
                date: e.date,
                course: e.course.name,
                type: 'Examen'
            }))
        ].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);

        return events;
    }
    // Mock for teacher/admin for now or implement similar logic
    return [];
}
