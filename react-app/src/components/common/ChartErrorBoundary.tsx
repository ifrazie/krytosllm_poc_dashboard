/**
 * ChartErrorBoundary Component
 * Specialized Error Boundary for chart components with fallback to data tables
 */

import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import styles from './ChartErrorBoundary.module.css';

interface ChartErrorBoundaryProps {
  children: ReactNode;
  chartTitle?: string;
  fallbackData?: Array<{ label: string; value: number | string }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const ChartErrorFallback: React.FC<{
  chartTitle?: string;
  fallbackData?: Array<{ label: string; value: number | string }>;
  onRetry: () => void;
}> = ({ chartTitle = 'Chart', fallbackData, onRetry }) => (
  <div className={styles.chartError}>
    <div className={styles.errorHeader}>
      <div className={styles.errorIcon}>
        <i className="fas fa-chart-bar"></i>
      </div>
      <div className={styles.errorInfo}>
        <h4 className={styles.errorTitle}>Chart Unavailable</h4>
        <p className={styles.errorMessage}>
          Unable to render {chartTitle.toLowerCase()}. Showing data in table format.
        </p>
      </div>
      <button 
        className={styles.retryButton}
        onClick={onRetry}
        title="Retry loading chart"
      >
        <i className="fas fa-redo"></i>
      </button>
    </div>

    {fallbackData && fallbackData.length > 0 && (
      <div className={styles.fallbackTable}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {fallbackData.map((item, index) => (
              <tr key={index}>
                <td>{item.label}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {(!fallbackData || fallbackData.length === 0) && (
      <div className={styles.noDataMessage}>
        <i className="fas fa-database"></i>
        <span>No data available to display</span>
      </div>
    )}
  </div>
);

export const ChartErrorBoundary: React.FC<ChartErrorBoundaryProps> = ({
  children,
  chartTitle,
  fallbackData,
  onError
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log chart-specific error
    console.error(`Chart rendering error (${chartTitle}):`, error, errorInfo);
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  };

  return (
    <ErrorBoundary
      onError={handleError}
      fallback={
        <ChartErrorFallback
          chartTitle={chartTitle}
          fallbackData={fallbackData}
          onRetry={() => window.location.reload()}
        />
      }
    >
      {children}
    </ErrorBoundary>
  );
};