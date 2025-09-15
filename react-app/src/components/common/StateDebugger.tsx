/**
 * State Debugger Component
 * Displays current application state for debugging purposes
 */

import React from 'react';
import { useAppContext } from '../../context';
import { useAlerts, useInvestigations, useMetrics, useIntegrations } from '../../hooks';

export const StateDebugger: React.FC = () => {
  const { state } = useAppContext();
  const { alertStats } = useAlerts();
  const { investigationStats } = useInvestigations();
  const { calculatedMetrics, trendAnalysis } = useMetrics();
  const { healthSummary } = useIntegrations();

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      color: '#fff', 
      fontFamily: 'monospace',
      fontSize: '12px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <h3>State Management Debug Info</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h4>Raw State</h4>
          <p>Current Section: {state.currentSection}</p>
          <p>Selected Investigation: {state.selectedInvestigation || 'None'}</p>
          <p>Selected Alert: {state.selectedAlert || 'None'}</p>
          
          <h4>Data Counts</h4>
          <p>Alerts: {state.alerts.length}</p>
          <p>Investigations: {state.investigations.length}</p>
          <p>Integrations: {state.integrations.length}</p>
          <p>SOC Team: {state.socTeam.length}</p>
          <p>Incidents: {state.incidents.length}</p>
          
          <h4>Loading States</h4>
          <pre>{JSON.stringify(state.loading, null, 2)}</pre>
          
          <h4>Error States</h4>
          <pre>{JSON.stringify(state.errors, null, 2)}</pre>
        </div>
        
        <div>
          <h4>Alert Statistics</h4>
          <p>Total: {alertStats.total}</p>
          <p>Critical: {alertStats.bySeverity.critical}</p>
          <p>High: {alertStats.bySeverity.high}</p>
          <p>Medium: {alertStats.bySeverity.medium}</p>
          <p>Low: {alertStats.bySeverity.low}</p>
          <p>Recent (24h): {alertStats.recent}</p>
          <p>High Priority: {alertStats.highPriority}</p>
          
          <h4>Investigation Statistics</h4>
          <p>Total: {investigationStats.total}</p>
          <p>New: {investigationStats.byStatus.new}</p>
          <p>In Progress: {investigationStats.byStatus.inProgress}</p>
          <p>Completed: {investigationStats.byStatus.completed}</p>
          <p>Active: {investigationStats.active}</p>
          
          <h4>Integration Health</h4>
          <p>Overall: {healthSummary.overallHealth}</p>
          <p>Health Score: {healthSummary.healthScore.toFixed(1)}%</p>
          <p>Uptime: {healthSummary.uptimePercentage.toFixed(1)}%</p>
          <p>Critical: {healthSummary.criticalCount}</p>
          <p>Operational: {healthSummary.operationalCount}</p>
          
          <h4>Performance Metrics</h4>
          <p>Alert Resolution Rate: {calculatedMetrics.alertResolutionRate.toFixed(1)}%</p>
          <p>Investigation Completion Rate: {calculatedMetrics.investigationCompletionRate.toFixed(1)}%</p>
          
          <h4>Trend Analysis</h4>
          <p>Alerts: {trendAnalysis.alerts.label} ({trendAnalysis.alerts.isPositive ? '✓' : '✗'})</p>
          <p>MTTR: {trendAnalysis.mttr.label} ({trendAnalysis.mttr.isPositive ? '✓' : '✗'})</p>
          <p>Accuracy: {trendAnalysis.accuracy.label} ({trendAnalysis.accuracy.isPositive ? '✓' : '✗'})</p>
        </div>
      </div>
    </div>
  );
};