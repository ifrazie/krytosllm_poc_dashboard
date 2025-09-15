/**
 * AlertDebugInfo Component
 * 
 * Debug information panel for alert management development.
 * Only rendered in development environment.
 */

import React from 'react';
import type { Alert, AlertFilters } from '../../types';
import styles from './AlertDebugInfo.module.css';

interface AlertDebugInfoProps {
  currentSection: string;
  alerts: Alert[];
  loading: boolean;
  filters: AlertFilters;
  filteredAlertsCount: number;
}

export const AlertDebugInfo: React.FC<AlertDebugInfoProps> = ({
  currentSection,
  alerts,
  loading,
  filters,
  filteredAlertsCount
}) => {
  // Only render in development
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  const firstAlert = alerts.length > 0 ? alerts[0] : null;
  const sanitizedFirstAlert = firstAlert ? {
    id: firstAlert.id,
    title: firstAlert.title,
    severity: firstAlert.severity,
    status: firstAlert.status,
    timestamp: firstAlert.timestamp
  } : null;

  return (
    <div className={styles.debugPanel} data-testid="alert-debug-info">
      <h3 className={styles.debugTitle}>Debug Information</h3>
      <div className={styles.debugGrid}>
        <div className={styles.debugItem}>
          <span className={styles.debugLabel}>Current Section:</span>
          <span className={styles.debugValue}>{currentSection}</span>
        </div>
        <div className={styles.debugItem}>
          <span className={styles.debugLabel}>Total Alerts:</span>
          <span className={styles.debugValue}>{alerts.length}</span>
        </div>
        <div className={styles.debugItem}>
          <span className={styles.debugLabel}>Filtered Count:</span>
          <span className={styles.debugValue}>{filteredAlertsCount}</span>
        </div>
        <div className={styles.debugItem}>
          <span className={styles.debugLabel}>Loading:</span>
          <span className={styles.debugValue}>{loading ? 'Yes' : 'No'}</span>
        </div>
        <div className={styles.debugItem}>
          <span className={styles.debugLabel}>Active Filters:</span>
          <span className={styles.debugValue}>
            {Object.keys(filters).length > 0 ? Object.keys(filters).join(', ') : 'None'}
          </span>
        </div>
        <div className={styles.debugItem}>
          <span className={styles.debugLabel}>First Alert ID:</span>
          <span className={styles.debugValue}>
            {sanitizedFirstAlert?.id || 'None'}
          </span>
        </div>
      </div>
      
      {sanitizedFirstAlert && (
        <details className={styles.debugDetails}>
          <summary>First Alert Details</summary>
          <pre className={styles.debugJson}>
            {JSON.stringify(sanitizedFirstAlert, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};