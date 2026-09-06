import { useNotificationState } from '@hooks/useNotificationState';
import type { ReactNode } from 'react';
import { NotificationsContext } from './notificationsContext';

type NotificationsProviderProps = {
  children: ReactNode;
};

export function NotificationsProvider({
  children,
}: NotificationsProviderProps) {
  const notifications = useNotificationState();

  return (
    <NotificationsContext.Provider value={notifications}>
      {children}
    </NotificationsContext.Provider>
  );
}
