import React from 'react';
import { Instagram, Mail, MapPin, MessageCircle } from 'lucide-react';
import { BRAND_CONFIG, buildInstagramUrl, buildWhatsAppUrl } from '../data/tuftlyConfig';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta-banner">
          <div>
            <span className="summary-eyebrow">Begin Your Commission</span>
            <h2 className="serif-display">
              Ready to bring <span className="serif-italic">Tuftly</span> home?
            </h2>
            <p>
              Message our atelier directly on WhatsApp or Instagram DM for complimentary
              yarn pairing advice, room sizing recommendations, and custom quotes.
            </p>
          </div>
          <div className="footer-cta-btns">
            <a
              href={buildWhatsAppUrl(
                `Hello Tuftly! I'd love to start a custom order or inquire about your pieces.`
              )}
              target="_blank"
              rel="noreferrer"
              className="btn btn-rose"
            >
              <MessageCircle size={17} />
              Chat on WhatsApp
            </a>
            <a
              href={buildInstagramUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn btn-summary-ig"
            >
              <Instagram size={17} />
              @{BRAND_CONFIG.instagramHandle}
            </a>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-brand-row">
              <img src="/images/tuftly-logo.jpg" alt="Tuftly emblem" />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.65rem',
                    letterSpacing: '0.09em',
                    lineHeight: 1,
                    color: '#fbf8f3',
                  }}
                >
                  TUFTLY
                </div>
                <div
                  style={{
                    fontSize: '0.66rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#e4b2b6',
                    marginTop: '4px',
                  }}
                >
                  {BRAND_CONFIG.tagline}
                </div>
              </div>
            </div>
            <p style={{ color: '#c4b7a4', fontSize: '0.88rem', maxWidth: '300px' }}>
              Hand-tufted sculptural rugs, tactile gallery wall art, and artisan women&apos;s
              handbags made to order with warm elegance.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li>
                <a href="#collection">Signature Collection</a>
              </li>
              <li>
                <a href="#pricing">Rug Pricing Guide</a>
              </li>
              <li>
                <a href="#estimator">Bespoke Estimator</a>
              </li>
              <li>
                <a href="#atelier">The Atelier</a>
              </li>
              <li>
                <a href="#faq">Care &amp; FAQ</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Creations</h4>
            <ul>
              <li>Sculptural Wool Rugs</li>
              <li>3D Gallery Wall Art</li>
              <li>Women&apos;s Tufted Handbags</li>
              <li>Custom Monogram Gifts</li>
              <li>Interior Designer Trade Orders</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Studio Concierge</h4>
            <ul>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} color="#e4b2b6" />
                {BRAND_CONFIG.location}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} color="#e4b2b6" />
                <a href={`mailto:${BRAND_CONFIG.email}`}>{BRAND_CONFIG.email}</a>
              </li>
              <li>{BRAND_CONFIG.hours}</li>
              <li>M-Pesa &amp; Bank Transfer Accepted</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            &copy; {year} {BRAND_CONFIG.name}. All rights reserved.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span>Hand-tufted with care · Nairobi, Kenya</span>
            <a
              href="#admin"
              style={{
                color: '#d7cab8',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Studio Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
