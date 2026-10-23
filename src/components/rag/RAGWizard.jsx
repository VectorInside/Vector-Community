'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BriefingBridge } from '@/services/briefingBridge';
import { resolveBrandPreset } from '@/utils/brandPresets';
import { useAuth } from '@/context/AuthContext';
import {
  Database,
  FileText,
  Upload,
  Shield,
  ShieldCheck,
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
  Calendar,
  Clock,
  Sun,
  Sunset,
  Target,
  Activity,
  Layers,
  Cpu,
  RefreshCw,
  PlusCircle,
  Plus,
  Trash2,
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
  LayoutGrid,
  LayoutList,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  List,
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
  Copy,
  Code,
  Globe,
  Smartphone,
  Power,
  ExternalLink,
  MessageSquare,
  Linkedin,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VectorLobo } from '@/components/common/VectorLobo';
import { Portal } from '@/components/common/Portal';
import { SAMPLE_ONBOARDING_PAYLOAD } from '@/utils/constants';

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
    canonicalId: 'V01',
    category: 'fitness_health',
    name: 'Gimnasios, CrossFit & Fitness Studios',
    badge: 'Membresías & Pase de Prueba',
    avatar: '🏋️‍♂️',
    conversionGoal: 'Agendar Clase Muestra / Visita a Instalaciones / Contratación de Membresía.',
    description: 'Enfocado en resolver dudas de horarios, clases, planes de membresía e invitar a prueba de cortesía.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Tarifas de Membresías, Costos de Inscripción y Promociones Vigentes' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Identidad Enérgica, Motivadora & Disciplinada (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Políticas de Congelación, Reglamento de Instalaciones y Cancelaciones' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Testimonios de Transformación Física & Logros de la Comunidad' },
    },
    defaultRules: [
      'Priorizar resolver dudas sobre instalaciones, horarios y clases antes de solicitar pago directo.',
      'Aclarar vigencias, políticas de acceso y términos de membresía según la información oficial de tus documentos.',
      'Derivar consultas médicas o de salud física a la valoración presencial con el personal calificado.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-gym-1',
        title: 'Invitación a Sesión o Clase de Prueba',
        description: 'Permite al agente invitar al prospecto a conocer las instalaciones o tomar una sesión de demostración.',
        actionLabel: 'Activar Pase de Demostración',
        targetPilar: 'Propuesta Comercial',
        applied: true,
      },
      {
        id: 'sug-gym-2',
        title: 'Política de Congelación o Pausa de Membresía',
        description: 'Evita reclamos definiendo los términos para pausar una membresía por viaje o motivo de salud.',
        actionLabel: 'Aplicar Política de Pausa',
        targetPilar: 'Pilar 3 (FAQs)',
        applied: false,
      },
    ],
  },
  service_appointments: {
    id: 'service_appointments',
    canonicalId: 'V02',
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
      'NUNCA dar un diagnóstico médico definitivo por chat; siempre invitar a valoración presencial con el especialista.',
      'Si el paciente reporta dolor agudo, hemorragia o emergencia, dar el teléfono de guardia y dirección de inmediato.',
      'Gestionar cancelaciones o re-agendamientos con anticipación según los horarios de consulta oficiales.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-med-1',
        title: 'Protocolo Anti-Diagnóstico por Chat (Pilar 3)',
        description: 'Protección legal: recuerda al paciente que los diagnósticos y tratamientos requieren valoración clínica presencial.',
        actionLabel: 'Activar Protocolo Médico',
        targetPilar: 'Pilar 3 (Crisis)',
        applied: true,
      },
      {
        id: 'sug-med-2',
        title: 'Política de Cancelación y Re-agendamiento (Pilar 3)',
        description: 'Define el tiempo de aviso requerido para proteger los horarios de los doctores y especialistas.',
        actionLabel: 'Insertar Regla de Agenda',
        targetPilar: 'Pilar 3 (FAQs)',
        applied: false,
      },
    ],
  },
  spa_beauty: {
    id: 'spa_beauty',
    canonicalId: 'V03',
    category: 'fitness_health',
    name: 'Spas, Clínicas Estéticas & Barberías',
    badge: 'Citas & Cuidado Personal',
    avatar: '💆🏻‍♀️',
    conversionGoal: 'Agendar cita de servicio, consultar catálogo y paquetes de sesiones.',
    description: 'Enfocado en catálogo de servicios estéticos, masajes, faciales, microblading o cortes, con agenda por especialista.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Menú de Servicios, Paquetes de Sesiones y Anticipos de Cita' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Relajante, Sofisticado & Amable (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Política de Anticipo, Tolerancia de Horario y Cancelaciones' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Galería de Antes y Después de Tratamientos' },
    },
    defaultRules: [
      'Consultar preferencias del cliente y disponibilidad de agenda antes de confirmar citas de servicio.',
      'Informar anticipos requeridos, tiempos de tolerancia y políticas de puntualidad según tus documentos.',
      'Advertir precauciones o contraindicaciones básicas de tratamientos de acuerdo a la ficha técnica del negocio.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-spa-1',
        title: 'Política de Anticipo para Horarios de Alta Demanda',
        description: 'Reduce el No-Show solicitando anticipo de confirmación según las políticas del establecimiento.',
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
    canonicalId: 'V04',
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
      'Proporcionar información de planes de estudio, colegiaturas y requisitos de admisión vigentes en el ciclo escolar.',
      'Invitar a visitas guiadas, sesiones informativas de admisiones o envío de folleto digital oficial.',
      'Informar procesos de becas, fechas de examen y requisitos conforme a los reglamentos institucionales.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-edu-1',
        title: 'Folleto de Admisiones Digital Institucional',
        description: 'Permite que el bot entregue el documento oficial con el mapa curricular inmediatamente en el chat.',
        actionLabel: 'Adjuntar Folleto Escolar',
        targetPilar: 'Propuesta Comercial',
        applied: true,
      },
      {
        id: 'sug-edu-2',
        title: 'Requisitos de Admisión y Becas (Pilar 3)',
        description: 'Clarifica fechas de registro y criterios de postulación según el reglamento del colegio.',
        actionLabel: 'Configurar Regla de Admisión',
        targetPilar: 'Pilar 3',
        applied: false,
      },
    ],
  },
  academies_courses: {
    id: 'academies_courses',
    canonicalId: 'V05',
    category: 'education',
    name: 'Academias de Idiomas, Música, Danza & Talleres',
    badge: 'Clase Muestra & Inscripciones',
    avatar: '📚',
    conversionGoal: 'Agendar Clase o Sesión Muestra / Orientación de Programa / Inscripción a Curso.',
    description: 'Enfocado en academias locales o híbridas con horarios grupales e individuales, evaluación inicial y paquetes mensuales.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Precios por Nivel o Módulo, Mensualidades y Material de Estudio' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Pedagógico, Motivante, Empático & Amigable (Obligatorio)' },
      pilar3: { status: 'recommended', label: 'Pilar 3: Políticas de Asistencia, Fechas de Inicio y Acreditaciones' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Logros de Alumnos, Muestras Prácticas & Casos de Éxito' },
    },
    defaultRules: [
      'Proporcionar costos, horarios y temarios oficiales únicamente según los documentos cargados en el Paso 2.',
      'Explicar modalidades (presencial o en línea), requisitos previos y políticas de asistencia del programa.',
      'Invitar al aspirante a una clase muestra, sesión informativa o pre-inscripción al grupo correspondiente.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-acad-1',
        title: 'Orientación de Programa o Nivel Inicial',
        description: 'El bot ayuda a identificar los objetivos o nivel previo del alumno para orientarlo al programa ideal.',
        actionLabel: 'Activar Orientación de Programa',
        targetPilar: 'Pilar 1',
        applied: true,
      },
    ],
  },
  infoproducts_bootcamps: {
    id: 'infoproducts_bootcamps',
    canonicalId: 'V06',
    category: 'education',
    name: 'Cursos Online, Bootcamps Tech & Infoproductos',
    badge: 'Venta Directa & Webhook',
    avatar: '💻',
    conversionGoal: 'Registro a Masterclass / Venta en Plataforma Digital / Postulación a Programa.',
    description: 'Enfocado en escala digital, venta de infoproductos, soporte a alumnos y recuperación de carritos.',
    pillars: {
      pilar1: { status: 'mandatory_critical', label: 'Pilar 1: Precio del Programa, Descuentos Vigentes y Facilidades de Pago' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Disruptivo, Aspiracional & Tecnológico (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Políticas de Garantía, Acceso a la Plataforma y Requisitos' },
      pilar4: { status: 'mandatory_critical', label: 'Pilar 4: Resultados de Egresados, Testimonios y Proyección Práctica' },
    },
    defaultRules: [
      'Resolver dudas sobre temario del programa, duración, modalidades de pago y soporte a estudiantes.',
      'Comunicar políticas de garantía, acceso a la plataforma y requisitos técnicos de acuerdo a tus documentos.',
      'Derivar incidencias de acceso o pagos fallidos al canal de soporte técnico correspondiente.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-boot-1',
        title: 'Garantía y Condiciones de Acceso (Pilar 3)',
        description: 'Genera certeza comunicando los términos de satisfacción y soporte incluidos en el programa.',
        actionLabel: 'Activar Términos de Garantía',
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
    canonicalId: 'V07',
    category: 'networking',
    name: 'Redes de Networking, Cámaras & Masterminds',
    badge: 'Sesión Invitado & Filtro B2B',
    avatar: '🤝',
    conversionGoal: 'Invitar a Sesión Introductoria / Calificar Perfil Profesional / Membresía de Comunidad.',
    description: 'Enfocado en comunidades de empresarios y profesionales con sesiones de vinculación y cuotas de membresía.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Cuota de Membresía, Eventos de Vinculación y Opciones de Pago' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Ejecutivo, Colaborativo & de Alto Valor (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Criterios de Aceptación, Compromiso de Asistencia y Código Ético' },
      pilar4: { status: 'mandatory_critical', label: 'Pilar 4: Volumen de Negocios y Casos de Colaboración entre Miembros' },
    },
    defaultRules: [
      'Verificar el giro, especialidad y perfil del prospecto para confirmar compatibilidad con la comunidad.',
      'Explicar los beneficios, dinámicas de colaboración y compromisos de membresía según los estatutos del grupo.',
      'Invitar a una sesión introductoria o de invitados antes del proceso formal de postulación.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-net-1',
        title: 'Criterio de Compatibilidad de Giro o Perfil',
        description: 'El bot verifica si la especialidad del prospecto encaja con los lineamientos del grupo.',
        actionLabel: 'Activar Filtro de Compatibilidad',
        targetPilar: 'Pilar 3',
        applied: true,
      },
      {
        id: 'sug-net-2',
        title: 'Invitación a Sesión Introductoria de Negocios',
        description: 'Genera el mensaje para invitar al prospecto a la próxima sesión presencial o virtual.',
        actionLabel: 'Configurar Invitación VIP',
        targetPilar: 'Propuesta Comercial',
        applied: false,
      },
    ],
  },
  community_subscriptions: {
    id: 'community_subscriptions',
    canonicalId: 'V08',
    category: 'networking',
    name: 'Comunidades de Pago & Clubs Privados',
    badge: 'Membresía Recurrente',
    avatar: '🏛️',
    conversionGoal: 'Suscripción recurrente / Acceso a canales privados / Eventos exclusivos.',
    description: 'Enfocado en suscripciones recurrentes con contenido exclusivo, networking, eventos y llamadas mensuales.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Planes Mensual / Anual, Beneficios Incluidos y Período de Prueba' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono de Tribu, Exclusivo & Cercano (Obligatorio)' },
      pilar3: { status: 'recommended', label: 'Pilar 3: Reglas de Convivencia, Privacidad y Gestión de Suscripción' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Histórico de Masterclasses y Contenido Exclusivo para Miembros' },
    },
    defaultRules: [
      'Aclarar periodicidad de cobro, beneficios incluidos y proceso de gestión desde el portal de usuario.',
      'Reiterar normas de convivencia, respeto mutuo y confidencialidad dentro de los canales comunitarios.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-com-1',
        title: 'Normas de Convivencia y Privacidad Comunitaria',
        description: 'Establece pautas de respeto mutuo y cero spam para proteger la experiencia de los miembros.',
        actionLabel: 'Insertar Normas de Comunidad',
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
    canonicalId: 'V09',
    category: 'retail_ecom',
    name: 'Retail & E-Commerce (Marcas D2C)',
    badge: 'Venta Online & Envíos',
    avatar: '👟',
    conversionGoal: 'Cierre de Venta en Sitio Web / Resolver Dudas de Catálogo / Despacho de Pedidos.',
    description: 'Enfocado en catálogo de productos físicos, stock, costos de paquetería, tiempos de entrega y pasarelas de pago.',
    pillars: {
      pilar1: { status: 'mandatory_critical', label: 'Pilar 1: Catálogo de SKUs, Precios, Variantes, Stock y Promociones' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Identidad Dinámica, Fresca & Visual (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Guías de Envío, Políticas de Devolución o Cambio y Tiempos de Entrega' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Top Bestsellers y Promociones Exitosas' },
    },
    defaultRules: [
      'Informar disponibilidad de inventario, tiempos estimados de paquetería y coberturas oficiales según tus documentos.',
      'Aplicar promociones y cupones válidos únicamente conforme a las condiciones activas en catálogo.',
      'En caso de incidencias de envío o producto, solicitar evidencia y canalizar a atención al cliente.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-ecom-1',
        title: 'Guía de Variantes y Tiempos de Envío (Pilar 3)',
        description: 'La IA aclara medidas o especificaciones de producto para reducir devoluciones y dudas frecuentes.',
        actionLabel: 'Insertar Guía de Variantes',
        targetPilar: 'Pilar 3',
        applied: true,
      },
    ],
  },
  local_retail: {
    id: 'local_retail',
    canonicalId: 'V10',
    category: 'retail_ecom',
    name: 'Ferreterías, Refaccionarias & Comercio Local',
    badge: 'Catálogo, Stock & Mostrador',
    avatar: '🔧',
    conversionGoal: 'Consultar existencia de producto / Cotizar piezas o mayoreo / Horarios de mostrador y envíos.',
    description: 'Enfocado en ferreterías, refaccionarias, tlapalerías, materiales y tiendas físicas con mostrador, catálogo de piezas y entregas.',
    pillars: {
      pilar1: { status: 'mandatory_critical', label: 'Pilar 1: Catálogo de Productos, Precios por Pieza o Mayoreo y Métodos de Pago' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Técnico, Ágil, Práctico & Resolutivo (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Políticas de Garantía de Piezas, Tiempos de Entrega a Domicilio y Devoluciones' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Marcas Oficiales Distribuidas y Stock en Almacén' },
    },
    defaultRules: [
      'Verificar existencias y compatibilidad de especificaciones técnicas antes de confirmar disponibilidad.',
      'Informar costos de envío local o entrega en obra según las zonas y montos mínimos de tus documentos.',
      'Para cotizaciones de mayoreo o contratistas, solicitar lista de materiales y derivar al asesor de ventas.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-ret-1',
        title: 'Verificación Rápida de Medidas y Compatibilidad',
        description: 'El bot asiste al cliente para confirmar si la medida, marca o código de producto está disponible en almacén.',
        actionLabel: 'Activar Asistente de Piezas',
        targetPilar: 'Pilar 1',
        applied: true,
      },
    ],
  },

  // -------------------------------------------------------------
  // 5. HOSPITALITY, RESTAURANTES & EVENTOS
  // -------------------------------------------------------------
  hospitality: {
    id: 'hospitality',
    canonicalId: 'V11',
    category: 'hospitality',
    name: 'Restaurantes, Bares & Mixología',
    badge: 'Reservas & Experiencia',
    avatar: '🥩',
    conversionGoal: 'Reservación de Mesa / Consulta de Menú & Precios / Eventos Privados.',
    description: 'Enfocado en hospitalidad, apetito visual, reservaciones en horarios pico y gestión de servicio.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Menú Digital, Precios Promedio y Paquetes para Grupos' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Cálido, Gourmet, Experiencial & Amigable (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Alergias Alimentarias, Políticas de Reserva y Tolerancia en Mesa' },
      pilar4: { status: 'optional', label: 'Pilar 4: Fechas de Alta Demanda y Paquetes de Temporada' },
    },
    defaultRules: [
      'Gestionar reservaciones de mesa, horarios de servicio y capacidad según disponibilidad del establecimiento.',
      'Consultar alergias, intolerancias alimentarias o requerimientos especiales al confirmar visitas.',
      'Comunicar políticas de tolerancia, eventos privados o consumo mínimo de acuerdo a tus normas oficiales.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-hosp-1',
        title: 'Protocolo de Alergias e Intolerancias (Pilar 3)',
        description: 'El bot consulta al comensal si requiere preparación especial o exclusión de ingredientes.',
        actionLabel: 'Activar Alerta de Alérgenos',
        targetPilar: 'Pilar 3',
        applied: true,
      },
    ],
  },
  event_venues: {
    id: 'event_venues',
    canonicalId: 'V12',
    category: 'hospitality',
    name: 'Salones de Eventos, Bodas & Banquetes',
    badge: 'Cotización por Persona',
    avatar: '🎉',
    conversionGoal: 'Agendar Visita al Salón / Cotización por Número de Invitados / Apartado de Fecha.',
    description: 'Enfocado en bodas, graduaciones y eventos sociales o corporativos con paquetes por persona y amenidades.',
    pillars: {
      pilar1: { status: 'mandatory_critical', label: 'Pilar 1: Paquetes por Persona, Servicios Incluidos y Opciones Adicionales' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Festivo, Emotivo, Confiable & Elegante (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Esquema de Pagos, Anticipos y Políticas de Cancelación' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Fotografías de Montajes Reales y Recomendaciones de Proveedores' },
    },
    defaultRules: [
      'Validar disponibilidad de fechas en calendario antes de prometer apartado de instalaciones.',
      'Proporcionar cotizaciones estimadas según número de invitados y tipo de paquete seleccionado.',
      'Invitar a recorrido presencial y degustación antes de la firma de contratos definitivos.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-eve-1',
        title: 'Calculadora Estimada de Eventos',
        description: 'Calcula el presupuesto estimado multiplicando invitados por tipo de paquete según tu lista de precios.',
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
    canonicalId: 'V13',
    category: 'b2b_services',
    name: 'Agencias de Marketing, Software SaaS & Consultoría B2B',
    badge: 'Discovery Call & BANT',
    avatar: '💼',
    conversionGoal: 'Calificar requerimientos de proyecto y agendar Discovery Call con consultores.',
    description: 'Enfocado en agencias de marketing y publicidad, software, consultoría corporativa y servicios profesionales B2B.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Rangos de Inversión, Planes de Servicio y Esquemas de Implementación' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Ejecutivo, Consultivo, Estratégico & Riguroso (Obligatorio)' },
      pilar3: { status: 'recommended', label: 'Pilar 3: Acuerdos de Confidencialidad (NDA), SLAs y Términos de Servicio' },
      pilar4: { status: 'mandatory_critical', label: 'Pilar 4: Casos de Estudio Reales con Métricas y Resultados Comprobables' },
    },
    defaultRules: [
      'Calificar necesidades operativas, tamaño de equipo y alcance del proyecto antes de agendar llamada técnica.',
      'Proteger metodologías propietarias y compartir información detallada bajo acuerdos de confidencialidad.',
      'Canalizar prospectos calificados directamente con los consultores o ejecutivos de cuenta correspondientes.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-b2b-1',
        title: 'Filtro de Calificación de Necesidades B2B',
        description: 'Identifica el alcance del proyecto y decisores para orientar la llamada de diagnóstico.',
        actionLabel: 'Activar Scoring B2B',
        targetPilar: 'Pilar 1',
        applied: true,
      },
    ],
  },
  legal_accounting: {
    id: 'legal_accounting',
    canonicalId: 'V14',
    category: 'b2b_services',
    name: 'Despachos Legales, Notarías & Contadores',
    badge: 'Asesoría Inicial & Dictamen',
    avatar: '⚖️',
    conversionGoal: 'Agendar Consulta Inicial de Asesoría / Diagnóstico Fiscal / Revisión de Documentos.',
    description: 'Enfocado en servicios jurídicos, defensa fiscal, constitución de empresas y blindaje corporativo.',
    pillars: {
      pilar1: { status: 'recommended', label: 'Pilar 1: Costo de Consulta Inicial, Pólizas de Asesoría y Aranceles por Trámite' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Formal, Riguroso, Ético & de Máxima Discreción (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Secreto Profesional, Confidencialidad y Términos de Representación' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Casos Resueltos Favorablemente (Sin revelar datos confidenciales)' },
    },
    defaultRules: [
      'Aclarar que los datos compartidos están blindados bajo estricto secreto profesional y confidencialidad.',
      'No garantizar resoluciones o sentencias absolutas; canalizar a consulta de dictamen profesional.',
      'Informar costos de consulta inicial, alcances del servicio y documentación requerida para iniciar trámite.',
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
    canonicalId: 'V15',
    category: 'realestate_auto',
    name: 'Bienes Raíces, Desarrollos & Inmobiliarias',
    badge: 'Visita Showroom & Enganche',
    avatar: '🏙️',
    conversionGoal: 'Agendar Visita al Showroom o Desarrollo / Enviar Ficha Técnica / Orientación Financiera.',
    description: 'Enfocado en desarrollos en preventa, casas, departamentos, terrenos de inversión, plusvalía y financiamiento.',
    pillars: {
      pilar1: { status: 'mandatory_critical', label: 'Pilar 1: Precios Base, Esquemas de Enganche, Mensualidades y Promociones' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Asesor, Patrimonial, Inspirador & Profesional (Obligatorio)' },
      pilar3: { status: 'recommended', label: 'Pilar 3: Requisitos de Crédito Hipotecario y Proceso de Escrituración' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Historial de Entregas, Plusvalía Proyectada y Amenidades' },
    },
    defaultRules: [
      'Brindar información de prototipos, rangos de precio y amenidades según el inventario actualizado.',
      'Agendar visitas a desarrollo o showroom tras calificar interés y esquema de compra preferido.',
      'Aclarar que proyecciones financieras y esquemas de crédito están sujetos a validación de políticas oficiales.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-re-1',
        title: 'Calculadora Estimada de Enganche y Plazos',
        description: 'Permite al bot dar un desglose estimado de mensualidades según las condiciones vigentes.',
        actionLabel: 'Insertar Esquema Financiero',
        targetPilar: 'Pilar 1',
        applied: true,
      },
    ],
  },
  automotive: {
    id: 'automotive',
    canonicalId: 'V16',
    category: 'realestate_auto',
    name: 'Agencias de Autos, Concesionarias & Talleres',
    badge: 'Prueba de Manejo & Servicio',
    avatar: '🚗',
    conversionGoal: 'Agendar Prueba de Manejo (Test Drive) / Cita de Mantenimiento Mecánico / Cotizar Unidad.',
    description: 'Enfocado en venta de autos nuevos y seminuevos, esquemas de arrendamiento, garantías y citas de taller.',
    pillars: {
      pilar1: { status: 'mandatory_critical', label: 'Pilar 1: Precios de Unidades, Opciones de Enganche, Mensualidades y Paquetes de Servicio' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Tono Dinámico, Experto, Confiable & Ágil (Obligatorio)' },
      pilar3: { status: 'mandatory_critical', label: 'Pilar 3: Requisitos de Identificación para Test Drive y Cobertura de Garantía' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Reseñas de Manejo y Satisfacción de Clientes' },
    },
    defaultRules: [
      'Informar especificaciones de modelos, versiones y paquetes de servicio de acuerdo al catálogo oficial.',
      'Requerir identificación oficial y licencia vigente para coordinar pruebas de manejo presenciales.',
      'Aclarar que esquemas de financiamiento y enganches están sujetos a estudio crediticio individual.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-auto-1',
        title: 'Requisito de Licencia para Prueba de Manejo',
        description: 'Recuerda al cliente portar su licencia de conducir vigente antes de confirmar la cita en la agencia.',
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
    canonicalId: 'V17',
    category: 'creators',
    name: 'Creadores en Redes Meta, Streamers & Podcasts',
    badge: 'Marketing & Media Kit',
    avatar: '🎬',
    conversionGoal: 'Interacción con Audiencia / Responder Menciones en Stories / Acuerdos con Marcas.',
    description: 'Enfocado en marcas personales, influencers y creadores de contenido que interactúan con su comunidad.',
    pillars: {
      pilar1: { status: 'optional_off', label: 'Pilar 1: Tarifas y Media Kit para Alianzas Comerciales (Opcional)' },
      pilar2: { status: 'mandatory', label: 'Pilar 2: Identidad & Tono de Voz Único del Creador (Obligatorio Núcleo)' },
      pilar3: { status: 'recommended', label: 'Pilar 3: Moderación de Contenido, Filtro de Respeto y Menciones' },
      pilar4: { status: 'recommended', label: 'Pilar 4: Métricas de Audiencia y Alianzas Exitosas Previas' },
    },
    defaultRules: [
      'Mantener el tono de voz, valores y estilo característico del creador en todas las interacciones.',
      'Canalizar propuestas comerciales o de patrocinio que cumplan con los lineamientos del Media Kit oficial.',
      'Aplicar filtros de respeto y moderación ante comentarios inapropiados o lenguaje ofensivo.',
    ],
    proactiveSuggestions: [
      {
        id: 'sug-cr-1',
        title: 'Respuesta Automática a Menciones en Redes (Pilar 2)',
        description: 'Agradece ágilmente a quienes etiqueten o interactúen con el contenido del creador.',
        actionLabel: 'Activar Interacción con Audiencia',
        targetPilar: 'Pilar 2',
        applied: true,
      },
    ],
  },
};


export const VERTICAL_PILLARS_ADAPTIVE_CONFIG = {
  gym_fitness: {
    pilar1: {
      title: 'PILAR 1: Membresías, Pases & Servicios',
      label: 'Tarifas de Membresías, Costos de Inscripción y Promociones Vigentes',
      placeholder: 'ej. Pase Diario: $150 | Mensualidad Full: $890 MXN | Plan Semestral: $4,800 MXN',
      docLabel: 'Subir Tarifario de Membresías / Catálogo Oficial (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Identidad Enérgica, Motivadora & Disciplinada (Obligatorio)',
      placeholder: 'ej. Enérgico, motivador, disciplinado y cercano (ej. "¡Vamos con todo por tu meta!")',
      docLabel: 'Subir Brandbook / Guía de Identidad (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Políticas de Acceso & FAQs',
      label: 'Políticas de Congelación, Reglamento de Instalaciones y Cancelaciones',
      placeholder: 'ej. Congelación de membresía hasta 30 días por viaje. Candado y toalla obligatorios.',
      docLabel: 'Subir Reglamento de Instalaciones / Documento de FAQs (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Casos de Éxito & Testimonios',
      label: 'Testimonios de Transformación Física & Logros de la Comunidad',
      placeholder: 'ej. Casos de éxito de pérdida de peso, fotos de antes/después y reviews en Google (4.9★)',
      docLabel: 'Subir Testimonios / Ficha de Casos de Éxito (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Pase de Cortesía de 3 Días + Valoración Corporal InBody Gratis',
      docLabel: 'Subir Folleto de Oferta / Voucher de Cortesía (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Cercanía o Zona Compatible',
      '2. Meta Física Definida',
      '3. Disponibilidad de Horario',
      '4. Decisor de Compra (+18)',
    ],
  },
  service_appointments: {
    pilar1: {
      title: 'PILAR 1: Aranceles, Procedimientos & Facilidades',
      label: 'Aranceles Base, Facilidades de Pago (MSI) y Seguros Aceptados',
      placeholder: 'ej. Consulta Especialidad: $600 | Profilaxis: $750 | Ortodoncia Invisible: desde $1,800/mes a 12 MSI',
      docLabel: 'Subir Lista de Aranceles Médicos / Catálogo Oficial (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Identidad Empática, Profesional & Científica (Obligatorio)',
      placeholder: 'ej. Empático, profesional, cálido, riguroso, reconfortante y científico',
      docLabel: 'Subir Guía de Identidad / Protocolo Clínico (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Protocolo Médico, Cancelaciones & FAQs',
      label: 'Protocolo Médico, Cancelaciones con 24h y Teléfono de Urgencias',
      placeholder: 'ej. Cancelación con 24h de anticipación. En caso de dolor agudo o urgencia llamar a línea de guardia.',
      docLabel: 'Subir Protocolo de Urgencias / Documento de FAQs (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Casos Clínicos Anónimos & Certificaciones',
      label: 'Casos Clínicos de Éxito Anónimos y Credenciales Médicas',
      placeholder: 'ej. Certificaciones del Consejo Mexicano, convenios con aseguradoras y casos clínicos documentados',
      docLabel: 'Subir Certificaciones Médicas / Casos Clínicos (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. 1ª Consulta Diagnóstica con Escaneo 3D Gratuito',
      docLabel: 'Subir Folleto de Oferta / Campaña de Diagnóstico (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Motivo de Consulta Claro',
      '2. Paciente no Urgencia Crítica (P0)',
      '3. Disponibilidad Presencial',
      '4. Presupuesto para Valoración',
    ],
  },
  spa_beauty: {
    pilar1: {
      title: 'PILAR 1: Menú de Servicios, Masajes & Paquetes',
      label: 'Menú de Servicios, Paquetes de Sesiones y Anticipos de Cita',
      placeholder: 'ej. Masaje Relajante 60min: $750 | Limpieza Facial Profunda: $900 | Paquete Novias: $2,800 MXN',
      docLabel: 'Subir Menú de Servicios Spa / Lista de Precios (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono Relajante, Sofisticado & Amable (Obligatorio)',
      placeholder: 'ej. Relajante, sofisticado, cálido, acogedor y de máximo confort',
      docLabel: 'Subir Brandbook Spa / Manual de Estilo (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Políticas de Citas, Anticipos & Tolerancia',
      label: 'Política de Anticipo, Tolerancia de Horario y Cancelaciones',
      placeholder: 'ej. Anticipo del 30% para apartado de cabina. Tolerancia de 10 minutos. Cancelaciones con 12h de aviso.',
      docLabel: 'Subir Políticas de Cabina / Documento de FAQs (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Galería de Resultados & Reseñas',
      label: 'Galería de Antes y Después de Tratamientos y Reviews',
      placeholder: 'ej. Galería de cambios antes/después en tratamientos faciales y corporales, satisfacción 4.9★',
      docLabel: 'Subir Dossier de Resultados / Reseñas de Clientes (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Sesión de Hidratación Facial Express de Cortesía al reservar cualquier masaje',
      docLabel: 'Subir Cupón de Promoción / Voucher Spa (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Servicio o Zona de Interés',
      '2. Disponibilidad de Agenda',
      '3. Sin Contraindicaciones Médicas',
      '4. Anticipo de Cita Aceptado',
    ],
  },
  education_schools: {
    pilar1: {
      title: 'PILAR 1: Colegiaturas, Inscripción & Becas',
      label: 'Colegiaturas, Costo de Inscripción, Cuotas de Exámenes y Esquemas de Becas',
      placeholder: 'ej. Inscripción Anual: $6,500 | Colegiatura Mensual: $4,200 MXN | Descuento del 10% por pronto pago',
      docLabel: 'Subir Tabulador de Cuotas / Esquema de Becas (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono Formativo, Institucional, Cálido & Confiable (Obligatorio)',
      placeholder: 'ej. Formativo, institucional, cálido, confiable e inspirador',
      docLabel: 'Subir Ideario Institucional / Brandbook Escolar (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Fechas de Admisión, Requisitos & Reglamentos',
      label: 'Fechas Límite de Registro, Documentación Oficial y Políticas de Reembolso',
      placeholder: 'ej. Exámenes de admisión los sábados de 9 a 12h. Entrega de acta de nacimiento y boletas anteriores.',
      docLabel: 'Subir Convocatoria de Admisiones / Reglamento Interno (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Acreditaciones Oficiales (SEP) & Logros',
      label: 'Acreditaciones Oficiales (SEP, RVOE), Bolsa de Trabajo y Convenios',
      placeholder: 'ej. Clave de Centro de Trabajo (CCT), certificaciones Cambridge, intercambios y bolsa de trabajo',
      docLabel: 'Subir Folleto de Acreditaciones / Plan de Estudios (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. 50% de Descuento en Cuota de Inscripción + Tour Guiado por Campus',
      docLabel: 'Subir Folleto Promocional de Admisiones (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Grado Escolar de Interés',
      '2. Zona Geográfica / Transporte',
      '3. Alineación con Cuotas Mensuales',
      '4. Padre, Madre o Tutor Legal',
    ],
  },
  academies_courses: {
    pilar1: {
      title: 'PILAR 1: Mensualidades, Módulos & Materiales',
      label: 'Precios por Nivel o Módulo, Mensualidades y Material de Estudio',
      placeholder: 'ej. Curso Básico (12 semanas): $1,400/mes | Taller Sabatino: $950/mes | Material didáctico incluido',
      docLabel: 'Subir Tarifario de Cursos / Programas Académicos (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono Pedagógico, Motivante, Empático & Amigable (Obligatorio)',
      placeholder: 'ej. Pedagógico, motivante, paciente, cercano y creativo',
      docLabel: 'Subir Guía de Estilo / Filosofía de Enseñanza (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Calendario de Inicio, Asistencias & Certificados',
      label: 'Políticas de Asistencia, Fechas de Inicio y Acreditaciones',
      placeholder: 'ej. Inicios de grupo el primer lunes de cada mes. 80% de asistencia obligatoria para diploma.',
      docLabel: 'Subir Calendario de Cursos / Políticas Académicas (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Muestras de Alumnos & Casos de Éxito',
      label: 'Logros de Alumnos, Muestras Prácticas & Casos de Éxito',
      placeholder: 'ej. Presentaciones de fin de curso, certificaciones obtenidas y audiciones aprobadas por alumnos',
      docLabel: 'Subir Evidencia de Alumnos / Reseñas de Cursos (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Clase Muestra Gratuita de 45 minutos para evaluación de nivel',
      docLabel: 'Subir Voucher de Clase Muestra (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Nivel o Disciplina Requerida',
      '2. Horario Disponible (Semana/Sábado)',
      '3. Mayor de 15 años o con Tutor',
      '4. Compromiso con el Ciclo Completo',
    ],
  },
  infoproducts_bootcamps: {
    pilar1: {
      title: 'PILAR 1: Matrícula, Cuotas & Métodos de Pago',
      label: 'Precio del Programa, Descuentos Vigentes y Facilidades de Pago',
      placeholder: 'ej. Bootcamp Completo: $1,200 USD o 6 cuotas de $220 USD | Acceso vitalicio a grabaciones',
      docLabel: 'Subir Ficha de Precios / Plan de Financiamiento (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono Disruptivo, Aspiracional & Tecnológico (Obligatorio)',
      placeholder: 'ej. Disruptivo, aspiracional, ágil, pragmático y de alta energía',
      docLabel: 'Subir Manual de Marca / Directrices de Contenido (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Garantía de Satisfacción, SLAs & Requisitos',
      label: 'Políticas de Garantía, Acceso a la Plataforma y Requisitos',
      placeholder: 'ej. Garantía de devolución de 7 días sin preguntas. Requiere laptop con min 8GB RAM.',
      docLabel: 'Subir Términos de Servicio / Políticas de Reembolso (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Salarios de Egresados, Testimonios & Métricas',
      label: 'Resultados de Egresados, Testimonios y Proyección Práctica',
      placeholder: 'ej. Tasa de contratación del 84% en los primeros 6 meses, salario promedio inicial $1,500 USD',
      docLabel: 'Subir Reporte de Transparencia de Egresados (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Acceso a Masterclass Gratuita de 90 min + Beca del 25% por postulación temprana',
      docLabel: 'Subir Temario Oficial / Guía del Bootcamp (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Requisitos Técnicos Básicos',
      '2. Disponibilidad de 10h/semana',
      '3. Capacidad de Pago o Financiamiento',
      '4. Meta Profesional Concreta',
    ],
  },
  networking_mastermind: {
    pilar1: {
      title: 'PILAR 1: Membresías Anuales, Capítulos & Eventos',
      label: 'Cuota de Membresía, Eventos de Vinculación y Opciones de Pago',
      placeholder: 'ej. Membresía Anual: $1,800 USD | Cuota de Desayunos: $350 MXN por sesión | Acceso a directorio global',
      docLabel: 'Subir Reglamento de Cuotas / Beneficios de Socio (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono Ejecutivo, Colaborativo & de Alto Valor (Obligatorio)',
      placeholder: 'ej. Ejecutivo, colaborativo, estructurado, de alto estatus y visión de negocio',
      docLabel: 'Subir Código de Conducta / Filosofía de Red (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Exclusividad de Giro, Asistencia & Código Ético',
      label: 'Criterios de Aceptación, Compromiso de Asistencia y Código Ético',
      placeholder: 'ej. Solo un representante por giro profesional por capítulo. 3 inasistencias causan baja.',
      docLabel: 'Subir Estatutos del Club / Normas de Exclusividad (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Negocios Cruzados & Volumen Facturado',
      label: 'Volumen de Negocios y Casos de Colaboración entre Miembros',
      placeholder: 'ej. Cifra récord de $45 MDP en referencias comerciales generadas entre socios el último año',
      docLabel: 'Subir Reporte de Referencias / Casos de Alianzas (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Invitación como Invitado Especial a Sesión de Negocios sin costo de entrada',
      docLabel: 'Subir Invitación Formal a Sesión de Networking (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Giro Profesional sin Conflicto',
      '2. Empresa Constituida > 2 años',
      '3. Decisor o Dueño de Negocio',
      '4. Compromiso con Reunión Semanal',
    ],
  },
  community_subscriptions: {
    pilar1: {
      title: 'PILAR 1: Planes Mensuales, Anuales & Perks',
      label: 'Planes Mensual / Anual, Beneficios Incluidos y Período de Prueba',
      placeholder: 'ej. Mensual: $29 USD/mes | Plan Anual (2 meses gratis): $290 USD | Acceso a Discord y calls VIP',
      docLabel: 'Subir Planes de Suscripción / Tabla de Beneficios (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono de Tribu, Exclusivo & Cercano (Obligatorio)',
      placeholder: 'ej. De comunidad, cercano, exclusivo, colaborativo e informal pero de alto valor',
      docLabel: 'Subir Manifiesto de Comunidad / Reglas de Discord (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Reglas de Convivencia, Privacidad & Cancelación',
      label: 'Reglas de Convivencia, Privacidad y Gestión de Suscripción',
      placeholder: 'ej. Cero spam o prospección no autorizada en DMs. Cancelación en 1-click desde portal de Stripe.',
      docLabel: 'Subir Reglas de la Comunidad / Políticas de Privacidad (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Repositorio de Masterclasses & Recursos',
      label: 'Histórico de Masterclasses y Contenido Exclusivo para Miembros',
      placeholder: 'ej. Repositorio de más de 80 masterclasses grabadas, plantillas Notion y recursos descargables',
      docLabel: 'Subir Catálogo de Recursos / Testimonios de Miembros (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Prueba de 7 días por $1 USD o Acceso Inmediato a Plantilla Exclusiva',
      docLabel: 'Subir Preview de Contenido / Ficha del Club (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Perfil Profesional Afín a la Tribu',
      '2. Tarjeta de Crédito/Débito Activa',
      '3. Aceptación de Reglas de Convivencia',
      '4. Compromiso de Participación Activa',
    ],
  },
  ecommerce: {
    pilar1: {
      title: 'PILAR 1: Catálogo de SKUs, Precios & Envíos',
      label: 'Catálogo de SKUs, Precios, Variantes, Stock y Promociones',
      placeholder: 'ej. Playera Oversize: $380 MXN | Sneakers Urban: $1,450 | Envíos gratis en compras > $899 MXN',
      docLabel: 'Subir Catálogo de Productos / Lista de Precios (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Identidad Dinámica, Fresca & Visual (Obligatorio)',
      placeholder: 'ej. Fresco, dinámico, visual, ágil, entusiasta y centrado en el estilo de vida',
      docLabel: 'Subir Brandbook de Marca / Lookbook (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Guías de Envío, Tiempos de Entrega & Cambios',
      label: 'Guías de Envío, Políticas de Devolución o Cambio y Tiempos de Entrega',
      placeholder: 'ej. Envíos nacionales en 3 a 5 días hábiles. Primer cambio de talla gratis dentro de 15 días.',
      docLabel: 'Subir Políticas de Envío y Devolución / FAQs (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Bestsellers, Reseñas con Foto & UGC',
      label: 'Top Bestsellers y Promociones Exitosas',
      placeholder: 'ej. Más de 1,200 reseñas de 5 estrellas en sitio web, fotos de clientes en Instagram',
      docLabel: 'Subir Ficha de Productos Estrella / Galería UGC (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. 15% de Descuento en Primera Compra con cupón BIENVENIDO + Envío Gratis',
      docLabel: 'Subir Banner Promocional / Cupón de Descuento (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Cobertura de Envío en su Código Postal',
      '2. Producto y Talla en Stock',
      '3. Medio de Pago Disponible',
      '4. Intención de Compra en Línea',
    ],
  },
  local_retail: {
    pilar1: {
      title: 'PILAR 1: Precios de Mostrador, Mayoreo & Piezas',
      label: 'Catálogo de Productos, Precios por Pieza o Mayoreo y Métodos de Pago',
      placeholder: 'ej. Bulto Cemento: $240 MXN | Varilla 3/8: $185 | Descuento del 8% en compras > $10,000 MXN',
      docLabel: 'Subir Lista de Precios Mostrador & Mayoreo (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono Técnico, Ágil, Práctico & Resolutivo (Obligatorio)',
      placeholder: 'ej. Práctico, técnico, resolutivo, claro, honesto y ágil de mostrador',
      docLabel: 'Subir Ficha de Identidad de Tienda (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Tiempos de Entrega en Obra, Garantías & Flete',
      label: 'Políticas de Garantía de Piezas, Tiempos de Entrega a Domicilio y Devoluciones',
      placeholder: 'ej. Flete gratis en compras mayores a $3,500 en radio de 10 km. Garantía de fábrica en herramientas.',
      docLabel: 'Subir Políticas de Flete, Entregas y Garantías (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Marcas Distribuidas & Inventario en Almacén',
      label: 'Marcas Oficiales Distribuidas y Stock en Almacén',
      placeholder: 'ej. Distribuidores autorizados de Truper, Makita, DeWalt y Cemex con inventario disponible',
      docLabel: 'Subir Catálogo de Marcas y Stock (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Cotización Formal en menos de 15 min + Flete Gratuito en tu Primer Pedido',
      docLabel: 'Subir Folleto de Mayoreo / Promociones de Mes (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Ubicación de Entrega o Retiro en Tienda',
      '2. Especificación Técnica Confirmada',
      '3. Volumen (Menudeo o Mayoreo)',
      '4. Fecha de Requerimiento de Material',
    ],
  },
  hospitality: {
    pilar1: {
      title: 'PILAR 1: Menú Digital, Precios & Paquetes',
      label: 'Menú Digital, Precios Promedio y Paquetes para Grupos',
      placeholder: 'ej. Menú Degustación 4 Tiempos: $650 | Platillo Especial: $290 | Coctelería de Autor desde $160 MXN',
      docLabel: 'Subir Carta de Platillos / Menú Digital con Precios (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono Cálido, Gourmet, Experiencial & Amigable (Obligatorio)',
      placeholder: 'ej. Hospitalario, gourmet, cálido, sugerente, sensorial y cordial',
      docLabel: 'Subir Brandbook Gastronómico / Filosofía de Mesa (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Alergias Alimentarias, Reservas & Descorche',
      label: 'Alergias Alimentarias, Políticas de Reserva y Tolerancia en Mesa',
      placeholder: 'ej. Tolerancia de 15 min en reservaciones de mesa. Protocolo estricto para celíacos. Descorche $350 MXN.',
      docLabel: 'Subir Políticas de Reservación y Alergias (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Reconocimientos Gastronómicos & Eventos',
      label: 'Fechas de Alta Demanda y Paquetes de Temporada',
      placeholder: 'ej. Recomendado en Guía Gastronómica local, menciones en prensa y fotos de platillos insignia',
      docLabel: 'Subir Dossier de Prensa / Menú de Temporada (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Cóctel de Bienvenida de Cortesía o Postre Insignia en Reservación para 2+ personas',
      docLabel: 'Subir Cupón de Degustación / Voucher de Mesa (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Número de Comensales y Fecha',
      '2. Alergias o Restricciones Notificadas',
      '3. Tipo de Ocasión (Cena, Festejo, Trabajo)',
      '4. Confirmación de Horario de Llegada',
    ],
  },
  event_venues: {
    pilar1: {
      title: 'PILAR 1: Paquetes por Persona, Mobiliario & Banquete',
      label: 'Paquetes por Persona, Servicios Incluidos y Opciones Adicionales',
      placeholder: 'ej. Paquete Boda Todo Incluido (150 personas): $850/persona | Alquiler de Salón: $35,000 MXN',
      docLabel: 'Subir Paquetes de Salón / Menús de Banquete (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono Festivo, Emotivo, Confiable & Elegante (Obligatorio)',
      placeholder: 'ej. Emotivo, elegante, confiable, detallista, inspirador y profesional',
      docLabel: 'Subir Manual de Identidad / Estilo de Eventos (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Anticipos, Pagos en Parcialidades & Políticas',
      label: 'Esquema de Pagos, Anticipos y Políticas de Cancelación',
      placeholder: 'ej. Apartado con 20% inicial. Liquidación 15 días antes del evento. Políticas de horas extras.',
      docLabel: 'Subir Contrato Tipo de Evento / Políticas de Fecha (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Galería de Montajes Reales & Proveedores',
      label: 'Fotografías de Montajes Reales y Recomendaciones de Proveedores',
      placeholder: 'ej. Portafolio fotográfico de bodas y graduaciones reales, alianzas con fotógrafos y DJ',
      docLabel: 'Subir Dossier Fotográfico de Montajes (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Degustación Gratuita de Menú para 4 Personas al agendar visita presencial al salón',
      docLabel: 'Subir Folleto de Paquetes / Cupón de Degustación (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Fecha Estimada del Evento',
      '2. Número Mínimo de Invitados (50+)',
      '3. Presupuesto Compatible por Persona',
      '4. Decisores (Pareja o Comité Organizador)',
    ],
  },
  b2b: {
    pilar1: {
      title: 'PILAR 1: Rangos de Inversión, Retainers & Alcance',
      label: 'Rangos de Inversión, Planes de Servicio y Esquemas de Implementación',
      placeholder: 'ej. Auditoría Estratégica: $1,500 USD | Retainer de Pauta & IA: desde $2,500 USD/mes | Sprint de 90 días',
      docLabel: 'Subir Ficha de Servicios B2B / Tarifario de Retainers (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono Ejecutivo, Consultivo, Estratégico & Riguroso (Obligatorio)',
      placeholder: 'ej. Ejecutivo, consultivo, analítico, estratégico, riguroso y orientado a ROI',
      docLabel: 'Subir Brandbook Corporativo / Directrices de Comunicación (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Acuerdos NDA, SLAs de Respuesta & Contratos',
      label: 'Acuerdos de Confidencialidad (NDA), SLAs y Términos de Servicio',
      placeholder: 'ej. Firma de NDA obligatorio previo a auditoría. Soporte con SLA de respuesta < 4 horas hábiles.',
      docLabel: 'Subir Modelo de NDA / Términos de Servicio B2B (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Casos de Estudio Reales con Métricas de ROI',
      label: 'Casos de Estudio Reales con Métricas y Resultados Comprobables',
      placeholder: 'ej. Caso Fintech: Incremento de 340% en leads calificados reduciendo el CAC en un 42%',
      docLabel: 'Subir Whitepaper / Casos de Estudio de Éxito (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Sesión de Diagnóstico Estratégico de 45 min sin costo con Lead Consultant',
      docLabel: 'Subir Ficha de Discovery Call / Credenciales (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Presupuesto de Pauta/Servicio > $15K USD',
      '2. Problemática Concreta de Escalamiento',
      '3. Plazo de Implementación < 60 días',
      '4. Cargo de C-Level, VP o Socio',
    ],
  },
  legal_accounting: {
    pilar1: {
      title: 'PILAR 1: Honorarios, Pólizas Mensuales & Aranceles',
      label: 'Costo de Consulta Inicial, Pólizas de Asesoría y Aranceles por Trámite',
      placeholder: 'ej. Consulta Inicial (1h): $1,200 MXN | Póliza Fiscal PyME: $4,500/mes | Dictamen Notarial: según avalúo',
      docLabel: 'Subir Tabulador de Honorarios / Pólizas de Asesoría (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono Formal, Riguroso, Ético & de Máxima Discreción (Obligatorio)',
      placeholder: 'ej. Formal, riguroso, ético, institucional, sobrio y de máxima confidencialidad',
      docLabel: 'Subir Código Deontológico / Manual de Marca (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Secreto Fiduciario, Términos & Documentación',
      label: 'Secreto Profesional, Confidencialidad y Términos de Representación',
      placeholder: 'ej. Secreto profesional amparado por ley. Se requiere INE y constancia de situación fiscal para expediente.',
      docLabel: 'Subir Aviso de Privacidad Legal / Términos de Asesoría (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Trayectoria, Cédulas Profesionales & Especialidades',
      label: 'Casos Resueltos Favorablemente (Sin revelar datos confidenciales)',
      placeholder: 'ej. Abogados titulados con más de 18 años de litigio mercantil y fiscal exitoso',
      docLabel: 'Subir Currículum del Despacho / Credenciales (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Diagnóstico Fiscal Preliminar de 30 min sin costo para detectar riesgos inmediatos',
      docLabel: 'Subir Folleto Informativo / Checklist Legal (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Asunto Específico (Mercantil, Fiscal, Laboral)',
      '2. Estado Procesal o Fecha Límite',
      '3. Documentación Básica Disponible',
      '4. Titular o Apoderado Legal',
    ],
  },
  realestate: {
    pilar1: {
      title: 'PILAR 1: Precios de Unidades, Enganches & Créditos',
      label: 'Precios Base, Esquemas de Enganche, Mensualidades y Promociones',
      placeholder: 'ej. Deptos desde $2.6 MDP | Enganche del 15% diferido en 18 meses | Aceptamos Cofinavit y Bancario',
      docLabel: 'Subir Lista de Precios de Unidades / Esquemas de Pago (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono Asesor, Patrimonial, Inspirador & Profesional (Obligatorio)',
      placeholder: 'ej. Asesor patrimonial, aspiracional, profesional, confiable y seguro',
      docLabel: 'Subir Brandbook del Desarrollo / Manual de Identidad (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Requisitos de Precalificación & Proceso Notarial',
      label: 'Requisitos de Crédito Hipotecario y Proceso de Escrituración',
      placeholder: 'ej. Apartado con $20,000 MXN reembolsable en 10 días si no se aprueba crédito. Gastos notariales ~6%.',
      docLabel: 'Subir Requisitos de Crédito Hipotecario / Guía de Compra (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Fichas Técnicas, Planos & Amenidades',
      label: 'Historial de Entregas, Plusvalía Proyectada y Amenidades',
      placeholder: 'ej. Master plan del proyecto, amenidades (alberca, gimnasio, coworking) y fecha de entrega garantizada',
      docLabel: 'Subir Brochure Oficial del Desarrollo / Planos (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Bono Especial de $50,000 MXN en Equipamiento + Asesoría Hipotecaria Gratuita',
      docLabel: 'Subir Ficha de Promoción / Voucher de Descuento (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Presupuesto / Crédito Preaprobado',
      '2. Número de Recámaras y Zona Deseada',
      '3. Plazo de Compra (< 6 meses)',
      '4. Decisor Familiar o Inversionista',
    ],
  },
  automotive: {
    pilar1: {
      title: 'PILAR 1: Precios de Modelos, Enganche & Mantenimiento',
      label: 'Precios de Unidades, Opciones de Enganche, Mensualidades y Paquetes de Servicio',
      placeholder: 'ej. SUV 2026 desde $435,000 MXN | Enganche desde 20% | Servicio de 10,000 km: $2,100 MXN',
      docLabel: 'Subir Catálogo de Unidades / Lista de Precios Oficial (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz',
      label: 'Tono Dinámico, Experto, Confiable & Ágil (Obligatorio)',
      placeholder: 'ej. Dinámico, experto en autos, ágil, entusiasta, transparente y confiable',
      docLabel: 'Subir Manual de Marca Automotriz (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Requisitos para Test Drive & Pólizas de Garantía',
      label: 'Requisitos de Identificación para Test Drive y Cobertura de Garantía',
      placeholder: 'ej. Para prueba de manejo se requiere licencia de conducir vigente y ser mayor de 21 años. Garantía 5 años o 100 mil km.',
      docLabel: 'Subir Requisitos de Test Drive / Póliza de Garantía (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Fichas Técnicas, Seguridad & Valoraciones',
      label: 'Reseñas de Manejo y Satisfacción de Clientes',
      placeholder: 'ej. 5 estrellas de seguridad Latin NCAP, rendimiento de combustible 17 km/L y valor de reventa',
      docLabel: 'Subir Fichas Técnicas de Vehículos / Comparativas (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Prueba de Manejo a Domicilio o en Agencia + 0% de Comisión por Apertura de Crédito',
      docLabel: 'Subir Folleto Promocional / Bono de Agencia (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Modelo de Interés (SUV, Sedán, Taller)',
      '2. Forma de Compra (Contado, Crédito, Leasing)',
      '3. Licencia de Conducir Vigente',
      '4. Plazo de Adquisición (< 30 días)',
    ],
  },
  creator: {
    pilar1: {
      title: 'PILAR 1: Tarifas de Patrocinio & Media Kit',
      label: 'Tarifas y Media Kit para Alianzas Comerciales (Opcional)',
      placeholder: 'ej. Story de Instagram: $450 USD | Video Integrado en YouTube: $1,800 USD | Paquete Reels + TikTok: $1,200 USD',
      docLabel: 'Subir Media Kit Oficial / Tarifario de Alianzas (PDF, DOCX, MD)',
    },
    pilar2: {
      title: 'PILAR 2: Brandbook & Tono de Voz del Creador',
      label: 'Identidad & Tono de Voz Único del Creador (Obligatorio Núcleo)',
      placeholder: 'ej. Auténtico, humorístico, desenfadado, transparente y con frases icónicas de la comunidad',
      docLabel: 'Subir Guía de Estilo / Manifiesto del Creador (PDF, DOCX, MD)',
    },
    pilar3: {
      title: 'PILAR 3: Límites Editoriales, Moderación & Colaboraciones',
      label: 'Moderación de Contenido, Filtro de Respeto y Menciones',
      placeholder: 'ej. No se promocionan casas de apuestas ni criptomonedas no reguladas. Aprobación de guion previa.',
      docLabel: 'Subir Lineamientos de Marca / Políticas de Moderación (PDF, DOCX, MD)',
    },
    pilar4: {
      title: 'PILAR 4: Estadísticas de Audiencia & Alcance (Insights)',
      label: 'Métricas de Audiencia y Alianzas Exitosas Previas',
      placeholder: 'ej. 240K seguidores, 65% de 25 a 34 años, 7.8% de engagement rate y 85K vistas promedio por Story',
      docLabel: 'Subir Capturas de Insights de Meta / Analítica (PDF, DOCX, MD)',
    },
    offer: {
      title: 'PROPUESTA COMERCIAL & OFERTA',
      label: 'Gancho del Mes / Lead Magnet',
      placeholder: 'ej. Descuento del 20% en Paquete Trimestral para Marcas con Productos de Lifestyle',
      docLabel: 'Subir Propuesta Comercial de Patrocinio (PDF, DOCX, MD)',
    },
    criteria: [
      '1. Marca o Empresa Constituida',
      '2. Presupuesto Mínimo de Campaña',
      '3. Producto Compatible con la Audiencia',
      '4. Fechas de Pauta Solicitadas',
    ],
  },
};

export const RAGWizard = ({
  externalAdminViewMode,
  onAdminViewModeChange,
  hideHeader = false,
}) => {
  const {
    role,
    isAdmin,
    isClient,
    activeTenant,
    triggerModal,
    tenantsData,
    toggleTenantMicroLanding,
    registerTenant,
    deleteTenant,
    updateTenantPolicy,
    switchTenantContext,
  } = useAuth();

  // Mode for Admin: 'list' (Tenant Overview & Requests) or 'wizard' (Step-by-Step New Business Onboarding)
  const [internalAdminViewMode, setInternalAdminViewMode] = useState(externalAdminViewMode || 'list');
  const [currentStep, setCurrentStep] = useState(1);

  // Manejador para eliminación segura de un negocio con popup modal
  const handleDeleteTenant = (tenant) => {
    if (!tenant) return;
    const isCurrentlyActive = activeTenant?.id === tenant.id;

    triggerModal(
      `Eliminar Negocio: ${tenant.name}`,
      `
        <div class="space-y-3">
          <p class="text-xs text-[var(--text-main)]">
            ¿Estás completamente seguro de que deseas eliminar a <strong class="text-rose-400 font-bold">${tenant.name}</strong> (ID: <code class="text-neon">${tenant.id}</code>)?
          </p>
          <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs space-y-1.5 font-mono">
            <p class="font-bold flex items-center gap-1.5">
              ⚠️ Esta acción es destructiva e irreversible:
            </p>
            <ul class="list-disc list-inside space-y-0.5 text-[11px] text-[var(--text-muted)]">
              <li>Se removerán los <strong class="text-[var(--text-main)]">4 Pilares de Conocimiento RAG</strong> indexados.</li>
              <li>Se desvinculará la sincronización de <strong class="text-[var(--text-main)]">Meta Conversions API (CAPI)</strong> y Webhooks.</li>
              <li>Se dará de baja la <strong class="text-[var(--text-main)]">Micro-Landing Universal</strong> (/m/${tenant.microLandingSlug || tenant.id}).</li>
              ${isCurrentlyActive ? '<li class="text-amber-400 font-bold">Nota: Este negocio es el actualmente activo en tu panel. Se cambiará el contexto al siguiente disponible.</li>' : ''}
            </ul>
          </div>
          <p class="text-[11px] text-[var(--text-muted)]">
            Confirma la eliminación para revocar el aislamiento de base de datos de este cliente.
          </p>
        </div>
      `,
      () => {
        deleteTenant(tenant.id);
        triggerModal(
          'Negocio Eliminado',
          `El tenant <strong class="text-[var(--text-main)]">${tenant.name}</strong> ha sido eliminado del sistema y desvinculado de la memoria RAG.`,
          null,
          'Entendido'
        );
      },
      'Sí, Eliminar Definitivamente',
      'danger'
    );
  };

  // Sync with external mode prop if provided
  useEffect(() => {
    if (externalAdminViewMode) {
      setInternalAdminViewMode(externalAdminViewMode);
    }
  }, [externalAdminViewMode]);

  const adminViewMode = externalAdminViewMode || internalAdminViewMode;

  const setAdminViewMode = (newMode) => {
    setInternalAdminViewMode(newMode);
    if (onAdminViewModeChange) {
      onAdminViewModeChange(newMode);
    }
  };

  // Multi-Tenant Control Panel State (Search, Filters, View Mode, Accordion)
  const [tenantSearchQuery, setTenantSearchQuery] = useState('');
  const [tenantStatusFilter, setTenantStatusFilter] = useState('all'); // 'all' | 'active' | 'suspended'
  const [tenantVerticalFilter, setTenantVerticalFilter] = useState('all');
  const [tenantViewLayout, setTenantViewLayout] = useState('table'); // 'table' | 'cards'
  const [expandedTenantPillars, setExpandedTenantPillars] = useState({});

  // Computed metrics for ecosystem
  const tenantEcosystemStats = useMemo(() => {
    const list = Object.values(tenantsData || {});
    const total = list.length;
    const activeCount = list.filter(
      (t) => t.microLandingStatus !== 'suspended' && t.microLandingStatus !== 'disabled' && t.microLandingEnabled !== false
    ).length;
    const pausedCount = total - activeCount;
    return { total, activeCount, pausedCount };
  }, [tenantsData]);

  // Filtered and searched tenant list
  const filteredTenantsList = useMemo(() => {
    const list = Object.values(tenantsData || {});
    return list.filter((tenant) => {
      // 1. Search Query
      if (tenantSearchQuery.trim()) {
        const q = tenantSearchQuery.toLowerCase();
        const matchesName = tenant.name?.toLowerCase().includes(q);
        const matchesId = tenant.id?.toLowerCase().includes(q);
        const matchesGiro = (tenant.giro || tenant.vertical || tenant.verticalLabel)?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesGiro) return false;
      }

      // 2. Status Filter
      if (tenantStatusFilter !== 'all') {
        const isSuspended =
          tenant.microLandingStatus === 'suspended' ||
          tenant.microLandingStatus === 'disabled' ||
          tenant.microLandingEnabled === false;
        if (tenantStatusFilter === 'active' && isSuspended) return false;
        if (tenantStatusFilter === 'suspended' && !isSuspended) return false;
      }

      // 3. Vertical Filter
      if (tenantVerticalFilter !== 'all') {
        const tVert = (tenant.vertical || tenant.giro || '').toLowerCase();
        if (!tVert.includes(tenantVerticalFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [tenantsData, tenantSearchQuery, tenantStatusFilter, tenantVerticalFilter]);

  // Toggle expanded pillars for a tenant
  const toggleTenantPillars = (tenantId) => {
    setExpandedTenantPillars((prev) => ({
      ...prev,
      [tenantId]: !prev[tenantId],
    }));
  };

  // Category Filter, View Mode and Search Query for Vertical Selection
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [verticalViewMode, setVerticalViewMode] = useState('compact'); // 'compact' | 'detailed'

  const categoryCounts = useMemo(() => {
    const counts = { all: Object.keys(BUSINESS_VERTICALS_CONFIG).length };
    Object.values(BUSINESS_VERTICALS_CONFIG).forEach((v) => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Ingestion Mode: unified 6-step guided wizard with AI 1-click briefing accelerator
  const [ingestionMode, setIngestionMode] = useState('guided');
  const [isAnalyzingBriefing, setIsAnalyzingBriefing] = useState(false);
  const [briefingAnalysisStage, setBriefingAnalysisStage] = useState('');
  const [briefingAnalyzed, setBriefingAnalyzed] = useState(false);
  const [masterDocText, setMasterDocText] = useState('');
  const [masterFile, setMasterFile] = useState(null);
  const briefingAbortRef = useRef(null);

  // Client change request modal
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedPillarForChange, setSelectedPillarForChange] = useState('pillar2');
  const [changeNotes, setChangeNotes] = useState('');
  const [changeFileName, setChangeFileName] = useState('');

  // Form State for Onboarding Wizard
  const [wizardData, setWizardData] = useState({
    businessName: '',
    legalNameTaxId: '',
    vertical: 'gym_fitness',
    verticalTipo: 'service_appointments',
    businessGoal: 'appointments',
    primaryContact: '',
    contactEmail: '',
    ownerPhone: '',

    // Estrategia Dual has_website & Canales Meta
    hasWebsite: true,
    websiteUrl: '',
    ga4MeasurementId: '',
    metaPixelId: '',
    metaCapiToken: '',
    whatsappPhoneId: '',
    wabaId: '',
    instagramAccountId: '',

    // Micro-Landing Universal como Servicio
    microLandingBillingPlan: 'trial_90d', // 'trial_90d' (3 Meses Gratis) | 'active_monthly' ($29 USD/mes) | 'disabled' (Inactiva)
    microLandingCustomSlug: '',

    // Google Calendar & Performance
    googleCalendarId: '',
    appointmentDuration: 45,
    calendarScheduleType: 'split', // 'split' (2 turnos) | 'single' (corrido) | 'hospitality' (mesas) | 'calls' (b2b)
    shiftMorningStart: '09:00',
    shiftMorningEnd: '14:00',
    shiftAfternoonStart: '15:00',
    shiftAfternoonEnd: '19:00',
    breakStart: '14:00',
    breakEnd: '15:00',
    breakLabel: 'Receso / Cambio de Turno',
    activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
    concurrencyLimit: 1,
    costPerQualifiedLead: 350.0,
    monthlyAdBudget: '',
    showOnboardingPayloadModal: false,
    
    // Toggles for Optional Pillars (Only Pillar 2 is strictly required!)
    enablePricingPillar: true,
    enableCrisisPillar: true,
    enableHistoryPillar: false,

    // Propuesta Comercial & Oferta de Valor (HÍBRIDO: Documento + 3 Highlights)
    enableCommercialProposal: true,
    commercialProposalDoc: null,
    commercialProposalFormat: 'pdf',
    offerHook: '',
    offerCta: '',
    offerValidity: '',

    // Inviolable Rules (Reglas Inviolables) - Iniciamos 100% limpio
    inviolableRules: [],
    newRuleInput: '',

    // Pillar 1: Matriz de Rentabilidad (OPCIONAL)
    cacMax: 150,
    ltvExpected: 3600,
    minGrossMargin: 55,
    pricingDoc: null,
    pricingFormat: 'json',

    // Pillar 2: Identidad y Tono de Voz (OBLIGATORIO)
    brandTone: '',
    archetype: '',
    emojiPolicy: 'Moderado (según documentos)',
    brandbookDoc: null,
    brandbookFormat: 'md',

    // Pillar 3: Protocolos de Crisis y FAQs (OPCIONAL)
    useDefaultCrisisTemplate: true,
    crisisKeywords: 'estafa, lesion, queja, profeco, cancelar, reembolso, cobrar de mas',
    hitlEscalationLatency: 'Sub-segundo (< 1.2s)',
    faqsDoc: null,
    faqsFormat: 'md',

    // Pillar 4: Histórico de Datos (OPCIONAL)
    historicalContext: '',
    historicalDoc: null,
    historicalFormat: 'txt',

    // API Credentials
    whatsappPhoneId: '',
    metaAccessToken: '',
    deepseekApiKey: '',
    stripeWebhookSecret: '',
  });

  // Modal and JSON payload states for 6-block onboarding
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isCustomizingSchedule, setIsCustomizingSchedule] = useState(false);

  const getDynamicOnboardingPayload = () => {
    return {
      tenant_id: `tenant_${(wizardData.businessName || 'nuevo_negocio').toLowerCase().replace(/[^a-z0-9]/g, '_')}_001`,
      business_name: wizardData.businessName || 'Nuevo Negocio',
      legal_name_tax_id: wizardData.legalNameTaxId || 'Pendiente / En Validación',
      vertical_tipo: wizardData.vertical,
      owner_name: wizardData.ownerName || 'Director General',
      owner_phone: wizardData.ownerPhone || '+525500000000',
      meta_credentials: {
        whatsapp_phone_number_id: wizardData.whatsappPhoneId || '10987654321',
        waba_id: wizardData.wabaId || '98765432109',
        whatsapp_access_token: wizardData.metaCapiToken ? '••••••••' : 'EAAX_TOKEN_VERIFIED',
        instagram_account_id: wizardData.instagramAccountId || '1784140000000',
        facebook_page_id: '100555444333',
      },
      web_tracking: {
        has_website: wizardData.hasWebsite,
        website_url: wizardData.hasWebsite ? wizardData.websiteUrl || 'https://negocio.com' : null,
        ga4_measurement_id: wizardData.hasWebsite ? wizardData.ga4MeasurementId || 'G-ABC123XYZ' : null,
        meta_pixel_id: wizardData.metaPixelId || '123456789012345',
        meta_capi_token: wizardData.metaCapiToken || 'EAAX_CAPI_TOKEN_SECURE',
        auto_generated_micro_landing: `https://app.vectorinside.com/m/${(wizardData.microLandingCustomSlug || wizardData.businessName || 'demo').toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        micro_landing_slug: (wizardData.microLandingCustomSlug || wizardData.businessName || 'demo').toLowerCase().replace(/[^a-z0-9]/g, '-'),
        micro_landing_enabled: wizardData.microLandingBillingPlan !== 'disabled',
        micro_landing_status:
          wizardData.microLandingBillingPlan === 'disabled'
            ? 'disabled'
            : wizardData.microLandingBillingPlan === 'active_monthly'
            ? 'active'
            : 'trial',
        micro_landing_trial_days_left: wizardData.microLandingBillingPlan === 'trial_90d' ? 90 : 0,
        micro_landing_billing_plan: wizardData.microLandingBillingPlan || 'trial_90d',
      },
      google_calendar_integration: {
        google_calendar_id: wizardData.googleCalendarId || 'c_agenda@group.calendar.google.com',
        appointment_duration_minutes: wizardData.appointmentDuration || 45,
        service_hours: {
          timezone: 'America/Mexico_City',
          days: wizardData.activeDays || ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
          schedule_type: wizardData.calendarScheduleType || 'split',
          concurrency_limit: wizardData.concurrencyLimit || 1,
          shifts: (wizardData.shifts && wizardData.shifts.length > 0)
            ? wizardData.shifts
            : [
                { name: 'Turno 1 / Matutino', start: wizardData.shiftMorningStart || '08:00', end: wizardData.shiftMorningEnd || '13:30' },
                ...(wizardData.shiftAfternoonStart ? [{ name: 'Turno 2 / Vespertino', start: wizardData.shiftAfternoonStart, end: wizardData.shiftAfternoonEnd || '18:00' }] : []),
              ],
          shift_1: `${wizardData.shiftMorningStart || '08:00'} - ${wizardData.shiftMorningEnd || '13:30'}`,
          shift_2: wizardData.shiftAfternoonStart ? `${wizardData.shiftAfternoonStart} - ${wizardData.shiftAfternoonEnd || '18:00'}` : null,
        },
      },
      catalog_or_services: [
        {
          id: 'srv-01',
          name: wizardData.offerHook || 'Servicio / Oferta Principal',
          price_mxn: wizardData.costPerQualifiedLead * 3 || 1050.0,
          requires_calendar_slot: true,
        },
      ],
      ai_rag_pillars: {
        pilar_1_pricing: {
          details: wizardData.pricingDetails || 'Tarifas base del giro comercial',
          document_source: typeof wizardData.pricingDoc === 'string' ? wizardData.pricingDoc : (wizardData.pricingDoc?.name || null),
        },
        pilar_2_brandbook: {
          brand_tone: wizardData.brandTone || 'Empático, resolutivo y profesional',
          archetype: wizardData.archetype || currentVerticalObj.badge || 'El Asesor Experto',
          document_source: typeof wizardData.brandbookDoc === 'string' ? wizardData.brandbookDoc : (wizardData.brandbookDoc?.name || null),
        },
        commercial_offer: {
          offer_hook: wizardData.offerHook || 'Diagnóstico de bienvenida sin costo',
          document_source: typeof wizardData.commercialProposalDoc === 'string' ? wizardData.commercialProposalDoc : (wizardData.commercialProposalDoc?.name || null),
        },
        pilar_3_policies_faqs: {
          details: wizardData.faqDetails || 'Políticas de cancelación con 24h y garantías oficiales',
          document_source: typeof wizardData.faqsDoc === 'string' ? wizardData.faqsDoc : (wizardData.faqsDoc?.name || null),
        },
        pilar_4_lead_matrix: {
          criteria_and: currentPillarsAdaptive.criteria || [],
          cost_per_qualified_lead_mxn: wizardData.costPerQualifiedLead || 350,
        },
      },
      inviolable_rules: wizardData.inviolableRules,
    };
  };

  const handleCopyPayload = () => {
    try {
      const payloadObj = getDynamicOnboardingPayload();
      navigator.clipboard.writeText(JSON.stringify(payloadObj, null, 2));
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2500);
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#E7F900', '#10B981'],
        });
      } catch (e) {}
    } catch (err) {
      console.error(err);
    }
  };

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

  const [showPilar4Guide, setShowPilar4Guide] = useState(false);

  // Dynamic Deficiencies & Gaps in Master Plan
  const detectedDeficiencies = useMemo(() => {
    const list = [];
    const vert = BUSINESS_VERTICALS_CONFIG[wizardData.vertical] || BUSINESS_VERTICALS_CONFIG.gym_fitness;
    const adaptive = VERTICAL_PILLARS_ADAPTIVE_CONFIG[wizardData.vertical] || VERTICAL_PILLARS_ADAPTIVE_CONFIG.gym_fitness;

    // 1. Pilar 2 (Brandbook / Tono)
    if (!wizardData.brandTone && !wizardData.brandbookDoc) {
      list.push({
        id: 'gap-pilar2',
        pilar: 'Pilar 2: Brandbook',
        severity: 'critical',
        severityLabel: 'Crítico',
        title: 'Falta Tono de Voz o Identidad de Marca [Obligatorio]',
        description: `El bot no tiene directrices de lenguaje para ${vert.name}. Podría sonar plano o responder sin empatía.`,
        suggestedFix: adaptive.pilar2.placeholder.replace(/^ej\.\s*/, ''),
        actionLabel: 'Asignar Tono Recomendado',
        field: 'brandTone',
      });
    }

    // 2. Propuesta Comercial & Oferta
    if (!wizardData.offerHook && !wizardData.commercialProposalDoc) {
      list.push({
        id: 'gap-offer',
        pilar: 'Propuesta Comercial',
        severity: 'recommended',
        severityLabel: 'Recomendado',
        title: 'Sin Gancho Comercial o Lead Magnet de Captación',
        description: 'Una oferta con beneficio tangible (clase muestra, diagnóstico, bono) eleva la conversión en pauta en un 42%.',
        suggestedFix: adaptive.offer.placeholder.replace(/^ej\.\s*/, ''),
        actionLabel: 'Activar Gancho del Giro',
        field: 'offerHook',
      });
    }

    // 3. Pilar 1 (Precios & Servicios)
    if (!wizardData.pricingDetails && !wizardData.pricingDoc) {
      list.push({
        id: 'gap-pilar1',
        pilar: 'Pilar 1: Precios & Servicios',
        severity: 'warning',
        severityLabel: 'Advertencia',
        title: 'Tarifario o Servicios no Especificados',
        description: 'El prospecto preguntará precios. Sin este pilar, la IA dependerá de aranceles genéricos o citas a ciegas.',
        suggestedFix: adaptive.pilar1.placeholder.replace(/^ej\.\s*/, ''),
        actionLabel: 'Cargar Tarifario del Giro',
        field: 'pricingDetails',
      });
    }

    // 4. Pilar 3 (Políticas & FAQs)
    if (!wizardData.faqDetails && !wizardData.faqsDoc) {
      list.push({
        id: 'gap-pilar3',
        pilar: 'Pilar 3: Políticas & FAQs',
        severity: 'optional',
        severityLabel: 'Opcional',
        title: 'Sin Reglas de Cancelación o Preguntas Frecuentes',
        description: 'Es clave prevenir reclamos definiendo con anticipación políticas de cancelación, garantías y tolerancias.',
        suggestedFix: adaptive.pilar3.placeholder.replace(/^ej\.\s*/, ''),
        actionLabel: 'Incorporar Políticas Base',
        field: 'faqDetails',
      });
    }

    // 5. Pilar 4 (Reglas Inviolables)
    if (!wizardData.inviolableRules || wizardData.inviolableRules.length === 0) {
      list.push({
        id: 'gap-pilar4',
        pilar: 'Pilar 4: Reglas & Filtros',
        severity: 'recommended',
        severityLabel: 'Recomendado',
        title: 'Sin Reglas Inviolables de Protección Comercial',
        description: 'Faltan límites éticos y comerciales que la IA jamás deba cruzar (ej. no prometer resultados médicos sin consulta).',
        suggestedFix: vert.defaultRules?.[0] || 'No prometer resultados absolutos sin valoración previa presencial.',
        actionLabel: 'Activar Regla Inviolable',
        field: 'inviolableRule',
      });
    }

    return list;
  }, [wizardData.vertical, wizardData.brandTone, wizardData.brandbookDoc, wizardData.offerHook, wizardData.commercialProposalDoc, wizardData.pricingDetails, wizardData.pricingDoc, wizardData.faqDetails, wizardData.faqsDoc, wizardData.inviolableRules]);

  // Calculate dynamic RAG Health Score (0-100)
  const calculateHealthScore = () => {
    let score = 30;
    if (wizardData.brandTone || wizardData.brandbookDoc) score += 20;
    if (wizardData.enableCommercialProposal && (wizardData.offerHook || wizardData.commercialProposalDoc)) score += 20;
    if (wizardData.pricingDetails || wizardData.pricingDoc) score += 15;
    if (wizardData.faqDetails || wizardData.faqsDoc) score += 10;
    if (wizardData.inviolableRules && wizardData.inviolableRules.length >= 1) score += 5;
    return Math.min(score, 100);
  };

  const healthScore = calculateHealthScore();

  // 1-Click resolve deficiency suggested by AI
  const handleResolveDeficiency = (def) => {
    if (def.field === 'brandTone') {
      setWizardData((prev) => ({ ...prev, brandTone: def.suggestedFix }));
    } else if (def.field === 'offerHook') {
      setWizardData((prev) => ({ ...prev, offerHook: def.suggestedFix }));
    } else if (def.field === 'pricingDetails') {
      setWizardData((prev) => ({ ...prev, pricingDetails: def.suggestedFix }));
    } else if (def.field === 'faqDetails') {
      setWizardData((prev) => ({ ...prev, faqDetails: def.suggestedFix }));
    } else if (def.field === 'inviolableRule') {
      setWizardData((prev) => ({
        ...prev,
        inviolableRules: [...prev.inviolableRules, def.suggestedFix],
      }));
    }

    try {
      confetti({ particleCount: 30, spread: 60, colors: ['#E7F900', '#00f2fe', '#FFFFFF'] });
    } catch (e) {}

    triggerModal(
      'Sugerencia IA Aplicada con Éxito',
      `Se integró la directriz recomendada para <strong>${def.pilar}</strong>. El Health Score de tu base de conocimiento aumentó.`,
      () => {},
      'Excelente'
    );
  };

  // Switch vertical & update pillar defaults + suggestions + auto-suggest schedule
  const handleSelectVertical = (verticalId) => {
    const verticalConfig = BUSINESS_VERTICALS_CONFIG[verticalId] || BUSINESS_VERTICALS_CONFIG.gym_fitness;
    const isSalesFocused = verticalConfig.category === 'retail_ecom' || verticalConfig.category === 'realestate_auto';
    
    // Configuración sugerida de horarios según el giro comercial
    let suggestedSchedule = {
      calendarScheduleType: 'split',
      appointmentDuration: 45,
      shiftMorningStart: '09:00',
      shiftMorningEnd: '14:00',
      shiftAfternoonStart: '15:00',
      shiftAfternoonEnd: '19:00',
      breakStart: '14:00',
      breakEnd: '15:00',
      breakLabel: 'Receso de Turno',
      concurrencyLimit: 1,
      activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
    };

    if (verticalId === 'hospitality') {
      suggestedSchedule = {
        calendarScheduleType: 'hospitality',
        appointmentDuration: 90,
        shiftMorningStart: '13:00',
        shiftMorningEnd: '17:00',
        shiftAfternoonStart: '19:30',
        shiftAfternoonEnd: '23:30',
        breakStart: '17:00',
        breakEnd: '19:30',
        breakLabel: 'Mise en place / Salón',
        concurrencyLimit: 8,
        activeDays: ['martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
      };
    } else if (verticalId === 'creator') {
      suggestedSchedule = {
        calendarScheduleType: 'calls',
        appointmentDuration: 45,
        shiftMorningStart: '15:00',
        shiftMorningEnd: '18:00',
        shiftAfternoonStart: '15:00',
        shiftAfternoonEnd: '18:00',
        breakStart: '18:00',
        breakEnd: '19:00',
        breakLabel: 'Revisión de Contratos & Media Kit',
        concurrencyLimit: 1,
        activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
      };
    } else if (verticalId === 'b2b' || verticalId === 'legal_accounting') {
      suggestedSchedule = {
        calendarScheduleType: 'calls',
        appointmentDuration: 30,
        shiftMorningStart: '10:00',
        shiftMorningEnd: '13:30',
        shiftAfternoonStart: '15:00',
        shiftAfternoonEnd: '18:00',
        breakStart: '13:30',
        breakEnd: '15:00',
        breakLabel: 'Almuerzo Ejecutivo & Pipeline',
        concurrencyLimit: 1,
        activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
      };
    } else if (verticalId === 'gym_fitness' || verticalId === 'spa_beauty') {
      suggestedSchedule = {
        calendarScheduleType: 'single',
        appointmentDuration: 60,
        shiftMorningStart: '06:00',
        shiftMorningEnd: '22:00',
        shiftAfternoonStart: '14:00',
        shiftAfternoonEnd: '22:00',
        breakStart: '14:00',
        breakEnd: '14:00',
        breakLabel: 'Horario Corrido',
        concurrencyLimit: 15,
        activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
      };
    }

    setWizardData((prev) => ({
      ...prev,
      vertical: verticalId,
      businessGoal: isSalesFocused ? 'sales_direct' : verticalConfig.category === 'creators' ? 'marketing_branding' : 'appointments',
      enablePricingPillar: verticalId !== 'creator',
      enableCrisisPillar: true,
      inviolableRules: prev.inviolableRules,
      ...suggestedSchedule,
    }));

    setSuggestions(verticalConfig.proactiveSuggestions || []);
  };

  // 1-Click Master Briefing AI Ingestion Bridge (Real AI & Fallback)
  const handleAnalyzeMasterBriefing = async () => {
    setIsAnalyzingBriefing(true);
    setBriefingAnalyzed(false);
    briefingAbortRef.current?.abort();
    briefingAbortRef.current = new AbortController();

    try {
      const vert = BUSINESS_VERTICALS_CONFIG[wizardData.vertical] || BUSINESS_VERTICALS_CONFIG.gym_fitness;
      const adaptive = VERTICAL_PILLARS_ADAPTIVE_CONFIG[wizardData.vertical] || VERTICAL_PILLARS_ADAPTIVE_CONFIG.gym_fitness;
      
      const result = await BriefingBridge.analyze({
        file: masterFile,
        text: masterDocText,
        verticalConfig: vert,
        onProgress: (stage) => setBriefingAnalysisStage(stage),
        signal: briefingAbortRef.current.signal,
      });

      setIsAnalyzingBriefing(false);
      setBriefingAnalyzed(true);

      const fileObj = masterFile ? { name: masterFile.name, size: masterFile.size, type: masterFile.type } : null;

      // Auto-popular los 4 pilares + propuesta comercial + reglas con la extracción de IA
      setWizardData((prev) => ({
        ...prev,
        businessName: result.businessName || prev.businessName || `Centro de Excelencia (${vert.name.split(',')[0]})`,
        // Pilar 2: Brandbook & Tono
        brandTone: result.brandTone || adaptive?.pilar2?.placeholder?.replace(/^ej\.\s*/, '') || 'Profesional, Empático y Orientado a Resultados',
        brandbookDoc: (result.brandbookDoc && typeof result.brandbookDoc === 'object') ? result.brandbookDoc : (fileObj ? { name: `Brandbook_${fileObj.name}`, size: Math.round(fileObj.size * 0.42), type: 'text/markdown' } : { name: `Brandbook_${vert.id}.md`, size: 45000, type: 'text/markdown' }),
        archetype: result.archetype || vert.badge || 'El Asesor Experto',
        // Propuesta Comercial & Gancho
        offerHook: result.offerHook || adaptive?.offer?.placeholder?.replace(/^ej\.\s*/, '') || 'Diagnóstico de Valoración Sin Costo',
        offerCta: result.offerCta || 'Envía mensaje para apartar cupo',
        offerValidity: result.offerValidity || 'Válido por tiempo limitado',
        commercialProposalDoc: (result.commercialProposalDoc && typeof result.commercialProposalDoc === 'object') ? result.commercialProposalDoc : (fileObj || { name: `Oferta_${vert.id}.pdf`, size: 185000, type: 'application/pdf' }),
        // Pilar 1: Precios & Servicios
        pricingDetails: result.pricingDetails || adaptive?.pilar1?.placeholder?.replace(/^ej\.\s*/, '') || 'Tarifas base y opciones de pago diferido',
        pricingDoc: (result.pricingDoc && typeof result.pricingDoc === 'object') ? result.pricingDoc : (fileObj ? { name: `Tarifario_${fileObj.name}`, size: Math.round(fileObj.size * 0.75), type: 'application/pdf' } : { name: `Tarifario_${vert.id}.pdf`, size: 98000, type: 'application/pdf' }),
        // Pilar 3: Políticas & FAQs
        faqDetails: result.faqDetails || adaptive?.pilar3?.placeholder?.replace(/^ej\.\s*/, '') || 'Cancelaciones con 24h de anticipación',
        faqsDoc: (result.faqsDoc && typeof result.faqsDoc === 'object') ? result.faqsDoc : (fileObj ? { name: `FAQs_Reglamento_${fileObj.name}`, size: Math.round(fileObj.size * 0.38), type: 'text/markdown' } : { name: `FAQs_${vert.id}.md`, size: 52000, type: 'text/markdown' }),
        // Pilar 4 & Reglas
        enableCommercialProposal: true,
        enableCrisisPillar: true,
        inviolableRules: result.inviolableRules?.length > 0 ? result.inviolableRules : (vert.defaultRules || prev.inviolableRules),
      }));

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          colors: ['#E7F900', '#8A95B6', '#FFFFFF'],
        });
      } catch (e) {}

      // Llevar al usuario al Paso 2 para revisar lo auto-generado
      setCurrentStep(2);

      triggerModal(
        '¡Análisis Semántico con IA Completado!',
        `El documento y directrices fueron analizados para el giro "${vert.name}". La IA extrajo e indexó los datos clave en los 6 pasos del negocio. Ahora puedes revisar y afinar antes del despliegue.`,
        () => {},
        'Revisar Datos del Negocio'
      );
    } catch (err) {
      if (err.message === 'AbortError') return;
      console.error('[AI Bridge Error]:', err);
      setIsAnalyzingBriefing(false);
      setBriefingAnalysisStage('Error al conectar con el motor IA. Intenta de nuevo.');
    }
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

  // Handle Deploy New Swarm (Con Deploy Gate de Validación)
  const handleDeploySwarm = () => {
    // 1. Validar Nombre Comercial Obligatorio
    if (!wizardData.businessName || wizardData.businessName.trim() === '') {
      triggerModal(
        'Falta Nombre Comercial [Obligatorio]',
        'Para aprovisionar el nuevo negocio con aislamiento en base de datos (PostgreSQL RLS), es indispensable ingresar el Nombre Comercial del Negocio.',
        () => {
          setCurrentStep(2);
        },
        'Ingresar Nombre'
      );
      return;
    }

    // 2. Validar Teléfono de Escalación Humana Obligatorio (HITL)
    if (!wizardData.ownerPhone || wizardData.ownerPhone.trim() === '') {
      triggerModal(
        'Falta Teléfono de Escalación [Obligatorio]',
        'Por arquitectura de seguridad RAG, es estrictamente obligatorio registrar un Teléfono o WhatsApp de Escalación Humana (HITL) para transferir emergencias o quejas de clientes.',
        () => {
          setCurrentStep(2);
        },
        'Ingresar Teléfono'
      );
      return;
    }

    const activePillarsCount = 1 + (wizardData.enablePricingPillar ? 1 : 0) + (wizardData.enableCrisisPillar ? 1 : 0) + (wizardData.enableHistoryPillar ? 1 : 0);
    const vert = BUSINESS_VERTICALS_CONFIG[wizardData.vertical] || BUSINESS_VERTICALS_CONFIG.gym_fitness;

    const tenantSlug = (wizardData.microLandingCustomSlug || wizardData.businessName || 'nuevo-negocio')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const preset = resolveBrandPreset({ vertical: vert.id, id: tenantSlug });

    const newTenant = {
      id: tenantSlug,
      name: wizardData.businessName,
      shortName: wizardData.businessName,
      legalNameTaxId: wizardData.legalNameTaxId || 'Validación en trámite',
      vertical: vert.id,
      verticalKey: vert.id,
      verticalLabel: vert.name,
      canonicalId: vert.canonicalId,
      giro: vert.name,
      brandPurpose: wizardData.brandPurpose || (wizardData.offerHook ? `${wizardData.offerHook}. ${wizardData.offerCta || ''}`.trim() : (vert.conversionGoal || `Excelencia operativa y conversión directa para ${wizardData.businessName}.`)),
      toneOfVoice: wizardData.brandTone || preset.defaultTone || 'Profesional, empático y orientado a conversión',
      slaTarget: wizardData.hitlEscalationLatency?.includes('<') ? 5 : 15,
      brandColors: preset.colors,
      avatar: vert.avatar || preset.avatar || '🏢',
      connectedSocialNetworks: ['WHATSAPP', 'INSTAGRAM', 'FACEBOOK'],
      hasWebsite: wizardData.hasWebsite,
      websiteUrl: wizardData.hasWebsite ? wizardData.websiteUrl : null,
      ga4MeasurementId: wizardData.hasWebsite ? wizardData.ga4MeasurementId : null,
      metaPixelId: wizardData.metaPixelId,
      microLandingEnabled: wizardData.microLandingBillingPlan !== 'disabled',
      microLandingStatus:
        wizardData.microLandingBillingPlan === 'disabled'
          ? 'disabled'
          : wizardData.microLandingBillingPlan === 'active_monthly'
          ? 'active'
          : 'trial',
      microLandingTrialDaysLeft: wizardData.microLandingBillingPlan === 'trial_90d' ? 90 : 0,
      microLandingSlug: tenantSlug,
      microLandingUrl: `https://app.vectorinside.com/m/${tenantSlug}`,
      cacMax: `${wizardData.costPerQualifiedLead || 200} MXN`,
      ifv: `${healthScore}%`,
      capiStatus: 'Sincronizado',
      phone: wizardData.ownerPhone,
      email: wizardData.contactEmail,
      primaryContact: wizardData.primaryContact,
      isAiActive: true,
      crisisMode: false,

      // Pilares RAG & Oferta Comercial inyectados para Perfil de Marca
      commercialOffer: {
        hook: wizardData.offerHook,
        cta: wizardData.offerCta,
        validity: wizardData.offerValidity,
        hasProposalDoc: !!wizardData.commercialProposalDoc,
        proposalDocName: wizardData.commercialProposalDoc?.name || null,
      },
      inviolableRules: wizardData.inviolableRules || [],
      pillars: {
        pillar1: {
          enabled: wizardData.enablePricingPillar,
          cacMax: wizardData.cacMax,
          ltvExpected: wizardData.ltvExpected,
          minGrossMargin: wizardData.minGrossMargin,
          fileName: wizardData.pricingDoc?.name || null,
        },
        pillar2: {
          enabled: true,
          brandTone: wizardData.brandTone,
          archetype: wizardData.archetype,
          emojiPolicy: wizardData.emojiPolicy,
          inviolableRules: wizardData.inviolableRules || [],
          fileName: wizardData.brandbookDoc?.name || null,
        },
        pillar3: {
          enabled: wizardData.enableCrisisPillar,
          keywords: wizardData.crisisKeywords,
          latency: wizardData.hitlEscalationLatency,
          fileName: wizardData.faqsDoc?.name || null,
        },
        pillar4: {
          enabled: wizardData.enableHistoryPillar,
          context: wizardData.historicalContext,
          fileName: wizardData.historicalDoc?.name || null,
        },
      },
    };

    if (registerTenant) {
      registerTenant(newTenant, true);
    }
    if (switchTenantContext) {
      switchTenantContext(newTenant.id);
    }
    
    triggerModal(
      '¡Nuevo Negocio Desplegado con Éxito!',
      `El tenant "${wizardData.businessName}" ha sido configurado en el giro ${vert.name}. Se indexaron ${activePillarsCount} pilares con aislamiento PostgreSQL RLS y Score de Salud ${healthScore}/100. Servicio de Micro-Landing: ${newTenant.microLandingEnabled ? 'Activa' : 'Inactiva'}.`,
      () => {
        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#E7F900', '#8A95B6', '#FFFFFF'],
          });
        } catch (e) {}
        if (switchTenantContext) {
          switchTenantContext(newTenant.id);
        }
        setAdminViewMode('list');
        setCurrentStep(1);
      },
      'Finalizar y Ver Centro de Mando'
    );
  };

    const currentVerticalObj = BUSINESS_VERTICALS_CONFIG[wizardData.vertical] || BUSINESS_VERTICALS_CONFIG.gym_fitness;
  const currentPillarsAdaptive = VERTICAL_PILLARS_ADAPTIVE_CONFIG[wizardData.vertical] || VERTICAL_PILLARS_ADAPTIVE_CONFIG.gym_fitness;

  const shouldShowHeader = !hideHeader && !externalAdminViewMode;

  return (
    <div className={shouldShowHeader ? "p-6 lg:p-8 block animate-fade-in space-y-8" : "space-y-6 animate-fade-in"}>
      {/* Header Section (Oculto cuando está integrado en SystemConfigHub) */}
      {shouldShowHeader && (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              <Database className="w-3.5 h-3.5" />
              {adminViewMode === 'wizard' ? 'Aprovisionamiento RLS de Nuevo Tenant' : 'Taxonomía Universal de Giros RAG & Auto-Ingestión'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-main)]">
              {adminViewMode === 'wizard' ? (
                <>
                  Asistente de Alta <span className="text-neon">& Provisión de Negocio</span>
                </>
              ) : (
                <>
                  Base de Conocimiento <span className="text-neon">& Clasificación por Giro</span>
                </>
              )}
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              {adminViewMode === 'wizard'
                ? 'Paso a paso para integrar un nuevo cliente: Giro comercial (16 verticales), los 4 pilares y aislamiento en base de datos.'
                : 'Gimnasios, Escuelas, Redes de Networking, Clínicas, E-Commerce o Consultoría: La IA adapta los 4 pilares y sus reglas inviolables.'}
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
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono font-bold px-4 py-2.5 rounded-xl hover:border-neon transition-all flex items-center gap-2 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a Lista de Tenants</span>
                </button>
              )}
            </div>
          )}
        </header>
      )}

      {/* ========================================================================= */}
      {/* VISTA 1: ADMINISTRADOR — LISTA DE TENANTS & BANDEJA DE APROBACIÓN         */}
      {/* ========================================================================= */}
      {isAdmin && adminViewMode === 'list' && (
        <div className="space-y-6 animate-fade-in font-sans">
          {/* ========================================================================= */}
          {/* 1. BARRA DE TELEMETRÍA EJECUTIVA (KPIs CLAVE DEL ECOSISTEMA)              */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px] uppercase font-bold">
                <span>Total Empresas</span>
                <Building2 className="w-3.5 h-3.5 text-neon" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-heading font-black text-[var(--text-main)]">
                  {tenantEcosystemStats.total}
                </span>
                <span className="text-[10px] text-neon font-bold">Tenants Aislados</span>
              </div>
              <span className="text-[9px] text-[var(--text-muted)] block truncate">
                PostgreSQL RLS Multi-Tenant Activo
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px] uppercase font-bold">
                <span>Micro-Landings</span>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-heading font-black text-emerald-400">
                  {tenantEcosystemStats.activeCount}
                </span>
                <span className="text-[10px] text-emerald-500 font-bold">Activas</span>
                {tenantEcosystemStats.pausedCount > 0 && (
                  <span className="text-[10px] text-zinc-400 font-bold">
                    • {tenantEcosystemStats.pausedCount} Pausada{tenantEcosystemStats.pausedCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-[var(--text-muted)] block truncate">
                Tráfico público directo a WhatsApp
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px] uppercase font-bold">
                <span>Salud RAG Global</span>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-heading font-black text-cyan-400">94.2%</span>
                <span className="text-[10px] text-cyan-500 font-bold">Antifrágil</span>
              </div>
              <span className="text-[9px] text-[var(--text-muted)] block truncate">
                4/4 Pilares Indexados en Vector DB
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-panel)] border border-neon/30 space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px] uppercase font-bold">
                <span>Contexto Activo</span>
                <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-base shrink-0">{activeTenant?.avatar || '🏢'}</span>
                <span className="font-heading font-bold text-xs text-[var(--text-main)] truncate">
                  {activeTenant?.name || 'Clínica Odontológica'}
                </span>
              </div>
              <span className="text-[9px] text-neon font-bold font-mono block truncate">
                ID: {activeTenant?.id || 'dental'}
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. BARRA DE HERRAMIENTAS: BÚSQUEDA, FILTROS Y CAMBIO DE VISTA (TOOLBAR)   */}
          {/* ========================================================================= */}
          <div className="p-3 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm font-mono text-xs">
            {/* Buscador en Vivo */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tenantSearchQuery}
                onChange={(e) => setTenantSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, ID o giro comercial..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-neon outline-none text-xs transition-colors placeholder:text-[var(--text-muted)]"
              />
              {tenantSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTenantSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filtros de Estado y Switcher de Layout */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Filtro de Estado */}
              <div className="flex items-center p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px]">
                {[
                  { id: 'all', label: `Todos (${tenantEcosystemStats.total})` },
                  { id: 'active', label: `Activos (${tenantEcosystemStats.activeCount})` },
                  { id: 'suspended', label: `Pausados (${tenantEcosystemStats.pausedCount})` },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setTenantStatusFilter(st.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all font-bold ${
                      tenantStatusFilter === st.id
                        ? 'bg-neon text-black shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Switcher de Vista: Tabla Compacta vs Tarjetas */}
              <div className="flex items-center p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setTenantViewLayout('table')}
                  className={`p-1.5 px-2.5 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-bold ${
                    tenantViewLayout === 'table'
                      ? 'bg-neon text-black shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  title="Vista Tabla de Alta Densidad (Recomendada para 10+ clientes)"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tabla</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTenantViewLayout('cards')}
                  className={`p-1.5 px-2.5 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-bold ${
                    tenantViewLayout === 'cards'
                      ? 'bg-neon text-black shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  title="Vista Tarjetas Detalladas"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tarjetas</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. VISTA EN TABLA DE ALTA DENSIDAD (LINEAR / STRIPE STYLE)                */}
          {/* ========================================================================= */}
          {tenantViewLayout === 'table' && (
            <div className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--bg-card)]/50 text-[10px] font-bold uppercase text-[var(--text-muted)]">
                      <th className="py-3 px-4">Negocio / Tenant</th>
                      <th className="py-3 px-4">Giro Comercial</th>
                      <th className="py-3 px-4">Micro-Landing</th>
                      <th className="py-3 px-4">Salud RAG</th>
                      <th className="py-3 px-4">4 Pilares</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredTenantsList.map((tenant) => {
                      const isCurrentlyActive = activeTenant?.id === tenant.id;
                      const isExpanded = !!expandedTenantPillars[tenant.id];
                      const isLandingActive =
                        tenant.microLandingStatus !== 'suspended' &&
                        tenant.microLandingStatus !== 'disabled' &&
                        tenant.microLandingEnabled !== false;

                      return (
                        <React.Fragment key={tenant.id}>
                          <tr
                            className={`transition-colors group hover:bg-[var(--bg-card)]/40 ${
                              isCurrentlyActive ? 'bg-neon/5' : ''
                            }`}
                          >
                            {/* Negocio / Tenant */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5 min-w-[200px]">
                                <span className="text-xl shrink-0 p-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                                  {tenant.avatar || '🏢'}
                                </span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-heading font-bold text-xs text-[var(--text-main)] truncate">
                                      {tenant.name}
                                    </p>
                                    {isCurrentlyActive && (
                                      <span className="px-1.5 py-0.2 rounded bg-neon text-black font-black text-[8px] uppercase tracking-wider shrink-0">
                                        Activo
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-[var(--text-muted)] font-mono block truncate">
                                    ID: {tenant.id}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Giro Comercial */}
                            <td className="py-3 px-4">
                              <span className="inline-block px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] text-[var(--text-main)] font-medium max-w-[170px] truncate">
                                {tenant.giro || tenant.vertical || 'Servicios'}
                              </span>
                            </td>

                            {/* Micro-Landing */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2 min-w-[160px]">
                                {isLandingActive ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Activa
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-zinc-500/15 text-zinc-400 border border-zinc-500/30 text-[9px] font-bold inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                    Inactiva
                                  </span>
                                )}

                                <a
                                  href={`/m/${tenant.microLandingSlug || tenant.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-0.5 shrink-0"
                                  title="Abrir Micro-Landing"
                                >
                                  <span>/m/{tenant.microLandingSlug || tenant.id}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </td>

                            {/* Salud RAG */}
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                {tenant.ifv || '94%'} Antifrágil
                              </span>
                            </td>

                            {/* Botón de inspección de 4 Pilares */}
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => toggleTenantPillars(tenant.id)}
                                className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                                  isExpanded
                                    ? 'bg-neon/15 border-neon text-neon'
                                    : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-neon/40'
                                }`}
                              >
                                <span>4 Pilares</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </td>

                            {/* Acciones */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Botón Activar / Pausar Micro-Landing */}
                                {isLandingActive ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      toggleTenantMicroLanding(tenant.id, 'suspended');
                                      triggerModal(
                                        'Micro-Landing Pausada',
                                        `<div class="space-y-2">
                                          <p class="text-xs text-[var(--text-main)]">
                                            La micro-landing para <strong class="text-[var(--text-main)] font-bold">${tenant.name}</strong> ha sido pausada temporalmente.
                                          </p>
                                          <p class="text-[11px] text-[var(--text-muted)] font-mono">
                                            Los visitantes verán un aviso de mantenimiento temporal al visitar <code class="text-neon">/m/${tenant.microLandingSlug || tenant.id}</code>. Puedes reactivarla en cualquier momento con un solo clic.
                                          </p>
                                        </div>`,
                                        () => {},
                                        'Entendido'
                                      );
                                    }}
                                    className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-amber-400 hover:border-amber-500/40 transition-colors text-[10px] font-bold"
                                    title="Pausar Micro-Landing"
                                  >
                                    <Power className="w-3 h-3 text-amber-400" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      toggleTenantMicroLanding(tenant.id, 'active');
                                      triggerModal(
                                        'Micro-Landing Activada',
                                        `<div class="space-y-2">
                                          <p class="text-xs text-[var(--text-main)]">
                                            La micro-landing para <strong class="text-neon font-bold">${tenant.name}</strong> ha sido activada con éxito.
                                          </p>
                                          <p class="text-[11px] text-[var(--text-muted)] font-mono">
                                            La página vuelve a estar en línea y lista para recibir tráfico y canalizar prospectos de forma inmediata.
                                          </p>
                                        </div>`,
                                        () => {},
                                        'Aceptar'
                                      );
                                    }}
                                    className="p-1.5 rounded-lg bg-emerald-500 text-black font-bold text-[10px] hover:bg-emerald-400 transition-colors"
                                    title="Activar Micro-Landing"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                  </button>
                                )}

                                {/* Botón Establecer como Contexto Activo */}
                                {!isCurrentlyActive ? (
                                  <button
                                    type="button"
                                    onClick={() => switchTenantContext && switchTenantContext(tenant.id)}
                                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon hover:text-neon text-[10px] font-bold text-[var(--text-muted)] transition-all"
                                    title="Cambiar al contexto de este negocio en el panel"
                                  >
                                    <span>Activar</span>
                                  </button>
                                ) : (
                                  <a
                                    href="/profile"
                                    className="px-2.5 py-1 rounded-lg bg-neon/15 border border-neon/30 text-neon hover:bg-neon hover:text-black text-[10px] font-bold transition-all flex items-center gap-1"
                                    title="Editar perfil de marca y ADN RAG"
                                  >
                                    <span>Perfil</span>
                                    <ArrowRight className="w-2.5 h-2.5" />
                                  </a>
                                )}

                                {/* Eliminar Negocio */}
                                {isAdmin && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTenant(tenant);
                                    }}
                                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                    title={`Eliminar negocio ${tenant.name}`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* Acordeón Desplegable de los 4 Pilares RAG para esta fila */}
                          {isExpanded && (
                            <tr className="bg-[var(--bg-card)]/30 border-b border-[var(--border-color)]">
                              <td colSpan={6} className="p-4">
                                <div className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-neon/20 space-y-2.5">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-neon">
                                    <span className="flex items-center gap-1.5">
                                      <Database className="w-3.5 h-3.5" />
                                      Desglose de Memoria RAG: {tenant.name}
                                    </span>
                                    <a
                                      href="/profile"
                                      onClick={() => switchTenantContext && switchTenantContext(tenant.id)}
                                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                                    >
                                      <span>Ajustar en Perfil de Marca</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </a>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[10px]">
                                    <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                                      <span className="text-neon font-bold block mb-0.5">Pilar 1: Precios & CAC</span>
                                      <p className="text-[var(--text-main)] font-semibold truncate">
                                        CAC Máx: {tenant.cacMax || '$180 MXN'}
                                      </p>
                                      <span className="text-[9px] text-[var(--text-muted)]">Matriz Financiera</span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-cyan-500/30">
                                      <span className="text-cyan-400 font-bold block mb-0.5">Pilar 2: Brandbook & Tono</span>
                                      <p className="text-[var(--text-main)] font-semibold truncate">
                                        {tenant.toneOfVoice || 'Tono Profesional'}
                                      </p>
                                      <span className="text-[9px] text-[var(--text-muted)]">Identidad Activa</span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-amber-500/30">
                                      <span className="text-amber-400 font-bold block mb-0.5">Pilar 3: Crisis & FAQs</span>
                                      <p className="text-[var(--text-main)] font-semibold truncate">
                                        Escalación Sub-segundo
                                      </p>
                                      <span className="text-[9px] text-[var(--text-muted)]">HITL WhatsApp Activo</span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-purple-500/30">
                                      <span className="text-purple-400 font-bold block mb-0.5">Pilar 4: Histórico</span>
                                      <p className="text-[var(--text-main)] font-semibold truncate">
                                        Casos de Éxito & FAQs
                                      </p>
                                      <span className="text-[9px] text-[var(--text-muted)]">Memoria Retroactiva</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. VISTA EN TARJETAS DETALLADAS (MODERNA / EXPANDIDA)                      */}
          {/* ========================================================================= */}
          {tenantViewLayout === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTenantsList.map((tenant) => {
                const isCurrentlyActive = activeTenant?.id === tenant.id;
                const isExpanded = !!expandedTenantPillars[tenant.id];
                const isLandingActive =
                  tenant.microLandingStatus !== 'suspended' &&
                  tenant.microLandingStatus !== 'disabled' &&
                  tenant.microLandingEnabled !== false;

                return (
                  <div
                    key={tenant.id}
                    className={`p-4 sm:p-5 rounded-2xl bg-[var(--bg-panel)] border transition-all space-y-4 shadow-sm ${
                      isCurrentlyActive
                        ? 'border-neon/60 shadow-[0_0_15px_rgba(195,244,0,0.12)]'
                        : 'border-[var(--border-color)] hover:border-neon/30'
                    }`}
                  >
                    {/* Header de la Tarjeta */}
                    <div className="flex items-start justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="text-2xl p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shrink-0">
                          {tenant.avatar || '🏢'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[var(--text-main)] font-mono truncate">
                              {tenant.name}
                            </h4>
                            {isCurrentlyActive && (
                              <span className="px-1.5 py-0.2 rounded bg-neon text-black font-black text-[8px] uppercase tracking-wider shrink-0">
                                Activo
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono block truncate">
                            {tenant.giro || tenant.vertical || 'Vertical Activa'} • ID: {tenant.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                          {tenant.ifv || '94%'} Antifrágil
                        </span>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTenant(tenant);
                            }}
                            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                            title={`Eliminar negocio ${tenant.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Resumen Compacto de 4 Pilares con Toggle */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[var(--text-muted)] font-bold uppercase">Estado de Pilares RAG:</span>
                        <button
                          type="button"
                          onClick={() => toggleTenantPillars(tenant.id)}
                          className="text-neon hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>{isExpanded ? 'Ocultar' : 'Ver Detalles'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* 4 Mini-Pills */}
                      <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] font-mono font-bold">
                        <div className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-neon">
                          P1: Precios
                        </div>
                        <div className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-cyan-500/30 text-cyan-400">
                          P2: Brand
                        </div>
                        <div className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-amber-500/30 text-amber-400">
                          P3: Crisis
                        </div>
                        <div className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-purple-500/30 text-purple-400">
                          P4: Hist
                        </div>
                      </div>

                      {/* Contenido Expandido del Acordeón */}
                      {isExpanded && (
                        <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2 text-[10px] font-mono animate-fade-in mt-2">
                          <div className="flex justify-between border-b border-[var(--border-color)] pb-1.5">
                            <span className="text-[var(--text-muted)]">Pilar 1 (Rentabilidad):</span>
                            <span className="text-[var(--text-main)] font-bold">{tenant.cacMax || '$180 MXN'}</span>
                          </div>
                          <div className="flex justify-between border-b border-[var(--border-color)] pb-1.5">
                            <span className="text-[var(--text-muted)]">Pilar 2 (Tono de Voz):</span>
                            <span className="text-cyan-400 font-bold truncate max-w-[200px]">{tenant.toneOfVoice || 'Activo'}</span>
                          </div>
                          <div className="flex justify-between border-b border-[var(--border-color)] pb-1.5">
                            <span className="text-[var(--text-muted)]">Pilar 3 (HITL Crisis):</span>
                            <span className="text-amber-400 font-bold">Sub-segundo (&lt; 1.2s)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Pilar 4 (Histórico):</span>
                            <span className="text-purple-400 font-bold">Memoria Activa</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer de la Tarjeta con Micro-Landing y Acciones */}
                    <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        {isLandingActive ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Activa
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-zinc-500/15 text-zinc-400 border border-zinc-500/30 text-[9px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            Inactiva
                          </span>
                        )}

                        <a
                          href={`/m/${tenant.microLandingSlug || tenant.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 truncate max-w-[130px]"
                        >
                          <span>/m/{tenant.microLandingSlug || tenant.id}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Toggle Micro-Landing */}
                        {isLandingActive ? (
                          <button
                            type="button"
                            onClick={() => {
                              toggleTenantMicroLanding(tenant.id, 'suspended');
                              triggerModal(
                                'Micro-Landing Pausada',
                                `<div class="space-y-2">
                                  <p class="text-xs text-[var(--text-main)]">
                                    La micro-landing para <strong class="text-[var(--text-main)] font-bold">${tenant.name}</strong> ha sido pausada temporalmente.
                                  </p>
                                  <p class="text-[11px] text-[var(--text-muted)] font-mono">
                                    Los visitantes verán un aviso de mantenimiento temporal al visitar <code class="text-neon">/m/${tenant.microLandingSlug || tenant.id}</code>. Puedes reactivarla en cualquier momento con un solo clic.
                                  </p>
                                </div>`,
                                () => {},
                                'Entendido'
                              );
                            }}
                            className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                            title="Pausar Micro-Landing"
                          >
                            <Power className="w-3 h-3 text-amber-400" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              toggleTenantMicroLanding(tenant.id, 'active');
                              triggerModal(
                                'Micro-Landing Activada',
                                `<div class="space-y-2">
                                  <p class="text-xs text-[var(--text-main)]">
                                    La micro-landing para <strong class="text-neon font-bold">${tenant.name}</strong> ha sido activada con éxito.
                                  </p>
                                  <p class="text-[11px] text-[var(--text-muted)] font-mono">
                                    La página vuelve a estar en línea y lista para recibir tráfico y canalizar prospectos de forma inmediata.
                                  </p>
                                </div>`,
                                () => {},
                                'Aceptar'
                              );
                            }}
                            className="p-1.5 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
                            title="Activar Micro-Landing"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                          </button>
                        )}

                        {/* Switch / Ver Perfil */}
                        {!isCurrentlyActive ? (
                          <button
                            type="button"
                            onClick={() => switchTenantContext && switchTenantContext(tenant.id)}
                            className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-neon hover:text-neon text-[10px] font-bold text-[var(--text-muted)] transition-all"
                          >
                            Activar
                          </button>
                        ) : (
                          <a
                            href="/profile"
                            className="px-2.5 py-1 rounded-lg bg-neon/15 border border-neon/30 text-neon hover:bg-neon hover:text-black text-[10px] font-bold transition-all flex items-center gap-1"
                          >
                            <span>Perfil</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. ESTADO VACÍO (CUANDO NO HAY RESULTADOS DE BÚSQUEDA O FILTRO)           */}
          {/* ========================================================================= */}
          {filteredTenantsList.length === 0 && (
            <div className="p-8 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-center space-y-3 font-mono">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-2xl text-[var(--text-muted)]">
                🔍
              </div>
              <h4 className="text-sm font-bold text-[var(--text-main)]">
                No se encontraron negocios con los filtros actuales
              </h4>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                No hay coincidencias para "{tenantSearchQuery || tenantStatusFilter}". Prueba modificando tu término de búsqueda o limpia los filtros.
              </p>
              <button
                type="button"
                onClick={() => {
                  setTenantSearchQuery('');
                  setTenantStatusFilter('all');
                  setTenantVerticalFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-neon text-black font-bold text-xs uppercase hover:bg-[var(--neon-hover)] transition-all shadow-sm"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: ADMINISTRADOR — WIZARD DE ALTA CON TAXONOMÍA COMPLETA DE GIROS   */}
      {/* ========================================================================= */}
      {isAdmin && adminViewMode === 'wizard' && (
        <div className="vector-bg-card vector-border rounded-2xl p-4 sm:p-6 lg:p-8 w-full shadow-2xl space-y-8 animate-fade-in">

          {/* Stepper Header: Barra de Progreso y Estados Visuales (Stripe / Linear standard) */}
          <div className="space-y-4 border-b border-[var(--border-color)] pb-6 font-mono">
            {/* Barra superior de métrica de avance */}
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                <span className="font-bold text-[var(--text-main)]">Paso {currentStep} de 6:</span>
                <span className="text-neon font-black">
                  {currentStep === 1 && 'Giro Comercial & IA'}
                  {currentStep === 2 && 'Entidad & Web'}
                  {currentStep === 3 && 'Marketing & Tracking'}
                  {currentStep === 4 && 'Agenda & Horarios'}
                  {currentStep === 5 && 'Pilares RAG & Oferta'}
                  {currentStep === 6 && 'Reglas & Despliegue'}
                </span>
              </div>
              <span className="font-bold text-[var(--text-muted)] text-[11px]">
                {Math.round((currentStep / 6) * 100)}% Completado
              </span>
            </div>

            {/* Track de Progreso */}
            <div className="w-full h-1.5 bg-[var(--bg-panel)] rounded-full overflow-hidden border border-[var(--border-color)]">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-neon to-neon transition-all duration-300 shadow-[0_0_8px_rgba(231,249,0,0.5)]"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>

            {/* Stepper Tabs Interactivos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              {[
                { num: 1, title: 'Giro & IA', icon: Target },
                { num: 2, title: 'Entidad & Web', icon: Building2 },
                { num: 3, title: 'Marketing & Tracking', icon: Activity },
                { num: 4, title: 'Agenda & Horarios', icon: Clock },
                { num: 5, title: 'Pilares RAG', icon: Database },
                { num: 6, title: 'Reglas & Despliegue', icon: Shield },
              ].map((st) => {
                const isCurrent = currentStep === st.num;
                const isCompleted = currentStep > st.num;

                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => setCurrentStep(st.num)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 relative group ${
                      isCurrent
                        ? 'bg-neon/15 border-neon text-[var(--text-main)] shadow-neon-sm ring-1 ring-neon/40'
                        : isCompleted
                        ? 'bg-[var(--bg-panel)] border-emerald-500/40 text-[var(--text-main)] hover:border-emerald-400'
                        : 'bg-[var(--bg-panel)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                        isCurrent
                          ? 'bg-neon text-black shadow-[0_0_8px_rgba(231,249,0,0.6)]'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.num}
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] text-[var(--text-muted)] font-bold uppercase truncate">
                        {isCompleted ? 'Listo' : `Paso ${st.num}`}
                      </span>
                      <span
                        className={`block text-xs font-bold truncate ${
                          isCurrent ? 'text-neon' : isCompleted ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 1: Giro Comercial del Negocio & Acelerador con IA       */}
          {/* ============================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 text-[10px] font-mono font-bold uppercase">
                        Paso 1 de 6
                      </span>
                      <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                        <Target className="w-5 h-5 text-neon" />
                        <span>Giro Comercial del Negocio & Acelerador con IA</span>
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30">
                      {filteredVerticals.length} disponibles
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                    Selecciona el sector comercial de tu negocio para calibrar automáticamente arquetipo de ventas, metas y directrices. Opcionalmente, carga tu documento maestro para auto-llenar los 6 pasos.
                  </p>
                </div>

                {/* Controls: Search Bar + View Toggle */}
                <div className="flex items-center gap-2 self-stretch lg:self-auto">
                  <div className="relative flex-1 lg:w-64">
                    <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Buscar giro (ej. gym, clínica, b2b)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl pl-9 pr-8 py-2 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-neon outline-none font-mono transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* View Mode Toggle (Compact vs Detailed) */}
                  <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border-color)] p-0.5 rounded-xl shrink-0">
                    <button
                      type="button"
                      onClick={() => setVerticalViewMode('compact')}
                      title="Vista Compacta (Rápida y práctica)"
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                        verticalViewMode === 'compact'
                          ? 'bg-neon text-black shadow-neon-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Compacto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerticalViewMode('detailed')}
                      title="Vista Detallada (Explicaciones completas)"
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                        verticalViewMode === 'detailed'
                          ? 'bg-neon text-black shadow-neon-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Detallado</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Taxonomy Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {[
                  { id: 'all', label: 'Todos los Giros', icon: Layers },
                  { id: 'fitness_health', label: 'Salud & Bienestar', icon: HeartPulse },
                  { id: 'education', label: 'Educación & Coaching', icon: GraduationCap },
                  { id: 'networking', label: 'Networking & Comunidades', icon: Users },
                  { id: 'retail_ecom', label: 'Comercio & Retail', icon: ShoppingBag },
                  { id: 'hospitality', label: 'Gastronomía & Hotelería', icon: Utensils },
                  { id: 'b2b_services', label: 'Servicios B2B & Legal', icon: Briefcase },
                  { id: 'realestate_auto', label: 'Inmobiliaria & Autos', icon: Home },
                  { id: 'creators', label: 'Creadores & Marca Personal', icon: Video },
                ].map((cat) => {
                  const IconComponent = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        isSelected
                          ? 'bg-neon text-black shadow-neon-sm'
                          : 'bg-[var(--bg-panel)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                      }`}
                    >
                      <IconComponent className="w-3 h-3" />
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected
                            ? 'bg-black/20 text-black'
                            : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Empty state for search */}
              {filteredVerticals.length === 0 && (
                <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-center space-y-3 font-mono">
                  <p className="text-sm font-bold text-[var(--text-main)]">
                    No se encontraron giros que coincidan con "{searchQuery}"
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-neon text-black font-bold text-xs font-mono hover:bg-[var(--neon-hover)] transition-all"
                  >
                    Restablecer Filtros y Ver Todos los Giros
                  </button>
                </div>
              )}

              {/* COMPACT VIEW MODE: Sleek tiles up to 6 columns */}
              {verticalViewMode === 'compact' && filteredVerticals.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5">
                  {filteredVerticals.map((vert) => {
                    const isSelected = wizardData.vertical === vert.id;
                    return (
                      <button
                        key={vert.id}
                        type="button"
                        onClick={() => handleSelectVertical(vert.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between group relative ${
                          isSelected
                            ? 'bg-[var(--bg-panel)] border-2 border-brand-primary shadow-sm ring-1 ring-brand-primary/40'
                            : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-brand-primary/50 hover:bg-[var(--bg-panel)]/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{vert.avatar}</span>
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                                isSelected
                                  ? 'bg-neon/20 text-neon border border-neon/40'
                                  : 'bg-[var(--bg-panel)] text-[var(--text-muted)]'
                              }`}
                            >
                              {vert.canonicalId || vert.id}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-[var(--text-main)] font-mono leading-snug line-clamp-2">
                            {vert.name}
                          </h4>
                        </div>
                        <div className="pt-2 border-t border-[var(--border-color)]/60 mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-[var(--text-muted)] font-mono truncate max-w-[130px]">
                            {vert.badge}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* DETAILED VIEW MODE: 3-column cards with conversionGoal and description */}
              {verticalViewMode === 'detailed' && filteredVerticals.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredVerticals.map((vert) => {
                    const isSelected = wizardData.vertical === vert.id;
                    return (
                      <button
                        key={vert.id}
                        type="button"
                        onClick={() => handleSelectVertical(vert.id)}
                        className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between group relative space-y-3 ${
                          isSelected
                            ? 'bg-[var(--bg-panel)] border-2 border-brand-primary shadow-sm ring-1 ring-brand-primary/40'
                            : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-brand-primary/50 hover:bg-[var(--bg-panel)]/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl">{vert.avatar}</span>
                              <div>
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 uppercase">
                                  {vert.canonicalId || vert.id}
                                </span>
                                <h4 className="text-xs font-bold text-[var(--text-main)] font-mono leading-snug mt-1">
                                  {vert.name}
                                </h4>
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed font-sans">
                            {vert.description}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[var(--border-color)]/60 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-neon font-bold flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {vert.badge}
                          </span>
                          <span className="text-[var(--text-muted)]">
                            {vert.defaultRules?.length || 3} reglas base
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Compact Active Vertical Calibration Indicator */}
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentVerticalObj.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--text-main)]">{currentVerticalObj.name}</span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30">
                        {currentVerticalObj.canonicalId}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Giro Activo
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      Meta de conversión: <strong className="text-neon">{currentVerticalObj.conversionGoal}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-panel)] border border-neon/30 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-neon" />
                  <span className="text-[11px] font-bold text-[var(--text-main)]">RAG Score Calibrado:</span>
                  <span className="text-xs font-black text-neon">{healthScore}%</span>
                </div>
              </div>

              {/* Acelerador Opcional 1-Click con IA */}
              <div className="p-5 rounded-2xl bg-[var(--bg-card)] border-2 border-brand-primary/30 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-neon" />
                    <span className="text-xs font-mono font-black uppercase text-[var(--text-main)]">
                      Acelerador 1-Click con IA (Opcional)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-bold uppercase self-start sm:self-auto">
                    DeepSeek R1 Semantic Parser
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)] font-mono">
                  ¿Tienes un Brief, Brandbook, Catálogo o Documento Maestro (.pdf, .docx, .md)? Súbelo o pega el texto para pre-llenar los 6 pasos automáticamente.
                </p>

                <div className="border-2 border-dashed border-[var(--border-color)] hover:border-brand-primary rounded-2xl p-5 text-center space-y-2.5 bg-[var(--bg-card-subtle)] transition-all">
                  <div className="w-10 h-10 mx-auto rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center text-neon">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-main)] font-mono">
                      Arrastra tu Master Briefing, Catálogo o Brandbook aquí
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                      Soporta PDF, Word (.docx), Markdown (.md) y archivos de texto plano
                    </p>
                  </div>
                  <input
                    type="file"
                    className="text-xs text-[var(--text-muted)] file:mr-3 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neon file:text-black hover:file:bg-[var(--neon-hover)] cursor-pointer"
                    accept=".pdf,.docx,.doc,.txt,.md"
                    onChange={(e) => setMasterFile(e.target.files?.[0] || null)}
                  />
                  {masterFile && (
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 font-bold pt-1">
                      <FileCheck className="w-4 h-4" />
                      <span>Archivo listo para IA: {masterFile.name} ({(masterFile.size / 1024).toFixed(1)} KB)</span>
                      <button
                        type="button"
                        onClick={() => setMasterFile(null)}
                        className="text-red-400 hover:text-red-300 ml-2"
                        title="Quitar archivo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[var(--text-muted)] block">
                    O pega el texto del brief / instrucciones aquí:
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Pega la información de ${currentVerticalObj.name}, precios, reglas inviolables, tono de voz o propuesta comercial...`}
                    value={masterDocText}
                    onChange={(e) => setMasterDocText(e.target.value)}
                    className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                      Auto-extracción semántica con DeepSeek
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
                        <span>Los 4 pilares y datos fueron auto-configurados con éxito para {currentVerticalObj.name}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isAnalyzingBriefing}
                    onClick={handleAnalyzeMasterBriefing}
                    className="bg-neon text-black font-mono font-black text-xs px-5 py-2.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAnalyzingBriefing ? 'Analizando...' : 'Auto-Clasificar con IA'}</span>
                  </button>
                </div>
              </div>

              {/* Botón de continuación al Paso 2 */}
              <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                >
                  <span>Siguiente: Entidad del Negocio & Web</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

              {/* PASO 1: Entidad del Negocio & Presencia Web                   */}
              {/* ============================================================= */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 text-[10px] font-mono font-bold uppercase">
                          Paso 2 de 6
                        </span>
                        <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-neon" />
                          <span>Entidad del Negocio & Presencia Web</span>
                        </h3>
                      </div>

                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                      Giro seleccionado: <strong className="text-neon">{currentVerticalObj.name}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div>
                      <label className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-main)] mb-1">
                        <span>Nombre Comercial del Negocio</span>
                        <span className="text-[10px] text-neon uppercase font-bold">[Obligatorio]</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ej. Clínica Dental Sonrisas / Urban Sneaks"
                        value={wizardData.businessName}
                        onChange={(e) => setWizardData({ ...wizardData, businessName: e.target.value })}
                        className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-main)] mb-1">
                        <span>Razón Social & RFC (Tax ID)</span>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase">[Opcional]</span>
                      </label>
                      <input
                        type="text"
                        placeholder="ej. Sonrisas Dentales S.A. de C.V. / SDS120304XYZ"
                        value={wizardData.legalNameTaxId}
                        onChange={(e) => setWizardData({ ...wizardData, legalNameTaxId: e.target.value })}
                        className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-main)] mb-1">
                        <span>Contacto Principal / Administrador</span>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase">[Recomendado]</span>
                      </label>
                      <input
                        type="text"
                        placeholder="ej. Dr. Alejandro Silva"
                        value={wizardData.primaryContact}
                        onChange={(e) => setWizardData({ ...wizardData, primaryContact: e.target.value })}
                        className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-main)] mb-1">
                        <span>Teléfono WhatsApp / Escalación Humana (HITL)</span>
                        <span className="text-[10px] text-neon uppercase font-bold">[Obligatorio]</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="ej. +52 55 9876 5432"
                        value={wizardData.ownerPhone}
                        onChange={(e) => setWizardData({ ...wizardData, ownerPhone: e.target.value })}
                        className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* ESTRATEGIA DE CONVERSIÓN & PRESENCIA WEB */}
                  <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                      <span className="text-xs font-mono font-bold uppercase text-[var(--text-main)] flex items-center gap-2">
                        <Zap className="w-4 h-4 text-neon" />
                        Estrategia Digital: Micro-Landing de Conversión & Sitio Web
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 font-bold uppercase">
                        ✦ Micro-Landing Incluida Siempre
                      </span>
                    </div>

                    {/* Micro-Landing Universal Card */}
                    <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-neon/30 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-neon/15 border border-neon/30 flex items-center justify-center text-neon shrink-0">
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-mono font-bold text-[var(--text-main)]">
                                Micro-Landing Universal `/m/[slug]`
                              </h4>
                              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                ● Embudo de Captación
                              </span>
                            </div>
                            <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                              URL Pública: app.vectorinside.com/m/
                              <span className="text-neon font-bold">
                                {(wizardData.microLandingCustomSlug || wizardData.businessName || 'tu-negocio').toLowerCase().replace(/[^a-z0-9]/g, '-') || 'demo'}
                              </span>
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold uppercase border border-emerald-500/30">
                          ● Activa por Defecto
                        </span>
                      </div>

                      {/* Aviso Informativo & Cortesía 3 Meses */}
                      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                              ✦ Micro-Landing Incluida
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                              Activo
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                            Tu Micro-Landing se aprovisiona automáticamente con este registro para recibir tráfico de pauta y canalizarlo directamente a WhatsApp.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const slug = (wizardData.microLandingCustomSlug || wizardData.businessName || 'tu-negocio').toLowerCase().replace(/[^a-z0-9]/g, '-') || 'demo';
                            navigator.clipboard?.writeText(`https://app.vectorinside.com/m/${slug}`);
                            alert(`Enlace copiado: https://app.vectorinside.com/m/${slug}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] text-[10px] text-[var(--text-main)] hover:border-neon hover:text-neon transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
                        >
                          <Copy className="w-3 h-3" />
                          Copiar Enlace
                        </button>
                      </div>

                      {wizardData.microLandingBillingPlan !== 'disabled' && (
                        <div className="pt-2 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center gap-3 text-xs font-mono">
                          <label className="text-[10px] text-[var(--text-muted)] shrink-0">
                            Slug Personalizado (Opcional):
                          </label>
                          <div className="flex items-center w-full">
                            <span className="px-2.5 py-1.5 rounded-l-lg bg-[var(--bg-card)] border border-r-0 border-[var(--border-color)] text-[10px] text-[var(--text-muted)]">
                              app.vectorinside.com/m/
                            </span>
                            <input
                              type="text"
                              placeholder="ej. sonrisas-polanco"
                              value={wizardData.microLandingCustomSlug}
                              onChange={(e) => setWizardData({ ...wizardData, microLandingCustomSlug: e.target.value })}
                              className="flex-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-r-lg p-1.5 text-xs text-[var(--text-main)] focus:border-neon outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Selector de Sitio Web Oficial */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <label className="text-xs font-mono font-bold text-[var(--text-main)]">
                          ¿El Negocio Cuenta con Sitio Web Oficial Corporativo?
                        </label>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {wizardData.hasWebsite
                            ? 'Conectaremos tu web para SEO y mantendremos la Micro-Landing para Ads'
                            : 'La Micro-Landing será su presencia web principal'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setWizardData({ ...wizardData, hasWebsite: true })}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            wizardData.hasWebsite
                              ? 'bg-neon/10 border-neon text-[var(--text-main)] shadow-neon-sm'
                              : 'bg-[var(--bg-panel)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-brand-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                              <span>🌐 SÍ, Tengo Sitio Web Oficial</span>
                            </span>
                            {wizardData.hasWebsite && <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />}
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono">
                            Conecta tu URL oficial para SEO/GA4. Tu Micro-Landing se mantiene activa como embudo de pauta publicitaria.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setWizardData({ ...wizardData, hasWebsite: false })}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            !wizardData.hasWebsite
                              ? 'bg-neon/10 border-neon text-[var(--text-main)] shadow-neon-sm'
                              : 'bg-[var(--bg-panel)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-brand-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                              <span>💬 NO, Operación Directa a WhatsApp</span>
                            </span>
                            {!wizardData.hasWebsite && <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />}
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono">
                            La Micro-Landing autogenerada fungirá como tu página web principal con Meta CAPI y catálogo directo.
                          </p>
                        </button>
                      </div>

                      {wizardData.hasWebsite && (
                        <div className="pt-1 animate-fade-in">
                          <label className="text-[10px] text-[var(--text-muted)] font-mono block mb-1">
                            URL del Sitio Web Oficial
                          </label>
                          <input
                            type="url"
                            placeholder="https://minegocio.com"
                            value={wizardData.websiteUrl}
                            onChange={(e) => setWizardData({ ...wizardData, websiteUrl: e.target.value })}
                            className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-xs text-[var(--text-main)] focus:border-neon outline-none font-mono"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                    >
                      <span>Siguiente: Marketing & Tracking</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {/* PASO 2: Marketing, Tracking & Modelo de Cobro                 */}
              {/* ============================================================= */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 text-[10px] font-mono font-bold uppercase">
                          Paso 3 de 6
                        </span>
                        <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                          <Activity className="w-5 h-5 text-neon" />
                          <span>Marketing, Tracking & Modelo Comercial</span>
                        </h3>
                      </div>

                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                      Configuración de analítica, atribución de anuncios y costo por lead calificado.
                    </p>
                  </div>

                  {/* Telemetría y Píxeles */}
                  <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                      <span className="text-xs font-mono font-bold uppercase text-[var(--text-main)] flex items-center gap-2">
                        <Activity className="w-4 h-4 text-neon" />
                        Telemetría y Píxeles de Conversión
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon font-bold uppercase">
                        Medición de Anuncios
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-[var(--text-muted)] font-bold block">
                            Google Analytics 4 Measurement ID
                          </label>
                          <span className="text-[9px] text-[var(--text-muted)] font-bold">$0 USD</span>
                        </div>
                        <input
                          type="text"
                          placeholder="ej. G-ABC123XYZ"
                          value={wizardData.ga4MeasurementId || ''}
                          onChange={(e) => setWizardData({ ...wizardData, ga4MeasurementId: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                        />
                        <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                          Mide visitas a tu landing y sitio web sin costo en Google Analytics 4.
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-[var(--text-muted)] font-bold block">
                            Meta Pixel ID (Dataset ID)
                          </label>
                          <span className="text-[9px] text-neon font-bold">Recomendado</span>
                        </div>
                        <input
                          type="text"
                          placeholder="ej. 123456789012345"
                          value={wizardData.metaPixelId || ''}
                          onChange={(e) => setWizardData({ ...wizardData, metaPixelId: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                        />
                        <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                          Rastrea visitas y eventos de conversión desde tus campañas en Meta Ads.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Modelo de Cobro por Lead */}
                  <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                      <span className="text-xs font-mono font-bold uppercase text-[var(--text-main)] flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        Esquema de Cobro & Presupuesto Publicitario
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold font-mono">
                        Pay-Per-Qualified-Lead
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <label className="block text-xs font-mono font-bold text-[var(--text-main)] mb-1">
                          Costo por Lead Calificado (MXN)
                        </label>
                        <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                          <span className="text-[var(--text-main)] font-bold">$350.00 MXN / Lead Calificado</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neon/15 text-neon font-black">
                            4/4 Criterios AND
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                          Solo se factura cuando el lead cumple con todos los filtros de calificación comercial.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-[var(--text-main)] mb-1">
                          Presupuesto Publicitario Mensual Estimado (Meta Ads)
                        </label>
                        <input
                          type="number"
                          placeholder="1500"
                          value={wizardData.monthlyAdBudget || ""}
                          onChange={(e) => setWizardData({ ...wizardData, monthlyAdBudget: Number(e.target.value) })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                        />
                        <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                          Inversión mínima sugerida para optimizar el algoritmo de Meta CAPI.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs px-4 py-2.5 rounded-xl text-[var(--text-main)] font-mono flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                    >
                      <span>Siguiente: Agenda & Horarios</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {/* PASO 3: Agenda & Horarios (SECCIÓN DEDICADA 100% LIMPIA)       */}
              {/* ============================================================= */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 text-[10px] font-mono font-bold uppercase">
                          Paso 4 de 6
                        </span>
                        <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                          <Clock className="w-5 h-5 text-neon" />
                          <span>Agenda & Disponibilidad Comercial</span>
                        </h3>
                      </div>

                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                      Define los turnos de atención y la sincronización con Google Calendar. La atención del bot opera <strong className="text-neon">24/7/365</strong>.
                    </p>
                  </div>

                  {/* Sincronización Google Calendar */}
                  <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
                    <label className="block text-xs font-mono font-bold text-[var(--text-main)] mb-1">
                      Google Calendar ID (Master Agenda para Citas)
                    </label>
                    <input
                      type="text"
                      placeholder="ej. c_tenant@group.calendar.google.com"
                      value={wizardData.googleCalendarId}
                      onChange={(e) => setWizardData({ ...wizardData, googleCalendarId: e.target.value })}
                      className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                    />
                    <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                      Introduce el ID del calendario de Google en el que se agendarán automáticamente las citas verificadas.
                    </span>
                  </div>

                  {/* Agenda Inteligente Auto-Calibrada según Giro Comercial */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-neon/30 space-y-4">
                    {/* Tarjeta Ejecutiva Resumida */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neon/15 border border-neon/30 flex items-center justify-center text-neon shrink-0 mt-0.5">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-xs font-black font-mono text-[var(--text-main)] uppercase tracking-wide">
                              Agenda & Disponibilidad Comercial
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                              ● Auto-calibrado para {currentVerticalObj.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                              ⚡ Bot Activo 24/7 (Ventas & Leads Non-Stop)
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono mt-1 leading-relaxed">
                            <span className="text-[var(--text-main)] font-bold">Atención IA:</span> Opera 24/7/365 en WhatsApp y Web. Este horario solo restringe las citas presenciales de Google Calendar y la derivación a personal humano.
                          </p>
                          {/* Resumen dinámico libre de todos los turnos activos */}
                          <div className="text-[11px] font-mono mt-1 text-[var(--text-muted)] space-y-0.5">
                            <p>
                              <strong className="text-[var(--text-main)]">
                                {(wizardData.activeDays || []).length} días activos
                              </strong>{' '}
                              ({(wizardData.activeDays || []).map((d) => d.slice(0, 3).toUpperCase()).join(', ') || 'L-S'}) ·{' '}
                              <strong className="text-neon">
                                {((wizardData.shifts && wizardData.shifts.length > 0)
                                  ? wizardData.shifts
                                  : [
                                      { name: 'T1', start: wizardData.shiftMorningStart || '08:00', end: wizardData.shiftMorningEnd || '13:30' },
                                      ...(wizardData.shiftAfternoonStart
                                        ? [{ name: 'T2', start: wizardData.shiftAfternoonStart, end: wizardData.shiftAfternoonEnd || '18:00' }]
                                        : []),
                                    ]
                                )
                                  .map((s) => `${s.start} a ${s.end}`)
                                  .join(' · ') || '08:00 a 18:00'}
                              </strong>{' '}
                              · Citas de <span className="text-emerald-400 font-bold">{wizardData.appointmentDuration || 30} min</span> · Capacidad: <span className="text-cyan-400 font-bold">{wizardData.concurrencyLimit || 1}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Editor Libre y Sin Restricciones (Siempre Visible) */}
                    <div className="pt-4 border-t border-[var(--border-color)] space-y-5 text-xs font-mono">
                      {/* 1. Selector Libre de Días Hábiles */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-bold text-[var(--text-main)]">
                            1. Días Hábiles de Atención
                          </label>
                          <div className="flex items-center gap-1 text-[10px]">
                            <button
                              type="button"
                              onClick={() =>
                                setWizardData({
                                  ...wizardData,
                                  activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
                                })
                              }
                              className="px-2 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-neon"
                            >
                              L-V
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setWizardData({
                                  ...wizardData,
                                  activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
                                })
                              }
                              className="px-2 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-neon"
                            >
                              L-S
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setWizardData({
                                  ...wizardData,
                                  activeDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
                                })
                              }
                              className="px-2 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-neon"
                            >
                              Todos
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1.5">
                          {[
                            { id: 'lunes', short: 'L', full: 'Lunes' },
                            { id: 'martes', short: 'M', full: 'Martes' },
                            { id: 'miercoles', short: 'X', full: 'Miércoles' },
                            { id: 'jueves', short: 'J', full: 'Jueves' },
                            { id: 'viernes', short: 'V', full: 'Viernes' },
                            { id: 'sabado', short: 'S', full: 'Sábado' },
                            { id: 'domingo', short: 'D', full: 'Domingo' },
                          ].map((day) => {
                            const currentDays = wizardData.activeDays || [
                              'lunes',
                              'martes',
                              'miercoles',
                              'jueves',
                              'viernes',
                              'sabado',
                            ];
                            const isActive = currentDays.includes(day.id);
                            return (
                              <button
                                key={day.id}
                                type="button"
                                onClick={() => {
                                  const nextDays = isActive
                                    ? currentDays.filter((d) => d !== day.id)
                                    : [...currentDays, day.id];
                                  setWizardData({
                                    ...wizardData,
                                    activeDays: nextDays.length > 0 ? nextDays : [day.id],
                                  });
                                }}
                                className={`py-1.5 rounded-lg border text-center font-bold transition-all text-xs ${
                                  isActive
                                    ? 'bg-neon/15 border-neon text-neon'
                                    : 'bg-[var(--bg-panel)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-neon/40'
                                }`}
                                title={day.full}
                              >
                                {day.short}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Turnos y Franjas Horarias Libres */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-[var(--text-main)] flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-neon" />
                            2. Turnos y Franjas Horarias (Agrega o Quita Libremente)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const currentShifts = (wizardData.shifts && wizardData.shifts.length > 0)
                                ? wizardData.shifts
                                : [
                                    { id: '1', name: 'Turno 1 / Matutino', start: wizardData.shiftMorningStart || '08:00', end: wizardData.shiftMorningEnd || '13:30' },
                                    ...(wizardData.shiftAfternoonStart
                                      ? [{ id: '2', name: 'Turno 2 / Vespertino', start: wizardData.shiftAfternoonStart, end: wizardData.shiftAfternoonEnd || '18:00' }]
                                      : []),
                                  ];
                              const nextNum = currentShifts.length + 1;
                              const newShift = {
                                id: String(Date.now()),
                                name: `Turno ${nextNum}`,
                                start: '18:30',
                                end: '22:00',
                              };
                              const updated = [...currentShifts, newShift];
                              setWizardData({
                                ...wizardData,
                                shifts: updated,
                                shiftMorningStart: updated[0]?.start || '08:00',
                                shiftMorningEnd: updated[0]?.end || '14:00',
                                shiftAfternoonStart: updated[1]?.start || '',
                                shiftAfternoonEnd: updated[1]?.end || '',
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-neon/10 hover:bg-neon/20 border border-neon/30 text-[10px] font-bold text-neon transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            + Agregar Turno
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {((wizardData.shifts && wizardData.shifts.length > 0)
                            ? wizardData.shifts
                            : [
                                { id: '1', name: 'Turno 1 / Matutino', start: wizardData.shiftMorningStart || '08:00', end: wizardData.shiftMorningEnd || '13:30' },
                                ...(wizardData.shiftAfternoonStart
                                  ? [{ id: '2', name: 'Turno 2 / Vespertino', start: wizardData.shiftAfternoonStart, end: wizardData.shiftAfternoonEnd || '18:00' }]
                                  : []),
                              ]
                          ).map((shift, idx) => (
                            <div
                              key={shift.id || idx}
                              className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-2 relative group"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  value={shift.name}
                                  onChange={(e) => {
                                    const currentShifts = (wizardData.shifts && wizardData.shifts.length > 0)
                                      ? wizardData.shifts
                                      : [
                                          { id: '1', name: 'Turno 1 / Matutino', start: wizardData.shiftMorningStart || '08:00', end: wizardData.shiftMorningEnd || '13:30' },
                                          ...(wizardData.shiftAfternoonStart
                                            ? [{ id: '2', name: 'Turno 2 / Vespertino', start: wizardData.shiftAfternoonStart, end: wizardData.shiftAfternoonEnd || '18:00' }]
                                            : []),
                                        ];
                                    const updated = currentShifts.map((s, i) =>
                                      i === idx ? { ...s, name: e.target.value } : s
                                    );
                                    setWizardData({
                                      ...wizardData,
                                      shifts: updated,
                                    });
                                  }}
                                  placeholder={`Turno ${idx + 1}`}
                                  className="bg-transparent border-b border-transparent hover:border-[var(--border-color)] focus:border-neon text-[11px] font-bold text-amber-400 outline-none w-full"
                                />

                                {((wizardData.shifts && wizardData.shifts.length > 0) ? wizardData.shifts.length : 2) > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentShifts = (wizardData.shifts && wizardData.shifts.length > 0)
                                        ? wizardData.shifts
                                        : [
                                            { id: '1', name: 'Turno 1 / Matutino', start: wizardData.shiftMorningStart || '08:00', end: wizardData.shiftMorningEnd || '13:30' },
                                            ...(wizardData.shiftAfternoonStart
                                              ? [{ id: '2', name: 'Turno 2 / Vespertino', start: wizardData.shiftAfternoonStart, end: wizardData.shiftAfternoonEnd || '18:00' }]
                                              : []),
                                          ];
                                      const updated = currentShifts.filter((_, i) => i !== idx);
                                      setWizardData({
                                        ...wizardData,
                                        shifts: updated,
                                        shiftMorningStart: updated[0]?.start || '08:00',
                                        shiftMorningEnd: updated[0]?.end || '14:00',
                                        shiftAfternoonStart: updated[1]?.start || '',
                                        shiftAfternoonEnd: updated[1]?.end || '',
                                      });
                                    }}
                                    className="p-1 rounded text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                    title="Eliminar este turno"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-[9px] text-[var(--text-muted)] block mb-0.5">Inicio</span>
                                  <input
                                    type="time"
                                    value={shift.start || '09:00'}
                                    onClick={(e) => {
                                      try {
                                        if (typeof e.target.showPicker === 'function') {
                                          e.target.showPicker();
                                        }
                                      } catch (err) {}
                                    }}
                                    onChange={(e) => {
                                      const currentShifts = (wizardData.shifts && wizardData.shifts.length > 0)
                                        ? wizardData.shifts
                                        : [
                                            { id: '1', name: 'Turno 1 / Matutino', start: wizardData.shiftMorningStart || '08:00', end: wizardData.shiftMorningEnd || '13:30' },
                                            ...(wizardData.shiftAfternoonStart
                                              ? [{ id: '2', name: 'Turno 2 / Vespertino', start: wizardData.shiftAfternoonStart, end: wizardData.shiftAfternoonEnd || '18:00' }]
                                              : []),
                                          ];
                                      const updated = currentShifts.map((s, i) =>
                                        i === idx ? { ...s, start: e.target.value } : s
                                      );
                                      setWizardData({
                                        ...wizardData,
                                        shifts: updated,
                                        shiftMorningStart: updated[0]?.start || '08:00',
                                        shiftMorningEnd: updated[0]?.end || '14:00',
                                        shiftAfternoonStart: updated[1]?.start || '',
                                        shiftAfternoonEnd: updated[1]?.end || '',
                                      });
                                    }}
                                    style={{ colorScheme: 'dark' }}
                                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded p-2 text-center text-xs text-[var(--text-main)] outline-none focus:border-neon font-mono cursor-pointer hover:border-neon/50 transition-colors"
                                  />
                                </div>

                                <div>
                                  <span className="text-[9px] text-[var(--text-muted)] block mb-0.5">Fin</span>
                                  <input
                                    type="time"
                                    value={shift.end || '14:00'}
                                    onClick={(e) => {
                                      try {
                                        if (typeof e.target.showPicker === 'function') {
                                          e.target.showPicker();
                                        }
                                      } catch (err) {}
                                    }}
                                    onChange={(e) => {
                                      const currentShifts = (wizardData.shifts && wizardData.shifts.length > 0)
                                        ? wizardData.shifts
                                        : [
                                            { id: '1', name: 'Turno 1 / Matutino', start: wizardData.shiftMorningStart || '08:00', end: wizardData.shiftMorningEnd || '13:30' },
                                            ...(wizardData.shiftAfternoonStart
                                              ? [{ id: '2', name: 'Turno 2 / Vespertino', start: wizardData.shiftAfternoonStart, end: wizardData.shiftAfternoonEnd || '18:00' }]
                                              : []),
                                          ];
                                      const updated = currentShifts.map((s, i) =>
                                        i === idx ? { ...s, end: e.target.value } : s
                                      );
                                      setWizardData({
                                        ...wizardData,
                                        shifts: updated,
                                        shiftMorningStart: updated[0]?.start || '08:00',
                                        shiftMorningEnd: updated[0]?.end || '14:00',
                                        shiftAfternoonStart: updated[1]?.start || '',
                                        shiftAfternoonEnd: updated[1]?.end || '',
                                      });
                                    }}
                                    style={{ colorScheme: 'dark' }}
                                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded p-2 text-center text-xs text-[var(--text-main)] outline-none focus:border-neon font-mono cursor-pointer hover:border-neon/50 transition-colors"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Duración de Cada Cita / Slot Libre & Capacidad */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">
                              Duración de Cita / Slot (Libre)
                            </label>
                            <span className="text-[10px] text-emerald-400 font-bold font-mono">
                              {wizardData.appointmentDuration || 30} minutos
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-full flex items-center relative">
                              <input
                                type="number"
                                min={1}
                                max={480}
                                value={wizardData.appointmentDuration || 30}
                                onChange={(e) => setWizardData({ ...wizardData, appointmentDuration: Math.max(1, Number(e.target.value)) })}
                                placeholder="45"
                                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2.5 text-xs text-center text-[var(--text-main)] font-mono outline-none focus:border-neon pr-12"
                              />
                              <span className="text-[11px] text-[var(--text-muted)] font-mono font-bold absolute right-3 pointer-events-none">
                                min
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] text-[var(--text-muted)] block">
                            Define libremente los minutos exactos de cada espacio en agenda.
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">
                              Capacidad Simultánea en Paralelo
                            </label>
                            <span className="text-[10px] text-cyan-400 font-bold font-mono">
                              Max {wizardData.concurrencyLimit || 1}
                            </span>
                          </div>
                          <input
                            type="number"
                            min={1}
                            max={500}
                            value={wizardData.concurrencyLimit || 1}
                            onChange={(e) => setWizardData({ ...wizardData, concurrencyLimit: Math.max(1, Number(e.target.value)) })}
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 text-xs text-center text-[var(--text-main)] font-mono outline-none focus:border-neon"
                          />
                          <span className="text-[9px] text-[var(--text-muted)] block">
                            1 para citas privadas 1-on-1, o más para sillones, salas o mesas paralelas.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs px-4 py-2.5 rounded-xl text-[var(--text-main)] font-mono flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                    >
                      <span>Siguiente: Configurar Pilares RAG</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {/* PASO 4: Pilares RAG (Antes Paso 2)                            */}
              {/* ============================================================= */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 text-[10px] font-mono font-bold uppercase">
                            Paso 5 de 6
                          </span>
                          <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                            <Database className="w-5 h-5 text-neon" />
                            <span>Configuración de los 4 Pilares RAG & Oferta</span>
                          </h3>
                        </div>

                      <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                        <strong className="text-cyan-500 dark:text-cyan-400">Pilar 2 (Brandbook) es obligatorio</strong>. Los demás son opcionales y adaptados a {currentVerticalObj.name}.
                      </p>
                    </div>
                  </div>

                  {/* Banner de Diagnóstico de Deficiencias & Sugerencias IA del Plan Maestro */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-neon/30 space-y-3.5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon shrink-0">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-mono font-black uppercase text-[var(--text-main)] flex items-center gap-2">
                            <span>Auditoría Semántica de tu Plan Maestro (IA)</span>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold uppercase">
                              DeepSeek R1
                            </span>
                          </h4>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono">
                            {masterFile
                              ? `Analizando archivo maestro: "${masterFile.name}" (${(masterFile.size / 1024).toFixed(1)} KB)`
                              : masterDocText
                              ? 'Analizando directrices semánticas del brief ingresado'
                              : 'Detección automática de huecos o directrices faltantes en tus 4 Pilares RAG'}
                          </p>
                        </div>
                      </div>

                      {/* Health Score Badge */}
                      <div className="flex items-center gap-2 self-start sm:self-auto bg-[var(--bg-panel)] px-3 py-1.5 rounded-xl border border-[var(--border-color)]">
                        <div className="text-right">
                          <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Salud del Plan</div>
                          <div className="text-xs font-mono font-black text-neon">{healthScore}% / 100%</div>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-neon/50 flex items-center justify-center font-mono font-black text-[10px] text-neon bg-neon/10">
                          {healthScore}%
                        </div>
                      </div>
                    </div>

                    {/* Deficiencias Detectadas */}
                    {detectedDeficiencies.length > 0 ? (
                      <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-amber-400 font-bold flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {detectedDeficiencies.length} punto{detectedDeficiencies.length > 1 ? 's' : ''} de mejora detectado{detectedDeficiencies.length > 1 ? 's' : ''} en tu Plan Maestro:
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)]">Resuelve con 1-Click asistido</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {detectedDeficiencies.map((def) => (
                            <div
                              key={def.id}
                              className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono transition-all hover:border-amber-400/40"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                      def.severity === 'critical'
                                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                        : def.severity === 'recommended'
                                        ? 'bg-neon/15 text-neon border border-neon/30'
                                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                    }`}
                                  >
                                    {def.severityLabel} · {def.pilar}
                                  </span>
                                  <span className="font-bold text-[var(--text-main)] text-[11px]">{def.title}</span>
                                </div>
                                <p className="text-[11px] text-[var(--text-muted)] font-sans">{def.description}</p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleResolveDeficiency(def)}
                                className="bg-neon/10 hover:bg-neon text-neon hover:text-black border border-neon/40 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-sm active:scale-95"
                              >
                                <Zap className="w-3 h-3" />
                                <span>{def.actionLabel}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs font-mono text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>
                          ¡Plan Maestro Integral! Todos los pilares y reglas comerciales cuentan con directrices calibradas para <strong>{currentVerticalObj.name}</strong>.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Pilar 2: Brandbook (Obligatorio) */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border-2 border-cyan-400/80 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-500 dark:text-cyan-400 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          PILAR 2: Brandbook & Tono de Voz
                        </span>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500 text-black font-black uppercase">
                          ★ OBLIGATORIO
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {currentPillarsAdaptive.pilar2.label} (ADR-002 §2.4).
                      </p>

                      {/* Opción A: Escribir o Pegar */}
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] block font-mono mb-1 font-bold">
                          1. Escribir / Pegar Tono de Voz del Agente:
                        </label>
                        <input
                          type="text"
                          placeholder={currentPillarsAdaptive.pilar2.placeholder}
                          value={wizardData.brandTone || ''}
                          onChange={(e) => setWizardData({ ...wizardData, brandTone: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-xs text-[var(--text-main)] font-mono focus:border-cyan-400 outline-none"
                        />
                      </div>

                      {/* Opción B: Subir Documento ADR-002 (.pdf, .docx, .md, .txt) */}
                      <div className="pt-2 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-mono font-bold text-[var(--text-muted)] flex items-center gap-1">
                            <Upload className="w-3 h-3 text-cyan-400" />
                            <span>2. O {currentPillarsAdaptive.pilar2.docLabel}:</span>
                          </label>
                          <span className="text-[9px] font-mono text-[var(--text-muted)]">ADR-002</span>
                        </div>

                        {!wizardData.brandbookDoc ? (
                          <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-cyan-400/40 hover:border-cyan-400 bg-[var(--bg-panel)] cursor-pointer transition-all group">
                            <FileText className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                              Adjuntar archivo <strong className="text-cyan-400 font-bold">.pdf, .docx, .md, .txt</strong>
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc,.md,.txt"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setWizardData({
                                    ...wizardData,
                                    brandbookDoc: { name: file.name, size: file.size, type: file.type }
                                  });
                                }
                              }}
                            />
                          </label>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-cyan-400/60 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="text-[var(--text-main)] font-bold truncate text-[11px]">
                                {typeof wizardData.brandbookDoc === 'string' ? wizardData.brandbookDoc : wizardData.brandbookDoc?.name}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                                {wizardData.brandbookDoc?.size ? `(${(wizardData.brandbookDoc.size / 1024).toFixed(1)} KB)` : '(Auto-extraído)'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setWizardData({ ...wizardData, brandbookDoc: null })}
                              className="p-1 text-[var(--text-muted)] hover:text-red-400 transition-colors ml-2"
                              title="Quitar archivo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Propuesta Comercial & Gancho */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border-2 border-neon/70 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-neon flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          PROPUESTA COMERCIAL & OFERTA
                        </span>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-neon text-black font-black uppercase">
                          RECOMENDADO
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Gancho irresistible o lead magnet para captación en pauta y micro-landing.
                      </p>

                      {/* Opción A: Escribir o Pegar */}
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] font-mono block mb-1 font-bold">
                          1. Escribir / Pegar Gancho del Mes:
                        </label>
                        <input
                          type="text"
                          placeholder={currentPillarsAdaptive.offer.placeholder}
                          value={wizardData.offerHook || ''}
                          onChange={(e) => setWizardData({ ...wizardData, offerHook: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-xs text-[var(--text-main)] font-mono focus:border-neon outline-none"
                        />
                      </div>

                      {/* Opción B: Subir Documento ADR-002 (.pdf, .docx, .md, .txt) */}
                      <div className="pt-2 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-mono font-bold text-[var(--text-muted)] flex items-center gap-1">
                            <Upload className="w-3 h-3 text-neon" />
                            <span>2. O {currentPillarsAdaptive.offer.docLabel}:</span>
                          </label>
                          <span className="text-[9px] font-mono text-[var(--text-muted)]">ADR-002</span>
                        </div>

                        {!wizardData.commercialProposalDoc ? (
                          <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-neon/40 hover:border-neon bg-[var(--bg-panel)] cursor-pointer transition-all group">
                            <FileText className="w-3.5 h-3.5 text-neon group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                              Adjuntar archivo <strong className="text-neon font-bold">.pdf, .docx, .md, .txt</strong>
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc,.md,.txt"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setWizardData({
                                    ...wizardData,
                                    commercialProposalDoc: { name: file.name, size: file.size, type: file.type }
                                  });
                                }
                              }}
                            />
                          </label>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-neon/60 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                              <span className="text-[var(--text-main)] font-bold truncate text-[11px]">
                                {typeof wizardData.commercialProposalDoc === 'string' ? wizardData.commercialProposalDoc : wizardData.commercialProposalDoc?.name}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                                {wizardData.commercialProposalDoc?.size ? `(${(wizardData.commercialProposalDoc.size / 1024).toFixed(1)} KB)` : '(Auto-extraído)'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setWizardData({ ...wizardData, commercialProposalDoc: null })}
                              className="p-1 text-[var(--text-muted)] hover:text-red-400 transition-colors ml-2"
                              title="Quitar archivo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pilar 1: Catálogo & Precios */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-neon flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" /> {currentPillarsAdaptive.pilar1.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-panel)] text-[var(--text-muted)] border border-[var(--border-color)] uppercase">
                          Opcional
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {currentVerticalObj.pillars.pilar1.label}
                      </p>

                      {/* Opción A: Escribir o Pegar */}
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] font-mono block mb-1 font-bold">
                          1. Escribir / Pegar Precios o Servicios:
                        </label>
                        <input
                          type="text"
                          placeholder={currentPillarsAdaptive.pilar1.placeholder}
                          value={wizardData.pricingDetails || ''}
                          onChange={(e) => setWizardData({ ...wizardData, pricingDetails: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-xs text-[var(--text-main)] font-mono focus:border-neon outline-none"
                        />
                      </div>

                      {/* Opción B: Subir Documento ADR-002 (.pdf, .docx, .md, .txt) */}
                      <div className="pt-2 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-mono font-bold text-[var(--text-muted)] flex items-center gap-1">
                            <Upload className="w-3 h-3 text-neon" />
                            <span>2. O {currentPillarsAdaptive.pilar1.docLabel}:</span>
                          </label>
                          <span className="text-[9px] font-mono text-[var(--text-muted)]">ADR-002</span>
                        </div>

                        {!wizardData.pricingDoc ? (
                          <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-[var(--border-color)] hover:border-neon/60 bg-[var(--bg-panel)] cursor-pointer transition-all group">
                            <FileText className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-neon transition-colors" />
                            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                              Adjuntar archivo <strong className="text-neon font-bold">.pdf, .docx, .md, .txt</strong>
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc,.md,.txt"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setWizardData({
                                    ...wizardData,
                                    pricingDoc: { name: file.name, size: file.size, type: file.type }
                                  });
                                }
                              }}
                            />
                          </label>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-emerald-500/50 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="text-[var(--text-main)] font-bold truncate text-[11px]">
                                {typeof wizardData.pricingDoc === 'string' ? wizardData.pricingDoc : wizardData.pricingDoc?.name}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                                {wizardData.pricingDoc?.size ? `(${(wizardData.pricingDoc.size / 1024).toFixed(1)} KB)` : '(Auto-extraído)'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setWizardData({ ...wizardData, pricingDoc: null })}
                              className="p-1 text-[var(--text-muted)] hover:text-red-400 transition-colors ml-2"
                              title="Quitar archivo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pilar 3: Políticas & FAQ */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" /> {currentPillarsAdaptive.pilar3.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-panel)] text-[var(--text-muted)] border border-[var(--border-color)] uppercase">
                          Opcional
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {currentVerticalObj.pillars.pilar3.label}
                      </p>

                      {/* Opción A: Escribir o Pegar */}
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] font-mono block mb-1 font-bold">
                          1. Escribir / Pegar Políticas o Preguntas Frecuentes:
                        </label>
                        <input
                          type="text"
                          placeholder={currentPillarsAdaptive.pilar3.placeholder}
                          value={wizardData.faqDetails || ''}
                          onChange={(e) => setWizardData({ ...wizardData, faqDetails: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-2.5 text-xs text-[var(--text-main)] font-mono focus:border-amber-400 outline-none"
                        />
                      </div>

                      {/* Opción B: Subir Documento ADR-002 (.pdf, .docx, .md, .txt) */}
                      <div className="pt-2 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-mono font-bold text-[var(--text-muted)] flex items-center gap-1">
                            <Upload className="w-3 h-3 text-amber-400" />
                            <span>2. O {currentPillarsAdaptive.pilar3.docLabel}:</span>
                          </label>
                          <span className="text-[9px] font-mono text-[var(--text-muted)]">ADR-002</span>
                        </div>

                        {!wizardData.faqsDoc ? (
                          <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-[var(--border-color)] hover:border-amber-400/60 bg-[var(--bg-panel)] cursor-pointer transition-all group">
                            <FileText className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-amber-400 transition-colors" />
                            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                              Adjuntar archivo <strong className="text-amber-400 font-bold">.pdf, .docx, .md, .txt</strong>
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc,.md,.txt"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setWizardData({
                                    ...wizardData,
                                    faqsDoc: { name: file.name, size: file.size, type: file.type }
                                  });
                                }
                              }}
                            />
                          </label>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-amber-400/50 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="text-[var(--text-main)] font-bold truncate text-[11px]">
                                {typeof wizardData.faqsDoc === 'string' ? wizardData.faqsDoc : wizardData.faqsDoc?.name}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                                {wizardData.faqsDoc?.size ? `(${(wizardData.faqsDoc.size / 1024).toFixed(1)} KB)` : '(Auto-extraído)'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setWizardData({ ...wizardData, faqsDoc: null })}
                              className="p-1 text-[var(--text-muted)] hover:text-red-400 transition-colors ml-2"
                              title="Quitar archivo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  <div className="col-span-1 md:col-span-2 p-5 rounded-2xl bg-[var(--bg-card)] border border-emerald-500/30 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> {currentPillarsAdaptive.pilar4.title} & Calificación de Leads
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPilar4Guide(!showPilar4Guide)}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[var(--bg-panel)] hover:bg-[var(--bg-card-subtle)] border border-neon/40 text-neon flex items-center gap-1 transition-all active:scale-95"
                            title="Haz clic para entender cómo funciona el Pilar 4"
                          >
                            <HelpCircle className="w-3 h-3 text-neon" />
                            <span>¿Qué es el Pilar 4?</span>
                          </button>
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                          4/4 Criterios AND · Facturación $350 MXN
                        </span>
                      </div>

                      {/* Explicación Desplegable del Pilar 4 */}
                      {showPilar4Guide && (
                        <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-emerald-500/40 space-y-2 text-xs font-mono animate-fade-in">
                          <div className="flex items-center justify-between text-emerald-400 font-bold">
                            <span className="flex items-center gap-1.5">
                              <Info className="w-4 h-4" />
                              Guía: ¿Para qué sirve el Pilar 4 en Vector Inside?
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowPilar4Guide(false)}
                              className="text-[var(--text-muted)] hover:text-red-400"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-[var(--text-muted)] font-sans">
                            <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                              <strong className="text-neon block font-mono">1. Prueba Social & Casos de Éxito</strong>
                              <p>
                                Cuando el prospecto duda (&quot;¿Es seguro?&quot;, &quot;¿Tienen resultados?&quot;), la IA no inventa: acude a este pilar y cita transformaciones reales, testimonios, reseñas o fotos de antes/después específicas de {currentVerticalObj.name}.
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                              <strong className="text-emerald-400 block font-mono">2. Matriz de Calificación AND ($350 MXN)</strong>
                              <p>
                                Protege tu dinero evitando pagar por &quot;mirones&quot; o curiosos. La IA evalúa los 4 filtros comerciales en la charla. <strong>Solo cuando el prospecto confirma los 4 criterios</strong>, se transfiere a tu equipo y se genera la comisión.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Filtros de control comercial calibrados para {currentVerticalObj.name}. Solo se factura al tenant cuando el prospecto confirma todos los criterios.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                        {(currentPillarsAdaptive.criteria || []).map((crit, cIdx) => (
                          <div key={cIdx} className="p-2.5 rounded-xl bg-[var(--bg-panel)] border border-emerald-500/30 flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-neon shrink-0" />
                            <span className="text-[var(--text-main)] truncate">{crit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs px-4 py-2.5 rounded-xl text-[var(--text-main)] font-mono flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(6)}
                      className="bg-neon text-black font-mono font-bold text-xs px-6 py-3 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon"
                    >
                      <span>Siguiente: Reglas & Despliegue RLS</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* PASO 6: Gobernanza, Reglas Inviolables & Despliegue RLS       */}
              {/* ============================================================= */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-neon/15 text-neon border border-neon/30 text-[10px] font-mono font-bold uppercase">
                        Paso 6 de 6
                      </span>
                      <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                        <Shield className="w-5 h-5 text-neon" />
                        <span>Gobernanza, Reglas Inviolables & Despliegue RLS</span>
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                      Audita las reglas de operación, revisa el resumen ejecutivo del enjambre y activa el aislamiento RLS para el negocio.
                    </p>
                  </div>

                  {/* Bloque 1: Reglas Inviolables del Negocio */}
                  <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-neon" />
                        <span className="text-xs font-mono font-bold uppercase text-[var(--text-main)]">
                          Reglas Inviolables & Guardrails Operativos
                        </span>
                      </div>
                      {wizardData.inviolableRules.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setWizardData(prev => ({ ...prev, inviolableRules: [] }))}
                          className="text-xs font-mono text-red-400 hover:text-red-300 underline cursor-pointer"
                        >
                          Limpiar todas
                        </button>
                      )}
                    </div>

                                      

                  {wizardData.inviolableRules.length === 0 ? (
                    <div className="p-6 rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] text-center space-y-3">
                      <p className="text-xs font-mono text-[var(--text-muted)] max-w-lg mx-auto">
                        Inicias con el lienzo 100% limpio. El bot no asumirá reglas rígidas: aprenderá de los documentos que subiste en los Pilares o de las reglas puntuales que agregues abajo.
                      </p>
                      {currentVerticalObj.defaultRules && currentVerticalObj.defaultRules.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setWizardData(prev => ({ ...prev, inviolableRules: [...currentVerticalObj.defaultRules] }))}
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neon hover:underline pt-1"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Cargar sugerencias de ejemplo de {currentVerticalObj.name} ({currentVerticalObj.defaultRules.length})</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {wizardData.inviolableRules.map((rule, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between text-xs font-mono text-[var(--text-main)]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-neon shrink-0" />
                            <span>{rule}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveRule(idx)}
                            className="text-[var(--text-muted)] hover:text-red-500 p-1 shrink-0"
                            title="Eliminar regla"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add rule input */}
                  <form onSubmit={handleAddRule} className="flex gap-2">
                    <input
                      type="text"
                      value={wizardData.newRuleInput}
                      onChange={(e) => setWizardData({ ...wizardData, newRuleInput: e.target.value })}
                      placeholder="Agregar regla inviolable personalizada..."
                      className="flex-1 bg-[var(--bg-card)] border border-[var(--border-color)] text-xs rounded-xl px-4 py-3 text-[var(--text-main)] focus:border-neon outline-none font-mono"
                    />
                    <button
                      type="submit"
                      className="bg-[var(--bg-panel)] text-[var(--text-main)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] px-5 py-3 rounded-xl text-xs font-mono font-bold hover:border-neon transition-colors"
                    >
                      + Agregar
                    </button>
                  </form>
                  </div>

                  {/* Bloque 2: Resumen Ejecutivo Integral de Auditoría & Pilares RAG */}
                  <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-neon/30 space-y-4 font-mono text-xs shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                      <div className="flex items-center gap-3">
                        <VectorLobo size={32} showStatus={true} status="active" />
                        <div>
                          <span className="text-[var(--text-main)] font-bold block text-sm">Auditoría Ejecutiva Pre-Despliegue</span>
                          <span className="text-[10px] text-[var(--text-muted)]">Resumen completo del negocio, canales y 4 Pilares RAG (ADR-001 & ADR-002)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-neon/15 text-neon font-bold border border-neon/30 text-[10px]">
                          IFV Esperado: 48/50
                        </span>
                        <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                          Salud RAG: {healthScore}%
                        </span>
                      </div>
                    </div>

                    {/* Fila 1: Entidad, Giro y Canales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {/* Entidad & Dueño */}
                      <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                        <span className="text-[var(--text-muted)] block text-[9px] uppercase font-bold tracking-wider">Negocio & Contacto HITL</span>
                        <span className="text-[var(--text-main)] font-black text-sm block truncate">
                          {wizardData.businessName || 'Nuevo Negocio'}
                        </span>
                        <span className="text-[10px] text-cyan-400 block truncate">
                          Dueño: {wizardData.ownerName || 'Director General'} · {wizardData.ownerPhone || 'Sin tel'}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Tax ID: {wizardData.legalNameTaxId || 'RFC en validación'}
                        </span>
                      </div>

                      {/* Giro & Metas */}
                      <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                        <span className="text-[var(--text-muted)] block text-[9px] uppercase font-bold tracking-wider">Giro & Conversión</span>
                        <span className="text-neon font-black text-sm block truncate">
                          {currentVerticalObj.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Meta: {currentVerticalObj.conversionGoal?.split('/')[0]}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold block truncate">
                          Arquetipo: {wizardData.archetype || currentVerticalObj.badge}
                        </span>
                      </div>

                      {/* Canales & Agenda */}
                      <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                        <span className="text-[var(--text-muted)] block text-[9px] uppercase font-bold tracking-wider">Estrategia & Calendario</span>
                        {wizardData.hasWebsite ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[9px] font-bold flex items-center gap-1 shrink-0">
                              <Globe className="w-2.5 h-2.5" />
                              CON Web
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] truncate">
                              {wizardData.websiteUrl || 'https://negocio.com'}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold inline-flex items-center gap-1">
                              <Smartphone className="w-2.5 h-2.5" />
                              SIN Web (Directo a WhatsApp)
                            </span>
                          </div>
                        )}
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Google Calendar: {wizardData.appointmentDuration || 45} min / cita
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Micro-landing: {wizardData.microLandingBillingPlan === 'disabled' ? 'Desactivada' : `Activa (${wizardData.microLandingBillingPlan})`}
                        </span>
                      </div>
                    </div>

                    {/* Resumen de los 4 Pilares RAG & Oferta Comercial */}
                    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-neon/25 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neon flex items-center gap-1.5 uppercase font-mono">
                          <Database className="w-4 h-4" />
                          Memoria RAG: Desglose de los 4 Pilares & Oferta
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {masterFile ? `Fuente: "${masterFile.name}"` : 'Configuración asistida'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-[11px]">
                        {/* Pilar 1 */}
                        <div className="p-2.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-1">
                          <span className="text-[10px] text-neon font-bold block truncate">Pilar 1: Precios / Tarifas</span>
                          <p className="text-[10px] text-[var(--text-main)] font-sans line-clamp-2">
                            {wizardData.pricingDetails || (wizardData.pricingDoc ? `Doc: ${typeof wizardData.pricingDoc === 'string' ? wizardData.pricingDoc : wizardData.pricingDoc.name}` : 'Tarifario oficial')}
                          </p>
                          {wizardData.pricingDoc && (
                            <span className="text-[9px] text-emerald-400 font-mono block truncate">
                              📎 {typeof wizardData.pricingDoc === 'string' ? wizardData.pricingDoc : wizardData.pricingDoc.name}
                            </span>
                          )}
                        </div>

                        {/* Pilar 2 */}
                        <div className="p-2.5 rounded-lg bg-[var(--bg-panel)] border border-cyan-400/40 space-y-1">
                          <span className="text-[10px] text-cyan-400 font-bold block truncate">Pilar 2: Brandbook & Tono</span>
                          <p className="text-[10px] text-[var(--text-main)] font-sans line-clamp-2">
                            {wizardData.brandTone || (wizardData.brandbookDoc ? `Doc: ${typeof wizardData.brandbookDoc === 'string' ? wizardData.brandbookDoc : wizardData.brandbookDoc.name}` : 'Tono empático profesional')}
                          </p>
                          {wizardData.brandbookDoc && (
                            <span className="text-[9px] text-cyan-400 font-mono block truncate">
                              📎 {typeof wizardData.brandbookDoc === 'string' ? wizardData.brandbookDoc : wizardData.brandbookDoc.name}
                            </span>
                          )}
                        </div>

                        {/* Oferta */}
                        <div className="p-2.5 rounded-lg bg-[var(--bg-panel)] border border-neon/30 space-y-1">
                          <span className="text-[10px] text-neon font-bold block truncate">Propuesta Comercial</span>
                          <p className="text-[10px] text-[var(--text-main)] font-sans line-clamp-2">
                            {wizardData.offerHook || (wizardData.commercialProposalDoc ? `Doc: ${typeof wizardData.commercialProposalDoc === 'string' ? wizardData.commercialProposalDoc : wizardData.commercialProposalDoc.name}` : 'Oferta de captación')}
                          </p>
                          {wizardData.commercialProposalDoc && (
                            <span className="text-[9px] text-neon font-mono block truncate">
                              📎 {typeof wizardData.commercialProposalDoc === 'string' ? wizardData.commercialProposalDoc : wizardData.commercialProposalDoc.name}
                            </span>
                          )}
                        </div>

                        {/* Pilar 3 */}
                        <div className="p-2.5 rounded-lg bg-[var(--bg-panel)] border border-amber-400/40 space-y-1">
                          <span className="text-[10px] text-amber-400 font-bold block truncate">Pilar 3: Políticas / FAQs</span>
                          <p className="text-[10px] text-[var(--text-main)] font-sans line-clamp-2">
                            {wizardData.faqDetails || (wizardData.faqsDoc ? `Doc: ${typeof wizardData.faqsDoc === 'string' ? wizardData.faqsDoc : wizardData.faqsDoc.name}` : 'Reglamento y cancelaciones')}
                          </p>
                          {wizardData.faqsDoc && (
                            <span className="text-[9px] text-amber-400 font-mono block truncate">
                              📎 {typeof wizardData.faqsDoc === 'string' ? wizardData.faqsDoc : wizardData.faqsDoc.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pilar 4 Footer */}
                      <div className="pt-2.5 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px]">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Pilar 4: 4/4 Criterios AND activos · Costo Lead Calificado: ${wizardData.costPerQualifiedLead || 350} MXN</span>
                        </div>
                        <div className="text-[var(--text-muted)]">
                          Reglas Inviolables: <strong className="text-neon">{wizardData.inviolableRules.length} activas</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 6-Block JSON Onboarding Payload Inspector */}
                  <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4 font-mono text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-neon" />
                        <div>
                          <span className="text-[var(--text-main)] font-bold block">Payload Onboarding 6-Bloques</span>
                          <span className="text-[10px] text-[var(--text-muted)]">Endpoint API: POST /api/v1/tenants/onboard · Especificación de Arquitectura ADR-001 §2.7</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyPayload}
                          className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-neon border border-neon/40 flex items-center gap-1.5 transition-all text-xs font-bold active:scale-95 shadow-[0_0_10px_rgba(231,249,0,0.1)]"
                        >
                          {copiedPayload ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">¡Payload Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar JSON</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPayloadModal(!showPayloadModal)}
                          className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] flex items-center gap-1.5 transition-all text-xs"
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>{showPayloadModal ? 'Ocultar JSON' : 'Inspeccionar JSON'}</span>
                        </button>
                      </div>
                    </div>

                    {showPayloadModal && (
                      <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-neon/30 overflow-x-auto max-h-80 text-[11px] text-[var(--text-main)] font-mono leading-relaxed select-all animate-fade-in shadow-inner">
                        <pre className="text-emerald-500 dark:text-emerald-400 whitespace-pre">
                          {JSON.stringify(getDynamicOnboardingPayload(), null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* 6 Verification Checkpoints */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[10px] text-[var(--text-muted)] pt-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>1. Tenant Core & RLS</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>2. Owner Legal E.164</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>3. Meta Credentials (WABA/IG)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>4. Web / GA4 / CAPI</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>5. Google Calendar Sync</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon shrink-0" />
                        <span>6. Matriz de Oferta & Reglas</span>
                      </div>
                    </div>
                  </div>

                  {/* Navegación Final y Botón Desplegar Enjambre */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="bg-[var(--bg-panel)] border border-[var(--border-color)] text-xs px-4 py-2.5 rounded-xl text-[var(--text-main)] font-mono flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás: Pilares RAG</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDeploySwarm}
                      className="bg-neon text-black font-mono font-black text-xs uppercase px-8 py-3.5 rounded-xl hover:bg-[var(--neon-hover)] transition-all flex items-center gap-2 shadow-neon active:scale-95 w-full sm:w-auto justify-center"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Desplegar Enjambre & Activar RLS</span>
                    </button>
                  </div>
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
          <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-neon tracking-wider">
                Panel del Negocio / Cliente
              </span>
              <h3 className="text-2xl font-black text-[var(--text-main)] font-mono flex items-center gap-2">
                <span>{activeTenant?.name || 'Tu Negocio'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Bot Activo 24/7
                </span>
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
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
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-brand-primary/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <VectorLobo size={44} showStatus={true} status="active" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[var(--text-main)] font-mono">
                    Base de Conocimiento Calibrada
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon font-bold border border-neon/30">
                    IFV: 48/50
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
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
            <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border-2 border-cyan-500/40 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-500 dark:text-cyan-400 font-bold font-mono text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Pilar 2: Identidad & Tono de Marca</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30">
                  Obligatorio • Activo
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Estilo de redacción, lenguaje natural y personalidad con la que tu bot interactúa con tu audiencia.
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono flex items-center justify-between text-[var(--text-muted)]">
                <span>Archivo activo: Brandbook_Identidad.md</span>
                <span className="text-emerald-400 font-bold">100% Sincronizado</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neon font-bold font-mono text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span>Pilar 1: Precios & Catálogo de Ventas</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-muted)]">
                  Opcional
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Cotizaciones y paquetes configurables según el giro de negocio.
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono flex items-center justify-between text-[var(--text-muted)]">
                <span>Estado: Matriz_Precios.json</span>
                <span className="text-[var(--text-muted)] font-bold">Configurable</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-bold font-mono text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Pilar 3: Preguntas Frecuentes & Seguridad</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                  Activo
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Respuestas automáticas a dudas frecuentes y filtros para evitar respuestas indebidas.
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono flex items-center justify-between text-[var(--text-muted)]">
                <span>Archivo activo: FAQs_Objeciones.md</span>
                <span className="text-emerald-400 font-bold">Plantilla Activa</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-bold font-mono text-sm">
                  <History className="w-4 h-4" />
                  <span>Pilar 4: Histórico & Casos de Éxito</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-muted)]">
                  Opcional
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Contexto de publicaciones pasadas y aprendizajes de campañas previas.
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono flex items-center justify-between text-[var(--text-muted)]">
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
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowChangeModal(false);
            }}
          >
            <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-panel)] border border-brand-primary/40 shadow-2xl p-6 sm:p-8 relative space-y-5 my-auto animate-scale-up">
            <button
              type="button"
              onClick={() => setShowChangeModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon text-[10px] font-mono font-bold uppercase">
                <Upload className="w-3.5 h-3.5" />
                Workflow de Validación
              </div>
              <h3 className="text-xl font-black text-[var(--text-main)]">
                Solicitar Actualización de Documento
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
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
                <label className="block font-bold text-[var(--text-main)] mb-1">
                  Selecciona el Pilar que deseas actualizar
                </label>
                <select
                  value={selectedPillarForChange}
                  onChange={(e) => setSelectedPillarForChange(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-2.5 text-[var(--text-main)] focus:border-neon outline-none cursor-pointer"
                >
                  <option value="pillar2">Pilar 2: Identidad & Tono de Voz (Brandbook) — [Principal]</option>
                  <option value="pillar1">Pilar 1: Precios / Membresías / Catálogo</option>
                  <option value="pillar3">Pilar 3: Protocolos de Crisis & FAQs</option>
                  <option value="pillar4">Pilar 4: Histórico de Datos & Casos de Éxito</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">
                  Subir Nuevo Archivo (Markdown .md, PDF, Word o TXT)
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => setChangeFileName(e.target.files[0]?.name || 'Nuevo_Documento.md')}
                  className="text-xs text-[var(--text-muted)] w-full file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neon file:text-black hover:file:bg-[var(--neon-hover)] cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1">
                  Explicación breve de los cambios realizados *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="ej. Actualizamos los precios de membresías del gimnasio y agregamos 3 nuevas preguntas frecuentes sobre clases de CrossFit."
                  value={changeNotes}
                  onChange={(e) => setChangeNotes(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-main)] focus:border-neon outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangeModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
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
        </Portal>
      )}
    </div>
  );
};
