/**
 * Catálogo Maestro de Tours Guiados y Adopción Contextual para Vector Community OS
 *
 * Niveles de Adopción:
 * Nivel 1: Tour Global de Navegación (Sidebar & Header por Rol)
 * Nivel 2: Tours de Módulos y Subpestañas por Ruta (Dashboard, CRM, Planner, Inbox, Triage, Agenda, Team, etc.)
 * Nivel 3: Playbooks Operativos (Guía Paso a Paso de Alta de Negocio en 6 Pasos, Micro-Guías por Paso)
 */

export const GLOBAL_SHELL_TOURS = {
  SUPER_ADMIN: [
    {
      element: '#tour-brand-header',
      popover: {
        title: '⚡ Centro de Mando Maestro',
        description: 'Bienvenido, Edgar Lobo Vectorial. Como Super Admin tienes la dirección completa y supervisión global de todos los negocios, la agencia y la gobernanza del sistema.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-tenant-switcher',
      popover: {
        title: '🏢 Conmutador Multi-Tenant Universal',
        description: 'Supervisa y conéctate instantáneamente al espacio de cualquier cliente registrado, visualizando el estado operativo de su IA (Activa / Pausada) en tiempo real.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-tutor-trigger',
      popover: {
        title: '🎓 Tutor IA & Centro de Guías',
        description: 'Tu copiloto de adopción. Haz clic aquí en cualquier pantalla para aprender cómo funciona ese módulo o para iniciar guías paso a paso como el alta de un negocio.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#tour-nav-overview',
      popover: {
        title: '📊 Pulso Operativo & Deck de Negocios',
        description: 'Monitorea las 4 cohortes vitales (Contactos, Contactabilidad, Leads Calificados y Ventas Ganadas), junto con el Kill-Switch de IA 1-Click.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-crm',
      popover: {
        title: '🎯 Suite Comercial & Re-contacto 24h',
        description: 'Kanban comercial de prospectos, valor proyectado del pipeline y motor autónomo de reactivación a las 24 horas para prospectos inactivos.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-inbox',
      popover: {
        title: '💬 Conversaciones & Triaje HITL',
        description: 'Bandeja omnicanal en vivo (WhatsApp, Meta). Supervisa la cuenta regresiva de SLA y activa el Takeover humano cuando se requiera.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-agenda',
      popover: {
        title: '📅 Master Agenda & Sincronización Móvil',
        description: 'Calendario centralizado de citas generadas por la IA, sincronización con Google Calendar y turnos semanales de atención.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-campaigns',
      popover: {
        title: '📢 Campañas & Copilot IA',
        description: 'Planificación de campañas con IA, auditoría de gasto publicitario contra citas generadas y generación de ángulos creativos.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-results',
      popover: {
        title: '📈 Soberanía Financiera & ROAS Real',
        description: 'Auditoría financiera de atribución estricta: MER, CAC, LTV y radar de prospectos auditados para juntas de consejo y clientes.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-connections',
      popover: {
        title: '🔌 Conexiones, RAG & Alta de Negocios',
        description: 'Centro neurálgico: alta de nuevos negocios en 6 pasos con IA, gestión de los 4 Pilares RAG, sub-bots especializados y canales oficiales.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-team',
      popover: {
        title: '🛡️ Consola de Equipo, Clientes & Auditoría',
        description: 'Despacha credenciales 1:1 a dueños de negocio por WhatsApp/Correo, gestiona el staff de la agencia y consulta registros forenses.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-notifications',
      popover: {
        title: '🔔 Centro de Notificaciones Cross-Tenant',
        description: 'Alertas inmediatas de todas las empresas. Un clic en una alerta te traslada automáticamente al negocio y chat correspondiente.',
        side: 'bottom',
        align: 'end',
      },
    },
    {
      element: '#tour-user-menu',
      popover: {
        title: '👤 Perfil Ejecutivo & Ajustes',
        description: 'Accede a tu teléfono de guardia HITL, credenciales de seguridad, cambio de contraseña y preferencias del sistema.',
        side: 'bottom',
        align: 'end',
      },
    },
  ],

  ADMIN: [
    {
      element: '#tour-brand-header',
      popover: {
        title: '🚀 Consola Operativa de Negocios',
        description: 'Bienvenido al panel de administración. Aquí coordinas la operación comercial, los prospectos y el rendimiento de los negocios asignados.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-tenant-switcher',
      popover: {
        title: '🏢 Tus Negocios Asignados',
        description: 'Alterna entre los clientes a tu cargo para revisar sus métricas, conversaciones e intervenciones humanas en tiempo real.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-tutor-trigger',
      popover: {
        title: '🎓 Tutor IA & Guías',
        description: 'Accede a guías interactivas para cada pantalla y aprende cómo operar cada herramienta en cualquier momento.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#tour-nav-overview',
      popover: {
        title: '📊 Centro de Mando & Supervisión',
        description: 'Pulso de contactos, citas y alertas operativas de tus clientes en tiempo real.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-crm',
      popover: {
        title: '🎯 CRM Comercial & Re-contacto 24h',
        description: 'Acompaña a los prospectos en el embudo comercial y rescata oportunidades antes del cierre de ventana de Meta.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-inbox',
      popover: {
        title: '💬 Conversaciones & Intervención Humana',
        description: 'Responde chats cuando el bot lo solicite o toma el control manual para cerrar ventas de alto valor.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-agenda',
      popover: {
        title: '📅 Agenda & Citas Confirmadas',
        description: 'Verifica la disponibilidad, reprograma citas y supervisa la asistencia de los prospectos.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-campaigns',
      popover: {
        title: '📢 Campañas & Ofertas de la Empresa',
        description: 'Revisa qué anuncios y promociones están activas para alinear la comunicación de ventas.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-team',
      popover: {
        title: '🔑 Gestión de Accesos 1:1 a Clientes',
        description: 'Genera y envía accesos seguros a los dueños de negocio para que revisen sus resultados.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-user-menu',
      popover: {
        title: '👤 Tu Perfil & Teléfono de Guardia',
        description: 'Mantén tu número de WhatsApp actualizado para recibir escalaciones urgentes de clientes.',
        side: 'bottom',
        align: 'end',
      },
    },
  ],

  CLIENT_OWNER: [
    {
      element: '#tour-brand-header',
      popover: {
        title: '✨ Bienvenido al Portal de tu Negocio',
        description: 'Esta es tu cabina de control. Aquí puedes ver en tiempo real cómo la IA califica prospectos, agenda citas y potencia tus ventas.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-tutor-trigger',
      popover: {
        title: '🎓 Tu Tutor Digital',
        description: '¿Tienes dudas sobre cómo usar alguna pantalla? Haz clic aquí y el Tutor te guiará paso a paso.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#tour-nav-overview',
      popover: {
        title: '📊 Centro de Mando en Tiempo Real',
        description: 'Resumen ejecutivo de contactos generados, citas y estado operativo del sistema.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-crm',
      popover: {
        title: '🎯 Prospectos & Clientes Potenciales',
        description: 'Descubre quiénes han mostrado interés, sus datos de contacto y el nivel de interés calificado por la IA.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-inbox',
      popover: {
        title: '💬 Conversaciones en Vivo',
        description: 'Lee las conversaciones que la IA mantiene con tus clientes y participa cuando desees intervenir personalmente.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-agenda',
      popover: {
        title: '📅 Citas Agendadas & Calendario',
        description: 'Tus citas confirmadas listas para atender, sincronizadas con Google Calendar.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-results',
      popover: {
        title: '📈 Resultados & Retorno de Inversión',
        description: 'Métricas claras y transparentes del valor que la tecnología está aportando a tu facturación.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-nav-profile',
      popover: {
        title: '🏢 Perfil de tu Empresa & ADN',
        description: 'Consulta los 4 Pilares de tu Base de Conocimiento y solicita ajustes a tus precios o políticas.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#tour-user-menu',
      popover: {
        title: '🔒 Seguridad & Contraseña',
        description: 'Cambia tu contraseña provisional por una definitiva y gestiona la seguridad de tu acceso.',
        side: 'bottom',
        align: 'end',
      },
    },
  ],
};

/**
 * PLAYBOOK: Guía Completa de Alta de Negocio en 6 Pasos (RAGWizard)
 */
export const WIZARD_6_STEPS_TOUR = [
  {
    stepNum: 1,
    element: '#tour-wizard-stepper',
    popover: {
      title: '🚀 Alta de Negocio en 6 Pasos con IA',
      description: 'Bienvenido al Asistente Maestro de Onboarding. En 6 pasos calibrarás la IA, la entidad legal, el calendario, los 4 Pilares RAG y el despliegue del enjambre.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    stepNum: 1,
    element: '#tour-wizard-step1-catalog',
    popover: {
      title: 'Paso 1A · Catálogo de 17 Giros Comerciales',
      description: 'Selecciona la vertical de tu negocio (Clínicas, B2B, Restaurantes, etc.). Al elegirla, el sistema autocalibra la meta comercial, duración de citas, arquetipo y reglas sugeridas.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    stepNum: 1,
    element: '#tour-wizard-step1-ai-accelerator',
    popover: {
      title: 'Paso 1B · Acelerador 1-Click con DeepSeek IA',
      description: '¿Tienes un manual, brandbook, catálogo o brief en PDF, Word o texto? Arrástralo aquí y pulsa "Auto-Clasificar con IA". El motor extraerá los datos reales y pre-llenará los 6 pasos.',
      side: 'top',
      align: 'start',
    },
  },
  {
    stepNum: 1,
    element: '#tour-wizard-step1-next',
    targetStep: 2,
    popover: {
      title: 'Paso 1C · Validación y Avance',
      description: 'Una vez seleccionado el giro (o ejecutada la auto-extracción con IA), haz clic aquí para avanzar al Paso 2.',
      side: 'top',
      align: 'end',
    },
  },
  {
    stepNum: 2,
    element: '#tour-wizard-step2-identity',
    popover: {
      title: 'Paso 2A · Entidad del Negocio & Contacto HITL',
      description: 'Aquí registras la identidad corporativa. NOTA CLAVE: "Nombre Comercial" y "Teléfono WhatsApp / Escalación Humana (HITL)" son los dos únicos campos estrictamente obligatorios para el despliegue.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    stepNum: 2,
    element: '#tour-wizard-step2-microlanding',
    popover: {
      title: 'Paso 2B · Micro-Landing Universal `/m/[slug]`',
      description: 'Tu negocio incluye una Micro-Landing ultraligera aprovisionada automáticamente para pauta en redes y tráfico directo a WhatsApp. Puedes personalizar su slug aquí.',
      side: 'top',
      align: 'start',
    },
  },
  {
    stepNum: 2,
    element: '#tour-wizard-step2-website-toggle',
    targetStep: 3,
    popover: {
      title: 'Paso 2C · Sitio Web Oficial vs. WhatsApp Directo',
      description: 'Elige si el negocio cuenta con sitio web oficial para telemetría GA4/SEO o si opera 100% directo a WhatsApp con la Micro-Landing. Pulsa "Siguiente" para continuar.',
      side: 'top',
      align: 'start',
    },
  },
  {
    stepNum: 3,
    element: '#tour-wizard-step3-pixels',
    popover: {
      title: 'Paso 3A · Telemetría y Píxeles de Conversión',
      description: 'Conecta Google Analytics 4 (G-XXXX) y Meta Pixel ID / CAPI Dataset para enviar eventos de conversión y rastrear de dónde proviene cada cliente.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    stepNum: 3,
    element: '#tour-wizard-step3-billing',
    targetStep: 4,
    popover: {
      title: 'Paso 3B · Modelo Comercial Pay-Per-Lead ($350 MXN)',
      description: 'Define el presupuesto publicitario mensual de Meta Ads y revisa el esquema comercial de $350 MXN por prospecto calificado bajo la regla estricta de 4/4 criterios AND.',
      side: 'top',
      align: 'start',
    },
  },
  {
    stepNum: 4,
    element: '#tour-wizard-step4-gcal',
    popover: {
      title: 'Paso 4A · Google Calendar Master ID',
      description: 'Ingresa el ID del Google Calendar donde el agente IA verificará disponibilidad y agendará las citas confirmadas de tus clientes en tiempo real.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    stepNum: 4,
    element: '#tour-wizard-step4-schedule',
    targetStep: 5,
    popover: {
      title: 'Paso 4B · Configurador Libre de Horarios & Turnos',
      description: 'Personaliza días hábiles, agrega turnos libres con "+ Agregar Turno", define la duración por cita (ej. 30m, 45m) y la capacidad de atención en paralelo.',
      side: 'top',
      align: 'start',
    },
  },
  {
    stepNum: 5,
    element: '#tour-wizard-step5-audit',
    popover: {
      title: 'Paso 5A · Auditoría Semántica & Health Score RAG',
      description: 'El monitor evalúa la solidez del conocimiento del negocio de 0% a 100%. Si detecta deficiencias, puedes pulsar "Resolver" para que la IA sugiera el contenido.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    stepNum: 5,
    element: '#tour-wizard-step5-pilar2-offer',
    popover: {
      title: 'Paso 5B · Pilar 2 (Brandbook) & Propuesta Comercial',
      description: 'Pilar 2 (Identidad & Tono) es OBLIGATORIO: define cómo habla tu marca. La Propuesta Comercial define el gancho o promoción del mes para la captación.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    stepNum: 5,
    element: '#tour-wizard-step5-pilar1-pilar3',
    popover: {
      title: 'Paso 5C · Pilar 1 (Tarifas) & Pilar 3 (Políticas/FAQs)',
      description: 'Ingresa tus precios base y tus políticas de cancelación, garantías y manejo de contingencias. Puedes redactarlos en texto o subir archivos PDF/DOCX.',
      side: 'top',
      align: 'start',
    },
  },
  {
    stepNum: 5,
    element: '#tour-wizard-step5-pilar4',
    targetStep: 6,
    popover: {
      title: 'Paso 5D · Pilar 4 (Casos de Éxito & 4 Criterios AND)',
      description: 'La prueba social y la matriz de calificación que garantiza que solo se cobren prospectos de alta intención comercial. Pulsa "Siguiente" para ir a Gobernanza.',
      side: 'top',
      align: 'start',
    },
  },
  {
    stepNum: 6,
    element: '#tour-wizard-step6-rules',
    popover: {
      title: 'Paso 6A · Reglas Inviolables & Guardrails',
      description: 'Límites estrictos que el bot JAMÁS romperá (ej. no inventar precios, confidencialidad, no dar diagnósticos médicos sin cita). Puedes cargar sugerencias o añadir reglas propias.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    stepNum: 6,
    element: '#tour-wizard-step6-summary',
    popover: {
      title: 'Paso 6B · Auditoría Pre-Despliegue e Inspector JSON',
      description: 'Revisión final de los 6 bloques. Puedes inspeccionar o copiar el payload JSON oficial antes de crear el tenant en base de datos.',
      side: 'top',
      align: 'start',
    },
  },
  {
    stepNum: 6,
    element: '#tour-wizard-step6-deploy',
    popover: {
      title: 'Paso 6C · ¡Desplegar Enjambre & Activar RLS!',
      description: 'Al hacer clic aquí, el sistema crea el tenant con aislamiento criptográfico, aprovisiona los sub-bots, activa la Micro-Landing y deja el negocio listo para operar.',
      side: 'top',
      align: 'end',
    },
  },
];

/**
 * MICRO-TOURS: Guía Focalizada por Paso del Wizard
 */
export const WIZARD_STEP_TOURS = {
  step_1: [
    {
      element: '#tour-wizard-step1-catalog',
      popover: {
        title: '🎯 Paso 1: Giro Comercial del Negocio',
        description: 'Elige el sector de tu empresa entre las 17 verticales oficiales. Usa los filtros de categoría o el buscador. Esto pre-calibra los pilares y metas del bot.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-wizard-step1-ai-accelerator',
      popover: {
        title: '⚡ Acelerador 1-Click con DeepSeek IA',
        description: 'Sube un PDF, Word o pega un texto con información de tu empresa. La IA leerá el documento y autocompletará los 6 pasos automáticamente.',
        side: 'top',
      },
    },
    {
      element: '#tour-wizard-step1-next',
      popover: {
        title: '➡️ Continuar al Paso 2',
        description: 'Asegúrate de tener un giro seleccionado antes de hacer clic en Siguiente.',
        side: 'top',
      },
    },
  ],

  step_2: [
    {
      element: '#tour-wizard-step2-identity',
      popover: {
        title: '🏢 Paso 2: Entidad Legal y Contacto',
        description: 'Nombre Comercial y Teléfono WhatsApp HITL son estrictamente obligatorios. El teléfono HITL recibirá las notificaciones urgentes de prospectos.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-wizard-step2-microlanding',
      popover: {
        title: '🌐 Tu Micro-Landing Universal',
        description: 'Cada negocio incluye una landing ultraligera /m/[slug] con Meta CAPI listo para pauta. Puedes personalizar el slug aquí.',
        side: 'top',
      },
    },
    {
      element: '#tour-wizard-step2-website-toggle',
      popover: {
        title: '🔗 Conexión de Sitio Web Oficial',
        description: 'Si tienes un sitio web existente, conéctalo aquí para auditoría de tráfico y telemetría GA4.',
        side: 'top',
      },
    },
  ],

  step_3: [
    {
      element: '#tour-wizard-step3-pixels',
      popover: {
        title: '📊 Paso 3: Píxeles de Conversión',
        description: 'Integra GA4 Measurement ID y Meta Pixel ID para medir visitas y conversiones de tus campañas.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-wizard-step3-billing',
      popover: {
        title: '💰 Modelo Comercial Pay-Per-Lead',
        description: 'Esquema de $350 MXN por lead calificado con regla estricta de 4/4 criterios AND y presupuesto publicitario estimado.',
        side: 'top',
      },
    },
  ],

  step_4: [
    {
      element: '#tour-wizard-step4-gcal',
      popover: {
        title: '📅 Paso 4: Google Calendar 2-Way Sync',
        description: 'Ingresa el ID del Google Calendar para consultar disponibilidad en vivo y agendar citas sin empalmes.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-wizard-step4-schedule',
      popover: {
        title: '⏱️ Disponibilidad & Turnos Dinámicos',
        description: 'Selecciona los días hábiles, añade múltiples turnos de atención y ajusta la duración de cada cita y citas simultáneas.',
        side: 'top',
      },
    },
  ],

  step_5: [
    {
      element: '#tour-wizard-step5-audit',
      popover: {
        title: '🧠 Paso 5: Salud Semántica RAG (0-100%)',
        description: 'Auditoría en tiempo real de la base de conocimiento del bot. Resuelve huecos de información en 1 clic.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-wizard-step5-pilar2-offer',
      popover: {
        title: '⭐ Pilar 2 (Brandbook) & Oferta Comercial',
        description: 'El Pilar 2 es obligatorio para definir el tono de voz del asistente. La Oferta Comercial define la promoción de bienvenida.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-wizard-step5-pilar1-pilar3',
      popover: {
        title: '📋 Pilar 1 (Precios) & Pilar 3 (Políticas)',
        description: 'Ingresa tus tarifas oficiales y las preguntas frecuentes sobre cancelaciones, garantías y métodos de pago.',
        side: 'top',
      },
    },
    {
      element: '#tour-wizard-step5-pilar4',
      popover: {
        title: '🏆 Pilar 4 (Casos de Éxito & Criterios AND)',
        description: 'Prueba social y matriz de calificación de 4 requisitos para asegurar que solo prospectos calificados sean facturables.',
        side: 'top',
      },
    },
  ],

  step_6: [
    {
      element: '#tour-wizard-step6-rules',
      popover: {
        title: '🛡️ Paso 6: Reglas Inviolables',
        description: 'Mandamientos estrictos que el bot no puede violar bajo ninguna circunstancia. Puedes cargar sugerencias del giro o agregar nuevas.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-wizard-step6-summary',
      popover: {
        title: '📑 Auditoría Ejecutiva Pre-Despliegue',
        description: 'Comprueba el resumen de los 6 pasos y revisa el inspector JSON para confirmar que todos los datos sean correctos.',
        side: 'top',
      },
    },
    {
      element: '#tour-wizard-step6-deploy',
      popover: {
        title: '🚀 Desplegar Enjambre & Activar Negocio',
        description: 'Haz clic aquí para crear el tenant, aprovisionar las credenciales y activar el bot en vivo.',
        side: 'top',
      },
    },
  ],
};

/**
 * TOUR: Las 4 Subpestañas de SystemConfigHub (/connections y /config)
 */
export const SYSTEM_CONFIG_TABS_TOUR = [
  {
    element: '#tour-config-header',
    popover: {
      title: '⚙️ Centro de Configuración & Políticas',
      description: 'Aquí administras la base de conocimiento RAG, los motores de IA (DeepSeek/Groq), las políticas comerciales y las conexiones omnicanal.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#tour-btn-new-business',
    popover: {
      title: '🚀 Alta Nuevo Negocio',
      description: 'Inicia el asistente guiado de 6 pasos para registrar un nuevo cliente, indexar su manual y desplegar sus agentes IA.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '#tour-config-tabs',
    popover: {
      title: '🧩 Las 4 Subpestañas del Sistema',
      description: '1. Multi-Tenant RAG (4 Pilares)\n2. Motores & Sub-Bots AI\n3. Reglas de Negocio & Precios\n4. Canales & APIs Oficiales',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#tour-tab-rag',
    targetTab: 'rag',
    popover: {
      title: '1. Multi-Tenant RAG (4 Pilares)',
      description: 'Deck de negocios registrados, semáforo de salud RAG por empresa, gestión de Micro-Landings y acceso a la base de conocimiento.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#tour-tab-subbots',
    targetTab: 'subbots',
    popover: {
      title: '2. Motores & Sub-Bots AI',
      description: 'Configura qué modelo de IA procesa cada tarea (DeepSeek V3/R1, OpenAI, Claude, Groq), prueba en Sandbox interactivo y gestiona tus API Keys con Test Ping.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#tour-tab-policies',
    targetTab: 'policies',
    popover: {
      title: '3. Reglas de Negocio & Precios',
      description: 'Control de cobro Pay-Per-Lead ($350 MXN), simulador interactivo de los 4 Criterios Antifraude y Centinela de Crisis con desconexión en 0ms.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#tour-tab-channels',
    targetTab: 'channels',
    popover: {
      title: '4. Canales & APIs Oficiales',
      description: 'Conecta WhatsApp Cloud API, Meta Pixel CAPI, Instagram DM y calendarios con guías paso a paso y prueba de Webhooks en vivo.',
      side: 'bottom',
      align: 'start',
    },
  },
];

/**
 * TOURS OPERATIVOS POR RUTA (Dashboard, CRM, Planner, Inbox, Triage, Agenda, Team, Contactability, Results, Lab)
 */
export const ROUTE_OPERATIONAL_TOURS = {
  '/dashboard': [
    {
      element: '#tour-kpi-cards',
      popover: {
        title: '📊 Cohorte Operativa Mensual',
        description: 'Monitorea las 4 métricas vitales: Contactos Nuevos, Tasa de Contactabilidad, Leads Calificados y Ventas Ganadas con barra de meta.',
        side: 'bottom',
      },
    },
    {
      element: '#deck-negocios',
      popover: {
        title: '🏢 Deck de Negocios & Kill-Switch 1-Click',
        description: 'Supervisa todas las empresas, filtra por estado, pausa o activa la IA en 1 clic y abre el cajón lateral para ajustar tarifas por lead.',
        side: 'top',
      },
    },
  ],

  '/crm': [
    {
      element: '#tariffInput',
      popover: {
        title: '💰 Valor Unitario del Lead Calificado',
        description: 'Define cuánto vale cada prospecto calificado en este negocio para calcular el valor total del pipeline en tiempo real.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-crm-tabs',
      popover: {
        title: '🎯 Las 3 Pestañas de la Suite Comercial',
        description: '1. Embudo Kanban de 5 columnas\n2. Estudio de Contenido Inteligente\n3. Buyer Persona & Estrategia de 4 Ps',
        side: 'bottom',
      },
    },
  ],

  '/planner': [
    {
      element: '#tour-planner-offer-banner',
      popover: {
        title: '📢 Oferta Comercial del Mes',
        description: 'El ancla de conversión: actualiza aquí la promoción o gancho para que la IA alinee automáticamente todos los guiones de redes sociales.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-planner-tabs',
      popover: {
        title: '🎨 Estudio de Contenido & Laboratorio Viral',
        description: 'Parrilla multiplataforma, Plantilla de ADN de marca (arquetipo, glosario tabú), Laboratorio de Reels Virales y Auditoría de Perfiles.',
        side: 'bottom',
      },
    },
  ],

  '/inbox': [
    {
      element: '#tour-inbox-channels-filter',
      popover: {
        title: '💬 Filtros Omnicanal & SLA de 15 Min',
        description: 'Filtra conversaciones por canal (WhatsApp, Instagram, Facebook, Web) y atiende los chats en cuenta regresiva antes del vencimiento.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-inbox-chat-area',
      popover: {
        title: '🤖 Chat Asistido con DeepSeek R1',
        description: 'Revisa las respuestas automáticas, usa sugerencias de IA en 1 clic, escucha notas de voz y activa el takeover humano cuando sea necesario.',
        side: 'top',
      },
    },
  ],

  '/triage': [
    {
      element: '#tour-triage-tabs',
      popover: {
        title: '⚡ Los 3 Motores del Triage',
        description: '1. Prospectos (Kanban & Sutura Arcángel)\n2. Comentarios Meta (Graph Stream 0ms)\n3. Recuperación 24h (Cola Upstash Redis & Vaca Púrpura)',
        side: 'bottom',
      },
    },
  ],

  '/agenda': [
    {
      element: '#tour-agenda-view-mode-selector',
      popover: {
        title: '📅 Las 4 Vistas de Master Agenda',
        description: 'Alterna entre Mes Completo, Detalle del Día & Turnos, Matriz Semanal de 7 columnas o Lista Auditada.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-agenda-config-btn',
      popover: {
        title: '⚙️ Personalizar Turnos & Email Studio',
        description: 'Configura horarios libres, capacidad simultánea y diseña el correo membretado con archivo .ICS que recibe el cliente al agendar.',
        side: 'left',
      },
    },
  ],

  '/team': [
    {
      element: '#tab-accounts',
      popover: {
        title: '1. Clientes (Dueños de Negocio)',
        description: 'Crea accesos 1:1 para los dueños de empresa y despacha sus contraseñas provisionales por WhatsApp o Correo en 1 clic.',
        side: 'bottom',
      },
    },
    {
      element: '#tab-staff',
      popover: {
        title: '2. Equipo de la Agencia (Staff)',
        description: 'Invita colaboradores, asigna a qué clientes tienen acceso y define quién cubre la guardia HITL.',
        side: 'bottom',
      },
    },
    {
      element: '#tab-governance',
      popover: {
        title: '3. Roles & Auditoría de Seguridad',
        description: 'Matriz estricta de permisos RBAC y registro forense inmutable de inicios de sesión y acciones sensibles.',
        side: 'bottom',
      },
    },
  ],

  '/contactability': [
    {
      element: '#tour-contactability-tabs',
      popover: {
        title: '🌐 Telemetría Dual & Salud Web',
        description: 'Audita el tráfico web tradicional (GA4), la Atribución Publicitaria (ROAS Real con Meta CAPI) y la conversión de la Micro-Landing.',
        side: 'bottom',
      },
    },
  ],

  '/results': [
    {
      element: '#tour-results-financial-kpis',
      popover: {
        title: '📈 Soberanía Financiera (MER, CAC & LTV)',
        description: 'Métricas de rentabilidad real sobre gasto publicitario y radar de prospectos auditados para reportes a clientes.',
        side: 'bottom',
      },
    },
  ],

  '/lab': [
    {
      element: '#tour-lab-view-toggle',
      popover: {
        title: '🧪 Grafo LangGraph & Sub-Agentes IA',
        description: 'Visualiza el flujo entre el Supervisor Lobo Vectorial y los 3 Sub-Agentes especializados (Closer, Reengagement y Analyst).',
        side: 'bottom',
      },
    },
  ],
};

