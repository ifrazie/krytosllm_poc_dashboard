# TypeScript Type Definitions

This directory contains comprehensive TypeScript type definitions for the Prophet AI SOC Platform. The types are organized by domain for better maintainability and developer experience.

## File Structure

### Core Data Models
- **`alert.ts`** - Alert-related types including Alert interface, severity levels, status types, and filtering options
- **`investigation.ts`** - Investigation workflow types including timeline events and investigation details
- **`integration.ts`** - System integration types for external security tools and their health status
- **`team.ts`** - SOC team member types including roles, status, and member details
- **`metrics.ts`** - Performance metrics and analytics data types
- **`incident.ts`** - Incident response types including severity, status, and incident details
- **`hunting.ts`** - Threat hunting types for queries, results, and hunt execution

### UI Component Types
- **`ui.ts`** - Generic UI component prop types (Button, Modal, Table, Input, etc.)
- **`chart.ts`** - Chart.js integration types and chart component props
- **`form.ts`** - Form handling types including field definitions, validation, and form state
- **`components.ts`** - Specific component prop types for all major application components

### Application Architecture
- **`context.ts`** - React Context types for global state management and actions
- **`hooks.ts`** - Custom hook return types and configuration options
- **`api.ts`** - API response types, error handling, and data fetching patterns

### Utilities
- **`utils.ts`** - Common utility types for dates, sorting, filtering, and configuration
- **`index.ts`** - Main export file with utility types and re-exports

## Key Features

### Type Safety
- Comprehensive interfaces for all data models
- Strict typing for component props and state
- Type-safe event handlers and form management

### Developer Experience
- Clear, descriptive type names
- Extensive JSDoc comments
- Organized by functional domain
- Consistent naming conventions

### Extensibility
- Generic utility types for common patterns
- Flexible interfaces that can be extended
- Modular structure for easy maintenance

## Usage Examples

### Basic Data Types
```typescript
import { Alert, AlertSeverity, AlertStatus } from '@/types';

const alert: Alert = {
  id: 'ALT-2025-001234',
  title: 'Suspicious Login',
  severity: 'High',
  status: 'Under Investigation',
  // ... other properties
};
```

### Component Props
```typescript
import { AlertTableProps } from '@/types';

const AlertTable: React.FC<AlertTableProps> = ({
  alerts,
  onAlertSelect,
  loading = false
}) => {
  // Component implementation
};
```

### Context and State Management
```typescript
import { AppContextType, AppAction } from '@/types';

const useAppContext = (): AppContextType => {
  // Context hook implementation
};
```

### Form Handling
```typescript
import { UseFormReturn, AlertFormData } from '@/types';

const useAlertForm = (): UseFormReturn<AlertFormData> => {
  // Form hook implementation
};
```

## Type Organization Principles

1. **Domain-Driven**: Types are grouped by business domain (alerts, investigations, etc.)
2. **Hierarchical**: Base types are extended for specific use cases
3. **Composable**: Types can be combined and extended as needed
4. **Consistent**: Naming conventions and patterns are consistent across all types
5. **Documented**: All complex types include JSDoc comments

## Integration with Requirements

These type definitions satisfy the following requirements:
- **1.4**: TypeScript for type safety and better developer experience
- **4.1**: Modern state management with proper typing
- **7.4**: Comprehensive type checking for all components and data structures

The types provide a solid foundation for the React refactoring while maintaining type safety and enabling excellent developer experience with IntelliSense and compile-time error checking.