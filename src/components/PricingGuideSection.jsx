import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import {
  BRAND_CONFIG,
  OTHER_PRICING_SUMMARY,
  RUG_PRICING_TIERS,
  buildWhatsAppUrl,
  formatKES,
} from '../data/tuftlyConfig';

export default function PricingGuideSection() {
  return (
    <section id="pricing" className="section-pad section-linen">
      <div className="container">
        <div className="section-header centered">
          <span className="eyebrow">Transparent Studio Rates</span>
          <h2 className="serif-display section-title">
            Rug &amp; Atelier <span className="serif-italic">Pricing Guide</span>
          </h2>
          <p className="section-lead">
            Every Tuftly piece is priced honestly by scale, yarn density, and hand-carving
            intricacy. Below is our signature guide across standard rug dimensions, wall art,
            and women&apos;s handbags in Kenyan Shillings (KSh).
          </p>
        </div>

        {/* Rug Sizes Pricing Matrix */}
        <div className="pricing-grid">
          {RUG_PRICING_TIERS.map((tier) => {
            const waLink = buildWhatsAppUrl(
              `Hello Tuftly! I'm interested in the ${tier.tier} rug size (${tier.dimensions}, starting from ${formatKES(tier.priceFrom)}). Could we discuss designs and colours?`
            );

            return (
              <div
                key={tier.tier}
                className={`price-tier-card ${tier.featured ? 'featured' : ''}`}
              >
                <span className="tier-tag">{tier.areaLabel}</span>
                <h3 className="tier-name">{tier.tier}</h3>
                <div className="tier-dim">{tier.dimensions}</div>

                <div className="tier-price-block">
                  <span className="tier-price-label">Starting From</span>
                  <div className="tier-price-val">{formatKES(tier.priceFrom)}</div>
                  <div className="tier-price-range">
                    Up to {formatKES(tier.priceTo)} (3D carved)
                  </div>
                </div>

                <p className="tier-ideal">{tier.idealFor}</p>
                <div className="tier-time">Crafting time: {tier.turnaround}</div>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`btn btn-sm ${tier.featured ? 'btn-rose' : 'btn-outline'}`}
                >
                  <MessageCircle size={14} />
                  Reserve Size
                </a>
              </div>
            );
          })}
        </div>

        {/* Wall Art & Handbags Summary */}
        <div className="other-pricing-grid">
          {OTHER_PRICING_SUMMARY.map((group) => (
            <div key={group.category} className="other-pricing-card">
              <div className="other-pricing-head">
                <div>
                  <h3>{group.category}</h3>
                  <p>{group.subtitle}</p>
                </div>
                <a
                  href={buildWhatsAppUrl(
                    `Hello Tuftly! I'd like to inquire about commissioning a ${group.category} piece.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  Inquire
                </a>
              </div>
              <ul className="other-pricing-list">
                {group.tiers.map((item) => (
                  <li key={item.name}>
                    <span>{item.name}</span>
                    <strong>{item.price}</strong>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pricing-footnote">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={17} color="var(--olive)" />
            <span>
              <strong>Payment &amp; Care:</strong> {BRAND_CONFIG.depositNote}. Organic or
              irregular silhouettes are crafted at no extra shaping fee.
            </span>
          </div>
          <a href="#estimator" className="btn btn-primary btn-sm">
            Try Custom Size Estimator
          </a>
        </div>
      </div>
    </section>
  );
}
