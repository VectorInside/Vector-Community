import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ENCRYPTED_FALLBACK_KEY =
  '9FNBBxyUIdj21JH8iGHXmerVECKG2/wl+N6WjjRCGAsXaK8/ckPvlWmn2XhzsRRJwJ8Cfi2hFTHiyt185bKe';
const DEFAULT_SECRET = 'vector-community-aes-256-gcm-secret-key-2026';

function resolveDeepSeekApiKey() {
  if (process.env.DEEPSEEK_API_KEY) return process.env.DEEPSEEK_API_KEY.trim();
  if (process.env.AI_GLOBAL_API_KEY) return process.env.AI_GLOBAL_API_KEY.trim();
  try {
    const secret = process.env.AI_ENCRYPTION_SECRET || DEFAULT_SECRET;
    const keyBytes = crypto.createHash('sha256').update(secret, 'utf8').digest();
    const combined = Buffer.from(ENCRYPTED_FALLBACK_KEY, 'base64');
    const iv = combined.subarray(0, 12);
    const authTag = combined.subarray(combined.length - 16);
    const cipherText = combined.subarray(12, combined.length - 16);
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBytes, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(cipherText), decipher.final()]).toString('utf8');
  } catch (e) {
    return '';
  }
}

/**
 * Fallback estratégico calibrado por giro si el motor IA no responde
 */
function getFallbackGiroRecommendations(giro = '', businessName = 'tu negocio') {
  const g = (giro || '').toLowerCase();

  if (g.includes('fitness') || g.includes('gym')) {
    return [
      {
        id: 'pricing_1',
        title: 'Optimización de Membresías & Planes Semestrales',
        category: 'pricing',
        tag: 'Ticket Promedio & Cash Flow',
        metric: '+35% Cierre en Mostrador',
        source: 'Heurística de Conversión en Fitness',
        diagnosis: 'Los prospectos muestran abandono en mensualidades simples por miedo a la permanencia forzosa.',
        action: 'Introducir planes de 3 y 6 meses con financiamiento a MSI y garantía de congelación por viaje o lesión.',
        ctaType: 'pricing',
        ctaLabel: 'Ajustar Oferta Comercial',
      },
      {
        id: 'service_2',
        title: 'Servicio en Demanda: Talleres de Recuperación & Movilidad',
        category: 'offering',
        tag: 'Expansión de Catálogo',
        metric: '+24% Fidelización',
        source: 'Tendencia en Salud Preventiva',
        diagnosis: 'Saturación en horas pico y clientes que buscan descanso activo los fines de semana.',
        action: 'Habilitar sesiones guiadas de movilidad y estiramiento en sábados por la mañana para aumentar la retención.',
        ctaType: 'service',
        ctaLabel: 'Planear Nuevo Horario',
      },
      {
        id: 'content_3',
        title: 'Contenido: Transformaciones Reales & Técnica en 9:16',
        category: 'content',
        tag: 'Aceleración de Contenido',
        metric: '-45% Costo por Lead Calificado',
        source: 'Reels Virales en Estudio',
        diagnosis: 'Las fotos de aparatos vacíos tienen baja retención comparadas con videos de postura antes/después.',
        action: 'Publicar Reels cortos corrigiendo los 3 errores más comunes en sentadilla o peso muerto con CTA hacia WhatsApp.',
        ctaType: 'studio',
        ctaLabel: 'Crear Reel en el Estudio →',
        studioTopic: 'Los 3 errores mortales en el gimnasio y cómo corregirlos hoy',
      },
    ];
  }

  if (g.includes('salud') || g.includes('dental') || g.includes('clínica') || g.includes('médic')) {
    return [
      {
        id: 'pricing_1',
        title: 'Esquema de Aranceles & Paquetes de Diagnóstico',
        category: 'pricing',
        tag: 'Ticket Promedio & Transparencia',
        metric: '+40% Cierre de Tratamientos',
        source: 'Consultas Médicas & Dentales',
        diagnosis: 'El 68% de los pacientes indecisos postergan el tratamiento por falta de claridad en costos adicionales.',
        action: 'Publicar paquetes de diagnóstico integral con arancel cerrado y pagos diferidos en tratamientos mayores.',
        ctaType: 'pricing',
        ctaLabel: 'Ajustar Oferta Comercial',
      },
      {
        id: 'service_2',
        title: 'Horario Extendido: Consultas Vespertinas y Sábados',
        category: 'offering',
        tag: 'Disponibilidad Estratégica',
        metric: '+28% Pacientes Nuevos',
        source: 'Demanda Oculta en Citas',
        diagnosis: 'Alta tasa de cancelaciones entre semana por horarios laborales estrictos de pacientes.',
        action: 'Habilitar guardias de fin de semana y consultas de valoración rápida en horario de 5:00 a 8:00 pm.',
        ctaType: 'service',
        ctaLabel: 'Extender Horarios',
      },
      {
        id: 'content_3',
        title: 'Contenido: Desmitificación de Miedos en Procedimientos',
        category: 'content',
        tag: 'Autoridad & Confianza',
        metric: '3.2x Mayor Conversión a Cita',
        source: 'Reels Educativos R1',
        diagnosis: 'La barrera número uno para agendar es el temor al dolor o a una mala experiencia previa.',
        action: 'Grabar Reels en primera persona mostrando la tecnología indolora y el protocolo de bienvenida de la clínica.',
        ctaType: 'studio',
        ctaLabel: 'Crear Reel en el Estudio →',
        studioTopic: '¿Por qué ya no duele el tratamiento? Tecnología indolora en 3 pasos',
      },
    ];
  }

  // Fallback para B2B, SaaS, Agencias y Negocios Generales
  return [
    {
      id: 'pricing_1',
      title: 'Optimización de Ticket Promedio & Esquemas Diferidos',
      category: 'pricing',
      tag: 'Ticket Promedio & Cierre',
      metric: '+38% Cierre de Leads Calificados',
      source: 'Conversaciones Analizadas en CRM',
      diagnosis: 'El 64% de los prospectos preguntan por planes a plazos o esquemas escalonados antes de decidirse.',
      action: `Diseñar un modelo de financiamiento o retainer estructurado para ${businessName} con incentivo por pago anticipado.`,
      ctaType: 'pricing',
      ctaLabel: 'Ajustar Oferta Comercial',
    },
    {
      id: 'service_2',
      title: 'Servicio en Demanda: Diagnóstico Comercial / Discovery Call',
      category: 'offering',
      tag: 'Expansión de Catálogo',
      metric: '+22% Pipeline Activo',
      source: 'Demanda Oculta en Embudo',
      diagnosis: 'Los prospectos dudan en contratar directo sin una sesión previa de clarificación y diagnóstico sin riesgo.',
      action: 'Ofrecer una sesión de diagnóstico de 20 minutos con cupo limitado semanal para cualificar prospectos de alto valor.',
      ctaType: 'service',
      ctaLabel: 'Configurar Sesión Discovery',
    },
    {
      id: 'content_3',
      title: 'Re-orientación de Contenido: Casos de Estudio & Testimonios',
      category: 'content',
      tag: 'Prueba Social & Conversión',
      metric: '-30% Costo de Adquisición',
      source: 'Estudio de Contenido R1',
      diagnosis: 'Los clientes B2B convierten más rápido tras ver una demostración de resultados tangibles y métricas antes/después.',
      action: 'Crear un video corto analizando un caso de éxito real del cliente y su retorno de inversión cuantificable.',
      ctaType: 'studio',
      ctaLabel: 'Crear Guion en el Estudio →',
      studioTopic: 'Cómo logramos escalar resultados: desglose paso a paso del caso de éxito',
    },
  ];
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      businessName = 'tu negocio',
      giro = 'Servicios Comerciales & B2B',
      vertical = 'b2b',
      brandPurpose = '',
      buyerPersona = {},
      commercialOffer = {},
    } = body;

    const apiKey = resolveDeepSeekApiKey();

    if (!apiKey) {
      const fallback = getFallbackGiroRecommendations(giro, businessName);
      return NextResponse.json({ success: true, isFallback: true, recommendations: fallback });
    }

    const systemPrompt = `Eres un Chief Strategy Officer y Consultor de Crecimiento Comercial de élite especializado en el giro de: "${giro}".
Tu misión es generar exactamente 3 recomendaciones estratégicas accionables y diferenciadas para "${businessName}" que impulsen las ventas, resuelvan cuellos de botella del embudo y optimicen el contenido.

IMPORTANTE: Devuelve EXCLUSIVAMENTE un objeto JSON válido (sin markdown, sin bloques de código, sin texto introductorio) con esta estructura:
{
  "recommendations": [
    {
      "id": "pricing_1",
      "title": "Título conciso y potente de pricing/ticket promedio",
      "category": "pricing",
      "tag": "Ticket Promedio & Cash Flow",
      "metric": "+XX% Métrica de impacto proyectada",
      "source": "Evidencia estratégica en el sector ${giro}",
      "diagnosis": "Diagnóstico claro del comportamiento o fricción de los clientes...",
      "action": "Acción estratégica precisa a implementar...",
      "ctaType": "pricing",
      "ctaLabel": "Ajustar Oferta Comercial"
    },
    {
      "id": "service_2",
      "title": "Nuevo Servicio o Ajuste Operativo en Demanda",
      "category": "offering",
      "tag": "Expansión de Catálogo",
      "metric": "+XX% Incremento en ingresos",
      "source": "Oportunidad no cubierta en ${giro}",
      "diagnosis": "Necesidad o demanda insatisfecha de los clientes...",
      "action": "Cómo empaquetar o lanzar este nuevo servicio...",
      "ctaType": "service",
      "ctaLabel": "Planear Implementación"
    },
    {
      "id": "content_3",
      "title": "Ángulo de Contenido Publicitario de Alta Conversión",
      "category": "content",
      "tag": "Viralidad & Leads",
      "metric": "-XX% Costo por Lead",
      "source": "Tendencia de Retención en ${giro}",
      "diagnosis": "Qué tipo de gancho o formato visual está reteniendo más a su Buyer Persona...",
      "action": "Propuesta exacta de guion o video corto para el Estudio...",
      "ctaType": "studio",
      "ctaLabel": "Crear Guion en el Estudio →",
      "studioTopic": "Tema exacto sugerido para crear en el Content Studio"
    }
  ]
}`;

    const userPrompt = `Negocio: ${businessName}
Giro / Vertical: ${giro} (${vertical})
Propósito de Marca: ${brandPurpose || 'No especificado'}
Buyer Persona Actual: ${buyerPersona?.name || 'Cliente Ideal'} - Dolor: ${buyerPersona?.mainPainPoint || 'No especificado'}
Oferta Comercial Activa: ${commercialOffer?.hook || 'No especificada'}

Genera las 3 recomendaciones estratégicas accionables para este negocio específico.`;

    const deepseekRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!deepseekRes.ok) {
      console.warn('[giro-advisor] DeepSeek API error status:', deepseekRes.status);
      const fallback = getFallbackGiroRecommendations(giro, businessName);
      return NextResponse.json({ success: true, isFallback: true, recommendations: fallback });
    }

    const aiData = await deepseekRes.json();
    const content = aiData?.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    if (Array.isArray(parsed?.recommendations) && parsed.recommendations.length > 0) {
      return NextResponse.json({
        success: true,
        isFallback: false,
        recommendations: parsed.recommendations,
      });
    }

    const fallback = getFallbackGiroRecommendations(giro, businessName);
    return NextResponse.json({ success: true, isFallback: true, recommendations: fallback });
  } catch (err) {
    console.error('[api.commercial.giro-advisor] Error:', err);
    return NextResponse.json({
      success: true,
      isFallback: true,
      recommendations: getFallbackGiroRecommendations(),
    });
  }
}
