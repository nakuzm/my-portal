import {
  Building2,
  CalendarDays,
  Crown,
  Headset,
  KeyRound,
} from 'lucide-react';
import { CardError, CardSkeleton } from './CardState';
import { DashboardCard } from './DashboardCard';
import { cn } from '../lib/cn';
import type { CustomerInfo } from '../types';
import { getInitials } from '@utils/getInitials';

type AccountSummaryProps = {
  customer: CustomerInfo | null;
  error: Error | null;
  isLoading: boolean;
  className?: string;
};

const accountRows = [
  ['accountId', 'Account ID', KeyRound],
  ['organization', 'Organization', Building2],
  ['tier', 'Tier', Crown],
  ['serviceManager', 'Service manager', Headset],
  ['renewalDate', 'Renewal', CalendarDays],
] as const;

export function AccountSummary({
  customer,
  error,
  isLoading,
  className,
}: AccountSummaryProps) {
  return (
    <DashboardCard
      className={cn('content-start gap-5', className)}
      aria-busy={isLoading}
    >
      {isLoading && (
        <>
          <div className="border-border-subtle grid justify-items-center gap-3 border-b pb-5 text-center">
            <div className="bg-surface-subtle size-16 animate-pulse rounded-full" />
            <div className="grid w-full justify-items-center gap-3">
              <div className="rounded-control bg-surface-subtle h-3 w-32 animate-pulse" />
              <div className="rounded-control bg-surface-subtle h-5 w-56 max-w-full animate-pulse" />
            </div>
          </div>
          <CardSkeleton rows={5} />
        </>
      )}

      {error && !isLoading && (
        <CardError title="Customer information unavailable" />
      )}

      {customer && !isLoading && !error && (
        <>
          <div className="border-border-subtle grid justify-items-center gap-3 border-b pb-5 text-center">
            <div className="bg-info-surface text-info-text grid size-16 place-items-center rounded-full text-xl font-bold">
              {getInitials(customer.name)}
            </div>
            <div>
              <p className="text-label-small font-label-small text-text-secondary mb-2 uppercase">
                Customer information
              </p>
              <h2 className="text-heading-2 font-heading-2 leading-snug">
                {customer.name}
              </h2>
            </div>
            <span className="rounded-pill bg-success-surface text-success-text px-3 py-2 text-xs font-bold">
              {customer.tier} account
            </span>
          </div>

          <div>
            <p className="text-label-small font-label-small text-text-secondary mb-3 uppercase">
              Account details
            </p>
            <dl className="grid gap-3">
              {accountRows.map(([key, label, Icon]) => (
                <div
                  key={key}
                  className="rounded-control border-border-subtle bg-surface-raised grid gap-2 border p-3"
                >
                  <dt className="text-label-small font-label-small text-text-secondary inline-flex items-center gap-3 uppercase">
                    <Icon aria-hidden="true" className="size-4" />
                    {label}
                  </dt>
                  <dd className="m-0 font-semibold">{customer[key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </>
      )}
    </DashboardCard>
  );
}
