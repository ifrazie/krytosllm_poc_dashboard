# Prophet AI SOC Platform

A comprehensive Security Operations Center (SOC) analyst platform built with React, TypeScript, and Vite. This application provides real-time threat detection, investigation, and response capabilities for cybersecurity professionals.

## Features

- **Real-time Alert Management**: Monitor and triage security alerts from multiple sources
- **AI-Powered Investigation**: Automated evidence collection and threat analysis
- **Threat Hunting Interface**: Natural language query system for proactive threat detection
- **Incident Response Center**: Coordinate and manage security incident workflows
- **Analytics & Reporting**: SOC performance metrics and threat intelligence visualization
- **System Integrations**: Connect with security tools like Microsoft Sentinel, CrowdStrike, AWS GuardDuty
- **Debug Tools**: Built-in debugging components for development and troubleshooting

## Tech Stack

- **React 19** with TypeScript for type-safe component development
- **Vite** for fast development and optimized production builds
- **Chart.js** with React Chart.js 2 for data visualization
- **Context API** for global state management
- **Vitest** with React Testing Library for comprehensive testing
- **ESLint & Prettier** for code quality and formatting

## Project Structure

```
src/
├── components/           # React components organized by feature
│   ├── alerts/          # Alert management components
│   ├── analytics/       # Analytics and reporting components
│   ├── common/          # Shared/reusable components
│   ├── dashboard/       # Dashboard components
│   │   ├── Dashboard.tsx        # Main SOC dashboard interface
│   │   ├── SimpleDashboard.tsx  # Simplified dashboard with inline styles
│   │   ├── DebugDashboard.tsx   # Debug version of dashboard with state inspection
│   │   ├── AlertFeed.tsx        # Real-time alert feed component
│   │   ├── MetricsGrid.tsx      # SOC performance metrics display
│   │   └── TeamStatus.tsx       # Team member status and availability
│   ├── debug/           # Debug and development tools
│   │   ├── AlertDebug.tsx       # Real-time alert state debugging overlay
│   │   ├── AlertDebugInfo.tsx   # Alert information display utilities
│   │   ├── SimpleAlertTable.tsx # Simplified alert table for debugging
│   │   └── ThemeVisualizer.tsx  # Theme and styling debug component
│   ├── hunting/         # Threat hunting components
│   ├── incidents/       # Incident response components
│   ├── integrations/    # System integration components
│   └── investigations/  # Investigation workflow components
├── debug-test.tsx       # Simple rendering verification component
├── context/             # React Context providers and reducers
├── data/                # Mock data and data management
├── hooks/               # Custom React hooks
├── styles/              # Global styles and CSS modules
├── test/                # Testing utilities and configuration
├── types/               # TypeScript type definitions
└── utils/               # Utility functions and helpers
```

## Recent Updates

- **SimpleDashboard Component**: Added new SimpleDashboard component with inline styling approach
  - Self-contained dashboard with all styles defined inline using React.CSSProperties
  - Real-time SOC metrics display including alerts, investigations, incidents, and MTTR
  - Recent alerts feed with severity-based color coding
  - SOC team status monitoring with online/offline indicators
  - System health status display for infrastructure monitoring
  - Responsive grid layout optimized for various screen sizes
  - Dark theme styling consistent with SOC platform design
  - Uses AppContext for real-time data updates
  - FontAwesome icons for visual indicators

- **Code Quality**: Removed development console.log statements from AppContext data loading for cleaner production builds
- **Performance**: Optimized context initialization by eliminating debug output overhead
- **Type Safety**: Improved Dashboard component loading state destructuring to align with TypeScript definitions
- **Test Improvements**: Enhanced component mocks to better match actual implementations
- **Debug Tools**: Added AlertDebug component for development-time state inspection

## Development

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Debug Tools

The application includes built-in debug components for development:

- **AlertDebug**: Real-time debugging overlay showing alert state, loading status, and error information
  - Displays current alert count and loading states
  - Shows first alert data for inspection
  - Positioned as a fixed overlay in development mode
- **DebugTest**: Simple rendering verification component for development troubleshooting
  - Fixed red overlay displaying "DEBUG: App is rendering!" message
  - Positioned at top-left with high z-index for visibility
  - Includes console logging for component render tracking
  - Useful for verifying component mounting and re-rendering behavior
- **Clean Production Code**: Development console.log statements have been removed from core application logic for cleaner production builds

### Testing

Comprehensive testing framework with Vitest and React Testing Library:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run component-specific tests
npm run test:components

# Run accessibility tests
npm run test:a11y
```

**Current Test Status**: The test suite has 390 tests with 303 passing. Some tests are currently failing due to CSS module class name mismatches and component structure differences that need alignment with the actual implementations.

## Configuration

### ESLint Configuration

For production applications, enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
