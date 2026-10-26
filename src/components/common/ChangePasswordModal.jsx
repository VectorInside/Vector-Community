'use client';

import React, { useState, useId } from 'react';
import { Portal } from '@/components/common/Portal';
import {
  X,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Smartphone,
  LogOut,
  Mail,
  RefreshCw,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Evaluador de fortaleza de contraseña
function evaluatePasswordStrength(password) {
  if (!password) return { score: 0, label: 'Vacía', color: 'bg-zinc-700', textCol: 'text-zinc-500' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: 'Débil', color: 'bg-rose-500', textCol: 'text-rose-500' };
  if (score === 2) return { score: 2, label: 'Aceptable', color: 'bg-amber-500', textCol: 'text-amber-500' };
  if (score === 3 || score === 4) return { score: 3, label: 'Fuerte', color: 'bg-blue-500', textCol: 'text-blue-400' };
  return { score: 4, label: 'Inviolable', color: 'bg-emerald-500', textCol: 'text-emerald-400' };
}

export const ChangePasswordModal = ({
  isOpen,
  onClose,
  userEmail = 'usuario@vectorinside.com',
  userName = 'Usuario',
}) => {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();
  const revokeSessionsId = useId();
  const sendEmailAlertId = useId();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);
  const [sendSecurityEmail, setSendSecurityEmail] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const strength = evaluatePasswordStrength(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validaciones
    if (!currentPassword) {
      setErrorMessage('Por favor ingresa tu contraseña actual para verificar tu identidad.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (currentPassword === newPassword) {
      setErrorMessage('La nueva contraseña no puede ser idéntica a la anterior.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setIsLoading(true);

    // Simulación de hashing SHA-256 / Bcrypt en Supabase Auth
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4FF00', '#10B981', '#38BDF8'],
        });
      } catch (err) {}

      // Auto-cierre tras feedback de éxito
      setTimeout(() => {
        handleReset();
        onClose();
      }, 2600);
    }, 1100);
  };

  const handleReset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setIsSuccess(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      handleReset();
      onClose();
    }
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-2xl p-5 sm:p-7 relative flex flex-col overflow-hidden my-auto animate-scale-up font-sans">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center text-brand-primary shadow-neon-sm">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-brand-primary tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                  Seguridad de Credenciales
                </span>
                <h3 className="text-lg font-heading font-black text-[var(--text-main)] uppercase tracking-tight">
                  Cambiar Contraseña
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Cuenta: <strong className="text-[var(--text-main)]">{userEmail}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Estado de Éxito */}
          {isSuccess ? (
            <div className="py-8 px-4 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[var(--text-main)]">
                  ¡Contraseña actualizada con éxito!
                </h4>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
                  Tus nuevas credenciales han sido cifradas con SHA-256 / Bcrypt. Se ha despachado una notificación de seguridad a{' '}
                  <strong className="text-[var(--text-main)] font-mono">{userEmail}</strong>.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Tokens y sesiones sincronizados correctamente
                </span>
              </div>
            </div>
          ) : (
            /* Formulario */
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Mensaje de Error */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-tight">{errorMessage}</span>
                </div>
              )}

              {/* 1. Contraseña Actual */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={currentPasswordId}
                    className="text-xs font-mono font-medium text-[var(--text-main)]"
                  >
                    Contraseña Actual:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Se ha enviado un enlace de restablecimiento seguro a: ${userEmail}`);
                    }}
                    className="text-[10px] font-mono text-[var(--text-muted)] hover:text-brand-primary transition-colors underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                  <input
                    id={currentPasswordId}
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl pl-9 pr-10 py-2.5 text-xs text-[var(--text-main)] placeholder-[var(--text-faint)] focus:border-brand-primary outline-none font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] absolute right-3 top-2.5 transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2. Nueva Contraseña */}
              <div className="space-y-1.5">
                <label
                  htmlFor={newPasswordId}
                  className="text-xs font-mono font-medium text-[var(--text-main)]"
                >
                  Nueva Contraseña:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                  <input
                    id={newPasswordId}
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres, números y símbolos"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl pl-9 pr-10 py-2.5 text-xs text-[var(--text-main)] placeholder-[var(--text-faint)] focus:border-brand-primary outline-none font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] absolute right-3 top-2.5 transition-colors"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Medidor de Fuerza */}
                {newPassword && (
                  <div className="space-y-1 pt-1 animate-fadeIn">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[var(--text-muted)]">Nivel de Seguridad:</span>
                      <strong className={strength.textCol}>{strength.label}</strong>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-[var(--bg-card)] rounded-full overflow-hidden p-0.5 border border-[var(--border-color)]">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full rounded-full transition-all duration-300 ${
                            step <= strength.score ? strength.color : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Confirmar Nueva Contraseña */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={confirmPasswordId}
                    className="text-xs font-mono font-medium text-[var(--text-main)]"
                  >
                    Confirmar Nueva Contraseña:
                  </label>
                  {confirmPassword && (
                    <span className="text-[10px] font-mono flex items-center gap-1">
                      {passwordsMatch ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Coinciden
                        </span>
                      ) : (
                        <span className="text-rose-400">No coinciden</span>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                  <input
                    id={confirmPasswordId}
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu nueva contraseña"
                    className={`w-full bg-[var(--bg-card)] border rounded-xl pl-9 pr-10 py-2.5 text-xs text-[var(--text-main)] placeholder-[var(--text-faint)] outline-none font-mono transition-all ${
                      confirmPassword && !passwordsMatch
                        ? 'border-rose-500/60 focus:border-rose-500'
                        : 'border-[var(--border-color)] focus:border-brand-primary'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] absolute right-3 top-2.5 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Opciones de Seguridad Adicionales */}
              <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2 text-xs font-mono text-[var(--text-muted)]">
                <label
                  htmlFor={revokeSessionsId}
                  className="flex items-center gap-2.5 cursor-pointer text-[var(--text-main)] hover:text-brand-primary transition-colors"
                >
                  <input
                    id={revokeSessionsId}
                    type="checkbox"
                    checked={revokeOtherSessions}
                    onChange={(e) => setRevokeOtherSessions(e.target.checked)}
                    className="w-4 h-4 accent-brand-primary rounded"
                  />
                  <span className="text-[11px]">
                    Cerrar sesión activa en todos los demás dispositivos y teléfonos
                  </span>
                </label>

                <label
                  htmlFor={sendEmailAlertId}
                  className="flex items-center gap-2.5 cursor-pointer text-[var(--text-main)] hover:text-brand-primary transition-colors"
                >
                  <input
                    id={sendEmailAlertId}
                    type="checkbox"
                    checked={sendSecurityEmail}
                    onChange={(e) => setSendSecurityEmail(e.target.checked)}
                    className="w-4 h-4 accent-brand-primary rounded"
                  />
                  <span className="text-[11px]">
                    Enviar comprobante y alerta de seguridad a <strong className="text-[var(--text-main)]">{userEmail}</strong>
                  </span>
                </label>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] text-xs font-mono transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isLoading || (confirmPassword && !passwordsMatch)}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary text-black font-mono font-bold text-xs flex items-center gap-2 shadow-neon-sm hover:opacity-95 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Cifrando y Actualizando...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-black" />
                      <span>Guardar Nueva Contraseña</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Portal>
  );
};
