/**
 * AlertFilters Component
 * 
 * Provides filtering interface for alerts with severity, status, and search filters.
 * Implements controlled form inputs with proper state management and matches existing design.
 */

import React, { useState, useCallback } from 'react';
import type { AlertFilters as AlertFiltersType, AlertSeverity, AlertStatus } from '../../types';
import styles from './AlertFilters.module.css';

export interface AlertFiltersProps {
  filters: AlertFiltersType;
  onFiltersChange: (filters: AlertFiltersType) => void;
  onReset?: () => void;
  className?: string;
}

const SEVERITY_OPTIONS: { value: AlertSeverity | ''; label: string }[] = [
  { value: '', label: 'All Severities' },
  { value: 'Critical', label: 'Critical' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' }
];

const STATUS_OPTIONS: { value: AlertStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'Active Threat', label: 'Active Threat' },
  { value: 'Under Investigation', label: 'Under Investigation' },
  { value: 'Auto-Contained', label: 'Auto-Contained' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'New', label: 'New' },
  { value: 'Investigating', label: 'Investigating' }
];

export const AlertFilters: React.FC<AlertFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  className = ''
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Handle severity filter change
  const handleSeverityChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as AlertSeverity | '';
    onFiltersChange({
      ...filters,
      severity: value || undefined
    });
  }, [filters, onFiltersChange]);

  // Handle status filter change
  const handleStatusChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as AlertStatus | '';
    onFiltersChange({
      ...filters,
      status: value || undefined
    });
  }, [filters, onFiltersChange]);

  // Handle search input change with debouncing
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearch(value);
    
    // Debounce search updates
    const timeoutId = setTimeout(() => {
      onFiltersChange({
        ...filters,
        search: value || undefined
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, onFiltersChange]);

  // Handle search input blur to ensure final update
  const handleSearchBlur = useCallback(() => {
    onFiltersChange({
      ...filters,
      search: localSearch || undefined
    });
  }, [filters, onFiltersChange, localSearch]);

  // Handle reset filters
  const handleReset = useCallback(() => {
    setLocalSearch('');
    onFiltersChange({});
    onReset?.();
  }, [onFiltersChange, onReset]);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setLocalSearch('');
    onFiltersChange({
      ...filters,
      search: undefined
    });
  }, [filters, onFiltersChange]);

  // Check if any filters are active
  const hasActiveFilters = filters.severity || filters.status || filters.search;

  return (
    <div className={`${styles.filtersBar} ${className}`}>
      {/* Severity Filter */}
      <div className={styles.filterGroup}>
        <label htmlFor="severity-filter" className={styles.filterLabel}>
          Severity
        </label>
        <select
          id="severity-filter"
          className={styles.formControl}
          value={filters.severity || ''}
          onChange={handleSeverityChange}
          aria-label="Filter by severity"
        >
          {SEVERITY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className={styles.filterGroup}>
        <label htmlFor="status-filter" className={styles.filterLabel}>
          Status
        </label>
        <select
          id="status-filter"
          className={styles.formControl}
          value={filters.status || ''}
          onChange={handleStatusChange}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Search Filter */}
      <div className={`${styles.filterGroup} ${styles.searchGroup}`}>
        <label htmlFor="search-alerts" className={styles.filterLabel}>
          Search
        </label>
        <div className={styles.searchContainer}>
          <input
            id="search-alerts"
            type="text"
            className={styles.formControl}
            placeholder="Search alerts..."
            value={localSearch}
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
            aria-label="Search alerts"
          />
          {localSearch && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClearSearch}
              aria-label="Clear search"
              title="Clear search"
            >
              <i className="fas fa-times" />
            </button>
          )}
          <i className={`fas fa-search ${styles.searchIcon}`} />
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <div className={styles.filterGroup}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
            aria-label="Reset all filters"
            title="Reset all filters"
          >
            <i className="fas fa-undo" />
            Reset
          </button>
        </div>
      )}

      {/* Active Filters Count */}
      {hasActiveFilters && (
        <div className={styles.activeFiltersCount}>
          <span className={styles.filterCount}>
            {Object.values(filters).filter(Boolean).length} filter{Object.values(filters).filter(Boolean).length !== 1 ? 's' : ''} active
          </span>
        </div>
      )}
    </div>
  );
};

export default AlertFilters;