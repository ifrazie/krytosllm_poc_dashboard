/**
 * Threat hunting-related type definitions
 */

export interface HuntQuery {
  id: string;
  query: string;
  description?: string;
  createdAt: string;
  createdBy: string;
}

export interface HuntResult {
  id: string;
  title: string;
  description: string;
  confidence: number;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
  artifacts?: string[];
  details?: Record<string, any>;
}

export interface HuntExecution {
  id: string;
  queryId: string;
  query: string;
  status: 'Running' | 'Completed' | 'Failed';
  startTime: string;
  endTime?: string;
  executionTime?: number;
  results: HuntResult[];
  error?: string;
}

export interface QueryExample {
  title: string;
  query: string;
  description: string;
  category: string;
}