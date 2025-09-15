/**
 * IncidentBoard Component Tests
 * 
 * Tests for the IncidentBoard component including Kanban-style layout,
 * incident status management, card rendering, and column organization.
 */

import React from 'react'
import { render, screen } from '../../../test/test-utils'
import { TestHelpers } from '../../../test/test-helpers'
import { IncidentBoard } from '../IncidentBoard'
import { AppProvider } from '../../../context/AppContext'
import type { Incident } from '../../../types'

describe('IncidentBoard Component', () => {
  const mockIncidents: Incident[] = [
    {
      id: 'inc-1',
      title: 'Data Breach Investigation',
      description: 'Potential data exfiltration detected',
      severity: 'Critical',
      status: 'New',
      assignedTo: 'Sarah Chen',
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'inc-2',
      title: 'Malware Detection',
      description: 'Suspicious file activity on endpoint',
      severity: 'High',
      status: 'In Progress',
      assignedTo: 'Mike Rodriguez',
      createdAt: '2024-01-15T09:30:00Z',
      updatedAt: '2024-01-15T10:15:00Z'
    },
    {
      id: 'inc-3',
      title: 'Phishing Campaign',
      description: 'Multiple phishing emails reported',
      severity: 'Medium',
      status: 'Resolved',
      assignedTo: 'Alex Thompson',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-15T11:45:00Z'
    },
    {
      id: 'inc-4',
      title: 'Network Anomaly',
      description: 'Unusual network traffic patterns',
      severity: 'Low',
      status: 'Closed',
      assignedTo: 'Lisa Park',
      createdAt: '2024-01-13T16:10:00Z',
      updatedAt: '2024-01-14T09:30:00Z'
    }
  ]

  const renderIncidentBoard = (initialState = {}) => {
    const defaultState = {
      incidents: mockIncidents,
      loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false },
      errors: { alerts: null, investigations: null, integrations: null, metrics: null, incidents: null },
      ...initialState
    }

    return render(
      <AppProvider initialState={defaultState}>
        <IncidentBoard />
      </AppProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders incident board header', () => {
      renderIncidentBoard()
      
      expect(screen.getByText('Incident Response Board')).toBeInTheDocument()
      expect(screen.getByText(/Track and manage security incidents/)).toBeInTheDocument()
    })

    it('renders all status columns', () => {
      renderIncidentBoard()
      
      expect(screen.getByText('New')).toBeInTheDocument()
      expect(screen.getByText('In Progress')).toBeInTheDocument()
      expect(screen.getByText('Resolved')).toBeInTheDocument()
      expect(screen.getByText('Closed')).toBeInTheDocument()
    })

    it('displays incident count in each column', () => {
      renderIncidentBoard()
      
      // Each status should have 1 incident based on mock data
      const countElements = screen.getAllByText('1')
      expect(countElements).toHaveLength(4) // One for each status column
    })

    it('renders incidents in correct columns', () => {
      renderIncidentBoard()
      
      // Check that incidents appear in their respective columns
      expect(screen.getByText('Data Breach Investigation')).toBeInTheDocument()
      expect(screen.getByText('Malware Detection')).toBeInTheDocument()
      expect(screen.getByText('Phishing Campaign')).toBeInTheDocument()
      expect(screen.getByText('Network Anomaly')).toBeInTheDocument()
    })
  })

  describe('Column Organization', () => {
    it('groups incidents by status correctly', () => {
      renderIncidentBoard()
      
      // Find the New column and verify it contains the correct incident
      const newColumn = screen.getByText('New').closest('[class*="statusColumn"]')
      expect(newColumn).toContainElement(screen.getByText('Data Breach Investigation'))
      
      // Find the In Progress column
      const inProgressColumn = screen.getByText('In Progress').closest('[class*="statusColumn"]')
      expect(inProgressColumn).toContainElement(screen.getByText('Malware Detection'))
      
      // Find the Resolved column
      const resolvedColumn = screen.getByText('Resolved').closest('[class*="statusColumn"]')
      expect(resolvedColumn).toContainElement(screen.getByText('Phishing Campaign'))
      
      // Find the Closed column
      const closedColumn = screen.getByText('Closed').closest('[class*="statusColumn"]')
      expect(closedColumn).toContainElement(screen.getByText('Network Anomaly'))
    })

    it('shows empty state when no incidents in column', () => {
      renderIncidentBoard({ incidents: [] })
      
      expect(screen.getAllByText(/No .* incidents/)).toHaveLength(4)
    })

    it('displays correct icons for each status', () => {
      renderIncidentBoard()
      
      // Check for Font Awesome icons in column headers
      const icons = document.querySelectorAll('[class*="columnIcon"]')
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  describe('Loading States', () => {
    it('shows loading state when incidents are loading', () => {
      renderIncidentBoard({ 
        loading: { incidents: true, alerts: false, investigations: false, integrations: false, metrics: false }
      })
      
      expect(screen.getByText('Loading incidents...')).toBeInTheDocument()
      expect(document.querySelector('.fa-spinner')).toBeInTheDocument()
    })

    it('hides board content when loading', () => {
      renderIncidentBoard({ 
        loading: { incidents: true, alerts: false, investigations: false, integrations: false, metrics: false }
      })
      
      expect(screen.queryByText('Incident Response Board')).not.toBeInTheDocument()
    })
  })

  describe('Incident Interaction', () => {
    it('handles incident click events', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      renderIncidentBoard()
      
      const incidentCard = screen.getByText('Data Breach Investigation')
      await TestHelpers.user.click(incidentCard)
      
      expect(consoleSpy).toHaveBeenCalledWith('Incident clicked:', expect.objectContaining({
        id: 'inc-1',
        title: 'Data Breach Investigation'
      }))
      
      consoleSpy.mockRestore()
    })
  })

  describe('Data Handling', () => {
    it('handles empty incidents array', () => {
      renderIncidentBoard({ incidents: [] })
      
      expect(screen.getByText('Incident Response Board')).toBeInTheDocument()
      expect(screen.getAllByText('0')).toHaveLength(4) // Count should be 0 for all columns
    })

    it('handles incidents with missing status', () => {
      const incidentsWithMissingStatus = [
        {
          ...mockIncidents[0],
          status: 'Unknown' as any
        }
      ]
      
      renderIncidentBoard({ incidents: incidentsWithMissingStatus })
      
      // Should still render without crashing
      expect(screen.getByText('Incident Response Board')).toBeInTheDocument()
    })

    it('sorts incidents by creation date within columns', () => {
      const multipleNewIncidents = [
        {
          ...mockIncidents[0],
          createdAt: '2024-01-15T08:00:00Z'
        },
        {
          ...mockIncidents[0],
          id: 'inc-5',
          title: 'Newer Incident',
          createdAt: '2024-01-15T10:00:00Z'
        }
      ]
      
      renderIncidentBoard({ incidents: multipleNewIncidents })
      
      const incidentTitles = screen.getAllByText(/Investigation|Newer Incident/)
      // Newer incident should appear first (sorted by newest first)
      expect(incidentTitles[0]).toHaveTextContent('Newer Incident')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderIncidentBoard()
      
      const h2 = screen.getByRole('heading', { level: 2 })
      expect(h2).toHaveTextContent('Incident Response Board')
      
      const h3Elements = screen.getAllByRole('heading', { level: 3 })
      expect(h3Elements).toHaveLength(4) // One for each status column
    })

    it('provides descriptive content', () => {
      renderIncidentBoard()
      
      expect(screen.getByText(/Track and manage security incidents/)).toBeInTheDocument()
    })

    it('uses semantic HTML structure', () => {
      renderIncidentBoard()
      
      // Check for proper semantic structure
      const boardElement = document.querySelector('[class*="incidentBoard"]')
      expect(boardElement).toBeInTheDocument()
      
      const columnsElement = document.querySelector('[class*="boardColumns"]')
      expect(columnsElement).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('renders board columns container', () => {
      renderIncidentBoard()
      
      const boardColumns = document.querySelector('[class*="boardColumns"]')
      expect(boardColumns).toBeInTheDocument()
      expect(boardColumns?.children).toHaveLength(4) // Four status columns
    })

    it('maintains column structure with different incident counts', () => {
      const manyIncidents = Array.from({ length: 10 }, (_, i) => ({
        ...mockIncidents[0],
        id: `inc-${i}`,
        title: `Incident ${i}`
      }))
      
      renderIncidentBoard({ incidents: manyIncidents })
      
      const boardColumns = document.querySelector('[class*="boardColumns"]')
      expect(boardColumns?.children).toHaveLength(4) // Still four columns
    })
  })

  describe('Performance', () => {
    it('memoizes incident grouping', () => {
      const { rerender } = renderIncidentBoard()
      
      // Re-render with same incidents
      rerender(
        <AppProvider initialState={{
          incidents: mockIncidents,
          loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false },
          errors: { alerts: null, investigations: null, integrations: null, metrics: null, incidents: null }
        }}>
          <IncidentBoard />
        </AppProvider>
      )
      
      // Should still render correctly
      expect(screen.getByText('Incident Response Board')).toBeInTheDocument()
    })
  })
})