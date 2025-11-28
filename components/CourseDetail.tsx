'use client';

import { ArrowLeft, FileText, CheckSquare, ClipboardList, Calendar, Download, ExternalLink, Upload } from 'lucide-react';
import { useState } from 'react';

interface CourseDetailProps {
  courseId: number;
  onBack: () => void;
}

export function CourseDetail({ courseId, onBack }: CourseDetailProps) {
  const [activeTab, setActiveTab] = useState<'resources' | 'tasks' | 'exams'>('resources');

  // Datos de ejemplo del curso
  const courseData = {
    1: { name: 'Programación Web', code: 'INF-342', teacher: 'Dr. Carlos Méndez', color: 'bg-blue-500' },
    2: { name: 'Bases de Datos', code: 'INF-320', teacher: 'Dra. María González', color: 'bg-green-500' },
    3: { name: 'Cálculo II', code: 'MAT-202', teacher: 'Lic. Roberto Fernández', color: 'bg-purple-500' },
    4: { name: 'Ingeniería de Software', code: 'INF-350', teacher: 'Ing. Ana Morales', color: 'bg-orange-500' },
    5: { name: 'Redes de Computadoras', code: 'INF-330', teacher: 'Ing. Juan Pérez', color: 'bg-red-500' },
    6: { name: 'Inteligencia Artificial', code: 'INF-380', teacher: 'Dr. Luis Ramírez', color: 'bg-indigo-500' },
  };

  const course = courseData[courseId as keyof typeof courseData] || courseData[1];

  const resources = [
    { id: 1, title: 'Introducción a HTML y CSS', type: 'PDF', size: '2.5 MB', date: '15 Nov 2025', url: '#' },
    { id: 2, title: 'JavaScript Fundamentos', type: 'PDF', size: '3.2 MB', date: '10 Nov 2025', url: '#' },
    { id: 3, title: 'Framework React - Parte 1', type: 'Video', size: '150 MB', date: '08 Nov 2025', url: '#' },
    { id: 4, title: 'Diseño Responsivo con Flexbox', type: 'PDF', size: '1.8 MB', date: '05 Nov 2025', url: '#' },
    { id: 5, title: 'API REST y Fetch', type: 'Código', size: '0.5 MB', date: '01 Nov 2025', url: '#' },
  ];

  const tasks = [
    {
      id: 1,
      title: 'Tarea 1: Crear Landing Page Responsiva',
      description: 'Crear una página de aterrizaje completamente responsiva usando HTML, CSS y JavaScript.',
      dueDate: '25 Nov 2025',
      status: 'pending',
      points: 100
    },
    {
      id: 2,
      title: 'Tarea 2: Aplicación de Lista de Tareas con React',
      description: 'Desarrollar una aplicación de gestión de tareas utilizando React y hooks.',
      dueDate: '05 Dic 2025',
      status: 'pending',
      points: 150
    },
    {
      id: 3,
      title: 'Tarea 3: Formulario con Validación',
      description: 'Crear un formulario complejo con validación del lado del cliente.',
      dueDate: '20 Oct 2025',
      status: 'submitted',
      grade: 95,
      points: 100
    },
  ];

  const exams = [
    {
      id: 1,
      title: 'Examen Parcial - Fundamentos Web',
      date: '28 Nov 2025',
      time: '10:00 AM',
      duration: '2 horas',
      status: 'upcoming',
      topics: ['HTML5', 'CSS3', 'JavaScript ES6', 'DOM Manipulation']
    },
    {
      id: 2,
      title: 'Examen Final - Proyecto Completo',
      date: '15 Dic 2025',
      time: '14:00 PM',
      duration: '3 horas',
      status: 'upcoming',
      topics: ['React', 'APIs', 'Estado y Props', 'Routing', 'Hooks']
    },
    {
      id: 3,
      title: 'Primer Parcial',
      date: '15 Oct 2025',
      time: '10:00 AM',
      duration: '2 horas',
      status: 'completed',
      grade: 87,
      topics: ['HTML Básico', 'CSS Básico']
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Mis Cursos
        </button>

        <div className={`${course.color} rounded-xl p-6 text-white shadow-lg`}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-white mb-2">{course.name}</h1>
              <p className="text-white/90 mb-0">{course.teacher}</p>
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-lg">{course.code}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="border-b border-[var(--color-border)]">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-4 px-4 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'resources'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              <FileText className="w-5 h-5" />
              Recursos
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-4 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'tasks'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              <CheckSquare className="w-5 h-5" />
              Tareas
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`py-4 px-4 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'exams'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              Exámenes
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Recursos */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <h3 className="text-[var(--color-primary)] mb-4">Material del Curso</h3>
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center gap-4 p-4 border border-[var(--color-border)] rounded-lg hover:shadow-md transition"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="mb-1 truncate">{resource.title}</p>
                    <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                      <span>{resource.type}</span>
                      <span>•</span>
                      <span>{resource.size}</span>
                      <span>•</span>
                      <span>{resource.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="p-2 text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tareas */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <h3 className="text-[var(--color-primary)] mb-4">Tareas Asignadas</h3>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-5 border-l-4 rounded-lg ${
                    task.status === 'submitted'
                      ? 'border-green-500 bg-green-50'
                      : 'border-orange-500 bg-orange-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-[var(--color-primary)] mb-1">{task.title}</h4>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-0">{task.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm flex-shrink-0 ml-4 ${
                        task.status === 'submitted'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-orange-200 text-orange-800'
                      }`}
                    >
                      {task.status === 'submitted' ? 'Entregada' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Fecha límite: {task.dueDate}</span>
                      </div>
                      <span>•</span>
                      <span>Puntos: {task.points}</span>
                      {task.status === 'submitted' && task.grade && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">Calificación: {task.grade}/{task.points}</span>
                        </>
                      )}
                    </div>

                    {task.status === 'pending' && (
                      <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Entregar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Exámenes */}
          {activeTab === 'exams' && (
            <div className="space-y-4">
              <h3 className="text-[var(--color-primary)] mb-4">Exámenes</h3>
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className={`p-5 border-l-4 rounded-lg ${
                    exam.status === 'completed'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-[var(--color-primary)] mb-2">{exam.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{exam.date}</span>
                        </div>
                        <span>•</span>
                        <span>{exam.time}</span>
                        <span>•</span>
                        <span>Duración: {exam.duration}</span>
                      </div>
                    </div>
                    {exam.status === 'completed' && exam.grade && (
                      <span className="px-4 py-2 bg-blue-200 text-blue-800 rounded-lg flex-shrink-0 ml-4">
                        Nota: {exam.grade}/100
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-sm mb-2">Temas:</p>
                    <div className="flex flex-wrap gap-2">
                      {exam.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white border border-[var(--color-border)] rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
