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
  Filter,
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
          title: "Error Loading Messages",
          message: error.message || "Failed to load contact messages.",
        });
      } else {
        setMessages(data);
        setTotalCount(count);
      }
    } catch (err) {
      showToast({
        type: "error",
        title: "Unexpected Error",
        message: err.message || "Could not retrieve messages.",
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, statusFilter, showToast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Handle Mark Read / Unread
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
        message: `Message from ${message.name} updated.`,
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Could not update message read status.",
      });
    }
  };

  // Open Message Detail (and automatically mark read if unread)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Contact Messages"
        subtitle="Manage client inquiries, consultation requests, and career applications received via the website."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMessages}
              disabled={loading}
              className="flex items-center gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or subject..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-slate-800 dark:text-slate-100"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("unread");
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              statusFilter === "unread"
                ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Unread
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("read");
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === "read"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Messages List Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin text-teal-600 mb-3" />
            <p className="font-outfit text-sm font-semibold">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-14 w-14 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
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
                ? `No messages matched the search term "${debouncedSearch}". Try clearing filters.`
                : "When clients, researchers, or applicants send inquiries through your website, they will appear here in real-time."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 pl-5 pr-3 w-8">Status</th>
                  <th className="py-3.5 px-3">Sender</th>
                  <th className="py-3.5 px-3">Subject & Summary</th>
                  <th className="py-3.5 px-3 w-32">Date</th>
                  <th className="py-3.5 pr-5 pl-3 text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-inter text-xs sm:text-[13px]">
                {messages.map((item) => {
                  const isUnread = !item.is_read;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenDetail(item)}
                      className={`group cursor-pointer transition-colors ${
                        isUnread
                          ? "bg-teal-50/30 dark:bg-teal-950/20 hover:bg-teal-50/60 dark:hover:bg-teal-950/30"
                          : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      {/* Unread indicator */}
                      <td className="py-3.5 pl-5 pr-3">
                        <span
                          className={`inline-block h-2.5 w-2.5 rounded-full transition-transform ${
                            isUnread
                              ? "bg-teal-600 dark:bg-teal-400 scale-110 shadow-xs"
                              : "bg-transparent border border-slate-300 dark:border-slate-700"
                          }`}
                          title={isUnread ? "Unread Message" : "Read Message"}
                        />
                      </td>

                      {/* Sender Info */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col min-w-35 sm:min-w-45">
                          <span
                            className={`truncate text-slate-900 dark:text-slate-100 ${
                              isUnread ? "font-bold text-[13.5px]" : "font-medium"
                            }`}
                          >
                            {item.name || "Anonymous Sender"}
                          </span>
                          <span className="truncate text-slate-500 dark:text-slate-400 text-[11.5px]">
                            {item.email}
                          </span>
                        </div>
                      </td>

                      {/* Subject & snippet */}
                      <td className="py-3.5 px-3 max-w-md">
                        <div className="flex flex-col">
                          <span
                            className={`truncate text-slate-800 dark:text-slate-200 ${
                              isUnread ? "font-bold text-slate-900 dark:text-white" : "font-normal"
                            }`}
                          >
                            {item.subject || "No Subject"}
                          </span>
                          <span className="truncate text-slate-500 dark:text-slate-400 text-[11.5px] line-clamp-1">
                            {item.message?.replace(/\n+/g, " ") || "No message body"}
                          </span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                        <span title={formatFullDate(item.created_at)}>
                          {formatTimestamp(item.created_at)}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 pr-5 pl-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(e) => handleToggleRead(item, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View message"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTargetId(item.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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

        {/* Pagination Bar */}
        {!loading && totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-600 dark:text-slate-400">
            <div>
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {(page - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {Math.min(page * pageSize, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {totalCount}
              </span>{" "}
              messages
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="px-2.5 py-1 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Previous
              </Button>

              <span className="px-2 text-xs font-medium">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="px-2.5 py-1 text-xs"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-teal-600 text-white flex items-center justify-center font-outfit text-base font-bold shadow-xs">
                  {selectedMessage.name ? selectedMessage.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h4 className="font-outfit text-sm font-bold text-slate-900 dark:text-white">
                    {selectedMessage.name}
                  </h4>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
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
                    className="mt-1 flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium"
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
              <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 font-inter text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap max-h-80 overflow-y-auto">
                {selectedMessage.message || "No message content."}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
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
                  className="bg-teal-600 hover:bg-teal-700 text-white"
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

