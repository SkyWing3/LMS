'use client';

import type { LucideIcon } from 'lucide-react';
import { Home, BookOpen, Award, User, Settings, Users, LogOut, GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';

type SidebarView =
  | 'dashboard'
  | 'courses'
  | 'teacher-courses'
  | 'admin-panel'
  | 'grades'
  | 'profile'
  | 'settings'
  | 'course-detail';

type SidebarRole = 'student' | 'teacher' | 'admin';

interface SidebarProps {
  currentView: SidebarView;
  onNavigate: (view: SidebarView) => void;
  userRole: SidebarRole;
  userName: string;
  onLogout: () => void;
}

interface MenuItem {
  id: SidebarView;
  label: string;
  icon: LucideIcon;
}

interface SidebarContentProps {
  currentView: SidebarView;
  menuItems: MenuItem[];
  onNavigate: (view: SidebarView) => void;
  onClose: () => void;
  userRole: SidebarRole;
  userName: string;
  onLogout: () => void;
}

const roleLabels: Record<SidebarRole, string> = {
  student: 'Estudiante',
  teacher: 'Docente',
  admin: 'Administrador',
};

const studentMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Inicio', icon: Home },
  { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
  { id: 'grades', label: 'Calificaciones', icon: Award },
  { id: 'profile', label: 'Mi Perfil', icon: User },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

const teacherMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Inicio', icon: Home },
  { id: 'teacher-courses', label: 'Mis Cursos', icon: BookOpen },
  { id: 'profile', label: 'Mi Perfil', icon: User },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

const adminMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Inicio', icon: Home },
  { id: 'admin-panel', label: 'Administración', icon: Users },
  { id: 'profile', label: 'Mi Perfil', icon: User },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

function SidebarContent({
  currentView,
  menuItems,
  onNavigate,
  onClose,
  userRole,
  userName,
  onLogout,
}: SidebarContentProps) {
  return (
    <>
      {/* Logo y título */}
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
              <span className="text-[var(--color-secondary)]">UCB</span>
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-white truncate mb-0">Campus Virtual</h2>
            <p className="text-blue-200 text-xs truncate">Universidad Católica Boliviana</p>
          </div>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <div className="min-w-0">
            <p className="text-white truncate mb-0">{userName}</p>
            <p className="text-blue-200 text-xs">{roleLabels[userRole]}</p>
          </div>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-[var(--color-secondary)] text-[var(--color-primary)]'
                      : 'text-white hover:bg-blue-800'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </>
  );
}

export function Sidebar({ currentView, onNavigate, userRole, userName, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems =
    userRole === 'admin' ? adminMenuItems : userRole === 'teacher' ? teacherMenuItems : studentMenuItems;

  return (
    <>
      {/* Botón de menú móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[var(--color-primary)] text-white rounded-lg flex items-center justify-center shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[var(--color-primary)] flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <SidebarContent
          currentView={currentView}
          menuItems={menuItems}
          onNavigate={onNavigate}
          onClose={() => setIsOpen(false)}
          userRole={userRole}
          userName={userName}
          onLogout={onLogout}
        />
      </aside>
    </>
  );
}
