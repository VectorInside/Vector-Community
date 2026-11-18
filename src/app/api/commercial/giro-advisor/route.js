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
      return NextResponse.json(
        {
          success: false,
          error: 'API Key de DeepSeek no configurada en el servidor.',
        },
        { status: 503 }
      );
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
      const errText = await deepseekRes.text().catch(() => '');
      console.warn('[giro-advisor] DeepSeek API error status:', deepseekRes.status);
      return NextResponse.json(
        {
          success: false,
          error: `Error al consultar DeepSeek IA (HTTP ${deepseekRes.status}).`,
          details: errText,
        },
        { status: 502 }
      );
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

    return NextResponse.json(
      {
        success: false,
        error: 'DeepSeek IA no devolvió recomendaciones estratégicas válidas.',
      },
      { status: 502 }
    );
  } catch (err) {
    console.error('[api.commercial.giro-advisor] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Error al procesar recomendaciones con DeepSeek IA.',
      },
      { status: 502 }
    );
  }
}
