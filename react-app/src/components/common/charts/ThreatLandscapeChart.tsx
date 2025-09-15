import React from 'react';
import DoughnutChart from './DoughnutChart';
import { ChartWrapper } from './BaseChart';
import { ThreatChartData } from '../../../types/chart';
import type { ChartData } from 'chart.js';

interface ThreatLandscapeChartProps {
  data: ThreatChartData | null;
  title?: string;
  className?: string;
  loading?: boolean;
  error?: string;
}

const ThreatLandscapeChart: React.FC<ThreatLandscapeChartProps> = React.memo(({
  data,
  title = 'Threat Landscape',
  className = '',
  loading = false,
  error,
}) => {
  // Memoize chart data transformation to prevent unnecessary recalculations
  const chartData: ChartData<'doughnut'> = React.useMemo(() => {
    if (!data) {
      return {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
          borderColor: 'rgba(139, 92, 246, 0.3)',
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverBorderColor: '#8b5cf6',
        }],
      };
    }
    
    return {
      labels: ['Critical', 'High', 'Medium', 'Low'],
      datasets: [
        {
          data: [data.critical, data.high, data.medium, data.low],
          backgroundColor: [
            '#ef4444', // Critical - Red
            '#f97316', // High - Orange
            '#eab308', // Medium - Yellow
            '#22c55e', // Low - Green
          ],
          borderColor: 'rgba(139, 92, 246, 0.3)',
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverBorderColor: '#8b5cf6',
        },
      ],
    };
  }, [data]);

  // Memoize chart options to prevent unnecessary re-renders
  const chartOptions = React.useMemo(() => ({
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e2e8f0',
          font: {
            family: 'FKGroteskNeue, -apple-system, BlinkMacSystemFont, sans-serif',
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context: { label?: string; parsed?: number; dataset: { data: number[] } }) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%', // Creates the doughnut hole
    maintainAspectRatio: false,
    responsive: true,
  }), []);

  return (
    <ChartWrapper title={title} className={className} loading={loading} error={error}>
      <DoughnutChart data={chartData} options={chartOptions} />
    </ChartWrapper>
  );
});

export default ThreatLandscapeChart;