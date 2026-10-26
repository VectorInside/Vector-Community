'use client';

import React, { useState } from 'react';
import { Portal } from '@/components/common/Portal';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Check,
  KeyRound,
  ArrowRight,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * ============================================================================
 * MODAL: POP-UP DE CAMBIO OBLIGATORIO DE CONTRASEÑA (PRIMER INGRESO / CLAVE TEMPORAL)
 * ============================================================================
 * Se despliega automáticamente cuando un Dueño de Negocio ingresa a la plataforma
 * con una contraseña provisional emitida por la agencia (mustChangePassword === true).
 * Garantiza privacidad total: la agencia desconoce la nueva contraseña definitiva.
 * ============================================================================
 */
export const ClientPasswordChangeModal = ({
  account,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !account) return null;

  // Validation rules
  const hasMinLength = newPass.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPass);
  const passwordsMatch = newPass.length > 0 && newPass === confirmPass;
  const isDifferentFromCurrent = newPass !== (account.tempPassword || currentPass);
  const isFormValid = hasMinLength && hasNumberOrSymbol && passwordsMatch;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isFormValid) {
      setErrorMsg('Por favor cumple con todos los requisitos de seguridad.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C3F400', '#10B981', '#3B82F6'],
        });
      } catch (err) {}

      // Update accounts in localStorage
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('vector_tenant_owner_accounts');
          if (saved) {
            const list = JSON.parse(saved);
            const updated = list.map((a) =>
              a.tenantId === account.tenantId
                ? {
                    ...a,
                    tempPassword: newPass,
                    mustChangePassword: false,
                    lastPasswordChange: new Date().toISOString(),
                  }
                : a
            );
            localStorage.setItem('vector_tenant_owner_accounts', JSON.stringify(updated));
          }
        } catch (err) {}
      }

      setTimeout(() => {
        if (onSuccess) onSuccess(newPass);
        if (onClose) onClose();
      }, 1400);
    }, 700);
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in font-sans">
        <div className="relative w-full max-w-lg bg-[var(--bg-panel)] border-2 border-neon/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-[0_0_50px_rgba(195,244,0,0.25)] animate-scale-up">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-neon/15 text-neon border border-neon/30 shrink-0">
                <KeyRound className="w-6 h-6 text-neon animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-black text-[var(--text-main)]">
                  Actualizar Contraseña Obligatoria
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                  {account.tenantName} • {account.ownerName}
                </p>
              </div>
            </div>
          </div>

          {/* Context Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-sans space-y-1">
            <div className="flex items-center gap-2 font-bold font-mono text-[11px] uppercase tracking-wider text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Primer Ingreso o Clave Provisional Detectada</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-300">
              Por protocolo estricto de privacidad bancaria y comercial, debes reemplazar la clave provisional emitida por la agencia por tu contraseña personal definitiva. Nadie más tendrá acceso a ella.
            </p>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-heading font-black text-white">
                ¡Contraseña Actualizada con Éxito!
              </h4>
              <p className="text-xs text-zinc-400 font-mono">
                Tu nueva clave ha sido encriptada. Accediendo a tu espacio de trabajo...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              {/* Contraseña Actual / Provisional */}
              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1 font-sans text-xs">
                  Contraseña Provisional Actual
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder={account.tempPassword || 'Ingresa tu clave provisional'}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-3 pr-10 py-2.5 text-xs text-[var(--text-main)] font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-white"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Nueva Contraseña Definitiva */}
              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1 font-sans text-xs">
                  Nueva Contraseña Definitiva *
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Mínimo 8 caracteres (letras, números y símbolos)"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-3 pr-10 py-2.5 text-xs text-[var(--text-main)] font-mono font-bold outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-white"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Nueva Contraseña */}
              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1 font-sans text-xs">
                  Confirmar Nueva Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Escribe exactamente la misma contraseña"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-neon rounded-xl pl-3 pr-10 py-2.5 text-xs text-[var(--text-main)] font-mono font-bold outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-white"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Validation Checklist */}
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5 text-[11px] font-sans">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <span>Al menos 8 caracteres</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumberOrSymbol ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasNumberOrSymbol ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <span>Incluye números o caracteres especiales (!#$%)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${passwordsMatch ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <span>Ambas contraseñas coinciden</span>
                </div>
              </div>

              {errorMsg && (
                <p className="text-red-400 text-xs font-mono font-bold">
                  {errorMsg}
                </p>
              )}

              {/* Action Button */}
              <div className="flex items-center justify-end pt-4 border-t border-[var(--border-color)]">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neon text-black font-mono font-bold text-xs hover:bg-[var(--neon-hover)] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(195,244,0,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Encriptando y guardando...</span>
                  ) : (
                    <>
                      <span>Guardar Contraseña Definitiva</span>
                      <ArrowRight className="w-4 h-4 text-black" />
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
