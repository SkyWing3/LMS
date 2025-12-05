'use client';

import { BookOpen, Plus, Users, Upload, FileText, ClipboardList, Trash2, CheckCircle, Circle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTeacherCourses } from '@/app/actions/data';
import { createResource, createAssignment, createExamWithQuestions, getCourseSubmissions, gradeAssignmentSubmission, gradeExamSubmission, getExamSubmissionDetail } from '@/app/actions/teacher';

interface TeacherCoursesViewProps {
  onSelectCourse: (courseId: number) => void;
}

// ... interfaces for Course ...
interface Course {
  id: number;
  name: string;
  code: string;
  students: number;
  pendingGrades: number;
  schedule: string;
  color: string;
}

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number; // temp id for UI
  text: string;
  type: 'MULTIPLE_CHOICE' | 'OPEN';
  points: string;
  options?: QuestionOption[];
}

export function TeacherCoursesView({ onSelectCourse }: TeacherCoursesViewProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [showGradingDetailModal, setShowGradingDetailModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [contentType, setContentType] = useState<'resource' | 'task' | 'exam' | null>(null);
  
  // Form Data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceType, setResourceType] = useState('PDF');
  const [url, setUrl] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalPoints, setTotalPoints] = useState('100');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [duration, setDuration] = useState('');
  
  // Dynamic Question State
  const [questions, setQuestions] = useState<Question[]>([]);

  // Grading Data
  const [gradingData, setGradingData] = useState<any>(null); // Stores course with subs
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null); // Detail
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [submissionType, setSubmissionType] = useState<'assignment' | 'exam' | null>(null);

  const [resourceQueue, setResourceQueue] = useState<File[]>([]);
  const [isUploadingResources, setIsUploadingResources] = useState(false);

  const loadCourses = () => {
    getTeacherCourses().then((data) => {
      const mapped = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        code: c.code,
        students: c.students,
        pendingGrades: 0,
        schedule: 'Por definir',
        color: 'bg-[var(--color-primary)]'
      }));
      setCourses(mapped);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // --- Resource Upload Logic ---
  const handleUploadResources = async () => {
    if (!selectedCourse || resourceQueue.length === 0) return;
    setIsUploadingResources(true);

    try {
        for (const file of resourceQueue) {
            const formData = new FormData();
            formData.append('file', file);

            // 1. Upload
            const uploadRes = await fetch('http://localhost:3001/upload', { method: 'POST', body: formData });
            if (!uploadRes.ok) throw new Error('Upload failed');
            const uploadData = await uploadRes.json();
            const fileUrl = `http://localhost:3001${uploadData.path}`;

            // 2. Create
            const resourceFormData = new FormData();
            resourceFormData.append('courseId', selectedCourse.toString());
            resourceFormData.append('title', file.name);
            resourceFormData.append('type', file.name.split('.').pop()?.toUpperCase() || 'FILE');
            resourceFormData.append('url', fileUrl);
            resourceFormData.append('description', 'Uploaded via dashboard');

            await createResource(resourceFormData);
        }
        alert('Recursos creados exitosamente');
        setShowAddModal(false);
        setResourceQueue([]);
        loadCourses(); 
    } catch (e) {
        console.error(e);
        alert('Error al subir recursos');
    } finally {
        setIsUploadingResources(false);
    }
  };

  // --- Exam Creator Logic ---
  const addQuestion = () => {
    setQuestions([
      ...questions, 
      { id: Date.now(), text: '', type: 'OPEN', points: '10', options: [] }
    ]);
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const addOption = (qId: number) => {
    setQuestions(questions.map(q => {
      if (q.id !== qId) return q;
      const opts = q.options || [];
      return { ...q, options: [...opts, { text: '', isCorrect: false }] };
    }));
  };

  const updateOption = (qId: number, optIndex: number, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id !== qId) return q;
      const opts = [...(q.options || [])];
      opts[optIndex].text = text;
      return { ...q, options: opts };
    }));
  };

  const setCorrectOption = (qId: number, optIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id !== qId) return q;
      const opts = (q.options || []).map((o, i) => ({ ...o, isCorrect: i === optIndex }));
      return { ...q, options: opts };
    }));
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  // --- Form Submission ---
  const handleSubmitContent = async () => {
    if (!selectedCourse) return;
    
    const formData = new FormData();
    formData.append('courseId', selectedCourse.toString());
    formData.append('title', title);

    let result;

    if (contentType === 'resource') {
       // ... existing resource logic ...
        formData.append('type', resourceType);
        formData.append('url', url);
        formData.append('description', description);
        result = await createResource(formData);
    } else if (contentType === 'task') {
       // ... existing task logic ...
        formData.append('description', description);
        formData.append('dueDate', dueDate);
        formData.append('totalPoints', totalPoints);
        result = await createAssignment(formData);
    } else if (contentType === 'exam') {
       // NEW JSON Logic
       const examPayload = {
         courseId: selectedCourse.toString(),
         title,
         date: examDate,
         time: examTime,
         duration,
         totalPoints,
         questions
       };
       result = await createExamWithQuestions(examPayload);
    }

    if (result?.success) {
      setShowAddModal(false);
      resetForm();
      alert('Creado exitosamente');
    } else {
      alert(result?.error || 'Error');
    }
  };

  const resetForm = () => {
    setTitle(''); setQuestions([]); setUrl(''); setDescription('');
    setSelectedCourse(null); setContentType(null);
  };

  // --- Grading Logic ---
  const openGradingModal = async (courseId: number) => {
    setSelectedCourse(courseId);
    const data = await getCourseSubmissions(courseId);
    setGradingData(data);
    setShowGradingModal(true);
  };

  const viewSubmission = async (item: any, type: 'assignment' | 'exam') => {
    setSubmissionType(type);
    if (type === 'assignment') {
        setSelectedSubmission(item); // Item is the submission object
        setGradeInput(item.grade?.toString() || '');
        setFeedbackInput(item.feedback || '');
        setShowGradingDetailModal(true);
    } else {
        // Fetch full exam detail
        const detail = await getExamSubmissionDetail(item.id); // item is examResult
        if (detail) {
            setSelectedSubmission(detail);
            setGradeInput(detail.grade?.toString() || '');
            setFeedbackInput(detail.feedback || '');
            setShowGradingDetailModal(true);
        }
    }
  };

  const submitGrade = async () => {
    if (!selectedSubmission) return;
    const grade = parseFloat(gradeInput);
    
    if (submissionType === 'assignment') {
        await gradeAssignmentSubmission(selectedSubmission.id, grade, feedbackInput);
    } else {
        await gradeExamSubmission(selectedSubmission.id, grade, feedbackInput);
    }
    
    alert('Calificado y publicado');
    setShowGradingDetailModal(false);
    // Refresh list
    if (selectedCourse) openGradingModal(selectedCourse);
  };

  if (isLoading) return (
    <div className="p-6 lg:p-8 flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2 text-2xl lg:text-3xl">Panel Docente</h1>
        <p className="text-[var(--color-text-secondary)]">Gestiona tus cursos y evaluaciones</p>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6 border border-[var(--color-border)] hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-[var(--color-primary)] mb-1">{course.name}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{course.code}</p>
                </div>
                <span className="px-3 py-1 bg-[var(--color-bg)] rounded-full text-xs font-medium border border-[var(--color-border)]">{course.students} Estudiantes</span>
             </div>
             
             <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-[var(--color-border)]">
                <button 
                    onClick={() => { setSelectedCourse(course.id); setContentType('resource'); setShowAddModal(true); }} 
                    className="text-sm bg-[var(--color-primary-surface)] text-[var(--color-primary)] px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[var(--color-primary)] hover:text-white transition font-medium"
                >
                   <FileText className="w-4 h-4" /> Recursos
                </button>
                <button 
                    onClick={() => { setSelectedCourse(course.id); setContentType('exam'); setShowAddModal(true); }} 
                    className="text-sm bg-[var(--color-info-light)] text-[var(--color-info-dark)] px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[var(--color-info)] hover:text-white transition font-medium"
                >
                   <ClipboardList className="w-4 h-4" /> Nuevo Examen
                </button>
                <button 
                    onClick={() => { setSelectedCourse(course.id); setContentType('task'); setShowAddModal(true); }} 
                    className="text-sm bg-[var(--color-success-light)] text-[var(--color-success-dark)] px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[var(--color-success)] hover:text-white transition font-medium"
                >
                   <Upload className="w-4 h-4" /> Nueva Tarea
                </button>
                <button 
                    onClick={() => openGradingModal(course.id)} 
                    className="text-sm bg-[var(--color-warning-light)] text-[var(--color-warning-dark)] px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[var(--color-warning)] hover:text-white transition font-medium"
                >
                   <CheckCircle className="w-4 h-4" /> Calificar Entregas
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-[var(--color-border)] pb-4">
                <h2 className="text-xl font-bold text-[var(--color-primary)]">
                    {contentType === 'exam' ? 'Crear Examen' : (contentType === 'task' ? 'Crear Tarea' : 'Agregar Recursos')}
                </h2>
                <button onClick={() => setShowAddModal(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"><X className="w-5 h-5"/></button>
            </div>
            
            {contentType === 'resource' ? (
               <div className="space-y-4 flex-1">
                    <div 
                        className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[var(--color-bg)] hover:border-[var(--color-primary)] transition"
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                setResourceQueue(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
                            }
                        }}
                        onClick={() => document.getElementById('resource-upload-input')?.click()}
                    >
                        <input 
                            type="file" 
                            id="resource-upload-input" 
                            className="hidden" 
                            multiple
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setResourceQueue(prev => [...prev, ...Array.from(e.target.files || [])]);
                                }
                            }}
                        />
                        <Upload className="w-10 h-10 text-[var(--color-text-secondary)] mb-3" />
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            Arrastra tus archivos aquí o haz clic para seleccionar
                        </p>
                    </div>

                    {resourceQueue.length > 0 && (
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                            {resourceQueue.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <FileText className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                                        <span className="text-sm text-[var(--color-text)] truncate">{file.name}</span>
                                    </div>
                                    <button onClick={() => setResourceQueue(prev => prev.filter((_, i) => i !== idx))} className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)]">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
               </div>
            ) : (
                <>
                {/* Basic Fields */}
                <div className="space-y-4 mb-6">
                   <div>
                       <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">Título</label>
                       <input className="w-full p-2.5 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none" placeholder="Ej. Parcial 1" value={title} onChange={e => setTitle(e.target.value)} />
                   </div>
                   
                   {contentType === 'task' && (
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">Fecha de Entrega</label>
                            <input type="date" className="w-full p-2.5 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">Puntos Totales</label>
                            <input type="number" className="w-full p-2.5 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none" placeholder="100" value={totalPoints} onChange={e => setTotalPoints(e.target.value)} />
                        </div>
                     </div>
                   )}
                   {contentType === 'exam' && (
                       <div className="grid grid-cols-4 gap-4">
                           <div>
                               <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">Fecha</label>
                               <input type="date" className="w-full p-2.5 border border-[var(--color-border)] rounded-lg" value={examDate} onChange={e => setExamDate(e.target.value)} />
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">Hora</label>
                               <input type="time" className="w-full p-2.5 border border-[var(--color-border)] rounded-lg" value={examTime} onChange={e => setExamTime(e.target.value)} />
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">Duración (min)</label>
                               <input type="number" placeholder="60" className="w-full p-2.5 border border-[var(--color-border)] rounded-lg" value={duration} onChange={e => setDuration(e.target.value)} />
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">Puntos</label>
                               <input type="number" placeholder="100" className="w-full p-2.5 border border-[var(--color-border)] rounded-lg" value={totalPoints} onChange={e => setTotalPoints(e.target.value)} />
                           </div>
                       </div>
                   )}
                </div>

                {/* Dynamic Questions for Exam */}
                {contentType === 'exam' && (
                    <div className="border-t border-[var(--color-border)] pt-6 flex-1">
                        <h3 className="font-bold mb-4 text-[var(--color-primary)]">Preguntas</h3>
                        {questions.map((q, idx) => (
                            <div key={q.id} className="border border-[var(--color-border)] p-4 rounded-lg mb-4 bg-[var(--color-bg)] relative group">
                                <button onClick={() => removeQuestion(q.id)} className="absolute top-2 right-2 text-[var(--color-danger)] opacity-0 group-hover:opacity-100 transition hover:text-[var(--color-danger-dark)]"><Trash2 className="w-4 h-4"/></button>
                                <div className="flex gap-3 mb-3">
                                    <span className="pt-2 font-bold text-[var(--color-text-secondary)]">{idx + 1}.</span>
                                    <input className="flex-1 p-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-primary)]" placeholder="Texto de la pregunta" value={q.text} onChange={e => updateQuestion(q.id, 'text', e.target.value)} />
                                    <select className="p-2 border border-[var(--color-border)] rounded bg-white" value={q.type} onChange={e => updateQuestion(q.id, 'type', e.target.value)}>
                                        <option value="OPEN">Abierta</option>
                                        <option value="MULTIPLE_CHOICE">Selección Múltiple</option>
                                    </select>
                                    <input className="w-20 p-2 border border-[var(--color-border)] rounded" type="number" placeholder="Pts" value={q.points} onChange={e => updateQuestion(q.id, 'points', e.target.value)} />
                                </div>
                                
                                {q.type === 'MULTIPLE_CHOICE' && (
                                    <div className="pl-8 space-y-2">
                                        {q.options?.map((opt, optIdx) => (
                                            <div key={optIdx} className="flex items-center gap-3">
                                                <input type="radio" name={`q-${q.id}`} checked={opt.isCorrect} onChange={() => setCorrectOption(q.id, optIdx)} className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                                                <input className="flex-1 p-1.5 border border-[var(--color-border)] rounded text-sm" placeholder={`Opción ${optIdx + 1}`} value={opt.text} onChange={e => updateOption(q.id, optIdx, e.target.value)} />
                                            </div>
                                        ))}
                                        <button onClick={() => addOption(q.id)} className="text-xs text-[var(--color-primary)] hover:underline font-medium mt-1">+ Agregar Opción</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-bg)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition font-medium flex justify-center gap-2">
                            <Plus className="w-5 h-5"/> Agregar Pregunta
                        </button>
                    </div>
                )}
                </>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-border)]">
                <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg)] transition">Cancelar</button>
                <button 
                    onClick={contentType === 'resource' ? handleUploadResources : handleSubmitContent} 
                    className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition font-medium flex items-center gap-2"
                    disabled={contentType === 'resource' ? (isUploadingResources || resourceQueue.length === 0) : false}
                >
                    {contentType === 'resource' && isUploadingResources ? (
                        <>
                           <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                           Subiendo...
                        </>
                    ) : 'Guardar'}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* GRADING LIST MODAL */}
      {showGradingModal && gradingData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--color-surface)] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6 border-b border-[var(--color-border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--color-primary)]">Calificar: {gradingData.name}</h2>
                    <button onClick={() => setShowGradingModal(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"><X /></button>
                </div>

                <div className="space-y-6">
                    {/* Assignments */}
                    <div>
                        <h3 className="font-bold text-[var(--color-text)] mb-3 flex items-center gap-2"><Upload className="w-4 h-4"/> Tareas</h3>
                        {gradingData.assignments.map((a: any) => (
                            <div key={a.id} className="mb-4 border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-bg)]">
                                <h4 className="font-bold text-[var(--color-text)] mb-3">{a.title}</h4>
                                <div className="space-y-2">
                                    {a.submissions.map((s: any) => (
                                        <div key={s.id} className="flex justify-between items-center bg-[var(--color-surface)] p-3 rounded border border-[var(--color-border)]">
                                            <span className="font-medium">{s.student.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.status === 'graded' ? 'bg-[var(--color-success-light)] text-[var(--color-success-dark)]' : 'bg-[var(--color-warning-light)] text-[var(--color-warning-dark)]'}`}>
                                                    {s.status === 'graded' ? 'Calificado' : 'Pendiente'}
                                                </span>
                                                <button onClick={() => viewSubmission(s, 'assignment')} className="text-[var(--color-primary)] text-sm hover:underline font-medium">Ver Entrega</button>
                                            </div>
                                        </div>
                                    ))}
                                    {a.submissions.length === 0 && <p className="text-sm text-[var(--color-text-secondary)] italic">Sin entregas recibidas</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Exams */}
                    <div>
                        <h3 className="font-bold text-[var(--color-text)] mb-3 flex items-center gap-2"><ClipboardList className="w-4 h-4"/> Exámenes</h3>
                        {gradingData.exams.map((e: any) => (
                             <div key={e.id} className="mb-4 border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-bg)]">
                                 <h4 className="font-bold text-[var(--color-text)] mb-3">{e.title}</h4>
                                 <div className="space-y-2">
                                     {e.results.map((r: any) => (
                                         <div key={r.id} className="flex justify-between items-center bg-[var(--color-surface)] p-3 rounded border border-[var(--color-border)]">
                                             <span className="font-medium">{r.student.name}</span>
                                             <div className="flex items-center gap-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.status === 'graded' ? 'bg-[var(--color-success-light)] text-[var(--color-success-dark)]' : 'bg-[var(--color-warning-light)] text-[var(--color-warning-dark)]'}`}>
                                                    {r.status === 'graded' ? 'Calificado' : 'Pendiente'}
                                                </span>
                                                <button onClick={() => viewSubmission(r, 'exam')} className="text-[var(--color-primary)] text-sm hover:underline font-medium">Revisar</button>
                                             </div>
                                         </div>
                                     ))}
                                     {e.results.length === 0 && <p className="text-sm text-[var(--color-text-secondary)] italic">Sin intentos registrados</p>}
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* GRADING DETAIL MODAL */}
      {showGradingDetailModal && selectedSubmission && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
              <div className="bg-[var(--color-surface)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col">
                  <div className="flex justify-between items-center mb-6 border-b border-[var(--color-border)] pb-4">
                      <h2 className="text-xl font-bold text-[var(--color-primary)]">Evaluación de Estudiante</h2>
                      <button onClick={() => setShowGradingDetailModal(false)}><X className="text-[var(--color-text-secondary)]" /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2">
                    {submissionType === 'assignment' ? (
                        <div className="mb-6 p-5 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]">
                            <p className="font-bold text-[var(--color-text)] mb-2">Archivo Adjunto / Link:</p>
                            <a href={selectedSubmission.fileUrl} target="_blank" className="text-[var(--color-primary)] hover:underline block mb-4 font-medium flex items-center gap-2"><FileText className="w-4 h-4"/> Ver entrega</a>
                            
                            <p className="font-bold text-[var(--color-text)] mb-2">Comentarios del estudiante:</p>
                            <div className="p-3 bg-white rounded border border-[var(--color-border)] text-sm italic text-[var(--color-text-secondary)]">
                                {selectedSubmission.content || 'Sin comentarios'}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 space-y-4">
                            {selectedSubmission.exam.questions.map((q: any) => {
                                const ans = selectedSubmission.answers.find((a: any) => a.questionId === q.id);
                                return (
                                    <div key={q.id} className="border border-[var(--color-border)] p-4 rounded-lg bg-[var(--color-bg)]">
                                        <p className="font-bold mb-2 text-[var(--color-text)]">{q.text} <span className="text-xs font-normal text-[var(--color-text-secondary)]">({q.points} pts)</span></p>
                                        <div className="bg-white p-3 rounded border border-[var(--color-border)] text-sm">
                                            <span className="font-semibold text-[var(--color-text-secondary)] block mb-1">Respuesta del estudiante:</span>
                                            {q.type === 'OPEN' ? (
                                                <span className="text-[var(--color-text)]">{ans?.text || 'Sin respuesta'}</span>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[var(--color-text)] font-medium">
                                                        {q.options.find((o: any) => o.id === ans?.optionId)?.text || 'Sin selección'} 
                                                    </span>
                                                    {q.options.find((o: any) => o.id === ans?.optionId)?.isCorrect ? 
                                                        <span className="flex items-center text-[var(--color-success)] text-xs font-bold bg-[var(--color-success-light)] px-2 py-0.5 rounded"><CheckCircle className="w-3 h-3 mr-1"/> Correcto</span> : 
                                                        (ans ? <span className="flex items-center text-[var(--color-danger)] text-xs font-bold bg-[var(--color-danger-light)] px-2 py-0.5 rounded"><X className="w-3 h-3 mr-1"/> Incorrecto</span> : '')
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="border-t border-[var(--color-border)] pt-6 bg-[var(--color-surface)]">
                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-[var(--color-text)]">Nota Final (0-100)</label>
                                <input type="number" className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none font-bold text-lg" value={gradeInput} onChange={e => setGradeInput(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-[var(--color-text)]">Retroalimentación</label>
                            <textarea className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none" rows={3} value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)} placeholder="Escribe un comentario para el estudiante..." />
                        </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-border)]">
                      <button onClick={() => setShowGradingDetailModal(false)} className="px-5 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg)] transition">Cancelar</button>
                      <button onClick={submitGrade} className="px-5 py-2.5 bg-[var(--color-success)] text-white rounded-lg hover:bg-[var(--color-success-dark)] transition font-medium shadow-sm">Publicar Calificación</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}
