/**
 * Catálogo Público de Negocios para Micro-Landings (/m/[slug]).
 * HARDENING DEFENSIVO: Contiene EXCLUSIVAMENTE los campos públicos necesarios para consumidores finales.
 * Omitidos por diseño de seguridad: RFCs, splits de agencia, costos por lead, métricas internas y datos financieros.
 */

export const PUBLIC_TENANTS_WHITELIST = {
  dental: {
    id: 'dental',
    name: 'Clínica Dental Polanco',
    shortName: 'Dental Polanco',
    phone: '+525512345678',
    microLandingSlug: 'dental',
    microLandingEnabled: true,
    metaPixelId: '',
    ga4MeasurementId: '',
  },
  polanco: {
    id: 'polanco',
    name: 'Restaurante Polanco Prime Steakhouse',
    shortName: 'Polanco Prime',
    phone: '+525598765432',
    microLandingSlug: 'polanco',
    microLandingEnabled: true,
    metaPixelId: '',
    ga4MeasurementId: '',
  },
  urban: {
    id: 'urban',
    name: 'Desarrollo Residencial Urban Lofts Condesa',
    shortName: 'Urban Lofts',
    phone: '+525555551234',
    microLandingSlug: 'urban',
    microLandingEnabled: true,
    metaPixelId: '',
    ga4MeasurementId: '',
  },
  mex: {
    id: 'mex',
    name: 'Vector Agency HQ',
    shortName: 'Vector HQ',
    phone: '+525500001111',
    microLandingSlug: 'mex',
    microLandingEnabled: true,
    metaPixelId: '',
    ga4MeasurementId: '',
  },
};

/**
 * Obtiene de forma segura los datos públicos de un tenant para su Micro-Landing.
 * @param {string} slug 
 * @returns {object} Objeto saneado sin datos confidenciales
 */
export function getPublicTenantLandingData(slug) {
  if (!slug) return PUBLIC_TENANTS_WHITELIST.dental;
  const cleanSlug = String(slug).toLowerCase().trim();

  const direct = PUBLIC_TENANTS_WHITELIST[cleanSlug];
  if (direct) return direct;

  const found = Object.values(PUBLIC_TENANTS_WHITELIST).find(
    (t) =>
      t.id === cleanSlug ||
      t.microLandingSlug === cleanSlug ||
      (t.name && t.name.toLowerCase().includes(cleanSlug))
  );

  return found || PUBLIC_TENANTS_WHITELIST.dental;
}
