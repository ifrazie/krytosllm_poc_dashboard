/**
 * Test Helpers Test Suite
 * 
 * Tests for the test helper utilities to ensure they work correctly
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { TestHelpers, ChartTestUtils, createTestAppState, createMockDispatch } from './test-helpers'

// Simple test component for testing helpers
const TestComponent = () => {
  const [count, setCount] = React.useState(0)
  const [inputValue, setInputValue] = React.useState('')

  return (
    <div>
      <button 
        data-testid="increment-button" 
        onClick={() => setCount(count + 1)}
      >
        Count: {count}
      </button>
      <input
        data-testid="test-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type here"
      />
      <div data-testid="input-display">{inputValue}</div>
      <select data-testid="test-select">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
      <div data-testid="styled-element" className="test-class" style={{ color: 'red' }}>
        Styled Element
      </div>
    </div>
  )
}

describe('Test Helpers', () => {
  beforeEach(() => {
    render(<TestComponent />)
  })

  describe('Element Utilities', () => {
    it('should check if element exists', () => {
      expect(TestHelpers.elementExists('increment-button')).toBe(true)
      expect(TestHelpers.elementExists('non-existent')).toBe(false)
    })

    it('should get element by test id', async () => {
      const element = await TestHelpers.getElement('increment-button', 0)
      expect(element).toBeInTheDocument()
      expect(element.tagName).toBe('BUTTON')
    })

    it('should click element', async () => {
      const button = screen.getByTestId('increment-button')
      expect(button).toHaveTextContent('Count: 0')
      
      await TestHelpers.clickElement('increment-button')
      expect(button).toHaveTextContent('Count: 1')
    })

    it('should type into input', async () => {
      await TestHelpers.typeIntoInput('test-input', 'Hello World')
      
      const display = screen.getByTestId('input-display')
      expect(display).toHaveTextContent('Hello World')
    })

    it('should clear and type into input', async () => {
      const input = screen.getByTestId('test-input') as HTMLInputElement
      input.value = 'Initial Value'
      
      await TestHelpers.clearAndType('test-input', 'New Value')
      
      const display = screen.getByTestId('input-display')
      expect(display).toHaveTextContent('New Value')
    })

    it('should select option from dropdown', async () => {
      await TestHelpers.selectOption('test-select', 'option2')
      
      const select = screen.getByTestId('test-select') as HTMLSelectElement
      expect(select.value).toBe('option2')
    })

    it('should check if element has class', () => {
      const element = screen.getByTestId('styled-element')
      expect(TestHelpers.hasClass(element, 'test-class')).toBe(true)
      expect(TestHelpers.hasClass(element, 'non-existent-class')).toBe(false)
    })

    it('should get computed style', () => {
      const element = screen.getByTestId('styled-element')
      const color = TestHelpers.getStyle(element, 'color')
      // Note: computed style might return rgb format
      expect(color).toBeTruthy()
    })
  })

  describe('Keyboard Utilities', () => {
    it('should simulate key press', async () => {
      const input = screen.getByTestId('test-input')
      input.focus()
      
      await TestHelpers.pressKey('a')
      await TestHelpers.pressKey('b')
      await TestHelpers.pressKey('c')
      
      const display = screen.getByTestId('input-display')
      expect(display).toHaveTextContent('abc')
    })

    it('should simulate escape key', async () => {
      // This test just ensures the method doesn't throw
      await expect(TestHelpers.pressEscape()).resolves.not.toThrow()
    })

    it('should simulate enter key', async () => {
      // This test just ensures the method doesn't throw
      await expect(TestHelpers.pressEnter()).resolves.not.toThrow()
    })
  })
})

describe('Chart Test Utils', () => {
  beforeEach(() => {
    // Mock chart component for testing
    const MockChart = () => (
      <div 
        data-testid="test-chart"
        data-chart-data={JSON.stringify({ labels: ['A', 'B'], datasets: [] })}
        data-chart-options={JSON.stringify({ responsive: true })}
      >
        Mock Chart
      </div>
    )
    render(<MockChart />)
  })

  it('should get chart data', () => {
    const data = ChartTestUtils.getChartData('test-chart')
    expect(data).toEqual({ labels: ['A', 'B'], datasets: [] })
  })

  it('should get chart options', () => {
    const options = ChartTestUtils.getChartOptions('test-chart')
    expect(options).toEqual({ responsive: true })
  })

  it('should verify chart is rendered', () => {
    ChartTestUtils.expectChartToBeRendered('test-chart')
  })

  it('should verify chart has correct data', () => {
    const expectedData = { labels: ['A', 'B'], datasets: [] }
    ChartTestUtils.expectChartToHaveData('test-chart', expectedData)
  })
})

describe('State Utilities', () => {
  it('should create mock dispatch function', () => {
    const mockDispatch = createMockDispatch()
    
    expect(mockDispatch).toBeDefined()
    expect(typeof mockDispatch).toBe('function')
    
    const testAction = { type: 'SET_CURRENT_SECTION' as const, payload: 'alerts' as const }
    mockDispatch(testAction)
    
    expect(mockDispatch).toHaveBeenCalledWith(testAction)
  })

  it('should create test app state with defaults', () => {
    const state = createTestAppState()
    
    expect(state.alerts).toEqual([])
    expect(state.currentSection).toBe('dashboard')
    expect(state.loading.alerts).toBe(false)
    expect(state.errors.alerts).toBeNull()
  })

  it('should create test app state with overrides', () => {
    const overrides = {
      currentSection: 'alerts' as const,
      alerts: [{ id: 'test', title: 'Test Alert' }] as any,
      loading: { alerts: true } as any
    }
    
    const state = createTestAppState(overrides)
    
    expect(state.currentSection).toBe('alerts')
    expect(state.alerts).toHaveLength(1)
    expect(state.loading.alerts).toBe(true)
  })
})

describe('Async Utilities', () => {
  it('should wait for element to appear', async () => {
    // Create a component that shows an element after a delay
    const DelayedComponent = () => {
      const [show, setShow] = React.useState(false)
      
      React.useEffect(() => {
        const timer = setTimeout(() => setShow(true), 100)
        return () => clearTimeout(timer)
      }, [])
      
      return show ? <div data-testid="delayed-element">Appeared!</div> : null
    }
    
    render(<DelayedComponent />)
    
    // Element should not be there initially
    expect(TestHelpers.elementExists('delayed-element')).toBe(false)
    
    // Wait for it to appear
    const element = await TestHelpers.waitForElement('delayed-element')
    expect(element).toBeInTheDocument()
    expect(element).toHaveTextContent('Appeared!')
  })

  it('should wait for element to disappear', async () => {
    const DisappearingComponent = () => {
      const [show, setShow] = React.useState(true)
      
      React.useEffect(() => {
        const timer = setTimeout(() => setShow(false), 100)
        return () => clearTimeout(timer)
      }, [])
      
      return show ? <div data-testid="disappearing-element">Will disappear</div> : null
    }
    
    render(<DisappearingComponent />)
    
    // Element should be there initially
    expect(TestHelpers.elementExists('disappearing-element')).toBe(true)
    
    // Wait for it to disappear
    await TestHelpers.waitForElementToDisappear('disappearing-element')
    expect(TestHelpers.elementExists('disappearing-element')).toBe(false)
  })
})