export default function PageSkeleton() {
  return (
    <div
      aria-label="Loading page content"
      aria-busy="true"
      className="min-h-[70vh] w-full animate-pulse"
    >
      {/* Hero skeleton */}
      <div className="h-64 sm:h-80 lg:h-96 w-full bg-gradient-to-b from-slate-100 to-slate-200/70" />

      {/* Content skeleton */}
      <div className="site-container py-12 sm:py-16">
        <div className="h-8 w-48 sm:w-64 bg-slate-200 rounded-lg mb-6" />
        <div className="h-4 w-full max-w-2xl bg-slate-200/80 rounded mb-3" />
        <div className="h-4 w-3/4 max-w-xl bg-slate-200/80 rounded mb-12" />

        {/* 3 cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-56 bg-slate-100 rounded-2xl border border-slate-200/60 p-6" />
          <div className="h-56 bg-slate-100 rounded-2xl border border-slate-200/60 p-6" />
          <div className="h-56 bg-slate-100 rounded-2xl border border-slate-200/60 p-6" />
        </div>
      </div>
    </div>
  );
}
