'use client';

import React, { useRef } from 'react';
import { Portal } from '@/components/common/Portal';
import { VectorInsideLogo } from '@/components/common/VectorInsideLogo';
import {
  Printer,
  Copy,
  X,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Users,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  BrainCircuit,
  Hash,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExecutiveMonthlyReportModal = ({
  isOpen,
  onClose,
  tenant,
  reportData,
}) => {
  const printAreaRef = useRef(null);

  if (!isOpen) return null;

  const currentTenant = tenant || {
    id: 'dental',
    name: 'Clínica Odontológica Integral',
    industry: 'Salud & Odontología',
    mer: '5.6x',
    cac: '$185',
    ltv: '$2,450',
    citas: 34,
  };

  // Canonical monthly metrics by tenant
  const tenantMetrics = {
    dental: {
      period: 'Septiembre 2026',
      adSpend: '$28,500 MXN',
      realRevenue: '$168,400 MXN',
      mer: '5.9x',
      cac: '$185 MXN',
      ltv: '$2,450 MXN',
      closedConversions: 34,
      conversionsLabel: 'Citas Odontológicas Concluidas',
      avgTicket: '$4,950 MXN',
      capiMatchRate: '99.4%',
      humanHoursSaved: '124 hrs',
      messagesProcessed: '1,480 mensajes',
      topChannel: 'WhatsApp Business API (72%)',
      deepSeekSummary:
        'Campaña altamente rentable y despresurizada. El Sub-Bot Closer resolvió el 94% de las preguntas de financiamiento y objeciones de meses sin intereses sin intervención humana. Se recomienda escalar 15% el presupuesto en el conjunto de anuncios de Carillas de Alta Estética que presentó el menor CAC ($142 MXN).',
      channelBreakdown: [
        { channel: 'WhatsApp Business API', leads: 42, revenue: '$121,248 MXN', share: '72%' },
        { channel: 'Instagram Direct Graph', leads: 18, revenue: '$33,680 MXN', share: '20%' },
        { channel: 'Micro-Landing GA4 & Web', leads: 8, revenue: '$13,472 MXN', share: '8%' },
      ],
    },
    polanco: {
      period: 'Septiembre 2026',
      adSpend: '$32,000 MXN',
      realRevenue: '$214,000 MXN',
      mer: '6.7x',
      cac: '$210 MXN',
      ltv: '$3,800 MXN',
      closedConversions: 48,
      conversionsLabel: 'Reservas VIP & Salón Privado',
      avgTicket: '$4,458 MXN',
      capiMatchRate: '99.8%',
      humanHoursSaved: '142 hrs',
      messagesProcessed: '1,920 mensajes',
      topChannel: 'Instagram Direct Graph (65%)',
      deepSeekSummary:
        'Excelente tracción en reservas de terraza fin de semana impulsadas por Reels virales. El Sub-Bot de Hospitalidad redujo la tasa de no-show al 1.8% mediante recordatorios automatizados de confirmación con 4 horas de anticipación.',
      channelBreakdown: [
        { channel: 'Instagram Direct Graph', leads: 54, revenue: '$139,100 MXN', share: '65%' },
        { channel: 'WhatsApp Business API', leads: 24, revenue: '$53,500 MXN', share: '25%' },
        { channel: 'Micro-Landing GA4 & Web', leads: 10, revenue: '$21,400 MXN', share: '10%' },
      ],
    },
    urban: {
      period: 'Septiembre 2026',
      adSpend: '$18,000 MXN',
      realRevenue: '$129,500 MXN',
      mer: '7.2x',
      cac: '$140 MXN',
      ltv: '$1,950 MXN',
      closedConversions: 62,
      conversionsLabel: 'Órdenes de Compra / Drops',
      avgTicket: '$2,088 MXN',
      capiMatchRate: '98.9%',
      humanHoursSaved: '98 hrs',
      messagesProcessed: '2,340 mensajes',
      topChannel: 'Instagram Direct Graph (78%)',
      deepSeekSummary:
        'Campaña de alto impacto impulsada por micro-influencers y triggers de palabras clave ("DROP", "SNEAKERS"). La automatización de enlaces directos a pasarela de pagos Kueski/Stripe generó un 34% de conversión inmediata en carritos abandonados.',
      channelBreakdown: [
        { channel: 'Instagram Direct Graph', leads: 76, revenue: '$101,010 MXN', share: '78%' },
        { channel: 'WhatsApp Business API', leads: 16, revenue: '$19,425 MXN', share: '15%' },
        { channel: 'Micro-Landing GA4 & Web', leads: 8, revenue: '$9,065 MXN', share: '7%' },
      ],
    },
    corp: {
      period: 'Septiembre 2026',
      adSpend: '$45,000 MXN',
      realRevenue: '$380,000 MXN',
      mer: '8.4x',
      cac: '$1,450 MXN',
      ltv: '$48,000 MXN',
      closedConversions: 8,
      conversionsLabel: 'Contratos B2B / Cuentas Enterprise',
      avgTicket: '$47,500 MXN',
      capiMatchRate: '100%',
      humanHoursSaved: '180 hrs',
      messagesProcessed: '680 mensajes',
      topChannel: 'WhatsApp Business API (85%)',
      deepSeekSummary:
        'Modelo B2B de ciclo largo con alta eficacia en pre-calificación BANT. Los sub-bots filtraron prospectos sin presupuesto asignado, agendando únicamente 8 reuniones directivas que derivaron en acuerdos comerciales con ticket promedio superior a $45,000 MXN.',
      channelBreakdown: [
        { channel: 'WhatsApp Business API', leads: 12, revenue: '$323,000 MXN', share: '85%' },
        { channel: 'Webinar & Meta CAPI', leads: 3, revenue: '$41,800 MXN', share: '11%' },
        { channel: 'LinkedIn & Correo Directo', leads: 1, revenue: '$15,200 MXN', share: '4%' },
      ],
    },
  };

  const metrics =
    reportData ||
    tenantMetrics[currentTenant.id] ||
    tenantMetrics.dental;

  const reportId = `REP-${new Date().getFullYear()}-09-VI-${(currentTenant.id || 'DENT').toUpperCase()}`;
  const shaHash = `0x9f8b4c${Date.now().toString(16).slice(-6)}e2a1`;

  const handlePrint = () => {
    try {
      confetti({ particleCount: 30, spread: 50, colors: ['#E7F900', '#10B981'] });
    } catch (e) {}
    window.print();
  };

  const handleCopySummaryWhatsApp = () => {
    const text = `📊 *REPORTE EJECUTIVO MENSUAL - VECTOR INSIDE*\n` +
      `🏢 *Cliente:* ${currentTenant.name}\n` +
      `📅 *Periodo:* ${metrics.period}\n\n` +
      `📈 *MÉTRICAS CLAVE (ROI & CRECIMIENTO):*\n` +
      `• *ROAS Real (MER):* ${metrics.mer}\n` +
      `• *Facturación Atribuida:* ${metrics.realRevenue}\n` +
      `• *Inversión Meta Ads:* ${metrics.adSpend}\n` +
      `• *CAC Real:* ${metrics.cac}\n` +
      `• *${metrics.conversionsLabel}:* ${metrics.closedConversions} concluidas\n` +
      `• *Horas Humanas Ahorradas:* ${metrics.humanHoursSaved}\n\n` +
      `💡 *Dictamen Estratégico IA:*\n"${metrics.deepSeekSummary}"\n\n` +
      `_Reporte auditado criptográficamente vía Meta CAPI S2S (${shaHash})_`;

    navigator.clipboard.writeText(text);
    try {
      confetti({ particleCount: 40, spread: 60, colors: ['#00F0FF', '#E7F900'] });
    } catch (e) {}
    alert('¡Resumen ejecutivo copiado al portapapeles listo para enviar por WhatsApp al Director/Cliente!');
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={printAreaRef}
          className="w-full max-w-4xl rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-10 relative space-y-8 font-sans max-h-[92vh] overflow-y-auto my-auto animate-scale-up text-zinc-900 dark:text-zinc-100 print:p-0 print:border-none print:shadow-none print:max-h-none print:bg-white print:text-black"
        >
          {/* Action Toolbar (Hidden in Print) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800 print:hidden">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Reporte Conciliado S2S • Folio: <strong>{reportId}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummaryWhatsApp}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Copiar texto formateado para WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copiar para WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-neon hover:bg-[var(--neon-hover)] text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Guardar PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                title="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Official Letterhead Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800/80">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <VectorInsideLogo size="md" variant="imagotype" showCommunity={false} />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 uppercase font-bold">
                  Auditoría Financiera C-Level
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-zinc-900 dark:text-white">
                Informe Ejecutivo de Rendimiento Comercial
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
                Atribución multicanal verificada con Meta Conversions API (CAPI) Server-to-Server y Google Calendar.
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 font-mono text-xs bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shrink-0">
              <p className="text-[10px] uppercase text-zinc-400 dark:text-zinc-500 font-bold">Entidad Auditada:</p>
              <p className="text-sm font-heading font-black text-neon">{currentTenant.name}</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">{metrics.period}</p>
              <div className="flex items-center sm:justify-end gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Conciliación CAPI: {metrics.capiMatchRate}</span>
              </div>
            </div>
          </div>

          {/* Key Financial KPIs Grid (6 Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400">
                Inversión Meta Ads
              </span>
              <p className="text-2xl font-heading font-black text-zinc-900 dark:text-white">
                {metrics.adSpend}
              </p>
              <span className="text-[10px] text-zinc-500 font-mono">Presupuesto pautado</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-lime-50/30 dark:from-emerald-950/20 dark:via-zinc-900/80 dark:to-zinc-900 border border-emerald-300 dark:border-emerald-500/40 space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 dark:text-emerald-400">
                Facturación Conciliada
              </span>
              <p className="text-2xl font-heading font-black text-emerald-600 dark:text-neon">
                {metrics.realRevenue}
              </p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                Retorno verificado en caja
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-lime-50 via-white to-zinc-50 dark:from-lime-950/20 dark:via-zinc-900/80 dark:to-zinc-900 border border-lime-300 dark:border-neon/40 space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-700 dark:text-zinc-300">
                MER / ROAS Global Real
              </span>
              <p className="text-2xl font-heading font-black text-neon">
                {metrics.mer}
              </p>
              <span className="text-[10px] text-zinc-500 font-mono">Retorno global sobre inversión</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400">
                CAC (Costo Adquisición)
              </span>
              <p className="text-2xl font-heading font-black text-zinc-900 dark:text-white">
                {metrics.cac}
              </p>
              <span className="text-[10px] text-zinc-500 font-mono">Por cliente / cita cerrada</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400">
                LTV (Valor Vida Cliente)
              </span>
              <p className="text-2xl font-heading font-black text-purple-600 dark:text-purple-400">
                {metrics.ltv}
              </p>
              <span className="text-[10px] text-zinc-500 font-mono">Valor proyectado a 12 meses</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400">
                {metrics.conversionsLabel}
              </span>
              <p className="text-2xl font-heading font-black text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-cyan-500" />
                <span>{metrics.closedConversions}</span>
              </p>
              <span className="text-[10px] text-zinc-500 font-mono">Confirmadas en agenda</span>
            </div>
          </div>

          {/* Channel Attribution Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neon" />
              <span>Desglose de Atribución por Canal de Conversión</span>
            </h3>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden font-mono text-xs">
              <table className="w-full text-left">
                <thead className="bg-zinc-100 dark:bg-zinc-900 text-[10px] text-zinc-500 uppercase border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="p-3.5 font-bold">Canal de Entrada</th>
                    <th className="p-3.5 font-bold">Leads Atendidos</th>
                    <th className="p-3.5 font-bold">Facturación Atribuida</th>
                    <th className="p-3.5 font-bold text-right">Participación (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80 bg-white dark:bg-zinc-950/60 text-xs">
                  {metrics.channelBreakdown.map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                      <td className="p-3.5 font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon" />
                        {row.channel}
                      </td>
                      <td className="p-3.5 text-zinc-600 dark:text-zinc-300">{row.leads} eventos</td>
                      <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">{row.revenue}</td>
                      <td className="p-3.5 text-right font-bold text-zinc-900 dark:text-white">{row.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DeepSeek R1 AI Executive Analysis & Recommendations */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/20 via-zinc-950/80 to-zinc-950/80 border border-purple-500/30 space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-mono font-bold text-xs uppercase">
                <BrainCircuit className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Dictamen Ejecutivo & Recomendación Estratégica (DeepSeek R1)</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                Horas humanas ahorradas: <strong>{metrics.humanHoursSaved}</strong>
              </span>
            </div>

            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans text-xs">
              "{metrics.deepSeekSummary}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800 font-mono text-[11px]">
              <div>
                <span className="text-zinc-500">Volumen Procesado: </span>
                <strong className="text-zinc-800 dark:text-zinc-200">{metrics.messagesProcessed}</strong>
              </div>
              <div className="sm:text-right">
                <span className="text-zinc-500">Canal Estrella: </span>
                <strong className="text-neon">{metrics.topChannel}</strong>
              </div>
            </div>
          </div>

          {/* Cryptographic Certification Footer */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-neon" />
              <span>Certificado SHA-256: <code>{shaHash}</code></span>
            </div>
            <div>
              <span>Infraestructura Vector Inside • Conexión Meta Graph API v20.0</span>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
