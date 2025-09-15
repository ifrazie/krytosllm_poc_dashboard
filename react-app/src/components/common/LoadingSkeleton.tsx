/**
 * LoadingSkeleton Component
 * Reusable loading skeleton components for different content types
 */

import React from 'react';
import styles from './LoadingSkeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  className = ''
}) => (
  <div
    className={`${styles.skeleton} ${className}`}
    style={{
      width,
      height,
      borderRadius,
    }}
  />
);

// Card skeleton for dashboard metrics and other cards
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`${styles.cardSkeleton} ${className}`}>
    <div className={styles.cardHeader}>
      <Skeleton width="60%" height="1.25rem" />
      <Skeleton width="2rem" height="2rem" borderRadius="50%" />
    </div>
    <div className={styles.cardContent}>
      <Skeleton width="80%" height="2rem" />
      <Skeleton width="40%" height="1rem" />
    </div>
  </div>
);

// Table skeleton for data tables
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number;
  className?: string;
}> = ({ 
  rows = 5, 
  columns = 4,
  className = '' 
}) => (
  <div className={`${styles.tableSkeleton} ${className}`}>
    {/* Table header */}
    <div className={styles.tableHeader}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={`header-${index}`} height="1rem" />
      ))}
    </div>
    
    {/* Table rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className={styles.tableRow}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} height="1rem" />
        ))}
      </div>
    ))}
  </div>
);

// Chart skeleton for chart components
export const ChartSkeleton: React.FC<{ 
  type?: 'bar' | 'line' | 'doughnut' | 'pie';
  className?: string;
}> = ({ 
  type = 'bar',
  className = '' 
}) => (
  <div className={`${styles.chartSkeleton} ${className}`}>
    <div className={styles.chartHeader}>
      <Skeleton width="50%" height="1.25rem" />
    </div>
    <div className={styles.chartContent}>
      {type === 'doughnut' || type === 'pie' ? (
        <div className={styles.doughnutChart}>
          <Skeleton width="200px" height="200px" borderRadius="50%" />
        </div>
      ) : (
        <div className={styles.barLineChart}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.chartBar}>
              <Skeleton 
                height={`${Math.random() * 60 + 20}%`} 
                borderRadius="2px 2px 0 0"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// List skeleton for alert feeds and other lists
export const ListSkeleton: React.FC<{ 
  items?: number;
  showAvatar?: boolean;
  className?: string;
}> = ({ 
  items = 5,
  showAvatar = false,
  className = '' 
}) => (
  <div className={`${styles.listSkeleton} ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className={styles.listItem}>
        {showAvatar && (
          <Skeleton width="2.5rem" height="2.5rem" borderRadius="50%" />
        )}
        <div className={styles.listContent}>
          <Skeleton width="70%" height="1rem" />
          <Skeleton width="50%" height="0.875rem" />
        </div>
        <div className={styles.listMeta}>
          <Skeleton width="4rem" height="0.75rem" />
        </div>
      </div>
    ))}
  </div>
);

// Dashboard skeleton combining multiple skeleton types
export const DashboardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`${styles.dashboardSkeleton} ${className}`}>
    {/* Metrics grid */}
    <div className={styles.metricsGrid}>
      {Array.from({ length: 4 }).map((_, index) => (
        <CardSkeleton key={`metric-${index}`} />
      ))}
    </div>
    
    {/* Main content area */}
    <div className={styles.dashboardContent}>
      <div className={styles.leftColumn}>
        <ChartSkeleton type="doughnut" />
        <ListSkeleton items={6} />
      </div>
      <div className={styles.rightColumn}>
        <CardSkeleton />
        <ListSkeleton items={4} showAvatar />
      </div>
    </div>
  </div>
);