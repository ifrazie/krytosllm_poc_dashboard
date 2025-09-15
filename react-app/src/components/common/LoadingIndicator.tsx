/**
 * LoadingIndicator Component
 * Various loading indicators for different use cases
 */

import React from 'react';
import styles from './LoadingIndicator.module.css';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  message?: string;
  overlay?: boolean;
  className?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  variant = 'spinner',
  message,
  overlay = false,
  className = ''
}) => {
  const renderIndicator = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={`${styles.dotsIndicator} ${styles[size]}`}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${styles.pulseIndicator} ${styles[size]}`}>
            <div className={styles.pulse}></div>
          </div>
        );
      
      case 'bars':
        return (
          <div className={`${styles.barsIndicator} ${styles[size]}`}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        );
      
      case 'spinner':
      default:
        return (
          <div className={`${styles.spinnerIndicator} ${styles[size]}`}>
            <div className={styles.spinner}></div>
          </div>
        );
    }
  };

  const content = (
    <div className={`${styles.loadingContainer} ${className}`}>
      {renderIndicator()}
      {message && (
        <div className={styles.loadingMessage}>{message}</div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className={styles.loadingOverlay}>
        {content}
      </div>
    );
  }

  return content;
};

// Specialized loading components
export const ChartLoadingIndicator: React.FC<{ message?: string }> = ({ 
  message = 'Loading chart data...' 
}) => (
  <div className={styles.chartLoading}>
    <LoadingIndicator variant="pulse" size="lg" message={message} />
  </div>
);

export const TableLoadingIndicator: React.FC<{ message?: string }> = ({ 
  message = 'Loading data...' 
}) => (
  <div className={styles.tableLoading}>
    <LoadingIndicator variant="bars" size="md" message={message} />
  </div>
);

export const ButtonLoadingIndicator: React.FC = () => (
  <LoadingIndicator variant="spinner" size="sm" className={styles.buttonLoading} />
);

export const OverlayLoadingIndicator: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => (
  <LoadingIndicator 
    variant="spinner" 
    size="lg" 
    message={message} 
    overlay 
  />
);