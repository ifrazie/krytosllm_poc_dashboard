import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { ChartWrapperProps } from '../../../types/chart';
import { ChartErrorBoundary } from '../ChartErrorBoundary';
import { ChartLoadingIndicator } from '../LoadingIndicator';
import styles from './BaseChart.module.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Default chart options for dark cybersecurity theme
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#e2e8f0',
        font: {
          family: 'FKGroteskNeue, -apple-system, BlinkMacSystemFont, sans-serif',
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      titleColor: '#e2e8f0',
      bodyColor: '#cbd5e1',
      borderColor: '#334155',
      borderWidth: 1,
      cornerRadius: 8,
      titleFont: {
        family: 'FKGroteskNeue, -apple-system, BlinkMacSystemFont, sans-serif',
        size: 14,
        weight: 'bold' as const,
      },
      bodyFont: {
        family: 'FKGroteskNeue, -apple-system, BlinkMacSystemFont, sans-serif',
        size: 12,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#94a3b8',
        font: {
          family: 'FKGroteskNeue, -apple-system, BlinkMacSystemFont, sans-serif',
          size: 11,
        },
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
      },
    },
    y: {
      ticks: {
        color: '#94a3b8',
        font: {
          family: 'FKGroteskNeue, -apple-system, BlinkMacSystemFont, sans-serif',
          size: 11,
        },
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
      },
    },
  },
};

// Cybersecurity color palette
export const chartColors = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  info: '#3b82f6',
  primary: '#8b5cf6',
  secondary: '#06b6d4',
  accent: '#f59e0b',
  background: 'rgba(139, 92, 246, 0.1)',
  border: '#8b5cf6',
};

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  children,
  className = '',
  loading = false,
  error,
  fallbackData,
}) => {
  if (loading) {
    return (
      <div className={`${styles.chartWrapper} ${className}`}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>{title}</h3>
        </div>
        <ChartLoadingIndicator message={`Loading ${title?.toLowerCase() || 'chart'}...`} />
      </div>
    );
  }

  return (
    <div className={`${styles.chartWrapper} ${className}`}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>{title}</h3>
      </div>
      <div className={styles.chartContainer}>
        <ChartErrorBoundary 
          chartTitle={title}
          fallbackData={fallbackData}
        >
          {children}
        </ChartErrorBoundary>
      </div>
    </div>
  );
};