import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Edit2, Camera } from 'lucide-react';

interface ProfileViewProps {
  userRole: 'student' | 'teacher' | 'admin';
  userName: string;
  userEmail: string;
}

export function ProfileView({ userRole, userName, userEmail }: ProfileViewProps) {
  const roleLabels = {
    student: 'Estudiante',
    teacher: 'Docente',
    admin: 'Administrador'
  };

  // Datos de ejemplo según el rol
  const studentProfile = {
    fullName: userName,
    email: userEmail,
    phone: '+591 7654-3210',
    address: 'Cochabamba, Bolivia',
    studentId: '2021-00123',
    career: 'Ingeniería en Sistemas',
    enrollmentDate: 'Marzo 2021',
    currentSemester: '8vo Semestre',
    academicStatus: 'Regular',
    credits: 168,
    totalCredits: 240,
  };

  const teacherProfile = {
    fullName: userName,
    email: userEmail,
    phone: '+591 7123-4567',
    address: 'Cochabamba, Bolivia',
    employeeId: 'DOC-2018-045',
    department: 'Departamento de Informática',
    specialization: 'Desarrollo Web y Bases de Datos',
    hireDate: 'Enero 2018',
    courseLoad: 3,
  };

  const adminProfile = {
    fullName: userName,
    email: userEmail,
    phone: '+591 7890-1234',
    address: 'Cochabamba, Bolivia',
    employeeId: 'ADM-2020-010',
    position: 'Administrador de Sistemas',
    department: 'Tecnologías de la Información',
    hireDate: 'Junio 2020',
  };

  const profile = userRole === 'admin' ? adminProfile : userRole === 'teacher' ? teacherProfile : studentProfile;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2">Mi Perfil</h1>
        <p className="text-[var(--color-text-secondary)]">Información personal y académica</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarjeta de perfil */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header con color */}
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] h-32"></div>
            
            {/* Foto de perfil */}
            <div className="relative px-6 pb-6">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="w-32 h-32 bg-[var(--color-secondary)] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <GraduationCap className="w-16 h-16 text-[var(--color-primary)]" />
                  </div>
                  <button className="absolute bottom-2 right-2 w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white hover:bg-[var(--color-primary-dark)] transition shadow-lg">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="pt-20 text-center">
                <h3 className="text-[var(--color-primary)] mb-1">{profile.fullName}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">{roleLabels[userRole]}</p>
                
                <button className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          {/* Tarjeta de estadísticas rápidas - solo para estudiantes */}
          {userRole === 'student' && (
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h4 className="text-[var(--color-primary)] mb-4">Estadísticas</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)]">Créditos Completados</span>
                  <span className="text-[var(--color-primary)]">{studentProfile.credits}/{studentProfile.totalCredits}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[var(--color-primary)] h-2 rounded-full"
                    style={{ width: `${(studentProfile.credits / studentProfile.totalCredits) * 100}%` }}
                  />
                </div>
                <div className="pt-2 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--color-text-secondary)]">Estado Académico</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {studentProfile.academicStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Información detallada */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Personal */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--color-primary)] mb-6">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-[var(--color-text-secondary)]">Nombre Completo</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-[var(--color-primary)]" />
                  <span>{profile.fullName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[var(--color-text-secondary)]">Correo Electrónico</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="truncate">{profile.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[var(--color-text-secondary)]">Teléfono</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                  <span>{profile.phone}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[var(--color-text-secondary)]">Dirección</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                  <span>{profile.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Información Académica/Profesional */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--color-primary)] mb-6">
              {userRole === 'student' ? 'Información Académica' : 'Información Profesional'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userRole === 'student' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">ID de Estudiante</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span>{studentProfile.studentId}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">Carrera</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-[var(--color-primary)]" />
                      <span>{studentProfile.career}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">Fecha de Ingreso</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                      <span>{studentProfile.enrollmentDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">Semestre Actual</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span>{studentProfile.currentSemester}</span>
                    </div>
                  </div>
                </>
              )}

              {userRole === 'teacher' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">ID de Empleado</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span>{teacherProfile.employeeId}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">Departamento</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span>{teacherProfile.department}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">Especialización</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span>{teacherProfile.specialization}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">Fecha de Contratación</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                      <span>{teacherProfile.hireDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">Carga Docente</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span>{teacherProfile.courseLoad} cursos activos</span>
                    </div>
                  </div>
                </>
              )}

              {userRole === 'admin' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">ID de Empleado</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span>{adminProfile.employeeId}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">Cargo</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span>{adminProfile.position}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">Departamento</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span>{adminProfile.department}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)]">Fecha de Contratación</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                      <span>{adminProfile.hireDate}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cambiar contraseña */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--color-primary)] mb-6">Seguridad</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="mb-1">Contraseña</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0">••••••••</p>
              </div>
              <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition">
                Cambiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
