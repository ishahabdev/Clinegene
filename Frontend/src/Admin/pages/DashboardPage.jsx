import {
  LayoutDashboard,
  Users,
  Layers,
  Microscope,
  Briefcase,
  Activity,
  UserCheck,
  ChevronRight,
  Zap,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";

export default function DashboardPage({ onNavigate }) {
  const stats = [
    {
      count: "9",
      title: "Scientific Faculty & Team",
      icon: Users,
      path: "/admin/team",
    },
    {
      count: "16",
      title: "Genomic Services",
      icon: Layers,
      path: "/admin/services",
    },
    {
      count: "0",
      title: "Research Publications",
      icon: Microscope,
      path: "/admin/research",
    },
    {
      count: "0",
      title: "Open Career Positions",
      icon: Briefcase,
      path: "/admin/career",
    },
  ];

  const recentActivities = [
    {
      title: "Executive Profile Updated",
      description:
        "Dr. Amjad Ali Tanoli (CEO) & Dr. Safdar Ali (Managing Director) profiles updated.",
      time: "5 mins ago",
      author: "By Dr. Amjad Ali Tanoli Ph.D",
      icon: UserCheck,
    },
    {
      title: "Service Catalog Validated",
      description:
        "Clinical Whole Exome & Sanger Sequencing pricing verified.",
      time: "1 hour ago",
      author: "By Dr. Safdar Ali, Ph.D",
      icon: Layers,
    },
    {
      title: "Laboratory Diagnostics Verified",
      description:
        "ACMG clinical exome sequencing pipeline protocols calibrated.",
      time: "Yesterday",
      author: "By Dr. Kifayat Ullah, Ph.D",
      icon: Microscope,
    },
    {
      title: "Bioinformatics Pipeline Active",
      description:
        "Variant annotation pipelines calibrated for high-depth sequencing.",
      time: "3 days ago",
      author: "By Dr. Amjad Ali Tanoli Ph.D",
      icon: Layers,
    },
  ];

  const shortcuts = [
    {
      label: "Add New Doctor",
      path: "/admin/team",
    },
    {
      label: "Configure Medical Services",
      path: "/admin/services",
    },
    {
      label: "Upload Gallery Media",
      path: "/admin/gallery",
    },
    {
      label: "Create Blog Article",
      path: "/admin/news",
    },
  ];

  return (
    <div>
      {/* Page Header (Matching exact screenshot: Home > Dashboard, no action button) */}
      <AdminPageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        subtitle="Hospital & Medical Admin Overview"
        breadcrumb="Dashboard"
      />

      {/* 4 Stat Cards in a Row (Compact & clean, cyan left border & ArrowUpRight) */}
      <div className="mb-4 sm:mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              onClick={() => onNavigate && onNavigate(stat.path)}
              className="group relative rounded-xl sm:rounded-2xl border border-slate-100 border-l-4 border-l-[#00c5db] bg-white p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-200 hover:border-l-[#00c5db] transition-all duration-200 cursor-pointer"
            >
              {/* Top row: Icon container on left, Arrow button on right */}
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f8fa] text-[#009688] group-hover:scale-105 transition-transform">
                  <Icon className="h-4.5 w-4.5 stroke-[1.9]" />
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0f9fa] text-[#00a2b5] group-hover:bg-[#009688] group-hover:text-white transition-colors">
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.2]" />
                </div>
              </div>

              {/* Number Value */}
              <h3 className="mt-2.5 font-outfit text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-none">
                {stat.count}
              </h3>

              {/* Title */}
              <p className="mt-1 font-outfit text-xs sm:text-[13px] font-bold text-slate-700 tracking-tight truncate">
                {stat.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Activity (~58%) + Quick Shortcuts (~42%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Column: Recent Admin Activity (col-span-7) */}
        <div className="lg:col-span-7 rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs">
          {/* Activity Card Header */}
          <div className="flex items-center justify-between pb-2.5 mb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#009688]/10 text-[#009688]">
                <Activity className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="font-outfit text-xs sm:text-sm font-bold text-slate-800">
                  Recent Admin Activity
                </h3>
                <p className="text-[10.5px] text-slate-400">
                  Latest updates and actions
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate("/admin/team")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#009688] hover:text-[#00897b] transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Activity Feed Rows */}
          <div className="divide-y divide-slate-100/80">
            {recentActivities.map((act, index) => {
              const ActIcon = act.icon;
              return (
                <div
                  key={index}
                  className="py-2 flex items-start gap-2.5 hover:bg-slate-50/60 transition-colors rounded-lg px-1.5"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#009688] mt-0.5">
                    <ActIcon className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-outfit text-xs font-bold text-slate-800 truncate">
                        {act.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {act.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-normal">
                      {act.description}
                    </p>
                    <p className="text-[10px] font-medium text-teal-600 mt-0.5">
                      {act.author}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Quick Shortcuts (col-span-5) */}
        <div className="lg:col-span-5">
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#009688]/10 text-[#009688]">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <h3 className="font-outfit text-xs sm:text-sm font-bold text-slate-800">
                Quick Shortcuts
              </h3>
            </div>

            <div className="space-y-1.5">
              {shortcuts.map((sc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onNavigate && onNavigate(sc.path)}
                  className="w-full flex items-center justify-between rounded-lg sm:rounded-xl border border-slate-200/70 bg-white py-2 px-3 hover:bg-teal-50/40 hover:border-teal-200 transition-all text-left shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-teal-50 text-[#009688] group-hover:scale-105 transition-transform">
                      <Plus className="h-3 w-3 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-teal-900 transition-colors">
                      {sc.label}
                    </span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
