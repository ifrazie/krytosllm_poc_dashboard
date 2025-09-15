/**
 * Main TypeScript type definitions export
 * 
 * This file exports all type definitions used throughout the Prophet AI SOC Platform.
 * Types are organized by domain for better maintainability.
 */

// Core data model types
export * from './alert';
export * from './investigation';
export * from './integration';
export * from './team';
export * from './metrics';
export * from './incident';
export * from './hunting';

// UI component types
export * from './ui';
export * from './chart';
export * from './form';
export * from './components';

// Application state and context types
export * from './context';

// API and data handling types
export * from './api';

// Utility types
export * from './utils';

// Hook types
export * from './hooks';

// Utility types for common patterns
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = string;
export type Timestamp = string;

// Generic utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type KeyOf<T> = keyof T;
export type ValueOf<T> = T[keyof T];

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Component prop types with common patterns
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface WithLoading {
  loading?: boolean;
}

export interface WithError {
  error?: string | null;
}

export interface WithId {
  id: string;
}

// Common state patterns
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// Theme and styling types
export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}