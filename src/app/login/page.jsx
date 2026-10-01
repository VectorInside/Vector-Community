'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DEMO_USERS, USER_ROLES } from '@/utils/constants';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
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
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@vectorinside.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedPersona, setSelectedPersona] = useState(DEMO_USERS[0].id);
  const [loading, setLoading] = useState(false);

  const handleSelectPersona = (user) => {
    setSelectedPersona(user.id);
    setEmail(user.email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      login(email, password);
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#D4FF00', '#FFFFFF', '#10B981'],
        });
      } catch (e) {}

      router.push('/dashboard');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-dark-base flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 z-10 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-dark-surface border border-brand-primary/30 shadow-neon-sm">
            <svg className="h-10 w-10" viewBox="0 0 44 44" fill="none">
              <path d="M12 16L22 34L32 16" stroke="#D4FF00" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 20L22 29L27 20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
              <circle cx="22" cy="14" r="2.5" fill="#D4FF00" />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-wider flex items-center justify-center gap-2">
              <span>VECTOR</span>
              <span className="text-brand-primary">INSIDE</span>
            </h1>
            <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase mt-1">
              La Puerta Trasera — Control Panel
            </p>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Quick Persona Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
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
                        ? 'bg-dark-elevated border-brand-primary text-white shadow-neon-sm'
                        : 'bg-dark-base border-dark-border text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-lg overflow-hidden shrink-0 border border-dark-border">
                        <img src={usr.avatar} alt={usr.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{usr.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono truncate">{usr.roleTitle}</p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        usr.role === USER_ROLES.SUPER_ADMIN_AGENCY
                          ? 'neon'
                          : usr.role === USER_ROLES.COMMUNITY_MANAGER
                          ? 'warning'
                          : 'info'
                      }
                      size="xs"
                    >
                      {usr.badge}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-base border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-brand-primary focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Contraseña JWT
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-base border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-brand-primary focus:outline-none font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center shadow-neon mt-2"
              icon={ArrowRight}
            >
              Iniciar Sesión en Control Panel
            </Button>
          </form>

          <div className="pt-2 text-center text-[10px] text-zinc-500 font-mono">
            Autenticación segura con JWT Bearer + Inyección Automática de X-Tenant-ID
          </div>
        </div>
      </div>
    </div>
  );
}
