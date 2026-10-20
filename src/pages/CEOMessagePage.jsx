import ceoPortrait from "../assets/ceo-portrait.jpg";
import homeBackground from "../assets/home1.png";

const pillars = [
  {
    title: "Capacity Development",
    description: "Building the skills and confidence of the next generation of researchers.",
    icon: (
      <>
        <circle cx="12" cy="7" r="3" />
        <path d="M6 20v-2a6 6 0 0 1 12 0v2M4 10v4m16-4v4M2 12h4m12 0h4" />
      </>
    ),
  },
  {
    title: "Critical Thinking",
    description: "Encouraging curiosity, careful analysis, and evidence-led discovery.",
    icon: (
      <>
        <path d="M9 18h6m-5 3h4m-2-18a7 7 0 0 0-4 12.7c.6.4 1 1 1 1.8h6c0-.8.4-1.4 1-1.8A7 7 0 0 0 12 3Z" />
        <path d="M12 7v4m0 3h.01" />
      </>
    ),
  },
  {
    title: "Teamwork",
    description: "Bringing people and disciplines together to solve meaningful challenges.",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20v-1a6 6 0 0 1 12 0v1m1-5a5 5 0 0 1 5 5" />
      </>
    ),
  },
];

export default function CEOMessagePage() {
  return (
    <div className="ceo-page ceo-page-redesign">
      <section
        aria-labelledby="ceo-page-title"
        className="ceo-banner"
      >
        <img
          alt=""
          aria-hidden="true"
          className="ceo-banner-image"
          src={homeBackground}
        />
        <div aria-hidden="true" className="ceo-banner-overlay" />
        <div className="ceo-shell ceo-banner-content">
          <nav aria-label="Breadcrumb" className="ceo-breadcrumb">
            <a href="#home">Home</a>
            <span aria-hidden="true">&gt;</span>
            <span aria-current="page">CEO Message</span>
          </nav>
          <p className="ceo-leadership">Leadership <span aria-hidden="true" /></p>
          <h1 id="ceo-page-title">CEO <span>Message</span></h1>
          <p className="ceo-tagline">
            <span>Science today.</span>
            <span>Healthier generations tomorrow.</span>
          </p>
        </div>
      </section>

      <div className="ceo-main">
        <section aria-labelledby="ceo-message-title" className="ceo-message-section">
          <div className="ceo-shell">
            <div className="ceo-message-grid">
              <article className="ceo-profile">
                <div className="ceo-profile-image-frame">
                  <img
                    alt="Placeholder portrait for the CEO profile"
                    className="ceo-profile-photo"
                    src={ceoPortrait}
                  />
                </div>
                <div className="ceo-profile-caption">
                  <h2>Dr. Amjad Ali Tanoli, Ph.D</h2>
                  <p>CEO <span aria-hidden="true">|</span> Human Geneticist <span aria-hidden="true">|</span> Consultant Genetic Counselor</p>
                </div>
              </article>

              <article className="ceo-message-copy">
                <p className="ceo-section-eyebrow">A message from our CEO</p>
                <h2 id="ceo-message-title">Advancing science for a healthier tomorrow</h2>
                <blockquote className="ceo-pull-quote">
                  Equip and train the next generation of researchers.
                </blockquote>
                <div className="ceo-message-body">
                  <p>
                    Artificial intelligence, data science and technological advancement have
                    revolutionized biomedical research in terms of data generation and new
                    scientific discoveries. On a daily basis, new technologies are being introduced
                    to give momentum to research. It is essential to equip and train the next
                    generation of researchers to learn state-of-the-art tools and techniques and
                    enhance their research skills.
                  </p>
                  <p>
                    At ClinGene, we are committed to bridging the gap between cutting-edge science
                    and real-world impact. Our focus is not only on generating knowledge, but also
                    on translating it into solutions that improve human health and well-being.
                    Through investment in people, technology and collaboration, we can build a
                    stronger research ecosystem and create opportunities for young scientists to
                    contribute to global advancements in genetics, precision medicine and biomedical
                    sciences.
                  </p>
                  <p>Together, we can make a meaningful difference.</p>
                </div>
                <p className="ceo-signature-name">
                  <strong>Dr. Amjad Ali Tanoli, Ph.D</strong>
                  <span>Chief Executive Officer, ClinGene (Pvt) Ltd.</span>
                </p>
              </article>
            </div>

            <section aria-label="Our research pillars" className="ceo-pillars">
              {pillars.map((pillar) => (
                <article className="ceo-pillar-card" key={pillar.title}>
                  <span aria-hidden="true" className="ceo-pillar-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {pillar.icon}
                    </svg>
                  </span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </article>
              ))}
            </section>
          </div>
        </section>

        <section aria-labelledby="ceo-cta-title" className="ceo-cta-section">
          <div className="ceo-shell ceo-cta-content">
            <div>
              <p className="ceo-section-eyebrow">Our commitment</p>
              <h2 id="ceo-cta-title">Building a future through science</h2>
              <p>
                Discover how ClinGene advances biomedical research through collaboration and
                capacity development.
              </p>
            </div>
            <div className="ceo-cta-actions">
              <a className="ceo-button ceo-button-primary" href="#research">
                Explore Our Research <span aria-hidden="true">→</span>
              </a>
              <a className="ceo-button ceo-button-secondary" href="#services">
                Our Services
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
