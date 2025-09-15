/**
 * Investigation-related type definitions
 */

export type InvestigationStatus = 'New' | 'In Progress' | 'Completed';

export interface TimelineEvent {
  time: string;
  event: string;
}

export interface Investigation {
  id: string;
  alertId: string;
  status: InvestigationStatus;
  assignedTo: string;
  timeline: TimelineEvent[];
  evidence: string[];
}

export interface InvestigationDetails extends Investigation {
  createdAt?: string;
  updatedAt?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  notes?: string[];
}