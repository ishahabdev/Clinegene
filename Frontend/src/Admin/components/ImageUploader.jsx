import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Link as LinkIcon, Upload } from "lucide-react";

export default function ImageUploader({
  value,
  onChange,
  label = "Upload Photo",
  aspectRatio = "aspect-square",
  maxSizeMB = 5,
  helperText = "PNG, JPG, or WebP up to 5MB",
  required = false,
  error,
  allowUrlFallback = true,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    setLocalError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLocalError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size must be under ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
    };
    reader.readAsDataURL(file);
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
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label className="block font-inter text-xs font-semibold text-slate-700">
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        {allowUrlFallback && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-slate-400 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
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
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste image URL..."
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-[#009688] focus:outline-hidden"
          />
        </div>
      )}

      {value ? (
        <div className="relative flex items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 ${aspectRatio} bg-white shadow-2xs`}
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
            <p className="font-outfit text-xs font-bold text-slate-800 truncate">
              Image Selected
            </p>
            <p className="mt-0.5 font-inter text-[11px] text-slate-500 truncate">
              Preview loaded successfully
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-inter text-xs font-semibold text-[#009688] hover:text-[#00796b] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                Change Image
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={clearImage}
                className="font-inter text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
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
              ? "border-[#009688] bg-teal-50/50"
              : "border-slate-300 bg-white hover:border-[#009688]/70 hover:bg-slate-50/70"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#009688] mb-2">
            {dragActive ? (
              <UploadCloud className="h-5 w-5 text-[#009688] animate-bounce" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
          </div>
          <p className="font-inter text-xs font-semibold text-slate-700">
            <span className="text-[#009688] hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="mt-0.5 font-inter text-[11px] text-slate-400">
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
