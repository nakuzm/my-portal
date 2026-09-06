import { createContext } from 'react';
import type { useNotificationState } from '@hooks/useNotificationState';

export type NotificationsContextValue = ReturnType<typeof useNotificationState>;

export const NotificationsContext =
  createContext<NotificationsContextValue | null>(null);
