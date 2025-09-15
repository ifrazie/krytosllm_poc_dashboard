/**
 * ErrorTrigger Component
 * Development component for testing error boundaries
 * This component should be removed in production
 */

import React, { useState } from 'react';

interface ErrorTriggerProps {
  triggerError?: boolean;
  errorMessage?: string;
}

export const ErrorTrigger: React.FC<ErrorTriggerProps> = ({ 
  triggerError = false, 
  errorMessage = 'Test error triggered' 
}) => {
  const [shouldError, setShouldError] = useState(triggerError);

  if (shouldError) {
    throw new Error(errorMessage);
  }

  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 9999,
      background: '#ff4444',
      color: 'white',
      padding: '10px',
      borderRadius: '4px',
      fontSize: '12px'
    }}>
      <button 
        onClick={() => setShouldError(true)}
        style={{
          background: 'transparent',
          border: '1px solid white',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '11px'
        }}
      >
        Trigger Error (Dev)
      </button>
    </div>
  );
};