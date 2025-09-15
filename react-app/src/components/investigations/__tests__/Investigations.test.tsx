/**
 * Investigations Component Tests
 * 
 * Tests for the Investigations component including investigation selection,
 * details display, timeline visualization, and state management.
 */

import React from 'react'
import { render, screen } from '../../../test/test-utils'
import { TestHelpers } from '../../../test/test-helpers'
import { Investigations } from '../Investigations'
import { mockInvestigations, mockAlerts } from '../../../test/mock-data'
import { AppProvider } from '../../../context/AppContext'

describe('Investigations Component', () => {
  const renderInvestigations = (initialState = {}) => {
    const defaultState = {
      investigations: mockInvestigations,
      alerts: mockAlerts,
      selectedInvestigation: null,
      loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false },
      errors: { alerts: null, investigations: null, integrations: null, metrics: null, incidents: null },
      ...initialState
    }

    return render(
      <AppProvider initialState={defaultState}>
        <Investigations />
      </AppProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders investigation workspace', () => {
      renderInvestigations()
      
      expect(screen.getByTestId('investigation-list')).toBeInTheDocument()
      expect(screen.getByTestId('investigation-details')).toBeInTheDocument()
    })

    it('renders investigation list with investigations', () => {
      renderInvestigations()
      
      // Check for investigations header
      expect(screen.getByText('Investigations')).toBeInTheDocument()
      
      // Check that investigations are displayed
      mockInvestigations.forEach(investigation => {
        expect(screen.getByText(investigation.id)).toBeInTheDocument()
        expect(screen.getByText(investigation.status)).toBeInTheDocument()
      })
    })

    it('shows empty state when no investigation is selected', () => {
      renderInvestigations()
      
      expect(screen.getByText('No Investigation Selected')).toBeInTheDocument()
      expect(screen.getByText(/Select an investigation from the list/)).toBeInTheDocument()
    })
  })

  describe('Investigation Selection', () => {
    it('selects investigation when clicked', async () => {
      renderInvestigations()
      
      // Find and click the first investigation (use getAllByText since ID appears in both list and details)
      const firstInvestigationElements = screen.getAllByText(mockInvestigations[0].id)
      const firstInvestigationInList = firstInvestigationElements[0] // First occurrence should be in the list
      await TestHelpers.user.click(firstInvestigationInList)
      
      // Should show investigation details
      expect(screen.getByText(`Assigned to: ${mockInvestigations[0].assignedTo}`)).toBeInTheDocument()
    })

    it('updates selected investigation when different one is clicked', async () => {
      renderInvestigations()
      
      // Select first investigation
      const firstInvestigation = screen.getByText(mockInvestigations[0].id)
      await TestHelpers.user.click(firstInvestigation)
      
      // Verify first investigation is selected
      expect(screen.getByText(`Assigned to: ${mockInvestigations[0].assignedTo}`)).toBeInTheDocument()
      
      // Select second investigation
      const secondInvestigation = screen.getByText(mockInvestigations[1].id)
      await TestHelpers.user.click(secondInvestigation)
      
      // Verify second investigation is now selected
      expect(screen.getByText(`Assigned to: ${mockInvestigations[1].assignedTo}`)).toBeInTheDocument()
    })

    it('shows selected state in investigation list', async () => {
      renderInvestigations()
      
      const firstInvestigationElements = screen.getAllByText(mockInvestigations[0].id)
      const firstInvestigation = firstInvestigationElements[0]
      const investigationItem = firstInvestigation.closest('[role="button"]')
      
      await TestHelpers.user.click(firstInvestigation)
      
      expect(investigationItem?.className).toMatch(/active/)
    })
  })

  describe('Investigation Details Display', () => {
    it('displays investigation timeline when selected', async () => {
      renderInvestigations()
      
      const firstInvestigation = screen.getByText(mockInvestigations[0].id)
      await TestHelpers.user.click(firstInvestigation)
      
      // Check for timeline section
      expect(screen.getByText('Investigation Timeline')).toBeInTheDocument()
      
      // Check timeline events
      const timeline = mockInvestigations[0].timeline
      timeline.forEach((event) => {
        expect(screen.getByText(event.event)).toBeInTheDocument()
      })
    })

    it('displays investigation evidence when selected', async () => {
      renderInvestigations()
      
      const firstInvestigation = screen.getByText(mockInvestigations[0].id)
      await TestHelpers.user.click(firstInvestigation)
      
      // Check for evidence section
      expect(screen.getByText('Evidence & Artifacts')).toBeInTheDocument()
      
      // Check evidence items
      const evidence = mockInvestigations[0].evidence
      evidence.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument()
      })
    })

    it('displays related alert information', async () => {
      renderInvestigations()
      
      const firstInvestigation = screen.getByText(mockInvestigations[0].id)
      await TestHelpers.user.click(firstInvestigation)
      
      expect(screen.getByText(`Related Alert: ${mockInvestigations[0].alertId}`)).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('shows loading state for investigation list', () => {
      renderInvestigations({ 
        loading: { investigations: true, alerts: false, integrations: false, metrics: false, incidents: false }
      })
      
      // Should show loading skeletons in the investigation list
      const investigationList = screen.getByTestId('investigation-list')
      const loadingSkeletons = investigationList.querySelectorAll('[class*="loading"]')
      expect(loadingSkeletons.length).toBeGreaterThan(0)
    })

    it('shows loading state for investigation details', () => {
      renderInvestigations({ 
        selectedInvestigation: mockInvestigations[0].id,
        loading: { investigations: true, alerts: false, integrations: false, metrics: false, incidents: false }
      })
      
      // Should show loading skeletons in details area
      const investigationDetails = screen.getByTestId('investigation-details')
      const loadingSkeletons = investigationDetails.querySelectorAll('[class*="loading"]')
      expect(loadingSkeletons.length).toBeGreaterThan(0)
    })
  })

  describe('Error States', () => {
    it('shows error state for investigation list', () => {
      renderInvestigations({ 
        errors: { investigations: 'Failed to load investigations', alerts: null, integrations: null, metrics: null, incidents: null }
      })
      
      expect(screen.getByText(/Error loading investigations/)).toBeInTheDocument()
    })

    it('shows error state for investigation details', () => {
      renderInvestigations({ 
        selectedInvestigation: mockInvestigations[0].id,
        errors: { investigations: 'Failed to load investigation details', alerts: null, integrations: null, metrics: null, incidents: null }
      })
      
      expect(screen.getByText(/Error loading investigation details/)).toBeInTheDocument()
    })
  })

  describe('Integration with Context', () => {
    it('displays investigation count', () => {
      renderInvestigations()
      
      expect(screen.getByText(mockInvestigations.length.toString())).toBeInTheDocument()
    })

    it('updates context when investigation is selected', async () => {
      const { rerender } = renderInvestigations()
      
      const firstInvestigation = screen.getByText(mockInvestigations[0].id)
      await TestHelpers.user.click(firstInvestigation)
      
      // Re-render with updated state
      rerender(
        <AppProvider initialState={{
          investigations: mockInvestigations,
          alerts: mockAlerts,
          selectedInvestigation: mockInvestigations[0].id,
          loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false },
          errors: { alerts: null, investigations: null, integrations: null, metrics: null, incidents: null }
        }}>
          <Investigations />
        </AppProvider>
      )
      
      expect(screen.getByText(`Assigned to: ${mockInvestigations[0].assignedTo}`)).toBeInTheDocument()
    })
  })

  describe('Real-time Updates', () => {
    it('updates when investigations change', () => {
      const { rerender } = renderInvestigations({ investigations: [mockInvestigations[0]] })
      
      expect(screen.getByText(mockInvestigations[0].id)).toBeInTheDocument()
      expect(screen.queryByText(mockInvestigations[1].id)).not.toBeInTheDocument()
      
      // Update with new investigations
      rerender(
        <AppProvider initialState={{
          investigations: mockInvestigations,
          alerts: mockAlerts,
          selectedInvestigation: null,
          loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false },
          errors: { alerts: null, investigations: null, integrations: null, metrics: null, incidents: null }
        }}>
          <Investigations />
        </AppProvider>
      )
      
      expect(screen.getByText(mockInvestigations[1].id)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderInvestigations()
      
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
      
      // Check for main headings
      expect(screen.getByRole('heading', { name: /investigations/i })).toBeInTheDocument()
    })

    it('provides descriptive content', () => {
      renderInvestigations()
      
      expect(screen.getByText(/Select an investigation from the list/)).toBeInTheDocument()
    })

    it('maintains keyboard navigation', async () => {
      renderInvestigations()
      
      const firstInvestigation = screen.getByText(mockInvestigations[0].id)
      const investigationItem = firstInvestigation.closest('[role="button"]')
      
      if (investigationItem) {
        (investigationItem as HTMLElement).focus()
        expect(document.activeElement).toBe(investigationItem)
        
        // Simulate Enter key press
        await TestHelpers.user.keyboard('{Enter}')
        
        expect(screen.getByText(`Assigned to: ${mockInvestigations[0].assignedTo}`)).toBeInTheDocument()
      }
    })
  })
})