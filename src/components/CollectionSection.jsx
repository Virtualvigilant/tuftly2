import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Eye, Instagram, MessageCircle, X } from 'lucide-react';
import {
  CATEGORIES,
  PILLARS,
  buildInstagramUrl,
  buildWhatsAppUrl,
  formatKES,
} from '../data/tuftlyConfig';

export default function CollectionSection({
  products,
  activeCategory,
  onSelectCategory,
}) {
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if (!quickViewProduct) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setQuickViewProduct(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [quickViewProduct]);

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const getPillarStartingPrice = (pillar) => {
    const matching = products.filter((p) => p.category === pillar.id);
    if (!matching.length) return pillar.startingPrice;
    const allPrices = matching.flatMap((p) => p.sizes.map((s) => s.price));
    return allPrices.length ? Math.min(...allPrices) : pillar.startingPrice;
  };

  const getSizeIndex = (productId) => selectedSizes[productId] ?? 0;

  const setSizeIndex = (productId, index) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: Number(index) }));
  };

  const handlePillarClick = (categoryId) => {
    onSelectCategory(categoryId);
    const el = document.getElementById('collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const buildOrderLink = (product, sizeObj) =>
    buildWhatsAppUrl(
      `Hello Tuftly! I would like to order:\n• Piece: ${product.name} (${product.categoryLabel})\n• Size: ${sizeObj.label}\n• Listed Price: ${formatKES(sizeObj.price)}\n\nPlease let me know yarn availability and next steps.`
    );

  return (
    <>
      {/* Three Signature Pillars */}
      <section className="pillars-section" aria-label="Tuftly craft categories">
        <div className="container">
          <div className="pillars-grid">
            {PILLARS.map((pillar) => (
              <button
                key={pillar.id}
                type="button"
                className="pillar-card"
                onClick={() => handlePillarClick(pillar.id)}
              >
                <div className="pillar-media">
                  <img src={pillar.image} alt={pillar.title} loading="lazy" />
                  <span className="pillar-num">{pillar.number}</span>
                </div>
                <div className="pillar-body">
                  <div className="pillar-top">
                    <h2 className="pillar-title">{pillar.title}</h2>
                    <span className="pillar-from">
                      From {formatKES(getPillarStartingPrice(pillar))}
                    </span>
                  </div>
                  <p className="pillar-desc">{pillar.description}</p>
                  <span className="pillar-link">
                    Browse {pillar.title} <ArrowUpRight size={15} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Collection Grid */}
      <section id="collection" className="section-pad">
        <div className="container">
          <div className="collection-bar">
            <div className="section-header">
              <span className="eyebrow">The Signature Collection</span>
              <h2 className="serif-display section-title">
                Tactile pieces, <span className="serif-italic">crafted to last</span>
              </h2>
              <p className="section-lead">
                Select your preferred scale on any piece to view exact KSh pricing, then
                order directly with our studio on WhatsApp or Instagram.
              </p>
            </div>

            <div className="filter-pills" role="tablist" aria-label="Filter collection">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => onSelectCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="admin-empty-state">
              <p>New pieces in this collection are currently on the tufting frame.</p>
            </div>
          ) : (
            <div className="products-grid">
            {filteredProducts.map((product) => {
              const sizeIdx = getSizeIndex(product.id);
              const activeSize = product.sizes[sizeIdx] || product.sizes[0];

              return (
                <article key={product.id} className="product-card">
                  <div
                    className="product-media"
                    onClick={() => setQuickViewProduct(product)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setQuickViewProduct(product);
                    }}
                  >
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <span className="product-badge">{product.badge}</span>
                    <button
                      type="button"
                      className="product-quickview-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                    >
                      <Eye size={14} /> Quick View
                    </button>
                  </div>

                  <div className="product-body">
                    <div className="product-meta-row">
                      <span className="product-cat">{product.categoryLabel}</span>
                      <div className="swatch-row" aria-label="Yarn palette">
                        {product.palette.map((hex) => (
                          <span
                            key={hex}
                            className="swatch-dot"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="product-title-row">
                      <h3 className="product-name">{product.name}</h3>
                      <span className="product-price">
                        {formatKES(activeSize.price)}
                      </span>
                    </div>

                    <p className="product-desc">{product.description}</p>

                    <div className="size-selector">
                      <label htmlFor={`size-${product.id}`}>Select Scale / Edition</label>
                      <select
                        id={`size-${product.id}`}
                        className="size-select"
                        value={sizeIdx}
                        onChange={(e) => setSizeIndex(product.id, e.target.value)}
                      >
                        {product.sizes.map((size, idx) => (
                          <option key={size.label} value={idx}>
                            {size.label} — {formatKES(size.price)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="product-actions">
                      <a
                        href={buildOrderLink(product, activeSize)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        <MessageCircle size={15} />
                        Order on WhatsApp
                      </a>
                      <a
                        href={buildInstagramUrl()}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost-ig btn-sm"
                        title="Inquire via Instagram DM"
                        aria-label={`Inquire about ${product.name} on Instagram`}
                      >
                        <Instagram size={15} />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
            </div>
          )}
        </div>
      </section>

      {/* Editorial Quick-View Modal */}
      {quickViewProduct && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={quickViewProduct.name}
          onClick={() => setQuickViewProduct(null)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              aria-label="Close quick view"
              onClick={() => setQuickViewProduct(null)}
            >
              <X size={18} />
            </button>

            <div className="modal-media">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} />
            </div>

            <div className="modal-content">
              <span className="eyebrow">{quickViewProduct.categoryLabel}</span>
              <h3
                className="serif-display"
                style={{ fontSize: '2.25rem', marginTop: '0.6rem' }}
              >
                {quickViewProduct.name}
              </h3>

              {(() => {
                const idx = getSizeIndex(quickViewProduct.id);
                const chosen = quickViewProduct.sizes[idx] || quickViewProduct.sizes[0];
                return (
                  <>
                    <div
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: 600,
                        color: 'var(--rose-deep)',
                        marginTop: '0.45rem',
                      }}
                    >
                      {formatKES(chosen.price)}
                    </div>
                    <p
                      style={{
                        color: 'var(--ink-secondary)',
                        fontSize: '0.94rem',
                        marginTop: '0.85rem',
                      }}
                    >
                      {quickViewProduct.description}
                    </p>

                    <div className="modal-specs">
                      <div>
                        <strong>Pile</strong>
                        <span>{quickViewProduct.pile}</span>
                      </div>
                      <div>
                        <strong>Materials</strong>
                        <span>{quickViewProduct.materials}</span>
                      </div>
                      <div>
                        <strong>Lead Time</strong>
                        <span>{quickViewProduct.leadTime}</span>
                      </div>
                    </div>

                    <div className="size-selector">
                      <label htmlFor="modal-size-select">Choose Size</label>
                      <select
                        id="modal-size-select"
                        className="size-select"
                        value={idx}
                        onChange={(e) =>
                          setSizeIndex(quickViewProduct.id, e.target.value)
                        }
                      >
                        {quickViewProduct.sizes.map((size, sIdx) => (
                          <option key={size.label} value={sIdx}>
                            {size.label} — {formatKES(size.price)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <a
                        href={buildOrderLink(quickViewProduct, chosen)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                      >
                        <MessageCircle size={17} />
                        Order {chosen.label.split('·')[0].trim()} on WhatsApp
                      </a>
                      <a
                        href={buildInstagramUrl()}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline"
                      >
                        <Instagram size={17} />
                        Ask About Custom Colours on Instagram
                      </a>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
