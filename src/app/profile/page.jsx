'use client';

import React, { Suspense } from 'react';
import { PerfilMarcaView } from '@/components/profile/PerfilMarcaView';

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-[var(--text-muted)] animate-pulse">Cargando perfil de marca...</div>}>
      <PerfilMarcaView />
    </Suspense>
  );
}
