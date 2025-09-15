import React, { useState } from 'react';
import { Button } from '../common';
import { QueryExample } from '../../types/hunting';
import styles from './QueryBuilder.module.css';

export interface QueryBuilderProps {
  onExecuteQuery: (query: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

const QUERY_EXAMPLES: QueryExample[] = [
  {
    title: "Failed logins from Russia",
    query: "Show me all failed login attempts from Russia in the last 24 hours",
    description: "Find suspicious login attempts from high-risk geographical locations",
    category: "Authentication"
  },
  {
    title: "Lateral movement",
    query: "Find lateral movement patterns in the network",
    description: "Detect unauthorized movement between network segments",
    category: "Network"
  },
  {
    title: "Large data transfers",
    query: "Identify data exfiltration attempts over 1GB",
    description: "Find potential data theft through large file transfers",
    category: "Data Loss Prevention"
  },
  {
    title: "Privilege escalation",
    query: "Show accounts that gained elevated privileges in the last week",
    description: "Detect unauthorized privilege escalation attempts",
    category: "Access Control"
  },
  {
    title: "Malware indicators",
    query: "Find processes with suspicious file hashes or network connections",
    description: "Identify potential malware activity on endpoints",
    category: "Malware"
  },
  {
    title: "Off-hours activity",
    query: "Show unusual activity during non-business hours",
    description: "Detect suspicious activities outside normal working hours",
    category: "Behavioral"
  }
];

export const QueryBuilder: React.FC<QueryBuilderProps> = ({
  onExecuteQuery,
  loading = false,
  disabled = false
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading && !disabled) {
      onExecuteQuery(query.trim());
    }
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
    if (!loading && !disabled) {
      onExecuteQuery(exampleQuery);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className={styles.queryBuilder}>
      <h3 className={styles.title}>Natural Language Query</h3>
      
      <form onSubmit={handleSubmit} className={styles.queryForm}>
        <div className={styles.queryInput}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for suspicious activities, IOCs, or behavior patterns..."
            className={styles.formControl}
            disabled={disabled}
          />
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={disabled || !query.trim()}
          >
            Hunt
          </Button>
        </div>
      </form>

      <div className={styles.queryExamples}>
        {QUERY_EXAMPLES.map((example, index) => (
          <button
            key={index}
            type="button"
            className={styles.queryExample}
            onClick={() => handleExampleClick(example.query)}
            disabled={loading || disabled}
            title={example.description}
          >
            {example.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QueryBuilder;