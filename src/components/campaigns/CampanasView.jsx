'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
} from 'lucide-react';

const INITIAL_CAMPAIGNS = [
  {
    id: 'camp-social',
    name: 'Después de publicar, ¿qué sigue?',
    offer: 'Contenido y seguimiento conectados con ventas.',
    objective: 'Conversaciones calificadas & Citas',
    audience: 'Marcas con presencia que necesitan cerrar ventas',
    channel: 'Meta Ads (Instagram & FB)',
    budget: 16000,
    spend: 7200,
    leadsCount: 11,
    piecesCount: 5,
    status: 'Activa',
    owner: 'Alexandra (Agencia)',
    start: '2026-10-01',
    end: '2026-10-31',
    hypothesis: 'Mostrar el proceso de seguimiento antes del precio atrae prospectos con mayor ticket promedio.',
  },
  {
    id: 'camp-web',
    name: 'Tu web, tu siguiente cliente',
    offer: 'Micro-Landings de alta conversión y CAPI para agendar en 1 clic.',
    objective: 'Captación de leads & Micro-Agendamiento',
    audience: 'Clínicas y empresas de servicios profesionales',
    channel: 'Google Search & Meta CAPI',
    budget: 12000,
    spend: 5200,
    leadsCount: 7,
    piecesCount: 3,
    status: 'Activa',
    owner: 'Karloz (Agencia)',
    start: '2026-10-01',
    end: '2026-10-31',
    hypothesis: 'Reducir los pasos de fricción hacia WhatsApp incrementa la tasa de contacto al >70%.',
  },
  {
    id: 'camp-brand',
    name: 'Una marca que se entiende',
    offer: 'Posicionamiento, ADN de marca y autoridad digital.',
    objective: 'Demanda orgánica & Autoridad',
    audience: 'Empresas con oferta dispersa o poca retención',
    channel: 'Meta Reels & TikTok',
    budget: 8000,
    spend: 0,
    leadsCount: 0,
    piecesCount: 2,
    status: 'En preparación',
    owner: 'Lobo Vectorial (Agencia)',
    start: '2026-10-25',
    end: '2026-11-25',
    hypothesis: 'Explicar el propósito de marca filtra a los prospectos fuera de mercado y atrae a los calificados.',
  },
];

export const CampanasView = () => {
  const router = useRouter();
  const { activeTenant, isAdmin } = useAuth();

  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [channelFilter, setChannelFilter] = useState('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newCampaignForm, setNewCampaignForm] = useState({
    name: '',
    offer: '',
    objective: 'Conversaciones calificadas',
    channel: 'Meta Ads',
    budget: 10000,
    audience: '',
    hypothesis: '',
  });

  const filteredCampaigns = campaigns.filter((c) => {
    if (channelFilter === 'meta') return c.channel.toLowerCase().includes('meta');
    if (channelFilter === 'google') return c.channel.toLowerCase().includes('google');
    return true;
  });

  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leadsCount, 0);

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!newCampaignForm.name.trim()) return;

    const newCamp = {
      id: `camp-${Date.now()}`,
      name: newCampaignForm.name,
      offer: newCampaignForm.offer || 'Oferta de servicio especializado',
      objective: newCampaignForm.objective,
      audience: newCampaignForm.audience || 'Público objetivo calificado',
      channel: newCampaignForm.channel,
      budget: Number(newCampaignForm.budget) || 5000,
      spend: 0,
      leadsCount: 0,
      piecesCount: 1,
      status: 'En preparación',
      owner: isAdmin ? 'Lobo Vectorial (Agencia)' : 'Usuario de Marca',
      start: '2026-10-22',
      end: '2026-11-22',
      hypothesis: newCampaignForm.hypothesis || 'Hipótesis de conversión con contenido pertinente.',
    };

    setCampaigns((prev) => [newCamp, ...prev]);
    setIsNewModalOpen(false);
    setNewCampaignForm({
      name: '',
      offer: '',
      objective: 'Conversaciones calificadas',
      channel: 'Meta Ads',
      budget: 10000,
      audience: '',
      hypothesis: '',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-lime-400 font-extrabold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
              OPERACIÓN / ESTRATEGIA COMERCIAL
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Espacio: {activeTenant?.name || 'Vector Inside'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Estrategia, Ofertas y Campañas
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            ¿Qué queremos conseguir, para quién y con qué oferta de valor?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="text-xs bg-lime-400 text-black font-mono font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-lime-300 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isAdmin ? 'Nueva Campaña' : 'Proponer Campaña'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
            Presupuesto Asignado
          </span>
          <p className="text-2xl font-heading font-black text-[var(--text-main)]">
            ${totalBudget.toLocaleString()} <small className="text-xs font-mono text-[var(--text-faint)]">MXN</small>
          </p>
          <span className="text-[10px] text-[var(--text-muted)] block">
            {campaigns.length} campañas configuradas
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
            Gasto Devengado
          </span>
          <p className="text-2xl font-heading font-black text-lime-400">
            ${totalSpend.toLocaleString()} <small className="text-xs font-mono text-[var(--text-faint)]">MXN</small>
          </p>
          <span className="text-[10px] text-[var(--text-muted)] block">
            {Math.round((totalSpend / totalBudget) * 100)}% del presupuesto ejecutado
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
            Prospectos Generados
          </span>
          <p className="text-2xl font-heading font-black text-[var(--text-main)]">
            {totalLeads} <small className="text-xs font-mono text-[var(--text-faint)]">leads</small>
          </p>
          <span className="text-[10px] text-[var(--text-muted)] block">
            Costo promedio: ${Math.round(totalSpend / (totalLeads || 1))} MXN
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
            Piezas Creativas
          </span>
          <p className="text-2xl font-heading font-black text-[var(--text-main)]">
            {campaigns.reduce((acc, c) => acc + c.piecesCount, 0)} <small className="text-xs font-mono text-[var(--text-faint)]">piezas</small>
          </p>
          <span className="text-[10px] text-[var(--text-muted)] block">
            Vinculadas al Estudio de Contenido
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-[var(--text-muted)]">Filtrar por canal:</span>
          <button
            onClick={() => setChannelFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              channelFilter === 'all'
                ? 'bg-lime-400 text-black font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setChannelFilter('meta')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              channelFilter === 'meta'
                ? 'bg-lime-400 text-black font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            Meta Ads
          </button>
          <button
            onClick={() => setChannelFilter('google')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              channelFilter === 'google'
                ? 'bg-lime-400 text-black font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            Google Ads
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCampaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-lime-400/50 transition-all flex flex-col justify-between space-y-4 shadow-sm group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  camp.status === 'Activa'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  {camp.status}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-faint)]">
                  {camp.channel}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-black text-lg text-[var(--text-main)] group-hover:text-lime-400 transition-colors">
                  {camp.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 font-sans line-clamp-2">
                  {camp.offer}
                </p>
              </div>

              {/* Hipótesis Estratégica */}
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-sans space-y-1">
                <span className="text-[10px] font-mono font-bold text-lime-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Hipótesis de Campaña
                </span>
                <p className="text-[11px] text-[var(--text-muted)] italic">
                  "{camp.hypothesis}"
                </p>
              </div>

              {/* Numbers */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div>
                  <span className="text-[9px] text-[var(--text-faint)] block uppercase">Presupuesto</span>
                  <span className="font-bold text-[var(--text-main)]">${camp.budget.toLocaleString()} MXN</span>
                </div>
                <div>
                  <span className="text-[9px] text-[var(--text-faint)] block uppercase">Gasto Real</span>
                  <span className="font-bold text-lime-400">${camp.spend.toLocaleString()} MXN</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => router.push('/planner')}
                className="text-xs text-[var(--text-muted)] hover:text-lime-400 font-mono flex items-center gap-1 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{camp.piecesCount} piezas</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/crm')}
                className="px-3 py-1.5 rounded-xl bg-lime-400/15 hover:bg-lime-400 text-lime-400 hover:text-black font-mono font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <span>Ver Leads ({camp.leadsCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Campaign Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
          <div className="w-full max-w-lg bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="font-heading font-black text-lg text-[var(--text-main)]">
                {isAdmin ? 'Alta de Nueva Campaña' : 'Proponer una Campaña'}
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1">
                  Nombre de la Campaña
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Odontología Sin Dolor Octubre"
                  value={newCampaignForm.name}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-lime-400 outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1">
                  Oferta Principal
                </label>
                <input
                  type="text"
                  placeholder="Ej: Diagnóstico digital 3D sin costo al iniciar tratamiento"
                  value={newCampaignForm.offer}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, offer: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-lime-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1">
                    Canal Primario
                  </label>
                  <select
                    value={newCampaignForm.channel}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, channel: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-lime-400 outline-none font-mono text-xs"
                  >
                    <option value="Meta Ads (Instagram & FB)">Meta Ads (IG & FB)</option>
                    <option value="Google Ads (Búsqueda)">Google Ads</option>
                    <option value="WhatsApp Directo">WhatsApp Directo</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1">
                    Presupuesto Mensual (MXN)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={newCampaignForm.budget}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, budget: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-lime-400 outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1">
                  Hipótesis Estratégica
                </label>
                <textarea
                  rows={2}
                  placeholder="¿Por qué esta oferta convertirá mejor que las anteriores?"
                  value={newCampaignForm.hypothesis}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, hypothesis: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-lime-400 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-lime-400 text-black font-mono font-black uppercase text-xs hover:bg-lime-300"
                >
                  Guardar Campaña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
