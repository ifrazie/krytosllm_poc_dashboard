# Prophet AI SOC Platform - AI Agent Instructions

## Project Overview
The Prophet AI SOC Platform is a React-based security operations center (SOC) dashboard with real-time alerts, investigations, and incident management capabilities. It uses TypeScript, Vite, and a context-based state management system.

## Architecture

### Core Structure
- **Component Organization**: Features are organized by domain (`/components/alerts`, `/components/investigations`, etc.)
- **Global State**: Context API-based state management in `/context/AppContext.tsx` and `/context/NotificationContext.tsx`
- **Data Flow**: Real-time updates via custom hooks (`useRealTimeUpdates`, `useRealTimeAlerts`, etc.)

### Key Files and Components
- `App.tsx` - Entry point with error boundaries and context providers
- `src/context/AppContext.tsx` - Primary state management for the entire application
- `src/data/mockData.ts` - Mock data used throughout the application
- `src/hooks/useRealTimeUpdates.ts` - Simulates real-time data updates

## Development Workflow

### Setup Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build:production
```

### Testing Commands
```bash
# Run all tests
npm test

# Run specific test types
npm run test:components    # Run component tests
npm run test:hooks         # Run hook tests
npm run test:critical      # Run critical tests

# Coverage reports
npm run test:coverage      # Standard coverage report
npm run test:coverage:html # HTML coverage report
```

### Debug Features
- Development-only debug components in `src/components/debug/` (e.g., `AlertDebug.tsx`)
- Real-time state visualization through debugging overlays
- Comprehensive test utilities in `src/test/test-utils.tsx` and `src/test/test-helpers.ts`

## Conventions and Patterns

### State Management
- Use `useAppContext()` to access the global app state
- Component-specific state should use `useState` or `useReducer`
- Real-time updates flow through custom hooks into the app context

### Component Structure
1. Common components in `src/components/common/`
2. Feature components organized by domain 
3. React function components with TypeScript interfaces for props

### TypeScript Organization
- Domain-driven type definitions in `/src/types/`
- Extensive JSDoc comments for complex types
- Shared interfaces for consistent data structure

## Performance Considerations
- Context state is memoized to prevent unnecessary re-renders
- Real-time update intervals are configurable (see `useRealTimeUpdates.ts`)
- Conditional debug output controlled by environment

## Integration Points
- `useRealTimeAlerts` - Add new security alerts to the system
- `useNotificationIntegration` - Display notifications for critical events
- External tool integrations defined in `/data/mockData.ts` (simulation)
- Dashboard metrics calculated from real-time data in the app context

## Testing Guidelines
- Use provided `test-utils.tsx` for rendering components with context
- Mock data factories available in `test/mock-data.ts`
- Test component interactions using `@testing-library/user-event`
- Ensure tests include accessibility checks for critical components

## Build & Deployment
- Production build commands: `npm run build:production`
- Required validation: `npm run deploy:check`
- Deployment script in `scripts/build-production.js`
- SPA routing should be configured on the hosting server
