import { Calendar, BookOpen, Award, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardProps {
  userRole: 'student' | 'teacher' | 'admin';
  userName: string;
}

export function Dashboard({ userRole, userName }: DashboardProps) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Datos de ejemplo para estudiante
  const studentData = {
    period: '2025-1',
    enrolledCourses: 6,
    averageGrade: 85,
    pendingTasks: 4,
    upcomingExams: 2,
    recentActivities: [
      { id: 1, course: 'Programación Web', activity: 'Tarea enviada: "Diseño Responsivo"', date: '20 Nov', type: 'task' },
      { id: 2, course: 'Bases de Datos', activity: 'Nueva tarea asignada: "Normalización"', date: '19 Nov', type: 'assignment' },
      { id: 3, course: 'Cálculo II', activity: 'Calificación publicada: Examen Parcial (87/100)', date: '18 Nov', type: 'grade' },
      { id: 4, course: 'Ingeniería de Software', activity: 'Nuevo recurso: "Metodologías Ágiles.pdf"', date: '17 Nov', type: 'resource' },
    ],
    upcomingEvents: [
      { id: 1, title: 'Examen Parcial - Bases de Datos', date: '25 Nov', time: '10:00 AM' },
      { id: 2, title: 'Entrega Proyecto - Programación Web', date: '27 Nov', time: '23:59 PM' },
      { id: 3, title: 'Exposición - Ingeniería de Software', date: '30 Nov', time: '14:00 PM' },
    ],
    courses: [
      { id: 1, name: 'Programación Web', progress: 75, grade: 88 },
      { id: 2, name: 'Bases de Datos', progress: 65, grade: 82 },
      { id: 3, name: 'Cálculo II', progress: 70, grade: 87 },
      { id: 4, name: 'Ingeniería de Software', progress: 80, grade: 90 },
    ]
  };

  const teacherData = {
    period: '2025-1',
    teachingCourses: 3,
    totalStudents: 85,
    pendingGrades: 12,
    recentActivities: [
      { id: 1, course: 'Programación Web - Sección A', activity: '15 estudiantes entregaron tarea', date: '20 Nov' },
      { id: 2, course: 'Programación Web - Sección B', activity: 'Nuevo recurso publicado', date: '19 Nov' },
      { id: 3, course: 'Bases de Datos', activity: 'Examen creado para el 25 de Nov', date: '18 Nov' },
    ],
    courses: [
      { id: 1, name: 'Programación Web - Sección A', students: 32, pendingTasks: 5 },
      { id: 2, name: 'Programación Web - Sección B', students: 28, pendingTasks: 3 },
      { id: 3, name: 'Bases de Datos', students: 25, pendingTasks: 4 },
    ]
  };

  const adminData = {
    period: '2025-1',
    totalStudents: 1250,
    totalTeachers: 85,
    totalCourses: 120,
    recentActivities: [
      { id: 1, activity: 'Nuevo docente registrado: Dr. Juan Pérez', date: '20 Nov' },
      { id: 2, activity: '35 estudiantes matriculados en nuevos cursos', date: '19 Nov' },
      { id: 3, activity: 'Curso "Machine Learning" creado', date: '18 Nov' },
    ]
  };

  if (userRole === 'student') {
    return (
      <div className="p-6 lg:p-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-[var(--color-primary)] mb-2">¡Bienvenido/a, {userName.split(' ')[0]}!</h1>
          <p className="text-[var(--color-text-secondary)]">{currentDate}</p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[var(--color-primary)]">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-[var(--color-primary)]" />
              <span className="text-[var(--color-text-secondary)] text-sm">Periodo {studentData.period}</span>
            </div>
            <h3 className="text-[var(--color-primary)] mb-0">{studentData.enrolledCourses}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Cursos Inscritos</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[var(--color-success)]">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-[var(--color-success)]" />
              <Award className="w-6 h-6 text-[var(--color-success)]" />
            </div>
            <h3 className="text-[var(--color-success)] mb-0">{studentData.averageGrade}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Promedio General</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[var(--color-secondary)]">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-[var(--color-secondary)]" />
              <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs">Pendientes</span>
            </div>
            <h3 className="text-[var(--color-secondary)] mb-0">{studentData.pendingTasks}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Tareas Pendientes</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[var(--color-danger)]">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-[var(--color-danger)]" />
              <Calendar className="w-6 h-6 text-[var(--color-danger)]" />
            </div>
            <h3 className="text-[var(--color-danger)] mb-0">{studentData.upcomingExams}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Exámenes Próximos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actividades recientes */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--color-primary)] mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {studentData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-4 pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'task' ? 'bg-green-100' :
                    activity.type === 'assignment' ? 'bg-orange-100' :
                    activity.type === 'grade' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'task' && <Clock className="w-5 h-5 text-green-600" />}
                    {activity.type === 'assignment' && <BookOpen className="w-5 h-5 text-orange-600" />}
                    {activity.type === 'grade' && <Award className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'resource' && <BookOpen className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="mb-1 truncate">{activity.course}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-0">{activity.activity}</p>
                  </div>
                  <span className="text-xs text-[var(--color-text-secondary)] flex-shrink-0">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Próximos eventos */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--color-primary)] mb-4">Próximos Eventos</h3>
            <div className="space-y-4">
              {studentData.upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 bg-blue-50 rounded-lg border-l-4 border-[var(--color-primary)]">
                  <p className="mb-2">{event.title}</p>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                    <span>•</span>
                    <span>{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progreso de cursos */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-[var(--color-primary)] mb-4">Progreso de Cursos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentData.courses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="mb-0">{course.name}</p>
                  <span className="text-sm text-[var(--color-text-secondary)]">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[var(--color-primary)] h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0">Calificación actual: {course.grade}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (userRole === 'teacher') {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-[var(--color-primary)] mb-2">¡Bienvenido/a, Prof. {userName.split(' ')[0]}!</h1>
          <p className="text-[var(--color-text-secondary)]">{currentDate}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-green-600 mb-0">{teacherData.teachingCourses}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Cursos Dictando</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-blue-600 mb-0">{teacherData.totalStudents}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Estudiantes Totales</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-orange-600 mb-0">{teacherData.pendingGrades}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Calificaciones Pendientes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--color-primary)] mb-4">Mis Cursos</h3>
            <div className="space-y-4">
              {teacherData.courses.map((course) => (
                <div key={course.id} className="p-4 border border-[var(--color-border)] rounded-lg hover:shadow-md transition">
                  <p className="mb-2">{course.name}</p>
                  <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
                    <span>{course.students} estudiantes</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded">{course.pendingTasks} tareas por revisar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--color-primary)] mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {teacherData.recentActivities.map((activity) => (
                <div key={activity.id} className="pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0">
                  <p className="mb-1">{activity.course}</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-0">{activity.activity}</p>
                  <span className="text-xs text-[var(--color-text-secondary)]">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de administrador
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2">Panel de Administración</h1>
        <p className="text-[var(--color-text-secondary)]">{currentDate}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <h3 className="text-purple-600 mb-0">{adminData.totalStudents}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-0">Estudiantes Totales</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-green-600 mb-0">{adminData.totalTeachers}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-0">Docentes</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-blue-600 mb-0">{adminData.totalCourses}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-0">Cursos Activos</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-[var(--color-primary)] mb-4">Actividad Reciente del Sistema</h3>
        <div className="space-y-4">
          {adminData.recentActivities.map((activity) => (
            <div key={activity.id} className="pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0">
              <p className="mb-1">{activity.activity}</p>
              <span className="text-xs text-[var(--color-text-secondary)]">{activity.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
