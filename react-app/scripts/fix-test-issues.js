/**
 * Script to fix test-related TypeScript issues
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('Fixing test issues...');

// Helper to find all test files
function findTestFiles(dir, files = []) {
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      findTestFiles(fullPath, files);
    } else if (item.endsWith('.test.tsx') || item.endsWith('.test.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fix 1: Update test files to use complete state helpers
const testFiles = findTestFiles('src');

testFiles.forEach(filePath => {
  try {
    let content = readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Add import for state helpers if AppProvider is used
    if (content.includes('AppProvider') && !content.includes('createTestState')) {
      const importMatch = content.match(/import.*from ['"]\.\.\/.*test.*['"];?\n/);
      if (importMatch) {
        content = content.replace(
          importMatch[0],
          importMatch[0] + "import { createTestState } from '../test/state-helpers';\n"
        );
        modified = true;
      } else if (content.includes("from '../test/test-helpers'")) {
        content = content.replace(
          "from '../test/test-helpers'",
          "from '../test/test-helpers';\nimport { createTestState } from '../test/state-helpers'"
        );
        modified = true;
      }
    }
    
    // Fix incomplete loading states
    content = content.replace(
      /loading:\s*{\s*([^}]+)\s*}/g,
      (match, loadingContent) => {
        if (loadingContent.includes('alerts') || loadingContent.includes('metrics') || 
            loadingContent.includes('investigations') || loadingContent.includes('integrations') ||
            loadingContent.includes('incidents')) {
          return `loading: createTestState().loading`;
        }
        return match;
      }
    );
    
    // Fix incomplete error states
    content = content.replace(
      /errors:\s*{}/g,
      'errors: createTestState().errors'
    );
    
    if (modified) {
      writeFileSync(filePath, content);
      console.log(`✓ Fixed ${filePath}`);
    }
  } catch (error) {
    console.log(`- Skipped ${filePath}: ${error.message}`);
  }
});

console.log('Test fixes complete!');