/**
 * EmptyState Component
 * Reusable empty state components for different content types
 */

import React, { ReactNode } from 'react';
import { Button } from './Button';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'fas fa-inbox',
  title,
  description,
  action,
  children,
  className = ''
}) => (
  <div className={`${styles.emptyState} ${className}`}>
    <div className={styles.emptyContent}>
      <div className={styles.emptyIcon}>
        <i className={icon}></i>
      </div>
      <h3 className={styles.emptyTitle}>{title}</h3>
      {description && (
        <p className={styles.emptyDescription}>{description}</p>
      )}
      {children && (
        <div className={styles.emptyCustomContent}>
          {children}
        </div>
      )}
      {action && (
        <div className={styles.emptyAction}>
          <Button
            variant="primary"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  </div>
);

// Specialized empty states for different sections
export const NoAlertsState: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => (
  <EmptyState
    icon="fas fa-shield-alt"
    title="No Active Alerts"
    description="Your security environment is currently quiet. All systems are operating normally."
    action={onRefresh ? {
      label: 'Refresh Alerts',
      onClick: onRefresh
    } : undefined}
  />
);

export const NoInvestigationsState: React.FC<{ onCreate?: () => void }> = ({ onCreate }) => (
  <EmptyState
    icon="fas fa-search"
    title="No Active Investigations"
    description="There are currently no ongoing security investigations. Start a new investigation when threats are detected."
    action={onCreate ? {
      label: 'Start Investigation',
      onClick: onCreate
    } : undefined}
  />
);

export const NoIncidentsState: React.FC<{ onCreate?: () => void }> = ({ onCreate }) => (
  <EmptyState
    icon="fas fa-clipboard-list"
    title="No Incidents Reported"
    description="No security incidents have been reported. This indicates good security posture."
    action={onCreate ? {
      label: 'Report Incident',
      onClick: onCreate
    } : undefined}
  />
);

export const NoHuntResultsState: React.FC<{ onNewSearch?: () => void }> = ({ onNewSearch }) => (
  <EmptyState
    icon="fas fa-binoculars"
    title="No Hunt Results"
    description="Your threat hunting query didn't return any results. Try adjusting your search criteria or exploring different threat patterns."
    action={onNewSearch ? {
      label: 'New Search',
      onClick: onNewSearch
    } : undefined}
  >
    <div className={styles.huntSuggestions}>
      <h4>Try searching for:</h4>
      <ul>
        <li>Suspicious network connections</li>
        <li>Unusual file modifications</li>
        <li>Failed authentication attempts</li>
        <li>Privilege escalation activities</li>
      </ul>
    </div>
  </EmptyState>
);

export const NoDataState: React.FC<{ 
  dataType?: string;
  onRetry?: () => void;
}> = ({ 
  dataType = 'data',
  onRetry 
}) => (
  <EmptyState
    icon="fas fa-database"
    title={`No ${dataType} Available`}
    description={`Unable to load ${dataType.toLowerCase()}. This might be due to a temporary issue or no data being available.`}
    action={onRetry ? {
      label: 'Retry',
      onClick: onRetry
    } : undefined}
  />
);

export const SearchEmptyState: React.FC<{ 
  searchTerm?: string;
  onClearSearch?: () => void;
}> = ({ 
  searchTerm,
  onClearSearch 
}) => (
  <EmptyState
    icon="fas fa-search"
    title="No Results Found"
    description={
      searchTerm 
        ? `No results found for "${searchTerm}". Try adjusting your search terms.`
        : "No results match your current filters. Try adjusting your search criteria."
    }
    action={onClearSearch ? {
      label: 'Clear Search',
      onClick: onClearSearch
    } : undefined}
  />
);

export const LoadingState: React.FC<{ 
  message?: string;
  showSpinner?: boolean;
}> = ({ 
  message = 'Loading...',
  showSpinner = true 
}) => (
  <div className={styles.loadingState}>
    {showSpinner && (
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
      </div>
    )}
    <p className={styles.loadingMessage}>{message}</p>
  </div>
);