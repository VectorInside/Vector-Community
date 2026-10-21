'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SystemConfigHub } from '@/components/settings/SystemConfigHub';

function ConfigPageContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'list';
  const tab = searchParams.get('tab') || 'rag';

  return <SystemConfigHub initialTab={tab} initialMode={mode} />;
}

export default function ConfigPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span>Cargando Entorno de Configuración...</span>
          </div>
        </div>
      }
    >
      <ConfigPageContent />
    </Suspense>
  );
}
