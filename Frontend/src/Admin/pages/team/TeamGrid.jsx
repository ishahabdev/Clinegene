import {
  Mail,
  MapPin,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function TeamGrid({
  members = [],
  onEdit,
  onDelete,
  onReorder,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="flex flex-col items-center rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs animate-pulse"
          >
            <div className="h-24 w-24 rounded-full bg-slate-200 mb-4" />
            <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
            <div className="h-3 w-24 bg-slate-200 rounded mb-5" />
            <div className="w-full space-y-2 border-t border-slate-100 pt-4">
              <div className="h-3 w-full bg-slate-200 rounded" />
              <div className="h-3 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-1/2 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member, index) => {
        const orderNum = member.sort_order ?? member.displayOrder ?? index + 1;
        const isFirst = index === 0;
        const isLast = index === members.length - 1;
        const isPublished =
          member.status?.toLowerCase() === "published" ||
          member.status?.toLowerCase() === "active" ||
          !member.status;

        return (
          <div
            key={member.id}
            className="group relative flex flex-col items-center rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all duration-200"
          >
            {/* Top Left: Order Badge and Reorder Buttons */}
            <div className="absolute left-4 top-4 flex items-center gap-1.5">
              <span className="flex h-6 min-w-6 px-1.5 items-center justify-center rounded-md bg-slate-100 font-mono text-[11px] font-bold text-slate-500">
                #{orderNum}
              </span>
              {onReorder && (
                <div className="flex flex-col opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => onReorder(member.id, -1)}
                    className="p-0.5 text-slate-400 hover:text-teal-700 disabled:opacity-20 disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                    title="Move up"
                    aria-label={`Move ${member.name} up`}
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => onReorder(member.id, 1)}
                    className="p-0.5 text-slate-400 hover:text-teal-700 disabled:opacity-20 disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                    title="Move down"
                    aria-label={`Move ${member.name} down`}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Top Right: Status Badge & Action Icons */}
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                  isPublished
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    : "bg-amber-50 text-amber-700 border border-amber-200/60"
                }`}
              >
                {isPublished ? "Published" : "Draft"}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit && onEdit(member)}
                  aria-label={`Edit ${member.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] transition-colors cursor-pointer"
                  title="Edit member"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete && onDelete(member.id)}
                  aria-label={`Delete ${member.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ffe4e6] text-[#e11d48] hover:bg-[#fecdd3] transition-colors cursor-pointer"
                  title="Delete member"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Circular Avatar */}
            <div className="relative mt-4">
              <img
                src={member.image_url || member.photo}
                alt={member.name}
                className="h-24 w-24 rounded-full object-cover shadow-xs border-2 border-slate-100"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80";
                }}
              />
            </div>

            {/* Name & Title */}
            <h3 className="mt-4 font-outfit text-base font-bold text-slate-800 tracking-tight text-center">
              {member.name}
            </h3>
            <p className="text-xs text-slate-500 font-normal mb-5 text-center px-2 line-clamp-1">
              {member.role || member.designation}
            </p>

            {/* Contact Rows */}
            <div className="w-full space-y-2 border-t border-slate-100 pt-4 text-xs">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{member.email || "No email provided"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#009688] font-medium">
                <MapPin className="h-3.5 w-3.5 text-[#009688] shrink-0" />
                <span className="truncate">{member.department}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

