import * as Popover from '@radix-ui/react-popover';
import { Bell, LoaderCircle, X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { useNotifications } from '@hooks/useNotifications';
import { cn } from '../lib/cn';
import type { PortalNotification } from '../types';
import { Button } from './form/Button';

export function NotificationCenter() {
  const {
    notifications,
    showUnreadOnly,
    unreadCount,
    isLoading,
    error,
    pendingReadIds,
    setShowUnreadOnly,
    markNotificationRead,
  } = useNotifications();
  const headingId = useId();
  const descriptionId = useId();
  const listId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadFilterRef = useRef<HTMLInputElement>(null);
  const pendingFocusNotificationId = useRef<string | null>(null);
  const nextFocusTarget = useRef<HTMLElement | null>(null);
  const visibleNotifications = showUnreadOnly
    ? notifications.filter(
        (notification) =>
          !notification.read || pendingReadIds.has(notification.id),
      )
    : notifications;

  useEffect(() => {
    const notificationId = pendingFocusNotificationId.current;

    if (!notificationId || pendingReadIds.has(notificationId)) {
      return;
    }

    const notification = notifications.find(
      (item) => item.id === notificationId,
    );
    const focusTarget = nextFocusTarget.current;

    if (notification?.read && focusTarget) {
      window.requestAnimationFrame(() => {
        focusTarget.focus();
      });
    }

    pendingFocusNotificationId.current = null;
    nextFocusTarget.current = null;
  }, [notifications, pendingReadIds]);

  const handleMarkRead = (
    notificationId: string,
    currentTarget: HTMLButtonElement,
  ) => {
    pendingFocusNotificationId.current = notificationId;
    nextFocusTarget.current =
      getNextFocusableElement(panelRef.current, currentTarget) ??
      unreadFilterRef.current;
    markNotificationRead(notificationId);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="border-border-default relative"
          aria-label={`Notifications, ${unreadCount} unread`}
        >
          <Bell
            aria-hidden="true"
            className="text-background-primary size-[20px]"
          />
          {unreadCount > 0 && (
            <span
              className="border-background-surface bg-counter-background text-counter-text absolute -top-3 -right-3 grid h-[22px] min-w-[22px] place-items-center rounded-full border-2 px-2 text-xs font-bold"
              aria-hidden="true"
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </Popover.Trigger>
      <span className="sr-only" role="status" aria-atomic="true">
        {unreadCount} unread notifications
      </span>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          role="dialog"
          aria-labelledby={headingId}
          aria-describedby={descriptionId}
          ref={panelRef}
          className="rounded-surface border-border-subtle bg-background-surface z-30 w-[min(420px,calc(100vw-32px))] border p-4 shadow-[0_18px_42px_rgba(17,24,39,0.14)]"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2
                id={headingId}
                className="text-heading-2 font-heading-2 leading-snug"
              >
                Notifications
              </h2>
              <p id={descriptionId} className="text-text-secondary">
                {unreadCount} unread
              </p>
              {isLoading && (
                <p className="text-text-secondary text-sm" role="status">
                  Refreshing notifications...
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-label-small font-label-small text-text-primary inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  ref={unreadFilterRef}
                  checked={showUnreadOnly}
                  aria-controls={listId}
                  className="focus-ring accent-primary size-[18px]"
                  onChange={(event) => setShowUnreadOnly(event.target.checked)}
                />
                <span>Unread only</span>
              </label>
              <Popover.Close asChild>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  aria-label="Close notifications"
                >
                  <X
                    aria-hidden="true"
                    className="text-icon-secondary size-4"
                  />
                </Button>
              </Popover.Close>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-control border-border-feedback-error bg-background-feedback-error text-text-feedback-error mb-4 border p-3 text-sm"
            >
              {error}
            </p>
          )}

          <ul
            id={listId}
            aria-label={
              showUnreadOnly ? 'Unread notifications' : 'All notifications'
            }
            aria-busy={pendingReadIds.size > 0}
            className="grid gap-3 p-0"
          >
            {visibleNotifications.length === 0 && (
              <li className="rounded-control border-border-subtle bg-background-surface text-text-secondary border p-3">
                No notifications to show.
              </li>
            )}
            {visibleNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                isMarkingRead={pendingReadIds.has(notification.id)}
                onMarkRead={handleMarkRead}
              />
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

type NotificationItemProps = {
  notification: PortalNotification;
  isMarkingRead: boolean;
  onMarkRead: (
    notificationId: string,
    currentTarget: HTMLButtonElement,
  ) => void;
};

function NotificationItem({
  notification,
  isMarkingRead,
  onMarkRead,
}: NotificationItemProps) {
  const canMarkRead = !notification.read || isMarkingRead;

  return (
    <li
      className={cn(
        'rounded-control min-h-[72px] border p-3',
        notification.read
          ? 'border-border-subtle bg-background-notification-read'
          : 'border-border-feedback-info bg-background-notification-unread',
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <p className="text-text-primary font-bold">{notification.title}</p>
          <span className="text-text-secondary text-sm">
            &bull; {notification.createdAt}
          </span>
        </div>
        <p>{notification.detail}</p>
        {canMarkRead && (
          <div className="mt-3">
            <Button
              size="sm"
              disabled={isMarkingRead}
              aria-busy={isMarkingRead}
              aria-label={
                isMarkingRead
                  ? `Marking ${notification.title} as read`
                  : `Mark ${notification.title} as read`
              }
              className="disabled:cursor-wait"
              onClick={(event) =>
                onMarkRead(notification.id, event.currentTarget)
              }
            >
              {isMarkingRead && (
                <LoaderCircle
                  aria-hidden="true"
                  className="text-icon-inverse size-4 animate-spin"
                />
              )}
              {isMarkingRead ? 'Marking read' : 'Mark read'}
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}

function getNextFocusableElement(
  container: HTMLDivElement | null,
  currentElement: HTMLElement,
) {
  if (!container) {
    return null;
  }

  const focusableElements = Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), [href], select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    ),
  );
  const currentIndex = focusableElements.indexOf(currentElement);

  return focusableElements.at(currentIndex + 1) ?? null;
}
