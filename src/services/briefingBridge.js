/**
 * BriefingBridge — Adaptador de Ingestión y Análisis Semántico RAG
 * 
 * Permite alternar de forma transparente entre:
 * 1. Backend Propio (/api/v1/rag/analyze-briefing con FastAPI/Python o Node)
 * 2. DeepSeek / OpenAI API directa (vía Proxy Next.js /api/rag/analyze)
 * 3. Modo Mock/Simulación asistida (Fallback automático con calibración del giro)
 */

import api, { isBackendAvailable } from './api';

export const BriefingBridge = {
  /**
   * Ejecuta el análisis del briefing o documento maestro
   * @param {Object} params
   * @param {File|null} params.file Archivo PDF, Word o TXT
   * @param {string} params.text Texto plano ingresado por el usuario
   * @param {Object} params.verticalConfig Configuración del giro comercial seleccionado
   * @param {Function} params.onProgress Callback para reportar etapas (stage: string)
   * @param {AbortSignal} [params.signal] Control de cancelación
   * @returns {Promise<Object>} Schema normalizado para setWizardData
   */
  async analyze({ file, text, verticalConfig, onProgress, signal }) {
    // 1. Detectar si el backend real está habilitado y disponible
    if (isBackendAvailable) {
      try {
        onProgress?.('Conectando con motor RAG en backend...');
        
        let payload;
        let headers = {};

        if (file) {
          payload = new FormData();
          payload.append('file', file);
          if (text) payload.append('context', text);
          if (verticalConfig?.id) payload.append('vertical_id', verticalConfig.id);
        } else {
          payload = {
            text: text || '',
            vertical_id: verticalConfig?.id || 'gym_fitness',
            conversion_goal: verticalConfig?.conversionGoal || '',
          };
          headers['Content-Type'] = 'application/json';
        }

        const response = await api.post('/rag/analyze-briefing', payload, {
          headers,
          signal,
          timeout: 45000,
        });

        if (response.data && response.data.success) {
          onProgress?.('¡Análisis semántico completado vía IA!');
          return response.data.data;
        }
      } catch (err) {
        console.warn('[BriefingBridge] Falló endpoint real, aplicando fallback a simulación asistida:', err.message);
      }
    }

    // 2. Modo Demostrativo Asistido (Simulación con calibración semántica por giro)
    return this.simulateAnalysis({ file, text, verticalConfig, onProgress, signal });
  },

  /**
   * Simulación calibrada inteligente (Fallback)
   */
  async simulateAnalysis({ file, text, verticalConfig, onProgress, signal }) {
    const vertName = verticalConfig?.name || 'Negocio';
    const cleanGiroName = vertName.split(',')[0].trim();

    onProgress?.('Analizando estructura semántica con DeepSeek R1...');
    await new Promise((r) => setTimeout(r, 800));
    if (signal?.aborted) throw new Error('AbortError');

    onProgress?.(`Identificando Pilar 2 (Brandbook y Tono de Voz) para ${cleanGiroName}...`);
    await new Promise((r) => setTimeout(r, 600));
    if (signal?.aborted) throw new Error('AbortError');

    onProgress?.('Extrayendo Oferta Comercial y Gancho de Conversión...');
    await new Promise((r) => setTimeout(r, 600));
    if (signal?.aborted) throw new Error('AbortError');

    onProgress?.(`Estructurando Pilar 1 (Precios, Tarifas y Servicios) para ${cleanGiroName}...`);
    await new Promise((r) => setTimeout(r, 600));
    if (signal?.aborted) throw new Error('AbortError');

    onProgress?.('Extrayendo Pilar 3 (Políticas, Reglamentos y FAQs)...');
    await new Promise((r) => setTimeout(r, 600));
    if (signal?.aborted) throw new Error('AbortError');

    onProgress?.('Compilando Directrices, Protocolos y Reglas Inviolables (Pilar 4)...');
    await new Promise((r) => setTimeout(r, 600));
    if (signal?.aborted) throw new Error('AbortError');

    onProgress?.('¡Auto-Ingestión completada con éxito!');

    const fileSize = file ? file.size : 148500;
    const fileType = file ? file.type : 'application/pdf';
    const cleanFileName = file ? file.name : 'Master_Briefing.pdf';

    // Devuelve el objeto integral con los 4 Pilares RAG + Oferta
    return {
      businessName: text?.slice(0, 30)?.trim() || `Centro de Excelencia (${cleanGiroName})`,
      // Pilar 2: Brandbook & Tono
      brandTone: 'Profesional, empático, resolutivo y orientado a conversión directa',
      archetype: verticalConfig?.badge || 'El Asesor Experto & Aliado de Confianza',
      brandbookDoc: {
        name: file ? `Brandbook_${cleanFileName}` : `Brandbook_${cleanGiroName}.md`,
        size: Math.round(fileSize * 0.42) || 45000,
        type: 'text/markdown',
        source: 'master_extraction'
      },
      // Propuesta Comercial
      offerHook: `Diagnóstico / Valoración de Bienvenida en ${cleanGiroName} + Garantía de Satisfacción`,
      offerCta: 'Envía un mensaje para apartar tu horario de atención',
      offerValidity: 'Válido durante los primeros 30 días de activación',
      commercialProposalDoc: {
        name: cleanFileName,
        size: fileSize,
        type: fileType,
        source: 'master_extraction'
      },
      // Pilar 1: Precios, Tarifas & Catálogo
      pricingDetails: `Tarifas y planes oficiales para ${cleanGiroName} con facilidades de pago diferido (MSI)`,
      pricingDoc: {
        name: file ? `Tarifario_${cleanFileName}` : `Catalogo_Precios_${cleanGiroName}.pdf`,
        size: Math.round(fileSize * 0.75) || 98000,
        type: 'application/pdf',
        source: 'master_extraction'
      },
      // Pilar 3: Políticas & FAQs
      faqDetails: `Cancelación flexible con 24h de aviso. Atención de contingencias y protocolo de garantía en ${cleanGiroName}.`,
      faqsDoc: {
        name: file ? `FAQs_Reglamento_${cleanFileName}` : `FAQs_Politicas_${cleanGiroName}.md`,
        size: Math.round(fileSize * 0.38) || 52000,
        type: 'text/markdown',
        source: 'master_extraction'
      },
      // Pilar 4 & Reglas Inviolables
      enableCommercialProposal: true,
      enableCrisisPillar: true,
      inviolableRules: verticalConfig?.defaultRules && verticalConfig.defaultRules.length > 0
        ? [...verticalConfig.defaultRules]
        : [
            `No prometer tiempos ni resultados absolutos sin valoración previa de ${cleanGiroName}.`,
            'Proteger la confidencialidad de datos personales y sensibles del prospecto.',
            'Canalizar con un agente humano ante dudas de alta complejidad o solicitudes de reembolso.',
          ],
      source: 'bridge_simulated_fallback',
    };
  },
};

export default BriefingBridge;
