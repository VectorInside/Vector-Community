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
  Bot,
  Dna,
  Search,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
  Play,
  Smartphone,
  BarChart2,
  ShieldCheck,
  X,
  FileText,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge } from '@/components/common/Badge';

export const ContentPlanner = () => {
  const { activeTenant, isAdmin, isClient, triggerModal } = useAuth();
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'dna' | 'viral_lab' | 'audit'
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [copiedCanvas, setCopiedCanvas] = useState(false);
  const [selectedViralReel, setSelectedViralReel] = useState(null);

  // Posts State
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
      status: 'PENDIENTE_CLIENTE',
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

  // Brand DNA Canvas State (Idea 7)
  const [brandDna, setBrandDna] = useState({
    archetype: 'El Asesor Experto & Autoridad de Confianza',
    tone: 'Profesional, Empático, Científico y Cálido',
    tabooWords: 'barato, regalado, remedio casero, garantizado 100%, doloroso, sin compromiso',
    icpPains: 'Miedo al dolor del taladro, vergüenza estética al sonreír, desconfianza por presupuestos sorpresa',
    icpObjections: 'Costo de implantes, falta de tiempo, incertidumbre sobre meses sin intereses (MSI)',
    leadMagnetHook: 'Diagnóstico Computarizado 3D Sin Costo + 20% en Tratamiento Integral',
    leadMagnetCta: 'Comenta "VALORACION" o envía un DM con la palabra "DIAGNOSTICO"',
  });

  // Viral Reels Intelligence State (Idea 3 & Idea 6)
  const [viralReels, setViralReels] = useState([
    {
      id: 'vr-01',
      title: '¿Por qué postergar tu implante te costará el triple en 6 meses?',
      views: '48,200',
      hookRate: '46.8%',
      retentionRate: '38.2%',
      dmsGenerated: 312,
      platform: 'Instagram Reels',
      psychologicalTrigger: 'Aversión a la Pérdida (Loss Aversion) + Urgencia Financiera',
      visualHook: 'Primer plano a radiografía 3D con acercamiento rápido en el segundo 0:01.',
      ctaKeyword: 'PREVENCION',
      whyItWorked: 'Tocó el dolor financiero antes que el dolor médico. La gente pospone por miedo al gasto, y este video demostró que posponer es lo que realmente cuesta dinero.',
    },
    {
      id: 'vr-02',
      title: '3 Mitos que ningún dentista tradicional te dice sobre anestesia',
      views: '64,100',
      hookRate: '52.4%',
      retentionRate: '41.5%',
      dmsGenerated: 485,
      platform: 'TikTok & Reels',
      psychologicalTrigger: 'Revelación de Secreto de la Industria + Curiosidad',
      visualHook: 'Texto en pantalla: "No te dejes engañar" + sonido ASMR de instrumental estéril.',
      ctaKeyword: 'INFO',
      whyItWorked: 'Generó polarización positiva atacando el dolor universal del miedo al dentista, ofreciendo solución con anestesia computarizada indolora.',
    },
  ]);

  // Social Profile Audit State (Idea 4)
  const [profileAudit, setProfileAudit] = useState({
    handle: `@${activeTenant?.id || 'odontologiaintegral'}`,
    network: 'Instagram Business & TikTok',
    score: 88,
    checks: [
      {
        id: 'c1',
        title: 'Biografía con Gancho de Valor',
        status: 'WARNING',
        diagnosis: 'Comunica el servicio pero el llamado a la acción no especifica beneficio inmediato.',
        recommendation: 'Cambiar "Agenda tu cita" por "👇 Diagnóstico 3D Gratis en el enlace directo".',
      },
      {
        id: 'c2',
        title: 'Enlace de Conversión (Micro-Landing Vector)',
        status: 'PASSED',
        diagnosis: 'Enlace configurado correctamente hacia https://app.vectorinside.com/m/dental con UTMs limpias.',
        recommendation: '100% Sincronizado sin fugas de rebote web.',
      },
      {
        id: 'c3',
        title: 'Historias Destacadas (Highlights)',
        status: 'WARNING',
        diagnosis: 'Cuenta con 3 álbumes destacados pero falta uno exclusivo para "Precios / MSI" y "Casos Clínicos".',
        recommendation: 'Añadir Highlights con portadas en color de marca (#0D0F12 + Neón).',
      },
      {
        id: 'c4',
        title: 'Publicaciones Ancladas (Pinned Posts)',
        status: 'PASSED',
        diagnosis: '3 posts anclados con el reel más viral, presentación del doctor y oferta del mes.',
        recommendation: 'Mantener actualizados mensualmente.',
      },
    ],
  });

  const [commercialOffer, setCommercialOffer] = useState({
    docName: 'Propuesta_Comercial_Octubre_2026.pdf',
    hook: brandDna.leadMagnetHook,
    cta: brandDna.leadMagnetCta,
    validity: 'Campaña Activa de Temporada (Primeros 30 registros)',
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
      <b>[Alineado a Oferta]:</b> "${brandDna.leadMagnetHook}"<br><br>
      <b>[Gancho 0-3s]:</b> "¿Sabías que un diagnóstico a tiempo te ahorra el 70% en tratamientos mayores?"<br>
      <b>[Desarrollo 4-15s]:</b> "En ${activeTenant?.name} utilizamos tecnología digital guiada para evaluar tu caso sin dolor."<br>
      <b>[Oferta 16-25s]:</b> "${brandDna.leadMagnetHook}"<br>
      <b>[CTA 26-30s]:</b> "${brandDna.leadMagnetCta}"`,
      () => {
        const newPost = {
          id: `post-${Date.now()}`,
          type: 'REEL',
          channel: 'Instagram & Facebook Reels',
          publishDate: 'Próx. Miércoles • 19:00 hrs',
          title: 'Promoción de Temporada: Diagnóstico Preventivo',
          hookText: '¿Sabías que un diagnóstico a tiempo te ahorra el 70%?',
          copy: `${brandDna.leadMagnetHook}. ${brandDna.leadMagnetCta}.`,
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

  const handleSaveBrandDna = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E7F900', '#10B981', '#38BDF8'],
      });
    } catch (e) {}
    triggerModal(
      'ADN de Negocio Sincronizado con Éxito',
      `Los parámetros de Arquetipo, Glosario Prohibido y Dolores del ICP han sido indexados en la memoria RAG de DeepSeek R1. Todas las respuestas de WhatsApp, DMs y guiones generados utilizarán este estándar.`,
      null,
      'Entendido'
    );
  };

  const handleCopyBrandDna = () => {
    navigator.clipboard.writeText(JSON.stringify(brandDna, null, 2));
    setCopiedCanvas(true);
    setTimeout(() => setCopiedCanvas(false), 2000);
  };

  const handleReplicateViralReel = (reel) => {
    triggerModal(
      `Ingeniería Inversa Viral: ${reel.title}`,
      `<b>Fórmula Psicológica Detectada (DeepSeek R1):</b><br>
      • <b>Disparador:</b> ${reel.psychologicalTrigger}<br>
      • <b>Hook Rate Excepcional:</b> ${reel.hookRate} (Benchmark: 25%)<br>
      • <b>Estímulo Visual:</b> ${reel.visualHook}<br><br>
      <div style="background:#0D0F12; padding:12px; border-radius:12px; border:1px solid #1F242D; font-family:monospace; font-size:11px;">
        <span style="color:#D4FF00; font-weight:bold;">🎬 3 VARIANTES GENERADAS CON LA MISMA FÓRMULA:</span><br><br>
        1. <b>Variante Blanqueamiento:</b> "¿Por qué hacerte un blanqueamiento casero puede arruinar tu esmalte para siempre?"<br>
        2. <b>Variante Ortodoncia Invisible:</b> "La verdad oculta sobre por qué los brackets metálicos ya no son la opción más rápida."<br>
        3. <b>Variante Limpieza 3D:</b> "¿Crees que lavarte 3 veces al día es suficiente? Mira lo que encontramos con cámara intraoral."
      </div>`,
      () => {
        try {
          confetti({ particleCount: 40, spread: 60, colors: ['#D4FF00', '#10B981'] });
        } catch (e) {}
      },
      'Insertar Variantes en la Parrilla'
    );
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'PENDING') return p.status === 'PENDIENTE_CLIENTE';
    if (selectedFilter === 'APPROVED') return p.status === 'APROBADO_PROGRAMADO';
    return true;
  });

  return (
    <div className="p-6 lg:p-8 block animate-fade-in space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-neon/10 text-neon border border-neon/30">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
              Content Ops & Creative Intelligence
            </span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-main)]">
            Estudio de <span className="text-neon">Contenidos & Crecimiento</span>
          </h2>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Parrilla editorial, ADN de negocio, deconstrucción viral de reels y auditoría de perfiles para:{' '}
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
            <span>Generar Guion IA (DeepSeek R1)</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs (4 Core Pillars of Content Strategy) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-dark-border">
        <button
          type="button"
          onClick={() => setActiveTab('grid')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            activeTab === 'grid'
              ? 'bg-brand-primary text-black shadow-neon-sm'
              : 'bg-dark-base text-zinc-400 hover:text-white border border-dark-border'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Parrilla Multiplataforma</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dna')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            activeTab === 'dna'
              ? 'bg-brand-primary text-black shadow-neon-sm'
              : 'bg-dark-base text-zinc-400 hover:text-white border border-dark-border'
          }`}
        >
          <Dna className="w-4 h-4" />
          <span>Plantilla de ADN de Negocio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('viral_lab')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            activeTab === 'viral_lab'
              ? 'bg-brand-primary text-black shadow-neon-sm'
              : 'bg-dark-base text-zinc-400 hover:text-white border border-dark-border'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Laboratorio de Reels Virales</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            activeTab === 'audit'
              ? 'bg-brand-primary text-black shadow-neon-sm'
              : 'bg-dark-base text-zinc-400 hover:text-white border border-dark-border'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Auditoría de Perfiles</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PARRILLA DE CONTENIDO MULTIPLATAFORMA (IDEA 5)                     */}
      {/* ========================================================================= */}
      {activeTab === 'grid' && (
        <div className="space-y-6 animate-fade-in">
          {/* BANNER: OFERTA COMERCIAL VIGENTE */}
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
                Gancho: <span className="text-neon">"{brandDna.leadMagnetHook}"</span>
              </p>
              <p className="text-[11px] text-zinc-400 font-mono">
                CTA: <span className="text-cyan-400">{brandDna.leadMagnetCta}</span> • Vigencia: {commercialOffer.validity}
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

          {/* Filters Bar */}
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">Filtrar estado:</span>
              {['ALL', 'PENDING', 'APPROVED'].map((fil) => (
                <button
                  key={fil}
                  onClick={() => setSelectedFilter(fil)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-all ${
                    selectedFilter === fil
                      ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {fil === 'ALL' ? 'Todos los Posts' : fil === 'PENDING' ? 'Pendientes de Aprobación' : 'Aprobados y Programados'}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              {filteredPosts.length} publicaciones programadas
            </span>
          </div>

          {/* Posts Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => {
              const IconFormat = post.formatIcon;
              const isPending = post.status === 'PENDIENTE_CLIENTE';

              return (
                <div
                  key={post.id}
                  className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden shadow-lg flex flex-col justify-between hover:border-white/20 transition-all"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-zinc-800 text-neon border border-white/5">
                          <IconFormat className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">
                            {post.channel}
                          </span>
                          <span className="text-xs font-mono font-bold text-white">
                            {post.publishDate}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          isPending
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isPending ? 'Pendiente Cliente' : 'Aprobado'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white font-sans">
                      {post.title}
                    </h4>

                    {/* Hook Text Card */}
                    <div className="p-3.5 rounded-xl bg-zinc-950 border border-neon/30 text-xs font-mono space-y-1">
                      <span className="text-[10px] text-neon uppercase font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3 text-neon" />
                        Gancho Viral (0-3s Hook)
                      </span>
                      <p className="text-zinc-200 font-bold italic">
                        "{post.hookText}"
                      </p>
                    </div>

                    {/* Full Copy */}
                    <div className="space-y-1.5 text-xs font-sans">
                      <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">
                        Copy & CTA
                      </span>
                      <p className="text-zinc-300 leading-relaxed bg-zinc-950/70 p-3 rounded-xl border border-white/5 font-mono text-[11px]">
                        {post.copy}
                      </p>
                      <p className="text-[11px] font-mono text-blue-400">
                        {post.hashtags}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-[var(--border-color)] bg-zinc-900/60 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{post.estimatedReach}</span>
                    </span>

                    {isPending ? (
                      <button
                        type="button"
                        onClick={() => handleApprovePost(post.id)}
                        className="bg-neon text-black text-xs font-bold px-4 py-2 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_12px_var(--neon-glow)] flex items-center gap-1.5 active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aprobar Publicación</span>
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Programado
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PLANTILLA DE ADN DE NEGOCIO (IDEA 7)                               */}
      {/* ========================================================================= */}
      {activeTab === 'dna' && (
        <div className="rounded-3xl bg-dark-surface border border-dark-border p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-border">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
                <Dna className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Plantilla de ADN de Negocio (Brand DNA Canvas)
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Single Source of Truth para la identidad, tono de voz y blindaje de la IA (ADR-002 §2.7)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyBrandDna}
                className="px-3.5 py-2 rounded-xl bg-dark-base hover:bg-zinc-800 text-zinc-300 text-xs font-mono border border-dark-border flex items-center gap-1.5 transition-colors"
              >
                {copiedCanvas ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCanvas ? '¡Copiado!' : 'Copiar JSON'}</span>
              </button>
              <button
                type="button"
                onClick={handleSaveBrandDna}
                className="px-4 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs font-mono shadow-neon-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sincronizar con Memoria RAG</span>
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Arquetipo */}
            <div className="p-5 rounded-2xl bg-dark-base border border-dark-border space-y-2">
              <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider block">
                1. Arquetipo de Marca
              </span>
              <input
                type="text"
                value={brandDna.archetype}
                onChange={(e) => setBrandDna({ ...brandDna, archetype: e.target.value })}
                className="w-full bg-dark-elevated border border-dark-border rounded-xl p-3 text-white focus:border-brand-primary outline-none"
              />
              <p className="text-[10px] text-zinc-500 font-sans">
                Define la postura psicológica: La Autoridad Confiable, El Mentor Enérgico, El Amigo Rebelde.
              </p>
            </div>

            {/* Tono de Voz */}
            <div className="p-5 rounded-2xl bg-dark-base border border-dark-border space-y-2">
              <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider block">
                2. Tono de Voz & Adjetivos Clave
              </span>
              <input
                type="text"
                value={brandDna.tone}
                onChange={(e) => setBrandDna({ ...brandDna, tone: e.target.value })}
                className="w-full bg-dark-elevated border border-dark-border rounded-xl p-3 text-white focus:border-brand-primary outline-none"
              />
              <p className="text-[10px] text-zinc-500 font-sans">
                Estilo de redacción en DMs, WhatsApp y guiones de Reels.
              </p>
            </div>

            {/* Palabras Tabú / Glosario Prohibido */}
            <div className="p-5 rounded-2xl bg-dark-base border border-red-500/30 space-y-2 bg-red-950/5">
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                3. Glosario Prohibido (Palabras Tabú)
              </span>
              <textarea
                rows={3}
                value={brandDna.tabooWords}
                onChange={(e) => setBrandDna({ ...brandDna, tabooWords: e.target.value })}
                className="w-full bg-dark-elevated border border-dark-border rounded-xl p-3 text-zinc-200 focus:border-red-400 outline-none resize-none"
              />
              <p className="text-[10px] text-zinc-500 font-sans">
                Palabras que el bot o los guiones tienen ESTRICTAMENTE prohibido pronunciar.
              </p>
            </div>

            {/* Dolores Primarios del ICP */}
            <div className="p-5 rounded-2xl bg-dark-base border border-dark-border space-y-2">
              <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider block">
                4. Dolores Agudos del Cliente Ideal (ICP)
              </span>
              <textarea
                rows={3}
                value={brandDna.icpPains}
                onChange={(e) => setBrandDna({ ...brandDna, icpPains: e.target.value })}
                className="w-full bg-dark-elevated border border-dark-border rounded-xl p-3 text-zinc-200 focus:border-brand-primary outline-none resize-none"
              />
              <p className="text-[10px] text-zinc-500 font-sans">
                Las motivaciones emocionales profundas que impulsan la decisión de agendar.
              </p>
            </div>

            {/* Oferta Gancho Irresistible */}
            <div className="p-5 rounded-2xl bg-dark-base border border-brand-primary/40 space-y-2 md:col-span-2 bg-brand-primary/5">
              <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                5. Oferta Gancho Irresistible (Lead Magnet Activo)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={brandDna.leadMagnetHook}
                  onChange={(e) => setBrandDna({ ...brandDna, leadMagnetHook: e.target.value })}
                  placeholder="Gancho de la oferta..."
                  className="w-full bg-dark-elevated border border-dark-border rounded-xl p-3 text-white focus:border-brand-primary outline-none"
                />
                <input
                  type="text"
                  value={brandDna.leadMagnetCta}
                  onChange={(e) => setBrandDna({ ...brandDna, leadMagnetCta: e.target.value })}
                  placeholder="Call to Action con palabra clave..."
                  className="w-full bg-dark-elevated border border-dark-border rounded-xl p-3 text-white focus:border-brand-primary outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LABORATORIO DE REELS VIRALES (IDEAS 3 Y 6)                         */}
      {/* ========================================================================= */}
      {activeTab === 'viral_lab' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-dark-surface border border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
                  <Flame className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    Laboratorio de Deconstrucción & Replicación Viral (DeepSeek R1)
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Análisis algorítmico de los reels que despegaron y generación de fórmulas replicables (ADR-004 §2.4)
                  </p>
                </div>
              </div>
            </div>

            <Badge variant="neon" size="sm">
              Escucha Activa Meta Graph
            </Badge>
          </div>

          {/* Viral Reels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {viralReels.map((reel) => (
              <div
                key={reel.id}
                className="rounded-2xl bg-dark-surface border border-dark-border p-6 space-y-5 shadow-lg hover:border-brand-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                      Viral Outlier Confirmado
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{reel.platform}</span>
                  </div>

                  <h4 className="text-base font-bold text-white font-sans">
                    "{reel.title}"
                  </h4>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-dark-base border border-dark-border">
                      <span className="text-[10px] text-zinc-500 block">Vistas</span>
                      <span className="text-sm font-bold text-white">{reel.views}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-dark-base border border-dark-border">
                      <span className="text-[10px] text-zinc-500 block">Hook Rate</span>
                      <span className="text-sm font-bold text-brand-primary">{reel.hookRate}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-dark-base border border-dark-border">
                      <span className="text-[10px] text-zinc-500 block">DMs CAPI</span>
                      <span className="text-sm font-bold text-emerald-400">{reel.dmsGenerated}</span>
                    </div>
                  </div>

                  {/* DeepSeek R1 Reverse Engineering Card */}
                  <div className="p-4 rounded-2xl bg-dark-elevated border border-brand-primary/30 space-y-2 text-xs font-mono">
                    <span className="text-[10px] text-brand-primary font-bold uppercase flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5" />
                      Deconstrucción Algorítmica (Por qué funcionó):
                    </span>
                    <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                      {reel.whyItWorked}
                    </p>
                    <div className="pt-2 border-t border-dark-border text-[11px] text-zinc-400">
                      <span>Disparador: <strong>{reel.psychologicalTrigger}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-border">
                  <button
                    type="button"
                    onClick={() => handleReplicateViralReel(reel)}
                    className="w-full py-3 px-4 rounded-xl bg-brand-primary text-black font-bold text-xs font-mono shadow-neon-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>🧬 Replicar Fórmula en 3 Nuevos Guiones</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDITORÍA DE PERFILES SOCIALES (IDEA 4)                             */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-dark-surface border border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
                <Search className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Auditoría de Perfil Social: {profileAudit.handle}
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Optimización de Biografía, Enlace en Bio y Conversión a WhatsApp (ADR-006 §3.9)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <span className="text-xs text-zinc-400 block">Health Score de Perfil:</span>
                <span className="text-lg font-bold text-brand-primary">{profileAudit.score} / 100</span>
              </div>
            </div>
          </div>

          {/* Audit Checks Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileAudit.checks.map((chk) => (
              <div
                key={chk.id}
                className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-3 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-2 font-sans">
                    {chk.status === 'PASSED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    {chk.title}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      chk.status === 'PASSED'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {chk.status === 'PASSED' ? 'Optimizado' : 'Requiere Ajuste'}
                  </span>
                </div>

                <p className="text-zinc-300 font-sans text-xs">
                  {chk.diagnosis}
                </p>

                <div className="p-3 rounded-xl bg-dark-base border border-dark-border text-[11px] text-zinc-400 space-y-1">
                  <span className="text-brand-primary font-bold block">Recomendación IA:</span>
                  <p>{chk.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  type="text"
                  value={commercialOffer.docName}
                  onChange={(e) => setCommercialOffer({ ...commercialOffer, docName: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-neon outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Gancho Comercial del Mes (Hook)
                </label>
                <textarea
                  rows={2}
                  value={brandDna.leadMagnetHook}
                  onChange={(e) => setBrandDna({ ...brandDna, leadMagnetHook: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-neon outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Llamado a la Acción (CTA) & Palabra Clave
                </label>
                <input
                  type="text"
                  value={brandDna.leadMagnetCta}
                  onChange={(e) => setBrandDna({ ...brandDna, leadMagnetCta: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-neon outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neon text-black font-bold hover:bg-[var(--neon-hover)] shadow-neon"
                >
                  Guardar y Sincronizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
