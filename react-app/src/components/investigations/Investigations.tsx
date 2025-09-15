/**
 * Investigations Component
 * Main investigation workspace combining list and details views
 */

import React, { memo } from 'react';
import { InvestigationList } from './InvestigationList';
import { InvestigationDetails } from './InvestigationDetails';
import styles from './Investigations.module.css';

interface InvestigationsProps {
  className?: string;
}

export const Investigations: React.FC<InvestigationsProps> = memo(({ className }) => {
  return (
    <div className={`${styles.investigations} ${className || ''}`}>
      <div className={styles.investigationWorkspace}>
        {/* Investigation List Sidebar */}
        <InvestigationList 
          className={styles.investigationList}
          data-testid="investigation-list"
        />
        
        {/* Investigation Details Main Content */}
        <InvestigationDetails 
          className={styles.investigationDetails}
          data-testid="investigation-details"
        />
      </div>
    </div>
  );
});

Investigations.displayName = 'Investigations';

export default Investigations;