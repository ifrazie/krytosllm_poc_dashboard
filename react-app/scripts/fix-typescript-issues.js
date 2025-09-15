/**
 * Script to fix TypeScript compilation issues
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

console.log('Fixing TypeScript issues...');

// Fix 1: Update setInterval type issues
const filesToFix = [
  'src/data/realTimeSimulation.ts',
  'src/hooks/useRealTimeAlerts.ts',
  'src/hooks/useRealTimeMetrics.ts',
  'src/hooks/useRealTimeSync.ts',
  'src/hooks/useRealTimeUpdates.ts'
];

filesToFix.forEach(filePath => {
  try {
    if (require('fs').existsSync(filePath)) {
      let content = readFileSync(filePath, 'utf8');
      
      // Replace setInterval type assignments
      content = content.replace(
        /(\w+Interval(?:Ref)?(?:\.current)?) = setInterval/g,
        '$1 = setInterval'
      );
      
      // Fix interval property types
      content = content.replace(
        /: number \| null/g,
        ': NodeJS.Timeout | null'
      );
      
      writeFileSync(filePath, content);
      console.log(`✓ Fixed setInterval types in ${filePath}`);
    }
  } catch (error) {
    console.log(`- Skipped ${filePath}: ${error.message}`);
  }
});

// Fix 2: Update process.env usage
const processEnvFiles = [
  'src/components/debug/AlertDebugInfo.tsx',
  'src/components/common/ErrorBoundary.tsx',
  'src/components/common/ErrorTrigger.tsx',
  'src/test/test-runner.ts',
  'src/utils/performance.ts'
];

processEnvFiles.forEach(filePath => {
  try {
    if (require('fs').existsSync(filePath)) {
      let content = readFileSync(filePath, 'utf8');
      
      // Replace process.env with import.meta.env where appropriate
      content = content.replace(
        /process\.env\.NODE_ENV/g,
        'import.meta.env.MODE'
      );
      
      writeFileSync(filePath, content);
      console.log(`✓ Fixed process.env usage in ${filePath}`);
    }
  } catch (error) {
    console.log(`- Skipped ${filePath}: ${error.message}`);
  }
});

console.log('TypeScript fixes complete!');