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
      ...(Array.isArray(connectedSocialNetworks) ? connectedSocialNetworks : []).map((s) =>
        String(s).toLowerCase()
      ),
      ...Object.keys(socialLinks || {})
        .filter((k) => socialLinks[k]?.trim())
        .map((k) => k.toLowerCase()),
    ]);

    const activeChannels = [];
    if (rawChannels.has('whatsapp') || rawChannels.has('whatsapp business')) {
      activeChannels.push('WhatsApp Business');
    }
    if (rawChannels.has('instagram')) activeChannels.push('Instagram Direct');
    if (rawChannels.has('facebook')) activeChannels.push('Facebook Messenger');
    if (rawChannels.has('linkedin')) activeChannels.push('LinkedIn');
    if (rawChannels.has('youtube')) activeChannels.push('YouTube');
    if (rawChannels.has('tiktok')) activeChannels.push('TikTok');
    if (rawChannels.has('x') || rawChannels.has('twitter')) activeChannels.push('X (Twitter)');

    const apiKey = resolveDeepSeekApiKey();

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'API Key de DeepSeek no configurada en el servidor.',
        },
        { status: 503 }
      );
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
      const errText = await llmRes.text().catch(() => '');
      console.warn('[infer-buyer] Error en DeepSeek API status:', llmRes.status);
      return NextResponse.json(
        {
          success: false,
          error: `Error al consultar DeepSeek IA (HTTP ${llmRes.status}).`,
          details: errText,
        },
        { status: 502 }
      );
    }

    const llmJson = await llmRes.json();
    const rawContent = llmJson?.choices?.[0]?.message?.content || '{}';
    const cleanedJson = rawContent
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);

    if (!parsed.buyerPersona || !parsed.marketingMix4P) {
      return NextResponse.json(
        {
          success: false,
          error: 'La respuesta de DeepSeek IA no incluyó buyerPersona o marketingMix4P válidos.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      source: 'deepseek_ai',
      buyerPersona: parsed.buyerPersona,
      marketingMix4P: parsed.marketingMix4P,
    });
  } catch (err) {
    console.error('[/api/rag/infer-buyer Error]:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Error al inferir Buyer Persona y Marketing Mix con DeepSeek IA.',
      },
      { status: 502 }
    );
  }
}

