/**
 * Incident-related type definitions
 */

export type IncidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  relatedAlerts?: string[];
}

export interface IncidentDetails extends Incident {
  timeline: Array<{
    timestamp: string;
    action: string;
    user: string;
    details?: string;
  }>;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  tags?: string[];
  impact?: string;
  resolution?: string;
}