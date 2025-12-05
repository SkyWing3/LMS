'use server';

import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/logger';
import { getSession } from '@/lib/auth';

export async function getUsers(role: 'student' | 'teacher' | 'admin') {
  try {
    const users = await prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        career: true,
        semester: true,
        coursesTeaching: {
          select: { id: true, name: true }
        },
        enrollments: {
          select: { course: { select: { id: true, name: true } } }
        }
      },
      orderBy: { name: 'asc' }
    });
    return { success: true, data: users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: 'Error al obtener usuarios' };
  }
}

export async function createUser(data: any) {
  try {
    const session = await getSession();
    const hashedPassword = await hash(data.password || '123456', 12);
    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        department: data.department,
        career: data.career,
        semester: data.semester,
      }
    });
    
    if (session?.user) {
        await logActivity(session.user.id, 'Creación de usuario', `Creó al usuario: ${user.email} (${user.role})`);
    }

    revalidatePath('/admin-panel');
    return { success: true, data: user };
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'El correo electrónico ya está registrado' };
    }
    return { success: false, error: 'Error al crear usuario' };
  }
}

export async function updateUser(id: number, data: any) {
  try {
    const session = await getSession();
    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      career: data.career,
      semester: data.semester,
    };

    if (data.password) {
      updateData.password = await hash(data.password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });

    if (session?.user) {
        await logActivity(session.user.id, 'Actualización de usuario', `Actualizó al usuario: ${user.email}`);
    }

    revalidatePath('/admin-panel');
    return { success: true, data: user };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: 'Error al actualizar usuario' };
  }
}

export async function deleteUser(id: number) {
  try {
    const session = await getSession();
    await prisma.user.delete({
      where: { id }
    });

    if (session?.user) {
        await logActivity(session.user.id, 'Eliminación de usuario', `Eliminó al usuario ID: ${id}`);
    }

    revalidatePath('/admin-panel');
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Error al eliminar usuario' };
  }
}

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        teacher: { select: { id: true, name: true } },
        enrollments: true,
        _count: { select: { enrollments: true } }
      },
      orderBy: { name: 'asc' }
    });
    
    const mappedCourses = courses.map(course => ({
      id: course.id,
      name: course.name,
      code: course.code,
      teacher: course.teacher?.name || 'Sin asignar',
      teacherId: course.teacherId,
      students: course._count.enrollments,
      sections: 1 // Default value as per schema simplicity
    }));

    return { success: true, data: mappedCourses };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { success: false, error: 'Error al obtener cursos' };
  }
}

export async function createCourse(data: any) {
  try {
    const session = await getSession();
    const course = await prisma.course.create({
      data: {
        name: data.name,
        code: data.code,
        teacherId: parseInt(data.teacherId),
      }
    });

    if (session?.user) {
        await logActivity(session.user.id, 'Creación de curso', `Creó el curso: ${course.name} (${course.code})`);
    }

    revalidatePath('/admin-panel');
    return { success: true, data: course };
  } catch (error: any) {
    console.error('Error creating course:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'El código del curso ya existe' };
    }
    return { success: false, error: 'Error al crear curso' };
  }
}

export async function updateCourse(id: number, data: any) {
  try {
    const session = await getSession();
    const course = await prisma.course.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        teacherId: parseInt(data.teacherId),
      }
    });

    if (session?.user) {
        await logActivity(session.user.id, 'Actualización de curso', `Actualizó el curso: ${course.code}`);
    }

    revalidatePath('/admin-panel');
    return { success: true, data: course };
  } catch (error) {
    console.error('Error updating course:', error);
    return { success: false, error: 'Error al actualizar curso' };
  }
}

export async function deleteCourse(id: number) {
  try {
    const session = await getSession();
    await prisma.course.delete({
      where: { id }
    });

    if (session?.user) {
        await logActivity(session.user.id, 'Eliminación de curso', `Eliminó el curso ID: ${id}`);
    }

    revalidatePath('/admin-panel');
    return { success: true };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { success: false, error: 'Error al eliminar curso' };
  }
}

export async function enrollStudent(courseId: number, studentId: number) {
  try {
    const session = await getSession();
    await prisma.enrollment.create({
      data: {
        courseId,
        userId: studentId
      }
    });

    if (session?.user) {
        await logActivity(session.user.id, 'Inscripción de estudiante', `Inscribió al estudiante ${studentId} en el curso ${courseId}`);
    }

    revalidatePath('/admin-panel');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'El estudiante ya está inscrito en este curso' };
    }
    console.error('Error enrolling student:', error);
    return { success: false, error: 'Error al inscribir estudiante' };
  }
}

// For assigning courses to teachers (which is basically updating the course's teacherId)
export async function assignCourseToTeacher(courseId: number, teacherId: number) {
    return updateCourse(courseId, { teacherId });
}
