/**
 * IncidentCard Component
 * 
 * Displays individual incident information in a card format with severity indicators,
 * title, description, and timestamp. Used within the incident board for Kanban-style
 * incident management.
 */

import React from 'react';
import { Incident } from '../../types/incident';
import styles from './IncidentCard.module.css';

interface IncidentCardProps {
  incident: Incident;
  onClick?: (incident: Incident) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(incident);
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getSeverityIcon = (severity: string): string => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'fa-exclamation-triangle';
      case 'high':
        return 'fa-exclamation-circle';
      case 'medium':
        return 'fa-info-circle';
      case 'low':
        return 'fa-check-circle';
      default:
        return 'fa-info-circle';
    }
  };

  return (
    <div 
      className={`${styles.incidentCard} ${styles[`severity-${incident.severity.toLowerCase()}`]}`}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
    >
      <div className={styles.cardHeader}>
        <div className={styles.severityIndicator}>
          <i className={`fas ${getSeverityIcon(incident.severity)} ${styles.severityIcon}`}></i>
          <span className={styles.severityText}>{incident.severity}</span>
        </div>
        <div className={styles.timestamp}>
          {formatTimestamp(incident.createdAt)}
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <h4 className={styles.incidentTitle}>{incident.title}</h4>
        <p className={styles.incidentDescription}>{incident.description}</p>
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.incidentId}>
          {incident.id}
        </div>
        {incident.assignedTo && (
          <div className={styles.assignedTo}>
            <i className="fas fa-user"></i>
            <span>{incident.assignedTo}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentCard;