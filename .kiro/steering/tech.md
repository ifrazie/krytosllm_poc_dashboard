# Technology Stack & Build System

## Core Technologies

- **React 19** with TypeScript for type-safe component development
- **Vite** for fast development and optimized production builds
- **Chart.js** with React Chart.js 2 for data visualization
- **Context API** for global state management

## Development Tools

- **TypeScript 5.8+** for type safety
- **ESLint** with TypeScript and React plugins for code quality
- **Prettier** for consistent code formatting
- **Vitest** with React Testing Library for comprehensive testing
- **jsdom** for DOM testing environment

## Build Configuration

- **Target**: ES2020 for modern browser support
- **Bundler**: Vite with optimized chunk splitting
- **Minification**: esbuild for fast builds
- **Source Maps**: Enabled for debugging
- **CSS Modules**: Configured with camelCase locals

## Common Commands

### Development
```bash
npm run dev              # Start development server
npm run preview          # Preview production build locally
```

### Building
```bash
npm run build            # Standard production build
npm run build:production # Optimized production build with analysis
npm run build:analyze    # Build with bundle analysis
```

### Testing
```bash
npm test                 # Run tests in watch mode
npm run test:run         # Run all tests once
npm run test:coverage    # Run tests with coverage report
npm run test:components  # Test specific component directory
npm run test:hooks       # Test custom hooks
npm run test:a11y        # Run accessibility tests
npm run test:smoke       # Run smoke tests (@smoke tagged)
npm run test:critical    # Run critical tests (@critical tagged)
npm run test:ci          # CI-optimized test run with coverage
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix auto-fixable ESLint issues
npm run format           # Format code with Prettier
```

### Deployment
```bash
npm run test:build       # Test production build performance
npm run deploy:check     # Check deployment readiness
npm run test:final       # Complete production validation
```

## Code Style Standards

- **Semicolons**: Required
- **Quotes**: Single quotes preferred
- **Trailing Commas**: ES5 style
- **Print Width**: 80 characters
- **Tab Width**: 2 spaces
- **React**: No need to import React in JSX files (React 17+ transform)
- **TypeScript**: Explicit return types optional, but `any` usage warned

## Performance Targets

- **JavaScript Bundle**: < 1MB total
- **CSS Bundle**: < 200KB total
- **Test Coverage**: 80% minimum (85% for common components, 90% for hooks)
- **Build Time**: < 30 seconds for production builds