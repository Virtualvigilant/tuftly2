import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { FAQ_ITEMS, PROCESS_STEPS } from '../data/tuftlyConfig';

export default function AtelierAndFaq() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      {/* The Atelier & 4-Step Process */}
      <section id="atelier" className="section-pad section-linen">
        <div className="container">
          <div className="atelier-grid">
            <div className="atelier-photo-wrap">
              <div className="atelier-photo">
                <img
                  src="/images/atelier-craft.jpg"
                  alt="Inside the Tuftly studio: hand-tufted wool pile, yarn cones, and brass tailoring shears"
                  loading="lazy"
                />
              </div>
              <div className="atelier-quote-card">
                <p>
                  &ldquo;Luxury is something you feel underfoot, trace on a wall, and carry
                  effortlessly in hand.&rdquo;
                </p>
                <span>Tuftly Atelier · Est. Nairobi</span>
              </div>
            </div>

            <div>
              <span className="eyebrow">The Tuftly Philosophy</span>
              <h2 className="serif-display section-title">
                Slow craft, <span className="serif-italic">unmistakable warmth</span>
              </h2>
              <p className="section-lead" style={{ marginBottom: '1.25rem' }}>
                Born from a love of tactile living, Tuftly bridges interior art and
                wearable craftsmanship. Every rug, tapestry, and handbag begins on raw
                stretched monk&apos;s cloth — hand-tufted line by line, backed with durable
                odourless adhesives, and sculpted with precision shears until every contour
                catches the light.
              </p>
              <p className="section-lead">
                We never mass-produce. Whether we are anchoring your living room with a
                two-metre sculptural rug or tailoring a dusty rose wool handbag with brass
                hardware, your piece is crafted exclusively for you.
              </p>
            </div>
          </div>

          <div className="process-grid">
            {PROCESS_STEPS.map((item) => (
              <div key={item.step} className="process-card">
                <div className="process-num">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care & FAQ */}
      <section id="faq" className="section-pad">
        <div className="container">
          <div className="section-header centered">
            <span className="eyebrow">Client Care &amp; Questions</span>
            <h2 className="serif-display section-title">
              Everything you need <span className="serif-italic">to know</span>
            </h2>
          </div>

          <div className="faq-wrap">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-trigger"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  >
                    <span className="faq-question">{item.question}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <Plus size={17} />
                    </span>
                  </button>
                  {isOpen && <p className="faq-answer">{item.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
