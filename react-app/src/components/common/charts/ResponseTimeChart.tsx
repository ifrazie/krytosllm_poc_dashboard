import React from 'react';
import BarChart from './BarChart';
import { ChartWrapper } from './BaseChart';
import { ResponseTimeData } from '../../../types/chart';
import type { ChartData } from 'chart.js';

interface ResponseTimeChartProps {
  data: ResponseTimeData;
  title?: string;
  className?: string;
  loading?: boolean;
  error?: string;
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({
  data,
  title = 'Response Times',
  className = '',
  loading = false,
  error,
}) => {
  // Transform response time data to Chart.js format
  const chartData: ChartData<'bar'> = {
    labels: data.ranges,
    datasets: [
      {
        label: 'Incidents',
        data: data.counts,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: '#8b5cf6',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
        hoverBackgroundColor: '#8b5cf6',
        hoverBorderColor: '#8b5cf6',
        hoverBorderWidth: 3,
      },
    ],
  };

  // Custom options for response time chart
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
            return `Response Time: ${context[0].label}`;
          },
          label: (context: { parsed: { y: number } }) => {
            return `Incidents: ${context.parsed.y}`;
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
  };

  return (
    <ChartWrapper title={title} className={className} loading={loading} error={error}>
      <BarChart data={chartData} options={chartOptions} />
    </ChartWrapper>
  );
};

export default ResponseTimeChart;