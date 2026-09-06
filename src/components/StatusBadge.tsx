import { cn } from '../lib/cn';
import type { Priority } from '../types';

type StatusBadgeProps = {
  children: string;
  tone: 'info' | 'success' | Priority;
};

export function StatusBadge({ children, tone }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-pill inline-flex min-h-[26px] items-center px-3 text-xs font-bold',
        getToneClass(tone),
      )}
    >
      {children}
    </span>
  );
}

function getToneClass(tone: StatusBadgeProps['tone']) {
  if (tone === 'critical' || tone === 'high') {
    return 'bg-background-feedback-error text-text-feedback-error';
  }

  if (tone === 'medium') {
    return 'bg-background-feedback-warning text-text-feedback-warning';
  }

  if (tone === 'low' || tone === 'success') {
    return 'bg-background-feedback-success text-text-feedback-success';
  }

  return 'bg-background-feedback-info text-text-feedback-info';
}
