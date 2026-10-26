'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { OrchestrationView } from '@/components/agents/OrchestrationView';
import { Lock } from 'lucide-react';

export default function LabPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-center space-y-4 shadow-2xl animate-scale-up font-sans">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-neon-sm">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
              Control de Acceso RBAC · Solo Agencia
            </span>
            <h2 className="text-xl font-heading font-black text-[var(--text-main)] uppercase">
              Laboratorio & Orquestación
            </h2>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] leading-relaxed">
            La ingeniería de prompts XML, pruebas A/B de sub-bots y simulación de enjambres cognitivos está reservada para el equipo técnico de Vector Inside. Tu negocio opera bajo un asistente calibrado y seguro.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-neon text-black font-mono font-bold text-xs shadow-neon-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              Volver a Mi Centro de Mando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <OrchestrationView />;
}
