import { useState, useRef } from "react";
import { UploadCloud, X, RefreshCw, Link as LinkIcon, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { formatBytes, processAndOptimizeImage } from "../../lib/imageOptimizer.js";

export default function ImageUploader({
  value,
  onChange,
  onUpload,
  label = "Upload Photo",
  aspectRatio = "aspect-square",
  maxSizeMB = 10,
  helperText = "PNG, JPG, or WebP up to 10MB (automatically optimized to WebP <= 2MB)",
  required = false,
  error,
  allowUrlFallback = true,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [finalSizeInfo, setFinalSizeInfo] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    setLocalError("");
    setFinalSizeInfo("");
    if (!file) return;

    // Requirement 2b: Reject files over 10 MB before processing
    const maxInputBytes = 10 * 1024 * 1024;
    if (file.size > maxInputBytes) {
      setLocalError(
        `File is too large (${formatBytes(file.size)}). Files over 10 MB are rejected before processing.`
      );
      return;
    }

    // Validate MIME type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validMimes.includes(file.type.toLowerCase())) {
      setLocalError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (onUpload) {
      try {
        setUploading(true);
        setUploadStatus("Resizing & converting to WebP...");
        const result = await onUpload(file);
        
        let url = "";
        let sizeText = "";

        if (typeof result === "string") {
          url = result;
        } else if (result && typeof result === "object") {
          url = result.publicUrl;
          sizeText = result.sizeFormatted;
        }

        onChange(url);
        if (sizeText) {
          setFinalSizeInfo(sizeText);
        }
      } catch (err) {
        setLocalError(err.message || "Failed to process and upload image.");
      } finally {
        setUploading(false);
        setUploadStatus("");
      }
    } else {
      try {
        setUploading(true);
        setUploadStatus("Optimizing photo...");
        const optimized = await processAndOptimizeImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange(e.target.result);
          setFinalSizeInfo(optimized.sizeFormatted);
          setUploading(false);
          setUploadStatus("");
        };
        reader.readAsDataURL(optimized.blob || optimized.file);
      } catch (_) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange(e.target.result);
          setFinalSizeInfo(formatBytes(file.size));
          setUploading(false);
          setUploadStatus("");
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = (e) => {
    e.stopPropagation();
    onChange("");
    setFinalSizeInfo("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label className="block font-inter text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        {allowUrlFallback && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-slate-400 hover:text-[#0da5aa] dark:hover:text-[#0da5aa] flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="h-3 w-3" />
            {showUrlInput ? "Hide URL" : "Enter URL instead"}
          </button>
        )}
      </div>

      {showUrlInput && (
        <div className="mb-2.5">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => {
              onChange(e.target.value);
              setFinalSizeInfo("");
            }}
            placeholder="Paste image URL..."
            className="w-full rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50 dark:bg-[#080d17] px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0da5aa] focus:outline-hidden"
          />
        </div>
      )}

      {uploading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-teal-200 dark:border-teal-900/50 bg-teal-50/40 dark:bg-teal-950/20 p-6 text-center">
          <Loader2 className="h-7 w-7 text-[#0da5aa] animate-spin mb-2" />
          <p className="font-inter text-xs font-semibold text-teal-900 dark:text-teal-200">
            {uploadStatus || "Processing Image..."}
          </p>
          <p className="mt-0.5 font-inter text-[11px] text-teal-600 dark:text-teal-400">
            Resizing (max 1600px), converting to WebP & compressing
          </p>
        </div>
      ) : value ? (
        <div className="relative flex items-center gap-3.5 rounded-xl border border-slate-200 dark:border-[#1b283d] bg-slate-50/70 dark:bg-[#080d17] p-3">
          <div
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-[#1b283d] ${aspectRatio} bg-white dark:bg-[#0e1624] shadow-2xs`}
          >
            <img
              src={value}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1579165466791-788226ab77b6?w=200&auto=format&fit=crop&q=80";
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-outfit text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                Image Selected
              </p>
              {finalSizeInfo && (
                <span className="inline-flex items-center gap-1 rounded bg-teal-100/70 dark:bg-teal-950/60 px-2 py-0.5 font-mono text-[10px] font-bold text-teal-800 dark:text-teal-300">
                  <CheckCircle2 className="h-3 w-3 text-[#0da5aa]" />
                  WebP • {finalSizeInfo}
                </span>
              )}
            </div>

            <p className="mt-0.5 font-inter text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {finalSizeInfo
                ? `Final optimized size: ${finalSizeInfo} (under 2 MB limit)`
                : value.startsWith("http")
                ? value
                : "Image ready"}
            </p>

            <div className="mt-2 flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-inter text-xs font-semibold text-[#0da5aa] hover:text-[#088395] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                Change Image
              </button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <button
                type="button"
                onClick={clearImage}
                className="font-inter text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <X className="h-3 w-3" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center cursor-pointer rounded-xl border-2 border-dashed p-4.5 sm:p-5 text-center transition-all ${
            dragActive
              ? "border-[#0da5aa] bg-teal-50/50 dark:bg-teal-950/20"
              : "border-slate-300 dark:border-[#1e2f47] bg-white dark:bg-[#080d17] hover:border-[#0da5aa]/70 hover:bg-slate-50/70 dark:hover:bg-[#0b121e]"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 dark:bg-[#152a36] text-[#0da5aa] mb-2">
            {dragActive ? (
              <UploadCloud className="h-5 w-5 text-[#0da5aa] animate-bounce" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
          </div>
          <p className="font-inter text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="text-[#0da5aa] hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="mt-0.5 font-inter text-[11px] text-slate-400 dark:text-slate-500">
            {helperText}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {(localError || error) && (
        <p className="mt-1.5 font-inter text-xs text-rose-500">
          {localError || error}
        </p>
      )}
    </div>
  );
}
