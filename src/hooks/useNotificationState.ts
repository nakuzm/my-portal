import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationRead } from '../lib/mockPortalApi';
import type { PortalNotification } from '../types';

const NOTIFICATION_REFRESH_INTERVAL_MS = 15_000;
const notificationsQueryKey = ['notifications'];

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
  const queryClient = useQueryClient();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [pendingReadIds, setPendingReadIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [markReadError, setMarkReadError] = useState<string | null>(null);

  const {
    data: notifications = [],
    isFetching,
    error: fetchError,
  } = useQuery({
    queryKey: notificationsQueryKey,
    queryFn: async () => {
      const nextNotifications = await getNotifications();
      const previousNotifications =
        queryClient.getQueryData<PortalNotification[]>(
          notificationsQueryKey,
        ) ?? [];

      return mergeNotifications(previousNotifications, nextNotifications);
    },
    refetchInterval: NOTIFICATION_REFRESH_INTERVAL_MS,
  });

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      setPendingReadIds((currentIds) =>
        new Set(currentIds).add(notificationId),
      );
      setMarkReadError(null);

      const previousNotification = queryClient
        .getQueryData<PortalNotification[]>(notificationsQueryKey)
        ?.find((notification) => notification.id === notificationId);

      queryClient.setQueryData<PortalNotification[]>(
        notificationsQueryKey,
        (current) =>
          current
            ? setNotificationReadState(current, notificationId, true)
            : current,
      );

      return { previousRead: previousNotification?.read ?? false };
    },
    onError: (_error, notificationId, context) => {
      queryClient.setQueryData<PortalNotification[]>(
        notificationsQueryKey,
        (current) =>
          current
            ? setNotificationReadState(
                current,
                notificationId,
                context?.previousRead ?? false,
              )
            : current,
      );
      setMarkReadError('Notification could not be marked as read.');
    },
    onSettled: (_data, _error, notificationId) => {
      setPendingReadIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(notificationId);
        return nextIds;
      });
    },
  });

  const error =
    markReadError ??
    (fetchError ? 'Notifications could not be refreshed.' : null);

  return {
    notifications,
    showUnreadOnly,
    unreadCount,
    isLoading: isFetching,
    error,
    pendingReadIds,
    setShowUnreadOnly,
    markNotificationRead: markReadMutation.mutate,
  };
}
