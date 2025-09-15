#!/usr/bin/env node

/**
 * Test Commands Script
 * 
 * Provides convenient commands for running different types of tests
 */

const { execSync } = require('child_process')
const path = require('path')

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

// Helper function to run commands
const runCommand = (command, description) => {
  console.log(`${colors.cyan}${colors.bright}Running: ${description}${colors.reset}`)
  console.log(`${colors.yellow}Command: ${command}${colors.reset}\n`)
  
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() })
    console.log(`${colors.green}✓ ${description} completed successfully${colors.reset}\n`)
  } catch (error) {
    console.error(`${colors.red}✗ ${description} failed${colors.reset}`)
    process.exit(1)
  }
}

// Available test commands
const commands = {
  // Basic test commands
  'test': {
    command: 'vitest',
    description: 'Run tests in watch mode'
  },
  'test:run': {
    command: 'vitest run',
    description: 'Run all tests once'
  },
  'test:ui': {
    command: 'vitest --ui',
    description: 'Run tests with UI interface'
  },
  'test:coverage': {
    command: 'vitest run --coverage',
    description: 'Run tests with coverage report'
  },
  
  // Component-specific tests
  'test:components': {
    command: 'vitest run src/components/',
    description: 'Run all component tests'
  },
  'test:hooks': {
    command: 'vitest run src/hooks/',
    description: 'Run all hook tests'
  },
  'test:context': {
    command: 'vitest run src/context/',
    description: 'Run all context tests'
  },
  'test:utils': {
    command: 'vitest run src/utils/',
    description: 'Run all utility tests'
  },
  
  // Test categories
  'test:unit': {
    command: 'vitest run --grep "Unit Tests"',
    description: 'Run unit tests only'
  },
  'test:integration': {
    command: 'vitest run --grep "Integration Tests"',
    description: 'Run integration tests only'
  },
  'test:smoke': {
    command: 'vitest run --grep "@smoke"',
    description: 'Run smoke tests only'
  },
  'test:critical': {
    command: 'vitest run --grep "@critical"',
    description: 'Run critical tests only'
  },
  'test:performance': {
    command: 'vitest run --grep "@performance"',
    description: 'Run performance tests only'
  },
  'test:a11y': {
    command: 'vitest run --grep "@a11y"',
    description: 'Run accessibility tests only'
  },
  
  // Coverage commands
  'test:coverage:html': {
    command: 'vitest run --coverage --coverage.reporter=html',
    description: 'Generate HTML coverage report'
  },
  'test:coverage:lcov': {
    command: 'vitest run --coverage --coverage.reporter=lcov',
    description: 'Generate LCOV coverage report'
  },
  'test:coverage:json': {
    command: 'vitest run --coverage --coverage.reporter=json',
    description: 'Generate JSON coverage report'
  },
  'test:coverage:threshold': {
    command: 'vitest run --coverage --coverage.thresholds.global.lines=90',
    description: 'Run tests with 90% coverage threshold'
  },
  
  // Debug commands
  'test:debug': {
    command: 'vitest run --reporter=verbose',
    description: 'Run tests with verbose output'
  },
  'test:debug:single': {
    command: 'vitest run --reporter=verbose --grep',
    description: 'Debug a single test (requires test name)'
  },
  
  // Specific component tests
  'test:dashboard': {
    command: 'vitest run --grep "Dashboard"',
    description: 'Run Dashboard component tests'
  },
  'test:alerts': {
    command: 'vitest run --grep "Alert"',
    description: 'Run Alert-related tests'
  },
  'test:investigations': {
    command: 'vitest run --grep "Investigation"',
    description: 'Run Investigation-related tests'
  },
  'test:hunting': {
    command: 'vitest run --grep "Hunting"',
    description: 'Run Threat Hunting tests'
  },
  'test:incidents': {
    command: 'vitest run --grep "Incident"',
    description: 'Run Incident-related tests'
  },
  'test:analytics': {
    command: 'vitest run --grep "Analytics"',
    description: 'Run Analytics tests'
  },
  'test:integrations': {
    command: 'vitest run --grep "Integration"',
    description: 'Run Integration tests'
  },
  
  // Chart tests
  'test:charts': {
    command: 'vitest run --grep "Chart"',
    description: 'Run Chart component tests'
  },
  
  // Modal tests
  'test:modals': {
    command: 'vitest run --grep "Modal"',
    description: 'Run Modal component tests'
  },
  
  // Table tests
  'test:tables': {
    command: 'vitest run --grep "Table"',
    description: 'Run Table component tests'
  },
  
  // Continuous Integration commands
  'test:ci': {
    command: 'vitest run --coverage --reporter=json --reporter=html',
    description: 'Run tests for CI/CD pipeline'
  },
  'test:ci:fast': {
    command: 'vitest run --grep "@smoke" --reporter=json',
    description: 'Run fast CI tests (smoke tests only)'
  },
  
  // Watch mode variants
  'test:watch:components': {
    command: 'vitest src/components/',
    description: 'Watch component tests'
  },
  'test:watch:hooks': {
    command: 'vitest src/hooks/',
    description: 'Watch hook tests'
  },
}

// Help command
const showHelp = () => {
  console.log(`${colors.bright}${colors.blue}Available Test Commands:${colors.reset}\n`)
  
  Object.entries(commands).forEach(([name, config]) => {
    console.log(`${colors.green}npm run ${name}${colors.reset}`)
    console.log(`  ${config.description}`)
    console.log(`  ${colors.yellow}${config.command}${colors.reset}\n`)
  })
  
  console.log(`${colors.bright}Usage Examples:${colors.reset}`)
  console.log(`${colors.cyan}npm run test${colors.reset} - Run tests in watch mode`)
  console.log(`${colors.cyan}npm run test:coverage${colors.reset} - Run tests with coverage`)
  console.log(`${colors.cyan}npm run test:smoke${colors.reset} - Run smoke tests only`)
  console.log(`${colors.cyan}npm run test:dashboard${colors.reset} - Run Dashboard tests only`)
}

// Main execution
const main = () => {
  const args = process.argv.slice(2)
  const command = args[0]
  
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp()
    return
  }
  
  if (commands[command]) {
    let fullCommand = commands[command].command
    
    // Handle commands that need additional arguments
    if (command === 'test:debug:single' && args[1]) {
      fullCommand += ` "${args[1]}"`
    }
    
    runCommand(fullCommand, commands[command].description)
  } else {
    console.error(`${colors.red}Unknown command: ${command}${colors.reset}`)
    console.log(`${colors.yellow}Run 'node scripts/test-commands.js help' to see available commands${colors.reset}`)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { commands, runCommand, showHelp }