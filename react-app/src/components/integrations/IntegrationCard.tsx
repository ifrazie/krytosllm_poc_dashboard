import React from 'react';
import type { Integration } from '../../types';
import styles from './IntegrationCard.module.css';

export interface IntegrationCardProps {
  integration: Integration;
  className?: string;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  className = '',
}) => {
  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'Connected':
        return 'fas fa-check-circle';
      case 'Degraded':
        return 'fas fa-exclamation-triangle';
      case 'Disconnected':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-question-circle';
    }
  };

  const getHealthIcon = (health: Integration['health']) => {
    switch (health) {
      case 'Healthy':
        return 'fas fa-heart';
      case 'Warning':
        return 'fas fa-exclamation-triangle';
      case 'Error':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-question-circle';
    }
  };

  return (
    <div className={`${styles.integrationCard} ${styles[integration.status.toLowerCase()]} ${className}`}>
      <div className={styles.cardHeader}>
        <div className={styles.integrationName}>
          <h3>{integration.name}</h3>
        </div>
        <div className={styles.statusIndicator}>
          <i className={`${getStatusIcon(integration.status)} ${styles.statusIcon}`}></i>
        </div>
      </div>
      
      <div className={styles.cardBody}>
        <div className={styles.statusInfo}>
          <div className={styles.statusItem}>
            <span className={styles.label}>Status:</span>
            <span className={`${styles.status} ${styles[integration.status.toLowerCase()]}`}>
              {integration.status}
            </span>
          </div>
          
          <div className={styles.statusItem}>
            <span className={styles.label}>Health:</span>
            <span className={`${styles.health} ${styles[integration.health.toLowerCase()]}`}>
              <i className={`${getHealthIcon(integration.health)} ${styles.healthIcon}`}></i>
              {integration.health}
            </span>
          </div>
        </div>
        
        <div className={styles.syncInfo}>
          <div className={styles.syncItem}>
            <i className="fas fa-sync-alt"></i>
            <span className={styles.syncText}>Last sync: {integration.lastSync}</span>
          </div>
        </div>
      </div>
    </div>
  );
};