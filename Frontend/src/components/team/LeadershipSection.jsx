import { Mail } from "lucide-react";
import ScrollReveal from "../ScrollReveal.jsx";

function LeadershipCard({ leader, index }) {
  // Alternate layout: even index = image right, odd index = image left
  const isImageLeft = index % 2 !== 0;
  
  return (
    <ScrollReveal delay={index * 100} className="w-full max-w-full min-w-0">
      <article 
        className="group relative w-full max-w-full min-w-0 box-border overflow-hidden rounded-[20px] bg-white border border-slate-200 shadow-[0_20px_50px_-20px_rgba(10,35,66,0.18)] transition-all duration-300 min-h-auto lg:min-h-113"
      >
        <div className={`relative grid grid-cols-1 w-full max-w-full min-w-0 box-border gap-0 h-full ${isImageLeft ? 'lg:grid-cols-[40%_1fr]' : 'lg:grid-cols-[1fr_40%]'}`}>
          
          <div className={`flex flex-col justify-center w-full max-w-full min-w-0 box-border p-4.5 sm:p-6 bg-white ${isImageLeft ? 'lg:col-start-2 lg:order-2 lg:pl-16 lg:pr-8' : 'lg:col-start-1 lg:order-1 lg:pr-16 lg:pl-8'}`}>
            <div
              className="mb-2.5 inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 transition-colors"
              style={{ background: "var(--accent-soft)" }}
            >
              <div
                className="h-1.5 w-1.5 rounded-full transition-colors"
                style={{ background: "var(--accent)" }}
                aria-hidden="true"
              />
              <span
                className="text-[10px] font-bold uppercase tracking-wider transition-colors"
                style={{ color: "var(--accent-muted)" }}
              >
                {leader.department || "Leadership"}
              </span>
            </div>

            <h3
              className="font-['Inter'] font-extrabold text-[#0c2b48] wrap-anywhere"
              style={{
                fontSize: "clamp(1.4rem, 6vw, 2rem)",
                lineHeight: 1.2,
              }}
            >
              {leader.name}
            </h3>

            <p
              className="mt-1.5 mb-2.5 font-semibold transition-colors wrap-anywhere"
              style={{
                color: "var(--accent)",
                fontSize: "clamp(0.9rem, 3.8vw, 1.1rem)",
                lineHeight: 1.35,
              }}
            >
              {leader.role}
            </p>

            <p
              className="text-[#334155] max-w-full lg:max-w-[56ch] mb-4.5 wrap-anywhere"
              style={{
                fontSize: "clamp(0.9rem, 3.6vw, 1rem)",
                lineHeight: 1.6,
              }}
            >
              {leader.bio || leader.qualification}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 w-full">
              {leader.email && (
                <a
                  href={`mailto:${leader.email}`}
                  className="inline-flex min-h-11 flex-1 sm:flex-initial min-w-30 items-center justify-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1a1a1a] hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black touch-manipulation"
                  aria-label={`Email ${leader.name}`}
                >
                  <Mail className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                  <span>Email</span>
                </a>
              )}
              <a
                href={leader.linkedin || "https://linkedin.com/company/clingene"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 flex-1 sm:flex-initial min-w-30 items-center justify-center gap-2 rounded-full border-2 border-[#d4e5f2] bg-white px-5 py-2.5 text-sm font-semibold text-[#0c2b48] transition-all duration-300 hover:border-(--accent) hover:bg-(--accent) hover:text-white hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) touch-manipulation"
                aria-label={`View ${leader.name}'s LinkedIn profile`}
              >
                <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <div className={`relative w-full max-w-full min-w-0 ${isImageLeft ? 'lg:col-start-1 lg:order-1' : 'lg:col-start-2 lg:order-2'}`}>
            <div className="relative h-full w-full min-h-65 sm:min-h-85 lg:min-h-113 aspect-4/3 sm:aspect-8/5 lg:aspect-auto leadership-photo-wrapper overflow-hidden" data-position={isImageLeft ? 'left' : 'right'}>
              <img
                src={leader.image_url || leader.image}
                alt={leader.imageAlt || leader.name}
                width={leader.width || 879}
                height={leader.height || 1024}
                decoding="async"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700"
                style={{ 
                  objectPosition: leader.imagePosition || 'center 20%',
                }}
              />
            </div>
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}

export default function LeadershipSection({ leaders = [] }) {
  if (!leaders || leaders.length === 0) return null;

  return (
    <section 
      className="relative bg-white pt-14 pb-24 sm:pt-16 sm:pb-20 md:py-20 z-1"
      id="leadership"
      aria-labelledby="leadership-title"
    >
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,200,224,0.03),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative site-container">
        <div className="space-y-8 lg:space-y-10">
          {leaders.map((leader, index) => (
            <LeadershipCard key={leader.id || leader.email || leader.name || index} leader={leader} index={index} />
          ))}
        </div>
      </div>
      
      <style>{`
        /* Soft gradient fade on photo edges */
        .leadership-photo-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          pointer-events: none;
          z-index: 1;
        }
        
        .leadership-photo-wrapper[data-position="left"]::after {
          right: 0;
          background: linear-gradient(to right, rgba(10,35,66,0), rgba(10,35,66,0.10));
        }
        
        .leadership-photo-wrapper[data-position="right"]::after {
          left: 0;
          background: linear-gradient(to left, rgba(10,35,66,0), rgba(10,35,66,0.15));
        }
        
        /* Additional shadow on left side of CEO photo (right positioned) */
        .leadership-photo-wrapper[data-position="right"]::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 40px;
          background: linear-gradient(to right, rgba(0,0,0,0.25), transparent);
          pointer-events: none;
          z-index: 1;
        }
        
        @media (max-width: 1023px) {
          article {
            min-height: auto !important;
          }
          
          article > div {
            grid-template-columns: 100% !important;
          }
          
          article > div > div:first-child {
            order: 2 !important;
            padding: 1.125rem !important;
          }
          
          article > div > div:last-child {
            order: 1 !important;
          }
          
          article > div > div:last-child img {
            aspect-ratio: 16 / 10 !important;
            height: auto !important;
          }
          
          .leadership-photo-wrapper::after,
          .leadership-photo-wrapper::before {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
