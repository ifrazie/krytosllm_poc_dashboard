import React from 'react';
import { PerformanceMetrics as PerformanceMetricsType } from '../../types/metrics';
import styles from './PerformanceMetrics.module.css';

export interface PerformanceMetricsProps {
  metrics: PerformanceMetricsType;
  className?: string;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  metrics,
  className = '',
}) => {
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatResponseTime = (value: number): string => {
    return `${value.toFixed(1)}min`;
  };

  const performanceItems = [
    {
      label: 'Accuracy Rate',
      value: formatPercentage(metrics.accuracy),
      className: styles.accuracyValue,
    },
    {
      label: 'False Positive Rate',
      value: formatPercentage(metrics.falsePositiveRate),
      className: styles.falsePositiveValue,
    },
    {
      label: 'Coverage',
      value: formatPercentage(metrics.coverage),
      className: styles.coverageValue,
    },
    {
      label: 'Avg Response Time',
      value: formatResponseTime(metrics.responseTime),
      className: styles.responseTimeValue,
    },
    {
      label: 'Detection Rate',
      value: formatPercentage(metrics.detectionRate),
      className: styles.detectionRateValue,
    },
  ];

  return (
    <div className={`${styles.performanceMetrics} ${className}`}>
      {performanceItems.map((item, index) => (
        <div key={index} className={styles.perfMetric}>
          <span className={styles.perfLabel}>{item.label}</span>
          <span className={`${styles.perfValue} ${item.className}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};