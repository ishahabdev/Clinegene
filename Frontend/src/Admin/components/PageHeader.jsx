export default function PageHeader({
  title,
  subtitle,
  children,
  badge,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="font-outfit text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-[26px]">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="mt-1 font-inter text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}

