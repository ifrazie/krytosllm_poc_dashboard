/**
 * Quick fix for common test state issues
 */

import { readFileSync, writeFileSync } from 'fs';

const filesToFix = [
  'src/components/alerts/__tests__/AlertManagement.test.tsx',
  'src/components/analytics/__tests__/Analytics.test.tsx',
  'src/components/dashboard/__tests__/Dashboard.test.tsx',
  'src/components/incidents/__tests__/IncidentBoard.test.tsx',
  'src/components/integrations/__tests__/Integrations.test.tsx',
  'src/components/investigations/__tests__/Investigations.test.tsx',
  'src/hooks/__tests__/useIntegrations.test.tsx'
];

console.log('Applying quick test fixes...');

filesToFix.forEach(filePath => {
  try {
    let content = readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix incomplete loading states - replace with complete ones
    const loadingFixes = [
      [/loading:\s*{\s*alerts:\s*false\s*}/g, 'loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }'],
      [/loading:\s*{\s*metrics:\s*false,\s*alerts:\s*false\s*}/g, 'loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }'],
      [/loading:\s*{\s*alerts:\s*boolean;\s*metrics:\s*boolean;\s*}/g, 'loading: { alerts: boolean; investigations: boolean; integrations: boolean; metrics: boolean; incidents: boolean; }'],
      [/loading:\s*{\s*incidents:\s*false\s*}/g, 'loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }'],
      [/loading:\s*{\s*integrations:\s*false\s*}/g, 'loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }'],
      [/loading:\s*{\s*investigations:\s*false\s*}/g, 'loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }'],
      [/loading:\s*{\s*integrations:\s*true\s*}/g, 'loading: { alerts: false, investigations: false, integrations: true, metrics: false, incidents: false }'],
      [/loading:\s*{}/g, 'loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }']
    ];
    
    loadingFixes.forEach(([pattern, replacement]) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });
    
    // Fix incomplete error states
    const errorFixes = [
      [/errors:\s*{}/g, 'errors: { alerts: null, investigations: null, integrations: null, metrics: null, incidents: null }'],
      [/errors:\s*{\s*integrations:\s*'Test error'\s*}/g, 'errors: { alerts: null, investigations: null, integrations: "Test error", metrics: null, incidents: null }']
    ];
    
    errorFixes.forEach(([pattern, replacement]) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });
    
    // Remove invalid loading properties
    content = content.replace(/loading:\s*{\s*hunting:\s*false\s*}/g, 'loading: { alerts: false, investigations: false, integrations: false, metrics: false, incidents: false }');
    if (content !== readFileSync(filePath, 'utf8')) {
      modified = true;
    }
    
    if (modified) {
      writeFileSync(filePath, content);
      console.log(`✓ Fixed ${filePath}`);
    }
  } catch (error) {
    console.log(`- Failed to fix ${filePath}: ${error.message}`);
  }
});

console.log('Quick test fixes complete!');