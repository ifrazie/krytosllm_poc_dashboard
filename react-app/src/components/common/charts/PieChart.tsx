import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { PieChartProps } from '../../../types/chart';
import { defaultChartOptions, chartColors } from './BaseChart';

const PieChart: React.FC<PieChartProps> = ({
  data,
  options = {},
  width,
  height,
  className = '',
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate data
    if (!data || !data.datasets || data.datasets.length === 0) {
      setError('No data provided for chart');
      setIsLoading(false);
      return;
    }

    // Check if datasets have data
    const hasData = data.datasets.some(dataset => 
      dataset.data && Array.isArray(dataset.data) && dataset.data.length > 0
    );

    if (!hasData) {
      setError('No valid data in datasets');
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(false);
  }, [data]);

  // Merge default options with provided options
  const chartOptions = {
    ...defaultChartOptions,
    ...options,
    plugins: {
      ...defaultChartOptions.plugins,
      ...options.plugins,
      legend: {
        ...defaultChartOptions.plugins?.legend,
        ...options.plugins?.legend,
        position: 'bottom' as const,
      },
    },
    // Remove scales for pie charts
    scales: undefined,
    // Add error handling
    onError: (error: Error) => {
      console.error('Chart.js error:', error);
      setError('Failed to render chart');
    },
  };

  // Apply default colors if not provided
  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || [
        chartColors.primary,
        chartColors.secondary,
        chartColors.accent,
        chartColors.info,
        chartColors.critical,
        chartColors.high,
        chartColors.medium,
        chartColors.low,
      ],
      borderColor: dataset.borderColor || 'rgba(139, 92, 246, 0.3)',
      borderWidth: dataset.borderWidth || 2,
      hoverBorderWidth: 3,
      hoverBorderColor: '#8b5cf6',
    })),
  };

  if (error) {
    return (
      <div className={className} style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className} style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
          <div>Loading chart...</div>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className={className} style={{ width, height }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    );
  } catch (err) {
    console.error('Error rendering pie chart:', err);
    return (
      <div className={className} style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
          <div>Failed to render chart</div>
        </div>
      </div>
    );
  }
};

export default PieChart;