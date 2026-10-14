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
  ShieldCheck,
  Zap,
  Kanban,
  LayoutList,
  CheckSquare,
  Square,
  Hash,
  Lock,
  Layers,
  Thermometer,
  CalendarCheck,
  Copy,
  ChevronRight,
  ChevronLeft,
  Search,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  LEAD_STATUS_ENUM,
  KANBAN_COLUMNS_CONFIG,
  QUALIFIED_LEAD_CRITERIA,
} from '@/utils/constants';
import { PreCitaDrawer } from './PreCitaDrawer';

export const TriageProtocol = () => {
  const { triggerModal, activeTenant } = useAuth();
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'meta_comments'
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'chat'
  const [kanbanDensity, setKanbanDensity] = useState('compact'); // 'compact' (ultra-visión) | 'standard'
  const [selectedColumnFilter, setSelectedColumnFilter] = useState('ALL');
  const [activeContact, setActiveContact] = useState('ana');
  const [inputMessage, setInputMessage] = useState('');
  const [isBotPaused, setIsBotPaused] = useState(false);
  const [selectedCapiLead, setSelectedCapiLead] = useState(null);
  const [drawerLead, setDrawerLead] = useState(null);

  // Chat threads state with AI Customer Feedback, Boolean AND Criteria & Unified ENUMs
  const [threads, setThreads] = useState({
    ana: {
      id: 'lead-001',
      name: 'Ana Martínez',
      phone: '+52 55 1234 5678',
      email: 'ana.martinez@gmail.com',
      channel: 'WhatsApp Business API',
      leadState: LEAD_STATUS_ENUM.BILLABLE_LEAD,
      status: 'Calificado / BILLABLE_LEAD',
      statusType: 'success',
      avatar: '👩🏻',
      potentialTicket: '$28,000 MXN',
      billingAmount: 350,
      billingStatus: 'PENDING_INVOICE',
      capiEventId: 'lead_uuid_v4_8f9a2b',
      countdown24h: null,
      criteriaAudit: {
        identityValidated: true,
        catalogIdentified: true,
        financialClarified: true,
        consentOrBooked: true,
      },
      customerNeeds: {
        intent: 'Tratamiento Dental Completo (Implantes)',
        stage: 'Prospecto Calificado en Agenda (100% Criterios AND)',
        potentialTicket: '$28,000 MXN',
        buyingUrgency: 'Alta (Próxima semana)',
        objectionIdentified: 'Presupuesto elevado -> Superada con plan 12 MSI.',
        aiSummary: 'La paciente llegó por anuncio de Instagram. Buscaba financiamiento y fecha inmediata. El bot asignó cita el martes 14:00 hrs.',
        suggestedNextAction: 'Enviar recordatorio de cita 24h antes por WhatsApp con ubicación de Google Maps.',
      },
      dictamen: '<b>Interés:</b> Implantes Dentales.<br><b>Objeción superada:</b> Pagos a 12 meses sin intereses.<br><b>Estatus:</b> Cita confirmada en Google Calendar para el próximo martes a las 14:00 hrs.<br><b>Facturación:</b> Lead Calificado ($350 MXN) registrado en billing_ledger con hash SHA-256 S2S.',
      capiPayload: {
        event_name: 'Lead',
        event_time: 1772381000,
        event_id: 'lead_uuid_v4_8f9a2b',
        action_source: 'system_generated',
        user_data: {
          em: ['f660ab912ec121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44a'],
          ph: ['4c24b2142e0084f23473138380295eb1381387d8d2ef071a938c5208b5e2a220'],
          fn: ['242f2324f462f43d837699042b5f63901416e033994356e9999f8d5e8f0a2d20'],
        },
        custom_data: {
          currency: 'MXN',
          value: 0.0,
          lead_type: 'BILLABLE_LEAD',
          lead_price: 350.0,
        },
      },
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
        {
          id: 3,
          sender: 'Ana Martínez',
          text: 'Sí por favor, agéndenme a las 14:00 hrs. Mi correo es ana.martinez@gmail.com.',
          isUser: true,
          time: '11:44 AM',
        },
        {
          id: 4,
          sender: 'Lobo Vectorial Sentinel',
          text: '⚡ Transición a BILLABLE_LEAD: 4/4 Criterios validados. Despacho S2S Meta CAPI emitido & evento $350 MXN generado en ledger.',
          isWarning: true,
          time: '11:44 AM',
        },
      ],
    },

    roberto: {
      id: 'lead-002',
      name: 'Roberto Sánchez',
      phone: 'DM Instagram / WhatsApp',
      email: 'roberto.sanchez@yahoo.com',
      channel: 'ALERTA HITL: Malas palabras detectadas',
      leadState: LEAD_STATUS_ENUM.HITL_INTERVENTION,
      status: 'Intervención Humana (HITL)',
      statusType: 'danger',
      avatar: '😠',
      potentialTicket: '$1,850 MXN (En Disputa)',
      billingAmount: 0,
      billingStatus: 'NO_BILLABLE',
      capiEventId: null,
      countdown24h: null,
      riskAlert: 'Riesgo Reputacional / Lenguaje Agresivo',
      criteriaAudit: {
        identityValidated: true,
        catalogIdentified: false,
        financialClarified: false,
        consentOrBooked: false,
      },
      customerNeeds: {
        intent: 'Reclamo por retraso en confirmación de pedido',
        stage: 'Cliente Molesto (Riesgo de Churn / Hate)',
        potentialTicket: '$1,850 MXN (Reembolso en disputa)',
        buyingUrgency: 'Inmediata (Alerta Roja Neón)',
        objectionIdentified: 'Sentimiento de abandono / Falta de respuesta en paquetería.',
        aiSummary: 'El usuario usó lenguaje agresivo. El Lobo Vectorial pausó el bot para evitar respuestas genéricas que aumenten la tensión.',
        suggestedNextAction: 'Ofrecer disculpa institucional, validar guía de paquetería y bonificar cupón de $200 MXN.',
      },
      dictamen: '<b>Alerta:</b> Lenguaje agresivo y descontento.<br><b>Causa:</b> Retraso en confirmación de pedido.<br><b>Acción:</b> El Lobo Vectorial congeló la automatización conversacional (Sutura Arcángel requerida).',
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
          text: '[PAUSADO POR LOBO VECTORIAL] Intención de riesgo crítico. Automatización congelada. Chat derivado al operador de la agencia.',
          isWarning: true,
          time: '12:15 PM',
        },
      ],
    },

    rodrigo: {
      id: 'lead-003',
      name: 'Lic. Rodrigo Elizondo (B2B)',
      phone: '+52 55 4120 7890',
      email: 'r.elizondo@logistica.com.mx',
      channel: 'LinkedIn B2B Ads / WhatsApp',
      leadState: LEAD_STATUS_ENUM.BILLABLE_LEAD,
      status: 'Calificado / BILLABLE_LEAD',
      statusType: 'b2b',
      avatar: '👔',
      potentialTicket: '$50,000 USD / Anual',
      billingAmount: 350,
      billingStatus: 'PENDING_INVOICE',
      capiEventId: 'lead_uuid_v4_7c3e11',
      countdown24h: null,
      criteriaAudit: {
        identityValidated: true,
        catalogIdentified: true,
        financialClarified: true,
        consentOrBooked: true,
      },
      customerNeeds: {
        intent: 'Implementación Enterprise de Vector Community en 4 subsidiarias',
        stage: 'Discovery Call Agendada (BANT 97/100)',
        potentialTicket: '$50,000 USD / Anual',
        buyingUrgency: 'Inmediata (Q4 Presupuesto Aprobado)',
        objectionIdentified: 'Requiere integración nativa con SAP y Salesforce RLS.',
        aiSummary: 'BANT Score 97/100. Cuenta con autoridad y presupuesto. Solicitó reunión con Director de Soluciones.',
        suggestedNextAction: 'Enviar brief corporativo y credenciales de Zoom antes del miércoles.',
      },
      dictamen: '<b>Empresa:</b> Logística Global Monterrey S.A. (180 colaboradores).<br><b>BANT Scoring:</b> 97/100 (Presupuesto $50k USD asignado, decisión inmediata).<br><b>Destino:</b> HubSpot CRM Enterprise.<br><b>Estatus:</b> Discovery Call confirmada vía Zoom para el próximo miércoles a las 10:00 hrs.<br><b>Facturación:</b> Calificado con 4/4 criterios booleanos. Ledger registrado a $350 MXN.',
      capiPayload: {
        event_name: 'Lead',
        event_time: 1772382400,
        event_id: 'lead_uuid_v4_7c3e11',
        action_source: 'system_generated',
        user_data: {
          em: ['89a23b12dc121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44b9'],
          ph: ['112233442e0084f23473138380295eb1381387d8d2ef071a938c5208b5e2a331'],
          fn: ['55667788f462f43d837699042b5f63901416e033994356e9999f8d5e8f0a2e44'],
        },
        custom_data: {
          currency: 'MXN',
          value: 0.0,
          lead_type: 'BILLABLE_LEAD',
          lead_price: 350.0,
        },
      },
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
          text: 'Sí, tenemos $50,000 USD aprobados para Q4 y buscamos arrancar de inmediato. Correo: r.elizondo@logistica.com.mx.',
          isUser: true,
          time: '12:32 PM',
        },
        {
          id: 4,
          sender: 'Sub-Bot Closer (IA)',
          text: 'Excelente. Cuentan con calificación prioritaria BANT. He reservado la Discovery Call con el Director de Soluciones el próximo miércoles a las 10:00 hrs vía Zoom.',
          isBot: true,
          time: '12:33 PM',
        },
      ],
    },

    mariana: {
      id: 'lead-004',
      name: 'Mariana Valenzuela (Sony PR)',
      phone: 'Instagram DM @sonymexico_pr',
      email: 'm.valenzuela@sonyagency.com',
      channel: 'Instagram Direct Graph API',
      leadState: LEAD_STATUS_ENUM.LEAD_HOT_PREQUAL,
      status: 'Cálido (Pre-Calificación)',
      statusType: 'creator',
      avatar: '👩🏼‍💼',
      potentialTicket: '$3,500 USD (Patrocinio)',
      billingAmount: 0,
      billingStatus: 'PENDING_QUALIFICATION',
      capiEventId: null,
      countdown24h: '21h 30m restantes',
      criteriaAudit: {
        identityValidated: true,
        catalogIdentified: true,
        financialClarified: true,
        consentOrBooked: false,
      },
      customerNeeds: {
        intent: 'Campaña de patrocinio para audífonos Sony WH-1000XM6',
        stage: 'Propuesta Económica en Mesa de Control (3/4 Criterios)',
        potentialTicket: '$3,500 USD (1 Reel + 3 Stories)',
        buyingUrgency: 'Media (Fin de mes)',
        objectionIdentified: 'Requiere exclusividad de categoría de audio por 30 días.',
        aiSummary: 'La marca contactó directamente por DM. El bot compartió Media Kit y validó presupuesto ($3,500 USD). Falta confirmación de franja o contrato.',
        suggestedNextAction: 'Revisar cláusula de exclusividad y enviar enlace de firma o agendamiento.',
      },
      dictamen: '<b>Marca:</b> Sony Electronics México.<br><b>Entregables:</b> 1 Reel Dedicado + 3 Stories.<br><b>Presupuesto:</b> $3,500 USD (Aclarado).<br><b>Estatus:</b> Falta Criterio 4 (Cita/Firma). Si no confirma en 21h, pasa a ciclo de re-contactación.',
      messages: [
        {
          id: 1,
          sender: 'Mariana Valenzuela',
          text: 'Hola! Somos de la agencia de PR de Sony. Nos encantó su contenido y presupuestamos $3,500 USD para 1 Reel y 3 Stories.',
          isUser: true,
          time: '01:10 PM',
        },
        {
          id: 2,
          sender: 'Sub-Bot Deal Hunter (IA)',
          text: '¡Hola Mariana! Excelente, el presupuesto y formato encajan a la perfección con nuestro catálogo. ¿Agendamos una breve llamada de 15 min mañana para cerrar detalles?',
          isBot: true,
          time: '01:12 PM',
        },
      ],
    },

    valeria_warm: {
      id: 'lead-005',
      name: 'Valeria Cordero',
      phone: '+52 55 9821 4433',
      email: 'valeria.c@outlook.com',
      channel: 'Facebook Messenger / Meta Ads',
      leadState: LEAD_STATUS_ENUM.LEAD_WARM_24H,
      status: 'En Seguimiento 24h',
      statusType: 'warning',
      avatar: '🙋🏽‍♀️',
      potentialTicket: '$12,500 MXN',
      billingAmount: 0,
      billingStatus: 'NO_BILLABLE',
      capiEventId: null,
      countdown24h: '08h 45m restantes',
      criteriaAudit: {
        identityValidated: true,
        catalogIdentified: true,
        financialClarified: false,
        consentOrBooked: false,
      },
      customerNeeds: {
        intent: 'Diseño de Sonrisa & Carillas de Resina',
        stage: 'Lead Templado en Pausa (2/4 Criterios)',
        potentialTicket: '$12,500 MXN',
        buyingUrgency: 'Media',
        objectionIdentified: 'No ha profundizado en formas de pago ni MSI.',
        aiSummary: 'La usuaria respondió preguntas sobre el tipo de carillas pero no ha avanzado hacia la cotización formal ni agenda.',
        suggestedNextAction: 'Enviar CTA explícito de aclaración antes de que expire la ventana de 24h.',
      },
      dictamen: '<b>Lead Templado:</b> Respondió sobre el servicio pero no profundizó en financiamiento.<br><b>Ciclo Activo:</b> CTA de aclaración programado a 24h.',
      messages: [
        {
          id: 1,
          sender: 'Valeria Cordero',
          text: 'Hola, me interesa saber sobre las carillas de resina de alta estética.',
          isUser: true,
          time: '08:20 AM',
        },
        {
          id: 2,
          sender: 'Sub-Bot RAG (IA)',
          text: '¡Hola Valeria! Con gusto. Las carillas de resina estética se colocan en 1 sola sesión sin desgastar tus dientes naturales. ¿Te gustaría saber si eres candidata?',
          isBot: true,
          time: '08:21 AM',
        },
        {
          id: 3,
          sender: 'Valeria Cordero',
          text: 'Sí me gustaría, pero aún estoy viendo opciones.',
          isUser: true,
          time: '08:25 AM',
        },
      ],
    },

    carlos_frio: {
      id: 'lead-006',
      name: 'Carlos Mendoza Jr.',
      phone: '+52 55 6677 8899',
      email: 'No capturado',
      channel: 'WhatsApp Business API',
      leadState: LEAD_STATUS_ENUM.LEAD_COLD_24H,
      status: 'Ingreso / Frío',
      statusType: 'neutral',
      avatar: '🤷🏻‍♂️',
      potentialTicket: '$4,200 MXN',
      billingAmount: 0,
      billingStatus: 'NO_BILLABLE',
      capiEventId: null,
      countdown24h: '14h 22m restantes',
      criteriaAudit: {
        identityValidated: false,
        catalogIdentified: false,
        financialClarified: false,
        consentOrBooked: false,
      },
      customerNeeds: {
        intent: 'Consulta básica de precio sin datos de contacto',
        stage: 'Lead Frío / Evasiva (0/4 Criterios)',
        potentialTicket: '$4,200 MXN',
        buyingUrgency: 'Baja ("Lo voy a pensar")',
        objectionIdentified: 'Evasiva sin aportar datos adicionales ni validar identidad.',
        aiSummary: 'El prospecto preguntó precio base, recibió respuesta y contestó con evasiva. Sistema encoló re-contactación automática a 24h en Redis.',
        suggestedNextAction: 'Esperar trigger automático de 24 horas con testimonio y caso de éxito.',
      },
      dictamen: '<b>Lead Frío:</b> Preguntó precio y pausó con evasiva.<br><b>Protocolo:</b> Re-contactación asíncrona programada exactamente tras 24 horas de inactividad.',
      messages: [
        {
          id: 1,
          sender: 'Carlos Mendoza Jr.',
          text: 'Buenas, ¿cuánto cuesta la limpieza con ultrasonido?',
          isUser: true,
          time: 'Ayer, 04:10 PM',
        },
        {
          id: 2,
          sender: 'Sub-Bot RAG (IA)',
          text: '¡Hola Carlos! La profilaxis ultrasónica tiene un costo de $850 MXN e incluye pulido dental y diagnóstico digital.',
          isBot: true,
          time: 'Ayer, 04:10 PM',
        },
        {
          id: 3,
          sender: 'Carlos Mendoza Jr.',
          text: 'Ok gracias, lo voy a pensar.',
          isUser: true,
          time: 'Ayer, 04:12 PM',
        },
        {
          id: 4,
          sender: 'Sistema Redis Queue',
          text: '⏱️ Tarea encolada: LEAD_COLD_24H follow-up programado para hoy a las 16:12 hrs.',
          isWarning: true,
          time: 'Ayer, 04:12 PM',
        },
      ],
    },
  });

  // Meta Posts & Live Comments Stream Mock Data
  const [metaPosts] = useState([
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

  const [metaComments] = useState([
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

  const currentChat = threads[activeContact] || threads.ana;

  // Calculate qualified leads count
  const billableCount = Object.values(threads).filter(
    (t) => t.leadState === LEAD_STATUS_ENUM.BILLABLE_LEAD
  ).length;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'Operador Humano (Sutura Arcángel)',
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
      'Sutura Arcángel Despachada',
      `El mensaje ha sido inyectado directamente en la conversación de <strong>${currentChat.name}</strong> sin fricción.`
    );
  };

  const handleApplySuggestedAction = () => {
    if (!currentChat.customerNeeds?.suggestedNextAction) return;
    setInputMessage(
      `Hola ${currentChat.name.split(' ')[0]}, ${currentChat.customerNeeds.suggestedNextAction}`
    );
  };

  const handleAssumeControl = () => {
    setIsBotPaused(!isBotPaused);
    triggerModal(
      isBotPaused ? 'Automatización Reactivada' : 'Sutura Arcángel Activada (Soberanía Humana)',
      isBotPaused
        ? 'El Lobo Vectorial ha reanudado la supervisión autónoma del chat.'
        : 'Has tomado el control manual ininterrumpido de este chat. El Lobo Vectorial pausó el bot para que intervengas quirúrgicamente.',
      () => {
        try {
          confetti({ particleCount: 30, spread: 50, colors: ['#E7F900', '#FFFFFF', '#8A95B6'] });
        } catch (e) {}
      },
      'Entendido'
    );
  };

  const handleShowDictamen = (lead) => {
    const target = lead || currentChat;
    setDrawerLead(target);
  };

  const handleApproveDrawerAppointment = (targetLead) => {
    const leadKey = Object.keys(threads).find((k) => threads[k].id === targetLead.id) || activeContact;
    setThreads((prev) => ({
      ...prev,
      [leadKey]: {
        ...prev[leadKey],
        leadState: LEAD_STATUS_ENUM.BILLABLE_LEAD,
        status: 'Calificado / BILLABLE_LEAD',
        statusType: 'success',
        billingAmount: 350.0,
        billingStatus: 'PENDING_INVOICE',
        criteriaAudit: {
          identityValidated: true,
          catalogIdentified: true,
          financialClarified: true,
          consentOrBooked: true,
        },
        capiEventId: prev[leadKey].capiEventId || `lead_${Date.now()}_sha256`,
        messages: [
          ...prev[leadKey].messages,
          {
            id: Date.now(),
            sender: 'Google Calendar API & Meta CAPI',
            text: '✅ Cita formal aprobada y sincronizada en Google Calendar. Evento Schedule transmitido vía Meta CAPI (SHA-256). Confirmación enviada al WhatsApp del cliente.',
            isWarning: true,
            time: 'Justo ahora',
          },
        ],
      },
    }));
    triggerModal(
      'Cita Confirmada & Atribuida en Google Calendar',
      `La cita con <strong>${targetLead.name}</strong> ha sido agendada con éxito en Google Calendar. Se emitió el evento a Meta CAPI y se registró la partida en <code>billing_ledger</code> ($350 MXN).`
    );
  };

  const handleInspectCapi = (lead) => {
    const target = lead || currentChat;
    setSelectedCapiLead(target);
  };

  const handleOpenLeadInChat = (key) => {
    setActiveContact(key);
    setViewMode('chat');
  };

  const handleAddFaqToRag = (commentText) => {
    triggerModal(
      'Pregunta Añadida a Base de Conocimiento RAG',
      `La duda recurrente: "<strong>${commentText}</strong>" fue clasificada y agregada al Pilar 3 (Crisis & FAQs) del negocio.`,
      () => {
        try {
          confetti({ particleCount: 25, spread: 45, colors: ['#E7F900', '#8A95B6', '#FFFFFF'] });
        } catch (e) {}
      },
      'Aceptar'
    );
  };

  // Helper to count verified criteria
  const getCriteriaCount = (audit) => {
    if (!audit) return 0;
    return Object.values(audit).filter(Boolean).length;
  };

  // Filter columns if user picks a specific filter chip
  const displayedColumns = KANBAN_COLUMNS_CONFIG.filter((col) => {
    if (selectedColumnFilter === 'ALL') return true;
    return col.id === selectedColumnFilter;
  });

  // Helper para renderizar la Tarjeta de Lead (Modo Kanban o Modo Cuadrícula Ejecutiva)
  const renderLeadCard = (leadKey, item, isExecutiveGrid = false) => {
    const critCount = getCriteriaCount(item.criteriaAudit);
    const isRisk = item.leadState === LEAD_STATUS_ENUM.HITL_INTERVENTION;
    const isBillable = item.leadState === LEAD_STATUS_ENUM.BILLABLE_LEAD;
    const isCompact = kanbanDensity === 'compact' && !isExecutiveGrid;

    return (
      <div
        key={leadKey}
        className={`${
          isExecutiveGrid
            ? 'p-4 space-y-3.5 bg-white dark:bg-zinc-950/85 border border-zinc-200 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm dark:shadow-md'
            : isCompact
            ? 'p-3 space-y-2'
            : 'p-4 space-y-3'
        } rounded-2xl transition-all font-mono text-xs group relative flex flex-col justify-between ${
          isRisk
            ? 'bg-rose-50/90 dark:bg-gradient-to-b dark:from-rose-950/40 dark:via-zinc-950 dark:to-zinc-950 border-2 border-rose-500 shadow-md ring-1 ring-rose-500/30'
            : isBillable
            ? 'bg-white dark:bg-zinc-900/90 border-2 border-lime-500/50 dark:border-neon/50 shadow-sm dark:shadow-[0_0_15px_rgba(229,255,0,0.12)] hover:border-lime-600 dark:hover:border-neon'
            : 'bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md dark:shadow-sm'
        }`}
      >
        <div className="space-y-3">
          {/* Card Top: Avatar, Nombre, Teléfono & Ticket */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div
                className={`${
                  isExecutiveGrid ? 'w-10 h-10 text-xl' : isCompact ? 'w-7 h-7 text-sm' : 'w-9 h-9 text-lg'
                } rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-inner`}
              >
                {item.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <h5
                  className={`font-heading font-black ${
                    isExecutiveGrid ? 'text-sm' : isCompact ? 'text-xs' : 'text-sm'
                  } text-zinc-900 dark:text-white truncate leading-tight`}
                >
                  {item.name}
                </h5>
                <span
                  className={`${
                    isExecutiveGrid ? 'text-[10px]' : isCompact ? 'text-[9px]' : 'text-[10px]'
                  } text-zinc-500 dark:text-zinc-400 block truncate font-mono mt-0.5`}
                >
                  {item.phone} {isExecutiveGrid && item.channel ? `• ${item.channel.split(' ')[0]}` : ''}
                </span>
              </div>
            </div>

            {/* Ticket Price Pill (Fondo oscuro con texto neon para contraste supremo en ambos modos) */}
            <span
              className={`px-2.5 py-1 rounded-xl bg-zinc-900 dark:bg-zinc-950 border border-neon/40 text-neon font-black font-mono ${
                isExecutiveGrid ? 'text-xs' : isCompact ? 'text-[10px]' : 'text-[11px]'
              } shrink-0 whitespace-nowrap shadow-sm`}
            >
              {item.potentialTicket}
            </span>
          </div>

          {/* Alerta Roja de Riesgo Crítico (HITL) */}
          {isRisk && (
            <div
              className={`${
                isCompact ? 'p-2 text-[10px]' : 'p-2.5 text-[11px]'
              } rounded-xl bg-rose-100/80 dark:bg-rose-500/15 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 font-bold flex items-center gap-2 shadow-inner`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="block leading-tight font-black truncate">
                  ALERTA HITL: Lenguaje Agresivo
                </span>
                <span className="text-[9px] text-rose-600/90 dark:text-rose-400/80 font-normal font-sans block truncate">
                  Lobo Vectorial pausó el bot para intervención humana
                </span>
              </div>
            </div>
          )}

          {/* Reloj Regresivo 24h para Leads Fríos / Templados */}
          {item.countdown24h && (
            <div
              className={`${
                isCompact ? 'p-1.5 text-[10px]' : 'p-2 text-[11px]'
              } flex items-center justify-between rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/25 text-blue-700 dark:text-blue-300 font-mono`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Ventana 24h:</span>
              </span>
              <span className="font-bold text-blue-900 dark:text-white bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded text-[9px] shrink-0">
                {item.countdown24h}
              </span>
            </div>
          )}

          {/* Indicador de Criterios de Calificación */}
          <div
            className={`${
              isCompact ? 'p-2 space-y-1' : 'p-2.5 space-y-1.5'
            } rounded-xl bg-zinc-50 dark:bg-black/60 border border-zinc-200 dark:border-zinc-800/80`}
          >
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Criterios de Calificación:</span>
              <span
                className={`font-black ${
                  critCount === 4 ? 'text-neon' : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {critCount}/4 Cumplidos
              </span>
            </div>

            {/* Barra de progreso de 4 segmentos */}
            <div className="grid grid-cols-4 gap-1 pt-0.5">
              <div
                title="C1: Identidad & Teléfono Verificado"
                className={`h-1.5 rounded-full transition-all ${
                  item.criteriaAudit?.identityValidated
                    ? 'bg-neon shadow-[0_0_6px_var(--neon-glow)]'
                    : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
              />
              <div
                title="C2: Interés Específico en Catálogo"
                className={`h-1.5 rounded-full transition-all ${
                  item.criteriaAudit?.catalogIdentified
                    ? 'bg-neon shadow-[0_0_6px_var(--neon-glow)]'
                    : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
              />
              <div
                title="C3: Aclaración Financiera (Precios / MSI)"
                className={`h-1.5 rounded-full transition-all ${
                  item.criteriaAudit?.financialClarified
                    ? 'bg-neon shadow-[0_0_6px_var(--neon-glow)]'
                    : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
              />
              <div
                title="C4: Consentimiento Explícito o Cita Agendada"
                className={`h-1.5 rounded-full transition-all ${
                  item.criteriaAudit?.consentOrBooked
                    ? 'bg-neon shadow-[0_0_6px_var(--neon-glow)]'
                    : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
              />
            </div>
          </div>

          {/* Extracto del Último Mensaje (Estilo Globo de Chat) */}
          <div
            className={`${
              isCompact ? 'p-2 text-[10px]' : 'p-2.5 text-[11px]'
            } rounded-xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-sans italic relative`}
          >
            <p className="line-clamp-2 leading-relaxed">
              "{item.messages[item.messages.length - 1]?.text}"
            </p>
          </div>
        </div>

        {/* Botones de Acción Táctica */}
        <div className="pt-2 space-y-1.5 mt-auto">
          <button
            type="button"
            onClick={() => handleOpenLeadInChat(leadKey)}
            className={`w-full ${
              isCompact ? 'py-1.5 px-2 text-[11px]' : 'py-2 px-3 text-xs'
            } rounded-xl font-bold font-mono flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm ${
              isRisk
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-neon hover:text-black text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            <Zap className="w-3 h-3 text-neon group-hover:text-black transition-colors shrink-0" />
            <span className="truncate">
              {isRisk ? 'Sutura Inmediata' : 'Intervenir Chat'}
            </span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleShowDictamen(item)}
              className={`flex-1 ${
                isCompact ? 'py-1 px-1.5 text-[9px]' : 'py-1.5 px-2 text-[10px]'
              } rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/80 font-bold font-mono flex items-center justify-center gap-1 transition-colors`}
            >
              <FileText className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span className="truncate">Dictamen</span>
            </button>

            {isBillable && (
              <button
                type="button"
                onClick={() => handleInspectCapi(item)}
                className={`${
                  isCompact ? 'py-1 px-1.5 text-[9px]' : 'py-1.5 px-2 text-[10px]'
                } rounded-xl bg-neon/15 hover:bg-neon hover:text-black text-neon border border-neon/40 font-black font-mono flex items-center justify-center gap-1 transition-colors shadow-sm`}
                title="Inspeccionar Evento Meta CAPI"
              >
                <Hash className="w-3 h-3 shrink-0" />
                <span className="truncate">CAPI Hash</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6 max-w-[1920px] mx-auto">
      {/* ========================================================================= */}
      {/* 1. HEADER PRINCIPAL Y CENTRO DE MANDO HITL                                */}
      {/* ========================================================================= */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/15 text-neon border border-neon/30 text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            <Bot className="w-3.5 h-3.5" />
            Supervisión HITL • Triage Operativo en Tiempo Real
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            Tablero de Triage <span className="text-neon">& Sutura Arcángel</span>
          </h2>
          <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Gobernanza multitenant con Lobo Vectorial: Matriz de temperatura determinista, protocolo de re-contactación a 24 horas y motor de atribución Server-to-Server (Meta CAPI).
          </p>
        </div>

        {/* Tab Switcher: Chats vs Meta Graph */}
        <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-950/90 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-mono text-xs shrink-0 shadow-sm dark:shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('chats')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'chats'
                ? 'bg-neon text-black shadow-neon-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Triage Conversacional ({Object.keys(threads).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('meta_comments')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'meta_comments'
                ? 'bg-neon text-black shadow-neon-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Instagram className="w-4 h-4 text-pink-500 dark:text-pink-400" />
            <span>Meta Graph Stream</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BARRA DE CONTROL DE VISTA Y TELEMETRÍA (CENTRADA Y BALANCEADA)         */}
      {/* ========================================================================= */}
      {activeTab === 'chats' && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 p-3 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 font-mono text-xs shadow-sm dark:shadow-md w-full">
          {/* Indicadores Operativos Rápidos (Centrados) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-neon shadow-[0_0_8px_var(--neon-glow)]" />
              <span className="text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider font-bold">
                Leads Activos: <span className="text-zinc-900 dark:text-white font-black">{Object.keys(threads).length}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-lime-500" />
              <span className="text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider font-bold">
                Calificados: <span className="text-neon font-black">{billableCount}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider font-bold">
                Intervención HITL: <span className="text-rose-600 dark:text-rose-400 font-black">{Object.values(threads).filter((t) => t.leadState === LEAD_STATUS_ENUM.HITL_INTERVENTION).length}</span>
              </span>
            </div>
          </div>

          {/* Divisor Visual Central (Desktop) */}
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block" />

          {/* Selector de Densidad y Modo de Vista (Centrados) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* Control de Densidad (Solo activo en modo Kanban) */}
            {viewMode === 'kanban' && (
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-black/70 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono shadow-inner">
                <button
                  type="button"
                  onClick={() => setKanbanDensity('compact')}
                  title="Vista Compacta: Permite ver más columnas y tarjetas a la vez en pantalla"
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    kanbanDensity === 'compact'
                      ? 'bg-neon text-black shadow-neon-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Compacto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setKanbanDensity('standard')}
                  title="Vista Estándar: Mayor ancho y espaciado"
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    kanbanDensity === 'standard'
                      ? 'bg-neon text-black shadow-neon-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Estándar</span>
                </button>
              </div>
            )}

            {/* Selector de Modo de Vista */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-black/70 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-neon text-black shadow-neon-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Kanban className="w-4 h-4" />
                <span>Tablero Kanban</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('chat')}
                className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  viewMode === 'chat'
                    ? 'bg-neon text-black shadow-neon-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <LayoutList className="w-4 h-4" />
                <span>Bandeja Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VISTA KANBAN RESPONSIVA DE ALTA DENSIDAD CON ESPACIO ÓPTIMO            */}
      {/* ========================================================================= */}
      {activeTab === 'chats' && viewMode === 'kanban' && (
        <div className="space-y-4">
          {/* Barra de Filtro Rápido / Navegación de Columnas (Centrada y Balanceada) */}
          <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-auto pb-1 pt-1 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              <span className="text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-wider font-bold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filtrar:
              </span>

              <button
                type="button"
                onClick={() => setSelectedColumnFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-all font-bold ${
                  selectedColumnFilter === 'ALL'
                    ? 'bg-neon text-black shadow-neon-sm'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                Todas ({Object.keys(threads).length})
              </button>

              {KANBAN_COLUMNS_CONFIG.map((col) => {
                const count = Object.values(threads).filter(
                  (t) => t.leadState === col.id
                ).length;
                const isSelected = selectedColumnFilter === col.id;

                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedColumnFilter(col.id)}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 font-bold ${
                      isSelected
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-sm'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                    <span>{col.title.split('/')[0].trim()}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-200/80 dark:bg-black/40 text-zinc-800 dark:text-zinc-300">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Si se seleccionó una categoría específica: VISTA TARJETAS EJECUTIVAS EN FILAS (GRID EXPANSIVO) */}
          {selectedColumnFilter !== 'ALL' ? (
            <div className="space-y-4 animate-fade-in">
              {displayedColumns.map((col) => {
                const leadsInCol = Object.entries(threads).filter(
                  ([_, item]) => item.leadState === col.id
                );

                return (
                  <div key={col.id} className="space-y-4">
                    {/* Banner Ejecutivo de la Clasificación */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm dark:shadow-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-3.5 h-3.5 rounded-full ${col.dotColor} shadow-[0_0_12px_currentColor] shrink-0`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-heading font-black uppercase text-zinc-900 dark:text-white tracking-wider">
                              {col.title}
                            </h3>
                            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-neon font-mono">
                              {leadsInCol.length} {leadsInCol.length === 1 ? 'Prospecto' : 'Prospectos'}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans mt-0.5">
                            {col.description}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedColumnFilter('ALL')}
                        className="px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-zinc-700/80 text-xs font-mono font-bold flex items-center gap-2 transition-colors shrink-0"
                      >
                        <Kanban className="w-3.5 h-3.5 text-neon" />
                        <span>Ver Tablero Completo (5 Columnas)</span>
                      </button>
                    </div>

                    {/* Cuadrícula Ejecutiva: Se expande en filas y múltiples columnas */}
                    {leadsInCol.length === 0 ? (
                      <div className="p-12 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-dashed border-zinc-200 dark:border-zinc-800 text-center font-mono text-xs text-zinc-500 space-y-1">
                        <span>Sin conversaciones en esta clasificación</span>
                        <span className="text-[10px] text-zinc-600">Embudo libre</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                        {leadsInCol.map(([leadKey, item]) =>
                          renderLeadCard(leadKey, item, true)
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Lienzo Kanban Horizontal con Ancho Adaptativo (Modo Todas las Columnas) */
            <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-1 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700/60 scrollbar-track-zinc-100 dark:scrollbar-track-zinc-950/20 snap-x items-start">
              {displayedColumns.map((col) => {
                const leadsInCol = Object.entries(threads).filter(
                  ([_, item]) => item.leadState === col.id
                );
                const isCompact = kanbanDensity === 'compact';

                // Accent color borders
                const getColumnAccent = () => {
                  switch (col.id) {
                    case LEAD_STATUS_ENUM.LEAD_COLD_24H:
                      return 'from-blue-500 to-cyan-500';
                    case LEAD_STATUS_ENUM.LEAD_WARM_24H:
                      return 'from-amber-400 to-yellow-500';
                    case LEAD_STATUS_ENUM.LEAD_HOT_PREQUAL:
                      return 'from-orange-500 to-amber-500';
                    case LEAD_STATUS_ENUM.BILLABLE_LEAD:
                      return 'from-neon to-lime-400';
                    case LEAD_STATUS_ENUM.HITL_INTERVENTION:
                      return 'from-rose-500 to-red-600';
                    default:
                      return 'from-zinc-500 to-zinc-700';
                  }
                };

                return (
                  <div
                    key={col.id}
                    className={`${
                      isCompact
                        ? 'min-w-[260px] max-w-[280px] w-[270px]'
                        : 'min-w-[320px] max-w-[350px] w-[340px]'
                    } flex-shrink-0 flex flex-col rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/90 shadow-sm dark:shadow-xl backdrop-blur-md relative overflow-hidden snap-start transition-all`}
                  >
                    {/* Top Accent Stripe */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${getColumnAccent()}`} />

                    {/* Header de la Columna */}
                    <div className={`${isCompact ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} border-b border-zinc-100 dark:border-zinc-800/80 font-mono`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-2 h-2 rounded-full ${col.dotColor} shadow-[0_0_8px_currentColor] shrink-0`} />
                          <h4 className={`${isCompact ? 'text-[11px]' : 'text-xs'} font-heading font-black uppercase text-zinc-900 dark:text-white tracking-wider truncate`}>
                            {col.title}
                          </h4>
                        </div>
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white shrink-0">
                          {leadsInCol.length}
                        </span>
                      </div>

                      <p className={`${isCompact ? 'text-[10px]' : 'text-[11px]'} text-zinc-500 dark:text-zinc-400 font-sans leading-tight line-clamp-1`}>
                        {col.description}
                      </p>
                    </div>

                    {/* Lista de Tarjetas de Leads dentro de la Columna */}
                    <div className={`${isCompact ? 'p-2 space-y-2.5 max-h-[calc(100vh-280px)] min-h-[440px]' : 'p-3 space-y-3 max-h-[calc(100vh-320px)] min-h-[460px]'} flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-transparent`}>
                      {leadsInCol.length === 0 ? (
                        <div className="h-36 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center p-3 text-center font-mono text-xs text-zinc-400 dark:text-zinc-500 space-y-1">
                          <span>Sin conversaciones</span>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-600">Embudo libre</span>
                        </div>
                      ) : (
                        leadsInCol.map(([leadKey, item]) =>
                          renderLeadCard(leadKey, item, false)
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VISTA DETALLE CHAT: BANDEJA DE INTERVENCIÓN Y SUTURA ARCÁNGEL           */}
      {/* ========================================================================= */}
      {activeTab === 'chats' && viewMode === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Columna Izquierda: Lista de Contactos (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 p-4 flex flex-col h-[740px] shadow-sm dark:shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center justify-between font-mono">
              <span>Bandeja de Intervención</span>
              <span className="text-[10px] bg-neon text-black px-2.5 py-0.5 rounded-full font-black">
                {Object.keys(threads).length} EN MONITOREO
              </span>
            </h3>

            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 scrollbar-thin">
              {Object.entries(threads).map(([key, item]) => {
                const isSelected = activeContact === key;
                const critCount = getCriteriaCount(item.criteriaAudit);
                const isRisk = item.leadState === LEAD_STATUS_ENUM.HITL_INTERVENTION;

                return (
                  <div
                    key={key}
                    onClick={() => setActiveContact(key)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-lime-50/60 dark:bg-zinc-900 border-2 border-lime-500 dark:border-neon shadow-sm dark:shadow-[0_0_20px_var(--neon-glow)]'
                        : isRisk
                        ? 'bg-rose-50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-500/50 hover:border-rose-400'
                        : 'bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-heading font-black text-xs text-zinc-900 dark:text-white flex items-center gap-2 truncate">
                        <span>{item.avatar}</span>
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                          isRisk
                            ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40'
                            : item.leadState === LEAD_STATUS_ENUM.BILLABLE_LEAD
                            ? 'bg-neon/15 text-neon border border-neon/30'
                            : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {item.status.split('/')[0].trim()}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate font-sans">
                      {item.messages[item.messages.length - 1]?.text}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-zinc-500 border-t border-zinc-200 dark:border-zinc-800/60">
                      <span>{item.channel}</span>
                      <span className="text-neon font-black">
                        {item.leadState === LEAD_STATUS_ENUM.BILLABLE_LEAD
                          ? 'CALIFICADO'
                          : `${critCount}/4 Criterios`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Visor de Chat + Auditoría Booleana + Macros (8 cols) */}
          <div className="lg:col-span-8 space-y-4 flex flex-col h-[740px]">
            {/* Barra Superior: 4 Criterios de Calificación del Prospecto */}
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-lime-500/40 dark:border-neon/40 space-y-3 font-mono text-xs shadow-sm dark:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-neon/20 text-neon border border-neon/30">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <span className="text-xs text-neon font-black uppercase tracking-wider">
                    Criterios de Calificación del Prospecto (4 Criterios)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {currentChat.leadState === LEAD_STATUS_ENUM.BILLABLE_LEAD ? (
                    <span className="px-3 py-1 rounded-lg bg-neon text-black font-black text-xs shadow-neon flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      LEAD CALIFICADO
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs">
                      Estado: {currentChat.leadState}
                    </span>
                  )}

                  {currentChat.capiPayload && (
                    <button
                      type="button"
                      onClick={() => handleInspectCapi(currentChat)}
                      className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-cyan-600 dark:text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
                    >
                      <Hash className="w-3.5 h-3.5" />
                      Ver Payload CAPI
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Cajas de Criterios Booleanos AND */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                {QUALIFIED_LEAD_CRITERIA.map((crit) => {
                  const isPassed = currentChat.criteriaAudit?.[crit.key];
                  return (
                    <div
                      key={crit.id}
                      className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-all ${
                        isPassed
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-sm'
                          : 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500'
                      }`}
                    >
                      {isPassed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-400 dark:text-zinc-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-[11px] font-bold block leading-tight">
                          {crit.label}
                        </span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans leading-tight mt-0.5 block">
                          {crit.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ventana de Conversación Interactiva */}
            <div className="rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 p-5 flex flex-col flex-1 overflow-hidden shadow-sm dark:shadow-lg">
              {/* Header de la Conversación */}
              <div className="flex flex-wrap justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-3 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xl shrink-0">
                    {currentChat.avatar}
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                      <span>{currentChat.name}</span>
                      {isBotPaused && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40 font-bold">
                          SUTURA ARCÁNGEL (HUMANO ACTIVO)
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                      {currentChat.phone} • {currentChat.channel} • Email: {currentChat.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleShowDictamen(currentChat)}
                    className="text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-3.5 py-2 rounded-xl hover:border-lime-500 text-zinc-800 dark:text-white transition-colors flex items-center gap-1.5 font-mono font-bold"
                  >
                    <FileText className="w-3.5 h-3.5 text-neon" />
                    <span>Ver Dictamen</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAssumeControl}
                    className={`text-xs px-4 py-2 rounded-xl font-bold font-mono transition-colors shadow-sm flex items-center gap-1.5 ${
                      isBotPaused
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{isBotPaused ? 'Reanudar IA' : 'Sutura Arcángel'}</span>
                  </button>
                </div>
              </div>

              {/* Mensajes del Hilo */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-zinc-50/70 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl mb-3 text-xs scrollbar-thin">
                {currentChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl max-w-[85%] leading-relaxed ${
                      msg.isUser
                        ? msg.isDanger
                          ? 'bg-rose-100/90 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/60 text-rose-950 dark:text-white shadow-xs'
                          : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                        : msg.isBot
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200 ml-auto text-right'
                        : msg.isWarning
                        ? 'bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 ml-auto text-right'
                        : 'bg-neon/20 dark:bg-neon/15 border border-lime-600 dark:border-neon text-zinc-900 dark:text-white ml-auto text-right'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span
                        className={`text-[9px] font-mono uppercase font-bold ${
                          msg.isUser
                            ? msg.isDanger
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-zinc-500 dark:text-zinc-400'
                            : msg.isBot
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : msg.isWarning
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-neon'
                        }`}
                      >
                        {msg.sender}
                      </span>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono">
                        {msg.time}
                      </span>
                    </div>
                    <p className="font-sans text-xs">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Barra de Entrada y Macros 1-Clic */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                  <span className="text-zinc-500 font-bold">Macros Sutura Arcángel:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setInputMessage(
                        '¡Hola! Te comparto el enlace directo a nuestra agenda para que elijas tu horario: https://agenda.vectorinside.com/'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    📅 Enviar Link Agenda
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setInputMessage(
                        'Entendemos tu inquietud. Cuentas con nuestra garantía de satisfacción total y plan de meses sin intereses.'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    🛡️ Garantía & MSI
                  </button>
                  <button
                    type="button"
                    onClick={handleApplySuggestedAction}
                    className="px-2.5 py-1 rounded-lg bg-neon/15 hover:bg-neon hover:text-black text-neon border border-neon/30 transition-colors font-bold"
                  >
                    💡 Acción Sugerida IA
                  </button>
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Escribe una respuesta quirúrgica como operador humano..."
                    className="flex-1 bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-neon font-sans placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                  <button
                    type="submit"
                    className="bg-neon text-black text-xs font-bold px-5 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-neon flex items-center gap-1.5 font-mono active:scale-95 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PESTAÑA META GRAPH STREAM (REELS, PUBLICACIONES Y COMENTARIOS)         */}
      {/* ========================================================================= */}
      {activeTab === 'meta_comments' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Meta Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Hook Rate Promedio (3s)</span>
              <p className="text-2xl font-black text-neon">46.8%</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+12% vs benchmark</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Comentarios Analizados</span>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">128</p>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Últimas 24 horas</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">DMs Disparados Automáticos</span>
              <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">42</p>
              <span className="text-[10px] text-cyan-700 dark:text-cyan-500">Conversión a Chat: 32.8%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Sentimiento de Comunidad</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">96%</p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-500">Filtro de Toxicidad Activo</span>
            </div>
          </div>

          {/* Posts & Reels Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-500" />
              <span>Publicaciones & Reels Activos en Meta</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metaPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-3 font-mono text-xs shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-500/30">
                      {post.type} • {post.platform}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{post.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">{post.title}</h4>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px]">
                    <div>
                      <span className="text-zinc-400 dark:text-zinc-500 block text-[9px]">Alcance:</span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-bold">{post.reach}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 dark:text-zinc-500 block text-[9px]">Hook Rate:</span>
                      <span className="text-neon font-bold">{post.hookRate}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 dark:text-zinc-500 block text-[9px]">DMs Creados:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{post.dmsTriggered}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Meta Comments Feed */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <MessageSquareWarning className="w-4 h-4 text-neon" />
                <span>Feed de Comentarios en Vivo & Acciones Automatizadas</span>
              </h3>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Sincronizado vía Meta Webhooks
              </span>
            </div>

            <div className="space-y-3">
              {metaComments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 font-mono text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neon">{comm.author}</span>
                      <span className="text-zinc-500">en {comm.postRef}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{comm.time}</span>
                  </div>

                  <p className="text-zinc-900 dark:text-white text-xs font-sans bg-white dark:bg-black/40 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    "{comm.text}"
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[10px]">
                    <div className="space-y-0.5">
                      <span className="text-zinc-500 dark:text-zinc-400">Acción IA: </span>
                      <span className="text-cyan-700 dark:text-cyan-300 font-sans font-medium">{comm.aiAction}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-medium">
                        {comm.sentiment}
                      </span>
                      {comm.status === 'Retroalimentar a FAQ RAG' && (
                        <button
                          type="button"
                          onClick={() => handleAddFaqToRag(comm.text)}
                          className="px-2.5 py-1 rounded bg-neon text-black font-bold flex items-center gap-1 hover:bg-[var(--neon-hover)] transition-colors shadow-sm"
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

      {/* ========================================================================= */}
      {/* 6. MODAL AUDITOR: META CAPI SERVER-TO-SERVER & BILLING LEDGER PROOF       */}
      {/* ========================================================================= */}
      {selectedCapiLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-neon/50 shadow-2xl p-6 sm:p-8 relative space-y-4 font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-neon tracking-wider flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" />
                  Auditoría Criptográfica Server-to-Server (Meta CAPI)
                </span>
                <h3 className="text-lg font-heading font-black text-zinc-900 dark:text-white">
                  Payload de Conversión S2S: {selectedCapiLead.name}
                </h3>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  Despachado unívocamente tras cumplir 4/4 criterios booleanos AND sin cookies de navegador.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCapiLead(null)}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Metadatos del Evento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-500 block">Evento Graph:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Lead (Conversion)</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-500 block">Event ID (UUID v4):</span>
                <span className="text-zinc-900 dark:text-white font-bold">{selectedCapiLead.capiEventId || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-500 block">Tarifa Lead:</span>
                <span className="text-neon font-black">$350.00 MXN</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-500 block">Estado Ledger:</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">PENDING_INVOICE</span>
              </div>
            </div>

            {/* Bloque JSON S2S Payload */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold">
                Payload JSON Server-to-Server (Datos de Contacto Hasheados con SHA-256):
              </span>
              <pre className="p-4 rounded-xl bg-zinc-900 dark:bg-black border border-zinc-800 text-[11px] text-emerald-300 overflow-x-auto leading-relaxed shadow-inner">
                {JSON.stringify(
                  {
                    data: [
                      selectedCapiLead.capiPayload || {
                        event_name: 'Lead',
                        event_time: 1772381000,
                        event_id: selectedCapiLead.capiEventId,
                        action_source: 'system_generated',
                        user_data: {
                          em: ['sha256_hashed_email_string'],
                          ph: ['sha256_hashed_phone_e164'],
                          fn: ['sha256_hashed_first_name'],
                        },
                        custom_data: {
                          currency: 'MXN',
                          value: 0.0,
                          lead_type: 'BILLABLE_LEAD',
                        },
                      },
                    ],
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* Sentencia SQL de Inserción en Ledger */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold">
                Registro Transaccional en Base de Datos (billing_ledger):
              </span>
              <pre className="p-3.5 rounded-xl bg-zinc-900 dark:bg-black border border-zinc-800 text-[10px] text-cyan-300 overflow-x-auto shadow-inner">
{`INSERT INTO billing_ledger (id, tenant_id, lead_id, amount, status, created_at)
VALUES (
  gen_random_uuid(),
  '${activeTenant?.id || 'dental'}',
  '${selectedCapiLead.id}',
  350.00,
  'PENDING_INVOICE',
  NOW()
);`}
              </pre>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedCapiLead(null)}
                className="px-6 py-2.5 rounded-xl bg-neon text-black font-bold hover:bg-[var(--neon-hover)] transition-all shadow-neon font-mono text-xs"
              >
                Cerrar Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ficha Dictamen Pre-Cita (Drawer Lateral de Alta Fidelidad) */}
      <PreCitaDrawer
        isOpen={!!drawerLead}
        lead={drawerLead}
        onClose={() => setDrawerLead(null)}
        onApproveAppointment={handleApproveDrawerAppointment}
        onOpenChat={(l) => {
          const k = Object.keys(threads).find((x) => threads[x].id === l.id);
          if (k) {
            setActiveContact(k);
            setViewMode('chat');
          }
        }}
      />
    </div>
  );
};
