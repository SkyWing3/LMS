'use client';

import { Bell, Globe, Moon, Lock, Shield, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserProfile, updateUserSettings } from '@/app/actions/user';

export function SettingsView() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'es',
  });
  
  // Mock state for other notifications not yet in DB
  const [otherNotifications, setOtherNotifications] = useState({
    push: true,
    grades: true,
    tasks: true,
    announcements: false,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getUserProfile();
        if (data) {
          setSettings({
            notifications: data.notifications,
            darkMode: data.darkMode,
            language: data.language,
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      const result = await updateUserSettings({
        notifications: settings.notifications,
        darkMode: settings.darkMode,
        language: settings.language,
      });

      if (result.success) {
        alert('Configuración guardada correctamente');
      } else {
        alert(result.error || 'Error al guardar configuración');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar los cambios');
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando configuración...</div>;

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
                <p className="mb-1">Notificaciones Generales</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0">Activar o desactivar todas las notificaciones</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>
            
            {/* Other mock notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-75">
              <div>
                <p className="mb-1">Notificaciones Push</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0">Recibe notificaciones en tu navegador</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={otherNotifications.push}
                  onChange={(e) => setOtherNotifications({ ...otherNotifications, push: e.target.checked })}
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
                  checked={settings.darkMode}
                  onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
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
                checked={settings.language === 'es'}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span>Español</span>
            </label>
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="radio"
                name="language"
                value="en"
                checked={settings.language === 'en'}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span>English</span>
            </label>
          </div>
        </div>

        {/* Botón de guardar */}
        <div className="flex justify-end gap-4">
          <button 
            onClick={handleSave}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}