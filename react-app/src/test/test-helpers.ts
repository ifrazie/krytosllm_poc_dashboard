/**
 * Test Helper Functions
 * 
 * Utility functions to help with testing React components and application logic
 */

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppAction, AppState } from '../types'

// User event setup
export const user = userEvent.setup()

// Common test utilities
export const TestHelpers = {
  // User event instance
  user,
  // Wait for element to appear
  waitForElement: async (testId: string, timeout = 1000) => {
    return await waitFor(
      () => screen.getByTestId(testId),
      { timeout }
    )
  },

  // Wait for element to disappear
  waitForElementToDisappear: async (testId: string, timeout = 1000) => {
    return await waitFor(
      () => expect(screen.queryByTestId(testId)).not.toBeInTheDocument(),
      { timeout }
    )
  },

  // Check if element exists without throwing
  elementExists: (testId: string): boolean => {
    return screen.queryByTestId(testId) !== null
  },

  // Get element by test id with optional timeout
  getElement: async (testId: string, timeout = 1000) => {
    if (timeout > 0) {
      return await TestHelpers.waitForElement(testId, timeout)
    }
    return screen.getByTestId(testId)
  },

  // Click element by test id
  clickElement: async (testId: string) => {
    const element = screen.getByTestId(testId)
    await user.click(element)
  },

  // Type into input by test id
  typeIntoInput: async (testId: string, text: string) => {
    const input = screen.getByTestId(testId)
    await user.type(input, text)
  },

  // Clear and type into input
  clearAndType: async (testId: string, text: string) => {
    const input = screen.getByTestId(testId)
    await user.clear(input)
    await user.type(input, text)
  },

  // Select option from dropdown
  selectOption: async (testId: string, option: string) => {
    const select = screen.getByTestId(testId)
    await user.selectOptions(select, option)
  },

  // Check if element has specific class
  hasClass: (element: HTMLElement, className: string): boolean => {
    return element.classList.contains(className)
  },

  // Get computed style property
  getStyle: (element: HTMLElement, property: string): string => {
    return window.getComputedStyle(element).getPropertyValue(property)
  },

  // Simulate keyboard events
  pressKey: async (key: string) => {
    await user.keyboard(key)
  },

  // Simulate escape key
  pressEscape: async () => {
    await user.keyboard('{Escape}')
  },

  // Simulate enter key
  pressEnter: async () => {
    await user.keyboard('{Enter}')
  }
}

// Mock dispatch function for context testing
export const createMockDispatch = () => {
  const dispatch = vi.fn()
  dispatch.mockImplementation((action: AppAction) => {
    // You can add logic here to track dispatched actions
    console.log('Mock dispatch called with:', action)
  })
  return dispatch
}

// Create partial app state for testing
export const createTestAppState = (overrides: Partial<AppState> = {}): AppState => ({
  alerts: [],
  investigations: [],
  integrations: [],
  socTeam: [],
  metrics: {
    totalAlerts: 0,
    alertsTrend: '+0%',
    activeInvestigations: 0,
    investigationsTrend: '+0%',
    resolvedIncidents: 0,
    incidentsTrend: '+0%',
    mttr: '0h',
    mttrTrend: '+0%'
  },
  incidents: [],
  currentSection: 'dashboard',
  selectedInvestigation: null,
  selectedAlert: null,
  loading: {
    alerts: false,
    investigations: false,
    integrations: false,
    metrics: false,
    incidents: false
  },
  errors: {
    alerts: null,
    investigations: null,
    integrations: null,
    metrics: null,
    incidents: null
  },
  ...overrides
})

// Chart testing utilities
export const ChartTestUtils = {
  // Get chart data from mocked chart component
  getChartData: (testId: string) => {
    const chartElement = screen.getByTestId(testId)
    const dataAttr = chartElement.getAttribute('data-chart-data')
    return dataAttr ? JSON.parse(dataAttr) : null
  },

  // Get chart options from mocked chart component
  getChartOptions: (testId: string) => {
    const chartElement = screen.getByTestId(testId)
    const optionsAttr = chartElement.getAttribute('data-chart-options')
    return optionsAttr ? JSON.parse(optionsAttr) : null
  },

  // Verify chart is rendered
  expectChartToBeRendered: (testId: string) => {
    expect(screen.getByTestId(testId)).toBeInTheDocument()
  },

  // Verify chart has correct data
  expectChartToHaveData: (testId: string, expectedData: any) => {
    const chartData = ChartTestUtils.getChartData(testId)
    expect(chartData).toEqual(expectedData)
  }
}

// Modal testing utilities
export const ModalTestUtils = {
  // Wait for modal to open
  waitForModalToOpen: async (modalTestId: string = 'modal') => {
    return await TestHelpers.waitForElement(modalTestId)
  },

  // Wait for modal to close
  waitForModalToClose: async (modalTestId: string = 'modal') => {
    return await TestHelpers.waitForElementToDisappear(modalTestId)
  },

  // Close modal by clicking overlay
  closeModalByOverlay: async (overlayTestId: string = 'modal-overlay') => {
    await TestHelpers.clickElement(overlayTestId)
  },

  // Close modal by escape key
  closeModalByEscape: async () => {
    await TestHelpers.pressEscape()
  },

  // Close modal by close button
  closeModalByButton: async (closeButtonTestId: string = 'modal-close') => {
    await TestHelpers.clickElement(closeButtonTestId)
  }
}

// Table testing utilities
export const TableTestUtils = {
  // Get all table rows
  getTableRows: (tableTestId: string) => {
    const table = screen.getByTestId(tableTestId)
    return table.querySelectorAll('tbody tr')
  },

  // Get table row by index
  getTableRow: (tableTestId: string, rowIndex: number) => {
    const rows = TableTestUtils.getTableRows(tableTestId)
    return rows[rowIndex]
  },

  // Click table row
  clickTableRow: async (tableTestId: string, rowIndex: number) => {
    const row = TableTestUtils.getTableRow(tableTestId, rowIndex)
    await user.click(row)
  },

  // Get table cell value
  getTableCellValue: (tableTestId: string, rowIndex: number, cellIndex: number) => {
    const row = TableTestUtils.getTableRow(tableTestId, rowIndex)
    const cells = row.querySelectorAll('td')
    return cells[cellIndex]?.textContent || ''
  },

  // Sort table by column
  sortTableByColumn: async (tableTestId: string, columnIndex: number) => {
    const table = screen.getByTestId(tableTestId)
    const headers = table.querySelectorAll('thead th')
    const sortButton = headers[columnIndex]?.querySelector('button')
    if (sortButton) {
      await user.click(sortButton)
    }
  }
}

// Form testing utilities
export const FormTestUtils = {
  // Fill form field
  fillField: async (fieldTestId: string, value: string) => {
    await TestHelpers.clearAndType(fieldTestId, value)
  },

  // Submit form
  submitForm: async (formTestId: string) => {
    const form = screen.getByTestId(formTestId)
    const submitButton = form.querySelector('button[type="submit"]')
    if (submitButton) {
      await user.click(submitButton)
    }
  },

  // Reset form
  resetForm: async (formTestId: string) => {
    const form = screen.getByTestId(formTestId)
    const resetButton = form.querySelector('button[type="reset"]')
    if (resetButton) {
      await user.click(resetButton)
    }
  },

  // Check form validation
  expectFieldError: (fieldTestId: string, errorMessage?: string) => {
    const field = screen.getByTestId(fieldTestId)
    const errorElement = field.parentElement?.querySelector('.error, .field-error, [data-testid$="-error"]')
    expect(errorElement).toBeInTheDocument()
    if (errorMessage) {
      expect(errorElement).toHaveTextContent(errorMessage)
    }
  }
}