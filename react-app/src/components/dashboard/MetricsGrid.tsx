/**
 * MetricsGrid Component
 * 
 * Displays key SOC metrics in a grid layout with metric cards showing
 * values, trends, and icons. Matches the existing dashboard design exactly.
 */

import React from 'react';
import { useAppContext } from '../../context';
import styles from './MetricsGrid.module.css';

interface MetricCardProps {
  icon: string;
  title: string;
  value: string | number;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, trend, trendType }) => {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricIcon}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div className={styles.metricContent}>
        <h3>{typeof value === 'number' ? value.toLocaleString() : value}</h3>
        <p>{title}</p>
        <span className={`${styles.trend} ${styles[trendType]}`}>
          {trend}
        </span>
      </div>
    </div>
  );
};

export const MetricsGrid: React.FC = () => {
  const { state } = useAppContext();
  const { metrics, alerts } = state;

  // Calculate active alerts count
  const activeAlertsCount = alerts?.filter(alert => alert.status !== 'Resolved').length || 0;

  // Determine trend types based on trend values
  const getTrendType = (trend: string): 'positive' | 'negative' | 'neutral' => {
    if (trend.startsWith('+')) return 'positive';
    if (trend.startsWith('-')) return 'negative';
    return 'neutral';
  };

  // Special handling for MTTR trend (negative is good for response time)
  const getMttrTrendType = (trend: string): 'positive' | 'negative' | 'neutral' => {
    if (trend.startsWith('-')) return 'positive'; // Negative MTTR trend is good
    if (trend.startsWith('+')) return 'negative'; // Positive MTTR trend is bad
    return 'neutral';
  };

  return (
    <div className={styles.metricsGrid}>
      <MetricCard
        icon="fa-exclamation-triangle"
        title="Total Alerts"
        value={metrics.totalAlerts}
        trend={metrics.alertsTrend}
        trendType={getTrendType(metrics.alertsTrend)}
      />
      
      <MetricCard
        icon="fa-search"
        title="Active Investigations"
        value={metrics.activeInvestigations}
        trend={metrics.investigationsTrend}
        trendType={getTrendType(metrics.investigationsTrend)}
      />
      
      <MetricCard
        icon="fa-check-circle"
        title="Resolved Incidents"
        value={metrics.resolvedIncidents}
        trend={metrics.incidentsTrend}
        trendType={getTrendType(metrics.incidentsTrend)}
      />
      
      <MetricCard
        icon="fa-clock"
        title="Mean Time to Response"
        value={metrics.mttr}
        trend={metrics.mttrTrend}
        trendType={getMttrTrendType(metrics.mttrTrend)}
      />
      
      <MetricCard
        icon="fa-shield-alt"
        title="Active Alerts"
        value={activeAlertsCount}
        trend="Real-time"
        trendType="neutral"
      />
      
      {metrics.accuracy && (
        <MetricCard
          icon="fa-bullseye"
          title="Detection Accuracy"
          value={metrics.accuracy}
          trend={metrics.accuracyTrend || "0%"}
          trendType={getTrendType(metrics.accuracyTrend || "0%")}
        />
      )}
    </div>
  );
};

export default MetricsGrid;