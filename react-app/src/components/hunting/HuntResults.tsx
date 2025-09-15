import React from 'react';
import { HuntResult, HuntExecution } from '../../types/hunting';
import { NoHuntResultsState, LoadingState } from '../common';
import styles from './HuntResults.module.css';

export interface HuntResultsProps {
  execution?: HuntExecution;
  loading?: boolean;
}

const EmptyState: React.FC = () => (
  <div className={styles.emptyState}>
    <i className="fas fa-binoculars" aria-hidden="true"></i>
    <h3>Ready to Hunt</h3>
    <p>Enter a query above to start threat hunting</p>
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className={styles.errorState}>
    <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
    <h3>Hunt Execution Failed</h3>
    <p>{error}</p>
  </div>
);

const ResultItem: React.FC<{ result: HuntResult }> = ({ result }) => {
  const getConfidenceClass = (confidence: number) => {
    if (confidence >= 90) return styles.confidenceHigh;
    if (confidence >= 70) return styles.confidenceMedium;
    return styles.confidenceLow;
  };

  const getSeverityClass = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return styles.severityCritical;
      case 'high': return styles.severityHigh;
      case 'medium': return styles.severityMedium;
      case 'low': return styles.severityLow;
      default: return '';
    }
  };

  return (
    <div className={styles.huntMatch}>
      <div className={styles.matchHeader}>
        <h4 className={styles.matchTitle}>{result.title}</h4>
        {result.severity && (
          <span className={`${styles.severityBadge} ${getSeverityClass(result.severity)}`}>
            {result.severity}
          </span>
        )}
      </div>
      
      <p className={styles.matchDescription}>{result.description}</p>
      
      <div className={styles.matchMeta}>
        <span className={styles.timestamp}>
          <i className="fas fa-clock" aria-hidden="true"></i>
          {new Date(result.timestamp).toLocaleString()}
        </span>
        <span className={`${styles.confidence} ${getConfidenceClass(result.confidence)}`}>
          Confidence: {result.confidence}%
        </span>
      </div>

      {result.artifacts && result.artifacts.length > 0 && (
        <div className={styles.artifacts}>
          <span className={styles.artifactsLabel}>Artifacts:</span>
          <div className={styles.artifactsList}>
            {result.artifacts.map((artifact, index) => (
              <span key={index} className={styles.artifact}>
                {artifact}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const HuntResults: React.FC<HuntResultsProps> = ({
  execution,
  loading = false
}) => {
  if (loading) {
    return (
      <div className={styles.huntResults}>
        <LoadingState message="Executing hunt query..." />
      </div>
    );
  }

  if (!execution) {
    return (
      <div className={styles.huntResults}>
        <EmptyState />
      </div>
    );
  }

  if (execution.status === 'Failed' && execution.error) {
    return (
      <div className={styles.huntResults}>
        <ErrorState error={execution.error} />
      </div>
    );
  }

  if (execution.status === 'Running') {
    return (
      <div className={styles.huntResults}>
        <LoadingState message="Executing hunt query..." />
      </div>
    );
  }

  return (
    <div className={styles.huntResults}>
      <div className={styles.resultsHeader}>
        <h3>Hunt Results</h3>
        <div className={styles.executionMeta}>
          <p><strong>Query:</strong> {execution.query}</p>
          <p><strong>Execution Time:</strong> {execution.executionTime ? `${execution.executionTime.toFixed(1)} seconds` : 'N/A'}</p>
          <p><strong>Results Found:</strong> {execution.results.length} matches</p>
        </div>
      </div>

      {execution.results.length === 0 ? (
        <NoHuntResultsState />
      ) : (
        <div className={styles.huntMatches}>
          {execution.results.map((result) => (
            <ResultItem key={result.id} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HuntResults;