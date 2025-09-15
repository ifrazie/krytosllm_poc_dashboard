import React from 'react';
import { IntegrationCard } from './IntegrationCard';
import { useIntegrations } from '../../hooks/useIntegrations';
import styles from './Integrations.module.css';

export const Integrations: React.FC = () => {
  const { integrations, integrationStats, healthSummary, loading, error } = useIntegrations();

  if (loading) {
    return (
      <div className={styles.integrationsContainer}>
        <div className={styles.integrationsHeader}>
          <h2>System Integrations</h2>
          <div className={styles.loadingStats}>
            <div className={styles.loadingSkeleton}></div>
          </div>
        </div>
        <div className={styles.integrationsGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.loadingCard}>
              <div className={styles.loadingSkeleton}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.integrationsContainer}>
        <div className={styles.integrationsHeader}>
          <h2>System Integrations</h2>
        </div>
        <div className={styles.errorState}>
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error Loading Integrations</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (integrations.length === 0) {
    return (
      <div className={styles.integrationsContainer}>
        <div className={styles.integrationsHeader}>
          <h2>System Integrations</h2>
        </div>
        <div className={styles.emptyState}>
          <i className="fas fa-plug"></i>
          <h3>No Integrations Found</h3>
          <p>No system integrations are currently configured.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.integrationsContainer}>
      <div className={styles.integrationsHeader}>
        <h2>System Integrations</h2>
        <div className={styles.integrationsStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{integrationStats.total}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.statValue} ${styles.connected}`}>
              {integrationStats.byStatus.connected}
            </span>
            <span className={styles.statLabel}>Connected</span>
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.statValue} ${styles.degraded}`}>
              {integrationStats.byStatus.degraded}
            </span>
            <span className={styles.statLabel}>Degraded</span>
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.statValue} ${styles.disconnected}`}>
              {integrationStats.byStatus.disconnected}
            </span>
            <span className={styles.statLabel}>Disconnected</span>
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.statValue} ${styles[healthSummary.overallHealth]}`}>
              {Math.round(healthSummary.uptimePercentage)}%
            </span>
            <span className={styles.statLabel}>Uptime</span>
          </div>
        </div>
      </div>

      <div className={styles.integrationsGrid}>
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.name}
            integration={integration}
            className={styles.integrationCardWrapper}
          />
        ))}
      </div>

      {healthSummary.criticalCount > 0 && (
        <div className={styles.criticalAlert}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>
            {healthSummary.criticalCount} integration{healthSummary.criticalCount > 1 ? 's' : ''} 
            {healthSummary.criticalCount > 1 ? ' require' : ' requires'} attention
          </span>
        </div>
      )}
    </div>
  );
};

export default Integrations;