/**
 * BriefingBridge — Adaptador de Ingestión Documental Real y Análisis Semántico con IA (DeepSeek LLM)
 *
 * Cadena de ejecución de alta disponibilidad:
 * 1. Backend Principal (/api/v1/rag/analyze-briefing con Apache PDFBox + DeepSeek API)
 * 2. Motor IA Directo en Next.js (/api/rag/analyze con extractor de streams PDF + DeepSeek API)
 * 3. Respaldo Heurístico Local (Solo en caso de desconexión total de red)
 */

import api, { isBackendAvailable } from './api';

export const BriefingBridge = {
  /**
   * Ejecuta la extracción documental y el análisis semántico con IA real
   * @param {Object} params
   * @param {File|null} params.file Archivo PDF, Word (.docx), Markdown (.md) o TXT
   * @param {string} params.text Texto complementario ingresado por el usuario
   * @param {Object} params.verticalConfig Configuración del giro comercial seleccionado
   * @param {Function} params.onProgress Callback para reportar progreso real
   * @param {AbortSignal} [params.signal] Control de cancelación
   * @returns {Promise<Object>} Datos extraídos para poblar los 6 pasos del Wizard
   */
  async analyze({ file, text, verticalConfig, onProgress, signal }) {
    const verticalId = verticalConfig?.id || 'b2b';

    const buildFormData = () => {
      const fd = new FormData();
      if (file) fd.append('file', file);
      if (text) fd.append('context', text);
      fd.append('vertical_id', verticalId);
      return fd;
    };

    // 1. Intentar con el Backend Principal (Spring Boot + Apache PDFBox + DeepSeek LLM)
    if (isBackendAvailable) {
      try {
        onProgress?.(
          file
            ? `Extrayendo texto de "${file.name}" y analizando con DeepSeek IA en servidor...`
            : 'Conectando con motor semántico DeepSeek IA en backend...'
        );

        let payload;
        if (file) {
          payload = buildFormData();
        } else {
          payload = {
            text: text || '',
            vertical_id: verticalId,
            file_name: 'Briefing_Directo.txt',
          };
        }

        const response = await api.post('/rag/analyze-briefing', payload, {
          signal,
          timeout: 45000,
        });

        const backendData = response?.data?.data;
        // Verificar que la respuesta provenga del motor actualizado y no de un contenedor legado sin PDFBox
        const isLegacyUnparsedResponse =
          backendData &&
          typeof backendData.businessName === 'string' &&
          backendData.businessName.startsWith('Centro de Excelencia') &&
          !('aiProcessed' in backendData);

        if (response?.data?.success && backendData && !isLegacyUnparsedResponse) {
          onProgress?.('¡Extracción documental y análisis con IA completados!');
          return backendData;
        }
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.message === 'AbortError' || signal?.aborted) {
          throw new Error('AbortError');
        }
        console.warn('[BriefingBridge] Backend primario en actualización o no disponible, activando ruta IA directa (/api/rag/analyze):', err.message);
      }
    }

    // 2. Ruta IA Directa en Next.js (/api/rag/analyze -> DeepSeek API en vivo)
    try {
      onProgress?.(
        file
          ? `Procesando "${file.name}" directamente con la API de DeepSeek IA...`
          : 'Analizando briefing directamente con la API de DeepSeek IA...'
      );

      let fetchOptions;
      if (file) {
        fetchOptions = {
          method: 'POST',
          body: buildFormData(),
          signal,
        };
      } else {
        fetchOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text || '',
            vertical_id: verticalId,
            file_name: 'Briefing_Directo.txt',
          }),
          signal,
        };
      }

      const directRes = await fetch('/api/rag/analyze', fetchOptions);
      const json = await directRes.json().catch(() => ({}));
      if (directRes.ok && json?.success && json?.data) {
        onProgress?.('¡Análisis con DeepSeek IA completado exitosamente!');
        return json.data;
      }
      throw new Error(
        json?.message ||
          json?.error ||
          `Error en el análisis documental con IA (HTTP ${directRes.status})`
      );
    } catch (directErr) {
      if (directErr?.name === 'AbortError' || signal?.aborted) {
        throw new Error('AbortError');
      }
      console.error('[BriefingBridge] Error al analizar documento:', directErr.message);
      throw directErr;
    }
  },
};

export default BriefingBridge;
