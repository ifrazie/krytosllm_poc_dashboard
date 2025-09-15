/**
 * Test Runner Utilities
 * 
 * Helper functions and utilities for running different types of tests
 */

import { vi } from 'vitest'
import { testConfig } from './test.config'

// Test execution utilities
export const TestRunner = {
  // Run tests by category
  runByCategory: (category: keyof typeof testConfig.categories) => {
    const command = `vitest --grep "${testConfig.categories[category]}"`
    console.log(`Running ${category} tests: ${command}`)
    return command
  },

  // Run tests by tag
  runByTag: (tag: keyof typeof testConfig.tags) => {
    const command = `vitest --grep "@${testConfig.tags[tag]}"`
    console.log(`Running tests tagged with ${tag}: ${command}`)
    return command
  },

  // Run tests for specific component
  runForComponent: (componentName: string) => {
    const command = `vitest --grep "${componentName}"`
    console.log(`Running tests for ${componentName}: ${command}`)
    return command
  },

  // Run tests with coverage
  runWithCoverage: (threshold?: number) => {
    const thresholdFlag = threshold ? `--coverage.thresholds.global.lines=${threshold}` : ''
    const command = `vitest run --coverage ${thresholdFlag}`
    console.log(`Running tests with coverage: ${command}`)
    return command
  },

  // Run tests in watch mode
  runInWatchMode: (pattern?: string) => {
    const patternFlag = pattern ? `--grep "${pattern}"` : ''
    const command = `vitest ${patternFlag}`
    console.log(`Running tests in watch mode: ${command}`)
    return command
  },

  // Run tests with UI
  runWithUI: () => {
    const command = 'vitest --ui'
    console.log(`Running tests with UI: ${command}`)
    return command
  },

  // Run performance tests
  runPerformanceTests: () => {
    const command = `vitest --grep "@${testConfig.tags.performance}"`
    console.log(`Running performance tests: ${command}`)
    return command
  },

  // Run accessibility tests
  runAccessibilityTests: () => {
    const command = `vitest --grep "@${testConfig.tags.accessibility}"`
    console.log(`Running accessibility tests: ${command}`)
    return command
  },

  // Run smoke tests
  runSmokeTests: () => {
    const command = `vitest --grep "@${testConfig.tags.smoke}"`
    console.log(`Running smoke tests: ${command}`)
    return command
  },

  // Run critical tests
  runCriticalTests: () => {
    const command = `vitest --grep "@${testConfig.tags.critical}"`
    console.log(`Running critical tests: ${command}`)
    return command
  },
}

// Test validation utilities
export const TestValidator = {
  // Validate test file structure
  validateTestFile: (filePath: string): boolean => {
    const validExtensions = ['.test.ts', '.test.tsx', '.spec.ts', '.spec.tsx']
    return validExtensions.some(ext => filePath.endsWith(ext))
  },

  // Validate test naming convention
  validateTestName: (testName: string): boolean => {
    // Test names should start with 'should' or be descriptive
    const validPatterns = [
      /^should\s+/i,
      /^renders?\s+/i,
      /^handles?\s+/i,
      /^displays?\s+/i,
      /^updates?\s+/i,
    ]
    return validPatterns.some(pattern => pattern.test(testName))
  },

  // Validate test structure
  validateTestStructure: (testContent: string): boolean => {
    // Check for required test structure elements
    const requiredElements = [
      'describe(',
      'it(',
      'expect(',
    ]
    return requiredElements.every(element => testContent.includes(element))
  },

  // Validate test coverage
  validateCoverage: (coverage: number, threshold: number = 80): boolean => {
    return coverage >= threshold
  },
}

// Test reporting utilities
export const TestReporter = {
  // Generate test summary
  generateSummary: (results: any) => {
    return {
      total: results.numTotalTests,
      passed: results.numPassedTests,
      failed: results.numFailedTests,
      skipped: results.numPendingTests,
      coverage: results.coverageMap ? results.coverageMap.getCoverageSummary() : null,
    }
  },

  // Format test results
  formatResults: (results: any) => {
    const summary = TestReporter.generateSummary(results)
    return `
Test Results Summary:
- Total Tests: ${summary.total}
- Passed: ${summary.passed}
- Failed: ${summary.failed}
- Skipped: ${summary.skipped}
- Success Rate: ${((summary.passed / summary.total) * 100).toFixed(2)}%
${summary.coverage ? `- Coverage: ${summary.coverage.lines.pct}%` : ''}
    `.trim()
  },

  // Export results to JSON
  exportToJSON: (results: any, filePath: string) => {
    const summary = TestReporter.generateSummary(results)
    const jsonData = {
      timestamp: new Date().toISOString(),
      summary,
      details: results,
    }
    // In a real implementation, this would write to file
    console.log(`Exporting test results to ${filePath}:`, jsonData)
    return jsonData
  },
}

// Test debugging utilities
export const TestDebugger = {
  // Enable debug mode
  enableDebugMode: () => {
    process.env.DEBUG = 'true'
    process.env.VITEST_LOG_LEVEL = 'verbose'
    console.log('Debug mode enabled')
  },

  // Disable debug mode
  disableDebugMode: () => {
    delete process.env.DEBUG
    delete process.env.VITEST_LOG_LEVEL
    console.log('Debug mode disabled')
  },

  // Log test execution details
  logTestExecution: (testName: string, duration: number, status: 'pass' | 'fail') => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${testName}: ${status} (${duration}ms)`)
  },

  // Log component render details
  logComponentRender: (componentName: string, props: any) => {
    console.log(`Rendering ${componentName} with props:`, props)
  },

  // Log state changes
  logStateChange: (stateName: string, oldValue: any, newValue: any) => {
    console.log(`State change - ${stateName}:`, { from: oldValue, to: newValue })
  },
}

// Test environment utilities
export const TestEnvironment = {
  // Setup test environment
  setup: () => {
    // Set test environment variables
    process.env.NODE_ENV = 'test'
    process.env.REACT_APP_ENV = 'test'
    
    // Configure test timeouts (handled by vitest config)
    
    console.log('Test environment setup complete')
  },

  // Cleanup test environment
  cleanup: () => {
    // Clean up any global state
    // Reset mocks
    vi.clearAllMocks()
    
    console.log('Test environment cleanup complete')
  },

  // Mock external dependencies
  mockExternalDependencies: () => {
    // Mock Chart.js (already done in setup.ts)
    // Mock other external libraries as needed
    console.log('External dependencies mocked')
  },
}

// Export all utilities
export default {
  runner: TestRunner,
  validator: TestValidator,
  reporter: TestReporter,
  debugger: TestDebugger,
  environment: TestEnvironment,
}