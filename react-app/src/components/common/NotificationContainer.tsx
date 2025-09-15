/**
 * Notification Container Component
 * Renders and manages the display of notifications
 */

import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationItem } from './NotificationItem';
import styles from './NotificationContainer.module.css';

interface NotificationContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  position = 'top-right',
  className = ''
}) => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  // Helper function to get position class name
  const getPositionClassName = (position: string) => {
    const positionMap: Record<string, string> = {
      'top-right': styles.topRight,
      'top-left': styles.topLeft,
      'bottom-right': styles.bottomRight,
      'bottom-left': styles.bottomLeft,
      'top-center': styles.topCenter,
      'bottom-center': styles.bottomCenter
    };
    return positionMap[position] || styles.topRight;
  };

  return (
    <div 
      className={`${styles.notificationContainer} ${getPositionClassName(position)} ${className}`}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
};