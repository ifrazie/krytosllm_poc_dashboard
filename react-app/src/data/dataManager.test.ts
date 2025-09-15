/**
 * Data Manager Tests
 * 
 * Test suite for the data management system
 */

import { dataManager, DataManager } from './dataManager';
import { DataValidator } from './dataInitializer';
import type { Alert, Investigation, Incident } from '../types';

// Mock data for testing
const mockAlert: Omit<Alert, 'id'> = {
  title: "Test Alert",
  severity: "High",
  status: "New",
  source: "Test Source",
  timestamp: new Date().toISOString(),
  description: "Test alert description",
  aiAnalysis: "Test AI analysis",
  riskScore: 7.5,
  artifacts: ["test-artifact-1", "test-artifact-2"],
  recommendedActions: ["Test action 1", "Test action 2"]
};

const mockInvestigation: Omit<Investigation, 'id'> = {
  alertId: "ALT-2025-001234",
  status: "In Progress",
  assignedTo: "Test Analyst",
  timeline: [
    { time: "10:00", event: "Investigation started" },
    { time: "10:30", event: "Evidence collected" }
  ],
  evidence: ["Test evidence 1", "Test evidence 2"]
};

const mockIncident: Omit<Incident, 'id'> = {
  title: "Test Incident",
  severity: "Medium",
  status: "New",
  description: "Test incident description",
  assignedTo: "Test Responder",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe('DataManager', () => {
  let testDataManager: DataManager;

  beforeEach(() => {
    testDataManager = new DataManager();
    testDataManager.seedData();
  });

  describe('Alert Management', () => {
    test('should add a new alert', () => {
      const initialCount = testDataManager.getAllAlerts().length;
      const newAlert = testDataManager.addAlert(mockAlert);
      
      expect(newAlert).toBeDefined();
      expect(newAlert.id).toBeDefined();
      expect(newAlert.title).toBe(mockAlert.title);
      expect(testDataManager.getAllAlerts().length).toBe(initialCount + 1);
    });

    test('should get alert by ID', () => {
      const newAlert = testDataManager.addAlert(mockAlert);
      const retrievedAlert = testDataManager.getAlertById(newAlert.id);
      
      expect(retrievedAlert).toBeDefined();
      expect(retrievedAlert?.id).toBe(newAlert.id);
      expect(retrievedAlert?.title).toBe(mockAlert.title);
    });

    test('should update alert', () => {
      const newAlert = testDataManager.addAlert(mockAlert);
      const updates = { status: 'Resolved' as const, riskScore: 9.0 };
      const updatedAlert = testDataManager.updateAlert(newAlert.id, updates);
      
      expect(updatedAlert).toBeDefined();
      expect(updatedAlert?.status).toBe('Resolved');
      expect(updatedAlert?.riskScore).toBe(9.0);
    });

    test('should delete alert', () => {
      const newAlert = testDataManager.addAlert(mockAlert);
      const initialCount = testDataManager.getAllAlerts().length;
      const deleted = testDataManager.deleteAlert(newAlert.id);
      
      expect(deleted).toBe(true);
      expect(testDataManager.getAllAlerts().length).toBe(initialCount - 1);
      expect(testDataManager.getAlertById(newAlert.id)).toBeNull();
    });

    test('should filter alerts by severity', () => {
      testDataManager.addAlert({ ...mockAlert, severity: 'Critical' });
      testDataManager.addAlert({ ...mockAlert, severity: 'Low' });
      
      const criticalAlerts = testDataManager.getFilteredAlerts({ severity: 'Critical' });
      const lowAlerts = testDataManager.getFilteredAlerts({ severity: 'Low' });
      
      expect(criticalAlerts.length).toBeGreaterThan(0);
      expect(lowAlerts.length).toBeGreaterThan(0);
      expect(criticalAlerts.every(alert => alert.severity === 'Critical')).toBe(true);
      expect(lowAlerts.every(alert => alert.severity === 'Low')).toBe(true);
    });

    test('should search alerts', () => {
      testDataManager.addAlert({ ...mockAlert, title: "Unique Search Term Alert" });
      
      const searchResults = testDataManager.searchAlerts("Unique Search Term");
      
      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults.some(alert => alert.title.includes("Unique Search Term"))).toBe(true);
    });

    test('should bulk update alerts', () => {
      const alert1 = testDataManager.addAlert(mockAlert);
      const alert2 = testDataManager.addAlert(mockAlert);
      
      const updates = { status: 'Resolved' as const };
      const updatedAlerts = testDataManager.bulkUpdateAlerts([alert1.id, alert2.id], updates);
      
      expect(updatedAlerts.length).toBe(2);
      expect(updatedAlerts.every(alert => alert.status === 'Resolved')).toBe(true);
    });
  });

  describe('Investigation Management', () => {
    test('should add a new investigation', () => {
      const initialCount = testDataManager.getAllInvestigations().length;
      const newInvestigation = testDataManager.addInvestigation(mockInvestigation);
      
      expect(newInvestigation).toBeDefined();
      expect(newInvestigation.id).toBeDefined();
      expect(newInvestigation.alertId).toBe(mockInvestigation.alertId);
      expect(testDataManager.getAllInvestigations().length).toBe(initialCount + 1);
    });

    test('should get investigation by ID', () => {
      const newInvestigation = testDataManager.addInvestigation(mockInvestigation);
      const retrieved = testDataManager.getInvestigationById(newInvestigation.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(newInvestigation.id);
    });

    test('should update investigation', () => {
      const newInvestigation = testDataManager.addInvestigation(mockInvestigation);
      const updates = { status: 'Completed' as const };
      const updated = testDataManager.updateInvestigation(newInvestigation.id, updates);
      
      expect(updated).toBeDefined();
      expect(updated?.status).toBe('Completed');
    });

    test('should filter investigations by status', () => {
      testDataManager.addInvestigation({ ...mockInvestigation, status: 'New' });
      testDataManager.addInvestigation({ ...mockInvestigation, status: 'Completed' });
      
      const newInvestigations = testDataManager.getInvestigationsByStatus('New');
      const completedInvestigations = testDataManager.getInvestigationsByStatus('Completed');
      
      expect(newInvestigations.every(inv => inv.status === 'New')).toBe(true);
      expect(completedInvestigations.every(inv => inv.status === 'Completed')).toBe(true);
    });
  });

  describe('Incident Management', () => {
    test('should add a new incident', () => {
      const initialCount = testDataManager.getAllIncidents().length;
      const newIncident = testDataManager.addIncident(mockIncident);
      
      expect(newIncident).toBeDefined();
      expect(newIncident.id).toBeDefined();
      expect(newIncident.title).toBe(mockIncident.title);
      expect(testDataManager.getAllIncidents().length).toBe(initialCount + 1);
    });

    test('should update incident', () => {
      const newIncident = testDataManager.addIncident(mockIncident);
      const updates = { status: 'Resolved' as const };
      const updated = testDataManager.updateIncident(newIncident.id, updates);
      
      expect(updated).toBeDefined();
      expect(updated?.status).toBe('Resolved');
      expect(updated?.updatedAt).toBeDefined();
    });
  });

  describe('Integration Management', () => {
    test('should get all integrations', () => {
      const integrations = testDataManager.getAllIntegrations();
      expect(integrations.length).toBeGreaterThan(0);
    });

    test('should update integration status', () => {
      const integrations = testDataManager.getAllIntegrations();
      const firstIntegration = integrations[0];
      
      const updated = testDataManager.updateIntegrationStatus(firstIntegration.name, 'Degraded');
      
      expect(updated).toBeDefined();
      expect(updated?.status).toBe('Degraded');
    });

    test('should update sync time', () => {
      const integrations = testDataManager.getAllIntegrations();
      const firstIntegration = integrations[0];
      
      const newSyncTime = '5 minutes ago';
      const updated = testDataManager.updateIntegrationSyncTime(firstIntegration.name, newSyncTime);
      
      expect(updated).toBeDefined();
      expect(updated?.lastSync).toBe(newSyncTime);
    });
  });

  describe('Team Management', () => {
    test('should get all team members', () => {
      const teamMembers = testDataManager.getAllTeamMembers();
      expect(teamMembers.length).toBeGreaterThan(0);
    });

    test('should update team member status', () => {
      const teamMembers = testDataManager.getAllTeamMembers();
      const firstMember = teamMembers[0];
      
      const updated = testDataManager.updateTeamMemberStatus(firstMember.name, 'Away');
      
      expect(updated).toBeDefined();
      expect(updated?.status).toBe('Away');
    });

    test('should update team member alert count', () => {
      const teamMembers = testDataManager.getAllTeamMembers();
      const firstMember = teamMembers[0];
      
      const newCount = 10;
      const updated = testDataManager.updateTeamMemberAlerts(firstMember.name, newCount);
      
      expect(updated).toBeDefined();
      expect(updated?.activeAlerts).toBe(newCount);
    });
  });

  describe('Data Validation', () => {
    test('should validate valid alert', () => {
      const errors = DataValidator.validateAlert(mockAlert);
      expect(errors.length).toBe(0);
    });

    test('should detect invalid alert', () => {
      const invalidAlert = { ...mockAlert, title: '', severity: 'Invalid' as any };
      const errors = DataValidator.validateAlert(invalidAlert);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('should validate valid investigation', () => {
      const errors = DataValidator.validateInvestigation(mockInvestigation);
      expect(errors.length).toBe(0);
    });

    test('should detect invalid investigation', () => {
      const invalidInvestigation = { ...mockInvestigation, alertId: '', status: 'Invalid' as any };
      const errors = DataValidator.validateInvestigation(invalidInvestigation);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('should validate valid incident', () => {
      const errors = DataValidator.validateIncident(mockIncident);
      expect(errors.length).toBe(0);
    });

    test('should detect invalid incident', () => {
      const invalidIncident = { ...mockIncident, title: '', severity: 'Invalid' as any };
      const errors = DataValidator.validateIncident(invalidIncident);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

// Export test utilities
export { mockAlert, mockInvestigation, mockIncident };