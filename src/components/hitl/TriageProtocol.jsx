'use client';

import React, { useState, useEffect } from 'react';
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
  Reply,
  CornerDownRight,
  Radio,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  LEAD_STATUS_ENUM,
  KANBAN_COLUMNS_CONFIG,
  QUALIFIED_LEAD_CRITERIA,
} from '@/utils/constants';
import { REENGAGEMENT_QUEUE_MOCK } from '@/utils/mockData';
import { PreCitaDrawer } from './PreCitaDrawer';
import { Portal } from '@/components/common/Portal';
import { cleanConcept } from '@/utils/formatters';

// Multi-tenant canonical matrices for Meta stream & 24h re-engagement
const CANONICAL_META_POSTS_BY_TENANT = {
  dental: [
    {
      id: 'post-dent-01',
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
      id: 'post-dent-02',
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
  ],
  polanco: [
    {
      id: 'post-pol-01',
      platform: 'instagram',
      type: 'Reel',
      title: 'El Corte Tomahawk Flameado en Mesa que Conquistó Polanco 🔥🥩',
      date: 'Publicado hace 2 horas',
      reach: '22,400 reproducciones',
      hookRate: '52.1%',
      commentsCount: 56,
      dmsTriggered: 31,
      sentiment: '97% Positivo',
    },
    {
      id: 'post-pol-02',
      platform: 'instagram',
      type: 'Carrusel',
      title: 'Noches de Terraza VIP & Coctelería de Autor bajo las Estrellas 🍸✨',
      date: 'Publicado ayer',
      reach: '12,300 visualizaciones',
      hookRate: '45.0%',
      commentsCount: 29,
      dmsTriggered: 18,
      sentiment: '96% Positivo',
    },
  ],
  urban: [
    {
      id: 'post-urb-01',
      platform: 'instagram',
      type: 'Reel',
      title: 'DROP EXCLUSIVO: Cyberpunk Sneaker Collection 👟⚡ Solo 50 pares en México',
      date: 'Publicado hace 1 hora',
      reach: '38,900 reproducciones',
      hookRate: '58.4%',
      commentsCount: 92,
      dmsTriggered: 64,
      sentiment: '95% Positivo',
    },
    {
      id: 'post-urb-02',
      platform: 'instagram',
      type: 'Carrusel',
      title: 'Lookbook Otoño/Invierno: Hoodies Oversize & Pantalones Cargo Reflectivos 🖤',
      date: 'Publicado ayer',
      reach: '19,100 visualizaciones',
      hookRate: '49.8%',
      commentsCount: 41,
      dmsTriggered: 27,
      sentiment: '93% Positivo',
    },
  ],
  corp: [
    {
      id: 'post-corp-01',
      platform: 'instagram',
      type: 'Reel',
      title: 'Cómo Reducir 70% el Costo de Adquisición B2B con IA y CAPI Server-to-Server 📊🤖',
      date: 'Publicado hace 4 horas',
      reach: '11,200 reproducciones',
      hookRate: '44.3%',
      commentsCount: 22,
      dmsTriggered: 16,
      sentiment: '98% Positivo',
    },
    {
      id: 'post-corp-02',
      platform: 'instagram',
      type: 'Carrusel',
      title: 'Arquitectura Multi-Tenant Vector: Aislamiento Criptográfico y Cero Fuga de Leads 🛡️',
      date: 'Publicado ayer',
      reach: '8,700 visualizaciones',
      hookRate: '42.0%',
      commentsCount: 18,
      dmsTriggered: 11,
      sentiment: '99% Positivo',
    },
  ],
};

const CANONICAL_META_COMMENTS_BY_TENANT = {
  dental: [
    {
      id: 'comm-dent-01',
      author: '@carlos_garcia92',
      postRef: 'Reel: 3 Secretos para Cuidar tu Sonrisa',
      text: '¿Cuánto cuesta la primera consulta de valoración?',
      intent: 'Pregunta de Precio / Cita',
      aiAction: 'Auto-DM Enviado con Oferta Activa ("Diagnóstico 3D Gratis")',
      sentiment: 'Conversión Directa',
      status: 'Resuelto por IA',
      time: 'Hace 12 min',
      category: 'LEAD',
    },
    {
      id: 'comm-dent-02',
      author: '@valeria.design',
      postRef: 'Reel: 3 Secretos para Cuidar tu Sonrisa',
      text: 'VALORACION',
      intent: 'Palabra Clave de Lead Magnet',
      aiAction: 'Trigger Activado -> DM despachado en 4s con enlace a Google Calendar',
      sentiment: 'Conversión Directa',
      status: 'Resuelto por IA',
      time: 'Hace 28 min',
      category: 'LEAD',
    },
    {
      id: 'comm-dent-03',
      author: '@javier_mtz',
      postRef: 'Carrusel: Caso de Éxito',
      text: '¿Aceptan seguros de gastos médicos mayores?',
      intent: 'Duda de Cobertura / FAQ',
      aiAction: 'Respuesta pública en hilo: "¡Hola Javier! Sí, trabajamos con GNP, MetLife y AXA. Te enviamos los detalles por mensaje."',
      sentiment: 'Informativo',
      status: 'Retroalimentar a FAQ RAG',
      time: 'Hace 1 hora',
      category: 'FAQ',
    },
    {
      id: 'comm-dent-04',
      author: '@pedro_hater88',
      postRef: 'Reel: 3 Secretos para Cuidar tu Sonrisa',
      text: 'Puros precios inflados seguro no sirve para nada',
      intent: 'Hate / Trolling',
      aiAction: 'Comentario Ocultado Automáticamente por Filtro de Toxicidad (Regla Inviolable)',
      sentiment: 'Tóxico (Bloqueado)',
      status: 'Ocultado por Toxicidad',
      time: 'Hace 2 horas',
      category: 'TOXIC',
    },
  ],
  polanco: [
    {
      id: 'comm-pol-01',
      author: '@gourmet_foodie_mx',
      postRef: 'Reel: Tomahawk Flameado en Mesa',
      text: '¿Tienen disponibilidad de mesa en terraza para este sábado 9:00 PM?',
      intent: 'Reserva Inmediata (High Ticket)',
      aiAction: 'Auto-DM Enviado con Menú Tasting y Enlace de Reserva con Depósito Stripe',
      sentiment: 'Conversión Directa',
      status: 'Resuelto por IA',
      time: 'Hace 8 min',
      category: 'LEAD',
    },
    {
      id: 'comm-pol-02',
      author: '@patricia_art_cdmx',
      postRef: 'Carrusel: Noches de Terraza VIP',
      text: 'RESERVA',
      intent: 'Palabra Clave de Lead Magnet',
      aiAction: 'Trigger Activado -> DM despachado en 3s con Coctel de Bienvenida de Cortesía',
      sentiment: 'Conversión Directa',
      status: 'Resuelto por IA',
      time: 'Hace 19 min',
      category: 'LEAD',
    },
    {
      id: 'comm-pol-03',
      author: '@enrique_sommelier',
      postRef: 'Reel: Tomahawk Flameado en Mesa',
      text: '¿Manejan descorche de vino y cuál es la cuota?',
      intent: 'Duda de Políticas / FAQ',
      aiAction: 'Respuesta en hilo: "¡Hola Enrique! Sí, $650 MXN por botella de hasta 750ml."',
      sentiment: 'Informativo',
      status: 'Retroalimentar a FAQ RAG',
      time: 'Hace 45 min',
      category: 'FAQ',
    },
    {
      id: 'comm-pol-04',
      author: '@troll_restaurantero',
      postRef: 'Carrusel: Noches de Terraza VIP',
      text: 'Lugar pésimo pésimo carísimo y no vale un centavo no vayan',
      intent: 'Ataque Reputacional Fake',
      aiAction: 'Comentario Ocultado Automáticamente por Filtro de Toxicidad',
      sentiment: 'Tóxico (Bloqueado)',
      status: 'Ocultado por Toxicidad',
      time: 'Hace 3 horas',
      category: 'TOXIC',
    },
  ],
  urban: [
    {
      id: 'comm-urb-01',
      author: '@sneakerhead_99',
      postRef: 'Reel: DROP EXCLUSIVO Cyberpunk',
      text: '¿Tienen en talla 27.5 MX y cuánto es con envío a Monterrey?',
      intent: 'Intención de Compra Calzada',
      aiAction: 'Auto-DM Enviado con Link de Pago Directo Kueski/Stripe y Envío Gratis',
      sentiment: 'Conversión Directa',
      status: 'Resuelto por IA',
      time: 'Hace 5 min',
      category: 'LEAD',
    },
    {
      id: 'comm-urb-02',
      author: '@alan_skate',
      postRef: 'Reel: DROP EXCLUSIVO Cyberpunk',
      text: 'DROP',
      intent: 'Palabra Clave de Lead Magnet',
      aiAction: 'Trigger Activado -> DM con Código de Descuento 10% First Drop despachado',
      sentiment: 'Conversión Directa',
      status: 'Resuelto por IA',
      time: 'Hace 15 min',
      category: 'LEAD',
    },
    {
      id: 'comm-urb-03',
      author: '@andrea_style',
      postRef: 'Carrusel: Lookbook Otoño/Invierno',
      text: '¿De qué material es la hoodie oversize? ¿Es 100% algodón?',
      intent: 'Especificación de Producto / FAQ',
      aiAction: 'Respuesta en hilo: "¡Hola Andrea! Algodón francés peinado 450 GSM de alto gramaje."',
      sentiment: 'Informativo',
      status: 'Retroalimentar a FAQ RAG',
      time: 'Hace 35 min',
      category: 'FAQ',
    },
    {
      id: 'comm-urb-04',
      author: '@bot_spam_crypto',
      postRef: 'Reel: DROP EXCLUSIVO Cyberpunk',
      text: 'Buy free crypto now click link in my bio guaranteed 100x return',
      intent: 'Spam Bot Malicioso',
      aiAction: 'Comentario Ocultado y Usuario Baneado Automáticamente',
      sentiment: 'Tóxico (Bloqueado)',
      status: 'Ocultado por Toxicidad',
      time: 'Hace 1 hora',
      category: 'TOXIC',
    },
  ],
  corp: [
    {
      id: 'comm-corp-01',
      author: '@miguel_fintech_cto',
      postRef: 'Reel: Reducir 70% CAC B2B',
      text: '¿Cómo garantizan que la API no tenga latencia mayor a 500ms en el webhook?',
      intent: 'Evaluación Técnica Lead B2B',
      aiAction: 'Auto-DM Enviado con Arquitectura Técnica y Acceso a Sandbox API',
      sentiment: 'Conversión Directa',
      status: 'Resuelto por IA',
      time: 'Hace 10 min',
      category: 'LEAD',
    },
    {
      id: 'comm-corp-02',
      author: '@lucia_marketing_lead',
      postRef: 'Reel: Reducir 70% CAC B2B',
      text: 'DEMO',
      intent: 'Palabra Clave de Lead Magnet',
      aiAction: 'Trigger Activado -> DM con Link de Agendamiento Discovery Call 15 min',
      sentiment: 'Conversión Directa',
      status: 'Resuelto por IA',
      time: 'Hace 22 min',
      category: 'LEAD',
    },
    {
      id: 'comm-corp-03',
      author: '@sergio_consultor',
      postRef: 'Carrusel: Arquitectura Multi-Tenant',
      text: '¿Ofrecen esquema de revenue share para agencias que implementen con sus clientes?',
      intent: 'Alianza Estratégica / FAQ',
      aiAction: 'Respuesta en hilo: "¡Hola Sergio! Sí, contamos con el programa Partner Vector del 25% recurrente. Te contactamos."',
      sentiment: 'Informativo',
      status: 'Retroalimentar a FAQ RAG',
      time: 'Hace 50 min',
      category: 'FAQ',
    },
    {
      id: 'comm-corp-04',
      author: '@scam_agency_lead',
      postRef: 'Carrusel: Arquitectura Multi-Tenant',
      text: 'Fraude no sirve usen mi herramienta gratis en el enlace',
      intent: 'Spam Competidor / Hate',
      aiAction: 'Comentario Ocultado Automáticamente por Filtro de Toxicidad',
      sentiment: 'Tóxico (Bloqueado)',
      status: 'Ocultado por Toxicidad',
      time: 'Hace 4 horas',
      category: 'TOXIC',
    },
  ],
};

const CANONICAL_REENGAGEMENT_BY_TENANT = {
  dental: [
    {
      id: 're-001',
      leadId: 'lead-006',
      clientName: 'Carlos Mendoza Jr.',
      phone: '+52 55 6677 8899',
      productInterest: 'Limpieza Dental Ultrasónica ($850 MXN)',
      lastObjection: 'Lo voy a pensar (Evasiva)',
      timeRemaining: '14h 22m',
      targetScheduledAt: 'Hoy, 16:12 hrs',
      status: 'En Cola de Re-contacto (24h)',
      vacaPurpuraMessage: '¡Hola Carlos! Estuve pensando en tu consulta. ¿Sabías que el 90% de las caries invisibles se previenen con profilaxis ultrasónica anual? ¿Te gustaría que te aparte un espacio con diagnóstico 3D sin costo este jueves?',
      wordCount: 36,
      framework: 'Vaca Púrpura + Regla 95/5',
    },
    {
      id: 're-002',
      leadId: 'lead-005',
      clientName: 'Valeria Cordero',
      phone: '+52 55 9821 4433',
      productInterest: 'Carillas de Resina de Alta Estética',
      lastObjection: 'Viendo opciones sin profundizar en MSI',
      timeRemaining: '08h 45m',
      targetScheduledAt: 'Hoy, 20:25 hrs',
      status: 'En Cola de Re-contacto (24h)',
      vacaPurpuraMessage: '¡Hola Valeria! Para tu diseño de sonrisa: contamos con simulación digital 3D previa para que veas el resultado antes de tocar tus dientes. ¿Quieres que te envíe un video de cómo se realiza en 1 sola sesión?',
      wordCount: 37,
      framework: 'JTBD + Ecuación de Valor',
    },
    {
      id: 're-003',
      leadId: 'lead-009',
      clientName: 'Dr. Hugo Peralta',
      phone: '+52 55 4433 2211',
      productInterest: 'Blanqueamiento Dental Láser Led ($3,200 MXN)',
      lastObjection: 'Miedo a la sensibilidad post-tratamiento',
      timeRemaining: '03h 10m',
      targetScheduledAt: 'Hoy, 18:30 hrs',
      status: 'Disparo Inminente',
      vacaPurpuraMessage: '¡Hola Hugo! Nuestro protocolo de blanqueamiento incluye suero desensibilizante con nanopartículas de hidroxiapatita que neutraliza el 100% de la molestia. ¿Te gustaría agendar una prueba de sensibilidad sin costo?',
      wordCount: 31,
      framework: 'Superación de Objeción Técnica',
    },
  ],
  polanco: [
    {
      id: 're-pol-01',
      leadId: 'lead-pol-01',
      clientName: 'Eduardo Garza',
      phone: '+52 55 3322 1100',
      productInterest: 'Mesa Terraza 6 Personas (Polanco Steakhouse)',
      lastObjection: 'Checando con la familia el horario',
      timeRemaining: '02h 15m',
      targetScheduledAt: 'Hoy, 17:00 hrs',
      status: 'Disparo Inminente',
      vacaPurpuraMessage: '¡Hola Eduardo! Nos quedan únicamente 2 mesas en Terraza Principal para este fin de semana. ¿Deseas que te guarde una con la cortesía de bienvenida del Sommelier?',
      wordCount: 29,
      framework: 'Vaca Púrpura (Escasez Real)',
    },
    {
      id: 're-pol-02',
      leadId: 'lead-pol-02',
      clientName: 'Sofía Larios',
      phone: '+52 55 8899 4455',
      productInterest: 'Cena Maridaje 8 Tiempos (Aniversario)',
      lastObjection: 'Comparando con otros restaurantes en Campos Elíseos',
      timeRemaining: '11h 40m',
      targetScheduledAt: 'Hoy, 21:00 hrs',
      status: 'En Cola de Re-contacto (24h)',
      vacaPurpuraMessage: '¡Hola Sofía! Para celebrar su aniversario, nuestro Chef Ejecutivo personaliza la carta con su dedicatoria impresa y una copa de Champagne de bienvenida. ¿Te reservo el rincón privado?',
      wordCount: 29,
      framework: 'Efecto WOW + Hospitalidad',
    },
    {
      id: 're-pol-03',
      leadId: 'lead-pol-03',
      clientName: 'Lic. Mauricio Cárdenas',
      phone: '+52 55 1122 3344',
      productInterest: 'Salón Privado Cava para 12 Empresarios',
      lastObjection: 'Presupuesto corporativo en revisión',
      timeRemaining: '06h 15m',
      targetScheduledAt: 'Hoy, 19:15 hrs',
      status: 'En Cola de Re-contacto (24h)',
      vacaPurpuraMessage: '¡Estimado Lic. Mauricio! Contamos con factura deducible al 100% como gasto de representación con menú degustación cerrado sin sobrecostos sorpresa. ¿Le comparto el brochure ejecutivo en PDF?',
      wordCount: 29,
      framework: 'Facilitación B2B',
    },
  ],
  urban: [
    {
      id: 're-urb-01',
      leadId: 'lead-urb-01',
      clientName: 'Kevin Roldán',
      phone: '+52 55 4567 8901',
      productInterest: 'Sneakers Edición Limitada Cyberpunk ($4,890 MXN)',
      lastObjection: 'Duda sobre la talla exacta y política de cambios',
      timeRemaining: '05h 20m',
      targetScheduledAt: 'Hoy, 18:00 hrs',
      status: 'En Cola de Re-contacto (24h)',
      vacaPurpuraMessage: '¡Qué onda Kevin! Para tu tranquilidad con la talla: el primer cambio es 100% gratuito con recolección a domicilio. Además te incluye stickers y calcetas de edición limitada. ¿Te aparto el par?',
      wordCount: 32,
      framework: 'Garantía Cero Fricción',
    },
    {
      id: 're-urb-02',
      leadId: 'lead-urb-02',
      clientName: 'Camila S.',
      phone: '+52 55 6789 0123',
      productInterest: 'Hoodie Oversize Acid Wash ($1,850 MXN)',
      lastObjection: 'Consultando presupuesto con su quincena',
      timeRemaining: '13h 10m',
      targetScheduledAt: 'Hoy, 22:30 hrs',
      status: 'En Cola de Re-contacto (24h)',
      vacaPurpuraMessage: '¡Hola Camila! Puedes pagar a 3 quincenas sin intereses con Kueski Pay o Aplazo sin tarjeta de crédito. Quedan solo 4 piezas en stock nacional. ¿Quieres tu link de checkout directo?',
      wordCount: 31,
      framework: 'Financiamiento BNPL',
    },
    {
      id: 're-urb-03',
      leadId: 'lead-urb-03',
      clientName: 'Mateo G.',
      phone: '+52 55 7890 1234',
      productInterest: 'Cargo Pants Reflectivos Streetwear',
      lastObjection: 'Lo voy a pensar',
      timeRemaining: '01h 45m',
      targetScheduledAt: 'Hoy, 16:45 hrs',
      status: 'Disparo Inminente',
      vacaPurpuraMessage: '¡Ey Mateo! Checa este video rápido de cómo se ven los detalles reflectivos en la noche bajo la luz de la ciudad. Si confirmas hoy te incluimos envío express 24h gratis. ¿Te va?',
      wordCount: 34,
      framework: 'Demostración Visual Inmediata',
    },
  ],
  corp: [
    {
      id: 're-corp-01',
      leadId: 'lead-corp-01',
      clientName: 'Rodrigo Elizondo',
      phone: '+52 55 9012 3456',
      productInterest: 'Licenciamiento Multi-Tenant Vector (4 Subsidiarias)',
      lastObjection: 'Evaluación de seguridad ISO 27001 por departamento de TI',
      timeRemaining: '07h 30m',
      targetScheduledAt: 'Hoy, 17:30 hrs',
      status: 'En Cola de Re-contacto (24h)',
      vacaPurpuraMessage: 'Estimado Rodrigo, nuestro stack cuenta con cifrado SHA-256 en reposo, SOC-2 Type II y soberanía de datos local. ¿Le gustaría que nuestro CISO tenga una llamada de 15 min con su equipo de TI?',
      wordCount: 34,
      framework: 'Validación de Compliance Corporativo',
    },
    {
      id: 're-corp-02',
      leadId: 'lead-corp-02',
      clientName: 'Lic. Patricia Peña',
      phone: '+52 55 0123 4567',
      productInterest: 'Auditoría y Automatización de Procesos de Cobranza',
      lastObjection: 'Tiempo de implementación prolongado',
      timeRemaining: '15h 00m',
      targetScheduledAt: 'Hoy, 23:00 hrs',
      status: 'En Cola de Re-contacto (24h)',
      vacaPurpuraMessage: 'Lic. Patricia, el despliegue de nuestros sub-bots de cobranza toma exactamente 72 horas hábiles mediante API y no requiere cambiar su ERP actual. ¿Le comparto el caso de éxito de Grupo Alsea?',
      wordCount: 32,
      framework: 'Reducción de Tiempo al Valor (TTV)',
    },
    {
      id: 're-corp-03',
      leadId: 'lead-corp-03',
      clientName: 'Ing. Fernando Vélez',
      phone: '+52 55 1234 5670',
      productInterest: 'SDR de Inteligencia Artificial para Call Center',
      lastObjection: 'Preocupación por alucinaciones en respuestas a clientes',
      timeRemaining: '02h 00m',
      targetScheduledAt: 'Hoy, 16:30 hrs',
      status: 'Disparo Inminente',
      vacaPurpuraMessage: 'Ing. Fernando, Vector Inside opera con el Lobo Sentinel que intercepta el 100% de las respuestas dudosas y pausa el bot para sutura humana en menos de 300ms. ¿Agendamos una prueba de fuego en vivo?',
      wordCount: 34,
      framework: 'HITL Sentinel Proof',
    },
  ],
};

export const TriageProtocol = ({ defaultViewMode = 'kanban' } = {}) => {
  const { triggerModal, activeTenant } = useAuth();
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'meta_comments' | 'redis_queue'
  const [viewMode, setViewMode] = useState(defaultViewMode); // 'kanban' or 'chat'
  const [kanbanDensity, setKanbanDensity] = useState('compact'); // 'compact' (ultra-visión) | 'standard'
  const [selectedColumnFilter, setSelectedColumnFilter] = useState('ALL');
  const [activeContact, setActiveContact] = useState('ana');
  const [inputMessage, setInputMessage] = useState('');
  const [isBotPaused, setIsBotPaused] = useState(false);
  const [selectedCapiLead, setSelectedCapiLead] = useState(null);
  const [drawerLead, setDrawerLead] = useState(null);

  // Tenant-aware dynamic states
  const currentTenantKey = activeTenant?.id || 'dental';
  const [reengagementList, setReengagementList] = useState(
    CANONICAL_REENGAGEMENT_BY_TENANT[currentTenantKey] || CANONICAL_REENGAGEMENT_BY_TENANT.dental
  );
  const [metaPosts, setMetaPosts] = useState(
    CANONICAL_META_POSTS_BY_TENANT[currentTenantKey] || CANONICAL_META_POSTS_BY_TENANT.dental
  );
  const [metaComments, setMetaComments] = useState(
    CANONICAL_META_COMMENTS_BY_TENANT[currentTenantKey] || CANONICAL_META_COMMENTS_BY_TENANT.dental
  );

  // Meta comments interactive states
  const [commentSentimentFilter, setCommentSentimentFilter] = useState('ALL'); // 'ALL' | 'LEAD' | 'FAQ' | 'TOXIC'
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [reengagementFilter, setReengagementFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'SENT'

  // Automatic tenant synchronizer
  useEffect(() => {
    const key = activeTenant?.id || 'dental';
    setReengagementList(CANONICAL_REENGAGEMENT_BY_TENANT[key] || CANONICAL_REENGAGEMENT_BY_TENANT.dental);
    setMetaPosts(CANONICAL_META_POSTS_BY_TENANT[key] || CANONICAL_META_POSTS_BY_TENANT.dental);
    setMetaComments(CANONICAL_META_COMMENTS_BY_TENANT[key] || CANONICAL_META_COMMENTS_BY_TENANT.dental);
  }, [activeTenant]);


  // Chat threads state with AI Customer Feedback, Boolean AND Criteria & Unified ENUMs
  const [threads, setThreads] = useState({
    ana: {
      id: 'lead-001',
      name: 'Ana Martínez',
      phone: '+52 55 1234 5678',
      email: 'ana.martinez@gmail.com',
      channel: 'WhatsApp Business API',
      leadState: LEAD_STATUS_ENUM.BILLABLE_LEAD,
      status: 'Calificado (Listo para Venta)',
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
      dictamen: '<b>Interés:</b> Implantes Dentales.<br><b>Objeción superada:</b> Pagos a 12 meses sin intereses.<br><b>Estatus:</b> Cita confirmada en Google Calendar para el próximo martes a las 14:00 hrs.<br><b>Facturación:</b> Prospecto Calificado ($350 MXN) registrado contablemente y validado con Meta Ads.',
      capiPayload: {
        event_name: 'Lead',
        event_time: 1772381000,
        event_id: 'FOLIO-8F9A2B',
        action_source: 'atencion_comercial_automatizada',
        user_data: {
          em: ['f660ab912ec121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44a'],
          ph: ['4c24b2142e0084f23473138380295eb1381387d8d2ef071a938c5208b5e2a220'],
          fn: ['242f2324f462f43d837699042b5f63901416e033994356e9999f8d5e8f0a2d20'],
        },
        custom_data: {
          currency: 'MXN',
          value: 0.0,
          lead_type: 'PROSPECTO_CALIFICADO',
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
          text: '⚡ Prospecto Calificado: 4/4 Criterios completados. Evento de conversión sincronizado con Meta Ads y registrado en la cuenta.',
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
      status: 'Calificado (Listo para Venta)',
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
      dictamen: '<b>Empresa:</b> Logística Global Monterrey S.A. (180 colaboradores).<br><b>BANT Scoring:</b> 97/100 (Presupuesto $50k USD asignado, decisión inmediata).<br><b>Destino:</b> HubSpot CRM Enterprise.<br><b>Estatus:</b> Discovery Call confirmada vía Zoom para el próximo miércoles a las 10:00 hrs.<br><b>Facturación:</b> Calificado con los 4 criterios comerciales cumplidos. Registro contable por $350 MXN.',
      capiPayload: {
        event_name: 'Lead',
        event_time: 1772382400,
        event_id: 'FOLIO-7C3E11',
        action_source: 'atencion_comercial_automatizada',
        user_data: {
          em: ['89a23b12dc121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44b9'],
          ph: ['112233442e0084f23473138380295eb1381387d8d2ef071a938c5208b5e2a331'],
          fn: ['55667788f462f43d837699042b5f63901416e033994356e9999f8d5e8f0a2e44'],
        },
        custom_data: {
          currency: 'MXN',
          value: 0.0,
          lead_type: 'PROSPECTO_CALIFICADO',
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
          sender: 'Asistente de Re-contacto',
          text: '⏱️ Seguimiento programado: Re-contacto de cortesía tras 24 horas de inactividad (hoy a las 16:12 hrs).',
          isWarning: true,
          time: 'Ayer, 04:12 PM',
        },
      ],
    },
  });

  // Helper handlers for Meta Graph Comments & Redis Queue interactions
  const handleTriggerDirectDm = (comment) => {
    setMetaComments((prev) =>
      prev.map((c) =>
        c.id === comment.id
          ? {
              ...c,
              status: 'DM Despachado (Graph API v20.0)',
              aiAction: `DM verificado enviado vía Webhook Meta Graph a ${c.author}`,
            }
          : c
      )
    );
    try {
      confetti({ particleCount: 35, spread: 65, colors: ['#00F0FF', '#E7F900', '#EC4899'] });
    } catch (e) {}
    triggerModal(
      'Trigger Meta Graph API Exitoso',
      `<b>Destinatario:</b> ${comment.author}<br><b>Canal:</b> Instagram Direct Graph API v20.0<br><b>Webhook Status:</b> 200 OK (Latencia: 248ms)<br><b>Acción Despachada:</b> "${comment.aiAction}"`
    );
  };

  const handlePublicReplySubmit = (commentId) => {
    if (!replyText.trim()) return;
    setMetaComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              status: 'Respondido en Hilo',
              operatorReply: replyText,
            }
          : c
      )
    );
    setReplyingCommentId(null);
    setReplyText('');
    try {
      confetti({ particleCount: 25, spread: 50, colors: ['#E7F900', '#10B981'] });
    } catch (e) {}
    triggerModal(
      'Respuesta Pública Publicada en Hilo',
      'Tu respuesta ha sido transmitida vía Meta Graph API directamente al comentario en el Reel/Post.'
    );
  };

  const handleSimulateInboundComment = () => {
    const tenantKey = activeTenant?.id || 'dental';
    const samples = {
      dental: {
        author: '@dra_monica_s',
        postRef: 'Reel: 3 Secretos para Cuidar tu Sonrisa',
        text: '¡Hola! ¿Tienen disponibilidad de valoración este viernes a las 4pm para carillas?',
        intent: 'Cita Inmediata (High-Ticket)',
        aiAction: 'Detectado por Webhook 0ms -> Auto-DM sugerido con agenda de citas',
        sentiment: 'Conversión Directa',
        category: 'LEAD',
      },
      polanco: {
        author: '@roberto_sommelier',
        postRef: 'Reel: Tomahawk Flameado en Mesa',
        text: '¿Tienen mesa para 6 en Terraza VIP este sábado con menú maridaje?',
        intent: 'Reserva VIP (High-Ticket)',
        aiAction: 'Detectado por Webhook 0ms -> Auto-DM con depósito Stripe preparado',
        sentiment: 'Conversión Directa',
        category: 'LEAD',
      },
      urban: {
        author: '@hype_collector_mx',
        postRef: 'Reel: DROP EXCLUSIVO Cyberpunk',
        text: '¿Tienen la hoodie reflectiva en talla M? Pago inmediato por transferencia',
        intent: 'Compra Inmediata Drop',
        aiAction: 'Detectado por Webhook 0ms -> Auto-DM con link de pago express despachado',
        sentiment: 'Conversión Directa',
        category: 'LEAD',
      },
      corp: {
        author: '@ing_marcelo_cloud',
        postRef: 'Reel: Reducir 70% CAC B2B',
        text: '¿La API de Vector Inside soporta integración con SAP Business One y Meta CAPI?',
        intent: 'Evaluación Técnica B2B Enterprise',
        aiAction: 'Detectado por Webhook 0ms -> Auto-DM con documentación Swagger y Sandbox',
        sentiment: 'Conversión Directa',
        category: 'LEAD',
      },
    };

    const sample = samples[tenantKey] || samples.dental;
    const newComment = {
      id: `comm-live-${Date.now()}`,
      author: sample.author,
      postRef: sample.postRef,
      text: sample.text,
      intent: sample.intent,
      aiAction: sample.aiAction,
      sentiment: sample.sentiment,
      status: 'Detectado por Webhook (0ms)',
      time: 'Justo ahora',
      category: sample.category,
    };

    setMetaComments((prev) => [newComment, ...prev]);
    try {
      confetti({ particleCount: 40, spread: 70, colors: ['#00F0FF', '#E7F900'] });
    } catch (e) {}
    triggerModal(
      'Simulación Meta Webhook Inbound (0ms)',
      `<b>Nuevo Comentario Recibido:</b> "${newComment.text}"<br><b>Autor:</b> ${newComment.author}<br><b>Clasificación IA:</b> ${newComment.intent}<br><b>Acción Inmediata:</b> ${newComment.aiAction}`
    );
  };

  const handleRunBatchWorker = () => {
    setReengagementList((prev) =>
      prev.map((item) => ({
        ...item,
        timeRemaining: 'DESPACHADO',
        status: 'FOLLOWUP_SENT',
      }))
    );
    try {
      confetti({ particleCount: 50, spread: 80, colors: ['#A855F7', '#E7F900', '#10B981'] });
    } catch (e) {}
    triggerModal(
      'Worker Redis Nocturno Ejecutado en Batch (0ms)',
      `<b>Job ID:</b> upstash_cron_${Date.now()}<br><b>Mensajes Despachados:</b> ${reengagementList.length} micro-mensajes Vaca Púrpura.<br><b>Motor IA:</b> Groq Llama 3 Batching.<br><b>Costo en Tokens:</b> $0.00 USD.<br><b>Resultado:</b> Todos los prospectos Out-of-Market recibieron su estímulo no invasivo a las 24h exactas.`
    );
  };

  // Helper styles for columns with rich gradients
  const getColumnContainerStyle = (colId) => {
    switch (colId) {
      case LEAD_STATUS_ENUM.LEAD_COLD_24H:
        return 'bg-gradient-to-b from-sky-50/80 via-white to-sky-50/30 dark:from-sky-950/20 dark:via-zinc-950/90 dark:to-zinc-950 border-sky-200 dark:border-sky-500/25';
      case LEAD_STATUS_ENUM.LEAD_WARM_24H:
        return 'bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 dark:from-amber-950/20 dark:via-zinc-950/90 dark:to-zinc-950 border-amber-200 dark:border-amber-500/25';
      case LEAD_STATUS_ENUM.LEAD_HOT_PREQUAL:
        return 'bg-gradient-to-b from-orange-50/80 via-white to-orange-50/30 dark:from-orange-950/20 dark:via-zinc-950/90 dark:to-zinc-950 border-orange-200 dark:border-orange-500/25';
      case LEAD_STATUS_ENUM.BILLABLE_LEAD:
        return 'bg-gradient-to-b from-lime-50/80 via-white to-emerald-50/30 dark:from-lime-950/25 dark:via-zinc-950/90 dark:to-zinc-950 border-lime-300 dark:border-lime-500/35 shadow-[0_0_25px_rgba(200,255,0,0.05)]';
      case LEAD_STATUS_ENUM.HITL_INTERVENTION:
        return 'bg-gradient-to-b from-rose-50/90 via-white to-rose-50/40 dark:from-rose-950/30 dark:via-zinc-950/90 dark:to-zinc-950 border-rose-300 dark:border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.08)]';
      default:
        return 'bg-white dark:bg-zinc-950/80 border-zinc-200 dark:border-zinc-800/90';
    }
  };

  // Helper styles for individual lead cards with luminous dual-theme gradients
  const getLeadCardGradient = (leadState) => {
    switch (leadState) {
      case LEAD_STATUS_ENUM.HITL_INTERVENTION:
        return 'bg-gradient-to-br from-rose-50/95 via-red-50/60 to-white dark:from-zinc-900/95 dark:via-rose-950/40 dark:to-zinc-950 border-2 border-rose-500/80 dark:border-rose-500/70 shadow-md dark:shadow-[0_4px_25px_rgba(244,63,94,0.20)] ring-1 ring-rose-500/20';
      case LEAD_STATUS_ENUM.BILLABLE_LEAD:
        return 'bg-gradient-to-br from-white via-lime-50/70 to-emerald-50/40 dark:from-zinc-900/95 dark:via-lime-950/35 dark:to-zinc-950 border-2 border-lime-500/60 dark:border-neon/60 shadow-md dark:shadow-[0_4px_22px_rgba(229,255,0,0.16)] hover:border-lime-600 dark:hover:border-neon';
      case LEAD_STATUS_ENUM.LEAD_HOT_PREQUAL:
        return 'bg-gradient-to-br from-white via-orange-50/60 to-amber-50/30 dark:from-zinc-900/95 dark:via-orange-950/30 dark:to-zinc-950 border border-orange-300 dark:border-orange-500/35 shadow-sm dark:shadow-[0_4px_18px_rgba(249,115,22,0.12)] hover:border-orange-400';
      case LEAD_STATUS_ENUM.LEAD_WARM_24H:
        return 'bg-gradient-to-br from-white via-amber-50/50 to-yellow-50/20 dark:from-zinc-900/95 dark:via-amber-950/25 dark:to-zinc-950 border border-amber-300 dark:border-amber-500/35 shadow-sm dark:shadow-[0_4px_18px_rgba(245,158,11,0.12)] hover:border-amber-400';
      case LEAD_STATUS_ENUM.LEAD_COLD_24H:
        return 'bg-gradient-to-br from-white via-sky-50/50 to-blue-50/20 dark:from-zinc-900/95 dark:via-sky-950/25 dark:to-zinc-950 border border-sky-300 dark:border-sky-500/30 shadow-sm dark:shadow-[0_4px_18px_rgba(56,189,248,0.12)] hover:border-sky-400';
      default:
        return 'bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800';
    }
  };

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
        status: 'Calificado (Listo para Venta)',
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
            ? 'p-4 space-y-3.5 shadow-sm dark:shadow-md'
            : isCompact
            ? 'p-3 space-y-2'
            : 'p-4 space-y-3'
        } rounded-2xl transition-all font-mono text-xs group relative flex flex-col justify-between ${getLeadCardGradient(item.leadState)}`}
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
                <span className="truncate">Validación Meta</span>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/15 text-neon border border-neon/30 text-[11px] font-sans font-semibold uppercase tracking-wider mb-2">
            <Bot className="w-3.5 h-3.5" />
            Operación · Calificación y Triage en Tiempo Real
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-zinc-900 dark:text-white">
            Prospectos y Ventas <span className="text-neon">· Calificación HITL</span>
          </h2>
          <p className="text-xs sm:text-sm font-sans text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Seguimiento comercial y calificación en tiempo real. Protocolo de re-contactación a 24 horas y aprobación de Pre-Citas con dictamen en 1 clic.
          </p>
        </div>

        {/* Tab Switcher: Chats vs Meta Graph vs Cola Redis 24h */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-100 dark:bg-zinc-950/90 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-sans text-xs shrink-0 shadow-sm dark:shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('chats')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'chats'
                ? 'bg-neon text-black shadow-neon-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Prospectos ({Object.keys(threads).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('meta_comments')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'meta_comments'
                ? 'bg-neon text-black shadow-neon-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Instagram className="w-4 h-4 text-pink-500 dark:text-pink-400" />
            <span>Comentarios Meta</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('redis_queue')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'redis_queue'
                ? 'bg-neon text-black shadow-neon-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Recuperación 24h (Regla 95/5)</span>
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
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-black/70 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-sans shadow-inner">
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
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-black/70 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-inner font-sans text-xs">
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
          <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-auto pb-1 pt-1 font-sans text-xs">
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
                    <div className={`p-4 rounded-2xl ${getColumnContainerStyle(col.id)} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm dark:shadow-lg`}>
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
                    } flex-shrink-0 flex flex-col rounded-2xl ${getColumnContainerStyle(col.id)} shadow-sm dark:shadow-xl backdrop-blur-md relative overflow-hidden snap-start transition-all`}
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
                      Estado: {cleanConcept(currentChat.leadState)}
                    </span>
                  )}

                  {currentChat.capiPayload && (
                    <button
                      type="button"
                      onClick={() => handleInspectCapi(currentChat)}
                      className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-cyan-600 dark:text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Ver Comprobante Meta
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
              <p className="text-2xl font-black text-zinc-900 dark:text-white">{metaComments.length * 32}</p>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Últimas 24 horas</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">DMs Disparados Automáticos</span>
              <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                {metaComments.filter((c) => c.status?.includes('DM') || c.category === 'LEAD').length * 14}
              </p>
              <span className="text-[10px] text-cyan-700 dark:text-cyan-500">Conversión a Chat: 38.4%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Sentimiento de Comunidad</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">96.8%</p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-500">Filtro de Toxicidad Activo</span>
            </div>
          </div>

          {/* Posts & Reels Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>Publicaciones & Reels Activos en Meta Graph ({activeTenant?.name || 'Clínica Dental'})</span>
              </h3>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Instagram Graph API v20.0
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metaPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-2xl bg-gradient-to-br from-white via-zinc-50/50 to-pink-50/20 dark:from-zinc-950/90 dark:via-zinc-900/40 dark:to-pink-950/10 border border-zinc-200 dark:border-zinc-800/90 space-y-3 font-mono text-xs shadow-sm hover:border-pink-500/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-500/30 flex items-center gap-1">
                      <Instagram className="w-3 h-3" />
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

          {/* Live Meta Comments Feed with Real-time Simulation & Action Triggers */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-5 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <MessageSquareWarning className="w-4 h-4 text-neon" />
                  <span>Feed de Comentarios en Vivo & Acciones Automatizadas</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
                  Sincronizado vía Meta Webhooks con detección semántica e inyección de respuesta en menos de 500ms.
                </p>
              </div>

              {/* Botones de Acción Global */}
              <div className="flex flex-wrap items-center gap-2 font-mono">
                <button
                  type="button"
                  onClick={handleSimulateInboundComment}
                  className="px-3.5 py-2 rounded-xl bg-neon hover:bg-[var(--neon-hover)] text-black text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Simular Comentario Entrante (0ms)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const pendingCount = metaComments.filter((c) => c.category === 'LEAD' && !c.status?.includes('DM')).length;
                    setMetaComments((prev) =>
                      prev.map((c) =>
                        c.category === 'LEAD'
                          ? { ...c, status: 'DM Despachado (Graph API v20.0)' }
                          : c
                      )
                    );
                    try {
                      confetti({ particleCount: 30, spread: 60, colors: ['#00F0FF', '#E7F900'] });
                    } catch (e) {}
                    triggerModal(
                      'DMs en Lote Despachados',
                      `Se procesaron y despacharon automáticamente <strong>${pendingCount || 1}</strong> DMs a leads con intención de compra mediante Meta Graph API.`
                    );
                  }}
                  className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Disparar DMs a Leads</span>
                </button>
              </div>
            </div>

            {/* Filtros de Sentimiento / Intención */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-zinc-400 text-[11px] font-bold mr-1">Filtrar por:</span>
              {[
                { id: 'ALL', label: 'Todos', count: metaComments.length },
                {
                  id: 'LEAD',
                  label: 'Conversión (Leads)',
                  count: metaComments.filter((c) => c.category === 'LEAD').length,
                  dot: 'bg-emerald-500',
                },
                {
                  id: 'FAQ',
                  label: 'Preguntas / FAQs',
                  count: metaComments.filter((c) => c.category === 'FAQ').length,
                  dot: 'bg-sky-500',
                },
                {
                  id: 'TOXIC',
                  label: 'Toxicidad (Ocultados)',
                  count: metaComments.filter((c) => c.category === 'TOXIC').length,
                  dot: 'bg-rose-500',
                },
              ].map((f) => {
                const isSelected = commentSentimentFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCommentSentimentFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold ${
                      isSelected
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    {f.dot && <span className={`w-2 h-2 rounded-full ${f.dot}`} />}
                    <span>{f.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-200/80 dark:bg-black/40 text-zinc-800 dark:text-zinc-300">
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Listado de Comentarios Filtrados */}
            <div className="space-y-3 font-mono text-xs">
              {metaComments
                .filter((comm) => {
                  if (commentSentimentFilter === 'ALL') return true;
                  return comm.category === commentSentimentFilter;
                })
                .map((comm) => {
                  const isReplying = replyingCommentId === comm.id;
                  const isToxic = comm.category === 'TOXIC';
                  const isLead = comm.category === 'LEAD';
                  const isDmSent = comm.status?.includes('DM');
                  const isThreadReplied = comm.status === 'Respondido en Hilo';

                  return (
                    <div
                      key={comm.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isToxic
                          ? 'bg-rose-50/50 dark:bg-gradient-to-r dark:from-rose-950/20 dark:via-zinc-900/60 dark:to-zinc-900 border-rose-200 dark:border-rose-900/40 opacity-80'
                          : isLead
                          ? 'bg-gradient-to-r from-emerald-50/60 via-white to-lime-50/30 dark:from-emerald-950/20 dark:via-zinc-900/80 dark:to-zinc-900 border-emerald-200 dark:border-emerald-500/30 shadow-sm'
                          : 'bg-zinc-50/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      {/* Top Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                            <span className="text-neon">@</span>
                            {comm.author.replace('@', '')}
                          </span>
                          <span className="text-zinc-500 dark:text-zinc-400">en {comm.postRef}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isDmSent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-bold flex items-center gap-1 text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              DM Despachado
                            </span>
                          )}
                          {isThreadReplied && (
                            <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30 font-bold flex items-center gap-1 text-[10px]">
                              <Reply className="w-3 h-3" />
                              Respondido en Hilo
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{comm.time}</span>
                        </div>
                      </div>

                      {/* Comment Body */}
                      <p className="text-zinc-900 dark:text-white text-xs font-sans bg-white dark:bg-black/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 leading-relaxed">
                        "{comm.text}"
                      </p>

                      {/* Operator Public Reply if already sent */}
                      {comm.operatorReply && (
                        <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-500/30 text-xs font-sans space-y-1">
                          <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 font-mono flex items-center gap-1">
                            <CornerDownRight className="w-3 h-3" />
                            Respuesta Pública Enviada al Hilo:
                          </span>
                          <p className="text-zinc-800 dark:text-zinc-200 text-xs">
                            "{comm.operatorReply}"
                          </p>
                        </div>
                      )}

                      {/* Action Bar & AI Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-[10px]">
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-zinc-500 dark:text-zinc-400">Acción IA: </span>
                          <span className="text-cyan-700 dark:text-cyan-300 font-sans font-medium truncate block">
                            {comm.aiAction}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-lg font-medium ${
                              isToxic
                                ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                                : isLead
                                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300'
                            }`}
                          >
                            {comm.sentiment}
                          </span>

                          {/* Action Button: Disparar Auto-DM */}
                          {isLead && !isDmSent && (
                            <button
                              type="button"
                              onClick={() => handleTriggerDirectDm(comm)}
                              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
                            >
                              <Send className="w-3 h-3" />
                              <span>Disparar Auto-DM</span>
                            </button>
                          )}

                          {/* Action Button: Responder en Hilo */}
                          {!isToxic && !isThreadReplied && (
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingCommentId(isReplying ? null : comm.id);
                                setReplyText(
                                  comm.category === 'FAQ'
                                    ? `¡Hola ${comm.author}! Con gusto te apoyamos. Te hemos enviado la información detallada.`
                                    : `¡Hola ${comm.author}! Claro que sí, con gusto te apoyamos. ¿Nos dejas un mensaje privado para darte atención personalizada?`
                                );
                              }}
                              className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 transition-colors"
                            >
                              <Reply className="w-3 h-3" />
                              <span>{isReplying ? 'Cancelar' : 'Responder en Hilo'}</span>
                            </button>
                          )}

                          {/* Action Button: Guardar en FAQ RAG */}
                          {(comm.category === 'FAQ' || comm.status === 'Retroalimentar a FAQ RAG') && (
                            <button
                              type="button"
                              onClick={() => handleAddFaqToRag(comm.text)}
                              className="px-3 py-1.5 rounded-xl bg-neon text-black font-bold flex items-center gap-1 hover:bg-[var(--neon-hover)] transition-colors shadow-sm"
                            >
                              <PlusCircle className="w-3 h-3" />
                              <span>Guardar en FAQ RAG</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Formulario Inline de Respuesta Pública */}
                      {isReplying && (
                        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2 animate-fade-in">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                            Redactar Respuesta Pública para {comm.author}:
                          </span>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Escribe la respuesta que será visible en el Reel..."
                              className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white rounded-xl px-3.5 py-2 outline-none focus:border-neon font-sans"
                            />
                            <button
                              type="button"
                              onClick={() => handlePublicReplySubmit(comm.id)}
                              className="px-4 py-2 rounded-xl bg-neon text-black font-bold text-xs hover:bg-[var(--neon-hover)] transition-all font-mono active:scale-95 shrink-0"
                            >
                              Publicar en Hilo
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5.5. PESTAÑA COLA REDIS 24H & VACA PÚRPURA (REGLA 95/5 EHRENBERG-BASS)    */}
      {/* ========================================================================= */}
      {activeTab === 'redis_queue' && (
        <div className="space-y-6 animate-fade-in font-mono text-xs">
          {/* Top Banner de Fundamentación de Negocio con Disparador en Batch */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/50 via-zinc-950 to-zinc-950 border border-purple-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-3.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 text-2xl shrink-0">
                  ⏱️
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-heading font-black text-white">
                      Motor Asíncrono de Re-Engagement 24h & Vaca Púrpura
                    </h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold uppercase">
                      Regla 95/5 Activa
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono">
                      Vertical: {activeTenant?.name || 'Clínica Dental'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">
                    Sub-Bot Re-Engagement (DeepSeek V3 / Groq Llama 3) sobre Upstash Redis Queue • Costo $0 USD en tokens.
                  </p>
                </div>
              </div>

              {/* Acciones de Batch Worker */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleRunBatchWorker}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4 text-neon" />
                  <span>⚡ Ejecutar Worker Redis Nocturno (Batch 0ms)</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-300 font-sans leading-relaxed pt-2 border-t border-zinc-800/80">
              <strong>Doctrina Comercial Vector Inside:</strong> Según la <em>Regla 95/5 de Ehrenberg-Bass</em>, solo el 5% de tu audiencia está lista para comprar hoy (In-Market). El 95% restante (Out-of-Market) queda en espera tras responder "lo voy a pensar". A las 24 horas exactas de inactividad, el motor asíncrono despacha un micro-mensaje disruptivo bajo el marco de la <strong>Vaca Púrpura (Seth Godin)</strong>: aporta un dato curioso, supera la objeción previa en menos de 40 palabras y cierra con un micro-CTA sin presión agresiva.
            </p>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Leads Out-of-Market en Espera</span>
              <p className="text-2xl font-black text-purple-400">
                {reengagementList.filter((x) => x.status !== 'FOLLOWUP_SENT').length}
              </p>
              <span className="text-[10px] text-zinc-400 font-sans">Encolados en Upstash Redis</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Tasa de Reactivación a Cita</span>
              <p className="text-2xl font-black text-neon">39.1%</p>
              <span className="text-[10px] text-emerald-400 font-sans">+4x vs seguimiento manual</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Costo de Tokens por Mensaje</span>
              <p className="text-2xl font-black text-emerald-400">$0.00 USD</p>
              <span className="text-[10px] text-zinc-400 font-sans">Batching Groq / Llama 3 Nocturno</span>
            </div>
          </div>

          {/* Filtros de la Cola Redis */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Prospectos Encolados para Disparo a las 24 Horas Exactas</span>
              </h4>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              {[
                { id: 'ALL', label: 'Todos', count: reengagementList.length },
                {
                  id: 'PENDING',
                  label: 'En Espera',
                  count: reengagementList.filter((x) => x.status !== 'FOLLOWUP_SENT').length,
                },
                {
                  id: 'SENT',
                  label: 'Despachados',
                  count: reengagementList.filter((x) => x.status === 'FOLLOWUP_SENT').length,
                },
              ].map((tab) => {
                const isSelected = reengagementFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setReengagementFilter(tab.id)}
                    className={`px-3 py-1 rounded-xl transition-all font-bold ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-white border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="ml-1 text-[10px] opacity-80">({tab.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid de Prospectos Encolados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reengagementList
              .filter((item) => {
                if (reengagementFilter === 'PENDING') return item.status !== 'FOLLOWUP_SENT';
                if (reengagementFilter === 'SENT') return item.status === 'FOLLOWUP_SENT';
                return true;
              })
              .map((item) => {
                const isSent = item.status === 'FOLLOWUP_SENT';

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-sm ${
                      isSent
                        ? 'bg-gradient-to-br from-zinc-50 via-white to-emerald-50/20 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-emerald-950/20 border-emerald-300 dark:border-emerald-500/40'
                        : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/90 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white font-sans truncate">
                          {item.clientName}
                        </span>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                            isSent
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40'
                              : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          }`}
                        >
                          {isSent ? '✅ DESPACHADO' : `⏳ ${item.timeRemaining}`}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                        <div>
                          <span>Interés: </span>
                          <strong className="text-zinc-800 dark:text-zinc-200">{item.productInterest}</strong>
                        </div>
                        <div>
                          <span>Objeción: </span>
                          <span className="text-amber-500 italic">"{item.lastObjection}"</span>
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          Disparo programado: <strong>{item.targetScheduledAt}</strong>
                        </div>
                      </div>

                      {/* Vaca Púrpura Copy Box */}
                      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs font-sans space-y-2">
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="text-purple-400 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Mensaje Vaca Púrpura Generado:
                          </span>
                          <span className="text-zinc-400">
                            {item.wordCount} palabras (&lt; 40)
                          </span>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-200 italic leading-relaxed text-[11px]">
                          "{item.vacaPurpuraMessage}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(item.vacaPurpuraMessage);
                          triggerModal(
                            'Copiado al Portapapeles',
                            `El guion de la Vaca Púrpura para <strong>${item.clientName}</strong> ha sido copiado.`
                          );
                        }}
                        className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-white transition-colors text-[10px] font-bold"
                      >
                        Copiar
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setReengagementList((prev) =>
                            prev.map((x) =>
                              x.id === item.id
                                ? { ...x, timeRemaining: 'DESPACHADO', status: 'FOLLOWUP_SENT' }
                                : x
                            )
                          );
                          try {
                            confetti({ particleCount: 35, spread: 60, colors: ['#A855F7', '#E7F900'] });
                          } catch (e) {}
                          triggerModal(
                            'Disparo de Prueba 24h Ejecutado (0ms)',
                            `<b>Destinatario:</b> ${item.clientName} (${item.phone})<br><b>Mensaje:</b> "${item.vacaPurpuraMessage}"<br><b>Estado:</b> Mutado a FOLLOWUP_SENT en Upstash Redis. Transición a embudo de consideración exitosa.`
                          );
                        }}
                        className={`flex-1 px-3 py-2 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                          isSent
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-purple-600 hover:bg-purple-500 text-white'
                        }`}
                      >
                        <Zap className="w-3 h-3" />
                        <span>{isSent ? 'Re-enviar Disparo (0ms)' : 'Simular Disparo (0ms)'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL AUDITOR: META CAPI SERVER-TO-SERVER & BILLING LEDGER PROOF       */}
      {/* ========================================================================= */}
      {selectedCapiLead && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedCapiLead(null);
            }}
          >
            <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-neon/50 shadow-2xl p-6 sm:p-8 relative space-y-5 font-sans text-xs max-h-[90vh] overflow-y-auto my-auto animate-scale-up">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-neon tracking-wider flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Comprobante Oficial de Conversión (Meta Ads & WhatsApp)
                </span>
                <h3 className="text-lg font-heading font-black text-zinc-900 dark:text-white">
                  Comprobante de Prospecto Calificado: {selectedCapiLead.name}
                </h3>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  Registrado automáticamente tras verificar el cumplimiento del 100% de los criterios de calidad comercial.
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-500 block">Tipo de Evento:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Prospecto Calificado</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-500 block">Folio de Rastreo:</span>
                <span className="text-zinc-900 dark:text-white font-bold">
                  {(selectedCapiLead.capiEventId || 'EVT-8F9A2B').replace(/lead_uuid_v4_/g, 'EVT-').toUpperCase()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-500 block">Costo por Prospecto:</span>
                <span className="text-neon font-black">$350.00 MXN</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-500 block">Estado de Facturación:</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {cleanConcept(selectedCapiLead.billingStatus || 'PENDING_INVOICE')}
                </span>
              </div>
            </div>

            {/* Bloque Detalle Seguro de Conversión */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-zinc-700 dark:text-zinc-300 font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-neon" />
                Detalle Seguro del Evento (Datos de Contacto Protegidos con Cifrado):
              </span>
              <pre className="p-4 rounded-xl bg-zinc-900 dark:bg-black border border-zinc-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed shadow-inner">
                {JSON.stringify(
                  {
                    evento: [
                      {
                        tipo_evento: 'Prospecto Calificado',
                        fecha_registro: 'Confirmado en Tiempo Real',
                        folio_rastreo: (selectedCapiLead.capiEventId || 'EVT-8F9A2B').replace(/lead_uuid_v4_/g, 'EVT-').toUpperCase(),
                        canal_origen: 'Atención Comercial Automatizada',
                        datos_contacto_protegidos: {
                          correo_cifrado: ['SHA-256 (Protegido por Privacidad)'],
                          telefono_cifrado: ['SHA-256 (Protegido por Privacidad)'],
                          nombre_cifrado: ['SHA-256 (Protegido por Privacidad)'],
                        },
                        datos_comerciales: {
                          moneda: 'MXN',
                          costo_prospecto: 350.0,
                          calidad_verificada: '100% Criterios Cumplidos',
                        },
                      },
                    ],
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* Tarjeta de Registro Contable y Facturación */}
            <div className="space-y-2">
              <span className="text-[11px] text-zinc-700 dark:text-zinc-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Registro Contable y Liquidación:
              </span>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Folio Contable</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-white">
                      REC-2026-{(selectedCapiLead.id || 'LEAD').replace(/-/g, '').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Negocio / Sucursal</span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {activeTenant?.name || 'Negocio Activo'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Concepto Facturable</span>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      Prospecto Calificado con Cita Acordada
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Importe a Facturar</span>
                    <span className="text-neon font-black font-mono text-sm">
                      $350.00 MXN
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">Estado de Liquidación:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold text-[10px]">
                    {cleanConcept(selectedCapiLead.billingStatus || 'PENDING_INVOICE')} en Corte Mensual
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedCapiLead(null)}
                className="px-6 py-2.5 rounded-xl bg-neon text-black font-bold hover:bg-[var(--neon-hover)] transition-all shadow-neon font-sans text-xs"
              >
                Cerrar Comprobante
              </button>
            </div>
          </div>
        </div>
        </Portal>
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
