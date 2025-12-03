'use client';

import { Bell, Globe, Moon, Eye, Save } from 'lucide-react';
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

  if (loading) return (
    <div className="p-6 lg:p-8 flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2 text-2xl lg:text-3xl">Configuración</h1>
        <p className="text-[var(--color-text-secondary)]">Personaliza tu experiencia en el Campus Virtual</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Notificaciones */}
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[var(--color-primary-surface)] rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="text-[var(--color-primary)] mb-0 font-bold">Notificaciones</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-0">Gestiona cómo recibes notificaciones</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
              <div>
                <p className="mb-1 font-medium text-[var(--color-text)]">Notificaciones Generales</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0">Activar o desactivar todas las notificaciones</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-lg opacity-75 hover:opacity-100 transition-opacity">
              <div>
                <p className="mb-1 font-medium text-[var(--color-text)]">Notificaciones Push</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0">Recibe notificaciones en tu navegador</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={otherNotifications.push}
                  onChange={(e) => setOtherNotifications({ ...otherNotifications, push: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[var(--color-secondary-light)] rounded-lg flex items-center justify-center text-[var(--color-secondary-dark)]">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[var(--color-primary)] mb-0 font-bold">Apariencia</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-0">Personaliza el aspecto de la plataforma</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <div>
                  <p className="mb-1 font-medium text-[var(--color-text)]">Modo Oscuro</p>
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
                <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Idioma */}
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[var(--color-success-light)] rounded-lg flex items-center justify-center text-[var(--color-success-dark)]">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[var(--color-primary)] mb-0 font-bold">Idioma</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-0">Selecciona tu idioma preferido</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition border ${settings.language === 'es' ? 'bg-[var(--color-primary-surface)] border-[var(--color-primary)]' : 'bg-[var(--color-bg)] border-transparent hover:bg-[var(--color-surface-hover)]'}`}>
              <input
                type="radio"
                name="language"
                value="es"
                checked={settings.language === 'es'}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-border)]"
              />
              <span className="text-[var(--color-text)] font-medium">Español</span>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition border ${settings.language === 'en' ? 'bg-[var(--color-primary-surface)] border-[var(--color-primary)]' : 'bg-[var(--color-bg)] border-transparent hover:bg-[var(--color-surface-hover)]'}`}>
              <input
                type="radio"
                name="language"
                value="en"
                checked={settings.language === 'en'}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-border)]"
              />
              <span className="text-[var(--color-text)] font-medium">English</span>
            </label>
          </div>
        </div>

        {/* Botón de guardar */}
        <div className="flex justify-end gap-4 pt-4">
          <button 
            onClick={handleSave}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}