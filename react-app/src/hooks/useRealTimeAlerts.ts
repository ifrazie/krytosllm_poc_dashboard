/**
 * Custom hook for real-time alert updates
 * Specialized hook for managing alert-specific real-time functionality
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateAlertId } from '../data';
import type { Alert, AlertSeverity, AlertStatus } from '../types';

interface UseRealTimeAlertsOptions {
  enabled?: boolean;
  interval?: number;
  maxAlertsPerInterval?: number;
  severityWeights?: Record<AlertSeverity, number>; // Probability weights for each severity
  autoEscalate?: boolean;
  escalationInterval?: number;
  onNewAlert?: (alert: Alert) => void;
  onAlertEscalated?: (alert: Alert) => void;
}

interface AlertTemplate {
  title: string;
  severity: AlertSeverity;
  source: string;
  description: string;
  category: string;
}

export const useRealTimeAlerts = (options: UseRealTimeAlertsOptions = {}) => {
  const {
    enabled = true,
    interval = 30000, // 30 seconds
    maxAlertsPerInterval = 2,
    severityWeights = {
      'Critical': 0.1,
      'High': 0.25,
      'Medium': 0.45,
      'Low': 0.2
    },
    autoEscalate = true,
    escalationInterval = 300000, // 5 minutes
    onNewAlert,
    onAlertEscalated
  } = options;

  const { state, addAlert, updateAlert } = useAppContext();
  
  const alertIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const escalationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [alertStats, setAlertStats] = useState({
    generated: 0,
    escalated: 0,
    lastGenerated: null as string | null,
    lastEscalated: null as string | null
  });

  // Enhanced alert templates with more variety
  const alertTemplates: AlertTemplate[] = [
    {
      title: "Suspicious Network Activity",
      severity: "Medium",
      source: "Network Monitor",
      description: "Unusual network traffic patterns detected from internal host",
      category: "Network Security"
    },
    {
      title: "Failed Authentication Attempts",
      severity: "High",
      source: "Active Directory",
      description: "Multiple failed login attempts detected from single IP address",
      category: "Identity & Access"
    },
    {
      title: "Malware Signature Detected",
      severity: "Critical",
      source: "Endpoint Protection",
      description: "Known malware signature found on endpoint device",
      category: "Malware"
    },
    {
      title: "Data Exfiltration Attempt",
      severity: "Critical",
      source: "DLP System",
      description: "Large volume data transfer to external destination detected",
      category: "Data Loss Prevention"
    },
    {
      title: "Privilege Escalation",
      severity: "High",
      source: "Windows Event Logs",
      description: "User account gained elevated privileges unexpectedly",
      category: "Privilege Management"
    },
    {
      title: "Unusual File Access",
      severity: "Low",
      source: "File System Monitor",
      description: "Access to sensitive files detected outside business hours",
      category: "File Security"
    },
    {
      title: "Phishing Email Detected",
      severity: "Medium",
      source: "Email Security Gateway",
      description: "Suspicious email with potential phishing indicators",
      category: "Email Security"
    },
    {
      title: "Unauthorized USB Device",
      severity: "Medium",
      source: "Device Control",
      description: "Unknown USB device connected to corporate workstation",
      category: "Device Security"
    },
    {
      title: "SQL Injection Attempt",
      severity: "High",
      source: "Web Application Firewall",
      description: "Potential SQL injection attack detected on web application",
      category: "Web Security"
    },
    {
      title: "Anomalous User Behavior",
      severity: "Medium",
      source: "UEBA System",
      description: "User behavior deviates significantly from established baseline",
      category: "User Behavior Analytics"
    }
  ];

  // Generate weighted random severity
  const getRandomSeverity = useCallback((): AlertSeverity => {
    const random = Math.random();
    let cumulative = 0;
    
    for (const [severity, weight] of Object.entries(severityWeights)) {
      cumulative += weight;
      if (random <= cumulative) {
        return severity as AlertSeverity;
      }
    }
    
    return 'Medium'; // Fallback
  }, [severityWeights]);

  // Generate realistic alert
  const generateAlert = useCallback((): Alert => {
    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const severity = getRandomSeverity();
    const alertId = generateAlertId();
    
    // Generate realistic risk score based on severity
    const riskScoreRanges = {
      'Critical': [8, 10],
      'High': [6, 8],
      'Medium': [3, 6],
      'Low': [1, 3]
    };
    
    const [min, max] = riskScoreRanges[severity];
    const riskScore = Math.random() * (max - min) + min;
    
    // Generate AI analysis based on severity and category
    const aiAnalysisOptions = {
      'Critical': [
        "IMMEDIATE ACTION REQUIRED: High-confidence threat detected",
        "Critical threat indicators match known attack patterns",
        "Automated containment initiated - manual review required"
      ],
      'High': [
        "Potential threat detected - investigating correlations",
        "Behavioral analysis indicates suspicious activity",
        "Threat intelligence correlation in progress"
      ],
      'Medium': [
        "Anomaly detected - analyzing context",
        "Pattern recognition flagged unusual behavior",
        "Baseline deviation requires investigation"
      ],
      'Low': [
        "Minor anomaly detected - monitoring for escalation",
        "Informational alert - no immediate action required",
        "Routine security event logged for analysis"
      ]
    };
    
    const analysisOptions = aiAnalysisOptions[severity];
    const aiAnalysis = analysisOptions[Math.floor(Math.random() * analysisOptions.length)];
    
    // Generate recommended actions based on severity
    const actionsByCategory = {
      'Network Security': ["Review network logs", "Check firewall rules", "Analyze traffic patterns"],
      'Identity & Access': ["Review authentication logs", "Check user permissions", "Verify account status"],
      'Malware': ["Isolate affected endpoint", "Run full system scan", "Update threat signatures"],
      'Data Loss Prevention': ["Review data access logs", "Check file permissions", "Verify data classification"],
      'Email Security': ["Quarantine suspicious emails", "Review email headers", "Check sender reputation"]
    };
    
    const defaultActions = ["Investigate immediately", "Review logs", "Check for correlation"];
    const recommendedActions = actionsByCategory[template.category as keyof typeof actionsByCategory] || defaultActions;

    return {
      id: alertId,
      title: template.title,
      severity,
      status: "New",
      source: template.source,
      timestamp: new Date().toISOString(),
      description: template.description,
      aiAnalysis,
      riskScore,
      artifacts: [],
      recommendedActions
    };
  }, [getRandomSeverity]);

  // Simulate new alerts
  const simulateAlerts = useCallback(() => {
    if (!enabled) return;
    
    const alertsToGenerate = Math.floor(Math.random() * maxAlertsPerInterval) + 1;
    const generatedAlerts: Alert[] = [];
    
    for (let i = 0; i < alertsToGenerate; i++) {
      const newAlert = generateAlert();
      addAlert(newAlert);
      generatedAlerts.push(newAlert);
      
      if (onNewAlert) {
        onNewAlert(newAlert);
      }
    }
    
    setAlertStats(prev => ({
      ...prev,
      generated: prev.generated + alertsToGenerate,
      lastGenerated: new Date().toISOString()
    }));
    
    return generatedAlerts;
  }, [enabled, maxAlertsPerInterval, generateAlert, addAlert, onNewAlert]);

  // Auto-escalate old alerts
  const escalateAlerts = useCallback(() => {
    if (!autoEscalate) return;
    
    const now = new Date();
    const escalationThreshold = new Date(now.getTime() - escalationInterval);
    
    const alertsToEscalate = state.alerts.filter(alert => {
      const alertTime = new Date(alert.timestamp);
      return (
        alertTime < escalationThreshold &&
        alert.status === 'New' &&
        (alert.severity === 'High' || alert.severity === 'Critical')
      );
    });
    
    let escalatedCount = 0;
    
    alertsToEscalate.forEach(alert => {
      const newStatus: AlertStatus = alert.severity === 'Critical' 
        ? 'Active Threat' 
        : 'Under Investigation';
      
      updateAlert(alert.id, { 
        status: newStatus,
        aiAnalysis: `${alert.aiAnalysis} - ESCALATED: Alert auto-escalated due to age and severity`
      });
      
      if (onAlertEscalated) {
        onAlertEscalated({ ...alert, status: newStatus });
      }
      
      escalatedCount++;
    });
    
    if (escalatedCount > 0) {
      setAlertStats(prev => ({
        ...prev,
        escalated: prev.escalated + escalatedCount,
        lastEscalated: new Date().toISOString()
      }));
    }
  }, [autoEscalate, escalationInterval, state.alerts, updateAlert, onAlertEscalated]);

  // Start alert simulation
  const start = useCallback(() => {
    if (alertIntervalRef.current) {
      clearInterval(alertIntervalRef.current);
    }
    if (escalationIntervalRef.current) {
      clearInterval(escalationIntervalRef.current);
    }
    
    if (enabled) {
      alertIntervalRef.current = setInterval(simulateAlerts, interval);
      
      if (autoEscalate) {
        escalationIntervalRef.current = setInterval(escalateAlerts, escalationInterval / 2);
      }
    }
  }, [enabled, interval, autoEscalate, escalationInterval, simulateAlerts, escalateAlerts]);

  // Stop alert simulation
  const stop = useCallback(() => {
    if (alertIntervalRef.current) {
      clearInterval(alertIntervalRef.current);
      alertIntervalRef.current = null;
    }
    if (escalationIntervalRef.current) {
      clearInterval(escalationIntervalRef.current);
      escalationIntervalRef.current = null;
    }
  }, []);

  // Reset statistics
  const resetStats = useCallback(() => {
    setAlertStats({
      generated: 0,
      escalated: 0,
      lastGenerated: null,
      lastEscalated: null
    });
  }, []);

  // Auto-start on mount
  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    // Control methods
    start,
    stop,
    resetStats,
    
    // Manual methods
    simulateAlerts,
    escalateAlerts,
    generateAlert,
    
    // Status
    isRunning: alertIntervalRef.current !== null,
    isEscalating: escalationIntervalRef.current !== null,
    
    // Statistics
    stats: alertStats,
    
    // Configuration
    config: {
      enabled,
      interval,
      maxAlertsPerInterval,
      severityWeights,
      autoEscalate,
      escalationInterval
    }
  };
};