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
    return 'bg-error-surface text-error-text';
  }

  if (tone === 'medium') {
    return 'bg-warning-surface text-warning-text';
  }

  if (tone === 'low' || tone === 'success') {
    return 'bg-success-surface text-success-text';
  }

  return 'bg-info-surface text-info-text';
}
