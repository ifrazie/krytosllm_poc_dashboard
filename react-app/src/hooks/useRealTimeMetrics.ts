/**
 * Custom hook for real-time metrics updates
 * Specialized hook for managing SOC performance metrics with realistic variations
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Metrics } from '../types';

interface UseRealTimeMetricsOptions {
  enabled?: boolean;
  interval?: number;
  variationIntensity?: 'low' | 'medium' | 'high';
  enableTrends?: boolean;
  onMetricsUpdate?: (metrics: Metrics) => void;
}

interface MetricsHistory {
  timestamp: string;
  metrics: Metrics;
}

export const useRealTimeMetrics = (options: UseRealTimeMetricsOptions = {}) => {
  const {
    enabled = true,
    interval = 60000, // 1 minute
    variationIntensity = 'medium',
    enableTrends = true,
    onMetricsUpdate
  } = options;

  const { state, dispatch } = useAppContext();
  
  const metricsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<MetricsHistory[]>([]);
  const [updateCount, setUpdateCount] = useState(0);

  // Variation ranges based on intensity
  const variationRanges = {
    low: {
      alerts: [-1, 2] as [number, number],
      investigations: [-1, 1] as [number, number],
      incidents: [0, 1] as [number, number],
      mttr: [-0.5, 0.5] as [number, number],
      accuracy: [-0.1, 0.1] as [number, number],
      falsePositives: [-0.05, 0.05] as [number, number]
    },
    medium: {
      alerts: [-2, 3] as [number, number],
      investigations: [-1, 2] as [number, number],
      incidents: [0, 2] as [number, number],
      mttr: [-1, 1] as [number, number],
      accuracy: [-0.25, 0.25] as [number, number],
      falsePositives: [-0.15, 0.15] as [number, number]
    },
    high: {
      alerts: [-3, 5] as [number, number],
      investigations: [-2, 3] as [number, number],
      incidents: [0, 3] as [number, number],
      mttr: [-2, 2] as [number, number],
      accuracy: [-0.5, 0.5] as [number, number],
      falsePositives: [-0.3, 0.3] as [number, number]
    }
  };

  // Generate random variation within range
  const getVariation = useCallback((range: [number, number]): number => {
    const [min, max] = range;
    return Math.random() * (max - min) + min;
  }, []);

  // Parse numeric value from string with unit
  const parseNumericValue = useCallback((value: string): number => {
    const match = value.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }, []);

  // Calculate trend percentage
  const calculateTrend = useCallback((current: number, previous: number): string => {
    if (previous === 0) return "0%";
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  }, []);

  // Update metrics with realistic variations
  const updateMetrics = useCallback(() => {
    if (!enabled) return;

    const currentMetrics = state.metrics;
    const ranges = variationRanges[variationIntensity];
    
    // Parse current values
    const currentMttr = parseNumericValue(currentMetrics.mttr);
    const currentAccuracy = parseNumericValue(currentMetrics.accuracy || "94.2");
    const currentFalsePositives = parseNumericValue(currentMetrics.falsePositives || "5.8");
    
    // Apply variations
    const alertVariation = Math.floor(getVariation(ranges.alerts));
    const investigationVariation = Math.floor(getVariation(ranges.investigations));
    const incidentVariation = Math.floor(getVariation(ranges.incidents));
    const mttrVariation = getVariation(ranges.mttr);
    const accuracyVariation = getVariation(ranges.accuracy);
    const fpVariation = getVariation(ranges.falsePositives);
    
    // Calculate new values with constraints
    const newTotalAlerts = Math.max(0, currentMetrics.totalAlerts + alertVariation);
    const newActiveInvestigations = Math.max(0, currentMetrics.activeInvestigations + investigationVariation);
    const newResolvedIncidents = currentMetrics.resolvedIncidents + Math.max(0, incidentVariation);
    const newMttr = Math.max(3, Math.min(60, currentMttr + mttrVariation)); // 3-60 minutes
    const newAccuracy = Math.max(85, Math.min(99.9, currentAccuracy + accuracyVariation)); // 85-99.9%
    const newFalsePositives = Math.max(0.1, Math.min(20, currentFalsePositives + fpVariation)); // 0.1-20%
    
    // Calculate trends if enabled and we have history
    let trends = {
      alertsTrend: currentMetrics.alertsTrend,
      investigationsTrend: currentMetrics.investigationsTrend,
      incidentsTrend: currentMetrics.incidentsTrend,
      mttrTrend: currentMetrics.mttrTrend,
      accuracyTrend: currentMetrics.accuracyTrend || "0%",
      falsePositivesTrend: currentMetrics.falsePositivesTrend || "0%"
    };
    
    if (enableTrends && metricsHistory.length > 0) {
      const previousMetrics = metricsHistory[metricsHistory.length - 1].metrics;
      const prevMttr = parseNumericValue(previousMetrics.mttr);
      const prevAccuracy = parseNumericValue(previousMetrics.accuracy || "94.2");
      const prevFalsePositives = parseNumericValue(previousMetrics.falsePositives || "5.8");
      
      trends = {
        alertsTrend: calculateTrend(newTotalAlerts, previousMetrics.totalAlerts),
        investigationsTrend: calculateTrend(newActiveInvestigations, previousMetrics.activeInvestigations),
        incidentsTrend: calculateTrend(newResolvedIncidents, previousMetrics.resolvedIncidents),
        mttrTrend: calculateTrend(newMttr, prevMttr),
        accuracyTrend: calculateTrend(newAccuracy, prevAccuracy),
        falsePositivesTrend: calculateTrend(newFalsePositives, prevFalsePositives)
      };
    }
    
    // Create updated metrics
    const updatedMetrics: Metrics = {
      ...currentMetrics,
      totalAlerts: newTotalAlerts,
      activeInvestigations: newActiveInvestigations,
      resolvedIncidents: newResolvedIncidents,
      mttr: `${newMttr.toFixed(1)} min`,
      accuracy: `${newAccuracy.toFixed(1)}%`,
      falsePositives: `${newFalsePositives.toFixed(1)}%`,
      ...trends
    };
    
    // Update state
    dispatch({ type: 'SET_METRICS', payload: updatedMetrics });
    
    // Add to history (keep last 50 entries)
    setMetricsHistory(prev => {
      const newHistory = [...prev, {
        timestamp: new Date().toISOString(),
        metrics: updatedMetrics
      }];
      return newHistory.slice(-50); // Keep last 50 entries
    });
    
    setUpdateCount(prev => prev + 1);
    
    // Call callback if provided
    if (onMetricsUpdate) {
      onMetricsUpdate(updatedMetrics);
    }
    
    return updatedMetrics;
  }, [
    enabled,
    state.metrics,
    variationIntensity,
    enableTrends,
    metricsHistory,
    getVariation,
    parseNumericValue,
    calculateTrend,
    dispatch,
    onMetricsUpdate
  ]);

  // Get metrics statistics
  const getMetricsStats = useCallback(() => {
    if (metricsHistory.length < 2) {
      return {
        averageAlerts: state.metrics.totalAlerts,
        averageInvestigations: state.metrics.activeInvestigations,
        averageIncidents: state.metrics.resolvedIncidents,
        averageMttr: parseNumericValue(state.metrics.mttr),
        averageAccuracy: parseNumericValue(state.metrics.accuracy || "94.2"),
        averageFalsePositives: parseNumericValue(state.metrics.falsePositives || "5.8"),
        volatility: 'low' as const
      };
    }
    
    const recent = metricsHistory.slice(-10); // Last 10 entries
    const alerts = recent.map(h => h.metrics.totalAlerts);
    const investigations = recent.map(h => h.metrics.activeInvestigations);
    const incidents = recent.map(h => h.metrics.resolvedIncidents);
    const mttrs = recent.map(h => parseNumericValue(h.metrics.mttr));
    const accuracies = recent.map(h => parseNumericValue(h.metrics.accuracy || "94.2"));
    const falsePositives = recent.map(h => parseNumericValue(h.metrics.falsePositives || "5.8"));
    
    const average = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = (arr: number[]) => {
      const avg = average(arr);
      return arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length;
    };
    
    const alertVariance = variance(alerts);
    const volatility = alertVariance > 10 ? 'high' : alertVariance > 5 ? 'medium' : 'low';
    
    return {
      averageAlerts: average(alerts),
      averageInvestigations: average(investigations),
      averageIncidents: average(incidents),
      averageMttr: average(mttrs),
      averageAccuracy: average(accuracies),
      averageFalsePositives: average(falsePositives),
      volatility
    };
  }, [metricsHistory, state.metrics, parseNumericValue]);

  // Start metrics updates
  const start = useCallback(() => {
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
    }
    
    if (enabled) {
      metricsIntervalRef.current = setInterval(updateMetrics, interval);
    }
  }, [enabled, interval, updateMetrics]);

  // Stop metrics updates
  const stop = useCallback(() => {
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setMetricsHistory([]);
    setUpdateCount(0);
  }, []);

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
    clearHistory,
    
    // Manual methods
    updateMetrics,
    
    // Data
    metricsHistory,
    currentMetrics: state.metrics,
    
    // Statistics
    updateCount,
    stats: getMetricsStats(),
    
    // Status
    isRunning: metricsIntervalRef.current !== null,
    
    // Configuration
    config: {
      enabled,
      interval,
      variationIntensity,
      enableTrends
    }
  };
};