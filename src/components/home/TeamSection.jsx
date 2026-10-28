import { UserRound } from "lucide-react";
import SectionHeading from "../SectionHeading";
import ScrollReveal from "../ScrollReveal.jsx";
import amjadAli from "../../assets/team/Amjad Ali.jpeg";
import safdarAli from "../../assets/team/Safdar Ali.jpeg";
import kifayatUllah from "../../assets/team/Kifayat ullah.jpeg";

export default function TeamSection() {
    return (
<section
    aria-labelledby="team-title"
    className="relative isolate overflow-hidden bg-[#eaf6fa] py-16 md:py-24"
    id="team"
  >
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_15%,rgba(255,255,255,0.9),transparent_55%)]" />
    <div className="site-container">
      <SectionHeading
        action={{ label: "View Team", href: "/team" }}
        description="Scientists, clinicians and bioinformaticians turning genomic research into healthier futures."
        descriptionClassName="text-slate-600"
        eyebrow="Our Team"
        id="team-title"
        highlight="Scientific Team"
        title="Meet our"
      />

      <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4" id="team-members">
        {[
          {
            name: "Dr. Amjad Ali Tanoli, Ph.D",
            designation: "CEO / Director",
            details: ["Human Geneticist, Consultant Genetic Counselor"],
            image: amjadAli,
          },
          {
            name: "Dr. Safdar Ali, Ph.D, Postdoc",
            designation: "Managing Director",
            details: ["Princess Margaret Cancer Research Centre, Toronto, Canada; Medical Physicist"],
            image: safdarAli,
          },
          {
            name: "Dr. Kifayat Ullah, Ph.D",
            designation: "Molecular Biologist, Human Geneticist",
            details: ["Quaid-i-Azam University, Islamabad; Yale School of Medicine, USA"],
            image: kifayatUllah,
          },
        ].map(({ name, designation, details, image }, index) => (
          <ScrollReveal
            as="article"
            className="flex min-h-57 items-center gap-4  border border-[#d4e5f2] bg-white/85 p-4 shadow-[0_8px_24px_rgba(29,78,116,0.06)] transition-all duration-100  hover:-translate-y-1 hover:border-3 hover:border-b-(--accent)  hover:bg-white hover:shadow-[0_14px_30px_rgba(12,43,72,0.12)] motion-reduce:transform-none motion-reduce:transition-none sm:gap-5"
            delay={index * 70}
            key={name}
          >
            <div className="relative h-48 w-[38%] max-w-38 shrink-0 overflow-hidden rounded-xl bg-[#dceaf2]">
              {image ? (
                <img
                  alt={name}
                  width="480"
                  height="600"
                  className="h-full w-full object-cover object-[center_20%]"
                  loading="lazy"
                  src={image}
                />
              ) : (
                <div aria-label={`Portrait placeholder for ${name}`} className="flex h-full w-full items-center justify-center bg-linear-to-b from-[#dceaf2] to-[#c9dce8]" role="img">
                  <UserRound aria-hidden="true" className="h-20 w-20 text-[#496680]" strokeWidth={1.2} />
                </div>
              )}
            </div>
            
            <div className="flex min-w-0 flex-1 flex-col items-start self-stretch py-2">
              <h3 className="text-[15px] font-bold leading-[1.35] text-[#0c2b48] sm:text-base">
                {name}
              </h3>
              {designation && (
                <p className="mt-2 rounded-md bg-(--accent-soft) px-2 py-1 text-[10px] font-bold uppercase leading-tight tracking-[0.04em]"
                  style={{ color: "var(--accent-muted)", transition: "background 0.4s ease-in-out, color 0.4s ease-in-out" }}
                >
                  {designation}
                </p>
              )}
              <div className="mt-2 space-y-0.5 text-[12px] leading-[1.45] text-[#4a6e8b] sm:text-[13px]">
                {details.map((detail) => <p key={detail}>{detail}</p>)}
              </div>
              <a
                aria-label={`View ${name}`}
                className="mt-auto grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full border transition-all duration-500 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48] touch-manipulation"
                href="/team"
                style={{
                  borderColor: "color-mix(in srgb, var(--accent) 60%, transparent)",
                  color: "var(--accent-muted)",
                  transition: "border-color 0.4s ease, background 0.4s ease, color 0.4s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "#0c2b48";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "";
                  e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 60%, transparent)";
                  e.currentTarget.style.color = "var(--accent-muted)";
                }}
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                </svg>
              </a>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
    );
}
