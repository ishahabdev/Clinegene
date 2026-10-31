import { useState, useEffect, useMemo } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  Layers,
  ArrowRight,
  Folder,
  ArrowLeft,
  Images,
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal.jsx";
import serviceHero from "../assets/service-hero.webp";
import { useTheme } from "../context/ThemeContext.jsx";
import { fetchPublishedGallery } from "../lib/galleryClient.js";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default function GalleryPage() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await fetchPublishedGallery();
        if (isMounted) {
          setPhotos(data || []);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("[GalleryPage] Failed to fetch gallery photos:", err);
        }
        if (isMounted) {
          setPhotos([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const sectionBg = isRed ? "#2d0306" : isGreen ? "#021e12" : "#02132a";

  const overlayGradient = isRed
    ? "linear-gradient(105deg, rgba(45, 3, 6, 0.97) 0%, rgba(45, 3, 6, 0.84) 48%, rgba(45, 3, 6, 0.30) 80%, rgba(45, 3, 6, 0.15) 100%)"
    : isGreen
      ? "linear-gradient(105deg, rgba(2, 30, 18, 0.97) 0%, rgba(2, 30, 18, 0.84) 48%, rgba(2, 30, 18, 0.30) 80%, rgba(2, 30, 18, 0.15) 100%)"
      : "linear-gradient(105deg, rgba(2, 19, 42, 0.97) 0%, rgba(2, 19, 42, 0.84) 48%, rgba(2, 19, 42, 0.30) 80%, rgba(2, 19, 42, 0.15) 100%)";

  const accent =
    theme === "red"
      ? { primary: "#ef4444", softBg: "rgba(229,62,62,.08)", border: "rgba(229,62,62,.25)" }
      : theme === "green"
        ? { primary: "#10b981", softBg: "rgba(56,161,105,.08)", border: "rgba(56,161,105,.25)" }
        : { primary: "#00bcd4", softBg: "rgba(0,188,212,.08)", border: "rgba(0,188,212,.25)" };

  // Group photos by Folder / Event (category)
  const folders = useMemo(() => {
    const map = {};
    photos.forEach((p) => {
      const folderName = p.category || p.folder || "General";
      if (!map[folderName]) {
        map[folderName] = {
          name: folderName,
          photos: [],
          cover: p.src || p.image_url || "",
          date: p.date || p.event_date || "",
        };
      }
      map[folderName].photos.push(p);
      if (!map[folderName].cover && (p.src || p.image_url)) {
        map[folderName].cover = p.src || p.image_url;
      }
    });
    return Object.values(map);
  }, [photos]);

  // Photos of the active folder
  const currentFolderPhotos = useMemo(() => {
    if (!selectedFolder) return [];
    return photos.filter(
      (p) => (p.category || p.folder || "General") === selectedFolder
    );
  }, [photos, selectedFolder]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : currentFolderPhotos.length - 1));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev < currentFolderPhotos.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, currentFolderPhotos]);

  const activeLightboxPhoto =
    lightboxIndex !== null ? currentFolderPhotos[lightboxIndex] : null;

  return (
    <>
      {/* ══════════════════════════  HERO  ══════════════════════════ */}
      <section
        aria-labelledby="gallery-hero-title"
        className="relative isolate flex min-h-75 items-center overflow-hidden text-white sm:min-h-80 transition-colors duration-500"
        id="gallery-hero"
        style={{ backgroundColor: sectionBg }}
      >
        <img
          alt=""
          aria-hidden="true"
          width="1376"
          height="768"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[64%_center] transition-all duration-500"
          src={serviceHero}
          style={{
            filter: isRed
              ? "hue-rotate(160deg) saturate(1.25) brightness(0.9)"
              : isGreen
                ? "hue-rotate(295deg) saturate(1.25) brightness(0.9)"
                : "none",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 transition-all duration-500"
          style={{ background: overlayGradient }}
        />
        <div className="site-container py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-3 font-inter text-sm">
            <a className="text-(--accent) transition-colors hover:text-white" href="/">
              Home
            </a>
            <span aria-hidden="true" className="text-(--accent)">
              ›
            </span>
            {selectedFolder ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFolder(null);
                    setLightboxIndex(null);
                  }}
                  className="text-(--accent) hover:text-white transition-colors cursor-pointer"
                >
                  Gallery Folders
                </button>
                <span aria-hidden="true" className="text-(--accent)">
                  ›
                </span>
                <span aria-current="page" className="text-slate-300">
                  {selectedFolder}
                </span>
              </>
            ) : (
              <span aria-current="page" className="text-slate-300">
                Media Gallery
              </span>
            )}
          </nav>

          <div className="max-w-155">
            <p className="mb-4 flex items-center gap-3 font-inter text-[11px] font-bold uppercase tracking-[0.24em] text-(--accent)">
              <span aria-hidden="true" className="h-0.5 w-9 bg-(--accent)" />
              {selectedFolder ? "Event Album" : "Photo Folders & Events"}
            </p>
            <ScrollReveal
              as="h1"
              className="font-outfit text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[40px]"
              id="gallery-hero-title"
            >
              {selectedFolder ? (
                <span>{selectedFolder}</span>
              ) : (
                <>
                  Events & Facility{" "}
                  <span className="text-(--accent)">Gallery</span>
                </>
              )}
            </ScrollReveal>
            <p className="mt-3 max-w-122.5 font-inter text-[13px] leading-[1.55] text-slate-200 sm:text-sm">
              {selectedFolder
                ? `Browsing ${currentFolderPhotos.length} photo${currentFolderPhotos.length !== 1 ? "s" : ""} from this event album.`
                : "Browse our event albums, scientific conferences, and genomics facility photos organized by folder."}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════  GALLERY CONTENT  ══════════════════════════ */}
      <section className="bg-[#f8fafc] py-14 sm:py-20 min-h-[500px]">
        <div className="site-container">
          {/* Loading Skeletons */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-slate-200/70 animate-pulse" />
              ))}
            </div>
          ) : photos.length === 0 ? (
            /* Empty State when no photos in Supabase */
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs max-w-md mx-auto my-6">
              <Images className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-outfit text-base font-bold text-slate-800">
                No Gallery Folders Available
              </h3>
              <p className="font-inter text-xs text-slate-500 mt-1.5 leading-relaxed">
                Photos uploaded from the admin portal will appear here organized by event folders.
              </p>
            </div>
          ) : selectedFolder ? (
            /* ═════════════════ INSIDE A SELECTED EVENT FOLDER ═════════════════ */
            <div>
              {/* Back to Folders Button & Info Bar */}
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFolder(null);
                    setLightboxIndex(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-[#00bcd4] transition-all cursor-pointer group"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back to all folders</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-inter text-xs font-semibold bg-slate-100 text-slate-700">
                    <Images className="h-3.5 w-3.5 text-slate-400" />
                    <span>{currentFolderPhotos.length} Photos</span>
                  </span>
                </div>
              </div>

              {/* Photos Grid of this Event */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentFolderPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxIndex(index)}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                      <img
                        src={photo.src || photo.image_url}
                        alt={photo.image_alt || photo.title}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105">
                        <Maximize2 className="h-4 w-4" />
                      </span>
                    </div>

                    {/* Card Info */}
                    <div className="p-4">
                      <h3
                        className="font-outfit text-sm font-bold text-[#0c2b48] group-hover:text-(--accent) transition-colors line-clamp-1"
                        title={photo.title}
                      >
                        {photo.title}
                      </h3>
                      {photo.caption && (
                        <p className="mt-1 text-xs text-[#4a6e8b] line-clamp-2 leading-relaxed">
                          {photo.caption}
                        </p>
                      )}
                      {photo.date && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400 font-inter">
                          <Calendar className="h-3 w-3" />
                          <span>{photo.date}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ═════════════════ FOLDERS / EVENTS VIEW ═════════════════ */
            <div>
              <div className="text-center max-w-xl mx-auto mb-10">
                <span
                  className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-inter text-xs font-semibold uppercase tracking-widest"
                  style={{
                    backgroundColor: accent.softBg,
                    color: accent.primary,
                    border: `1px solid ${accent.border}`,
                  }}
                >
                  <Folder className="h-3.5 w-3.5" />
                  Event Albums ({folders.length})
                </span>
                <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#0c2b48]">
                  Select an Event Folder
                </h2>
                <p className="mt-2 font-inter text-xs sm:text-sm text-[#4a6e8b]">
                  Click any folder to view all photos from that event.
                </p>
              </div>

              {/* Folders Cards Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {folders.map((fld) => (
                  <div
                    key={fld.name}
                    onClick={() => {
                      setSelectedFolder(fld.name);
                      setLightboxIndex(null);
                    }}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Folder Cover Image */}
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                      {fld.cover ? (
                        <img
                          src={fld.cover}
                          alt={fld.name}
                          className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-300">
                          <Folder className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                      {/* Photo count badge */}
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-white">
                        <Images className="h-3 w-3" />
                        <span>
                          {fld.photos.length} Photo{fld.photos.length !== 1 ? "s" : ""}
                        </span>
                      </span>
                    </div>

                    {/* Folder Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                          <Folder className="h-4 w-4 text-[#00bcd4]" />
                          <span>Event Album</span>
                        </div>
                        <h3 className="font-outfit text-base sm:text-lg font-bold text-[#0c2b48] group-hover:text-(--accent) transition-colors">
                          {fld.name}
                        </h3>
                        {fld.date && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                            <Calendar className="h-3 w-3" />
                            <span>{fld.date}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0c2b48] group-hover:text-(--accent) transition-colors">
                        <span>View all photos</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════  FULLSCREEN LIGHTBOX  ══════════════════════════ */}
      {activeLightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col max-h-[92vh] max-w-5xl w-full rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shadow-2xl text-white"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-slate-950/70">
              <div className="min-w-0 pr-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-(--accent)">
                  {activeLightboxPhoto.category || selectedFolder || "ClinGene Gallery"}
                </span>
                <h3 className="font-outfit text-sm sm:text-base font-bold truncate">
                  {activeLightboxPhoto.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Image Viewer */}
            <div className="relative flex-1 flex items-center justify-center bg-black/60 min-h-[300px] sm:min-h-[480px] max-h-[68vh] overflow-hidden p-2">
              <img
                src={activeLightboxPhoto.src || activeLightboxPhoto.image_url}
                alt={activeLightboxPhoto.image_alt || activeLightboxPhoto.title}
                className="max-h-full max-w-full object-contain select-none"
              />

              {/* Prev / Next Navigation */}
              {currentFolderPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => (prev > 0 ? prev - 1 : currentFolderPhotos.length - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => (prev < currentFolderPhotos.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Caption & Date */}
            {(activeLightboxPhoto.caption || activeLightboxPhoto.date) && (
              <div className="px-5 py-3 border-t border-white/10 bg-slate-950/70 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-2xl text-slate-300 leading-relaxed">
                  {activeLightboxPhoto.caption}
                </p>
                {activeLightboxPhoto.date && (
                  <span className="text-[11px] text-slate-400 font-inter">
                    Event Date: {activeLightboxPhoto.date}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════  FOOTER LINKS  ══════════════════════════ */}
      <section
        aria-label="Related pages"
        className="pb-6 pt-4 md:pb-8 md:pt-6 border-t border-(--accent)/20"
        style={{ backgroundImage: sectionBg }}
      >
        <div className="site-container">
          <ScrollReveal className="flex flex-wrap justify-center gap-4 text-sm">
            <a
              className="text-[#9fb6ce] underline-offset-2 hover:text-(--accent) hover:underline focus-visible:text-(--accent) focus-visible:underline focus-visible:outline-none"
              href="/services"
            >
              Our Services
            </a>
            <span aria-hidden="true" className="text-[#4a6e8b]">
              |
            </span>
            <a
              className="text-[#9fb6ce] underline-offset-2 hover:text-(--accent) hover:underline focus-visible:text-(--accent) focus-visible:underline focus-visible:outline-none"
              href="/team"
            >
              Meet Our Team
            </a>
            <span aria-hidden="true" className="text-[#4a6e8b]">
              |
            </span>
            <a
              className="text-[#9fb6ce] underline-offset-2 hover:text-(--accent) hover:underline focus-visible:text-(--accent) focus-visible:underline focus-visible:outline-none"
              href="/contact"
            >
              Contact ClinGene
            </a>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
