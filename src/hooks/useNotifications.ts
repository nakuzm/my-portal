import { useMemo, useState } from 'react';
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getNotifications, markNotificationRead } from '../lib/mockPortalApi';
import type { PortalNotification } from '../types';

const NOTIFICATION_REFRESH_INTERVAL_MS = 15_000;
const notificationsQueryKey = ['notifications'];
const markReadMutationScope = 'markNotificationRead';

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

export function useNotifications() {
  const queryClient = useQueryClient();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

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

  return {
    notifications,
    showUnreadOnly,
    unreadCount,
    isLoading: isFetching,
    error: fetchError ? 'Notifications could not be refreshed.' : null,
    setShowUnreadOnly,
  };
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: markReadMutationScope },
    mutationFn: (notificationId: string) =>
      markNotificationRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      const previous = queryClient.getQueryData<PortalNotification[]>(
        notificationsQueryKey,
      );

      queryClient.setQueryData<PortalNotification[]>(
        notificationsQueryKey,
        (current) =>
          current
            ? setNotificationReadState(current, notificationId, true)
            : current,
      );

      return { previous };
    },
    onError: (_error, _notificationId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationsQueryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });
}

// Reads pending mark-read ids from the mutation cache instead of local state, so any component can observe them.
export function usePendingReadIds() {
  const pendingIds = useMutationState({
    filters: {
      status: 'pending',
      predicate: (mutation) =>
        mutation.options.scope?.id === markReadMutationScope,
    },
    select: (mutation) => mutation.state.variables as string,
  });

  return useMemo(() => new Set(pendingIds), [pendingIds]);
}
