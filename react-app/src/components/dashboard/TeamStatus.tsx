/**
 * TeamStatus Component
 * 
 * Displays SOC team member status with online/away indicators
 * and active alert counts. Matches the existing team status design.
 */

import React from 'react';
import { useAppContext } from '../../context';
import type { TeamMember } from '../../types';
import styles from './TeamStatus.module.css';

interface TeamMemberItemProps {
  member: TeamMember;
}

const TeamMemberItem: React.FC<TeamMemberItemProps> = ({ member }) => {
  const getStatusClass = (status: string): string => {
    return status.toLowerCase();
  };

  const getStatusIcon = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'fa-circle';
      case 'away':
        return 'fa-clock';
      case 'offline':
        return 'fa-circle';
      default:
        return 'fa-circle';
    }
  };

  return (
    <div className={styles.teamMember}>
      <div className={`${styles.teamStatusIndicator} ${styles[getStatusClass(member.status)]}`}>
        <i className={`fas ${getStatusIcon(member.status)}`}></i>
      </div>
      <div className={styles.teamInfo}>
        <h4>{member.name}</h4>
        <p>{member.role} - {member.activeAlerts} active alert{member.activeAlerts !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
};

export const TeamStatus: React.FC = () => {
  const { state } = useAppContext();
  const { socTeam, loading } = state;

  if (loading?.alerts) { // Using alerts loading as proxy for team data loading
    return (
      <div className={styles.teamStatus}>
        <div className={styles.loadingState}>
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading team status...</p>
        </div>
      </div>
    );
  }

  if (socTeam.length === 0) {
    return (
      <div className={styles.teamStatus}>
        <div className={styles.emptyState}>
          <i className="fas fa-users"></i>
          <p>No team members available</p>
        </div>
      </div>
    );
  }

  // Calculate team statistics
  const onlineMembers = socTeam.filter(member => member.status === 'Online').length;
  const totalActiveAlerts = socTeam.reduce((sum, member) => sum + member.activeAlerts, 0);

  return (
    <div className={styles.teamStatus}>
      <div className={styles.teamSummary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryValue}>{onlineMembers}</span>
          <span className={styles.summaryLabel}>Online</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryValue}>{totalActiveAlerts}</span>
          <span className={styles.summaryLabel}>Active Alerts</span>
        </div>
      </div>
      
      <div className={styles.teamList}>
        {socTeam.map((member) => (
          <TeamMemberItem key={member.name} member={member} />
        ))}
      </div>
    </div>
  );
};

export default TeamStatus;