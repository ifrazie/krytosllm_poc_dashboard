/**
 * Chart and visualization-related type definitions
 */

import type { ChartData, ChartOptions } from 'chart.js';

export type ChartType = 'line' | 'bar' | 'doughnut' | 'pie' | 'radar' | 'polarArea';

export interface BaseChartProps {
  data: ChartData;
  options?: ChartOptions;
  width?: number;
  height?: number;
  className?: string;
}

export interface LineChartProps extends BaseChartProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
}

export interface BarChartProps extends BaseChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
}

export interface DoughnutChartProps extends BaseChartProps {
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
}

export interface PieChartProps extends BaseChartProps {
  data: ChartData<'pie'>;
  options?: ChartOptions<'pie'>;
}

export interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
  fallbackData?: Array<{ label: string; value: number | string }>;
}

export interface ThreatChartData {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface AlertTrendsData {
  labels: string[];
  values: number[];
}

export interface ResponseTimeData {
  ranges: string[];
  counts: number[];
}

export interface ThreatCategoryData {
  categories: string[];
  counts: number[];
}