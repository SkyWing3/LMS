'use client';

import { Award, TrendingUp, TrendingDown, Minus, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getStudentGrades } from '@/app/actions/data';

interface GradeDetail {
  type: string;
  score: number;
  max: number;
  weight: number;
  date: string;
}

interface CourseGrades {
  id: number;
  name: string;
  code: string;
  grades: GradeDetail[];
  average: number;
  trend: 'up' | 'down' | 'stable';
}

export function GradesView() {
  const [courses, setCourses] = useState<CourseGrades[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentGrades().then((data: any) => {
      setCourses(data);
      setIsLoading(false);
    });
  }, []);

  const overallAverage = courses.length > 0 
    ? courses.reduce((sum, course) => sum + course.average, 0) / courses.length 
    : 0;

  // Helper para clases semánticas
  const getGradeStatus = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 90) return { 
        text: 'text-[var(--color-success)]', 
        bg: 'bg-[var(--color-success-light)]', 
        border: 'border-[var(--color-success)]' 
    };
    if (percentage >= 80) return { 
        text: 'text-[var(--color-info)]', 
        bg: 'bg-[var(--color-info-light)]', 
        border: 'border-[var(--color-info)]' 
    };
    if (percentage >= 70) return { 
        text: 'text-[var(--color-warning-dark)]', 
        bg: 'bg-[var(--color-warning-light)]', 
        border: 'border-[var(--color-warning)]' 
    };
    return { 
        text: 'text-[var(--color-danger)]', 
        bg: 'bg-[var(--color-danger-light)]', 
        border: 'border-[var(--color-danger)]' 
    };
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-5 h-5 text-[var(--color-success)]" />;
    if (trend === 'down') return <TrendingDown className="w-5 h-5 text-[var(--color-danger)]" />;
    return <Minus className="w-5 h-5 text-[var(--color-text-secondary)]" />;
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[var(--color-primary)] mb-1 text-2xl lg:text-3xl">Calificaciones</h1>
          <p className="text-[var(--color-text-secondary)] flex items-center gap-2">
             <Award className="w-4 h-4" />
             Periodo Académico 2025-1
          </p>
        </div>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--color-primary)] rounded-xl shadow-lg p-6 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <Award className="w-8 h-8 text-[var(--color-secondary)]" />
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded backdrop-blur-sm">Global</span>
          </div>
          <h2 className="text-white text-4xl font-bold mb-1">{overallAverage.toFixed(1)}</h2>
          <p className="text-white/80 text-sm mb-0 font-medium">Promedio General</p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6 border-l-4 border-[var(--color-success)]">
          <div className="flex justify-between items-start mb-2">
             <h3 className="text-[var(--color-success)] text-3xl font-bold mb-0">{courses.filter(c => c.average >= 90).length}</h3>
             <span className="text-xs font-bold text-[var(--color-success)] bg-[var(--color-success-light)] px-2 py-1 rounded">Excelente</span>
          </div>
          <p className="text-sm text-[var(--color-text)] font-medium mb-0">Cursos con A</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">(90-100 puntos)</p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6 border-l-4 border-[var(--color-info)]">
           <div className="flex justify-between items-start mb-2">
             <h3 className="text-[var(--color-info)] text-3xl font-bold mb-0">{courses.filter(c => c.average >= 80 && c.average < 90).length}</h3>
             <span className="text-xs font-bold text-[var(--color-info)] bg-[var(--color-info-light)] px-2 py-1 rounded">Bueno</span>
          </div>
          <p className="text-sm text-[var(--color-text)] font-medium mb-0">Cursos con B</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">(80-89 puntos)</p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6 border-l-4 border-[var(--color-warning)]">
           <div className="flex justify-between items-start mb-2">
             <h3 className="text-[var(--color-warning-dark)] text-3xl font-bold mb-0">{courses.filter(c => c.average < 80).length}</h3>
             <span className="text-xs font-bold text-[var(--color-warning-dark)] bg-[var(--color-warning-light)] px-2 py-1 rounded">Regular</span>
          </div>
          <p className="text-sm text-[var(--color-text)] font-medium mb-0">Cursos con C o menos</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">(Menor a 80 puntos)</p>
        </div>
      </div>

      {/* Calificaciones por curso */}
      <div className="space-y-8">
        {courses.length === 0 && (
           <div className="text-center p-12 bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)]">
             <Award className="w-12 h-12 text-[var(--color-text-light)] mx-auto mb-4" />
             <p className="text-[var(--color-text-secondary)] text-lg">No tienes calificaciones registradas aún.</p>
           </div>
        )}
        {courses.map((course) => (
          <div key={course.id} className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow">
            {/* Header del curso */}
            <div className="bg-[var(--color-surface-hover)] p-6 border-b border-[var(--color-border)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-[var(--color-primary)] text-lg font-bold mb-0">{course.name}</h3>
                    <span className="px-2 py-0.5 bg-[var(--color-bg)] text-[var(--color-text-secondary)] rounded text-xs border border-[var(--color-border)]">
                        {course.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                      <span>Progreso: {course.grades.reduce((sum, g) => sum + g.weight, 0).toFixed(0)}%</span>
                      {/* Barra mini */}
                      <div className="w-24 bg-[var(--color-border)] rounded-full h-1.5">
                        <div className="bg-[var(--color-primary)] h-1.5 rounded-full" style={{ width: `${Math.min(course.grades.reduce((sum, g) => sum + g.weight, 0), 100)}%` }}></div>
                      </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 bg-[var(--color-bg)] px-4 py-2 rounded-lg border border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--color-text-secondary)]">Tendencia</span>
                    {getTrendIcon(course.trend)}
                  </div>
                  <div className="text-right border-l border-[var(--color-border)] pl-6">
                    <div className={`text-2xl font-bold ${getGradeStatus(course.average, 100).text}`}>{course.average}</div>
                    <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wide">Promedio</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de calificaciones */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-bg)] text-[var(--color-text-secondary)] font-medium border-b border-[var(--color-border)]">
                  <tr>
                    <th className="text-left py-3 px-6">Evaluación</th>
                    <th className="text-center py-3 px-6">Fecha</th>
                    <th className="text-center py-3 px-6">Peso</th>
                    <th className="text-center py-3 px-6">Calificación</th>
                    <th className="text-center py-3 px-6">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {course.grades.length > 0 ? (
                    course.grades.map((grade, index) => {
                        const status = getGradeStatus(grade.score, grade.max);
                        return (
                      <tr key={index} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                        <td className="py-4 px-6 font-medium text-[var(--color-text)]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-text-secondary)]">
                                    <FileText className="w-4 h-4" />
                                </div>
                                {grade.type}
                            </div>
                        </td>
                        <td className="py-4 px-6 text-center text-[var(--color-text-secondary)]">{grade.date}</td>
                        <td className="py-4 px-6 text-center font-medium text-[var(--color-text)]">{grade.weight.toFixed(0)}%</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`font-bold ${status.text}`}>
                            {grade.score} <span className="text-[var(--color-text-light)] text-xs font-normal">/ {grade.max}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                            {((grade.score / grade.max) * 100).toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    )})
                  ) : (
                    <tr>
                        <td colSpan={5} className="text-center py-8 text-[var(--color-text-secondary)]">
                            Sin calificaciones registradas.
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
