/**
 * SectionErrorBoundary Component
 * Specialized Error Boundary for major application sections
 */

import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import styles from './SectionErrorBoundary.module.css';

interface SectionErrorBoundaryProps {
  children: ReactNode;
  sectionName: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const SectionErrorFallback: React.FC<{ sectionName: string; onRetry: () => void }> = ({ 
  sectionName, 
  onRetry 
}) => (
  <div className={styles.sectionError}>
    <div className={styles.errorContent}>
      <div className={styles.errorIcon}>
        <i className="fas fa-exclamation-circle"></i>
      </div>
      <h3 className={styles.errorTitle}>
        {sectionName} Section Unavailable
      </h3>
      <p className={styles.errorDescription}>
        There was an error loading the {sectionName.toLowerCase()} section. 
        This might be a temporary issue.
      </p>
      <div className={styles.errorSuggestions}>
        <h4>What you can do:</h4>
        <ul>
          <li>Try refreshing this section</li>
          <li>Navigate to a different section</li>
          <li>Check your network connection</li>
          <li>Contact support if the issue persists</li>
        </ul>
      </div>
      <div className={styles.errorActions}>
        <button 
          className={styles.retryButton}
          onClick={onRetry}
        >
          <i className="fas fa-redo"></i>
          Retry Section
        </button>
        <button 
          className={styles.dashboardButton}
          onClick={() => window.location.hash = '#dashboard'}
        >
          <i className="fas fa-home"></i>
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>
);

export const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({ 
  children, 
  sectionName,
  onError 
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log section-specific error
    console.error(`Error in ${sectionName} section:`, error, errorInfo);
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // In a real application, you might want to send this to an error reporting service
    // Example: errorReportingService.captureException(error, { section: sectionName, ...errorInfo });
  };

  return (
    <ErrorBoundary
      onError={handleError}
      fallback={
        <SectionErrorFallback 
          sectionName={sectionName}
          onRetry={() => window.location.reload()}
        />
      }
    >
      {children}
    </ErrorBoundary>
  );
};