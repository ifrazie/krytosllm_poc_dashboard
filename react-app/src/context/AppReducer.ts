/**
 * App State Reducer
 * Handles all state updates for the Prophet AI SOC Platform
 */

import type { AppState, AppAction } from '../types';

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_SECTION':
      return {
        ...state,
        currentSection: action.payload
      };

    case 'SET_SELECTED_INVESTIGATION':
      return {
        ...state,
        selectedInvestigation: action.payload
      };

    case 'SET_SELECTED_ALERT':
      return {
        ...state,
        selectedAlert: action.payload
      };

    case 'SET_ALERTS':
      return {
        ...state,
        alerts: action.payload,
        loading: { ...state.loading, alerts: false },
        errors: { ...state.errors, alerts: null }
      };

    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts]
      };

    case 'UPDATE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert.id === action.payload.id
            ? { ...alert, ...action.payload.updates }
            : alert
        )
      };

    case 'SET_INVESTIGATIONS':
      return {
        ...state,
        investigations: action.payload,
        loading: { ...state.loading, investigations: false },
        errors: { ...state.errors, investigations: null }
      };

    case 'ADD_INVESTIGATION':
      return {
        ...state,
        investigations: [action.payload, ...state.investigations]
      };

    case 'UPDATE_INVESTIGATION':
      return {
        ...state,
        investigations: state.investigations.map(investigation =>
          investigation.id === action.payload.id
            ? { ...investigation, ...action.payload.updates }
            : investigation
        )
      };

    case 'SET_INTEGRATIONS':
      return {
        ...state,
        integrations: action.payload,
        loading: { ...state.loading, integrations: false },
        errors: { ...state.errors, integrations: null }
      };

    case 'UPDATE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.map(integration =>
          integration.name === action.payload.name
            ? { ...integration, ...action.payload.updates }
            : integration
        )
      };

    case 'SET_SOC_TEAM':
      return {
        ...state,
        socTeam: action.payload
      };

    case 'UPDATE_TEAM_MEMBER':
      return {
        ...state,
        socTeam: state.socTeam.map(member =>
          member.name === action.payload.name
            ? { ...member, ...action.payload.updates }
            : member
        )
      };

    case 'SET_METRICS':
      return {
        ...state,
        metrics: action.payload,
        loading: { ...state.loading, metrics: false },
        errors: { ...state.errors, metrics: null }
      };

    case 'SET_INCIDENTS':
      return {
        ...state,
        incidents: action.payload,
        loading: { ...state.loading, incidents: false },
        errors: { ...state.errors, incidents: null }
      };

    case 'ADD_INCIDENT':
      return {
        ...state,
        incidents: [action.payload, ...state.incidents]
      };

    case 'UPDATE_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.map(incident =>
          incident.id === action.payload.id
            ? { ...incident, ...action.payload.updates }
            : incident
        )
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.value
        }
      };

    default:
      return state;
  }
};