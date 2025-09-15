/**
 * Data Management Verification Script
 * 
 * This script verifies that all data management functionality works correctly
 */

import { dataManager } from './dataManager';
import { realTimeSimulator } from './realTimeSimulation';
import { dataInitializer, DataValidator } from './dataInitializer';
import type { Alert, Investigation, Incident } from '../types';

// Test data
const testAlert: Omit<Alert, 'id'> = {
  title: "Test Alert - Data Management Verification",
  severity: "High",
  status: "New",
  source: "Verification Script",
  timestamp: new Date().toISOString(),
  description: "This is a test alert created by the verification script",
  aiAnalysis: "Test AI analysis for verification purposes",
  riskScore: 7.5,
  artifacts: ["test-artifact-1", "test-artifact-2"],
  recommendedActions: ["Test action 1", "Test action 2"]
};

const testInvestigation: Omit<Investigation, 'id'> = {
  alertId: "ALT-2025-001234",
  status: "In Progress",
  assignedTo: "Test Analyst",
  timeline: [
    { time: "10:00", event: "Investigation started" },
    { time: "10:30", event: "Evidence collected" }
  ],
  evidence: ["Test evidence 1", "Test evidence 2"]
};

const testIncident: Omit<Incident, 'id'> = {
  title: "Test Incident - Data Management Verification",
  severity: "Medium",
  status: "New",
  description: "This is a test incident created by the verification script",
  assignedTo: "Test Responder",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Verification functions
 */
function verifyAlertManagement(): boolean {
  console.log('🔍 Verifying Alert Management...');
  
  try {
    // Test adding alert
    const initialCount = dataManager.getAllAlerts().length;
    const newAlert = dataManager.addAlert(testAlert);
    console.log(`✅ Added alert: ${newAlert.id}`);
    
    // Test getting alert by ID
    const retrievedAlert = dataManager.getAlertById(newAlert.id);
    if (!retrievedAlert || retrievedAlert.id !== newAlert.id) {
      throw new Error('Failed to retrieve alert by ID');
    }
    console.log('✅ Retrieved alert by ID');
    
    // Test updating alert
    const updatedAlert = dataManager.updateAlert(newAlert.id, { status: 'Resolved', riskScore: 9.0 });
    if (!updatedAlert || updatedAlert.status !== 'Resolved' || updatedAlert.riskScore !== 9.0) {
      throw new Error('Failed to update alert');
    }
    console.log('✅ Updated alert');
    
    // Test filtering alerts
    const filteredAlerts = dataManager.getFilteredAlerts({ severity: 'High' });
    if (filteredAlerts.length === 0) {
      throw new Error('Failed to filter alerts');
    }
    console.log('✅ Filtered alerts');
    
    // Test searching alerts
    const searchResults = dataManager.searchAlerts('Verification');
    if (searchResults.length === 0) {
      throw new Error('Failed to search alerts');
    }
    console.log('✅ Searched alerts');
    
    // Test deleting alert
    const deleted = dataManager.deleteAlert(newAlert.id);
    if (!deleted) {
      throw new Error('Failed to delete alert');
    }
    console.log('✅ Deleted alert');
    
    const finalCount = dataManager.getAllAlerts().length;
    if (finalCount !== initialCount) {
      throw new Error('Alert count mismatch after deletion');
    }
    console.log('✅ Alert count verified');
    
    return true;
  } catch (error) {
    console.error('❌ Alert management verification failed:', error);
    return false;
  }
}

function verifyInvestigationManagement(): boolean {
  console.log('🔍 Verifying Investigation Management...');
  
  try {
    // Test adding investigation
    const initialCount = dataManager.getAllInvestigations().length;
    const newInvestigation = dataManager.addInvestigation(testInvestigation);
    console.log(`✅ Added investigation: ${newInvestigation.id}`);
    
    // Test getting investigation by ID
    const retrieved = dataManager.getInvestigationById(newInvestigation.id);
    if (!retrieved || retrieved.id !== newInvestigation.id) {
      throw new Error('Failed to retrieve investigation by ID');
    }
    console.log('✅ Retrieved investigation by ID');
    
    // Test updating investigation
    const updated = dataManager.updateInvestigation(newInvestigation.id, { status: 'Completed' });
    if (!updated || updated.status !== 'Completed') {
      throw new Error('Failed to update investigation');
    }
    console.log('✅ Updated investigation');
    
    // Test filtering by status
    const completedInvestigations = dataManager.getInvestigationsByStatus('Completed');
    if (!completedInvestigations.some(inv => inv.id === newInvestigation.id)) {
      throw new Error('Failed to filter investigations by status');
    }
    console.log('✅ Filtered investigations by status');
    
    return true;
  } catch (error) {
    console.error('❌ Investigation management verification failed:', error);
    return false;
  }
}

function verifyIncidentManagement(): boolean {
  console.log('🔍 Verifying Incident Management...');
  
  try {
    // Test adding incident
    const initialCount = dataManager.getAllIncidents().length;
    const newIncident = dataManager.addIncident(testIncident);
    console.log(`✅ Added incident: ${newIncident.id}`);
    
    // Test getting incident by ID
    const retrieved = dataManager.getIncidentById(newIncident.id);
    if (!retrieved || retrieved.id !== newIncident.id) {
      throw new Error('Failed to retrieve incident by ID');
    }
    console.log('✅ Retrieved incident by ID');
    
    // Test updating incident
    const updated = dataManager.updateIncident(newIncident.id, { status: 'Resolved' });
    if (!updated || updated.status !== 'Resolved') {
      throw new Error('Failed to update incident');
    }
    console.log('✅ Updated incident');
    
    // Test filtering by status
    const resolvedIncidents = dataManager.getIncidentsByStatus('Resolved');
    if (!resolvedIncidents.some(inc => inc.id === newIncident.id)) {
      throw new Error('Failed to filter incidents by status');
    }
    console.log('✅ Filtered incidents by status');
    
    return true;
  } catch (error) {
    console.error('❌ Incident management verification failed:', error);
    return false;
  }
}

function verifyIntegrationManagement(): boolean {
  console.log('🔍 Verifying Integration Management...');
  
  try {
    // Test getting all integrations
    const integrations = dataManager.getAllIntegrations();
    if (integrations.length === 0) {
      throw new Error('No integrations found');
    }
    console.log(`✅ Retrieved ${integrations.length} integrations`);
    
    // Test updating integration status
    const firstIntegration = integrations[0];
    const updated = dataManager.updateIntegrationStatus(firstIntegration.name, 'Degraded');
    if (!updated || updated.status !== 'Degraded') {
      throw new Error('Failed to update integration status');
    }
    console.log('✅ Updated integration status');
    
    // Test updating sync time
    const syncUpdated = dataManager.updateIntegrationSyncTime(firstIntegration.name, '10 minutes ago');
    if (!syncUpdated || syncUpdated.lastSync !== '10 minutes ago') {
      throw new Error('Failed to update sync time');
    }
    console.log('✅ Updated sync time');
    
    return true;
  } catch (error) {
    console.error('❌ Integration management verification failed:', error);
    return false;
  }
}

function verifyTeamManagement(): boolean {
  console.log('🔍 Verifying Team Management...');
  
  try {
    // Test getting all team members
    const teamMembers = dataManager.getAllTeamMembers();
    if (teamMembers.length === 0) {
      throw new Error('No team members found');
    }
    console.log(`✅ Retrieved ${teamMembers.length} team members`);
    
    // Test updating team member status
    const firstMember = teamMembers[0];
    const statusUpdated = dataManager.updateTeamMemberStatus(firstMember.name, 'Away');
    if (!statusUpdated || statusUpdated.status !== 'Away') {
      throw new Error('Failed to update team member status');
    }
    console.log('✅ Updated team member status');
    
    // Test updating alert count
    const alertsUpdated = dataManager.updateTeamMemberAlerts(firstMember.name, 15);
    if (!alertsUpdated || alertsUpdated.activeAlerts !== 15) {
      throw new Error('Failed to update team member alert count');
    }
    console.log('✅ Updated team member alert count');
    
    return true;
  } catch (error) {
    console.error('❌ Team management verification failed:', error);
    return false;
  }
}

function verifyDataValidation(): boolean {
  console.log('🔍 Verifying Data Validation...');
  
  try {
    // Test valid alert validation
    const validAlertErrors = DataValidator.validateAlert(testAlert);
    if (validAlertErrors.length > 0) {
      throw new Error(`Valid alert failed validation: ${validAlertErrors.join(', ')}`);
    }
    console.log('✅ Valid alert passed validation');
    
    // Test invalid alert validation
    const invalidAlert = { ...testAlert, title: '', severity: 'Invalid' as any };
    const invalidAlertErrors = DataValidator.validateAlert(invalidAlert);
    if (invalidAlertErrors.length === 0) {
      throw new Error('Invalid alert passed validation');
    }
    console.log('✅ Invalid alert failed validation as expected');
    
    // Test valid investigation validation
    const validInvErrors = DataValidator.validateInvestigation(testInvestigation);
    if (validInvErrors.length > 0) {
      throw new Error(`Valid investigation failed validation: ${validInvErrors.join(', ')}`);
    }
    console.log('✅ Valid investigation passed validation');
    
    // Test valid incident validation
    const validIncErrors = DataValidator.validateIncident(testIncident);
    if (validIncErrors.length > 0) {
      throw new Error(`Valid incident failed validation: ${validIncErrors.join(', ')}`);
    }
    console.log('✅ Valid incident passed validation');
    
    return true;
  } catch (error) {
    console.error('❌ Data validation verification failed:', error);
    return false;
  }
}

function verifyRealTimeSimulation(): boolean {
  console.log('🔍 Verifying Real-time Simulation...');
  
  try {
    // Test manual alert generation
    const initialAlertCount = dataManager.getAllAlerts().length;
    const newAlert = realTimeSimulator.generateRandomAlert();
    const finalAlertCount = dataManager.getAllAlerts().length;
    
    if (finalAlertCount !== initialAlertCount + 1) {
      throw new Error('Failed to generate random alert');
    }
    console.log(`✅ Generated random alert: ${newAlert.id}`);
    
    // Test simulation stats
    const stats = realTimeSimulator.getSimulationStats();
    if (typeof stats.alertsGenerated !== 'number' || typeof stats.huntResultsGenerated !== 'number') {
      throw new Error('Failed to get simulation stats');
    }
    console.log('✅ Retrieved simulation stats');
    
    return true;
  } catch (error) {
    console.error('❌ Real-time simulation verification failed:', error);
    return false;
  }
}

function verifyDataInitialization(): boolean {
  console.log('🔍 Verifying Data Initialization...');
  
  try {
    // Test data stats
    const stats = dataInitializer.getDataStats();
    if (stats.alerts === 0 || stats.integrations === 0 || stats.teamMembers === 0) {
      throw new Error('Data stats indicate missing data');
    }
    console.log('✅ Retrieved data stats');
    
    // Test data export
    const exportedData = dataInitializer.exportData();
    if (!exportedData.timestamp || exportedData.alerts.length === 0) {
      throw new Error('Failed to export data');
    }
    console.log('✅ Exported data successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Data initialization verification failed:', error);
    return false;
  }
}

/**
 * Main verification function
 */
export function verifyDataManagement(): boolean {
  console.log('🚀 Starting Data Management Verification...\n');
  
  const results = [
    verifyAlertManagement(),
    verifyInvestigationManagement(),
    verifyIncidentManagement(),
    verifyIntegrationManagement(),
    verifyTeamManagement(),
    verifyDataValidation(),
    verifyRealTimeSimulation(),
    verifyDataInitialization()
  ];
  
  const passed = results.filter(result => result).length;
  const total = results.length;
  
  console.log(`\n📊 Verification Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All data management functionality verified successfully!');
    return true;
  } else {
    console.log('❌ Some verification tests failed. Please check the logs above.');
    return false;
  }
}

// Run verification if this file is executed directly
if (typeof window === 'undefined') {
  verifyDataManagement();
}