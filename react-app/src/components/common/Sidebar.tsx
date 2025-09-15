/**
 * Sidebar Component
 * Navigation menu for different application sections
 */

import React, { useCallback } from 'react';
import { useAppContext } from '../../context';
import type { AppSection } from '../../types';
import styles from './Sidebar.module.css';

interface NavigationItem {
  section: AppSection;
  icon: string;
  label: string;
}

const navigationItems: NavigationItem[] = [
  { section: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
  { section: 'alerts', icon: 'fas fa-exclamation-triangle', label: 'Alert Management' },
  { section: 'investigations', icon: 'fas fa-search', label: 'Investigations' },
  { section: 'hunting', icon: 'fas fa-binoculars', label: 'Threat Hunting' },
  { section: 'incidents', icon: 'fas fa-fire', label: 'Incidents' },
  { section: 'analytics', icon: 'fas fa-chart-line', label: 'Analytics' },
  { section: 'integrations', icon: 'fas fa-plug', label: 'Integrations' },
];

export const Sidebar: React.FC = React.memo(() => {
  const { state, setCurrentSection } = useAppContext();

  const handleSectionChange = useCallback((section: AppSection) => {
    setCurrentSection(section);
  }, [setCurrentSection]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, section: AppSection) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSectionChange(section);
    }
  }, [handleSectionChange]);

  return (
    <nav className={styles.sidebar}>
      <div className={styles.navItems}>
        {navigationItems.map(({ section, icon, label }) => (
          <button
            key={section}
            className={`${styles.navItem} ${
              state.currentSection === section ? styles.active : ''
            }`}
            onClick={() => handleSectionChange(section)}
            onKeyDown={(e) => handleKeyDown(e, section)}
            aria-label={`Navigate to ${label}`}
            aria-current={state.currentSection === section ? 'page' : undefined}
          >
            <i className={icon} aria-hidden="true"></i>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
});