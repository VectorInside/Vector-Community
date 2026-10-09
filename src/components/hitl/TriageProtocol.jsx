'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  MessageSquareWarning,
  Send,
  ShieldAlert,
  User,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FileText,
  Clock,
  Sparkles,
  Bot,
  Instagram,
  Facebook,
  MessageCircle,
  ThumbsUp,
  Heart,
  Share2,
  TrendingUp,
  Filter,
  PlusCircle,
  Lightbulb,
  ExternalLink,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TriageProtocol = () => {
  const { triggerModal, activeTenant } = useAuth();
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'meta_comments'
  const [activeContact, setActiveContact] = useState('ana');
  const [inputMessage, setInputMessage] = useState('');
  const [isBotPaused, setIsBotPaused] = useState(false);

  // Chat threads state with AI Customer Feedback & Intelligence
  const [threads, setThreads] = useState({
    ana: {
      name: 'Ana Martínez',
      phone: '+52 55 1234 5678',
      channel: 'WhatsApp Business API',
      status: 'Cita Agendada',
      statusType: 'success',
      avatar: '👩🏻',
      customerNeeds: {
        intent: 'Tratamiento Dental Completo (Implantes)',
        stage: 'Prospecto Calificado en Agenda',
        potentialTicket: '$28,000 MXN',
        buyingUrgency: 'Alta (Próxima semana)',
        objectionIdentified: 'Presupuesto elevado -> Superada con plan 12 MSI.',
        aiSummary: 'La paciente llegó por anuncio de Instagram. Buscaba financiamiento y fecha inmediata. El bot asignó cita el martes 14:00 hrs.',
        suggestedNextAction: 'Enviar recordatorio de cita 24h antes por WhatsApp con ubicación de Google Maps.',
      },
      dictamen: '<b>Interés:</b> Implantes Dentales.<br><b>Objeción superada:</b> Pagos a meses sin intereses.<br><b>Estatus:</b> Cita confirmada en Google Calendar para el próximo martes a las 14:00 hrs.',
      messages: [
        {
          id: 1,
          sender: 'Ana Martínez',
          text: 'Hola, vi su anuncio en Instagram. ¿Tienen disponibilidad para la próxima semana?',
          isUser: true,
          time: '11:42 AM',
        },
        {
          id: 2,
          sender: 'Sub-Bot Closer (IA)',
          text: '¡Hola Ana! Claro que sí. Tenemos espacio el próximo martes a las 14:00 hrs. ¿Te agendamos?',
          isBot: true,
          time: '11:43 AM',
        },
      ],
    },
    roberto: {
      name: 'Roberto Sánchez',
      phone: 'DM Instagram / WhatsApp',
      channel: 'ALERTA HITL: Malas palabras detectadas',
      status: 'Riesgo / Insulto',
      statusType: 'danger',
      avatar: '😠',
      customerNeeds: {
        intent: 'Reclamo por retraso en confirmación de pedido',
        stage: 'Cliente Molesto (Riesgo de Churn / Hate)',
        potentialTicket: '$1,850 MXN (Reembolso en disputa)',
        buyingUrgency: 'Inmediata (Alerta Roja)',
        objectionIdentified: 'Sentimiento de abandono / Falta de respuesta en paquetería.',
        aiSummary: 'El usuario usó lenguaje agresivo. El Lobo Vectorial pausó el bot para evitar respuestas genéricas que aumenten la tensión.',
        suggestedNextAction: 'Ofrecer disculpa institucional, validar guía de paquetería y bonificar cupón de $200 MXN.',
      },
      dictamen: '<b>Alerta:</b> Lenguaje agresivo y descontento.<br><b>Causa:</b> Retraso en confirmación de pedido.<br><b>Acción:</b> El Lobo Vectorial pausó el bot para evitar respuestas inapropiadas.',
      messages: [
        {
          id: 1,
          sender: 'Roberto Sánchez',
          text: '¡Su servicio es pésimo, devuélvanme mi dinero!',
          isUser: true,
          isDanger: true,
          time: '12:15 PM',
        },
        {
          id: 2,
          sender: 'Sub-Bot Moderador (IA)',
          text: '[PAUSADO] Intención de riesgo alto. Chat derivado al operador de la agencia.',
          isWarning: true,
          time: '12:15 PM',
        },
      ],
    },
    rodrigo: {
      name: 'Lic. Rodrigo Elizondo (B2B)',
      phone: '+52 55 4120 7890',
      channel: 'LinkedIn B2B Ads / WhatsApp',
      status: 'Lead BANT Calificado ($50k USD)',
      statusType: 'b2b',
      avatar: '👔',
      customerNeeds: {
        intent: 'Implementación Enterprise de Vector Community en 4 subsidiarias',
        stage: 'Discovery Call Agendada',
        potentialTicket: '$50,000 USD / Anual',
        buyingUrgency: 'Inmediata (Q4 Presupuesto Aprobado)',
        objectionIdentified: 'Requiere integración nativa con SAP y Salesforce RLS.',
        aiSummary: 'BANT Score 97/100. Cuenta con autoridad y presupuesto. Solicitó reunión con Director de Soluciones.',
        suggestedNextAction: 'Enviar brief corporativo y credenciales de Zoom antes del miércoles.',
      },
      dictamen: '<b>Empresa:</b> Logística Global Monterrey S.A. (180 colaboradores).<br><b>BANT Scoring:</b> 97/100 (Presupuesto $50k USD asignado, decisión inmediata).<br><b>Destino:</b> HubSpot CRM Enterprise.<br><b>Estatus:</b> Discovery Call confirmada vía Zoom para el próximo miércoles a las 10:00 hrs.',
      messages: [
        {
          id: 1,
          sender: 'Rodrigo Elizondo',
          text: 'Buenas tardes, vimos su infraestructura de IA para gestión comunitaria y queremos integrarla en 4 subsidiarias.',
          isUser: true,
          time: '12:30 PM',
        },
        {
          id: 2,
          sender: 'Sub-Bot SDR B2B (IA)',
          text: '¡Mucho gusto Lic. Rodrigo! Con gusto. Para asignar al especialista adecuado, ¿tienen un presupuesto estimado asignado para este despliegue?',
          isBot: true,
          time: '12:31 PM',
        },
        {
          id: 3,
          sender: 'Rodrigo Elizondo',
          text: 'Sí, tenemos $50,000 USD aprobados para Q4 y buscamos arrancar de inmediato.',
          isUser: true,
          time: '12:32 PM',
        },
        {
          id: 4,
          sender: 'Sub-Bot Closer (IA)',
          text: 'Excelente. Cuentan con calificación prioritaria BANT. He reservado la Discovery Call con el Director de Soluciones el próximo miércoles a las 10:00 hrs vía Zoom.',
          isBot: true,
          time: '12:33 PM',
        }
      ],
    },
    mariana: {
      name: 'Mariana Valenzuela (Sony PR)',
      phone: 'Instagram DM @sonymexico_pr',
      channel: 'Instagram Direct Graph API',
      status: 'Oferta Patrocinio ($3,500 USD)',
      statusType: 'creator',
      avatar: '👩🏼‍💼',
      customerNeeds: {
        intent: 'Campaña de patrocinio para audífonos Sony WH-1000XM6',
        stage: 'Propuesta Económica en Mesa de Control',
        potentialTicket: '$3,500 USD (1 Reel + 3 Stories)',
        buyingUrgency: 'Media (Fin de mes)',
        objectionIdentified: 'Requiere exclusividad de categoría de audio por 30 días.',
        aiSummary: 'La marca contactó directamente por DM tras ver un Reel viral. El bot compartió el Media Kit base y solicitó brief formal.',
        suggestedNextAction: 'Revisar cláusula de exclusividad y autorizar contrato con firma electrónica.',
      },
      dictamen: '<b>Marca:</b> Sony Electronics México.<br><b>Entregables:</b> 1 Reel Dedicado + 3 Stories.<br><b>Presupuesto:</b> $3,500 USD (Aprobado).<br><b>Estatus:</b> Media Kit entregado por IA. Pendiente de aprobación 1-clic de la agencia para enviar contrato y fechas.',
      messages: [
        {
          id: 1,
          sender: 'Mariana Valenzuela',
          text: 'Hola Alex! Somos de la agencia de PR de Sony. Nos encantó tu último Reel de tecnología y queremos pautar una integración para los nuevos audífonos.',
          isUser: true,
          time: '01:10 PM',
        },
        {
          id: 2,
          sender: 'Sub-Bot Deal Hunter (IA)',
          text: '¡Hola Mariana! Gracias por contactar al equipo de Alex Rivera. ¿Cuál es el presupuesto asignado y los entregables requeridos?',
          isBot: true,
          time: '01:11 PM',
        },
        {
          id: 3,
          sender: 'Mariana Valenzuela',
          text: 'Presupuestamos $3,500 USD para 1 Reel dedicado y 3 Stories con link de afiliado para finales de este mes.',
          isUser: true,
          time: '01:12 PM',
        },
        {
          id: 4,
          sender: 'Sub-Bot Deal Hunter (IA)',
          text: 'Excelente. El presupuesto cumple con las tarifas oficiales. He transferido la propuesta a la Agencia Vector para confirmación y firma.',
          isBot: true,
          time: '01:13 PM',
        }
      ],
    },
    sofia_story: {
      name: 'Sofía Valdés (@sofia.valdes)',
      phone: 'Instagram Story Mention #419',
      channel: 'Instagram Story Mention Engine',
      status: 'Mención en Story Agradecida (Cupón 10%)',
      statusType: 'success',
      avatar: '✨',
      customerNeeds: {
        intent: 'Recomendación orgánica en Stories tras experiencia positiva',
        stage: 'Promotora Orgánica / Micro-Influencer (6.8k fans)',
        potentialTicket: '$1,200 MXN + Referidos',
        buyingUrgency: 'Informativa / Fidelización',
        objectionIdentified: 'Ninguna (Alta lealtad a la marca).',
        aiSummary: 'La usuaria etiquetó a la marca en sus historias. El bot tardó 8 segundos en enviarle un agradecimiento y un cupón de referido.',
        suggestedNextAction: 'Monitorear si su hermana redime el cupón SOFIA-VIP10 para atribuir el CAPI referral.',
      },
      dictamen: '<b>Tipo de Interacción:</b> Mención en Story de Instagram (6.8k seguidores).<br><b>Acción Automática:</b> El bot detectó la etiqueta de la marca en la Story, respondió al DM en 8 segundos con un agradecimiento personalizado y entregó un cupón VIP de 10% de descuento.',
      messages: [
        {
          id: 1,
          sender: 'Instagram Story Engine',
          text: '📸 @sofia.valdes te mencionó en su Story: "Amando mi tratamiento en @odontologiaintegral ✨🦷"',
          isUser: true,
          time: '02:15 PM',
        },
        {
          id: 2,
          sender: 'Sub-Bot Story Nurture (IA)',
          text: '¡Hola Sofía! Muchísimas gracias por compartir tu experiencia en tus Stories. Nos alegra mucho verte feliz con tu sonrisa. 💖 Como agradecimiento, aquí tienes un cupón del 10% en tu próxima sesión: SOFIA-VIP10.',
          isBot: true,
          time: '02:15 PM',
        },
        {
          id: 3,
          sender: 'Sofía Valdés',
          text: '¡Ay qué lindos! Muchísimas gracias, se lo voy a pasar a mi hermana que también necesita cita 😍',
          isUser: true,
          time: '02:18 PM',
        }
      ],
    },
  });

  // Meta Posts & Live Comments Stream Mock Data
  const [metaPosts, setMetaPosts] = useState([
    {
      id: 'post-01',
      platform: 'instagram',
      type: 'Reel',
      title: '3 Secretos para Cuidar tu Sonrisa y Evitar Cirugías Costosas ✨',
      date: 'Publicado hace 3 horas',
      reach: '14,820 reproducciones',
      hookRate: '48.2%',
      commentsCount: 38,
      dmsTriggered: 19,
      sentiment: '94% Positivo',
    },
    {
      id: 'post-02',
      platform: 'instagram',
      type: 'Carrusel',
      title: 'Caso de Éxito: Alineación Invisible en solo 6 meses 🦷',
      date: 'Publicado ayer',
      reach: '9,410 visualizaciones',
      hookRate: '41.5%',
      commentsCount: 24,
      dmsTriggered: 14,
      sentiment: '98% Positivo',
    },
  ]);

  const [metaComments, setMetaComments] = useState([
    {
      id: 'comm-01',
      author: '@carlos_garcia92',
      postRef: 'Reel: 3 Secretos para Cuidar tu Sonrisa',
      text: '¿Cuánto cuesta la primera consulta de valoración?',
      intent: 'Pregunta de Precio / Cita',
      aiAction: 'Auto-DM Enviado con Oferta Activa ("Diagnóstico 3D Gratis")',
      sentiment: 'Interés Alto',
      status: 'Resuelto por IA',
      time: 'Hace 12 min',
    },
    {
      id: 'comm-02',
      author: '@valeria.design',
      postRef: 'Reel: 3 Secretos para Cuidar tu Sonrisa',
      text: 'VALORACION',
      intent: 'Palabra Clave de Lead Magnet',
      aiAction: 'Trigger Activado -> DM despachado en 4 segundos con enlace a Google Calendar',
      sentiment: 'Conversión Directa',
      status: 'Resuelto por IA',
      time: 'Hace 28 min',
    },
    {
      id: 'comm-03',
      author: '@javier_mtz',
      postRef: 'Carrusel: Caso de Éxito',
      text: '¿Aceptan seguros de gastos médicos mayores?',
      intent: 'Duda de Cobertura / FAQ',
      aiAction: 'Respuesta pública en hilo: "¡Hola Javier! Sí, trabajamos con GNP, MetLife y AXA. Te enviamos los detalles por mensaje."',
      sentiment: 'Informativo',
      status: 'Retroalimentar a FAQ RAG',
      time: 'Hace 1 hora',
    },
    {
      id: 'comm-04',
      author: '@pedro_hater88',
      postRef: 'Reel: 3 Secretos para Cuidar tu Sonrisa',
      text: 'Puros precios inflados seguro no sirve para nada',
      intent: 'Hate / Trolling',
      aiAction: 'Comentario Ocultado Automáticamente por Filtro de Toxicidad (Regla Inviolable)',
      sentiment: 'Tóxico (Bloqueado)',
      status: 'HITL Seguro',
      time: 'Hace 2 horas',
    },
  ]);

  const currentChat = threads[activeContact];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'Operador Humano',
      text: inputMessage,
      isHumanOperator: true,
      time: 'Justo ahora',
    };

    setThreads((prev) => ({
      ...prev,
      [activeContact]: {
        ...prev[activeContact],
        messages: [...prev[activeContact].messages, newMsg],
      },
    }));

    setInputMessage('');
    triggerModal(
      'Mensaje Enviado',
      `El mensaje ha sido despachado vía Meta API hacia <strong>${currentChat.name}</strong>.`
    );
  };

  const handleApplySuggestedAction = () => {
    if (!currentChat.customerNeeds?.suggestedNextAction) return;
    setInputMessage(`Hola ${currentChat.name.split(' ')[0]}, ${currentChat.customerNeeds.suggestedNextAction}`);
  };

  const handleAssumeControl = () => {
    setIsBotPaused(true);
    triggerModal(
      'Soberanía Humana',
      'Has tomado el control manual de este chat. El Lobo Vectorial pausó el bot automático para que intervengas directamente.',
      () => {
        try {
          confetti({ particleCount: 30, spread: 50, colors: ['#E5FF00', '#10B981'] });
        } catch (e) {}
      },
      'Entendido'
    );
  };

  const handleShowDictamen = () => {
    triggerModal(
      `Dictamen Pre-Cita: ${currentChat.name}`,
      currentChat.dictamen,
      null,
      'Cerrar Dictamen'
    );
  };

  const handleAddFaqToRag = (commentText) => {
    triggerModal(
      'Pregunta Añadida a Base de Conocimiento RAG',
      `La duda recurrente: "<strong>${commentText}</strong>" fue categorizada y agregada al Pilar 3 (FAQs) del negocio para que el bot responda de forma automática en el futuro.`,
      () => {
        try {
          confetti({ particleCount: 25, spread: 45, colors: ['#E5FF00', '#06B6D4'] });
        } catch (e) {}
      },
      'Aceptar'
    );
  };

  return (
    <div className="p-6 lg:p-8 block animate-fade-in space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            <Bot className="w-3.5 h-3.5" />
            Supervisión HITL & Meta Intelligence Hub
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-main)]">
            Triage de Conversaciones <span className="text-neon">& Análisis Meta Graph</span>
          </h2>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Análisis semántico en tiempo real de requerimientos de clientes en DMs y comentarios en posts de Instagram/Facebook.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-zinc-900/90 p-1.5 rounded-2xl border border-white/10 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('chats')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'chats'
                ? 'bg-neon text-black shadow-neon-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chats & DMs ({Object.keys(threads).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('meta_comments')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'meta_comments'
                ? 'bg-neon text-black shadow-neon-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Instagram className="w-4 h-4" />
            <span>Meta Publicaciones & Comentarios</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* PESTAÑA 1: CHATS, DMS & FEEDBACK DE REQUERIMIENTOS DEL CLIENTE            */}
      {/* ========================================================================= */}
      {activeTab === 'chats' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Active Chat List (4 cols) */}
          <div className="lg:col-span-4 vector-bg-card vector-border rounded-2xl p-4 flex flex-col h-[640px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center justify-between font-mono">
              <span>Bandeja de Intervención</span>
              <span className="text-[9px] bg-neon text-black px-2 py-0.5 rounded-full font-black">
                {Object.keys(threads).length} EN MONITOREO
              </span>
            </h3>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {Object.entries(threads).map(([key, item]) => {
                const isSelected = activeContact === key;
                return (
                  <div
                    key={key}
                    onClick={() => setActiveContact(key)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-[var(--bg-panel)] border-2 border-neon shadow-[0_0_15px_var(--neon-glow)]'
                        : 'bg-zinc-950/60 border border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <span>{item.avatar}</span>
                        <span>{item.name}</span>
                      </span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                          item.statusType === 'danger'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : item.statusType === 'b2b'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : item.statusType === 'creator'
                            ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate font-sans">
                      {item.messages[item.messages.length - 1]?.text}
                    </p>
                    <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-1">
                      <span>{item.channel}</span>
                      <span className="text-neon font-bold">{item.customerNeeds?.potentialTicket}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Chat Viewer + Customer Needs Feedback Panel (8 cols) */}
          <div className="lg:col-span-8 space-y-4 flex flex-col h-[640px]">
            {/* Top Customer Needs Intelligence Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-neon/30 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neon font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Feedback & Radiografía de Requerimientos de {currentChat.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  Ticket: <strong className="text-white">{currentChat.customerNeeds?.potentialTicket}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
                <div>
                  <span className="text-zinc-500 block">Requerimiento Principal:</span>
                  <span className="text-white font-sans">{currentChat.customerNeeds?.intent}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Objeción / Reto Detectado:</span>
                  <span className="text-cyan-400 font-sans">{currentChat.customerNeeds?.objectionIdentified}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 text-[11px] flex items-center justify-between gap-2">
                <div>
                  <span className="text-neon font-bold">💡 Acción Sugerida para el Humano: </span>
                  <span className="text-zinc-300 font-sans">{currentChat.customerNeeds?.suggestedNextAction}</span>
                </div>
                <button
                  type="button"
                  onClick={handleApplySuggestedAction}
                  className="px-2.5 py-1 rounded bg-neon/15 hover:bg-neon text-neon hover:text-black text-[10px] font-bold font-mono transition-colors shrink-0"
                >
                  Insertar Copia
                </button>
              </div>
            </div>

            {/* Interactive Chat Window */}
            <div className="vector-bg-card vector-border rounded-2xl p-5 flex flex-col flex-1 overflow-hidden">
              {/* Chat Header */}
              <div className="flex flex-wrap justify-between items-center pb-3 border-b border-zinc-800 mb-3 gap-2">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>{currentChat.name}</span>
                    {isBotPaused && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                        CONTROL MANUAL HUMANO
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-400">
                    {currentChat.phone} • {currentChat.channel}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleShowDictamen}
                    className="text-[10px] bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-xl hover:border-neon text-white transition-colors flex items-center gap-1.5 font-mono"
                  >
                    <FileText className="w-3.5 h-3.5 text-neon" />
                    <span>Ver Dictamen</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAssumeControl}
                    className="text-[10px] bg-red-600 text-white px-3 py-1.5 rounded-xl hover:bg-red-500 transition-colors font-bold font-mono shadow-sm"
                  >
                    Asumir Control
                  </button>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-zinc-950/60 border border-white/5 rounded-xl mb-3 text-xs">
                {currentChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl max-w-[80%] leading-relaxed ${
                      msg.isUser
                        ? msg.isDanger
                          ? 'bg-red-950/60 border border-red-500/50 text-white'
                          : 'bg-zinc-900 border border-zinc-800 text-white'
                        : msg.isBot
                        ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 ml-auto text-right'
                        : msg.isWarning
                        ? 'bg-amber-950/50 border border-amber-500/40 text-amber-200 ml-auto text-right'
                        : 'bg-neon/15 border border-neon text-white ml-auto text-right'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span
                        className={`text-[9px] font-mono uppercase ${
                          msg.isUser
                            ? msg.isDanger
                              ? 'text-red-400 font-bold'
                              : 'text-zinc-400'
                            : msg.isBot
                            ? 'text-emerald-400 font-bold'
                            : msg.isWarning
                            ? 'text-amber-400 font-bold'
                            : 'text-neon font-bold'
                        }`}
                      >
                        {msg.sender}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        {msg.time}
                      </span>
                    </div>
                    <p className="font-sans">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe una respuesta directa o usa una sugerencia de IA..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl px-4 py-2.5 outline-none focus:border-neon font-sans"
                />
                <button
                  type="submit"
                  className="bg-neon text-black text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-neon flex items-center gap-1.5 font-mono"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: META GRAPH API (PUBLICACIONES, REELS & COMENTARIOS EN VIVO)     */}
      {/* ========================================================================= */}
      {activeTab === 'meta_comments' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Meta Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase">Hook Rate Promedio (3s)</span>
              <p className="text-2xl font-black text-neon">46.8%</p>
              <span className="text-[10px] text-emerald-400">+12% vs benchmark</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase">Comentarios Analizados</span>
              <p className="text-2xl font-black text-white">128</p>
              <span className="text-[10px] text-zinc-500">Últimas 24 horas</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase">DMs Disparados Automáticos</span>
              <p className="text-2xl font-black text-cyan-400">42</p>
              <span className="text-[10px] text-cyan-500">Conversión a Chat: 32.8%</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase">Sentimiento de Comunidad</span>
              <p className="text-2xl font-black text-emerald-400">96%</p>
              <span className="text-[10px] text-emerald-500">Filtro de Toxicidad Activo</span>
            </div>
          </div>

          {/* Posts & Reels Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Publicaciones & Reels Activos en Meta</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metaPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                      {post.type} • {post.platform}
                    </span>
                    <span className="text-[10px] text-zinc-500">{post.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white font-sans">{post.title}</h4>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800 text-[11px]">
                    <div>
                      <span className="text-zinc-500 block text-[9px]">Alcance:</span>
                      <span className="text-zinc-300 font-bold">{post.reach}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9px]">Hook Rate:</span>
                      <span className="text-neon font-bold">{post.hookRate}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9px]">DMs Creados:</span>
                      <span className="text-emerald-400 font-bold">{post.dmsTriggered}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Meta Comments Feed */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <MessageSquareWarning className="w-4 h-4 text-neon" />
                <span>Feed de Comentarios en Vivo & Acciones Automatizadas</span>
              </h3>
              <span className="text-xs font-mono text-zinc-400">
                Sincronizado vía Meta Webhooks
              </span>
            </div>

            <div className="space-y-3">
              {metaComments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-4 rounded-xl bg-zinc-950 border border-white/5 space-y-2 font-mono text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neon">{comm.author}</span>
                      <span className="text-zinc-500">en {comm.postRef}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">{comm.time}</span>
                  </div>

                  <p className="text-white text-xs font-sans bg-zinc-900/80 p-2.5 rounded-lg border border-white/5">
                    "{comm.text}"
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[10px]">
                    <div className="space-y-0.5">
                      <span className="text-zinc-400">Acción IA: </span>
                      <span className="text-cyan-300 font-sans">{comm.aiAction}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {comm.sentiment}
                      </span>
                      {comm.status === 'Retroalimentar a FAQ RAG' && (
                        <button
                          type="button"
                          onClick={() => handleAddFaqToRag(comm.text)}
                          className="px-2.5 py-1 rounded bg-neon text-black font-bold flex items-center gap-1 hover:bg-[var(--neon-hover)] transition-colors"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>Guardar en FAQ RAG</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
