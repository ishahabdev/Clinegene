import { useState, useEffect } from "react";
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
  Image as ImageIcon,
  FileText,
  Mail,
} from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import { adminPath } from "../adminConfig.js";
import { supabase } from "../../lib/supabase.js";

function formatTimeAgo(isoString) {
  if (!isoString) return "Recently";
  const date = new Date(isoString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffSec) || diffSec < 0) return "Recently";
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DashboardPage({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    team: "—",
    services: "—",
    research: "—",
    jobs: "—",
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const [
          teamCountRes,
          servicesCountRes,
          researchCountRes,
          jobsCountRes,
          jobsRes,
          galleryRes,
          teamRes,
          servicesRes,
          researchRes,
          blogsRes,
          newsRes,
          contactMessagesRes,
        ] = await Promise.all([
          supabase.from("team").select("id", { count: "exact", head: true }),
          supabase.from("services").select("id", { count: "exact", head: true }),
          supabase.from("research").select("id", { count: "exact", head: true }),
          supabase.from("jobs").select("id", { count: "exact", head: true }),
          supabase
            .from("jobs")
            .select("id, title, department, job_type, created_at")
            .order("created_at", { ascending: false })
            .limit(4),
          supabase
            .from("gallery")
            .select("id, title, category, created_at")
            .order("created_at", { ascending: false })
            .limit(4),
          supabase
            .from("team")
            .select("id, name, role, department, created_at")
            .order("created_at", { ascending: false })
            .limit(4),
          supabase
            .from("services")
            .select("id, title, category, created_at")
            .order("created_at", { ascending: false })
            .limit(4),
          supabase
            .from("research")
            .select("id, title, category, lead_investigator, created_at")
            .order("created_at", { ascending: false })
            .limit(4),
          supabase
            .from("blog_posts")
            .select("id, title, author, created_at")
            .order("created_at", { ascending: false })
            .limit(4),
          supabase
            .from("news_posts")
            .select("id, title, created_at")
            .order("created_at", { ascending: false })
            .limit(4),
          supabase
            .from("contact_messages")
            .select("id, name, subject, created_at")
            .order("created_at", { ascending: false })
            .limit(4),
        ]);

        if (!isMounted) return;

        // Set Live Exact Counts from Database
        setCounts({
          team: typeof teamCountRes.count === "number" ? String(teamCountRes.count) : "0",
          services: typeof servicesCountRes.count === "number" ? String(servicesCountRes.count) : "0",
          research: typeof researchCountRes.count === "number" ? String(researchCountRes.count) : "0",
          jobs: typeof jobsCountRes.count === "number" ? String(jobsCountRes.count) : "0",
        });

        // Compile Live Activity Feed across all updated tables
        const activities = [];

        (jobsRes.data || []).forEach((j) => {
          activities.push({
            id: `job-${j.id}`,
            title: "Career Opening Added",
            description: `${j.title || "Job"} — ${j.department || "Human Genetics"}${j.job_type ? ` (${j.job_type})` : ""}`,
            time: formatTimeAgo(j.created_at),
            author: "Career Portal",
            icon: Briefcase,
            path: adminPath("/career"),
            timestamp: new Date(j.created_at).getTime() || 0,
          });
        });

        (galleryRes.data || []).forEach((g) => {
          activities.push({
            id: `gallery-${g.id}`,
            title: "Gallery Media Uploaded",
            description: `${g.title || "Image"}${g.category ? ` • ${g.category}` : ""}`,
            time: formatTimeAgo(g.created_at),
            author: "Photo Gallery",
            icon: ImageIcon,
            path: adminPath("/gallery"),
            timestamp: new Date(g.created_at).getTime() || 0,
          });
        });

        (teamRes.data || []).forEach((t) => {
          activities.push({
            id: `team-${t.id}`,
            title: "Team Member Registered",
            description: `${t.name || "Faculty Member"}${t.role ? ` (${t.role})` : ""}${t.department ? ` • ${t.department}` : ""}`,
            time: formatTimeAgo(t.created_at),
            author: "Scientific Faculty",
            icon: UserCheck,
            path: adminPath("/team"),
            timestamp: new Date(t.created_at).getTime() || 0,
          });
        });

        (servicesRes.data || []).forEach((s) => {
          activities.push({
            id: `service-${s.id}`,
            title: "Genomic Service Catalog",
            description: `${s.title || "Service"}${s.category ? ` • ${s.category}` : ""}`,
            time: formatTimeAgo(s.created_at),
            author: "Clinical Services",
            icon: Layers,
            path: adminPath("/services"),
            timestamp: new Date(s.created_at).getTime() || 0,
          });
        });

        (researchRes.data || []).forEach((r) => {
          activities.push({
            id: `research-${r.id}`,
            title: "Research Paper Published",
            description: `${r.title || "Publication"}${r.category ? ` • ${r.category}` : ""}`,
            time: formatTimeAgo(r.created_at),
            author: r.lead_investigator ? `Lead: ${r.lead_investigator}` : "Research Wing",
            icon: Microscope,
            path: adminPath("/research"),
            timestamp: new Date(r.created_at).getTime() || 0,
          });
        });

        (blogsRes.data || []).forEach((b) => {
          activities.push({
            id: `blog-${b.id}`,
            title: "Blog Article Published",
            description: b.title || "Article",
            time: formatTimeAgo(b.created_at),
            author: b.author ? `By ${b.author}` : "Editorial",
            icon: FileText,
            path: adminPath("/news"),
            timestamp: new Date(b.created_at).getTime() || 0,
          });
        });

        (newsRes.data || []).forEach((n) => {
          activities.push({
            id: `news-${n.id}`,
            title: "News Release Posted",
            description: n.title || "Announcement",
            time: formatTimeAgo(n.created_at),
            author: "Press & News",
            icon: FileText,
            path: adminPath("/news"),
            timestamp: new Date(n.created_at).getTime() || 0,
          });
        });

        (contactMessagesRes?.data || []).forEach((m) => {
          activities.push({
            id: `msg-${m.id}`,
            title: "New Client Message",
            description: `${m.name}: ${m.subject || "Website Inquiry"}`,
            time: formatTimeAgo(m.created_at),
            author: "Contact Desk",
            icon: Mail,
            path: adminPath("/messages"),
            timestamp: new Date(m.created_at).getTime() || 0,
          });
        });

        activities.sort((a, b) => b.timestamp - a.timestamp);
        setRecentActivities(activities.slice(0, 5));
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("[DashboardPage] Live dashboard fetch error:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      count: counts.team,
      title: "Scientific Faculty & Team",
      icon: Users,
      path: adminPath("/team"),
    },
    {
      count: counts.services,
      title: "Genomic Services",
      icon: Layers,
      path: adminPath("/services"),
    },
    {
      count: counts.research,
      title: "Research Publications",
      icon: Microscope,
      path: adminPath("/research"),
    },
    {
      count: counts.jobs,
      title: "Open Career Positions",
      icon: Briefcase,
      path: adminPath("/career"),
    },
  ];

  const shortcuts = [
    {
      label: "Add New Doctor",
      path: adminPath("/team"),
    },
    {
      label: "Configure Medical Services",
      path: adminPath("/services"),
    },
    {
      label: "Upload Gallery Media",
      path: adminPath("/gallery"),
    },
    {
      label: "Create Blog Article",
      path: adminPath("/news"),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <AdminPageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        subtitle="Hospital & Medical Admin Overview"
        breadcrumb="Dashboard"
      />

      {/* 4 Stat Cards in a Row */}
      <div className="mb-4 sm:mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              onClick={() => onNavigate && onNavigate(stat.path)}
              className="group relative rounded-xl sm:rounded-2xl border border-slate-100 border-l-4 border-l-[#00c5db] bg-white p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-200 hover:border-l-[#00c5db] transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f8fa] text-[#009688] group-hover:scale-105 transition-transform">
                  <Icon className="h-4.5 w-4.5 stroke-[1.9]" />
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0f9fa] text-[#00a2b5] group-hover:bg-[#009688] group-hover:text-white transition-colors">
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.2]" />
                </div>
              </div>

              <h3 className="mt-2.5 font-outfit text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-none">
                {stat.count}
              </h3>

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
              onClick={() =>
                onNavigate &&
                onNavigate(recentActivities[0]?.path || adminPath("/team"))
              }
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#009688] hover:text-[#00897b] transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Activity Feed Rows */}
          <div className="divide-y divide-slate-100/80">
            {loading ? (
              <div className="py-6 space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-3 animate-pulse">
                    <div className="h-8 w-8 rounded-lg bg-slate-100" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-1/3 rounded bg-slate-100" />
                      <div className="h-2.5 w-2/3 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent activity logged yet.
              </div>
            ) : (
              recentActivities.map((act) => {
                const ActIcon = act.icon;
                return (
                  <div
                    key={act.id}
                    onClick={() => onNavigate && onNavigate(act.path)}
                    className="py-2.5 flex items-start gap-2.5 hover:bg-slate-50/70 transition-colors rounded-lg px-1.5 cursor-pointer group"
                  >
                    <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#009688] mt-0.5 group-hover:scale-105 transition-transform">
                      <ActIcon className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-outfit text-xs font-bold text-slate-800 truncate group-hover:text-teal-700 transition-colors">
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
              })
            )}
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
