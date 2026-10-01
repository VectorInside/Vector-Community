import { useState, useEffect, useCallback } from 'react';
import { useTenant } from './useTenant';
import { hitlService } from '@/services/hitlService';
import { useSSE } from './useSSE';
import confetti from 'canvas-confetti';

export const useHITLAlerts = () => {
  const { activeTenantId } = useTenant();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingIds, setProcessingIds] = useState(new Set());
  const [lastApprovedAlert, setLastApprovedAlert] = useState(null);

  // Load initial alerts for tenant
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await hitlService.getAlerts(activeTenantId);
      setAlerts(data);
    } catch (err) {
      console.error('Error fetching alerts', err);
    } finally {
      setLoading(false);
    }
  }, [activeTenantId]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Handle incoming real-time alert via SSE
  const handleNewSSEAlert = useCallback((incomingAlert) => {
    setAlerts((prev) => {
      // Prevent duplicate
      if (prev.some((a) => a.id === incomingAlert.id)) {
        return prev;
      }
      return [incomingAlert, ...prev];
    });
  }, []);

  // Subscribe to SSE
  const { isConnected: isSSEConnected, emitLocalMockAlert } = useSSE(
    activeTenantId,
    handleNewSSEAlert
  );

  // 1-Click Approval Action (POST /api/v1/appointments/{id}/approve)
  const approveAlert = async (alertId) => {
    // Prevent duplicate clicks
    if (processingIds.has(alertId)) return;

    setProcessingIds((prev) => new Set(prev).add(alertId));

    try {
      await hitlService.approveAlert(alertId);

      // Trigger Confetti effect on approval
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#D4FF00', '#10B981', '#FFFFFF'],
        });
      } catch (e) {
        // Confetti fallback
      }

      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                status: 'APPROVED',
                approvedAt: new Date().toISOString(),
              }
            : alert
        )
      );

      const approvedItem = alerts.find((a) => a.id === alertId);
      setLastApprovedAlert(approvedItem);
    } catch (err) {
      console.error('Failed to approve alert', err);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(alertId);
        return next;
      });
    }
  };

  // Reject Action
  const rejectAlert = async (alertId, reason) => {
    try {
      await hitlService.rejectAlert(alertId, reason);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId
            ? { ...alert, status: 'REJECTED', rejectedReason: reason }
            : alert
        )
      );
    } catch (err) {
      console.error('Failed to reject alert', err);
    }
  };

  // Filtered alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (filterStatus !== 'ALL' && alert.status !== filterStatus) return false;
    if (filterType !== 'ALL' && alert.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = alert.title?.toLowerCase().includes(q);
      const matchClient = alert.clientName?.toLowerCase().includes(q);
      const matchSummary = alert.botSummary?.toLowerCase().includes(q);
      if (!matchTitle && !matchClient && !matchSummary) return false;
    }
    return true;
  });

  const pendingCount = alerts.filter((a) => a.status === 'PENDING_AGENCY_APPROVAL').length;
  const approvedCount = alerts.filter((a) => a.status === 'APPROVED').length;

  return {
    alerts: filteredAlerts,
    allAlerts: alerts,
    loading,
    pendingCount,
    approvedCount,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    approveAlert,
    rejectAlert,
    processingIds,
    isSSEConnected,
    emitLocalMockAlert,
    refreshAlerts: fetchAlerts,
  };
};
