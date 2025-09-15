/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules/',
      'src/data/dataManager.test.ts', // Exclude existing Jest-style test
      '**/*.d.ts',
      '**/*.config.*',
      'dist/',
      'coverage/',
    ],
    // Test execution configuration
    testTimeout: 10000, // 10 seconds timeout
    hookTimeout: 10000, // 10 seconds for hooks
    teardownTimeout: 5000, // 5 seconds for teardown
    // Retry configuration
    retry: 2, // Retry failed tests twice
    // Reporter configuration
    reporter: ['default', 'json', 'html'],
    outputFile: {
      json: './coverage/test-results.json',
      html: './coverage/test-results.html',
    },
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        'src/data/dataManager.test.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'dist/',
        'coverage/',
        'src/types/**/*', // Type definitions don't need coverage
        'src/**/*.stories.{ts,tsx}', // Storybook files
        'src/main.tsx', // Entry point
      ],
      // Coverage thresholds
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      // Include all source files in coverage report
      all: true,
      src: ['src'],
    },
    // Watch configuration
    watch: {
      exclude: ['node_modules/**', 'dist/**', 'coverage/**'],
    },
    // Environment configuration
    env: {
      NODE_ENV: 'test',
    },
  },
})