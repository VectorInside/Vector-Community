'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  Phone,
  Building,
  ArrowRight,
  ShieldCheck,
  Tag,
  AlertCircle,
  Check,
  Plus,
  Mic,
  Play,
  Pause,
  Paperclip,
  CheckCheck,
  RefreshCw,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PreCitaDrawer } from '@/components/hitl/PreCitaDrawer';
import { formatNumber } from '@/utils/formatters';
import { MeasurementGuideModal } from '@/components/common/MeasurementGuideModal';

// =========================================================================
// CANONICAL OMNICHANNEL INBOX BY TENANT (ADR-001, ADR-002, ADR-011)
// =========================================================================

const CANONICAL_INBOX_BY_TENANT = {
  dental: [
    {
      id: 'dent-001',
      name: 'Carlos Mendoza',
      company: 'Consultorio Particular',
      channel: 'WhatsApp',
      phone: '+52 55 4912 3840',
      need: 'Implante Dental Inmediato',
      campaign: 'Ad: Implante 3D Sin Dolor',
      date: 'Hoy, 10:42 AM',
      contacted: false,
      owner: 'Lobo Vectorial (Agencia)',
      stage: 'Calificado',
      slaMinutesRemaining: 8,
      potentialTicket: 28000,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: true,
        ctaAccepted: false,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          text: 'Hola, vi su anuncio sobre implantes guiados por computadora. Quisiera saber el costo y si manejan financiamiento a meses sin intereses.',
          time: '10:42 AM',
        },
      ],
    },
    {
      id: 'dent-002',
      name: 'Dra. Mariana Solares',
      company: 'Clínica Nápoles',
      channel: 'Instagram DM',
      phone: '+52 55 8812 9031',
      need: 'Valoración Implante Molar 3D',
      campaign: 'Reel: 3 Mitos Anestesia Computarizada',
      date: 'Hoy, 09:15 AM',
      contacted: false,
      owner: 'Sin asignar',
      stage: 'Nuevo',
      slaMinutesRemaining: 5,
      potentialTicket: 18500,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: false,
        ctaAccepted: false,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          text: 'Buenas tardes doctor, me urge cita con el cirujano maxilofacial para valorar un implante con tomografía. ¿Tienen disponible esta semana?',
          time: '09:15 AM',
        },
      ],
    },
    {
      id: 'dent-003',
      name: 'Javier Ponce',
      company: 'Particular Polanco',
      channel: 'Facebook',
      phone: '+52 55 1209 8833',
      need: 'Limpieza con Ultrasonido 3D',
      campaign: 'Ad: Diagnóstico 3D Gratis',
      date: 'Ayer, 04:20 PM',
      contacted: true,
      owner: 'Lobo Vectorial (Agencia)',
      stage: 'Cita Agendada',
      slaMinutesRemaining: null,
      potentialTicket: 2400,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: true,
        ctaAccepted: true,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          text: 'Hola, me interesa agendar una limpieza profunda para este sábado en la mañana.',
          time: 'Ayer, 04:20 PM',
        },
        {
          id: 'm2',
          direction: 'out',
          text: '¡Hola Javier! Te agendamos con gusto este sábado a las 10:00 AM con la Dra. Méndez en la sucursal Roma Sur. ¿Confirmas tu cita?',
          time: 'Ayer, 04:26 PM',
        },
      ],
    },
    {
      id: 'dent-004',
      name: 'Patricia Albarrán',
      company: 'Empresa Privada',
      channel: 'WhatsApp',
      phone: '+52 55 9931 2244',
      need: 'Alineadores Invisibles Sin Brackets',
      campaign: 'Micro-Landing /m/dental',
      date: 'Hoy, 11:05 AM',
      contacted: false,
      owner: 'Lobo Vectorial (Agencia)',
      stage: 'Calificado',
      slaMinutesRemaining: 18,
      potentialTicket: 42000,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: true,
        ctaAccepted: false,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          type: 'audio',
          duration: '0:38',
          text: 'Hola doctor, quería saber si los alineadores transparentes sirven para corregir mordida cruzada o si forzosamente tienen que ser brackets metálicos.',
          time: '11:05 AM',
        },
      ],
    },
  ],
  polanco: [
    {
      id: 'pol-001',
      name: 'Alejandro Bastida',
      company: 'Grupo Empresarial CDMX',
      channel: 'WhatsApp',
      phone: '+52 55 3341 8920',
      need: 'Reserva VIP Terraza (4 personas)',
      campaign: 'Ad: Tomahawk 800°C Mesa',
      date: 'Hoy, 10:35 AM',
      contacted: false,
      owner: 'Lobo Vectorial (Agencia)',
      stage: 'Calificado',
      slaMinutesRemaining: 5,
      potentialTicket: 4200,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: true,
        ctaAccepted: false,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          text: 'Hola! Quiero reservar hoy a las 9pm en terraza para 4 personas, es nuestro aniversario.',
          time: '10:35 AM',
        },
      ],
    },
    {
      id: 'pol-002',
      name: 'Regina Covarrubias',
      company: 'Consultoría Financiera',
      channel: 'Instagram DM',
      phone: '+52 55 7712 0099',
      need: 'Mesa Salón Privado 8 Personas',
      campaign: 'Reel: El Ritual de la Brasa',
      date: 'Hoy, 09:40 AM',
      contacted: false,
      owner: 'Sin asignar',
      stage: 'Nuevo',
      slaMinutesRemaining: 12,
      potentialTicket: 14000,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: false,
        ctaAccepted: false,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          text: 'Hola, buenas tardes. ¿Tienen disponible el salón privado para una cena de negocios de 8 directivos este viernes a las 20:30 hrs?',
          time: '09:40 AM',
        },
      ],
    },
    {
      id: 'pol-003',
      name: 'Mauricio Treviño',
      company: 'Particular Polanco',
      channel: 'Facebook',
      phone: '+52 55 6601 3322',
      need: 'Menú Degustación & Maridaje',
      campaign: 'Campaña Cenas de Fin de Semana',
      date: 'Ayer, 05:10 PM',
      contacted: true,
      owner: 'Lobo Vectorial (Agencia)',
      stage: 'Reserva Confirmada',
      slaMinutesRemaining: null,
      potentialTicket: 3800,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: true,
        ctaAccepted: true,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          text: 'Hola, leí en su post que dan cóctel de bienvenida con la reserva de terraza. ¿Aún aplica para este viernes?',
          time: 'Ayer, 05:10 PM',
        },
        {
          id: 'm2',
          direction: 'out',
          text: '¡Hola Mauricio! Es correcto. Tu mesa en terraza principal para 2 personas está confirmada para este viernes a las 21:00 hrs con cóctel de bienvenida de cortesía.',
          time: 'Ayer, 05:15 PM',
        },
      ],
    },
    {
      id: 'pol-004',
      name: 'Santiago Beristáin',
      company: 'Club Sibaritas',
      channel: 'WhatsApp',
      phone: '+52 55 4488 1122',
      need: 'Cena Maridaje y Mixología Secreta',
      campaign: 'Direct-to-WhatsApp CAPI',
      date: 'Hoy, 11:20 AM',
      contacted: false,
      owner: 'Lobo Vectorial (Agencia)',
      stage: 'Calificado',
      slaMinutesRemaining: 22,
      potentialTicket: 5500,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: true,
        ctaAccepted: false,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          type: 'audio',
          duration: '0:26',
          text: 'Qué tal, me gustaría apartar mesa cerca de la barra de mixología para el sábado en la noche, seríamos 2 parejas para degustar cortes Prime.',
          time: '11:20 AM',
        },
      ],
    },
  ],
  urban: [
    {
      id: 'urb-001',
      name: 'Kevin Almonte',
      company: 'Comunidad Sneakerhead',
      channel: 'WhatsApp',
      phone: '+52 55 9812 3344',
      need: 'Jordan 1 Retro High Talla 27.5mx',
      campaign: 'Ad: Streetwear Drops Otono',
      date: 'Hoy, 10:15 AM',
      contacted: false,
      owner: 'Lobo Vectorial (Agencia)',
      stage: 'Calificado',
      slaMinutesRemaining: 9,
      potentialTicket: 7800,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: true,
        ctaAccepted: false,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          text: 'Hola bro! Tienen disponible el Jordan 1 Retro High en 27.5mx? Es 100% original con caja y certificado físico?',
          time: '10:15 AM',
        },
      ],
    },
    {
      id: 'urb-002',
      name: 'Camila Rivas',
      company: 'Cliente Particular',
      channel: 'Instagram DM',
      phone: '+52 55 4421 9900',
      need: 'Dunk Low Panda Talla 24.5mx',
      campaign: 'Reel: Detectar Tenis Fake',
      date: 'Hoy, 09:28 AM',
      contacted: false,
      owner: 'Sin asignar',
      stage: 'Nuevo',
      slaMinutesRemaining: 16,
      potentialTicket: 4500,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: false,
        ctaAccepted: false,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          text: 'Hola! Si compro hoy antes de las 2pm me llega hoy mismo en CDMX? Cuánto cuesta el envío express?',
          time: '09:28 AM',
        },
      ],
    },
    {
      id: 'urb-003',
      name: 'Rodrigo Montes',
      company: 'Coleccionista Hype',
      channel: 'Web Chat',
      phone: '+52 55 1199 4433',
      need: 'Apartado Preventa Drop Limitado',
      campaign: 'Promo Lookbook 2026',
      date: 'Ayer, 07:45 PM',
      contacted: true,
      owner: 'Lobo Vectorial (Agencia)',
      stage: 'Pedido Despachado',
      slaMinutesRemaining: null,
      potentialTicket: 9200,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: true,
        ctaAccepted: true,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          text: 'Ya aparté mi par con el anticipo en el checkout. ¿Me mandan el código de rastreo por aquí?',
          time: 'Ayer, 07:45 PM',
        },
        {
          id: 'm2',
          direction: 'out',
          text: '¡Confirmado Rodrigo! Tu guía express de Estafeta es MX-882910. Sale hoy a primera hora con tag holográfico serializado.',
          time: 'Ayer, 07:50 PM',
        },
      ],
    },
    {
      id: 'urb-004',
      name: 'Diego Zaldívar',
      company: 'Street Style CDMX',
      channel: 'WhatsApp',
      phone: '+52 55 7788 4411',
      need: 'Asesoría Tallas US vs CM',
      campaign: 'Micro-Landing /m/urban',
      date: 'Hoy, 10:55 AM',
      contacted: false,
      owner: 'Lobo Vectorial (Agencia)',
      stage: 'Calificado',
      slaMinutesRemaining: 11,
      potentialTicket: 6200,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: true,
        ctaAccepted: false,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          type: 'audio',
          duration: '0:22',
          text: 'Oye amigo, calzo del 8.5 americano, ¿ese modelo viene amplio o me recomiendas pedir medio número más para no fallarle?',
          time: '10:55 AM',
        },
      ],
    },
  ],
  corp: [
    {
      id: 'corp-001',
      name: 'Ing. Fernando Arteaga',
      company: 'TechCorp Latam',
      channel: 'WhatsApp',
      phone: '+52 55 6677 8899',
      need: 'Auditoría Fuga de Leads B2B',
      campaign: 'LinkedIn: Trampa de Bots Genéricos',
      date: 'Hoy, 08:45 AM',
      contacted: false,
      owner: 'Lobo Vectorial (Agencia)',
      stage: 'Calificado',
      slaMinutesRemaining: 15,
      potentialTicket: 85000,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: true,
        ctaAccepted: false,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          text: 'Estimado equipo de Vector, revisé su informe sobre fuga de leads B2B. Quisiéramos agendar la sesión de diagnóstico técnico para 30 agentes de ventas.',
          time: '08:45 AM',
        },
      ],
    },
    {
      id: 'corp-002',
      name: 'Lic. Mónica Villarreal',
      company: 'Fintech Solutions SC',
      channel: 'Instagram DM',
      phone: '+52 55 3322 1100',
      need: 'Integración Salesforce + Cloud API',
      campaign: 'Dossier Soberanía IA 2026',
      date: 'Hoy, 09:30 AM',
      contacted: false,
      owner: 'Sin asignar',
      stage: 'Nuevo',
      slaMinutesRemaining: 24,
      potentialTicket: 120000,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: false,
        ctaAccepted: false,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          text: 'Hola, buscamos implementar un stack de IA conversacional para sector financiero con soberanía de datos estricta. ¿Tienen disponibilidad este jueves?',
          time: '09:30 AM',
        },
      ],
    },
    {
      id: 'corp-003',
      name: 'Dr. Salvador Peña',
      company: 'Corporativo Salud Médica',
      channel: 'Web Chat',
      phone: '+52 55 8899 0011',
      need: 'Licenciamiento Enterprise On-Premise',
      campaign: 'Direct Inbound Enterprise',
      date: '12 Oct, 11:00 AM',
      contacted: true,
      owner: 'Lobo Vectorial (Agencia)',
      stage: 'Propuesta Firmada',
      slaMinutesRemaining: null,
      potentialTicket: 240000,
      qualification: {
        contactValid: true,
        productIdentified: true,
        doubtsResolved: true,
        ctaAccepted: true,
      },
      messages: [
        {
          id: 'm1',
          direction: 'in',
          text: 'Revisamos los términos del contrato marco y están aprobados por el área jurídica.',
          time: '12 Oct, 11:00 AM',
        },
        {
          id: 'm2',
          direction: 'out',
          text: 'Excelente Dr. Peña. Procedemos con la emisión de accesos y asignación de arquitecto de cabecera.',
          time: '12 Oct, 11:20 AM',
        },
      ],
    },
  ],
};

const CHANNEL_BADGES = {
  WhatsApp: {
    badge: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    dot: 'bg-emerald-400',
    iconName: 'WhatsApp',
  },
  'Instagram DM': {
    badge: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
    dot: 'bg-pink-400',
    iconName: 'Instagram',
  },
  Facebook: {
    badge: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    dot: 'bg-blue-400',
    iconName: 'Facebook',
  },
  'Web Chat': {
    badge: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    dot: 'bg-cyan-400',
    iconName: 'Web',
  },
};

export const ConversacionesInbox = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeTenant, triggerModal } = useAuth();
  const tenantKey = activeTenant?.id || 'dental';

  // Read URL query parameter for direct jump from notification
  const targetThreadId = searchParams.get('threadId');

  // Load threads partitioned by tenant
  const [threads, setThreads] = useState(() => {
    const canonical = CANONICAL_INBOX_BY_TENANT[tenantKey] || CANONICAL_INBOX_BY_TENANT.dental;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`vector_inbox_threads_${tenantKey}`);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return canonical;
  });

  const [selectedThreadId, setSelectedThreadId] = useState(() => {
    return targetThreadId || threads[0]?.id || 'dent-001';
  });

  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'pending' | 'attended'
  const [channelFilter, setChannelFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftReply, setDraftReply] = useState('');
  const [isPreCitaDrawerOpen, setIsPreCitaDrawerOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // Synchronize when tenant changes or query param changes
  useEffect(() => {
    const canonical = CANONICAL_INBOX_BY_TENANT[tenantKey] || CANONICAL_INBOX_BY_TENANT.dental;
    let loaded = canonical;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`vector_inbox_threads_${tenantKey}`);
        if (saved) loaded = JSON.parse(saved);
      } catch (e) {}
    }
    setThreads(loaded);

    // If query param points to a specific thread, select it
    if (targetThreadId && loaded.some((t) => t.id === targetThreadId)) {
      setSelectedThreadId(targetThreadId);
    } else {
      setSelectedThreadId(loaded[0]?.id);
    }
  }, [tenantKey, targetThreadId]);

  // Save changes to localStorage
  const persistThreads = (newThreads) => {
    setThreads(newThreads);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`vector_inbox_threads_${tenantKey}`, JSON.stringify(newThreads));
      } catch (e) {}
    }
  };

  // Active Thread
  const activeThread = useMemo(
    () => threads.find((t) => t.id === selectedThreadId) || threads[0],
    [threads, selectedThreadId]
  );

  // Filtered threads list
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      // 1. Status Filter
      if (filterMode === 'pending' && t.contacted) return false;
      if (filterMode === 'attended' && !t.contacted) return false;

      // 2. Channel Filter
      if (channelFilter !== 'all') {
        const chan = t.channel.toLowerCase();
        if (channelFilter === 'whatsapp' && !chan.includes('whatsapp')) return false;
        if (channelFilter === 'instagram' && !chan.includes('instagram')) return false;
        if (channelFilter === 'facebook' && !chan.includes('facebook')) return false;
        if (channelFilter === 'web' && !chan.includes('web')) return false;
      }

      // 3. Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.company.toLowerCase().includes(q) ||
          t.need.toLowerCase().includes(q) ||
          t.phone.includes(q)
        );
      }

      return true;
    });
  }, [threads, filterMode, channelFilter, searchQuery]);

  // Handle Send Reply (Simulation with local state)
  const handleSendReply = () => {
    if (!draftReply.trim() || !activeThread) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      direction: 'out',
      text: draftReply.trim(),
      time: 'Ahora',
    };

    const updated = threads.map((t) => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          contacted: true,
          slaMinutesRemaining: null,
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });

    persistThreads(updated);
    setDraftReply('');
  };

  // Toggle qualification check
  const handleToggleRequirement = (key) => {
    if (!activeThread) return;
    const updated = threads.map((t) => {
      if (t.id === activeThread.id) {
        const updatedQual = {
          ...t.qualification,
          [key]: !t.qualification[key],
        };
        const allFourTrue = Object.values(updatedQual).every(Boolean);
        return {
          ...t,
          qualification: updatedQual,
          stage: allFourTrue ? 'Calificado' : t.stage,
        };
      }
      return t;
    });
    persistThreads(updated);
  };

  // Simulate Audio Voice Note Send
  const handleSimulateVoiceNote = () => {
    if (!activeThread) return;
    const audioMsg = {
      id: `m-${Date.now()}`,
      direction: 'out',
      type: 'audio',
      duration: '0:18',
      text: `Hola ${activeThread.name}, te envío este audio para responderte de viva voz sobre ${activeThread.need} y confirmar los horarios disponibles de esta semana.`,
      time: 'Ahora',
    };

    const updated = threads.map((t) => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          contacted: true,
          slaMinutesRemaining: null,
          messages: [...t.messages, audioMsg],
        };
      }
      return t;
    });

    persistThreads(updated);
    try {
      confetti({ particleCount: 30, spread: 50, colors: ['#E7F900', '#10B981'] });
    } catch (e) {}
  };

  const pendingCount = threads.filter((t) => !t.contacted).length;

  // DeepSeek R1 AI Prompt Suggestions tailored to tenant
  const tenantSuggestions = useMemo(() => {
    if (tenantKey === 'polanco') {
      return [
        {
          label: 'Confirmar Mesa Terraza',
          text: `Hola ${activeThread?.name}! Con gusto te confirmo la disponibilidad de mesa en terraza VIP para 4 personas hoy a las 21:00 hrs. ¿Deseas que preparemos un cóctel de bienvenida cortesía de la casa?`,
        },
        {
          label: 'Enviar Menú & Vinos',
          text: `Te comparto nuestro Menú Degustación Prime y la selección de maridaje de autor: https://app.vectorinside.com/m/polanco. ¿Te reservo la mesa?`,
        },
        {
          label: 'Proponer Horario Alterno',
          text: `Para terraza principal tenemos slot libre a las 20:30 o a las 21:30 hrs. ¿Cuál de los dos te acomoda mejor para apartarte el lugar?`,
        },
      ];
    } else if (tenantKey === 'urban') {
      return [
        {
          label: 'Validar Talla & Stock',
          text: `Hola ${activeThread?.name}! Sí, tenemos disponible la talla solicitada con tag holográfico de autenticidad blindada y envío express inmediato en CDMX.`,
        },
        {
          label: 'Enviar Link de Checkout',
          text: `Puedes apartar tu par antes de que se agote el stock directo en nuestro checkout protegido: https://urbansneaks.shop. ¿Requieres factura?`,
        },
        {
          label: 'Garantía Legit Check',
          text: `Todos nuestros pares pasan doble verificación física y luz ultravioleta. Si no es 100% original, te devolvemos 3x tu dinero.`,
        },
      ];
    } else if (tenantKey === 'corp') {
      return [
        {
          label: 'Agendar Zoom con CTO',
          text: `Estimado(a) ${activeThread?.name}, con gusto coordinamos la sesión de diagnóstico técnico 1-on-1 de 30 minutos vía Zoom con un Arquitecto Senior de Vector Inside. ¿Te funciona este jueves a las 11:00 hrs?`,
        },
        {
          label: 'Enviar Dossier B2B',
          text: `Te adjunto el dossier técnico sobre soberanía de IA y arquitectura de agentes HITL: https://vectorinside.com/enterprise.`,
        },
        {
          label: 'Confirmar Stack Técnico',
          text: `Nuestra infraestructura se integra directamente a Meta Cloud API y tu CRM legado sin middleware frágil. ¿Qué CRM utilizan actualmente?`,
        },
      ];
    } else {
      return [
        {
          label: 'Confirmar Diagnóstico 3D',
          text: `Hola ${activeThread?.name}! Con gusto te agendamos para tu diagnóstico computarizado 3D sin costo. Usamos tecnología digital sin dolor y te entregamos tu presupuesto transparente en 15 minutos.`,
        },
        {
          label: 'Aclarar Financiamiento MSI',
          text: `Manejamos hasta 12 Meses Sin Intereses con todas las tarjetas bancarias y planes de pago directo en tratamientos de implantes.`,
        },
        {
          label: 'Proponer Cita',
          text: `Tenemos disponible mañana a las 11:30 hrs o a las 16:00 hrs con nuestro cirujano especialista. ¿Cuál horario te queda mejor?`,
        },
      ];
    }
  }, [tenantKey, activeThread]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 block animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-lime-400 font-extrabold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
              OPERACIÓN / BANDEJA DE ATENCIÓN
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Espacio: <strong className="text-[var(--text-main)]">{activeTenant?.name || 'Vector Inside'}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text-main)]">
            Cada conversación tiene dirección.
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            Contexto del prospecto, canal unificado de Meta y siguiente paso comercial en una sola vista.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="text-xs font-mono px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-lime-400 text-[var(--text-muted)] hover:text-lime-400 transition-all flex items-center gap-1.5"
          >
            <span>Ver Fórmulas SLA</span>
          </button>
          <button
            type="button"
            onClick={() => router.push('/crm')}
            className="text-xs bg-lime-400 text-black font-mono font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-lime-300 transition-all shadow-md active:scale-95"
          >
            <span>Abrir Tablero CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Meta Omnichannel Status Banner */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse shrink-0" />
          <span className="font-mono text-[11px]">
            <strong>Canales Conectados a Meta Graph API v21.0:</strong> WhatsApp Cloud API, Instagram Direct & Facebook Messenger · SLA Objetivo: <strong>15 min</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-lime-400 font-bold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20 shrink-0">
            {pendingCount} Pendientes de Respuesta
          </span>
        </div>
      </div>

      {/* 3-Column / Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-280px)] min-h-[620px]">
        {/* Column 1: Threads List (4 cols) */}
        <div className="lg:col-span-4 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden shadow-sm">
          {/* List Search & Filters */}
          <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-card)]/50 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por contacto o necesidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-lime-400"
              />
            </div>

            <div className="flex items-center justify-between gap-1 text-[11px] font-mono">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'all'
                      ? 'bg-lime-400 text-black font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  Todos ({threads.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('pending')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'pending'
                      ? 'bg-amber-400 text-black font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  Pendientes ({pendingCount})
                </button>
              </div>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="bg-[var(--bg-base)] border border-[var(--border-color)] text-[10px] rounded-lg px-2 py-1 text-[var(--text-muted)] focus:outline-none focus:border-lime-400"
              >
                <option value="all">Canal: Todos</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram DM</option>
                <option value="facebook">Facebook</option>
                <option value="web">Web Chat</option>
              </select>
            </div>
          </div>

          {/* Threads Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-color)] custom-scrollbar">
            {filteredThreads.map((thread) => {
              const isSelected = activeThread?.id === thread.id;
              const channelBadge = CHANNEL_BADGES[thread.channel] || CHANNEL_BADGES['Web Chat'];

              return (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`w-full text-left p-3.5 transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[var(--bg-card)] border-l-4 border-lime-400'
                      : 'hover:bg-[var(--bg-card)]/50'
                  }`}
                >
                  {/* Avatar with Channel Indicator */}
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-lime-400/10 border border-lime-400/20 text-lime-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      {thread.name.charAt(0)}
                    </div>
                    <span
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--bg-panel)] ${channelBadge.dot}`}
                      title={thread.channel}
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-heading font-bold text-xs text-[var(--text-main)] truncate">
                        {thread.name}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-faint)] shrink-0">
                        {thread.date}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] truncate font-sans">
                      {thread.need} · <span className="font-mono text-[10px]">{thread.company}</span>
                    </p>

                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border ${channelBadge.badge}`}>
                        {thread.channel}
                      </span>
                      {thread.contacted ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                          Atendida
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          Por responder
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Active Chat Feed & Fast Response (5 cols) */}
        <div className="lg:col-span-5 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden shadow-sm">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 border-b border-[var(--border-color)] bg-[var(--bg-card)]/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-[var(--text-main)]">
                      {activeThread.name}
                    </h3>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold border ${CHANNEL_BADGES[activeThread.channel]?.badge || ''}`}>
                      {activeThread.channel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mt-0.5">
                    <span>{activeThread.phone}</span>
                    <span>•</span>
                    <span className="text-[10px] text-lime-400">{activeThread.campaign || 'Inbound Directo'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!activeThread.contacted && activeThread.slaMinutesRemaining !== null && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        activeThread.slaMinutesRemaining > 0
                          ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse'
                      }`}
                    >
                      {activeThread.slaMinutesRemaining > 0
                        ? `⏳ ${activeThread.slaMinutesRemaining} min SLA`
                        : '⚠️ SLA Vencido'}
                    </span>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--bg-base)] custom-scrollbar">
                {/* Meta 24-Hour Policy Notice */}
                <div className="p-2 rounded-xl bg-[var(--bg-card)]/60 border border-[var(--border-color)] text-center text-[10px] font-mono text-[var(--text-faint)]">
                  ⚡ Ventana de Atención Meta Activa: 24h restantes para mensajes directos sin costo de plantilla HSM.
                </div>

                {activeThread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.direction === 'out' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-sans leading-relaxed shadow-sm ${
                        msg.direction === 'out'
                          ? 'bg-lime-400 text-black font-medium'
                          : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)]'
                      }`}
                    >
                      {/* Audio Voice Note Player Simulation */}
                      {msg.type === 'audio' ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                              className={`p-2 rounded-full ${
                                msg.direction === 'out' ? 'bg-black text-lime-400' : 'bg-lime-400 text-black'
                              }`}
                            >
                              {playingAudioId === msg.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                            </button>
                            <div className="flex items-center gap-1">
                              {[8, 14, 22, 10, 18, 24, 16, 12, 20, 15, 10, 22].map((height, i) => (
                                <span
                                  key={i}
                                  style={{ height: `${height}px` }}
                                  className={`w-1 rounded-full ${
                                    playingAudioId === msg.id
                                      ? 'bg-lime-400 animate-pulse'
                                      : msg.direction === 'out'
                                      ? 'bg-black/40'
                                      : 'bg-[var(--border-color)]'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-mono font-bold shrink-0">{msg.duration}</span>
                          </div>
                          <p className="text-[11px] italic opacity-90 border-t border-black/10 pt-1 font-mono">
                            {msg.text}
                          </p>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-1 px-1 text-[9px] font-mono text-[var(--text-faint)]">
                      <span>{msg.time}</span>
                      {msg.direction === 'out' && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick AI Suggestions Bar (DeepSeek R1 Prompt Assistant) */}
              <div className="p-2 border-t border-[var(--border-color)] bg-[var(--bg-card)]/40 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar">
                <span className="text-[10px] text-[var(--text-faint)] flex items-center gap-1 shrink-0 px-1 font-bold">
                  <Sparkles className="w-3 h-3 text-lime-400" />
                  Sugerencias IA:
                </span>
                {tenantSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDraftReply(sug.text)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-lime-400 text-[var(--text-muted)] hover:text-[var(--text-main)] whitespace-nowrap transition-colors"
                  >
                    {sug.label}
                  </button>
                ))}
              </div>

              {/* Compose Box with Voice Note & Send */}
              <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-panel)] flex items-end gap-2">
                <textarea
                  rows={2}
                  placeholder={`Responder a ${activeThread.name} en ${activeThread.channel}...`}
                  value={draftReply}
                  onChange={(e) => setDraftReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  className="flex-1 p-2.5 text-xs bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-lime-400 resize-none font-sans"
                />

                <button
                  type="button"
                  onClick={handleSimulateVoiceNote}
                  title="Simular envío de nota de voz con transcripción"
                  className="p-3 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-lime-400 border border-[var(--border-color)] transition-colors shrink-0"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={!draftReply.trim()}
                  className="px-4 py-3 rounded-xl bg-lime-400 text-black font-mono font-bold text-xs hover:bg-lime-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm flex items-center gap-1.5 active:scale-95"
                >
                  <span>Enviar</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-[var(--text-muted)]">
              Selecciona una conversación para responder
            </div>
          )}
        </div>

        {/* Column 3: Lead Context & 4 BANT Qualification Rules (3 cols) */}
        <div className="lg:col-span-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl p-4 flex flex-col justify-between overflow-y-auto space-y-4 shadow-sm custom-scrollbar">
          {activeThread ? (
            <>
              <div className="space-y-4">
                {/* Contact Card Header */}
                <div className="border-b border-[var(--border-color)] pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                    Radiografía del Prospecto
                  </span>
                  <h4 className="font-heading font-black text-base text-[var(--text-main)] mt-0.5">
                    {activeThread.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-sans">
                    {activeThread.company}
                  </p>
                </div>

                {/* Ticket & Stage */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <span className="text-[9px] font-mono text-[var(--text-muted)] block uppercase">
                      Ticket Estimado
                    </span>
                    <span className="text-sm font-mono font-black text-lime-400">
                      ${formatNumber(activeThread.potentialTicket)} MXN
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <span className="text-[9px] font-mono text-[var(--text-muted)] block uppercase">
                      Etapa Comercial
                    </span>
                    <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                      {activeThread.stage}
                    </span>
                  </div>
                </div>

                {/* 4 Inviolable Qualification Requirements (BILLABLE_LEAD Protocol) */}
                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                      4 Requisitos de Calificación
                    </span>
                    <span className="text-[9px] font-mono text-lime-400">
                      {Object.values(activeThread.qualification).filter(Boolean).length}/4
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-sans">
                    <label
                      onClick={() => handleToggleRequirement('contactValid')}
                      className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <input
                        type="checkbox"
                        checked={activeThread.qualification.contactValid}
                        readOnly
                        className="accent-lime-400 rounded"
                      />
                      <span>1. Identidad y WhatsApp</span>
                    </label>

                    <label
                      onClick={() => handleToggleRequirement('productIdentified')}
                      className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <input
                        type="checkbox"
                        checked={activeThread.qualification.productIdentified}
                        readOnly
                        className="accent-lime-400 rounded"
                      />
                      <span>2. Interés en Catálogo</span>
                    </label>

                    <label
                      onClick={() => handleToggleRequirement('doubtsResolved')}
                      className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <input
                        type="checkbox"
                        checked={activeThread.qualification.doubtsResolved}
                        readOnly
                        className="accent-lime-400 rounded"
                      />
                      <span>3. Dudas resueltas (RAG)</span>
                    </label>

                    <label
                      onClick={() => handleToggleRequirement('ctaAccepted')}
                      className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <input
                        type="checkbox"
                        checked={activeThread.qualification.ctaAccepted}
                        readOnly
                        className="accent-lime-400 rounded"
                      />
                      <span>4. Cita / Contacto aceptado</span>
                    </label>
                  </div>
                </div>

                {/* Responsible & Assigned Agent */}
                <div className="text-xs space-y-1 text-[var(--text-muted)] font-mono text-[11px]">
                  <div>Responsable: <strong className="text-[var(--text-main)]">{activeThread.owner}</strong></div>
                  <div>ID Prospecto: <span className="text-[var(--text-faint)]">{activeThread.id}</span></div>
                </div>
              </div>

              {/* Primary 1-Click Action: Open PreCita Drawer & Schedule */}
              <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
                <button
                  type="button"
                  onClick={() => setIsPreCitaDrawerOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-lime-400 text-black font-mono font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-lime-300 transition-all shadow-md active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Dictaminar Pre-Cita</span>
                </button>
                <p className="text-[10px] font-mono text-[var(--text-faint)] text-center">
                  Aprobación Human-in-the-Loop en 1 clic
                </p>
              </div>
            </>
          ) : (
            <div className="text-xs text-[var(--text-muted)]">Sin datos de contacto</div>
          )}
        </div>
      </div>

      {/* PreCita Drawer for 1-Click Scheduling */}
      <PreCitaDrawer
        isOpen={isPreCitaDrawerOpen}
        onClose={() => setIsPreCitaDrawerOpen(false)}
        alert={{
          id: activeThread?.id || 'alert-001',
          client_name: activeThread?.name || 'Prospecto',
          client_phone: activeThread?.phone || '',
          customer_needs_summary: {
            potentialTicket: activeThread?.potentialTicket || 28000,
            intent: activeThread?.need || 'Servicio Profesional',
            objection: 'Requiere confirmación de horario y financiamiento',
            suggestedAction: 'Cita de valoración y confirmación inmediata',
          },
          transcript_snippet: activeThread?.messages.map((m) => `${m.direction === 'in' ? 'Cliente' : 'Agente'}: ${m.text}`) || [],
        }}
      />

      {/* Measurement Guide Modal */}
      <MeasurementGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        initialMetricId="tiempo_primera_respuesta"
      />
    </div>
  );
};
