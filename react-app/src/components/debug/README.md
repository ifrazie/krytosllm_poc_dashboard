# Debug Components

This directory contains debugging and development utility components for the Prophet AI SOC Platform.

## Components

### DebugDashboard

**File**: `../dashboard/DebugDashboard.tsx`

A full-screen debug version of the main SOC dashboard that provides comprehensive state inspection and visualization.

#### Features

- **Comprehensive State Display**: Shows complete application state including alerts, team, and metrics
- **Real-time Updates**: Automatically updates when AppContext state changes
- **JSON State Inspection**: Displays formatted JSON of key state properties
- **Grid Layout**: Organized display of alerts, team members, and metrics in responsive grid
- **Dark Theme**: Optimized dark styling for development environments
- **Console Logging**: Logs complete dashboard state to browser console

#### Usage

```tsx
import { DebugDashboard } from './components/dashboard/DebugDashboard';

function App() {
  return (
    <div>
      <DebugDashboard />
    </div>
  );
}
```

#### State Information Displayed

- **State Debug Section**: JSON formatted display of key state metrics
  - Alerts count, current section, loading status
  - Metrics availability, team member count
- **Alerts Panel**: Shows first 3 alerts with title and severity
- **Team Panel**: Displays all team members with name and status
- **Metrics Panel**: Shows total alerts, active investigations, and MTTR

#### Styling

- Full viewport height (`minHeight: '100vh'`)
- Dark background (`#0a0e1a`) with white text
- Responsive grid layout (`repeat(auto-fit, minmax(300px, 1fr))`)
- Card-based sections with dark borders (`#1a1f2e` background, `#2a2f3e` borders)
- Accent colors: green (`#00ff88`) for title, blue (`#00d4ff`) for section headers

### AlertDebug

**File**: `AlertDebug.tsx`

A real-time debugging overlay component that provides visibility into the alert management system state.

#### Features

- **Real-time State Display**: Shows current alert count, loading states, and error messages
- **Context Integration**: Uses `useAppContext` to access global application state
- **Alert Data Inspection**: Displays the first alert's complete data structure in JSON format
- **Fixed Overlay**: Positioned as a non-intrusive overlay in the top-right corner
- **Development Only**: Intended for development and debugging purposes

#### Usage

```tsx
import { AlertDebug } from './components/debug/AlertDebug';

function App() {
  return (
    <div>
      {/* Your app components */}
      <AlertDebug />
    </div>
  );
}
```

#### State Information Displayed

- **Alerts Count**: Total number of alerts in the system
- **Loading Status**: Whether alerts are currently being loaded
- **Error Status**: Any error messages related to alert loading
- **Current Section**: The active section of the application
- **First Alert Data**: Complete JSON structure of the first alert (when available)

#### Styling

- Dark semi-transparent background (`rgba(0,0,0,0.8)`)
- White text for high contrast
- Fixed positioning (`top: 10px, right: 10px`)
- Maximum width of 300px with scrollable content
- High z-index (9999) to appear above other content

#### Development Notes

- This component should only be used during development
- Consider adding environment-based conditional rendering for production builds
- The component automatically updates when the AppContext state changes
- JSON display is limited to 100px height with scroll for large alert objects

## Best Practices

1. **Environment Gating**: Wrap debug components in environment checks:
   ```tsx
   {process.env.NODE_ENV === 'development' && <AlertDebug />}
   ```

2. **Performance**: Debug components should have minimal performance impact
3. **Styling**: Use consistent styling that doesn't interfere with the main application
4. **Data Safety**: Be cautious about displaying sensitive information in debug overlays

## Component Relationships

- **DebugDashboard**: Full-screen alternative to the main Dashboard component with enhanced debugging
- **AlertDebug**: Overlay component that can be used alongside any other component
- **AlertDebugInfo**: Utility component for detailed alert information display
- **SimpleAlertTable**: Simplified table view for alert debugging
- **ThemeVisualizer**: Component for testing and visualizing theme consistency

## Future Debug Components

Consider adding similar debug components for:
- Investigation state debugging
- Integration status monitoring
- Performance metrics overlay
- Real-time data flow visualization
- Context provider state inspection
- Component render performance tracking