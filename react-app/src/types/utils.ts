/**
 * Utility types for common patterns throughout the application
 */

// Date and time utilities
export type DateString = string; // ISO 8601 date string
export type TimeString = string; // Time in HH:MM format
export type DurationString = string; // Duration like "5 min", "2 hours"

// Status and state types
export type Status = 'idle' | 'loading' | 'success' | 'error';
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

// Sorting and filtering utilities
export type SortDirection = 'asc' | 'desc';
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';

export interface SortConfig<T = any> {
  key: keyof T;
  direction: SortDirection;
}

export interface FilterConfig<T = any> {
  key: keyof T;
  operator: FilterOperator;
  value: any;
}

// Generic CRUD operations
export interface CrudOperations<T> {
  create: (item: Omit<T, 'id'>) => Promise<T>;
  read: (id: string) => Promise<T>;
  update: (id: string, updates: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
  list: (options?: QueryOptions) => Promise<T[]>;
}

// Real-time update types
export interface RealTimeUpdate<T = any> {
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: T;
  timestamp: string;
}

export interface RealTimeSubscription {
  id: string;
  entity: string;
  callback: (update: RealTimeUpdate) => void;
  active: boolean;
}

// Configuration types
export interface AppConfig {
  apiBaseUrl: string;
  wsUrl: string;
  enableRealTime: boolean;
  refreshInterval: number;
  theme: 'light' | 'dark';
  features: {
    [key: string]: boolean;
  };
}

// Error handling types
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Performance monitoring types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface ComponentPerformance {
  componentName: string;
  renderTime: number;
  updateCount: number;
  lastUpdate: string;
}

// Accessibility types
export interface A11yProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  role?: string;
  tabIndex?: number;
}

// Import from other files for re-export
import type { QueryOptions } from './api';