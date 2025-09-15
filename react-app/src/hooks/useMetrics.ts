/**
 * Custom hook for metrics and performance data
 * Provides convenient access to SOC metrics and calculations
 */

import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
// Metrics type is imported via the main types export

export const useMetrics = () => {
  const { state } = useAppContext();

  // Parse trend values for calculations
  const parseTrend = (trend: string): number => {
    const match = trend.match(/([+-]?\d+(?:\.\d+)?)%/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Calculated metrics based on current data
  const calculatedMetrics = useMemo(() => {
    const alerts = state.alerts;
    const investigations = state.investigations;
    const incidents = state.incidents;

    // Alert metrics
    const totalAlerts = alerts.length;
    const criticalAlerts = alerts.filter(a => a.severity === 'Critical').length;
    const highAlerts = alerts.filter(a => a.severity === 'High').length;
    const resolvedAlerts = alerts.filter(a => a.status === 'Resolved').length;

    // Investigation metrics
    const activeInvestigations = investigations.filter(i => 
      i.status === 'New' || i.status === 'In Progress'
    ).length;
    const completedInvestigations = investigations.filter(i => 
      i.status === 'Completed'
    ).length;

    // Incident metrics
    const resolvedIncidents = incidents.filter(i => i.status === 'Resolved').length;
    const activeIncidents = incidents.filter(i => 
      i.status === 'New' || i.status === 'In Progress'
    ).length;

    return {
      totalAlerts,
      criticalAlerts,
      highAlerts,
      resolvedAlerts,
      activeInvestigations,
      completedInvestigations,
      resolvedIncidents,
      activeIncidents,
      alertResolutionRate: totalAlerts > 0 ? (resolvedAlerts / totalAlerts) * 100 : 0,
      investigationCompletionRate: investigations.length > 0 ? 
        (completedInvestigations / investigations.length) * 100 : 0
    };
  }, [state.alerts, state.investigations, state.incidents]);

  // Trend analysis
  const trendAnalysis = useMemo(() => {
    const metrics = state.metrics;
    return {
      alerts: {
        value: parseTrend(metrics.alertsTrend),
        isPositive: parseTrend(metrics.alertsTrend) < 0, // Fewer alerts is positive
        label: metrics.alertsTrend
      },
      investigations: {
        value: parseTrend(metrics.investigationsTrend),
        isPositive: parseTrend(metrics.investigationsTrend) < 0, // Fewer investigations is positive
        label: metrics.investigationsTrend
      },
      incidents: {
        value: parseTrend(metrics.incidentsTrend),
        isPositive: parseTrend(metrics.incidentsTrend) > 0, // More resolved incidents is positive
        label: metrics.incidentsTrend
      },
      mttr: {
        value: parseTrend(metrics.mttrTrend),
        isPositive: parseTrend(metrics.mttrTrend) < 0, // Lower MTTR is positive
        label: metrics.mttrTrend
      },
      accuracy: {
        value: parseTrend(metrics.accuracyTrend || "0%"),
        isPositive: parseTrend(metrics.accuracyTrend || "0%") > 0, // Higher accuracy is positive
        label: metrics.accuracyTrend || "0%"
      },
      falsePositives: {
        value: parseTrend(metrics.falsePositivesTrend || "0%"),
        isPositive: parseTrend(metrics.falsePositivesTrend || "0%") < 0, // Fewer false positives is positive
        label: metrics.falsePositivesTrend || "0%"
      }
    };
  }, [state.metrics]);

  // Performance indicators
  const performanceIndicators = useMemo(() => {
    const metrics = state.metrics;
    
    // Parse MTTR (assuming format like "12 min")
    const mttrMatch = metrics.mttr.match(/(\d+(?:\.\d+)?)\s*min/);
    const mttrMinutes = mttrMatch ? parseFloat(mttrMatch[1]) : 0;
    
    // Parse accuracy (assuming format like "94.2%")
    const accuracyMatch = metrics.accuracy?.match(/(\d+(?:\.\d+)?)%/);
    const accuracyPercent = accuracyMatch ? parseFloat(accuracyMatch[1]) : 0;
    
    // Parse false positive rate (assuming format like "5.8%")
    const fpMatch = metrics.falsePositives?.match(/(\d+(?:\.\d+)?)%/);
    const falsePositivePercent = fpMatch ? parseFloat(fpMatch[1]) : 0;

    return {
      mttr: {
        value: mttrMinutes,
        formatted: metrics.mttr,
        status: mttrMinutes <= 15 ? 'excellent' : mttrMinutes <= 30 ? 'good' : 'needs-improvement'
      },
      accuracy: {
        value: accuracyPercent,
        formatted: metrics.accuracy,
        status: accuracyPercent >= 95 ? 'excellent' : accuracyPercent >= 90 ? 'good' : 'needs-improvement'
      },
      falsePositiveRate: {
        value: falsePositivePercent,
        formatted: metrics.falsePositives,
        status: falsePositivePercent <= 5 ? 'excellent' : falsePositivePercent <= 10 ? 'good' : 'needs-improvement'
      }
    };
  }, [state.metrics]);

  // Key performance indicators summary
  const kpiSummary = useMemo(() => {
    const perf = performanceIndicators;
    const excellent = Object.values(perf).filter(p => p.status === 'excellent').length;
    const good = Object.values(perf).filter(p => p.status === 'good').length;
    const needsImprovement = Object.values(perf).filter(p => p.status === 'needs-improvement').length;
    
    const overallStatus = excellent >= 2 ? 'excellent' : 
                         good >= 2 ? 'good' : 'needs-improvement';

    return {
      overallStatus,
      breakdown: { excellent, good, needsImprovement },
      totalKpis: Object.keys(perf).length
    };
  }, [performanceIndicators]);

  return {
    // Raw metrics
    metrics: state.metrics,
    
    // Calculated metrics
    calculatedMetrics,
    
    // Analysis
    trendAnalysis,
    performanceIndicators,
    kpiSummary,
    
    // Loading and error states
    loading: state.loading.metrics,
    error: state.errors.metrics,
    
    // Utility functions
    parseTrend
  };
};