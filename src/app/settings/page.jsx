'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { SubBotsConfig } from '@/components/settings/SubBotsConfig';
import { ShieldAlert, Lock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import Link from 'next/link';

export default function SettingsPage() {
  const { permissions, isClientReadOnly } = useAuth();

  if (!permissions.canEditSettings) {
    return (
      <div className="p-12 rounded-2xl bg-dark-surface border border-dark-border text-center space-y-4 max-w-xl mx-auto my-12 animate-fadeIn">
        <div className="h-14 w-14 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-white">
          Acceso Restringido (RBAC Guard)
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Tu rol actual (<strong className="text-amber-400">CLIENT_READ_ONLY</strong>) tiene bloqueada la edición de prompts del modelo, credenciales CAPI y base de conocimiento RAG. Solo el equipo de la Agencia (Super Admin / CM) puede modificar estos parámetros.
        </p>
        <div className="pt-2">
          <Link href="/performance">
            <Button variant="primary" size="sm">
              Ir a Performance Backend
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <SubBotsConfig />
    </div>
  );
}
