'use client';

import { Suspense } from 'react';
import { ConversacionesInbox } from '@/components/inbox/ConversacionesInbox';

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-[var(--text-muted)] animate-pulse">Cargando bandeja de atención...</div>}>
      <ConversacionesInbox />
    </Suspense>
  );
}
