import { BarChart3, Dna, Droplet, Lightbulb } from "lucide-react";
import SectionHeading from "../SectionHeading";
import ScrollReveal from "../ScrollReveal.jsx";
export default function WorkStepsSection() {
    return (
<section
    aria-labelledby="journey-title"
    className="overflow-x-clip bg-white py-16 md:py-24"
    id="scientific-journey"
  >
    <div className="mx-auto max-w-310 px-6 lg:px-12">
      <SectionHeading
        description="We turn your biological data into meaningful insights — quickly, accurately and with expert care."
        eyebrow="Work Steps"
        id="journey-title"
        highlight="Four simple steps"
        title="From sample to discovery in"
      />

      <div className="relative mt-7 grid gap-x-5 gap-y-5 sm:mt-9 md:grid-cols-2 xl:grid-cols-4 xl:gap-x-0">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden border-t-2 border-dashed border-[#cbd0d4] xl:block"
        />
        {[
          {
            Icon: Droplet,
            title: "Sample Collection",
            description: "Blood or DNA samples collected safely and efficiently",
          },
          {
            Icon: Dna,
            title: "Sequencing & Genomic Data",
            description: "Advanced sequencing generates high-quality genomic data",
          },
          {
            Icon: BarChart3,
            title: "Bioinformatics Analysis",
            description: "Computational pipelines process and analyze genomic data",
          },
          {
            Icon: Lightbulb,
            title: "Interpretation & Discovery",
            description: "Expert interpretation turns results into meaningful scientific and clinical insights",
          },
        ].map(({ Icon, title, description }, index) => (
          <ScrollReveal
            as="div"
            className="group relative xl:px-2"
            delay={index * 55}
            key={title}
          >
            <div className="mb-5 flex justify-center">
              <div
                aria-label={`Step ${index + 1}`}
                className="relative z-10 grid h-16 w-18.5 place-items-center bg-[#f0f0ed] text-[22px] font-black text-[#102744] shadow-[0_6px_14px_rgba(15,23,42,0.07)] transition-colors duration-1000 ease-in-out group-hover:bg-[#10c8e0] group-focus-within:bg-[#10c8e0] motion-reduce:transition-none"
                role="img"
                style={{ clipPath: "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>
            <article className="flex h-full flex-col rounded-2xl border border-[#d4e5f2] bg-white px-5 py-4.25 shadow-[0_8px_24px_rgba(29,78,116,0.08)] transition-all duration-700 ease-out hover:-translate-y-1 hover:border-[#10c8e0] hover:bg-[#f7fbff] hover:shadow-[0_14px_30px_rgba(12,43,72,0.14)] focus-within:border-[#10c8e0] focus-within:bg-[#f7fbff] focus-within:shadow-[0_14px_30px_rgba(12,43,72,0.14)] motion-reduce:transform-none motion-reduce:transition-none">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#eaf6fa] text-[#0a7a94] transition-colors duration-700 group-hover:bg-[#10c8e0] group-hover:text-[#0c2b48] group-focus-within:bg-[#10c8e0] group-focus-within:text-[#0c2b48]">
                <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={1.8} />
              </span>
              <h3 className="mt-3 text-[18px] font-bold leading-tight text-[#0c2b48] sm:text-[20px]">
                {title}
              </h3>
              <span aria-hidden="true" className="mt-3 h-0.5 w-9 rounded-full bg-[#10c8e0]" />
              <p className="mt-3 text-[14px] leading-[1.65] text-[#4a6e8b] sm:text-[15px]">
                {description}
              </p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
    );
}
