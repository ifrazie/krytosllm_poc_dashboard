/**
 * Metrics and analytics-related type definitions
 */

export interface Metrics {
  totalAlerts: number;
  alertsTrend: string;
  activeInvestigations: number;
  investigationsTrend: string;
  resolvedIncidents: number;
  incidentsTrend: string;
  mttr: string;
  mttrTrend: string;
  accuracy?: string;
  accuracyTrend?: string;
  falsePositives?: string;
  falsePositivesTrend?: string;
}

export interface PerformanceMetrics {
  accuracy: number;
  falsePositiveRate: number;
  coverage: number;
  responseTime: number;
  detectionRate: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TrendData {
  period: string;
  value: number;
  change?: number;
  changePercent?: string;
}