import {
  ArrowLeft,
  ArrowRight,
  Dna,
  FlaskConical,
  House,
  ShieldPlus,
  TriangleAlert,
} from "lucide-react";
import Button from "../components/Button.jsx";
import pageNotFoundImage from "../assets/pagenot.png";

const values = [
  { label: "Better Science", Icon: FlaskConical },
  { label: "Healthier Tomorrow", Icon: Dna },
  { label: "Together for Discovery", Icon: ShieldPlus },
];

export default function PageNotFoundPage() {
  return (
    <section
      aria-labelledby="page-not-found-title"
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-[#f7fbfd] px-6 py-12 sm:px-10 lg:min-h-svh lg:px-14"
    >
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_center]"
        src={pageNotFoundImage}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.96)_36%,rgba(255,255,255,0.73)_52%,rgba(255,255,255,0.04)_78%)] max-md:bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.92)_68%,rgba(255,255,255,0.58)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-32 -z-10 h-64 w-64 rounded-full border-[28px] border-[#08a2be]/10"
      />
      <div className="mx-auto w-full max-w-[1034px]">
        <div className="max-w-[590px]">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#168fb5]/70 px-4 py-2 text-[11px] font-bold tracking-[0.14em] text-[#0879a7]">
            <TriangleAlert aria-hidden="true" className="h-4 w-4" />
            404 ERROR
          </p>
          <h1
            className="text-balance text-[clamp(2.8rem,5.2vw,4.4rem)] font-extrabold leading-[1.04] tracking-[-0.055em] text-[#071b3a]"
            id="page-not-found-title"
          >
            Page <span className="text-[#079caf]">Not</span> Found
          </h1>
          <p className="mt-4 max-w-[420px] text-[17px] leading-[1.55] text-[#536b8d] sm:text-lg">
            The page you’re looking for may have moved or is no longer available.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              className="!min-h-11 !gap-2 !rounded-full !bg-[#079eae] !px-6 !text-[11px] !text-white shadow-[0_8px_18px_rgba(7,158,174,0.16)] hover:!bg-[#087f91]"
              href="#home"
            >
              <House aria-hidden="true" className="h-4 w-4" />
              Back to Home
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#9aafce] bg-white/70 px-6 text-[11px] font-bold text-[#19375f] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#079eae]"
              onClick={() => window.history.back()}
              type="button"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Return to Previous
            </button>
          </div>

          <ul className="mt-9 flex max-w-[500px] items-center divide-x divide-[#dce6ef]">
            {values.map(({ label, Icon }) => (
              <li
                className="flex flex-1 flex-col items-center gap-2 px-2 text-center text-[11px] font-medium text-[#29466e] first:pl-0 last:pr-0 sm:px-5"
                key={label}
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e9f6fa]/95 text-[#168fb5]">
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-24 -z-10 h-56 w-56 rounded-full bg-[#079bb7]"
      />
    </section>
  );
}
