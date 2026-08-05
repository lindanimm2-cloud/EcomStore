export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-aheers-cream px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-aheers-green/20 border-t-aheers-green" />
      <p className="text-sm font-medium text-aheers-green">{label}</p>
    </div>
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10">
      <SkeletonBlock className="h-10 w-64" />
      <SkeletonBlock className="h-4 w-96 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBlock key={i} className="h-48" />
        ))}
      </div>
      <SkeletonBlock className="h-64 w-full" />
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-64 animate-pulse bg-aheers-green-dark/90 md:block" />
      <div className="flex-1 space-y-4 bg-gray-50 p-8">
        <SkeletonBlock className="h-8 w-72" />
        <SkeletonBlock className="h-4 w-48" />
        <div className="grid gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} className="h-24" />
          ))}
        </div>
        <SkeletonBlock className="h-80 w-full" />
      </div>
    </div>
  );
}
