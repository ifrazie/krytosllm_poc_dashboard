/**
 * AlertTable Types
 * Type definitions for better type safety
 */

import type { Alert } from '../../types/alert';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'active threat' | 'under investigation' | 'auto-contained' | 'resolved' | 'new' | 'investigating';
export type RiskScoreLevel = 'risk-critical' | 'risk-high' | 'risk-medium' | 'risk-low';

export interface AlertTableColumn {
  key: keyof Alert;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface AlertTableState {
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  selectedAlerts: string[];
}