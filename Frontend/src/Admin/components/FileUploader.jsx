import { useState, useRef } from "react";
import { UploadCloud, FileText, Trash2, RefreshCw } from "lucide-react";

export default function FileUploader({
  label = "Requisition Form",
  value = null,
  onChange,
  accept = ".pdf,application/pdf",
  maxSizeMB = 5,
  helperText = "Shows a Download requisition form button on the service page.",
  error: externalError = "",
  disabled = false,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFile = (file) => {
    setLocalError("");
    if (!file) return;

    // Validate PDF
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setLocalError("Invalid file type. Please upload a valid PDF document.");
      return;
    }

    // Validate Size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size exceeds the ${maxSizeMB} MB limit (${formatFileSize(file.size)}).`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (onChange) {
        onChange({
          url: e.target.result,
          name: file.name,
          size: file.size,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setLocalError("");
    if (inputRef.current) inputRef.current.value = "";
    if (onChange) onChange(null);
  };

  // Determine file details from value
  const fileName =
    typeof value === "string"
      ? value.split("/").pop()
      : value?.name || "Requisition-Form.pdf";
  const fileSize = typeof value === "object" ? value?.size : null;
  const hasFile = Boolean(value && (typeof value === "string" ? value.length > 0 : value.url || value.name));

  const displayError = localError || externalError;

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 font-inter text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0]);
        }}
        className="hidden"
      />

      {hasFile ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#009688]">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-outfit text-xs font-bold text-slate-800 truncate">
                {fileName}
              </p>
              {fileSize ? (
                <p className="text-[11px] text-slate-400 font-medium">
                  {formatFileSize(fileSize)} · PDF document
                </p>
              ) : (
                <p className="text-[11px] text-teal-600 font-medium">
                  PDF document ready
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={handleRemove}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`group flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-[#009688] bg-teal-50/50"
              : "border-slate-300 hover:border-[#009688] bg-slate-50/60 hover:bg-white"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-[#009688] mb-2 group-hover:scale-105 transition-transform">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700">
            Click to upload or drag &amp; drop
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            PDF files only (max {maxSizeMB} MB)
          </p>
        </div>
      )}

      {helperText && !displayError && (
        <p className="mt-1 text-[11px] text-slate-500">{helperText}</p>
      )}

      {displayError && (
        <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
          <span>{displayError}</span>
        </p>
      )}
    </div>
  );
}

