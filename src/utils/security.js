/**
 * Utilidades de Seguridad Defensiva y Sanitización HTML (XSS Guard).
 * Previene la ejecución de scripts maliciosos y eventos arbitrarios (onerror, onload).
 */

/**
 * Escapa caracteres HTML especiales para texto plano.
 * @param {string} str - Cadena de texto a escapar
 * @returns {string} Cadena sanitizada
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const stringVal = String(str);
  return stringVal
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitiza fragmentos de HTML para renderizado seguro en modales o tooltips.
 * Elimina scripts, iframes, svgs, imágenes maliciosas y manejadores inline (on*).
 * @param {string} html - Fragmento HTML enriquecido
 * @returns {string} HTML sanitizado libre de vectores XSS
 */
export function sanitizeSafeMarkup(html) {
  if (!html || typeof html !== 'string') return '';

  let clean = html
    // 1. Eliminar etiquetas de script completas
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // 2. Eliminar iframes, embeds, objects, svgs y applets
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    // 3. Eliminar etiquetas img que contengan payloads onerror
    .replace(/<img\b[^>]*>/gi, '')
    // 4. Eliminar cualquier atributo que comience con 'on' (onerror, onload, onclick, etc.)
    .replace(/\s*on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '')
    // 5. Neutralizar pseudocódigos javascript: o data:
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:\s*text\/html/gi, '');

  return clean;
}

