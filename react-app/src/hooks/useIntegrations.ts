/**
 * Custom hook for integration management
 * Provides convenient methods for working with system integrations
 */

import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Integration, IntegrationStatus, IntegrationHealth } from '../types';

export const useIntegrations = () => {
  const { state, updateIntegration } = useAppContext();

  // Memoized filtered integrations
  const integrationsByStatus = useMemo(() => {
    const integrations = state.integrations || [];
    return {
      connected: integrations.filter(int => int.status === 'Connected'),
      degraded: integrations.filter(int => int.status === 'Degraded'),
      disconnected: integrations.filter(int => int.status === 'Disconnected')
    };
  }, [state.integrations]);

  const integrationsByHealth = useMemo(() => {
    const integrations = state.integrations || [];
    return {
      healthy: integrations.filter(int => int.health === 'Healthy'),
      warning: integrations.filter(int => int.health === 'Warning'),
      error: integrations.filter(int => int.health === 'Error')
    };
  }, [state.integrations]);

  // Critical integrations (those that are disconnected or have errors)
  const criticalIntegrations = useMemo(() => {
    const integrations = state.integrations || [];
    return integrations.filter(int => 
      int.status === 'Disconnected' || int.health === 'Error'
    );
  }, [state.integrations]);

  // Healthy integrations
  const healthyIntegrations = useMemo(() => {
    const integrations = state.integrations || [];
    return integrations.filter(int => 
      int.status === 'Connected' && int.health === 'Healthy'
    );
  }, [state.integrations]);

  // Get integration by name
  const getIntegrationByName = useMemo(() => {
    return (name: string): Integration | undefined => {
      const integrations = state.integrations || [];
      return integrations.find(int => int.name === name);
    };
  }, [state.integrations]);

  // Filter integrations
  const filterIntegrations = useMemo(() => {
    return (filters: {
      status?: IntegrationStatus[];
      health?: IntegrationHealth[];
      search?: string;
    }) => {
      const integrations = state.integrations || [];
      return integrations.filter(integration => {
        // Status filter
        if (filters.status && filters.status.length > 0) {
          if (!filters.status.includes(integration.status)) return false;
        }

        // Health filter
        if (filters.health && filters.health.length > 0) {
          if (!filters.health.includes(integration.health)) return false;
        }

        // Search filter
        if (filters.search && filters.search.trim()) {
          const searchTerm = filters.search.toLowerCase();
          const searchableText = integration.name.toLowerCase();
          if (!searchableText.includes(searchTerm)) return false;
        }

        return true;
      });
    };
  }, [state.integrations]);

  // Parse last sync time to get minutes ago
  const parseLastSync = useMemo(() => {
    return (lastSync: string): number => {
      const match = lastSync.match(/(\d+)\s*(second|minute|hour)s?\s*ago/);
      if (!match) return 0;
      
      const value = parseInt(match[1]);
      const unit = match[2];
      
      switch (unit) {
        case 'second':
          return value / 60; // Convert to minutes
        case 'minute':
          return value;
        case 'hour':
          return value * 60;
        default:
          return 0;
      }
    };
  }, []);

  // Integration statistics
  const integrationStats = useMemo(() => {
    const integrations = state.integrations || [];
    const total = integrations.length;
    const connected = integrationsByStatus.connected.length;
    const degraded = integrationsByStatus.degraded.length;
    const disconnected = integrationsByStatus.disconnected.length;
    
    const healthy = integrationsByHealth.healthy.length;
    const warning = integrationsByHealth.warning.length;
    const error = integrationsByHealth.error.length;
    
    const critical = criticalIntegrations.length;
    const operational = healthyIntegrations.length;
    
    // Calculate uptime percentage
    const uptimePercentage = total > 0 ? (connected / total) * 100 : 0;
    
    // Calculate health score
    const healthScore = total > 0 ? (healthy / total) * 100 : 0;

    return {
      total,
      byStatus: { connected, degraded, disconnected },
      byHealth: { healthy, warning, error },
      critical,
      operational,
      uptimePercentage,
      healthScore
    };
  }, [
    (state.integrations || []).length,
    integrationsByStatus,
    integrationsByHealth,
    criticalIntegrations.length,
    healthyIntegrations.length
  ]);

  // Integration health summary
  const healthSummary = useMemo(() => {
    const stats = integrationStats;
    
    let overallHealth: 'healthy' | 'warning' | 'critical';
    if (stats.critical > 0) {
      overallHealth = 'critical';
    } else if (stats.byHealth.warning > 0 || stats.byStatus.degraded > 0) {
      overallHealth = 'warning';
    } else {
      overallHealth = 'healthy';
    }

    return {
      overallHealth,
      healthScore: stats.healthScore,
      uptimePercentage: stats.uptimePercentage,
      criticalCount: stats.critical,
      operationalCount: stats.operational
    };
  }, [integrationStats]);

  return {
    // Data
    integrations: state.integrations || [],
    integrationsByStatus,
    integrationsByHealth,
    criticalIntegrations,
    healthyIntegrations,
    integrationStats,
    healthSummary,
    
    // Loading and error states
    loading: state.loading?.integrations || false,
    error: state.errors?.integrations || null,
    
    // Methods
    updateIntegration,
    filterIntegrations,
    getIntegrationByName,
    parseLastSync
  };
};