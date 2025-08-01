'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Notification from '../components/ui/Notification';

interface NotificationData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const showNotification = (
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info', 
    duration: number = 3000
  ) => {
    const id = generateId();
    const notification: NotificationData = {
      id,
      message,
      type,
      duration
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message: string, duration: number = 3000) => {
    showNotification(message, 'success', duration);
  };

  const showError = (message: string, duration: number = 5000) => {
    showNotification(message, 'error', duration);
  };

  const showInfo = (message: string, duration: number = 3000) => {
    showNotification(message, 'info', duration);
  };

  const showWarning = (message: string, duration: number = 4000) => {
    showNotification(message, 'warning', duration);
  };

  const contextValue: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Render notifications */}
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <div key={notification.id} style={{ top: `${20 + index * 60}px` }}>
            <Notification
              message={notification.message}
              type={notification.type}
              isVisible={true}
              onClose={() => removeNotification(notification.id)}
              duration={0} // We handle duration in the provider
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
