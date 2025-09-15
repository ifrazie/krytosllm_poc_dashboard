/**
 * Custom hook for integrating notifications with real-time updates
 * Automatically shows notifications for important system events
 */

import { useEffect, useCallback, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAppContext } from '../context/AppContext';
import type { Alert, Integration, TeamMember } from '../types';

interface UseNotificationIntegrationOptions {
  enableAlertNotifications?: boolean;
  enableSystemNotifications?: boolean;
  enableIntegrationNotifications?: boolean;
  enableTeamNotifications?: boolean;
  alertSeverityThreshold?: 'Low' | 'Medium' | 'High' | 'Critical';
  maxNotificationsPerMinute?: number;
}

export const useNotificationIntegration = (options: UseNotificationIntegrationOptions = {}) => {
  const {
    enableAlertNotifications = true,
    enableSystemNotifications = true,
    enableIntegrationNotifications = true,
    enableTeamNotifications = false, // Disabled by default to avoid spam
    alertSeverityThreshold = 'Medium',
    maxNotificationsPerMinute = 10
  } = options;

  const { state } = useAppContext();
  const { showAlert, showWarning, showError, showInfo, showSuccess } = useNotifications();
  
  // Track previous state to detect changes
  const prevStateRef = useRef({
    alerts: [] as Alert[],
    integrations: [] as Integration[],
    socTeam: [] as TeamMember[]
  });
  
  // Rate limiting
  const notificationCountRef = useRef(0);
  const lastResetRef = useRef(Date.now());

  // Severity hierarchy for threshold checking
  const severityLevels = {
    'Low': 1,
    'Medium': 2,
    'High': 3,
    'Critical': 4
  };

  // Check if alert meets severity threshold
  const meetsThreshold = useCallback((severity: Alert['severity']): boolean => {
    return severityLevels[severity] >= severityLevels[alertSeverityThreshold];
  }, [alertSeverityThreshold]);

  // Rate limiting check
  const canShowNotification = useCallback((): boolean => {
    const now = Date.now();
    const oneMinute = 60 * 1000;
    
    // Reset counter if a minute has passed
    if (now - lastResetRef.current > oneMinute) {
      notificationCountRef.current = 0;
      lastResetRef.current = now;
    }
    
    if (notificationCountRef.current >= maxNotificationsPerMinute) {
      return false;
    }
    
    notificationCountRef.current++;
    return true;
  }, [maxNotificationsPerMinute]);

  // Handle new alerts
  useEffect(() => {
    if (!enableAlertNotifications || !canShowNotification()) return;

    const currentAlerts = state.alerts;
    const prevAlerts = prevStateRef.current.alerts;
    
    // Find new alerts
    const newAlerts = currentAlerts.filter(alert => 
      !prevAlerts.some(prevAlert => prevAlert.id === alert.id)
    );
    
    newAlerts.forEach(alert => {
      if (meetsThreshold(alert.severity)) {
        const severityConfig = {
          'Critical': {
            title: '🚨 Critical Security Alert',
            duration: 0, // Don't auto-dismiss critical alerts
            persistent: true
          },
          'High': {
            title: '⚠️ High Priority Alert',
            duration: 10000 // 10 seconds
          },
          'Medium': {
            title: '📊 Security Alert',
            duration: 7000 // 7 seconds
          },
          'Low': {
            title: 'ℹ️ Security Notice',
            duration: 5000 // 5 seconds
          }
        };
        
        const config = severityConfig[alert.severity];
        
        showAlert(
          `${alert.title} detected from ${alert.source}`,
          {
            title: config.title,
            duration: config.duration,
            persistent: 'persistent' in config ? config.persistent : false,
            actions: alert.severity === 'Critical' || alert.severity === 'High' ? [
              {
                label: 'Investigate',
                action: () => {
                  // This would typically navigate to the alert details
                  console.log('Navigate to alert:', alert.id);
                },
                variant: 'primary'
              },
              {
                label: 'Dismiss',
                action: () => {
                  // Dismiss action
                }
              }
            ] : undefined,
            metadata: {
              alertId: alert.id,
              severity: alert.severity,
              source: alert.source
            }
          }
        );
      }
    });
    
    prevStateRef.current.alerts = currentAlerts;
  }, [state.alerts, enableAlertNotifications, meetsThreshold, showAlert, canShowNotification]);

  // Handle integration status changes
  useEffect(() => {
    if (!enableIntegrationNotifications || !canShowNotification()) return;

    const currentIntegrations = state.integrations;
    const prevIntegrations = prevStateRef.current.integrations;
    
    currentIntegrations.forEach(integration => {
      const prevIntegration = prevIntegrations.find(prev => prev.name === integration.name);
      
      if (prevIntegration && prevIntegration.status !== integration.status) {
        const statusMessages = {
          'Connected': {
            message: `${integration.name} integration is now connected`,
            type: 'success' as const,
            title: '✅ Integration Restored'
          },
          'Degraded': {
            message: `${integration.name} integration is experiencing issues`,
            type: 'warning' as const,
            title: '⚠️ Integration Degraded'
          },
          'Disconnected': {
            message: `${integration.name} integration has disconnected`,
            type: 'error' as const,
            title: '❌ Integration Offline'
          }
        };
        
        const config = statusMessages[integration.status];
        
        if (config.type === 'success') {
          showSuccess(config.message, { title: config.title });
        } else if (config.type === 'warning') {
          showWarning(config.message, { 
            title: config.title,
            duration: 8000,
            actions: [
              {
                label: 'Check Status',
                action: () => {
                  console.log('Navigate to integrations');
                }
              }
            ]
          });
        } else if (config.type === 'error') {
          showError(config.message, { 
            title: config.title,
            duration: 0, // Don't auto-dismiss errors
            actions: [
              {
                label: 'Troubleshoot',
                action: () => {
                  console.log('Navigate to integration troubleshooting');
                },
                variant: 'primary'
              }
            ]
          });
        }
      }
    });
    
    prevStateRef.current.integrations = currentIntegrations;
  }, [state.integrations, enableIntegrationNotifications, showSuccess, showWarning, showError, canShowNotification]);

  // Handle team member status changes (optional)
  useEffect(() => {
    if (!enableTeamNotifications || !canShowNotification()) return;

    const currentTeam = state.socTeam;
    const prevTeam = prevStateRef.current.socTeam;
    
    currentTeam.forEach(member => {
      const prevMember = prevTeam.find(prev => prev.name === member.name);
      
      if (prevMember && prevMember.status !== member.status) {
        // Only notify for significant status changes
        if (member.status === 'Offline' && prevMember.status === 'Online') {
          showInfo(
            `${member.name} has gone offline`,
            {
              title: '👤 Team Status Update',
              duration: 4000
            }
          );
        } else if (member.status === 'Online' && prevMember.status === 'Offline') {
          showInfo(
            `${member.name} is now online`,
            {
              title: '👤 Team Status Update',
              duration: 4000
            }
          );
        }
      }
    });
    
    prevStateRef.current.socTeam = currentTeam;
  }, [state.socTeam, enableTeamNotifications, showInfo, canShowNotification]);

  // System health notifications
  const showSystemHealthNotification = useCallback(() => {
    if (!enableSystemNotifications || !canShowNotification()) return;

    const connectedIntegrations = state.integrations.filter(i => i.status === 'Connected').length;
    const totalIntegrations = state.integrations.length;
    const healthPercentage = totalIntegrations > 0 ? (connectedIntegrations / totalIntegrations) * 100 : 100;
    
    if (healthPercentage < 50) {
      showError(
        `System health is degraded (${Math.round(healthPercentage)}% integrations online)`,
        {
          title: '🏥 System Health Alert',
          duration: 0,
          actions: [
            {
              label: 'View Status',
              action: () => {
                console.log('Navigate to system status');
              },
              variant: 'primary'
            }
          ]
        }
      );
    } else if (healthPercentage < 80) {
      showWarning(
        `Some integrations are offline (${Math.round(healthPercentage)}% healthy)`,
        {
          title: '⚡ System Status',
          duration: 8000
        }
      );
    }
  }, [state.integrations, enableSystemNotifications, showError, showWarning, canShowNotification]);

  // Manual notification triggers
  const triggerAlertNotification = useCallback((alert: Alert) => {
    if (meetsThreshold(alert.severity)) {
      showAlert(
        `Manual alert: ${alert.title}`,
        {
          title: '🔔 Manual Alert',
          metadata: { alertId: alert.id, manual: true }
        }
      );
    }
  }, [meetsThreshold, showAlert]);

  const triggerSystemNotification = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const notificationMethods = {
      info: showInfo,
      success: showSuccess,
      warning: showWarning,
      error: showError
    };
    
    notificationMethods[type](message, {
      title: '🖥️ System Notification'
    });
  }, [showInfo, showSuccess, showWarning, showError]);

  return {
    // Manual triggers
    triggerAlertNotification,
    triggerSystemNotification,
    showSystemHealthNotification,
    
    // Status
    canShowNotification,
    notificationRate: {
      current: notificationCountRef.current,
      max: maxNotificationsPerMinute,
      resetTime: lastResetRef.current
    },
    
    // Configuration
    config: {
      enableAlertNotifications,
      enableSystemNotifications,
      enableIntegrationNotifications,
      enableTeamNotifications,
      alertSeverityThreshold,
      maxNotificationsPerMinute
    }
  };
};