/**
 * InvestigationDetails Component
 * Displays detailed information about a selected investigation including timeline and evidence
 */

import React, { memo, useCallback, useMemo } from 'react';
import { useInvestigations } from '../../hooks';
import type { Investigation, TimelineEvent } from '../../types';
import styles from './InvestigationDetails.module.css';

interface InvestigationDetailsProps {
  className?: string;
  'data-testid'?: string;
}

export const InvestigationDetails: React.FC<InvestigationDetailsProps> = ({ 
  className, 
  'data-testid': testId 
}) => {
  const { selectedInvestigation, loading, error } = useInvestigations();

  const formatTimelineTime = (time: string): string => {
    // If time is in HH:MM format, return as is
    if (time.match(/^\d{2}:\d{2}$/)) {
      return time;
    }
    
    // If it's a full timestamp, format it
    try {
      const date = new Date(time);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch {
      return time;
    }
  };

  const getStatusClass = (status: Investigation['status']) => {
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
  };

  const renderTimeline = (timeline: TimelineEvent[]) => {
    return (
      <div className={styles.timeline}>
        {timeline.map((event, index) => (
          <div key={index} className={styles.timelineItem}>
            <div className={styles.timelineMarker}>
              <div className={styles.timelineDot}></div>
              {index < timeline.length - 1 && <div className={styles.timelineLine}></div>}
            </div>
            <div className={styles.timelineContent}>
              <div className={styles.timelineTime}>
                {formatTimelineTime(event.time)}
              </div>
              <div className={styles.timelineEvent}>
                {event.event}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderEvidence = (evidence: string[]) => {
    return (
      <div className={styles.evidenceList}>
        {evidence.map((item, index) => (
          <div key={index} className={styles.evidenceItem}>
            <i className="fas fa-file-alt" aria-hidden="true"></i>
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div 
        className={`${styles.investigationDetails} ${className || ''}`}
        data-testid={testId}
      >
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
      <div 
        className={`${styles.investigationDetails} ${className || ''}`}
        data-testid={testId}
      >
        <div className={styles.error}>
          <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
          <p>Error loading investigation details: {error}</p>
        </div>
      </div>
    );
  }

  if (!selectedInvestigation) {
    return (
      <div 
        className={`${styles.investigationDetails} ${className || ''}`}
        data-testid={testId}
      >
        <div className={styles.emptyState}>
          <i className="fas fa-search" aria-hidden="true"></i>
          <h3>No Investigation Selected</h3>
          <p>Select an investigation from the list to view its details, timeline, and evidence.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.investigationDetails} ${className || ''}`}
      data-testid={testId}
    >
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h2 className={styles.investigationId}>{selectedInvestigation.id}</h2>
          <span className={`${styles.status} ${getStatusClass(selectedInvestigation.status)}`}>
            {selectedInvestigation.status}
          </span>
        </div>
        <div className={styles.headerMeta}>
          <div className={styles.metaItem}>
            <i className="fas fa-user" aria-hidden="true"></i>
            <span>Assigned to: {selectedInvestigation.assignedTo}</span>
          </div>
          <div className={styles.metaItem}>
            <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <span>Related Alert: {selectedInvestigation.alertId}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>
              <i className="fas fa-clock" aria-hidden="true"></i>
              Investigation Timeline
            </h3>
            <span className={styles.sectionCount}>
              {selectedInvestigation.timeline.length} events
            </span>
          </div>
          <div className={styles.sectionContent}>
            {selectedInvestigation.timeline.length === 0 ? (
              <div className={styles.sectionEmpty}>
                <p>No timeline events recorded</p>
              </div>
            ) : (
              renderTimeline(selectedInvestigation.timeline)
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>
              <i className="fas fa-file-alt" aria-hidden="true"></i>
              Evidence & Artifacts
            </h3>
            <span className={styles.sectionCount}>
              {selectedInvestigation.evidence.length} items
            </span>
          </div>
          <div className={styles.sectionContent}>
            {selectedInvestigation.evidence.length === 0 ? (
              <div className={styles.sectionEmpty}>
                <p>No evidence collected</p>
              </div>
            ) : (
              renderEvidence(selectedInvestigation.evidence)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};