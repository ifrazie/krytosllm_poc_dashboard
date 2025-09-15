/**
 * Custom hook-related type definitions
 */

import type { Alert, AlertFilters } from './alert';
import type { Investigation } from './investigation';
import type { Integration } from './integration';
import type { Metrics } from './metrics';
import type { HuntResult, HuntExecution } from './hunting';
import type { FormState, FormHandlers } from './form';
import type { AsyncState } from './index';

// useAlerts hook types
export interface UseAlertsReturn {
  alerts: Alert[];
  filteredAlerts: Alert[];
  filters: AlertFilters;
  setFilters: (filters: AlertFilters) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  deleteAlert: (id: string) => void;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseAlertsOptions {
  initialFilters?: AlertFilters;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// useInvestigations hook types
export interface UseInvestigationsReturn {
  investigations: Investigation[];
  selectedInvestigation: Investigation | null;
  selectInvestigation: (id: string | null) => void;
  addInvestigation: (investigation: Investigation) => void;
  updateInvestigation: (id: string, updates: Partial<Investigation>) => void;
  loading: boolean;
  error: string | null;
}

// useIntegrations hook types
export interface UseIntegrationsReturn {
  integrations: Integration[];
  updateIntegration: (name: string, updates: Partial<Integration>) => void;
  refreshIntegration: (name: string) => Promise<void>;
  refreshAll: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

// useMetrics hook types
export interface UseMetricsReturn {
  metrics: Metrics;
  updateMetrics: (updates: Partial<Metrics>) => void;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// useRealTime hook types
export interface UseRealTimeOptions {
  enabled?: boolean;
  interval?: number;
  onUpdate?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface UseRealTimeReturn {
  isConnected: boolean;
  lastUpdate: string | null;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
}

// useThreatHunting hook types
export interface UseThreatHuntingReturn {
  executeHunt: (query: string) => Promise<void>;
  results: HuntResult[];
  execution: HuntExecution | null;
  isExecuting: boolean;
  error: string | null;
  clearResults: () => void;
  history: HuntExecution[];
}

// useForm hook types
export interface UseFormReturn<T = any> extends FormState<T>, FormHandlers<T> {
  isDirty: boolean;
  isSubmitted: boolean;
}

// useLocalStorage hook types
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

// useDebounce hook types
export interface UseDebounceOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}

// useAsync hook types
export interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

// useWebSocket hook types
export interface UseWebSocketOptions {
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface UseWebSocketReturn {
  socket: WebSocket | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastMessage: MessageEvent | null;
  sendMessage: (message: string | object) => void;
  connect: () => void;
  disconnect: () => void;
}

// useNotifications hook types
export interface UseNotificationsReturn {
  notifications: Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
  }>;
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// useTheme hook types
export interface UseThemeReturn {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// usePagination hook types
export interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  startIndex: number;
  endIndex: number;
}

// useSort hook types
export interface UseSortReturn<T> {
  sortedData: T[];
  sortConfig: { key: keyof T; direction: 'asc' | 'desc' } | null;
  requestSort: (key: keyof T) => void;
  clearSort: () => void;
}

// useFilter hook types
export interface UseFilterReturn<T> {
  filteredData: T[];
  filters: Record<string, any>;
  setFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}