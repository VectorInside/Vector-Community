'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { formatNumber } from '@/utils/formatters';
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
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { campaignService } from '@/services/campaignService';
import { aiService } from '@/services/aiService';

export const CampanasView = () => {
  const router = useRouter();
  const { activeTenant, isAdmin } = useAuth();
  const tenantId = activeTenant?.id || null;

  // Campañas cargadas con persistencia resiliente multi-tenant
  const [campaigns, setCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isAutofillingAi, setIsAutofillingAi] = useState(false);
  const [aiSuccessToast, setAiSuccessToast] = useState(false);
  const [aiErrorToast, setAiErrorToast] = useState('');

  const showError = (message) => {
    setAiErrorToast(message);
    setTimeout(() => setAiErrorToast(''), 4500);
  };

  useEffect(() => {
    const activeId = activeTenant?.id;
    if (!activeId) {
      setCampaigns([]);
      return;
    }
    campaignService
      .getCampaigns(activeId)
      .then((data) => {
        setCampaigns(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setCampaigns([]);
        showError(
          err?.response?.data?.message ||
            err?.message ||
            'No se pudieron cargar las campañas desde el servidor.'
        );
      });
  }, [activeTenant?.id]);

  const tenantMonthlyBudget =
    Number(activeTenant?.monthlyAdBudget) > 0 ? Number(activeTenant.monthlyAdBudget) : 15000;

  // Benchmark de CPL estimado según el giro
  const benchmarkCpl = useMemo(() => {
    const g = (activeTenant?.giro || activeTenant?.verticalLabel || '').toLowerCase();
    if (g.includes('dental') || g.includes('salud') || g.includes('médic')) return 110;
    if (g.includes('fitness') || g.includes('gym')) return 65;
    if (g.includes('restaurante') || g.includes('alimento')) return 45;
    if (g.includes('software') || g.includes('saas') || g.includes('b2b')) return 220;
    return 120;
  }, [activeTenant]);

  const [newCampaignForm, setNewCampaignForm] = useState({
    name: '',
    offer: '',
    objective: 'Citas & Conversaciones Calificadas',
    channel: 'Meta Ads (Instagram & FB)',
    budget: tenantMonthlyBudget,
    audience: '',
    hypothesis: '',
  });

  // Campañas filtradas con búsqueda reactiva
  const filteredCampaigns = useMemo(() => {
    return (campaigns || []).filter((c) => {
      const matchChannel =
        channelFilter === 'all' ||
        (channelFilter === 'meta' && c.channel?.toLowerCase().includes('meta')) ||
        (channelFilter === 'google' && c.channel?.toLowerCase().includes('google')) ||
        (channelFilter === 'tiktok' && c.channel?.toLowerCase().includes('tiktok'));

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && c.status === 'Activa') ||
        (statusFilter === 'paused' && c.status === 'Pausada') ||
        (statusFilter === 'prep' && c.status === 'En preparación');

      const matchSearch =
        !searchQuery.trim() ||
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.offer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.hypothesis?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchChannel && matchStatus && matchSearch;
    });
  }, [campaigns, channelFilter, statusFilter, searchQuery]);

  const hasActiveFilters =
    channelFilter !== 'all' || statusFilter !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setChannelFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  const totalBudget = useMemo(
    () => campaigns.reduce((acc, c) => acc + (c.budget || 0), 0),
    [campaigns]
  );
  const totalSpend = useMemo(
    () => campaigns.reduce((acc, c) => acc + (c.spend || 0), 0),
    [campaigns]
  );
  const totalLeads = useMemo(
    () => campaigns.reduce((acc, c) => acc + (c.leadsCount || 0), 0),
    [campaigns]
  );
  const avgCpl = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0;
  const executionPct = totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0;

  // Toggle campaign status (Activa / Pausada) en PostgreSQL
  const handleToggleStatus = async (id) => {
    const target = campaigns.find((c) => c.id === id);
    if (!target) return;
    const nextStatus = target.status === 'Activa' ? 'Pausada' : 'Activa';
    try {
      const updated = await campaignService.toggleCampaignStatus(id, nextStatus, tenantId);
      const resolvedStatus = updated?.status || nextStatus;
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: resolvedStatus } : c))
      );
    } catch (err) {
      showError(
        err?.response?.data?.message ||
          err?.message ||
          'No se pudo actualizar el estado de la campaña.'
      );
    }
  };

  // Delete campaign en PostgreSQL
  const handleDeleteCampaign = async (id) => {
    if (!confirm('¿Deseas eliminar esta campaña de la estrategia?')) return;
    try {
      await campaignService.deleteCampaign(id, tenantId);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      showError(
        err?.response?.data?.message ||
          err?.message ||
          'No se pudo eliminar la campaña en el servidor.'
      );
    }
  };

  // Navegar al Estudio de Contenido (Planner) transfiriendo la Oferta e Hipótesis de la Campaña
  const handleSendCampaignToPlanner = (camp) => {
    if (!camp) return;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        'vector_campaign_bridge',
        JSON.stringify({
          campaignId: camp.id,
          campaignName: camp.name,
          offer: camp.offer,
          hypothesis: camp.hypothesis,
          channel: camp.channel,
          audience: camp.audience,
        })
      );
    }
    router.push(`/planner?fromCampaign=${encodeURIComponent(camp.id)}`);
  };

  const parseAiCampaignPayload = (aiRes) => {
    let parsed = null;
    if (aiRes?.generatedRawJson) {
      parsed =
        typeof aiRes.generatedRawJson === 'string'
          ? JSON.parse(aiRes.generatedRawJson)
          : aiRes.generatedRawJson;
    } else if (aiRes?.content) {
      parsed =
        typeof aiRes.content === 'string' ? JSON.parse(aiRes.content) : aiRes.content;
    } else if (aiRes && typeof aiRes === 'object') {
      parsed = aiRes;
    }

    if (parsed?.copy && typeof parsed.copy === 'string' && parsed.copy.trim().startsWith('{')) {
      try {
        parsed = JSON.parse(parsed.copy);
      } catch (e) {}
    }

    const name = parsed?.name || parsed?.title;
    const offer = parsed?.offer || parsed?.hookText;
    const objective = parsed?.objective;
    const audience = parsed?.audience;
    const hypothesis = parsed?.hypothesis || parsed?.copy;

    if (!name && !offer && !hypothesis) {
      throw new Error('La respuesta de DeepSeek R1 no contiene una estrategia de campaña válida.');
    }

    return { name, offer, objective, audience, hypothesis };
  };

  const buildAiCampaignPrompt = () => {
    const tenantGiro = activeTenant?.giro || activeTenant?.verticalLabel || 'Servicios';
    const dnaSummary = activeTenant?.brandDna
      ? `Tono: ${activeTenant.brandDna.tone || 'Profesional'}, Arquetipo: ${activeTenant.brandDna.archetype || 'Autoridad'}, Dolor ICP: ${activeTenant.brandDna.painPoints || 'Calidad y confianza'}`
      : `Tono: ${activeTenant?.brandTone || 'Profesional y persuasivo'}`;

    return `Diseña una campaña estratégica de pauta digital en Meta Ads para el negocio "${activeTenant?.name || 'Mi Negocio'}" (Giro: ${tenantGiro}, Servicio principal: ${activeTenant?.coreService || 'Servicios profesionales'}, Presupuesto mensual: $${tenantMonthlyBudget}, Brand DNA: ${dnaSummary}).
Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:
{
  "name": "Nombre estratégico de la campaña",
  "offer": "Oferta comercial irresistible enfocada en conversión por WhatsApp",
  "objective": "Objetivo principal (ej. Citas & Conversaciones Calificadas)",
  "audience": "Segmentación detallada del público objetivo ideal",
  "hypothesis": "Hipótesis medible de conversión y reducción de CPL"
}`;
  };

  // Generador de Campaña Inteligente con IA (DeepSeek R1)
  const handleGenerateWithAi = async () => {
    if (!tenantId) {
      showError('Selecciona un negocio activo antes de generar una campaña con IA.');
      return;
    }
    setIsGeneratingAi(true);
    setAiErrorToast('');

    try {
      const tenantGiro = activeTenant?.giro || activeTenant?.verticalLabel || 'Servicios';
      const aiRes = await aiService.generateContent({
        tenantId: activeTenant?.id,
        topicPrompt: buildAiCampaignPrompt(),
        postType: 'Campaign Strategy',
        targetNetwork: 'META',
      });

      const { name, offer, objective, audience, hypothesis } = parseAiCampaignPayload(aiRes);

      const todayIso = new Date().toISOString().split('T')[0];
      const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
      const aiCamp = {
        tenantId,
        name: name || `Campaña Estratégica — ${activeTenant?.name || 'Mi Negocio'}`,
        offer: offer || `Oferta comercial para ${activeTenant?.name || 'tu negocio'}.`,
        objective: objective || 'Citas & Conversaciones Calificadas',
        audience: audience || `Público objetivo en ${tenantGiro}`,
        channel: 'Meta Ads (Instagram & FB)',
        budget: tenantMonthlyBudget,
        spend: 0,
        leadsCount: 0,
        piecesCount: 3,
        status: 'Activa',
        owner: 'DeepSeek R1 Vector',
        start: todayIso,
        end: nextMonth,
        hypothesis: hypothesis || 'Conversión directa a WhatsApp con calificación automatizada.',
        roas: '0.0x',
        cpl: 0,
      };

      const created = await campaignService.createCampaign(aiCamp, tenantId);
      setCampaigns((prev) => [created, ...prev]);
      setAiSuccessToast(true);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4FF00', '#25D366', '#06B6D4'],
        });
      } catch (e) {}

      setTimeout(() => setAiSuccessToast(false), 3500);
    } catch (err) {
      console.error('Error generando campaña con DeepSeek R1:', err);
      showError(
        err?.response?.data?.message ||
          err?.message ||
          'No se pudo conectar con DeepSeek R1 para generar la campaña. Verifica tu API Key de IA en Conexiones.'
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Alta de Campaña Manual en PostgreSQL
  const handleCreateCampaign = async (e, andSendToPlanner = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newCampaignForm.name.trim()) return;
    if (!tenantId) {
      showError('Selecciona un negocio activo antes de crear una campaña.');
      return;
    }

    const todayIso = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const newCamp = {
      tenantId,
      name: newCampaignForm.name,
      offer: newCampaignForm.offer || 'Oferta de servicio especializado',
      objective: newCampaignForm.objective,
      audience: newCampaignForm.audience || 'Público objetivo calificado en zona de influencia',
      channel: newCampaignForm.channel,
      budget: Number(newCampaignForm.budget) || tenantMonthlyBudget,
      spend: 0,
      leadsCount: 0,
      piecesCount: 0,
      linkedPosts: [],
      status: 'Activa',
      owner: isAdmin ? 'Lobo Vectorial (Agencia)' : 'Equipo de Marca',
      start: todayIso,
      end: nextMonth,
      hypothesis:
        newCampaignForm.hypothesis || 'Validar respuesta de mercado con seguimiento rápido en WhatsApp.',
      roas: 'Pendiente',
      cpl: 0,
    };

    try {
      const created = await campaignService.createCampaign(newCamp, tenantId);
      setCampaigns((prev) => [created, ...prev]);
      setIsNewModalOpen(false);
      setNewCampaignForm({
        name: '',
        offer: '',
        objective: 'Citas & Conversaciones Calificadas',
        channel: 'Meta Ads (Instagram & FB)',
        budget: tenantMonthlyBudget,
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

      if (andSendToPlanner) {
        handleSendCampaignToPlanner(created);
      }
    } catch (err) {
      showError(
        err?.response?.data?.message ||
          err?.message ||
          'No se pudo guardar la campaña en el servidor.'
      );
    }
  };

  const handleAutofillAiForm = async () => {
    if (!tenantId) {
      showError('Selecciona un negocio activo antes de autocompletar con IA.');
      return;
    }
    setIsAutofillingAi(true);
    setAiErrorToast('');

    try {
      const aiRes = await aiService.generateContent({
        tenantId: activeTenant?.id,
        topicPrompt: buildAiCampaignPrompt(),
        postType: 'Campaign Strategy',
        targetNetwork: 'META',
      });

      const { name, offer, objective, audience, hypothesis } = parseAiCampaignPayload(aiRes);

      setNewCampaignForm((prev) => ({
        ...prev,
        name: name || prev.name,
        offer: offer || prev.offer,
        objective: objective || prev.objective,
        channel: 'Meta Ads (Instagram & FB)',
        budget: tenantMonthlyBudget,
        audience: audience || prev.audience,
        hypothesis: hypothesis || prev.hypothesis,
      }));
    } catch (err) {
      console.error('Error autocompletando campaña con IA:', err);
      showError(
        err?.response?.data?.message ||
          err?.message ||
          'No se pudo obtener sugerencias de IA. Verifica tu conexión con DeepSeek R1.'
      );
    } finally {
      setIsAutofillingAi(false);
    }
  };

  return (
    <div className="w-full p-3 sm:p-5 lg:p-6 block animate-fade-in space-y-6 font-sans pb-28 min-w-0">
      {/* Toast de Éxito de IA */}
      {aiSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-zinc-900 border border-neon/50 text-white shadow-2xl flex items-center gap-3 animate-slide-up">
          <span className="p-2 rounded-xl bg-neon/20 text-neon">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-bold text-xs text-neon">Campaña Generada con Éxito</h4>
            <p className="text-[11px] text-zinc-300">
              La hipótesis comercial y los parámetros de pauta han sido persistidos.
            </p>
          </div>
        </div>
      )}

      {/* Toast de Error de IA */}
      {aiErrorToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-zinc-900 border border-red-500/50 text-white shadow-2xl flex items-center gap-3 animate-slide-up max-w-md">
          <span className="p-2 rounded-xl bg-red-500/20 text-red-400">
            <X className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-bold text-xs text-red-400">Error de DeepSeek R1</h4>
            <p className="text-[11px] text-zinc-300">{aiErrorToast}</p>
          </div>
        </div>
      )}

      {/* Header Unificado */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-[var(--border-color)] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase text-neon tracking-wider bg-neon/10 px-2 py-0.5 rounded border border-neon/30">
              OPERACIÓN / ESTRATEGIA COMERCIAL
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1.5">
              <span>Espacio:</span>
              <strong className="text-[var(--text-main)]">
                {activeTenant?.name || 'Sin negocio seleccionado'}
              </strong>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neon font-bold">
                {activeTenant?.giro || activeTenant?.verticalLabel || 'General'}
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

      {/* KPI Cards Overview con Inteligencia de Estado Cero */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Presupuesto Asignado */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              Presupuesto Asignado
            </span>
            <DollarSign className="w-4 h-4 text-[var(--text-muted)]" />
          </div>
          <p className="text-2xl font-heading font-black text-[var(--text-main)]">
            ${formatNumber(campaigns.length > 0 ? totalBudget : tenantMonthlyBudget)}{' '}
            <small className="text-xs font-mono text-[var(--text-faint)]">MXN</small>
          </p>
          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
            <span>{campaigns.length} campañas activas</span>
            <span className="text-neon font-bold">
              {campaigns.length > 0 ? `${executionPct}% ejecutado` : 'Meta Sugerida'}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                executionPct > 90 ? 'bg-amber-400' : 'bg-neon'
              }`}
              style={{ width: `${campaigns.length > 0 ? Math.min(executionPct, 100) : 100}%` }}
            />
          </div>
        </div>

        {/* Gasto Devengado */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2.5 shadow-sm">
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
            <span className="text-emerald-400 font-bold">
              {campaigns.length > 0 ? 'En ritmo' : 'Sin pauta activa'}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min(executionPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Prospectos Generados & CPL Proyectado */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2.5 shadow-sm">
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
            <span>{campaigns.length > 0 ? 'Costo Promedio (CPL):' : 'CPL Estimado en Giro:'}</span>
            <strong className="text-neon font-bold">
              ${campaigns.length > 0 ? avgCpl : benchmarkCpl} MXN
            </strong>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
            <div
              className="h-full bg-neon rounded-full"
              style={{ width: totalLeads > 0 ? '85%' : '0%' }}
            />
          </div>
        </div>

        {/* Piezas Creativas Vinculadas */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2.5 shadow-sm">
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
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: campaigns.length > 0 ? '90%' : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONTENIDO DINÁMICO: LAUNCHPAD ASISTIDO vs GRID CON FILTROS (SIN DOBLE RENDER)
          ========================================================================= */}
      {campaigns.length === 0 ? (
        /* CASO A: ESTADO CERO TOTAL -> LAUNCHPAD ASISTIDO CON 3 RUTAS */
        <div className="rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] p-5 sm:p-6 lg:p-8 space-y-6 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-lime-700 dark:text-neon text-xs font-mono font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LAUNCHPAD ESTRATÉGICO • {activeTenant?.name || 'ESPACIO ACTIVO'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-[var(--text-main)] tracking-tight">
              Activa la Adquisición Predecible de Clientes
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
              Este negocio aún no tiene campañas registradas. Selecciona una de las 3 rutas para lanzar tu estrategia omnicanal con inteligencia artificial:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* RUTA 1: LANZAR CAMPAÑA PUBLICITARIA MULTICANAL */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                    Meta Ads, Google & Conversiones
                  </span>
                  <h3 className="font-heading font-black text-base text-[var(--text-main)] group-hover:text-emerald-400 transition-colors">
                    Crear Campaña Publicitaria
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Configura pauta en Instagram, Facebook o Google con captación multicanal, medición CAPI y derivación automática a citas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewCampaignForm((prev) => ({
                    ...prev,
                    channel: 'Meta Ads (Instagram & FB)',
                    name: `Campaña Multicanal — ${activeTenant?.name || 'Activa'}`,
                  }));
                  setIsNewModalOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 text-black font-mono font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>Crear Campaña</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* RUTA 2: COPILOT IA DE OFERTA GANCHO */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-neon/40 hover:border-neon transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon/10 rounded-full blur-xl pointer-events-none" />
              <div className="space-y-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-neon/20 border border-neon/40 flex items-center justify-center text-neon">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-lime-700 dark:text-neon font-bold block">
                    Asistencia DeepSeek R1
                  </span>
                  <h3 className="font-heading font-black text-base text-[var(--text-main)] group-hover:text-neon transition-colors">
                    Diseñar Oferta Gancho con IA
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  La IA analiza el giro de {activeTenant?.name} y formula una hipótesis publicitaria con oferta irresistible en 1 clic.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateWithAi}
                disabled={isGeneratingAi}
                className="w-full py-2.5 px-3 rounded-xl bg-neon text-black font-mono font-black text-xs hover:bg-neon-hover transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{isGeneratingAi ? 'Diseñando Estrategia...' : 'Generar Oferta con IA'}</span>
              </button>
            </div>

            {/* RUTA 3: CONECTAR CANALES O IMPORTAR */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                    Sincronización Multicanal
                  </span>
                  <h3 className="font-heading font-black text-base text-[var(--text-main)] group-hover:text-blue-400 transition-colors">
                    Conectar Cuentas Publicitarias
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  ¿Ya tienes anuncios activos en Meta Ads Manager o Google? Vincula las cuentas para habilitar medición CAPI y atribución.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/connections?tab=channels')}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-blue-400 text-blue-400 font-mono font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Conectar Cuentas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* CASO B: HAY CAMPAÑAS -> BARRA DE CONTROL ERGONÓMICA Y GRID */
        <div className="space-y-6">
          {/* Barra de Filtros y Búsqueda */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs font-mono p-3 sm:p-3.5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-sm">
            {/* Pills de Canales */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[var(--text-muted)] font-bold px-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Canal:
              </span>
              <button
                type="button"
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
                type="button"
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
                type="button"
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
                type="button"
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

            {/* Búsqueda y Selector de Estatus */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar campaña..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-faint)] text-xs font-sans outline-none focus:border-neon w-40 sm:w-52"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-mono outline-none focus:border-neon"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Solo Activas</option>
                <option value="paused">Solo Pausadas</option>
                <option value="prep">En preparación</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="p-1.5 rounded-xl bg-[var(--bg-card)] text-zinc-400 hover:text-white border border-[var(--border-color)] transition-colors"
                  title="Restablecer filtros"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Grid de Campañas o Empty State de Mismatch Único */}
          {filteredCampaigns.length === 0 ? (
            /* EMPTY STATE ÚNICO PARA MISMATCH DE FILTROS */
            <div className="p-10 text-center rounded-3xl bg-[var(--bg-panel)] border border-dashed border-[var(--border-color)] space-y-3">
              <Filter className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
              <h4 className="text-base font-bold text-[var(--text-main)]">
                No hay campañas que coincidan con los filtros
              </h4>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Prueba cambiando el canal, el estatus o borrando el término de búsqueda.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-neon/15 hover:bg-neon text-lime-700 dark:text-neon hover:text-black font-mono font-bold text-xs transition-all inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restablecer Filtros</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredCampaigns.map((camp) => {
                const spendPct =
                  camp.budget > 0 ? Math.round((camp.spend / camp.budget) * 100) : 0;
                const currentCpl =
                  camp.leadsCount > 0 ? Math.round(camp.spend / camp.leadsCount) : camp.cpl || 0;

                return (
                  <div
                    key={camp.id}
                    className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-neon/50 transition-all flex flex-col justify-between space-y-4 shadow-sm group relative overflow-hidden"
                  >
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

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(camp.id)}
                            className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                            title={camp.status === 'Activa' ? 'Pausar campaña' : 'Activar campaña'}
                          >
                            {camp.status === 'Activa' ? (
                              <Pause className="w-3 h-3" />
                            ) : (
                              <Play className="w-3 h-3" />
                            )}
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
                              spendPct > 90
                                ? 'bg-amber-400'
                                : 'bg-gradient-to-r from-emerald-500 to-neon'
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
                          <span className="text-[9px] text-[var(--text-faint)] block uppercase">
                            Costo por Lead
                          </span>
                          <span className="font-bold text-neon">${currentCpl} MXN</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[var(--text-faint)] block uppercase">
                            Prospectos Captados
                          </span>
                          <span className="font-bold text-emerald-400">
                            {camp.leadsCount} leads
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Creativos Vinculados Reales de la Parrilla */}
                    {Array.isArray(camp.linkedPosts) && camp.linkedPosts.length > 0 && (
                      <div className="p-2.5 rounded-2xl bg-[var(--bg-card)] border border-neon/20 space-y-1.5 text-xs z-10">
                        <span className="text-[10px] font-mono text-lime-700 dark:text-neon font-bold flex items-center gap-1 uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-neon" />
                          Creativos Vinculados ({camp.linkedPosts.length})
                        </span>
                        <div className="space-y-1">
                          {camp.linkedPosts.slice(0, 2).map((lp) => (
                            <div key={lp.id} className="text-[11px] text-[var(--text-muted)] truncate flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-neon shrink-0" />
                              <span className="truncate">{lp.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2 z-10 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleSendCampaignToPlanner(camp)}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                        title="Abrir el Estudio de Contenido con la oferta y canal de esta campaña pre-cargados"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>⚡ Generar Anuncios ({camp.piecesCount || (camp.linkedPosts?.length || 0)})</span>
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
          )}
        </div>
      )}

      {/* Modal de Nueva Campaña */}
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
                  Giro activo: {activeTenant?.name} ({activeTenant?.giro || activeTenant?.verticalLabel || 'Comercial'})
                </span>
              </div>
              <button
                type="button"
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
                disabled={isAutofillingAi}
                className="py-1 px-3 rounded-xl bg-neon text-black font-mono font-bold text-xs hover:bg-neon-hover transition-all shrink-0 active:scale-95 shadow-sm disabled:opacity-60 flex items-center gap-1.5"
              >
                {isAutofillingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generando con IA...
                  </>
                ) : (
                  '✨ Autocompletar con IA'
                )}
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
                  placeholder="Ej: Diagnóstico Inicial & Cualificación 24/7"
                  value={newCampaignForm.name}
                  onChange={(e) =>
                    setNewCampaignForm({ ...newCampaignForm, name: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1 font-bold">
                  Oferta Principal / Gancho Promocional
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="¿Cuál es la propuesta de valor o gancho que se ofrecerá al prospecto?"
                  value={newCampaignForm.offer}
                  onChange={(e) =>
                    setNewCampaignForm({ ...newCampaignForm, offer: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none resize-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] uppercase block mb-1 font-bold">
                    Canal Publicitario
                  </label>
                  <select
                    value={newCampaignForm.channel}
                    onChange={(e) =>
                      setNewCampaignForm({ ...newCampaignForm, channel: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs font-mono"
                  >
                    <option value="Meta Ads (Instagram & FB)">Meta Ads (Instagram & FB)</option>
                    <option value="Google Search & CAPI">Google Search & CAPI</option>
                    <option value="Reels & TikTok">Reels & TikTok</option>
                    <option value="WhatsApp Direct (CAPI)">WhatsApp Direct (CAPI)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[var(--text-muted)] uppercase block mb-1 font-bold">
                    Presupuesto Mensual (MXN)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={newCampaignForm.budget}
                    onChange={(e) =>
                      setNewCampaignForm({ ...newCampaignForm, budget: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1 font-bold">
                  Público Objetivo & Geosegmentación
                </label>
                <input
                  type="text"
                  placeholder="Ej: Profesionistas 28-50 años en CDMX interesados en salud / negocios"
                  value={newCampaignForm.audience}
                  onChange={(e) =>
                    setNewCampaignForm({ ...newCampaignForm, audience: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewCampaignForm({ ...newCampaignForm, hypothesis: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none resize-none text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[var(--border-color)] flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-white font-mono text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-neon/40 hover:border-neon text-lime-700 dark:text-neon font-mono font-bold text-xs transition-all active:scale-95"
                >
                  Guardar & Activar
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCreateCampaign(e, true)}
                  className="px-5 py-2 rounded-xl bg-neon text-black font-mono font-black uppercase text-xs hover:bg-neon-hover transition-all active:scale-95 shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Guardar & Crear Anuncios ⚡</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
