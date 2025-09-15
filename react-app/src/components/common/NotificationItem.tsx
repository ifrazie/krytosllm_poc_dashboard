/**
 * Notification Item Component
 * Individual notification display with animations and interactions
 */

import React, { useEffect, useState } from 'react';
import { useNotifications, type Notification } from '../../context/NotificationContext';
import styles from './NotificationItem.module.css';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { removeNotification, updateNotification } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Animation entrance effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Handle notification removal with animation
  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300); // Match CSS animation duration
  };

  // Handle action button clicks
  const handleActionClick = (action: () => void) => {
    action();
    handleRemove();
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <i className="fas fa-check-circle" aria-hidden="true" />;
      case 'error':
        return <i className="fas fa-exclamation-circle" aria-hidden="true" />;
      case 'warning':
        return <i className="fas fa-exclamation-triangle" aria-hidden="true" />;
      case 'alert':
        return <i className="fas fa-shield-alt" aria-hidden="true" />;
      case 'info':
      default:
        return <i className="fas fa-info-circle" aria-hidden="true" />;
    }
  };

  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`
        ${styles.notificationItem}
        ${styles[notification.type]}
        ${isVisible ? styles.visible : ''}
        ${isRemoving ? styles.removing : ''}
      `}
      role="alert"
      aria-live={notification.type === 'error' || notification.type === 'alert' ? 'assertive' : 'polite'}
    >
      {/* Icon */}
      <div className={styles.icon}>
        {getIcon()}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {notification.title && (
          <div className={styles.title}>
            {notification.title}
          </div>
        )}
        <div className={styles.message}>
          {notification.message}
        </div>
        <div className={styles.timestamp}>
          {formatTime(notification.timestamp)}
        </div>
      </div>

      {/* Actions */}
      {notification.actions && notification.actions.length > 0 && (
        <div className={styles.actions}>
          {notification.actions.map((action, index) => (
            <button
              key={index}
              className={`
                ${styles.action}
                ${action.variant === 'primary' ? styles.actionPrimary : ''}
              `}
              onClick={() => handleActionClick(action.action)}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Close button */}
      <button
        className={styles.close}
        onClick={handleRemove}
        type="button"
        aria-label="Close notification"
      >
        <i className="fas fa-times" aria-hidden="true" />
      </button>

      {/* Progress bar for auto-dismiss */}
      {notification.duration && notification.duration > 0 && !notification.persistent && (
        <div 
          className={styles.progress}
          style={{
            animationDuration: `${notification.duration}ms`
          }}
        />
      )}
    </div>
  );
};