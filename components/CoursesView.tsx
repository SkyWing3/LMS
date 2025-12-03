import { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, Calendar, ArrowRight } from 'lucide-react';
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

// Mapa de colores seguro para mantener consistencia con el tema
const colorMap: Record<string, string> = {
  'bg-blue-600': 'bg-[var(--color-primary)]',
  'bg-green-600': 'bg-[var(--color-success)]',
  'bg-purple-600': 'bg-purple-600', // Mantener si es distintivo, o cambiar a una variable
  'bg-orange-600': 'bg-[var(--color-secondary-dark)]',
  'bg-red-600': 'bg-[var(--color-danger)]',
  'default': 'bg-[var(--color-primary)]'
};

const getCourseColor = (colorClass: string) => {
  return colorMap[colorClass] || colorMap['default'];
};

export function CoursesView({ onSelectCourse }: CoursesViewProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentCourses()
      .then((data) => {
        setCourses(data as Course[]);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[var(--color-primary)] mb-1 text-2xl lg:text-3xl">Mis Cursos</h1>
          <p className="text-[var(--color-text-secondary)] flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Periodo Académico 2025-1
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
           const headerColorClass = getCourseColor(course.color);
           
           return (
          <div
            key={course.id}
            onClick={() => onSelectCourse(course.id)}
            className="bg-[var(--color-surface)] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-[var(--color-border)] overflow-hidden flex flex-col"
          >
            {/* Header con color */}
            <div className={`${headerColorClass} h-32 p-6 flex items-center justify-between relative overflow-hidden transition-colors`}>
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
              <div className="relative z-10 text-white">
                 <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs font-medium mb-2">
                    {course.code}
                 </span>
                 <h3 className="text-white text-xl font-bold line-clamp-2 leading-tight">{course.name}</h3>
              </div>
              <BookOpen className="w-16 h-16 text-white/20 absolute -right-4 -bottom-4 transform rotate-12 group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* Contenido */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4 flex-1">
                <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-primary)]">
                        {course.teacher.charAt(0)}
                    </span>
                    {course.teacher}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Calendar className="w-4 h-4 text-[var(--color-primary-light)]" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Users className="w-4 h-4 text-[var(--color-primary-light)]" />
                    <span>{course.students} estudiantes</span>
                  </div>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-auto space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Progreso</span>
                  <span className="font-bold text-[var(--color-primary)]">{course.progress}%</span>
                </div>
                <div className="w-full bg-[var(--color-border)] rounded-full h-2 overflow-hidden">
                  <div
                    className={`${headerColorClass} h-2 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {/* Botón implícito visual (hover effect) */}
              <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex justify-end">
                  <span className="text-[var(--color-primary)] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver detalles <ArrowRight className="w-4 h-4" />
                  </span>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}

