import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-lime-700 dark:text-neon text-2xl font-mono font-black mb-4 shadow-[0_0_30px_var(--neon-glow)]">
        404
      </div>
      <h2 className="text-xl sm:text-2xl font-heading font-black tracking-tight mb-2">
        Página no encontrada
      </h2>
      <p className="text-sm text-[var(--text-muted)] font-mono max-w-md mb-6">
        El módulo o recurso que buscas no existe o fue reubicado.
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-2.5 rounded-xl bg-[var(--neon-primary)] text-black font-mono font-black text-xs uppercase tracking-wider hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_20px_var(--neon-glow)]"
      >
        Volver al Centro de Mando
      </Link>
    </div>
  );
}
