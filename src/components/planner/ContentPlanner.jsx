'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutGrid,
  Calendar,
  Sparkles,
  Instagram,
  Facebook,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Video,
  Image as ImageIcon,
  Flame,
  ThumbsUp,
  Eye,
  TrendingUp,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContentPlanner = () => {
  const { activeTenant, isAdmin, isClient, triggerModal } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [posts, setPosts] = useState([
    {
      id: 'post-01',
      type: 'REEL',
      channel: 'Instagram & Facebook Reels',
      publishDate: 'Mañana • 19:30 hrs (Hora Pico)',
      title: '3 Señales de que necesitas atender tu salud dental hoy mismo',
      hookText: '¿Sabías que un dolor leve puede convertirse en un tratamiento 3x más costoso en 6 meses?',
      copy: 'En Odontología Integral usamos escaneo 3D sin dolor para diagnosticarte en 15 minutos. 🦷✨ Comenta "VALORACION" y el bot te agendará con 20% de descuento.',
      hashtags: '#SaludDental #ImplantesDentales #OdontologiaCDMX #DientesSanos',
      status: 'PENDIENTE_CLIENTE', // PENDIENTE_CLIENTE | APROBADO_PROGRAMADO | PUBLICADO
      formatIcon: Video,
      estimatedReach: '18.5k - 25k visualizaciones',
      aiConfidence: 96,
      previewBg: 'from-purple-900/40 via-zinc-900 to-black',
    },
    {
      id: 'post-02',
      type: 'CARROUSEL',
      channel: 'Instagram Feed & Facebook',
      publishDate: 'Viernes • 13:00 hrs',
      title: 'Mitos vs Realidades de los Implantes Dentales',
      hookText: 'Mito: "Los implantes duelen mucho". Realidad: Se colocan con anestesia computarizada.',
      copy: 'Desliza para conocer los 4 mitos más comunes antes de realizarte un implante. Si tienes dudas, déjanos un mensaje y te atendemos de inmediato.',
      hashtags: '#MitosDentales #ImplantesSinDolor #SonrisaPerfecta',
      status: 'APROBADO_PROGRAMADO',
      formatIcon: ImageIcon,
      estimatedReach: '12k - 16k cuentas alcanzadas',
      aiConfidence: 94,
      previewBg: 'from-blue-900/40 via-zinc-900 to-black',
    },
    {
      id: 'post-03',
      type: 'STORY',
      channel: 'Instagram Stories (Interactivo)',
      publishDate: 'Sábado • 11:00 hrs',
      title: 'Sticker Interactivo: ¿Cuándo fue tu última limpieza dental?',
      hookText: 'Encuesta: [Menos de 6 meses] vs [Ya ni me acuerdo 🙈]',
      copy: 'Responde a la encuesta y te enviamos un pase de cortesía para tu valoración diagnóstica.',
      hashtags: '#CuidadoBucal #Encuesta',
      status: 'APROBADO_PROGRAMADO',
      formatIcon: Flame,
      estimatedReach: '4.5k vistas en Stories',
      aiConfidence: 98,
      previewBg: 'from-amber-900/40 via-zinc-900 to-black',
    },
    {
      id: 'post-04',
      type: 'REEL',
      channel: 'Instagram & TikTok',
      publishDate: 'Lunes Próximo • 20:00 hrs',
      title: 'Transformación de Sonrisa: Caso Real Paciente Implante Molar',
      hookText: 'De no poder masticar a comer sin dolor en solo 2 citas.',
      copy: 'Así fue el proceso de recuperación de nuestro paciente Carlos. Tecnología guiada por computadora.',
      hashtags: '#AntesYDespues #CasoClinico #OdontologiaDigital',
      status: 'PENDIENTE_CLIENTE',
      formatIcon: Video,
      estimatedReach: '30k - 45k visualizaciones',
      aiConfidence: 97,
      previewBg: 'from-emerald-900/40 via-zinc-900 to-black',
    },
  ]);

  const [commercialOffer, setCommercialOffer] = useState({
    docName: 'Propuesta_Comercial_Octubre_2026.pdf',
    hook: 'Diagnóstico 3D sin costo + 20% en tratamiento integral al agendar esta semana',
    cta: 'Comenta "VALORACION" o envía un DM para apartar cupo',
    validity: 'Campaña Octubre 2026 (Primeros 30 registros)',
  });
  const [showOfferModal, setShowOfferModal] = useState(false);

  const handleUpdateCommercialOffer = (e) => {
    e.preventDefault();
    setShowOfferModal(false);
    triggerModal(
      'Propuesta Comercial Actualizada',
      'La nueva oferta y gancho comercial han sido sincronizados. Las próximas ideas generadas por DeepSeek R1 incorporarán este CTA automáticamente.'
    );
  };

  const handleApprovePost = (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'APROBADO_PROGRAMADO' } : p))
    );

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        colors: ['#D4FF00', '#10B981', '#FFFFFF'],
      });
    } catch (e) {}

    triggerModal(
      'Publicación Aprobada & Programada',
      'El post ha recibido el visto bueno del cliente. El despachador automático de Meta lo publicará exactamente en la fecha y hora programada.'
    );
  };

  const handleGenerateAiPost = () => {
    triggerModal(
      'Generador de Contenido IA (DeepSeek R1)',
      `<b>Nuevo Reel Generado para ${activeTenant?.name}:</b><br><br>
      <b>[Alineado a Oferta]:</b> "${commercialOffer.hook}"<br><br>
      <b>[Gancho 0-3s]:</b> "¿Sabías que un diagnóstico a tiempo te ahorra el 70% en tratamientos mayores?"<br>
      <b>[Desarrollo 4-15s]:</b> "En ${activeTenant?.name} utilizamos tecnología digital guiada para evaluar tu caso sin dolor."<br>
      <b>[Oferta 16-25s]:</b> "${commercialOffer.hook}"<br>
      <b>[CTA 26-30s]:</b> "${commercialOffer.cta}"`,
      () => {
        const newPost = {
          id: `post-${Date.now()}`,
          type: 'REEL',
          channel: 'Instagram & Facebook Reels',
          publishDate: 'Próx. Miércoles • 19:00 hrs',
          title: 'Promoción de Temporada: Diagnóstico Preventivo',
          hookText: '¿Sabías que un diagnóstico a tiempo te ahorra el 70%?',
          copy: `${commercialOffer.hook}. ${commercialOffer.cta}.`,
          hashtags: '#OfertaEspecial #Prevencion #Salud #DeepSeekCreator',
          status: 'PENDIENTE_CLIENTE',
          formatIcon: Video,
          estimatedReach: '22k - 30k visualizaciones',
          aiConfidence: 99,
          previewBg: 'from-pink-900/40 via-zinc-900 to-black',
        };
        setPosts((prev) => [newPost, ...prev]);
        try {
          confetti({ particleCount: 40, spread: 60, colors: ['#E7F900', '#8A95B6', '#FFFFFF'] });
        } catch (e) {}
      },
      'Insertar en Parrilla'
    );
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'PENDING') return p.status === 'PENDING_CLIENTE';
    if (selectedFilter === 'APPROVED') return p.status === 'APROBADO_PROGRAMADO';
    return true;
  });

  return (
    <div className="p-8 block animate-fade-in space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-neon/10 text-neon border border-neon/30">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
              Parrilla Editorial & Content Ops
            </span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-main)]">
            Parrilla de <span className="text-neon">Contenidos</span>
          </h2>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Planificación, previsualización de copys y flujo de aprobación cliente-agencia para:{' '}
            <strong className="text-[var(--text-main)]">{activeTenant?.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGenerateAiPost}
            className="bg-neon text-black text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generar Post con IA (DeepSeek)</span>
          </button>
        </div>
      </header>

      {/* BANNER: PROPUESTA COMERCIAL & OFERTA ACTIVA DEL MES */}
      <div className="rounded-2xl bg-zinc-900/80 border-2 border-neon/50 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_20px_rgba(229,255,0,0.1)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-neon text-black">
              OFERTA COMERCIAL DEL MES
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Doc Activo: <strong className="text-white underline">{commercialOffer.docName}</strong>
            </span>
          </div>
          <p className="text-xs text-white font-bold font-mono">
            Gancho: <span className="text-neon">"{commercialOffer.hook}"</span>
          </p>
          <p className="text-[11px] text-zinc-400 font-mono">
            CTA: <span className="text-cyan-400">{commercialOffer.cta}</span> • Vigencia: {commercialOffer.validity}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowOfferModal(true)}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-zinc-200 border border-white/10 transition-all shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-neon" />
          <span>Actualizar Oferta del Mes</span>
        </button>
      </div>

      {/* MODAL PARA ACTUALIZAR OFERTA COMERCIAL */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-neon/40 shadow-2xl p-6 sm:p-8 relative space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-neon">
                Sincronización con DeepSeek R1
              </span>
              <h3 className="text-xl font-black text-white">
                Editar Oferta Comercial del Mes
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Al guardar, todas las nuevas ideas de contenido y llamadas a la acción se alinearán a esta oferta.
              </p>
            </div>

            <form onSubmit={handleUpdateCommercialOffer} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Documento de Propuesta Comercial (.pdf, .docx, .md)
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setCommercialOffer({
                      ...commercialOffer,
                      docName: e.target.files[0]?.name || commercialOffer.docName,
                    })
                  }
                  className="text-xs text-zinc-400 w-full file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neon file:text-black cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Gancho Principal / Lead Magnet</label>
                <input
                  type="text"
                  required
                  value={commercialOffer.hook}
                  onChange={(e) => setCommercialOffer({ ...commercialOffer, hook: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-neon outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Llamado a la Acción (CTA)</label>
                <input
                  type="text"
                  required
                  value={commercialOffer.cta}
                  onChange={(e) => setCommercialOffer({ ...commercialOffer, cta: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-neon outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Vigencia / Términos</label>
                <input
                  type="text"
                  required
                  value={commercialOffer.validity}
                  onChange={(e) => setCommercialOffer({ ...commercialOffer, validity: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-neon outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neon text-black font-bold shadow-neon"
                >
                  Guardar & Sincronizar IA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALERTA ALGORÍTMICA DE FATIGA CREATIVA (CONDICIÓN MATEMÁTICA DEEPSEEK TRIGGER) */}
      <div className="rounded-2xl bg-purple-950/25 border border-purple-500/40 p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono text-xs shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-purple-400" />
              Sub-Bot Analista • Circuit Breaker de Fatiga Creativa
            </span>
            <span className="text-[10px] text-zinc-400">
              Meta Graph API Telemetría: <strong className="text-white">AdSet "Implantes_Promo_V3"</strong>
            </span>
          </div>

          <p className="text-[11px] text-purple-200 font-sans leading-relaxed">
            <strong>Condición Algorítmica Cumplida:</strong> Frecuencia acumulada en <strong className="text-white font-mono">3.82 (&gt; 3.5)</strong> con incremento de Costo por Clic <strong className="text-red-400 font-mono">ΔCPC +24.5% (&gt; +20%)</strong> y caída en <strong className="text-red-400 font-mono">ΔCTR -18.2% (&lt; -15%)</strong>.
          </p>

          <div className="p-2 rounded-xl bg-black/60 border border-purple-500/20 text-[10px] text-purple-300">
            <code>IF (Frequency &gt; 3.5) AND (ΔCPC &gt; +20% OR ΔCTR &lt; -15%) ⟹ TRIGGER DeepSeek_Creative_Diversity_Prompt</code>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateAiPost}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-neon" />
          <span>Disparar Diversidad Creativa (DeepSeek)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-neon text-black font-bold'
                : 'text-[var(--text-muted)] hover:text-white bg-[var(--bg-card)]'
            }`}
          >
            Todos ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedFilter === 'PENDING'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-[var(--text-muted)] hover:text-white bg-[var(--bg-card)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pendientes Aprobación ({posts.filter((p) => p.status === 'PENDING_CLIENTE').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedFilter === 'APPROVED'
                ? 'bg-emerald-400 text-black font-bold'
                : 'text-[var(--text-muted)] hover:text-white bg-[var(--bg-card)]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Aprobados / Programados ({posts.filter((p) => p.status === 'APROBADO_PROGRAMADO').length})</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-[var(--text-muted)] hidden sm:block">
          Auto-Despacho Meta Graph API • 🟢 Conectado
        </div>
      </div>

      {/* Post Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => {
          const isPending = post.status === 'PENDING_CLIENTE';
          const FormatIcon = post.formatIcon;

          return (
            <div
              key={post.id}
              className={`rounded-2xl vector-bg-card vector-border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-neon/50 ${
                isPending ? 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : ''
              }`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-panel)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-neon/10 text-neon border border-neon/20">
                    <FormatIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] block">
                      {post.channel}
                    </span>
                    <span className="text-xs font-semibold text-white font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {post.publishDate}
                    </span>
                  </div>
                </div>

                <div>
                  {isPending ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> PENDIENTE APROBACIÓN
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> PROGRAMADO EN META
                    </span>
                  )}
                </div>
              </div>

              {/* Card Content & Preview */}
              <div className="p-5 space-y-4 flex-1">
                {/* Visual Banner Preview */}
                <div className={`p-4 rounded-xl bg-gradient-to-br ${post.previewBg} border border-zinc-800 space-y-2`}>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1 text-neon">
                      <Sparkles className="w-3 h-3" /> Guion & Gancho IA
                    </span>
                    <span>Score IA: {post.aiConfidence}%</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    "{post.hookText}"
                  </h4>
                </div>

                {/* Full Copy & Hashtags */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block font-bold">
                    Copy Oficial & Llamado a la Acción (CTA)
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-[var(--bg-base)] p-3 rounded-xl border border-[var(--border-color)]">
                    {post.copy}
                  </p>
                  <p className="text-[11px] font-mono text-blue-400">
                    {post.hashtags}
                  </p>
                </div>

                {/* Estimated Impact */}
                <div className="flex items-center justify-between pt-2 text-xs font-mono text-[var(--text-muted)] border-t border-[var(--border-color)]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Alcance Estimado:</span>
                  </span>
                  <span className="font-bold text-white">{post.estimatedReach}</span>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-panel)] flex items-center justify-between gap-3">
                <span className="text-[10px] font-mono text-zinc-500">
                  ID: {post.id}
                </span>

                <div className="flex items-center gap-2">
                  {isPending ? (
                    <button
                      type="button"
                      onClick={() => handleApprovePost(post.id)}
                      className="bg-neon text-black text-xs font-bold px-4 py-2 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_12px_var(--neon-glow)] flex items-center gap-1.5 active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isClient ? 'Aprobar como Dueño' : 'Aprobar & Programar (1 Clic)'}</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Listo para emisión
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
