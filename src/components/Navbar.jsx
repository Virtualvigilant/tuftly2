import React, { useEffect, useState } from 'react';
import { Instagram, Menu, MessageCircle, X } from 'lucide-react';
import { BRAND_CONFIG, buildInstagramUrl, buildWhatsAppUrl } from '../data/tuftlyConfig';

const NAV_ITEMS = [
  { label: 'Collection', href: '#collection' },
  { label: 'Pricing Guide', href: '#pricing' },
  { label: 'Bespoke Estimator', href: '#estimator' },
  { label: 'The Atelier', href: '#atelier' },
  { label: 'Care & FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const generalWaUrl = buildWhatsAppUrl(
    `Hello Tuftly! I'd love to inquire about placing a bespoke order.`
  );

  return (
    <>
      <div className="announcement-bar">
        Hand-Tufted to Order in Kenya <span>·</span> Sculptural Rugs, Wall Art &amp; Women&apos;s Handbags{' '}
        <span>·</span> Complimentary Colour Consultation
      </div>

      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <a href="#top" className="brand-lockup" aria-label="Tuftly Home">
            <img
              src="/images/tuftly-logo.jpg"
              alt="Tuftly hand-tufted circular emblem"
              className="brand-emblem"
            />
            <div className="brand-text">
              <span className="brand-name">TUFTLY</span>
              <span className="brand-sub">{BRAND_CONFIG.tagline}</span>
            </div>
          </a>

          <nav className="nav-links" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <a
              href={buildInstagramUrl()}
              target="_blank"
              rel="noreferrer"
              className="icon-circle-btn"
              aria-label="Follow Tuftly on Instagram"
              title={`Instagram @${BRAND_CONFIG.instagramHandle}`}
            >
              <Instagram size={18} />
            </a>
            <a
              href={generalWaUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm"
            >
              <MessageCircle size={16} />
              Order on WhatsApp
            </a>
          </div>

          <button
            type="button"
            className="mobile-menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
          <div className="container">
            <div className="mobile-drawer-links">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mobile-drawer-actions">
              <a
                href={generalWaUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                onClick={() => setMenuOpen(false)}
              >
                <MessageCircle size={17} />
                Order on WhatsApp
              </a>
              <a
                href={buildInstagramUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                onClick={() => setMenuOpen(false)}
              >
                <Instagram size={17} />
                DM on Instagram
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
