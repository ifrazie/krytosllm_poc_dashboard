import React from 'react';
import LineChart from './LineChart';
import { ChartWrapper } from './BaseChart';
import { AlertTrendsData } from '../../../types/chart';
import type { ChartData } from 'chart.js';

interface AlertTrendsChartProps {
  data: AlertTrendsData;
  title?: string;
  className?: string;
  loading?: boolean;
  error?: string;
}

const AlertTrendsChart: React.FC<AlertTrendsChartProps> = ({
  data,
  title = 'Alert Trends',
  className = '',
  loading = false,
  error,
}) => {
  // Transform alert trends data to Chart.js format
  const chartData: ChartData<'line'> = {
    labels: data.labels,
    datasets: [
      {
        label: 'Alerts',
        data: data.values,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#8b5cf6',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#8b5cf6',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Custom options for alert trends
  const chartOptions = {
    plugins: {
      legend: {
        display: false, // Hide legend for single dataset
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: (context: { label: string }[]) => {
            return `Time: ${context[0].label}`;
          },
          label: (context: { parsed: { y: number } }) => {
            return `Alerts: ${context.parsed.y}`;
          },
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
        beginAtZero: true,
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
    maintainAspectRatio: false,
    responsive: true,
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        tension: 0.4,
        borderWidth: 3,
      },
    },
  };

  return (
    <ChartWrapper title={title} className={className} loading={loading} error={error}>
      <LineChart data={chartData} options={chartOptions} />
    </ChartWrapper>
  );
};

export default AlertTrendsChart;