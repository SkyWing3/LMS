import { Calendar, BookOpen, Award, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDashboardStats, getRecentActivity, getUpcomingEvents, getStudentCourses } from '@/app/actions/data';

interface DashboardProps {
  userRole: 'student' | 'teacher' | 'admin';
  userName: string;
}

export function Dashboard({ userRole, userName }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [studentCourses, setStudentCourses] = useState<any[]>([]);

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    async function fetchData() {
        try {
            const [statsData, activityData, eventsData] = await Promise.all([
                getDashboardStats(),
                getRecentActivity(),
                getUpcomingEvents()
            ]);
            
            setStats(statsData);
            setActivity(activityData);
            setEvents(eventsData);

            if (userRole === 'student') {
                const courses = await getStudentCourses();
                setStudentCourses(courses);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [userRole]);

  if (loading) {
    return (
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        </div>
    );
  }

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
              <span className="text-[var(--color-text-secondary)] text-sm">Periodo 2025-1</span>
            </div>
            <h3 className="text-[var(--color-primary)] mb-0">{stats?.activeCourses || 0}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Cursos Inscritos</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[var(--color-success)]">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-[var(--color-success)]" />
              <Award className="w-6 h-6 text-[var(--color-success)]" />
            </div>
            <h3 className="text-[var(--color-success)] mb-0">{stats?.averageGrade || 0}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Promedio General</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[var(--color-secondary)]">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-[var(--color-secondary)]" />
              <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs">Pendientes</span>
            </div>
            <h3 className="text-[var(--color-secondary)] mb-0">{stats?.pendingTasks || 0}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Tareas Pendientes</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[var(--color-danger)]">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-[var(--color-danger)]" />
              <Calendar className="w-6 h-6 text-[var(--color-danger)]" />
            </div>
            <h3 className="text-[var(--color-danger)] mb-0">{stats?.upcomingExams || 0}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Exámenes Próximos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actividades recientes */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--color-primary)] mb-4">Actividad Reciente</h3>
            {activity.length === 0 ? (
                <p className="text-[var(--color-text-secondary)]">No hay actividad reciente.</p>
            ) : (
                <div className="space-y-4">
                {activity.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.type === 'task' ? 'bg-green-100' :
                        item.type === 'assignment' ? 'bg-orange-100' :
                        item.type === 'grade' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                        {item.type === 'task' && <Clock className="w-5 h-5 text-green-600" />}
                        {item.type === 'submission' && <BookOpen className="w-5 h-5 text-orange-600" />}
                        {item.type === 'grade' && <Award className="w-5 h-5 text-blue-600" />}
                        {item.type === 'material' && <BookOpen className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="mb-1 truncate">{item.course}</p>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-0">{item.description}</p>
                    </div>
                    <span className="text-xs text-[var(--color-text-secondary)] flex-shrink-0">
                        {new Date(item.time).toLocaleDateString()}
                    </span>
                    </div>
                ))}
                </div>
            )}
          </div>

          {/* Próximos eventos */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--color-primary)] mb-4">Próximos Eventos</h3>
            {events.length === 0 ? (
                <p className="text-[var(--color-text-secondary)]">No hay eventos próximos.</p>
            ) : (
                <div className="space-y-4">
                {events.map((event) => (
                    <div key={event.id} className="p-4 bg-blue-50 rounded-lg border-l-4 border-[var(--color-primary)]">
                    <p className="mb-2">{event.title}</p>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>
        </div>

        {/* Progreso de cursos */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-[var(--color-primary)] mb-4">Progreso de Cursos</h3>
          {studentCourses.length === 0 ? (
             <p className="text-[var(--color-text-secondary)]">No estás inscrito en ningún curso.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentCourses.map((course) => (
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
                </div>
                ))}
            </div>
          )}
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
            <h3 className="text-green-600 mb-0">{stats?.activeCourses || 0}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Cursos Dictando</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-blue-600 mb-0">{stats?.totalStudents || 0}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Estudiantes Totales</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-orange-600 mb-0">{stats?.pendingGrades || 0}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-0">Calificaciones Pendientes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <div className="bg-white rounded-xl shadow-md p-6">
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
          </div> */}

          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h3 className="text-[var(--color-primary)] mb-4">Actividad Reciente</h3>
            {activity.length === 0 ? (
                <p className="text-[var(--color-text-secondary)]">No hay actividad reciente.</p>
            ) : (
                <div className="space-y-4">
                {activity.map((item) => (
                    <div key={item.id} className="pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0">
                    <p className="mb-1">{item.course}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-0">{item.description}</p>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                        {new Date(item.time).toLocaleDateString()}
                    </span>
                    </div>
                ))}
                </div>
            )}
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
          <h3 className="text-purple-600 mb-0">{stats?.totalUsers || 0}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-0">Usuarios Totales</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-green-600 mb-0">{stats?.activeSessions || 0}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-0">Sesiones Activas</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-blue-600 mb-0">{stats?.totalCourses || 0}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-0">Cursos Activos</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-[var(--color-primary)] mb-4">Actividad Reciente del Sistema</h3>
        {activity.length === 0 ? (
             <p className="text-[var(--color-text-secondary)]">No hay actividad reciente.</p>
        ) : (
            <div className="space-y-4">
            {activity.map((item) => (
                <div key={item.id} className="pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0">
                <p className="mb-1">{item.description}</p>
                <span className="text-xs text-[var(--color-text-secondary)]">
                    {new Date(item.time).toLocaleDateString()}
                </span>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}