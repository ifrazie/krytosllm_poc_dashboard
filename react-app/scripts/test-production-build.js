#!/usr/bin/env node

/**
 * Production Build Performance Test
 * Tests the production build for performance and optimization
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');

// Performance thresholds
const THRESHOLDS = {
  totalJSSize: 1000000, // 1MB
  totalCSSSize: 200000,  // 200KB
  maxChunkSize: 500000,  // 500KB
  minChunks: 5,          // Minimum number of chunks for good splitting
  maxChunks: 20          // Maximum to avoid too much fragmentation
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeFile(filePath) {
  const stats = fs.statSync(filePath);
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName);
  
  return {
    name: fileName,
    path: filePath,
    size: stats.size,
    extension: ext
  };
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(analyzeFile(filePath));
    }
  });
  
  return fileList;
}

function testBuildPerformance() {
  console.log('🚀 Testing Production Build Performance\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  const allFiles = getAllFiles(DIST_DIR);
  const jsFiles = allFiles.filter(f => f.extension === '.js');
  const cssFiles = allFiles.filter(f => f.extension === '.css');

  // Calculate totals
  const totalJSSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
  const totalCSSSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
  const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);

  console.log('📊 Build Analysis Results:');
  console.log(`   JavaScript: ${formatBytes(totalJSSize)} (${jsFiles.length} files)`);
  console.log(`   CSS: ${formatBytes(totalCSSSize)} (${cssFiles.length} files)`);
  console.log(`   Total: ${formatBytes(totalSize)} (${allFiles.length} files)\n`);

  // Performance tests
  const tests = [];

  // Test 1: Total JavaScript size
  const jsTest = {
    name: 'JavaScript Bundle Size',
    passed: totalJSSize <= THRESHOLDS.totalJSSize,
    actual: formatBytes(totalJSSize),
    threshold: formatBytes(THRESHOLDS.totalJSSize),
    impact: 'High'
  };
  tests.push(jsTest);

  // Test 2: Total CSS size
  const cssTest = {
    name: 'CSS Bundle Size',
    passed: totalCSSSize <= THRESHOLDS.totalCSSSize,
    actual: formatBytes(totalCSSSize),
    threshold: formatBytes(THRESHOLDS.totalCSSSize),
    impact: 'Medium'
  };
  tests.push(cssTest);

  // Test 3: Chunk splitting
  const chunkTest = {
    name: 'Code Splitting',
    passed: jsFiles.length >= THRESHOLDS.minChunks && jsFiles.length <= THRESHOLDS.maxChunks,
    actual: `${jsFiles.length} chunks`,
    threshold: `${THRESHOLDS.minChunks}-${THRESHOLDS.maxChunks} chunks`,
    impact: 'High'
  };
  tests.push(chunkTest);

  // Test 4: Large chunk detection
  const largeChunks = jsFiles.filter(f => f.size > THRESHOLDS.maxChunkSize);
  const largeChunkTest = {
    name: 'Large Chunk Detection',
    passed: largeChunks.length === 0,
    actual: largeChunks.length > 0 ? `${largeChunks.length} large chunks` : 'No large chunks',
    threshold: 'No chunks > ' + formatBytes(THRESHOLDS.maxChunkSize),
    impact: 'Medium'
  };
  tests.push(largeChunkTest);

  // Test 5: Source maps
  const sourceMaps = allFiles.filter(f => f.name.endsWith('.map'));
  const sourceMapTest = {
    name: 'Source Maps Generated',
    passed: sourceMaps.length > 0,
    actual: `${sourceMaps.length} source maps`,
    threshold: '> 0 source maps',
    impact: 'Low'
  };
  tests.push(sourceMapTest);

  // Test 6: Asset optimization
  const images = allFiles.filter(f => /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f.extension));
  const totalImageSize = images.reduce((sum, file) => sum + file.size, 0);
  const imageTest = {
    name: 'Image Optimization',
    passed: totalImageSize < 100000, // 100KB
    actual: formatBytes(totalImageSize),
    threshold: '< 100KB',
    impact: 'Low'
  };
  tests.push(imageTest);

  // Display results
  console.log('🧪 Performance Test Results:\n');
  
  let passedTests = 0;
  let highImpactFailures = 0;

  tests.forEach((test, index) => {
    const status = test.passed ? '✅' : '❌';
    const impact = test.impact === 'High' ? '🔴' : test.impact === 'Medium' ? '🟡' : '🟢';
    
    console.log(`${index + 1}. ${status} ${test.name} ${impact}`);
    console.log(`   Actual: ${test.actual}`);
    console.log(`   Threshold: ${test.threshold}`);
    
    if (!test.passed && test.impact === 'High') {
      highImpactFailures++;
    }
    
    if (test.passed) {
      passedTests++;
    }
    
    console.log('');
  });

  // Summary
  console.log('📈 Performance Summary:');
  console.log(`   Tests Passed: ${passedTests}/${tests.length}`);
  console.log(`   High Impact Failures: ${highImpactFailures}`);
  
  if (passedTests === tests.length) {
    console.log('   🎉 All performance tests passed!');
  } else if (highImpactFailures === 0) {
    console.log('   ⚠️  Some tests failed, but no high-impact issues detected.');
  } else {
    console.log('   🚨 High-impact performance issues detected!');
  }

  // Recommendations
  console.log('\n💡 Optimization Recommendations:');
  
  if (!jsTest.passed) {
    console.log('   • Consider lazy loading more components');
    console.log('   • Review and remove unused dependencies');
    console.log('   • Implement more aggressive code splitting');
  }
  
  if (!cssTest.passed) {
    console.log('   • Enable CSS purging for unused styles');
    console.log('   • Consider CSS-in-JS for better tree shaking');
  }
  
  if (!chunkTest.passed) {
    console.log('   • Optimize chunk splitting configuration');
    console.log('   • Balance between too many and too few chunks');
  }
  
  if (largeChunks.length > 0) {
    console.log('   • Split large chunks further:');
    largeChunks.forEach(chunk => {
      console.log(`     - ${chunk.name}: ${formatBytes(chunk.size)}`);
    });
  }

  // CDN Dependencies Check
  console.log('\n🌐 CDN Dependencies Check:');
  
  const indexHtml = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexHtml)) {
    const htmlContent = fs.readFileSync(indexHtml, 'utf8');
    
    const cdnLinks = [
      { name: 'Font Awesome', pattern: /cdnjs\.cloudflare\.com.*font-awesome/i },
      { name: 'Google Fonts', pattern: /fonts\.googleapis\.com/i },
      { name: 'FKGroteskNeue', pattern: /cdn\.perplexity\.ai.*fonts/i }
    ];
    
    cdnLinks.forEach(link => {
      const found = link.pattern.test(htmlContent);
      console.log(`   ${found ? '✅' : '❌'} ${link.name}`);
    });
  }

  console.log('\n🏁 Performance test complete!');
  
  // Exit with appropriate code
  process.exit(highImpactFailures > 0 ? 1 : 0);
}

testBuildPerformance();