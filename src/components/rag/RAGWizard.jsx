'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Database,
  FileText,
  Upload,
  Shield,
  Key,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  BookOpen,
  AlertTriangle,
  History,
  Building2,
  Layers,
  Cpu,
  RefreshCw,
  PlusCircle,
  Eye,
  Check,
  X,
  HelpCircle,
  FileCode,
  FileSpreadsheet,
  FileCheck,
  Send,
  Lock,
  Megaphone,
  ToggleLeft,
  ToggleRight,
  Info,
  Sliders,
  Zap,
  CheckSquare,
  Flame,
  ShieldAlert,
  ListFilter,
  Lightbulb,
  Search,
  Dumbbell,
  GraduationCap,
  Users,
  ShoppingBag,
  Utensils,
  Briefcase,
  Home,
  Video,
  Scale,
  Car,
  HeartPulse,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VectorLobo } from '@/components/common/VectorLobo';

// =========================================================================
// TAXONOMÍA UNIVERSAL DE GIROS DE NEGOCIO Y MODELOS DE CONVERSIÓN
// =========================================================================
export const BUSINESS_CATEGORIES = [
  { id: 'all', name: 'Todos los Giros', icon: Layers },
  { id: 'fitness_health', name: 'Fitness & Salud', icon: Dumbbell },
  { id: 'education', name: 'Educación & Cursos', icon: GraduationCap },
  { id: 'networking', name: 'Networking & Membresías', icon: Users },
  { id: 'retail_ecom', name: 'Retail & E-Commerce', icon: ShoppingBag },
  { id: 'hospitality', name: 'Hospitality & Eventos', icon: Utensils },
  { id: 'b2b_services', name: 'B2B & Servicios Pro', icon: Briefcase },
  { id: 'realestate_auto', name: 'Bienes Raíces & Autos', icon: Home },
  { id: 'creators', name: 'Creadores & Marcas Meta', icon: Video },
];

export const BUSINESS_VERTICALS_CONFIG = {
  // -------------------------------------------------------------
  // 1. FITNESS, SALUD & BIENESTAR
  // -------------------------------------------------------------
  gym_fitness: {
    id: 'gym_fitness',
    category: 'fitness_health',
    name: 'Gimnasios, CrossFit & Fitness Studios',
    badge: 'Membresías & Pase Gratis',
    avatar: '🏋️‍♂️',
    conversionGoal: 'Agendar Clase Muestra / Pase de 1 Día Gratis / Cierre de Membresía Mensual o Anual.',
    description: 'Enfocado en resolver dudas de horarios, clases (spinning, yoga, pesas), planes de membresía y agendar prueba de cortesía.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Tarifas de Membresías (Mensual, Trimestral, Anual), Costo de Inscripción y Promos 2x1' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Identidad Enérgica, Motivadora & Disciplinada (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Políticas de Congelación de Membresía, Reglamento de Instalaciones y Cancelaciones' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Testimonios de Transformación Física & Logros de la Comunidad' },
    },
    defaultRules: [
      'Ofrecer el Pase de 1 Día Gratis a todo usuario nuevo antes de forzar la compra.',
      'Aclarar que las membresías domiciliadas requieren aviso de cancelación con 15 días de anticipación.',
      'Si el usuario pregunta por planes personalizados de esteroides o sustancias prohibidas, rechazar y reiterar enfoque 100% natural y seguro.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-gym-1',
        title: 'Lead Magnet: Pase de 1 Día Gratis (Pilar 1)',
        description: 'Configura un QR de acceso de prueba que el bot envíe inmediatamente al pedir informes.',
        actionLabel: 'Activar Pase de Cortesía',
        targetPilar: 'Propuesta Comercial',
        applied: true,
      },
      {
        id: 'sug-gym-2',
        title: 'Política de Congelación por Lesión o Viaje (Pilar 3)',
        description: 'Evita reclamos definiendo si la membresía puede pausarse hasta 30 días.',
        actionLabel: 'Aplicar Política de Congelación',
        targetPilar: 'Pilar 3 (FAQs)',
        applied: false,
      },
    ],
  },
  service_appointments: {
    id: 'service_appointments',
    category: 'fitness_health',
    name: 'Clínicas Médicas, Dentales & Consultorios',
    badge: 'Citas & Confianza Médica',
    avatar: '🦷',
    conversionGoal: 'Calificar paciente y agendar Cita de Diagnóstico / Valoración Presencial.',
    description: 'Enfocado en resolver dudas sobre procedimientos, aranceles aproximados, pagos a meses y disponibilidad de agenda médica.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Aranceles Base, Facilidades de Pago (MSI) y Seguros Aceptados' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Identidad Empática, Profesional & Científica (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Protocolo Médico, Cancelaciones con 24h y Teléfono de Urgencias' },
      pilar4: { status: 'optional', label: 'Pilar 4: Casos Clínicos de Éxito Anónimos' },
    },
    defaultRules: [
      'NUNCA dar un diagnóstico médico definitivo por chat; siempre invitar a valoración presencial.',
      'Si el paciente reporta dolor agudo, hemorragia o emergencia, dar el teléfono de guardia de inmediato.',
      'Las cancelaciones deben solicitarse con mínimo 24h de anticipación.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-med-1',
        title: 'Protocolo Anti-Diagnóstico por Chat (Pilar 3)',
        description: 'Protección legal: obliga al bot a recordar que los tratamientos requieren valoración clínica presencial.',
        actionLabel: 'Activar Protocolo Médico',
        targetPilar: 'Pilar 3 (Crisis)',
        applied: true,
      },
      {
        id: 'sug-med-2',
        title: 'Política de Cancelación 24 Horas (Pilar 3)',
        description: 'Define la penalización o re-agendamiento para proteger los horarios de los doctores.',
        actionLabel: 'Insertar Regla 24h',
        targetPilar: 'Pilar 3 (FAQs)',
        applied: false,
      },
    ],
  },
  spa_beauty: {
    id: 'spa_beauty',
    category: 'fitness_health',
    name: 'Spas, Clínicas Estéticas & Barberías',
    badge: 'Citas & Cuidado Personal',
    avatar: '💆🏻‍♀️',
    conversionGoal: 'Agendar cita de servicio, vender paquetes de sesiones y promociones de temporada.',
    description: 'Enfocado en catálogo de servicios estéticos, masajes, faciales, microblading o cortes, con agenda por especialista.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Menú de Servicios, Paquetes de Sesiones y Anticipos de Cita' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Relajante, Sofisticado & Amable (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Política de Anticipo No Reembolsable y Tolerancia de 10 min' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Galería de Antes y Después de Tratamientos' },
    },
    defaultRules: [
      'Requerir anticipo del 30% para apartar citas en fin de semana.',
      'Tolerancia máxima de 10 minutos para no afectar las citas posteriores.',
      'Advertir contraindicaciones para embarazadas o pieles sensibles en tratamientos químicos.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-spa-1',
        title: 'Anticipo para Apartar Horarios Pico',
        description: 'Reduce el No-Show pidiendo anticipo de confirmación vía transferencia o tarjeta.',
        actionLabel: 'Vincular Regla de Anticipo',
        targetPilar: 'Pilar 3',
        applied: true,
      },
    ],
  },

  // -------------------------------------------------------------
  // 2. EDUCACIÓN, ESCUELAS & ACADEMIAS
  // -------------------------------------------------------------
  education_schools: {
    id: 'education_schools',
    category: 'education',
    name: 'Escuelas, Colegios & Universidades',
    badge: 'Admisiones & Visita al Campus',
    avatar: '🎓',
    conversionGoal: 'Agendar Visita Guiada / Sesión Informativa de Admisiones / Enviar Plan de Estudios.',
    description: 'Enfocado en resolver dudas de padres de familia y aspirantes sobre oferta académica, becas, costos y fechas de examen.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Colegiaturas, Costo de Inscripción, Cuotas de Exámenes y Esquemas de Becas' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Formativo, Institucional, Cálido & Confiable (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Fechas Límite de Registro, Documentación Oficial y Políticas de Reembolso' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Acreditaciones Oficiales (SEP, RVOE), Bolsa de Trabajo y Convenios' },
    },
    defaultRules: [
      'Aclarar que los costos de colegiatura son vigentes solo para el ciclo escolar en curso.',
      'Enviar el Folleto / Plan de Estudios en PDF cuando el usuario pregunte por materias.',
      'Si el usuario pregunta por becas, explicar los requisitos de promedio mínimo antes de prometer porcentajes.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-edu-1',
        title: 'Folleto de Admisiones Digital 2026',
        description: 'Permite que el bot entregue el PDF oficial con el mapa curricular inmediatamente en el chat.',
        actionLabel: 'Adjuntar Folleto Escolar',
        targetPilar: 'Propuesta Comercial',
        applied: true,
      },
      {
        id: 'sug-edu-2',
        title: 'Requisitos de Promedio para Becas (Pilar 3)',
        description: 'Evita falsas expectativas definiendo que las becas aplican a partir de 8.5 de promedio.',
        actionLabel: 'Configurar Regla de Beca',
        targetPilar: 'Pilar 3',
        applied: false,
      },
    ],
  },
  academies_courses: {
    id: 'academies_courses',
    category: 'education',
    name: 'Academias de Idiomas, Música, Danza & Talleres',
    badge: 'Clase Muestra & Inscripciones',
    avatar: '📚',
    conversionGoal: 'Agendar Clase Muestra Gratis / Test de Nivelación / Venta de Curso.',
    description: 'Enfocado en academias locales o híbridas con horarios grupales e individuales, exámenes de ubicación y paquetes mensuales.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Precios por Nivel, Mensualidades y Paquetes de Material Didáctico' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Pedagógico, Motivante & Amigable (Obligatorio)' },
      pilar3: { status: 'recommended', label: 'Pilar 3: Políticas de Reposición de Clases por Falta y Certificaciones' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Evaluaciones de Alumnos & Casos de Fluidez / Éxito' },
    },
    defaultRules: [
      'Ofrecer Test de Nivelación Gratuito a usuarios interesados en cursos de idiomas.',
      'Explicar que las clases no asistidas pueden reponerse máximo 1 vez por mes con aviso previo.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-acad-1',
        title: 'Test de Ubicación Rápido de 3 Preguntas',
        description: 'El bot califica el nivel del alumno y le sugiere el grupo ideal con horario disponible.',
        actionLabel: 'Activar Test de Nivelación',
        targetPilar: 'Pilar 1',
        applied: true,
      },
    ],
  },
  infoproducts_bootcamps: {
    id: 'infoproducts_bootcamps',
    category: 'education',
    name: 'Cursos Online, Bootcamps Tech & Infoproductos',
    badge: 'Venta Directa & Webhook',
    avatar: '💻',
    conversionGoal: 'Registro a Masterclass / Venta Directa en Hotmart o Stripe / Postulación a Bootcamp.',
    description: 'Enfocado en escala digital masiva, lanzamiento de infoproductos, soporte a alumnos y recuperación de carritos.',
    pillars: {
      pilar1: { status: 'mandatory_critical', label: 'Pilar 1: Precio de Lanzamiento, Descuentos por Tiempo Limitado y Pagos en Cuotas' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Disruptivo, Aspiracional & Tecnológico (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Garantía Incondicional de 7 o 14 Días y Acceso a la Plataforma' },
      pilar4: { status: 'mandatory_critical', label: 'Pilar 4: Resultados de Egresados, Testimonios en Video y Empleabilidad' },
    },
    defaultRules: [
      'Reiterar la Garantía de Satisfacción de 7 días (reembolso 100% sin preguntas).',
      'Si el alumno no puede ingresar a la plataforma, derivar a soporte técnico con link de reseteo.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-boot-1',
        title: 'Garantía Incondicional de 7 Días (Pilar 3)',
        description: 'Genera confianza absoluta para compras por impulso en checkout digital.',
        actionLabel: 'Activar Garantía 7 Días',
        targetPilar: 'Pilar 3',
        applied: true,
      },
    ],
  },

  // -------------------------------------------------------------
  // 3. NETWORKING, MEMBRESÍAS & COMUNIDADES
  // -------------------------------------------------------------
  networking_mastermind: {
    id: 'networking_mastermind',
    category: 'networking',
    name: 'Redes de Networking, Cámaras & Masterminds',
    badge: 'Sesión Invitado & Filtro B2B',
    avatar: '🤝',
    conversionGoal: 'Invitar a Sesión de Desayuno / Calificar Giro Comercial / Vender Membresía Anual.',
    description: 'Enfocado en comunidades de empresarios y profesionales donde existe exclusividad de giro por capítulo y cuota anual.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Cuota Anual de Membresía, Desayunos y Opciones de Financiamiento' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Ejecutivo, Colaborativo & de Alto Valor (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Regla de Exclusividad de Giro, Asistencia Obligatoria y Código de Ética' },
      pilar4: { status: 'mandatory_critical', label: 'Pilar 4: Millones Generados en Negocios Cerrados (GNC) entre Miembros' },
    },
    defaultRules: [
      'Preguntar SIEMPRE el giro y empresa del prospecto para verificar que su categoría no esté ocupada.',
      'Ofrecer 1 Pase de Invitado de Honor para que viva la dinámica antes de pagar la membresía.',
      'Si el giro está bloqueado por otro socio, ofrecer lista de espera o capítulo alternativo.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-net-1',
        title: 'Verificador de Disponibilidad de Giro (Pilar 3)',
        description: 'El bot valida si el giro del prospecto ya está tomado en el grupo para no duplicar competencia.',
        actionLabel: 'Activar Filtro de Exclusividad',
        targetPilar: 'Pilar 3',
        applied: true,
      },
      {
        id: 'sug-net-2',
        title: 'Invitación Formal a Desayuno de Negocios',
        description: 'Genera el copy personalizado para invitar al empresario a la próxima sesión presencial o virtual.',
        actionLabel: 'Configurar Invitación VIP',
        targetPilar: 'Propuesta Comercial',
        applied: false,
      },
    ],
  },
  community_subscriptions: {
    id: 'community_subscriptions',
    category: 'networking',
    name: 'Comunidades de Pago & Clubs Privados',
    badge: 'Membresía Recurrente',
    avatar: '🏛️',
    conversionGoal: 'Suscripción mensual recurrente / Acceso a canal VIP de Telegram/Discord.',
    description: 'Enfocado en suscripciones recurrentes con contenido exclusivo, networking, eventos y llamadas mensuales.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Planes Mensual / Semestral / Anual y Período de Prueba' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono de Tribu, Exclusivo & Cercano (Obligatorio)' },
      pilar3: { status: 'recommended', label: 'Pilar 3: Reglas de Convivencia, Cero Spam y Auto-Cancelación' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Grabaciones de Sesiones Anteriores y Casos de la Comunidad' },
    },
    defaultRules: [
      'Cero tolerancia a la venta agresiva o spam dentro de la comunidad de socios.',
      'Aclarar que el cobro es automático recurrente y cancelable en cualquier momento desde el panel.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-com-1',
        title: 'Reglamento de Cero Spam en la Comunidad',
        description: 'Establece que cualquier miembro que prospecte sin permiso es suspendido.',
        actionLabel: 'Insertar Código Anti-Spam',
        targetPilar: 'Pilar 3',
        applied: true,
      },
    ],
  },

  // -------------------------------------------------------------
  // 4. RETAIL, PRODUCTOS & E-COMMERCE
  // -------------------------------------------------------------
  ecommerce: {
    id: 'ecommerce',
    category: 'retail_ecom',
    name: 'Retail & E-Commerce (Marcas D2C)',
    badge: 'Venta Online & Envíos',
    avatar: '👟',
    conversionGoal: 'Cierre de Venta en Sitio Web / Resolver Dudas de Tallas / Despacho de Pedidos.',
    description: 'Enfocado en catálogo de productos físicos, stock, costos de paquetería, tiempos de entrega y pasarelas de pago.',
    pillars: {
      pilar1: { status: 'mandatory_critical', label: 'Pilar 1: Catálogo de SKUs, Precios, Tallas, Stock y Cupones' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Identidad Dinámica, Fresca & Visual (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Guías de Envío, Políticas de Devolución por Talla y Tiempos de Entrega' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Top Bestsellers y Promociones Exitosas' },
    },
    defaultRules: [
      'Nunca prometer entregas en menos de 48h hábiles si la paquetería estándar maneja 3 a 5 días.',
      'No autorizar descuentos superiores al 15% sin cupón verificado en sistema.',
      'Si el cliente reporta producto dañado, solicitar foto del empaque y abrir ticket HITL.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-ecom-1',
        title: 'Guía de Tallas y Tiempos de Envío (Pilar 3)',
        description: 'La IA aclara medidas exactas en centímetros para reducir devoluciones.',
        actionLabel: 'Insertar Guía de Tallas',
        targetPilar: 'Pilar 3',
        applied: true,
      },
    ],
  },

  // -------------------------------------------------------------
  // 5. HOSPITALITY, RESTAURANTES & EVENTOS
  // -------------------------------------------------------------
  hospitality: {
    id: 'hospitality',
    category: 'hospitality',
    name: 'Restaurantes, Bares & Mixología',
    badge: 'Reservas & Experiencia',
    avatar: '🥩',
    conversionGoal: 'Reservación de Mesa / Consulta de Menú & Precios / Eventos Privados.',
    description: 'Enfocado en hospitalidad, apetito visual, dress code, reservaciones en horarios pico y gestión de no-shows.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Menú Digital, Ticket Promedio por Comensal y Paquetes de Cumpleaños' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Cálido, Gourmet, Experiencial & Amigable (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Alergias Alimentarias, Dress Code y Tolerancia de 15 Minutos en Mesa' },
      pilar4: { status: 'optional', label: 'Pilar 4: Fechas de Alta Demanda (San Valentín, Fin de Año, Días Festivos)' },
    },
    defaultRules: [
      'Preguntar SIEMPRE por alergias al confirmar mesas para grupos.',
      'Tolerancia máxima de 15 minutos antes de liberar la mesa a lista de espera.',
      'Para grupos mayores a 8 personas, pedir anticipo o transferir a eventos privados.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-hosp-1',
        title: 'Protocolo de Alergias e Intolerancias (Pilar 3)',
        description: 'El bot advierte ingredientes como mariscos, nueces o gluten para seguridad total.',
        actionLabel: 'Activar Alerta de Alérgenos',
        targetPilar: 'Pilar 3',
        applied: true,
      },
    ],
  },
  event_venues: {
    id: 'event_venues',
    category: 'hospitality',
    name: 'Salones de Eventos, Bodas & Banquetes',
    badge: 'Cotización por Persona',
    avatar: '🎉',
    conversionGoal: 'Agendar Visita al Salón / Cotización por Número de Invitados / Apartado de Fecha.',
    description: 'Enfocado en bodas, XV años, graduaciones y eventos corporativos con paquetes por persona y amenidades.',
    pillars: {
      pilar1: { status: 'mandatory_critical', label: 'Pilar 1: Paquetes por Persona (Plata, Oro, Platino), Horas Extras y Menú de Tiempos' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Festivo, Emotivo, Confiable & Elegante (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Esquema de Pagos (Anticipo, Liquidación 15 días antes) y Cancelaciones' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Fotografías de Montajes Reales y Recomendaciones de Proveedores' },
    },
    defaultRules: [
      'No confirmar disponibilidad de fecha sin verificar el calendario maestro de eventos.',
      'Invitar siempre a degustación y recorrido presencial antes de firmar contrato.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-eve-1',
        title: 'Calculadora Rápida por Comensal',
        description: 'Calcula el presupuesto estimado multiplicando invitados por tipo de paquete.',
        actionLabel: 'Activar Calculadora',
        targetPilar: 'Pilar 1',
        applied: true,
      },
    ],
  },

  // -------------------------------------------------------------
  // 6. B2B, CONSULTORÍA & SERVICIOS PROFESIONALES
  // -------------------------------------------------------------
  b2b: {
    id: 'b2b',
    category: 'b2b_services',
    name: 'B2B Sales, Software SaaS & Consultoría',
    badge: 'Discovery Call & BANT',
    avatar: '💼',
    conversionGoal: 'Calificar BANT (Presupuesto, Decisor, Necesidad, Tiempo) y agendar Discovery Call.',
    description: 'Enfocado en ventas corporativas high-ticket, acuerdos anuales, integraciones con ERP/CRM y ROI empresarial.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Rangos de Presupuesto Enterprise, Planes de Suscripción y ROI Estimado' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Ejecutivo, Consultivo, Estratégico & Riguroso (Obligatorio)' },
      pilar3: { status: 'recommended', label: 'Pilar 3: Acuerdos de Confidencialidad (NDA), SLAs y Términos de Servicio' },
      pilar4: { status: 'mandatory_critical', label: 'Pilar 4: Casos de Estudio Reales con Métricas y Whitepapers Técnicos' },
    },
    defaultRules: [
      'No compartir metodología propietaria antes de la firma de NDA.',
      'Solo agendar llamada con directores si el presupuesto supera el ticket mínimo calificado.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-b2b-1',
        title: 'Filtro BANT de Calificación de Leads',
        description: 'Filtra prospectos sin presupuesto asignado para no saturar al equipo comercial.',
        actionLabel: 'Activar Scoring BANT',
        targetPilar: 'Pilar 1',
        applied: true,
      },
    ],
  },
  legal_accounting: {
    id: 'legal_accounting',
    category: 'b2b_services',
    name: 'Despachos Legales, Notarías & Contadores',
    badge: 'Asesoría Inicial & Dictamen',
    avatar: '⚖️',
    conversionGoal: 'Agendar Consulta Inicial de Asesoría / Diagnóstico Fiscal / Revisión de Contratos.',
    description: 'Enfocado en servicios jurídicos, defensa fiscal, constitución de empresas y blindaje corporativo.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Costo de Consulta Inicial, Pólizas Mensuales y Aranceles por Trámite' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Formal, Riguroso, Ético & de Máxima Discreción (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Secreto Profesional, Confidencialidad y Términos de Representación' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Casos Resueltos Favorablemente (Sin revelar datos de clientes)' },
    },
    defaultRules: [
      'Aclarar que la información enviada está protegida bajo Secreto Profesional.',
      'No prometer resoluciones judiciales garantizadas (prohibido por ética legal).',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-leg-1',
        title: 'Cláusula de Secreto Profesional Automática',
        description: 'Garantiza al cliente que sus datos legales y fiscales están blindados y confidenciales.',
        actionLabel: 'Insertar Blindaje Legal',
        targetPilar: 'Pilar 3',
        applied: true,
      },
    ],
  },

  // -------------------------------------------------------------
  // 7. BIENES RAÍCES & AUTOMOTRIZ
  // -------------------------------------------------------------
  realestate: {
    id: 'realestate',
    category: 'realestate_auto',
    name: 'Bienes Raíces, Desarrollos & Inmobiliarias',
    badge: 'Visita Showroom & Enganche',
    avatar: '🏙️',
    conversionGoal: 'Agendar Visita al Showroom o Desarrollo / Enviar Broshure y Planos / Calificar Crédito.',
    description: 'Enfocado en desarrollos en preventa, casas, departamentos, terrenos de inversión, plusvalía y financiamiento.',
    pillars: {
      pilar1: { status: 'mandatory_critical', label: 'Pilar 1: Precios por m², Esquemas de Enganche, Mensualidades y Descuentos en Preventa' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Asesor, Patrimonial, Inspirador & Profesional (Obligatorio)' },
      pilar3: { status: 'recommended', label: 'Pilar 3: Requisitos de Crédito Hipotecario (Infonavit, Bancario) y Proceso Notarial' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Historial de Entregas a Tiempo, Plusvalía Proyectada y Amenidades' },
    },
    defaultRules: [
      'No prometer rendimientos garantizados de plusvalía sin citar el estudio de mercado.',
      'Agendar visitas a showroom solo tras confirmar capacidad de inversión o crédito pre-aprobado.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-re-1',
        title: 'Calculadora de Enganche y Mensualidades',
        description: 'Permite al bot dar un desglose estimado de pagos según el plazo hipotecario.',
        actionLabel: 'Insertar Esquema Financiero',
        targetPilar: 'Pilar 1',
        applied: true,
      },
    ],
  },
  automotive: {
    id: 'automotive',
    category: 'realestate_auto',
    name: 'Agencias de Autos, Concesionarias & Talleres',
    badge: 'Prueba de Manejo & Servicio',
    avatar: '🚗',
    conversionGoal: 'Agendar Prueba de Manejo (Test Drive) / Cita de Mantenimiento Mecánico / Cotizar Enganche.',
    description: 'Enfocado en venta de autos nuevos y seminuevos, esquemas de arrendamiento, garantías mecánicas y citas de taller.',
    pillars: {
      pilar1: { status: 'mandatory_critical', label: 'Pilar 1: Precios de Unidades, Enganches desde el 10%, Mensualidades y Paquetes de Servicio' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Dinámico, Experto, Confiable & Ágil (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Requisitos de Identificación para Test Drive y Cobertura de Garantía' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Reseñas de Manejo y Entrega de Unidades a Clientes Satisfechos' },
    },
    defaultRules: [
      'Para agendar Test Drive es obligatorio contar con Licencia de Conducir Vigente.',
      'Reiterar que las cotizaciones de financiamiento están sujetas a aprobación crediticia.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-auto-1',
        title: 'Requisito de Licencia para Prueba de Manejo',
        description: 'Solicita foto de la licencia antes de confirmar la cita de prueba en la agencia.',
        actionLabel: 'Activar Validación Test Drive',
        targetPilar: 'Pilar 3',
        applied: true,
      },
    ],
  },

  // -------------------------------------------------------------
  // 8. CREADORES DE CONTENIDO & MARCA PERSONAL
  // -------------------------------------------------------------
  creator: {
    id: 'creator',
    category: 'creators',
    name: 'Creadores en Redes Meta, Streamers & Podcasts',
    badge: 'Marketing & Media Kit',
    avatar: '🎬',
    conversionGoal: 'Interacción con Audiencia / Responder Menciones en Stories / Cerrar Acuerdos con Marcas.',
    description: 'Enfocado en marcas personales, influencers y creadores de contenido que monetizan con patrocinios y engagement en Instagram/TikTok.',
    pillars: {
      pilar1: { status: 'optional_off', label: 'Pilar 1: Precios / Media Kit Privado (Opcional - Tarifas para Marcas)' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Identidad & Tono de Voz Único del Creador (Obligatorio Núcleo)' },
      pilar3: { status: 'recommended', label: 'Pilar 3: Moderación de Hate, Filtro Anti-Troll y Menciones en Stories' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Histórico de Hooks Virales, Retención de Reels y Métricas de Audiencia' },
    },
    defaultRules: [
      'Nunca promocionar marcas no aprobadas en el Media Kit oficial.',
      'Si un usuario insulta o hace hate agresivo, ocultar comentario y derivar a moderación.',
      'Si una marca ofrece más de $1,000 USD de patrocinio, pedir brief y escalar al manager humano.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-cr-1',
        title: 'Respuesta Automática a Menciones en Stories (Pilar 2)',
        description: 'Agradece en 10 segundos a quienes te etiqueten y envíales un regalo o sticker exclusivo.',
        actionLabel: 'Activar Story Nurture',
        targetPilar: 'Pilar 2',
        applied: true,
      },
    ],
  },
};

export const RAGWizard = () => {
  const { role, isAdmin, isClient, activeTenant, triggerModal, tenantsData } = useAuth();

  // Mode for Admin: 'list' (Tenant Overview & Requests) or 'wizard' (Step-by-Step New Business Onboarding)
  const [adminViewMode, setAdminViewMode] = useState('list');
  const [currentStep, setCurrentStep] = useState(1);

  // Category Filter and Search Query for Vertical Selection
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Ingestion Mode Toggle: 'briefing' (1-Click Master Briefing) vs 'guided' (5-Stage Wizard)
  const [ingestionMode, setIngestionMode] = useState('briefing');
  const [isAnalyzingBriefing, setIsAnalyzingBriefing] = useState(false);
  const [briefingAnalysisStage, setBriefingAnalysisStage] = useState('');
  const [briefingAnalyzed, setBriefingAnalyzed] = useState(false);
  const [masterDocText, setMasterDocText] = useState('');

  // Client change request modal
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedPillarForChange, setSelectedPillarForChange] = useState('pillar2');
  const [changeNotes, setChangeNotes] = useState('');
  const [changeFileName, setChangeFileName] = useState('');

  // Form State for Onboarding Wizard
  const [wizardData, setWizardData] = useState({
    businessName: '',
    vertical: 'gym_fitness',
    businessGoal: 'appointments',
    primaryContact: '',
    contactEmail: '',
    
    // Toggles for Optional Pillars (Only Pillar 2 is strictly required!)
    enablePricingPillar: true,
    enableCrisisPillar: true,
    enableHistoryPillar: false,

    // Propuesta Comercial & Oferta de Valor (HÍBRIDO: Documento + 3 Highlights)
    enableCommercialProposal: true,
    commercialProposalDoc: 'Propuesta_Comercial_Oferta_Irresistible.pdf',
    commercialProposalFormat: 'pdf',
    offerHook: 'Pase de 1 Día Gratis + 2x1 en Inscripción al agendar esta semana',
    offerCta: 'Envía "PASE GRATIS" por DM o comenta este post para apartar cupo',
    offerValidity: 'Campaña Activa de Temporada (Primeros 30 registros)',

    // Inviolable Rules (Reglas Inviolables)
    inviolableRules: [
      'Ofrecer el Pase de 1 Día Gratis a todo usuario nuevo antes de forzar la compra.',
      'Aclarar que las membresías domiciliadas requieren aviso de cancelación con 15 días de anticipación.',
      'Si el usuario pregunta por sustancias prohibidas, reiterar enfoque 100% natural y seguro.',
    ],
    newRuleInput: '',

    // Pillar 1: Matriz de Rentabilidad (OPCIONAL)
    cacMax: 150,
    ltvExpected: 3600,
    minGrossMargin: 55,
    pricingDoc: 'Matriz_Precios_Membresias.json',
    pricingFormat: 'json',

    // Pillar 2: Identidad y Tono de Voz (OBLIGATORIO)
    brandTone: 'Enérgico, Motivador, Disciplinado y Cercano',
    archetype: 'El Entrenador Experto & Aliado de Transformación',
    emojiPolicy: 'Activo (2-3 emojis deportivos por mensaje: 🏋️🔥💪)',
    brandbookDoc: 'Brandbook_Fitness_TonoVoz.md',
    brandbookFormat: 'md',

    // Pillar 3: Protocolos de Crisis y FAQs (OPCIONAL)
    useDefaultCrisisTemplate: true,
    crisisKeywords: 'estafa, lesion, queja, profeco, cancelar, reembolso, cobrar de mas',
    hitlEscalationLatency: 'Sub-segundo (< 1.2s)',
    faqsDoc: 'Reglamento_Instalaciones_FAQs.md',
    faqsFormat: 'md',

    // Pillar 4: Histórico de Datos (OPCIONAL)
    historicalContext: 'Historial previo de transformaciones y 450 miembros activos.',
    historicalDoc: 'Historico_Miembros_CasosExito.txt',
    historicalFormat: 'txt',

    // API Credentials
    whatsappPhoneId: '',
    metaAccessToken: '',
    deepseekApiKey: '',
    stripeWebhookSecret: '',
  });

  // Active suggestions state for interactive 1-click apply
  const [suggestions, setSuggestions] = useState(BUSINESS_VERTICALS_CONFIG.gym_fitness.proactiveSuggestions);

  // Filtered verticals based on category and search query
  const filteredVerticals = useMemo(() => {
    return Object.values(BUSINESS_VERTICALS_CONFIG).filter((vert) => {
      const matchesCategory = selectedCategory === 'all' || vert.category === selectedCategory;
      const matchesSearch =
        vert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vert.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Calculate dynamic RAG Health Score (0-100)
  const calculateHealthScore = () => {
    let score = 50;
    if (wizardData.brandbookDoc) score += 20;
    if (wizardData.enableCommercialProposal && wizardData.offerHook) score += 15;
    if (wizardData.enableCrisisPillar) score += 10;
    if (wizardData.inviolableRules.length >= 3) score += 5;
    return Math.min(score, 100);
  };

  const healthScore = calculateHealthScore();

  // Switch vertical & update pillar defaults + suggestions
  const handleSelectVertical = (verticalId) => {
    const verticalConfig = BUSINESS_VERTICALS_CONFIG[verticalId] || BUSINESS_VERTICALS_CONFIG.gym_fitness;
    const isSalesFocused = verticalConfig.category === 'retail_ecom' || verticalConfig.category === 'realestate_auto';
    
    setWizardData((prev) => ({
      ...prev,
      vertical: verticalId,
      businessGoal: isSalesFocused ? 'sales_direct' : verticalConfig.category === 'creators' ? 'marketing_branding' : 'appointments',
      enablePricingPillar: verticalId !== 'creator',
      enableCrisisPillar: true,
      inviolableRules: verticalConfig.defaultRules || prev.inviolableRules,
    }));

    setSuggestions(verticalConfig.proactiveSuggestions || []);
  };

  // 1-Click Master Briefing AI Ingestion Simulation
  const handleAnalyzeMasterBriefing = () => {
    setIsAnalyzingBriefing(true);
    setBriefingAnalysisStage('Analizando estructura semántica con DeepSeek R1...');

    setTimeout(() => {
      setBriefingAnalysisStage('Identificando Giro Comercial, Identidad y Arquetipo (Pilar 2)...');
    }, 900);

    setTimeout(() => {
      setBriefingAnalysisStage('Extrayendo Oferta Comercial, Hook del Mes y CTAs...');
    }, 1800);

    setTimeout(() => {
      setBriefingAnalysisStage('Compilando Protocolos de Crisis y Reglas Inviolables (Pilar 3)...');
    }, 2700);

    setTimeout(() => {
      setIsAnalyzingBriefing(false);
      setBriefingAnalyzed(true);
      setBriefingAnalysisStage('¡Auto-Ingestión completada con éxito!');
      
      const vert = BUSINESS_VERTICALS_CONFIG[wizardData.vertical] || BUSINESS_VERTICALS_CONFIG.gym_fitness;

      // Auto populate extracted values
      setWizardData((prev) => ({
        ...prev,
        businessName: prev.businessName || `Centro de Excelencia (${vert.name.split(',')[0]})`,
        brandTone: 'Profesional, Empático y Orientado a Resultados',
        archetype: 'El Asesor Experto & Aliado de Confianza',
        offerHook: 'Auditoría / Diagnóstico Inicial Sin Costo + 20% de Beneficio de Bienvenida',
        offerCta: 'Envía "QUIERO INFO" por DM o comenta este post para apartar cupo',
        offerValidity: 'Válido para los primeros 30 registros del mes',
        commercialProposalDoc: 'Master_Briefing_Integral_Extraido.pdf',
        brandbookDoc: 'Manual_Identidad_AutoGenerado.md',
        faqsDoc: 'FAQs_Políticas_AutoExtraidas.md',
        enableCommercialProposal: true,
        enableCrisisPillar: true,
      }));

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          colors: ['#E7F900', '#8A95B6', '#FFFFFF'],
        });
      } catch (e) {}

      triggerModal(
        '¡Master Briefing Ingerido y Auto-Clasificado!',
        `El archivo maestro fue analizado con DeepSeek R1 para el giro "${vert.name}". La IA separó el documento en los 4 pilares: Identidad (Pilar 2), Oferta Comercial, FAQs y Reglas Inviolables sin requerir carga manual.`,
        () => {},
        'Revisar Pilares'
      );
    }, 3600);
  };

  // Add new Inviolable Rule
  const handleAddRule = (e) => {
    e.preventDefault();
    if (!wizardData.newRuleInput.trim()) return;
    setWizardData((prev) => ({
      ...prev,
      inviolableRules: [...prev.inviolableRules, prev.newRuleInput.trim()],
      newRuleInput: '',
    }));
  };

  // Remove Inviolable Rule
  const handleRemoveRule = (index) => {
    setWizardData((prev) => ({
      ...prev,
      inviolableRules: prev.inviolableRules.filter((_, i) => i !== index),
    }));
  };

  // Apply Proactive Suggestion with 1 Click
  const handleApplySuggestion = (sugId) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === sugId ? { ...s, applied: true } : s))
    );

    triggerModal(
      'Sugerencia Aplicada con Éxito',
      'Se ha incorporado la directriz a la memoria del bot. El Health Score de tu base de conocimiento aumentó.',
      () => {
        try {
          confetti({ particleCount: 30, spread: 50, colors: ['#E7F900', '#8A95B6', '#FFFFFF'] });
        } catch (e) {}
      },
      'Excelente'
    );
  };

  // Handle Deploy New Swarm
  const handleDeploySwarm = () => {
    const activePillarsCount = 1 + (wizardData.enablePricingPillar ? 1 : 0) + (wizardData.enableCrisisPillar ? 1 : 0) + (wizardData.enableHistoryPillar ? 1 : 0);
    const vert = BUSINESS_VERTICALS_CONFIG[wizardData.vertical] || BUSINESS_VERTICALS_CONFIG.gym_fitness;
    
    triggerModal(
      '¡Nuevo Negocio Desplegado con Éxito!',
      `El tenant "${wizardData.businessName || 'Nuevo Negocio'}" ha sido configurado en el giro ${vert.name}. Se indexaron ${activePillarsCount} pilares con aislamiento PostgreSQL RLS y Score de Salud ${healthScore}/100.`,
      () => {
        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#E7F900', '#8A95B6', '#FFFFFF'],
          });
        } catch (e) {}
        setAdminViewMode('list');
        setCurrentStep(1);
      },
      'Finalizar y Ver Centro de Mando'
    );
  };

  const currentVerticalObj = BUSINESS_VERTICALS_CONFIG[wizardData.vertical] || BUSINESS_VERTICALS_CONFIG.gym_fitness;

  return (
    <div className="p-6 lg:p-8 block animate-fade-in space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5" />
            Taxonomía Universal de Giros RAG & Auto-Ingestión
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-main)]">
            Base de Conocimiento <span className="text-neon">& Clasificación por Giro de Negocio</span>
          </h2>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Gimnasios, Escuelas, Redes de Networking, Clínicas, E-Commerce o Consultoría: La IA adapta los 4 pilares y sus reglas inviolables.
          </p>
        </div>

        {/* View Controls for Admin */}
        {isAdmin && (
          <div className="flex items-center gap-3">
            {adminViewMode === 'list' ? (
              <button
                type="button"
                onClick={() => {
                  setAdminViewMode('wizard');
                  setCurrentStep(1);
                }}
                className="bg-neon text-black font-mono font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-[0_0_15px_var(--neon-glow)] flex items-center gap-2 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Dar de Alta Nuevo Negocio</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAdminViewMode('list')}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-zinc-300 font-mono font-bold px-4 py-2.5 rounded-xl hover:text-white transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a Lista de Tenants</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* VISTA 1: ADMINISTRADOR — LISTA DE TENANTS & BANDEJA DE APROBACIÓN         */}
      {/* ========================================================================= */}
      {isAdmin && adminViewMode === 'list' && (
        <div className="space-y-8 animate-fade-in">
          {/* LISTA DE NEGOCIOS / TENANTS ACTIVOS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase text-white tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-neon" />
                <span>Negocios Activos & Estado de Pilares</span>
              </h3>
              <span className="text-xs font-mono text-zinc-400">
                5 Tenants Aislados con PostgreSQL RLS
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {Object.values(tenantsData || {}).map((tenant) => (
                <div
                  key={tenant.id}
                  className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-white/20 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl p-2 rounded-xl bg-zinc-900 border border-white/10">
                        {tenant.avatar || '🏢'}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
                          <span>{tenant.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/10 text-neon border border-neon/30 uppercase">
                            {tenant.giro || tenant.vertical || 'Vertical Activa'}
                          </span>
                        </h4>
                        <p className="text-xs text-zinc-400 font-mono">
                          ID: <span className="text-zinc-300">{tenant.id}</span> • CAPI Status:{' '}
                          <span className="text-emerald-400 font-bold">{tenant.capiStatus || 'Sincronizado'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-zinc-400">RAG Health:</span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {tenant.ifv || '94%'} Antifrágil
                      </span>
                    </div>
                  </div>

                  {/* 4 Pillars Status Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                      <span className="text-neon font-bold text-[10px] flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> PILAR 1: RENTABILIDAD
                      </span>
                      <p className="text-white font-bold truncate">Matriz_Precios.json</p>
                      <span className="text-[10px] text-zinc-500 block">CAC Máx: {tenant.cacMax || '$180 MXN'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-cyan-500/30 space-y-1 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                      <span className="text-cyan-400 font-bold text-[10px] flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> PILAR 2: BRANDBOOK
                      </span>
                      <p className="text-white font-bold truncate">Brandbook_TonoVoz.md</p>
                      <span className="text-[10px] text-zinc-400 block">Identidad Activa</span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                      <span className="text-amber-400 font-bold text-[10px] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> PILAR 3: CRISIS & FAQS
                      </span>
                      <p className="text-white font-bold truncate">Crisis_Objeciones.md</p>
                      <span className="text-[10px] text-zinc-500 block">Filtro HITL Sub-segundo</span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                      <span className="text-purple-400 font-bold text-[10px] flex items-center gap-1">
                        <History className="w-3 h-3" /> PILAR 4: HISTÓRICO
                      </span>
                      <p className="text-white font-bold truncate">Casos_Exito_2025.txt</p>
                      <span className="text-[10px] text-zinc-500 block">Memoria retroactiva</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: ADMINISTRADOR — WIZARD DE ALTA CON TAXONOMÍA COMPLETA DE GIROS   */}
      {/* ========================================================================= */}
      {isAdmin && adminViewMode === 'wizard' && (
        <div className="vector-bg-card vector-border rounded-2xl p-6 sm:p-8 max-w-5xl mx-auto shadow-2xl space-y-8 animate-fade-in">
          {/* Ingestion Mode Switcher */}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-neon font-bold uppercase tracking-wider block">
                Método de Ingestión RAG
              </span>
              <h4 className="text-sm font-bold text-white font-mono">
                {ingestionMode === 'briefing' ? '⚡ Modo 1-Click Briefing Maestro' : '📋 Formulario Guiado en 5 Etapas'}
              </h4>
              <p className="text-[11px] text-zinc-400">
                {ingestionMode === 'briefing'
                  ? 'Sube el documento del cliente y la IA clasificará automáticamente los 4 pilares según el giro.'
                  : 'Ingresa cada pilar manualmente para un control granular.'}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-black p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setIngestionMode('briefing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  ingestionMode === 'briefing'
                    ? 'bg-neon text-black shadow-neon-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click Briefing</span>
              </button>
              <button
                type="button"
                onClick={() => setIngestionMode('guided')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  ingestionMode === 'guided'
                    ? 'bg-neon text-black shadow-neon-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>5 Etapas Guiadas</span>
              </button>
            </div>
          </div>

          {/* RAG Health Score & Proactive Suggestions Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-neon/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon font-black font-mono text-lg shadow-[0_0_15px_var(--neon-glow)]">
                  {healthScore}%
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <span>Score de Calidad RAG</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Óptimo para {currentVerticalObj.name}
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Calculado en base a los pilares y reglas requeridas para este modelo de negocio.
                  </p>
                </div>
              </div>
            </div>

            {/* Suggestions list */}
            {suggestions.length > 0 && (
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-neon" />
                  Sugerencias Proactivas de la IA para {currentVerticalObj.name}:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestions.map((sug) => (
                    <div
                      key={sug.id}
                      className="p-3 rounded-xl bg-zinc-900/90 border border-white/5 flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="font-bold text-white">{sug.title}</span>
                          <span className="text-[9px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10">
                            {sug.targetPilar}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-tight">{sug.description}</p>
                      </div>

                      <div className="flex justify-end pt-1">
                        {sug.applied ? (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Aplicado
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApplySuggestion(sug.id)}
                            className="text-[10px] font-mono font-bold bg-neon text-black px-2.5 py-1 rounded hover:bg-[var(--neon-hover)] transition-all flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{sug.actionLabel}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* TAXONOMÍA UNIVERSAL: CATEGORÍAS & BUSCADOR DE GIRO              */}
          {/* ================================================================= */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider">
                  1. Selecciona el Giro Comercial del Negocio ({filteredVerticals.length} disponibles)
                </label>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Filtra por categoría o busca tu negocio específico (gym, escuela, networking, spa, etc.):
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar giro (ej. gym, escuela)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs rounded-xl pl-9 pr-3 py-2 text-white placeholder-zinc-500 focus:border-neon outline-none font-mono"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 font-mono text-xs">
              {BUSINESS_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 font-bold ${
                      isSelected
                        ? 'bg-white/10 text-neon border border-neon/40 shadow-[0_0_10px_var(--neon-glow)]'
                        : 'bg-zinc-900/60 text-zinc-400 border border-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Verticals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredVerticals.map((vert) => {
                const isSelected = wizardData.vertical === vert.id;
                return (
                  <div
                    key={vert.id}
                    onClick={() => handleSelectVertical(vert.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-zinc-900 border-2 border-neon shadow-[0_0_15px_var(--neon-glow)]'
                        : 'bg-zinc-950/60 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{vert.avatar}</span>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 border border-white/5">
                          {vert.badge}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white font-mono">{vert.name}</h4>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">{vert.description}</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 text-[9px] font-mono text-zinc-500">
                      <span className="text-neon font-bold">Meta de Conversión: </span>
                      <span className="text-zinc-300 font-sans">{vert.conversionGoal}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Vertical Detail & 4 Pillars Mapping */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-neon/30 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2">
                  <span>{currentVerticalObj.avatar}</span>
                  <span>Configuración Adaptada de los 4 Pilares para: <strong>{currentVerticalObj.name}</strong></span>
                </span>
                <span className="text-[10px] text-neon font-bold uppercase">{currentVerticalObj.badge}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                {Object.entries(currentVerticalObj.pillars).map(([k, p]) => (
                  <div key={k} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2">
                    {p.status === 'mandatory' || p.status === 'mandatory_critical' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    )}
                    <span className="text-zinc-300 leading-tight">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* MODO A: 1-CLICK MASTER BRIEFING UPLOAD                           */}
          {/* ================================================================= */}
          {ingestionMode === 'briefing' && (
            <div className="space-y-6 animate-fade-in pt-4 border-t border-zinc-800">
              {/* Master Briefing Upload & Dropzone */}
              <div className="space-y-3">
                <label className="block text-xs font-mono font-bold text-zinc-300">
                  2. Carga el Documento Maestro / Briefing Integral (.pdf, .docx, .md) o Pega el Texto
                </label>
                
                <div className="border-2 border-dashed border-zinc-700 hover:border-neon rounded-2xl p-6 text-center space-y-3 bg-zinc-950/50 transition-all">
                  <div className="w-12 h-12 mx-auto rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center text-neon">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white font-mono">
                      Arrastra tu Master Briefing, Catálogo, Reglamento o Brandbook aquí
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                      Soporta PDF, Word (.docx), Markdown (.md) y archivos de texto plano
                    </p>
                  </div>
                  <input
                    type="file"
                    className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neon file:text-black hover:file:bg-[var(--neon-hover)] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 block">
                    O pega el texto del brief / instrucciones aquí:
                  </label>
                  <textarea
                    rows={4}
                    placeholder={`Pega la información de ${currentVerticalObj.name}, precios, reglas inviolables, tono de voz o propuesta comercial...`}
                    value={masterDocText}
                    onChange={(e) => setMasterDocText(e.target.value)}
                    className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-white focus:border-neon outline-none font-mono"
                  />
                </div>
              </div>

              {/* Ingestion Trigger Button & Status */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-mono text-zinc-400 block">
                    Extracción Semántica con DeepSeek R1 Reasoning
                  </span>
                  {isAnalyzingBriefing && (
                    <p className="text-xs text-neon font-mono font-bold flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-neon" />
                      <span>{briefingAnalysisStage}</span>
                    </p>
                  )}
                  {!isAnalyzingBriefing && briefingAnalyzed && (
                    <p className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Los 4 pilares fueron auto-configurados con éxito para {currentVerticalObj.name}</span>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isAnalyzingBriefing}
                  onClick={handleAnalyzeMasterBriefing}
                  className="bg-neon text-black font-mono font-black text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAnalyzingBriefing ? 'Analizando...' : 'Auto-Clasificar en 4 Pilares con IA'}</span>
                </button>
              </div>

              {/* Reglas Inviolables del Negocio */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase">
                    <Shield className="w-4 h-4 text-neon" />
                    <span>Reglas Inviolables de {currentVerticalObj.name} (Guardrails)</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Límites estrictos que el bot jamás romperá
                  </span>
                </div>

                <div className="space-y-2">
                  {wizardData.inviolableRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between text-xs font-mono text-zinc-300"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon" />
                        <span>{rule}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="text-zinc-500 hover:text-red-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddRule} className="flex gap-2">
                  <input
                    type="text"
                    value={wizardData.newRuleInput}
                    onChange={(e) => setWizardData({ ...wizardData, newRuleInput: e.target.value })}
                    placeholder="Agregar nueva regla inviolable..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 text-xs rounded-xl px-3 py-2 text-white focus:border-neon outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-zinc-800 text-white hover:bg-zinc-700 px-4 py-2 rounded-xl text-xs font-mono font-bold"
                  >
                    + Agregar
                  </button>
                </form>
              </div>

              {/* Deploy Button */}
              <div className="flex justify-end pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleDeploySwarm}
                  className="bg-neon text-black font-mono font-black text-xs uppercase px-8 py-3.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Desplegar Negocio con Aislamiento RLS</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MODO B: FORMULARIO GUIADO EN 5 ETAPAS                            */}
          {/* ================================================================= */}
          {ingestionMode === 'guided' && (
            <div className="space-y-6 pt-4 border-t border-zinc-800">
              {/* Step Breadcrumbs */}
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 font-mono text-xs overflow-x-auto gap-2">
                {[
                  { num: 1, title: '1. Entidad del Negocio' },
                  { num: 2, title: '2. Pilares RAG' },
                  { num: 3, title: '3. Reglas Inviolables' },
                  { num: 4, title: '4. Conexión APIs' },
                  { num: 5, title: '5. Despliegue RLS' },
                ].map((st) => (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => setCurrentStep(st.num)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-bold ${
                      currentStep === st.num
                        ? 'bg-neon text-black shadow-neon-sm'
                        : currentStep > st.num
                        ? 'text-emerald-400 hover:text-white'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {st.title}
                  </button>
                ))}
              </div>

              {/* PASO 1: Entidad */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-neon" />
                      <span>Paso 1: Entidad del Negocio</span>
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-1">
                      Giro seleccionado: <strong className="text-neon">{currentVerticalObj.name}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
                        Nombre Comercial del Negocio *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ej. Iron Gym & CrossFit / Academia de Idiomas Nova"
                        value={wizardData.businessName}
                        onChange={(e) => setWizardData({ ...wizardData, businessName: e.target.value })}
                        className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-white focus:border-neon outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
                        Contacto Principal / Administrador
                      </label>
                      <input
                        type="text"
                        placeholder="ej. Coach Carlos Mendoza"
                        value={wizardData.primaryContact}
                        onChange={(e) => setWizardData({ ...wizardData, primaryContact: e.target.value })}
                        className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-white focus:border-neon outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                    >
                      <span>Siguiente: Configurar Pilares RAG</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 2: Pilares */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                        <Database className="w-5 h-5 text-neon" />
                        <span>Paso 2: Configuración de los 4 Pilares RAG</span>
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        <strong className="text-cyan-400">Pilar 2 (Brandbook) es obligatorio</strong>. Los demás son opcionales y adaptados a {currentVerticalObj.name}.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Pilar 2 */}
                    <div className="p-5 rounded-2xl bg-zinc-900/90 border-2 border-cyan-400/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          PILAR 2: Brandbook & Tono de Voz
                        </span>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500 text-black font-black uppercase">
                          ★ OBLIGATORIO
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300">
                        Personalidad, tono y arquetipo para {currentVerticalObj.name}.
                      </p>
                      <div>
                        <label className="text-[10px] text-zinc-400 block font-mono">Tono de Voz</label>
                        <input
                          type="text"
                          value={wizardData.brandTone}
                          onChange={(e) => setWizardData({ ...wizardData, brandTone: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                        />
                      </div>
                    </div>

                    {/* Propuesta Comercial */}
                    <div className="p-5 rounded-2xl bg-zinc-900/90 border-2 border-neon/70 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-neon flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          PROPUESTA COMERCIAL & OFERTA
                        </span>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-neon text-black font-black uppercase">
                          RECOMENDADO
                        </span>
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-400 font-mono block">Gancho del Mes / Lead Magnet</label>
                        <input
                          type="text"
                          value={wizardData.offerHook}
                          onChange={(e) => setWizardData({ ...wizardData, offerHook: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-[11px] text-white font-mono focus:border-neon outline-none"
                        />
                      </div>
                    </div>

                    {/* Pilar 1 */}
                    <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-2">
                      <span className="text-xs font-mono font-bold text-neon flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" /> PILAR 1: Precios & Membresías
                      </span>
                      <p className="text-[11px] text-zinc-400">
                        {currentVerticalObj.pillars.pilar1.label}
                      </p>
                    </div>

                    {/* Pilar 3 */}
                    <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-2">
                      <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> PILAR 3: Políticas & FAQs
                      </span>
                      <p className="text-[11px] text-zinc-400">
                        {currentVerticalObj.pillars.pilar3.label}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="bg-zinc-900 border border-zinc-700 text-xs px-4 py-2.5 rounded-xl text-white font-mono flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                    >
                      <span>Siguiente: Reglas Inviolables</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 3: Reglas */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                      <Shield className="w-5 h-5 text-neon" />
                      <span>Paso 3: Reglas Inviolables de {currentVerticalObj.name}</span>
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {wizardData.inviolableRules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-between text-xs font-mono text-zinc-300"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-neon" />
                          <span>{rule}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(idx)}
                          className="text-zinc-500 hover:text-red-400 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-zinc-900 border border-zinc-700 text-xs px-4 py-2.5 rounded-xl text-white font-mono flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                    >
                      <span>Siguiente: Conexión APIs</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 4: APIs */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                      <Key className="w-5 h-5 text-neon" />
                      <span>Paso 4: Canales Meta & WhatsApp</span>
                    </h3>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div>
                      <label className="block text-zinc-300 font-bold mb-1">
                        WhatsApp Cloud API Phone Number ID
                      </label>
                      <input
                        type="text"
                        placeholder="ej. 109283746592019"
                        value={wizardData.whatsappPhoneId}
                        onChange={(e) => setWizardData({ ...wizardData, whatsappPhoneId: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-neon outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-zinc-900 border border-zinc-700 text-xs px-4 py-2.5 rounded-xl text-white font-mono flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                    >
                      <span>Siguiente: Resumen</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 5: Despliegue */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-neon" />
                      <span>Paso 5: Resumen & Despliegue RLS</span>
                    </h3>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-950 border border-neon/30 space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div className="flex items-center gap-3">
                        <VectorLobo size={32} showStatus={true} status="active" />
                        <div>
                          <span className="text-white font-bold block">Auditoría Previa Lobo Vectorial</span>
                          <span className="text-[10px] text-zinc-400">Parámetros de memoria RAG y blindaje RLS</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-neon/15 text-neon font-bold border border-neon/30 text-[10px]">
                        IFV Esperado: 48/50
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-zinc-500 block">Negocio:</span>
                        <span className="text-white font-bold">{wizardData.businessName || 'Nuevo Negocio'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Giro:</span>
                        <span className="text-neon font-bold">{currentVerticalObj.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="bg-zinc-900 border border-zinc-700 text-xs px-4 py-2.5 rounded-xl text-white font-mono flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDeploySwarm}
                      className="bg-neon text-black font-mono font-black text-xs uppercase px-8 py-3.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Desplegar Enjambre & Activar RLS</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: CLIENTE FINAL — VISTA AMIGABLE & SOLICITUD DE CAMBIO            */}
      {/* ========================================================================= */}
      {isClient && (
        <div className="space-y-8 animate-fade-in">
          {/* Header Card for Client */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-neon tracking-wider">
                Panel del Negocio / Cliente
              </span>
              <h3 className="text-2xl font-black text-white font-mono flex items-center gap-2">
                <span>{activeTenant?.name || 'Tu Negocio'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Bot Activo 24/7
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Consulta el estado de tu bot. Si requieres cambiar tono, ideas o precios, solicita una actualización con 1 clic.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowChangeModal(true)}
              className="bg-neon text-black font-mono font-bold text-xs px-5 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-neon flex items-center gap-2 active:scale-95 shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Solicitar Actualización de Documento</span>
            </button>
          </div>

          {/* RAG Health Score & IFV Widget for Client (Bloque 6 & 13.9 Manual Maestro) */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-neon/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <VectorLobo size={44} showStatus={true} status="active" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white font-mono">
                    Base de Conocimiento Calibrada
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon font-bold border border-neon/30">
                    IFV: 48/50
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Lobo Vectorial supervisa identidad (Pilar 2), precios y filtros sin alucinaciones.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-mono text-neon font-black block">Calibración 94%</span>
                <span className="text-[10px] text-emerald-400 font-mono">0 Alertas Críticas</span>
              </div>
            </div>
          </div>

          {/* 4 Pillars Client Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/70 border-2 border-cyan-500/40 space-y-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Pilar 2: Identidad & Tono de Marca</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30">
                  Obligatorio • Activo
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Estilo de redacción, lenguaje natural y personalidad con la que tu bot interactúa con tu audiencia.
              </p>
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 text-xs font-mono flex items-center justify-between text-zinc-400">
                <span>Archivo activo: Brandbook_Identidad.md</span>
                <span className="text-emerald-400 font-bold">100% Sincronizado</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neon font-bold font-mono text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span>Pilar 1: Precios & Catálogo de Ventas</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  Opcional
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cotizaciones y paquetes configurables según el giro de negocio.
              </p>
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 text-xs font-mono flex items-center justify-between text-zinc-400">
                <span>Estado: Matriz_Precios.json</span>
                <span className="text-zinc-500 font-bold">Configurable</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Pilar 3: Preguntas Frecuentes & Seguridad</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                  Activo
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Respuestas automáticas a dudas frecuentes y filtros para evitar respuestas indebidas.
              </p>
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 text-xs font-mono flex items-center justify-between text-zinc-400">
                <span>Archivo activo: FAQs_Objeciones.md</span>
                <span className="text-emerald-400 font-bold">Plantilla Activa</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-bold font-mono text-sm">
                  <History className="w-4 h-4" />
                  <span>Pilar 4: Histórico & Casos de Éxito</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  Opcional
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Contexto de publicaciones pasadas y aprendizajes de campañas previas.
              </p>
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 text-xs font-mono flex items-center justify-between text-zinc-400">
                <span>Estado: En Aprendizaje Continuo</span>
                <span className="text-emerald-400 font-bold">Sincronizado</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SOLICITUD DE CAMBIO DE DOCUMENTO (CLIENTE)                         */}
      {/* ========================================================================= */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-neon/40 shadow-2xl p-6 sm:p-8 relative space-y-5">
            <button
              type="button"
              onClick={() => setShowChangeModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon text-[10px] font-mono font-bold uppercase">
                <Upload className="w-3.5 h-3.5" />
                Workflow de Validación
              </div>
              <h3 className="text-xl font-black text-white">
                Solicitar Actualización de Documento
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                La agencia validará los cambios de tono, ideas o políticas antes de re-indexar el bot.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowChangeModal(false);
                triggerModal(
                  'Solicitud Enviada',
                  'Tu solicitud fue remitida a la mesa de control de la agencia.'
                );
              }}
              className="space-y-4 pt-2 font-mono text-xs"
            >
              <div>
                <label className="block font-bold text-zinc-300 mb-1">
                  Selecciona el Pilar que deseas actualizar
                </label>
                <select
                  value={selectedPillarForChange}
                  onChange={(e) => setSelectedPillarForChange(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-neon outline-none cursor-pointer"
                >
                  <option value="pillar2">Pilar 2: Identidad & Tono de Voz (Brandbook) — [Principal]</option>
                  <option value="pillar1">Pilar 1: Precios / Membresías / Catálogo</option>
                  <option value="pillar3">Pilar 3: Protocolos de Crisis & FAQs</option>
                  <option value="pillar4">Pilar 4: Histórico de Datos & Casos de Éxito</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1">
                  Subir Nuevo Archivo (Markdown .md, PDF, Word o TXT)
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => setChangeFileName(e.target.files[0]?.name || 'Nuevo_Documento.md')}
                  className="text-xs text-zinc-400 w-full file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neon file:text-black hover:file:bg-[var(--neon-hover)] cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1">
                  Explicación breve de los cambios realizados *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="ej. Actualizamos los precios de membresías del gimnasio y agregamos 3 nuevas preguntas frecuentes sobre clases de CrossFit."
                  value={changeNotes}
                  onChange={(e) => setChangeNotes(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-neon outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangeModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-neon text-black font-bold px-6 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all shadow-neon flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Solicitud</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
