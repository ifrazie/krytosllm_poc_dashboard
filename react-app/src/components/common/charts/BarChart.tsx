import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { BarChartProps } from '../../../types/chart';
import { defaultChartOptions, chartColors } from './BaseChart';

const BarChart: React.FC<BarChartProps> = ({
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
      y: {
        ...defaultChartOptions.scales?.y,
        ...options.scales?.y,
        beginAtZero: true,
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
    datasets: data.datasets.map((dataset, index) => {
      const colors = [
        chartColors.primary,
        chartColors.secondary,
        chartColors.accent,
        chartColors.info,
      ];
      
      return {
        ...dataset,
        backgroundColor: dataset.backgroundColor || `${colors[index % colors.length]}80`,
        borderColor: dataset.borderColor || colors[index % colors.length],
        borderWidth: dataset.borderWidth || 2,
        borderRadius: dataset.borderRadius || 4,
        borderSkipped: false,
        hoverBackgroundColor: dataset.hoverBackgroundColor || colors[index % colors.length],
        hoverBorderColor: dataset.hoverBorderColor || colors[index % colors.length],
        hoverBorderWidth: 3,
      };
    }),
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
        <Bar data={chartData} options={chartOptions} />
      </div>
    );
  } catch (err) {
    console.error('Error rendering bar chart:', err);
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

export default BarChart;