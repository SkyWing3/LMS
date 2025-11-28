'use client';

import { BookOpen, Plus, Users, Upload, FileText, ClipboardList } from 'lucide-react';
import { useState } from 'react';

interface TeacherCoursesViewProps {
  onSelectCourse: (courseId: number) => void;
}

export function TeacherCoursesView({ onSelectCourse }: TeacherCoursesViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [contentType, setContentType] = useState<'resource' | 'task' | 'exam' | null>(null);

  const courses = [
    {
      id: 1,
      name: 'Programación Web - Sección A',
      code: 'INF-342-A',
      students: 32,
      pendingGrades: 5,
      schedule: 'Lun-Mié 10:00-12:00',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Programación Web - Sección B',
      code: 'INF-342-B',
      students: 28,
      pendingGrades: 3,
      schedule: 'Mar-Jue 14:00-16:00',
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Bases de Datos',
      code: 'INF-320',
      students: 25,
      pendingGrades: 4,
      schedule: 'Lun-Mié 14:00-16:00',
      color: 'bg-purple-500'
    },
  ];

  const handleAddContent = (courseId: number, type: 'resource' | 'task' | 'exam') => {
    setSelectedCourse(courseId);
    setContentType(type);
    setShowAddModal(true);
  };

  const handleSubmitContent = () => {
    // Aquí iría la lógica para agregar el contenido
    setShowAddModal(false);
    setSelectedCourse(null);
    setContentType(null);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2">Mis Cursos - Vista Docente</h1>
        <p className="text-[var(--color-text-secondary)]">Gestiona el contenido de tus cursos</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`${course.color} h-4`}></div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-[var(--color-primary)] mb-2">{course.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students} estudiantes
                    </span>
                    <span>•</span>
                    <span>{course.code}</span>
                    <span>•</span>
                    <span>{course.schedule}</span>
                  </div>
                </div>
                {course.pendingGrades > 0 && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-sm">
                    {course.pendingGrades} por calificar
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleAddContent(course.id, 'resource')}
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] hover:bg-blue-50 transition group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-[var(--color-primary)] transition">
                    <FileText className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <p className="mb-1">Agregar Recurso</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-0">PDF, videos, enlaces</p>
                  </div>
                </button>

                <button
                  onClick={() => handleAddContent(course.id, 'task')}
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-[var(--color-border)] rounded-lg hover:border-green-500 hover:bg-green-50 transition group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition">
                    <Upload className="w-6 h-6 text-green-600 group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <p className="mb-1">Asignar Tarea</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-0">Nueva tarea para estudiantes</p>
                  </div>
                </button>

                <button
                  onClick={() => handleAddContent(course.id, 'exam')}
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-[var(--color-border)] rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition">
                    <ClipboardList className="w-6 h-6 text-purple-600 group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <p className="mb-1">Crear Examen</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-0">Examen o evaluación</p>
                  </div>
                </button>
              </div>

              <button
                onClick={() => onSelectCourse(course.id)}
                className="w-full mt-4 px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Ver Contenido del Curso
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para agregar contenido */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] p-6 z-10">
              <h3 className="text-[var(--color-primary)] mb-1">
                {contentType === 'resource' && 'Agregar Recurso'}
                {contentType === 'task' && 'Asignar Nueva Tarea'}
                {contentType === 'exam' && 'Crear Examen'}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-0">
                {courses.find(c => c.id === selectedCourse)?.name}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {contentType === 'resource' && (
                <>
                  <div>
                    <label className="block text-sm mb-2">Título del Recurso</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="Ej: Introducción a React"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Tipo de Recurso</label>
                    <select className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                      <option>PDF</option>
                      <option>Video</option>
                      <option>Enlace Externo</option>
                      <option>Código</option>
                      <option>Presentación</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Archivo o URL</label>
                    <input
                      type="file"
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Descripción</label>
                    <textarea
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      rows={4}
                      placeholder="Describe el contenido del recurso"
                    />
                  </div>
                </>
              )}

              {contentType === 'task' && (
                <>
                  <div>
                    <label className="block text-sm mb-2">Título de la Tarea</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="Ej: Crear aplicación con React Hooks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Descripción</label>
                    <textarea
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      rows={5}
                      placeholder="Describe los requerimientos de la tarea"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Fecha Límite</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Puntos</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Archivos Adjuntos (opcional)</label>
                    <input
                      type="file"
                      multiple
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                </>
              )}

              {contentType === 'exam' && (
                <>
                  <div>
                    <label className="block text-sm mb-2">Título del Examen</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="Ej: Examen Parcial - Fundamentos Web"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Descripción</label>
                    <textarea
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      rows={4}
                      placeholder="Temas que abarcará el examen"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Fecha</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Hora</label>
                      <input
                        type="time"
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Duración (hrs)</label>
                      <input
                        type="number"
                        step="0.5"
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Puntos Totales</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="100"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] p-6 flex justify-end gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitContent}
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {contentType === 'resource' && 'Agregar Recurso'}
                {contentType === 'task' && 'Asignar Tarea'}
                {contentType === 'exam' && 'Crear Examen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
