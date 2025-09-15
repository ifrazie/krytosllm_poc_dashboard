#!/usr/bin/env node

/**
 * Build Analysis Script
 * Analyzes the production build output for optimization verification
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
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
    extension: ext,
    isGzippable: ['.js', '.css', '.html', '.json'].includes(ext)
  };
}

function categorizeFiles(files) {
  const categories = {
    javascript: [],
    css: [],
    images: [],
    fonts: [],
    other: []
  };

  files.forEach(file => {
    switch (file.extension) {
      case '.js':
        categories.javascript.push(file);
        break;
      case '.css':
        categories.css.push(file);
        break;
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.svg':
      case '.webp':
        categories.images.push(file);
        break;
      case '.woff':
      case '.woff2':
      case '.ttf':
      case '.eot':
        categories.fonts.push(file);
        break;
      default:
        categories.other.push(file);
    }
  });

  return categories;
}

function analyzeChunks(jsFiles) {
  const chunks = {
    vendor: [],
    feature: [],
    entry: [],
    other: []
  };

  jsFiles.forEach(file => {
    const name = file.name.toLowerCase();
    if (name.includes('vendor') || name.includes('react') || name.includes('chart')) {
      chunks.vendor.push(file);
    } else if (name.includes('dashboard') || name.includes('alert') || name.includes('chart')) {
      chunks.feature.push(file);
    } else if (name.includes('index') || name.includes('main')) {
      chunks.entry.push(file);
    } else {
      chunks.other.push(file);
    }
  });

  return chunks;
}

function printSection(title, color = colors.cyan) {
  console.log(`\n${color}${colors.bright}=== ${title} ===${colors.reset}`);
}

function printFileList(files, category) {
  if (files.length === 0) {
    console.log(`  ${colors.yellow}No ${category} files found${colors.reset}`);
    return;
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  console.log(`  ${colors.bright}${category} (${files.length} files, ${formatBytes(totalSize)}):${colors.reset}`);
  
  files
    .sort((a, b) => b.size - a.size)
    .forEach(file => {
      const sizeColor = file.size > 500000 ? colors.red : 
                       file.size > 100000 ? colors.yellow : colors.green;
      console.log(`    ${file.name}: ${sizeColor}${formatBytes(file.size)}${colors.reset}`);
    });
}

function checkOptimizations(categories, chunks) {
  printSection('Optimization Analysis', colors.magenta);
  
  const issues = [];
  const recommendations = [];

  // Check JavaScript bundle sizes
  const totalJSSize = categories.javascript.reduce((sum, file) => sum + file.size, 0);
  console.log(`  Total JavaScript size: ${formatBytes(totalJSSize)}`);
  
  if (totalJSSize > 2000000) { // 2MB
    issues.push('JavaScript bundle size is large (>2MB)');
    recommendations.push('Consider further code splitting or lazy loading');
  }

  // Check for vendor chunk separation
  if (chunks.vendor.length === 0) {
    issues.push('No vendor chunks detected');
    recommendations.push('Ensure vendor libraries are split into separate chunks');
  } else {
    console.log(`  ${colors.green}✓ Vendor chunks found: ${chunks.vendor.length}${colors.reset}`);
  }

  // Check for feature-based chunks
  if (chunks.feature.length > 0) {
    console.log(`  ${colors.green}✓ Feature chunks found: ${chunks.feature.length}${colors.reset}`);
  } else {
    recommendations.push('Consider implementing feature-based code splitting');
  }

  // Check CSS optimization
  const totalCSSSize = categories.css.reduce((sum, file) => sum + file.size, 0);
  console.log(`  Total CSS size: ${formatBytes(totalCSSSize)}`);
  
  if (totalCSSSize > 500000) { // 500KB
    issues.push('CSS bundle size is large (>500KB)');
    recommendations.push('Consider CSS code splitting or unused CSS removal');
  }

  // Check for source maps
  const hasSourceMaps = categories.javascript.some(file => 
    fs.existsSync(file.path + '.map')
  );
  
  if (hasSourceMaps) {
    console.log(`  ${colors.green}✓ Source maps generated${colors.reset}`);
  } else {
    recommendations.push('Enable source maps for better debugging');
  }

  // Print issues and recommendations
  if (issues.length > 0) {
    console.log(`\n  ${colors.red}${colors.bright}Issues:${colors.reset}`);
    issues.forEach(issue => console.log(`    ${colors.red}• ${issue}${colors.reset}`));
  }

  if (recommendations.length > 0) {
    console.log(`\n  ${colors.yellow}${colors.bright}Recommendations:${colors.reset}`);
    recommendations.forEach(rec => console.log(`    ${colors.yellow}• ${rec}${colors.reset}`));
  }

  if (issues.length === 0) {
    console.log(`\n  ${colors.green}${colors.bright}✓ Build optimization looks good!${colors.reset}`);
  }
}

function analyzeBuild() {
  console.log(`${colors.bright}${colors.blue}Prophet AI SOC Platform - Build Analysis${colors.reset}`);
  console.log(`Analyzing build output in: ${DIST_DIR}`);

  // Check if dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`${colors.red}Error: Dist directory not found. Run 'npm run build' first.${colors.reset}`);
    process.exit(1);
  }

  // Get all files recursively
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

  const allFiles = getAllFiles(DIST_DIR);
  const categories = categorizeFiles(allFiles);
  const chunks = analyzeChunks(categories.javascript);

  // Print analysis results
  printSection('File Categories');
  printFileList(categories.javascript, 'JavaScript');
  printFileList(categories.css, 'CSS');
  printFileList(categories.images, 'Images');
  printFileList(categories.fonts, 'Fonts');
  printFileList(categories.other, 'Other');

  printSection('JavaScript Chunks');
  printFileList(chunks.vendor, 'Vendor Chunks');
  printFileList(chunks.feature, 'Feature Chunks');
  printFileList(chunks.entry, 'Entry Chunks');
  printFileList(chunks.other, 'Other Chunks');

  // Calculate total size
  const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
  printSection('Summary');
  console.log(`  Total files: ${allFiles.length}`);
  console.log(`  Total size: ${formatBytes(totalSize)}`);
  console.log(`  Gzippable size: ${formatBytes(
    allFiles.filter(f => f.isGzippable).reduce((sum, file) => sum + file.size, 0)
  )}`);

  // Check optimizations
  checkOptimizations(categories, chunks);

  console.log(`\n${colors.bright}Analysis complete!${colors.reset}`);
}

// Run analysis
analyzeBuild();