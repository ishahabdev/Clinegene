import Modal from "./Modal.jsx";
import Button from "./Button.jsx";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  open,
  onClose,
  onCancel,
  onConfirm,
  title = "Confirm Deletion",
  message,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  variant = "danger",
}) {
  const visible = isOpen !== undefined ? isOpen : (open !== undefined ? open : false);
  const handleClose = onClose || onCancel;
  const displayText =
    message || description || "Are you sure you want to delete this item? This action cannot be undone.";

  return (
    <Modal isOpen={Boolean(visible)} onClose={handleClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 py-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <p className="font-inter text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {displayText}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button variant="outline" size="sm" onClick={handleClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={variant} size="sm" onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

