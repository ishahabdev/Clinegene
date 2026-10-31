import Button from "./Button.jsx";

export default function EmptyState({
  icon: Icon,
  title = "No items found",
  description = "Get started by creating a new entry or clearing your search filters.",
  actionText,
  onAction,
  actionIcon,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 p-10 text-center dark:border-slate-800 dark:bg-slate-900/40 my-4">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-[#b91c1c] dark:bg-rose-950/40 dark:text-rose-400">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="font-outfit text-base font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-1 max-w-sm font-inter text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <div className="mt-5">
          <Button size="sm" onClick={onAction} icon={actionIcon}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}

