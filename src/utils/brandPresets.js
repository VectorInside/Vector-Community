/**
 * Presets de Identidad de Marca y ADN de IA para las 17 Verticales Canónicas (V01-V17)
 * y Tenants de Demostración de Vector Inside.
 */

export const TENANT_BRAND_PRESETS = {
  // -------------------------------------------------------------
  // V01: FITNESS, SALUD & BIENESTAR
  // -------------------------------------------------------------
  gym_fitness: {
    canonicalId: 'V01',
    name: 'Gimnasios, CrossFit & Fitness Studios',
    avatar: '🏋️‍♂️',
    colors: [
      { name: 'Naranja Fuerza', hex: '#EA580C' },
      { name: 'Verde Rendimiento', hex: '#22C55E' },
      { name: 'Negro Hierro', hex: '#18181B' },
      { name: 'Gris Asfalto', hex: '#3F3F46' },
      { name: 'Amarillo Energía', hex: '#EAB308' },
    ],
    defaultTone: 'Enérgico, motivacional, directo y enfocado en disciplina física y resultados medibles',
    defaultPurpose: 'Inspirar y acompañar a nuestra comunidad a alcanzar su máximo potencial físico y mental con instalaciones de primer nivel.',
  },

  // -------------------------------------------------------------
  // V02: CLÍNICAS MÉDICAS & DENTALES
  // -------------------------------------------------------------
  service_appointments: {
    canonicalId: 'V02',
    name: 'Clínicas Médicas, Dentales & Consultorios',
    avatar: '🦷',
    colors: [
      { name: 'Azul Clínico', hex: '#0284C7' },
      { name: 'Celeste Médico', hex: '#38BDF8' },
      { name: 'Blanco Puro', hex: '#F0F9FF' },
      { name: 'Esmeralda Salud', hex: '#10B981' },
      { name: 'Gris Instrumental', hex: '#334155' },
    ],
    defaultTone: 'Cálido, profesional, empático y médico-clínico (sin tecnicismos alarmistas)',
    defaultPurpose: 'Democratizar la salud y el bienestar integral con tecnología avanzada, sin dolor y con máxima empatía hacia el paciente.',
  },

  // -------------------------------------------------------------
  // V03: SPAS, ESTÉTICA & BARBERÍAS
  // -------------------------------------------------------------
  spa_beauty: {
    canonicalId: 'V03',
    name: 'Spas, Clínicas Estéticas & Barberías',
    avatar: '✨',
    colors: [
      { name: 'Rosa Palo', hex: '#F472B6' },
      { name: 'Lavanda Zen', hex: '#C084FC' },
      { name: 'Oro Suave', hex: '#FBBF24' },
      { name: 'Carbón Seda', hex: '#27272A' },
      { name: 'Blanco Nácar', hex: '#FAF5FF' },
    ],
    defaultTone: 'Sensorial, relajante, refinado, empático y enfocado en bienestar y belleza integral',
    defaultPurpose: 'Ofrecer un santuario de desconexión, cuidado personal y rejuvenecimiento con atención holística y personalizada.',
  },

  // -------------------------------------------------------------
  // V04: EDUCACIÓN & COLEGIOS
  // -------------------------------------------------------------
  education_schools: {
    canonicalId: 'V04',
    name: 'Escuelas, Colegios & Universidades',
    avatar: '🏫',
    colors: [
      { name: 'Azul Real', hex: '#1D4ED8' },
      { name: 'Ámbar Sabiduría', hex: '#F59E0B' },
      { name: 'Verde Esperanza', hex: '#16A34A' },
      { name: 'Azul Marino', hex: '#1E3A8A' },
      { name: 'Crema Marfil', hex: '#FFFBEB' },
    ],
    defaultTone: 'Institucional, formativo, empático con padres de familia y enfocado en valores y excelencia académica',
    defaultPurpose: 'Formar líderes del mañana con pensamiento crítico, calidez humana e innovación pedagógica integral.',
  },

  // -------------------------------------------------------------
  // V05: ACADEMIAS DE IDIOMAS, MÚSICA & ARTES
  // -------------------------------------------------------------
  academies_courses: {
    canonicalId: 'V05',
    name: 'Academias de Idiomas, Música, Danza & Talleres',
    avatar: '🎨',
    colors: [
      { name: 'Violeta Creativo', hex: '#7C3AED' },
      { name: 'Coral Expresivo', hex: '#FB7185' },
      { name: 'Turquesa Mente', hex: '#06B6D4' },
      { name: 'Grafito Carbón', hex: '#1E293B' },
      { name: 'Blanco Nieve', hex: '#FFFFFF' },
    ],
    defaultTone: 'Inspirador, motivador, didáctico y enfocado en el progreso tangible y la satisfacción creativa',
    defaultPurpose: 'Desbloquear el talento y habilidades prácticas de las personas mediante métodos dinámicos y mentores apasionados.',
  },

  // -------------------------------------------------------------
  // V06: CURSOS ONLINE & BOOTCAMPS TECH
  // -------------------------------------------------------------
  infoproducts_bootcamps: {
    canonicalId: 'V06',
    name: 'Cursos Online, Bootcamps Tech & Infoproductos',
    avatar: '💻',
    colors: [
      { name: 'Lima Eléctrico', hex: '#84CC16' },
      { name: 'Púrpura Tech', hex: '#9333EA' },
      { name: 'Cyan Neón', hex: '#22D3EE' },
      { name: 'Carbón Terminal', hex: '#0F172A' },
      { name: 'Blanco Código', hex: '#F8FAFC' },
    ],
    defaultTone: 'Disruptivo, directo, persuasivo, ágil y enfocado en empleabilidad y retorno de inversión educativa',
    defaultPurpose: 'Cerrar la brecha laboral tecnológica transformando profesionistas con habilidades prácticas y de alta demanda.',
  },

  // -------------------------------------------------------------
  // V07: NETWORKING & MASTERMINDS
  // -------------------------------------------------------------
  networking_mastermind: {
    canonicalId: 'V07',
    name: 'Redes de Networking, Cámaras & Masterminds',
    avatar: '🤝',
    colors: [
      { name: 'Oro Platino', hex: '#D97706' },
      { name: 'Azul Medianoche', hex: '#0F172A' },
      { name: 'Titanio Mate', hex: '#475569' },
      { name: 'Bronce Pulido', hex: '#B45309' },
      { name: 'Mármol Blanco', hex: '#F8FAFC' },
    ],
    defaultTone: 'Exclusivo, de alto valor, estratégico y enfocado en sinergia comercial y alianzas de alto calibre',
    defaultPurpose: 'Conectar a los empresarios y tomadores de decisiones más influyentes para multiplicar oportunidades de negocio.',
  },

  // -------------------------------------------------------------
  // V08: COMUNIDADES PRIVADAS & MEMBRESÍAS
  // -------------------------------------------------------------
  community_subscriptions: {
    canonicalId: 'V08',
    name: 'Comunidades de Pago & Clubs Privados',
    avatar: '🌟',
    colors: [
      { name: 'Índigo Club', hex: '#6366F1' },
      { name: 'Esmeralda Membresía', hex: '#10B981' },
      { name: 'Violeta Vibra', hex: '#8B5CF6' },
      { name: 'Negro Carbón', hex: '#18181B' },
      { name: 'Blanco Plata', hex: '#F8FAFC' },
    ],
    defaultTone: 'Cercano, comunitario, incluyente y enfocado en valor recurrente y sentido de pertenencia',
    defaultPurpose: 'Construir una red viva de soporte mutuo, recursos exclusivos y crecimiento constante para cada miembro.',
  },

  // -------------------------------------------------------------
  // V09: E-COMMERCE & RETAIL D2C
  // -------------------------------------------------------------
  ecommerce: {
    canonicalId: 'V09',
    name: 'Retail & E-Commerce (Marcas D2C)',
    avatar: '👟',
    colors: [
      { name: 'Lima Streetwear', hex: '#C3F400' },
      { name: 'Violeta Neón', hex: '#8B5CF6' },
      { name: 'Negro Profundo', hex: '#09090B' },
      { name: 'Blanco Puro', hex: '#FFFFFF' },
      { name: 'Azul Eléctrico', hex: '#3B82F6' },
    ],
    defaultTone: 'Fresco, directo, dinámico, ágil y enfocado en conversión rápida, beneficios claros y garantía de compra',
    defaultPurpose: 'Acercar productos icónicos y tendencias globales a la puerta de nuestros clientes con una experiencia de compra impecable.',
  },

  // -------------------------------------------------------------
  // V10: COMERCIO LOCAL & FERRETERÍAS
  // -------------------------------------------------------------
  local_retail: {
    canonicalId: 'V10',
    name: 'Ferreterías, Refaccionarias & Comercio Local',
    avatar: '🛠️',
    colors: [
      { name: 'Terracota Local', hex: '#EA580C' },
      { name: 'Oliva Artesanal', hex: '#65A30D' },
      { name: 'Crema Cálido', hex: '#FEF3C7' },
      { name: 'Carbón Mate', hex: '#262626' },
      { name: 'Miel Dorado', hex: '#D97706' },
    ],
    defaultTone: 'Cálido, accesible, local, personalizado y enfocado en resolver necesidades inmediatas con honestidad',
    defaultPurpose: 'Ser el aliado de confianza del barrio y la industria local, entregando calidad garantizada y asesoría honesta.',
  },

  // -------------------------------------------------------------
  // V11: GASTRONOMÍA & RESTAURANTES
  // -------------------------------------------------------------
  hospitality: {
    canonicalId: 'V11',
    name: 'Restaurantes, Bares & Mixología',
    avatar: '🥩',
    colors: [
      { name: 'Borgoña Reserva', hex: '#881337' },
      { name: 'Rubí Mixología', hex: '#E11D48' },
      { name: 'Ámbar Cálido', hex: '#F59E0B' },
      { name: 'Carbón Elegante', hex: '#18181B' },
      { name: 'Dorado Acabados', hex: '#D97706' },
    ],
    defaultTone: 'Sofisticado, hospitalario, sensorial y acogedor, provocando apetito y deseo de celebrar',
    defaultPurpose: 'Crear experiencias culinarias memorables donde el sabor, el servicio impecable y la atmósfera celebran momentos únicos.',
  },

  // -------------------------------------------------------------
  // V12: SALONES DE EVENTOS & BODAS
  // -------------------------------------------------------------
  event_venues: {
    canonicalId: 'V12',
    name: 'Salones de Eventos, Bodas & Banquetes',
    avatar: '🏰',
    colors: [
      { name: 'Oro Rosa', hex: '#FB7185' },
      { name: 'Champagne Gala', hex: '#FDE68A' },
      { name: 'Gris Perla', hex: '#64748B' },
      { name: 'Verde Jardín', hex: '#4D7C0F' },
      { name: 'Azul Noche', hex: '#1E293B' },
    ],
    defaultTone: 'Elegante, solemne, empático, ilusionante y enfocado en convertir momentos en memorias eternas',
    defaultPurpose: 'Hacer realidad el evento soñado de cada familia con una logística impecable y escenarios de ensueño.',
  },

  // -------------------------------------------------------------
  // V13: B2B, AGENCIAS & SAAS
  // -------------------------------------------------------------
  b2b: {
    canonicalId: 'V13',
    name: 'Agencias de Marketing, Software SaaS & Consultoría B2B',
    avatar: '💼',
    colors: [
      { name: 'Azul Marino B2B', hex: '#0F172A' },
      { name: 'Pizarra Corporativo', hex: '#334155' },
      { name: 'Cyan Telemetría', hex: '#06B6D4' },
      { name: 'Gris Titanio', hex: '#64748B' },
      { name: 'Blanco Escarcha', hex: '#F8FAFC' },
    ],
    defaultTone: 'Estratégico, formal, consultivo y enfocado en ROI, métricas y optimización operativa',
    defaultPurpose: 'Acelerar el crecimiento y rentabilidad de nuestros clientes mediante tecnología de vanguardia y ejecución rigurosa.',
  },

  // Identidad Oficial Master de Vector Inside
  vector_inside: {
    canonicalId: 'V13',
    name: 'Vector Inside // Community OS',
    avatar: '🐺',
    colors: [
      { name: 'Lima Vectorial', hex: '#E7F900' },
      { name: 'Negro Carbón Núcleo', hex: '#000000' },
      { name: 'Lima Brillante', hex: '#C3F400' },
      { name: 'Gris Grafito', hex: '#18181B' },
      { name: 'Blanco Óptico', hex: '#FFFFFF' },
    ],
    defaultTone: 'Estratégico, preciso, tecnológico, humano y con autoridad ejecutiva (Lobo Vectorial)',
    defaultPurpose: 'Acelerar el crecimiento y rentabilidad de nuestros clientes mediante tecnología de vanguardia y ejecución rigurosa.',
  },

  // -------------------------------------------------------------
  // V14: DESPACHOS LEGALES & CONTABLES
  // -------------------------------------------------------------
  legal_accounting: {
    canonicalId: 'V14',
    name: 'Despachos Legales, Notarías & Contadores',
    avatar: '⚖️',
    colors: [
      { name: 'Azul Institucional', hex: '#1E3A8A' },
      { name: 'Oro Clásico', hex: '#B45309' },
      { name: 'Gris Jurídico', hex: '#334155' },
      { name: 'Marfil Notarial', hex: '#FFFBEB' },
      { name: 'Negro Tinta', hex: '#0F172A' },
    ],
    defaultTone: 'Riguroso, confidencial, consultivo, formal y enfocado en certeza jurídica, fiscal y patrimonial',
    defaultPurpose: 'Blindar el patrimonio y la tranquilidad jurídica y financiera de nuestros clientes con máxima ética y precisión.',
  },

  // -------------------------------------------------------------
  // V15: BIENES RAÍCES & DESARROLLOS
  // -------------------------------------------------------------
  realestate: {
    canonicalId: 'V15',
    name: 'Bienes Raíces, Desarrollos & Inmobiliarias',
    avatar: '🏙️',
    colors: [
      { name: 'Azul Pizarra', hex: '#0F172A' },
      { name: 'Titanio Arquitectónico', hex: '#475569' },
      { name: 'Oro Platino', hex: '#F59E0B' },
      { name: 'Mármol Blanco', hex: '#F8FAFC' },
      { name: 'Peltre Moderno', hex: '#94A3B8' },
    ],
    defaultTone: 'Exclusivo, formal, consultivo y enfocado en plusvalía arquitectónica, patrimonio y rendimiento',
    defaultPurpose: 'Conectar a las personas con el hogar de sus sueños y proyectos de inversión con máxima plusvalía garantizada.',
  },

  // -------------------------------------------------------------
  // V16: AGENCIA DE AUTOS & TALLERES
  // -------------------------------------------------------------
  automotive: {
    canonicalId: 'V16',
    name: 'Agencias de Autos, Concesionarias & Talleres',
    avatar: '🏎️',
    colors: [
      { name: 'Rojo Deportivo', hex: '#DC2626' },
      { name: 'Acero Premium', hex: '#1E293B' },
      { name: 'Grafito Metálico', hex: '#64748B' },
      { name: 'Blanco Perla', hex: '#F8FAFC' },
      { name: 'Azul Nitro', hex: '#2563EB' },
    ],
    defaultTone: 'Dinámico, técnico, seguro y orientado a confianza, potencia y respaldo mecánico certificado',
    defaultPurpose: 'Brindar seguridad, potencia y respaldo automotriz con tecnología de diagnóstico y transparencia total.',
  },

  // -------------------------------------------------------------
  // V17: CREADORES DE CONTENIDO & STREAMERS
  // -------------------------------------------------------------
  creator: {
    canonicalId: 'V17',
    name: 'Creadores en Redes Meta, Streamers & Podcasts',
    avatar: '🎬',
    colors: [
      { name: 'Fucsia Creador', hex: '#EC4899' },
      { name: 'Amarillo Sol', hex: '#FACC15' },
      { name: 'Púrpura Viral', hex: '#A855F7' },
      { name: 'Negro Midnight', hex: '#09090B' },
      { name: 'Cyan Pop', hex: '#06B6D4' },
    ],
    defaultTone: 'Auténtico, carismático, magnético, cercano a la comunidad y enfocado en colaboración genuina',
    defaultPurpose: 'Entretener, inspirar y construir una comunidad apasionada a través de historias auténticas y contenido de alto valor.',
  },

  gym: {
    canonicalId: 'V01',
    name: 'Gimnasios & Fitness',
    avatar: '🏋️‍♂️',
    colors: [
      { name: 'Naranja Fuerza', hex: '#EA580C' },
      { name: 'Verde Rendimiento', hex: '#22C55E' },
      { name: 'Negro Hierro', hex: '#18181B' },
      { name: 'Gris Asfalto', hex: '#3F3F46' },
      { name: 'Amarillo Energía', hex: '#EAB308' },
    ],
    defaultTone: 'Enérgico, motivacional, directo y enfocado en disciplina física y resultados',
    defaultPurpose: 'Transformar vidas a través del entrenamiento inteligente y una comunidad que no se rinde.',
  },
};

/**
 * Preset Neutral Canónico para Estado Global o Sin Negocio Seleccionado (V00)
 */
export const NEUTRAL_BRAND_PRESET = {
  canonicalId: 'V00',
  name: 'Espacio General • Selecciona un Negocio',
  avatar: '🏢',
  colors: [
    { name: 'Lima Vectorial', hex: '#C3F400' },
    { name: 'Azul Cognitivo', hex: '#80B8FF' },
    { name: 'Esmeralda Conversión', hex: '#10B981' },
    { name: 'Carbón Base', hex: '#18181B' },
    { name: 'Gris Panel', hex: '#27272A' },
  ],
  defaultTone: 'Profesional, empático y orientado a conversión directa',
  defaultPurpose: 'Brindar un servicio de excelencia con atención personalizada y valor medible para nuestros clientes.',
};

/**
 * Resuelve de forma determinista el preset de marca adecuado para cualquier tenant
 */
export const resolveBrandPreset = (tenantOrKey) => {
  if (!tenantOrKey) return NEUTRAL_BRAND_PRESET;

  if (typeof tenantOrKey === 'string') {
    if (tenantOrKey.toLowerCase().includes('vector')) return TENANT_BRAND_PRESETS.vector_inside;
    return TENANT_BRAND_PRESETS[tenantOrKey] || NEUTRAL_BRAND_PRESET;
  }

  const tenant = tenantOrKey;

  // 0. Si el tenant corresponde a Vector Inside por nombre o ID, usar su preset maestro
  const tenantName = `${tenant.name || ''} ${tenant.shortName || ''} ${tenant.id || ''}`.toLowerCase();
  if (tenantName.includes('vector')) {
    return TENANT_BRAND_PRESETS.vector_inside;
  }

  // 0.1 Si el tenant tiene colores extraídos por la IA en su documento
  if (tenant.brandColor && /^#[0-9A-F]{6}$/i.test(tenant.brandColor)) {
    const primary = tenant.brandColor;
    const secondary = (tenant.brandSecondaryColor && /^#[0-9A-F]{6}$/i.test(tenant.brandSecondaryColor))
      ? tenant.brandSecondaryColor
      : '#0D1117';
    return {
      canonicalId: tenant.canonicalId || 'V13',
      name: tenant.name || 'Identidad Detectada',
      avatar: tenant.avatar || '⚡',
      colors: [
        { name: 'Primario Identidad', hex: primary },
        { name: 'Secundario Base', hex: secondary },
        { name: 'Acento Dinámico', hex: primary.toUpperCase() === '#E7F900' ? '#C3F400' : '#06B6D4' },
        { name: 'Superficie Panel', hex: '#1E293B' },
        { name: 'Luz / Tipografía', hex: '#FFFFFF' },
      ],
      defaultTone: tenant.toneOfVoice || 'Estratégico, formal y orientado a resultados',
      defaultPurpose: tenant.brandPurpose || 'Acelerar el crecimiento y rentabilidad de nuestros clientes.',
    };
  }

  // 1. Probar por vertical explícito
  if (tenant.vertical && TENANT_BRAND_PRESETS[tenant.vertical]) {
    return TENANT_BRAND_PRESETS[tenant.vertical];
  }

  // 2. Probar por ID de tenant
  if (tenant.id && TENANT_BRAND_PRESETS[tenant.id]) {
    return TENANT_BRAND_PRESETS[tenant.id];
  }

  // 3. Probar por verticalKey
  if (tenant.verticalKey && TENANT_BRAND_PRESETS[tenant.verticalKey]) {
    return TENANT_BRAND_PRESETS[tenant.verticalKey];
  }

  // 4. Probar búsqueda difusa en giro
  if (tenant.giro) {
    const giroLower = tenant.giro.toLowerCase();
    for (const [key, preset] of Object.entries(TENANT_BRAND_PRESETS)) {
      if (giroLower.includes(key) || (preset.name && giroLower.includes(preset.name.toLowerCase()))) {
        return preset;
      }
    }
    if (giroLower.includes('salud') || giroLower.includes('dent') || giroLower.includes('médic')) {
      return TENANT_BRAND_PRESETS.service_appointments;
    }
    if (giroLower.includes('fit') || giroLower.includes('gym')) {
      return TENANT_BRAND_PRESETS.gym_fitness;
    }
    if (giroLower.includes('restaur') || giroLower.includes('comida') || giroLower.includes('gastro')) {
      return TENANT_BRAND_PRESETS.hospitality;
    }
    if (giroLower.includes('inmobil') || giroLower.includes('raíces')) {
      return TENANT_BRAND_PRESETS.realestate;
    }
    if (giroLower.includes('auto') || giroLower.includes('mecán')) {
      return TENANT_BRAND_PRESETS.automotive;
    }
  }

  return NEUTRAL_BRAND_PRESET;
};

/**
 * Plantillas rápidas de tono de voz para 1-click
 */
export const QUICK_TONE_TEMPLATES = [
  {
    id: 'energetic',
    label: '⚡ Enérgico & Motivacional',
    description: 'Directo, apasionado y centrado en resultados',
    tone: 'Enérgico, motivacional, directo y enfocado en disciplina y resultados medibles',
  },
  {
    id: 'empathetic',
    label: '🩺 Empático & Clínico',
    description: 'Cálido, profesional y humano',
    tone: 'Cálido, profesional, empático y médico-clínico (sin tecnicismos alarmistas)',
  },
  {
    id: 'hospitality',
    label: '🍷 Hospitalario & Sensorial',
    description: 'Acogedor, elegante y descriptivo',
    tone: 'Sofisticado, hospitalario, sensorial y acogedor, provocando deseo y apetito',
  },
  {
    id: 'corporate',
    label: '👔 Consultivo & B2B',
    description: 'Formal, analítico y enfocado en ROI',
    tone: 'Estratégico, formal, consultivo y enfocado en ROI y optimización operativa',
  },
  {
    id: 'urban',
    label: '🔥 Fresco & Moderno D2C',
    description: 'Ágil, cercano y entusiasta de tendencias',
    tone: 'Fresco, directo, dinámico, ágil y enfocado en beneficios claros y autenticidad',
  },
  {
    id: 'luxury',
    label: '💎 Exclusivo & High-Ticket',
    description: 'Solemne, refinado y de alta plusvalía',
    tone: 'Exclusivo, formal, consultivo y enfocado en plusvalía arquitectónica, patrimonio y distinción',
  },
];

/**
 * Selector de Avatares / Emojis por categoría para todos los sectores
 */
export const BRAND_AVATAR_PRESETS = [
  { category: 'Lobo Vectorial & Tech', emojis: ['🐺', '⚡', '💼', '🚀', '💻', '🎯'] },
  { category: 'B2B, Legal & Tech', emojis: ['💼', '⚖️', '💻', '📈', '🤝', '🎓'] },
  { category: 'Salud & Cuidado', emojis: ['🦷', '🩺', '✨', '💆‍♀️', '💊', '🧬'] },
  { category: 'Fitness & Deporte', emojis: ['🏋️‍♂️', '🥊', '🏃‍♀️', '🧘‍♂️', '🏆', '🚴'] },
  { category: 'Gastronomía & Food', emojis: ['🥩', '🍷', '☕', '🍕', '🍣', '🍰'] },
  { category: 'Inmuebles & Retail', emojis: ['🏙️', '🏡', '👟', '🛍️', '📦', '🛒'] },
  { category: 'Auto & Servicios', emojis: ['🏎️', '🚗', '🛠️', '⚡', '📐', '🏭'] },
  { category: 'Educación & Creadores', emojis: ['🏫', '📚', '🎨', '🎬', '🎙️', '🐾'] },
];
