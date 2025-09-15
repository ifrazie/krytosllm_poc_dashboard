/**
 * AlertTable Component
 * 
 * Creates AlertTable using the shared Table component with alert-specific rendering.
 * Implements alert row rendering with severity badges, status indicators, row selection,
 * and bulk operations support with sorting and filtering integration.
 */

import React, { useMemo, useCallback } from 'react';
import { Table, type ColumnConfig } from '../common/Table';
import type { Alert, AlertFilters } from '../../types';
import styles from './AlertTable.module.css';

export interface AlertTableProps {
  alerts: Alert[];
  filters?: AlertFilters;
  selectedAlerts?: Alert[];
  onAlertSelect?: (alert: Alert) => void;
  onAlertsSelect?: (alerts: Alert[]) => void;
  onAlertClick?: (alert: Alert) => void;
  loading?: boolean;
  className?: string;
}

export const AlertTable: React.FC<AlertTableProps> = ({
  alerts,
  filters = {},
  selectedAlerts = [],
  onAlertSelect,
  onAlertsSelect,
  onAlertClick,
  loading = false,
  className = ''
}) => {
  // Filter alerts based on provided filters
  const filteredAlerts = useMemo(() => {
    console.log('AlertTable filtering - input alerts:', alerts.length, alerts);
    console.log('AlertTable filtering - filters:', filters);
    const result = alerts.filter(alert => {
      // Severity filter
      if (filters.severity && alert.severity !== filters.severity) {
        return false;
      }
      
      // Status filter
      if (filters.status && alert.status !== filters.status) {
        return false;
      }
      
      // Search filter - search in title, description, source, and AI analysis
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          alert.title,
          alert.description,
          alert.source,
          alert.aiAnalysis,
          ...alert.artifacts,
          ...alert.recommendedActions
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
    console.log('AlertTable filtering - result:', result.length, result);
    return result;
  }, [alerts, filters]);

  // Render severity badge
  const renderSeverity = useCallback((severity: string) => {
    const severityClass = `severity-${severity.toLowerCase()}`;
    return (
      <span className={`${styles.severityBadge} ${styles[severityClass]}`}>
        <i className={getSeverityIcon(severity)} />
        {severity}
      </span>
    );
  }, []);

  // Render status indicator
  const renderStatus = useCallback((status: string) => {
    const statusClass = `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <span className={`${styles.statusIndicator} ${styles[statusClass]}`}>
        <i className={getStatusIcon(status)} />
        {status}
      </span>
    );
  }, []);

  // Render risk score with color coding
  const renderRiskScore = useCallback((riskScore: number) => {
    const scoreClass = getRiskScoreClass(riskScore);
    return (
      <span className={`${styles.riskScore} ${styles[scoreClass]}`}>
        {riskScore}
      </span>
    );
  }, []);

  // Render timestamp in relative format
  const renderTimestamp = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    let timeText;
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      timeText = `${diffDays}d ago`;
    } else if (diffHours > 0) {
      timeText = `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      timeText = `${diffMinutes}m ago`;
    } else {
      timeText = 'Just now';
    }
    
    return (
      <span className={styles.timestamp} title={date.toLocaleString()}>
        {timeText}
      </span>
    );
  }, []);

  // Render actions column
  const renderActions = useCallback((value: any, alert: Alert) => {
    return (
      <div className={styles.actionsCell}>
        <button
          className={styles.actionButton}
          onClick={(e) => {
            e.stopPropagation();
            onAlertSelect?.(alert);
          }}
          title="View details"
          aria-label={`View details for ${alert.title}`}
        >
          <i className="fas fa-eye" />
        </button>
        <button
          className={styles.actionButton}
          onClick={(e) => {
            e.stopPropagation();
            // Handle escalate action
          }}
          title="Escalate alert"
          aria-label={`Escalate ${alert.title}`}
        >
          <i className="fas fa-exclamation-triangle" />
        </button>
        <button
          className={styles.actionButton}
          onClick={(e) => {
            e.stopPropagation();
            // Handle assign action
          }}
          title="Assign alert"
          aria-label={`Assign ${alert.title}`}
        >
          <i className="fas fa-user-plus" />
        </button>
      </div>
    );
  }, [onAlertSelect]);

  // Define table columns
  const columns: ColumnConfig<Alert>[] = useMemo(() => [
    {
      key: 'id',
      header: 'Alert ID',
      sortable: true,
      width: '120px',
      render: (id: string) => (
        <span className={styles.alertId}>#{id.slice(-6)}</span>
      )
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (title: string, alert: Alert) => (
        <div className={styles.titleCell}>
          <span className={styles.alertTitle}>{title}</span>
          {alert.description && (
            <span className={styles.alertDescription}>
              {alert.description.length > 60 
                ? `${alert.description.substring(0, 60)}...` 
                : alert.description
              }
            </span>
          )}
        </div>
      )
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      width: '120px',
      render: renderSeverity
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '150px',
      render: renderStatus
    },
    {
      key: 'source',
      header: 'Source',
      sortable: true,
      width: '130px',
      render: (source: string) => (
        <span className={styles.source}>{source}</span>
      )
    },
    {
      key: 'timestamp',
      header: 'Time',
      sortable: true,
      width: '100px',
      render: renderTimestamp
    },
    {
      key: 'riskScore',
      header: 'Risk Score',
      sortable: true,
      width: '100px',
      align: 'center',
      render: renderRiskScore
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '120px',
      align: 'center',
      render: renderActions
    }
  ], [renderSeverity, renderStatus, renderTimestamp, renderRiskScore, renderActions]);

  // Handle row click
  const handleRowClick = useCallback((alert: Alert) => {
    onAlertClick?.(alert);
  }, [onAlertClick]);

  // Handle row selection
  const handleRowsSelect = useCallback((selectedRows: Alert[]) => {
    onAlertsSelect?.(selectedRows);
  }, [onAlertsSelect]);

  console.log('AlertTable rendering - filteredAlerts:', filteredAlerts.length, filteredAlerts);
  console.log('AlertTable rendering - loading:', loading);

  return (
    <div className={`${styles.alertTableContainer} ${className}`}>
      <Table
        data={filteredAlerts}
        columns={columns}
        onRowClick={handleRowClick}
        onRowSelect={handleRowsSelect}
        selectable={!!onAlertsSelect}
        loading={loading}
        emptyMessage={
          filters.search || filters.severity || filters.status
            ? "No alerts match the current filters"
            : "No alerts available"
        }
        className={styles.alertTable}
      />
      
      {/* Results summary */}
      {filteredAlerts.length > 0 && (
        <div className={styles.resultsSummary}>
          Showing {filteredAlerts.length} of {alerts.length} alerts
          {(filters.search || filters.severity || filters.status) && (
            <span className={styles.filteredIndicator}>
              (filtered)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Helper functions
function getSeverityIcon(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'fas fa-exclamation-circle';
    case 'high':
      return 'fas fa-exclamation-triangle';
    case 'medium':
      return 'fas fa-exclamation';
    case 'low':
      return 'fas fa-info-circle';
    default:
      return 'fas fa-question-circle';
  }
}

function getStatusIcon(status: string): string {
  switch (status.toLowerCase()) {
    case 'active threat':
      return 'fas fa-fire';
    case 'under investigation':
      return 'fas fa-search';
    case 'auto-contained':
      return 'fas fa-shield-alt';
    case 'resolved':
      return 'fas fa-check-circle';
    case 'new':
      return 'fas fa-plus-circle';
    case 'investigating':
      return 'fas fa-search';
    default:
      return 'fas fa-question-circle';
  }
}

function getRiskScoreClass(score: number): string {
  if (score >= 80) return 'risk-critical';
  if (score >= 60) return 'risk-high';
  if (score >= 40) return 'risk-medium';
  return 'risk-low';
}

export default AlertTable;