import { useState, useCallback } from 'react';
import { HuntExecution, HuntResult } from '../types/hunting';
import { mockHuntResults, generateHuntResultId } from '../data/mockData';

export interface UseHuntExecutionReturn {
  currentExecution: HuntExecution | null;
  isExecuting: boolean;
  executeHunt: (query: string) => Promise<void>;
  clearResults: () => void;
}

// Simulate hunt execution with realistic delays and results
const simulateHuntExecution = async (query: string): Promise<HuntResult[]> => {
  // Simulate execution time between 1-4 seconds
  const executionTime = Math.random() * 3000 + 1000;
  await new Promise(resolve => setTimeout(resolve, executionTime));

  // Generate results based on query content
  const results: HuntResult[] = [];
  const queryLower = query.toLowerCase();

  // Add relevant mock results based on query keywords
  if (queryLower.includes('login') || queryLower.includes('authentication')) {
    results.push({
      id: generateHuntResultId(),
      title: "Suspicious Login Pattern",
      description: "Multiple failed attempts from IP 192.168.1.100",
      confidence: 85,
      severity: "High",
      timestamp: new Date().toISOString(),
      artifacts: ["192.168.1.100", "user.account@company.com", "Failed login attempts: 47"]
    });
  }

  if (queryLower.includes('lateral') || queryLower.includes('movement')) {
    results.push({
      id: generateHuntResultId(),
      title: "Lateral Movement Detected",
      description: "Service account accessing multiple systems",
      confidence: 92,
      severity: "Critical",
      timestamp: new Date().toISOString(),
      artifacts: ["SVC-BACKUP", "Multiple system access", "Privilege escalation"]
    });
  }

  if (queryLower.includes('data') || queryLower.includes('transfer') || queryLower.includes('exfiltration')) {
    results.push({
      id: generateHuntResultId(),
      title: "Data Transfer Anomaly",
      description: "Large file transfer during off-hours",
      confidence: 78,
      severity: "Medium",
      timestamp: new Date().toISOString(),
      artifacts: ["2.3GB transfer", "External IP: 203.45.67.89", "Off-hours activity"]
    });
  }

  if (queryLower.includes('privilege') || queryLower.includes('escalation')) {
    results.push({
      id: generateHuntResultId(),
      title: "Privilege Escalation Detected",
      description: "Service account gained unexpected administrative privileges",
      confidence: 88,
      severity: "High",
      timestamp: new Date().toISOString(),
      artifacts: ["SVC-BACKUP", "Domain Admins", "DC-01"]
    });
  }

  if (queryLower.includes('malware') || queryLower.includes('suspicious') || queryLower.includes('process')) {
    results.push({
      id: generateHuntResultId(),
      title: "Suspicious Process Activity",
      description: "Unknown process with network connections to external IPs",
      confidence: 76,
      severity: "Medium",
      timestamp: new Date().toISOString(),
      artifacts: ["unknown_process.exe", "External connections", "Process hash: abc123"]
    });
  }

  if (queryLower.includes('russia') || queryLower.includes('geographic') || queryLower.includes('location')) {
    results.push({
      id: generateHuntResultId(),
      title: "Geographic Anomaly",
      description: "Login attempts from high-risk geographical locations",
      confidence: 91,
      severity: "High",
      timestamp: new Date().toISOString(),
      artifacts: ["185.220.101.42", "Russia", "john.smith@company.com"]
    });
  }

  // If no specific matches, return some general results
  if (results.length === 0) {
    // Return a subset of mock results
    const randomResults = mockHuntResults
      .slice(0, Math.floor(Math.random() * 3) + 1)
      .map(result => ({
        ...result,
        id: generateHuntResultId(),
        timestamp: new Date().toISOString()
      }));
    results.push(...randomResults);
  }

  // Sometimes return no results to simulate realistic hunting
  if (Math.random() < 0.2) {
    return [];
  }

  return results;
};

export const useHuntExecution = (): UseHuntExecutionReturn => {
  const [currentExecution, setCurrentExecution] = useState<HuntExecution | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeHunt = useCallback(async (query: string) => {
    if (isExecuting) return;

    const executionId = `HE-${Date.now()}`;
    const startTime = new Date().toISOString();

    // Create initial execution object
    const execution: HuntExecution = {
      id: executionId,
      queryId: `HQ-${Date.now()}`,
      query,
      status: 'Running',
      startTime,
      results: []
    };

    setCurrentExecution(execution);
    setIsExecuting(true);

    try {
      const startTimestamp = Date.now();
      const results = await simulateHuntExecution(query);
      const endTimestamp = Date.now();
      const executionTime = (endTimestamp - startTimestamp) / 1000;

      // Update execution with results
      const completedExecution: HuntExecution = {
        ...execution,
        status: 'Completed',
        endTime: new Date().toISOString(),
        executionTime,
        results
      };

      setCurrentExecution(completedExecution);
    } catch (error) {
      // Handle execution failure
      const failedExecution: HuntExecution = {
        ...execution,
        status: 'Failed',
        endTime: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Hunt execution failed'
      };

      setCurrentExecution(failedExecution);
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting]);

  const clearResults = useCallback(() => {
    setCurrentExecution(null);
    setIsExecuting(false);
  }, []);

  return {
    currentExecution,
    isExecuting,
    executeHunt,
    clearResults
  };
};