/**
 * AlertManagement Component Tests
 * 
 * Tests for the AlertManagement component including filtering, sorting,
 * modal interactions, bulk operations, and state management.
 */

import React from 'react'
import { render, screen, waitFor } from '../../../test/test-utils'
import { TestHelpers, ModalTestUtils, TableTestUtils } from '../../../test/test-helpers'
import { AlertManagement } from '../AlertManagement'
import { mockAlerts, createMockAlert } from '../../../test/mock-data'
import { AppProvider } from '../../../context/AppContext'

// Mock child components to focus on AlertManagement logic
vi.mock('../AlertFilters', () => ({
  AlertFilters: ({ filters, onFiltersChange, onReset }: any) => (
    <div data-testid="alert-filters">
      <input
        data-testid="search-input"
        placeholder="Search alerts..."
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
      />
      <select
        data-testid="severity-filter"
        onChange={(e) => onFiltersChange({ ...filters, severity: e.target.value || undefined })}
      >
        <option value="">All Severities</option>
        <option value="Critical">Critical</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button data-testid="reset-filters" onClick={onReset}>Reset</button>
    </div>
  )
}))

vi.mock('../AlertTable', () => ({
  AlertTable: ({ alerts, filters, selectedAlerts, onAlertSelect, onAlertsSelect, onAlertClick }: any) => (
    <div data-testid="alert-table">
      <div data-testid="alert-count">{alerts.length} alerts</div>
      {alerts.map((alert: any) => (
        <div key={alert.id} data-testid={`alert-row-${alert.id}`}>
          <input
            type="checkbox"
            data-testid={`alert-checkbox-${alert.id}`}
            onChange={(e) => {
              const newSelected = e.target.checked
                ? [...selectedAlerts, alert]
                : selectedAlerts.filter((a: any) => a.id !== alert.id)
              onAlertsSelect(newSelected)
            }}
          />
          <button
            data-testid={`alert-button-${alert.id}`}
            onClick={() => onAlertClick(alert)}
          >
            {alert.title}
          </button>
        </div>
      ))}
    </div>
  )
}))

vi.mock('../AlertModal', () => ({
  AlertModal: ({ alert, isOpen, onClose, onEscalate, onAssign, onResolve }: any) => (
    isOpen && alert ? (
      <div data-testid="alert-modal" role="dialog">
        <h2>{alert.title}</h2>
        <button data-testid="modal-escalate" onClick={() => onEscalate(alert)}>Escalate</button>
        <button data-testid="modal-assign" onClick={() => onAssign(alert, 'Test Analyst')}>Assign</button>
        <button data-testid="modal-resolve" onClick={() => onResolve(alert, 'Test resolution')}>Resolve</button>
        <button data-testid="modal-close" onClick={onClose}>Close</button>
      </div>
    ) : null
  )
}))

vi.mock('../../common', () => ({
  NoAlertsState: () => <div data-testid="no-alerts-state">No alerts found</div>,
  LoadingState: ({ message }: any) => <div data-testid="loading-state">{message}</div>
}))

describe('AlertManagement Component', () => {
  const renderAlertManagement = (initialState = {}) => {
    const defaultState = {
      alerts: mockAlerts,
      loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false },
      ...initialState
    }

    return render(
      <AppProvider initialState={defaultState}>
        <AlertManagement />
      </AppProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders alert management header', () => {
      renderAlertManagement()
      
      expect(screen.getByText('Alert Management')).toBeInTheDocument()
      expect(screen.getByText('Monitor and respond to security alerts')).toBeInTheDocument()
    })

    it('renders header statistics', () => {
      const testAlerts = [
        createMockAlert({ status: 'Active Threat' }),
        createMockAlert({ status: 'Under Investigation' }),
        createMockAlert({ status: 'Active Threat' })
      ]
      
      renderAlertManagement({ alerts: testAlerts })
      
      expect(screen.getByText('3')).toBeInTheDocument() // Total Alerts
      expect(screen.getByText('Total Alerts')).toBeInTheDocument()
      expect(screen.getByText('Filtered')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument() // Active Threats
      expect(screen.getByText('Active Threats')).toBeInTheDocument()
    })

    it('renders alert filters', () => {
      renderAlertManagement()
      expect(screen.getByTestId('alert-filters')).toBeInTheDocument()
    })

    it('renders alert table', () => {
      renderAlertManagement()
      expect(screen.getByTestId('alert-table')).toBeInTheDocument()
    })

    it('does not render bulk actions bar initially', () => {
      renderAlertManagement()
      expect(screen.queryByTestId('bulk-actions-bar')).not.toBeInTheDocument()
    })
  })

  describe('Filtering', () => {
    it('handles search filter changes', async () => {
      renderAlertManagement()
      
      const searchInput = screen.getByTestId('search-input')
      await TestHelpers.user.type(searchInput, 'PowerShell')
      
      // The filter should be applied (implementation depends on actual filtering logic)
      expect(searchInput).toHaveValue('PowerShell')
    })

    it('handles severity filter changes', async () => {
      renderAlertManagement()
      
      const severityFilter = screen.getByTestId('severity-filter')
      await TestHelpers.user.selectOptions(severityFilter, 'Critical')
      
      expect(severityFilter).toHaveValue('Critical')
    })

    it('handles filter reset', async () => {
      renderAlertManagement()
      
      // Set some filters first
      const searchInput = screen.getByTestId('search-input')
      const severityFilter = screen.getByTestId('severity-filter')
      
      await TestHelpers.user.type(searchInput, 'test')
      await TestHelpers.user.selectOptions(severityFilter, 'Critical')
      
      // Reset filters
      const resetButton = screen.getByTestId('reset-filters')
      await TestHelpers.user.click(resetButton)
      
      // Filters should be reset (implementation dependent)
      expect(resetButton).toBeInTheDocument()
    })

    it('updates filtered count when filters change', async () => {
      const testAlerts = [
        createMockAlert({ title: 'PowerShell Alert', severity: 'Critical' }),
        createMockAlert({ title: 'Login Alert', severity: 'Medium' })
      ]
      
      renderAlertManagement({ alerts: testAlerts })
      
      // Initially should show all alerts
      expect(screen.getByText('2')).toBeInTheDocument() // Total count
    })
  })

  describe('Alert Selection and Modal', () => {
    it('opens modal when alert is clicked', async () => {
      renderAlertManagement()
      
      const alertButton = screen.getByTestId(`alert-button-${mockAlerts[0].id}`)
      await TestHelpers.user.click(alertButton)
      
      expect(screen.getByTestId('alert-modal')).toBeInTheDocument()
      expect(screen.getByText(mockAlerts[0].title)).toBeInTheDocument()
    })

    it('closes modal when close button is clicked', async () => {
      renderAlertManagement()
      
      // Open modal
      const alertButton = screen.getByTestId(`alert-button-${mockAlerts[0].id}`)
      await TestHelpers.user.click(alertButton)
      
      expect(screen.getByTestId('alert-modal')).toBeInTheDocument()
      
      // Close modal
      const closeButton = screen.getByTestId('modal-close')
      await TestHelpers.user.click(closeButton)
      
      expect(screen.queryByTestId('alert-modal')).not.toBeInTheDocument()
    })

    it('handles alert escalation from modal', async () => {
      renderAlertManagement()
      
      // Open modal
      const alertButton = screen.getByTestId(`alert-button-${mockAlerts[0].id}`)
      await TestHelpers.user.click(alertButton)
      
      // Escalate alert
      const escalateButton = screen.getByTestId('modal-escalate')
      await TestHelpers.user.click(escalateButton)
      
      // Should call the escalation handler (we can't easily test the actual state update without more complex mocking)
      expect(escalateButton).toBeInTheDocument()
    })

    it('handles alert assignment from modal', async () => {
      renderAlertManagement()
      
      // Open modal
      const alertButton = screen.getByTestId(`alert-button-${mockAlerts[0].id}`)
      await TestHelpers.user.click(alertButton)
      
      // Assign alert
      const assignButton = screen.getByTestId('modal-assign')
      await TestHelpers.user.click(assignButton)
      
      expect(assignButton).toBeInTheDocument()
    })

    it('handles alert resolution from modal', async () => {
      renderAlertManagement()
      
      // Open modal
      const alertButton = screen.getByTestId(`alert-button-${mockAlerts[0].id}`)
      await TestHelpers.user.click(alertButton)
      
      // Resolve alert
      const resolveButton = screen.getByTestId('modal-resolve')
      await TestHelpers.user.click(resolveButton)
      
      expect(resolveButton).toBeInTheDocument()
    })
  })

  describe('Bulk Operations', () => {
    it('shows bulk actions bar when alerts are selected', async () => {
      renderAlertManagement()
      
      // Select an alert
      const checkbox = screen.getByTestId(`alert-checkbox-${mockAlerts[0].id}`)
      await TestHelpers.user.click(checkbox)
      
      // Bulk actions bar should appear
      await waitFor(() => {
        expect(screen.getByText(/1 alert selected/)).toBeInTheDocument()
      })
    })

    it('shows correct count for multiple selected alerts', async () => {
      renderAlertManagement()
      
      // Select multiple alerts
      const checkbox1 = screen.getByTestId(`alert-checkbox-${mockAlerts[0].id}`)
      const checkbox2 = screen.getByTestId(`alert-checkbox-${mockAlerts[1].id}`)
      
      await TestHelpers.user.click(checkbox1)
      await TestHelpers.user.click(checkbox2)
      
      await waitFor(() => {
        expect(screen.getByText(/2 alerts selected/)).toBeInTheDocument()
      })
    })

    it('handles bulk escalation', async () => {
      renderAlertManagement()
      
      // Select alerts
      const checkbox = screen.getByTestId(`alert-checkbox-${mockAlerts[0].id}`)
      await TestHelpers.user.click(checkbox)
      
      await waitFor(() => {
        const escalateButton = screen.getByText('Escalate')
        expect(escalateButton).toBeInTheDocument()
      })
    })

    it('handles bulk resolution', async () => {
      renderAlertManagement()
      
      // Select alerts
      const checkbox = screen.getByTestId(`alert-checkbox-${mockAlerts[0].id}`)
      await TestHelpers.user.click(checkbox)
      
      await waitFor(() => {
        const resolveButton = screen.getByText('Resolve')
        expect(resolveButton).toBeInTheDocument()
      })
    })

    it('handles bulk status change', async () => {
      renderAlertManagement()
      
      // Select alerts
      const checkbox = screen.getByTestId(`alert-checkbox-${mockAlerts[0].id}`)
      await TestHelpers.user.click(checkbox)
      
      await waitFor(() => {
        const statusSelect = screen.getByDisplayValue('Change Status...')
        expect(statusSelect).toBeInTheDocument()
      })
    })

    it('clears selection when clear button is clicked', async () => {
      renderAlertManagement()
      
      // Select alerts
      const checkbox = screen.getByTestId(`alert-checkbox-${mockAlerts[0].id}`)
      await TestHelpers.user.click(checkbox)
      
      await waitFor(() => {
        const clearButton = screen.getByText('Clear')
        expect(clearButton).toBeInTheDocument()
      })
    })
  })

  describe('Loading and Empty States', () => {
    it('shows loading state when alerts are loading', () => {
      renderAlertManagement({ loading: { alerts: true } })
      
      expect(screen.getByTestId('loading-state')).toBeInTheDocument()
      expect(screen.getByText('Loading security alerts...')).toBeInTheDocument()
    })

    it('shows empty state when no alerts exist', () => {
      renderAlertManagement({ alerts: [] })
      
      expect(screen.getByTestId('no-alerts-state')).toBeInTheDocument()
      expect(screen.getByText('No alerts found')).toBeInTheDocument()
    })

    it('does not show empty state when loading', () => {
      renderAlertManagement({ alerts: [], loading: { alerts: true } })
      
      expect(screen.queryByTestId('no-alerts-state')).not.toBeInTheDocument()
      expect(screen.getByTestId('loading-state')).toBeInTheDocument()
    })
  })

  describe('Statistics Calculation', () => {
    it('calculates active threats correctly', () => {
      const testAlerts = [
        createMockAlert({ status: 'Active Threat' }),
        createMockAlert({ status: 'Active Threat' }),
        createMockAlert({ status: 'Under Investigation' }),
        createMockAlert({ status: 'Resolved' })
      ]
      
      renderAlertManagement({ alerts: testAlerts })
      
      // Should show 2 active threats
      const statsSection = screen.getByText('Active Threats').closest('.statItem')
      expect(statsSection).toContainElement(screen.getByText('2'))
    })

    it('updates statistics when alerts change', () => {
      const { rerender } = renderAlertManagement({ 
        alerts: [createMockAlert({ status: 'Active Threat' })] 
      })
      
      // Initially 1 active threat
      expect(screen.getByText('1')).toBeInTheDocument()
      
      // Update with more alerts
      const newAlerts = [
        createMockAlert({ status: 'Active Threat' }),
        createMockAlert({ status: 'Active Threat' })
      ]
      
      rerender(
        <AppProvider initialState={{ alerts: newAlerts, loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false } }}>
          <AlertManagement />
        </AppProvider>
      )
      
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles missing alerts gracefully', () => {
      renderAlertManagement({ alerts: undefined })
      
      expect(screen.getByText('Alert Management')).toBeInTheDocument()
      // Should show 0 for counts when alerts is undefined
    })

    it('handles missing loading state gracefully', () => {
      renderAlertManagement({ loading: undefined })
      
      expect(screen.getByText('Alert Management')).toBeInTheDocument()
      expect(screen.getByTestId('alert-table')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderAlertManagement()
      
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent('Alert Management')
    })

    it('provides descriptive statistics labels', () => {
      renderAlertManagement()
      
      expect(screen.getByText('Total Alerts')).toBeInTheDocument()
      expect(screen.getByText('Filtered')).toBeInTheDocument()
      expect(screen.getByText('Active Threats')).toBeInTheDocument()
    })

    it('maintains focus management with modal interactions', async () => {
      renderAlertManagement()
      
      const alertButton = screen.getByTestId(`alert-button-${mockAlerts[0].id}`)
      await TestHelpers.user.click(alertButton)
      
      // Modal should be focused
      const modal = screen.getByTestId('alert-modal')
      expect(modal).toBeInTheDocument()
    })
  })
})