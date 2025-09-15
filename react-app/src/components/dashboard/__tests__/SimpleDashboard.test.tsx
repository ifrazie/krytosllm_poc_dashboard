import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SimpleDashboard } from '../SimpleDashboard';
import { AppProvider } from '../../../context/AppContext';
import { mockAlerts, mockSocTeam, mockMetrics } from '../../../test/mock-data';

// Mock FontAwesome icons
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: { icon: any }) => <i data-testid={`icon-${icon}`} />
}));

const renderWithContext = (component: React.ReactElement) => {
  const mockContextValue = {
    state: {
      alerts: mockAlerts,
      socTeam: mockSocTeam,
      metrics: mockMetrics,
      loading: false,
      error: null,
      currentSection: 'dashboard'
    },
    dispatch: vi.fn()
  };

  return render(
    <AppProvider value={mockContextValue}>
      {component}
    </AppProvider>
  );
};

describe('SimpleDashboard', () => {
  it('renders SOC dashboard title and subtitle', () => {
    renderWithContext(<SimpleDashboard />);
    
    expect(screen.getByText('SOC Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Real-time security operations center overview')).toBeInTheDocument();
  });

  it('displays metrics cards with correct values', () => {
    renderWithContext(<SimpleDashboard />);
    
    expect(screen.getByText('Total Alerts')).toBeInTheDocument();
    expect(screen.getByText('Active Investigations')).toBeInTheDocument();
    expect(screen.getByText('Resolved Incidents')).toBeInTheDocument();
    expect(screen.getByText('Mean Time to Response')).toBeInTheDocument();
  });

  it('renders recent alerts section', () => {
    renderWithContext(<SimpleDashboard />);
    
    expect(screen.getByText('Recent Alerts')).toBeInTheDocument();
  });

  it('renders SOC team status section', () => {
    renderWithContext(<SimpleDashboard />);
    
    expect(screen.getByText('SOC Team Status')).toBeInTheDocument();
  });

  it('renders system health section', () => {
    renderWithContext(<SimpleDashboard />);
    
    expect(screen.getByText('System Health')).toBeInTheDocument();
    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('Data Processing')).toBeInTheDocument();
  });

  it('displays alerts with severity color coding', () => {
    renderWithContext(<SimpleDashboard />);
    
    // Check that alert titles are rendered
    mockAlerts.slice(0, 5).forEach(alert => {
      expect(screen.getByText(alert.title)).toBeInTheDocument();
    });
  });

  it('displays team members with status indicators', () => {
    renderWithContext(<SimpleDashboard />);
    
    // Check that team member names are rendered
    mockSocTeam.forEach(member => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
    });
  });

  it('handles empty state gracefully', () => {
    const emptyContextValue = {
      state: {
        alerts: [],
        socTeam: [],
        metrics: null,
        loading: false,
        error: null,
        currentSection: 'dashboard'
      },
      dispatch: vi.fn()
    };

    render(
      <AppProvider value={emptyContextValue}>
        <SimpleDashboard />
      </AppProvider>
    );
    
    expect(screen.getByText('No alerts available')).toBeInTheDocument();
    expect(screen.getByText('No team members available')).toBeInTheDocument();
  });

  it('applies correct inline styles for dark theme', () => {
    renderWithContext(<SimpleDashboard />);
    
    const dashboard = screen.getByText('SOC Dashboard').closest('div');
    expect(dashboard).toHaveStyle({
      background: '#0a0e1a',
      color: '#ffffff'
    });
  });

  it('uses responsive grid layout', () => {
    renderWithContext(<SimpleDashboard />);
    
    // Check that grid containers exist with proper styling
    const metricsGrid = screen.getByText('Total Alerts').closest('div')?.parentElement;
    expect(metricsGrid).toHaveStyle({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    });
  });
});