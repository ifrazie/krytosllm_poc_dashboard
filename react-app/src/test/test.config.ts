/**
 * Comprehensive Test Configuration
 * 
 * Central configuration for all testing-related settings, utilities, and constants
 */

import { coverageConfig, testCategories, testTags } from './coverage.config'

// Test environment configuration
export const testConfig = {
  // Test execution settings
  execution: {
    timeout: 10000, // 10 seconds default timeout
    retries: 2, // Retry failed tests twice
    parallel: true, // Run tests in parallel
    bail: false, // Don't stop on first failure
  },

  // Test data configuration
  data: {
    mockDataRefreshInterval: 1000, // 1 second for real-time simulation
    chartAnimationDuration: 0, // Disable animations in tests
    modalTransitionDuration: 0, // Disable modal transitions
  },

  // Component testing configuration
  components: {
    // Default props for common components
    defaultProps: {
      button: {
        variant: 'primary' as const,
        size: 'md' as const,
        disabled: false,
      },
      modal: {
        isOpen: false,
        title: 'Test Modal',
      },
      table: {
        sortable: true,
        filterable: true,
        selectable: false,
      },
    },
    
    // Test IDs for consistent element selection
    testIds: {
      // Common components
      button: 'button',
      modal: 'modal',
      modalOverlay: 'modal-overlay',
      modalClose: 'modal-close',
      table: 'table',
      tableRow: 'table-row',
      tableCell: 'table-cell',
      
      // Navigation
      header: 'header',
      sidebar: 'sidebar',
      navItem: 'nav-item',
      
      // Dashboard
      metricsGrid: 'metrics-grid',
      metricCard: 'metric-card',
      alertFeed: 'alert-feed',
      teamStatus: 'team-status',
      
      // Alerts
      alertTable: 'alert-table',
      alertRow: 'alert-row',
      alertModal: 'alert-modal',
      alertFilters: 'alert-filters',
      
      // Charts
      doughnutChart: 'doughnut-chart',
      lineChart: 'line-chart',
      barChart: 'bar-chart',
      pieChart: 'pie-chart',
      
      // Forms
      searchInput: 'search-input',
      filterSelect: 'filter-select',
      submitButton: 'submit-button',
      resetButton: 'reset-button',
    },
  },

  // Hook testing configuration
  hooks: {
    // Default options for hook testing
    defaultOptions: {
      wrapper: true, // Use context wrapper by default
      initialProps: {}, // Default initial props
    },
    
    // Real-time hook testing
    realTime: {
      updateInterval: 100, // Fast updates for testing
      maxUpdates: 10, // Limit updates in tests
    },
  },

  // Integration testing configuration
  integration: {
    // API mocking configuration
    api: {
      baseUrl: 'http://localhost:3000',
      timeout: 5000,
      retries: 1,
    },
    
    // Data flow testing
    dataFlow: {
      stateUpdateDelay: 50, // Delay for state updates
      effectCleanupDelay: 100, // Delay for effect cleanup
    },
  },

  // Performance testing configuration
  performance: {
    // Render performance thresholds
    renderTime: {
      fast: 16, // 16ms (60fps)
      acceptable: 33, // 33ms (30fps)
      slow: 100, // 100ms threshold
    },
    
    // Memory usage thresholds
    memory: {
      componentSize: 1024, // 1KB per component
      hookSize: 512, // 512B per hook
      contextSize: 2048, // 2KB per context
    },
  },

  // Accessibility testing configuration
  accessibility: {
    // axe-core configuration
    axe: {
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
        'aria-labels': { enabled: true },
      },
    },
    
    // Keyboard navigation testing
    keyboard: {
      tabOrder: true,
      escapeKey: true,
      enterKey: true,
      arrowKeys: true,
    },
  },

  // Visual testing configuration
  visual: {
    // Screenshot comparison
    screenshots: {
      threshold: 0.1, // 10% difference threshold
      updateSnapshots: false, // Don't auto-update snapshots
    },
    
    // Responsive testing breakpoints
    breakpoints: {
      mobile: 320,
      tablet: 768,
      desktop: 1024,
      wide: 1440,
    },
  },

  // Error testing configuration
  errors: {
    // Error boundary testing
    boundaries: {
      componentError: true,
      asyncError: true,
      renderError: true,
    },
    
    // Error simulation
    simulation: {
      networkError: true,
      dataError: true,
      renderError: true,
    },
  },

  // Coverage configuration (imported from coverage.config.ts)
  coverage: coverageConfig,
  
  // Test categorization
  categories: testCategories,
  
  // Test tagging
  tags: testTags,
}

// Test utilities configuration
export const testUtilsConfig = {
  // User event configuration
  userEvent: {
    delay: 0, // No delay for faster tests
    skipHover: true, // Skip hover events
    pointerEventsCheck: 0, // Disable pointer events check
  },
  
  // Render configuration
  render: {
    // Default render options
    defaultOptions: {
      legacyRoot: false, // Use React 18 concurrent features
    },
    
    // Provider configuration
    providers: {
      app: true, // Include AppProvider
      notification: true, // Include NotificationProvider
      theme: false, // Don't include theme provider (not implemented)
    },
  },
  
  // Query configuration
  queries: {
    // Default query options
    defaultOptions: {
      timeout: 1000, // 1 second timeout for queries
      interval: 50, // 50ms polling interval
    },
    
    // Custom query priorities
    priorities: [
      'ByRole',
      'ByLabelText',
      'ByPlaceholderText',
      'ByText',
      'ByDisplayValue',
      'ByAltText',
      'ByTitle',
      'ByTestId',
    ],
  },
}

// Test data configuration
export const testDataConfig = {
  // Mock data settings
  mockData: {
    // Alert data
    alerts: {
      count: 10, // Default number of mock alerts
      severities: ['Critical', 'High', 'Medium', 'Low'],
      statuses: ['Active Threat', 'Under Investigation', 'Auto-Contained', 'Resolved'],
    },
    
    // Investigation data
    investigations: {
      count: 5, // Default number of mock investigations
      statuses: ['New', 'In Progress', 'Completed'],
    },
    
    // Integration data
    integrations: {
      count: 8, // Default number of mock integrations
      statuses: ['Connected', 'Degraded', 'Disconnected'],
      healthStates: ['Healthy', 'Warning', 'Error'],
    },
    
    // Team data
    team: {
      count: 6, // Default number of team members
      statuses: ['Online', 'Away', 'Offline'],
      roles: ['Senior SOC Analyst', 'SOC Analyst', 'Threat Hunter', 'Incident Responder'],
    },
  },
  
  // Data generation settings
  generation: {
    // Random data generation
    random: {
      seed: 12345, // Fixed seed for reproducible tests
      dateRange: 30, // 30 days for date generation
      textLength: 100, // Default text length
    },
    
    // Realistic data patterns
    patterns: {
      ipAddresses: true, // Generate realistic IP addresses
      timestamps: true, // Generate realistic timestamps
      usernames: true, // Generate realistic usernames
      domains: true, // Generate realistic domain names
    },
  },
}

// Export all configurations
export default {
  test: testConfig,
  utils: testUtilsConfig,
  data: testDataConfig,
}

// Type definitions for configuration
export type TestConfig = typeof testConfig
export type TestUtilsConfig = typeof testUtilsConfig
export type TestDataConfig = typeof testDataConfig