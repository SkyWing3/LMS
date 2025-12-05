'use client';

import { useEffect, useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { login } from '@/app/actions/auth';

interface User {
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_config: 'Google OAuth no está configurado correctamente. Contacta al administrador.',
  google_cancelled: 'Inicio de sesión con Google cancelado.',
  google_state: 'La sesión de Google expiró. Intenta nuevamente.',
  google_domain: 'Solo se permiten correos institucionales @ucb.edu.bo para Google.',
  google_not_registered: 'Credenciales inválidas. Tu cuenta no está registrada en el LMS.',
  google_unknown: 'No se pudo iniciar sesión con Google. Intenta nuevamente.',
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const authError = params.get('authError');
    if (authError) {
      setError(GOOGLE_ERROR_MESSAGES[authError] || 'No se pudo iniciar sesión con Google.');
      params.delete('authError');
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const result = await login(formData);
      if (result.success && result.user) {
        onLogin(result.user as User);
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleDemoLogin = async (role: 'student' | 'teacher' | 'admin') => {
    const credentials = {
      student: { email: 'student@example.com', password: '123456' },
      teacher: { email: 'teacher@example.com', password: '123456' },
      admin:   { email: 'admin@example.com',   password: '123456' }
    };
    
    const creds = credentials[role];
    setEmail(creds.email);
    setPassword(creds.password);
    
    const formData = new FormData();
    formData.append('email', creds.email);
    formData.append('password', creds.password);
    
    setIsLoading(true);
    const result = await login(formData);
    setIsLoading(false);
    
    if (result.success && result.user) {
      onLogin(result.user as User);
    } else {
      setError(result.error || 'Error en login demo');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary-light)] px-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[var(--color-surface)] rounded-full mb-6 shadow-xl ring-4 ring-[var(--color-primary-light)]/30">
            <div className="w-20 h-20 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
              <span className="text-[var(--color-secondary)] font-bold text-3xl">UCB</span>
            </div>
          </div>
          <h1 className="text-white mb-2 text-3xl font-bold tracking-tight">Campus Virtual</h1>
          <p className="text-[var(--color-primary-surface)] text-lg opacity-90">Universidad Católica Boliviana</p>
        </div>

        {/* Formulario de login */}
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-2xl p-8 border border-[var(--color-border)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-[var(--color-danger-light)] text-[var(--color-danger-dark)] rounded-lg text-sm font-medium text-center flex items-center justify-center gap-2">
                 <span className="w-2 h-2 bg-[var(--color-danger)] rounded-full"></span>
                 {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition bg-[var(--color-bg)] focus:bg-[var(--color-surface)]"
                  placeholder="estudiante@ucb.edu.bo"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition bg-[var(--color-bg)] focus:bg-[var(--color-surface)]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-primary)] text-white py-3.5 rounded-lg hover:bg-[var(--color-primary-dark)] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed font-semibold text-base transform hover:-translate-y-0.5"
            >
              {isLoading ? 'Iniciando sesión...' : (
                <>
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text-secondary)]">o continúa con</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full mt-6 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] py-3 rounded-lg hover:bg-[var(--color-surface-hover)] transition flex items-center justify-center gap-3 font-medium hover:shadow-sm"
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
          <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
            <p className="text-xs text-center mb-4 text-[var(--color-text-secondary)] font-medium uppercase tracking-wide">Acceso rápido de demostración</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleDemoLogin('student')}
                className="px-2 py-2 bg-[var(--color-primary-surface)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-light)] hover:text-white transition text-xs font-semibold text-center"
              >
                Estudiante
              </button>
              <button
                onClick={() => handleDemoLogin('teacher')}
                className="px-2 py-2 bg-[var(--color-success-light)] text-[var(--color-success-dark)] rounded-lg hover:bg-[var(--color-success)] hover:text-white transition text-xs font-semibold text-center"
              >
                Docente
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="px-2 py-2 bg-[var(--color-warning-light)] text-[var(--color-warning-dark)] rounded-lg hover:bg-[var(--color-warning)] hover:text-white transition text-xs font-semibold text-center"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-white/80 text-sm">
          ¿Olvidaste tu contraseña? <button className="underline hover:text-[var(--color-secondary)] font-medium transition-colors">Recuperar acceso</button>
        </p>
      </div>
    </div>
  );
}
