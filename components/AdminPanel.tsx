'use client';

import { Plus, Edit2, Trash2, Users, BookOpen, UserCheck, Search } from 'lucide-react';
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
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2">Panel de Administración</h1>
        <p className="text-[var(--color-text-secondary)]">Gestiona cursos, docentes y estudiantes</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="border-b border-[var(--color-border)]">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-4 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'courses'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Cursos
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`py-4 px-4 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'teachers'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              Docentes
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-4 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'students'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              <Users className="w-5 h-5" />
              Estudiantes
            </button>
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
                className="w-full pl-11 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <button
              onClick={() => handleOpenModal('create')}
              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              {activeTab === 'courses' && 'Crear Curso'}
              {activeTab === 'teachers' && 'Agregar Docente'}
              {activeTab === 'students' && 'Agregar Estudiante'}
            </button>
          </div>

          {/* Tabla de Cursos */}
          {activeTab === 'courses' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-4 px-4 text-[var(--color-text-secondary)]">Código</th>
                    <th className="text-left py-4 px-4 text-[var(--color-text-secondary)]">Nombre</th>
                    <th className="text-left py-4 px-4 text-[var(--color-text-secondary)]">Docente</th>
                    <th className="text-center py-4 px-4 text-[var(--color-text-secondary)]">Secciones</th>
                    <th className="text-center py-4 px-4 text-[var(--color-text-secondary)]">Estudiantes</th>
                    <th className="text-center py-4 px-4 text-[var(--color-text-secondary)]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b border-[var(--color-border)] hover:bg-gray-50">
                      <td className="py-4 px-4">{course.code}</td>
                      <td className="py-4 px-4">{course.name}</td>
                      <td className="py-4 px-4">{course.teacher}</td>
                      <td className="py-4 px-4 text-center">{course.sections}</td>
                      <td className="py-4 px-4 text-center">{course.students}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal('assign')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Asignar"
                          >
                            <Users className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenModal('edit')}
                            className="p-2 text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenModal('delete')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tabla de Docentes */}
          {activeTab === 'teachers' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-4 px-4 text-[var(--color-text-secondary)]">Nombre</th>
                    <th className="text-left py-4 px-4 text-[var(--color-text-secondary)]">Email</th>
                    <th className="text-left py-4 px-4 text-[var(--color-text-secondary)]">Departamento</th>
                    <th className="text-center py-4 px-4 text-[var(--color-text-secondary)]">Cursos</th>
                    <th className="text-center py-4 px-4 text-[var(--color-text-secondary)]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b border-[var(--color-border)] hover:bg-gray-50">
                      <td className="py-4 px-4">{teacher.name}</td>
                      <td className="py-4 px-4">{teacher.email}</td>
                      <td className="py-4 px-4">{teacher.department}</td>
                      <td className="py-4 px-4 text-center">{teacher.courses}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal('assign')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Asignar cursos"
                          >
                            <BookOpen className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenModal('edit')}
                            className="p-2 text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenModal('delete')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tabla de Estudiantes */}
          {activeTab === 'students' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-4 px-4 text-[var(--color-text-secondary)]">Nombre</th>
                    <th className="text-left py-4 px-4 text-[var(--color-text-secondary)]">Email</th>
                    <th className="text-left py-4 px-4 text-[var(--color-text-secondary)]">Carrera</th>
                    <th className="text-center py-4 px-4 text-[var(--color-text-secondary)]">Semestre</th>
                    <th className="text-center py-4 px-4 text-[var(--color-text-secondary)]">Cursos</th>
                    <th className="text-center py-4 px-4 text-[var(--color-text-secondary)]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-[var(--color-border)] hover:bg-gray-50">
                      <td className="py-4 px-4">{student.name}</td>
                      <td className="py-4 px-4">{student.email}</td>
                      <td className="py-4 px-4">{student.career}</td>
                      <td className="py-4 px-4 text-center">{student.semester}</td>
                      <td className="py-4 px-4 text-center">{student.courses}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal('assign')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Asignar cursos"
                          >
                            <BookOpen className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenModal('edit')}
                            className="p-2 text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenModal('delete')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal genérico */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] p-6 z-10">
              <h3 className="text-[var(--color-primary)] mb-0">
                {modalType === 'create' && `Crear ${activeTab === 'courses' ? 'Curso' : activeTab === 'teachers' ? 'Docente' : 'Estudiante'}`}
                {modalType === 'edit' && 'Editar Información'}
                {modalType === 'delete' && 'Confirmar Eliminación'}
                {modalType === 'assign' && 'Asignar'}
              </h3>
            </div>

            <div className="p-6">
              {modalType === 'delete' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-lg mb-2">¿Estás seguro de eliminar este registro?</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-0">Esta acción no se puede deshacer.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Formulario de {modalType === 'create' ? 'creación' : modalType === 'edit' ? 'edición' : 'asignación'}
                  </p>
                  {/* Aquí irían los campos específicos del formulario */}
                  <div>
                    <label className="block text-sm mb-2">Campo de ejemplo</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="Ingresa información"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] p-6 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCloseModal}
                className={`px-6 py-3 text-white rounded-lg transition ${
                  modalType === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
                }`}
              >
                {modalType === 'delete' ? 'Eliminar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
