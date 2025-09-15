import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { LineChartProps } from '../../../types/chart';
import { defaultChartOptions, chartColors } from './BaseChart';

const LineChart: React.FC<LineChartProps> = ({
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
    },
    scales: {
      ...defaultChartOptions.scales,
      ...options.scales,
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: chartColors.primary,
        borderColor: chartColors.primary,
        borderWidth: 2,
      },
      line: {
        tension: 0.4,
        borderWidth: 3,
      },
    },
    // Add error handling
    onError: (error: Error) => {
      console.error('Chart.js error:', error);
      setError('Failed to render chart');
    },
  };

  // Apply default colors and styling if not provided
  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || `${chartColors.primary}20`,
      borderColor: dataset.borderColor || chartColors.primary,
      borderWidth: dataset.borderWidth || 3,
      fill: dataset.fill !== undefined ? dataset.fill : true,
      pointBackgroundColor: dataset.pointBackgroundColor || chartColors.primary,
      pointBorderColor: dataset.pointBorderColor || chartColors.primary,
      pointHoverBackgroundColor: dataset.pointHoverBackgroundColor || '#ffffff',
      pointHoverBorderColor: dataset.pointHoverBorderColor || chartColors.primary,
      tension: dataset.tension || 0.4,
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
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  } catch (err) {
    console.error('Error rendering line chart:', err);
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

export default LineChart;