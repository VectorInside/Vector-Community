'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { formatNumber, cleanConcept } from '@/utils/formatters';
import {
  Megaphone,
  Plus,
  ArrowRight,
  Target,
  DollarSign,
  Users,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Filter,
  CheckCircle2,
  X,
  Bot,
  Zap,
  TrendingUp,
  BarChart2,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Smartphone,
  Globe,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ============================================================================
// MATRIZ DE CAMPAÑAS ESTRATÉGICAS POR GIRO DE NEGOCIO (VERTICAL-AWARE)
// ============================================================================
const TENANT_CAMPAIGNS = {
  dental: [
    {
      id: 'camp-dental-1',
      name: 'Ortodoncia Invisible 3D & Alineadores',
      offer: 'Diagnóstico intraoral 3D sin costo + hasta 12 MSI en alineadores transparentes.',
      objective: 'Citas Calificadas & Valoración',
      audience: 'Adultos 22-45 años en Polanco, Miguel Hidalgo y zonas aledañas',
      channel: 'Meta Ads (Instagram & FB)',
      budget: 18000,
      spend: 9400,
      leadsCount: 14,
      piecesCount: 5,
      status: 'Activa',
      owner: 'Dra. Sofía Alarcón & IA Vector',
      start: '2026-10-01',
      end: '2026-11-15',
      hypothesis: 'Destacar la estética sin brackets metálicos y el diagnóstico digital atrae prospectos con ticket promedio >$35,000 MXN.',
      roas: '4.2x',
      cpl: 671,
    },
    {
      id: 'camp-dental-2',
      name: 'Implantes Dentales & Carga Inmediata',
      offer: 'Tomografía computarizada incluida y plan quirúrgico guiado por computadora.',
      objective: 'Cirugía de Alta Especialidad',
      audience: 'Hombres y mujeres 40-65 años con necesidad de rehabilitación bucal',
      channel: 'Google Search & Meta CAPI',
      budget: 14000,
      spend: 6800,
      leadsCount: 8,
      piecesCount: 3,
      status: 'Activa',
      owner: 'Dr. Alejandro Peña & IA Vector',
      start: '2026-10-05',
      end: '2026-11-20',
      hypothesis: 'Pauta de alta intención en Google Search conectada al CAPI directo a WhatsApp reduce el ciclo de cierre de 3 semanas a 48 horas.',
      roas: '5.6x',
      cpl: 850,
    },
    {
      id: 'camp-dental-3',
      name: 'Blanqueamiento Láser Express Eventos',
      offer: 'Aclara hasta 4 tonos en 1 sola sesión de 45 min (-20% de descuento este mes).',
      objective: 'Captación Rápida & Ticket Ágil',
      audience: 'Jóvenes 20-35 años, novias, graduaciones y eventos sociales',
      channel: 'Meta Reels & TikTok',
      budget: 8000,
      spend: 2100,
      leadsCount: 6,
      piecesCount: 4,
      status: 'En preparación',
      owner: 'Lobo Vectorial (Agencia)',
      start: '2026-10-25',
      end: '2026-11-30',
      hypothesis: 'Videos de antes/después en reels generan alta viralidad y volumen de mensajes a costo por lead inferior a $350 MXN.',
      roas: '3.1x',
      cpl: 350,
    },
  ],
  polanco: [
    {
      id: 'camp-polanco-1',
      name: 'Experiencia Cortes Prime en Terraza VIP',
      offer: 'Reserva prioritaria de mesa en terraza con cóctel de bienvenida de autor.',
      objective: 'Reservas VIP & Ocasiones Especiales',
      audience: 'Gourmets, ejecutivos y parejas 28-55 años en CDMX Poniente',
      channel: 'Meta Ads (Instagram & FB)',
      budget: 20000,
      spend: 11200,
      leadsCount: 28,
      piecesCount: 6,
      status: 'Activa',
      owner: 'Chef Ejecutivo & IA Vector',
      start: '2026-10-01',
      end: '2026-11-15',
      hypothesis: 'Creativos en video con cortes Dry-Aged al fuego y mixología generan reservas inmediatas con ticket promedio >$2,800 MXN por mesa.',
      roas: '6.4x',
      cpl: 400,
    },
    {
      id: 'camp-polanco-2',
      name: 'Menú Degustación & Maridaje Sommelier',
      offer: 'Menú exclusivo 5 tiempos maridado con etiquetas internacionales selectas.',
      objective: 'Comensales de Alto Ticket',
      audience: 'Búsqueda de alta gastronomía en Polanco, Lomas y Condesa',
      channel: 'Google Search & Meta CAPI',
      budget: 15000,
      spend: 7900,
      leadsCount: 16,
      piecesCount: 3,
      status: 'Activa',
      owner: 'Sommelier Titular',
      start: '2026-10-05',
      end: '2026-11-20',
      hypothesis: 'Captar búsquedas tipo "restaurante cena romántica polanco" y agendar en WhatsApp con confirmación automática en <5 min.',
      roas: '5.1x',
      cpl: 493,
    },
    {
      id: 'camp-polanco-3',
      name: 'After-Office Mixología & DJ en Vivo',
      offer: '2x1 en cócteles de autor y tabla de tapas los jueves y viernes de 18:00 a 21:00 hrs.',
      objective: 'Grupos Corporativos & Networking',
      audience: 'Colaboradores corporativos de Masaryk, Palmas y Reforma',
      channel: 'Meta Reels & TikTok',
      budget: 9000,
      spend: 3500,
      leadsCount: 19,
      piecesCount: 4,
      status: 'En preparación',
      owner: 'Lobo Vectorial (Agencia)',
      start: '2026-10-25',
      end: '2026-11-30',
      hypothesis: 'Anuncios en carrusel y reels con ambiente nocturno activan mesas de 4 a 8 personas para after-office.',
      roas: '4.8x',
      cpl: 184,
    },
  ],
  urban: [
    {
      id: 'camp-urban-1',
      name: 'Drops Exclusivos & Sneakers Hype',
      offer: 'Apartado de calzado edición limitada Nike, Jordan y Yeezy 100% original autenticado.',
      objective: 'Apartados & Venta Directa',
      audience: 'Sneakerheads y comunidad streetwear 18-35 años en México',
      channel: 'Meta Ads (Instagram & FB)',
      budget: 22000,
      spend: 14300,
      leadsCount: 42,
      piecesCount: 8,
      status: 'Activa',
      owner: 'Store Manager & IA Vector',
      start: '2026-10-01',
      end: '2026-11-15',
      hypothesis: 'Anunciar drops de stock limitado con botón directo a WhatsApp dispara la urgencia de compra antes del sold-out.',
      roas: '7.2x',
      cpl: 340,
    },
    {
      id: 'camp-urban-2',
      name: 'Envío Express Mismo Día & Autenticidad',
      offer: 'Entregas seguras en CDMX en menos de 4 horas con certificado físico y digital.',
      objective: 'Conversión Inmediata & Confianza',
      audience: 'Compradores de calzado premium con alta urgencia de entrega',
      channel: 'Google Search & Meta CAPI',
      budget: 14000,
      spend: 6500,
      leadsCount: 21,
      piecesCount: 3,
      status: 'Activa',
      owner: 'Logística Urban & IA Vector',
      start: '2026-10-05',
      end: '2026-11-20',
      hypothesis: 'Garantizar autenticidad contra réplicas y entrega exprés en 4 horas elimina el 90% de objeciones de compra.',
      roas: '5.9x',
      cpl: 309,
    },
    {
      id: 'camp-urban-3',
      name: 'Colección Apparel & Drops de Temporada',
      offer: 'Hoodies oversized y streetwear con envío gratis nacional en pedidos >$2,500 MXN.',
      objective: 'Ticket Promedio & Cross-selling',
      audience: 'Fans de moda urbana, skateboarding y hip-hop culture',
      channel: 'Meta Reels & TikTok',
      budget: 10000,
      spend: 2800,
      leadsCount: 15,
      piecesCount: 5,
      status: 'En preparación',
      owner: 'Lobo Vectorial (Agencia)',
      start: '2026-10-25',
      end: '2026-11-30',
      hypothesis: 'Videos de unboxing y outfit inspiration aumentan la compra combinada de calzado más ropa en un 38%.',
      roas: '4.5x',
      cpl: 186,
    },
  ],
  corp: [
    {
      id: 'camp-corp-1',
      name: 'Automatización de WhatsApp con IA B2B',
      offer: 'Auditoría gratuita de contactabilidad y demo en vivo de agente IA para tu equipo de ventas.',
      objective: 'Discovery Calls & Cuentas Clave',
      audience: 'Directores de ventas, CEOs y CMOs de empresas medianas y agencias',
      channel: 'Meta Ads (Instagram & FB)',
      budget: 25000,
      spend: 13200,
      leadsCount: 18,
      piecesCount: 4,
      status: 'Activa',
      owner: 'Consultor B2B & IA Vector',
      start: '2026-10-01',
      end: '2026-11-15',
      hypothesis: 'Demostrar que las empresas pierden 70% de leads por tardar >15 min en responder detona la necesidad de agentes IA inmediatos.',
      roas: '8.4x',
      cpl: 733,
    },
    {
      id: 'camp-corp-2',
      name: 'Integración CRM & Meta CAPI for Messaging',
      offer: 'Conexión de servidor para atribución real de ventas en WhatsApp y optimización de pauta.',
      objective: 'Cuentas Enterprise & Agencias',
      audience: 'Empresas con gasto publicitario en Meta superior a $50,000 MXN mensuales',
      channel: 'Google Search & Meta CAPI',
      budget: 18000,
      spend: 8400,
      leadsCount: 11,
      piecesCount: 3,
      status: 'Activa',
      owner: 'Arquitecto de Soluciones',
      start: '2026-10-05',
      end: '2026-11-20',
      hypothesis: 'Atacar el dolor de la ceguera de atribución en Meta Ads tras los cambios de privacidad posiciona la suite técnica de Vector.',
      roas: '6.8x',
      cpl: 763,
    },
  ],
};

export const CampanasView = () => {
  const router = useRouter();
  const { activeTenant, isAdmin } = useAuth();
  const tenantId = activeTenant?.id || 'dental';

  // State initialized with vertical-aware campaigns from localStorage or tenant defaults
  const [campaigns, setCampaigns] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`vector_campaigns_${tenantId}`);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return TENANT_CAMPAIGNS[tenantId] || TENANT_CAMPAIGNS.dental;
  });

  // Re-sync when switching tenant
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`vector_campaigns_${tenantId}`);
      if (saved) {
        setCampaigns(JSON.parse(saved));
        return;
      }
    } catch (e) {}
    setCampaigns(TENANT_CAMPAIGNS[tenantId] || TENANT_CAMPAIGNS.dental);
  }, [tenantId]);

  // Save to localStorage whenever campaigns mutate
  const saveCampaigns = (newCampaigns) => {
    setCampaigns(newCampaigns);
    try {
      localStorage.setItem(`vector_campaigns_${tenantId}`, JSON.stringify(newCampaigns));
    } catch (e) {}
  };

  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccessToast, setAiSuccessToast] = useState(false);

  const [newCampaignForm, setNewCampaignForm] = useState({
    name: '',
    offer: '',
    objective: 'Citas & Conversaciones Calificadas',
    channel: 'Meta Ads (Instagram & FB)',
    budget: 15000,
    audience: '',
    hypothesis: '',
  });

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchChannel =
        channelFilter === 'all' ||
        (channelFilter === 'meta' && c.channel.toLowerCase().includes('meta')) ||
        (channelFilter === 'google' && c.channel.toLowerCase().includes('google')) ||
        (channelFilter === 'tiktok' && c.channel.toLowerCase().includes('tiktok'));

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && c.status === 'Activa') ||
        (statusFilter === 'paused' && c.status === 'Pausada') ||
        (statusFilter === 'prep' && c.status === 'En preparación');

      return matchChannel && matchStatus;
    });
  }, [campaigns, channelFilter, statusFilter]);

  const totalBudget = useMemo(() => campaigns.reduce((acc, c) => acc + (c.budget || 0), 0), [campaigns]);
  const totalSpend = useMemo(() => campaigns.reduce((acc, c) => acc + (c.spend || 0), 0), [campaigns]);
  const totalLeads = useMemo(() => campaigns.reduce((acc, c) => acc + (c.leadsCount || 0), 0), [campaigns]);
  const avgCpl = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0;
  const executionPct = totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0;

  // Toggle campaign status (Activa / Pausada)
  const handleToggleStatus = (id) => {
    const next = campaigns.map((c) => {
      if (c.id === id) {
        const nextStatus = c.status === 'Activa' ? 'Pausada' : 'Activa';
        return { ...c, status: nextStatus };
      }
      return c;
    });
    saveCampaigns(next);
  };

  // Delete campaign
  const handleDeleteCampaign = (id) => {
    if (confirm('¿Deseas eliminar esta campaña de la estrategia?')) {
      const next = campaigns.filter((c) => c.id !== id);
      saveCampaigns(next);
    }
  };

  // AI Copilot Generator
  const handleGenerateWithAi = () => {
    setIsGeneratingAi(true);

    setTimeout(() => {
      let aiCamp;
      if (tenantId === 'dental') {
        aiCamp = {
          id: `camp-ai-${Date.now()}`,
          name: 'Diseño de Sonrisa & Carillas Digitales',
          offer: 'Simulación digital de sonrisa en video 3D + 10% en paquete integral de estética.',
          objective: 'Citas de Alta Gama',
          audience: 'Hombres y mujeres 25-50 años interesados en estética facial y dental',
          channel: 'Meta Ads (Instagram & FB)',
          budget: 15000,
          spend: 0,
          leadsCount: 0,
          piecesCount: 3,
          status: 'Activa',
          owner: 'Copilot IA Vector',
          start: '2026-10-24',
          end: '2026-11-30',
          hypothesis: 'Mostrar un render digital del antes y después antes de mencionar el costo incrementa la tasa de agendamiento calificado al 24%.',
          roas: '4.8x',
          cpl: 520,
        };
      } else if (tenantId === 'polanco') {
        aiCamp = {
          id: `camp-ai-${Date.now()}`,
          name: 'Noches de Parrilla & Jazz en Vivo',
          offer: 'Cena maridaje con selección de vinos y música en vivo los miércoles.',
          objective: 'Llenado de Salón en Días Laborales',
          audience: 'Residentes de Polanco, Anzures y ejecutivos de Masaryk',
          channel: 'Meta Ads (Instagram & FB)',
          budget: 12000,
          spend: 0,
          leadsCount: 0,
          piecesCount: 3,
          status: 'Activa',
          owner: 'Copilot IA Vector',
          start: '2026-10-24',
          end: '2026-11-30',
          hypothesis: 'Atacar días de baja afluencia tradicional (miércoles) con oferta de jazz llena el salón y eleva el ticket promedio de consumo en bar.',
          roas: '5.2x',
          cpl: 280,
        };
      } else if (tenantId === 'urban') {
        aiCamp = {
          id: `camp-ai-${Date.now()}`,
          name: 'Restock Alert & Acceso Anticipado VIP',
          offer: 'Notificación 1 hora antes del lanzamiento público para apartar en WhatsApp.',
          objective: 'Ventas Flash & Fidelización',
          audience: 'Compradores recurrentes y seguidores de coleccionismo urbano',
          channel: 'Meta Ads (Instagram & FB)',
          budget: 16000,
          spend: 0,
          leadsCount: 0,
          piecesCount: 4,
          status: 'Activa',
          owner: 'Copilot IA Vector',
          start: '2026-10-24',
          end: '2026-11-30',
          hypothesis: 'Ofrecer acceso anticipado a través de chat de WhatsApp convierte con tasa superior al 30% en las primeras 2 horas del drop.',
          roas: '8.1x',
          cpl: 220,
        };
      } else {
        aiCamp = {
          id: `camp-ai-${Date.now()}`,
          name: 'Auditoría de Conversión en WhatsApp para CEOs',
          offer: 'Diagnóstico en 15 minutos de fugas de clientes en canales de mensajería.',
          objective: 'Reuniones B2B Calificadas',
          audience: 'Directores de operaciones y marketing en empresas de servicios',
          channel: 'Google Search & Meta CAPI',
          budget: 20000,
          spend: 0,
          leadsCount: 0,
          piecesCount: 3,
          status: 'Activa',
          owner: 'Copilot IA Vector',
          start: '2026-10-24',
          end: '2026-11-30',
          hypothesis: 'Plantear el costo oculto de responder tarde en WhatsApp abre la puerta a contratos enterprise de automatización IA.',
          roas: '7.5x',
          cpl: 690,
        };
      }

      saveCampaigns([aiCamp, ...campaigns]);
      setIsGeneratingAi(false);
      setAiSuccessToast(true);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4FF00', '#25D366', '#FFFFFF'],
        });
      } catch (e) {}

      setTimeout(() => setAiSuccessToast(false), 3500);
    }, 1400);
  };

  // Create manual campaign
  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!newCampaignForm.name.trim()) return;

    const newCamp = {
      id: `camp-${Date.now()}`,
      name: newCampaignForm.name,
      offer: newCampaignForm.offer || 'Oferta de servicio especializado',
      objective: newCampaignForm.objective,
      audience: newCampaignForm.audience || 'Público objetivo calificado en zona de influencia',
      channel: newCampaignForm.channel,
      budget: Number(newCampaignForm.budget) || 10000,
      spend: 0,
      leadsCount: 0,
      piecesCount: 2,
      status: 'Activa',
      owner: isAdmin ? 'Lobo Vectorial (Agencia)' : 'Equipo de Marca',
      start: '2026-10-24',
      end: '2026-11-30',
      hypothesis: newCampaignForm.hypothesis || 'Validar respuesta de mercado con seguimiento rápido en WhatsApp.',
      roas: 'Pendiente',
      cpl: 0,
    };

    saveCampaigns([newCamp, ...campaigns]);
    setIsNewModalOpen(false);
    setNewCampaignForm({
      name: '',
      offer: '',
      objective: 'Citas & Conversaciones Calificadas',
      channel: 'Meta Ads (Instagram & FB)',
      budget: 15000,
      audience: '',
      hypothesis: '',
    });

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#D4FF00', '#25D366', '#FFFFFF'],
      });
    } catch (err) {}
  };

  // Prefill AI helper in modal
  const handleAutofillAiForm = () => {
    if (tenantId === 'dental') {
      setNewCampaignForm({
        name: 'Limpieza Ultrasónica & Check-Up Preventivo',
        offer: 'Profilaxis ultrasónica profunda con flúor y escaneo digital a precio preferencial.',
        objective: 'Volumen de Pacientes Nuevos',
        channel: 'Meta Ads (Instagram & FB)',
        budget: 10000,
        audience: 'Familias y profesionistas en radio de 5km de la clínica',
        hypothesis: 'Una oferta de entrada económica atrae pacientes que luego requieren tratamientos de mayor valor (ortodoncia/resinas).',
      });
    } else if (tenantId === 'polanco') {
      setNewCampaignForm({
        name: 'Celebración de Cumpleaños & Aniversarios',
        offer: 'Postre de cortesía de autor y botella espumante para mesas de 6+ comensales.',
        objective: 'Reservas de Alto Ticket',
        channel: 'Meta Ads (Instagram & FB)',
        budget: 12000,
        audience: 'Usuarios que cumplen años este mes y sus amigos cercanos en CDMX',
        hypothesis: 'Segmentar anuncios por cumpleaños atrae grupos grandes con reservación anticipada y nula cancelación.',
      });
    } else if (tenantId === 'urban') {
      setNewCampaignForm({
        name: 'Sneaker Care & Mantenimiento Especializado',
        offer: 'Limpieza profunda gratis en tu calzado al comprar sneakers seleccionados.',
        objective: 'Cross-selling & Servicio Adicional',
        channel: 'TikTok & Meta Reels',
        budget: 8000,
        audience: 'Compradores de calzado de colección y amantes del cuidado de zapatillas',
        hypothesis: 'El servicio de limpieza y cuidado genera fidelidad de marca y compras recurrentes bimestrales.',
      });
    } else {
      setNewCampaignForm({
        name: 'Diagnóstico de Fricción Web & WhatsApp',
        offer: 'Análisis de embudo sin costo para reducir la tasa de abandono en páginas comerciales.',
        objective: 'Discovery Calls Corporativas',
        channel: 'Google Search & Meta CAPI',
        budget: 15000,
        audience: 'Gerentes de marketing y directores comerciales en México',
        hypothesis: 'Demostrar con métricas dónde pierden prospectos genera confianza inmediata para contratar la solución.',
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6 text-[var(--text-main)]">
      {/* Toast Notification */}
      {aiSuccessToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-300 font-mono text-xs flex items-center gap-3 shadow-2xl backdrop-blur-md animate-slide-in">
          <Sparkles className="w-5 h-5 text-neon animate-pulse" />
          <div>
            <span className="font-bold block text-white">¡Campaña Estratégica Generada con IA!</span>
            <span>Alineada al giro de {activeTenant?.name || 'tu negocio'}.</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-wider text-lime-700 dark:text-neon font-extrabold bg-neon/10 px-2 py-0.5 rounded border border-neon/30">
              OPERACIÓN / ESTRATEGIA COMERCIAL
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1.5">
              <span>Espacio:</span>
              <strong className="text-[var(--text-main)]">{activeTenant?.name || 'Vector Inside'}</strong>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/5 border border-white/10 text-neon font-bold">
                {activeTenant?.giro || 'Comercial'}
              </span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)] tracking-tight">
            Estrategia, Ofertas y Campañas
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            Ofertas comerciales activas conectadas a pauta publicitaria, agentes IA y captación en WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* AI Copilot Button */}
          <button
            type="button"
            onClick={handleGenerateWithAi}
            disabled={isGeneratingAi}
            className="text-xs bg-[var(--bg-card)] hover:bg-[var(--bg-base)] text-lime-700 dark:text-neon border border-neon/40 font-mono font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:border-neon active:scale-95 disabled:opacity-50"
          >
            {isGeneratingAi ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-neon" />
                <span>Generando con IA...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 text-neon" />
                <span>Copilot IA: Nueva Oferta</span>
              </>
            )}
          </button>

          {/* New Campaign Button */}
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="text-xs bg-neon text-black font-mono font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-neon-hover transition-all shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isAdmin ? 'Nueva Campaña' : 'Proponer Campaña'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Presupuesto Asignado */}
        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              Presupuesto Asignado
            </span>
            <DollarSign className="w-4 h-4 text-[var(--text-muted)]" />
          </div>
          <p className="text-2xl font-heading font-black text-[var(--text-main)]">
            ${formatNumber(totalBudget)} <small className="text-xs font-mono text-[var(--text-faint)]">MXN</small>
          </p>
          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
            <span>{campaigns.length} campañas activas</span>
            <span className="text-neon font-bold">{executionPct}% ejecutado</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                executionPct > 90 ? 'bg-amber-400' : 'bg-neon'
              }`}
              style={{ width: `${Math.min(executionPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Gasto Devengado */}
        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              Gasto Devengado Real
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-heading font-black text-emerald-400">
            ${formatNumber(totalSpend)} <small className="text-xs font-mono text-[var(--text-faint)]">MXN</small>
          </p>
          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
            <span>Inversión Meta / Google</span>
            <span className="text-emerald-400 font-bold">En ritmo</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(executionPct, 100)}%` }} />
          </div>
        </div>

        {/* Prospectos Generados */}
        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              Prospectos Generados
            </span>
            <Users className="w-4 h-4 text-neon" />
          </div>
          <p className="text-2xl font-heading font-black text-[var(--text-main)]">
            {totalLeads} <small className="text-xs font-mono text-neon font-bold">leads</small>
          </p>
          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
            <span>Costo Promedio (CPL):</span>
            <strong className="text-neon font-bold">${avgCpl} MXN</strong>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
            <div className="h-full bg-neon rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Piezas Creativas Vinculadas */}
        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              Piezas en Estudio
            </span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-heading font-black text-[var(--text-main)]">
            {campaigns.reduce((acc, c) => acc + (c.piecesCount || 0), 0)}{' '}
            <small className="text-xs font-mono text-[var(--text-faint)]">piezas</small>
          </p>
          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
            <span>Conectadas con Planner</span>
            <button
              onClick={() => router.push('/planner')}
              className="text-blue-400 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Ver Planner</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }} />
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono p-2 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
        {/* Channel Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 text-[var(--text-muted)] font-bold">
            <Filter className="w-3.5 h-3.5" />
            <span>Canal:</span>
          </div>
          <button
            onClick={() => setChannelFilter('all')}
            className={`px-3 py-1 rounded-xl transition-all ${
              channelFilter === 'all'
                ? 'bg-neon text-black font-bold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            Todos ({campaigns.length})
          </button>
          <button
            onClick={() => setChannelFilter('meta')}
            className={`px-3 py-1 rounded-xl transition-all ${
              channelFilter === 'meta'
                ? 'bg-neon text-black font-bold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            Meta Ads (IG/FB)
          </button>
          <button
            onClick={() => setChannelFilter('google')}
            className={`px-3 py-1 rounded-xl transition-all ${
              channelFilter === 'google'
                ? 'bg-neon text-black font-bold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            Google Search & CAPI
          </button>
          <button
            onClick={() => setChannelFilter('tiktok')}
            className={`px-3 py-1 rounded-xl transition-all ${
              channelFilter === 'tiktok'
                ? 'bg-neon text-black font-bold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            Reels & TikTok
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 px-2">
          <span className="text-[var(--text-muted)]">Estatus:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono outline-none focus:border-neon"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Solo Activas</option>
            <option value="paused">Solo Pausadas</option>
            <option value="prep">En preparación</option>
          </select>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCampaigns.map((camp) => {
          const spendPct = camp.budget > 0 ? Math.round((camp.spend / camp.budget) * 100) : 0;
          const currentCpl = camp.leadsCount > 0 ? Math.round(camp.spend / camp.leadsCount) : camp.cpl || 0;

          return (
            <div
              key={camp.id}
              className="p-5 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-neon/50 transition-all flex flex-col justify-between space-y-4 shadow-sm group relative overflow-hidden"
            >
              {/* Top ambient highlight */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 rounded-full blur-2xl pointer-events-none group-hover:bg-neon/10 transition-colors" />

              <div className="space-y-3 z-10">
                {/* Header: Status badge & Channel */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 border ${
                        camp.status === 'Activa'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : camp.status === 'Pausada'
                          ? 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          camp.status === 'Activa'
                            ? 'bg-emerald-400 animate-pulse'
                            : camp.status === 'Pausada'
                            ? 'bg-zinc-400'
                            : 'bg-amber-400'
                        }`}
                      />
                      <span>{camp.status}</span>
                    </span>

                    {/* Pause / Play button */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(camp.id)}
                      className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                      title={camp.status === 'Activa' ? 'Pausar campaña' : 'Activar campaña'}
                    >
                      {camp.status === 'Activa' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-faint)]">
                    {camp.channel}
                  </span>
                </div>

                {/* Title & Offer */}
                <div>
                  <h3 className="font-heading font-black text-lg text-[var(--text-main)] group-hover:text-neon transition-colors leading-tight">
                    {camp.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1.5 font-sans leading-relaxed line-clamp-2">
                    {camp.offer}
                  </p>
                </div>

                {/* Strategic Hypothesis */}
                <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-sans space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-lime-700 dark:text-neon flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Hipótesis Estratégica
                    </span>
                    {camp.roas && (
                      <span className="text-[9.5px] font-mono font-bold text-emerald-400">
                        ROAS: {camp.roas}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] italic leading-relaxed">
                    "{camp.hypothesis}"
                  </p>
                </div>

                {/* Budget Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10.5px] font-mono">
                    <span className="text-[var(--text-muted)]">Presupuesto Consumido</span>
                    <span className="text-[var(--text-main)] font-bold">{spendPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        spendPct > 90 ? 'bg-amber-400' : 'bg-gradient-to-r from-emerald-500 to-neon'
                      }`}
                      style={{ width: `${Math.min(spendPct, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)] pt-0.5">
                    <span>Gasto: ${formatNumber(camp.spend)} MXN</span>
                    <span>Meta: ${formatNumber(camp.budget)} MXN</span>
                  </div>
                </div>

                {/* Performance Metrics: CPL & Leads */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-[var(--text-faint)] block uppercase">Costo por Lead</span>
                    <span className="font-bold text-neon">${currentCpl} MXN</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[var(--text-faint)] block uppercase">Prospectos Captados</span>
                    <span className="font-bold text-emerald-400">{camp.leadsCount} leads</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2 z-10">
                <button
                  type="button"
                  onClick={() => router.push('/planner')}
                  className="text-xs text-[var(--text-muted)] hover:text-neon font-mono flex items-center gap-1.5 transition-colors p-1"
                  title="Abrir piezas en el Estudio de Contenido"
                >
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>{camp.piecesCount} piezas</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDeleteCampaign(camp.id)}
                    className="p-1.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Eliminar campaña"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push('/crm')}
                    className="px-3 py-1.5 rounded-xl bg-neon/15 hover:bg-neon text-lime-700 dark:text-neon hover:text-black font-mono font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Ver Leads ({camp.leadsCount})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[var(--bg-panel)] border border-dashed border-[var(--border-color)] space-y-3">
          <Megaphone className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
          <p className="text-sm font-bold text-[var(--text-main)]">No hay campañas que coincidan con los filtros</p>
          <p className="text-xs text-[var(--text-muted)]">Prueba cambiando el canal o haz clic en "Copilot IA: Nueva Oferta".</p>
        </div>
      )}

      {/* New Campaign Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none overflow-y-auto">
          <div className="w-full max-w-xl bg-[var(--bg-panel)] border border-neon/30 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 my-auto animate-scale-up text-[var(--text-main)]">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-[var(--text-main)] flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-neon" />
                  <span>{isAdmin ? 'Alta de Nueva Campaña Estratégica' : 'Proponer una Campaña'}</span>
                </h3>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  Giro activo: {activeTenant?.name} ({activeTenant?.giro || 'Salud / Comercial'})
                </span>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-xl bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white border border-[var(--border-color)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Autofill Prompt Box */}
            <div className="p-3.5 rounded-2xl bg-neon/10 border border-neon/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-neon shrink-0" />
                <span className="text-xs font-mono text-lime-700 dark:text-neon">
                  ¿Quieres sugerencias automáticas para {activeTenant?.giro || 'tu giro'}?
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutofillAiForm}
                className="py-1 px-3 rounded-xl bg-neon text-black font-mono font-bold text-xs hover:bg-neon-hover transition-all shrink-0 active:scale-95 shadow-sm"
              >
                ✨ Autocompletar con IA
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1 font-bold">
                  Nombre de la Campaña (Catchy & Comercial)
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    tenantId === 'dental'
                      ? 'Ej: Ortodoncia Invisible sin Brackets'
                      : tenantId === 'polanco'
                      ? 'Ej: Cena Romántica en Terraza VIP'
                      : 'Ej: Drop Exclusivo Sneakers Edición Limitada'
                  }
                  value={newCampaignForm.name}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1 font-bold">
                  Oferta Gancho (Propuesta de Valor Irresistible)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Diagnóstico digital 3D sin costo + hasta 12 MSI al iniciar tratamiento"
                  value={newCampaignForm.offer}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, offer: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1 font-bold">
                    Canal Publicitario
                  </label>
                  <select
                    value={newCampaignForm.channel}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, channel: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none font-mono text-xs"
                  >
                    <option value="Meta Ads (Instagram & FB)">Meta Ads (Instagram & FB)</option>
                    <option value="Google Search & Meta CAPI">Google Search & CAPI</option>
                    <option value="Meta Reels & TikTok">Meta Reels & TikTok</option>
                    <option value="WhatsApp Directo">WhatsApp Directo</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1 font-bold">
                    Presupuesto Mensual (MXN)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={newCampaignForm.budget}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, budget: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1 font-bold">
                  Público Objetivo & Geografía
                </label>
                <input
                  type="text"
                  placeholder="Ej: Adultos 25-50 años en Polanco, Lomas y Anzures"
                  value={newCampaignForm.audience}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, audience: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1 font-bold">
                  Hipótesis Estratégica (¿Por qué convertirá?)
                </label>
                <textarea
                  rows={2}
                  placeholder="¿Qué objeción resuelve esta oferta y por qué generará leads más calificados?"
                  value={newCampaignForm.hypothesis}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, hypothesis: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none resize-none text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-white font-mono text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neon text-black font-mono font-black uppercase text-xs hover:bg-neon-hover transition-all active:scale-95 shadow-md"
                >
                  Guardar & Activar Campaña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
