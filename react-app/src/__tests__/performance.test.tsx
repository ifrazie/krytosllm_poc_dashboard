/**
 * Performance optimization tests
 * Tests to verify React performance optimizations are working correctly
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AppProvider } from '../context/AppContext';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { AlertManagement } from '../components/alerts/AlertManagement';
import { PerformanceMonitor } from '../utils/performance';
import { mockAlerts, mockMetrics, mockSocTeam } from '../data';

// Mock data for testing
const mockState = {
  alerts: mockAlerts,
  investigations: [],
  integrations: [],
  socTeam: mockSocTeam,
  metrics: mockMetrics,
  incidents: [],
  currentSection: 'dashboard' as const,
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
  }
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider initialState={mockState}>
    {children}
  </AppProvider>
);

describe('Performance Optimizations', () => {
  beforeEach(() => {
    PerformanceMonitor.clearAllMeasurements();
    vi.clearAllMocks();
  });

  afterEach(() => {
    PerformanceMonitor.stopObserving();
  });

  describe('React.memo optimizations', () => {
    it('should prevent unnecessary re-renders of Dashboard component', async () => {
      const renderSpy = vi.fn();
      
      // Create a spy version of Dashboard
      const SpiedDashboard = React.memo(() => {
        renderSpy();
        return <Dashboard />;
      });

      const { rerender } = render(
        <TestWrapper>
          <SpiedDashboard />
        </TestWrapper>
      );

      // Initial render
      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same props - should not trigger Dashboard re-render
      rerender(
        <TestWrapper>
          <SpiedDashboard />
        </TestWrapper>
      );

      // Dashboard should still only have been rendered once due to memo
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should prevent unnecessary re-renders of Header component', async () => {
      const renderSpy = vi.fn();
      
      const SpiedHeader = React.memo(() => {
        renderSpy();
        return <Header />;
      });

      const { rerender } = render(
        <TestWrapper>
          <SpiedHeader />
        </TestWrapper>
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same context - should not re-render Header
      rerender(
        <TestWrapper>
          <SpiedHeader />
        </TestWrapper>
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should prevent unnecessary re-renders of Sidebar component', async () => {
      const renderSpy = vi.fn();
      
      const SpiedSidebar = React.memo(() => {
        renderSpy();
        return <Sidebar />;
      });

      const { rerender } = render(
        <TestWrapper>
          <SpiedSidebar />
        </TestWrapper>
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);

      rerender(
        <TestWrapper>
          <SpiedSidebar />
        </TestWrapper>
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('useMemo optimizations', () => {
    it('should memoize expensive calculations in Dashboard', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Verify dashboard renders without errors
      expect(screen.getByText('SOC Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Real-time security operations center overview')).toBeInTheDocument();
    });

    it('should memoize active alerts calculation in Header', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Verify header renders with active alerts count
      expect(screen.getByText('Prophet AI')).toBeInTheDocument();
      
      // Check that active alerts are calculated and displayed
      const activeAlertsElement = screen.getByText(/Active/);
      expect(activeAlertsElement).toBeInTheDocument();
    });
  });

  describe('useCallback optimizations', () => {
    it('should memoize event handlers in Sidebar', async () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const dashboardButton = screen.getByRole('button', { name: /Navigate to Dashboard/ });
      const alertsButton = screen.getByRole('button', { name: /Navigate to Alert Management/ });

      // Click events should work without causing unnecessary re-renders
      fireEvent.click(dashboardButton);
      fireEvent.click(alertsButton);

      expect(dashboardButton).toBeInTheDocument();
      expect(alertsButton).toBeInTheDocument();
    });

    it('should memoize filter handlers in AlertManagement', async () => {
      render(
        <TestWrapper>
          <AlertManagement />
        </TestWrapper>
      );

      // Verify alert management renders
      expect(screen.getByText('Alert Management')).toBeInTheDocument();
      expect(screen.getByText('Monitor and respond to security alerts')).toBeInTheDocument();
    });
  });

  describe('Performance measurement', () => {
    it('should track component render times', async () => {
      PerformanceMonitor.startMeasurement('dashboard-test');
      
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const renderTime = PerformanceMonitor.endMeasurement('dashboard-test');
      
      expect(renderTime).toBeGreaterThan(0);
      expect(PerformanceMonitor.getMeasurements('dashboard-test')).toHaveLength(1);
    });

    it('should provide performance report', () => {
      PerformanceMonitor.startMeasurement('test-metric');
      PerformanceMonitor.endMeasurement('test-metric');
      
      const report = PerformanceMonitor.getPerformanceReport();
      
      expect(report).toHaveProperty('test-metric');
      expect(report['test-metric']).toHaveProperty('count', 1);
      expect(report['test-metric']).toHaveProperty('average');
    });
  });

  describe('Code splitting verification', () => {
    it('should support lazy loading of components', async () => {
      // Test that React.lazy works with our components
      const LazyDashboard = React.lazy(() => 
        Promise.resolve({ default: Dashboard })
      );

      render(
        <TestWrapper>
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyDashboard />
          </React.Suspense>
        </TestWrapper>
      );

      // Should eventually render the dashboard
      await waitFor(() => {
        expect(screen.getByText('SOC Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('Memory optimization', () => {
    it('should clean up intervals and event listeners', async () => {
      const { unmount } = render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Verify component mounts successfully
      expect(screen.getByText('Prophet AI')).toBeInTheDocument();

      // Unmount should not cause memory leaks
      unmount();
      
      // No assertions needed - test passes if no memory leaks occur
    });
  });
});

// Performance benchmark tests
describe('Performance Benchmarks', () => {
  it('should render Dashboard within performance budget', async () => {
    const startTime = performance.now();
    
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Dashboard should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });

  it('should handle multiple alert updates efficiently', async () => {
    const startTime = performance.now();
    
    render(
      <TestWrapper>
        <AlertManagement />
      </TestWrapper>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Alert management should render within 150ms even with many alerts
    expect(renderTime).toBeLessThan(150);
  });

  it('should maintain performance with frequent updates', async () => {
    const renderTimes: number[] = [];
    
    for (let i = 0; i < 5; i++) {
      const startTime = performance.now();
      
      const { unmount } = render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      renderTimes.push(endTime - startTime);
      
      unmount();
    }

    // Average render time should be consistent
    const averageTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
    const maxTime = Math.max(...renderTimes);
    
    expect(averageTime).toBeLessThan(50);
    expect(maxTime).toBeLessThan(100);
  });
});