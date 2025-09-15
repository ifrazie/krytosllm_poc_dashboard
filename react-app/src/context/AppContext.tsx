/**
 * App Context Provider
 * Provides global state management for the Prophet AI SOC Platform
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';
import type { AppState, AppContextType, AppSection } from '../types';
import { appReducer } from './AppReducer';
import { 
  mockAlerts, 
  mockInvestigations, 
  mockIntegrations, 
  mockSocTeam, 
  mockMetrics, 
  mockIncidents 
} from '../data';

// Initial state
const initialState: AppState = {
  // Data
  alerts: [],
  investigations: [],
  integrations: [],
  socTeam: [],
  metrics: {
    totalAlerts: 0,
    alertsTrend: "0%",
    activeInvestigations: 0,
    investigationsTrend: "0%",
    resolvedIncidents: 0,
    incidentsTrend: "0%",
    mttr: "0 min",
    mttrTrend: "0%",
    accuracy: "0%",
    accuracyTrend: "0%",
    falsePositives: "0%",
    falsePositivesTrend: "0%"
  },
  incidents: [],
  
  // UI State
  currentSection: 'dashboard',
  selectedInvestigation: null,
  selectedAlert: null,
  
  // Loading states
  loading: {
    alerts: true,
    investigations: true,
    integrations: true,
    metrics: true,
    incidents: true
  },
  
  // Error states
  errors: {
    alerts: null,
    investigations: null,
    integrations: null,
    metrics: null,
    incidents: null
  }
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ 
  children: React.ReactNode;
  initialState?: Partial<AppState>;
}> = ({ children, initialState: providedInitialState }) => {
  const [state, dispatch] = useReducer(appReducer, providedInitialState ? { ...initialState, ...providedInitialState } : initialState);

  // Initialize data on mount (skip if initial state is provided for testing)
  useEffect(() => {
    // Skip data loading if initial state is provided (for testing)
    if (providedInitialState) {
      return;
    }

    // Simulate loading delay for realistic experience
    const loadData = async () => {
      try {
        // Load alerts
        dispatch({ type: 'SET_LOADING', payload: { key: 'alerts', value: true } });
        await new Promise(resolve => setTimeout(resolve, 500));
        dispatch({ type: 'SET_ALERTS', payload: mockAlerts });

        // Load investigations
        dispatch({ type: 'SET_LOADING', payload: { key: 'investigations', value: true } });
        await new Promise(resolve => setTimeout(resolve, 300));
        dispatch({ type: 'SET_INVESTIGATIONS', payload: mockInvestigations });

        // Load integrations
        dispatch({ type: 'SET_LOADING', payload: { key: 'integrations', value: true } });
        await new Promise(resolve => setTimeout(resolve, 200));
        dispatch({ type: 'SET_INTEGRATIONS', payload: mockIntegrations });

        // Load SOC team
        dispatch({ type: 'SET_SOC_TEAM', payload: mockSocTeam });

        // Load metrics
        dispatch({ type: 'SET_LOADING', payload: { key: 'metrics', value: true } });
        await new Promise(resolve => setTimeout(resolve, 400));
        dispatch({ type: 'SET_METRICS', payload: mockMetrics });

        // Load incidents
        dispatch({ type: 'SET_LOADING', payload: { key: 'incidents', value: true } });
        await new Promise(resolve => setTimeout(resolve, 350));
        dispatch({ type: 'SET_INCIDENTS', payload: mockIncidents });

      } catch (error) {
        console.error('Error loading initial data:', error);
        // Set error states if needed
        dispatch({ type: 'SET_ERROR', payload: { key: 'alerts', value: 'Failed to load alerts' } });
      }
    };

    loadData();
  }, [providedInitialState]);

  // Convenience methods
  const setCurrentSection = useCallback((section: AppSection) => {
    dispatch({ type: 'SET_CURRENT_SECTION', payload: section });
  }, []);

  const setSelectedInvestigation = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_INVESTIGATION', payload: id });
  }, []);

  const setSelectedAlert = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_ALERT', payload: id });
  }, []);

  const addAlert = useCallback((alert: Parameters<AppContextType['addAlert']>[0]) => {
    dispatch({ type: 'ADD_ALERT', payload: alert });
  }, []);

  const updateAlert = useCallback((id: string, updates: Parameters<AppContextType['updateAlert']>[1]) => {
    dispatch({ type: 'UPDATE_ALERT', payload: { id, updates } });
  }, []);

  const addInvestigation = useCallback((investigation: Parameters<AppContextType['addInvestigation']>[0]) => {
    dispatch({ type: 'ADD_INVESTIGATION', payload: investigation });
  }, []);

  const updateInvestigation = useCallback((id: string, updates: Parameters<AppContextType['updateInvestigation']>[1]) => {
    dispatch({ type: 'UPDATE_INVESTIGATION', payload: { id, updates } });
  }, []);

  const updateIntegration = useCallback((name: string, updates: Parameters<AppContextType['updateIntegration']>[1]) => {
    dispatch({ type: 'UPDATE_INTEGRATION', payload: { name, updates } });
  }, []);

  const updateTeamMember = useCallback((name: string, updates: Parameters<AppContextType['updateTeamMember']>[1]) => {
    dispatch({ type: 'UPDATE_TEAM_MEMBER', payload: { name, updates } });
  }, []);

  const addIncident = useCallback((incident: Parameters<AppContextType['addIncident']>[0]) => {
    dispatch({ type: 'ADD_INCIDENT', payload: incident });
  }, []);

  const updateIncident = useCallback((id: string, updates: Parameters<AppContextType['updateIncident']>[1]) => {
    dispatch({ type: 'UPDATE_INCIDENT', payload: { id, updates } });
  }, []);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue: AppContextType = useMemo(() => ({
    state,
    dispatch,
    setCurrentSection,
    setSelectedInvestigation,
    setSelectedAlert,
    addAlert,
    updateAlert,
    addInvestigation,
    updateInvestigation,
    updateIntegration,
    updateTeamMember,
    addIncident,
    updateIncident
  }), [
    state,
    dispatch,
    setCurrentSection,
    setSelectedInvestigation,
    setSelectedAlert,
    addAlert,
    updateAlert,
    addInvestigation,
    updateInvestigation,
    updateIntegration,
    updateTeamMember,
    addIncident,
    updateIncident
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};