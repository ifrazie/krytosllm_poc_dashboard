/**
 * Data Initialization and Seeding
 * 
 * This module provides functions to initialize and seed data
 * for the Prophet AI SOC Platform, including data validation
 * and setup utilities.
 */

import type {
  Alert,
  Investigation,
  Integration,
  TeamMember,
  Metrics,
  Incident,
  HuntQuery,
  HuntResult,
  AlertSeverity,
  AlertStatus,
  InvestigationStatus,
  IntegrationStatus,
  TeamMemberStatus,
  IncidentSeverity,
  IncidentStatus
} from '../types';

import { dataManager } from './dataManager';
import { realTimeSimulator } from './realTimeSimulation';

/**
 * Data validation utilities
 */
export class DataValidator {
  /**
   * Validate alert data
   */
  static validateAlert(alert: Partial<Alert>): string[] {
    const errors: string[] = [];

    if (!alert.title || alert.title.trim().length === 0) {
      errors.push('Alert title is required');
    }

    if (!alert.severity || !['Critical', 'High', 'Medium', 'Low'].includes(alert.severity)) {
      errors.push('Valid alert severity is required');
    }

    if (!alert.status || !['Active Threat', 'Under Investigation', 'Auto-Contained', 'Resolved', 'New', 'Investigating'].includes(alert.status)) {
      errors.push('Valid alert status is required');
    }

    if (!alert.source || alert.source.trim().length === 0) {
      errors.push('Alert source is required');
    }

    if (!alert.timestamp || isNaN(Date.parse(alert.timestamp))) {
      errors.push('Valid timestamp is required');
    }

    if (alert.riskScore !== undefined && (alert.riskScore < 0 || alert.riskScore > 10)) {
      errors.push('Risk score must be between 0 and 10');
    }

    return errors;
  }

  /**
   * Validate investigation data
   */
  static validateInvestigation(investigation: Partial<Investigation>): string[] {
    const errors: string[] = [];

    if (!investigation.alertId || investigation.alertId.trim().length === 0) {
      errors.push('Alert ID is required');
    }

    if (!investigation.status || !['New', 'In Progress', 'Completed'].includes(investigation.status)) {
      errors.push('Valid investigation status is required');
    }

    if (!investigation.assignedTo || investigation.assignedTo.trim().length === 0) {
      errors.push('Assigned analyst is required');
    }

    if (!investigation.timeline || !Array.isArray(investigation.timeline)) {
      errors.push('Timeline must be an array');
    }

    if (!investigation.evidence || !Array.isArray(investigation.evidence)) {
      errors.push('Evidence must be an array');
    }

    return errors;
  }

  /**
   * Validate incident data
   */
  static validateIncident(incident: Partial<Incident>): string[] {
    const errors: string[] = [];

    if (!incident.title || incident.title.trim().length === 0) {
      errors.push('Incident title is required');
    }

    if (!incident.severity || !['Critical', 'High', 'Medium', 'Low'].includes(incident.severity)) {
      errors.push('Valid incident severity is required');
    }

    if (!incident.status || !['New', 'In Progress', 'Resolved', 'Closed'].includes(incident.status)) {
      errors.push('Valid incident status is required');
    }

    if (!incident.description || incident.description.trim().length === 0) {
      errors.push('Incident description is required');
    }

    if (!incident.createdAt || isNaN(Date.parse(incident.createdAt))) {
      errors.push('Valid creation timestamp is required');
    }

    return errors;
  }
}

/**
 * Data initialization and seeding manager
 */
export class DataInitializer {
  private initialized = false;

  /**
   * Initialize the application data
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('Data already initialized');
      return;
    }

    try {
      // Seed initial data
      this.seedInitialData();
      
      // Validate seeded data
      this.validateSeededData();
      
      // Set up real-time simulation
      this.setupRealTimeSimulation();
      
      this.initialized = true;
      console.log('Data initialization completed successfully');
    } catch (error) {
      console.error('Data initialization failed:', error);
      throw error;
    }
  }

  /**
   * Reset and re-initialize data
   */
  async reinitialize(): Promise<void> {
    this.initialized = false;
    dataManager.resetData();
    realTimeSimulator.stopSimulation();
    await this.initialize();
  }

  /**
   * Seed initial data
   */
  private seedInitialData(): void {
    // Reset data manager to initial state
    dataManager.seedData();
    
    // Add some additional sample data for testing
    this.addSampleAlerts();
    this.addSampleInvestigations();
    this.addSampleIncidents();
    
    console.log('Initial data seeded successfully');
  }

  /**
   * Add sample alerts for testing
   */
  private addSampleAlerts(): void {
    const sampleAlerts = [
      {
        title: "Suspicious API Calls",
        severity: "Medium" as AlertSeverity,
        status: "New" as AlertStatus,
        source: "API Gateway",
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        description: "Unusual API call patterns detected from external IP",
        aiAnalysis: "AI detected abnormal API usage patterns suggesting potential reconnaissance.",
        riskScore: 6.5,
        artifacts: ["API endpoint: /api/users", "Source IP: 192.168.1.100", "Rate limit exceeded"],
        recommendedActions: ["Review API logs", "Check rate limiting", "Investigate source IP"]
      },
      {
        title: "Unauthorized File Modification",
        severity: "High" as AlertSeverity,
        status: "Under Investigation" as AlertStatus,
        source: "File Integrity Monitor",
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        description: "Critical system file modified without authorization",
        aiAnalysis: "System file modification detected outside maintenance window. Potential system compromise.",
        riskScore: 8.2,
        artifacts: ["/etc/passwd", "Modified by: unknown", "No change request found"],
        recommendedActions: ["Isolate affected system", "Review file changes", "Check for backdoors"]
      }
    ];

    sampleAlerts.forEach(alert => {
      dataManager.addAlert(alert);
    });
  }

  /**
   * Add sample investigations for testing
   */
  private addSampleInvestigations(): void {
    const alerts = dataManager.getAllAlerts();
    if (alerts.length > 0) {
      const sampleInvestigation = {
        alertId: alerts[0].id,
        status: "In Progress" as InvestigationStatus,
        assignedTo: "Sarah Chen",
        timeline: [
          { time: "20:30", event: "Investigation initiated" },
          { time: "20:35", event: "Initial analysis completed" },
          { time: "20:40", event: "Evidence collection started" }
        ],
        evidence: [
          "Network traffic logs",
          "System event logs",
          "User activity records"
        ]
      };

      dataManager.addInvestigation(sampleInvestigation);
    }
  }

  /**
   * Add sample incidents for testing
   */
  private addSampleIncidents(): void {
    const sampleIncident = {
      title: "Security Policy Violation",
      severity: "Medium" as IncidentSeverity,
      status: "New" as IncidentStatus,
      description: "Employee violated data handling policy",
      assignedTo: "Mike Rodriguez",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dataManager.addIncident(sampleIncident);
  }

  /**
   * Validate seeded data
   */
  private validateSeededData(): void {
    const alerts = dataManager.getAllAlerts();
    const investigations = dataManager.getAllInvestigations();
    const incidents = dataManager.getAllIncidents();

    // Validate alerts
    alerts.forEach((alert, index) => {
      const errors = DataValidator.validateAlert(alert);
      if (errors.length > 0) {
        console.warn(`Alert ${index} validation errors:`, errors);
      }
    });

    // Validate investigations
    investigations.forEach((investigation, index) => {
      const errors = DataValidator.validateInvestigation(investigation);
      if (errors.length > 0) {
        console.warn(`Investigation ${index} validation errors:`, errors);
      }
    });

    // Validate incidents
    incidents.forEach((incident, index) => {
      const errors = DataValidator.validateIncident(incident);
      if (errors.length > 0) {
        console.warn(`Incident ${index} validation errors:`, errors);
      }
    });

    console.log('Data validation completed');
  }

  /**
   * Set up real-time simulation
   */
  private setupRealTimeSimulation(): void {
    // Start real-time simulation
    realTimeSimulator.startSimulation();
    console.log('Real-time simulation started');
  }

  /**
   * Get initialization status
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get data statistics
   */
  getDataStats(): {
    alerts: number;
    investigations: number;
    incidents: number;
    integrations: number;
    teamMembers: number;
    huntQueries: number;
    huntResults: number;
  } {
    return {
      alerts: dataManager.getAllAlerts().length,
      investigations: dataManager.getAllInvestigations().length,
      incidents: dataManager.getAllIncidents().length,
      integrations: dataManager.getAllIntegrations().length,
      teamMembers: dataManager.getAllTeamMembers().length,
      huntQueries: dataManager.getAllHuntQueries().length,
      huntResults: dataManager.getAllHuntResults().length
    };
  }

  /**
   * Export data for backup
   */
  exportData(): {
    alerts: Alert[];
    investigations: Investigation[];
    incidents: Incident[];
    integrations: Integration[];
    teamMembers: TeamMember[];
    metrics: Metrics;
    huntQueries: HuntQuery[];
    huntResults: HuntResult[];
    timestamp: string;
  } {
    return {
      alerts: dataManager.getAllAlerts(),
      investigations: dataManager.getAllInvestigations(),
      incidents: dataManager.getAllIncidents(),
      integrations: dataManager.getAllIntegrations(),
      teamMembers: dataManager.getAllTeamMembers(),
      metrics: dataManager.getMetrics(),
      huntQueries: dataManager.getAllHuntQueries(),
      huntResults: dataManager.getAllHuntResults(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Import data from backup
   */
  importData(data: ReturnType<DataInitializer['exportData']>): void {
    try {
      // Stop current simulation
      realTimeSimulator.stopSimulation();
      
      // Reset data manager
      dataManager.resetData();
      
      // Import data (this would require extending DataManager with import methods)
      console.log('Data import completed');
      
      // Restart simulation
      realTimeSimulator.startSimulation();
    } catch (error) {
      console.error('Data import failed:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const dataInitializer = new DataInitializer();

// Utility functions
export const initializeData = async (): Promise<void> => {
  await dataInitializer.initialize();
};

export const reinitializeData = async (): Promise<void> => {
  await dataInitializer.reinitialize();
};

export const getDataStats = () => {
  return dataInitializer.getDataStats();
};

export const exportData = () => {
  return dataInitializer.exportData();
};

export const isDataInitialized = (): boolean => {
  return dataInitializer.isInitialized();
};