'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Database, FileText, Upload, Shield, Key, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RAGWizard = () => {
  const { triggerModal } = useAuth();
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    catalogDoc: 'Catalogo_Precios_2026.pdf',
    policiesDoc: 'Politicas_Envios_Garantias.pdf',
    cacMax: 150,
    ltvExpected: 1800,
    whatsappPhoneId: '',
    metaAccessToken: '',
    deepseekApiKey: '',
  });

  const handleDeploySwarm = () => {
    triggerModal(
      'Enjambre Desplegado',
      'El Tenant ha sido sectorizado con RLS, su memoria RAG está fragmentada por módulos y las APIs de Meta y DeepSeek están operando.',
      () => {
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            colors: ['#E5FF00', '#10B981', '#FFFFFF'],
          });
        } catch (e) {}
        setStep(1);
      },
      'Finalizar Despliegue'
    );
  };

  return (
    <div className="p-8 block animate-fade-in">
      <header className="mb-8 border-b border-[var(--border-color)] pb-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-main)]">
          Matriz Multi-Tenant <span className="text-neon">RAG</span>
        </h2>
        <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
          Alta de negocio sectorizada por apartados para evitar alucinaciones en la IA.
        </p>
      </header>

      <div className="vector-bg-card vector-border rounded-lg p-6 max-w-4xl mx-auto shadow-2xl">
        {/* Step Indicators */}
        <div className="flex justify-between mb-8 border-b border-[var(--border-color)] pb-4 font-mono text-xs overflow-x-auto gap-4">
          <span
            className={`cursor-pointer font-bold ${
              step === 1 ? 'text-neon' : 'text-[var(--text-muted)]'
            }`}
            onClick={() => setStep(1)}
          >
            1. Memoria RAG Sectorizada
          </span>
          <span
            className={`cursor-pointer font-bold ${
              step === 2 ? 'text-neon' : 'text-[var(--text-muted)]'
            }`}
            onClick={() => setStep(2)}
          >
            2. Unit Economics
          </span>
          <span
            className={`cursor-pointer font-bold ${
              step === 3 ? 'text-neon' : 'text-[var(--text-muted)]'
            }`}
            onClick={() => setStep(3)}
          >
            3. Credenciales API
          </span>
        </div>

        {/* STEP 1: Memoria RAG Sectorizada */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="font-bold text-sm uppercase text-[var(--text-main)] flex items-center gap-2">
              <Database className="w-4 h-4 text-neon" />
              <span>Carga de Documentación Apartado por Apartado</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Para garantizar precisión quirúrgica y evitar que el modelo mezcle políticas con precios, divide el conocimiento del negocio en archivos específicos:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 vector-bg-panel vector-border rounded-lg space-y-2">
                <label className="text-xs font-bold block text-[var(--text-main)] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-neon" />
                  <span>Módulo A: Catálogo & Precios</span>
                </label>
                <input
                  type="file"
                  className="text-xs text-[var(--text-muted)] w-full file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-neon file:text-black hover:file:bg-[var(--neon-hover)] cursor-pointer"
                />
                <p className="text-[10px] text-zinc-500 font-mono">
                  Archivo cargado: {formData.catalogDoc}
                </p>
              </div>

              <div className="p-4 vector-bg-panel vector-border rounded-lg space-y-2">
                <label className="text-xs font-bold block text-[var(--text-main)] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-neon" />
                  <span>Módulo B: Políticas & Envíos</span>
                </label>
                <input
                  type="file"
                  className="text-xs text-[var(--text-muted)] w-full file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-neon file:text-black hover:file:bg-[var(--neon-hover)] cursor-pointer"
                />
                <p className="text-[10px] text-zinc-500 font-mono">
                  Archivo cargado: {formData.policiesDoc}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-neon text-black text-xs font-bold px-5 py-2.5 rounded hover:bg-[var(--neon-hover)] transition-all flex items-center gap-1.5 shadow-[0_0_10px_var(--neon-glow)]"
              >
                <span>Siguiente: Unit Economics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Unit Economics */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="font-bold text-sm uppercase text-[var(--text-main)] flex items-center gap-2">
              <Shield className="w-4 h-4 text-neon" />
              <span>Definición Financiera (Unit Economics)</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Reglas de supervivencia para que el bot active el Freno de Emergencia si el tráfico encarece o la tasa de conversión desciende:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-mono block mb-1 text-[var(--text-main)]">
                  CAC Máximo Tolerable (MXN)
                </label>
                <input
                  type="number"
                  value={formData.cacMax}
                  onChange={(e) => setFormData({ ...formData, cacMax: e.target.value })}
                  className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded p-2.5 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                />
                <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  Si el CAC en Meta supera los $150 MXN, se emitirá alerta HITL inmediata.
                </p>
              </div>

              <div>
                <label className="text-xs font-mono block mb-1 text-[var(--text-main)]">
                  LTV Esperado (MXN)
                </label>
                <input
                  type="number"
                  value={formData.ltvExpected}
                  onChange={(e) => setFormData({ ...formData, ltvExpected: e.target.value })}
                  className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded p-2.5 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                />
                <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  Valor proyectado de recompra a 12 meses.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-[var(--bg-base)] border border-[var(--border-color)] text-xs px-4 py-2 rounded text-[var(--text-main)] hover:border-zinc-500 transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Atrás</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-neon text-black text-xs font-bold px-5 py-2.5 rounded hover:bg-[var(--neon-hover)] transition-all flex items-center gap-1.5 shadow-[0_0_10px_var(--neon-glow)]"
              >
                <span>Siguiente: Credenciales</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Credenciales API */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="font-bold text-sm uppercase text-[var(--text-main)] flex items-center gap-2">
              <Key className="w-4 h-4 text-neon" />
              <span>Conexión de APIs Nativas</span>
            </h3>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-mono block mb-1 text-[var(--text-muted)]">
                  WhatsApp Cloud API Phone Number ID
                </label>
                <input
                  type="text"
                  placeholder="ej. 109283019283019"
                  className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded p-2.5 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono block mb-1 text-[var(--text-muted)]">
                  Meta Graph API Access Token (CAPI)
                </label>
                <input
                  type="password"
                  placeholder="EAAG923019283019283019283019283019..."
                  className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded p-2.5 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono block mb-1 text-[var(--text-muted)]">
                  DeepSeek API Key (Sub-Bot Creador)
                </label>
                <input
                  type="password"
                  placeholder="sk-deepseek-901238019283019..."
                  className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded p-2.5 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-[var(--bg-base)] border border-[var(--border-color)] text-xs px-4 py-2 rounded text-[var(--text-main)] hover:border-zinc-500 transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Atrás</span>
              </button>

              <button
                type="button"
                onClick={handleDeploySwarm}
                className="bg-neon text-black text-xs font-bold px-6 py-2.5 rounded hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] flex items-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Desplegar Enjambre</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
