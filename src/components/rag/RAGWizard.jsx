'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BriefingBridge } from '@/services/briefingBridge';
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
    ownerPhone: '+52 55 9876 5432',

    // Estrategia Dual has_website & Canales Meta
    hasWebsite: true,
    websiteUrl: 'https://clinicasonrisas.com',
    ga4MeasurementId: 'G-ABC123XYZ',
    metaPixelId: '123456789012345',
    metaCapiToken: 'EAAX_CAPI_TOKEN_SAMPLE...',
    whatsappPhoneId: '109283746592019',
    wabaId: '987654321098765',
    instagramAccountId: '1784140000000',

    // Micro-Landing Universal como Servicio
    microLandingBillingPlan: 'trial_90d', // 'trial_90d' (3 Meses Gratis) | 'active_monthly' ($29 USD/mes) | 'disabled' (Inactiva)
    microLandingCustomSlug: '',

    // Google Calendar & Performance
    googleCalendarId: 'c_dental_sonrisas@group.calendar.google.com',
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
    monthlyAdBudget: 1500.0,
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

  // Calculate dynamic RAG Health Score (0-100)
  const calculateHealthScore = () => {
    let score = 50;
    if (wizardData.brandbookDoc) score += 20;
    if (wizardData.enableCommercialProposal && wizardData.offerHook) score += 15;
    if (wizardData.enableCrisisPillar) score += 10;
    if (wizardData.inviolableRules.length >= 1) score += 5;
    return Math.min(score, 100);
  };

  const healthScore = calculateHealthScore();

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
      
      const result = await BriefingBridge.analyze({
        file: masterFile,
        text: masterDocText,
        verticalConfig: vert,
        onProgress: (stage) => setBriefingAnalysisStage(stage),
        signal: briefingAbortRef.current.signal,
      });

      setIsAnalyzingBriefing(false);
      setBriefingAnalyzed(true);

      // Auto-popular los estados del negocio con la extracción de IA
      setWizardData((prev) => ({
        ...prev,
        businessName: result.businessName || prev.businessName || `Centro de Excelencia (${vert.name.split(',')[0]})`,
        brandTone: result.brandTone || 'Profesional, Empático y Orientado a Resultados',
        archetype: result.archetype || vert.badge || 'El Asesor Experto',
        offerHook: result.offerHook || 'Diagnóstico de Valoración Sin Costo',
        offerCta: result.offerCta || 'Envía mensaje para apartar cupo',
        offerValidity: result.offerValidity || 'Válido por tiempo limitado',
        commercialProposalDoc: result.commercialProposalDoc || (masterFile ? masterFile.name : 'Master_Briefing_Integral.pdf'),
        brandbookDoc: result.brandbookDoc || 'Manual_Identidad_Extraido.md',
        faqsDoc: result.faqsDoc || 'FAQs_Políticas_AutoExtraidas.md',
        enableCommercialProposal: true,
        enableCrisisPillar: true,
        inviolableRules: result.inviolableRules?.length > 0 ? result.inviolableRules : prev.inviolableRules,
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

    const newTenant = {
      id: tenantSlug,
      name: wizardData.businessName,
      shortName: wizardData.businessName,
      legalNameTaxId: wizardData.legalNameTaxId || 'Validación en trámite',
      vertical: vert.tipo,
      verticalLabel: vert.name,
      giro: vert.name,
      brandPurpose: `Excelencia operativa y conversión directa para ${wizardData.businessName}.`,
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
      cacMax: `$${wizardData.costPerQualifiedLead || 200} MXN`,
      ifv: `${healthScore}%`,
      capiStatus: 'Sincronizado',
      phone: wizardData.ownerPhone,
      avatar: vert.iconName || '🏢',
      isAiActive: true,
      crisisMode: false,
    };

    if (registerTenant) {
      registerTenant(newTenant);
    }
    
    triggerModal(
      '¡Nuevo Negocio Desplegado con Éxito!',
      `El tenant "${wizardData.businessName}" ha sido configurado en el giro ${vert.name}. Se indexaron ${activePillarsCount} pilares con aislamiento PostgreSQL RLS y Score de Salud ${healthScore}/100. Servicio de Micro-Landing: ${newTenant.microLandingStatus === 'trial' ? '🎁 Cortesía 3 Meses (90 Días)' : (newTenant.microLandingStatus === 'active' ? '💳 Suscripción Activa' : '⛔ Deshabilitada')}.`,
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
        <div className="space-y-8 animate-fade-in">
          {/* LISTA DE NEGOCIOS / TENANTS ACTIVOS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase text-[var(--text-main)] tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-neon" />
                <span>Negocios Activos & Estado de Pilares</span>
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)] font-medium">
                5 Tenants Aislados con PostgreSQL RLS
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {Object.values(tenantsData || {}).map((tenant) => (
                <div
                  key={tenant.id}
                  className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-neon/40 transition-all space-y-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl p-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                        {tenant.avatar || '🏢'}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[var(--text-main)] font-mono flex items-center gap-2">
                          <span>{tenant.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon/15 text-neon border border-neon/30 uppercase font-bold">
                            {tenant.giro || tenant.vertical || 'Vertical Activa'}
                          </span>
                        </h4>
                        <p className="text-xs text-[var(--text-muted)] font-mono">
                          ID: <span className="text-[var(--text-main)] font-bold">{tenant.id}</span> • CAPI Status:{' '}
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{tenant.capiStatus || 'Sincronizado'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-[var(--text-muted)]">RAG Health:</span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {tenant.ifv || '94%'} Antifrágil
                      </span>

                      {/* Botón de Eliminación Segura de Negocio */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTenant(tenant);
                          }}
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all flex items-center gap-1 text-[11px] font-bold"
                          title={`Eliminar negocio ${tenant.name}`}
                          aria-label={`Eliminar negocio ${tenant.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span className="hidden sm:inline text-rose-500">Eliminar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 4 Pillars Status Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1">
                      <span className="text-neon font-bold text-[10px] flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> PILAR 1: RENTABILIDAD
                      </span>
                      <p className="text-[var(--text-main)] font-bold truncate">Matriz_Precios.json</p>
                      <span className="text-[10px] text-[var(--text-muted)] block">CAC Máx: {tenant.cacMax || '$180 MXN'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-cyan-500/30 space-y-1 shadow-sm">
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold text-[10px] flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> PILAR 2: BRANDBOOK
                      </span>
                      <p className="text-[var(--text-main)] font-bold truncate">Brandbook_TonoVoz.md</p>
                      <span className="text-[10px] text-[var(--text-muted)] block">Identidad Activa</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1">
                      <span className="text-amber-600 dark:text-amber-400 font-bold text-[10px] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> PILAR 3: CRISIS & FAQS
                      </span>
                      <p className="text-[var(--text-main)] font-bold truncate">Crisis_Objeciones.md</p>
                      <span className="text-[10px] text-[var(--text-muted)] block">Filtro HITL Sub-segundo</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1">
                      <span className="text-purple-600 dark:text-purple-400 font-bold text-[10px] flex items-center gap-1">
                        <History className="w-3 h-3" /> PILAR 4: HISTÓRICO
                      </span>
                      <p className="text-[var(--text-main)] font-bold truncate">Casos_Exito_2025.txt</p>
                      <span className="text-[10px] text-[var(--text-muted)] block">Memoria retroactiva</span>
                    </div>
                  </div>

                  {/* Control Administrativo de Micro-Landing como Servicio Add-On */}
                  <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Smartphone className="w-4 h-4 text-neon" />
                        <span className="text-[var(--text-main)]">Micro-Landing Universal:</span>
                      </div>

                      {/* Status Badge */}
                      {tenant.microLandingStatus === 'trial' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 animate-spin" />
                          <span>🎁 Cortesía 3 Meses: {tenant.microLandingTrialDaysLeft || 90} días restantes</span>
                        </span>
                      )}
                      {tenant.microLandingStatus === 'active' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>💳 Suscripción Activa ($29 USD/mes)</span>
                        </span>
                      )}
                      {tenant.microLandingStatus === 'suspended' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>⏸️ Suspendida por Falta de Pago</span>
                        </span>
                      )}
                      {tenant.microLandingStatus === 'disabled' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-500/15 text-[var(--text-muted)] border border-[var(--border-color)] text-[10px] font-bold">
                          ⛔ Deshabilitada
                        </span>
                      )}

                      {/* Micro-Landing URL Preview */}
                      <a
                        href={`/m/${tenant.microLandingSlug || tenant.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-cyan-500 hover:underline flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20"
                        title="Abrir Micro-Landing"
                      >
                        <span>/m/{tenant.microLandingSlug || tenant.id}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {tenant.microLandingStatus === 'suspended' || tenant.microLandingStatus === 'disabled' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              toggleTenantMicroLanding(tenant.id, 'active');
                              triggerModal(
                                'Micro-Landing Reactivada',
                                `El servicio para ${tenant.name} ha sido reactivado bajo suscripción mensual activa ($29 USD/mes). La landing vuelve a recibir tráfico de forma inmediata.`,
                                () => {},
                                'Aceptar'
                              );
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-[11px] hover:bg-emerald-400 transition-all flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Reactivar Servicio (Pago Recibido)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              toggleTenantMicroLanding(tenant.id, 'trial', 90);
                              triggerModal(
                                'Cortesía Renovada (+90 Días)',
                                `Se ha reactivado el período de cortesía de 3 meses (90 días) para ${tenant.name}.`,
                                () => {},
                                'Aceptar'
                              );
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-panel)] border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 font-bold text-[10px] transition-all"
                          >
                            <span>🎁 Reset 90d</span>
                          </button>
                        </>
                      ) : (
                        <>
                          {tenant.microLandingStatus === 'trial' && (
                            <button
                              type="button"
                              onClick={() => {
                                const currentDays = tenant.microLandingTrialDaysLeft || 90;
                                toggleTenantMicroLanding(tenant.id, 'trial', currentDays + 30);
                                triggerModal(
                                  'Período Extendido +30 Días',
                                  `Se otorgaron 30 días adicionales de cortesía para ${tenant.name}. Total: ${currentDays + 30} días restantes.`,
                                  () => {},
                                  'Aceptar'
                                );
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-neon font-bold text-[10px] transition-all"
                            >
                              <span>+30 Días Gracia</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              toggleTenantMicroLanding(tenant.id, 'suspended');
                              triggerModal(
                                'Micro-Landing Suspendida',
                                `El servicio de micro-landing para ${tenant.name} fue suspendido por falta de pago. Los visitantes a /m/${tenant.microLandingSlug || tenant.id} verán la pantalla de reactivación/renovación.`,
                                () => {},
                                'Entendido'
                              );
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-[11px] transition-all flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>Pausar / Suspender por Falta de Pago</span>
                          </button>
                        </>
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
      {/* VISTA 2: ADMINISTRADOR — WIZARD DE ALTA CON TAXONOMÍA COMPLETA DE GIROS   */}
      {/* ========================================================================= */}
      {isAdmin && adminViewMode === 'wizard' && (
        <div className="vector-bg-card vector-border rounded-2xl p-4 sm:p-6 lg:p-8 w-full shadow-2xl space-y-8 animate-fade-in">

          {/* Step Breadcrumbs: 6 Pasos Limpios y Modulares */}
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 font-mono text-xs overflow-x-auto gap-2">
            {[
              { num: 1, title: '1. Giro & IA' },
              { num: 2, title: '2. Entidad & Web' },
              { num: 3, title: '3. Marketing & Tracking' },
              { num: 4, title: '4. Agenda & Horarios' },
              { num: 5, title: '5. Pilares RAG' },
              { num: 6, title: '6. Reglas & Despliegue' },
            ].map((st) => (
              <button
                key={st.num}
                type="button"
                onClick={() => setCurrentStep(st.num)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-bold ${
                  currentStep === st.num
                    ? 'bg-neon text-black shadow-neon-sm'
                    : currentStep > st.num
                    ? 'text-emerald-500 dark:text-emerald-400 hover:text-[var(--text-main)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {st.title}
              </button>
            ))}
          </div>

          {/* ============================================================= */}
          {/* PASO 1: Giro Comercial del Negocio & Acelerador con IA       */}
          {/* ============================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                      <Target className="w-5 h-5 text-neon" />
                      <span>Paso 1: Giro Comercial del Negocio & Acelerador con IA</span>
                    </h3>
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
                    <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-neon" />
                      <span>Paso 2: Entidad del Negocio & Presencia Web</span>
                    </h3>
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
                        <span>Teléfono / WhatsApp de Escalación (HITL)</span>
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
                                ● Add-On Monetizable
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
                          ● Cortesía 3 Meses Activa
                        </span>
                      </div>

                      {/* Aviso Informativo & Cortesía 3 Meses */}
                      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                              🎁 3 Meses de Cortesía Incluidos
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                              Activo
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                            Tu Micro-Landing se aprovisiona automáticamente con este registro. Al concluir tu período de cortesía, o si deseas adquirirla de forma definitiva o personalizada, comunícate con tu asesor Vector Inside.
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
                              placeholder={(wizardData.businessName || 'tu-negocio').toLowerCase().replace(/[^a-z0-9]/g, '-')}
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
                    <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                      <Target className="w-5 h-5 text-neon" />
                      <span>Paso 2: Marketing, Tracking & Modelo Comercial</span>
                    </h3>
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
                          placeholder="G-XXXXXXXXXX"
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
                          placeholder="123456789012345"
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
                          value={wizardData.monthlyAdBudget || 1500}
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
                    <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                      <Clock className="w-5 h-5 text-neon" />
                      <span>Paso 3: Agenda & Disponibilidad Comercial</span>
                    </h3>
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
                      placeholder="c_tenant@group.calendar.google.com"
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
                      <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                        <Database className="w-5 h-5 text-neon" />
                        <span>Paso 4: Configuración de los 4 Pilares RAG</span>
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                        <strong className="text-cyan-500 dark:text-cyan-400">Pilar 2 (Brandbook) es obligatorio</strong>. Los demás son opcionales y adaptados a {currentVerticalObj.name}.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Pilar 2 */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border-2 border-cyan-400/80 space-y-3">
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
                        Personalidad, tono y arquetipo para {currentVerticalObj.name}.
                      </p>
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] block font-mono">Tono de Voz</label>
                        <input
                          type="text"
                          value={wizardData.brandTone}
                          onChange={(e) => setWizardData({ ...wizardData, brandTone: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg p-2 text-xs text-[var(--text-main)] font-mono focus:border-cyan-400 outline-none"
                        />
                      </div>
                    </div>

                    {/* Propuesta Comercial */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border-2 border-neon/70 space-y-3">
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
                        <label className="text-[9px] text-[var(--text-muted)] font-mono block">Gancho del Mes / Lead Magnet</label>
                        <input
                          type="text"
                          value={wizardData.offerHook}
                          onChange={(e) => setWizardData({ ...wizardData, offerHook: e.target.value })}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--border-color)] rounded p-1.5 text-[11px] text-[var(--text-main)] font-mono focus:border-neon outline-none"
                        />
                      </div>
                    </div>

                    {/* Pilar 1 */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                      <span className="text-xs font-mono font-bold text-neon flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" /> PILAR 1: Precios & Membresías
                      </span>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {currentVerticalObj.pillars.pilar1.label}
                      </p>
                    </div>

                    {/* Pilar 3 */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                      <span className="text-xs font-mono font-bold text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> PILAR 3: Políticas & FAQs
                      </span>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {currentVerticalObj.pillars.pilar3.label}
                      </p>
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
                    <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                      <Shield className="w-5 h-5 text-neon" />
                      <span>Paso 6: Gobernanza, Reglas Inviolables & Despliegue RLS</span>
                    </h3>
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

                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-lg font-black text-[var(--text-main)] uppercase flex items-center gap-2">
                      <Shield className="w-5 h-5 text-neon" />
                      <span>Paso 5: Reglas Inviolables del Negocio</span>
                    </h3>
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

                  {/* Bloque 2: Resumen Ejecutivo & Inspector JSON */}
                                    <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-neon/30 space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                      <div className="flex items-center gap-3">
                        <VectorLobo size={32} showStatus={true} status="active" />
                        <div>
                          <span className="text-[var(--text-main)] font-bold block">Auditoría Previa Lobo Vectorial</span>
                          <span className="text-[10px] text-[var(--text-muted)]">Parámetros de memoria RAG y blindaje RLS (ADR-001)</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-neon/15 text-neon font-bold border border-neon/30 text-[10px]">
                        IFV Esperado: 48/50
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[var(--text-muted)] block text-[10px] uppercase">Negocio & Razón Social</span>
                        <span className="text-[var(--text-main)] font-bold text-sm">{wizardData.businessName || 'Nuevo Negocio'}</span>
                        <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">{wizardData.legalNameTaxId || 'RFC / Tax ID por verificar'}</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block text-[10px] uppercase">Giro Comercial</span>
                        <span className="text-neon font-bold text-sm">{currentVerticalObj.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Meta: {currentVerticalObj.conversionGoal?.split('/')[0]}</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block text-[10px] uppercase">Estrategia Digital</span>
                        {wizardData.hasWebsite ? (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              CON Sitio Web
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] truncate">
                              {wizardData.websiteUrl || 'https://negocio.com'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                              <Smartphone className="w-3 h-3" />
                              SIN Sitio Web (Directo a WhatsApp)
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block text-[10px] uppercase">Agenda & Conversión</span>
                        <span className="text-[var(--text-main)] font-bold block mt-1">
                          Google Calendar: {wizardData.appointmentDuration || 45} min / cita
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Costo Unitario Lead Calificado: ${wizardData.costPerQualifiedLead || 350} MXN
                        </span>
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
                          <span className="text-[10px] text-[var(--text-muted)]">Endpoint: POST /api/v1/tenants/onboard (ADR-001 §2.7)</span>
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
