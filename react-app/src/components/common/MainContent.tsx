/**
 * MainContent Component
 * Container for section-specific content with conditional rendering and code splitting
 */

import React, { Suspense, lazy } from 'react';
import { useAppContext } from '../../context';
import { SectionErrorBoundary } from './SectionErrorBoundary';
import { LoadingState } from './EmptyState';
import styles from './MainContent.module.css';

// Lazy load section components for code splitting
const Dashboard = lazy(() => import('../dashboard/Dashboard'));
const AlertManagement = lazy(() => import('../alerts/AlertManagement'));
const Investigations = lazy(() => import('../investigations/Investigations'));
const ThreatHunting = lazy(() => import('../hunting/ThreatHunting'));
const IncidentBoard = lazy(() => import('../incidents/IncidentBoard'));
const Analytics = lazy(() => import('../analytics/Analytics'));
const IntegrationsComponent = lazy(() => import('../integrations/Integrations'));

export const MainContent: React.FC = React.memo(() => {
  const { state } = useAppContext();

  const renderCurrentSection = () => {
    const getSectionName = (section: string) => {
      switch (section) {
        case 'dashboard': return 'Dashboard';
        case 'alerts': return 'Alert Management';
        case 'investigations': return 'Investigations';
        case 'hunting': return 'Threat Hunting';
        case 'incidents': return 'Incidents';
        case 'analytics': return 'Analytics';
        case 'integrations': return 'Integrations';
        default: return 'Dashboard';
      }
    };

    const sectionName = getSectionName(state.currentSection);

    const renderSectionContent = () => {
      switch (state.currentSection) {
        case 'dashboard':
          return <Dashboard />;
        case 'alerts':
          return <AlertManagement />;
        case 'investigations':
          return <Investigations />;
        case 'hunting':
          return <ThreatHunting />;
        case 'incidents':
          return <IncidentBoard />;
        case 'analytics':
          return <Analytics />;
        case 'integrations':
          return <IntegrationsComponent />;
        default:
          return <Dashboard />;
      }
    };

    return (
      <SectionErrorBoundary sectionName={sectionName}>
        <Suspense fallback={<LoadingState message={`Loading ${sectionName}...`} />}>
          {renderSectionContent()}
        </Suspense>
      </SectionErrorBoundary>
    );
  };

  return (
    <main className={styles.mainContent}>
      {renderCurrentSection()}
    </main>
  );
});