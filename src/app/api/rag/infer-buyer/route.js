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
 * Respaldo Heurístico Inteligente calibrado por industria
 */
function getHeuristicBuyerAndMix(businessName = '', giro = '', brandPurpose = '', verticalId = 'b2b', channels = []) {
  const channelText = channels && channels.length > 0
    ? channels.join(', ')
    : 'WhatsApp Business, Instagram Direct, Facebook Messenger, LinkedIn';

  const isVector =
    businessName.toLowerCase().includes('vector') ||
    brandPurpose.toLowerCase().includes('vector') ||
    verticalId === 'b2b';

  if (isVector) {
    return {
      buyerPersona: {
        name: 'Directores Comerciales, CEOs de SaaS y Fundadores de Agencias B2B',
        ageRange: '30 a 55 años',
        maritalStatus: 'Líderes de negocio en etapa de escalamiento y profesionalización',
        location: 'México, LATAM y mercado hispanohablante global (Nivel Ejecutivo C-Level)',
        digitalHabits: `Consumo activo en ${channelText} y X (Twitter); newsletters especializadas de negocios, webinars y herramientas SaaS de analítica.`,
        mainPainPoint: 'Falta de estructura de adquisición, fuga de prospectos calificados por lentitud de respuesta humana y dependencia de procesos manuales no escalables.',
        buyingTrigger: 'Automatizar la cualificación y agendamiento 24/7 con IA sin sacrificar autoridad ejecutiva ni el prestigio de la marca.',
      },
      marketingMix4P: {
        product: 'Arquitectura de Inteligencia Artificial Comercial, Agentes Autónomos de Respuesta Inmediata y Orquestación Multicanal B2B.',
        price: 'Modelos de Retainer Mensual Estratégico desde $18,000 MXN/mes o Implementación Llave en Mano por hitos de entrega.',
        place: `Canales de atención directa y captación omnicanal vía ${channelText} y reuniones estratégicas online. Entrega de servicios en remoto con tecnología propia (SaaS) y soporte personalizado 24/7.`,
        promotion: 'Sesión de Diagnóstico Comercial de 45 min (Discovery Call sin costo) y Demostración en Vivo de Aceleración con SLA Garantizado.',
      },
    };
  }

  // Verticales generales
  if (verticalId === 'gym_fitness' || giro.toLowerCase().includes('fitness') || giro.toLowerCase().includes('gym')) {
    return {
      buyerPersona: {
        name: 'Atletas Urbanos, Profesionistas Activos y Entusiastas del Bienestar',
        ageRange: '22 a 45 años',
        maritalStatus: 'Solteros o profesionistas con enfoque en salud integral y rendimiento',
        location: 'Zonas metropolitanas, cercanía a centros de negocio y residenciales',
        digitalHabits: 'Instagram, Spotify, TikTok, apps de tracking de entrenamiento y WhatsApp',
        mainPainPoint: 'Falta de tiempo, desmotivación por falta de acompañamiento personalizado y saturación en gimnasios tradicionales.',
        buyingTrigger: 'Acceso flexible, instalaciones de alto nivel y planes de nutrición y entrenamiento estructurados.',
      },
      marketingMix4P: {
        product: 'Membresías fitness integrales con acceso a áreas de musculación, clases dirigidas y asesoría nutricional.',
        price: 'Planes mensuales desde $899 MXN, pases trimestrales con descuento y promociones sin costo de inscripción.',
        place: 'Instalaciones físicas con acceso por torniquete inteligente y reservas de clases vía App / WhatsApp.',
        promotion: 'Clase muestra gratuita, 2x1 en inscripción y convenios corporativos con empresas locales.',
      },
    };
  }

  if (verticalId === 'healthcare' || giro.toLowerCase().includes('salud') || giro.toLowerCase().includes('clínica')) {
    return {
      buyerPersona: {
        name: 'Pacientes Conscientes, Madres/Padres de Familia y Adultos Preventivos',
        ageRange: '28 a 60 años',
        maritalStatus: 'Familias y profesionistas que priorizan la salud y el bienestar preventivo',
        location: 'Áreas urbanas con alta conectividad y cercanía a centros médicos',
        digitalHabits: 'Google Search, WhatsApp, portales de salud y recomendaciones médicas',
        mainPainPoint: 'Largas listas de espera, falta de claridad en costos de tratamientos e incertidumbre sobre diagnósticos.',
        buyingTrigger: 'Atención médica cercana, transparente, tecnología de vanguardia y confirmación inmediata de citas.',
      },
      marketingMix4P: {
        product: 'Consultas médicas especializadas, estudios de diagnóstico preventivo y seguimiento clínico continuo.',
        price: 'Aranceles transparentes por consulta, paquetes de diagnóstico integral y facilidades a Meses Sin Intereses.',
        place: 'Clínica médica física de vanguardia y consultas de seguimiento digital vía telemedicina.',
        promotion: 'Check-up preventivo inicial a precio preferencial y valoraciones familiares con descuento.',
      },
    };
  }

  // Fallback comercial genérico
  return {
    buyerPersona: {
      name: `Clientes y Tomadores de Decisión de ${businessName || 'la Marca'}`,
      ageRange: '25 a 55 años',
      maritalStatus: 'Profesionistas y familias del segmento objetivo',
      location: 'Ciudades principales y cobertura regional prioritaria',
      digitalHabits: 'WhatsApp, redes sociales principales y búsqueda web móvil',
      mainPainPoint: 'Búsqueda de soluciones confiables, atención ágil y garantía de resultados claros.',
      buyingTrigger: 'Recomendación, atención inmediata y propuesta de valor transparente sin fricciones.',
    },
    marketingMix4P: {
      product: `Catálogo de soluciones y servicios especializados de ${businessName || 'la Marca'}.`,
      price: 'Precios competitivos de mercado con esquemas flexibles y opciones de pago accesibles.',
      place: 'Atención digital omnicanal vía WhatsApp, sitio web y canales presenciales.',
      promotion: 'Valoración o consulta inicial de bienvenida con incentivos exclusivos por pronta respuesta.',
    },
  };
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      businessName = '',
      giro = '',
      brandPurpose = '',
      toneOfVoice = '',
      offerHook = '',
      offerCta = '',
      offerValidity = '',
      inviolableRules = [],
      verticalId = 'b2b',
      socialLinks = {},
      connectedSocialNetworks = [],
    } = body;

    // Normalizar canales y redes sociales activas dadas de alta
    const rawChannels = new Set([
      'whatsapp',
      ...(Array.isArray(connectedSocialNetworks) ? connectedSocialNetworks : []).map((s) => String(s).toLowerCase()),
      ...Object.keys(socialLinks || {}).filter((k) => socialLinks[k]?.trim()).map((k) => k.toLowerCase()),
    ]);

    const activeChannels = [];
    if (rawChannels.has('whatsapp') || rawChannels.has('whatsapp business') || true) activeChannels.push('WhatsApp Business');
    if (rawChannels.has('instagram')) activeChannels.push('Instagram Direct');
    if (rawChannels.has('facebook')) activeChannels.push('Facebook Messenger');
    if (rawChannels.has('linkedin')) activeChannels.push('LinkedIn');
    if (rawChannels.has('youtube')) activeChannels.push('YouTube');
    if (rawChannels.has('tiktok')) activeChannels.push('TikTok');
    if (rawChannels.has('x') || rawChannels.has('twitter')) activeChannels.push('X (Twitter)');

    const apiKey = resolveDeepSeekApiKey();

    if (!apiKey) {
      // Retornar fallback heurístico robusto si no hay API key disponible
      const fallback = getHeuristicBuyerAndMix(businessName, giro, brandPurpose, verticalId, activeChannels);
      return NextResponse.json({
        success: true,
        source: 'heuristic_fallback',
        ...fallback,
      });
    }

    const systemPrompt =
      'Eres el Director Estratégico de Marketing y Arquitectura Comercial de Vector Inside OS. ' +
      'Tu objetivo es definir con precisión ejecutiva el "Buyer Persona" (Perfil Demográfico & Psicográfico) ' +
      'y las "4 Ps del Marketing Mix" (Producto, Precio, Plaza, Promoción) a partir de los datos corporativos provistos.\n\n' +
      'Devuelve ÚNICAMENTE un objeto JSON con este formato exacto (sin bloques de código markdown ``` ni explicaciones):\n' +
      '{\n' +
      '  "buyerPersona": {\n' +
      '    "name": "Nombre o arquetipo del cliente ideal (ej. Fundadores B2B, CEOs de SaaS y Directores Comerciales)",\n' +
      '    "ageRange": "Rango de edad aproximado (ej. 30 a 55 años)",\n' +
      '    "maritalStatus": "Entorno profesional o demográfico clave",\n' +
      '    "location": "Mercado geográfico o cobertura prioritaria",\n' +
      '    "digitalHabits": "Canales y hábitos digitales de consumo de contenido (ej. LinkedIn, Instagram, Facebook, WhatsApp Business, X)",\n' +
      '    "mainPainPoint": "Dolor principal o problema crítico que resuelve el negocio (Struggling Moment)",\n' +
      '    "buyingTrigger": "Disparador o momento catalizador de compra (Gancho irresistible)"\n' +
      '  },\n' +
      '  "marketingMix4P": {\n' +
      '    "product": "Propuesta de valor, alcance de servicios y diferenciación",\n' +
      '    "price": "Modelos de aranceles, retainers, rangos o financiamiento",\n' +
      '    "place": "Canales de atención, entrega, distribución y tecnología (incluyendo obligatoriamente los canales y redes dados de alta)",\n' +
      '    "promotion": "Estrategia de gancho, ofertas de entrada y llamadas a la acción"\n' +
      '  }\n' +
      '}';

    const userPrompt = `
DATOS DE LA MARCA:
- Nombre Comercial: "${businessName}"
- Giro / Industria: "${giro}"
- Propósito Central (Golden Circle): "${brandPurpose}"
- Tono de Voz y Personalidad: "${toneOfVoice}"
- Gancho de Captación (Offer Hook): "${offerHook}"
- Llamado a la Acción (CTA): "${offerCta}"
- Vigencia / Urgencia: "${offerValidity}"
- Principios / Reglas Inviolables: ${JSON.stringify(inviolableRules)}
- Vertical ID: "${verticalId}"
- Canales y Redes Oficiales Dadas de Alta: ${activeChannels.join(', ')}

INSTRUCCIÓN MANDATORIA:
Debes incluir e integrar explícitamente los canales dados de alta (${activeChannels.join(', ')}) tanto en "digitalHabits" (hábitos de consumo de contenido) como en "place" (canales de atención, entrega y captación omnicanal). No omitas Instagram ni Facebook si están dados de alta.

Por favor genera el Buyer Persona y las 4 Ps adaptados al 100% a este perfil de negocio.`;

    const llmRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 1200,
      }),
    });

    if (!llmRes.ok) {
      console.warn('[infer-buyer] Error en DeepSeek API status:', llmRes.status);
      const fallback = getHeuristicBuyerAndMix(businessName, giro, brandPurpose, verticalId);
      return NextResponse.json({
        success: true,
        source: 'heuristic_fallback_on_api_error',
        ...fallback,
      });
    }

    const llmJson = await llmRes.json();
    const rawContent = llmJson?.choices?.[0]?.message?.content || '{}';
    const cleanedJson = rawContent
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);

    if (!parsed.buyerPersona || !parsed.marketingMix4P) {
      const fallback = getHeuristicBuyerAndMix(businessName, giro, brandPurpose, verticalId);
      return NextResponse.json({
        success: true,
        source: 'heuristic_fallback_incomplete_parsed',
        ...fallback,
      });
    }

    return NextResponse.json({
      success: true,
      source: 'deepseek_ai',
      buyerPersona: parsed.buyerPersona,
      marketingMix4P: parsed.marketingMix4P,
    });
  } catch (err) {
    console.error('[/api/rag/infer-buyer Error]:', err);
    const fallback = getHeuristicBuyerAndMix(
      'Vector Inside',
      'Agencias de Marketing, Software SaaS & Consultoría B2B',
      '',
      'b2b'
    );
    return NextResponse.json({
      success: true,
      source: 'heuristic_fallback_on_exception',
      ...fallback,
    });
  }
}

