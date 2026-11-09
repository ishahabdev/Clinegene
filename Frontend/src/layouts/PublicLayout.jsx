import React, { memo } from "react";
import HeaderNav from "../components/HeaderNav.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";
import SectionScrollEffects from "../components/SectionScrollEffects.jsx";

const MemoHeaderNav = memo(HeaderNav);
const MemoSiteFooter = memo(SiteFooter);

/**
 * PublicLayout:
 * Contains the public header, main content wrapper, site footer,
 * and public floating action buttons (theme switcher, WhatsApp, scroll-to-top).
 * Excluded completely on all admin routes.
 */
function PublicLayout({
  children,
  activePage = "Home",
  pageId = "home",
  showPreloader = false,
  showBackToTop = false,
  onScrollToTop,
  LoadingScreenComponent = null,
}) {
  // If this is an admin route, NEVER render public Header, Footer, Theme Switcher, or WhatsApp
  const isCurrentAdmin =
    pageId === "admin" ||
    (typeof window !== "undefined" &&
      (window.location.pathname.toLowerCase().includes("opclin-23410") ||
        window.location.pathname.toLowerCase().includes("admin") ||
        window.location.hash.toLowerCase().includes("opclin-23410") ||
        window.location.hash.toLowerCase().includes("admin")));

  if (isCurrentAdmin) {
    return <main id="admin-root">{children}</main>;
  }

  const isNotFound = pageId === "not-found";

  return (
    <>
      {showPreloader && !isNotFound && LoadingScreenComponent && (
        <LoadingScreenComponent />
      )}

      {!isNotFound && <MemoHeaderNav activePage={activePage} />}

      <main id="main-content">
        <SectionScrollEffects key={pageId} />
        {children}
      </main>

      {!isNotFound && (
        <>
          <MemoSiteFooter
            compact={pageId === "ceo-message"}
            showJoinCta={pageId === "home"}
          />

          {/* Floating Theme Switcher on bottom-left */}
          <div
            className="fixed bottom-3.5 left-3.5 sm:bottom-6 sm:left-6 z-50 pointer-events-none"
            aria-label="Theme switcher"
          >
            <div className="pointer-events-auto">
              <ThemeSwitcher placement="bottom-left" />
            </div>
          </div>

          {/* Floating Action Buttons (WhatsApp & Back to top) on bottom-right */}
          <div
            className="fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-2.5 sm:gap-3 pointer-events-none"
            aria-label="Quick actions"
          >
            <a
              href="https://wa.me/923485607051"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with ClinGene on WhatsApp"
              title="Chat with us on WhatsApp"
              className="group pointer-events-auto grid h-11.5 w-11.5 sm:h-12 sm:w-12 place-items-center rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: "#25D366",
                border: "2px solid #ffffff",
                boxShadow: "0 0 0 3px rgba(37, 211, 102, 0.35), 0 4px 18px rgba(37, 211, 102, 0.5)",
              }}
            >
              <svg aria-hidden="true" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.9C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8.01 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 13.99C16.32 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.12 10.45C10.25 10.31 10.29 10.2 10.37 10.05C10.45 9.9 10.41 9.76 10.35 9.64C10.3 9.5 9.8 8.32 9.6 7.82C9.4 7.34 9.2 7.4 9.05 7.39C8.91 7.38 8.74 7.33 8.53 7.33Z" />
              </svg>
            </a>

            <button
              type="button"
              aria-label="Scroll to top"
              tabIndex={showBackToTop ? 0 : -1}
              onClick={onScrollToTop}
              className="group pointer-events-auto grid h-11.5 w-11.5 sm:h-12 sm:w-12 place-items-center rounded-full text-white cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                pointerEvents: showBackToTop ? "auto" : "none",
                backgroundColor: "var(--accent-btn-bg, var(--accent))",
                color: "#ffffff",
                border: "2px solid #ffffff",
                boxShadow: "0 0 0 3px var(--accent-glow), 0 4px 18px var(--accent-glow)",
                opacity: showBackToTop ? 1 : 0,
                transform: showBackToTop ? "translateY(0)" : "translateY(10px)",
                transition:
                  "opacity 0.3s ease, transform 0.3s ease, background-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease",
              }}
            >
              <svg aria-hidden="true" width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 19V5m-7 7 7-7 7 7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default memo(PublicLayout);
