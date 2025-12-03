'use client';

import { User, Mail, Phone, MapPin, GraduationCap, Edit2, Camera, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '@/app/actions/user';

interface ProfileViewProps {
  userRole: 'student' | 'teacher' | 'admin';
  userName: string;
  userEmail: string;
}

export function ProfileView({ userRole }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: ''
  });

  const roleLabels = {
    student: 'Estudiante',
    teacher: 'Docente',
    admin: 'Administrador'
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        if (data) {
          setProfile(data);
          setFormData(prev => ({
            ...prev,
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            address: data.address || ''
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const result = await updateUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined
      });

      if (result.success) {
        setIsEditing(false);
        const data = await getUserProfile();
        if (data) {
            setProfile(data);
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: ''
            }));
        }
        alert('Perfil actualizado correctamente');
      } else {
        alert(result.error || 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar los cambios');
    }
  };

  if (loading) return (
    <div className="p-6 lg:p-8 flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
    </div>
  );
  
  if (!profile) return <div className="p-8 text-center text-[var(--color-danger)]">Error al cargar el perfil. Por favor, inicie sesión nuevamente.</div>;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-[var(--color-primary)] mb-2 text-2xl lg:text-3xl">Mi Perfil</h1>
        <p className="text-[var(--color-text-secondary)] flex items-center gap-2">
            <User className="w-4 h-4" />
            Información personal y académica
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarjeta de perfil */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-surface)] rounded-xl shadow-sm overflow-hidden border border-[var(--color-border)] sticky top-8">
            <div className="bg-[var(--color-primary)] h-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
            </div>
            
            <div className="relative px-6 pb-6">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                <div className="relative group">
                  <div className="w-32 h-32 bg-[var(--color-secondary)] rounded-full flex items-center justify-center border-4 border-[var(--color-surface)] shadow-lg overflow-hidden">
                    {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <GraduationCap className="w-16 h-16 text-[var(--color-primary)]" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white hover:bg-[var(--color-primary-dark)] transition shadow-lg transform group-hover:scale-110 duration-200">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="pt-20 text-center">
                <h3 className="text-[var(--color-primary)] mb-1 font-bold text-xl">{profile.name}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6 font-medium bg-[var(--color-bg)] inline-block px-3 py-1 rounded-full border border-[var(--color-border)]">
                    {roleLabels[userRole as keyof typeof roleLabels]}
                </p>
                
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition flex items-center justify-center gap-2 font-medium shadow-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar Perfil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                        onClick={handleSave}
                        className="flex-1 px-4 py-2.5 bg-[var(--color-success)] text-white rounded-lg hover:bg-[var(--color-success-dark)] transition flex items-center justify-center gap-2 font-medium shadow-sm"
                    >
                        <Save className="w-4 h-4" /> Guardar
                    </button>
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2.5 bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)] transition flex items-center justify-center"
                    >
                        <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Información detallada */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
            <h3 className="text-[var(--color-primary)] mb-6 flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
                <User className="w-5 h-5" />
                Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text)]">Nombre Completo</label>
                <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isEditing ? 'bg-[var(--color-surface)] border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]' : 'bg-[var(--color-bg)] border-transparent'}`}>
                  <User className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                  {isEditing ? (
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-transparent w-full outline-none text-[var(--color-text)] placeholder-[var(--color-text-light)]"
                    />
                  ) : (
                    <span className="text-[var(--color-text)] font-medium">{profile.name}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text)]">Correo Electrónico</label>
                <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isEditing ? 'bg-[var(--color-surface)] border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]' : 'bg-[var(--color-bg)] border-transparent'}`}>
                  <Mail className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                  {isEditing ? (
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-transparent w-full outline-none text-[var(--color-text)] placeholder-[var(--color-text-light)]"
                    />
                  ) : (
                    <span className="text-[var(--color-text)] font-medium truncate">{profile.email}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text)]">Teléfono</label>
                <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isEditing ? 'bg-[var(--color-surface)] border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]' : 'bg-[var(--color-bg)] border-transparent'}`}>
                  <Phone className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                  {isEditing ? (
                    <input 
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="Agregar teléfono"
                        className="bg-transparent w-full outline-none text-[var(--color-text)] placeholder-[var(--color-text-light)]"
                    />
                  ) : (
                    <span className="text-[var(--color-text)] font-medium">{profile.phone || 'No registrado'}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text)]">Dirección</label>
                <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isEditing ? 'bg-[var(--color-surface)] border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]' : 'bg-[var(--color-bg)] border-transparent'}`}>
                  <MapPin className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                  {isEditing ? (
                    <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Agregar dirección"
                        className="bg-transparent w-full outline-none text-[var(--color-text)] placeholder-[var(--color-text-light)]"
                    />
                  ) : (
                    <span className="text-[var(--color-text)] font-medium">{profile.address || 'No registrada'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
           {/* Cambiar contraseña (Solo en modo edición) */}
           {isEditing && (
            <div className="bg-[var(--color-surface)] rounded-xl shadow-sm p-6 border border-[var(--color-border)] animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-[var(--color-primary)] mb-6 flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
                    <Edit2 className="w-5 h-5" />
                    Cambiar Contraseña
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text)]">Contraseña Actual</label>
                        <input 
                            type="password" 
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                            className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text)]">Nueva Contraseña</label>
                        <input 
                            type="password" 
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
            </div>
           )}
        </div>
      </div>
    </div>
  );
}