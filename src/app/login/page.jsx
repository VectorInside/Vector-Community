'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { USER_ROLES, DEMO_USERS } from '@/utils/constants';
import {
  ShieldCheck,
  Zap,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Layers,
  Eye,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useAuth();
  const [email, setEmail] = useState('admin@vectorinside.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedPersona, setSelectedPersona] = useState(DEMO_USERS[0]?.id || 'usr-admin-01');
  const [loading, setLoading] = useState(false);

  const handleSelectPersona = (user) => {
    setSelectedPersona(user.id);
    setEmail(user.email);
    switchRole(user.role);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#E5FF00', '#FFFFFF', '#10B981'],
        });
      } catch (e) {}

      router.push('/dashboard');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--neon-primary)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[var(--bg-panel)] border border-neon shadow-[0_0_15px_var(--neon-glow)]">
            <svg
              width="65"
              height="35"
              viewBox="0 0 150 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M45 0 L75 75 L105 0 L125 0 L85 85 L45 85 Z" fill="#E5FF00" />
              <rect x="62" y="22" width="12" height="4" fill="#050505" />
              <rect x="85" y="40" width="15" height="6" fill="#050505" />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-black text-[var(--text-main)] tracking-wider flex items-center justify-center gap-2">
              <span>VECTOR</span>
              <span className="text-neon">INSIDE</span>
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono tracking-widest uppercase mt-1">
              Vector Community OS — Master Control
            </p>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Quick Persona Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Selecciona Perfil de Prueba (RBAC)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_USERS.map((usr) => {
                const isSelected = selectedPersona === usr.id;
                return (
                  <button
                    key={usr.id}
                    type="button"
                    onClick={() => handleSelectPersona(usr)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-[var(--bg-card)] border-neon text-white shadow-[0_0_10px_var(--neon-glow)]'
                        : 'bg-[var(--bg-base)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-lg overflow-hidden shrink-0 border border-[var(--border-color)]">
                        <img
                          src={usr.avatar}
                          alt={usr.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[var(--text-main)] truncate">
                          {usr.name}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                          {usr.roleTitle}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        usr.role === USER_ROLES.ADMIN
                          ? 'bg-neon text-black'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {usr.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--text-main)] placeholder-zinc-500 focus:border-neon focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--text-main)] placeholder-zinc-500 focus:border-neon focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon text-black font-bold text-xs uppercase tracking-wider py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{loading ? 'Accediendo...' : 'Iniciar Sesión'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-[10px] text-[var(--text-muted)] font-mono">
            Acceso seguro a Vector Community OS
          </div>
        </div>
      </div>
    </div>
  );
}
