import React from 'react';
import styles from './ChartCard.module.css';

export interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  className = '',
  loading = false,
  error,
}) => {
  if (error) {
    return (
      <div className={`${styles.chartCard} ${className}`}>
        <h3 className={styles.chartTitle}>{title}</h3>
        <div className={styles.chartError}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>Error loading chart: {error}</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${styles.chartCard} ${className}`}>
        <h3 className={styles.chartTitle}>{title}</h3>
        <div className={styles.chartLoading}>
          <div className={styles.loadingSkeleton}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.chartCard} ${className}`}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.chartContainer}>
        {children}
      </div>
    </div>
  );
};