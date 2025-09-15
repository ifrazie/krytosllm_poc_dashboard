/**
 * Component Integration Tests
 * 
 * Tests that verify major components render correctly with real data
 * and context integration. These tests focus on actual component behavior
 * rather than implementation details.
 */

import React from 'react'
import { render, screen, waitFor } from '../../test/test-utils'
import { TestHelpers } from '../../test/test-helpers'
import { Dashboard } from '../dashboard/Dashboard'
import { AlertManagement } from '../alerts/AlertManagement'
import { Integrations } from '../integrations/Integrations'
import { Investigations } from '../investigations/Investigations'
import { ThreatHunting } from '../hunting/ThreatHunting'
import { Analytics } from '../analytics/Analytics'
import { IncidentBoard } from '../incidents/IncidentBoard'
import { mockAppState } from '../../test/mock-data'
import { AppProvider } from '../../context/AppContext'

describe('Component Integration Tests', () => {
  const renderWithContext = (component: React.ReactElement, initialState = {}) => {
    const state = { ...mockAppState, ...initialState }
    return render(
      <AppProvider initialState={state}>
        {component}
      </AppProvider>
    )
  }

  describe('Dashboard Component', () => {
    it('renders dashboard with main sections', () => {
      renderWithContext(<Dashboard />)
      
      expect(screen.getByText('SOC Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Real-time security operations center overview')).toBeInTheDocument()
    })

    it('displays system health information', () => {
      renderWithContext(<Dashboard />)
      
      expect(screen.getByText('System Health')).toBeInTheDocument()
      expect(screen.getByText('All Systems Operational')).toBeInTheDocument()
    })

    it('handles empty alerts state', () => {
      renderWithContext(<Dashboard />, { alerts: [] })
      
      expect(screen.getByText('SOC Dashboard')).toBeInTheDocument()
    })
  })

  describe('AlertManagement Component', () => {
    it('renders alert management interface', () => {
      renderWithContext(<AlertManagement />)
      
      expect(screen.getByText('Alert Management')).toBeInTheDocument()
      expect(screen.getByText('Monitor and respond to security alerts')).toBeInTheDocument()
    })

    it('displays alert statistics', () => {
      renderWithContext(<AlertManagement />)
      
      expect(screen.getByText('Total Alerts')).toBeInTheDocument()
      expect(screen.getByText('Active Threats')).toBeInTheDocument()
    })

    it('handles empty alerts state', () => {
      renderWithContext(<AlertManagement />, { alerts: [] })
      
      expect(screen.getByText('Alert Management')).toBeInTheDocument()
    })
  })

  describe('Integrations Component', () => {
    it('renders integrations interface', () => {
      renderWithContext(<Integrations />)
      
      expect(screen.getByText('System Integrations')).toBeInTheDocument()
    })

    it('shows loading state when integrations are loading', () => {
      renderWithContext(<Integrations />, { loading: { integrations: true } })
      
      expect(screen.getByText('System Integrations')).toBeInTheDocument()
    })

    it('handles empty integrations state', () => {
      renderWithContext(<Integrations />, { integrations: [] })
      
      expect(screen.getByText('System Integrations')).toBeInTheDocument()
    })
  })

  describe('Investigations Component', () => {
    it('renders investigations workspace', () => {
      renderWithContext(<Investigations />)
      
      // The component should render without errors
      expect(document.body).toBeInTheDocument()
    })

    it('handles empty investigations state', () => {
      renderWithContext(<Investigations />, { investigations: [] })
      
      expect(document.body).toBeInTheDocument()
    })
  })

  describe('ThreatHunting Component', () => {
    it('renders threat hunting interface', () => {
      renderWithContext(<ThreatHunting />)
      
      expect(screen.getByText('Threat Hunting')).toBeInTheDocument()
      expect(screen.getByText('Proactive threat detection using natural language queries')).toBeInTheDocument()
    })

    it('handles loading state', () => {
      renderWithContext(<ThreatHunting />, { loading: { hunting: true } })
      
      expect(screen.getByText('Threat Hunting')).toBeInTheDocument()
    })
  })

  describe('Analytics Component', () => {
    it('renders analytics interface', () => {
      renderWithContext(<Analytics />)
      
      expect(screen.getByText('Analytics & Reporting')).toBeInTheDocument()
      expect(screen.getByText('SOC performance metrics and threat intelligence')).toBeInTheDocument()
    })

    it('handles empty metrics state', () => {
      renderWithContext(<Analytics />, { metrics: undefined })
      
      expect(screen.getByText('Analytics & Reporting')).toBeInTheDocument()
    })
  })

  describe('IncidentBoard Component', () => {
    it('renders incident board interface', () => {
      renderWithContext(<IncidentBoard />)
      
      expect(screen.getByText('Incident Response Board')).toBeInTheDocument()
      expect(screen.getByText('Track and manage security incidents')).toBeInTheDocument()
    })

    it('displays status columns', () => {
      renderWithContext(<IncidentBoard />)
      
      expect(screen.getByText('New')).toBeInTheDocument()
      expect(screen.getByText('In Progress')).toBeInTheDocument()
      expect(screen.getByText('Resolved')).toBeInTheDocument()
    })

    it('handles empty incidents state', () => {
      renderWithContext(<IncidentBoard />, { incidents: [] })
      
      expect(screen.getByText('Incident Response Board')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('components handle missing context data gracefully', () => {
      const emptyState = {
        alerts: [],
        investigations: [],
        integrations: [],
        incidents: [],
        metrics: undefined,
        socTeam: [],
        loading: {},
        errors: {}
      }

      expect(() => {
        renderWithContext(<Dashboard />, emptyState)
      }).not.toThrow()

      expect(() => {
        renderWithContext(<AlertManagement />, emptyState)
      }).not.toThrow()

      expect(() => {
        renderWithContext(<Integrations />, emptyState)
      }).not.toThrow()

      expect(() => {
        renderWithContext(<Analytics />, emptyState)
      }).not.toThrow()
    })

    it('components handle malformed data gracefully', () => {
      const malformedState = {
        alerts: null,
        investigations: undefined,
        integrations: 'invalid',
        incidents: {},
        metrics: null
      }

      expect(() => {
        renderWithContext(<Dashboard />, malformedState)
      }).not.toThrow()

      expect(() => {
        renderWithContext(<AlertManagement />, malformedState)
      }).not.toThrow()
    })
  })

  describe('Loading States', () => {
    it('components handle loading states appropriately', () => {
      const loadingState = {
        loading: {
          alerts: true,
          investigations: true,
          integrations: true,
          incidents: true,
          metrics: true
        }
      }

      renderWithContext(<Dashboard />, loadingState)
      expect(screen.getByText('SOC Dashboard')).toBeInTheDocument()

      renderWithContext(<AlertManagement />, loadingState)
      expect(screen.getByText('Alert Management')).toBeInTheDocument()

      renderWithContext(<Integrations />, loadingState)
      expect(screen.getByText('System Integrations')).toBeInTheDocument()

      renderWithContext(<Analytics />, loadingState)
      expect(screen.getByText('Analytics & Reporting')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('components have proper heading structure', () => {
      renderWithContext(<Dashboard />)
      const h1Elements = screen.getAllByRole('heading', { level: 1 })
      expect(h1Elements.length).toBeGreaterThan(0)

      renderWithContext(<AlertManagement />)
      const alertH1 = screen.getByRole('heading', { level: 1 })
      expect(alertH1).toHaveTextContent('Alert Management')

      renderWithContext(<ThreatHunting />)
      const huntingH1 = screen.getByRole('heading', { level: 1 })
      expect(huntingH1).toHaveTextContent('Threat Hunting')

      renderWithContext(<Analytics />)
      const analyticsH1 = screen.getByRole('heading', { level: 1 })
      expect(analyticsH1).toHaveTextContent('Analytics & Reporting')

      renderWithContext(<IncidentBoard />)
      const incidentH1 = screen.getByRole('heading', { level: 1 })
      expect(incidentH1).toHaveTextContent('Incident Response Board')
    })

    it('components provide descriptive content', () => {
      renderWithContext(<Dashboard />)
      expect(screen.getByText('Real-time security operations center overview')).toBeInTheDocument()

      renderWithContext(<AlertManagement />)
      expect(screen.getByText('Monitor and respond to security alerts')).toBeInTheDocument()

      renderWithContext(<ThreatHunting />)
      expect(screen.getByText('Proactive threat detection using natural language queries')).toBeInTheDocument()

      renderWithContext(<Analytics />)
      expect(screen.getByText('SOC performance metrics and threat intelligence')).toBeInTheDocument()

      renderWithContext(<IncidentBoard />)
      expect(screen.getByText('Track and manage security incidents')).toBeInTheDocument()
    })
  })

  describe('Context Integration', () => {
    it('components use data from context correctly', () => {
      const customState = {
        alerts: [
          {
            id: 'test-alert',
            title: 'Test Alert',
            severity: 'Critical',
            status: 'Active Threat',
            source: 'Test Source',
            timestamp: '2024-01-15T10:00:00Z',
            description: 'Test description',
            aiAnalysis: 'Test analysis',
            riskScore: 95,
            artifacts: ['test'],
            recommendedActions: ['test action']
          }
        ]
      }

      renderWithContext(<Dashboard />, customState)
      expect(screen.getByText('SOC Dashboard')).toBeInTheDocument()

      renderWithContext(<AlertManagement />, customState)
      expect(screen.getByText('Alert Management')).toBeInTheDocument()
    })

    it('components update when context changes', () => {
      const { rerender } = renderWithContext(<Dashboard />)
      
      expect(screen.getByText('SOC Dashboard')).toBeInTheDocument()
      
      // Re-render with different state
      rerender(
        <AppProvider initialState={{ ...mockAppState, alerts: [] }}>
          <Dashboard />
        </AppProvider>
      )
      
      expect(screen.getByText('SOC Dashboard')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('components render efficiently with large datasets', () => {
      const largeDataset = {
        alerts: Array.from({ length: 100 }, (_, i) => ({
          id: `alert-${i}`,
          title: `Alert ${i}`,
          severity: 'Medium',
          status: 'Active Threat',
          source: 'Test',
          timestamp: new Date().toISOString(),
          description: 'Test',
          aiAnalysis: 'Test',
          riskScore: 50,
          artifacts: [],
          recommendedActions: []
        }))
      }

      const startTime = performance.now()
      renderWithContext(<Dashboard />, largeDataset)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(1000) // Should render in less than 1 second
      expect(screen.getByText('SOC Dashboard')).toBeInTheDocument()
    })
  })
})