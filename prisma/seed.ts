import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('123456', 12)

  // 1. Create Users
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'Juan Carlos Pérez',
      password,
      role: 'student',
      career: 'Ingeniería de Sistemas',
      semester: '6to Semestre'
    },
  })

  const franco = await prisma.user.upsert({
    where: { email: 'franco.parra@ucb.edu.bo' },
    update: {},
    create: {
      email: 'franco.parra@ucb.edu.bo',
      name: 'Franco Parra Aguilar',
      password,
      role: 'student',
      career: 'Ingeniería de Sistemas',
      semester: '6to Semestre'
    },
  })

  const mainTeacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      name: 'Dr. Carlos Méndez',
      password,
      role: 'teacher',
      department: 'Informática'
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Roberto Administrador',
      password,
      role: 'admin'
    },
  })

  // Other Teachers
  const teachersData = [
    { name: 'Dra. María González', email: 'maria@example.com' },
    { name: 'Lic. Roberto Fernández', email: 'roberto.f@example.com' },
    { name: 'Ing. Ana Morales', email: 'ana@example.com' },
    { name: 'Ing. Juan Pérez', email: 'juan.p@example.com' },
    { name: 'Dr. Luis Ramírez', email: 'luis@example.com' },
  ]

  const otherTeachers = []
  for (const t of teachersData) {
    const teacher = await prisma.user.upsert({
      where: { email: t.email },
      update: {},
      create: {
        email: t.email,
        name: t.name,
        password,
        role: 'teacher',
        department: 'Informática'
      },
    })
    otherTeachers.push(teacher)
  }

  // 2. Create Courses
  const coursesData = [
    { name: 'Programación Web', code: 'INF-342', teacherId: mainTeacher.id, progress: 75 },
    { name: 'Bases de Datos', code: 'INF-320', teacherId: otherTeachers[0].id, progress: 65 },
    { name: 'Cálculo II', code: 'MAT-202', teacherId: otherTeachers[1].id, progress: 70 },
    { name: 'Ingeniería de Software', code: 'INF-350', teacherId: otherTeachers[2].id, progress: 80 },
    { name: 'Redes de Computadoras', code: 'INF-330', teacherId: otherTeachers[3].id, progress: 60 },
    { name: 'Inteligencia Artificial', code: 'INF-380', teacherId: otherTeachers[4].id, progress: 55 },
  ]

  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: {},
      create: {
        name: c.name,
        code: c.code,
        teacherId: c.teacherId,
        description: `Curso de ${c.name}`
      },
    })

    // Enroll the main student
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: course.id
        }
      },
      update: { progress: c.progress },
      create: {
        userId: student.id,
        courseId: course.id,
        progress: c.progress
      }
    })
    
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: franco.id,
          courseId: course.id
        }
      },
      update: { progress: c.progress },
      create: {
        userId: franco.id,
        courseId: course.id,
        progress: c.progress
      }
    })

    // Create dummy assignments for each course
    const assignmentTitle = 'Tarea 1: Introducción';
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        courseId: course.id,
        title: assignmentTitle
      }
    });

    if (!existingAssignment) {
      await prisma.assignment.create({
        data: {
          courseId: course.id,
          title: assignmentTitle,
          description: 'Resolver los ejercicios del capítulo 1',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          totalPoints: 100,
          weight: 0.3
        }
      })
    }
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
