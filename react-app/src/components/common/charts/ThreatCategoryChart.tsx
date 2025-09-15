import React from 'react';
import PieChart from './PieChart';
import { ChartWrapper } from './BaseChart';
import { ThreatCategoryData } from '../../../types/chart';
import type { ChartData } from 'chart.js';

interface ThreatCategoryChartProps {
  data: ThreatCategoryData;
  title?: string;
  className?: string;
  loading?: boolean;
  error?: string;
}

const ThreatCategoryChart: React.FC<ThreatCategoryChartProps> = ({
  data,
  title = 'Threat Categories',
  className = '',
  loading = false,
  error,
}) => {
  // Transform threat category data to Chart.js format
  const chartData: ChartData<'pie'> = {
    labels: data.categories,
    datasets: [
      {
        data: data.counts,
        backgroundColor: [
          '#8b5cf6', // Primary purple
          '#06b6d4', // Cyan
          '#f59e0b', // Amber
          '#ef4444', // Red
          '#22c55e', // Green
          '#f97316', // Orange
          '#3b82f6', // Blue
          '#ec4899', // Pink
        ],
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: '#8b5cf6',
      },
    ],
  };

  // Custom options for threat category chart
  const chartOptions = {
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
          padding: 15,
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
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <ChartWrapper title={title} className={className} loading={loading} error={error}>
      <PieChart data={chartData} options={chartOptions} />
    </ChartWrapper>
  );
};

export default ThreatCategoryChart;