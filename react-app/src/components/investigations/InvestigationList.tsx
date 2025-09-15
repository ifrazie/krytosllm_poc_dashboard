/**
 * InvestigationList Component
 * Displays a sidebar list of investigations with selection functionality
 */

import React, { memo, useCallback, useMemo } from 'react';
import { useInvestigations } from '../../hooks';
import type { Investigation } from '../../types';
import styles from './InvestigationList.module.css';

interface InvestigationListProps {
  className?: string;
  'data-testid'?: string;
}

export const InvestigationList: React.FC<InvestigationListProps> = memo(({ 
  className, 
  'data-testid': testId 
}) => {
  const { 
    investigations, 
    selectedInvestigationId, 
    setSelectedInvestigation,
    loading,
    error 
  } = useInvestigations();

  const handleInvestigationSelect = useCallback((investigationId: string) => {
    setSelectedInvestigation(investigationId);
  }, [setSelectedInvestigation]);

  const getStatusClass = useCallback((status: Investigation['status']) => {
    switch (status) {
      case 'New':
        return styles.statusNew;
      case 'In Progress':
        return styles.statusInProgress;
      case 'Completed':
        return styles.statusCompleted;
      default:
        return '';
    }
  }, []);

  const investigationCount = useMemo(() => investigations.length, [investigations.length]);

  if (loading) {
    return (
      <div 
        className={`${styles.investigationList} ${className || ''}`}
        data-testid={testId}
      >
        <div className={styles.header}>
          <h3>Investigations</h3>
        </div>
        <div className={styles.loading}>
          <div className={styles.loadingSkeleton}></div>
          <div className={styles.loadingSkeleton}></div>
          <div className={styles.loadingSkeleton}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.investigationList} ${className || ''}`}>
        <div className={styles.header}>
          <h3>Investigations</h3>
        </div>
        <div className={styles.error}>
          <p>Error loading investigations: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.investigationList} ${className || ''}`}
      data-testid={testId}
    >
      <div className={styles.header}>
        <h3>Investigations</h3>
        <span className={styles.count}>{investigationCount}</span>
      </div>
      
      <div className={styles.listContainer}>
        {investigationCount === 0 ? (
          <div className={styles.emptyState}>
            <p>No investigations found</p>
          </div>
        ) : (
          investigations.map((investigation) => {
            const isSelected = selectedInvestigationId === investigation.id;
            const statusClass = getStatusClass(investigation.status);
            
            return (
              <div
                key={investigation.id}
                className={`${styles.investigationItem} ${isSelected ? styles.active : ''}`}
                onClick={() => handleInvestigationSelect(investigation.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleInvestigationSelect(investigation.id);
                  }
                }}
                aria-label={`Select investigation ${investigation.id}`}
                aria-pressed={isSelected}
              >
                <div className={styles.investigationHeader}>
                  <h4 className={styles.investigationId}>{investigation.id}</h4>
                  <span className={`${styles.status} ${statusClass}`}>
                    {investigation.status}
                  </span>
                </div>
                
                <div className={styles.investigationMeta}>
                  <p className={styles.assignedTo}>
                    <i className="fas fa-user" aria-hidden="true"></i>
                    {investigation.assignedTo}
                  </p>
                  <p className={styles.alertId}>
                    <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
                    {investigation.alertId}
                  </p>
                </div>
                
                <div className={styles.investigationProgress}>
                  <span className={styles.timelineCount}>
                    {investigation.timeline.length} events
                  </span>
                  <span className={styles.evidenceCount}>
                    {investigation.evidence.length} evidence
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

InvestigationList.displayName = 'InvestigationList';