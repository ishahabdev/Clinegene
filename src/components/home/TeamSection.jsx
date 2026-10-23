import { UserRound } from "lucide-react";
import SectionHeading from "../SectionHeading";
import ScrollReveal from "../ScrollReveal.jsx";
export default function TeamSection() {
    return (
<section
    aria-labelledby="team-title"
    className="relative isolate overflow-hidden bg-[#eaf6fa] py-16 md:py-24"
    id="team"
  >
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_15%,rgba(255,255,255,0.9),transparent_55%)]" />
    <div className="mx-auto max-w-310 px-6 lg:px-12">
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
            name: "Dr. Amjad Ali Tanoli Ph.D",
            designation: "CEO",
            details: ["Human Geneticist", "Consultant Genetic Counselor"],
          },
          {
            name: "Dr. Safdar Ali Tanoli Ph.D",
            designation: "POSTDOC",
            details: ["Co-CEO", "Medical Physicist", "Princess Margaret Cancer Research Centre, Toronto, Canada"],
          },
          {
            name: "Dr. Kifayat Ullah Ph.D",
            designation: "HUMAN GENETICS",
            details: [],
          },
        ].map(({ name, designation, details, image }, index) => (
          <ScrollReveal
            as="article"
            className="flex min-h-57 items-center gap-4 rounded-2xl border border-[#d4e5f2] bg-white/85 p-4 shadow-[0_8px_24px_rgba(29,78,116,0.06)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#10c8e0] hover:bg-white hover:shadow-[0_14px_30px_rgba(12,43,72,0.12)] motion-reduce:transform-none motion-reduce:transition-none sm:gap-5"
            delay={index * 70}
            key={name}
          >
            <div className="relative h-48 w-[38%] max-w-38 shrink-0 overflow-hidden rounded-xl bg-[#dceaf2]">
              {image ? (
                <img
                  alt={name}
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
                <p className="mt-2 rounded-md bg-[#e5f8fb] px-2 py-1 text-[10px] font-bold uppercase leading-tight tracking-[0.04em] text-[#0a7a94]">
                  {designation}
                </p>
              )}
              <div className="mt-2 space-y-0.5 text-[12px] leading-[1.45] text-[#4a6e8b] sm:text-[13px]">
                {details.map((detail) => <p key={detail}>{detail}</p>)}
              </div>
              <a
                aria-label={`View ${name}`}
                className="mt-auto grid h-10 w-10 place-items-center rounded-full border border-[#bdebf2] text-[#0a7a94] transition-all duration-500 hover:border-[#10c8e0] hover:bg-[#10c8e0] hover:text-[#0c2b48] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#0c2b48]"
                href="/team"
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
