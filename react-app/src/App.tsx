import React from 'react';
import { AppProvider } from './context';
import { NotificationProvider } from './context/NotificationContext';
import { useRealTimeUpdates, useNotificationIntegration } from './hooks';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MainContent } from './components/common/MainContent';
import { NotificationContainer } from './components/common/NotificationContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ErrorTrigger } from './components/common/ErrorTrigger';
import styles from './App.module.css';

// Main application component that manages global state and section routing
const AppContent: React.FC = () => {
  
  // Enable real-time updates for the entire application
  useRealTimeUpdates({
    enableAlertSimulation: true,
    enableSyncUpdates: true,
    enableMetricsUpdates: true,
    enableTeamUpdates: true,
    alertInterval: 15000, // 15 seconds for demo
    syncInterval: 3000,   // 3 seconds for demo
    metricsInterval: 10000, // 10 seconds for demo
    teamInterval: 45000, // 45 seconds for demo
    maxAlertsPerInterval: 2
  });

  // Enable notification integration with real-time updates
  useNotificationIntegration({
    enableAlertNotifications: true,
    enableSystemNotifications: true,
    enableIntegrationNotifications: true,
    enableTeamNotifications: false, // Disabled to avoid notification spam
    alertSeverityThreshold: 'Medium',
    maxNotificationsPerMinute: 8
  });

  return (
    <div className={styles.prophetAiApp}>
      {/* Header with logo, stats, and user profile */}
      <Header />
      
      {/* Main container with sidebar and content */}
      <div className={styles.mainContainer}>
        {/* Sidebar navigation */}
        <Sidebar />
        
        {/* Main content area that renders based on current section */}
        <MainContent />
      </div>
      
      {/* Notification system */}
      <NotificationContainer position="top-right" />
      
      {/* Development error trigger */}
      <ErrorTrigger />
    </div>
  );
};

// Root App component with context providers and error boundary
function App() {
  const handleAppError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Application-level error:', error, errorInfo);
    // In production, you would send this to an error reporting service
  };

  return (
    <ErrorBoundary onError={handleAppError}>
      <AppProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
