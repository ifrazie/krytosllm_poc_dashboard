import React from 'react';
import { useAppContext } from '../../context/AppContext';

export const AlertDebug: React.FC = () => {
  const { state } = useAppContext();
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Alert Debug Info</h4>
      <p>Alerts count: {state.alerts.length}</p>
      <p>Loading alerts: {state.loading.alerts ? 'Yes' : 'No'}</p>
      <p>Alert error: {state.errors.alerts || 'None'}</p>
      <p>Current section: {state.currentSection}</p>
      {state.alerts.length > 0 && (
        <div>
          <p>First alert:</p>
          <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '100px' }}>
            {JSON.stringify(state.alerts[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};