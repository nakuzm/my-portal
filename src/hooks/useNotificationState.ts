import { useEffect, useMemo, useState } from 'react';
import { getNotifications, markNotificationRead } from '../lib/mockPortalApi';
import type { PortalNotification } from '../types';

const NOTIFICATION_REFRESH_INTERVAL_MS = 15_000;

function mergeNotifications(
  currentNotifications: PortalNotification[],
  nextNotifications: PortalNotification[],
) {
  return nextNotifications.map((nextNotification) => {
    const currentNotification = currentNotifications.find(
      (notification) => notification.id === nextNotification.id,
    );

    return {
      ...nextNotification,
      read: currentNotification?.read ?? nextNotification.read,
    };
  });
}

function setNotificationReadState(
  notifications: PortalNotification[],
  notificationId: string,
  read: boolean,
) {
  return notifications.map((notification) =>
    notification.id === notificationId
      ? { ...notification, read }
      : notification,
  );
}

export function useNotificationState() {
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingReadIds, setPendingReadIds] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    let isMounted = true;

    async function refreshNotifications() {
      if (isMounted) {
        setIsLoading(true);
      }

      try {
        const nextNotifications = await getNotifications();

        if (isMounted) {
          setNotifications((currentNotifications) =>
            mergeNotifications(currentNotifications, nextNotifications),
          );
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError('Notifications could not be refreshed.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    refreshNotifications();
    const intervalId = window.setInterval(
      refreshNotifications,
      NOTIFICATION_REFRESH_INTERVAL_MS,
    );

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const handleMarkNotificationRead = async (notificationId: string) => {
    setError(null);
    setPendingReadIds((currentIds) => new Set(currentIds).add(notificationId));

    setNotifications((currentNotifications) =>
      setNotificationReadState(currentNotifications, notificationId, true),
    );

    try {
      await markNotificationRead(notificationId);
    } catch {
      setNotifications((currentNotifications) =>
        setNotificationReadState(currentNotifications, notificationId, false),
      );
      setError('Notification could not be marked as read.');
    } finally {
      setPendingReadIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(notificationId);
        return nextIds;
      });
    }
  };

  return {
    notifications,
    showUnreadOnly,
    unreadCount,
    isLoading,
    error,
    pendingReadIds,
    setShowUnreadOnly,
    markNotificationRead: handleMarkNotificationRead,
  };
}
