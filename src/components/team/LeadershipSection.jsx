import { Mail } from "lucide-react";
import ScrollReveal from "../ScrollReveal.jsx";
import { executiveTeam } from "../../data/teamConfig.js";

function LeadershipCard({ leader, index }) {
  // Alternate layout: even index = image right, odd index = image left
  const isImageLeft = index % 2 !== 0;
  
  return (
    <ScrollReveal delay={index * 100}>
      <article 
        className="group relative overflow-hidden rounded-[20px] bg-white border border-slate-200 shadow-[0_20px_50px_-20px_rgba(10,35,66,0.18)] transition-all duration-300"
        style={{ minHeight: '452px' }}
      >
        <div className={`relative grid gap-0 h-full ${isImageLeft ? 'lg:grid-cols-[40%_1fr]' : 'lg:grid-cols-[1fr_40%]'}`}>
          
          <div className={`flex flex-col justify-center px-6 py-6 bg-white ${isImageLeft ? 'lg:col-start-2 lg:order-2 lg:pl-16 lg:pr-8' : 'lg:col-start-1 lg:order-1 lg:pr-16 lg:pl-8'}`}>
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
                Leadership
              </span>
            </div>

            <h3 className="font-['Inter'] text-[28px] font-extrabold leading-tight text-[#0c2b48]">
              {leader.name}
            </h3>

            <p
              className="mt-1.5 mb-2.5 text-[16px] font-semibold transition-colors"
              style={{ color: "var(--accent)" }}
            >
              {leader.role}
            </p>

            <p className="text-[16px] leading-[1.7] text-[#334155] max-w-[56ch] mb-4">
              {leader.bio}
            </p>

            <div className="flex flex-wrap gap-2.5">
              <a
                href={`mailto:${leader.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-black px-4.5 py-2.75 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[#1a1a1a] hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                aria-label={`Email ${leader.name}`}
              >
                <Mail className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                Email
              </a>
              <a
                href={leader.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#d4e5f2] bg-white px-4.5 py-2.75 text-[14px] font-semibold text-[#0c2b48] transition-all duration-300 hover:border-(--accent) hover:bg-(--accent) hover:text-white hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                aria-label={`View ${leader.name}'s LinkedIn profile`}
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          <div className={`relative ${isImageLeft ? 'lg:col-start-1 lg:order-1' : 'lg:col-start-2 lg:order-2'}`}>
            <div className="relative h-full w-full leadership-photo-wrapper" data-position={isImageLeft ? 'left' : 'right'}>
              <img
                src={leader.image}
                alt={leader.imageAlt}
                width="340"
                height="452"
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

export default function LeadershipSection() {
  return (
    <section 
      className="relative bg-white py-16 md:py-20 z-1"
      id="leadership"
      aria-labelledby="leadership-title"
    >
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,200,224,0.03),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative site-container">
        <div className="space-y-8 lg:space-y-10">
          {executiveTeam.map((leader, index) => (
            <LeadershipCard key={leader.id} leader={leader} index={index} />
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
        
        @media (max-width: 899px) {
          article {
            min-height: auto !important;
          }
          
          article > div {
            grid-template-columns: 1fr !important;
          }
          
          article > div > div:first-child {
            order: 2 !important;
            padding: 1.5rem !important;
          }
          
          article > div > div:last-child {
            order: 1 !important;
          }
          
          article > div > div:last-child img {
            aspect-ratio: 4 / 3 !important;
            height: auto !important;
          }
          
          .leadership-photo-wrapper::after,
          .leadership-photo-wrapper::before {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
