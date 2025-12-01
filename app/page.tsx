'use client';

import { useState, useEffect } from 'react';
import { AdminPanel } from '@/components/AdminPanel';
import { CourseDetail } from '@/components/CourseDetail';
import { CoursesView } from '@/components/CoursesView';
import { Dashboard } from '@/components/Dashboard';
import { GradesView } from '@/components/GradesView';
import { LoginPage } from '@/components/LoginPage';
import { ProfileView } from '@/components/ProfileView';
import { SettingsView } from '@/components/SettingsView';
import { Sidebar } from '@/components/Sidebar';
import { TeacherCoursesView } from '@/components/TeacherCoursesView';
import { getUser, logout } from '@/app/actions/auth';

type UserRole = 'student' | 'teacher' | 'admin';
type View =
  | 'dashboard'
  | 'courses'
  | 'course-detail'
  | 'grades'
  | 'profile'
  | 'settings'
  | 'teacher-courses'
  | 'admin-panel';

interface User {
  email: string;
  name: string;
  role: UserRole;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionUser = await getUser();
        if (sessionUser) {
          setUser(sessionUser as User);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Failed to fetch session', error);
      } finally {
        setIsLoadingSession(false);
      }
    };
    checkSession();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
    setSelectedCourseId(null);
  };

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('dashboard');
    setSelectedCourseId(null);
  };

  const handleNavigate = (view: View) => {
    if (view === 'courses') {
      setCurrentView('courses');
      setSelectedCourseId(null);
    } else if (view === 'teacher-courses') {
      setCurrentView('teacher-courses');
      setSelectedCourseId(null);
    } else if (view === 'admin-panel') {
      setCurrentView('admin-panel');
    } else if (view === 'grades') {
      setCurrentView('grades');
    } else if (view === 'profile') {
      setCurrentView('profile');
    } else if (view === 'settings') {
      setCurrentView('settings');
    } else {
      setCurrentView('dashboard');
      setSelectedCourseId(null);
    }
  };

  const handleSelectCourse = (courseId: number) => {
    setSelectedCourseId(courseId);
    setCurrentView('course-detail');
  };

  const handleBackFromCourse = () => {
    setSelectedCourseId(null);
    if (user?.role === 'teacher') {
      setCurrentView('teacher-courses');
    } else {
      setCurrentView('courses');
    }
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        userRole={user.role}
        userName={user.name}
        onLogout={handleLogout}
      />

      <main className="flex-1 lg:ml-0 min-h-screen overflow-y-auto">
        {currentView === 'dashboard' && (
          <Dashboard userRole={user.role} userName={user.name} />
        )}

        {currentView === 'courses' && user.role === 'student' && (
          <CoursesView onSelectCourse={handleSelectCourse} />
        )}

        {currentView === 'teacher-courses' && user.role === 'teacher' && (
          <TeacherCoursesView onSelectCourse={handleSelectCourse} />
        )}

        {currentView === 'course-detail' && selectedCourseId && (
          <CourseDetail courseId={selectedCourseId} onBack={handleBackFromCourse} />
        )}

        {currentView === 'grades' && user.role === 'student' && <GradesView />}

        {currentView === 'profile' && (
          <ProfileView userRole={user.role} userName={user.name} userEmail={user.email} />
        )}

        {currentView === 'settings' && <SettingsView />}

        {currentView === 'admin-panel' && user.role === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

