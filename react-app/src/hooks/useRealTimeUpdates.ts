/**
 * Custom hook for real-time updates
 * Simulates real-time data updates for the SOC platform with enhanced configurability
 */

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateAlertId } from '../data';
import type { Alert, AlertSeverity, TeamMember } from '../types';

interface UseRealTimeUpdatesOptions {
  enableAlertSimulation?: boolean;
  enableSyncUpdates?: boolean;
  enableMetricsUpdates?: boolean;
  enableTeamUpdates?: boolean;
  alertInterval?: number; // milliseconds
  syncInterval?: number; // milliseconds
  metricsInterval?: number; // milliseconds
  teamInterval?: number; // milliseconds
  maxAlertsPerInterval?: number;
  onNewAlert?: (alert: Alert) => void;
  onMetricsUpdate?: (metrics: any) => void;
  onSyncUpdate?: (integrations: any[]) => void;
  onTeamUpdate?: (team: TeamMember[]) => void;
}

export const useRealTimeUpdates = (options: UseRealTimeUpdatesOptions = {}) => {
  const {
    enableAlertSimulation = true,
    enableSyncUpdates = true,
    enableMetricsUpdates = true,
    enableTeamUpdates = true,
    alertInterval = 30000, // 30 seconds
    syncInterval = 5000, // 5 seconds
    metricsInterval = 60000, // 1 minute
    teamInterval = 45000, // 45 seconds
    maxAlertsPerInterval = 1,
    onNewAlert,
    onMetricsUpdate,
    onSyncUpdate,
    onTeamUpdate
  } = options;

  const { state, addAlert, updateIntegration, updateTeamMember, dispatch } = useAppContext();
  
  // Refs to store interval IDs for proper cleanup
  const alertIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const metricsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const teamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // State for tracking update statistics
  const [updateStats, setUpdateStats] = useState({
    alertsGenerated: 0,
    syncUpdates: 0,
    metricsUpdates: 0,
    teamUpdates: 0,
    lastAlertTime: null as string | null,
    lastSyncTime: null as string | null,
    lastMetricsTime: null as string | null,
    lastTeamTime: null as string | null
  });

  // Memoize mock alert types to prevent recreation on every render
  const mockAlertTypes = useMemo(() => [
    {
      title: "Suspicious Network Activity",
      severity: "Medium" as AlertSeverity,
      source: "Network Monitor",
      description: "Unusual network traffic patterns detected"
    },
    {
      title: "Failed Authentication Attempts",
      severity: "High" as AlertSeverity,
      source: "Active Directory",
      description: "Multiple failed login attempts from single IP"
    },
    {
      title: "Unusual File Access",
      severity: "Low" as AlertSeverity,
      source: "File System Monitor",
      description: "Access to sensitive files outside business hours"
    },
    {
      title: "Malware Signature Detected",
      severity: "Critical" as AlertSeverity,
      source: "Endpoint Protection",
      description: "Known malware signature found on endpoint"
    },
    {
      title: "Data Exfiltration Attempt",
      severity: "Critical" as AlertSeverity,
      source: "DLP System",
      description: "Large data transfer to external destination"
    },
    {
      title: "Privilege Escalation",
      severity: "High" as AlertSeverity,
      source: "Windows Event Logs",
      description: "User account gained elevated privileges"
    }
  ], []);

  // Simulate new alert with enhanced randomization
  const simulateNewAlert = useCallback(() => {
    const alertsToGenerate = Math.min(
      Math.floor(Math.random() * maxAlertsPerInterval) + 1,
      maxAlertsPerInterval
    );
    
    const generatedAlerts: Alert[] = [];
    
    for (let i = 0; i < alertsToGenerate; i++) {
      const randomAlert = mockAlertTypes[Math.floor(Math.random() * mockAlertTypes.length)];
      const alertId = generateAlertId();
      
      // Add some randomization to make alerts more realistic
      const riskScore = Math.random() * 10;
      const aiAnalysisOptions = [
        "AI analysis in progress...",
        "Potential threat detected - analyzing patterns",
        "Correlating with known threat intelligence",
        "Behavioral analysis indicates suspicious activity",
        "Machine learning model flagged anomalous behavior"
      ];
      
      const newAlert: Alert = {
        id: alertId,
        title: randomAlert.title,
        severity: randomAlert.severity,
        status: "New",
        source: randomAlert.source,
        timestamp: new Date().toISOString(),
        description: randomAlert.description,
        aiAnalysis: aiAnalysisOptions[Math.floor(Math.random() * aiAnalysisOptions.length)],
        riskScore,
        artifacts: [],
        recommendedActions: ["Investigate immediately", "Review logs", "Check for correlation"]
      };

      addAlert(newAlert);
      generatedAlerts.push(newAlert);
      
      // Call callback if provided
      if (onNewAlert) {
        onNewAlert(newAlert);
      }
    }
    
    // Update metrics
    dispatch({ 
      type: 'SET_METRICS', 
      payload: { 
        ...state.metrics, 
        totalAlerts: state.metrics.totalAlerts + alertsToGenerate 
      } 
    });
    
    // Update stats
    setUpdateStats(prev => ({
      ...prev,
      alertsGenerated: prev.alertsGenerated + alertsToGenerate,
      lastAlertTime: new Date().toISOString()
    }));

    return generatedAlerts;
  }, [addAlert, dispatch, state.metrics, maxAlertsPerInterval, onNewAlert, mockAlertTypes]);

  // Update integration sync times with more realistic patterns
  const updateSyncTimes = useCallback(() => {
    const now = new Date();
    const timeOptions = [
      "Just now",
      "30 seconds ago",
      "1 minute ago", 
      "2 minutes ago",
      "45 seconds ago",
      "1.5 minutes ago",
      "3 minutes ago"
    ];

    let updatedCount = 0;
    const updatedIntegrations: any[] = [];

    state.integrations.forEach(integration => {
      // Randomly update some integrations (30-50% chance)
      if (Math.random() < 0.4) {
        const randomTime = timeOptions[Math.floor(Math.random() * timeOptions.length)];
        
        // Occasionally simulate connection issues
        let status = integration.status;
        if (Math.random() < 0.05) { // 5% chance of status change
          const statusOptions = ['Connected', 'Degraded', 'Disconnected'];
          status = statusOptions[Math.floor(Math.random() * statusOptions.length)] as any;
        }
        
        const updates = { 
          lastSync: randomTime,
          ...(status !== integration.status && { status })
        };
        
        updateIntegration(integration.name, updates);
        updatedIntegrations.push({ name: integration.name, ...updates });
        updatedCount++;
      }
    });
    
    // Update stats
    setUpdateStats(prev => ({
      ...prev,
      syncUpdates: prev.syncUpdates + updatedCount,
      lastSyncTime: new Date().toISOString()
    }));
    
    // Call callback if provided
    if (onSyncUpdate && updatedIntegrations.length > 0) {
      onSyncUpdate(updatedIntegrations);
    }
  }, [state.integrations, updateIntegration, onSyncUpdate]);

  // Update metrics with realistic variations and trends
  const updateMetrics = useCallback(() => {
    const currentMetrics = state.metrics;
    
    // More sophisticated metric variations
    const variations = {
      totalAlerts: Math.floor(Math.random() * 3) - 1, // -1 to +1
      activeInvestigations: Math.floor(Math.random() * 3) - 1,
      resolvedIncidents: Math.floor(Math.random() * 2), // 0 to +1
      mttrVariation: (Math.random() - 0.5) * 2, // -1 to +1 minutes
      accuracyVariation: (Math.random() - 0.5) * 0.5, // -0.25% to +0.25%
      fpVariation: (Math.random() - 0.5) * 0.3 // -0.15% to +0.15%
    };

    // Parse current MTTR
    const mttrMatch = currentMetrics.mttr.match(/(\d+(?:\.\d+)?)/);
    const currentMttr = mttrMatch ? parseFloat(mttrMatch[1]) : 12;
    const newMttr = Math.max(5, currentMttr + variations.mttrVariation);
    
    // Parse current accuracy
    const accuracyMatch = currentMetrics.accuracy?.match(/(\d+(?:\.\d+)?)/);
    const currentAccuracy = accuracyMatch ? parseFloat(accuracyMatch[1]) : 94.2;
    const newAccuracy = Math.min(99.9, Math.max(85, currentAccuracy + variations.accuracyVariation));
    
    // Parse current false positive rate
    const fpMatch = currentMetrics.falsePositives?.match(/(\d+(?:\.\d+)?)/);
    const currentFp = fpMatch ? parseFloat(fpMatch[1]) : 5.8;
    const newFp = Math.min(15, Math.max(1, currentFp + variations.fpVariation));

    const updatedMetrics = {
      ...currentMetrics,
      totalAlerts: Math.max(0, currentMetrics.totalAlerts + variations.totalAlerts),
      activeInvestigations: Math.max(0, currentMetrics.activeInvestigations + variations.activeInvestigations),
      resolvedIncidents: currentMetrics.resolvedIncidents + Math.max(0, variations.resolvedIncidents),
      mttr: `${newMttr.toFixed(1)} min`,
      accuracy: `${newAccuracy.toFixed(1)}%`,
      falsePositives: `${newFp.toFixed(1)}%`
    };

    dispatch({ type: 'SET_METRICS', payload: updatedMetrics });
    
    // Update stats
    setUpdateStats(prev => ({
      ...prev,
      metricsUpdates: prev.metricsUpdates + 1,
      lastMetricsTime: new Date().toISOString()
    }));
    
    // Call callback if provided
    if (onMetricsUpdate) {
      onMetricsUpdate(updatedMetrics);
    }
  }, [state.metrics, dispatch, onMetricsUpdate]);

  // Update team member status and activity
  const updateTeamStatus = useCallback(() => {
    const statusOptions: Array<TeamMember['status']> = ['Online', 'Away', 'Offline'];
    let updatedCount = 0;
    const updatedMembers: TeamMember[] = [];

    state.socTeam.forEach(member => {
      // Randomly update some team members (20% chance)
      if (Math.random() < 0.2) {
        // Slight chance of status change
        let newStatus = member.status;
        if (Math.random() < 0.1) { // 10% chance of status change
          newStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        }
        
        // Update active alerts count (small variations)
        const alertVariation = Math.floor(Math.random() * 3) - 1; // -1 to +1
        const newActiveAlerts = Math.max(0, member.activeAlerts + alertVariation);
        
        const updates = {
          status: newStatus,
          activeAlerts: newActiveAlerts
        };
        
        updateTeamMember(member.name, updates);
        updatedMembers.push({ ...member, ...updates });
        updatedCount++;
      }
    });
    
    // Update stats
    setUpdateStats(prev => ({
      ...prev,
      teamUpdates: prev.teamUpdates + updatedCount,
      lastTeamTime: new Date().toISOString()
    }));
    
    // Call callback if provided
    if (onTeamUpdate && updatedMembers.length > 0) {
      onTeamUpdate(updatedMembers);
    }
  }, [state.socTeam, updateTeamMember, onTeamUpdate]);

  // Start real-time updates with proper cleanup
  const startUpdates = useCallback(() => {
    // Clear existing intervals to prevent memory leaks
    if (alertIntervalRef.current) {
      clearInterval(alertIntervalRef.current);
      alertIntervalRef.current = null;
    }
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }
    if (teamIntervalRef.current) {
      clearInterval(teamIntervalRef.current);
      teamIntervalRef.current = null;
    }

    // Start alert simulation
    if (enableAlertSimulation) {
      alertIntervalRef.current = setInterval(simulateNewAlert, alertInterval);
    }

    // Start sync updates
    if (enableSyncUpdates) {
      syncIntervalRef.current = setInterval(updateSyncTimes, syncInterval);
    }

    // Start metrics updates
    if (enableMetricsUpdates) {
      metricsIntervalRef.current = setInterval(updateMetrics, metricsInterval);
    }
    
    // Start team updates
    if (enableTeamUpdates) {
      teamIntervalRef.current = setInterval(updateTeamStatus, teamInterval);
    }
  }, [
    enableAlertSimulation,
    enableSyncUpdates, 
    enableMetricsUpdates,
    enableTeamUpdates,
    alertInterval,
    syncInterval,
    metricsInterval,
    teamInterval,
    simulateNewAlert,
    updateSyncTimes,
    updateMetrics,
    updateTeamStatus
  ]);

  // Stop real-time updates with comprehensive cleanup
  const stopUpdates = useCallback(() => {
    if (alertIntervalRef.current) {
      clearInterval(alertIntervalRef.current);
      alertIntervalRef.current = null;
    }
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }
    if (teamIntervalRef.current) {
      clearInterval(teamIntervalRef.current);
      teamIntervalRef.current = null;
    }
  }, []);
  
  // Reset update statistics
  const resetStats = useCallback(() => {
    setUpdateStats({
      alertsGenerated: 0,
      syncUpdates: 0,
      metricsUpdates: 0,
      teamUpdates: 0,
      lastAlertTime: null,
      lastSyncTime: null,
      lastMetricsTime: null,
      lastTeamTime: null
    });
  }, []);

  // Auto-start updates on mount
  useEffect(() => {
    startUpdates();
    return stopUpdates;
  }, [startUpdates, stopUpdates]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopUpdates();
    };
  }, [stopUpdates]);

  return {
    // Control methods
    startUpdates,
    stopUpdates,
    resetStats,
    
    // Manual trigger methods
    simulateNewAlert,
    updateSyncTimes,
    updateMetrics,
    updateTeamStatus,
    
    // Status and statistics
    isRunning: {
      alerts: alertIntervalRef.current !== null,
      sync: syncIntervalRef.current !== null,
      metrics: metricsIntervalRef.current !== null,
      team: teamIntervalRef.current !== null
    },
    updateStats,
    
    // Configuration
    config: {
      enableAlertSimulation,
      enableSyncUpdates,
      enableMetricsUpdates,
      enableTeamUpdates,
      alertInterval,
      syncInterval,
      metricsInterval,
      teamInterval,
      maxAlertsPerInterval
    }
  };
};