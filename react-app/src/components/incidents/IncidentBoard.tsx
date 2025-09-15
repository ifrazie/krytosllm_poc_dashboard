/**
 * IncidentBoard Component
 * 
 * Kanban-style board for incident management with status columns (New, In Progress, Resolved).
 * Displays incident cards organized by their current status and allows for visual incident tracking.
 */

import React from 'react';
import { useAppContext } from '../../context';
import { Incident, IncidentStatus } from '../../types/incident';
import { IncidentCard } from './IncidentCard';
import styles from './IncidentBoard.module.css';

interface StatusColumnProps {
  title: string;
  status: IncidentStatus;
  incidents: Incident[];
  onIncidentClick?: (incident: Incident) => void;
}

const StatusColumn: React.FC<StatusColumnProps> = ({ title, status, incidents, onIncidentClick }) => {
  const getColumnIcon = (status: IncidentStatus): string => {
    switch (status) {
      case 'New':
        return 'fa-plus-circle';
      case 'In Progress':
        return 'fa-clock';
      case 'Resolved':
        return 'fa-check-circle';
      case 'Closed':
        return 'fa-archive';
      default:
        return 'fa-circle';
    }
  };

  const getStatusColor = (status: IncidentStatus): string => {
    switch (status) {
      case 'New':
        return 'new';
      case 'In Progress':
        return 'inProgress';
      case 'Resolved':
        return 'resolved';
      case 'Closed':
        return 'closed';
      default:
        return 'default';
    }
  };

  return (
    <div className={styles.statusColumn}>
      <div className={`${styles.columnHeader} ${styles[getStatusColor(status)]}`}>
        <div className={styles.columnTitle}>
          <i className={`fas ${getColumnIcon(status)} ${styles.columnIcon}`}></i>
          <h3>{title}</h3>
        </div>
        <div className={styles.incidentCount}>
          {incidents.length}
        </div>
      </div>
      
      <div className={styles.columnContent}>
        {incidents.length === 0 ? (
          <div className={styles.emptyState}>
            <i className={`fas ${getColumnIcon(status)} ${styles.emptyIcon}`}></i>
            <p>No {status.toLowerCase()} incidents</p>
          </div>
        ) : (
          incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onClick={onIncidentClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export const IncidentBoard: React.FC = () => {
  const { state } = useAppContext();
  const { incidents, loading } = state;

  // Group incidents by status
  const groupedIncidents = React.useMemo(() => {
    const groups: Record<IncidentStatus, Incident[]> = {
      'New': [],
      'In Progress': [],
      'Resolved': [],
      'Closed': []
    };

    incidents.forEach((incident) => {
      if (groups[incident.status]) {
        groups[incident.status].push(incident);
      }
    });

    // Sort incidents within each group by creation date (newest first)
    Object.keys(groups).forEach((status) => {
      groups[status as IncidentStatus].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    return groups;
  }, [incidents]);

  const handleIncidentClick = (incident: Incident) => {
    // TODO: Implement incident detail modal or navigation
    console.log('Incident clicked:', incident);
  };

  if (loading.incidents) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}>
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading incidents...</p>
      </div>
    );
  }

  return (
    <div className={styles.incidentBoard}>
      <div className={styles.boardHeader}>
        <h2>Incident Response Board</h2>
        <p>Track and manage security incidents across their lifecycle</p>
      </div>
      
      <div className={styles.boardColumns}>
        <StatusColumn
          title="New"
          status="New"
          incidents={groupedIncidents.New}
          onIncidentClick={handleIncidentClick}
        />
        
        <StatusColumn
          title="In Progress"
          status="In Progress"
          incidents={groupedIncidents['In Progress']}
          onIncidentClick={handleIncidentClick}
        />
        
        <StatusColumn
          title="Resolved"
          status="Resolved"
          incidents={groupedIncidents.Resolved}
          onIncidentClick={handleIncidentClick}
        />
        
        <StatusColumn
          title="Closed"
          status="Closed"
          incidents={groupedIncidents.Closed}
          onIncidentClick={handleIncidentClick}
        />
      </div>
    </div>
  );
};

export default IncidentBoard;