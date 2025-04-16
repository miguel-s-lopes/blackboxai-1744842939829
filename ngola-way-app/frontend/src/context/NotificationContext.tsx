import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Notification, NotificationContextType } from '@/types';
import { generateRandomString, cn } from '@/utils/helpers';

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const addNotification = useCallback(
    ({ type, title, message, duration = 5000 }: Omit<Notification, 'id'>) => {
      const id = generateRandomString(8);
      const notification: Notification = {
        id,
        type,
        title,
        message,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [removeNotification]
  );

  const value = {
    notifications,
    addNotification,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Notification Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              'min-w-[320px] rounded-lg p-4 shadow-lg transition-all duration-300',
              'animate-in slide-in-from-right fade-in',
              {
                'bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-50':
                  notification.type === 'success',
                'bg-red-50 text-red-900 dark:bg-red-900 dark:text-red-50':
                  notification.type === 'error',
                'bg-yellow-50 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-50':
                  notification.type === 'warning',
                'bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-50':
                  notification.type === 'info',
              }
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="mt-1 text-sm opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-current opacity-70 hover:opacity-100 focus:opacity-100 focus:outline-none"
              >
                <span className="sr-only">Close notification</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

/**
 * Custom hook to access notification context
 * @returns {NotificationContextType} Notification context value
 * @throws {Error} If used outside of NotificationProvider
 */
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
};

export default NotificationProvider;
