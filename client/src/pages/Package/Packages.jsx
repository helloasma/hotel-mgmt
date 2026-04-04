import { useState } from "react";
import { Link } from "react-router-dom";
import "./Packages.css";

/* ── data ── */

const romanticFeatures = [
  { label: "Helicopter Transfer", desc: "Private scenic arrival & departure" },
  { label: "Private Dinner", desc: "Chef-curated 7-course experience" },
  { label: "Private Spa", desc: "Couples treatment in a secluded pavilion" },
  { label: "Dedicated Concierge", desc: "24/7 personal lifestyle manager" },
];

const eliteFeatures = [
  { label: "Helicopter Transfer", desc: "Private scenic arrival & departure" },
  { label: "Private Dinner", desc: "Michelin-starred dining each evening" },
  { label: "Private Spa", desc: "Daily signature wellness rituals" },
  { label: "Sunset Cruise", desc: "Exclusive catamaran journey at dusk" },
  { label: "Dedicated Concierge", desc: "24/7 personal lifestyle manager" },
];

const eliteRooms = [
  { label: "Forest Cabin", desc: "Nestled in ancient woodland" },
  { label: "Mountain Suite", desc: "Panoramic alpine vistas" },
  { label: "Overwater Bungalow", desc: "Glass-floor ocean sanctuary" },
];

const testimonials = [
  {
    quote: "An utterly transcendent stay — the helicopter arrival set the tone for pure magic.",
    author: "Isabelle & Marc",
    source: "Romantic Escape guests",
  },
  {
    quote: "Twelve nights across three worlds. We left as different people — rested, inspired, renewed.",
    author: "The Harrington Family",
    source: "Elite Experience guests",
  },
];

/* ── PackageCard component ── */

function PackageCard({ tag, title, price, priceSuffix, description, features }) {
  return (
    <div className="pkg-card">
      <div className="pkg-card__top-line" />
      <div className="pkg-card__body">
        <div className="pkg-card__header">
          <div>
            <span className="pkg-badge">{tag}</span>
            <h2 className="pkg-card__title">{title}</h2>
          </div>
          <div className="pkg-card__price-block">
            <span className="pkg-card__price">{price}</span>
            <p className="pkg-card__price-suffix">{priceSuffix}</p>
          </div>
        </div>

        <p className="pkg-card__desc">{description}</p>

        <div className="pkg-features-grid">
          {features.map((f) => (
            <div key={f.label} className="pkg-feature">
              <div className="pkg-feature__icon-wrap">
                <span className="pkg-feature__dot" />
              </div>
              <div>
                <p className="pkg-feature__label">{f.label}</p>
                <p className="pkg-feature__desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Link to="/rooms" className="pkg-cta-btn">
          Book with this Package →
        </Link>
      </div>
    </div>
  );
}

/* ── Page ── */

function Packages() {
  const [activeTab, setActiveTab] = useState("romantic");

  return (
    <main className="pkg-page">

      {/* Hero */}
      <section className="pkg-hero">
        <div className="pkg-hero__glow pkg-hero__glow--left" />
        <div className="pkg-hero__glow pkg-hero__glow--right" />
        <div className="pkg-hero__content">
          <span className="pkg-badge pkg-badge--gold">✦ Top Tier Only</span>
          <h1 className="pkg-hero__title">
            Exclusive Lovender <span className="pkg-hero__title--gold">Experiences</span>
          </h1>
          <p className="pkg-hero__subtitle">
            Elevate your stay with our signature luxury packages
          </p>
          <div className="pkg-hero__stars">
            {"★★★★★"}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="pkg-section">
        <div className="pkg-container">

          <div className="pkg-tabs">
            <button
              className={`pkg-tab${activeTab === "romantic" ? " pkg-tab--active" : ""}`}
              onClick={() => setActiveTab("romantic")}
            >
              ♥ Romantic Escape
            </button>
            <button
              className={`pkg-tab${activeTab === "elite" ? " pkg-tab--active" : ""}`}
              onClick={() => setActiveTab("elite")}
            >
              ♛ Elite Experience
            </button>
          </div>

          {activeTab === "romantic" && (
            <PackageCard
              tag="Romantic Luxury"
              title="Lovender Romantic Escape"
              price="$700 – $1,200"
              priceSuffix="added per stay"
              description="A bespoke celebration of love — from the moment your helicopter touches down to the final petal-strewn evening. Every detail is choreographed for two."
              features={romanticFeatures}
            />
          )}

          {activeTab === "elite" && (
            <div className="pkg-elite-wrap">
              <PackageCard
                tag="Ultimate Experience"
                title="Lovender Elite Experience"
                price="Custom Quote"
                priceSuffix="min 6-night stay"
                description="An odyssey across three extraordinary settings — forest, mountain, and ocean. Nights are equally divided among three world-class room types for a journey unlike any other."
                features={eliteFeatures}
              />

              <div className="pkg-rotation-card">
                <h3 className="pkg-rotation-card__title">Three Worlds, One Journey</h3>
                <p className="pkg-rotation-card__sub">
                  Stay durations: 6, 9, or 12 nights — equally split across all three room types
                </p>
                <div className="pkg-rotation-grid">
                  {eliteRooms.map((room) => (
                    <div key={room.label} className="pkg-rotation-item">
                      <span className="pkg-rotation-item__label">{room.label}</span>
                      <span className="pkg-rotation-item__desc">{room.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="pkg-section pkg-section--testimonials">
        <div className="pkg-container pkg-container--narrow">
          <h2 className="pkg-section-title">Words From Our Guests</h2>
          <div className="pkg-testimonials-grid">
            {testimonials.map((t, i) => (
              <blockquote key={i} className="pkg-testimonial">
                <p className="pkg-testimonial__quote">"{t.quote}"</p>
                <footer>
                  <p className="pkg-testimonial__author">{t.author}</p>
                  <p className="pkg-testimonial__source">{t.source}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pkg-section pkg-section--cta">
        <div className="pkg-container">
          <div className="pkg-cta-box">
            <span className="pkg-cta-gem">◈</span>
            <h2 className="pkg-cta-box__title">Ready to Elevate Your Stay?</h2>
            <p className="pkg-cta-box__sub">
              Speak with our concierge team to craft the perfect Lovender experience tailored to you.
            </p>
            <Link to="/contact" className="pkg-cta-btn pkg-cta-btn--large">
              Begin Your Journey →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

export default Packages;