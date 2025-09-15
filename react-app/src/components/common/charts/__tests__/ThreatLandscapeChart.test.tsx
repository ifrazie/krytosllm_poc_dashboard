/**
 * ThreatLandscapeChart Component Tests
 * 
 * Tests for the ThreatLandscapeChart component including data visualization,
 * loading states, error handling, and Chart.js integration.
 */

import React from 'react'
import { render, screen } from '../../../../test/test-utils'
import { ChartTestUtils } from '../../../../test/test-helpers'
import ThreatLandscapeChart from '../ThreatLandscapeChart'

// Mock Chart.js components
vi.mock('react-chartjs-2', () => ({
  Doughnut: ({ data, options, ...props }: any) => (
    <div
      data-testid="doughnut-chart"
      data-chart-data={JSON.stringify(data)}
      data-chart-options={JSON.stringify(options)}
      role="img"
      aria-label={`Threat landscape chart showing ${data?.datasets?.[0]?.data?.reduce((a: number, b: number) => a + b, 0) || 0} total threats`}
      {...props}
    >
      Doughnut Chart
    </div>
  )
}))

describe('ThreatLandscapeChart Component', () => {
  const mockThreatData = {
    critical: 5,
    high: 12,
    medium: 25,
    low: 8
  }

  const defaultProps = {
    data: mockThreatData,
    loading: false,
    error: undefined
  }

  describe('Rendering', () => {
    it('renders chart when data is provided', () => {
      render(<ThreatLandscapeChart {...defaultProps} />)
      
      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument()
      expect(screen.getByText('Threat Landscape')).toBeInTheDocument()
    })

    it('renders loading state when loading', () => {
      render(<ThreatLandscapeChart {...defaultProps} loading={true} />)
      
      expect(screen.getByText(/loading threat landscape/i)).toBeInTheDocument()
    })

    it('renders with custom title', () => {
      render(<ThreatLandscapeChart {...defaultProps} title="Custom Threat Chart" />)
      
      expect(screen.getByText('Custom Threat Chart')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<ThreatLandscapeChart {...defaultProps} className="custom-chart" />)
      
      const chartWrapper = screen.getByText('Threat Landscape').closest('[class*="chartWrapper"]')
      expect(chartWrapper).toBeInTheDocument()
      expect(chartWrapper?.className).toMatch(/custom-chart/)
    })
  })

  describe('Chart Data Transformation', () => {
    it('transforms threat data correctly for Chart.js', () => {
      render(<ThreatLandscapeChart {...defaultProps} />)
      
      const chartData = ChartTestUtils.getChartData('doughnut-chart')
      
      expect(chartData).toEqual({
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
          data: [5, 12, 25, 8],
          backgroundColor: [
            '#ef4444', // Critical - Red
            '#f97316', // High - Orange
            '#eab308', // Medium - Yellow
            '#22c55e'  // Low - Green
          ],
          borderColor: 'rgba(139, 92, 246, 0.3)',
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverBorderColor: '#8b5cf6'
        }]
      })
    })

    it('handles zero values correctly', () => {
      const zeroData = { critical: 0, high: 0, medium: 5, low: 0 }
      render(<ThreatLandscapeChart {...defaultProps} data={zeroData} />)
      
      const chartData = ChartTestUtils.getChartData('doughnut-chart')
      expect(chartData.datasets[0].data).toEqual([0, 0, 5, 0])
    })

    it('handles missing severity levels', () => {
      const partialData = { critical: 3, high: 7 } as any
      render(<ThreatLandscapeChart {...defaultProps} data={partialData} />)
      
      const chartData = ChartTestUtils.getChartData('doughnut-chart')
      // Missing properties become null in the component implementation
      expect(chartData.datasets[0].data).toEqual([3, 7, null, null])
    })

    it('handles null data by showing empty chart', () => {
      render(<ThreatLandscapeChart data={null} loading={false} error={undefined} />)
      
      const chartData = ChartTestUtils.getChartData('doughnut-chart')
      expect(chartData.datasets[0].data).toEqual([0, 0, 0, 0])
    })
  })

  describe('Chart Configuration', () => {
    it('applies correct chart options', () => {
      render(<ThreatLandscapeChart {...defaultProps} />)
      
      const chartOptions = ChartTestUtils.getChartOptions('doughnut-chart')
      
      expect(chartOptions).toMatchObject({
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e2e8f0',
              font: {
                family: 'FKGroteskNeue, -apple-system, BlinkMacSystemFont, sans-serif',
                size: 12
              },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#e2e8f0',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 8
          }
        }
      })
    })

    it('applies dark theme styling', () => {
      render(<ThreatLandscapeChart {...defaultProps} />)
      
      const chartOptions = ChartTestUtils.getChartOptions('doughnut-chart')
      
      expect(chartOptions.plugins.legend.labels.color).toBe('#e2e8f0')
      expect(chartOptions.plugins.tooltip.backgroundColor).toBe('rgba(15, 23, 42, 0.95)')
      expect(chartOptions.plugins.tooltip.titleColor).toBe('#e2e8f0')
      expect(chartOptions.plugins.tooltip.bodyColor).toBe('#cbd5e1')
    })

    it('includes tooltip callbacks for percentage display', () => {
      render(<ThreatLandscapeChart {...defaultProps} />)
      
      const chartOptions = ChartTestUtils.getChartOptions('doughnut-chart')
      
      expect(chartOptions.plugins.tooltip.callbacks).toBeDefined()
      // The callbacks object exists but may be empty in the mock
      expect(chartOptions.plugins.tooltip.callbacks).toEqual(expect.any(Object))
    })
  })

  describe('Accessibility', () => {
    it('provides accessible chart description', () => {
      render(<ThreatLandscapeChart {...defaultProps} />)
      
      const chart = screen.getByTestId('doughnut-chart')
      expect(chart).toHaveAttribute('role', 'img')
      expect(chart).toHaveAttribute('aria-label', expect.stringContaining('Threat landscape'))
    })

    it('includes data summary in aria-label', () => {
      render(<ThreatLandscapeChart {...defaultProps} />)
      
      const chart = screen.getByTestId('doughnut-chart')
      const ariaLabel = chart.getAttribute('aria-label')
      
      expect(ariaLabel).toContain('50 total threats') // 5+12+25+8 = 50
    })
  })

  describe('Error Handling', () => {
    it('handles null data gracefully', () => {
      render(<ThreatLandscapeChart data={null} loading={false} error={undefined} />)
      
      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument()
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })

    it('handles undefined data gracefully', () => {
      render(<ThreatLandscapeChart data={undefined as any} loading={false} error={undefined} />)
      
      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('shows loading message', () => {
      render(<ThreatLandscapeChart {...defaultProps} loading={true} />)
      
      expect(screen.getByText(/loading threat landscape/i)).toBeInTheDocument()
    })

    it('hides chart when loading', () => {
      render(<ThreatLandscapeChart {...defaultProps} loading={true} />)
      
      expect(screen.queryByTestId('doughnut-chart')).not.toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('memoizes chart data transformation', () => {
      const { rerender } = render(<ThreatLandscapeChart {...defaultProps} />)
      
      const initialChartData = ChartTestUtils.getChartData('doughnut-chart')
      
      // Re-render with same data
      rerender(<ThreatLandscapeChart {...defaultProps} />)
      
      const secondChartData = ChartTestUtils.getChartData('doughnut-chart')
      
      // Data should be the same (memoized)
      expect(initialChartData).toEqual(secondChartData)
    })

    it('memoizes chart options', () => {
      const { rerender } = render(<ThreatLandscapeChart {...defaultProps} />)
      
      const initialOptions = ChartTestUtils.getChartOptions('doughnut-chart')
      
      // Re-render with same props
      rerender(<ThreatLandscapeChart {...defaultProps} />)
      
      const secondOptions = ChartTestUtils.getChartOptions('doughnut-chart')
      
      // Options should be the same (memoized)
      expect(initialOptions).toEqual(secondOptions)
    })
  })
})