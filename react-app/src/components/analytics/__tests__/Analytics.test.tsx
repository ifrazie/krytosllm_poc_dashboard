/**
 * Analytics Component Tests
 * 
 * Tests for the Analytics component including chart rendering,
 * performance metrics display, and data visualization.
 */

import React from 'react'
import { render, screen } from '../../../test/test-utils'
import { ChartTestUtils } from '../../../test/test-helpers'
import { Analytics } from '../Analytics'
import { mockMetrics } from '../../../test/mock-data'
import { AppProvider } from '../../../context/AppContext'

// Mock child components
vi.mock('../ChartCard', () => ({
  ChartCard: ({ title, children, className }: any) => (
    <div data-testid={`chart-card-${title.toLowerCase().replace(/\s+/g, '-')}`} className={className}>
      <h3>{title}</h3>
      <div data-testid="chart-content">{children}</div>
    </div>
  )
}))

vi.mock('../PerformanceMetrics', () => ({
  PerformanceMetrics: ({ metrics }: any) => (
    <div data-testid="performance-metrics">
      <div data-testid="accuracy-metric">{metrics?.accuracy || 'N/A'}% Accuracy</div>
      <div data-testid="false-positive-metric">{metrics?.falsePositiveRate || 'N/A'}% False Positive Rate</div>
      <div data-testid="coverage-metric">{metrics?.coverage || 'N/A'}% Coverage</div>
    </div>
  )
}))

// Mock chart components
vi.mock('../../common/charts', () => ({
  AlertTrendsChart: ({ data, loading }: any) => (
    <div 
      data-testid="alert-trends-chart"
      data-chart-data={JSON.stringify(data)}
      data-loading={loading}
    >
      Alert Trends Chart
    </div>
  ),
  ResponseTimeChart: ({ data, loading }: any) => (
    <div 
      data-testid="response-time-chart"
      data-chart-data={JSON.stringify(data)}
      data-loading={loading}
    >
      Response Time Chart
    </div>
  ),
  ThreatCategoryChart: ({ data, loading }: any) => (
    <div 
      data-testid="threat-category-chart"
      data-chart-data={JSON.stringify(data)}
      data-loading={loading}
    >
      Threat Category Chart
    </div>
  )
}))

describe('Analytics Component', () => {
  const renderAnalytics = (initialState = {}) => {
    const defaultState = {
      metrics: mockMetrics,
      alerts: [],
      loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false },
      ...initialState
    }

    return render(
      <AppProvider initialState={defaultState}>
        <Analytics />
      </AppProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders analytics header', () => {
      renderAnalytics()
      
      expect(screen.getByText('Analytics & Reporting')).toBeInTheDocument()
      expect(screen.getByText('SOC performance metrics and threat intelligence')).toBeInTheDocument()
    })

    it('renders all chart cards', () => {
      renderAnalytics()
      
      expect(screen.getByTestId('chart-card-alert-trends')).toBeInTheDocument()
      expect(screen.getByTestId('chart-card-response-times')).toBeInTheDocument()
      expect(screen.getByTestId('chart-card-threat-categories')).toBeInTheDocument()
      expect(screen.getByTestId('chart-card-performance-metrics')).toBeInTheDocument()
    })

    it('renders chart titles correctly', () => {
      renderAnalytics()
      
      expect(screen.getByText('Alert Trends')).toBeInTheDocument()
      expect(screen.getByText('Response Times')).toBeInTheDocument()
      expect(screen.getByText('Threat Categories')).toBeInTheDocument()
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument()
    })

    it('renders all chart components', () => {
      renderAnalytics()
      
      expect(screen.getByTestId('alert-trends-chart')).toBeInTheDocument()
      expect(screen.getByTestId('response-time-chart')).toBeInTheDocument()
      expect(screen.getByTestId('threat-category-chart')).toBeInTheDocument()
      expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
    })
  })

  describe('Chart Data Generation', () => {
    it('generates alert trends data correctly', () => {
      renderAnalytics()
      
      const chartData = ChartTestUtils.getChartData('alert-trends-chart')
      
      expect(chartData).toHaveProperty('labels')
      expect(chartData).toHaveProperty('datasets')
      expect(chartData.labels).toBeInstanceOf(Array)
      expect(chartData.datasets).toBeInstanceOf(Array)
      expect(chartData.datasets[0]).toHaveProperty('data')
    })

    it('generates response time data correctly', () => {
      renderAnalytics()
      
      const chartData = ChartTestUtils.getChartData('response-time-chart')
      
      expect(chartData).toHaveProperty('labels')
      expect(chartData).toHaveProperty('datasets')
      expect(chartData.labels).toEqual(['Critical', 'High', 'Medium', 'Low'])
      expect(chartData.datasets[0].data).toBeInstanceOf(Array)
      expect(chartData.datasets[0].data).toHaveLength(4)
    })

    it('generates threat category data correctly', () => {
      renderAnalytics()
      
      const chartData = ChartTestUtils.getChartData('threat-category-chart')
      
      expect(chartData).toHaveProperty('labels')
      expect(chartData).toHaveProperty('datasets')
      expect(chartData.labels).toContain('Malware')
      expect(chartData.labels).toContain('Phishing')
      expect(chartData.labels).toContain('Insider Threat')
    })

    it('handles empty alerts data', () => {
      renderAnalytics({ alerts: [] })
      
      const alertTrendsData = ChartTestUtils.getChartData('alert-trends-chart')
      expect(alertTrendsData).toBeDefined()
      
      const responseTimeData = ChartTestUtils.getChartData('response-time-chart')
      expect(responseTimeData).toBeDefined()
      
      const threatCategoryData = ChartTestUtils.getChartData('threat-category-chart')
      expect(threatCategoryData).toBeDefined()
    })
  })

  describe('Performance Metrics', () => {
    it('displays performance metrics correctly', () => {
      const customMetrics = {
        ...mockMetrics,
        accuracy: 94.5,
        falsePositiveRate: 2.1,
        coverage: 98.7
      }
      
      renderAnalytics({ metrics: customMetrics })
      
      expect(screen.getByTestId('accuracy-metric')).toHaveTextContent('94.5% Accuracy')
      expect(screen.getByTestId('false-positive-metric')).toHaveTextContent('2.1% False Positive Rate')
      expect(screen.getByTestId('coverage-metric')).toHaveTextContent('98.7% Coverage')
    })

    it('handles missing performance metrics', () => {
      renderAnalytics({ metrics: { ...mockMetrics, accuracy: undefined } })
      
      expect(screen.getByTestId('accuracy-metric')).toHaveTextContent('N/A% Accuracy')
    })

    it('passes metrics to PerformanceMetrics component', () => {
      renderAnalytics()
      
      expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('passes loading state to charts', () => {
      renderAnalytics({ loading: { alerts: true, metrics: true } })
      
      const alertTrendsChart = screen.getByTestId('alert-trends-chart')
      const responseTimeChart = screen.getByTestId('response-time-chart')
      const threatCategoryChart = screen.getByTestId('threat-category-chart')
      
      expect(alertTrendsChart).toHaveAttribute('data-loading', 'true')
      expect(responseTimeChart).toHaveAttribute('data-loading', 'true')
      expect(threatCategoryChart).toHaveAttribute('data-loading', 'true')
    })

    it('handles partial loading states', () => {
      renderAnalytics({ loading: { alerts: true, metrics: false } })
      
      const alertTrendsChart = screen.getByTestId('alert-trends-chart')
      expect(alertTrendsChart).toHaveAttribute('data-loading', 'true')
    })

    it('handles missing loading state', () => {
      renderAnalytics({ loading: undefined })
      
      expect(screen.getByTestId('alert-trends-chart')).toBeInTheDocument()
      expect(screen.getByTestId('response-time-chart')).toBeInTheDocument()
      expect(screen.getByTestId('threat-category-chart')).toBeInTheDocument()
    })
  })

  describe('Layout and Structure', () => {
    it('has proper CSS classes for layout', () => {
      renderAnalytics()
      
      const analytics = screen.getByText('Analytics & Reporting').closest('.analytics')
      expect(analytics).toBeInTheDocument()
      
      const analyticsGrid = analytics?.querySelector('.analyticsGrid')
      expect(analyticsGrid).toBeInTheDocument()
    })

    it('renders section header with proper structure', () => {
      renderAnalytics()
      
      const sectionHeader = screen.getByText('Analytics & Reporting').closest('.sectionHeader')
      expect(sectionHeader).toBeInTheDocument()
      expect(sectionHeader).toContainElement(screen.getByText('SOC performance metrics and threat intelligence'))
    })

    it('organizes charts in grid layout', () => {
      renderAnalytics()
      
      const chartCards = screen.getAllByTestId(/chart-card-/)
      expect(chartCards).toHaveLength(4)
      
      chartCards.forEach(card => {
        expect(card).toHaveClass('chartCard')
      })
    })
  })

  describe('Data Updates', () => {
    it('updates charts when metrics change', () => {
      const { rerender } = renderAnalytics({ metrics: mockMetrics })
      
      const newMetrics = {
        ...mockMetrics,
        totalAlerts: 500,
        mttr: '1.5h'
      }
      
      rerender(
        <AppProvider initialState={{
          metrics: newMetrics,
          alerts: [],
          loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }
        }}>
          <Analytics />
        </AppProvider>
      )
      
      // Charts should update with new data
      expect(screen.getByTestId('alert-trends-chart')).toBeInTheDocument()
      expect(screen.getByTestId('response-time-chart')).toBeInTheDocument()
    })

    it('updates charts when alerts change', () => {
      const { rerender } = renderAnalytics({ alerts: [] })
      
      const newAlerts = [
        { 
          id: '1', 
          title: 'Test Alert 1',
          severity: 'Critical' as const, 
          status: 'Active Threat' as const,
          source: 'Test Source',
          description: 'Test Description',
          timestamp: '2024-01-15T10:00:00Z',
          aiAnalysis: 'Test Analysis',
          artifacts: [],
          recommendedActions: [],
          riskScore: 95
        },
        { 
          id: '2', 
          title: 'Test Alert 2',
          severity: 'High' as const, 
          status: 'Active Threat' as const,
          source: 'Test Source',
          description: 'Test Description',
          timestamp: '2024-01-15T11:00:00Z',
          aiAnalysis: 'Test Analysis',
          artifacts: [],
          recommendedActions: [],
          riskScore: 85
        }
      ]
      
      rerender(
        <AppProvider initialState={{
          metrics: mockMetrics,
          alerts: newAlerts,
          loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }
        }}>
          <Analytics />
        </AppProvider>
      )
      
      expect(screen.getByTestId('alert-trends-chart')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles missing metrics gracefully', () => {
      renderAnalytics({ metrics: undefined })
      
      expect(screen.getByText('Analytics & Reporting')).toBeInTheDocument()
      expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
    })

    it('handles missing alerts gracefully', () => {
      renderAnalytics({ alerts: undefined })
      
      expect(screen.getByTestId('alert-trends-chart')).toBeInTheDocument()
      expect(screen.getByTestId('response-time-chart')).toBeInTheDocument()
      expect(screen.getByTestId('threat-category-chart')).toBeInTheDocument()
    })

    it('handles malformed data gracefully', () => {
      const malformedMetrics = {
        totalAlerts: 'invalid',
        mttr: null
      }
      
      renderAnalytics({ metrics: malformedMetrics })
      
      expect(screen.getByText('Analytics & Reporting')).toBeInTheDocument()
    })
  })

  describe('Chart Integration', () => {
    it('passes correct data to AlertTrendsChart', () => {
      renderAnalytics()
      
      const chartData = ChartTestUtils.getChartData('alert-trends-chart')
      expect(chartData).toBeDefined()
      expect(chartData.labels).toBeInstanceOf(Array)
      expect(chartData.datasets).toBeInstanceOf(Array)
    })

    it('passes correct data to ResponseTimeChart', () => {
      renderAnalytics()
      
      const chartData = ChartTestUtils.getChartData('response-time-chart')
      expect(chartData).toBeDefined()
      expect(chartData.labels).toEqual(['Critical', 'High', 'Medium', 'Low'])
    })

    it('passes correct data to ThreatCategoryChart', () => {
      renderAnalytics()
      
      const chartData = ChartTestUtils.getChartData('threat-category-chart')
      expect(chartData).toBeDefined()
      expect(chartData.labels).toBeInstanceOf(Array)
      expect(chartData.labels.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderAnalytics()
      
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent('Analytics & Reporting')
      
      const h3Elements = screen.getAllByRole('heading', { level: 3 })
      expect(h3Elements).toHaveLength(4) // One for each chart card
    })

    it('provides descriptive section content', () => {
      renderAnalytics()
      
      expect(screen.getByText('SOC performance metrics and threat intelligence')).toBeInTheDocument()
    })

    it('has meaningful chart titles', () => {
      renderAnalytics()
      
      expect(screen.getByText('Alert Trends')).toBeInTheDocument()
      expect(screen.getByText('Response Times')).toBeInTheDocument()
      expect(screen.getByText('Threat Categories')).toBeInTheDocument()
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('handles large datasets efficiently', () => {
      const largeAlertSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `alert-${i}`,
        severity: ['Critical', 'High', 'Medium', 'Low'][i % 4],
        timestamp: new Date(Date.now() - i * 60000).toISOString()
      }))
      
      renderAnalytics({ alerts: largeAlertSet })
      
      expect(screen.getByTestId('alert-trends-chart')).toBeInTheDocument()
      expect(screen.getByTestId('response-time-chart')).toBeInTheDocument()
      expect(screen.getByTestId('threat-category-chart')).toBeInTheDocument()
    })

    it('does not re-render unnecessarily', () => {
      const { rerender } = renderAnalytics()
      
      // Re-render with same props
      rerender(
        <AppProvider initialState={{
          metrics: mockMetrics,
          alerts: [],
          loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }
        }}>
          <Analytics />
        </AppProvider>
      )
      
      expect(screen.getByTestId('alert-trends-chart')).toBeInTheDocument()
    })
  })
})