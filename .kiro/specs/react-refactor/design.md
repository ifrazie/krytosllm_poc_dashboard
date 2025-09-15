# Design Document

## Overview

This design document outlines the architecture and implementation approach for refactoring the Prophet AI SOC Analyst Platform from vanilla JavaScript to a modern React application. The design maintains all existing functionality while introducing a component-based architecture, TypeScript for type safety, and modern development tooling.

The refactored application will use React 18+ with functional components and hooks, Vite for build tooling, and maintain the existing dark cybersecurity theme and user experience. The architecture emphasizes maintainability, performance, and developer experience while preserving the real-time SOC monitoring capabilities.

## Architecture

### Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **State Management**: React Context API with useReducer for complex state, useState/useEffect for local state
- **Styling**: CSS Modules for component-scoped styles, maintaining existing CSS custom properties
- **Charts**: Chart.js with react-chartjs-2 wrapper for data visualizations
- **Icons**: Font Awesome (maintained via CDN)
- **Fonts**: FKGroteskNeue (maintained via CDN)

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Header, Sidebar, Modal)
│   ├── dashboard/       # Dashboard-specific components
│   ├── alerts/          # Alert management components
│   ├── investigations/  # Investigation workspace components
│   ├── hunting/         # Threat hunting components
│   ├── incidents/       # Incident response components
│   ├── analytics/       # Analytics and reporting components
│   └── integrations/    # System integrations components
├── hooks/               # Custom React hooks
├── context/             # React Context providers
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── data/                # Mock data and data management
├── styles/              # Global styles and CSS modules
└── App.tsx              # Main application component
```

### State Management Architecture

The application will use a hybrid state management approach:

1. **Global State (React Context)**: Application-wide data like alerts, investigations, metrics, and current section
2. **Local State (useState)**: Component-specific state like form inputs, modal visibility, and UI interactions
3. **Derived State**: Computed values using useMemo for filtered data and calculated metrics

## Components and Interfaces

### Core Application Components

#### App Component
- **Purpose**: Root component managing global state and routing between sections
- **State**: Current active section, global application data
- **Children**: Header, Sidebar, MainContent

#### Header Component
- **Purpose**: Top navigation bar with logo, stats, and user profile
- **Props**: `activeAlerts: number`, `currentTime: string`
- **Features**: Real-time clock, alert counter, user profile display

#### Sidebar Component
- **Purpose**: Navigation menu for different application sections
- **Props**: `activeSection: string`, `onSectionChange: (section: string) => void`
- **Features**: Section navigation, active state management

#### MainContent Component
- **Purpose**: Container for section-specific content
- **Props**: `activeSection: string`
- **Features**: Conditional rendering of section components

### Section Components

#### Dashboard Component
- **Purpose**: Main overview with metrics, alerts feed, and team status
- **Subcomponents**: MetricsGrid, AlertFeed, TeamStatus, ThreatChart
- **Data**: Metrics, recent alerts, team members, threat data

#### AlertManagement Component
- **Purpose**: Alert listing, filtering, and management interface
- **Subcomponents**: AlertFilters, AlertTable, AlertModal
- **Features**: Filtering, sorting, bulk operations, alert details

#### Investigations Component
- **Purpose**: Investigation workspace with case management
- **Subcomponents**: InvestigationList, InvestigationDetails, Timeline
- **Features**: Case selection, evidence display, timeline visualization

#### ThreatHunting Component
- **Purpose**: Natural language query interface for threat detection
- **Subcomponents**: QueryBuilder, HuntResults, QueryExamples
- **Features**: Query execution, results display, example queries

#### Incidents Component
- **Purpose**: Incident response board with status tracking
- **Subcomponents**: IncidentBoard, IncidentCard, StatusColumns
- **Features**: Kanban-style board, incident status management

#### Analytics Component
- **Purpose**: Charts and performance metrics dashboard
- **Subcomponents**: ChartCard, MetricsDisplay, PerformanceIndicators
- **Features**: Multiple chart types, performance metrics

#### Integrations Component
- **Purpose**: System integration status and health monitoring
- **Subcomponents**: IntegrationCard, HealthIndicator, SyncStatus
- **Features**: Integration status, health monitoring, sync tracking

### Shared Components

#### Modal Component
- **Purpose**: Reusable modal dialog for alerts and other content
- **Props**: `isOpen: boolean`, `onClose: () => void`, `title: string`, `children: ReactNode`
- **Features**: Overlay, close handling, accessibility

#### Button Component
- **Purpose**: Consistent button styling across the application
- **Props**: `variant: 'primary' | 'secondary'`, `size: 'sm' | 'md' | 'lg'`, `onClick: () => void`
- **Features**: Multiple variants, sizes, loading states

#### Table Component
- **Purpose**: Reusable data table with sorting and filtering
- **Props**: `data: any[]`, `columns: ColumnConfig[]`, `onRowClick?: (row: any) => void`
- **Features**: Sorting, filtering, row selection

#### Chart Components
- **Purpose**: Wrapper components for Chart.js integration
- **Types**: DoughnutChart, LineChart, BarChart, PieChart
- **Props**: Chart-specific data and configuration options

## Data Models

### TypeScript Interfaces

```typescript
interface Alert {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active Threat' | 'Under Investigation' | 'Auto-Contained' | 'Resolved';
  source: string;
  timestamp: string;
  description: string;
  aiAnalysis: string;
  riskScore: number;
  artifacts: string[];
  recommendedActions: string[];
}

interface Investigation {
  id: string;
  alertId: string;
  status: 'New' | 'In Progress' | 'Completed';
  assignedTo: string;
  timeline: TimelineEvent[];
  evidence: string[];
}

interface TimelineEvent {
  time: string;
  event: string;
}

interface Integration {
  name: string;
  status: 'Connected' | 'Degraded' | 'Disconnected';
  lastSync: string;
  health: 'Healthy' | 'Warning' | 'Error';
}

interface TeamMember {
  name: string;
  role: string;
  status: 'Online' | 'Away' | 'Offline';
  activeAlerts: number;
}

interface Metrics {
  totalAlerts: number;
  alertsTrend: string;
  activeInvestigations: number;
  investigationsTrend: string;
  resolvedIncidents: number;
  incidentsTrend: string;
  mttr: string;
  mttrTrend: string;
}
```

### Context Interfaces

```typescript
interface AppContextType {
  // Data
  alerts: Alert[];
  investigations: Investigation[];
  integrations: Integration[];
  socTeam: TeamMember[];
  metrics: Metrics;
  
  // UI State
  currentSection: string;
  selectedInvestigation: string | null;
  
  // Actions
  setCurrentSection: (section: string) => void;
  setSelectedInvestigation: (id: string | null) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
}
```

## Error Handling

### Error Boundaries
- **Purpose**: Catch and handle React component errors gracefully
- **Implementation**: Error boundary components wrapping major sections
- **Fallback**: User-friendly error messages with recovery options

### Data Loading States
- **Loading States**: Skeleton components and loading indicators
- **Error States**: Error messages with retry functionality
- **Empty States**: Informative messages when no data is available

### Chart Error Handling
- **Chart Failures**: Fallback to data tables when charts fail to render
- **Data Validation**: Ensure chart data is valid before rendering
- **Graceful Degradation**: Show partial data when some chart data is unavailable

## Testing Strategy

### Unit Testing
- **Framework**: Jest with React Testing Library
- **Coverage**: All components, hooks, and utility functions
- **Focus**: Component rendering, user interactions, state management

### Integration Testing
- **Scope**: Component interactions, context providers, data flow
- **Scenarios**: Navigation, filtering, modal interactions, real-time updates

### Component Testing
- **Visual Testing**: Ensure components render correctly with different props
- **Interaction Testing**: User events, form submissions, button clicks
- **State Testing**: Component state changes and side effects

### Chart Testing
- **Mock Strategy**: Mock Chart.js to test component logic without rendering
- **Data Testing**: Verify correct data transformation for charts
- **Responsive Testing**: Ensure charts adapt to container size changes

## Performance Considerations

### React Optimization
- **Memoization**: Use React.memo for expensive components
- **Callback Optimization**: useCallback for event handlers passed to children
- **Effect Dependencies**: Careful dependency arrays in useEffect
- **Code Splitting**: Lazy loading for section components

### Data Management
- **Efficient Updates**: Immutable updates for state changes
- **Filtered Data**: useMemo for expensive filtering operations
- **Real-time Updates**: Optimized intervals for data refresh

### Bundle Optimization
- **Tree Shaking**: Ensure unused code is eliminated
- **Chunk Splitting**: Separate vendor and application code
- **Asset Optimization**: Optimize images and fonts
- **CDN Usage**: Continue using CDN for external dependencies

## Migration Strategy

### Phase 1: Project Setup
- Initialize Vite + React + TypeScript project
- Set up development tooling (ESLint, Prettier)
- Configure build and deployment processes

### Phase 2: Core Structure
- Create basic component structure
- Implement routing and navigation
- Set up global state management

### Phase 3: Component Migration
- Convert each section to React components
- Implement shared components (Modal, Button, Table)
- Integrate Chart.js with React wrappers

### Phase 4: Styling Migration
- Convert CSS to CSS Modules
- Ensure responsive design works correctly
- Test dark theme implementation

### Phase 5: Feature Completion
- Implement real-time updates
- Add error handling and loading states
- Complete testing and optimization

### Phase 6: Deployment
- Build optimization and testing
- Deployment configuration
- Performance monitoring setup