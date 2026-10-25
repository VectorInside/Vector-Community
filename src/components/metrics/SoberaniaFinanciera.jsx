'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MicroLandingPreviewModal } from '@/components/common/MicroLandingPreviewModal';
import { ExecutiveMonthlyReportModal } from './ExecutiveMonthlyReportModal';

// Canonical radar leads by tenant to maintain strict multi-tenant isolation (ADR-001)
const RADAR_LEADS_BY_TENANT = {
  dental: [
    {
      id: 'lead-001',
      name: 'Ana Martínez',
      phone: '+52 55 1234 5678',
      channel: 'Meta Ads (Campaña Implantes)',
      channelIcon: 'facebook',
      temperature: 'CALIENTE',
      status: 'Cita Agendada Jue 14:00',
      potentialTicket: '$28,000 MXN',
      dictamen:
        '<b>Interés:</b> Implantes Dentales Guiados.<br><b>Objeción superada:</b> Pagos a 12 meses sin intereses.<br><b>Estatus:</b> Cita confirmada en Google Calendar para el próximo jueves a las 14:00 hrs.',
    },
    {
      id: 'lead-002',
      name: 'Roberto Sánchez',
      phone: 'DM Instagram @roberto_s',
      channel: 'Perfil Orgánico (Reels)',
      channelIcon: 'instagram',
      temperature: 'TIBIO',
      status: 'Dudas de precio. En Follow-up 24h',
      potentialTicket: '$4,200 MXN',
      dictamen:
        '<b>Interés:</b> Cotización general profilaxis.<br><b>Fricción:</b> Comparando con clínica cercana.<br><b>Acción sugerida:</b> Enviar caso de éxito y video de escáner 3D.',
    },
    {
      id: 'lead-005',
      name: 'Valeria Cordero',
      phone: '+52 55 9821 4433',
      channel: 'WhatsApp Business API',
      channelIcon: 'whatsapp',
      temperature: 'TIBIO',
      status: 'Viendo opciones carillas de resina',
      potentialTicket: '$12,500 MXN',
      dictamen:
        '<b>Interés:</b> Diseño de sonrisa.<br><b>Fricción:</b> No ha profundizado en facilidades de pago.<br><b>Acción sugerida:</b> Mensaje Vaca Púrpura encolado a 24h en Upstash Redis.',
    },
  ],
  polanco: [
    {
      id: 'lead-pol-01',
      name: 'Alejandro Bastida',
      phone: '+52 55 3341 8920',
      channel: 'Instagram Direct Graph',
      channelIcon: 'instagram',
      temperature: 'CALIENTE',
      status: 'Reserva Terraza VIP 4 pax Sáb 21:00',
      potentialTicket: '$5,200 MXN',
      dictamen:
        '<b>Interés:</b> Cena de Aniversario.<br><b>Mesa:</b> Terraza Principal vista panorámica.<br><b>Estatus:</b> Depósito de garantía cubierto vía Stripe.',
    },
    {
      id: 'lead-pol-02',
      name: 'Eduardo Garza',
      phone: '+52 55 3322 1100',
      channel: 'WhatsApp Business API',
      channelIcon: 'whatsapp',
      temperature: 'TIBIO',
      status: 'Consultando horario con la familia',
      potentialTicket: '$3,800 MXN',
      dictamen:
        '<b>Interés:</b> Comida familiar domingo.<br><b>Fricción:</b> Requiere sillas para niños.<br><b>Acción sugerida:</b> Disparo de cortesía de Sommelier.',
    },
    {
      id: 'lead-pol-03',
      name: 'Lic. Mauricio Cárdenas',
      phone: '+52 55 1122 3344',
      channel: 'Meta Ads (Campaña Ejecutiva B2B)',
      channelIcon: 'facebook',
      temperature: 'CALIENTE',
      status: 'Salón Privado Cava 12 Empresarios',
      potentialTicket: '$24,000 MXN',
      dictamen:
        '<b>Interés:</b> Cena corporativa fin de trimestre.<br><b>Requerimiento:</b> Factura fiscal deducible.<br><b>Estatus:</b> Menú cerrado con maridaje reservado.',
    },
  ],
  urban: [
    {
      id: 'lead-urb-01',
      name: 'Kevin Roldán',
      phone: '+52 55 4567 8901',
      channel: 'Instagram Reel Drop Cyberpunk',
      channelIcon: 'instagram',
      temperature: 'CALIENTE',
      status: 'Carrito Activo: Sneakers Talla 27.5 MX',
      potentialTicket: '$4,890 MXN',
      dictamen:
        '<b>Interés:</b> Sneakers Edición Limitada.<br><b>Trigger:</b> Palabra clave "DROP" en comentarios.<br><b>Estatus:</b> Auto-DM con enlace express y envío gratis despachado.',
    },
    {
      id: 'lead-urb-02',
      name: 'Camila S.',
      phone: '+52 55 6789 0123',
      channel: 'TikTok Ads / Meta Ads',
      channelIcon: 'facebook',
      temperature: 'TIBIO',
      status: 'Consultando plan quincenas Kueski Pay',
      potentialTicket: '$1,850 MXN',
      dictamen:
        '<b>Interés:</b> Hoodie Oversize Acid Wash.<br><b>Fricción:</b> Desea pagar en 3 quincenas.<br><b>Acción sugerida:</b> Recordatorio de stock bajo (4 piezas restantes).',
    },
    {
      id: 'lead-urb-03',
      name: 'Mateo G.',
      phone: '+52 55 7890 1234',
      channel: 'Instagram Direct Graph',
      channelIcon: 'instagram',
      temperature: 'CALIENTE',
      status: 'Orden Confirmada: Cargo Pants Reflectivo',
      potentialTicket: '$2,100 MXN',
      dictamen:
        '<b>Interés:</b> Pantalones Cargo Reflectivos.<br><b>Estatus:</b> Pago acreditado y guía generada en paquetería express.',
    },
  ],
  corp: [
    {
      id: 'lead-corp-01',
      name: 'Rodrigo Elizondo',
      phone: '+52 55 9012 3456',
      channel: 'Meta Ads Lead Gen B2B',
      channelIcon: 'facebook',
      temperature: 'CALIENTE',
      status: 'Discovery Zoom Miércoles 10:00 hrs',
      potentialTicket: '$50,000 USD',
      dictamen:
        '<b>Interés:</b> Licenciamiento Multi-Tenant para 4 Subsidiarias.<br><b>Calificación BANT:</b> Presupuesto aprobado Q4.<br><b>Estatus:</b> Reunión confirmada con Director de Soluciones.',
    },
    {
      id: 'lead-corp-02',
      name: 'Lic. Patricia Peña',
      phone: '+52 55 0123 4567',
      channel: 'WhatsApp Business API',
      channelIcon: 'whatsapp',
      temperature: 'TIBIO',
      status: 'Evaluación técnica de API de Cobranza',
      potentialTicket: '$15,000 USD',
      dictamen:
        '<b>Interés:</b> Automatización de llamadas y mensajes de cobranza.<br><b>Fricción:</b> Consulta tiempo de implementación.<br><b>Acción sugerida:</b> Compartir caso de éxito de 72h.',
    },
    {
      id: 'lead-corp-03',
      name: 'Ing. Fernando Vélez',
      phone: '+52 55 1234 5670',
      channel: 'Referral Directivo C-Level',
      channelIcon: 'whatsapp',
      temperature: 'CALIENTE',
      status: 'Prueba de fuego Lobo Sentinel en Sandbox',
      potentialTicket: '$22,000 USD',
      dictamen:
        '<b>Interés:</b> Call Center SDR Inteligente.<br><b>Estatus:</b> Credenciales de Sandbox API entregadas con SLA 99.9%.',
    },
  ],
};

// Tenant-aware creative fatigue and DeepSeek R1 recommendations
const CREATIVE_FATIGUE_BY_TENANT = {
  dental: {
    fatiguedAdName: 'Imagen Promo Limpieza',
    frequency: '3.8',
    suggestion:
      'Grabar Reel respondiendo dudas de dolor y planes de meses sin intereses en carillas de resina (objeción principal de Leads Tibios).',
    scriptHook: '¿Sabías que postergar tu implante dental puede duplicar tu costo en 6 meses?',
    scriptDemo:
      'En Clínica Odontológica, usamos tomografía 3D guiada para colocación en 1 sola sesión sin dolor.',
    scriptOffer: 'Aceptamos hasta 12 meses sin intereses y te regalamos el diagnóstico computarizado.',
    scriptCta: 'Toca el botón aquí abajo para agendar con nuestro especialista en WhatsApp.',
  },
  polanco: {
    fatiguedAdName: 'Foto Estática Menú Tasting',
    frequency: '4.1',
    suggestion:
      'Grabar Reel mostrando el flameado en mesa del Tomahawk con sonido ASMR y reacción de comensales en terraza VIP.',
    scriptHook: '¿Buscas la mejor experiencia gastronómica para este fin de semana en Polanco?',
    scriptDemo:
      'En Polanco Steakhouse, cada corte Prime se añeja 45 días y se flamea frente a tu mesa con mantequilla de trufa.',
    scriptOffer: 'Reserva hoy y recibe una copa de Champagne de bienvenida de nuestra cava privada.',
    scriptCta: 'Toca el enlace aquí abajo para apartar tu mesa en terraza antes de que se agoten.',
  },
  urban: {
    fatiguedAdName: 'Carrusel Sneakers Fondo Blanco',
    frequency: '4.4',
    suggestion:
      'Grabar video TikTok dinámico con outfits nocturnos mostrando cómo brillan las costuras reflectivas bajo la luz de la calle.',
    scriptHook: 'Si buscas una hoodie que nadie más tenga en la ciudad, mira esto.',
    scriptDemo:
      'Algodón francés peinado 450 GSM de alto gramaje con detalles reflectivos que brillan de noche.',
    scriptOffer: 'Primer drop con 10% OFF y 3 quincenas sin intereses con Kueski Pay sin tarjeta.',
    scriptCta: 'Desliza arriba para asegurar tu talla antes de que se declare sold out.',
  },
  corp: {
    fatiguedAdName: 'Infografía Costos de Atención Call Center',
    frequency: '3.6',
    suggestion:
      'Video testimonial de 45s con pantalla compartida demostrando la reducción del 70% en CAC mediante Meta CAPI Server-to-Server.',
    scriptHook: '¿Tu equipo comercial sigue perdiendo horas respondiendo las mismas dudas en WhatsApp?',
    scriptDemo:
      'Vector Inside pre-califica al 100% de los leads y agenda las llamadas de alto valor directo en Zoom.',
    scriptOffer: 'Solicita un Sandbox de prueba de 14 días con integración directa a tu CRM.',
    scriptCta: 'Agenda tu Discovery Call de 15 minutos en el enlace.',
  },
};

export const SoberaniaFinanciera = () => {
  const router = useRouter();
  const { activeTenant, triggerModal } = useAuth();
  const [showLandingModal, setShowLandingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const tenantKey = activeTenant?.id || 'dental';
  const leads = RADAR_LEADS_BY_TENANT[tenantKey] || RADAR_LEADS_BY_TENANT.dental;
  const creative = CREATIVE_FATIGUE_BY_TENANT[tenantKey] || CREATIVE_FATIGUE_BY_TENANT.dental;

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
      `Generación de Guion Viral (DeepSeek R1) — ${activeTenant?.name}`,
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
            <strong className="text-[var(--text-main)] font-semibold">{activeTenant?.name}</strong>
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
            {activeTenant?.hasWebsite ? <Globe className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-main)] font-bold text-sm">
                {activeTenant?.hasWebsite
                  ? 'Presencia: Sitio Web Oficial Sincronizado'
                  : 'Presencia: Ecosistema Puro en WhatsApp (SIN Web)'}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                {activeTenant?.hasWebsite ? 'Medición Web GA4 (Sin costo)' : 'Micro-Landing Activa'}
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-xs mt-0.5 font-sans">
              Micro-Landing Oficial:{' '}
              <a
                href={`/m/${activeTenant?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon underline hover:text-[var(--neon-hover)]"
              >
                app.vectorinside.com/m/{activeTenant?.id}
              </a>
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
            {activeTenant?.mer || '5.6x'}
          </p>
        </div>

        <div className="vector-bg-panel vector-border p-5 rounded-xl shadow-sm">
          <p className="text-[11px] font-sans font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            CAC (Costo Adquisición)
          </p>
          <p className="text-2xl font-black text-[var(--text-main)] font-sans tabular-nums">
            {activeTenant?.cac || '$185'}{' '}
            <span className="text-xs font-normal text-[var(--text-muted)]">MXN</span>
          </p>
        </div>

        <div className="vector-bg-panel vector-border p-5 rounded-xl shadow-sm">
          <p className="text-[11px] font-sans font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            LTV (Valor Vida Cliente)
          </p>
          <p className="text-2xl font-black text-neon font-sans tabular-nums">
            {activeTenant?.ltv || '$2,450'}{' '}
            <span className="text-xs font-normal text-[var(--text-muted)]">MXN</span>
          </p>
        </div>

        <div className="vector-bg-panel border border-[var(--success)] bg-[var(--success-bg)] p-5 rounded-xl shadow-sm">
          <p className="text-[11px] font-sans text-[var(--success)] font-bold uppercase tracking-wider mb-2">
            Conversiones / Citas IA
          </p>
          <p className="text-2xl font-black text-[var(--text-main)] font-sans tabular-nums flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[var(--success)]" />
            <span>{activeTenant?.citas || 34}</span>
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
                  <span>Radar de Prospectos (Leads) — {activeTenant?.name}</span>
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
                  {leads.map((lead) => {
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
                  })}
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
                    DeepSeek R1 Analista • {activeTenant?.name}
                  </p>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-black/40 border border-purple-500/20 dark:border-[#a855f7]/30 p-4 rounded-xl text-sm mb-4 space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[var(--danger)] tracking-wider flex items-center gap-1 mb-1 font-mono">
                    <AlertTriangle className="w-3 h-3" /> Fatiga Detectada
                  </span>
                  <p className="text-xs text-purple-950 dark:text-[#d8b4fe] leading-relaxed">
                    El anuncio <strong className="text-[var(--text-main)]">"{creative.fatiguedAdName}"</strong> superó la frecuencia de {creative.frequency}. Costos de adquisición en aumento.
                  </p>
                </div>

                <div className="border-t border-purple-500/20 dark:border-[#a855f7]/30 pt-3">
                  <p className="text-[10px] font-mono text-purple-900 dark:text-[#e9d5ff] font-bold mb-1.5 uppercase">
                    Sugerencia Estratégica (Diversidad):
                  </p>
                  <p className="text-xs text-purple-950 dark:text-[#d8b4fe] leading-relaxed">
                    {creative.suggestion}
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
