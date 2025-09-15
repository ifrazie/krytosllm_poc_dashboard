/**
 * Header Component
 * Top navigation bar with logo, stats display, and user profile
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context';
import styles from './Header.module.css';

export const Header: React.FC = React.memo(() => {
  const { state } = useAppContext();
  const [currentTime, setCurrentTime] = useState<string>('');

  // Real-time clock functionality using useEffect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Memoize active alerts count calculation to prevent unnecessary recalculations
  const activeAlertsCount = useMemo(() => 
    state.alerts.filter(
      alert => alert.status === 'Active Threat' || alert.status === 'Under Investigation'
    ).length,
    [state.alerts]
  );

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.logo}>
          <i className="fas fa-shield-alt"></i>
          <span>Prophet AI</span>
        </div>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.headerStats}>
          <span className={styles.statItem}>
            <i className="fas fa-exclamation-triangle"></i>
            <span>{activeAlertsCount}</span> Active
          </span>
          <span className={styles.statItem}>
            <i className="fas fa-clock"></i>
            <span>{currentTime}</span>
          </span>
        </div>
        <div className={styles.userProfile}>
          <img 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='%2350B8C6'%3E%3Ccircle cx='16' cy='16' r='16'/%3E%3Cpath d='M16 16c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%23134252'/%3E%3C/svg%3E" 
            alt="User" 
            className={styles.userAvatar}
          />
          <span>SOC Analyst</span>
        </div>
      </div>
    </header>
  );
});