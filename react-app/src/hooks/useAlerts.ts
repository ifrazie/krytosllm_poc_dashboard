/**
 * Custom hook for alert management
 * Provides convenient methods for working with alerts
 */

import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Alert, AlertSeverity, AlertStatus } from '../types';

export const useAlerts = () => {
  const { state, addAlert, updateAlert } = useAppContext();

  // Memoized filtered alerts
  const alertsBySeverity = useMemo(() => {
    const alerts = state.alerts;
    return {
      critical: alerts.filter(alert => alert.severity === 'Critical'),
      high: alerts.filter(alert => alert.severity === 'High'),
      medium: alerts.filter(alert => alert.severity === 'Medium'),
      low: alerts.filter(alert => alert.severity === 'Low')
    };
  }, [state.alerts]);

  const alertsByStatus = useMemo(() => {
    const alerts = state.alerts;
    return {
      activeThreat: alerts.filter(alert => alert.status === 'Active Threat'),
      underInvestigation: alerts.filter(alert => alert.status === 'Under Investigation'),
      autoContained: alerts.filter(alert => alert.status === 'Auto-Contained'),
      resolved: alerts.filter(alert => alert.status === 'Resolved')
    };
  }, [state.alerts]);

  // Recent alerts (last 24 hours)
  const recentAlerts = useMemo(() => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return state.alerts.filter(alert => {
      const alertDate = new Date(alert.timestamp);
      return alertDate >= oneDayAgo;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [state.alerts]);

  // High priority alerts (Critical and High severity)
  const highPriorityAlerts = useMemo(() => {
    return state.alerts.filter(alert => 
      alert.severity === 'Critical' || alert.severity === 'High'
    );
  }, [state.alerts]);

  // Filter alerts by criteria
  const filterAlerts = useMemo(() => {
    return (filters: {
      severity?: AlertSeverity[];
      status?: AlertStatus[];
      search?: string;
      source?: string[];
    }) => {
      return state.alerts.filter(alert => {
        // Severity filter
        if (filters.severity && filters.severity.length > 0) {
          if (!filters.severity.includes(alert.severity)) return false;
        }

        // Status filter
        if (filters.status && filters.status.length > 0) {
          if (!filters.status.includes(alert.status)) return false;
        }

        // Search filter
        if (filters.search && filters.search.trim()) {
          const searchTerm = filters.search.toLowerCase();
          const searchableText = `${alert.title} ${alert.description} ${alert.source}`.toLowerCase();
          if (!searchableText.includes(searchTerm)) return false;
        }

        // Source filter
        if (filters.source && filters.source.length > 0) {
          if (!filters.source.includes(alert.source)) return false;
        }

        return true;
      });
    };
  }, [state.alerts]);

  // Get alert by ID
  const getAlertById = useMemo(() => {
    return (id: string): Alert | undefined => {
      return state.alerts.find(alert => alert.id === id);
    };
  }, [state.alerts]);

  // Alert statistics
  const alertStats = useMemo(() => {
    const total = state.alerts.length;
    const critical = alertsBySeverity.critical.length;
    const high = alertsBySeverity.high.length;
    const medium = alertsBySeverity.medium.length;
    const low = alertsBySeverity.low.length;
    
    const active = alertsByStatus.activeThreat.length;
    const investigating = alertsByStatus.underInvestigation.length;
    const contained = alertsByStatus.autoContained.length;
    const resolved = alertsByStatus.resolved.length;

    return {
      total,
      bySeverity: { critical, high, medium, low },
      byStatus: { active, investigating, contained, resolved },
      recent: recentAlerts.length,
      highPriority: highPriorityAlerts.length
    };
  }, [alertsBySeverity, alertsByStatus, recentAlerts, highPriorityAlerts]);

  return {
    // Data
    alerts: state.alerts,
    alertsBySeverity,
    alertsByStatus,
    recentAlerts,
    highPriorityAlerts,
    alertStats,
    
    // Loading and error states
    loading: state.loading.alerts,
    error: state.errors.alerts,
    
    // Methods
    addAlert,
    updateAlert,
    filterAlerts,
    getAlertById
  };
};