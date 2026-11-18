/**
 * Catálogo oficial de verticales de negocio, pilares RAG adaptativos y
 * etiquetas dinámicas de los 4 criterios de calificación (ADR-002 & ADR-008 §2.2).
 *
 * Extraído fielmente de `src/components/rag/RAGWizard.jsx` como Single Source of Truth.
 */

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

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const DYNAMIC_CRITERIA_PROFILES = {
  salud: [
    {
      id: 'identity',
      key: 'identityValidated',
      label: 'Criterio 1: Identidad y Contacto del Paciente',
      shortLabel: 'Identidad del Paciente',
      description: 'Nombre completo, correo electrónico y WhatsApp verificados para seguimiento clínico.',
    },
    {
      id: 'catalog',
      key: 'catalogIdentified',
      label: 'Criterio 2: Tratamiento Específico Identificado',
      shortLabel: 'Tratamiento Identificado',
      description: 'Padecimiento, procedimiento o consulta médica/dental seleccionada del catálogo.',
    },
    {
      id: 'financial',
      key: 'financialClarified',
      label: 'Criterio 3: Aranceles y Slot en Agenda Clínica',
      shortLabel: 'Aranceles & Agenda',
      description: 'Costos de valoración, facilidades de pago (MSI) y disponibilidad aclarados.',
    },
    {
      id: 'consent',
      key: 'consentOrBooked',
      label: 'Criterio 4: Cita de Valoración Confirmada',
      shortLabel: 'Cita Registrada',
      description: 'Autorización expresa del paciente y cita registrada en agenda con el especialista.',
    },
  ],
  restaurante: [
    {
      id: 'identity',
      key: 'identityValidated',
      label: 'Criterio 1: Identidad y Contacto del Comensal',
      shortLabel: 'Identidad del Comensal',
      description: 'Nombre completo, correo electrónico y WhatsApp confirmados para reserva.',
    },
    {
      id: 'catalog',
      key: 'catalogIdentified',
      label: 'Criterio 2: Menú / Evento Seleccionado',
      shortLabel: 'Menú o Evento',
      description: 'Número de comensales, ocasión, alergias o paquete gastronómico definido.',
    },
    {
      id: 'financial',
      key: 'financialClarified',
      label: 'Criterio 3: Consumo y Políticas de Mesa',
      shortLabel: 'Consumo & Políticas',
      description: 'Ticket promedio, anticipo requerido y tolerancia de horario aclarados.',
    },
    {
      id: 'consent',
      key: 'consentOrBooked',
      label: 'Criterio 4: Mesa o Turno Reservado',
      shortLabel: 'Mesa Reservada',
      description: 'Confirmación explícita del comensal y mesa bloqueada en el calendario.',
    },
  ],
  fitness: [
    {
      id: 'identity',
      key: 'identityValidated',
      label: 'Criterio 1: Identidad y Contacto del Prospecto',
      shortLabel: 'Identidad Verificada',
      description: 'Nombre completo, correo electrónico y WhatsApp validados (+18 o tutor).',
    },
    {
      id: 'catalog',
      key: 'catalogIdentified',
      label: 'Criterio 2: Meta Física y Plan de Interés',
      shortLabel: 'Meta & Membresía',
      description: 'Disciplina, clase muestra o plan de membresía identificado.',
    },
    {
      id: 'financial',
      key: 'financialClarified',
      label: 'Criterio 3: Tarifas y Horario Compatible',
      shortLabel: 'Tarifas & Horarios',
      description: 'Inscripción, mensualidad, sucursal y horario de entrenamiento aclarados.',
    },
    {
      id: 'consent',
      key: 'consentOrBooked',
      label: 'Criterio 4: Pase de Prueba o Visita Confirmada',
      shortLabel: 'Clase / Visita Agendada',
      description: 'Consentimiento expreso y clase muestra o recorrido agendado en instalaciones.',
    },
  ],
  inmobiliaria: [
    {
      id: 'identity',
      key: 'identityValidated',
      label: 'Criterio 1: Identidad y Contacto del Comprador',
      shortLabel: 'Identidad Verificada',
      description: 'Nombre completo, correo electrónico y WhatsApp confirmados del decisor.',
    },
    {
      id: 'catalog',
      key: 'catalogIdentified',
      label: 'Criterio 2: Propiedad o Unidad de Interés',
      shortLabel: 'Propiedad de Interés',
      description: 'Desarrollo, prototipo, zona o modelo específico seleccionado del inventario.',
    },
    {
      id: 'financial',
      key: 'financialClarified',
      label: 'Criterio 3: Presupuesto y Esquema Financiero',
      shortLabel: 'Enganche & Crédito',
      description: 'Rango de inversión, enganche, crédito hipotecario o financiamiento aclarado.',
    },
    {
      id: 'consent',
      key: 'consentOrBooked',
      label: 'Criterio 4: Visita a Showroom o Cita Confirmada',
      shortLabel: 'Visita Showroom',
      description: 'Autorización clara y recorrido presencial o cita comercial confirmada.',
    },
  ],
  educacion: [
    {
      id: 'identity',
      key: 'identityValidated',
      label: 'Criterio 1: Identidad del Aspirante o Tutor',
      shortLabel: 'Aspirante / Tutor',
      description: 'Nombre completo, correo electrónico y WhatsApp del aspirante o padre/tutor.',
    },
    {
      id: 'catalog',
      key: 'catalogIdentified',
      label: 'Criterio 2: Programa o Curso de Interés',
      shortLabel: 'Programa Académico',
      description: 'Nivel educativo, curso, bootcamp o plan de estudios definido.',
    },
    {
      id: 'financial',
      key: 'financialClarified',
      label: 'Criterio 3: Colegiaturas, Becas y Horarios',
      shortLabel: 'Colegiaturas & Becas',
      description: 'Inscripción, mensualidades, requisitos y modalidad de estudio aclarados.',
    },
    {
      id: 'consent',
      key: 'consentOrBooked',
      label: 'Criterio 4: Sesión de Admisiones o Clase Muestra',
      shortLabel: 'Admisiones / Clase',
      description: 'Confirmación explícita y visita al campus o clase muestra agendada.',
    },
  ],
  b2b: [
    {
      id: 'identity',
      key: 'identityValidated',
      label: 'Criterio 1: Identidad y Contacto Verificados',
      shortLabel: 'Identidad & Contacto',
      description: 'Nombre completo, correo electrónico corporativo y WhatsApp confirmados.',
    },
    {
      id: 'catalog',
      key: 'catalogIdentified',
      label: 'Criterio 2: Alcance o Solución B2B Definida',
      shortLabel: 'Solución B2B',
      description: 'Servicio, requerimiento operativo o solución del catálogo identificada.',
    },
    {
      id: 'financial',
      key: 'financialClarified',
      label: 'Criterio 3: Aclaración Financiera Completa',
      shortLabel: 'Inversión & Alcance',
      description: 'Rangos de inversión, retainers, métodos de pago o tiempos aclarados.',
    },
    {
      id: 'consent',
      key: 'consentOrBooked',
      label: 'Criterio 4: Discovery Call Agendada (BANT)',
      shortLabel: 'Discovery Call',
      description: 'Autorización clara de contacto ejecutivo o sesión estratégica confirmada.',
    },
  ],
};

/**
 * Resuelve la clave canónica de vertical en `BUSINESS_VERTICALS_CONFIG`
 * a partir del objeto tenant.
 *
 * @param {Object|null|undefined} tenant
 * @returns {string}
 */
export function resolveBusinessVerticalKey(tenant) {
  if (!tenant) return 'b2b';

  if (tenant.vertical && BUSINESS_VERTICALS_CONFIG[tenant.vertical]) {
    return tenant.vertical;
  }

  const descriptor = normalizeText(
    [tenant.vertical, tenant.giro, tenant.industry, tenant.verticalLabel]
      .filter(Boolean)
      .join(' ')
  );

  if (!descriptor) return 'b2b';

  if (/dental|odont|clinic|medic|salud|doctor|consultori/.test(descriptor)) {
    return 'service_appointments';
  }
  if (/spa|estetic|belleza|barber/.test(descriptor)) {
    return 'spa_beauty';
  }
  if (/gym|gimnasio|crossfit|fitness|entrena/.test(descriptor)) {
    return 'gym_fitness';
  }
  if (/restaurante|bar|mixolog|gastronom|cafeteria|hospitality|comida/.test(descriptor)) {
    return 'hospitality';
  }
  if (/salon|evento|boda|banquete/.test(descriptor)) {
    return 'event_venues';
  }
  if (/inmobil|bienes raices|desarrollo|departamento|casa|showroom/.test(descriptor)) {
    return 'realestate';
  }
  if (/auto|vehic|agencia|concesionaria|taller mec/.test(descriptor)) {
    return 'automotive';
  }
  if (/escuela|colegio|universidad|campus|admision/.test(descriptor)) {
    return 'education_schools';
  }
  if (/academia|idioma|musica|danza/.test(descriptor)) {
    return 'academies_courses';
  }
  if (/bootcamp|curso|infoproduct/.test(descriptor)) {
    return 'infoproducts_bootcamps';
  }
  if (/ecom|tienda online|d2c|retail/.test(descriptor)) {
    return 'ecommerce';
  }
  if (/ferreter|refaccion|mostrador/.test(descriptor)) {
    return 'local_retail';
  }
  if (/legal|abogad|notari|contad|fiscal/.test(descriptor)) {
    return 'legal_accounting';
  }
  if (/creador|influencer|podcast|streamer/.test(descriptor)) {
    return 'creator';
  }
  if (/network|mastermind/.test(descriptor)) {
    return 'networking_mastermind';
  }
  if (/comunidad|club/.test(descriptor)) {
    return 'community_subscriptions';
  }

  return 'b2b';
}

/**
 * Devuelve las etiquetas dinámicas de los 4 criterios de calificación (`ADR-008 §2.2`)
 * adaptadas al giro del tenant (`salud/dental`, `restaurante/hospitality`,
 * `fitness/gym`, `inmobiliaria`, `educacion`, `b2b/default`).
 *
 * @param {Object|null|undefined} tenant
 * @returns {Array<{id: string, key: string, label: string, shortLabel: string, description: string}>}
 */
export function getDynamicCriteriaLabels(tenant) {
  const verticalKey = resolveBusinessVerticalKey(tenant);
  const descriptor = normalizeText(
    [tenant?.vertical, tenant?.giro, tenant?.industry, tenant?.verticalLabel]
      .filter(Boolean)
      .join(' ')
  );

  let profileKey = 'b2b';

  if (
    verticalKey === 'service_appointments' ||
    verticalKey === 'spa_beauty' ||
    /salud|dental|odont|clinic|medic|spa/.test(descriptor)
  ) {
    profileKey = 'salud';
  } else if (
    verticalKey === 'hospitality' ||
    verticalKey === 'event_venues' ||
    /restaurante|hospitality|gastronom|bar|banquete|evento/.test(descriptor)
  ) {
    profileKey = 'restaurante';
  } else if (
    verticalKey === 'gym_fitness' ||
    /fitness|gym|gimnasio|crossfit/.test(descriptor)
  ) {
    profileKey = 'fitness';
  } else if (
    verticalKey === 'realestate' ||
    /inmobil|bienes raices|realestate|desarrollo/.test(descriptor)
  ) {
    profileKey = 'inmobiliaria';
  } else if (
    verticalKey === 'education_schools' ||
    verticalKey === 'academies_courses' ||
    verticalKey === 'infoproducts_bootcamps' ||
    /educa|escuela|colegio|universidad|academia|bootcamp|curso/.test(descriptor)
  ) {
    profileKey = 'educacion';
  }

  return DYNAMIC_CRITERIA_PROFILES[profileKey].map((item) => ({ ...item }));
}
