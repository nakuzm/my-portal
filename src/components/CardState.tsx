type CardStateProps = {
  title: string;
  message?: string;
};

export function CardError({
  title,
  message = 'Unable to load data.',
}: CardStateProps) {
  return (
    <div
      role="alert"
      className="rounded-control border-error-border bg-error-surface border p-3"
    >
      <p className="text-error-text font-semibold">{title}</p>
      <p className="text-error-text">{message}</p>
    </div>
  );
}

type CardSkeletonProps = {
  rows?: number;
};

export function CardSkeleton({ rows = 3 }: CardSkeletonProps) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading section data...</span>
      <div className="grid gap-3" aria-hidden="true">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="rounded-control bg-surface-subtle h-[58px] animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
