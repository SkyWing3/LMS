'use client';

import { Plus, Edit2, Trash2, Users, BookOpen, UserCheck, Search, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'courses' | 'teachers' | 'students'>('courses');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'assign' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const courses = [
    { id: 1, name: 'Programación Web', code: 'INF-342', teacher: 'Dr. Carlos Méndez', students: 60, sections: 2 },
    { id: 2, name: 'Bases de Datos', code: 'INF-320', teacher: 'Dra. María González', students: 28, sections: 1 },
    { id: 3, name: 'Cálculo II', code: 'MAT-202', teacher: 'Lic. Roberto Fernández', students: 45, sections: 1 },
    { id: 4, name: 'Ingeniería de Software', code: 'INF-350', teacher: 'Ing. Ana Morales', students: 30, sections: 1 },
  ];

  const teachers = [
    { id: 1, name: 'Dr. Carlos Méndez', email: 'carlos.mendez@ucb.edu.bo', department: 'Informática', courses: 2 },
    { id: 2, name: 'Dra. María González', email: 'maria.gonzalez@ucb.edu.bo', department: 'Informática', courses: 1 },
    { id: 3, name: 'Lic. Roberto Fernández', email: 'roberto.fernandez@ucb.edu.bo', department: 'Matemáticas', courses: 1 },
    { id: 4, name: 'Ing. Ana Morales', email: 'ana.morales@ucb.edu.bo', department: 'Informática', courses: 1 },
  ];

  const students = [
    { id: 1, name: 'Juan Pérez', email: 'juan.perez@ucb.edu.bo', career: 'Ing. Sistemas', semester: 8, courses: 6 },
    { id: 2, name: 'María López', email: 'maria.lopez@ucb.edu.bo', career: 'Ing. Sistemas', semester: 7, courses: 5 },
    { id: 3, name: 'Pedro Sánchez', email: 'pedro.sanchez@ucb.edu.bo', career: 'Ing. Industrial', semester: 6, courses: 6 },
    { id: 4, name: 'Ana García', email: 'ana.garcia@ucb.edu.bo', career: 'Ing. Sistemas', semester: 8, courses: 6 },
  ];

  const handleOpenModal = (type: 'create' | 'edit' | 'delete' | 'assign') => {
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2 text-2xl lg:text-3xl">Panel de Administración</h1>
        <p className="text-[var(--color-text-secondary)]">Gestiona cursos, docentes y estudiantes del campus.</p>
      </div>

      {/* Tabs */}
      <div className="bg-[var(--color-surface)] rounded-xl shadow-sm mb-6">
        <div className="border-b border-[var(--color-border)]">
          <div className="flex gap-1 px-6 overflow-x-auto">
            {[
                { id: 'courses', label: 'Cursos', icon: BookOpen },
                { id: 'teachers', label: 'Docentes', icon: UserCheck },
                { id: 'students', label: 'Estudiantes', icon: Users }
            ].map((tab) => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-6 border-b-2 transition font-medium flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary-surface)]/50'
                    : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)]'
                }`}
                >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Barra de búsqueda y acciones */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Buscar ${activeTab === 'courses' ? 'cursos' : activeTab === 'teachers' ? 'docentes' : 'estudiantes'}...`}
                className="w-full pl-11 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all shadow-sm"
              />
            </div>
            <button
              onClick={() => handleOpenModal('create')}
              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium"
            >
              <Plus className="w-5 h-5" />
              {activeTab === 'courses' && 'Crear Curso'}
              {activeTab === 'teachers' && 'Agregar Docente'}
              {activeTab === 'students' && 'Agregar Estudiante'}
            </button>
          </div>

          {/* Tabla Wrapper */}
          <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-[var(--color-text)]">
                    <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                        <tr>
                            {activeTab === 'courses' && (
                                <>
                                    <th className="px-6 py-3">Código</th>
                                    <th className="px-6 py-3">Nombre</th>
                                    <th className="px-6 py-3">Docente</th>
                                    <th className="px-6 py-3 text-center">Secciones</th>
                                    <th className="px-6 py-3 text-center">Estudiantes</th>
                                </>
                            )}
                            {activeTab === 'teachers' && (
                                <>
                                    <th className="px-6 py-3">Nombre</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Departamento</th>
                                    <th className="px-6 py-3 text-center">Cursos</th>
                                </>
                            )}
                            {activeTab === 'students' && (
                                <>
                                    <th className="px-6 py-3">Nombre</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Carrera</th>
                                    <th className="px-6 py-3 text-center">Semestre</th>
                                    <th className="px-6 py-3 text-center">Cursos</th>
                                </>
                            )}
                            <th className="px-6 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {activeTab === 'courses' && courses.map((course) => (
                            <tr key={course.id} className="bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors">
                                <td className="px-6 py-4 font-medium">{course.code}</td>
                                <td className="px-6 py-4">{course.name}</td>
                                <td className="px-6 py-4">{course.teacher}</td>
                                <td className="px-6 py-4 text-center">{course.sections}</td>
                                <td className="px-6 py-4 text-center">{course.students}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleOpenModal('assign')} className="p-2 text-[var(--color-success)] hover:bg-[var(--color-success-light)] rounded-lg transition" title="Asignar"><Users className="w-4 h-4" /></button>
                                        <button onClick={() => handleOpenModal('edit')} className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] rounded-lg transition" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleOpenModal('delete')} className="p-2 text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg transition" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {activeTab === 'teachers' && teachers.map((teacher) => (
                            <tr key={teacher.id} className="bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors">
                                <td className="px-6 py-4 font-medium">{teacher.name}</td>
                                <td className="px-6 py-4">{teacher.email}</td>
                                <td className="px-6 py-4">{teacher.department}</td>
                                <td className="px-6 py-4 text-center">{teacher.courses}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleOpenModal('assign')} className="p-2 text-[var(--color-success)] hover:bg-[var(--color-success-light)] rounded-lg transition" title="Asignar"><BookOpen className="w-4 h-4" /></button>
                                        <button onClick={() => handleOpenModal('edit')} className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] rounded-lg transition" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleOpenModal('delete')} className="p-2 text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg transition" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {activeTab === 'students' && students.map((student) => (
                            <tr key={student.id} className="bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors">
                                <td className="px-6 py-4 font-medium">{student.name}</td>
                                <td className="px-6 py-4">{student.email}</td>
                                <td className="px-6 py-4">{student.career}</td>
                                <td className="px-6 py-4 text-center">{student.semester}</td>
                                <td className="px-6 py-4 text-center">{student.courses}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleOpenModal('assign')} className="p-2 text-[var(--color-success)] hover:bg-[var(--color-success-light)] rounded-lg transition" title="Asignar"><BookOpen className="w-4 h-4" /></button>
                                        <button onClick={() => handleOpenModal('edit')} className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] rounded-lg transition" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleOpenModal('delete')} className="p-2 text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg transition" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
          </div>
        </div>
      </div>

      {/* Modal genérico */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity animate-in fade-in duration-200">
          <div className="bg-[var(--color-surface)] rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="sticky top-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] p-6 z-10 flex justify-between items-center">
              <h3 className="text-[var(--color-primary)] mb-0 text-lg font-semibold">
                {modalType === 'create' && `Crear ${activeTab === 'courses' ? 'Curso' : activeTab === 'teachers' ? 'Docente' : 'Estudiante'}`}
                {modalType === 'edit' && 'Editar Información'}
                {modalType === 'delete' && 'Confirmar Eliminación'}
                {modalType === 'assign' && 'Asignar Recursos'}
              </h3>
              <button onClick={handleCloseModal} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1">
              {modalType === 'delete' ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-[var(--color-danger-light)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-danger)]">
                    <Trash2 className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-medium mb-2 text-[var(--color-text)]">¿Estás seguro de continuar?</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-0">Esta acción eliminará permanentemente el registro seleccionado.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Ejemplo de formulario */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                        {activeTab === 'courses' ? 'Nombre del Curso' : 'Nombre Completo'}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                      placeholder="Ej. Cálculo I"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                        {activeTab === 'courses' ? 'Código' : 'Correo Electrónico'}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                      placeholder={activeTab === 'courses' ? "Ej. MAT-101" : "ejemplo@ucb.edu.bo"}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] p-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-surface-hover)] transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCloseModal}
                className={`px-5 py-2.5 text-white rounded-lg transition font-medium shadow-sm flex items-center gap-2 ${
                  modalType === 'delete'
                    ? 'bg-[var(--color-danger)] hover:bg-[var(--color-danger-dark)]'
                    : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
                }`}
              >
                {modalType === 'delete' && <Trash2 className="w-4 h-4" />}
                {modalType === 'create' && <Plus className="w-4 h-4" />}
                {modalType === 'edit' && <CheckCircle className="w-4 h-4" />}
                {modalType === 'assign' && <Users className="w-4 h-4" />}
                <span>{modalType === 'delete' ? 'Eliminar' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
