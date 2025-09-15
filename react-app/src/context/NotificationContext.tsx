/**
 * Notification Context Provider
 * Manages application-wide notifications for alerts, system updates, and user actions
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'alert';
  title?: string;
  timestamp: string;
  duration?: number; // Auto-dismiss duration in ms (0 = no auto-dismiss)
  persistent?: boolean; // If true, won't auto-dismiss
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  metadata?: Record<string, any>; // Additional data for the notification
}

interface NotificationState {
  notifications: Notification[];
  maxNotifications: number;
  defaultDuration: number;
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'CLEAR_BY_TYPE'; payload: Notification['type'] }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<Notification> } };

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  clearByType: (type: Notification['type']) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  // Convenience methods
  showInfo: (message: string, options?: Partial<Notification>) => string;
  showSuccess: (message: string, options?: Partial<Notification>) => string;
  showWarning: (message: string, options?: Partial<Notification>) => string;
  showError: (message: string, options?: Partial<Notification>) => string;
  showAlert: (message: string, options?: Partial<Notification>) => string;
}

const initialState: NotificationState = {
  notifications: [],
  maxNotifications: 5,
  defaultDuration: 5000 // 5 seconds
};

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      // Remove oldest notification if at max capacity
      const notifications = state.notifications.length >= state.maxNotifications
        ? state.notifications.slice(1)
        : state.notifications;
      
      return {
        ...state,
        notifications: [...notifications, action.payload]
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: []
      };

    case 'CLEAR_BY_TYPE':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.type !== action.payload)
      };

    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload.id
            ? { ...n, ...action.payload.updates }
            : n
        )
      };

    default:
      return state;
  }
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Generate unique notification ID
  const generateId = useCallback((): string => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>): string => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date().toISOString(),
      duration: notification.duration ?? state.defaultDuration
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // Auto-dismiss if duration is set and not persistent
    if (newNotification.duration && newNotification.duration > 0 && !newNotification.persistent) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, newNotification.duration);
    }

    return id;
  }, [generateId, state.defaultDuration]);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // Clear notifications by type
  const clearByType = useCallback((type: Notification['type']) => {
    dispatch({ type: 'CLEAR_BY_TYPE', payload: type });
  }, []);

  // Update notification
  const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
    dispatch({ type: 'UPDATE_NOTIFICATION', payload: { id, updates } });
  }, []);

  // Convenience methods
  const showInfo = useCallback((message: string, options: Partial<Notification> = {}): string => {
    return addNotification({
      message,
      type: 'info',
      title: 'Information',
      ...options
    });
  }, [addNotification]);

  const showSuccess = useCallback((message: string, options: Partial<Notification> = {}): string => {
    return addNotification({
      message,
      type: 'success',
      title: 'Success',
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message: string, options: Partial<Notification> = {}): string => {
    return addNotification({
      message,
      type: 'warning',
      title: 'Warning',
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message: string, options: Partial<Notification> = {}): string => {
    return addNotification({
      message,
      type: 'error',
      title: 'Error',
      duration: 0, // Errors don't auto-dismiss by default
      ...options
    });
  }, [addNotification]);

  const showAlert = useCallback((message: string, options: Partial<Notification> = {}): string => {
    return addNotification({
      message,
      type: 'alert',
      title: 'Security Alert',
      duration: 0, // Alerts don't auto-dismiss by default
      persistent: true,
      ...options
    });
  }, [addNotification]);

  const contextValue: NotificationContextType = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAll,
    clearByType,
    updateNotification,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    showAlert
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notifications
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};