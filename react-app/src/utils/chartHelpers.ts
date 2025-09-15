/**
 * Chart utility functions for data transformation and formatting
 */

// Chart utility functions for data transformation and formatting
import { ThreatChartData, AlertTrendsData, ResponseTimeData, ThreatCategoryData } from '../types/chart';

/**
 * Validates chart data to ensure it's safe to render
 */
export const validateChartData = (data: { datasets?: { data?: unknown[] }[] }): boolean => {
  if (!data || !data.datasets || !Array.isArray(data.datasets)) {
    return false;
  }

  return data.datasets.some((dataset) => 
    dataset.data && Array.isArray(dataset.data) && dataset.data.length > 0
  );
};

/**
 * Creates threat landscape chart data from raw threat counts
 */
export const createThreatLandscapeData = (
  critical: number,
  high: number,
  medium: number,
  low: number
): ThreatChartData => ({
  critical,
  high,
  medium,
  low,
});

/**
 * Creates alert trends chart data from time series data
 */
export const createAlertTrendsData = (
  timeLabels: string[],
  alertCounts: number[]
): AlertTrendsData => ({
  labels: timeLabels,
  values: alertCounts,
});

/**
 * Creates response time chart data from time range buckets
 */
export const createResponseTimeData = (
  timeRanges: string[],
  incidentCounts: number[]
): ResponseTimeData => ({
  ranges: timeRanges,
  counts: incidentCounts,
});

/**
 * Creates threat category chart data from category counts
 */
export const createThreatCategoryData = (
  categories: string[],
  counts: number[]
): ThreatCategoryData => ({
  categories,
  counts,
});

/**
 * Formats numbers for chart display
 */
export const formatChartNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Calculates percentage for chart tooltips
 */
export const calculatePercentage = (value: number, total: number): string => {
  if (total === 0) return '0.0';
  return ((value / total) * 100).toFixed(1);
};

/**
 * Generates time labels for alert trends (last 24 hours)
 */
export const generateTimeLabels = (intervalHours: number = 4): string[] => {
  const labels: string[] = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i -= intervalHours) {
    const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
    labels.push(time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }));
  }
  
  return labels;
};

/**
 * Generates mock alert trend data for demonstration
 */
export const generateMockAlertTrends = (): AlertTrendsData => {
  const labels = generateTimeLabels();
  const values = labels.map(() => Math.floor(Math.random() * 30) + 5);
  
  return { labels, values };
};

/**
 * Generates mock threat landscape data for demonstration
 */
export const generateMockThreatLandscape = (): ThreatChartData => ({
  critical: Math.floor(Math.random() * 15) + 5,
  high: Math.floor(Math.random() * 25) + 15,
  medium: Math.floor(Math.random() * 35) + 25,
  low: Math.floor(Math.random() * 20) + 10,
});

/**
 * Generates mock response time data for demonstration
 */
export const generateMockResponseTimes = (): ResponseTimeData => ({
  ranges: ['< 5min', '5-15min', '15-30min', '> 30min'],
  counts: [
    Math.floor(Math.random() * 30) + 20,
    Math.floor(Math.random() * 20) + 15,
    Math.floor(Math.random() * 15) + 8,
    Math.floor(Math.random() * 8) + 2,
  ],
});

/**
 * Generates mock threat category data for demonstration
 */
export const generateMockThreatCategories = (): ThreatCategoryData => ({
  categories: ['Malware', 'Phishing', 'DDoS', 'Data Breach', 'Insider Threat'],
  counts: [
    Math.floor(Math.random() * 20) + 15,
    Math.floor(Math.random() * 18) + 12,
    Math.floor(Math.random() * 15) + 10,
    Math.floor(Math.random() * 12) + 8,
    Math.floor(Math.random() * 10) + 5,
  ],
});