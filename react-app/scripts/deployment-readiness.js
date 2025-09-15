#!/usr/bin/env node

/**
 * Deployment Readiness Check
 * Comprehensive test for production deployment preparation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.cyan) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}${colors.bright}✅ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}${colors.bright}⚠️  ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}${colors.bright}❌ ${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function checkBuildExists() {
  log('\n🔍 Checking Build Output...');
  
  if (!fs.existsSync(DIST_DIR)) {
    logError('Build directory not found');
    return false;
  }
  
  const indexHtml = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtml)) {
    logError('index.html not found in build output');
    return false;
  }
  
  logSuccess('Build output exists');
  return true;
}

function checkFileStructure() {
  log('\n📁 Checking File Structure...');
  
  const requiredDirs = ['js', 'css'];
  const missingDirs = [];
  
  requiredDirs.forEach(dir => {
    const dirPath = path.join(DIST_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      missingDirs.push(dir);
    }
  });
  
  if (missingDirs.length > 0) {
    logError(`Missing directories: ${missingDirs.join(', ')}`);
    return false;
  }
  
  logSuccess('File structure is correct');
  return true;
}

function checkAssetSizes() {
  log('\n📊 Checking Asset Sizes...');
  
  const jsDir = path.join(DIST_DIR, 'js');
  const cssDir = path.join(DIST_DIR, 'css');
  
  let totalJSSize = 0;
  let totalCSSSize = 0;
  let largeFiles = [];
  
  // Check JavaScript files
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
    jsFiles.forEach(file => {
      const filePath = path.join(jsDir, file);
      const size = fs.statSync(filePath).size;
      totalJSSize += size;
      
      if (size > 500000) { // 500KB
        largeFiles.push({ name: file, size: formatBytes(size), type: 'JS' });
      }
    });
  }
  
  // Check CSS files
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    cssFiles.forEach(file => {
      const filePath = path.join(cssDir, file);
      const size = fs.statSync(filePath).size;
      totalCSSSize += size;
      
      if (size > 100000) { // 100KB
        largeFiles.push({ name: file, size: formatBytes(size), type: 'CSS' });
      }
    });
  }
  
  log(`   JavaScript: ${formatBytes(totalJSSize)}`);
  log(`   CSS: ${formatBytes(totalCSSSize)}`);
  
  if (largeFiles.length > 0) {
    logWarning('Large files detected:');
    largeFiles.forEach(file => {
      log(`     ${file.name} (${file.type}): ${file.size}`);
    });
  }
  
  // Performance thresholds
  const jsThreshold = 1000000; // 1MB
  const cssThreshold = 200000;  // 200KB
  
  let passed = true;
  
  if (totalJSSize > jsThreshold) {
    logWarning(`JavaScript bundle size (${formatBytes(totalJSSize)}) exceeds recommended threshold (${formatBytes(jsThreshold)})`);
    passed = false;
  }
  
  if (totalCSSSize > cssThreshold) {
    logWarning(`CSS bundle size (${formatBytes(totalCSSSize)}) exceeds recommended threshold (${formatBytes(cssThreshold)})`);
    passed = false;
  }
  
  if (passed) {
    logSuccess('Asset sizes are within acceptable limits');
  }
  
  return passed;
}

function checkExternalDependencies() {
  log('\n🌐 Checking External Dependencies...');
  
  const indexPath = path.join(DIST_DIR, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf8');
  
  const expectedDependencies = [
    { name: 'Font Awesome', pattern: /cdnjs\.cloudflare\.com.*font-awesome/i },
    { name: 'Google Fonts', pattern: /fonts\.googleapis\.com/i },
    { name: 'FKGroteskNeue', pattern: /cdn\.perplexity\.ai.*fonts/i }
  ];
  
  let allFound = true;
  
  expectedDependencies.forEach(dep => {
    if (dep.pattern.test(content)) {
      logSuccess(`${dep.name} CDN link found`);
    } else {
      logError(`${dep.name} CDN link missing`);
      allFound = false;
    }
  });
  
  // Check for proper preconnect and dns-prefetch
  const hasPreconnect = content.includes('rel="preconnect"');
  const hasDnsPrefetch = content.includes('rel="dns-prefetch"');
  
  if (hasPreconnect) {
    logSuccess('Preconnect links found');
  } else {
    logWarning('No preconnect links found');
  }
  
  if (hasDnsPrefetch) {
    logSuccess('DNS prefetch links found');
  } else {
    logWarning('No DNS prefetch links found');
  }
  
  return allFound;
}

function checkSecurityHeaders() {
  log('\n🔒 Checking Security Configuration...');
  
  const indexPath = path.join(DIST_DIR, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf8');
  
  let securityScore = 0;
  
  // Check for integrity attributes on CDN links
  if (content.includes('integrity=')) {
    logSuccess('Integrity attributes found on CDN links');
    securityScore++;
  } else {
    logWarning('No integrity attributes found on CDN links');
  }
  
  // Check for crossorigin attributes
  if (content.includes('crossorigin=')) {
    logSuccess('Crossorigin attributes found');
    securityScore++;
  } else {
    logWarning('No crossorigin attributes found');
  }
  
  // Check for referrerpolicy
  if (content.includes('referrerpolicy=')) {
    logSuccess('Referrer policy found');
    securityScore++;
  } else {
    logWarning('No referrer policy found');
  }
  
  // Check for noindex meta tag (should not be in production)
  if (content.includes('noindex')) {
    logError('noindex meta tag found (remove for production)');
    return false;
  } else {
    logSuccess('No noindex meta tag found');
    securityScore++;
  }
  
  return securityScore >= 2; // At least half the security checks should pass
}

function checkPerformanceOptimizations() {
  log('\n⚡ Checking Performance Optimizations...');
  
  const indexPath = path.join(DIST_DIR, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf8');
  
  let perfScore = 0;
  
  // Check for preload links
  if (content.includes('rel="preload"')) {
    logSuccess('Preload links found');
    perfScore++;
  } else {
    logWarning('No preload links found');
  }
  
  // Check for modulepreload
  if (content.includes('rel="modulepreload"')) {
    logSuccess('Module preload found');
    perfScore++;
  } else {
    logWarning('No module preload found');
  }
  
  // Check for minified assets
  const jsDir = path.join(DIST_DIR, 'js');
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
    const hasMinified = jsFiles.some(file => {
      const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
      return content.length > 1000 && !content.includes('\\n\\n'); // Rough minification check
    });
    
    if (hasMinified) {
      logSuccess('JavaScript files appear to be minified');
      perfScore++;
    } else {
      logWarning('JavaScript files may not be minified');
    }
  }
  
  // Check for source maps
  const hasSourceMaps = fs.existsSync(jsDir) && 
    fs.readdirSync(jsDir).some(f => f.endsWith('.js.map'));
  
  if (hasSourceMaps) {
    logSuccess('Source maps generated for debugging');
    perfScore++;
  } else {
    logWarning('No source maps found');
  }
  
  return perfScore >= 2;
}

function runDeploymentReadinessCheck() {
  log(`${colors.bright}${colors.blue}🚀 Prophet AI SOC Platform - Deployment Readiness Check${colors.reset}\n`);
  
  const checks = [
    { name: 'Build Output', fn: checkBuildExists },
    { name: 'File Structure', fn: checkFileStructure },
    { name: 'Asset Sizes', fn: checkAssetSizes },
    { name: 'External Dependencies', fn: checkExternalDependencies },
    { name: 'Security Configuration', fn: checkSecurityHeaders },
    { name: 'Performance Optimizations', fn: checkPerformanceOptimizations }
  ];
  
  let passedChecks = 0;
  let totalChecks = checks.length;
  
  for (const check of checks) {
    try {
      const passed = check.fn();
      if (passed) {
        passedChecks++;
      }
    } catch (error) {
      logError(`${check.name} check failed: ${error.message}`);
    }
  }
  
  // Summary
  log(`\n${colors.bright}📋 Deployment Readiness Summary:${colors.reset}`);
  log(`   Checks Passed: ${passedChecks}/${totalChecks}`);
  
  if (passedChecks === totalChecks) {
    logSuccess('All checks passed! Ready for deployment 🎉');
    
    log(`\n${colors.bright}🚀 Deployment Instructions:${colors.reset}`);
    log('   1. Upload the dist/ folder contents to your web server');
    log('   2. Configure your server to serve index.html for all routes (SPA routing)');
    log('   3. Enable gzip compression for .js, .css, and .html files');
    log('   4. Set appropriate cache headers for static assets');
    log('   5. Test the application in your target browsers');
    
  } else if (passedChecks >= totalChecks * 0.8) {
    logWarning('Most checks passed, but some issues need attention');
    log('   Review the warnings above before deploying');
    
  } else {
    logError('Multiple critical issues detected');
    log('   Fix the errors above before deploying to production');
  }
  
  log(`\n${colors.bright}📊 Build Statistics:${colors.reset}`);
  
  // Calculate total build size
  function calculateDirSize(dir) {
    let totalSize = 0;
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir, { recursive: true });
      files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile()) {
          totalSize += fs.statSync(filePath).size;
        }
      });
    }
    return totalSize;
  }
  
  const totalSize = calculateDirSize(DIST_DIR);
  const jsSize = calculateDirSize(path.join(DIST_DIR, 'js'));
  const cssSize = calculateDirSize(path.join(DIST_DIR, 'css'));
  
  log(`   Total Build Size: ${formatBytes(totalSize)}`);
  log(`   JavaScript: ${formatBytes(jsSize)}`);
  log(`   CSS: ${formatBytes(cssSize)}`);
  log(`   Estimated Gzipped: ~${formatBytes(totalSize * 0.3)}`);
  
  return passedChecks >= totalChecks * 0.8;
}

// Run the deployment readiness check
const isReady = runDeploymentReadinessCheck();
process.exit(isReady ? 0 : 1);