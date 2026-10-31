import { useState, useEffect } from "react";
import { ArrowRight, Users } from "lucide-react";
import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import TeamHero from "../components/team/TeamHero.jsx";
import LeadershipSection from "../components/team/LeadershipSection.jsx";
import TeamCarousel from "../components/team/TeamCarousel.jsx";
import teamPhoto from "../assets/team.png";
import { useTheme } from "../context/ThemeContext.jsx";
import { supabase } from "../lib/supabase.js";

import amjadAli from "../assets/team/Amjad Ali.jpeg";
import safdarAli from "../assets/team/Safdar Ali.jpeg";
import abidAli from "../assets/team/Abid Ali.jpeg";
import samrana from "../assets/team/samrana.jpeg";
import kifayatUllah from "../assets/team/Kifayat ullah.jpeg";
import tahirUllah from "../assets/team/Tahir Ali.jpeg";
import mudassirAlvi from "../assets/team/Mudassir.jpeg";
import saadKhan from "../assets/team/Saad.jpeg";
import imadAli from "../assets/team/Imad Ali.jpeg";

const localImageMap = {
  "/assets/team/Amjad Ali.jpeg": amjadAli,
  "/assets/team/Safdar Ali.jpeg": safdarAli,
  "/assets/team/Abid Ali.jpeg": abidAli,
  "/assets/team/samrana.jpeg": samrana,
  "/assets/team/Kifayat ullah.jpeg": kifayatUllah,
  "/assets/team/Tahir Ali.jpeg": tahirUllah,
  "/assets/team/Mudassir.jpeg": mudassirAlvi,
  "/assets/team/Saad.jpeg": saadKhan,
  "/assets/team/Imad Ali.jpeg": imadAli,
};

export default function TeamPage() {
  const { theme } = useTheme();
  const isRed = theme === "red";
  const isGreen = theme === "green";
  const promisePhoto = teamPhoto;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchSupabaseTeam() {
      try {
        const { data, error } = await supabase
          .from("team")
          .select("name, role, department, qualification, email, bio, image_url")
          .eq("status", "published")
          .order("sort_order", { ascending: true });

        if (error) {
          if (import.meta.env.DEV) {
            console.error("[TeamPage] Error fetching team members:", error);
          }
          if (isMounted) {
            setMembers([]);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          if (data && data.length > 0) {
            const formatted = data.map((item) => {
              const img = localImageMap[item.image_url] || item.image_url || "";
              return {
                name: item.name || "",
                role: item.role || "",
                designation: item.role || "",
                department: item.department || "",
                qualification: item.qualification || "",
                description: item.qualification || item.bio || "",
                email: item.email || "",
                bio: item.bio || item.qualification || "",
                image: img,
                image_url: img,
              };
            });
            setMembers(formatted);
          } else {
            setMembers([]);
          }
          setLoading(false);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("[TeamPage] Failed to fetch team from Supabase:", err);
        }
        if (isMounted) {
          setMembers([]);
          setLoading(false);
        }
      }
    }

    fetchSupabaseTeam();

    return () => {
      isMounted = false;
    };
  }, []);

  const leaders = members.filter(
    (m) =>
      m.department?.toLowerCase() === "leadership" ||
      m.department?.toLowerCase() === "executive leadership" ||
      m.role?.toLowerCase().includes("ceo") ||
      m.role?.toLowerCase().includes("director")
  );

  const promiseOverlay = isRed
    ? "linear-gradient(90deg, rgba(45, 3, 6, 0.97) 0%, rgba(60, 6, 10, 0.88) 45%, rgba(90, 10, 16, 0.45) 100%)"
    : isGreen
      ? "linear-gradient(90deg, rgba(2, 30, 18, 0.97) 0%, rgba(4, 42, 24, 0.88) 45%, rgba(6, 60, 34, 0.45) 100%)"
      : "linear-gradient(90deg, rgba(3,20,43,0.95) 0%, rgba(4,32,64,0.84) 45%, rgba(6,52,96,0.45) 100%)";

  return (
    <>
      <TeamHero />

      {loading ? (
        <section className="py-20 bg-white" aria-label="Loading team members">
          <div className="site-container flex flex-col items-center justify-center min-h-[320px]">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200"
              style={{ borderTopColor: "var(--accent)" }}
              role="status"
              aria-label="Loading"
            />
            <p className="mt-4 text-sm text-slate-500 font-medium font-['Inter']">Loading team directory...</p>
          </div>
        </section>
      ) : members.length === 0 ? (
        <section className="py-20 bg-white" aria-label="No team members">
          <div className="site-container">
            <div className="mx-auto max-w-lg text-center rounded-2xl border border-slate-200 bg-slate-50/60 p-10 sm:p-12 shadow-xs">
              <div 
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
              >
                <Users className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0c2b48]">
                No Team Members Found
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-['Inter']">
                Our team directory is currently being updated. Please check back soon or get in touch with us directly.
              </p>
              <div className="mt-6">
                <Button href="/contact" className="px-6 py-2.5 text-sm">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* --- Leadership Section --- */}
          {leaders.length > 0 && <LeadershipSection leaders={leaders} />}

          {/* --- Team Carousel --- */}
          <TeamCarousel members={members} />
        </>
      )}

      {/* --- Our Promise Section with Fixed Background --- */}
      <section
        className="promise-section relative overflow-hidden min-h-80 lg:h-95 flex items-center"
        id="trust-care"
        aria-labelledby="trust-care-title"
        style={{
          clipPath: 'inset(0)',
          isolation: 'isolate'
        }}
      >
        {/* Fixed background photo - stays in place while page scrolls */}
        <div
          className="promise-bg-fixed"
          style={{
            content: '',
            position: 'fixed',
            inset: 0,
            top: '-120px',
            zIndex: -2,
            backgroundImage: `url(${promisePhoto})`,
            backgroundPosition: '50% 35%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            filter: isRed
              ? "hue-rotate(160deg) saturate(1.25) brightness(0.9)"
              : isGreen
                ? "hue-rotate(295deg) saturate(1.25) brightness(0.9)"
                : "none",
          }}
          aria-hidden="true"
        />
        
        {/* Dark gradient overlay */}
        <div 
          className="absolute inset-0 -z-1 transition-all duration-500"
          style={{
            background: promiseOverlay
          }}
          aria-hidden="true"
        />
        
        {/* Theme glow bottom-right */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full blur-[120px] -z-1 transition-colors"
          style={{ backgroundColor: "var(--accent)", opacity: 0.15 }}
        />

        {/* Content - using same container as hero section */}
        <div className="relative w-full">
          <div className="site-container py-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              {/* Text Content */}
              <div className="text-white">
                <ScrollReveal>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="h-0.5 w-12 transition-colors"
                      style={{ backgroundColor: "var(--accent)" }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
                      style={{ color: "var(--accent)" }}
                    >
                      OUR PROMISE
                    </span>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <h2 
                    id="trust-care-title"
                    className="font-serif text-[30px] font-bold leading-tight sm:text-[38px] lg:text-[44px]"
                  >
                    <span className="text-white">Precision You Can Trust.</span>
                    <br />
                    <span
                      style={{
                        color: isRed ? "#ef4444" : "var(--accent)",
                        transition: "color 0.4s ease-in-out",
                      }}
                    >
                      Care You Can Feel.
                    </span>
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <p className="mt-5 text-[16px] leading-relaxed text-slate-200 max-w-xl">
                    Every report is reviewed by experts, so you get answers you can act on.
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={300}>
                  <Button
                    className="mt-7 min-h-9 sm:min-h-12! px-4 sm:px-7! font-['Noto_Sans'] text-xs sm:text-[15px]!"
                    href="/contact"
                  >
                    Join Our Team <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>

        {/* Respect reduced motion preference */}
        <style>{`
          @media (prefers-reduced-motion: reduce) {
            .promise-bg-fixed {
              position: absolute !important;
            }
          }
        `}</style>
      </section>

      {/* White spacer before footer */}
      <div className="bg-white h-20" aria-hidden="true" />
    </>
  );
}
