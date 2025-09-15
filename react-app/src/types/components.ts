/**
 * Component-specific prop type definitions
 */

import type { ReactNode } from 'react';
import type { Alert, AlertFilters } from './alert';
import type { Investigation } from './investigation';
import type { Integration } from './integration';
import type { TeamMember } from './team';
import type { Metrics } from './metrics';
import type { Incident } from './incident';
import type { HuntResult, HuntExecution } from './hunting';
import type { AppSection } from './context';

// Layout component props
export interface HeaderProps {
  activeAlerts: number;
  currentTime: string;
  userProfile?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export interface SidebarProps {
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export interface MainContentProps {
  activeSection: AppSection;
  children: ReactNode;
}

// Dashboard component props
export interface DashboardProps {
  metrics: Metrics;
  alerts: Alert[];
  socTeam: TeamMember[];
  integrations: Integration[];
}

export interface MetricsGridProps {
  metrics: Metrics;
  loading?: boolean;
}

export interface AlertFeedProps {
  alerts: Alert[];
  maxItems?: number;
  onAlertClick?: (alert: Alert) => void;
}

export interface TeamStatusProps {
  socTeam: TeamMember[];
  onMemberClick?: (member: TeamMember) => void;
}

// Alert management component props
export interface AlertManagementProps {
  alerts: Alert[];
  onAlertSelect?: (alert: Alert) => void;
  onAlertUpdate?: (id: string, updates: Partial<Alert>) => void;
}

export interface AlertFiltersProps {
  filters: AlertFilters;
  onFiltersChange: (filters: AlertFilters) => void;
  onReset: () => void;
}

export interface AlertTableProps {
  alerts: Alert[];
  selectedAlerts?: string[];
  onAlertSelect?: (alertId: string, selected: boolean) => void;
  onAlertClick?: (alert: Alert) => void;
  onBulkAction?: (action: string, alertIds: string[]) => void;
  loading?: boolean;
}

export interface AlertModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: string, alert: Alert) => void;
}

// Investigation component props
export interface InvestigationsProps {
  investigations: Investigation[];
  selectedInvestigation?: string | null;
  onInvestigationSelect?: (id: string) => void;
}

export interface InvestigationListProps {
  investigations: Investigation[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

export interface InvestigationDetailsProps {
  investigation: Investigation | null;
  onUpdate?: (id: string, updates: Partial<Investigation>) => void;
}

// Threat hunting component props
export interface ThreatHuntingProps {
  onExecuteHunt?: (query: string) => void;
  huntResults?: HuntResult[];
  isExecuting?: boolean;
}

export interface QueryBuilderProps {
  onExecute: (query: string) => void;
  isExecuting?: boolean;
  examples?: Array<{
    title: string;
    query: string;
    description: string;
  }>;
}

export interface HuntResultsProps {
  results: HuntResult[];
  execution?: HuntExecution;
  loading?: boolean;
  error?: string;
}

// Incident component props
export interface IncidentsProps {
  incidents: Incident[];
  onIncidentUpdate?: (id: string, updates: Partial<Incident>) => void;
}

export interface IncidentBoardProps {
  incidents: Incident[];
  onStatusChange?: (incidentId: string, newStatus: Incident['status']) => void;
  onIncidentClick?: (incident: Incident) => void;
}

export interface IncidentCardProps {
  incident: Incident;
  onClick?: (incident: Incident) => void;
  draggable?: boolean;
}

// Analytics component props
export interface AnalyticsProps {
  metrics: Metrics;
  chartData?: {
    alertTrends: any;
    responseTimes: any;
    threatCategories: any;
  };
}

export interface ChartCardProps {
  title: string;
  children: ReactNode;
  loading?: boolean;
  error?: string;
  className?: string;
}

export interface PerformanceMetricsProps {
  accuracy: number;
  falsePositiveRate: number;
  coverage: number;
  loading?: boolean;
}

// Integration component props
export interface IntegrationsProps {
  integrations: Integration[];
  onRefresh?: () => void;
  onIntegrationClick?: (integration: Integration) => void;
}

export interface IntegrationCardProps {
  integration: Integration;
  onClick?: (integration: Integration) => void;
  showDetails?: boolean;
}

// Shared component props
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export interface NotificationContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
}