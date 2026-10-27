'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutGrid,
  Calendar,
  Sparkles,
  Instagram,
  Facebook,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Video,
  Image as ImageIcon,
  Flame,
  ThumbsUp,
  Eye,
  TrendingUp,
  Bot,
  Dna,
  Search,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
  Play,
  Smartphone,
  BarChart2,
  ShieldCheck,
  X,
  FileText,
  ArrowRight,
  Linkedin,
  Share2,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge } from '@/components/common/Badge';
import { Portal } from '@/components/common/Portal';
import { SOCIAL_NETWORKS_CATALOG } from '@/utils/constants';

// Mapa seguro de iconos de formato (garantiza compatibilidad con persistencia JSON / SSR)
const POST_TYPE_ICONS = {
  REEL: Video,
  VIDEO: Video,
  CARROUSEL: ImageIcon,
  CAROUSEL: ImageIcon,
  CAROUSEL_PDF: FileText,
  IMAGE: ImageIcon,
  STORY: Flame,
  POST: ImageIcon,
  LINKEDIN: Linkedin,
  BROADCAST: MessageSquare,
  DEFAULT: FileText,
};

const getPostFormatIcon = (post) => {
  if (post?.formatIcon && typeof post.formatIcon === 'function') {
    return post.formatIcon;
  }
  if (post?.formatIcon && typeof post.formatIcon === 'object' && post.formatIcon.$$typeof) {
    return post.formatIcon;
  }
  const typeKey = (post?.type || '').toUpperCase();
  return POST_TYPE_ICONS[typeKey] || POST_TYPE_ICONS.DEFAULT;
};

// =========================================================================
// CANONICAL MULTI-TENANT MATRICES (ADR-001, ADR-002, ADR-011)
// =========================================================================

const CANONICAL_DNA_BY_TENANT = {
    dental: {
      archetype: 'El Asesor Experto & Autoridad de Confianza',
      tone: 'Profesional, Empático, Científico y Cálido',
      tabooWords: 'barato, regalado, remedio casero, garantizado 100%, doloroso, sin compromiso, dolor insoportable',
      icpPains: 'Miedo al dolor del taladro, vergüenza estética al sonreír, desconfianza por presupuestos sorpresa',
      icpObjections: 'Costo de implantes, falta de tiempo, incertidumbre sobre meses sin intereses (MSI)',
      leadMagnetHook: 'Diagnóstico Computarizado 3D Sin Costo + 20% en Tratamiento Integral',
      leadMagnetCta: 'Comenta "VALORACION" o envía un DM con la palabra "DIAGNOSTICO"',
    },
    polanco: {
      archetype: 'El Anfitrión Hedonista & Maestro Culinario de Autor',
      tone: 'Sofisticado, Cautivador, Exclusivo y Hospitalario',
      tabooWords: 'comida rápida, económico, fonda, barato, lleno total, sin reservación, buffet, comida corrida',
      icpPains: 'Frustración por falta de mesas en ocasiones especiales, servicio apresurado, atmósfera ruidosa para cerrar negocios o celebrar',
      icpObjections: 'Ticket promedio elevado, política estricta de puntualidad en reservas de terraza, código de vestimenta',
      leadMagnetHook: 'Cóctel de Autor de Bienvenida + Mesa Preferente en Terraza VIP al Reservar con Anticipación',
      leadMagnetCta: 'Envía un WhatsApp con la palabra "RESERVA" o pulsa el enlace para asegurar tu mesa prioritaria',
    },
    urban: {
      archetype: 'El Curator de Hype & Amigo Trendsetter Streetwear',
      tone: 'Urbano, Energético, Auténtico, Exclusivo y Directo',
      tabooWords: 'réplica, clon, 1.1, clon espejo, baratillo, copia china, imitación, saldo de paca, sin garantía',
      icpPains: 'Pánico a ser estafado con tenis falsificados en reventa, semanas de espera en aduanas, calzado sin caja original impecable',
      icpObjections: 'Precio de reventa elevado vs retail original, dudas sobre autenticidad certificada, costo de flete express',
      leadMagnetHook: 'Envío Express Mismo Día Gratis + Certificado Físico Holográfico de Autenticidad Blindada',
      leadMagnetCta: 'Comenta "DROP" o pulsa el enlace de biografía para desbloquear acceso prioritario a la preventa',
    },
    corp: {
      archetype: 'El Arquitecto Estratégico & Socio de Soberanía Tecnológica',
      tone: 'Riguroso, Analítico, Corporativo, Vanguardista y Confiable',
      tabooWords: 'chambeador, bot barato, cursito, milagroso, baratísimo, sin factura, informal, truco secreto',
      icpPains: 'Fuga silenciosa de leads B2B por tiempos lentos de respuesta, dependencia de plataformas opacas sin soberanía de datos',
      icpObjections: 'Curva de implementación, fricción para integrarse a CRM legado (Salesforce/HubSpot), seguridad de datos SOC2',
      leadMagnetHook: 'Auditoría de Fuga de Ingresos & Diagnóstico de Arquitectura de IA Sin Costo para C-Levels Calificados',
      leadMagnetCta: 'Agenda tu Sesión Estratégica 1-on-1 vía Zoom con un Arquitecto Senior en el enlace directo',
    },
  };

  const CANONICAL_OFFERS_BY_TENANT = {
    dental: {
      docName: 'Propuesta_Comercial_Salud_Octubre_2026.pdf',
      hook: 'Diagnóstico Computarizado 3D Sin Costo + 20% en Tratamiento Integral',
      cta: 'Comenta "VALORACION" o envía un DM con la palabra "DIAGNOSTICO"',
      validity: 'Campaña Activa de Temporada (Primeros 30 registros)',
    },
    polanco: {
      docName: 'Propuesta_Cenas_Maridaje_Temporada_2026.pdf',
      hook: 'Cóctel de Autor de Bienvenida + Mesa Preferente en Terraza VIP al Reservar con Anticipación',
      cta: 'Envía un WhatsApp con la palabra "RESERVA" para asegurar tu mesa',
      validity: 'Válido para Reservas Jueves a Domingo (Cupo Limitado a 8 Mesas)',
    },
    urban: {
      docName: 'Catalogo_Drops_Otono_Streetwear_2026.pdf',
      hook: 'Envío Express Mismo Día Gratis + Certificado Físico de Autenticidad Blindada',
      cta: 'Comenta "DROP" o envía un DM para recibir código de acceso exclusivo',
      validity: 'Válido en compras mayores a $2,800 MXN hasta agotar stock (15 pares)',
    },
    corp: {
      docName: 'Dossier_Soberania_IA_Enterprise_2026.pdf',
      hook: 'Auditoría de Fuga de Ingresos & Diagnóstico de Arquitectura de IA Sin Costo',
      cta: 'Solicita tu Sesión de Diagnóstico B2B vía enlace directo o WhatsApp Ejecutivo',
      validity: 'Cupo Reservado para Directores de Operaciones y TI (Máx. 5 empresas por mes)',
    },
  };

  const CANONICAL_POSTS_BY_TENANT = {
    dental: [
      {
        id: 'post-dent-01',
        network: 'INSTAGRAM',
        type: 'REEL',
        channel: 'Instagram Reels',
        publishDate: 'Mañana • 19:30 hrs (Hora Pico)',
        title: '3 Señales de que necesitas atender tu salud dental hoy mismo',
        hookText: '¿Sabías que un dolor leve puede convertirse en un tratamiento 3x más costoso en 6 meses?',
        copy: 'En Odontología Integral usamos escaneo 3D sin dolor para diagnosticarte en 15 minutos. 🦷✨ Comenta "VALORACION" y el bot te agendará con 20% de descuento.',
        hashtags: '#SaludDental #ImplantesDentales #OdontologiaCDMX #DientesSanos',
        status: 'PENDIENTE_CLIENTE',
        formatIcon: Video,
        estimatedReach: '18.5k - 25k visualizaciones',
        aiConfidence: 96,
      },
      {
        id: 'post-dent-02',
        network: 'FACEBOOK',
        type: 'CARROUSEL',
        channel: 'Facebook & Instagram Feed',
        publishDate: 'Viernes • 13:00 hrs',
        title: 'Mitos vs Realidades de los Implantes Dentales',
        hookText: 'Mito: "Los implantes duelen mucho". Realidad: Se colocan con anestesia computarizada.',
        copy: 'Desliza para conocer los 4 mitos más comunes antes de realizarte un implante. Si tienes dudas, déjanos un mensaje y te atendemos de inmediato.',
        hashtags: '#MitosDentales #ImplantesSinDolor #SonrisaPerfecta',
        status: 'APROBADO_PROGRAMADO',
        formatIcon: ImageIcon,
        estimatedReach: '12k - 16k cuentas alcanzadas',
        aiConfidence: 94,
      },
      {
        id: 'post-dent-03',
        network: 'INSTAGRAM',
        type: 'STORY',
        channel: 'Instagram Stories (Interactivo)',
        publishDate: 'Sábado • 11:00 hrs',
        title: 'Sticker Interactivo: ¿Cuándo fue tu última limpieza dental?',
        hookText: 'Encuesta: [Menos de 6 meses] vs [Ya ni me acuerdo 🙈]',
        copy: 'Responde a la encuesta y te enviamos un pase de cortesía para tu valoración diagnóstica.',
        hashtags: '#CuidadoBucal #Encuesta',
        status: 'APROBADO_PROGRAMADO',
        formatIcon: Flame,
        estimatedReach: '4.5k vistas en Stories',
        aiConfidence: 98,
      },
      {
        id: 'post-dent-04',
        network: 'TIKTOK',
        type: 'REEL',
        channel: 'TikTok & Reels',
        publishDate: 'Lunes Próximo • 20:00 hrs',
        title: 'Transformación de Sonrisa: Caso Real Paciente Implante Molar',
        hookText: 'De no poder masticar a comer sin dolor en solo 2 citas.',
        copy: 'Así fue el proceso de recuperación de nuestro paciente Carlos. Tecnología guiada por computadora.',
        hashtags: '#AntesYDespues #CasoClinico #OdontologiaDigital',
        status: 'PENDIENTE_CLIENTE',
        formatIcon: Video,
        estimatedReach: '30k - 45k visualizaciones',
        aiConfidence: 97,
      },
      {
        id: 'post-dent-05',
        network: 'LINKEDIN',
        type: 'CAROUSEL_PDF',
        channel: 'LinkedIn Corporativo (Decisores B2B)',
        publishDate: 'Miércoles • 09:00 hrs (Hora Ejecutiva)',
        title: 'El Impacto del Bienestar y Salud Dental en el Rendimiento Ejecutivo',
        hookText: 'El 68% de las ausencias no programadas en puestos de liderazgo derivan de problemas dentales desatendidos.',
        copy: 'Desliza este documento ejecutivo para descubrir cómo estructuramos convenios corporativos de salud preventiva para directivos y equipos clave sin costo administrativo para RH. ¿Te interesa el programa para tu empresa?',
        hashtags: '#Liderazgo #RecursosHumanos #SaludCorporativa #ExecutiveWellness',
        status: 'PENDIENTE_CLIENTE',
        formatIcon: Linkedin,
        estimatedReach: '5.2k directores y líderes de RH',
        aiConfidence: 99,
      },
    ],
    polanco: [
      {
        id: 'post-pol-01',
        network: 'INSTAGRAM',
        type: 'REEL',
        channel: 'Instagram Reels',
        publishDate: 'Jueves • 20:00 hrs (Hora Pico)',
        title: 'El Ritual del Tomahawk: Sellado a 800°C frente a tu mesa',
        hookText: '¿Por qué la carne en Polanco Steakhouse tiene ese crujido exterior imposible de replicar en casa?',
        copy: 'Mantequilla de romero infusionada, sal negra volcánica y corte al instante. 🔥🥩 Reserva tu mesa en terraza y vive la experiencia sensorial de nuestra parrilla abierta. Envía "RESERVA" por WhatsApp.',
        hashtags: '#PolancoEats #TomahawkSteak #CDMXRestaurantes #FoodieCDMX #CarnesPrime',
        status: 'PENDIENTE_CLIENTE',
        formatIcon: Video,
        estimatedReach: '34k - 52k reproducciones',
        aiConfidence: 98,
      },
      {
        id: 'post-pol-02',
        network: 'FACEBOOK',
        type: 'CARROUSEL',
        channel: 'Facebook & Instagram Feed',
        publishDate: 'Viernes • 14:00 hrs',
        title: 'Guía Secreta de Maridaje: 4 Cortes de Autor y sus Vinos Ideales',
        hookText: 'Pedir el vino incorrecto puede opacar por completo un corte Rib Eye Prime de 600g.',
        copy: 'Desliza para ver la recomendación de nuestro Sommelier en Jefe. Al reservar tu cena para 4 personas este fin de semana, te obsequiamos una botella de maridaje de bienvenida.',
        hashtags: '#SommelierCDMX #MaridajePerfecto #GastronomiaPolanco #VinoTinto',
        status: 'APROBADO_PROGRAMADO',
        formatIcon: ImageIcon,
        estimatedReach: '16k - 22k comensales alcanzados',
        aiConfidence: 95,
      },
      {
        id: 'post-pol-03',
        network: 'INSTAGRAM',
        type: 'STORY',
        channel: 'Instagram Stories (Interactivo)',
        publishDate: 'Sábado • 16:30 hrs',
        title: 'Encuesta: ¿Prefieres cóctel ahumado con Mezcal o Gin herbal en Terraza?',
        hookText: 'Sticker Interactivo: [Mezcal Ahumado 🥃] vs [Gin de Frutos 🍸]',
        copy: 'Vota en la historia y te regalamos tu primer cóctel al confirmar tu reservación para hoy en el turno de cena.',
        hashtags: '#MixologiaPolanco #TerrazaVIP #WeekendVibes',
        status: 'APROBADO_PROGRAMADO',
        formatIcon: Flame,
        estimatedReach: '7.8k vistas en Stories',
        aiConfidence: 97,
      },
      {
        id: 'post-pol-04',
        network: 'TIKTOK',
        type: 'REEL',
        channel: 'TikTok Viral Food',
        publishDate: 'Domingo • 13:00 hrs',
        title: 'ASMR Puro: Cortando el Rib Eye añejado en seco de 45 días',
        hookText: 'Escucha este sonido antes de elegir dónde comer hoy en CDMX.',
        copy: 'Maduración controlada en cámara de sal del Himalaya. Si amas la buena carne, etiqueta a la persona que te debe una comida aquí este fin de semana.',
        hashtags: '#ASMRFood #Steakhouse #FoodPornCDMX #PolancoTrends',
        status: 'PENDIENTE_CLIENTE',
        formatIcon: Video,
        estimatedReach: '65k - 90k visualizaciones',
        aiConfidence: 99,
      },
    ],
    urban: [
      {
        id: 'post-urb-01',
        network: 'INSTAGRAM',
        type: 'REEL',
        channel: 'Instagram Reels',
        publishDate: 'Martes • 18:30 hrs (Drop Alert)',
        title: '3 Formas Infalibles de detectar un Sneaker Fake en 10 segundos',
        hookText: 'El 42% de los Jordan 1 en marketplace son réplicas sin que el comprador lo note.',
        copy: 'En Urban Sneaks cada par pasa por doble verificación física y luz UV con tag holográfico serializado. 🔥👟 Comenta "DROP" para recibir acceso preferencial a los lanzamientos semanales con envío gratis.',
        hashtags: '#SneakerheadMexico #LegitCheck #StreetwearCDMX #Jordan1 #Hypebeast',
        status: 'PENDIENTE_CLIENTE',
        formatIcon: Video,
        estimatedReach: '42k - 60k reproducciones',
        aiConfidence: 98,
      },
      {
        id: 'post-urb-02',
        network: 'FACEBOOK',
        type: 'CARROUSEL',
        channel: 'Facebook & Instagram Feed',
        publishDate: 'Miércoles • 15:00 hrs',
        title: 'Top 5 Siluetas Indispensables para elevar tu Outfit Urbano este Mes',
        hookText: 'Desliza para descubrir cuáles pares aumentarán su valor de reventa en los próximos 3 meses.',
        copy: 'Desde clásicos retro hasta colaboraciones limitadas. Contamos con MSI y envío express garantizado a toda la república en 24-48 hrs.',
        hashtags: '#KicksOfTheDay #UrbanStyle #SneakersOriginales #SneakerCulture',
        status: 'APROBADO_PROGRAMADO',
        formatIcon: ImageIcon,
        estimatedReach: '20k - 28k compradores potenciales',
        aiConfidence: 93,
      },
      {
        id: 'post-urb-03',
        network: 'TIKTOK',
        type: 'REEL',
        channel: 'TikTok Streetwear',
        publishDate: 'Viernes • 20:00 hrs',
        title: 'Unboxing Sin Filtro: Llegó el par más codiciado de la temporada',
        hookText: 'Huele a cuero auténtico y viene con sellos intactos. ¿Vale los $8,500 MXN de reventa?',
        copy: 'Mira cada costura a detalle. Tallas 26 a 29 mx disponibles entrega inmediata en Ciudad de México. DM con la palabra "SNEAKERS" para apartar tu talla.',
        hashtags: '#UnboxingSneakers #HypeDrops #SneakerCommunity #StreetFashion',
        status: 'PENDIENTE_CLIENTE',
        formatIcon: Video,
        estimatedReach: '50k - 80k visualizaciones',
        aiConfidence: 96,
      },
    ],
    corp: [
      {
        id: 'post-corp-01',
        network: 'LINKEDIN',
        type: 'CAROUSEL_PDF',
        channel: 'LinkedIn Corporativo (Decisores B2B)',
        publishDate: 'Martes • 08:30 hrs (Hora Ejecutiva)',
        title: 'La Trampa de los Chatbots Genéricos: Por qué el 73% de empresas pierden leads calificados',
        hookText: 'Un bot que solo responde "en un momento te atiendo" destruye el 60% del valor de tu inversión publicitaria.',
        copy: 'Desliza este informe ejecutivo para entender cómo las empresas líderes implementan agentes de IA con protocolo HITL y sincronización CAPI directa a WhatsApp. ¿Tu equipo de ventas atiende en menos de 2 minutos?',
        hashtags: '#B2B #SaaS #TransformacionDigital #InteligenciaArtificial #RevenueOps',
        status: 'PENDIENTE_CLIENTE',
        formatIcon: Linkedin,
        estimatedReach: '8.4k directores de ventas y operaciones',
        aiConfidence: 99,
      },
      {
        id: 'post-corp-02',
        network: 'LINKEDIN',
        type: 'POST',
        channel: 'LinkedIn Thought Leadership',
        publishDate: 'Jueves • 09:00 hrs',
        title: 'Calculadora de Fuga de Ingresos: El costo oculto del tiempo de respuesta B2B',
        hookText: 'Un lead B2B no contactado en los primeros 5 minutos tiene 10x menos probabilidad de calificar a demo.',
        copy: 'Presentamos la arquitectura de Vector Inside: orquestación de sub-bots especializados, soberanía de datos y escalabilidad sin fricción técnica. Descarga el dossier técnico en el enlace directo.',
        hashtags: '#SoberaniaTecnologica #EnterpriseAI #CSuite #OperacionesB2B',
        status: 'APROBADO_PROGRAMADO',
        formatIcon: Linkedin,
        estimatedReach: '6.1k ejecutivos C-Level',
        aiConfidence: 97,
      },
      {
        id: 'post-corp-03',
        network: 'WHATSAPP',
        type: 'BROADCAST',
        channel: 'WhatsApp Cloud API Direct Broadcast',
        publishDate: 'Lunes • 11:00 hrs',
        title: 'Invitación Exclusiva: Sesión Privada de Diagnóstico Operativo con Arquitecto Senior',
        hookText: 'Acceso reservado para directores de operaciones y tecnología.',
        copy: 'Hola [Nombre], identificamos una ventana de optimización del 35% en los flujos conversacionales de tu industria. Te compartimos la invitación a una sesión 1-on-1 de 30 minutos sin costo para evaluar tu stack actual.',
        hashtags: '#B2BNurturing #AccountBasedMarketing',
        status: 'PENDIENTE_CLIENTE',
        formatIcon: MessageSquare,
        estimatedReach: '240 directores de cuentas target',
        aiConfidence: 98,
      },
    ],
  };

  const CANONICAL_VIRAL_REELS_BY_TENANT = {
    dental: [
      {
        id: 'vr-dent-01',
        title: '¿Por qué postergar tu implante te costará el triple en 6 meses?',
        views: '48,200',
        hookRate: '46.8%',
        retentionRate: '38.2%',
        dmsGenerated: 312,
        platform: 'Instagram Reels',
        psychologicalTrigger: 'Aversión a la Pérdida (Loss Aversion) + Urgencia Financiera',
        visualHook: 'Primer plano a radiografía 3D con acercamiento rápido en el segundo 0:01.',
        ctaKeyword: 'PREVENCION',
        whyItWorked: 'Tocó el dolor financiero antes que el dolor médico. La gente pospone por miedo al gasto, y este video demostró que posponer es lo que realmente cuesta dinero.',
      },
      {
        id: 'vr-dent-02',
        title: '3 Mitos que ningún dentista tradicional te dice sobre anestesia',
        views: '64,100',
        hookRate: '52.4%',
        retentionRate: '41.5%',
        dmsGenerated: 485,
        platform: 'TikTok & Reels',
        psychologicalTrigger: 'Revelación de Secreto de la Industria + Curiosidad',
        visualHook: 'Texto en pantalla: "No te dejes engañar" + sonido ASMR de instrumental estéril.',
        ctaKeyword: 'INFO',
        whyItWorked: 'Generó polarización positiva atacando el dolor universal del miedo al dentista, ofreciendo solución con anestesia computarizada indolora.',
      },
    ],
    polanco: [
      {
        id: 'vr-pol-01',
        title: 'La Regla de Oro de los 800°C: Por qué nunca debes pedir un Tomahawk bien cocido',
        views: '128,400',
        hookRate: '58.2%',
        retentionRate: '49.1%',
        dmsGenerated: 740,
        platform: 'Instagram Reels & TikTok',
        psychologicalTrigger: 'Polarización Gastronómica + Autoridad y Curiosidad Provocativa',
        visualHook: 'Cuchillo de chef rebanando carne tierna en cámara lenta con mantequilla hirviendo sobre la costra.',
        ctaKeyword: 'RESERVA',
        whyItWorked: 'Desató debate en comentarios entre defensores del término medio y término 3/4, multiplicando el alcance orgánico y llevando reservas al WhatsApp.',
      },
      {
        id: 'vr-pol-02',
        title: 'El Cóctel Secreto que no está en la carta de Polanco Steakhouse',
        views: '92,300',
        hookRate: '51.7%',
        retentionRate: '44.0%',
        dmsGenerated: 520,
        platform: 'Instagram Reels',
        psychologicalTrigger: 'Exclusividad de Acceso Secreto + FOMO Hedonista',
        visualHook: 'Campana de cristal levantándose para liberar humo de madera de manzano sobre copa de cristal tallado.',
        ctaKeyword: 'SECRETO',
        whyItWorked: 'La gente adora sentir que tiene información privilegiada antes de visitar un lugar de alta gama.',
      },
    ],
    urban: [
      {
        id: 'vr-urb-01',
        title: 'Probé un sneaker réplica de $1,200 vs el original de $8,000 bajo luz ultravioleta',
        views: '215,600',
        hookRate: '63.4%',
        retentionRate: '53.2%',
        dmsGenerated: 980,
        platform: 'TikTok & Reels',
        psychologicalTrigger: 'Doble Prueba Visual Extrema + Miedo a la Estafa',
        visualHook: 'Luz UV revelando costuras invisibles y tinta oculta en la lengüeta en los primeros 2 segundos.',
        ctaKeyword: 'ORIGINAL',
        whyItWorked: 'El miedo a pagar caro por un producto pirata es el dolor #1 de la comunidad sneakerhead. El video probó la autoridad absoluta de la tienda.',
      },
      {
        id: 'vr-urb-02',
        title: 'El par que nadie quería en 2021 y hoy vale más de $15,000 MXN',
        views: '142,000',
        hookRate: '48.9%',
        retentionRate: '42.7%',
        dmsGenerated: 610,
        platform: 'Instagram Reels',
        psychologicalTrigger: 'Inversión y Especulación + Arrepentimiento Pasado',
        visualHook: 'Pantalla dividida con precio histórico vs precio de bolsa de reventa actual con gráfica.',
        ctaKeyword: 'CATALOGO',
        whyItWorked: 'Posicionó al calzado como un activo de colección y no solo como ropa de moda.',
      },
    ],
    corp: [
      {
        id: 'vr-corp-01',
        title: 'Cómo esta empresa perdió $45,000 USD por responder un lead 4 horas tarde',
        views: '38,900',
        hookRate: '44.5%',
        retentionRate: '39.8%',
        dmsGenerated: 184,
        platform: 'LinkedIn Video & YouTube Shorts',
        psychologicalTrigger: 'Aversión al Desperdicio Financiero Operativo + Evidencia C-Level',
        visualHook: 'Captura de pantalla de CRM con lead cerrado perdido por la competencia ante falta de respuesta.',
        ctaKeyword: 'AUDITORIA',
        whyItWorked: 'Golpeó el indicador más doloroso de un Director de Ventas: leads calificados que se enfrían por fricción humana.',
      },
      {
        id: 'vr-corp-02',
        title: 'Chatbots tradicionales vs Agentes Soberanos HITL: La diferencia técnica',
        views: '29,400',
        hookRate: '49.1%',
        retentionRate: '43.2%',
        dmsGenerated: 142,
        platform: 'LinkedIn Video',
        psychologicalTrigger: 'Claridad Arquitectónica + Desmitificación de IA',
        visualHook: 'Diagrama de flujo animado comparando webhook frágil vs protocolo de contingencia segura.',
        ctaKeyword: 'DOSSIER',
        whyItWorked: 'Resonó de inmediato con Directores de Tecnología (CTO) cansados de herramientas que se rompen con cada actualización de API.',
      },
    ],
  };

  const CANONICAL_AUDIT_BY_TENANT = {
    dental: {
      handle: '@odontologiaintegral_cdmx',
      network: 'Instagram Business & TikTok Health',
      score: 88,
      checks: [
        {
          id: 'c1',
          title: 'Biografía con Gancho de Valor Inmediato',
          status: 'WARNING',
          diagnosis: 'Comunica el servicio odontológico pero el llamado a la acción no especifica el beneficio inmediato sin dolor.',
          recommendation: 'Reemplazar "Agenda tu cita" por "👇 Diagnóstico 3D Gratis + Escaneo sin dolor en el enlace directo".',
        },
        {
          id: 'c2',
          title: 'Enlace de Conversión (Micro-Landing Vector)',
          status: 'PASSED',
          diagnosis: 'Enlace configurado correctamente hacia https://app.vectorinside.com/m/dental con UTMs limpias.',
          recommendation: '100% Sincronizado sin fugas de rebote web.',
        },
        {
          id: 'c3',
          title: 'Historias Destacadas (Highlights Médicos)',
          status: 'WARNING',
          diagnosis: 'Cuenta con álbumes activos pero falta uno exclusivo para "Precios / MSI" y "Casos Clínicos Antes/Después".',
          recommendation: 'Añadir Highlights con portadas en color de marca (#0D0F12 + Neón) con testimonios de pacientes.',
        },
        {
          id: 'c4',
          title: 'Publicaciones Ancladas (Pinned Posts)',
          status: 'PASSED',
          diagnosis: '3 posts anclados con el reel más viral, presentación del doctor especialista y oferta del mes vigente.',
          recommendation: 'Mantener actualizados mensualmente conforme rote la oferta comercial.',
        },
      ],
    },
    polanco: {
      handle: '@polancosteakhouse',
      network: 'Instagram Business & TikTok Foodie',
      score: 92,
      checks: [
        {
          id: 'c1',
          title: 'Biografía y Propuesta Sensorial',
          status: 'PASSED',
          diagnosis: 'Propuesta gastronómica clara: "Cortes Prime a 800°C, Mixología de Autor y Terraza VIP en Polanco".',
          recommendation: 'Excelente promesa de experiencia. Mantener el CTA hacia reserva directa de mesas.',
        },
        {
          id: 'c2',
          title: 'Enlace de Conversión Direct-to-WhatsApp',
          status: 'PASSED',
          diagnosis: 'Enlace directo al Micro-Landing y WhatsApp Business: https://app.vectorinside.com/m/polanco sin fricción.',
          recommendation: 'Atribución CAPI for Messaging activa con 18.4% de tasa de click.',
        },
        {
          id: 'c3',
          title: 'Historias Destacadas (Menú & Experiencia)',
          status: 'PASSED',
          diagnosis: 'Destacados organizados en "Menú de Temporada", "Mixología", "Terraza" y "Cenas Privadas".',
          recommendation: 'Todo en orden. Agregar código QR al pie de cada historia.',
        },
        {
          id: 'c4',
          title: 'Publicaciones Ancladas (Reels de Alto Impacto)',
          status: 'WARNING',
          diagnosis: 'Los 3 posts anclados tienen buena estética pero solo 1 incluye llamado a reservar mesa para fin de semana.',
          recommendation: 'Anclar el Reel viral del Tomahawk con CTA directo en los comentarios fijados.',
        },
      ],
    },
    urban: {
      handle: '@urbansneaks_mx',
      network: 'Instagram Shopping & TikTok Streetwear',
      score: 85,
      checks: [
        {
          id: 'c1',
          title: 'Biografía y Garantía de Autenticidad Blindada',
          status: 'PASSED',
          diagnosis: 'Garantía comunicada con contundencia: "100% Originales o te devolvemos 3x tu dinero • Envíos México".',
          recommendation: 'Genera confianza inmediata contra el dolor de réplicas en el mercado.',
        },
        {
          id: 'c2',
          title: 'Enlace de Catálogo & Checkout Rápido',
          status: 'WARNING',
          diagnosis: 'El enlace actual dirige a un home general en lugar de una sección de lanzamientos de temporada.',
          recommendation: 'Vincular directo a https://urbansneaks.shop/drops con tracking UTM de campaña.',
        },
        {
          id: 'c3',
          title: 'Historias Destacadas (Guía de Tallas & Envíos)',
          status: 'WARNING',
          diagnosis: 'Falta un Highlight explícito explicando la equivalencia entre tallas US y CM para evitar devoluciones.',
          recommendation: 'Crear álbum "Tallas & Fit" con tabla comparativa visual para reducir dudas en DM.',
        },
        {
          id: 'c4',
          title: 'Publicaciones Ancladas (Legit Check & Drops)',
          status: 'PASSED',
          diagnosis: 'Post anclado de cómo distinguir tenis auténticos + video de unboxing de par exclusivo.',
          recommendation: 'Mantener fijado para maximizar conversión de nuevos visitantes.',
        },
      ],
    },
    corp: {
      handle: '@vectorinside_enterprise',
      network: 'LinkedIn Corporate & YouTube Tech',
      score: 95,
      checks: [
        {
          id: 'c1',
          title: 'Tagline y Posicionamiento de Autoridad B2B',
          status: 'PASSED',
          diagnosis: 'Comunica soberanía de datos y retorno de inversión claro: "Soberanía de IA & Automatización de Ventas B2B sin fricción".',
          recommendation: 'Excelente alineación con decisores C-Level y Directores de Tecnología.',
        },
        {
          id: 'c2',
          title: 'Enlace a Sesión de Diagnóstico 1-on-1',
          status: 'PASSED',
          diagnosis: 'Enlace directo al calendario ejecutivo de Zoom en https://app.vectorinside.com/m/corp.',
          recommendation: 'Sin intermediarios ni formularios burocráticos.',
        },
        {
          id: 'c3',
          title: 'Contenido Destacado (Casos de Estudio & ROI)',
          status: 'PASSED',
          diagnosis: 'Sección Featured de LinkedIn con PDFs descargables de casos reales y métricas de aceleración comercial.',
          recommendation: 'Actualizar trimestralmente con nuevos testimonios corporativos.',
        },
        {
          id: 'c4',
          title: 'Validación de Empleados y Autoridad Técnica',
          status: 'PASSED',
          diagnosis: 'Perfiles del equipo técnico y consultores vinculados correctamente a la página empresarial.',
          recommendation: 'Consistencia de marca 100% verificada.',
        },
      ],
    },
  };

export const ContentPlanner = () => {
  const { activeTenant, isAdmin, isClient, triggerModal } = useAuth();
  const tenantKey = activeTenant?.id || 'dental';
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'dna' | 'viral_lab' | 'audit'
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState('ALL');
  const [copiedCanvas, setCopiedCanvas] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [selectedViralReel, setSelectedViralReel] = useState(null);

  // Tenant connected social networks (fallback to defaults if undefined)
  const connectedNetworks = activeTenant?.connectedSocialNetworks || ['INSTAGRAM', 'FACEBOOK', 'WHATSAPP'];

  // State initialization with Tenant Isolation (ADR-001)
  const [brandDna, setBrandDna] = useState(() => {
    return CANONICAL_DNA_BY_TENANT[tenantKey] || CANONICAL_DNA_BY_TENANT.dental;
  });

  const [commercialOffer, setCommercialOffer] = useState(() => {
    return CANONICAL_OFFERS_BY_TENANT[tenantKey] || CANONICAL_OFFERS_BY_TENANT.dental;
  });

  const [posts, setPosts] = useState(() => {
    return CANONICAL_POSTS_BY_TENANT[tenantKey] || CANONICAL_POSTS_BY_TENANT.dental;
  });

  const [viralReels, setViralReels] = useState(() => {
    return CANONICAL_VIRAL_REELS_BY_TENANT[tenantKey] || CANONICAL_VIRAL_REELS_BY_TENANT.dental;
  });

  const [profileAudit, setProfileAudit] = useState(() => {
    return CANONICAL_AUDIT_BY_TENANT[tenantKey] || CANONICAL_AUDIT_BY_TENANT.dental;
  });

  // Re-sync states whenever activeTenant changes
  React.useEffect(() => {
    const canonicalDna = CANONICAL_DNA_BY_TENANT[tenantKey] || CANONICAL_DNA_BY_TENANT.dental;
    const canonicalOffer = CANONICAL_OFFERS_BY_TENANT[tenantKey] || CANONICAL_OFFERS_BY_TENANT.dental;
    const canonicalPosts = CANONICAL_POSTS_BY_TENANT[tenantKey] || CANONICAL_POSTS_BY_TENANT.dental;
    const canonicalViral = CANONICAL_VIRAL_REELS_BY_TENANT[tenantKey] || CANONICAL_VIRAL_REELS_BY_TENANT.dental;
    const canonicalAudit = CANONICAL_AUDIT_BY_TENANT[tenantKey] || CANONICAL_AUDIT_BY_TENANT.dental;

    if (typeof window !== 'undefined') {
      try {
        const savedDna = localStorage.getItem(`vector_planner_dna_${tenantKey}`);
        setBrandDna(savedDna ? JSON.parse(savedDna) : canonicalDna);

        const savedOffer = localStorage.getItem(`vector_planner_offer_${tenantKey}`);
        setCommercialOffer(savedOffer ? JSON.parse(savedOffer) : canonicalOffer);

        const savedPosts = localStorage.getItem(`vector_planner_posts_${tenantKey}`);
        setPosts(savedPosts ? JSON.parse(savedPosts) : canonicalPosts);
      } catch (e) {
        setBrandDna(canonicalDna);
        setCommercialOffer(canonicalOffer);
        setPosts(canonicalPosts);
      }
    } else {
      setBrandDna(canonicalDna);
      setCommercialOffer(canonicalOffer);
      setPosts(canonicalPosts);
    }

    setViralReels(canonicalViral);
    setProfileAudit(canonicalAudit);
    setSelectedNetworkFilter('ALL');
  }, [tenantKey]);

  // Persist edits whenever posts or dna or offer change
  const persistPosts = (newPosts) => {
    setPosts(newPosts);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`vector_planner_posts_${tenantKey}`, JSON.stringify(newPosts));
      } catch (e) {}
    }
  };

  const persistBrandDna = (newDna) => {
    setBrandDna(newDna);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`vector_planner_dna_${tenantKey}`, JSON.stringify(newDna));
      } catch (e) {}
    }
  };

  const persistCommercialOffer = (newOffer) => {
    setCommercialOffer(newOffer);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`vector_planner_offer_${tenantKey}`, JSON.stringify(newOffer));
      } catch (e) {}
    }
  };

  const [showOfferModal, setShowOfferModal] = useState(false);

  const handleUpdateCommercialOffer = (e) => {
    e.preventDefault();
    persistCommercialOffer(commercialOffer);
    setShowOfferModal(false);
    triggerModal(
      'Propuesta Comercial Sincronizada',
      `La oferta comercial para <b>${activeTenant?.name}</b> ha sido actualizada y persistida.<br><br>Todas las próximas sugerencias de DeepSeek R1 integrarán automáticamente este gancho: <i>"${brandDna.leadMagnetHook}"</i>.`
    );
  };

  const handleApprovePost = (postId) => {
    const updated = posts.map((p) =>
      p.id === postId ? { ...p, status: 'APROBADO_PROGRAMADO' } : p
    );
    persistPosts(updated);

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        colors: ['#D4FF00', '#10B981', '#FFFFFF'],
      });
    } catch (e) {}

    triggerModal(
      'Publicación Aprobada & Programada',
      'El post ha recibido el visto bueno del cliente. El despachador automático lo publicará exactamente en la fecha y hora programada.'
    );
  };

  const handleCopyPostCopy = (postId, text) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    }
  };

  const handleResetToCanonicalDna = () => {
    const canonical = CANONICAL_DNA_BY_TENANT[tenantKey] || CANONICAL_DNA_BY_TENANT.dental;
    persistBrandDna(canonical);
    triggerModal(
      'ADN Canónico Restaurado',
      `Se han restablecido los valores predeterminados de la industria para <b>${activeTenant?.name}</b> (${activeTenant?.giro || 'Estándar'}).`
    );
  };

  const handleGenerateAiPost = () => {
    // Dynamic DeepSeek R1 Prompt construction based on active tenant's DNA and Offer
    let sampleTitle = '';
    let sampleHook = '';
    let sampleBody = '';
    let sampleCta = brandDna.leadMagnetCta;
    let sampleHashtags = '';
    let networkTarget = connectedNetworks[0] || 'INSTAGRAM';

    if (tenantKey === 'polanco') {
      sampleTitle = 'Experiencia Sensorial: El Arte del Rib Eye Añejado a las Brasas';
      sampleHook = '¿Por qué un corte sellado a 800°C despierta sensaciones que ningún otro método logra?';
      sampleBody = `En ${activeTenant?.name} celebramos la alta cocina con cortes de autor y mixología que transforma cualquier cena en un recuerdo inolvidable.`;
      sampleHashtags = '#PolancoSteakhouse #AltaCocina #CenaVIP #GastronomiaCDMX';
    } else if (tenantKey === 'urban') {
      sampleTitle = 'Alerta de Lanzamiento: Stock Limitado de Edición Especial';
      sampleHook = 'Solo llegaron 12 pares a México y 3 ya están reservados antes del anuncio público.';
      sampleBody = `En ${activeTenant?.name} garantizamos autenticidad absoluta con tag holográfico serializado y envío express inmediato a todo el país.`;
      sampleHashtags = '#UrbanSneaks #DropAlert #Sneakerheads #StreetwearMexico';
    } else if (tenantKey === 'corp') {
      sampleTitle = 'Optimización B2B: Cómo Eliminar el Cuello de Botella en el Pipeline Comercial';
      sampleHook = 'El 68% de las propuestas B2B se enfrían porque la primera interacción tardó más de 4 horas.';
      sampleBody = `Con la infraestructura soberana de ${activeTenant?.name}, tus prospectos reciben atención técnica inmediata y calificación automatizada con protocolo HITL.`;
      sampleHashtags = '#B2BGrowth #EnterpriseAI #RevenueOps #TransformacionDigital';
    } else {
      sampleTitle = 'Salud Preventiva: Diagnóstico Digital sin Fricción';
      sampleHook = '¿Sabías que un diagnóstico temprano ahorra hasta un 70% en tratamientos futuros?';
      sampleBody = `En ${activeTenant?.name} cuidamos tu bienestar con escaneo digital guiado de última generación, sin dolor y con claridad absoluta en presupuestos.`;
      sampleHashtags = '#OdontologiaIntegral #SaludPreventiva #Diagnostico3D #SonrisasReales';
    }

    triggerModal(
      `Generador de Contenido IA (DeepSeek R1) para ${activeTenant?.name}`,
      `<div class="space-y-3 font-mono text-xs">
        <div class="p-3 rounded-xl bg-neon/10 border border-neon/30 text-lime-700 dark:text-neon">
          <b>🧠 Parámetros RAG Inyectados Dinámicamente:</b><br>
          • <b>Giro / Industria:</b> ${activeTenant?.giro || activeTenant?.verticalLabel}<br>
          • <b>Arquetipo:</b> ${brandDna.archetype}<br>
          • <b>Oferta Activa:</b> "${brandDna.leadMagnetHook}"
        </div>
        <div class="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
          <p class="font-bold text-[var(--text-main)] mb-1">🎬 Guion Generado para ${networkTarget}:</p>
          <p><b>[0-3s Gancho]:</b> "${sampleHook}"</p>
          <p class="mt-1"><b>[Desarrollo]:</b> "${sampleBody}"</p>
          <p class="mt-1"><b>[Oferta / CTA]:</b> "${brandDna.leadMagnetHook}. ${sampleCta}."</p>
        </div>
      </div>`,
      () => {
        const newPost = {
          id: `post-${Date.now()}`,
          network: networkTarget,
          type: 'REEL',
          channel: `${networkTarget} Reels & Feed`,
          publishDate: 'Próx. Miércoles • 19:00 hrs',
          title: sampleTitle,
          hookText: sampleHook,
          copy: `${sampleBody} ${brandDna.leadMagnetHook}. ${sampleCta}.`,
          hashtags: sampleHashtags,
          status: 'PENDIENTE_CLIENTE',
          formatIcon: Video,
          estimatedReach: '25k - 38k visualizaciones estimadas',
          aiConfidence: 99,
        };
        const updated = [newPost, ...posts];
        persistPosts(updated);
        try {
          confetti({ particleCount: 45, spread: 65, colors: ['#E7F900', '#8A95B6', '#FFFFFF'] });
        } catch (e) {}
      },
      'Insertar en Parrilla Editorial'
    );
  };

  const handleSaveBrandDna = () => {
    persistBrandDna(brandDna);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E7F900', '#10B981', '#38BDF8'],
      });
    } catch (e) {}
    triggerModal(
      'ADN de Negocio Sincronizado',
      `Los parámetros de Arquetipo, Glosario Prohibido y Dolores del ICP para <b>${activeTenant?.name}</b> han sido guardados localmente y sincronizados con la memoria RAG de DeepSeek R1.`
    );
  };

  const handleCopyBrandDna = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(brandDna, null, 2));
      setCopiedCanvas(true);
      setTimeout(() => setCopiedCanvas(false), 2000);
    }
  };

  const handleReplicateViralReel = (reel) => {
    // Generate tailored industry variants
    let variants = [];
    if (tenantKey === 'polanco') {
      variants = [
        '1. <b>Variante Carnes Maduradas:</b> "¿Por qué un corte de 45 días sabe infinitamente mejor que uno fresco de supermercado?"',
        '2. <b>Variante Experiencia en Mesa:</b> "El ritual de corte que ningún restaurante tradicional se atreve a hacer frente a los comensales."',
        '3. <b>Variante Mixología Secreta:</b> "¿Crees que un buen corte solo va con vino tinto? Prueba este maridaje con mezcal ahumado."',
      ];
    } else if (tenantKey === 'urban') {
      variants = [
        '1. <b>Variante Costuras y Luz UV:</b> "Por qué los estafadores nunca pueden copiar el patrón de costura de esta lengüeta."',
        '2. <b>Variante Cajas y Etiquetas:</b> "3 Detalles en la etiqueta de la caja que delatan un par falso antes de abrirlo."',
        '3. <b>Variante Inversión Hype:</b> "¿Por qué comprar este par hoy te dará un rendimiento mayor que dejar el dinero en el banco?"',
      ];
    } else if (tenantKey === 'corp') {
      variants = [
        '1. <b>Variante Fuga de Cuentas:</b> "Por qué tu equipo comercial pierde el 40% de las oportunidades en la etapa de propuesta."',
        '2. <b>Variante Soberanía de Datos:</b> "La razón por la que las empresas reguladas nunca deben usar bots cloud sin aislamiento tenant."',
        '3. <b>Variante Velocidad de Respuesta:</b> "¿Cuánto dinero pierde tu compañía por cada hora que tarda en cotizar a un cliente enterprise?"',
      ];
    } else {
      variants = [
        '1. <b>Variante Blanqueamiento:</b> "¿Por qué hacerte un blanqueamiento casero puede arruinar tu esmalte para siempre?"',
        '2. <b>Variante Ortodoncia Invisible:</b> "La verdad oculta sobre por qué los brackets metálicos ya no son la opción más rápida."',
        '3. <b>Variante Limpieza 3D:</b> "¿Crees que lavarte 3 veces al día es suficiente? Mira lo que encontramos con cámara intraoral."',
      ];
    }

    triggerModal(
      `Ingeniería Inversa Viral: ${reel.title}`,
      `<b>Fórmula Psicológica Detectada (DeepSeek R1):</b><br>
      • <b>Disparador:</b> ${reel.psychologicalTrigger}<br>
      • <b>Hook Rate Excepcional:</b> ${reel.hookRate} (Benchmark: 25%)<br>
      • <b>Estímulo Visual:</b> ${reel.visualHook}<br><br>
      <div style="background:#0D0F12; padding:12px; border-radius:12px; border:1px solid #1F242D; font-family:monospace; font-size:11px;">
        <span style="color:#D4FF00; font-weight:bold;">🎬 3 VARIANTES ADAPTADAS A ${activeTenant?.name.toUpperCase()}:</span><br><br>
        ${variants.join('<br>')}
      </div>`,
      () => {
        try {
          confetti({ particleCount: 40, spread: 60, colors: ['#D4FF00', '#10B981'] });
        } catch (e) {}
      },
      'Insertar Variantes en la Parrilla'
    );
  };

  const filteredPosts = posts.filter((p) => {
    // Only display posts belonging to the tenant's connected social networks
    const isNetworkConnected = !p.network || connectedNetworks.includes(p.network);
    if (!isNetworkConnected) return false;

    // Filter by network selector
    if (selectedNetworkFilter !== 'ALL' && p.network !== selectedNetworkFilter) {
      return false;
    }

    // Filter by approval status
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'PENDING') return p.status === 'PENDIENTE_CLIENTE';
    if (selectedFilter === 'APPROVED') return p.status === 'APROBADO_PROGRAMADO';
    return true;
  });

  return (
    <div className="p-6 lg:p-8 block animate-fade-in space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-neon/10 text-neon border border-neon/30">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
              Content Ops & Creative Intelligence
            </span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-main)]">
            Estudio de <span className="text-neon">Contenidos & Crecimiento</span>
          </h2>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Parrilla editorial, ADN de negocio, deconstrucción viral de reels y auditoría de perfiles para:{' '}
            <strong className="text-[var(--text-main)]">{activeTenant?.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGenerateAiPost}
            className="bg-neon text-black text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generar Guion IA (DeepSeek R1)</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs (4 Core Pillars of Content Strategy) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[var(--border-color)]">
        <button
          type="button"
          onClick={() => setActiveTab('grid')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2.5 transition-all shrink-0 ${
            activeTab === 'grid'
              ? 'bg-neon text-black shadow-[0_0_12px_var(--neon-glow)]'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Parrilla Multiplataforma</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-black ${
              activeTab === 'grid'
                ? 'bg-black text-neon'
                : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]'
            }`}
          >
            {filteredPosts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dna')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2.5 transition-all shrink-0 ${
            activeTab === 'dna'
              ? 'bg-neon text-black shadow-[0_0_12px_var(--neon-glow)]'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <Dna className="w-4 h-4" />
          <span>Plantilla de ADN de Negocio</span>
          <span
            className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-black tracking-wider ${
              activeTab === 'dna'
                ? 'bg-black text-neon'
                : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
            }`}
          >
            RAG Listo
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('viral_lab')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2.5 transition-all shrink-0 ${
            activeTab === 'viral_lab'
              ? 'bg-neon text-black shadow-[0_0_12px_var(--neon-glow)]'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Laboratorio de Reels Virales</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-black ${
              activeTab === 'viral_lab'
                ? 'bg-black text-neon'
                : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]'
            }`}
          >
            {viralReels.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2.5 transition-all shrink-0 ${
            activeTab === 'audit'
              ? 'bg-neon text-black shadow-[0_0_12px_var(--neon-glow)]'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Auditoría de Perfiles</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-bold ${
              activeTab === 'audit'
                ? 'bg-black text-neon'
                : 'bg-lime-500/15 text-lime-600 dark:text-lime-400 border border-lime-500/30'
            }`}
          >
            {profileAudit.score}%
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PARRILLA DE CONTENIDO MULTIPLATAFORMA (IDEA 5)                     */}
      {/* ========================================================================= */}
      {activeTab === 'grid' && (
        <div className="space-y-6 animate-fade-in">
          {/* BANNER: OFERTA COMERCIAL VIGENTE */}
          <div className="rounded-2xl bg-[var(--bg-card)] border-2 border-neon/50 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-neon text-black">
                  OFERTA COMERCIAL DEL MES
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Doc Activo: <strong className="text-[var(--text-main)] underline font-bold">{commercialOffer.docName}</strong>
                </span>
              </div>
              <p className="text-xs text-[var(--text-main)] font-bold font-mono">
                Gancho: <span className="text-lime-700 dark:text-neon font-black">"{brandDna.leadMagnetHook}"</span>
              </p>
              <p className="text-[11px] text-[var(--text-muted)] font-mono font-medium">
                CTA: <span className="text-cyan-600 dark:text-cyan-400 font-bold">{brandDna.leadMagnetCta}</span> • Vigencia: {commercialOffer.validity}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowOfferModal(true)}
              className="px-4 py-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-xs font-mono font-bold text-[var(--text-main)] border border-[var(--border-color)] transition-all shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
              <span>Actualizar Oferta del Mes</span>
            </button>
          </div>

          {/* Social Networks Filter Bar & Status Bar */}
          <div className="space-y-3 pb-2">
            {/* Active Social Networks Selector (Customized per Client/Tenant) */}
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <span className="text-[11px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5 mr-1">
                <Share2 className="w-3.5 h-3.5 text-lime-700 dark:text-neon" />
                <span>Canal Activo:</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedNetworkFilter('ALL')}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-all font-bold ${
                  selectedNetworkFilter === 'ALL'
                    ? 'bg-neon text-black shadow-sm'
                    : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                Todas las Redes ({connectedNetworks.length})
              </button>

              {connectedNetworks.map((netKey) => {
                const netMeta = SOCIAL_NETWORKS_CATALOG[netKey];
                if (!netMeta) return null;
                const isSelected = selectedNetworkFilter === netKey;

                return (
                  <button
                    key={netKey}
                    type="button"
                    onClick={() => setSelectedNetworkFilter(netKey)}
                    className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-bold border ${
                      isSelected
                        ? 'bg-neon text-black border-neon shadow-sm'
                        : `${netMeta.badgeColor} hover:brightness-110`
                    }`}
                  >
                    <span>{netMeta.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Approval Status Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)] font-mono font-medium">Estado:</span>
                {['ALL', 'PENDING', 'APPROVED'].map((fil) => (
                  <button
                    key={fil}
                    onClick={() => setSelectedFilter(fil)}
                    className={`text-xs font-mono px-3 py-1 rounded-lg transition-all font-bold ${
                      selectedFilter === fil
                        ? 'bg-neon text-black shadow-sm'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                    }`}
                  >
                    {fil === 'ALL' ? 'Todos' : fil === 'PENDING' ? 'Pendientes de Aprobación' : 'Aprobados y Programados'}
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)] font-medium">
                {filteredPosts.length} publicaciones mostradas
              </span>
            </div>
          </div>

          {/* Posts Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => {
              const IconFormat = getPostFormatIcon(post);
              const isPending = post.status === 'PENDIENTE_CLIENTE';
              const networkCatalog = SOCIAL_NETWORKS_CATALOG[post.network] || {
                name: post.network || 'Red Social',
                badgeColor: 'border-[var(--border-color)] text-[var(--text-muted)] bg-[var(--bg-card-subtle)]',
              };

              return (
                <div
                  key={post.id}
                  className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden shadow-sm flex flex-col justify-between hover:border-neon/50 transition-all"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-[var(--bg-card-subtle)] text-lime-700 dark:text-neon border border-[var(--border-color)]">
                          <IconFormat className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-black border ${networkCatalog.badgeColor}`}>
                              {networkCatalog.name}
                            </span>
                            <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">
                              {post.channel}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                            {post.publishDate}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                          isPending
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isPending ? 'Pendiente Cliente' : 'Aprobado'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[var(--text-main)] font-sans">
                      {post.title}
                    </h4>

                    {/* Hook Text Card */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-neon/40 text-xs font-mono space-y-1">
                      <span className="text-[10px] text-lime-700 dark:text-neon uppercase font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3 text-lime-700 dark:text-neon" />
                        Gancho Viral (0-3s Hook)
                      </span>
                      <p className="text-[var(--text-main)] font-bold italic">
                        "{post.hookText}"
                      </p>
                    </div>

                    {/* Full Copy */}
                    <div className="space-y-1.5 text-xs font-sans">
                      <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block font-bold">
                        Copy & CTA
                      </span>
                      <p className="text-[var(--text-main)] leading-relaxed bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-color)] font-mono text-[11px]">
                        {post.copy}
                      </p>
                      <p className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                        {post.hashtags}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{post.estimatedReach}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyPostCopy(post.id, `${post.copy}\n\n${post.hashtags}`)}
                        className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-mono border border-[var(--border-color)] flex items-center gap-1 transition-colors"
                        title="Copiar Copy y Hashtags"
                      >
                        {copiedPostId === post.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px] font-bold">{copiedPostId === post.id ? '¡Copiado!' : 'Copiar'}</span>
                      </button>

                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => handleApprovePost(post.id)}
                          className="bg-neon text-black text-xs font-bold px-3.5 py-1.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_12px_var(--neon-glow)] flex items-center gap-1.5 active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Aprobar Publicación</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Programado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PLANTILLA DE ADN DE NEGOCIO (IDEA 7)                               */}
      {/* ========================================================================= */}
      {activeTab === 'dna' && (
        <div className="rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-neon/15 text-lime-700 dark:text-neon border border-neon/30">
                <Dna className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
                    Plantilla de ADN de Negocio (Brand DNA Canvas)
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-black bg-neon/15 text-lime-700 dark:text-neon border border-neon/30">
                    {activeTenant?.giro || activeTenant?.verticalLabel || 'Giro Canónico'}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Directrices maestras de identidad, tono de voz y personalidad para {activeTenant?.name}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleResetToCanonicalDna}
                className="px-3 py-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-mono border border-[var(--border-color)] flex items-center gap-1.5 transition-colors font-bold"
                title="Restaurar parámetros predeterminados de la industria"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span>Restaurar Canónico</span>
              </button>
              <button
                type="button"
                onClick={handleCopyBrandDna}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-main)] text-xs font-mono border border-[var(--border-color)] flex items-center gap-1.5 transition-colors font-bold"
              >
                {copiedCanvas ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCanvas ? '¡Copiado!' : 'Copiar JSON'}</span>
              </button>
              <button
                type="button"
                onClick={handleSaveBrandDna}
                className="px-4 py-2 rounded-xl bg-neon text-black font-bold text-xs font-mono shadow-[0_0_12px_var(--neon-glow)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sincronizar con Memoria RAG</span>
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Arquetipo */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
              <span className="text-[10px] text-lime-700 dark:text-neon font-bold uppercase tracking-wider block">
                1. Arquetipo de Marca
              </span>
              <input
                type="text"
                value={brandDna.archetype}
                onChange={(e) => setBrandDna({ ...brandDna, archetype: e.target.value })}
                className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-sans text-xs"
              />
              <p className="text-[10px] text-[var(--text-muted)] font-sans">
                Define la postura psicológica: La Autoridad Confiable, El Mentor Enérgico, El Amigo Rebelde.
              </p>
            </div>

            {/* Tono de Voz */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
              <span className="text-[10px] text-lime-700 dark:text-neon font-bold uppercase tracking-wider block">
                2. Tono de Voz & Adjetivos Clave
              </span>
              <input
                type="text"
                value={brandDna.tone}
                onChange={(e) => setBrandDna({ ...brandDna, tone: e.target.value })}
                className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-sans text-xs"
              />
              <p className="text-[10px] text-[var(--text-muted)] font-sans">
                Estilo de redacción en DMs, WhatsApp y guiones de Reels.
              </p>
            </div>

            {/* Palabras Tabú / Glosario Prohibido */}
            <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/30 space-y-2">
              <span className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                3. Glosario Prohibido (Palabras Tabú)
              </span>
              <textarea
                rows={3}
                value={brandDna.tabooWords}
                onChange={(e) => setBrandDna({ ...brandDna, tabooWords: e.target.value })}
                className="w-full bg-[var(--bg-card-subtle)] border border-red-500/30 rounded-xl p-3 text-[var(--text-main)] focus:border-red-400 outline-none resize-none font-sans text-xs"
              />
              <p className="text-[10px] text-[var(--text-muted)] font-sans">
                Palabras que el bot o los guiones tienen ESTRICTAMENTE prohibido pronunciar.
              </p>
            </div>

            {/* Dolores Primarios del ICP */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
              <span className="text-[10px] text-lime-700 dark:text-neon font-bold uppercase tracking-wider block">
                4. Dolores Agudos del Cliente Ideal (ICP)
              </span>
              <textarea
                rows={3}
                value={brandDna.icpPains}
                onChange={(e) => setBrandDna({ ...brandDna, icpPains: e.target.value })}
                className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none resize-none font-sans text-xs"
              />
              <p className="text-[10px] text-[var(--text-muted)] font-sans">
                Las motivaciones emocionales profundas que impulsan la decisión de agendar.
              </p>
            </div>

            {/* Oferta Gancho Irresistible */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-neon/40 space-y-2 md:col-span-2">
              <span className="text-[10px] text-lime-700 dark:text-neon font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                5. Oferta Gancho Irresistible (Lead Magnet Activo)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={brandDna.leadMagnetHook}
                  onChange={(e) => setBrandDna({ ...brandDna, leadMagnetHook: e.target.value })}
                  placeholder="Gancho de la oferta..."
                  className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-sans text-xs"
                />
                <input
                  type="text"
                  value={brandDna.leadMagnetCta}
                  onChange={(e) => setBrandDna({ ...brandDna, leadMagnetCta: e.target.value })}
                  placeholder="Call to Action con palabra clave..."
                  className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-sans text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LABORATORIO DE REELS VIRALES (IDEAS 3 Y 6)                         */}
      {/* ========================================================================= */}
      {activeTab === 'viral_lab' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-neon/15 text-lime-700 dark:text-neon border border-neon/30">
                  <Flame className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
                    Laboratorio de Deconstrucción & Replicación Viral (DeepSeek R1)
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Análisis de los videos con mayor alcance y generación de fórmulas de contenido replicables
                  </p>
                </div>
              </div>
            </div>

            <Badge variant="neon" size="sm">
              Escucha Activa Meta Graph
            </Badge>
          </div>

          {/* Viral Reels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {viralReels.map((reel) => (
              <div
                key={reel.id}
                className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-5 shadow-sm hover:border-neon/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                      Viral Outlier Confirmado
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">{reel.platform}</span>
                  </div>

                  <h4 className="text-base font-bold text-[var(--text-main)] font-sans">
                    "{reel.title}"
                  </h4>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Vistas</span>
                      <span className="text-sm font-bold text-[var(--text-main)]">{reel.views}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Hook Rate</span>
                      <span className="text-sm font-bold text-lime-700 dark:text-neon">{reel.hookRate}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">DMs CAPI</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{reel.dmsGenerated}</span>
                    </div>
                  </div>

                  {/* DeepSeek R1 Reverse Engineering Card */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-neon/30 space-y-2 text-xs font-mono">
                    <span className="text-[10px] text-lime-700 dark:text-neon font-bold uppercase flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5" />
                      Deconstrucción Algorítmica (Por qué funcionó):
                    </span>
                    <p className="text-[var(--text-main)] font-sans text-xs leading-relaxed">
                      {reel.whyItWorked}
                    </p>
                    <div className="pt-2 border-t border-[var(--border-color)] text-[11px] text-[var(--text-muted)]">
                      <span>Disparador: <strong className="text-[var(--text-main)]">{reel.psychologicalTrigger}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => handleReplicateViralReel(reel)}
                    className="w-full py-3 px-4 rounded-xl bg-neon text-black font-bold text-xs font-mono shadow-[0_0_12px_var(--neon-glow)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>🧬 Replicar Fórmula en 3 Nuevos Guiones</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDITORÍA DE PERFILES SOCIALES (IDEA 4)                             */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-neon/15 text-lime-700 dark:text-neon border border-neon/30">
                <Search className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
                  Auditoría de Perfil Social: {profileAudit.handle}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Optimización de biografía, enlaces y conversión directa hacia WhatsApp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <span className="text-xs text-[var(--text-muted)] block">Health Score de Perfil:</span>
                <span className="text-lg font-bold text-lime-700 dark:text-neon">{profileAudit.score} / 100</span>
              </div>
            </div>
          </div>

          {/* Audit Checks Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileAudit.checks.map((chk) => (
              <div
                key={chk.id}
                className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-main)] text-sm flex items-center gap-2 font-sans">
                    {chk.status === 'PASSED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    {chk.title}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      chk.status === 'PASSED'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {chk.status === 'PASSED' ? 'Optimizado' : 'Requiere Ajuste'}
                  </span>
                </div>

                <p className="text-[var(--text-main)] font-sans text-xs">
                  {chk.diagnosis}
                </p>

                <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)] space-y-1">
                  <span className="text-lime-700 dark:text-neon font-bold block">Recomendación IA:</span>
                  <p className="text-[var(--text-main)]">{chk.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL PARA ACTUALIZAR OFERTA COMERCIAL */}
      {showOfferModal && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowOfferModal(false);
            }}
          >
            <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-panel)] border border-neon/40 shadow-2xl p-6 sm:p-8 relative space-y-4 my-auto animate-scale-up">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-lime-700 dark:text-neon">
                Sincronización con DeepSeek R1
              </span>
              <h3 className="text-xl font-black text-[var(--text-main)]">
                Editar Oferta Comercial del Mes
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Al guardar, todas las nuevas ideas de contenido y llamadas a la acción se alinearán a esta oferta.
              </p>
            </div>

            <form onSubmit={handleUpdateCommercialOffer} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">
                  Documento de Propuesta Comercial (.pdf, .docx, .md)
                </label>
                <input
                  type="text"
                  value={commercialOffer.docName}
                  onChange={(e) => setCommercialOffer({ ...commercialOffer, docName: e.target.value })}
                  className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none"
                />
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">
                  Gancho Comercial del Mes (Hook)
                </label>
                <textarea
                  rows={2}
                  value={brandDna.leadMagnetHook}
                  onChange={(e) => setBrandDna({ ...brandDna, leadMagnetHook: e.target.value })}
                  className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">
                  Llamado a la Acción (CTA) & Palabra Clave
                </label>
                <input
                  type="text"
                  value={brandDna.leadMagnetCta}
                  onChange={(e) => setBrandDna({ ...brandDna, leadMagnetCta: e.target.value })}
                  className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neon text-black font-bold hover:bg-[var(--neon-hover)] shadow-neon"
                >
                  Guardar y Sincronizar
                </button>
              </div>
            </form>
          </div>
        </div>
        </Portal>
      )}
    </div>
  );
};

export default ContentPlanner;
