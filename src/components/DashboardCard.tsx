import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../lib/cn';

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<'article'>;

export function DashboardCard({
  children,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <article
      {...props}
      className={cn(
        'rounded-surface border-border-subtle bg-surface grid gap-4 border p-5',
        className,
      )}
    >
      {children}
    </article>
  );
}

type CardHeaderProps = {
  title: string;
  count?: number;
};

export function CardHeader({ title, count }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-heading-2 font-heading-2 leading-snug">{title}</h2>
      {typeof count === 'number' && (
        <span className="rounded-pill bg-info-surface text-info-text grid h-[30px] min-w-[34px] place-items-center px-3 font-bold">
          {count}
        </span>
      )}
    </div>
  );
}
