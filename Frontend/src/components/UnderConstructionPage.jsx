import Button from "./Button.jsx";
import ScrollReveal from "./ScrollReveal.jsx";

export default function UnderConstructionPage({ pageTitle }) {
  return (
    <section
      aria-labelledby="under-construction-title"
      className="construction-page"
    >
      <div className="construction-card">
        <span aria-hidden="true" className="construction-icon">
          <svg fill="none" viewBox="0 0 48 48">
            <path d="M11 37h26M15 32l17-17 5 5-17 17H15v-5Z" />
            <path d="m28 19 5 5M10 12h10M8 18h7M31 34h9" />
          </svg>
        </span>
        <p className="construction-eyebrow">{pageTitle}</p>
        <ScrollReveal as="h1" id="under-construction-title">
          This page is under construction
        </ScrollReveal>
        <p className="construction-description">
          We’re working on this page and will share updates as soon as it’s ready.
          Please check back soon.
        </p>
        <Button className="construction-home-link" href="/">
          Return to Home <span aria-hidden="true">→</span>
        </Button>
      </div>
    </section>
  );
}
