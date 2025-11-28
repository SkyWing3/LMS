import { BookOpen, Users, Clock, Calendar } from 'lucide-react';

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
  const courses: Course[] = [
    {
      id: 1,
      name: 'Programación Web',
      code: 'INF-342',
      teacher: 'Dr. Carlos Méndez',
      schedule: 'Lun-Mié 10:00-12:00',
      students: 32,
      progress: 75,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Bases de Datos',
      code: 'INF-320',
      teacher: 'Dra. María González',
      schedule: 'Mar-Jue 14:00-16:00',
      students: 28,
      progress: 65,
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Cálculo II',
      code: 'MAT-202',
      teacher: 'Lic. Roberto Fernández',
      schedule: 'Lun-Mié-Vie 08:00-09:00',
      students: 45,
      progress: 70,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      name: 'Ingeniería de Software',
      code: 'INF-350',
      teacher: 'Ing. Ana Morales',
      schedule: 'Mar-Jue 16:00-18:00',
      students: 30,
      progress: 80,
      color: 'bg-orange-500'
    },
    {
      id: 5,
      name: 'Redes de Computadoras',
      code: 'INF-330',
      teacher: 'Ing. Juan Pérez',
      schedule: 'Lun-Mié 14:00-16:00',
      students: 25,
      progress: 60,
      color: 'bg-red-500'
    },
    {
      id: 6,
      name: 'Inteligencia Artificial',
      code: 'INF-380',
      teacher: 'Dr. Luis Ramírez',
      schedule: 'Vie 10:00-14:00',
      students: 20,
      progress: 55,
      color: 'bg-indigo-500'
    },
  ];

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
