/**
 * Coverage Configuration
 * 
 * Configuration for test coverage reporting and thresholds
 */

export const coverageConfig = {
  // Coverage thresholds
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    // Component-specific thresholds
    components: {
      'src/components/common/': {
        branches: 85,
        functions: 85,
        lines: 85,
        statements: 85
      },
      'src/hooks/': {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90
      }
    }
  },

  // Files to exclude from coverage
  exclude: [
    'src/test/**/*',
    'src/**/*.test.{ts,tsx}',
    'src/**/*.spec.{ts,tsx}',
    'src/**/*.d.ts',
    'src/types/**/*',
    'src/data/mockData.ts',
    'src/data/dataManager.test.ts'
  ],

  // Coverage reporters
  reporters: [
    'text',
    'text-summary',
    'html',
    'json',
    'lcov'
  ],

  // Output directory for coverage reports
  reportsDirectory: 'coverage'
}

// Test categories for organization
export const testCategories = {
  unit: 'Unit Tests',
  integration: 'Integration Tests',
  component: 'Component Tests',
  hook: 'Hook Tests',
  context: 'Context Tests',
  utility: 'Utility Tests'
}

// Test tags for filtering
export const testTags = {
  smoke: 'smoke',
  regression: 'regression',
  critical: 'critical',
  performance: 'performance',
  accessibility: 'a11y'
}