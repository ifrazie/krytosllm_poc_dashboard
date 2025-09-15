/**
 * Alert-related type definitions
 */

export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type AlertStatus = 
  | 'Active Threat' 
  | 'Under Investigation' 
  | 'Auto-Contained' 
  | 'Resolved' 
  | 'New' 
  | 'Investigating';

export interface Alert {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  source: string;
  timestamp: string;
  description: string;
  aiAnalysis: string;
  riskScore: number;
  artifacts: string[];
  recommendedActions: string[];
}

export interface AlertFilters {
  severity?: AlertSeverity;
  status?: AlertStatus;
  search?: string;
  source?: string;
}

export interface AlertTableColumn {
  key: keyof Alert | 'actions' | 'select';
  label: string;
  sortable?: boolean;
  width?: string;
}