import { useEffect, useRef, useState, useCallback } from 'react';

export const useSSE = (tenantId, onNewAlert) => {
  const [isConnected, setIsConnected] = useState(false);
  const [streamError, setStreamError] = useState(null);
  const eventSourceRef = useRef(null);

  // Manual trigger for testing live incoming alerts
  const emitLocalMockAlert = useCallback(() => {
    const mockLeadTypes = [
      {
        type: 'APPOINTMENT_REQUEST',
        title: 'Nueva Cita WhatsApp - Valoración VIP',
        clientName: 'Lic. Gerardo Montes',
        clientPhone: '+52 55 7719 4022',
        confidenceScore: 97,
        botSummary: 'Lead capturado por el Bot RAG en WhatsApp. Solicita confirmación de horario.',
        proposedData: {
          date: 'Mañana, 16:00 hrs',
          estimatedValue: 5500,
          zone: 'Zona VIP',
          depositStatus: 'Pre-autorización Lista ($1,000 MXN)',
        },
        transcriptSnippet: [
          { sender: 'user', text: 'Quiero agendar cita para mañana por la tarde, ¿tienen lugar?' },
          { sender: 'bot', text: 'Sí, tenemos disponibilidad a las 16:00 hrs. ¿Confirmamos tus datos?' },
          { sender: 'user', text: 'Sí, confirmen por favor.' }
        ],
        urgency: 'HIGH',
      },
      {
        type: 'CREATIVE_FATIGUE',
        title: 'Fatiga Creativa Detectada - Hook Rate < 20%',
        clientName: 'Meta Anomaly Engine',
        clientPhone: 'N/A',
        confidenceScore: 92,
        botSummary: 'El conjunto de anuncios redujo su Hook Rate 48% en las últimas 24 hrs. Se recomienda rotar hacia el video UGC.',
        proposedData: {
          adSetId: 'adset_live_9921',
          recommendation: 'Pausar y rotar creativo a Reel V5',
          actionType: 'PAUSE_AND_ROTATE',
        },
        transcriptSnippet: [
          { sender: 'system', text: 'Alerta automática: Frecuencia 4.1 detectada en audiencia 25-45.' }
        ],
        urgency: 'MEDIUM',
      }
    ];

    const randomTemplate = mockLeadTypes[Math.floor(Math.random() * mockLeadTypes.length)];
    const simulatedAlert = {
      id: `alt-live-${Date.now().toString().slice(-4)}`,
      tenantId: tenantId || 'tenant-mex-001',
      tenantName: 'Marca Activa',
      timestamp: new Date().toISOString(),
      status: 'PENDING_AGENCY_APPROVAL',
      source: 'SSE Real-Time Stream',
      ...randomTemplate,
    };

    if (onNewAlert) {
      onNewAlert(simulatedAlert);
    }
  }, [tenantId, onNewAlert]);

  useEffect(() => {
    if (!tenantId) return;

    const sseBaseUrl = process.env.NEXT_PUBLIC_SSE_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/alerts/stream`;
    const fullUrl = `${sseBaseUrl}?tenantId=${tenantId}`;

    let sseInstance = null;

    try {
      sseInstance = new EventSource(fullUrl);
      eventSourceRef.current = sseInstance;

      sseInstance.onopen = () => {
        setIsConnected(true);
        setStreamError(null);
      };

      sseInstance.onmessage = (event) => {
        try {
          const newAlert = JSON.parse(event.data);
          if (onNewAlert) {
            onNewAlert(newAlert);
          }
        } catch (err) {
          console.warn('[SSE Parse Warning]:', err);
        }
      };

      sseInstance.onerror = (err) => {
        setIsConnected(false);
        setStreamError('SSE Fallback Mode (Simulación activa)');
        sseInstance.close();
      };
    } catch (e) {
      setIsConnected(false);
      setStreamError('Error inicializando EventSource');
    }

    return () => {
      if (sseInstance) {
        sseInstance.close();
      }
    };
  }, [tenantId, onNewAlert]);

  return {
    isConnected,
    streamError,
    emitLocalMockAlert,
  };
};
