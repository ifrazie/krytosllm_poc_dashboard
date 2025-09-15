/**
 * Testing Framework Validation
 * 
 * Comprehensive tests to validate that the testing framework is properly configured
 * and all components are working as expected.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

// Import test utilities
import { TestHelpers, ChartTestUtils, createTestAppState } from './test-helpers'
import { testConfig, testUtilsConfig, testDataConfig } from './test.config'
import { mockAlerts, mockInvestigations, createMockAlert } from './mock-data'

// Test component for validation
const ValidationTestComponent = () => {
  const [count, setCount] = React.useState(0)
  const [text, setText] = React.useState('')
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div data-testid="validation-component">
      <h1>Testing Framework Validation</h1>
      
      {/* Button testing */}
      <button 
        data-testid="increment-button"
        onClick={() => setCount(count + 1)}
        aria-label="Increment counter"
      >
        Count: {count}
      </button>
      
      {/* Input testing */}
      <input
        data-testid="text-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
        aria-label="Text input"
      />
      <div data-testid="text-display">{text}</div>
      
      {/* Conditional rendering testing */}
      <button
        data-testid="toggle-button"
        onClick={() => setIsVisible(!isVisible)}
      >
        Toggle Visibility
      </button>
      {isVisible && (
        <div data-testid="conditional-element">
          This element is conditionally rendered
        </div>
      )}
      
      {/* Chart mock testing */}
      <div 
        data-testid="mock-chart"
        data-chart-data={JSON.stringify({ labels: ['A', 'B'], datasets: [] })}
        data-chart-options={JSON.stringify({ responsive: true })}
      >
        Mock Chart Component
      </div>
      
      {/* Accessibility testing */}
      <div role="region" aria-label="Test region">
        <label htmlFor="accessible-input">Accessible Input:</label>
        <input 
          id="accessible-input"
          data-testid="accessible-input"
          type="text"
          aria-describedby="input-help"
        />
        <div id="input-help">This input has proper accessibility attributes</div>
      </div>
    </div>
  )
}

describe('Testing Framework Validation', () => {
  beforeEach(() => {
    cleanup()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Framework Setup', () => {
    it('should have Vitest globals available', () => {
      expect(vi).toBeDefined()
      expect(describe).toBeDefined()
      expect(it).toBeDefined()
      expect(expect).toBeDefined()
    })

    it('should have React Testing Library available', () => {
      expect(render).toBeDefined()
      expect(screen).toBeDefined()
      expect(cleanup).toBeDefined()
    })

    it('should have user-event available', () => {
      expect(userEvent).toBeDefined()
      expect(userEvent.setup).toBeDefined()
    })

    it('should have jest-dom matchers available', () => {
      const element = document.createElement('div')
      element.textContent = 'Test'
      document.body.appendChild(element)
      
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent('Test')
      
      document.body.removeChild(element)
    })
  })

  describe('Component Rendering', () => {
    it('should render components correctly', () => {
      render(<ValidationTestComponent />)
      
      expect(screen.getByTestId('validation-component')).toBeInTheDocument()
      expect(screen.getByText('Testing Framework Validation')).toBeInTheDocument()
      expect(screen.getByTestId('increment-button')).toBeInTheDocument()
      expect(screen.getByTestId('text-input')).toBeInTheDocument()
    })

    it('should handle component props and state', () => {
      render(<ValidationTestComponent />)
      
      const button = screen.getByTestId('increment-button')
      expect(button).toHaveTextContent('Count: 0')
      
      const input = screen.getByTestId('text-input') as HTMLInputElement
      expect(input.value).toBe('')
    })
  })

  describe('User Interactions', () => {
    it('should handle click events', async () => {
      const user = userEvent.setup()
      render(<ValidationTestComponent />)
      
      const button = screen.getByTestId('increment-button')
      expect(button).toHaveTextContent('Count: 0')
      
      await user.click(button)
      expect(button).toHaveTextContent('Count: 1')
      
      await user.click(button)
      expect(button).toHaveTextContent('Count: 2')
    })

    it('should handle text input', async () => {
      const user = userEvent.setup()
      render(<ValidationTestComponent />)
      
      const input = screen.getByTestId('text-input')
      const display = screen.getByTestId('text-display')
      
      await user.type(input, 'Hello World')
      expect(display).toHaveTextContent('Hello World')
    })

    it('should handle conditional rendering', async () => {
      const user = userEvent.setup()
      render(<ValidationTestComponent />)
      
      const toggleButton = screen.getByTestId('toggle-button')
      
      // Element should not be visible initially
      expect(screen.queryByTestId('conditional-element')).not.toBeInTheDocument()
      
      // Click to show element
      await user.click(toggleButton)
      expect(screen.getByTestId('conditional-element')).toBeInTheDocument()
      
      // Click to hide element
      await user.click(toggleButton)
      expect(screen.queryByTestId('conditional-element')).not.toBeInTheDocument()
    })
  })

  describe('Test Helpers Validation', () => {
    beforeEach(() => {
      render(<ValidationTestComponent />)
    })

    it('should validate TestHelpers utilities', async () => {
      // Element existence
      expect(TestHelpers.elementExists('increment-button')).toBe(true)
      expect(TestHelpers.elementExists('non-existent')).toBe(false)
      
      // Element interaction
      await TestHelpers.clickElement('increment-button')
      const button = screen.getByTestId('increment-button')
      expect(button).toHaveTextContent('Count: 1')
      
      // Text input
      await TestHelpers.typeIntoInput('text-input', 'Test Text')
      const display = screen.getByTestId('text-display')
      expect(display).toHaveTextContent('Test Text')
    })

    it('should validate ChartTestUtils', () => {
      const chartData = ChartTestUtils.getChartData('mock-chart')
      expect(chartData).toEqual({ labels: ['A', 'B'], datasets: [] })
      
      const chartOptions = ChartTestUtils.getChartOptions('mock-chart')
      expect(chartOptions).toEqual({ responsive: true })
      
      ChartTestUtils.expectChartToBeRendered('mock-chart')
    })
  })

  describe('Mock Data Validation', () => {
    it('should have comprehensive mock data available', () => {
      expect(mockAlerts).toBeDefined()
      expect(Array.isArray(mockAlerts)).toBe(true)
      expect(mockAlerts.length).toBeGreaterThan(0)
      
      expect(mockInvestigations).toBeDefined()
      expect(Array.isArray(mockInvestigations)).toBe(true)
      expect(mockInvestigations.length).toBeGreaterThan(0)
    })

    it('should create mock data with factory functions', () => {
      const testAlert = createMockAlert({ severity: 'Critical', title: 'Test Alert' })
      
      expect(testAlert).toBeDefined()
      expect(testAlert.severity).toBe('Critical')
      expect(testAlert.title).toBe('Test Alert')
      expect(testAlert.id).toBeDefined()
    })

    it('should create test app state', () => {
      const state = createTestAppState({ currentSection: 'alerts' })
      
      expect(state).toBeDefined()
      expect(state.currentSection).toBe('alerts')
      expect(state.alerts).toBeDefined()
      expect(state.loading).toBeDefined()
      expect(state.errors).toBeDefined()
    })
  })

  describe('Configuration Validation', () => {
    it('should have test configuration available', () => {
      expect(testConfig).toBeDefined()
      expect(testConfig.execution).toBeDefined()
      expect(testConfig.components).toBeDefined()
      expect(testConfig.coverage).toBeDefined()
    })

    it('should have test utils configuration', () => {
      expect(testUtilsConfig).toBeDefined()
      expect(testUtilsConfig.userEvent).toBeDefined()
      expect(testUtilsConfig.render).toBeDefined()
    })

    it('should have test data configuration', () => {
      expect(testDataConfig).toBeDefined()
      expect(testDataConfig.mockData).toBeDefined()
      expect(testDataConfig.generation).toBeDefined()
    })
  })

  describe('Accessibility Testing', () => {
    it('should validate accessibility attributes', () => {
      render(<ValidationTestComponent />)
      
      // Check for proper ARIA labels
      const incrementButton = screen.getByTestId('increment-button')
      expect(incrementButton).toHaveAttribute('aria-label', 'Increment counter')
      
      // Check for proper form labels
      const accessibleInput = screen.getByTestId('accessible-input')
      expect(accessibleInput).toHaveAttribute('aria-describedby', 'input-help')
      
      // Check for proper roles
      const region = screen.getByRole('region')
      expect(region).toHaveAttribute('aria-label', 'Test region')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<ValidationTestComponent />)
      
      const incrementButton = screen.getByTestId('increment-button')
      
      // Focus the button
      incrementButton.focus()
      expect(incrementButton).toHaveFocus()
      
      // Press Enter to activate
      await user.keyboard('{Enter}')
      expect(incrementButton).toHaveTextContent('Count: 1')
    })
  })

  describe('Error Handling', () => {
    it('should handle component errors gracefully', () => {
      // Test that the framework can handle errors without crashing
      const ErrorComponent = () => {
        throw new Error('Test error')
      }
      
      // This should not crash the test suite
      expect(() => {
        try {
          render(<ErrorComponent />)
        } catch (error) {
          expect(error).toBeInstanceOf(Error)
        }
      }).not.toThrow()
    })

    it('should handle async errors', async () => {
      const AsyncErrorComponent = () => {
        React.useEffect(() => {
          Promise.reject(new Error('Async error')).catch(() => {
            // Silently handle the error for testing purposes
          })
        }, [])
        return <div>Async Component</div>
      }
      
      // Should render without throwing
      expect(() => render(<AsyncErrorComponent />)).not.toThrow()
    })
  })

  describe('Performance Validation', () => {
    it('should render components within acceptable time', () => {
      const startTime = performance.now()
      render(<ValidationTestComponent />)
      const endTime = performance.now()
      
      const renderTime = endTime - startTime
      expect(renderTime).toBeLessThan(testConfig.performance.renderTime.slow)
    })

    it('should handle multiple renders efficiently', () => {
      const startTime = performance.now()
      
      // Render multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<ValidationTestComponent />)
        unmount()
      }
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(1000) // 1 second for 10 renders
    })
  })

  describe('Memory Management', () => {
    it('should clean up properly after tests', () => {
      render(<ValidationTestComponent />)
      cleanup()
      
      // After cleanup, queries should not find elements
      expect(screen.queryByTestId('validation-component')).not.toBeInTheDocument()
    })

    it('should handle component unmounting', () => {
      const { unmount } = render(<ValidationTestComponent />)
      
      expect(screen.getByTestId('validation-component')).toBeInTheDocument()
      
      unmount()
      
      expect(screen.queryByTestId('validation-component')).not.toBeInTheDocument()
    })
  })
})

// Tag this test file for easy identification
// @smoke @critical @framework