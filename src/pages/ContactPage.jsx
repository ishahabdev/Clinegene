import Button from "../components/Button.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";

const homeBackground = "/images/home1.webp";

const contactPhone = "+92-3485607051";
const contactEmail = "Clinene@gmail.com";
const contactAddress =
  "Street 13, Lane 10, Hostel City, Chatta Bakhtawar, Chak Shahzad, Park Road, Islamabad, Pakistan.";
const mapUrl =
  "https://maps.google.com/?q=Street+13,+Lane+10,+Hostel+City,+Chatta+Bakhtawar,+Chak+Shahzad,+Park+Road,+Islamabad,+Pakistan";
const mapEmbedUrl =
  "https://maps.google.com/maps?q=Street+13,+Lane+10,+Hostel+City,+Chatta+Bakhtawar,+Chak+Shahzad,+Park+Road,+Islamabad,+Pakistan&output=embed";

const contactCards = [
  {
    icon: "phone",
    title: "Call us",
    value: contactPhone,
    href: "tel:+923485607051",
    detail: "Speak with our team about your inquiry.",
  },
  {
    icon: "email",
    title: "Email us",
    value: contactEmail,
    href: `mailto:${contactEmail}`,
    detail: "Send us a message and we’ll get back to you.",
  },
  {
    icon: "location",
    title: "Visit us",
    value: "Islamabad, Pakistan",
    href: mapUrl,
    detail: contactAddress,
  },
];

function ContactIcon({ type }) {
  const paths = {
    phone: <path d="M7 3h3l2 5-2.5 1.8a14 14 0 0 0 4.7 4.7L16 12l5 2v3a2 2 0 0 1-2 2C10 19 5 14 5 5a2 2 0 0 1 2-2Z" />,
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {paths[type]}
    </svg>
  );
}

function handleContactSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Website inquiry from ${formData.get("name")}`);
  const message = encodeURIComponent(
    `Name: ${formData.get("name")}\nEmail: ${formData.get("email")}\n\n${formData.get("message")}`,
  );

  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${message}`;
}

export default function ContactPage() {
  return (
    <div className="contact-page">
      <section
        aria-labelledby="contact-page-title"
        className="contact-hero"
        style={{ backgroundImage: `url(${homeBackground})` }}
      >
        <div className="contact-hero-overlay" />
        <div className="site-container contact-hero-content">
          <p className="contact-breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span> Contact</p>
          <p className="contact-eyebrow">We’re here to help</p>
          <ScrollReveal as="h1" id="contact-page-title">Contact Us</ScrollReveal>
          <p>Have a question about our research or services? Get in touch with the ClinGene team.</p>
        </div>
      </section>

      <section aria-label="ClinGene contact details" className="contact-details-section">
        <div className="site-container contact-cards">
          {contactCards.map((card, index) => (
            <ScrollReveal
              as="article"
              className={`contact-info-card${index === 1 ? " contact-info-card-featured" : ""}`}
              delay={index * 60}
              key={card.title}
            >
              <span className="contact-info-icon"><ContactIcon type={card.icon} /></span>
              <h2>{card.title}</h2>
              <a href={card.href} rel={card.href.startsWith("https:") ? "noreferrer" : undefined}
                target={card.href.startsWith("https:") ? "_blank" : undefined}>
                {card.value}
              </a>
              <p>{card.detail}</p>
              <a className="contact-card-link" href={card.href}
                rel={card.href.startsWith("https:") ? "noreferrer" : undefined}
                target={card.href.startsWith("https:") ? "_blank" : undefined}>
                {index === 2 ? "Get directions" : "Contact us"} <span aria-hidden="true">→</span>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section aria-label="Contact information and message form" className="contact-main-section">
        <div className="site-container contact-main-grid">
          <div className="contact-location-column">
            <p className="contact-section-eyebrow">Find us</p>
            <h2>Our location</h2>
            <p className="contact-location-address">
              {contactAddress}
            </p>
            <div className="contact-map">
              <iframe
                title="Map showing ClinGene’s location in Islamabad"
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a className="contact-directions-link" href={mapUrl} rel="noreferrer" target="_blank">
              View directions on Google Maps <span aria-hidden="true">↗</span>
            </a>
            <div className="contact-hours">
              <span aria-hidden="true" className="contact-hours-dot" />
              <p><strong>Need assistance?</strong><br />Call or email us and our team will be happy to help.</p>
            </div>
          </div>

          <div className="contact-form-card">
            <p className="contact-section-eyebrow">Send us a message</p>
            <h2>Get in touch</h2>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <label htmlFor="contact-name">Name</label>
              <input autoComplete="name" id="contact-name" name="name" placeholder="Your name" required />

              <label htmlFor="contact-email">Email</label>
              <input autoComplete="email" id="contact-email" name="email" placeholder="you@example.com" required type="email" />

              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" placeholder="How can we help?" required rows="5" />

              <Button className="contact-submit hover:!text-white focus-visible:!text-white" type="submit" variant="cyan">Send Message <span aria-hidden="true">→</span></Button>
              <p className="contact-form-note">Your email app will open with your message ready to send.</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
