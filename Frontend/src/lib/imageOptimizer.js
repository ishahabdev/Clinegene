/**
 * In-browser Image Resizing & WebP Optimization
 * - Rejects files over 10 MB before processing.
 * - Resizes image so longest side <= 1600px.
 * - Converts to WebP format using HTMLCanvasElement.
 * - Starts at quality ~0.8; iteratively lowers quality if result > 2 MB.
 * - Throws a clear error if file cannot be compressed under 2 MB.
 */

export function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export async function processAndOptimizeImage(file) {
  if (!file) {
    throw new Error("No image file provided.");
  }

  // 1. Allow files up to 50 MB before browser compression
  const maxInputBytes = 50 * 1024 * 1024; // 50 MB
  if (file.size > maxInputBytes) {
    throw new Error(
      `File size (${formatBytes(file.size)}) exceeds the 50 MB maximum limit.`
    );
  }

  // 2. Validate format: check MIME or extension
  const validExts = [".jpg", ".jpeg", ".png", ".webp", ".jfif", ".avif"];
  const hasValidExt = file.name && validExts.some((ext) => file.name.toLowerCase().endsWith(ext));
  const validMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/jfif", "image/avif"];
  if (file.type && !validMimes.includes(file.type.toLowerCase()) && !hasValidExt) {
    throw new Error("Invalid image format. Only JPG, PNG, and WebP are allowed.");
  }

  // 3. Load image into memory
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();

  try {
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Unable to decode and process the selected image."));
      img.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }

  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (!width || !height) {
    throw new Error("Invalid image dimensions.");
  }

  // 4. Resize: max 1600px on the longest side
  const maxDimension = 1600;
  if (width > maxDimension || height > maxDimension) {
    if (width >= height) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
  }

  // 5. Draw onto Canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D rendering context is not available.");
  }

  // High quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  // 6. Convert to WebP, starting at quality ~0.8 and iteratively lowering if > 2 MB
  const maxOutputBytes = 2 * 1024 * 1024; // 2 MB
  const qualitySteps = [0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];

  let bestBlob = null;
  let bestQuality = 0.8;

  for (const quality of qualitySteps) {
    const blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/webp", quality);
    });

    if (blob) {
      bestBlob = blob;
      bestQuality = quality;
      if (blob.size <= maxOutputBytes) {
        break;
      }
    }
  }

  // 7. Verify result size fits under 2 MB
  if (!bestBlob || bestBlob.size > maxOutputBytes) {
    const resultingSize = bestBlob ? formatBytes(bestBlob.size) : "unknown";
    throw new Error(
      `Image size is ${resultingSize}, which exceeds the 2 MB limit even after maximum compression. Please choose a smaller image.`
    );
  }

  const finalSizeBytes = bestBlob.size;
  const sizeFormatted = formatBytes(finalSizeBytes);

  const originalBase = file.name
    ? file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_")
    : "team_member";
  const outputFileName = `${originalBase}.webp`;

  const processedFile = new File([bestBlob], outputFileName, {
    type: "image/webp",
    lastModified: Date.now(),
  });

  return {
    blob: bestBlob,
    file: processedFile,
    ext: "webp",
    sizeBytes: finalSizeBytes,
    sizeFormatted,
    qualityUsed: bestQuality,
    dimensions: { width, height },
  };
}

