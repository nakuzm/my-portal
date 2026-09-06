import { cn } from '../lib/cn';
import type { StatusTone } from '../types';

type StatusIndicatorProps = {
  tone: StatusTone;
  className?: string;
};

const statusToneClasses: Record<StatusTone, string> = {
  active: 'bg-status-active',
  inactive: 'bg-status-inactive',
  pending: 'bg-status-pending',
  error: 'bg-status-error',
  info: 'bg-status-info',
};

export function StatusIndicator({ tone, className }: StatusIndicatorProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'size-2 shrink-0 rounded-full',
        statusToneClasses[tone],
        className,
      )}
    />
  );
}
