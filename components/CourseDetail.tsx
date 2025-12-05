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
  const [isUploading, setIsUploading] = useState(false);

  // Exam Taking State
  const [showExamModal, setShowExamModal] = useState(false);
  const [activeExam, setActiveExam] = useState<any>(null);
  const [examAnswers, setExamAnswers] = useState<Record<number, any>>({}); // questionId -> { text?, optionId? }

  useEffect(() => {
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
            color: 'bg-[var(--color-primary)]', 
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
      <div className="p-6 lg:p-8 flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!course) return <div>Curso no encontrado</div>;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Mis Cursos
        </button>

        <div className="bg-[var(--color-primary)] rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
           <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold border border-white/10 mb-3 inline-block">
                {course.code}
              </span>
              <h1 className="text-white text-3xl font-bold mb-1 leading-tight">{course.name}</h1>
              <p className="text-white/90 mb-0 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></span>
                  {course.teacher.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[var(--color-surface)] rounded-xl shadow-sm mb-6 border border-[var(--color-border)]">
        <div className="border-b border-[var(--color-border)]">
          <div className="flex gap-1 px-6 overflow-x-auto">
            <button onClick={() => setActiveTab('resources')} className={`py-4 px-6 border-b-2 transition font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'resources' ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary-surface)]/50' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)]'}`}>
              <FileText className="w-5 h-5" /> Recursos
            </button>
            <button onClick={() => setActiveTab('tasks')} className={`py-4 px-6 border-b-2 transition font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'tasks' ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary-surface)]/50' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)]'}`}>
              <CheckSquare className="w-5 h-5" /> Tareas
            </button>
            <button onClick={() => setActiveTab('exams')} className={`py-4 px-6 border-b-2 transition font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'exams' ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary-surface)]/50' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)]'}`}>
              <ClipboardList className="w-5 h-5" /> Exámenes
            </button>
          </div>
        </div>

        <div className="p-6 min-h-[300px]">
          {/* Resources Content */}
          {activeTab === 'resources' && (
            <div className="space-y-3">
              {resources.length === 0 && (
                <div className="text-center py-12 text-[var(--color-text-secondary)]">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                    <p>No hay recursos disponibles.</p>
                </div>
              )}
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center gap-4 p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl hover:shadow-md transition-all group">
                   <div className="w-12 h-12 bg-[var(--color-primary-surface)] rounded-lg flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                       <FileText className="w-6 h-6" />
                   </div>
                   <div className="flex-1 min-w-0">
                       <p className="mb-1 truncate font-semibold text-[var(--color-text)]">{resource.title}</p>
                       <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                           <span className="uppercase font-medium bg-[var(--color-surface)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">{resource.type}</span>
                           <span>•</span>
                           <span>{resource.date}</span>
                       </div>
                   </div>
                   {resource.url && (
                       <a href={resource.url} target="_blank" className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] rounded-lg transition" title="Abrir recurso">
                           <ExternalLink className="w-5 h-5"/>
                       </a>
                   )}
                </div>
              ))}
            </div>
          )}

          {/* Tasks Content */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {tasks.length === 0 && (
                <div className="text-center py-12 text-[var(--color-text-secondary)]">
                    <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                    <p>No hay tareas asignadas.</p>
                </div>
              )}
              {tasks.map((task) => {
                  const isCompleted = task.status === 'submitted' || task.status === 'graded';
                  const statusColor = isCompleted 
                    ? { border: 'border-[var(--color-success)]', bg: 'bg-[var(--color-success-light)]', text: 'text-[var(--color-success-dark)]' }
                    : { border: 'border-[var(--color-warning)]', bg: 'bg-[var(--color-warning-light)]', text: 'text-[var(--color-warning-dark)]' };
                    
                  return (
                <div key={task.id} className={`p-5 border-l-4 rounded-lg bg-[var(--color-surface)] border border-t border-r border-b border-[var(--color-border)] hover:shadow-sm transition ${statusColor.border}`}>
                   <div className="flex justify-between items-start gap-4">
                       <div>
                           <h4 className="text-[var(--color-text)] font-bold text-lg mb-1">{task.title}</h4>
                           <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">{task.description}</p>
                           <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] font-medium">
                               <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> Vence: {task.dueDate}</span>
                               <span>•</span>
                               <span>{task.points} pts</span>
                           </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColor.bg} ${statusColor.text}`}>
                               {task.status === 'pending' ? 'Pendiente' : (task.status === 'graded' ? 'Calificado' : 'Entregado')}
                           </span>
                           {task.grade && <span className="text-lg font-bold text-[var(--color-text)]">{task.grade} <span className="text-xs font-normal text-[var(--color-text-secondary)]">/ {task.points}</span></span>}
                       </div>
                   </div>
                   <div className="flex justify-end mt-4 border-t border-[var(--color-border)] pt-4">
                       {task.status === 'pending' && userRole === 'student' && (
                           <button onClick={() => handleOpenSubmit(task.id)} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg flex gap-2 items-center hover:bg-[var(--color-primary-dark)] transition shadow-sm font-medium text-sm">
                               <Upload className="w-4 h-4"/> Entregar Tarea
                           </button>
                       )}
                   </div>
                </div>
              )})}
            </div>
          )}

          {/* Exams Content */}
          {activeTab === 'exams' && (
            <div className="space-y-4">
              {exams.length === 0 && (
                <div className="text-center py-12 text-[var(--color-text-secondary)]">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                    <p>No hay exámenes programados.</p>
                </div>
              )}
              {exams.map((exam) => {
                 const isCompleted = exam.status === 'submitted' || exam.status === 'graded';
                 const statusColor = exam.status === 'graded'
                    ? { border: 'border-[var(--color-success)]', bg: 'bg-[var(--color-success-light)]', text: 'text-[var(--color-success-dark)]' }
                    : (exam.status === 'submitted' 
                        ? { border: 'border-[var(--color-info)]', bg: 'bg-[var(--color-info-light)]', text: 'text-[var(--color-info-dark)]' }
                        : { border: 'border-[var(--color-danger)]', bg: 'bg-[var(--color-danger-light)]', text: 'text-[var(--color-danger-dark)]' });
                
                 return (
                <div key={exam.id} className={`p-5 border-l-4 rounded-lg bg-[var(--color-surface)] border border-t border-r border-b border-[var(--color-border)] hover:shadow-sm transition ${statusColor.border}`}>
                   <div className="flex justify-between items-start gap-4">
                       <div>
                           <h4 className="text-[var(--color-text)] font-bold text-lg mb-1">{exam.title}</h4>
                           <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2 mb-0">
                               <Calendar className="w-4 h-4"/> {exam.date} • {exam.time} • {exam.duration}
                           </p>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColor.bg} ${statusColor.text}`}>
                               {exam.status === 'graded' ? `Nota: ${exam.grade}` : (exam.status === 'submitted' ? 'Enviado' : 'Pendiente')}
                           </span>
                       </div>
                   </div>
                   <div className="flex justify-end mt-4 border-t border-[var(--color-border)] pt-4">
                       {exam.status === 'upcoming' && userRole === 'student' && (
                           <button onClick={() => handleStartExam(exam.id)} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition shadow-sm font-medium text-sm">
                               Comenzar Examen
                           </button>
                       )}
                   </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>

      {/* Assignment Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--color-surface)] rounded-xl shadow-2xl max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-[var(--color-primary)]">Entregar Tarea</h3>
                  <button onClick={() => setShowSubmitModal(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">Archivo de la Tarea</label>
                      
                      {!submissionUrl ? (
                        <div 
                          className={`border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isUploading ? 'bg-[var(--color-bg)] opacity-50 cursor-not-allowed' : 'hover:bg-[var(--color-bg)] hover:border-[var(--color-primary)]'}`}
                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          onDrop={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isUploading) return;
                            
                            const file = e.dataTransfer.files[0];
                            if (file) {
                              setIsUploading(true);
                              const formData = new FormData();
                              formData.append('file', file);

                              try {
                                const response = await fetch('http://localhost:3001/upload', {
                                  method: 'POST',
                                  body: formData,
                                });

                                if (!response.ok) throw new Error('Upload failed');

                                const data = await response.json();
                                setSubmissionUrl(`http://localhost:3001${data.path}`);
                              } catch (error) {
                                console.error('Upload error:', error);
                                alert('Error al subir el archivo');
                              } finally {
                                setIsUploading(false);
                              }
                            }
                          }}
                          onClick={() => !isUploading && document.getElementById('file-upload-input')?.click()}
                        >
                          <input 
                            type="file" 
                            id="file-upload-input" 
                            className="hidden" 
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setIsUploading(true);
                                  const formData = new FormData();
                                  formData.append('file', file);

                                  try {
                                    const response = await fetch('http://localhost:3001/upload', {
                                      method: 'POST',
                                      body: formData,
                                    });

                                    if (!response.ok) throw new Error('Upload failed');

                                    const data = await response.json();
                                    setSubmissionUrl(`http://localhost:3001${data.path}`);
                                  } catch (error) {
                                    console.error('Upload error:', error);
                                    alert('Error al subir el archivo');
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }
                            }}
                          />
                          {isUploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)] mb-2"></div>
                          ) : (
                            <Upload className="w-10 h-10 text-[var(--color-text-secondary)] mb-3" />
                          )}
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {isUploading ? 'Subiendo archivo...' : 'Arrastra un archivo aquí o haz clic para seleccionar'}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)]">
                          <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                          <span className="flex-1 truncate text-sm text-[var(--color-text)]">{submissionUrl}</span>
                          <button 
                            onClick={() => setSubmissionUrl('')}
                            className="p-1 hover:bg-[var(--color-surface-hover)] rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                  </div>
                  <div>
                      <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">Comentarios Adicionales</label>
                      <textarea placeholder="Escribe aquí..." className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none" rows={3} value={submissionContent} onChange={e => setSubmissionContent(e.target.value)} />
                  </div>
                  <div className="pt-2">
                    <button onClick={handleSubmitAssignment} disabled={isSubmitting} className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-70 transition font-medium shadow-sm">
                        {isSubmitting ? 'Enviando...' : 'Entregar Tarea'}
                    </button>
                  </div>
              </div>
          </div>
        </div>
      )}

      {/* Exam Taking Modal */}
      {showExamModal && activeExam && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
              <div className="bg-[var(--color-surface)] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
                  <div className="p-6 border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-surface)] z-10 flex justify-between items-center">
                      <div>
                          <h2 className="text-xl font-bold text-[var(--color-primary)]">{activeExam.title}</h2>
                          <p className="text-sm text-[var(--color-text-secondary)] font-medium flex items-center gap-1"><Calendar className="w-4 h-4"/> Tiempo límite: {activeExam.duration} min</p>
                      </div>
                      <button onClick={() => setShowExamModal(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] font-medium text-sm px-3 py-1 rounded hover:bg-[var(--color-danger-light)] transition">Salir</button>
                  </div>
                  
                  <div className="p-8 space-y-8 flex-1 bg-[var(--color-bg)]">
                      {activeExam.questions.map((q: any, idx: number) => (
                          <div key={q.id} className="border border-[var(--color-border)] p-6 rounded-xl bg-[var(--color-surface)] shadow-sm">
                              <p className="font-bold mb-4 text-lg text-[var(--color-text)] flex gap-2">
                                  <span className="text-[var(--color-primary)]">{idx + 1}.</span> 
                                  {q.text} 
                                  <span className="text-xs font-normal text-[var(--color-text-secondary)] bg-[var(--color-bg)] px-2 py-1 rounded h-fit border border-[var(--color-border)]">({q.points} pts)</span>
                              </p>
                              
                              {q.type === 'OPEN' ? (
                                  <textarea 
                                    className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition" 
                                    rows={3} 
                                    placeholder="Escribe tu respuesta aquí..." 
                                    onChange={(e) => handleExamAnswer(q.id, e.target.value, 'OPEN')}
                                  />
                              ) : (
                                  <div className="space-y-3">
                                      {q.options.map((opt: any) => (
                                          <label key={opt.id} className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)] cursor-pointer hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-primary)] transition">
                                              <input 
                                                type="radio" 
                                                name={`q-${q.id}`} 
                                                value={opt.id} 
                                                onChange={(e) => handleExamAnswer(q.id, e.target.value, 'MULTIPLE_CHOICE')}
                                                className="text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-4 h-4"
                                              />
                                              <span className="text-[var(--color-text)]">{opt.text}</span>
                                          </label>
                                      ))}
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>

                  <div className="p-6 border-t border-[var(--color-border)] sticky bottom-0 bg-[var(--color-surface)]">
                      <button onClick={handleSubmitExam} disabled={isSubmitting} className="w-full py-3.5 bg-[var(--color-success)] text-white font-bold rounded-lg hover:bg-[var(--color-success-dark)] disabled:opacity-70 transition shadow-md text-lg">
                          {isSubmitting ? 'Enviando respuestas...' : 'Finalizar y Enviar Examen'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

