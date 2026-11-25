import React from 'react';
import { ArrowDownRight, Instagram, MessageCircle } from 'lucide-react';
import { buildInstagramUrl, buildWhatsAppUrl } from '../data/tuftlyConfig';

export default function Hero() {
  const commissionUrl = buildWhatsAppUrl(
    `Hello Tuftly! I'm visiting your website and would love to discuss a custom hand-tufted piece.`
  );

  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">Tactile Craftsmanship · Made to Order</span>
          <h1 className="serif-display hero-title">
            Hand-tufted <em>objects</em> for considered spaces.
          </h1>
          <p className="hero-copy">
            Tuftly is an independent tufting atelier creating plush sculptural rugs,
            three-dimensional gallery wall art, and statement women&apos;s handbags — each
            piece tufted strand by strand and hand-carved to order.
          </p>

          <div className="hero-cta-row">
            <a href="#collection" className="btn btn-primary">
              Explore the Collection
              <ArrowDownRight size={17} />
            </a>
            <a
              href={commissionUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-rose"
            >
              <MessageCircle size={17} />
              Order on WhatsApp
            </a>
            <a
              href={buildInstagramUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              <Instagram size={16} />
              Instagram DM
            </a>
          </div>

          <div className="hero-metrics">
            <div>
              <div className="hero-metric-val">From KSh 5,800</div>
              <div className="hero-metric-label">Transparent bespoke pricing</div>
            </div>
            <div>
              <div className="hero-metric-val">100% Hand-Carved</div>
              <div className="hero-metric-label">Plush 3D sculpted relief</div>
            </div>
            <div>
              <div className="hero-metric-val">5 – 21 Days</div>
              <div className="hero-metric-label">Crafted fresh to your palette</div>
            </div>
          </div>
        </div>

        <div className="hero-visual-wrap">
          <div className="hero-image-frame">
            <img
              src="/images/hero-rug.jpg"
              alt="Sunlit minimalist living room featuring a sculptural hand-tufted wool rug by Tuftly"
            />
          </div>

          <div className="hero-emblem-card">
            <img
              src="/images/tuftly-logo.jpg"
              alt="Tuftly tufted wool logo"
            />
            <div className="hero-emblem-meta">
              <strong>Tuftly Studio Seal</strong>
              <span>Rugs · Wall Art · Handbags</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
