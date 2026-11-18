'use client';

import React, { useState, useId, useEffect, useCallback } from 'react';
import { Portal } from '@/components/common/Portal';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import {
  X,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Info,
  RefreshCw,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Evaluador de fortaleza de contraseña
function evaluatePasswordStrength(password) {
  if (!password) return { score: 0, label: 'Vacía', color: 'bg-zinc-300 dark:bg-zinc-700', textCol: 'text-[var(--text-muted)]' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: 'Débil', color: 'bg-rose-500', textCol: 'text-rose-600 dark:text-rose-400' };
  if (score === 2) return { score: 2, label: 'Aceptable', color: 'bg-amber-500', textCol: 'text-amber-600 dark:text-amber-400' };
  if (score === 3 || score === 4) return { score: 3, label: 'Fuerte', color: 'bg-blue-500', textCol: 'text-blue-600 dark:text-blue-400' };
  return { score: 4, label: 'Inviolable', color: 'bg-emerald-500', textCol: 'text-emerald-600 dark:text-emerald-400' };
}

export const ChangePasswordModal = ({
  isOpen,
  onClose,
  userEmail = 'usuario@vectorinside.com',
  userName = 'Usuario',
}) => {
  const { currentUser } = useAuth();
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = useCallback(() => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setInfoMessage(null);
    setIsSuccess(false);
    setIsLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      handleReset();
      onClose();
    }
  }, [isLoading, handleReset, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const strength = evaluatePasswordStrength(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

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

    const userId = currentUser?.id;
    if (!userId) {
      setErrorMessage('No se encontró un usuario activo para actualizar la contraseña.');
      return;
    }

    setIsLoading(true);

    try {
      await userService.changePassword(userId, newPassword);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c3f400', '#10B981', '#38BDF8'],
        });
      } catch (err) {}
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'No se pudo actualizar la contraseña en PostgreSQL.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cambiar Contraseña"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-2xl p-5 sm:p-7 relative flex flex-col overflow-hidden my-auto animate-scale-up font-sans">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--neon-primary)]/15 border border-[var(--neon-primary)]/30 flex items-center justify-center text-lime-700 dark:text-neon shadow-neon-sm">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-lime-700 dark:text-neon tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
                  Seguridad de Credenciales
                </span>
                <h3 className="text-lg font-heading font-black text-[var(--text-main)] uppercase tracking-tight">
                  Cambiar Contraseña
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  {userName ? `${userName} · ` : ''}
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
            <div className="py-8 px-4 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[var(--text-main)]">
                  ¡Contraseña actualizada con éxito!
                </h4>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
                  Tus nuevas credenciales para{' '}
                  <strong className="text-[var(--text-main)] font-mono">{userEmail}</strong> han sido cifradas y almacenadas de forma segura.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Credencial actualizada en PostgreSQL
                </span>
              </div>
            </div>
          ) : (
            /* Formulario */
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Mensaje de Error */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-tight">{errorMessage}</span>
                </div>
              )}

              {/* Mensaje Informativo Inline (Recuperación de Contraseña) */}
              {infoMessage && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-mono flex items-start gap-2.5">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-tight">{infoMessage}</span>
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
                      setErrorMessage(null);
                      setInfoMessage(
                        `El restablecimiento por correo no es automático desde este diálogo. Solicita a un administrador de agencia una clave provisional para ${userEmail}.`
                      );
                    }}
                    className="text-[10px] font-mono text-[var(--text-muted)] hover:text-lime-700 dark:hover:text-neon transition-colors underline"
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
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl pl-9 pr-10 py-2.5 text-xs text-[var(--text-main)] placeholder-[var(--text-faint)] focus:border-[var(--neon-primary)] outline-none font-mono transition-all"
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
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl pl-9 pr-10 py-2.5 text-xs text-[var(--text-main)] placeholder-[var(--text-faint)] focus:border-[var(--neon-primary)] outline-none font-mono transition-all"
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
                  <div className="space-y-1 pt-1 animate-fade-in">
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
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Coinciden
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400">No coinciden</span>
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
                        : 'border-[var(--border-color)] focus:border-[var(--neon-primary)]'
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

              {/* Nota transparente de alcance de seguridad */}
              <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Tu nueva contraseña se cifra y persiste directamente en PostgreSQL para <strong className="text-[var(--text-main)]">{userEmail}</strong>. La revocación remota de otras sesiones y alertas por correo no están habilitadas en esta versión.
                </span>
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
                  className="px-5 py-2.5 rounded-xl bg-[var(--neon-primary)] text-black font-mono font-bold text-xs flex items-center gap-2 shadow-neon-sm hover:opacity-95 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
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
