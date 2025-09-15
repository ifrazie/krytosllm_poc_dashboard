import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ChartCard } from './ChartCard';
import { PerformanceMetrics } from './PerformanceMetrics';
import { 
  AlertTrendsChart, 
  ResponseTimeChart, 
  ThreatCategoryChart 
} from '../common/charts';
import { mockPerformanceMetrics, mockChartData } from '../../data/mockData';
import styles from './Analytics.module.css';

export const Analytics: React.FC = () => {
  const { state } = useAppContext();
  const { loading, errors } = state;

  // Transform chart data to match expected formats
  const alertTrendsData = {
    labels: mockChartData.alertTrends.map(item => item.label),
    values: mockChartData.alertTrends.map(item => item.value)
  };

  const responseTimeData = {
    ranges: mockChartData.responseTimes.map(item => item.label),
    counts: mockChartData.responseTimes.map(item => item.value)
  };

  const threatCategoryData = {
    categories: mockChartData.threatCategories.map(item => item.label),
    counts: mockChartData.threatCategories.map(item => item.value)
  };

  return (
    <div className={styles.analytics}>
      <div className={styles.sectionHeader}>
        <h1>Analytics & Reporting</h1>
        <p>SOC performance metrics and threat intelligence</p>
      </div>

      <div className={styles.analyticsGrid}>
        <ChartCard
          title="Alert Trends"
          loading={loading.alerts}
          error={errors.alerts || undefined}
        >
          <AlertTrendsChart data={alertTrendsData} />
        </ChartCard>

        <ChartCard
          title="Response Times"
          loading={loading.metrics}
          error={errors.metrics || undefined}
        >
          <ResponseTimeChart data={responseTimeData} />
        </ChartCard>

        <ChartCard
          title="Threat Categories"
          loading={loading.alerts}
          error={errors.alerts || undefined}
        >
          <ThreatCategoryChart data={threatCategoryData} />
        </ChartCard>

        <ChartCard
          title="SOC Performance"
          loading={loading.metrics}
          error={errors.metrics || undefined}
        >
          <PerformanceMetrics metrics={mockPerformanceMetrics} />
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;