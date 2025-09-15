/**
 * AlertFeed Component
 * 
 * Displays recent alerts in a scrollable feed with severity indicators
 * and time formatting. Connects to global alerts state for real-time updates.
 */

import React from 'react';
import { useAppContext } from '../../context';
import { ListSkeleton, NoAlertsState } from '../common';
import type { Alert } from '../../types';
import styles from './AlertFeed.module.css';

interface AlertItemProps {
  alert: Alert;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getSeverityClass = (severity: string): string => {
    return severity.toLowerCase();
  };

  return (
    <div className={styles.alertItem}>
      <div className={`${styles.alertSeverity} ${styles[getSeverityClass(alert.severity)]}`}></div>
      <div className={styles.alertContent}>
        <h4>{alert.title}</h4>
        <p>{alert.source}</p>
      </div>
      <div className={styles.alertTime}>
        {formatTime(alert.timestamp)}
      </div>
    </div>
  );
};

export const AlertFeed: React.FC = () => {
  const { state } = useAppContext();
  const { alerts, loading } = state;

  // Get the 5 most recent alerts
  const recentAlerts = alerts.slice(0, 5);

  if (loading?.alerts) {
    return (
      <div className={styles.alertFeed}>
        <ListSkeleton items={5} className={styles.alertSkeleton} />
      </div>
    );
  }

  if (recentAlerts.length === 0) {
    return (
      <div className={styles.alertFeed}>
        <NoAlertsState />
      </div>
    );
  }

  return (
    <div className={styles.alertFeed}>
      {recentAlerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </div>
  );
};

export default AlertFeed;