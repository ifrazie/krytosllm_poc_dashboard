/**
 * Data Management Utilities
 * 
 * This module provides CRUD operations and data manipulation utilities
 * for all mock data in the Prophet AI SOC Platform.
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
  AlertFilters,
  AlertSeverity,
  AlertStatus,
  IncidentSeverity,
  IncidentStatus,
  InvestigationStatus,
  IntegrationStatus,
  TeamMemberStatus
} from '../types';

import {
  mockAlerts,
  mockInvestigations,
  mockIntegrations,
  mockSocTeam,
  mockMetrics,
  mockIncidents,
  mockHuntQueries,
  mockHuntResults,
  generateAlertId,
  generateInvestigationId,
  generateIncidentId,
  generateHuntQueryId,
  generateHuntResultId
} from './mockData';

/**
 * Data Manager Class
 * Provides CRUD operations and data management for all application data
 */
export class DataManager {
  private alerts: Alert[] = [];
  private investigations: Investigation[] = [];
  private integrations: Integration[] = [];
  private socTeam: TeamMember[] = [];
  private metrics: Metrics = {} as Metrics;
  private incidents: Incident[] = [];
  private huntQueries: HuntQuery[] = [];
  private huntResults: HuntResult[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    this.alerts = [...mockAlerts];
    this.investigations = [...mockInvestigations];
    this.integrations = [...mockIntegrations];
    this.socTeam = [...mockSocTeam];
    this.metrics = { ...mockMetrics };
    this.incidents = [...mockIncidents];
    this.huntQueries = [...mockHuntQueries];
    this.huntResults = [...mockHuntResults];
  }

  // Alert Management
  getAllAlerts(): Alert[] {
    return [...this.alerts];
  }

  getAlertById(id: string): Alert | null {
    return this.alerts.find(alert => alert.id === id) || null;
  }

  getFilteredAlerts(filters: AlertFilters): Alert[] {
    let filtered = [...this.alerts];

    if (filters.severity) {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }

    if (filters.status) {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }

    if (filters.source) {
      filtered = filtered.filter(alert => alert.source === filters.source);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchLower) ||
        alert.description.toLowerCase().includes(searchLower) ||
        alert.source.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  addAlert(alertData: Omit<Alert, 'id'>): Alert {
    const newAlert: Alert = {
      id: generateAlertId(),
      ...alertData
    };
    
    this.alerts.unshift(newAlert);
    this.updateMetrics();
    return newAlert;
  }

  updateAlert(id: string, updates: Partial<Alert>): Alert | null {
    const index = this.alerts.findIndex(alert => alert.id === id);
    if (index === -1) return null;

    this.alerts[index] = { ...this.alerts[index], ...updates };
    this.updateMetrics();
    return this.alerts[index];
  }

  deleteAlert(id: string): boolean {
    const index = this.alerts.findIndex(alert => alert.id === id);
    if (index === -1) return false;

    this.alerts.splice(index, 1);
    this.updateMetrics();
    return true;
  }

  // Investigation Management
  getAllInvestigations(): Investigation[] {
    return [...this.investigations];
  }

  getInvestigationById(id: string): Investigation | null {
    return this.investigations.find(inv => inv.id === id) || null;
  }

  getInvestigationsByStatus(status: InvestigationStatus): Investigation[] {
    return this.investigations.filter(inv => inv.status === status);
  }

  addInvestigation(investigationData: Omit<Investigation, 'id'>): Investigation {
    const newInvestigation: Investigation = {
      id: generateInvestigationId(),
      ...investigationData
    };
    
    this.investigations.push(newInvestigation);
    this.updateMetrics();
    return newInvestigation;
  }

  updateInvestigation(id: string, updates: Partial<Investigation>): Investigation | null {
    const index = this.investigations.findIndex(inv => inv.id === id);
    if (index === -1) return null;

    this.investigations[index] = { ...this.investigations[index], ...updates };
    this.updateMetrics();
    return this.investigations[index];
  }

  // Integration Management
  getAllIntegrations(): Integration[] {
    return [...this.integrations];
  }

  getIntegrationByName(name: string): Integration | null {
    return this.integrations.find(int => int.name === name) || null;
  }

  updateIntegrationStatus(name: string, status: IntegrationStatus): Integration | null {
    const index = this.integrations.findIndex(int => int.name === name);
    if (index === -1) return null;

    this.integrations[index] = { 
      ...this.integrations[index], 
      status,
      lastSync: status === 'Connected' ? 'Just now' : this.integrations[index].lastSync
    };
    
    return this.integrations[index];
  }

  updateIntegrationSyncTime(name: string, lastSync: string): Integration | null {
    const index = this.integrations.findIndex(int => int.name === name);
    if (index === -1) return null;

    this.integrations[index] = { ...this.integrations[index], lastSync };
    return this.integrations[index];
  }

  // Team Management
  getAllTeamMembers(): TeamMember[] {
    return [...this.socTeam];
  }

  getTeamMemberByName(name: string): TeamMember | null {
    return this.socTeam.find(member => member.name === name) || null;
  }

  updateTeamMemberStatus(name: string, status: TeamMemberStatus): TeamMember | null {
    const index = this.socTeam.findIndex(member => member.name === name);
    if (index === -1) return null;

    this.socTeam[index] = { ...this.socTeam[index], status };
    return this.socTeam[index];
  }

  updateTeamMemberAlerts(name: string, activeAlerts: number): TeamMember | null {
    const index = this.socTeam.findIndex(member => member.name === name);
    if (index === -1) return null;

    this.socTeam[index] = { ...this.socTeam[index], activeAlerts };
    return this.socTeam[index];
  }

  // Incident Management
  getAllIncidents(): Incident[] {
    return [...this.incidents];
  }

  getIncidentById(id: string): Incident | null {
    return this.incidents.find(incident => incident.id === id) || null;
  }

  getIncidentsByStatus(status: IncidentStatus): Incident[] {
    return this.incidents.filter(incident => incident.status === status);
  }

  addIncident(incidentData: Omit<Incident, 'id'>): Incident {
    const newIncident: Incident = {
      id: generateIncidentId(),
      ...incidentData
    };
    
    this.incidents.push(newIncident);
    this.updateMetrics();
    return newIncident;
  }

  updateIncident(id: string, updates: Partial<Incident>): Incident | null {
    const index = this.incidents.findIndex(incident => incident.id === id);
    if (index === -1) return null;

    this.incidents[index] = { 
      ...this.incidents[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.updateMetrics();
    return this.incidents[index];
  }

  // Hunt Query Management
  getAllHuntQueries(): HuntQuery[] {
    return [...this.huntQueries];
  }

  getHuntQueryById(id: string): HuntQuery | null {
    return this.huntQueries.find(query => query.id === id) || null;
  }

  addHuntQuery(queryData: Omit<HuntQuery, 'id'>): HuntQuery {
    const newQuery: HuntQuery = {
      id: generateHuntQueryId(),
      ...queryData
    };
    
    this.huntQueries.push(newQuery);
    return newQuery;
  }

  // Hunt Results Management
  getAllHuntResults(): HuntResult[] {
    return [...this.huntResults];
  }

  getHuntResultById(id: string): HuntResult | null {
    return this.huntResults.find(result => result.id === id) || null;
  }

  addHuntResult(resultData: Omit<HuntResult, 'id'>): HuntResult {
    const newResult: HuntResult = {
      id: generateHuntResultId(),
      ...resultData
    };
    
    this.huntResults.push(newResult);
    return newResult;
  }

  // Metrics Management
  getMetrics(): Metrics {
    return { ...this.metrics };
  }

  private updateMetrics(): void {
    const activeAlerts = this.alerts.filter(alert => alert.status !== 'Resolved').length;
    const activeInvestigations = this.investigations.filter(inv => inv.status === 'In Progress').length;
    const resolvedIncidents = this.incidents.filter(incident => incident.status === 'Resolved').length;

    this.metrics = {
      ...this.metrics,
      totalAlerts: this.alerts.length,
      activeInvestigations,
      resolvedIncidents
    };
  }

  // Data Seeding and Initialization
  seedData(): void {
    this.alerts = [...mockAlerts];
    this.investigations = [...mockInvestigations];
    this.integrations = [...mockIntegrations];
    this.socTeam = [...mockSocTeam];
    this.metrics = { ...mockMetrics };
    this.incidents = [...mockIncidents];
    this.huntQueries = [...mockHuntQueries];
    this.huntResults = [...mockHuntResults];
  }

  resetData(): void {
    this.seedData();
  }

  // Bulk Operations
  bulkUpdateAlerts(ids: string[], updates: Partial<Alert>): Alert[] {
    const updatedAlerts: Alert[] = [];
    
    ids.forEach(id => {
      const updated = this.updateAlert(id, updates);
      if (updated) {
        updatedAlerts.push(updated);
      }
    });
    
    return updatedAlerts;
  }

  bulkDeleteAlerts(ids: string[]): number {
    let deletedCount = 0;
    
    ids.forEach(id => {
      if (this.deleteAlert(id)) {
        deletedCount++;
      }
    });
    
    return deletedCount;
  }

  // Search and Filter Utilities
  searchAlerts(query: string): Alert[] {
    const searchLower = query.toLowerCase();
    return this.alerts.filter(alert =>
      alert.title.toLowerCase().includes(searchLower) ||
      alert.description.toLowerCase().includes(searchLower) ||
      alert.source.toLowerCase().includes(searchLower) ||
      alert.artifacts.some(artifact => artifact.toLowerCase().includes(searchLower))
    );
  }

  getAlertsByDateRange(startDate: string, endDate: string): Alert[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.alerts.filter(alert => {
      const alertDate = new Date(alert.timestamp);
      return alertDate >= start && alertDate <= end;
    });
  }

  getAlertsBySeverity(severity: AlertSeverity): Alert[] {
    return this.alerts.filter(alert => alert.severity === severity);
  }

  getAlertsByStatus(status: AlertStatus): Alert[] {
    return this.alerts.filter(alert => alert.status === status);
  }
}

// Create and export a singleton instance
export const dataManager = new DataManager();