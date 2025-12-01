'use client';

import { Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
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

  const getGradeColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeBgColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 90) return 'bg-green-50 border-green-200';
    if (percentage >= 80) return 'bg-blue-50 border-blue-200';
    if (percentage >= 70) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2">Calificaciones</h1>
        <p className="text-[var(--color-text-secondary)]">Periodo Académico 2025-1</p>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-10 h-10" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-white mb-1">{overallAverage.toFixed(1)}</h2>
          <p className="text-white/90 text-sm mb-0">Promedio General</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-green-600 mb-1">{courses.filter(c => c.average >= 90).length}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-0">Cursos con A</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 mb-0">(90-100)</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-blue-600 mb-1">{courses.filter(c => c.average >= 80 && c.average < 90).length}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-0">Cursos con B</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 mb-0">(80-89)</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <h3 className="text-orange-600 mb-1">{courses.filter(c => c.average < 80).length}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-0">Cursos con C o menos</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 mb-0">(Menor a 80)</p>
        </div>
      </div>

      {/* Calificaciones por curso */}
      <div className="space-y-6">
        {courses.length === 0 && (
           <div className="text-center p-8 bg-white rounded-xl shadow-sm text-gray-500">
             No tienes calificaciones registradas aún.
           </div>
        )}
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header del curso */}
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white mb-1">{course.name}</h3>
                  <p className="text-white/90 text-sm mb-0">{course.code}</p>
                </div>
                <div className="flex items-center gap-4">
                  {getTrendIcon(course.trend)}
                  <div className="text-right">
                    <div className="text-3xl">{course.average}</div>
                    <div className="text-sm text-white/90">Promedio</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de calificaciones */}
            <div className="p-6">
              {course.grades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="text-left py-3 px-4 text-[var(--color-text-secondary)]">Evaluación</th>
                      <th className="text-center py-3 px-4 text-[var(--color-text-secondary)]">Fecha</th>
                      <th className="text-center py-3 px-4 text-[var(--color-text-secondary)]">Peso</th>
                      <th className="text-center py-3 px-4 text-[var(--color-text-secondary)]">Calificación</th>
                      <th className="text-center py-3 px-4 text-[var(--color-text-secondary)]">Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.grades.map((grade, index) => (
                      <tr key={index} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50">
                        <td className="py-4 px-4">{grade.type}</td>
                        <td className="py-4 px-4 text-center text-sm text-[var(--color-text-secondary)]">{grade.date}</td>
                        <td className="py-4 px-4 text-center text-sm">{grade.weight.toFixed(0)}%</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`${getGradeColor(grade.score, grade.max)}`}>
                            {grade.score}/{grade.max}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm border ${getGradeBgColor(grade.score, grade.max)}`}>
                            {((grade.score / grade.max) * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              ) : (
                <div className="text-center py-4 text-gray-500">Sin calificaciones registradas.</div>
              )}

              {/* Barra de progreso del promedio */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Progreso del curso</span>
                  <span className="text-sm">
                    {course.grades.reduce((sum, g) => sum + g.weight, 0).toFixed(0)}% completado
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[var(--color-primary)] h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(course.grades.reduce((sum, g) => sum + g.weight, 0), 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
