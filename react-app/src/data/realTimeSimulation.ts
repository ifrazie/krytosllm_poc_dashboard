/**
 * Real-time Data Simulation
 * 
 * This module provides functions to simulate real-time updates
 * for the Prophet AI SOC Platform, including new alerts, sync updates,
 * and metric changes.
 */

import type {
  Alert,
  AlertSeverity,
  AlertStatus,
  Integration,
  TeamMember,
  Metrics,
  HuntResult
} from '../types';

import { dataManager } from './dataManager';

// Alert simulation templates
const alertTemplates = [
  {
    title: "Suspicious Network Activity",
    severity: "Medium" as AlertSeverity,
    source: "Network Monitor",
    description: "Unusual network traffic patterns detected",
    aiAnalysis: "AI has identified abnormal network behavior suggesting potential reconnaissance activity.",
    artifacts: ["192.168.1.0/24", "Port scanning detected", "Multiple connection attempts"],
    recommendedActions: ["Block suspicious IPs", "Review network logs", "Check for lateral movement"]
  },
  {
    title: "Failed Authentication Attempts",
    severity: "High" as AlertSeverity,
    source: "Active Directory",
    description: "Multiple failed login attempts detected",
    aiAnalysis: "Potential brute force attack detected with 50+ failed attempts in 5 minutes.",
    artifacts: ["user.account@company.com", "Source IP: 203.45.67.89", "Failed attempts: 52"],
    recommendedActions: ["Lock user account", "Block source IP", "Investigate user activity"]
  },
  {
    title: "Unusual File Access",
    severity: "Low" as AlertSeverity,
    source: "File System Monitor",
    description: "Abnormal file access patterns detected",
    aiAnalysis: "User accessing files outside normal working hours and patterns.",
    artifacts: ["sensitive_data.xlsx", "Off-hours access", "Unusual file path"],
    recommendedActions: ["Review user permissions", "Check file integrity", "Contact user"]
  },
  {
    title: "Malware Signature Detected",
    severity: "Critical" as AlertSeverity,
    source: "Endpoint Protection",
    description: "Known malware signature found on endpoint",
    aiAnalysis: "High-confidence malware detection. Endpoint has been automatically isolated.",
    artifacts: ["LAPTOP-USER-123", "trojan.exe", "Quarantined successfully"],
    recommendedActions: ["Keep endpoint isolated", "Run full scan", "Investigate infection vector"]
  },
  {
    title: "Data Exfiltration Warning",
    severity: "High" as AlertSeverity,
    source: "DLP System",
    description: "Large data transfer to external destination",
    aiAnalysis: "Potential data exfiltration detected. 1.2GB transferred to unknown external IP.",
    artifacts: ["External IP: 185.220.101.42", "1.2GB transferred", "Sensitive data detected"],
    recommendedActions: ["Block external IP", "Review data classification", "Investigate user activity"]
  },
  {
    title: "Privilege Escalation Attempt",
    severity: "High" as AlertSeverity,
    source: "Windows Event Logs",
    description: "Unauthorized privilege escalation detected",
    aiAnalysis: "Service account attempting to gain administrative privileges outside maintenance window.",
    artifacts: ["SVC-DATABASE", "Admin privileges requested", "No change request found"],
    recommendedActions: ["Revoke privileges", "Audit account activity", "Check for persistence"]
  }
];

// Hunt result templates
const huntResultTemplates = [
  {
    title: "Suspicious PowerShell Activity",
    description: "Encoded PowerShell commands detected",
    confidence: 88,
    severity: "High" as const,
    artifacts: ["Base64 encoded commands", "PowerShell.exe", "Suspicious parameters"]
  },
  {
    title: "Unusual DNS Queries",
    description: "DNS queries to suspicious domains",
    confidence: 75,
    severity: "Medium" as const,
    artifacts: ["malicious-domain.com", "DNS tunneling patterns", "High query frequency"]
  },
  {
    title: "Registry Modification",
    description: "Suspicious registry changes detected",
    confidence: 92,
    severity: "Critical" as const,
    artifacts: ["HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run", "Persistence mechanism", "Unknown executable"]
  }
];

/**
 * Real-time Simulation Manager
 */
export class RealTimeSimulator {
  private alertInterval: NodeJS.Timeout | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private metricsInterval: NodeJS.Timeout | null = null;
  private huntInterval: NodeJS.Timeout | null = null;

  /**
   * Start all real-time simulations
   */
  startSimulation(): void {
    this.startAlertSimulation();
    this.startSyncSimulation();
    this.startMetricsSimulation();
    this.startHuntSimulation();
  }

  /**
   * Stop all real-time simulations
   */
  stopSimulation(): void {
    if (this.alertInterval) {
      clearInterval(this.alertInterval);
      this.alertInterval = null;
    }
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
    if (this.huntInterval) {
      clearInterval(this.huntInterval);
      this.huntInterval = null;
    }
  }

  /**
   * Simulate new alerts appearing
   */
  private startAlertSimulation(): void {
    this.alertInterval = setInterval(() => {
      this.generateRandomAlert();
    }, 30000); // New alert every 30 seconds
  }

  /**
   * Simulate integration sync time updates
   */
  private startSyncSimulation(): void {
    this.syncInterval = setInterval(() => {
      this.updateSyncTimes();
    }, 5000); // Update sync times every 5 seconds
  }

  /**
   * Simulate metrics updates
   */
  private startMetricsSimulation(): void {
    this.metricsInterval = setInterval(() => {
      this.updateMetrics();
    }, 15000); // Update metrics every 15 seconds
  }

  /**
   * Simulate hunt results
   */
  private startHuntSimulation(): void {
    this.huntInterval = setInterval(() => {
      this.generateHuntResult();
    }, 45000); // New hunt result every 45 seconds
  }

  /**
   * Generate a random alert
   */
  generateRandomAlert(): Alert {
    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const riskScore = this.calculateRiskScore(template.severity);
    
    const newAlert = dataManager.addAlert({
      title: template.title,
      severity: template.severity,
      status: this.getRandomStatus(),
      source: template.source,
      timestamp: new Date().toISOString(),
      description: template.description,
      aiAnalysis: template.aiAnalysis,
      riskScore,
      artifacts: template.artifacts,
      recommendedActions: template.recommendedActions
    });

    return newAlert;
  }

  /**
   * Update integration sync times
   */
  private updateSyncTimes(): void {
    const integrations = dataManager.getAllIntegrations();
    
    integrations.forEach(integration => {
      if (integration.status === 'Connected') {
        const seconds = Math.floor(Math.random() * 120) + 30; // 30-150 seconds
        const syncTime = this.formatSyncTime(seconds);
        dataManager.updateIntegrationSyncTime(integration.name, syncTime);
      }
    });
  }

  /**
   * Update metrics with small random changes
   */
  private updateMetrics(): void {
    const currentMetrics = dataManager.getMetrics();
    
    // Small random changes to simulate real-time updates
    const alertChange = Math.floor(Math.random() * 5) - 2; // -2 to +2
    const investigationChange = Math.floor(Math.random() * 3) - 1; // -1 to +1
    
    // Update team member alert counts
    const teamMembers = dataManager.getAllTeamMembers();
    teamMembers.forEach(member => {
      if (member.status === 'Online') {
        const change = Math.floor(Math.random() * 3) - 1; // -1 to +1
        const newCount = Math.max(0, member.activeAlerts + change);
        dataManager.updateTeamMemberAlerts(member.name, newCount);
      }
    });
  }

  /**
   * Generate a random hunt result
   */
  private generateHuntResult(): HuntResult {
    const template = huntResultTemplates[Math.floor(Math.random() * huntResultTemplates.length)];
    
    const newResult = dataManager.addHuntResult({
      title: template.title,
      description: template.description,
      confidence: template.confidence + Math.floor(Math.random() * 10) - 5, // ±5 variation
      severity: template.severity,
      timestamp: new Date().toISOString(),
      artifacts: template.artifacts
    });

    return newResult;
  }

  /**
   * Calculate risk score based on severity
   */
  private calculateRiskScore(severity: AlertSeverity): number {
    const baseScores = {
      'Critical': 9.0,
      'High': 7.5,
      'Medium': 5.0,
      'Low': 2.5
    };
    
    const base = baseScores[severity];
    const variation = (Math.random() - 0.5) * 2; // ±1 variation
    return Math.max(0, Math.min(10, base + variation));
  }

  /**
   * Get a random alert status
   */
  private getRandomStatus(): AlertStatus {
    const statuses: AlertStatus[] = ['New', 'Under Investigation', 'Active Threat', 'Auto-Contained'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  /**
   * Format sync time string
   */
  private formatSyncTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  }

  /**
   * Simulate team member status changes
   */
  simulateTeamStatusChange(): void {
    const teamMembers = dataManager.getAllTeamMembers();
    const randomMember = teamMembers[Math.floor(Math.random() * teamMembers.length)];
    
    const statuses: Array<'Online' | 'Away' | 'Offline'> = ['Online', 'Away', 'Offline'];
    const currentIndex = statuses.indexOf(randomMember.status);
    const newStatus = statuses[(currentIndex + 1) % statuses.length];
    
    dataManager.updateTeamMemberStatus(randomMember.name, newStatus);
  }

  /**
   * Simulate integration status changes
   */
  simulateIntegrationStatusChange(): void {
    const integrations = dataManager.getAllIntegrations();
    const randomIntegration = integrations[Math.floor(Math.random() * integrations.length)];
    
    // Occasionally change status (10% chance)
    if (Math.random() < 0.1) {
      const statuses: Array<'Connected' | 'Degraded' | 'Disconnected'> = ['Connected', 'Degraded', 'Disconnected'];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      dataManager.updateIntegrationStatus(randomIntegration.name, newStatus);
    }
  }

  /**
   * Get simulation statistics
   */
  getSimulationStats(): {
    alertsGenerated: number;
    huntResultsGenerated: number;
    isRunning: boolean;
  } {
    return {
      alertsGenerated: dataManager.getAllAlerts().length,
      huntResultsGenerated: dataManager.getAllHuntResults().length,
      isRunning: this.alertInterval !== null
    };
  }
}

// Create and export singleton instance
export const realTimeSimulator = new RealTimeSimulator();

// Utility functions for manual simulation
export const simulateNewAlert = (): Alert => {
  return realTimeSimulator.generateRandomAlert();
};

export const simulateTeamStatusChange = (): void => {
  realTimeSimulator.simulateTeamStatusChange();
};

export const simulateIntegrationStatusChange = (): void => {
  realTimeSimulator.simulateIntegrationStatusChange();
};

// Export types for external use
export type { RealTimeSimulator as RealTimeSimulatorType };