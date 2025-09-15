import React from 'react';
import { QueryBuilder } from './QueryBuilder';
import { HuntResults } from './HuntResults';
import { useHuntExecution } from '../../hooks/useHuntExecution';
import styles from './ThreatHunting.module.css';

export interface ThreatHuntingProps {
  className?: string;
}

export const ThreatHunting: React.FC<ThreatHuntingProps> = ({ className = '' }) => {
  const { currentExecution, isExecuting, executeHunt, clearResults } = useHuntExecution();

  const handleExecuteQuery = async (query: string) => {
    await executeHunt(query);
  };

  const containerClasses = [styles.threatHunting, className].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.sectionHeader}>
        <h1>Threat Hunting Interface</h1>
        <p>Proactive threat detection and analysis</p>
      </div>

      <div className={styles.huntingInterface}>
        <QueryBuilder
          onExecuteQuery={handleExecuteQuery}
          loading={isExecuting}
          disabled={isExecuting}
        />

        <HuntResults
          execution={currentExecution || undefined}
          loading={isExecuting}
        />
      </div>

      {currentExecution && (
        <div className={styles.huntingActions}>
          <button
            type="button"
            className={styles.clearButton}
            onClick={clearResults}
            disabled={isExecuting}
          >
            <i className="fas fa-times" aria-hidden="true"></i>
            Clear Results
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreatHunting;