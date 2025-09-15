/**
 * Script to create missing CSS module files
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const cssModules = [
  // Alert components
  'src/components/alerts/AlertFilters.module.css',
  'src/components/alerts/AlertManagement.module.css',
  'src/components/alerts/AlertModal.module.css',
  'src/components/alerts/AlertTable.module.css',
  
  // Analytics components
  'src/components/analytics/Analytics.module.css',
  'src/components/analytics/ChartCard.module.css',
  'src/components/analytics/PerformanceMetrics.module.css',
  
  // Common components
  'src/components/common/Button.module.css',
  'src/components/common/ChartErrorBoundary.module.css',
  'src/components/common/charts/BaseChart.module.css',
  'src/components/common/EmptyState.module.css',
  'src/components/common/ErrorBoundary.module.css',
  'src/components/common/Header.module.css',
  'src/components/common/LoadingIndicator.module.css',
  'src/components/common/LoadingSkeleton.module.css',
  'src/components/common/MainContent.module.css',
  'src/components/common/Modal.module.css',
  'src/components/common/NotificationContainer.module.css',
  'src/components/common/NotificationItem.module.css',
  'src/components/common/SectionErrorBoundary.module.css',
  'src/components/common/Sidebar.module.css',
  'src/components/common/Table.module.css',
  
  // Dashboard components
  'src/components/dashboard/AlertFeed.module.css',
  'src/components/dashboard/Dashboard.module.css',
  'src/components/dashboard/MetricsGrid.module.css',
  'src/components/dashboard/TeamStatus.module.css',
  
  // Hunting components
  'src/components/hunting/HuntResults.module.css',
  'src/components/hunting/QueryBuilder.module.css',
  'src/components/hunting/ThreatHunting.module.css',
  
  // Incident components
  'src/components/incidents/IncidentBoard.module.css',
  'src/components/incidents/IncidentCard.module.css',
  
  // Integration components
  'src/components/integrations/IntegrationCard.module.css',
  'src/components/integrations/Integrations.module.css',
  
  // Investigation components
  'src/components/investigations/InvestigationDetails.module.css',
  'src/components/investigations/InvestigationList.module.css',
  'src/components/investigations/Investigations.module.css'
];

const basicCssTemplate = (componentName) => `/* ${componentName} Component Styles */

.container {
  /* Add component-specific styles here */
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--color-text-secondary);
}

.error {
  color: var(--color-error);
  padding: 1rem;
  text-align: center;
}
`;

console.log('Creating CSS module files...');

cssModules.forEach(filePath => {
  try {
    // Create directory if it doesn't exist
    mkdirSync(dirname(filePath), { recursive: true });
    
    // Extract component name from file path
    const componentName = filePath.split('/').pop().replace('.module.css', '');
    
    // Write CSS file
    writeFileSync(filePath, basicCssTemplate(componentName));
    console.log(`✓ Created ${filePath}`);
  } catch (error) {
    console.error(`✗ Failed to create ${filePath}:`, error.message);
  }
});

console.log('CSS module creation complete!');