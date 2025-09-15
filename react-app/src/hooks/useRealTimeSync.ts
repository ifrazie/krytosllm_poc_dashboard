/**
 * Custom hook for real-time integration sync updates
 * Manages integration health monitoring and sync status updates
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Integration } from '../types';

interface UseRealTimeSyncOptions {
  enabled?: boolean;
  interval?: number;
  healthCheckInterval?: number;
  simulateOutages?: boolean;
  outageChance?: number; // 0-1 probability
  recoveryChance?: number; // 0-1 probability
  onSyncUpdate?: (integration: Integration) => void;
  onHealthChange?: (integration: Integration, oldStatus: Integration['status']) => void;
}

interface SyncEvent {
  integrationName: string;
  timestamp: string;
  syncTime: string;
  status: Integration['status'];
  health: Integration['health'];
}

export const useRealTimeSync = (options: UseRealTimeSyncOptions = {}) => {
  const {
    enabled = true,
    interval = 5000, // 5 seconds
    healthCheckInterval = 30000, // 30 seconds
    simulateOutages = true,
    outageChance = 0.02, // 2% chance per check
    recoveryChance = 0.3, // 30% chance to recover
    onSyncUpdate,
    onHealthChange
  } = options;

  const { state, updateIntegration } = useAppContext();
  
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const healthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [syncHistory, setSyncHistory] = useState<SyncEvent[]>([]);
  const [syncStats, setSyncStats] = useState({
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    lastSyncTime: null as string | null
  });

  // Realistic sync time options
  const syncTimeOptions = [
    "Just now",
    "15 seconds ago",
    "30 seconds ago",
    "45 seconds ago",
    "1 minute ago",
    "1.5 minutes ago",
    "2 minutes ago",
    "2.5 minutes ago",
    "3 minutes ago"
  ];

  // Generate realistic sync time based on integration status
  const generateSyncTime = useCallback((status: Integration['status']): string => {
    if (status === 'Disconnected') {
      // Disconnected integrations have older sync times
      const oldSyncOptions = [
        "5 minutes ago",
        "10 minutes ago",
        "15 minutes ago",
        "30 minutes ago",
        "1 hour ago",
        "2 hours ago"
      ];
      return oldSyncOptions[Math.floor(Math.random() * oldSyncOptions.length)];
    } else if (status === 'Degraded') {
      // Degraded integrations have slower sync times
      const slowSyncOptions = [
        "2 minutes ago",
        "3 minutes ago",
        "4 minutes ago",
        "5 minutes ago",
        "6 minutes ago"
      ];
      return slowSyncOptions[Math.floor(Math.random() * slowSyncOptions.length)];
    } else {
      // Connected integrations have recent sync times
      return syncTimeOptions[Math.floor(Math.random() * Math.min(6, syncTimeOptions.length))];
    }
  }, []);

  // Update integration sync times
  const updateSyncTimes = useCallback(() => {
    if (!enabled) return;

    let updatedCount = 0;
    const updatedIntegrations: Integration[] = [];

    state.integrations.forEach(integration => {
      // Skip disconnected integrations most of the time
      if (integration.status === 'Disconnected' && Math.random() < 0.8) {
        return;
      }

      // Update probability based on status
      const updateProbability = {
        'Connected': 0.6,
        'Degraded': 0.3,
        'Disconnected': 0.1
      }[integration.status];

      if (Math.random() < updateProbability) {
        const newSyncTime = generateSyncTime(integration.status);
        
        updateIntegration(integration.name, { lastSync: newSyncTime });
        
        const updatedIntegration = { ...integration, lastSync: newSyncTime };
        updatedIntegrations.push(updatedIntegration);
        updatedCount++;

        // Add to sync history
        const syncEvent: SyncEvent = {
          integrationName: integration.name,
          timestamp: new Date().toISOString(),
          syncTime: newSyncTime,
          status: integration.status,
          health: integration.health
        };

        setSyncHistory(prev => [...prev.slice(-49), syncEvent]); // Keep last 50

        if (onSyncUpdate) {
          onSyncUpdate(updatedIntegration);
        }
      }
    });

    // Update stats
    setSyncStats(prev => ({
      ...prev,
      totalSyncs: prev.totalSyncs + updatedCount,
      successfulSyncs: prev.successfulSyncs + updatedCount,
      lastSyncTime: updatedCount > 0 ? new Date().toISOString() : prev.lastSyncTime
    }));

  }, [enabled, state.integrations, updateIntegration, generateSyncTime, onSyncUpdate]);

  // Simulate health changes and outages
  const updateHealthStatus = useCallback(() => {
    if (!enabled || !simulateOutages) return;

    state.integrations.forEach(integration => {
      const currentStatus = integration.status;
      let newStatus = currentStatus;
      let newHealth = integration.health;

      // Status transition logic
      if (currentStatus === 'Connected') {
        // Small chance to become degraded or disconnected
        const random = Math.random();
        if (random < outageChance * 0.5) {
          newStatus = 'Degraded';
          newHealth = 'Warning';
        } else if (random < outageChance) {
          newStatus = 'Disconnected';
          newHealth = 'Error';
        }
      } else if (currentStatus === 'Degraded') {
        // Chance to recover or get worse
        const random = Math.random();
        if (random < recoveryChance * 0.7) {
          newStatus = 'Connected';
          newHealth = 'Healthy';
        } else if (random < outageChance * 2) {
          newStatus = 'Disconnected';
          newHealth = 'Error';
        }
      } else if (currentStatus === 'Disconnected') {
        // Chance to recover
        if (Math.random() < recoveryChance * 0.5) {
          newStatus = 'Degraded';
          newHealth = 'Warning';
        }
      }

      // Apply changes if status changed
      if (newStatus !== currentStatus || newHealth !== integration.health) {
        updateIntegration(integration.name, { 
          status: newStatus, 
          health: newHealth,
          lastSync: generateSyncTime(newStatus)
        });

        if (onHealthChange) {
          onHealthChange(
            { ...integration, status: newStatus, health: newHealth },
            currentStatus
          );
        }

        // Update failed sync count if status degraded
        if (newStatus !== 'Connected' && currentStatus === 'Connected') {
          setSyncStats(prev => ({
            ...prev,
            failedSyncs: prev.failedSyncs + 1
          }));
        }
      }
    });
  }, [
    enabled,
    simulateOutages,
    state.integrations,
    outageChance,
    recoveryChance,
    updateIntegration,
    generateSyncTime,
    onHealthChange
  ]);

  // Get sync statistics
  const getSyncStats = useCallback(() => {
    const totalIntegrations = state.integrations.length;
    const connectedCount = state.integrations.filter(i => i.status === 'Connected').length;
    const degradedCount = state.integrations.filter(i => i.status === 'Degraded').length;
    const disconnectedCount = state.integrations.filter(i => i.status === 'Disconnected').length;
    
    const healthyCount = state.integrations.filter(i => i.health === 'Healthy').length;
    const warningCount = state.integrations.filter(i => i.health === 'Warning').length;
    const errorCount = state.integrations.filter(i => i.health === 'Error').length;

    const uptime = totalIntegrations > 0 ? (connectedCount / totalIntegrations) * 100 : 0;
    const healthScore = totalIntegrations > 0 ? (healthyCount / totalIntegrations) * 100 : 0;

    return {
      ...syncStats,
      totalIntegrations,
      statusBreakdown: {
        connected: connectedCount,
        degraded: degradedCount,
        disconnected: disconnectedCount
      },
      healthBreakdown: {
        healthy: healthyCount,
        warning: warningCount,
        error: errorCount
      },
      uptime: Math.round(uptime * 10) / 10,
      healthScore: Math.round(healthScore * 10) / 10,
      successRate: syncStats.totalSyncs > 0 
        ? Math.round((syncStats.successfulSyncs / syncStats.totalSyncs) * 100 * 10) / 10
        : 100
    };
  }, [state.integrations, syncStats]);

  // Start sync monitoring
  const start = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }
    if (healthIntervalRef.current) {
      clearInterval(healthIntervalRef.current);
    }

    if (enabled) {
      syncIntervalRef.current = setInterval(updateSyncTimes, interval);
      healthIntervalRef.current = setInterval(updateHealthStatus, healthCheckInterval);
    }
  }, [enabled, interval, healthCheckInterval, updateSyncTimes, updateHealthStatus]);

  // Stop sync monitoring
  const stop = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
    if (healthIntervalRef.current) {
      clearInterval(healthIntervalRef.current);
      healthIntervalRef.current = null;
    }
  }, []);

  // Clear history and reset stats
  const reset = useCallback(() => {
    setSyncHistory([]);
    setSyncStats({
      totalSyncs: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      lastSyncTime: null
    });
  }, []);

  // Force sync all integrations
  const forceSyncAll = useCallback(() => {
    state.integrations.forEach(integration => {
      if (integration.status !== 'Disconnected') {
        const newSyncTime = "Just now";
        updateIntegration(integration.name, { lastSync: newSyncTime });
        
        if (onSyncUpdate) {
          onSyncUpdate({ ...integration, lastSync: newSyncTime });
        }
      }
    });

    setSyncStats(prev => ({
      ...prev,
      totalSyncs: prev.totalSyncs + state.integrations.filter(i => i.status !== 'Disconnected').length,
      successfulSyncs: prev.successfulSyncs + state.integrations.filter(i => i.status !== 'Disconnected').length,
      lastSyncTime: new Date().toISOString()
    }));
  }, [state.integrations, updateIntegration, onSyncUpdate]);

  // Auto-start on mount
  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    // Control methods
    start,
    stop,
    reset,
    forceSyncAll,
    
    // Manual methods
    updateSyncTimes,
    updateHealthStatus,
    
    // Data
    syncHistory,
    integrations: state.integrations,
    
    // Statistics
    stats: getSyncStats(),
    
    // Status
    isRunning: syncIntervalRef.current !== null,
    isMonitoringHealth: healthIntervalRef.current !== null,
    
    // Configuration
    config: {
      enabled,
      interval,
      healthCheckInterval,
      simulateOutages,
      outageChance,
      recoveryChance
    }
  };
};