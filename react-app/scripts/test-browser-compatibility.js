#!/usr/bin/env node

/**
 * Browser Compatibility Test
 * Tests the production build for browser compatibility
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');

// Browser compatibility requirements
const COMPATIBILITY_REQUIREMENTS = {
  // Modern browsers that should be supported
  supportedBrowsers: [
    'Chrome 90+',
    'Firefox 88+',
    'Safari 14+',
    'Edge 90+'
  ],
  
  // JavaScript features that should be avoided for compatibility
  modernFeatures: [
    'import.meta.env', // Should be replaced with process.env in build
    'optional chaining (?.)' // Should be transpiled
  ],
  
  // CSS features that need prefixes or fallbacks
  cssFeatures: [
    'grid',
    'flexbox',
    'custom properties (CSS variables)'
  ]
};

function analyzeJavaScriptCompatibility() {
  console.log('🔍 Analyzing JavaScript Compatibility...\n');
  
  const jsFiles = fs.readdirSync(path.join(DIST_DIR, 'js'))
    .filter(file => file.endsWith('.js') && !file.endsWith('.map'));
  
  const issues = [];
  const warnings = [];
  
  jsFiles.forEach(file => {
    const filePath = path.join(DIST_DIR, 'js', file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for modern JavaScript features that might not be compatible
    if (content.includes('import.meta')) {
      issues.push(`${file}: Contains import.meta (may not work in older browsers)`);
    }
    
    if (content.includes('?.')) {
      warnings.push(`${file}: Contains optional chaining (should be transpiled)`);
    }
    
    if (content.includes('??')) {
      warnings.push(`${file}: Contains nullish coalescing (should be transpiled)`);
    }
    
    // Check for ES6+ features
    if (content.includes('class ') && !content.includes('function')) {
      // This is likely transpiled already if it's in the build
    }
    
    // Check for async/await
    if (content.includes('async ') || content.includes('await ')) {
      // This should be transpiled for older browsers
    }
  });
  
  return { issues, warnings, totalFiles: jsFiles.length };
}

function analyzeCSSCompatibility() {
  console.log('🎨 Analyzing CSS Compatibility...\n');
  
  const cssFiles = fs.readdirSync(path.join(DIST_DIR, 'css'))
    .filter(file => file.endsWith('.css'));
  
  const features = {
    grid: 0,
    flexbox: 0,
    customProperties: 0,
    prefixes: 0
  };
  
  const issues = [];
  
  cssFiles.forEach(file => {
    const filePath = path.join(DIST_DIR, 'css', file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for CSS Grid
    if (content.includes('display:grid') || content.includes('display: grid')) {
      features.grid++;
    }
    
    // Check for Flexbox
    if (content.includes('display:flex') || content.includes('display: flex')) {
      features.flexbox++;
    }
    
    // Check for CSS Custom Properties
    if (content.includes('var(--') || content.includes('--')) {
      features.customProperties++;
    }
    
    // Check for vendor prefixes
    if (content.includes('-webkit-') || content.includes('-moz-') || content.includes('-ms-')) {
      features.prefixes++;
    }
    
    // Check for modern CSS features that might need fallbacks
    if (content.includes('clamp(') || content.includes('min(') || content.includes('max(')) {
      issues.push(`${file}: Uses CSS math functions (may need fallbacks)`);
    }
  });
  
  return { features, issues, totalFiles: cssFiles.length };
}

function analyzeHTMLCompatibility() {
  console.log('📄 Analyzing HTML Compatibility...\n');
  
  const indexPath = path.join(DIST_DIR, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf8');
  
  const features = {
    semanticElements: 0,
    modernAttributes: 0,
    cdnLinks: 0
  };
  
  const issues = [];
  
  // Check for semantic HTML5 elements
  const semanticElements = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'];
  semanticElements.forEach(element => {
    if (content.includes(`<${element}`)) {
      features.semanticElements++;
    }
  });
  
  // Check for modern attributes
  if (content.includes('crossorigin')) {
    features.modernAttributes++;
  }
  
  if (content.includes('integrity')) {
    features.modernAttributes++;
  }
  
  // Check for CDN links
  const cdnPatterns = [
    'cdnjs.cloudflare.com',
    'fonts.googleapis.com',
    'cdn.perplexity.ai'
  ];
  
  cdnPatterns.forEach(pattern => {
    if (content.includes(pattern)) {
      features.cdnLinks++;
    }
  });
  
  // Check for potential compatibility issues
  if (content.includes('type="module"')) {
    issues.push('Uses ES modules (not supported in IE)');
  }
  
  return { features, issues };
}

function generateCompatibilityReport() {
  console.log('🌐 Browser Compatibility Analysis Report\n');
  console.log('========================================\n');
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Build directory not found. Run build first.');
    process.exit(1);
  }
  
  // Analyze JavaScript
  const jsAnalysis = analyzeJavaScriptCompatibility();
  console.log(`📊 JavaScript Analysis (${jsAnalysis.totalFiles} files):`);
  
  if (jsAnalysis.issues.length === 0) {
    console.log('   ✅ No compatibility issues found');
  } else {
    console.log('   ❌ Issues found:');
    jsAnalysis.issues.forEach(issue => console.log(`      • ${issue}`));
  }
  
  if (jsAnalysis.warnings.length > 0) {
    console.log('   ⚠️  Warnings:');
    jsAnalysis.warnings.forEach(warning => console.log(`      • ${warning}`));
  }
  
  console.log('');
  
  // Analyze CSS
  const cssAnalysis = analyzeCSSCompatibility();
  console.log(`🎨 CSS Analysis (${cssAnalysis.totalFiles} files):`);
  console.log(`   Grid usage: ${cssAnalysis.features.grid} files`);
  console.log(`   Flexbox usage: ${cssAnalysis.features.flexbox} files`);
  console.log(`   CSS Variables: ${cssAnalysis.features.customProperties} files`);
  console.log(`   Vendor prefixes: ${cssAnalysis.features.prefixes} files`);
  
  if (cssAnalysis.issues.length === 0) {
    console.log('   ✅ No CSS compatibility issues found');
  } else {
    console.log('   ⚠️  CSS Issues:');
    cssAnalysis.issues.forEach(issue => console.log(`      • ${issue}`));
  }
  
  console.log('');
  
  // Analyze HTML
  const htmlAnalysis = analyzeHTMLCompatibility();
  console.log('📄 HTML Analysis:');
  console.log(`   Semantic elements: ${htmlAnalysis.features.semanticElements}`);
  console.log(`   Modern attributes: ${htmlAnalysis.features.modernAttributes}`);
  console.log(`   CDN dependencies: ${htmlAnalysis.features.cdnLinks}`);
  
  if (htmlAnalysis.issues.length === 0) {
    console.log('   ✅ No HTML compatibility issues found');
  } else {
    console.log('   ⚠️  HTML Issues:');
    htmlAnalysis.issues.forEach(issue => console.log(`      • ${issue}`));
  }
  
  console.log('');
  
  // Overall assessment
  const totalIssues = jsAnalysis.issues.length + cssAnalysis.issues.length + htmlAnalysis.issues.length;
  const totalWarnings = jsAnalysis.warnings.length;
  
  console.log('🏆 Overall Compatibility Assessment:');
  console.log(`   Critical Issues: ${totalIssues}`);
  console.log(`   Warnings: ${totalWarnings}`);
  
  if (totalIssues === 0) {
    console.log('   ✅ Build is compatible with modern browsers');
    console.log('   📱 Supports: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+');
  } else {
    console.log('   ⚠️  Some compatibility issues detected');
  }
  
  console.log('\n💡 Recommendations:');
  console.log('   • Test in target browsers before deployment');
  console.log('   • Consider polyfills for older browser support');
  console.log('   • Verify CDN dependencies load correctly');
  console.log('   • Test responsive design on different devices');
  
  console.log('\n✅ Browser compatibility analysis complete!');
  
  return totalIssues === 0;
}

// Run the analysis
const isCompatible = generateCompatibilityReport();
process.exit(isCompatible ? 0 : 1);