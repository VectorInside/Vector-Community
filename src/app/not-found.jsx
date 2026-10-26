import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07080A] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-neon text-2xl font-mono font-black mb-4 shadow-[0_0_30px_rgba(231,249,0,0.2)]">
        404
      </div>
      <h2 className="text-xl sm:text-2xl font-heading font-black tracking-tight mb-2">
        Página no encontrada
      </h2>
      <p className="text-sm text-zinc-400 font-mono max-w-md mb-6">
        El módulo o recurso que buscas no existe o fue reubicado.
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-2.5 rounded-xl bg-neon text-black font-mono font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_20px_rgba(231,249,0,0.3)]"
      >
        Volver al Centro de Mando
      </Link>
    </div>
  );
}
