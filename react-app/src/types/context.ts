/**
 * React Context-related type definitions
 */

import type { Alert } from './alert';
import type { Investigation } from './investigation';
import type { Integration } from './integration';
import type { TeamMember } from './team';
import type { Metrics } from './metrics';
import type { Incident } from './incident';

export type AppSection = 
  | 'dashboard' 
  | 'alerts' 
  | 'investigations' 
  | 'hunting' 
  | 'incidents' 
  | 'analytics' 
  | 'integrations';

export interface AppState {
  // Data
  alerts: Alert[];
  investigations: Investigation[];
  integrations: Integration[];
  socTeam: TeamMember[];
  metrics: Metrics;
  incidents: Incident[];
  
  // UI State
  currentSection: AppSection;
  selectedInvestigation: string | null;
  selectedAlert: string | null;
  
  // Loading states
  loading: {
    alerts: boolean;
    investigations: boolean;
    integrations: boolean;
    metrics: boolean;
    incidents: boolean;
  };
  
  // Error states
  errors: {
    alerts: string | null;
    investigations: string | null;
    integrations: string | null;
    metrics: string | null;
    incidents: string | null;
  };
}

export type AppAction = 
  | { type: 'SET_CURRENT_SECTION'; payload: AppSection }
  | { type: 'SET_SELECTED_INVESTIGATION'; payload: string | null }
  | { type: 'SET_SELECTED_ALERT'; payload: string | null }
  | { type: 'SET_ALERTS'; payload: Alert[] }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'UPDATE_ALERT'; payload: { id: string; updates: Partial<Alert> } }
  | { type: 'SET_INVESTIGATIONS'; payload: Investigation[] }
  | { type: 'ADD_INVESTIGATION'; payload: Investigation }
  | { type: 'UPDATE_INVESTIGATION'; payload: { id: string; updates: Partial<Investigation> } }
  | { type: 'SET_INTEGRATIONS'; payload: Integration[] }
  | { type: 'UPDATE_INTEGRATION'; payload: { name: string; updates: Partial<Integration> } }
  | { type: 'SET_SOC_TEAM'; payload: TeamMember[] }
  | { type: 'UPDATE_TEAM_MEMBER'; payload: { name: string; updates: Partial<TeamMember> } }
  | { type: 'SET_METRICS'; payload: Metrics }
  | { type: 'SET_INCIDENTS'; payload: Incident[] }
  | { type: 'ADD_INCIDENT'; payload: Incident }
  | { type: 'UPDATE_INCIDENT'; payload: { id: string; updates: Partial<Incident> } }
  | { type: 'SET_LOADING'; payload: { key: keyof AppState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof AppState['errors']; value: string | null } };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Convenience methods
  setCurrentSection: (section: AppSection) => void;
  setSelectedInvestigation: (id: string | null) => void;
  setSelectedAlert: (id: string | null) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  addInvestigation: (investigation: Investigation) => void;
  updateInvestigation: (id: string, updates: Partial<Investigation>) => void;
  updateIntegration: (name: string, updates: Partial<Integration>) => void;
  updateTeamMember: (name: string, updates: Partial<TeamMember>) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
}