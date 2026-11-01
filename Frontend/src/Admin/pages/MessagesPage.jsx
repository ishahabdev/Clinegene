import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  MailOpen,
  Search,
  Trash2,
  Eye,
  RefreshCw,
  Clock,
  Phone,
  User,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Inbox,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Modal from "../components/Modal.jsx";
import Button from "../components/Button.jsx";
import { useToast } from "../context/ToastContext.jsx";
import {
  getMessages,
  markMessageReadStatus,
  deleteMessage,
} from "../api/messages.js";

function formatTimestamp(isoString) {
  if (!isoString) return "—";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "—";
  }
}

function formatFullDate(isoString) {
  if (!isoString) return "—";
  try {
    return new Date(isoString).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export default function MessagesPage() {
  const { showToast } = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "unread" | "read"

  // Selected message for Detail Modal
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Deletion modal
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count, error } = await getMessages({
        page,
        pageSize,
        search: debouncedSearch,
        status: statusFilter,
      });

      if (error) {
        showToast({
          type: "error",
          title: "Failed to load messages",
          message: error.message || "Could not retrieve contact messages.",
        });
      } else {
        setMessages(data || []);
        setTotalCount(count || 0);
      }
    } catch (err) {
      showToast({
        type: "error",
        title: "Connection Error",
        message: err.message || "Failed to connect to database.",
      });
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, showToast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Toggle Read / Unread
  const handleToggleRead = async (message, e) => {
    if (e) e.stopPropagation();
    const newStatus = !message.is_read;
    try {
      await markMessageReadStatus(message.id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, is_read: newStatus } : m))
      );
      if (selectedMessage && selectedMessage.id === message.id) {
        setSelectedMessage((prev) => ({ ...prev, is_read: newStatus }));
      }
      showToast({
        type: "success",
        title: newStatus ? "Marked as Read" : "Marked as Unread",
        message: `Message from "${message.name}" updated.`,
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Action Failed",
        message: err.message || "Could not update message status.",
      });
    }
  };

  // Open detail modal and auto-mark as read if unread
  const handleOpenDetail = (message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markMessageReadStatus(message.id, true)
        .then(() => {
          setMessages((prev) =>
            prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m))
          );
          setSelectedMessage((prev) => ({ ...prev, is_read: true }));
        })
        .catch(() => {});
    }
  };

  // Confirm delete message
  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteMessage(deleteTargetId);
      if (selectedMessage && selectedMessage.id === deleteTargetId) {
        setSelectedMessage(null);
      }
      setDeleteTargetId(null);
      showToast({
        type: "success",
        title: "Message Deleted",
        message: "The message has been permanently deleted.",
      });
      fetchMessages();
    } catch (err) {
      showToast({
        type: "error",
        title: "Delete Failed",
        message: err.message || "Failed to delete the message.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        icon={Mail}
        title="Contact Messages"
        subtitle="Manage client inquiries, consultation requests, and career applications."
        breadcrumb="Messages"
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-[#0e1624] p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-[#1b283d] shadow-xs transition-colors">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or subject..."
            className="w-full pl-10 pr-12 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#080d17] border border-slate-200 dark:border-[#1b283d] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da5aa]/30 focus:border-[#0da5aa] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Tabs (Matches reference UI) */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto select-none">
          {/* All */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setPage(1);
            }}
            className={`px-4 sm:px-5 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#0da5aa] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            All ({totalCount})
          </button>

          {/* Unread */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter("unread");
              setPage(1);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              statusFilter === "unread"
                ? "bg-[#0da5aa] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
            <span>Unread</span>
          </button>

          {/* Read */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter("read");
              setPage(1);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              statusFilter === "read"
                ? "bg-[#0da5aa] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Messages List Card */}
      <div className="bg-white dark:bg-[#0e1624] rounded-2xl border border-slate-200 dark:border-[#1b283d] shadow-xs overflow-hidden transition-colors">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin text-[#0da5aa] mb-3" />
            <p className="font-outfit text-sm font-semibold">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-14 w-14 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-[#0da5aa] flex items-center justify-center mb-4">
              <Inbox className="h-7 w-7" />
            </div>
            <h3 className="font-outfit text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
              {debouncedSearch
                ? "No matching messages found"
                : statusFilter === "unread"
                ? "No unread messages"
                : "No messages yet"}
            </h3>
            <p className="font-inter text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {debouncedSearch
                ? `No messages matched "${debouncedSearch}". Try clearing filters.`
                : "When clients, researchers, or applicants send inquiries through your website, they will appear here in real-time."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#1b283d] bg-slate-50/70 dark:bg-[#0b121e]/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
                  <th className="py-3.5 pl-6 pr-3 w-28">Status</th>
                  <th className="py-3.5 px-3 min-w-44">Sender</th>
                  <th className="py-3.5 px-3">Subject & Summary</th>
                  <th className="py-3.5 px-3 w-32">Date</th>
                  <th className="py-3.5 pr-6 pl-3 text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#172336]/60 font-inter text-xs sm:text-[13px]">
                {messages.map((item) => {
                  const isUnread = !item.is_read;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenDetail(item)}
                      className={`group cursor-pointer transition-colors ${
                        isUnread
                          ? "bg-teal-50/20 dark:bg-teal-950/15 hover:bg-teal-50/40 dark:hover:bg-teal-950/25"
                          : "hover:bg-slate-50/80 dark:hover:bg-[#121c2e]/60"
                      }`}
                    >
                      {/* Status Pill Badge (Matches reference UI) */}
                      <td className="py-3.5 pl-6 pr-3 whitespace-nowrap">
                        {isUnread ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 dark:bg-rose-400 shrink-0" />
                            <span>Unread</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0" />
                            <span>Read</span>
                          </span>
                        )}
                      </td>

                      {/* Sender Info */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col min-w-40 sm:min-w-48">
                          <span className="truncate font-bold text-slate-900 dark:text-white text-sm">
                            {item.name || "Anonymous Sender"}
                          </span>
                          <span className="truncate text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                            {item.email}
                          </span>
                        </div>
                      </td>

                      {/* Subject & Summary */}
                      <td className="py-3.5 px-3 max-w-md">
                        <div className="flex flex-col">
                          <span className="truncate font-semibold text-slate-800 dark:text-slate-200 text-sm">
                            {item.subject || "No Subject"}
                          </span>
                          <span className="truncate text-slate-500 dark:text-slate-400 text-xs mt-0.5 line-clamp-1">
                            {item.message?.replace(/\n+/g, " ") || "No message body"}
                          </span>
                        </div>
                      </td>

                      {/* Date with Calendar Icon */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                        <div className="flex items-center gap-1.5" title={formatFullDate(item.created_at)}>
                          <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                          <span>{formatTimestamp(item.created_at)}</span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 pr-6 pl-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleToggleRead(item, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0da5aa] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title={isUnread ? "Mark as read" : "Mark as unread"}
                          >
                            {isUnread ? (
                              <MailOpen className="h-4 w-4" />
                            ) : (
                              <Mail className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(item);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="View message details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTargetId(item.id);
                            }}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Delete message"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar (Matches reference UI) */}
        {!loading && totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 dark:border-[#1b283d] bg-slate-50/50 dark:bg-[#0b121e]/40 text-xs text-slate-600 dark:text-slate-400">
            <div>
              Showing <span className="font-semibold text-slate-900 dark:text-white">{startItem}</span> to{" "}
              <span className="font-semibold text-slate-900 dark:text-white">{endItem}</span> of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">{totalCount}</span> messages
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 select-none">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  page < totalPages
                    ? "bg-[#0da5aa] hover:bg-[#088395] text-white shadow-xs"
                    : "text-slate-400 dark:text-slate-500 opacity-40 cursor-not-allowed"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      <Modal
        isOpen={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || "Message Details"}
        maxWidth="max-w-2xl"
      >
        {selectedMessage && (
          <div className="space-y-5">
            {/* Sender Meta Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#080d17] border border-slate-200 dark:border-[#1b283d]">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[#0da5aa] text-white flex items-center justify-center font-outfit text-base font-bold shadow-xs">
                  {selectedMessage.name ? selectedMessage.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h4 className="font-outfit text-sm font-bold text-slate-900 dark:text-white">
                    {selectedMessage.name}
                  </h4>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs text-[#0da5aa] hover:underline flex items-center gap-1"
                  >
                    <span>{selectedMessage.email}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Status and Time */}
              <div className="flex flex-col items-start sm:items-end text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatFullDate(selectedMessage.created_at)}
                </span>
                {selectedMessage.phone && (
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="mt-1 flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#0da5aa] font-medium"
                  >
                    <Phone className="h-3 w-3" />
                    <span>{selectedMessage.phone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Subject heading */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Subject
              </p>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedMessage.subject || "No Subject"}
              </h3>
            </div>

            {/* Full Message Body */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Message Content
              </p>
              <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#080d17]/80 border border-slate-200/80 dark:border-[#1b283d] font-inter text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap max-h-80 overflow-y-auto">
                {selectedMessage.message || "No message content."}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-slate-200 dark:border-[#1b283d]">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleRead(selectedMessage)}
                  className="flex items-center gap-1.5"
                >
                  {selectedMessage.is_read ? (
                    <>
                      <Mail className="h-3.5 w-3.5" />
                      <span>Mark as Unread</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Mark as Read</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteTargetId(selectedMessage.id)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  <span>Delete</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                >
                  Close
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject || "Your inquiry with ClinGene"
                  )}`}
                  className="bg-[#0da5aa] hover:bg-[#088395] text-white"
                >
                  <span>Reply via Email</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete Contact Message"
        description="Are you sure you want to delete this message? This action is permanent and cannot be undone."
        confirmText="Delete Message"
        variant="danger"
      />
    </div>
  );
}
