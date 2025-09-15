/**
 * useIntegrations Hook Tests
 * 
 * Tests for the useIntegrations custom hook including data filtering,
 * statistics calculation, and integration management.
 */

import React from 'react'
import { renderHook } from '@testing-library/react'
import { useIntegrations } from '../useIntegrations'
import { AppProvider } from '../../context/AppContext'
import { mockIntegrations, createMockIntegration } from '../../test/mock-data'

describe('useIntegrations Hook', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProvider initialState={{ integrations: mockIntegrations, loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }, errors: { alerts: null, investigations: null, integrations: null, metrics: null, incidents: null } }}>
      {children}
    </AppProvider>
  )

  describe('Basic Functionality', () => {
    it('returns integrations from context', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      expect(result.current.integrations).toEqual(mockIntegrations)
      expect(result.current.integrations).toHaveLength(mockIntegrations.length)
    })

    it('returns loading state from context', () => {
      const loadingWrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ 
          integrations: [], 
          loading: { alerts: false, investigations: false, integrations: true, metrics: false, incidents: false }, 
          errors: { alerts: null, investigations: null, integrations: null, metrics: null, incidents: null } 
        }}>
          {children}
        </AppProvider>
      )

      const { result } = renderHook(() => useIntegrations(), { wrapper: loadingWrapper })
      
      expect(result.current.loading).toBe(true)
    })

    it('returns error state from context', () => {
      const errorWrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ 
          integrations: [], 
          loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }, 
          errors: { alerts: null, investigations: null, integrations: "Test error", metrics: null, incidents: null } 
        }}>
          {children}
        </AppProvider>
      )

      const { result } = renderHook(() => useIntegrations(), { wrapper: errorWrapper })
      
      expect(result.current.error).toBe('Test error')
    })
  })

  describe('Integration Filtering', () => {
    it('filters integrations by status', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const connectedIntegrations = result.current.integrationsByStatus.connected
      const degradedIntegrations = result.current.integrationsByStatus.degraded
      const disconnectedIntegrations = result.current.integrationsByStatus.disconnected
      
      expect(connectedIntegrations.every(int => int.status === 'Connected')).toBe(true)
      expect(degradedIntegrations.every(int => int.status === 'Degraded')).toBe(true)
      expect(disconnectedIntegrations.every(int => int.status === 'Disconnected')).toBe(true)
    })

    it('filters integrations by health', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const healthyIntegrations = result.current.integrationsByHealth.healthy
      const warningIntegrations = result.current.integrationsByHealth.warning
      const errorIntegrations = result.current.integrationsByHealth.error
      
      expect(healthyIntegrations.every(int => int.health === 'Healthy')).toBe(true)
      expect(warningIntegrations.every(int => int.health === 'Warning')).toBe(true)
      expect(errorIntegrations.every(int => int.health === 'Error')).toBe(true)
    })

    it('identifies critical integrations', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const criticalIntegrations = result.current.criticalIntegrations
      
      criticalIntegrations.forEach(integration => {
        expect(
          integration.status === 'Disconnected' || integration.health === 'Error'
        ).toBe(true)
      })
    })

    it('identifies healthy integrations', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const healthyIntegrations = result.current.healthyIntegrations
      
      healthyIntegrations.forEach(integration => {
        expect(integration.status).toBe('Connected')
        expect(integration.health).toBe('Healthy')
      })
    })
  })

  describe('Statistics Calculation', () => {
    it('calculates integration statistics correctly', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const stats = result.current.integrationStats
      
      expect(stats.total).toBe(mockIntegrations.length)
      expect(stats.byStatus.connected).toBeGreaterThanOrEqual(0)
      expect(stats.byStatus.degraded).toBeGreaterThanOrEqual(0)
      expect(stats.byStatus.disconnected).toBeGreaterThanOrEqual(0)
      expect(stats.byHealth.healthy).toBeGreaterThanOrEqual(0)
      expect(stats.byHealth.warning).toBeGreaterThanOrEqual(0)
      expect(stats.byHealth.error).toBeGreaterThanOrEqual(0)
    })

    it('calculates uptime percentage correctly', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const stats = result.current.integrationStats
      const expectedUptime = (stats.byStatus.connected / stats.total) * 100
      
      expect(stats.uptimePercentage).toBe(expectedUptime)
    })

    it('calculates health score correctly', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const stats = result.current.integrationStats
      const expectedHealthScore = (stats.byHealth.healthy / stats.total) * 100
      
      expect(stats.healthScore).toBe(expectedHealthScore)
    })
  })

  describe('Health Summary', () => {
    it('determines overall health correctly', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const healthSummary = result.current.healthSummary
      
      expect(['healthy', 'warning', 'critical']).toContain(healthSummary.overallHealth)
    })

    it('provides critical count', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const healthSummary = result.current.healthSummary
      
      expect(typeof healthSummary.criticalCount).toBe('number')
      expect(healthSummary.criticalCount).toBeGreaterThanOrEqual(0)
    })

    it('provides operational count', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const healthSummary = result.current.healthSummary
      
      expect(typeof healthSummary.operationalCount).toBe('number')
      expect(healthSummary.operationalCount).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Utility Functions', () => {
    it('finds integration by name', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const integration = result.current.getIntegrationByName('Microsoft Sentinel')
      
      expect(integration).toBeDefined()
      expect(integration?.name).toBe('Microsoft Sentinel')
    })

    it('returns undefined for non-existent integration', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const integration = result.current.getIntegrationByName('Non-existent Integration')
      
      expect(integration).toBeUndefined()
    })

    it('filters integrations with custom filters', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const filteredIntegrations = result.current.filterIntegrations({
        status: ['Connected'],
        health: ['Healthy']
      })
      
      filteredIntegrations.forEach(integration => {
        expect(integration.status).toBe('Connected')
        expect(integration.health).toBe('Healthy')
      })
    })

    it('filters integrations by search term', () => {
      const { result } = renderHook(() => useIntegrations(), { wrapper })
      
      const filteredIntegrations = result.current.filterIntegrations({
        search: 'Microsoft'
      })
      
      filteredIntegrations.forEach(integration => {
        expect(integration.name.toLowerCase()).toContain('microsoft')
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles empty integrations array', () => {
      const emptyWrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ integrations: [], loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }, errors: { alerts: null, investigations: null, integrations: null, metrics: null, incidents: null } }}>
          {children}
        </AppProvider>
      )

      const { result } = renderHook(() => useIntegrations(), { wrapper: emptyWrapper })
      
      expect(result.current.integrations).toHaveLength(0)
      expect(result.current.integrationStats.total).toBe(0)
      expect(result.current.integrationStats.uptimePercentage).toBe(0)
      expect(result.current.integrationStats.healthScore).toBe(0)
    })

    it('handles malformed integration data', () => {
      const malformedIntegrations = [
        createMockIntegration({ name: 'Valid Integration' }),
        { name: null, status: 'Connected', health: 'Healthy', lastSync: '1 min ago' } as any,
        { name: 'Another Valid', status: null, health: 'Healthy', lastSync: '2 min ago' } as any
      ]

      const malformedWrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ 
          integrations: malformedIntegrations, 
          loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }, 
          errors: { alerts: null, investigations: null, integrations: null, metrics: null, incidents: null } 
        }}>
          {children}
        </AppProvider>
      )

      const { result } = renderHook(() => useIntegrations(), { wrapper: malformedWrapper })
      
      // Should not throw and should handle the data gracefully
      expect(result.current.integrations).toHaveLength(3)
      expect(result.current.integrationStats.total).toBe(3)
    })
  })

  describe('Performance', () => {
    it('memoizes expensive calculations', () => {
      const { result, rerender } = renderHook(() => useIntegrations(), { wrapper })
      
      const firstStats = result.current.integrationStats
      const firstHealthSummary = result.current.healthSummary
      
      // Re-render without changing integrations
      rerender()
      
      const secondStats = result.current.integrationStats
      const secondHealthSummary = result.current.healthSummary
      
      // Should be the same object reference due to memoization
      expect(firstStats).toBe(secondStats)
      expect(firstHealthSummary).toBe(secondHealthSummary)
    })
  })
})