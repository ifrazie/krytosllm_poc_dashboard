import { describe, it, expect } from 'vitest'

describe('Test Setup', () => {
  it('should have vitest globals available', () => {
    expect(vi).toBeDefined()
    expect(describe).toBeDefined()
    expect(it).toBeDefined()
    expect(expect).toBeDefined()
  })

  it('should have jest-dom matchers available', () => {
    const element = document.createElement('div')
    element.textContent = 'Hello World'
    document.body.appendChild(element)
    
    expect(element).toBeInTheDocument()
    expect(element).toHaveTextContent('Hello World')
    
    document.body.removeChild(element)
  })

  it('should mock Chart.js correctly', () => {
    // This test verifies that Chart.js is mocked in setup.ts
    expect(() => {
      const { Chart } = require('chart.js')
      expect(Chart.register).toBeDefined()
    }).not.toThrow()
  })
})