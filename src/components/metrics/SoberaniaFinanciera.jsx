'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  CalendarCheck,
  Users,
  Flame,
  Thermometer,
  FileText,
  BrainCircuit,
  AlertTriangle,
  PenTool,
  CheckCircle2,
  Sparkles,
  Facebook,
  Instagram,
  MessageCircle,
  Smartphone,
  Globe,
  ExternalLink,
  ArrowUpRight,
  Send,
  Radar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { leadService } from '@/services/leadService';
import { MicroLandingPreviewModal } from '@/components/common/MicroLandingPreviewModal';
import { ExecutiveMonthlyReportModal } from './ExecutiveMonthlyReportModal';

// Canonical radar leads by tenant (Zero-State default)
const RADAR_LEADS_BY_TENANT = {};
const CREATIVE_FATIGUE_BY_TENANT = {};

export const SoberaniaFinanciera = () => {
  const router = useRouter();
  const { activeTenant, triggerModal } = useAuth();
  const [showLandingModal, setShowLandingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const tenantKey = activeTenant?.id;
  const [leads, setLeads] = useState([]);
  const creative = (tenantKey && CREATIVE_FATIGUE_BY_TENANT[tenantKey]) || {
    scriptHook: '¿Sabías que automatizar la atención a tus clientes puede reducir tus tiempos de espera un 80%?',
    scriptDemo: 'Con Vector Inside, la IA atiende y califica prospectos 24/7 sin fricción.',
    scriptOffer: 'Conoce cómo funciona agendando una demostración personalizada.',
    scriptCta: 'Escríbenos directamente por WhatsApp.',
  };

  useEffect(() => {
    if (!activeTenant?.id) {
      setLeads([]);
      return;
    }
    leadService
      .getLeadsByTenant(activeTenant.id)
      .then((backendLeads) => {
        if (Array.isArray(backendLeads)) {
          const mapped = backendLeads.map((bl) => ({
            id: bl.id,
            name: bl.name,
            phone: bl.phone || '',
            channel: bl.channel || 'Inbound Directo',
            channelIcon: (bl.channel || '').toLowerCase().includes('insta')
              ? 'instagram'
              : (bl.channel || '').toLowerCase().includes('face')
              ? 'facebook'
              : 'whatsapp',
            temperature: bl.leadState === 'BILLABLE_LEAD' ? 'CALIENTE' : 'TIBIO',
            status: bl.status || (bl.leadState === 'BILLABLE_LEAD' ? 'Calificado' : 'En Seguimiento'),
            potentialTicket: typeof bl.estimatedValue === 'number'
              ? `$${bl.estimatedValue.toLocaleString()} MXN`
              : (bl.potentialTicket || '$0 MXN'),
            dictamen: bl.dictamen || bl.notes || '<b>Prospecto capturado en embudo omnicanal.</b>',
          }));
          setLeads(mapped);
        } else {
          setLeads([]);
        }
      })
      .catch(() => setLeads([]));
  }, [activeTenant?.id]);

  const handleShowDictamen = (lead) => {
    triggerModal(
      `Dictamen Pre-Cita: ${lead.name}`,
      `${lead.dictamen}<br><br><b>Ticket Estimado:</b> ${lead.potentialTicket}<br><b>Canal:</b> ${lead.channel}`,
      () => {
        try {
          confetti({ particleCount: 25, spread: 45, colors: ['#E7F900', '#FFFFFF'] });
        } catch (e) {}
      },
      'Aceptar'
    );
  };

  const handleGenerateScript = () => {
    triggerModal(
      `Generación de Guion Viral (DeepSeek R1) — ${activeTenant?.name || 'Sin negocio seleccionado'}`,
      `<b>Guion Viral (30 Segundos - Reels / TikTok):</b><br><br>
      <b>[0-3s Gancho]:</b> "${creative.scriptHook}"<br><br>
      <b>[4-15s Demostración]:</b> "${creative.scriptDemo}"<br><br>
      <b>[16-25s Oferta]:</b> "${creative.scriptOffer}"<br><br>
      <b>[26-30s CTA]:</b> "${creative.scriptCta}"`,
      () => {
        const fullScript = `[0-3s Gancho]: ${creative.scriptHook}\n[4-15s Demostración]: ${creative.scriptDemo}\n[16-25s Oferta]: ${creative.scriptOffer}\n[26-30s CTA]: ${creative.scriptCta}`;
        navigator.clipboard.writeText(fullScript);
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            colors: ['#A855F7', '#E7F900', '#FFFFFF'],
          });
        } catch (e) {}
      },
      'Copiar Guion Completo'
    );
  };

  return (
    <div className="p-8 block animate-fade-in font-sans">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black tracking-tight text-[var(--text-main)]">
            Resultados <span className="text-neon">& Rendimiento Comercial</span>
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[var(--text-muted)] mt-1">
            Atribución multicanal, retorno de inversión (ROAS) y costo por lead conciliado para:{' '}
            <strong className="text-[var(--text-main)] font-semibold">{activeTenant?.name || 'Sin negocio seleccionado'}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="bg-neon text-black text-xs font-sans font-bold px-4 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-sm flex items-center gap-2 active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Generar Reporte Ejecutivo Mensual</span>
          </button>
          <span className="text-[11px] font-sans font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-xl flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Meta CAPI Sincronizado
          </span>
        </div>
      </header>

      {/* Digital Presence & Micro-Landing Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-neon/10 text-neon border border-neon/20">
            {!activeTenant ? (
              <Smartphone className="w-5 h-5 text-zinc-400" />
            ) : activeTenant.hasWebsite ? (
              <Globe className="w-5 h-5" />
            ) : (
              <Smartphone className="w-5 h-5" />
            )}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-main)] font-bold text-sm">
                {!activeTenant
                  ? 'Sin Negocio Seleccionado'
                  : activeTenant.hasWebsite
                  ? 'Presencia: Sitio Web Oficial Sincronizado'
                  : 'Presencia: Ecosistema Puro en WhatsApp (SIN Web)'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                !activeTenant
                  ? 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
                  : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
              }`}>
                {!activeTenant
                  ? 'Inactivo'
                  : activeTenant.hasWebsite
                  ? 'Medición Web GA4 (Sin costo)'
                  : 'Micro-Landing Activa'}
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-xs mt-0.5 font-sans">
              Micro-Landing Oficial:{' '}
              {activeTenant?.id ? (
                <a
                  href={`/m/${activeTenant.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon underline hover:text-[var(--neon-hover)]"
                >
                  app.vectorinside.com/m/{activeTenant.id}
                </a>
              ) : (
                <span className="text-[var(--text-muted)] italic">
                  Selecciona un negocio para generar su micro-landing
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLandingModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] font-bold text-xs border border-[var(--border-color)] hover:border-neon flex items-center gap-1.5 transition-all"
          >
            <Smartphone className="w-3.5 h-3.5 text-neon" />
            <span>Previsualización Móvil</span>
          </button>
          <button
            type="button"
            onClick={() => router.push('/contactability')}
            className="px-3.5 py-2 rounded-xl bg-neon text-black font-bold text-xs shadow-neon-sm hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ver Contactabilidad & CAPI</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 font-sans">
        <div className="vector-bg-panel vector-border p-5 rounded-xl shadow-sm">
          <p className="text-[11px] font-sans font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            MER (ROAS Global)
          </p>
          <p className="text-2xl font-black text-[var(--text-main)] font-sans tabular-nums">
            {!activeTenant ? '0.0x' : (activeTenant.mer || '0.0x')}
          </p>
        </div>

        <div className="vector-bg-panel vector-border p-5 rounded-xl shadow-sm">
          <p className="text-[11px] font-sans font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            CAC (Costo Adquisición)
          </p>
          <p className="text-2xl font-black text-[var(--text-main)] font-sans tabular-nums">
            {!activeTenant ? '$0' : (activeTenant.cac ? `$${activeTenant.cac}` : '$0')}{' '}
            <span className="text-xs font-normal text-[var(--text-muted)]">MXN</span>
          </p>
        </div>

        <div className="vector-bg-panel vector-border p-5 rounded-xl shadow-sm">
          <p className="text-[11px] font-sans font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            LTV (Valor Vida Cliente)
          </p>
          <p className="text-2xl font-black text-neon font-sans tabular-nums">
            {!activeTenant ? '$0' : (activeTenant.ltv ? `$${activeTenant.ltv}` : '$0')}{' '}
            <span className="text-xs font-normal text-[var(--text-muted)]">MXN</span>
          </p>
        </div>

        <div className="vector-bg-panel border border-[var(--success)] bg-[var(--success-bg)] p-5 rounded-xl shadow-sm">
          <p className="text-[11px] font-sans text-[var(--success)] font-bold uppercase tracking-wider mb-2">
            Conversiones / Citas IA
          </p>
          <p className="text-2xl font-black text-[var(--text-main)] font-sans tabular-nums flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[var(--success)]" />
            <span>
              {!activeTenant
                ? 0
                : (activeTenant.citas ?? leads.filter((l) => l.temperature === 'CALIENTE' || l.status === 'Calificado').length ?? 0)}
            </span>
          </p>
        </div>
      </div>

      {/* Main Grid: Radar de Prospectos + Reporte DeepSeek */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Radar de Leads */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="vector-bg-card vector-border rounded-2xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-panel)] flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-[var(--text-main)]">
                  <Users className="w-4 h-4 text-neon" />
                  <span>Radar de Prospectos (Leads) — {activeTenant?.name || 'Sin negocio seleccionado'}</span>
                </h3>
                <p className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
                  Calificación de intención y origen Meta CAPI en tiempo real.
                </p>
              </div>
              <span className="text-[10px] font-mono bg-neon text-black px-2.5 py-1 rounded-full font-bold">
                Últimas 24h
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans">
                <thead className="bg-[var(--bg-base)] text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)]">
                  <tr>
                    <th className="p-4 font-normal">Nombre / Contacto</th>
                    <th className="p-4 font-normal">Origen (Atribución)</th>
                    <th className="p-4 font-normal">Temperatura (Scoring)</th>
                    <th className="p-4 font-normal">Estado IA</th>
                    <th className="p-4 font-normal text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">
                        <Radar className="w-8 h-8 opacity-30 mx-auto mb-2" />
                        {!activeTenant ? 'Selecciona un negocio para ver su radar de prospectos.' : 'Sin prospectos activos en el radar financiero de este negocio.'}
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => {
                    const isHot = lead.temperature === 'CALIENTE';

                    return (
                      <tr key={lead.id} className="hover:bg-[var(--bg-panel)] transition-colors">
                        <td className="p-4 font-bold text-[var(--text-main)] text-xs">
                          {lead.name}
                          <br />
                          <span className="text-[10px] font-mono text-[var(--text-muted)] font-normal">
                            {lead.phone}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1.5 text-[10px] text-blue-400 font-mono">
                            {lead.channelIcon === 'facebook' && <Facebook className="w-3.5 h-3.5 text-blue-500" />}
                            {lead.channelIcon === 'instagram' && <Instagram className="w-3.5 h-3.5 text-pink-500" />}
                            {lead.channelIcon === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />}
                            <span>{lead.channel}</span>
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${
                              isHot
                                ? 'bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)] shadow-[0_0_8px_var(--success-bg)]'
                                : 'bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]'
                            }`}
                          >
                            {isHot ? <Flame className="w-3 h-3" /> : <Thermometer className="w-3 h-3" />}
                            <span>{lead.temperature}</span>
                          </span>
                        </td>
                        <td className="p-4 text-[10px] text-[var(--text-muted)] font-mono">
                          {lead.status}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleShowDictamen(lead)}
                              className="text-[10px] bg-[var(--bg-base)] border border-[var(--border-color)] px-2.5 py-1.5 rounded-lg hover:border-neon text-[var(--text-main)] transition-colors flex items-center gap-1"
                              title="Ver dictamen de calificación BANT"
                            >
                              <FileText className="w-3 h-3 text-neon" />
                              <span>Dictamen</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => router.push(`/inbox?threadId=${lead.id}`)}
                              className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                              title="Abrir conversación en Inbox"
                            >
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Reporte Creativo IA (DeepSeek Analista) */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-b from-purple-950/20 via-zinc-950/70 to-zinc-950 border border-purple-500/30 dark:border-[#a855f7]/50 p-6 rounded-2xl relative shadow-[0_0_20px_rgba(168,85,247,0.12)] h-full flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-500/30">
                  <BrainCircuit className="w-5 h-5 text-purple-600 dark:text-[#c084fc]" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-purple-900 dark:text-[#e9d5ff]">
                    Reporte Creativo IA
                  </h4>
                  <p className="text-[9px] font-mono text-purple-700 dark:text-[#a855f7]">
                    DeepSeek R1 Analista • {activeTenant?.name || 'Sin negocio seleccionado'}
                  </p>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-black/40 border border-purple-500/20 dark:border-[#a855f7]/30 p-4 rounded-xl text-sm mb-4 space-y-3">
                {!activeTenant ? (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] tracking-wider flex items-center gap-1 mb-1 font-mono">
                      <BrainCircuit className="w-3 h-3 text-purple-400" /> Monitoreo en Pausa
                    </span>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Selecciona un negocio para auditar la fatiga de anuncios publicitarios y disparar guiones de optimización comercial.
                    </p>
                  </div>
                ) : creative?.fatiguedAdName ? (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[var(--danger)] tracking-wider flex items-center gap-1 mb-1 font-mono">
                      <AlertTriangle className="w-3 h-3" /> Fatiga Detectada
                    </span>
                    <p className="text-xs text-purple-950 dark:text-[#d8b4fe] leading-relaxed">
                      El anuncio <strong className="text-[var(--text-main)]">"{creative.fatiguedAdName}"</strong> superó la frecuencia de {creative.frequency}. Costos de adquisición en aumento.
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1 mb-1 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Rendimiento Creativo Saludable
                    </span>
                    <p className="text-xs text-purple-950 dark:text-[#d8b4fe] leading-relaxed">
                      Todos los anuncios operan en frecuencias saludables de entrega. No se observan anomalías de fatiga en este período.
                    </p>
                  </div>
                )}

                <div className="border-t border-purple-500/20 dark:border-[#a855f7]/30 pt-3">
                  <p className="text-[10px] font-mono text-purple-900 dark:text-[#e9d5ff] font-bold mb-1.5 uppercase">
                    Sugerencia Estratégica (Diversidad):
                  </p>
                  <p className="text-xs text-purple-950 dark:text-[#d8b4fe] leading-relaxed">
                    {!activeTenant
                      ? 'Sin recomendaciones estratégicas activas sin un contexto de negocio.'
                      : (creative?.suggestion || 'Mantener la rotación regular de copies y creativos visuales para sostener la tasa de conversión.')}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateScript}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] active:scale-95"
            >
              <PenTool className="w-4 h-4 text-neon" />
              <span>Generar Guion Viral (30s)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Interactivo de Micro-Landing Preview */}
      {showLandingModal && (
        <MicroLandingPreviewModal
          isOpen={showLandingModal}
          onClose={() => setShowLandingModal(false)}
          tenant={activeTenant}
        />
      )}

      {/* Modal Reporte Ejecutivo Mensual Formal con Logo Vector Inside */}
      {showReportModal && (
        <ExecutiveMonthlyReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          tenant={activeTenant}
        />
      )}
    </div>
  );
};
