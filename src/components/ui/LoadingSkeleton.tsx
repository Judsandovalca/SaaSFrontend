interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700/50 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-6">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-6">
      <Skeleton className="h-5 w-40 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-6">
      <Skeleton className="h-5 w-40 mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
