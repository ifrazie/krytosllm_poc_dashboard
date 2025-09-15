import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AppProvider } from '../context/AppContext'
import { mockAppState } from './mock-data'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProvider initialState={mockAppState}>
      {children}
    </AppProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Helper function to create mock functions
export const createMockFn = <T extends (...args: any[]) => any>(
  implementation?: T
): T => {
  return vi.fn(implementation) as unknown as T
}

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Helper to simulate user interactions
export const simulateUserEvent = async (element: HTMLElement, event: string) => {
  const { fireEvent } = await import('@testing-library/react')
  fireEvent[event as keyof typeof fireEvent](element)
}

// Helper to check if element has specific class
export const hasClass = (element: HTMLElement, className: string): boolean => {
  return element.classList.contains(className)
}

// Helper to get element by test id with error handling
export const getByTestIdSafe = (container: HTMLElement, testId: string) => {
  const element = container.querySelector(`[data-testid="${testId}"]`)
  if (!element) {
    throw new Error(`Element with test-id "${testId}" not found`)
  }
  return element as HTMLElement
}