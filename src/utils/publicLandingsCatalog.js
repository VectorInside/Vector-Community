/**
 * Catálogo Público de Negocios para Micro-Landings (/m/[slug]).
 * HARDENING DEFENSIVO: Contiene EXCLUSIVAMENTE los campos públicos necesarios para consumidores finales.
 * Omitidos por diseño de seguridad: RFCs, splits de agencia, costos por lead, métricas internas y datos financieros.
 */

export const PUBLIC_TENANTS_WHITELIST = {};

/**
 * Obtiene de forma segura los datos públicos de un tenant para su Micro-Landing.
 * @param {string} slug 
 * @returns {object} Objeto saneado sin datos confidenciales
 */
export function getPublicTenantLandingData(slug) {
  const cleanSlug = slug ? String(slug).toLowerCase().trim() : '';
  if (!cleanSlug || cleanSlug === 'undefined' || cleanSlug === 'null') {
    return {
      id: '',
      name: 'Sin Negocio Seleccionado',
      shortName: 'Sin Negocio',
      phone: '',
      microLandingSlug: '',
      microLandingEnabled: false,
      metaPixelId: '',
      ga4MeasurementId: '',
    };
  }

  const direct = PUBLIC_TENANTS_WHITELIST[cleanSlug];
  if (direct) return direct;

  const formattedName = cleanSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    id: cleanSlug,
    name: formattedName || 'Negocio',
    shortName: formattedName || 'Negocio',
    phone: '',
    microLandingSlug: cleanSlug,
    microLandingEnabled: true,
    metaPixelId: '',
    ga4MeasurementId: '',
  };
}
