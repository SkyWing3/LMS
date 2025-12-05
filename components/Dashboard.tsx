import { Calendar, BookOpen, Award, Clock, TrendingUp, AlertCircle, Bell, Users } from 'lucide-react';
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

  const Card = ({ border, icon: Icon, iconColor, value, label, subLabel }: any) => (
    <div className={`bg-[var(--color-surface)] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border-l-4 ${border}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-8 h-8 ${iconColor}`} />
        {subLabel && <span className="text-[var(--color-text-secondary)] text-sm">{subLabel}</span>}
      </div>
      <h3 className={`${iconColor} mb-0 text-3xl font-bold`}>{value}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-0 font-medium">{label}</p>
    </div>
  );

  if (userRole === 'student') {
    return (
      <div className="p-6 lg:p-8 space-y-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-[var(--color-primary)] mb-1 text-2xl lg:text-3xl">¡Hola, {userName.split(' ')[0]}!</h1>
            <p className="text-[var(--color-text-secondary)] flex items-center gap-2" suppressHydrationWarning>
              <Calendar className="w-4 h-4" />
              {currentDate}
            </p>
          </div>
          <button className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition flex items-center gap-2 shadow-sm">
             <Bell className="w-4 h-4" />
             Notificaciones
          </button>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            border="border-[var(--color-primary)]"
            icon={BookOpen}
            iconColor="text-[var(--color-primary)]"
            value={stats?.activeCourses || 0}
            label="Cursos Inscritos"
            subLabel="2025-1"
          />
          <Card 
            border="border-[var(--color-success)]"
            icon={TrendingUp}
            iconColor="text-[var(--color-success)]"
            value={stats?.averageGrade || 0}
            label="Promedio General"
          />
          <Card 
            border="border-[var(--color-warning)]"
            icon={Clock}
            iconColor="text-[var(--color-warning-dark)]"
            value={stats?.pendingTasks || 0}
            label="Tareas Pendientes"
            subLabel={<span className="px-2 py-0.5 bg-[var(--color-warning-light)] text-[var(--color-warning-dark)] rounded text-xs font-semibold">Urgente</span>}
          />
          <Card 
            border="border-[var(--color-danger)]"
            icon={AlertCircle}
            iconColor="text-[var(--color-danger)]"
            value={stats?.upcomingExams || 0}
            label="Exámenes Próximos"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actividades recientes */}
          <div className="lg:col-span-2 bg-[var(--color-surface)] rounded-xl shadow-sm p-6">
            <h3 className="text-[var(--color-primary)] mb-6 flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
                <Clock className="w-5 h-5" />
                Actividad Reciente
            </h3>
            {activity.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-text-secondary)]">
                    <p>No hay actividad reciente para mostrar.</p>
                </div>
            ) : (
                <div className="space-y-4">
                {activity.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0 group hover:bg-[var(--color-surface-hover)] p-2 rounded-lg transition">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        item.type === 'task' ? 'bg-[var(--color-success-light)] text-[var(--color-success-dark)]' :
                        item.type === 'assignment' ? 'bg-[var(--color-warning-light)] text-[var(--color-warning-dark)]' :
                        item.type === 'grade' ? 'bg-[var(--color-info-light)] text-[var(--color-info-dark)]' : 
                        'bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                    }`}>
                        {item.type === 'task' && <Clock className="w-5 h-5" />}
                        {item.type === 'submission' && <BookOpen className="w-5 h-5" />}
                        {item.type === 'grade' && <Award className="w-5 h-5" />}
                        {item.type === 'material' && <BookOpen className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="mb-1 font-medium truncate text-[var(--color-text)]">{item.course}</p>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-0 group-hover:text-[var(--color-text)] transition-colors">{item.description}</p>
                    </div>
                    <span className="text-xs text-[var(--color-text-secondary)] flex-shrink-0 self-start mt-1">
                        {new Date(item.time).toLocaleDateString()}
                    </span>
                    </div>
                ))}
                </div>
            )}
          </div>

          {/* Próximos eventos */}
          <div className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6">
            <h3 className="text-[var(--color-primary)] mb-6 flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
                <Calendar className="w-5 h-5" />
                Próximos Eventos
            </h3>
            {events.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-text-secondary)]">
                    <p>No tienes eventos próximos.</p>
                </div>
            ) : (
                <div className="space-y-4">
                {events.map((event) => (
                    <div key={event.id} className="p-4 bg-[var(--color-info-light)] rounded-lg border-l-4 border-[var(--color-info)] hover:shadow-md transition">
                        <p className="mb-2 font-semibold text-[var(--color-info-dark)]">{event.title}</p>
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
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6">
          <h3 className="text-[var(--color-primary)] mb-6 flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
            <TrendingUp className="w-5 h-5" />
            Progreso Académico
          </h3>
          {studentCourses.length === 0 ? (
             <p className="text-[var(--color-text-secondary)]">No estás inscrito en ningún curso.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {studentCourses.map((course) => (
                <div key={course.id} className="space-y-2 group">
                    <div className="flex items-center justify-between">
                    <p className="mb-0 font-medium text-[var(--color-text)]">{course.name}</p>
                    <span className="text-sm font-bold text-[var(--color-primary)]">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-[var(--color-border)] rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-[var(--color-primary)] h-2.5 rounded-full transition-all duration-1000 ease-out group-hover:bg-[var(--color-secondary)]"
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
      <div className="p-6 lg:p-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-[var(--color-primary)] mb-1 text-2xl lg:text-3xl">Panel Docente</h1>
            <p className="text-[var(--color-text-secondary)]" suppressHydrationWarning>{currentDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
                border="border-[var(--color-success)]"
                icon={BookOpen}
                iconColor="text-[var(--color-success)]"
                value={stats?.activeCourses || 0}
                label="Cursos Dictando"
            />
            <Card 
                border="border-[var(--color-info)]"
                icon={Users}
                iconColor="text-[var(--color-info)]"
                value={stats?.totalStudents || 0}
                label="Estudiantes Totales"
            />
            <Card 
                border="border-[var(--color-warning)]"
                icon={Award}
                iconColor="text-[var(--color-warning-dark)]"
                value={stats?.pendingGrades || 0}
                label="Calificaciones Pendientes"
            />
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6">
            <h3 className="text-[var(--color-primary)] mb-6 flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
                <Clock className="w-5 h-5" />
                Actividad Reciente
            </h3>
            {activity.length === 0 ? (
                <p className="text-[var(--color-text-secondary)]">No hay actividad reciente.</p>
            ) : (
                <div className="space-y-4">
                {activity.map((item) => (
                    <div key={item.id} className="pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0 hover:bg-[var(--color-surface-hover)] p-2 rounded-lg transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="mb-1 font-medium text-[var(--color-text)]">{item.course}</p>
                                <p className="text-sm text-[var(--color-text-secondary)] mb-0">{item.description}</p>
                            </div>
                            <span className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg)] px-2 py-1 rounded">
                                {new Date(item.time).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
                </div>
            )}
        </div>
      </div>
    );
  }

  // Vista de administrador
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2 text-2xl lg:text-3xl">Panel de Administración</h1>
        <p className="text-[var(--color-text-secondary)]" suppressHydrationWarning>{currentDate}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card 
            border="border-purple-500"
            icon={Users}
            iconColor="text-purple-600"
            value={stats?.totalUsers || 0}
            label="Usuarios Totales"
        />
        <Card 
            border="border-[var(--color-success)]"
            icon={Clock}
            iconColor="text-[var(--color-success)]"
            value={stats?.activeSessions || 0}
            label="Sesiones Activas"
        />
        <Card 
            border="border-[var(--color-info)]"
            icon={BookOpen}
            iconColor="text-[var(--color-info)]"
            value={stats?.totalCourses || 0}
            label="Cursos Activos"
        />
      </div>

            <div className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6">

              <h3 className="text-[var(--color-primary)] mb-6 flex items-center gap-2 border-b border-[var(--color-border)] pb-3">

                  <TrendingUp className="w-5 h-5" />

                  Actividad del Sistema

              </h3>

              {activity.length === 0 ? (

                   <p className="text-[var(--color-text-secondary)]">No hay actividad reciente.</p>

              ) : (

                  <div className="space-y-4">

                  {activity.map((item) => (

                      <div key={item.id} className="pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0 hover:bg-[var(--color-surface-hover)] p-2 rounded-lg transition">

                      <p className="mb-1 font-medium text-[var(--color-text)]">{item.description}</p>

                      <span className="text-xs text-[var(--color-text-secondary)]">

                          {new Date(item.time).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'medium' })}

                      </span>

                      </div>

                  ))}

                  </div>

              )}

            </div>

          </div>

        );

      }

      