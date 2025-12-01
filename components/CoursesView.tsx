import { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, Calendar } from 'lucide-react';
import { getStudentCourses } from '@/app/actions/data';

interface Course {
  id: number;
  name: string;
  code: string;
  teacher: string;
  schedule: string;
  students: number;
  progress: number;
  color: string;
}

interface CoursesViewProps {
  onSelectCourse: (courseId: number) => void;
}

export function CoursesView({ onSelectCourse }: CoursesViewProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentCourses()
      .then((data) => {
        // Map server data to UI format if necessary, but the action should return matching shape
        // The action returns { id, name, code, teacher, schedule, students, progress, color }
        setCourses(data as Course[]);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2">Mis Cursos</h1>
        <p className="text-[var(--color-text-secondary)]">Periodo Académico 2025-1</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => onSelectCourse(course.id)}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
          >
            {/* Header con color */}
            <div className={`${course.color} h-32 p-6 flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
              <BookOpen className="w-16 h-16 text-white" />
            </div>

            {/* Contenido */}
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[var(--color-primary)] flex-1 mb-0">{course.name}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-[var(--color-text-secondary)] rounded text-xs ml-2 flex-shrink-0">
                    {course.code}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0">{course.teacher}</p>
              </div>

              {/* Información adicional */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Calendar className="w-4 h-4" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Users className="w-4 h-4" />
                  <span>{course.students} estudiantes</span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Progreso del curso</span>
                  <span className="text-[var(--color-primary)]">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${course.color} h-2 rounded-full transition-all`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {/* Botón de acción */}
              <button className="w-full mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Ver curso
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

