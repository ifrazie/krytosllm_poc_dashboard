/**
 * API and data fetching-related type definitions
 */

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: SortOptions;
  filters?: FilterOptions;
  search?: string;
}

export interface MockDataConfig {
  enableRealTimeUpdates: boolean;
  updateInterval: number;
  simulateErrors: boolean;
  errorRate: number;
}

export interface DataSource {
  name: string;
  type: 'mock' | 'api' | 'websocket';
  config: Record<string, any>;
  enabled: boolean;
}