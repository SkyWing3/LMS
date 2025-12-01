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

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    getTeacherCourses().then((data) => {
      const mapped = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        code: c.code,
        students: c.students,
        pendingGrades: 0,
        schedule: 'Por definir',
        color: 'bg-blue-500'
      }));
      setCourses(mapped);
      setIsLoading(false);
    });
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

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2">Panel Docente</h1>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-md p-6">
             <h3 className="text-xl font-bold text-[var(--color-primary)]">{course.name}</h3>
             <div className="flex gap-4 mt-4">
                <button onClick={() => { setSelectedCourse(course.id); setContentType('exam'); setShowAddModal(true); }} className="text-sm bg-purple-50 text-purple-600 px-3 py-2 rounded flex gap-2">
                   <ClipboardList className="w-4 h-4" /> Nuevo Examen
                </button>
                <button onClick={() => { setSelectedCourse(course.id); setContentType('task'); setShowAddModal(true); }} className="text-sm bg-green-50 text-green-600 px-3 py-2 rounded flex gap-2">
                   <Upload className="w-4 h-4" /> Nueva Tarea
                </button>
                <button onClick={() => openGradingModal(course.id)} className="text-sm bg-orange-50 text-orange-600 px-3 py-2 rounded flex gap-2">
                   <CheckCircle className="w-4 h-4" /> Calificar Entregas
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">
                {contentType === 'exam' ? 'Crear Examen Completo' : 'Crear Contenido'}
            </h2>
            
            {/* Basic Fields */}
            <div className="space-y-4 mb-6">
               <input className="w-full p-2 border rounded" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
               {contentType === 'task' && (
                 <div className="grid grid-cols-2 gap-4">
                    <input type="date" className="p-2 border rounded" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                    <input type="number" className="p-2 border rounded" placeholder="Puntos" value={totalPoints} onChange={e => setTotalPoints(e.target.value)} />
                 </div>
               )}
               {contentType === 'exam' && (
                   <div className="grid grid-cols-4 gap-2">
                       <input type="date" className="p-2 border rounded" value={examDate} onChange={e => setExamDate(e.target.value)} />
                       <input type="time" className="p-2 border rounded" value={examTime} onChange={e => setExamTime(e.target.value)} />
                       <input type="number" placeholder="Duración (min)" className="p-2 border rounded" value={duration} onChange={e => setDuration(e.target.value)} />
                       <input type="number" placeholder="Total Puntos" className="p-2 border rounded" value={totalPoints} onChange={e => setTotalPoints(e.target.value)} />
                   </div>
               )}
            </div>

            {/* Dynamic Questions for Exam */}
            {contentType === 'exam' && (
                <div className="border-t pt-4">
                    <h3 className="font-bold mb-2">Preguntas</h3>
                    {questions.map((q, idx) => (
                        <div key={q.id} className="border p-4 rounded mb-4 bg-gray-50 relative">
                            <button onClick={() => removeQuestion(q.id)} className="absolute top-2 right-2 text-red-500"><Trash2 className="w-4 h-4"/></button>
                            <div className="flex gap-2 mb-2">
                                <input className="flex-1 p-2 border rounded" placeholder="Texto de la pregunta" value={q.text} onChange={e => updateQuestion(q.id, 'text', e.target.value)} />
                                <select className="p-2 border rounded" value={q.type} onChange={e => updateQuestion(q.id, 'type', e.target.value)}>
                                    <option value="OPEN">Abierta</option>
                                    <option value="MULTIPLE_CHOICE">Selección Múltiple</option>
                                </select>
                                <input className="w-20 p-2 border rounded" type="number" placeholder="Pts" value={q.points} onChange={e => updateQuestion(q.id, 'points', e.target.value)} />
                            </div>
                            
                            {q.type === 'MULTIPLE_CHOICE' && (
                                <div className="pl-4 space-y-2">
                                    {q.options?.map((opt, optIdx) => (
                                        <div key={optIdx} className="flex items-center gap-2">
                                            <input type="radio" name={`q-${q.id}`} checked={opt.isCorrect} onChange={() => setCorrectOption(q.id, optIdx)} />
                                            <input className="flex-1 p-1 border rounded text-sm" placeholder={`Opción ${optIdx + 1}`} value={opt.text} onChange={e => updateOption(q.id, optIdx, e.target.value)} />
                                        </div>
                                    ))}
                                    <button onClick={() => addOption(q.id)} className="text-xs text-blue-600">+ Agregar Opción</button>
                                </div>
                            )}
                        </div>
                    ))}
                    <button onClick={addQuestion} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded hover:bg-gray-50">+ Agregar Pregunta</button>
                </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded">Cancelar</button>
                <button onClick={handleSubmitContent} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* GRADING LIST MODAL */}
      {showGradingModal && gradingData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Calificar: {gradingData.name}</h2>
                    <button onClick={() => setShowGradingModal(false)}><X /></button>
                </div>

                <div className="space-y-6">
                    {/* Assignments */}
                    <div>
                        <h3 className="font-bold text-gray-600 mb-2">Tareas</h3>
                        {gradingData.assignments.map((a: any) => (
                            <div key={a.id} className="mb-4 border rounded p-4">
                                <h4 className="font-bold">{a.title}</h4>
                                <div className="space-y-2 mt-2">
                                    {a.submissions.map((s: any) => (
                                        <div key={s.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                            <span>{s.student.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded ${s.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {s.status}
                                                </span>
                                                <button onClick={() => viewSubmission(s, 'assignment')} className="text-blue-600 text-sm hover:underline">Ver Entrega</button>
                                            </div>
                                        </div>
                                    ))}
                                    {a.submissions.length === 0 && <p className="text-sm text-gray-400">Sin entregas</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Exams */}
                    <div>
                        <h3 className="font-bold text-gray-600 mb-2">Exámenes</h3>
                        {gradingData.exams.map((e: any) => (
                             <div key={e.id} className="mb-4 border rounded p-4">
                                 <h4 className="font-bold">{e.title}</h4>
                                 <div className="space-y-2 mt-2">
                                     {e.results.map((r: any) => (
                                         <div key={r.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                             <span>{r.student.name}</span>
                                             <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded ${r.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {r.status}
                                                </span>
                                                <button onClick={() => viewSubmission(r, 'exam')} className="text-blue-600 text-sm hover:underline">Revisar</button>
                                             </div>
                                         </div>
                                     ))}
                                     {e.results.length === 0 && <p className="text-sm text-gray-400">Sin intentos</p>}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
              <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                  <h2 className="text-xl font-bold mb-4">Revisión de Estudiante</h2>
                  
                  {submissionType === 'assignment' ? (
                      <div className="mb-6 p-4 bg-gray-50 rounded">
                          <p className="font-bold">Archivo/Link:</p>
                          <a href={selectedSubmission.fileUrl} target="_blank" className="text-blue-600 underline block mb-2">{selectedSubmission.fileUrl}</a>
                          <p className="font-bold">Comentarios del estudiante:</p>
                          <p>{selectedSubmission.content || 'Ninguno'}</p>
                      </div>
                  ) : (
                      <div className="mb-6 space-y-4">
                          {selectedSubmission.exam.questions.map((q: any) => {
                              const ans = selectedSubmission.answers.find((a: any) => a.questionId === q.id);
                              return (
                                  <div key={q.id} className="border p-3 rounded">
                                      <p className="font-bold mb-1">{q.text} ({q.points} pts)</p>
                                      <div className="bg-gray-50 p-2 rounded text-sm">
                                          <span className="font-semibold text-gray-600">Respuesta: </span>
                                          {q.type === 'OPEN' ? (
                                              <span>{ans?.text || 'Sin respuesta'}</span>
                                          ) : (
                                              <span>
                                                  {q.options.find((o: any) => o.id === ans?.optionId)?.text} 
                                                  {q.options.find((o: any) => o.id === ans?.optionId)?.isCorrect ? 
                                                    <CheckCircle className="inline w-4 h-4 text-green-500 ml-2"/> : 
                                                    (ans ? <X className="inline w-4 h-4 text-red-500 ml-2"/> : '')
                                                  }
                                              </span>
                                          )}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  )}

                  <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="block text-sm font-bold mb-1">Nota Final</label>
                              <input type="number" className="w-full p-2 border rounded" value={gradeInput} onChange={e => setGradeInput(e.target.value)} />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1">Feedback</label>
                          <textarea className="w-full p-2 border rounded" rows={3} value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)} />
                      </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                      <button onClick={() => setShowGradingDetailModal(false)} className="px-4 py-2 border rounded">Cancelar</button>
                      <button onClick={submitGrade} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Publicar Nota</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}
