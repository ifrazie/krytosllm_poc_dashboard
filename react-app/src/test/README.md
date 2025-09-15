# Testing Framework Documentation

## Overview

This document describes the testing framework setup for the Prophet AI SOC Analyst Platform React application. The testing framework is built on Vitest with React Testing Library and provides comprehensive testing capabilities for components, hooks, and application logic.

## Framework Components

### Core Testing Stack

- **Vitest**: Fast unit test framework with native ES modules support
- **React Testing Library**: Testing utilities focused on user interactions
- **@testing-library/jest-dom**: Custom Jest matchers for DOM assertions
- **@testing-library/user-event**: Advanced user interaction simulation
- **jsdom**: DOM environment for testing React components
- **@vitest/coverage-v8**: Code coverage reporting with V8 provider

### Configuration Files

- `vitest.config.ts`: Main Vitest configuration with React plugin
- `src/test/setup.ts`: Test environment setup and global mocks
- `src/test/coverage.config.ts`: Coverage thresholds and reporting configuration

## Test Organization

### Directory Structure

```
src/test/
├── README.md                 # This documentation
├── setup.ts                  # Test environment setup
├── setup.test.ts            # Setup verification tests
├── test-utils.tsx           # Custom render functions and utilities
├── test-helpers.ts          # Test helper functions and utilities
├── test-helpers.test.tsx    # Tests for test helpers
├── mock-data.ts             # Mock data for testing
└── coverage.config.ts       # Coverage configuration
```

### Test File Naming

- Unit tests: `*.test.ts` or `*.test.tsx`
- Spec tests: `*.spec.ts` or `*.spec.tsx`
- Test files should be co-located with the components they test

## Available Test Utilities

### Custom Render Function

```typescript
import { render } from '../test/test-utils'

// Renders component with all necessary providers
render(<MyComponent />)
```

### Test Helpers

The `TestHelpers` object provides utilities for common testing operations:

```typescript
import { TestHelpers } from '../test/test-helpers'

// Element interactions
await TestHelpers.clickElement('button-test-id')
await TestHelpers.typeIntoInput('input-test-id', 'text')
await TestHelpers.selectOption('select-test-id', 'option-value')

// Waiting for elements
await TestHelpers.waitForElement('element-test-id')
await TestHelpers.waitForElementToDisappear('element-test-id')

// Keyboard interactions
await TestHelpers.pressEscape()
await TestHelpers.pressEnter()
```

### Chart Testing Utilities

```typescript
import { ChartTestUtils } from '../test/test-helpers'

// Verify chart rendering and data
ChartTestUtils.expectChartToBeRendered('chart-test-id')
ChartTestUtils.expectChartToHaveData('chart-test-id', expectedData)
```

### Modal Testing Utilities

```typescript
import { ModalTestUtils } from '../test/test-helpers'

// Modal interactions
await ModalTestUtils.waitForModalToOpen()
await ModalTestUtils.closeModalByEscape()
```

### Table Testing Utilities

```typescript
import { TableTestUtils } from '../test/test-helpers'

// Table interactions
await TableTestUtils.clickTableRow('table-test-id', 0)
const cellValue = TableTestUtils.getTableCellValue('table-test-id', 0, 1)
```

## Mock Data

Comprehensive mock data is available for testing:

```typescript
import { 
  mockAlerts, 
  mockInvestigations, 
  mockIntegrations,
  mockTeamMembers,
  mockMetrics,
  mockAppState 
} from '../test/mock-data'
```

### Creating Test Data

```typescript
import { createMockAlert, createMockInvestigation } from '../test/mock-data'

const testAlert = createMockAlert({ severity: 'Critical' })
const testInvestigation = createMockInvestigation({ status: 'In Progress' })
```

## Global Mocks

### Chart.js Mocking

Chart.js is automatically mocked to prevent canvas-related issues in tests:

```typescript
// Charts render as div elements with data attributes
<div data-testid="doughnut-chart" data-chart-data="..." />
```

### Window.matchMedia

Media queries are mocked for responsive design testing:

```typescript
// Automatically available in all tests
window.matchMedia('(max-width: 768px)')
```

## Running Tests

### Available Scripts

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Filtering

```bash
# Run specific test file
npm test -- AlertManagement.test.tsx

# Run tests matching pattern
npm test -- --grep "should render"

# Run tests in specific directory
npm test -- src/components/alerts/
```

## Coverage Configuration

### Coverage Thresholds

- **Global**: 80% for branches, functions, lines, and statements
- **Components**: 85% for common components
- **Hooks**: 90% for custom hooks

### Coverage Reports

Coverage reports are generated in multiple formats:
- Text summary in terminal
- HTML report in `coverage/` directory
- JSON report for CI/CD integration
- LCOV format for external tools

## Best Practices

### Test Structure

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
  })

  describe('Rendering', () => {
    it('should render with default props', () => {
      // Test implementation
    })
  })

  describe('User Interactions', () => {
    it('should handle click events', async () => {
      // Test implementation
    })
  })

  describe('State Management', () => {
    it('should update state correctly', () => {
      // Test implementation
    })
  })
})
```

### Accessibility Testing

```typescript
import { render, screen } from '../test/test-utils'

it('should be accessible', () => {
  render(<MyComponent />)
  
  // Check for proper ARIA labels
  expect(screen.getByRole('button')).toHaveAttribute('aria-label')
  
  // Check for keyboard navigation
  expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '0')
})
```

### Async Testing

```typescript
import { waitFor } from '@testing-library/react'

it('should handle async operations', async () => {
  render(<AsyncComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Loaded data')).toBeInTheDocument()
  })
})
```

## Integration with CI/CD

The testing framework is configured for continuous integration:

- Tests run on every commit
- Coverage reports are generated
- Failed tests block deployment
- Coverage thresholds must be maintained

## Troubleshooting

### Common Issues

1. **Canvas errors**: Chart.js is mocked to prevent canvas issues
2. **Async timing**: Use `waitFor` for async operations
3. **Context providers**: Use custom render function for components requiring context
4. **Mock data**: Use provided mock data factories for consistent test data

### Debug Mode

```bash
# Run tests with debug output
npm test -- --reporter=verbose

# Run single test with debugging
npm test -- --grep "specific test" --reporter=verbose
```

## Future Enhancements

- Visual regression testing with Chromatic
- End-to-end testing with Playwright
- Performance testing with React DevTools Profiler
- Accessibility testing with axe-core