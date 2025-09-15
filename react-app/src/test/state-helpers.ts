/**
 * Test State Helpers
 * Helper functions for creating complete test states
 */

import type { AppState } from '../types/context';

// Default complete loading state
export const defaultLoadingState: AppState['loading'] = {
  alerts: false,
  investigations: false,
  integrations: false,
  metrics: false,
  incidents: false
};

// Default complete error state
export const defaultErrorState: AppState['errors'] = {
  alerts: null,
  investigations: null,
  integrations: null,
  metrics: null,
  incidents: null
};

// Helper to create complete test state
export const createTestState = (overrides: Partial<AppState> = {}): Partial<AppState> => {
  const baseState: Partial<AppState> = {
    loading: defaultLoadingState,
    errors: defaultErrorState,
    ...overrides
  };

  // Merge loading state if provided
  if (overrides.loading) {
    baseState.loading = {
      ...defaultLoadingState,
      ...overrides.loading
    };
  }

  // Merge error state if provided
  if (overrides.errors) {
    baseState.errors = {
      ...defaultErrorState,
      ...overrides.errors
    };
  }

  return baseState;
};

// Helper for loading states
export const createLoadingState = (loadingKeys: Partial<AppState['loading']> = {}): AppState['loading'] => ({
  ...defaultLoadingState,
  ...loadingKeys
});

// Helper for error states
export const createErrorState = (errorKeys: Partial<AppState['errors']> = {}): AppState['errors'] => ({
  ...defaultErrorState,
  ...errorKeys
});