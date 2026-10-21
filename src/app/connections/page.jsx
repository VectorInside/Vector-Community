'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SystemConfigHub } from '@/components/settings/SystemConfigHub';

function ConnectionsContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'list';

  return <SystemConfigHub initialTab="rag" initialMode={mode} />;
}

export default function ConnectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span>Cargando Conexiones y Base RAG...</span>
          </div>
        </div>
      }
    >
      <ConnectionsContent />
    </Suspense>
  );
}
