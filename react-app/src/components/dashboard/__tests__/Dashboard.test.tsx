/**
 * Dashboard Component Tests
 * 
 * Tests for the main Dashboard component including metrics display,
 * alert feed, team status, threat chart, and real-time updates.
 */

import React from 'react'
import { render, screen } from '../../../test/test-utils'
import { TestHelpers, ChartTestUtils } from '../../../test/test-helpers'
import { Dashboard } from '../Dashboard'
import { mockAlerts, mockMetrics, mockTeamMembers, createMockAlert } from '../../../test/mock-data'
import { AppProvider } from '../../../context/AppContext'

// Mock the chart components to avoid canvas issues in tests
vi.mock('../../common/charts', () => ({
  ThreatLandscapeChart: ({ data, loading, error, ...props }: any) => (
    <div 
      data-testid="threat-landscape-chart"
      data-chart-data={JSON.stringify(data)}
      data-loading={loading}
      data-error={error}
      {...props}
    >
      Threat Landscape Chart
    </div>
  )
}))

describe('Dashboard Component', () => {
  const renderDashboard = (initialState = {}) => {
    const defaultState = {
      alerts: mockAlerts,
      metrics: mockMetrics,
      socTeam: mockTeamMembers,
      loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false },
      ...initialState
    }

    return render(
      <AppProvider initialState={defaultState}>
        <Dashboard />
      </AppProvider>
    )
  }

  describe('Rendering', () => {
    it('renders dashboard header', () => {
      renderDashboard()
      expect(screen.getByText('SOC Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Real-time security operations center overview')).toBeInTheDocument()
    })

    it('renders all dashboard sections', () => {
      renderDashboard()
      
      // Check for main sections
      expect(screen.getByText('Recent Alerts')).toBeInTheDocument()
      expect(screen.getByText('SOC Team Status')).toBeInTheDocument()
      expect(screen.getByText('Threat Landscape')).toBeInTheDocument()
      expect(screen.getByText('System Health')).toBeInTheDocument()
    })

    it('renders metrics grid', () => {
      renderDashboard()
      
      // MetricsGrid should be rendered (we'll test it separately)
      expect(screen.getByText('SOC Dashboard')).toBeInTheDocument()
    })

    it('renders alert feed', () => {
      renderDashboard()
      
      // AlertFeed should be rendered (we'll test it separately)
      expect(screen.getByText('Recent Alerts')).toBeInTheDocument()
    })

    it('renders team status', () => {
      renderDashboard()
      
      // TeamStatus should be rendered (we'll test it separately)
      expect(screen.getByText('SOC Team Status')).toBeInTheDocument()
    })

    it('renders threat landscape chart', () => {
      renderDashboard()
      
      expect(screen.getByTestId('threat-landscape-chart')).toBeInTheDocument()
    })
  })

  describe('Threat Landscape Data Calculation', () => {
    it('calculates threat data from alerts correctly', () => {
      const testAlerts = [
        createMockAlert({ severity: 'Critical' }),
        createMockAlert({ severity: 'Critical' }),
        createMockAlert({ severity: 'High' }),
        createMockAlert({ severity: 'Medium' }),
        createMockAlert({ severity: 'Low' })
      ]

      renderDashboard({ alerts: testAlerts })
      
      const chartData = ChartTestUtils.getChartData('threat-landscape-chart')
      expect(chartData).toEqual({
        critical: 2,
        high: 1,
        medium: 1,
        low: 1
      })
    })

    it('shows sample data when no alerts exist', () => {
      renderDashboard({ alerts: [] })
      
      const chartData = ChartTestUtils.getChartData('threat-landscape-chart')
      expect(chartData).toEqual({
        critical: 2,
        high: 8,
        medium: 15,
        low: 25
      })
    })

    it('handles mixed case severity levels', () => {
      const testAlerts = [
        createMockAlert({ severity: 'CRITICAL' as any }),
        createMockAlert({ severity: 'high' as any }),
        createMockAlert({ severity: 'Medium' }),
        createMockAlert({ severity: 'LOW' as any })
      ]

      renderDashboard({ alerts: testAlerts })
      
      const chartData = ChartTestUtils.getChartData('threat-landscape-chart')
      expect(chartData).toEqual({
        critical: 1,
        high: 1,
        medium: 1,
        low: 1
      })
    })

    it('ignores unknown severity levels', () => {
      const testAlerts = [
        createMockAlert({ severity: 'Critical' }),
        createMockAlert({ severity: 'Unknown' as any }),
        createMockAlert({ severity: 'Invalid' as any })
      ]

      renderDashboard({ alerts: testAlerts })
      
      const chartData = ChartTestUtils.getChartData('threat-landscape-chart')
      expect(chartData).toEqual({
        critical: 1,
        high: 0,
        medium: 0,
        low: 0
      })
    })
  })

  describe('System Health Section', () => {
    it('renders system health metrics', () => {
      renderDashboard()
      
      expect(screen.getByText('System Status')).toBeInTheDocument()
      expect(screen.getByText('All Systems Operational')).toBeInTheDocument()
      
      expect(screen.getByText('Data Processing')).toBeInTheDocument()
      expect(screen.getByText('Real-time Processing Active')).toBeInTheDocument()
      
      expect(screen.getByText('Threat Detection')).toBeInTheDocument()
      expect(screen.getByText('AI Models Running')).toBeInTheDocument()
    })

    it('renders system health icons', () => {
      renderDashboard()
      
      const healthSection = screen.getByText('System Health').closest('[class*="dashboardCard"]')
      expect(healthSection).toBeInTheDocument()
      
      // Check for Font Awesome icons (they should be rendered as <i> elements)
      const icons = healthSection?.querySelectorAll('i.fas')
      expect(icons).toHaveLength(3)
    })

    it('shows proper status classes', () => {
      renderDashboard()
      
      const statusElements = screen.getAllByText(/All Systems Operational|Real-time Processing Active|AI Models Running/)
      statusElements.forEach(element => {
        expect(element.className).toMatch(/statusOnline/)
      })
    })
  })

  describe('Loading States', () => {
    it('passes loading state to threat chart', () => {
      renderDashboard({ loading: { alerts: true } })
      
      const chart = screen.getByTestId('threat-landscape-chart')
      expect(chart).toHaveAttribute('data-loading', 'true')
    })

    it('handles loading state for alerts', () => {
      renderDashboard({ loading: { alerts: true } })
      
      // The chart should still render but with loading state
      expect(screen.getByTestId('threat-landscape-chart')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles missing alerts gracefully', () => {
      renderDashboard({ alerts: undefined })
      
      expect(screen.getByText('SOC Dashboard')).toBeInTheDocument()
      // Should show sample data when alerts is undefined
      const chartData = ChartTestUtils.getChartData('threat-landscape-chart')
      expect(chartData).toEqual({
        critical: 2,
        high: 8,
        medium: 15,
        low: 25
      })
    })

    it('handles empty loading state', () => {
      renderDashboard({ loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false } })
      
      expect(screen.getByTestId('threat-landscape-chart')).toBeInTheDocument()
    })

    it('handles missing loading state', () => {
      renderDashboard({ loading: undefined })
      
      expect(screen.getByTestId('threat-landscape-chart')).toBeInTheDocument()
    })
  })

  describe('Dashboard Layout', () => {
    it('has proper CSS classes for layout', () => {
      renderDashboard()
      
      const dashboard = screen.getByText('SOC Dashboard').closest('[class*="dashboard"]')
      expect(dashboard).toBeInTheDocument()
      
      const dashboardGrid = dashboard?.querySelector('[class*="dashboardGrid"]')
      expect(dashboardGrid).toBeInTheDocument()
      
      const dashboardCards = dashboard?.querySelectorAll('[class*="dashboardCard"]')
      expect(dashboardCards).toHaveLength(4) // Recent Alerts, Team Status, Threat Landscape, System Health
    })

    it('renders section header with proper structure', () => {
      renderDashboard()
      
      const sectionHeader = screen.getByText('SOC Dashboard').closest('[class*="sectionHeader"]')
      expect(sectionHeader).toBeInTheDocument()
      expect(sectionHeader).toContainElement(screen.getByText('Real-time security operations center overview'))
    })

    it('renders chart container with proper structure', () => {
      renderDashboard()
      
      const chartContainer = screen.getByTestId('threat-landscape-chart').closest('[class*="chartContainer"]')
      expect(chartContainer).toBeInTheDocument()
    })
  })

  describe('Integration with Context', () => {
    it('uses alerts from context', () => {
      const customAlerts = [
        createMockAlert({ id: 'custom-1', severity: 'Critical' }),
        createMockAlert({ id: 'custom-2', severity: 'High' })
      ]

      renderDashboard({ alerts: customAlerts })
      
      const chartData = ChartTestUtils.getChartData('threat-landscape-chart')
      expect(chartData).toEqual({
        critical: 1,
        high: 1,
        medium: 0,
        low: 0
      })
    })

    it('uses loading state from context', () => {
      renderDashboard({ loading: { alerts: true } })
      
      const chart = screen.getByTestId('threat-landscape-chart')
      expect(chart).toHaveAttribute('data-loading', 'true')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderDashboard()
      
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent('SOC Dashboard')
      
      const h3Elements = screen.getAllByRole('heading', { level: 3 })
      expect(h3Elements.length).toBeGreaterThanOrEqual(4) // At least Recent Alerts, SOC Team Status, Threat Landscape, System Health
    })

    it('has descriptive section content', () => {
      renderDashboard()
      
      expect(screen.getByText('Real-time security operations center overview')).toBeInTheDocument()
    })

    it('provides meaningful labels for health status', () => {
      renderDashboard()
      
      expect(screen.getByText('System Status')).toBeInTheDocument()
      expect(screen.getByText('Data Processing')).toBeInTheDocument()
      expect(screen.getByText('Threat Detection')).toBeInTheDocument()
    })
  })

  describe('Real-time Updates', () => {
    it('updates threat chart when alerts change', () => {
      const { rerender } = renderDashboard({ alerts: [createMockAlert({ severity: 'Critical' })] })
      
      let chartData = ChartTestUtils.getChartData('threat-landscape-chart')
      expect(chartData.critical).toBe(1)
      
      // Update with new alerts
      const newAlerts = [
        createMockAlert({ severity: 'Critical' }),
        createMockAlert({ severity: 'High' })
      ]
      
      rerender(
        <AppProvider initialState={{ alerts: newAlerts, loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false } }}>
          <Dashboard />
        </AppProvider>
      )
      
      chartData = ChartTestUtils.getChartData('threat-landscape-chart')
      expect(chartData.critical).toBe(1)
      expect(chartData.high).toBe(1)
    })
  })
})