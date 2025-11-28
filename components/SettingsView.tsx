'use client';

import { Bell, Globe, Moon, Lock, Shield, Eye } from 'lucide-react';
import { useState } from 'react';

export function SettingsView() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    grades: true,
    tasks: true,
    announcements: false,
  });

  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('es');

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2">Configuración</h1>
        <p className="text-[var(--color-text-secondary)]">Personaliza tu experiencia en el Campus Virtual</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Notificaciones */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="text-[var(--color-primary)] mb-0">Notificaciones</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-0">Gestiona cómo recibes notificaciones</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="mb-1">Notificaciones por Email</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0">Recibe notificaciones en tu correo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="mb-1">Notificaciones Push</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0">Recibe notificaciones en tu navegador</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="mb-1">Calificaciones</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0">Notificar cuando se publiquen calificaciones</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.grades}
                  onChange={(e) => setNotifications({ ...notifications, grades: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="mb-1">Tareas</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0">Notificar sobre tareas nuevas y vencimientos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.tasks}
                  onChange={(e) => setNotifications({ ...notifications, tasks: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="mb-1">Anuncios</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0">Notificar sobre anuncios de la universidad</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.announcements}
                  onChange={(e) => setNotifications({ ...notifications, announcements: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-[var(--color-primary)] mb-0">Apariencia</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-0">Personaliza el aspecto de la plataforma</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <div>
                  <p className="mb-1">Modo Oscuro</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-0">Activa el tema oscuro</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Idioma */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-[var(--color-primary)] mb-0">Idioma</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-0">Selecciona tu idioma preferido</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="radio"
                name="language"
                value="es"
                checked={language === 'es'}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span>Español</span>
            </label>
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === 'en'}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span>English</span>
            </label>
          </div>
        </div>

        {/* Privacidad y Seguridad */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-[var(--color-primary)] mb-0">Privacidad y Seguridad</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-0">Gestiona tu privacidad y seguridad</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3 text-left">
                <Lock className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <div>
                  <p className="mb-0">Cambiar Contraseña</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-0">Actualiza tu contraseña</p>
                </div>
              </div>
              <span className="text-[var(--color-text-secondary)]">›</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3 text-left">
                <Shield className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <div>
                  <p className="mb-0">Autenticación de Dos Factores</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-0">Agrega una capa extra de seguridad</p>
                </div>
              </div>
              <span className="text-[var(--color-text-secondary)]">›</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3 text-left">
                <Eye className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <div>
                  <p className="mb-0">Sesiones Activas</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-0">Revisa y cierra sesiones</p>
                </div>
              </div>
              <span className="text-[var(--color-text-secondary)]">›</span>
            </button>
          </div>
        </div>

        {/* Botón de guardar */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
