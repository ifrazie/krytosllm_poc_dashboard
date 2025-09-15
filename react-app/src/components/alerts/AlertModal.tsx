/**
 * AlertModal Component
 * 
 * Builds detailed alert view modal with all alert information.
 * Displays AI analysis, artifacts, and recommended actions with action buttons
 * for escalation, assignment, and closure. Implements proper modal state management.
 */

import React, { useState, useCallback } from 'react';
import { Modal } from '../common/Modal';
import type { Alert } from '../../types';
import styles from './AlertModal.module.css';

export interface AlertModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onEscalate?: (alert: Alert) => void;
  onAssign?: (alert: Alert, assignee: string) => void;
  onResolve?: (alert: Alert, resolution: string) => void;
  onUpdateStatus?: (alert: Alert, status: Alert['status']) => void;
  className?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  alert,
  isOpen,
  onClose,
  onEscalate,
  onAssign,
  onResolve,
  onUpdateStatus,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'artifacts' | 'timeline'>('overview');
  const [assigneeInput, setAssigneeInput] = useState('');
  const [resolutionInput, setResolutionInput] = useState('');
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showResolveForm, setShowResolveForm] = useState(false);

  // Handle escalate action
  const handleEscalate = useCallback(() => {
    if (alert && onEscalate) {
      onEscalate(alert);
      onClose();
    }
  }, [alert, onEscalate, onClose]);

  // Handle assign action
  const handleAssign = useCallback(() => {
    if (alert && onAssign && assigneeInput.trim()) {
      onAssign(alert, assigneeInput.trim());
      setAssigneeInput('');
      setShowAssignForm(false);
      onClose();
    }
  }, [alert, onAssign, assigneeInput, onClose]);

  // Handle resolve action
  const handleResolve = useCallback(() => {
    if (alert && onResolve && resolutionInput.trim()) {
      onResolve(alert, resolutionInput.trim());
      setResolutionInput('');
      setShowResolveForm(false);
      onClose();
    }
  }, [alert, onResolve, resolutionInput, onClose]);

  // Handle status change
  const handleStatusChange = useCallback((newStatus: Alert['status']) => {
    if (alert && onUpdateStatus) {
      onUpdateStatus(alert, newStatus);
    }
  }, [alert, onUpdateStatus]);

  // Reset form states when modal closes
  const handleClose = useCallback(() => {
    setActiveTab('overview');
    setAssigneeInput('');
    setResolutionInput('');
    setShowAssignForm(false);
    setShowResolveForm(false);
    onClose();
  }, [onClose]);

  if (!alert) {
    return null;
  }

  // Get severity styling
  const getSeverityClass = (severity: string) => {
    return `severity-${severity.toLowerCase()}`;
  };

  // Get status styling
  const getStatusClass = (status: string) => {
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get risk score class
  const getRiskScoreClass = (score: number) => {
    if (score >= 80) return 'risk-critical';
    if (score >= 60) return 'risk-high';
    if (score >= 40) return 'risk-medium';
    return 'risk-low';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Alert Details - ${alert.title}`}
      maxWidth="1000px"
      className={`${styles.alertModal} ${className}`}
    >
      <div className={styles.modalContent}>
        {/* Alert Header */}
        <div className={styles.alertHeader}>
          <div className={styles.alertMeta}>
            <div className={styles.alertId}>
              Alert #{alert.id.slice(-6)}
            </div>
            <div className={styles.alertBadges}>
              <span className={`${styles.severityBadge} ${styles[getSeverityClass(alert.severity)]}`}>
                <i className={getSeverityIcon(alert.severity)} />
                {alert.severity}
              </span>
              <span className={`${styles.statusBadge} ${styles[getStatusClass(alert.status)]}`}>
                <i className={getStatusIcon(alert.status)} />
                {alert.status}
              </span>
              <span className={`${styles.riskScore} ${styles[getRiskScoreClass(alert.riskScore)]}`}>
                Risk: {alert.riskScore}
              </span>
            </div>
          </div>
          <div className={styles.alertInfo}>
            <div className={styles.alertSource}>
              <i className="fas fa-server" />
              Source: {alert.source}
            </div>
            <div className={styles.alertTime}>
              <i className="fas fa-clock" />
              {formatTimestamp(alert.timestamp)}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-info-circle" />
            Overview
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'analysis' ? styles.active : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            <i className="fas fa-brain" />
            AI Analysis
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'artifacts' ? styles.active : ''}`}
            onClick={() => setActiveTab('artifacts')}
          >
            <i className="fas fa-fingerprint" />
            Artifacts ({alert.artifacts.length})
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'timeline' ? styles.active : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <i className="fas fa-history" />
            Timeline
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overviewTab}>
              <div className={styles.section}>
                <h3>Description</h3>
                <p className={styles.description}>{alert.description}</p>
              </div>
              
              <div className={styles.section}>
                <h3>Recommended Actions</h3>
                <ul className={styles.actionsList}>
                  {alert.recommendedActions.map((action, index) => (
                    <li key={index} className={styles.actionItem}>
                      <i className="fas fa-chevron-right" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className={styles.analysisTab}>
              <div className={styles.section}>
                <h3>AI Analysis</h3>
                <div className={styles.analysisContent}>
                  <p>{alert.aiAnalysis}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'artifacts' && (
            <div className={styles.artifactsTab}>
              <div className={styles.section}>
                <h3>Security Artifacts</h3>
                <div className={styles.artifactsList}>
                  {alert.artifacts.map((artifact, index) => (
                    <div key={index} className={styles.artifactItem}>
                      <i className="fas fa-file-alt" />
                      <span>{artifact}</span>
                      <button className={styles.copyButton} title="Copy to clipboard">
                        <i className="fas fa-copy" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className={styles.timelineTab}>
              <div className={styles.section}>
                <h3>Alert Timeline</h3>
                <div className={styles.timelineList}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineIcon}>
                      <i className="fas fa-plus-circle" />
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineTitle}>Alert Created</div>
                      <div className={styles.timelineTime}>{formatTimestamp(alert.timestamp)}</div>
                      <div className={styles.timelineDescription}>
                        Alert generated from {alert.source}
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineIcon}>
                      <i className="fas fa-brain" />
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineTitle}>AI Analysis Completed</div>
                      <div className={styles.timelineTime}>
                        {new Date(new Date(alert.timestamp).getTime() + 30000).toLocaleString()}
                      </div>
                      <div className={styles.timelineDescription}>
                        Risk score calculated: {alert.riskScore}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <div className={styles.statusActions}>
            <label className={styles.statusLabel}>Status:</label>
            <select
              className={styles.statusSelect}
              value={alert.status}
              onChange={(e) => handleStatusChange(e.target.value as Alert['status'])}
            >
              <option value="New">New</option>
              <option value="Active Threat">Active Threat</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Investigating">Investigating</option>
              <option value="Auto-Contained">Auto-Contained</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className={styles.primaryActions}>
            {!showAssignForm && !showResolveForm && (
              <>
                <button
                  className={`${styles.actionButton} ${styles.escalateButton}`}
                  onClick={handleEscalate}
                  disabled={alert.status === 'Resolved'}
                >
                  <i className="fas fa-exclamation-triangle" />
                  Escalate
                </button>
                
                <button
                  className={`${styles.actionButton} ${styles.assignButton}`}
                  onClick={() => setShowAssignForm(true)}
                  disabled={alert.status === 'Resolved'}
                >
                  <i className="fas fa-user-plus" />
                  Assign
                </button>
                
                <button
                  className={`${styles.actionButton} ${styles.resolveButton}`}
                  onClick={() => setShowResolveForm(true)}
                  disabled={alert.status === 'Resolved'}
                >
                  <i className="fas fa-check-circle" />
                  Resolve
                </button>
              </>
            )}

            {showAssignForm && (
              <div className={styles.inlineForm}>
                <input
                  type="text"
                  placeholder="Enter assignee name..."
                  value={assigneeInput}
                  onChange={(e) => setAssigneeInput(e.target.value)}
                  className={styles.formInput}
                  autoFocus
                />
                <button
                  className={`${styles.actionButton} ${styles.confirmButton}`}
                  onClick={handleAssign}
                  disabled={!assigneeInput.trim()}
                >
                  <i className="fas fa-check" />
                  Assign
                </button>
                <button
                  className={`${styles.actionButton} ${styles.cancelButton}`}
                  onClick={() => setShowAssignForm(false)}
                >
                  <i className="fas fa-times" />
                  Cancel
                </button>
              </div>
            )}

            {showResolveForm && (
              <div className={styles.inlineForm}>
                <input
                  type="text"
                  placeholder="Enter resolution notes..."
                  value={resolutionInput}
                  onChange={(e) => setResolutionInput(e.target.value)}
                  className={styles.formInput}
                  autoFocus
                />
                <button
                  className={`${styles.actionButton} ${styles.confirmButton}`}
                  onClick={handleResolve}
                  disabled={!resolutionInput.trim()}
                >
                  <i className="fas fa-check" />
                  Resolve
                </button>
                <button
                  className={`${styles.actionButton} ${styles.cancelButton}`}
                  onClick={() => setShowResolveForm(false)}
                >
                  <i className="fas fa-times" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
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

export default AlertModal;