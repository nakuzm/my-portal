import { useContext } from 'react';
import { NotificationsContext } from '../context/notificationsContext';

export function useNotifications() {
  const notifications = useContext(NotificationsContext);

  if (!notifications) {
    throw new Error(
      'useNotifications must be used within a NotificationsProvider.',
    );
  }

  return notifications;
}
