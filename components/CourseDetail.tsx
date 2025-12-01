'use client';

import { ArrowLeft, FileText, CheckSquare, ClipboardList, Calendar, Download, ExternalLink, Upload, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCourseDetails } from '@/app/actions/data';
import { submitAssignment } from '@/app/actions/student';
import { getUser } from '@/app/actions/auth';

interface CourseDetailProps {
  courseId: number;
  onBack: () => void;
}

interface CourseData {
  id: number;
  name: string;
  code: string;
  teacher: { name: string };
  color: string;
}

interface Resource {
  id: number;
  title: string;
  type: string;
  size: string;
  date: string;
  url: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  status: string;
  points: number;
  grade?: number | null;
}

interface Exam {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
  status: string;
  grade?: number | null;
  topics: string[];
}

export function CourseDetail({ courseId, onBack }: CourseDetailProps) {
  const [activeTab, setActiveTab] = useState<'resources' | 'tasks' | 'exams'>('resources');
  const [course, setCourse] = useState<CourseData | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Submission Modal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionContent, setSubmissionContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    const [data, user] = await Promise.all([
      getCourseDetails(courseId),
      getUser()
    ]);
    
    if (user) setUserRole(user.role);

    if (data) {
      setCourse({
        id: data.id,
        name: data.name,
        code: data.code,
        teacher: data.teacher,
        color: 'bg-blue-500', // Default color as DB doesn't store it
      });

      // Map assignments to tasks
      setTasks(data.assignments.map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: new Date(a.dueDate).toLocaleDateString(),
        status: a.status,
        points: a.totalPoints,
        grade: a.submissions[0]?.grade
      })));

      // Map materials to resources
      setResources(data.materials.map((m: any) => ({
        id: m.id,
        title: m.title,
        type: m.type,
        size: 'Unknown', // Not in DB
        date: new Date(m.createdAt).toLocaleDateString(),
        url: m.url
      })));

      // Map exams
      setExams(data.exams.map((e: any) => ({
        id: e.id,
        title: e.title,
        date: new Date(e.date).toLocaleDateString(),
        time: new Date(e.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        duration: `${e.duration} min`,
        status: 'upcoming', // Logic needed for completed
        topics: []
      })));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const handleOpenSubmit = (taskId: number) => {
    setSelectedTaskId(taskId);
    setShowSubmitModal(true);
    setSubmissionUrl('');
    setSubmissionContent('');
  };

  const handleSubmit = async () => {
    if (!selectedTaskId) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('assignmentId', selectedTaskId.toString());
    formData.append('fileUrl', submissionUrl);
    formData.append('content', submissionContent);

    const result = await submitAssignment(formData);
    setIsSubmitting(false);

    if (result.success) {
      setShowSubmitModal(false);
      alert('Tarea entregada con éxito');
      fetchData(); // Refresh data to show updated status
    } else {
      alert(result.error || 'Error al entregar la tarea');
    }
  };

  if (isLoading) {
     return (
      <div className="p-6 lg:p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!course) return <div>Curso no encontrado</div>;

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
              <p className="text-white/90 mb-0">{course.teacher.name}</p>
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
              {resources.length === 0 && <p className="text-gray-500">No hay recursos disponibles.</p>}
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
                    {resource.url && (
                      <a href={resource.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block truncate">
                        {resource.url}
                      </a>
                    )}
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
              {tasks.length === 0 && <p className="text-gray-500">No hay tareas asignadas.</p>}
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

                    {task.status === 'pending' && userRole === 'student' && (
                      <button 
                        onClick={() => handleOpenSubmit(task.id)}
                        className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition flex items-center gap-2"
                      >
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
              {exams.length === 0 && <p className="text-gray-500">No hay exámenes programados.</p>}
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

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
              <h3 className="text-[var(--color-primary)] text-lg font-bold m-0">Entregar Tarea</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Sube tu tarea ingresando el enlace a tu archivo (Google Drive, Dropbox, etc.)</p>
              <div>
                <label className="block text-sm mb-2 font-medium">Enlace del archivo (URL)</label>
                <input
                  type="url"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 font-medium">Comentarios (Opcional)</label>
                <textarea
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Comentarios adicionales..."
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  rows={3}
                />
              </div>
            </div>
            <div className="p-6 border-t border-[var(--color-border)] flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !submissionUrl}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Entregando...' : 'Entregar Tarea'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
