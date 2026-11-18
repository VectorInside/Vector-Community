/**
 * Utilidades puras para el Estudio de Contenido (parseo resiliente de respuestas IA
 * y construcción unificada de controles de auditoría de perfil).
 */

/**
 * Extrae y normaliza un objeto JSON desde respuestas heterogéneas de la API de IA
 * (`generatedRawJson`, `content`, JSON anidado dentro de `copy`, o bloques markdown).
 *
 * @param {unknown} aiRes
 * @returns {Record<string, any> | null}
 */
export function parseAiJsonResponse(aiRes) {
  if (!aiRes) return null;

  const tryParseJson = (candidate) => {
    if (typeof candidate !== 'string') {
      return candidate && typeof candidate === 'object' ? candidate : null;
    }
    const cleaned = candidate
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    if (!cleaned) return null;
    try {
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  };

  let parsed = null;
  if (aiRes.generatedRawJson !== undefined && aiRes.generatedRawJson !== null) {
    parsed = tryParseJson(aiRes.generatedRawJson);
  } else if (aiRes.content !== undefined && aiRes.content !== null) {
    parsed = tryParseJson(aiRes.content);
  } else if (typeof aiRes === 'object') {
    parsed = aiRes;
  } else if (typeof aiRes === 'string') {
    parsed = tryParseJson(aiRes);
  }

  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  if (typeof parsed.copy === 'string' && parsed.copy.trim().startsWith('{')) {
    const inner = tryParseJson(parsed.copy);
    if (inner && typeof inner === 'object') {
      return { ...parsed, ...inner };
    }
  }

  return parsed;
}

/**
 * Construye los 4 controles estándar de auditoría de perfil social
 * con nomenclatura limpia alineada a ADR-011.
 *
 * @param {object} params
 * @param {string} [params.offerHook]
 * @param {number} [params.tabooViolationsCount]
 * @param {string} [params.phone]
 * @param {number | string | null} [params.realHookRate]
 * @param {boolean} [params.hasLiveAuditData]
 */
export function buildProfileAuditChecks({
  offerHook = '',
  tabooViolationsCount = 0,
  phone = '',
  realHookRate = null,
  hasLiveAuditData = false,
} = {}) {
  const cleanHook = String(offerHook || '').trim();
  const cleanPhone = String(phone || '').trim();
  const violations = Number(tabooViolationsCount || 0);
  const parsedHookRate =
    realHookRate !== null && realHookRate !== undefined && realHookRate !== ''
      ? Number(realHookRate)
      : null;

  return [
    {
      id: 'chk-1',
      title: 'Biografía con Gancho Comercial y Oferta Activa',
      status: cleanHook ? 'PASSED' : 'WARNING',
      diagnosis: cleanHook
        ? `Biografía alineada con la oferta activa: "${cleanHook}".`
        : 'La biografía no tiene un gancho de conversión directo definido.',
      recommendation:
        'Inyectar el llamado a la acción comercial directo con palabra clave hacia WhatsApp oficial.',
    },
    {
      id: 'chk-2',
      title: 'Consistencia con Manual de Identidad & Glosario',
      status: violations === 0 ? 'PASSED' : 'WARNING',
      diagnosis: hasLiveAuditData
        ? violations === 0
          ? '0 infracciones de palabras prohibidas detectadas en el feed analizado.'
          : `${violations} publicaciones contienen términos del glosario prohibido.`
        : 'Filtro léxico configurado para validar publicaciones frente a tus palabras prohibidas.',
      recommendation:
        'Mantener la verificación del filtro léxico activa en todas las publicaciones programadas.',
    },
    {
      id: 'chk-3',
      title: 'Enlace Directo a WhatsApp Oficial',
      status: cleanPhone ? 'PASSED' : 'WARNING',
      diagnosis: cleanPhone
        ? `Canal de destino validado: ${cleanPhone}.`
        : 'Sin número de WhatsApp verificado en la ficha de configuración.',
      recommendation:
        'Asegurar que el enlace en biografía dirija al canal de atención y agendamiento 24/7.',
    },
    {
      id: 'chk-4',
      title: 'Retención Promedio Superior al Benchmark (25%)',
      status:
        parsedHookRate !== null && !Number.isNaN(parsedHookRate)
          ? parsedHookRate >= 25
            ? 'PASSED'
            : 'WARNING'
          : 'WARNING',
      diagnosis:
        parsedHookRate !== null && !Number.isNaN(parsedHookRate)
          ? `Retención promedio de los primeros 3 segundos en Reels: ${parsedHookRate}% (Benchmark del sector: 25.0%).`
          : 'Sin datos suficientes de retención en Reels sincronizados desde Meta.',
      recommendation:
        'Continuar empleando el Laboratorio Viral para iterar sobre las fórmulas con mayor tracción.',
    },
  ];
}
