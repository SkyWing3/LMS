'use client';

import { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string, role: 'student' | 'teacher' | 'admin') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulación de roles basados en email
    let role: 'student' | 'teacher' | 'admin' = 'student';
    if (email.includes('docente') || email.includes('teacher')) {
      role = 'teacher';
    } else if (email.includes('admin')) {
      role = 'admin';
    }
    
    onLogin(email, password, role);
  };

  const handleGoogleLogin = () => {
    // Simulación de login con Google - por defecto estudiante
    onLogin('estudiante@ucb.edu.bo', '', 'student');
  };

  const handleDemoLogin = (role: 'student' | 'teacher' | 'admin') => {
    const emails = {
      student: 'estudiante@ucb.edu.bo',
      teacher: 'docente@ucb.edu.bo',
      admin: 'admin@ucb.edu.bo'
    };
    onLogin(emails[role], 'demo123', role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] px-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
              <span className="text-[var(--color-secondary)] font-bold text-2xl">UCB</span>
            </div>
          </div>
          <h1 className="text-white mb-2">Campus Virtual</h1>
          <p className="text-blue-100">Universidad Católica Boliviana</p>
        </div>

        {/* Formulario de login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-[var(--color-text-secondary)]">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                  placeholder="estudiante@ucb.edu.bo"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-[var(--color-text-secondary)]">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition flex items-center justify-center gap-2 shadow-md"
            >
              <LogIn className="w-5 h-5" />
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-[var(--color-text-secondary)]">o continúa con</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full mt-4 bg-white border-2 border-[var(--color-border)] text-[var(--color-text)] py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>

          {/* Botones de demo */}
          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <p className="text-xs text-center mb-3 text-[var(--color-text-secondary)]">Acceso rápido de demostración:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoLogin('student')}
                className="px-3 py-2 bg-blue-50 text-[var(--color-primary)] rounded-lg hover:bg-blue-100 transition text-xs"
              >
                Estudiante
              </button>
              <button
                onClick={() => handleDemoLogin('teacher')}
                className="px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-xs"
              >
                Docente
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-xs"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-white text-sm">
          ¿Olvidaste tu contraseña? <button className="underline hover:text-[var(--color-secondary)]">Recuperar</button>
        </p>
      </div>
    </div>
  );
}
