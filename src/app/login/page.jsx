'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Server,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();
  const { loginAs } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authStage, setAuthStage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const reason = sessionStorage.getItem('vector_auth_redirect_reason');
      if (reason) {
        setErrorMessage(reason);
        sessionStorage.removeItem('vector_auth_redirect_reason');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setAuthStage('Validando credenciales...');

    try {
      // Autenticación estricta contra el servidor backend
      const userRes = await userService.login({ email: cleanEmail, password });
      if (!userRes || !userRes.id) {
        throw new Error('Respuesta de autenticación inválida desde el servidor.');
      }

      const isClient = userRes.role === 'CLIENT_OWNER' || userRes.role === 'client';
      const userObj = {
        id: userRes.id,
        name: userRes.name || userRes.ownerName || 'Usuario Vector',
        email: userRes.email,
        phone: userRes.phone === '+52 55 1234 5678' ? '' : (userRes.phone || ''),
        role: isClient ? 'client' : 'admin',
        globalRole: userRes.role || (isClient ? 'CLIENT_OWNER' : 'SUPER_ADMIN'),
        tenantKey:
          userRes.tenantId ||
          (Array.isArray(userRes.assignedTenants) ? userRes.assignedTenants[0] : null),
        roleTitle: userRes.roleLabel || (isClient ? 'Dueño de Negocio' : 'Super Admin'),
        avatar: userRes.avatar || userRes.tenantAvatar || '⚡',
      };
      loginAs(userObj);

      setAuthStage('Cargando permisos y espacio de trabajo...');
      setTimeout(() => {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#E7F900', '#00F0FF', '#A855F7'],
          });
        } catch (err) {}
        router.push('/dashboard');
      }, 400);
    } catch (backendErr) {
      setLoading(false);
      setAuthStage('');
      const isNetworkOrServerDown =
        !backendErr?.response ||
        backendErr?.code === 'ERR_NETWORK' ||
        backendErr?.response?.status >= 500;

      if (isNetworkOrServerDown) {
        setErrorMessage(
          'Error de conexión con el servidor. Por favor verifica que el servicio esté activo o intenta más tarde.'
        );
      } else {
        setErrorMessage(
          backendErr?.response?.data?.message ||
            'Credenciales no autorizadas o usuario no registrado.'
        );
      }
    }
  };

    return (
      <div className="min-h-screen bg-[#07080A] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#E7F900] selection:text-black">
        {/* Dynamic Cyber-Holographic Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-b from-[#E7F900]/15 via-cyan-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Cybernetic Isometric Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF08_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_20%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Top Navigation Bar: Clean back-to-landing link */}
        <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-zinc-300 hover:text-white transition-all group backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-cyan-400" />
            <span>Volver al Inicio</span>
          </Link>

          {/* Live cluster indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">ESTADO DEL SISTEMA:</span>
            <span>ACTIVO</span>
          </div>
        </header>

        {/* Center Main Stage */}
        <main className="relative z-10 w-full max-w-lg mx-auto px-4 py-4 flex flex-col items-center">
          {/* Brand Lockup: Crisp Official SVG + Clean Hierarchy */}
          <div className="text-center space-y-3 flex flex-col items-center mb-6">
            <div className="relative group">
              {/* Ambient Aura behind logo */}
              <div className="absolute -inset-2 bg-gradient-to-r from-neon via-cyan-400 to-purple-500 rounded-3xl opacity-30 blur-xl group-hover:opacity-60 transition duration-500" />

              {/* Official Isotype Logo Container */}
              <div className="relative w-20 h-20 rounded-2xl bg-zinc-950/90 border border-neon/50 flex items-center justify-center p-3 shadow-[0_0_35px_rgba(231,249,0,0.25)] backdrop-blur-xl">
                <svg
                  viewBox="0 0 100 85"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full filter drop-shadow-[0_0_12px_rgba(231,249,0,0.5)]"
                >
                  <path
                    d="M10 0 L40 76 L60 76 L90 0 L72 0 L50 56 L28 0 Z"
                    fill="#E7F900"
                  />
                  <rect x="36" y="24" width="16" height="6" fill="#000000" />
                  <rect x="52" y="40" width="14" height="7" fill="#000000" />
                  <rect x="30" y="52" width="10" height="5" fill="#000000" />
                  <rect x="62" y="16" width="12" height="4" fill="#000000" />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="font-heading font-black tracking-[0.2em] text-2xl sm:text-3xl text-white uppercase">
                  VECTOR
                </span>
                <span className="font-heading font-black tracking-[0.2em] text-2xl sm:text-3xl text-neon uppercase drop-shadow-[0_0_20px_rgba(231,249,0,0.4)]">
                  INSIDE
                </span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono tracking-widest text-zinc-400">
                <span className="text-neon font-black">{'//'}</span>
                <span className="font-bold text-zinc-300">COMMUNITY OS</span>
                <span className="text-zinc-600">•</span>
                <span className="text-[11px] text-cyan-400">AUTONOMOUS CM</span>
              </div>
            </div>
          </div>

          {/* Master Glassmorphism Auth Card */}
          <div className="w-full rounded-3xl bg-zinc-950/85 border border-white/10 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.85)] space-y-6 relative overflow-hidden">
            {/* Subtle top edge border glow */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon/60 to-transparent" />

            {/* Header del Formulario */}
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Iniciar Sesión
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Ingresa tus credenciales autorizadas para acceder a la plataforma.
              </p>
            </div>

            {/* Feedback de Error si las credenciales fallan */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-400 font-mono animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Formulario de Acceso Limpio */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {/* Input: Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium text-zinc-300">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-zinc-500 group-focus-within:text-neon absolute left-3.5 top-3.5 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-neon focus:bg-black focus:outline-none focus:ring-1 focus:ring-neon font-mono transition-all"
                    placeholder="usuario@vectorinside.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Input: Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-medium text-zinc-300">
                    Contraseña
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500 hover:text-neon transition-colors cursor-pointer">
                    ¿Olvidaste tu contraseña?
                  </span>
                </div>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-zinc-500 group-focus-within:text-neon absolute left-3.5 top-3.5 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-zinc-500 focus:border-neon focus:bg-black focus:outline-none focus:ring-1 focus:ring-neon font-mono transition-all"
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submission Button with Neon Glow and Dynamic Loading State */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-neon via-[#D9EA00] to-cyan-400 text-black font-mono font-black text-xs uppercase tracking-wider py-3.5 rounded-xl hover:brightness-110 transition-all duration-200 shadow-[0_0_25px_rgba(231,249,0,0.35)] flex items-center justify-center gap-2 active:scale-98 disabled:opacity-80 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>{authStage || 'Iniciando Sesión...'}</span>
                  </>
                ) : (
                  <>
                    <span>Ingresar al Sistema Operativo</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Security & Access Details */}
            <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Conexión Segura & Privada</span>
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Servidor en Línea</span>
              </div>
            </div>
          </div>
        </main>

        {/* Page Footer */}
        <footer className="relative z-10 py-4 text-center text-xs font-mono text-zinc-500">
          <span>© {new Date().getFullYear()} Vector Inside Inc. • Todos los derechos reservados.</span>
        </footer>
      </div>
    );
  }
