# Project Structure & Organization

## Root Directory Structure

```
react-app/
├── src/                 # Source code
├── public/              # Static assets
├── dist/                # Production build output
├── coverage/            # Test coverage reports
├── node_modules/        # Dependencies
├── scripts/             # Build and utility scripts
└── [config files]       # Various configuration files
```

## Source Code Organization

```
src/
├── components/          # React components organized by feature
│   ├── alerts/         # Alert management components
│   ├── analytics/      # Analytics and reporting components
│   ├── common/         # Shared/reusable components
│   ├── dashboard/      # Dashboard components
│   ├── debug/          # Debug and development tools
│   ├── hunting/        # Threat hunting components
│   ├── incidents/      # Incident response components
│   ├── integrations/   # System integration components
│   └── investigations/ # Investigation workflow components
├── context/            # React Context providers and reducers
├── data/               # Mock data and data management
├── hooks/              # Custom React hooks
├── styles/             # Global styles and CSS modules
├── test/               # Testing utilities and configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── assets/             # Images, icons, and other assets
└── __tests__/          # Global test files
```

## Component Organization Principles

### Feature-Based Structure
- Components are organized by business domain/feature
- Each feature directory contains related components
- Shared components go in `common/`

### Component File Naming
- PascalCase for component files: `AlertList.tsx`
- Matching CSS modules: `AlertList.module.css`
- Test files: `AlertList.test.tsx`
- Type definitions: `AlertList.types.ts` (if complex)

### Directory Conventions
- Each component directory should contain:
  - Main component file
  - Associated styles (CSS modules)
  - Test files
  - Type definitions (if needed)
  - Sub-components (if any)

## Key Architectural Patterns

### State Management
- **Global State**: React Context API in `src/context/`
- **Local State**: React hooks (`useState`, `useReducer`)
- **Custom Hooks**: Reusable stateful logic in `src/hooks/`

### Data Flow
- Context providers wrap the application
- Components consume context via custom hooks
- Mock data managed in `src/data/`
- Real API integration points defined in context

### Testing Structure
- Test utilities in `src/test/`
- Component tests co-located with components
- Global test setup and configuration
- Mock data factories for consistent testing

### Styling Approach
- CSS Modules for component-specific styles
- Global styles in `src/styles/`
- Responsive design patterns
- Consistent design system

## File Naming Conventions

### Components
- `ComponentName.tsx` - Main component
- `ComponentName.module.css` - Component styles
- `ComponentName.test.tsx` - Component tests
- `ComponentName.types.ts` - Type definitions (if complex)

### Hooks
- `useHookName.ts` - Custom hook
- `useHookName.test.ts` - Hook tests

### Utilities
- `utilityName.ts` - Utility functions
- `utilityName.test.ts` - Utility tests

### Context
- `ContextName.tsx` - Context provider and hook
- `ContextName.types.ts` - Context type definitions

## Import/Export Patterns

### Preferred Import Style
```typescript
// External libraries first
import React from 'react';
import { Chart } from 'chart.js';

// Internal imports by proximity
import { AppContext } from '../../context/AppContext';
import { AlertCard } from '../common/AlertCard';
import styles from './AlertList.module.css';
```

### Export Patterns
- Default exports for main components
- Named exports for utilities and types
- Barrel exports (`index.ts`) for feature directories

## Development vs Production

### Debug Components
- Debug components in `src/components/debug/`
- Conditionally rendered based on environment
- Excluded from production builds
- Used for development troubleshooting

### Environment-Specific Code
- Use `__DEV__` and `__PROD__` constants
- Clean separation of debug and production code
- No console.log statements in production components