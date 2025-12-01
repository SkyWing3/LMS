'use client';

import { ArrowLeft, FileText, CheckSquare, ClipboardList, Calendar, Download, ExternalLink, Upload, X, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCourseDetails } from '@/app/actions/data';
import { submitAssignment, getExamDetailsForStudent, submitExam } from '@/app/actions/student';
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
  
  // Assignment Submission Modal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionContent, setSubmissionContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exam Taking State
  const [showExamModal, setShowExamModal] = useState(false);
  const [activeExam, setActiveExam] = useState<any>(null);
  const [examAnswers, setExamAnswers] = useState<Record<number, any>>({}); // questionId -> { text?, optionId? }

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
        color: 'bg-blue-500', 
      });

      setTasks(data.assignments.map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: new Date(a.dueDate).toLocaleDateString(),
        status: a.submissions[0]?.status || 'pending',
        points: a.totalPoints,
        grade: a.submissions[0]?.grade
      })));

      setResources(data.materials.map((m: any) => ({
        id: m.id,
        title: m.title,
        type: m.type,
        size: 'Unknown', 
        date: new Date(m.createdAt).toLocaleDateString(),
        url: m.url
      })));

      setExams(data.exams.map((e: any) => ({
        id: e.id,
        title: e.title,
        date: new Date(e.date).toLocaleDateString(),
        time: new Date(e.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        duration: `${e.duration} min`,
        status: e.results[0]?.status || 'upcoming', // submitted, graded, upcoming
        grade: e.results[0]?.grade,
        topics: []
      })));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  // --- Assignment Logic ---
  const handleOpenSubmit = (taskId: number) => {
    setSelectedTaskId(taskId);
    setShowSubmitModal(true);
    setSubmissionUrl('');
    setSubmissionContent('');
  };

  const handleSubmitAssignment = async () => {
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
      fetchData(); 
    } else {
      alert(result.error || 'Error al entregar la tarea');
    }
  };

  // --- Exam Logic ---
  const handleStartExam = async (examId: number) => {
    const details = await getExamDetailsForStudent(examId);
    if (details) {
        setActiveExam(details);
        setExamAnswers({});
        setShowExamModal(true);
    }
  };

  const handleExamAnswer = (questionId: number, value: any, type: 'OPEN' | 'MULTIPLE_CHOICE') => {
      setExamAnswers(prev => ({
          ...prev,
          [questionId]: type === 'OPEN' ? { text: value, questionId } : { optionId: parseInt(value), questionId }
      }));
  };

  const handleSubmitExam = async () => {
      if (!activeExam) return;
      setIsSubmitting(true);
      
      const answersArray = Object.values(examAnswers);
      const result = await submitExam(activeExam.id, answersArray);
      
      setIsSubmitting(false);
      if (result.success) {
          setShowExamModal(false);
          setActiveExam(null);
          alert('Examen enviado correctamente');
          fetchData();
      } else {
          alert('Error al enviar el examen');
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
            <button onClick={() => setActiveTab('resources')} className={`py-4 px-4 border-b-2 transition flex items-center gap-2 ${activeTab === 'resources' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'}`}>
              <FileText className="w-5 h-5" /> Recursos
            </button>
            <button onClick={() => setActiveTab('tasks')} className={`py-4 px-4 border-b-2 transition flex items-center gap-2 ${activeTab === 'tasks' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'}`}>
              <CheckSquare className="w-5 h-5" /> Tareas
            </button>
            <button onClick={() => setActiveTab('exams')} className={`py-4 px-4 border-b-2 transition flex items-center gap-2 ${activeTab === 'exams' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'}`}>
              <ClipboardList className="w-5 h-5" /> Exámenes
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Resources Content (Unchanged logic) */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              {resources.length === 0 && <p className="text-gray-500">No hay recursos disponibles.</p>}
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center gap-4 p-4 border border-[var(--color-border)] rounded-lg hover:shadow-md transition">
                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><FileText className="w-6 h-6 text-[var(--color-primary)]" /></div>
                   <div className="flex-1 min-w-0">
                       <p className="mb-1 truncate font-bold">{resource.title}</p>
                       <p className="text-sm text-gray-600">{resource.type}</p>
                       {resource.url && <a href={resource.url} target="_blank" className="text-xs text-blue-500 hover:underline block truncate">{resource.url}</a>}
                   </div>
                </div>
              ))}
            </div>
          )}

          {/* Tasks Content */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {tasks.length === 0 && <p className="text-gray-500">No hay tareas asignadas.</p>}
              {tasks.map((task) => (
                <div key={task.id} className={`p-5 border-l-4 rounded-lg ${task.status === 'submitted' || task.status === 'graded' ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}`}>
                   <div className="flex justify-between">
                       <div>
                           <h4 className="text-[var(--color-primary)] font-bold">{task.title}</h4>
                           <p className="text-sm">{task.description}</p>
                       </div>
                       <span className={`px-3 py-1 rounded text-sm h-fit ${task.status !== 'pending' ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}>
                           {task.status === 'pending' ? 'Pendiente' : (task.status === 'graded' ? 'Calificado' : 'Entregado')}
                       </span>
                   </div>
                   <div className="flex items-center justify-between mt-4">
                       <div className="text-sm text-gray-600">Vence: {task.dueDate} • {task.points} pts {task.grade && <span className="font-bold text-black ml-2">Nota: {task.grade}</span>}</div>
                       {task.status === 'pending' && userRole === 'student' && (
                           <button onClick={() => handleOpenSubmit(task.id)} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded flex gap-2 items-center hover:bg-blue-700"><Upload className="w-4 h-4"/> Entregar</button>
                       )}
                   </div>
                </div>
              ))}
            </div>
          )}

          {/* Exams Content */}
          {activeTab === 'exams' && (
            <div className="space-y-4">
              {exams.length === 0 && <p className="text-gray-500">No hay exámenes programados.</p>}
              {exams.map((exam) => (
                <div key={exam.id} className={`p-5 border-l-4 rounded-lg ${exam.status === 'graded' ? 'border-green-500 bg-green-50' : (exam.status === 'submitted' ? 'border-blue-500 bg-blue-50' : 'border-red-500 bg-red-50')}`}>
                   <div className="flex justify-between">
                       <div>
                           <h4 className="text-[var(--color-primary)] font-bold">{exam.title}</h4>
                           <p className="text-sm text-gray-600">{exam.date} • {exam.time} • {exam.duration}</p>
                       </div>
                       <span className={`px-3 py-1 rounded text-sm h-fit ${exam.status === 'graded' ? 'bg-green-200 text-green-800' : (exam.status === 'submitted' ? 'bg-blue-200 text-blue-800' : 'bg-red-100 text-red-800')}`}>
                           {exam.status === 'graded' ? `Nota: ${exam.grade}` : (exam.status === 'submitted' ? 'Enviado' : 'Pendiente')}
                       </span>
                   </div>
                   <div className="flex justify-end mt-4">
                       {exam.status === 'upcoming' && userRole === 'student' && (
                           <button onClick={() => handleStartExam(exam.id)} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-blue-700">Comenzar Examen</button>
                       )}
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assignment Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
              <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-lg">Entregar Tarea</h3>
                  <button onClick={() => setShowSubmitModal(false)}><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-4">
                  <input type="url" placeholder="URL del archivo (Drive, etc)" className="w-full p-2 border rounded" value={submissionUrl} onChange={e => setSubmissionUrl(e.target.value)} />
                  <textarea placeholder="Comentarios" className="w-full p-2 border rounded" rows={3} value={submissionContent} onChange={e => setSubmissionContent(e.target.value)} />
                  <button onClick={handleSubmitAssignment} disabled={isSubmitting} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                      {isSubmitting ? 'Enviando...' : 'Entregar'}
                  </button>
              </div>
          </div>
        </div>
      )}

      {/* Exam Taking Modal */}
      {showExamModal && activeExam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
              <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
                  <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                      <div>
                          <h2 className="text-xl font-bold text-[var(--color-primary)]">{activeExam.title}</h2>
                          <p className="text-sm text-gray-500">Tiempo: {activeExam.duration} min</p>
                      </div>
                      <button onClick={() => setShowExamModal(false)} className="text-gray-400 hover:text-red-500">Salir (Sin guardar)</button>
                  </div>
                  
                  <div className="p-6 space-y-8 flex-1">
                      {activeExam.questions.map((q: any, idx: number) => (
                          <div key={q.id} className="border p-4 rounded bg-gray-50">
                              <p className="font-bold mb-3">{idx + 1}. {q.text} <span className="text-xs font-normal text-gray-500">({q.points} pts)</span></p>
                              
                              {q.type === 'OPEN' ? (
                                  <textarea 
                                    className="w-full p-2 border rounded" 
                                    rows={3} 
                                    placeholder="Tu respuesta..." 
                                    onChange={(e) => handleExamAnswer(q.id, e.target.value, 'OPEN')}
                                  />
                              ) : (
                                  <div className="space-y-2">
                                      {q.options.map((opt: any) => (
                                          <label key={opt.id} className="flex items-center gap-3 p-2 border rounded bg-white cursor-pointer hover:bg-blue-50">
                                              <input 
                                                type="radio" 
                                                name={`q-${q.id}`} 
                                                value={opt.id} 
                                                onChange={(e) => handleExamAnswer(q.id, e.target.value, 'MULTIPLE_CHOICE')}
                                              />
                                              <span>{opt.text}</span>
                                          </label>
                                      ))}
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>

                  <div className="p-6 border-t sticky bottom-0 bg-white">
                      <button onClick={handleSubmitExam} disabled={isSubmitting} className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-50">
                          {isSubmitting ? 'Enviando respuestas...' : 'Finalizar y Enviar Examen'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

