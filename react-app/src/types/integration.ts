/**
 * Integration-related type definitions
 */

export type IntegrationStatus = 'Connected' | 'Degraded' | 'Disconnected';

export type IntegrationHealth = 'Healthy' | 'Warning' | 'Error';

export interface Integration {
  name: string;
  status: IntegrationStatus;
  lastSync: string;
  health: IntegrationHealth;
}

export interface IntegrationDetails extends Integration {
  description?: string;
  version?: string;
  endpoint?: string;
  apiKey?: string;
  configuration?: Record<string, any>;
  metrics?: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
}