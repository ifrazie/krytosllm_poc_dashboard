/**
 * Custom hook for investigation management
 * Provides convenient methods for working with investigations
 */

import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Investigation, InvestigationStatus } from '../types';

export const useInvestigations = () => {
  const { 
    state, 
    addInvestigation, 
    updateInvestigation, 
    setSelectedInvestigation 
  } = useAppContext();

  // Memoized filtered investigations
  const investigationsByStatus = useMemo(() => {
    const investigations = state.investigations;
    return {
      new: investigations.filter(inv => inv.status === 'New'),
      inProgress: investigations.filter(inv => inv.status === 'In Progress'),
      completed: investigations.filter(inv => inv.status === 'Completed')
    };
  }, [state.investigations]);

  // Investigations by assignee
  const investigationsByAssignee = useMemo(() => {
    const investigations = state.investigations;
    const grouped: Record<string, Investigation[]> = {};
    
    investigations.forEach(investigation => {
      if (!grouped[investigation.assignedTo]) {
        grouped[investigation.assignedTo] = [];
      }
      grouped[investigation.assignedTo].push(investigation);
    });
    
    return grouped;
  }, [state.investigations]);

  // Active investigations (New or In Progress)
  const activeInvestigations = useMemo(() => {
    return state.investigations.filter(inv => 
      inv.status === 'New' || inv.status === 'In Progress'
    );
  }, [state.investigations]);

  // Get investigation by ID
  const getInvestigationById = useMemo(() => {
    return (id: string): Investigation | undefined => {
      return state.investigations.find(inv => inv.id === id);
    };
  }, [state.investigations]);

  // Get investigation by alert ID
  const getInvestigationByAlertId = useMemo(() => {
    return (alertId: string): Investigation | undefined => {
      return state.investigations.find(inv => inv.alertId === alertId);
    };
  }, [state.investigations]);

  // Filter investigations
  const filterInvestigations = useMemo(() => {
    return (filters: {
      status?: InvestigationStatus[];
      assignedTo?: string[];
      search?: string;
    }) => {
      return state.investigations.filter(investigation => {
        // Status filter
        if (filters.status && filters.status.length > 0) {
          if (!filters.status.includes(investigation.status)) return false;
        }

        // Assignee filter
        if (filters.assignedTo && filters.assignedTo.length > 0) {
          if (!filters.assignedTo.includes(investigation.assignedTo)) return false;
        }

        // Search filter
        if (filters.search && filters.search.trim()) {
          const searchTerm = filters.search.toLowerCase();
          const searchableText = `${investigation.id} ${investigation.assignedTo}`.toLowerCase();
          if (!searchableText.includes(searchTerm)) return false;
        }

        return true;
      });
    };
  }, [state.investigations]);

  // Investigation statistics
  const investigationStats = useMemo(() => {
    const total = state.investigations.length;
    const newCount = investigationsByStatus.new.length;
    const inProgress = investigationsByStatus.inProgress.length;
    const completed = investigationsByStatus.completed.length;
    const active = activeInvestigations.length;

    return {
      total,
      byStatus: { 
        new: newCount, 
        inProgress, 
        completed 
      },
      active,
      assignees: Object.keys(investigationsByAssignee).length
    };
  }, [investigationsByStatus, activeInvestigations, investigationsByAssignee]);

  // Selected investigation details
  const selectedInvestigation = useMemo(() => {
    if (!state.selectedInvestigation) return null;
    return getInvestigationById(state.selectedInvestigation);
  }, [state.selectedInvestigation, getInvestigationById]);

  return {
    // Data
    investigations: state.investigations,
    investigationsByStatus,
    investigationsByAssignee,
    activeInvestigations,
    investigationStats,
    selectedInvestigation,
    selectedInvestigationId: state.selectedInvestigation,
    
    // Loading and error states
    loading: state.loading.investigations,
    error: state.errors.investigations,
    
    // Methods
    addInvestigation,
    updateInvestigation,
    setSelectedInvestigation,
    filterInvestigations,
    getInvestigationById,
    getInvestigationByAlertId
  };
};