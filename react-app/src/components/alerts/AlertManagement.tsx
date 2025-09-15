/**
 * AlertManagement Component
 * 
 * Combines AlertFilters, AlertTable, and AlertModal into complete alert management section.
 * Implements alert selection and modal opening logic, bulk operations, and action handling.
 * Tests filtering, sorting, and modal interactions.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { AlertFilters } from './AlertFilters';
import { AlertTable } from './AlertTable';
import { AlertModal } from './AlertModal';
import { NoAlertsState, LoadingState } from '../common';
import { SimpleAlertTable } from '../debug/SimpleAlertTable';
import type { Alert, AlertFilters as AlertFiltersType } from '../../types';
import styles from './AlertManagement.module.css';

export interface AlertManagementProps {
  className?: string;
}

export const AlertManagement: React.FC<AlertManagementProps> = React.memo(({
  className = ''
}) => {
  const { state, updateAlert } = useAppContext();
  const { alerts, loading } = state;

  // Local state for filters and selections
  const [filters, setFilters] = useState<AlertFiltersType>({});
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedAlerts, setSelectedAlerts] = useState<Alert[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkActionMode, setBulkActionMode] = useState(false);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: AlertFiltersType) => {
    setFilters(newFilters);
  }, []);

  // Handle filter reset
  const handleFiltersReset = useCallback(() => {
    setFilters({});
  }, []);

  // Handle alert selection for modal
  const handleAlertSelect = useCallback((alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  }, []);

  // Handle alert click (same as select for now)
  const handleAlertClick = useCallback((alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  }, []);

  // Handle multiple alert selection for bulk operations
  const handleAlertsSelect = useCallback((alerts: Alert[]) => {
    setSelectedAlerts(alerts);
    setBulkActionMode(alerts.length > 0);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  }, []);

  // Handle alert escalation
  const handleAlertEscalate = useCallback((alert: Alert) => {
    // Update alert status to indicate escalation
    updateAlert(alert.id, {
      status: 'Under Investigation',
      // In a real app, you might also update other fields like assignee, priority, etc.
    });
    
    // Show success notification (in a real app)
    console.log(`Alert ${alert.id} escalated successfully`);
  }, [updateAlert]);

  // Handle alert assignment
  const handleAlertAssign = useCallback((alert: Alert, assignee: string) => {
    // Update alert with assignee information
    updateAlert(alert.id, {
      status: 'Under Investigation',
      // In a real app, you would have an assignee field
    });
    
    // Show success notification (in a real app)
    console.log(`Alert ${alert.id} assigned to ${assignee}`);
  }, [updateAlert]);

  // Handle alert resolution
  const handleAlertResolve = useCallback((alert: Alert, resolution: string) => {
    // Update alert status to resolved
    updateAlert(alert.id, {
      status: 'Resolved'
    });
    
    // Show success notification (in a real app)
    console.log(`Alert ${alert.id} resolved: ${resolution}`);
  }, [updateAlert]);

  // Handle alert status update
  const handleAlertStatusUpdate = useCallback((alert: Alert, status: Alert['status']) => {
    updateAlert(alert.id, { status });
  }, [updateAlert]);

  // Handle bulk operations
  const handleBulkEscalate = useCallback(() => {
    selectedAlerts.forEach(alert => {
      if (alert.status !== 'Resolved') {
        updateAlert(alert.id, { status: 'Under Investigation' });
      }
    });
    setSelectedAlerts([]);
    setBulkActionMode(false);
    console.log(`${selectedAlerts.length} alerts escalated`);
  }, [selectedAlerts, updateAlert]);

  const handleBulkResolve = useCallback(() => {
    selectedAlerts.forEach(alert => {
      if (alert.status !== 'Resolved') {
        updateAlert(alert.id, { status: 'Resolved' });
      }
    });
    setSelectedAlerts([]);
    setBulkActionMode(false);
    console.log(`${selectedAlerts.length} alerts resolved`);
  }, [selectedAlerts, updateAlert]);

  const handleBulkStatusChange = useCallback((status: Alert['status']) => {
    selectedAlerts.forEach(alert => {
      updateAlert(alert.id, { status });
    });
    setSelectedAlerts([]);
    setBulkActionMode(false);
    console.log(`${selectedAlerts.length} alerts updated to ${status}`);
  }, [selectedAlerts, updateAlert]);

  // Clear bulk selection
  const handleClearSelection = useCallback(() => {
    setSelectedAlerts([]);
    setBulkActionMode(false);
  }, []);

  // Get filtered alerts count for display
  const filteredAlertsCount = useMemo(() => {
    return alerts.filter(alert => {
      if (filters.severity && alert.severity !== filters.severity) return false;
      if (filters.status && alert.status !== filters.status) return false;
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
        if (!searchableText.includes(searchTerm)) return false;
      }
      return true;
    }).length;
  }, [alerts, filters]);

  return (
    <div className={`${styles.alertManagement} ${className}`}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.headerContent}>
          <h1>Alert Management</h1>
          <p>Monitor and respond to security alerts</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{alerts.length}</span>
            <span className={styles.statLabel}>Total Alerts</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{filteredAlertsCount}</span>
            <span className={styles.statLabel}>Filtered</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {alerts.filter(a => a.status === 'Active Threat').length}
            </span>
            <span className={styles.statLabel}>Active Threats</span>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {bulkActionMode && (
        <div className={styles.bulkActionsBar}>
          <div className={styles.bulkInfo}>
            <i className="fas fa-check-square" />
            <span>{selectedAlerts.length} alert{selectedAlerts.length !== 1 ? 's' : ''} selected</span>
          </div>
          
          <div className={styles.bulkActions}>
            <select
              className={styles.bulkStatusSelect}
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkStatusChange(e.target.value as Alert['status']);
                  e.target.value = '';
                }
              }}
              defaultValue=""
            >
              <option value="">Change Status...</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Auto-Contained">Auto-Contained</option>
              <option value="Resolved">Resolved</option>
            </select>
            
            <button
              className={`${styles.bulkButton} ${styles.escalateButton}`}
              onClick={handleBulkEscalate}
              disabled={selectedAlerts.every(a => a.status === 'Resolved')}
            >
              <i className="fas fa-exclamation-triangle" />
              Escalate
            </button>
            
            <button
              className={`${styles.bulkButton} ${styles.resolveButton}`}
              onClick={handleBulkResolve}
              disabled={selectedAlerts.every(a => a.status === 'Resolved')}
            >
              <i className="fas fa-check-circle" />
              Resolve
            </button>
            
            <button
              className={`${styles.bulkButton} ${styles.clearButton}`}
              onClick={handleClearSelection}
            >
              <i className="fas fa-times" />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Alert Filters */}
      <AlertFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
        className={styles.alertFilters}
      />

      {/* Debug: Simple Alert Table */}
      <div style={{ marginTop: '20px' }}>
        <SimpleAlertTable />
      </div>
      
      {/* Debug: Current section and data info */}
      <div style={{ background: 'yellow', color: 'black', padding: '10px', margin: '10px' }}>
        <p>Current section: {state.currentSection}</p>
        <p>Alerts count: {alerts.length}</p>
        <p>Loading alerts: {loading.alerts ? 'Yes' : 'No'}</p>
        <p>Filters: {JSON.stringify(filters)}</p>
      </div>

      {/* Alert Table */}
      <AlertTable
        alerts={alerts}
        filters={filters}
        selectedAlerts={selectedAlerts}
        onAlertSelect={handleAlertSelect}
        onAlertsSelect={handleAlertsSelect}
        onAlertClick={handleAlertClick}
        loading={loading.alerts}
        className={styles.alertTable}
      />

      {/* Alert Modal */}
      <AlertModal
        alert={selectedAlert}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onEscalate={handleAlertEscalate}
        onAssign={handleAlertAssign}
        onResolve={handleAlertResolve}
        onUpdateStatus={handleAlertStatusUpdate}
      />

      {/* Empty State */}
      {!loading.alerts && alerts.length === 0 && (
        <NoAlertsState />
      )}

      {/* Loading State */}
      {loading.alerts && (
        <LoadingState message="Loading security alerts..." />
      )}
    </div>
  );
});

export default AlertManagement;