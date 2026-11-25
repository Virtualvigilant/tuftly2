import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Download,
  RefreshCw,
  Share2,
  Sparkles,
} from 'lucide-react';
import {
  extractYarnPalette,
  renderStatusPosterToCanvas,
} from '../utils/posterCanvas';

const PRESET_TEMPLATES = [
  {
    id: 'rug',
    label: 'Statement Rug',
    brandSub: 'Bespoke Rug Atelier',
    categoryTag: 'STATEMENT RUGS',
    tagTone: 'olive',
    eyebrow: 'HAND-TUFTED LIVING & BEDROOM',
    headlineBold: 'Wake Up Every',
    headlineItalic: 'Corner Of Your Space.',
    subline: 'Custom-sized plush wool rugs handcrafted in your exact colour palette — from KSh 1,500.',
  },
  {
    id: 'handbag',
    label: "Women's Handbag",
    brandSub: 'Artisan Bag Atelier',
    categoryTag: "WOMEN'S HANDBAGS",
    tagTone: 'rose',
    eyebrow: 'LIMITED HAND-TUFTED EDITION',
    headlineBold: 'Wearable Art That',
    headlineItalic: 'Turns Every Head.',
    subline: 'Plush sculpted wool totes & clutches tailored to order — starting from KSh 3,800.',
  },
  {
    id: 'name-gift',
    label: 'Name / Gift Rug',
    brandSub: 'Bespoke Rug Atelier',
    categoryTag: 'CUSTOM GIFT IDEA',
    tagTone: 'rose',
    eyebrow: 'PERSONALIZED NAMES & QUOTES',
    headlineBold: 'Spell Their Name',
    headlineItalic: 'In Plush 3D Wool.',
    subline: 'Any name, quote, or silhouette custom tufted — unforgettable gifts from KSh 1,500.',
  },
  {
    id: 'car-rug',
    label: 'Custom Car Rugs',
    brandSub: 'Bespoke Auto Atelier',
    categoryTag: 'CUSTOM CAR RUGS',
    tagTone: 'espresso',
    eyebrow: 'TAILORED CABIN LUXURY',
    headlineBold: 'Upgrade Every',
    headlineItalic: 'Single Drive.',
    subline: 'Custom-fitted tufted car floor mats with heavy-duty non-slip backing in your colours.',
  },
  {
    id: 'wall-art',
    label: '3D Wall Art',
    brandSub: 'Bespoke Textile Gallery',
    categoryTag: '3D WALL ART',
    tagTone: 'olive',
    eyebrow: 'SCULPTED GALLERY TAPESTRIES',
    headlineBold: 'Bring Tactile Warmth',
    headlineItalic: 'To Your Walls.',
    subline: 'Three-dimensional hand-sheared wool wall reliefs crafted to fit your space.',
  },
  {
    id: 'club-logo',
    label: 'Club / Brand Logo',
    brandSub: 'Bespoke Rug Atelier',
    categoryTag: 'CLUB & LOGO RUGS',
    tagTone: 'espresso',
    eyebrow: 'FAN CAVES, STUDIOS & OFFICES',
    headlineBold: 'Your Crest. Your Icon.',
    headlineItalic: 'Tufted In Sharp Detail.',
    subline: 'Team badges, gaming icons & business logos tufted in ultra-dense wool pile.',
  },
];

export default function StatusPosterStudio({ initialProduct, onNotify }) {
  const [poster, setPoster] = useState(() => ({
    edition: 'EDITION 11',
    brandSub: 'Bespoke Rug Atelier',
    image: initialProduct?.image || '/images/rug-savanna-contour.jpg',
    categoryTag: 'STATEMENT RUGS',
    tagTone: 'olive',
    photoBadge: 'HAND-TUFTED TO ORDER',
    eyebrow: 'HAND-TUFTED LIVING & BEDROOM',
    headlineBold: initialProduct?.name || 'Wake Up Every',
    headlineItalic: initialProduct ? 'Handcrafted For You.' : 'Corner Of Your Space.',
    subline:
      initialProduct?.description ||
      'Custom-sized plush wool rugs handcrafted in your exact colour palette — from KSh 1,500.',
    swatches:
      initialProduct?.palette?.length === 3
        ? [...initialProduct.palette]
        : ['#F7F2E8', '#C2737A', '#58622D'],
    ctaPrompt: 'Want This Piece? Reply "THIS"',
    ctaSub: 'Any Size · Nationwide Delivery Across Kenya',
    whatsappDisplay: '0118 899 336',
    focusX: 50,
    focusY: 50,
    zoom: 1.0,
  }));

  const [rendering, setRendering] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const canvasRef = useRef(null);
  const uploadInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  // Sync if user clicks "Make Status Poster" on a product in the catalog list
  useEffect(() => {
    if (!initialProduct) return;
    const isBag = initialProduct.category === 'handbags';
    const isWall = initialProduct.category === 'wall-art';
    const minPrice = initialProduct.sizes?.length
      ? Math.min(...initialProduct.sizes.map((s) => s.price))
      : null;

    setPoster((prev) => ({
      ...prev,
      image: initialProduct.image,
      brandSub: isBag
        ? 'Artisan Bag Atelier'
        : isWall
          ? 'Bespoke Textile Gallery'
          : 'Bespoke Rug Atelier',
      categoryTag: (initialProduct.categoryLabel || 'BESPOKE PIECE').toUpperCase(),
      tagTone: isBag ? 'rose' : isWall ? 'espresso' : 'olive',
      eyebrow: (initialProduct.badge || 'SIGNATURE TUFTLY PIECE').toUpperCase(),
      headlineBold: initialProduct.name,
      headlineItalic: minPrice
        ? `Starting At KSh ${minPrice.toLocaleString('en-KE')}.`
        : 'Crafted Exclusively For You.',
      subline: initialProduct.description || prev.subline,
      swatches:
        initialProduct.palette?.length === 3
          ? [...initialProduct.palette]
          : prev.swatches,
      focusX: 50,
      focusY: 50,
      zoom: 1.0,
    }));
  }, [initialProduct]);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.canShare === 'function') {
      try {
        const testFile = new File([''], 'test.png', { type: 'image/png' });
        setCanNativeShare(navigator.canShare({ files: [testFile] }));
      } catch {
        setCanNativeShare(false);
      }
    }
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  // Re-render live 1080x1920 canvas whenever poster config changes
  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      if (!canvasRef.current) return;
      setRendering(true);
      try {
        await renderStatusPosterToCanvas(canvasRef.current, poster);
      } catch {
        // Ignore transient image load errors while typing URL
      } finally {
        if (!cancelled) setRendering(false);
      }
    }, 60);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [poster]);

  const handleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    const extracted = await extractYarnPalette(url);
    setPoster((prev) => ({
      ...prev,
      image: url,
      swatches: extracted,
      focusX: 50,
      focusY: 50,
      zoom: 1.0,
    }));
    onNotify?.('Photo loaded & 3 yarn colours auto-detected!');
    if (uploadInputRef.current) uploadInputRef.current.value = '';
  };

  const applyPreset = (preset) => {
    setPoster((prev) => ({
      ...prev,
      brandSub: preset.brandSub,
      categoryTag: preset.categoryTag,
      tagTone: preset.tagTone,
      eyebrow: preset.eyebrow,
      headlineBold: preset.headlineBold,
      headlineItalic: preset.headlineItalic,
      subline: preset.subline,
    }));
  };

  const handleAutoDetectColors = async () => {
    const extracted = await extractYarnPalette(poster.image);
    setPoster((prev) => ({ ...prev, swatches: extracted }));
    onNotify?.('Updated yarn swatch dots from photo.');
  };

  const getSafeFileName = () => {
    const slug = (poster.headlineBold || 'tuftly-edition')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `Tuftly_Status_${slug || 'card'}.png`;
  };

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getSafeFileName();
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      onNotify?.('Downloaded 1080×1920 rounded Status PNG!');
    }, 'image/png');
  };

  const handleNativeShare = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], getSafeFileName(), { type: 'image/png' });
      try {
        await navigator.share({
          files: [file],
          title: 'Tuftly Status Edition',
        });
      } catch {
        // User cancelled native share sheet
      }
    }, 'image/png');
  };

  return (
    <div className="poster-studio-grid">
      {/* LEFT / TOP ON MOBILE: Live Crisp 1080x1920 Rounded Card Preview */}
      <section className="admin-panel poster-preview-panel">
        <div className="admin-panel-head" style={{ marginBottom: '1rem' }}>
          <div>
            <span className="eyebrow">Live 9:16 Preview</span>
            <h2 className="serif-display" style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>
              Tuftly Status Card
            </h2>
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
            {rendering ? 'Rendering...' : '1080 × 1920 PNG'}
          </span>
        </div>

        <div className="poster-canvas-stage">
          <canvas ref={canvasRef} className="poster-live-canvas" />
        </div>

        <div className="poster-download-bar">
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleDownloadPng}
          >
            <Download size={17} />
            Download Rounded PNG
          </button>

          {canNativeShare && (
            <button
              type="button"
              className="btn btn-rose"
              onClick={handleNativeShare}
              title="Share straight to WhatsApp Status on phone"
            >
              <Share2 size={17} />
              Share to WhatsApp
            </button>
          )}
        </div>
      </section>

      {/* RIGHT: 1-Click Photo Upload, Smart Presets & Copy Customizer */}
      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <span className="eyebrow">1-Click Generator</span>
            <h2 className="serif-display" style={{ fontSize: '1.9rem', marginTop: '0.3rem' }}>
              Customize Edition Card
            </h2>
          </div>
        </div>

        <div className="admin-form">
          {/* Step 1: Upload Photo From Phone / Camera Roll */}
          <div className="admin-field">
            <label className="admin-label">01 · Upload Rug, Bag, or Wall Art Photo</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              <button
                type="button"
                className="btn btn-rose"
                style={{ flex: 1 }}
                onClick={() => uploadInputRef.current?.click()}
              >
                <Camera size={17} />
                Choose Photo from Phone / PC
              </button>
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleUploadPhoto}
              />
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleAutoDetectColors}
                title="Re-detect 3 yarn colours from current photo"
              >
                <RefreshCw size={14} />
                Auto-Swatches
              </button>
            </div>
          </div>

          {/* Framing Sliders (Vertical Focus, Horizontal Focus & Zoom) */}
          <div className="poster-framing-box">
            <div className="poster-slider-item">
              <div className="est-label" style={{ marginBottom: 4 }}>
                <span>Vertical Crop</span>
                <strong>{poster.focusY}%</strong>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={poster.focusY}
                onChange={(e) =>
                  setPoster((p) => ({ ...p, focusY: Number(e.target.value) }))
                }
              />
            </div>

            <div className="poster-slider-item">
              <div className="est-label" style={{ marginBottom: 4 }}>
                <span>Horizontal</span>
                <strong>{poster.focusX}%</strong>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={poster.focusX}
                onChange={(e) =>
                  setPoster((p) => ({ ...p, focusX: Number(e.target.value) }))
                }
              />
            </div>

            <div className="poster-slider-item">
              <div className="est-label" style={{ marginBottom: 4 }}>
                <span>Zoom</span>
                <strong>{poster.zoom.toFixed(2)}×</strong>
              </div>
              <input
                type="range"
                min={1}
                max={1.6}
                step={0.02}
                value={poster.zoom}
                onChange={(e) =>
                  setPoster((p) => ({ ...p, zoom: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          {/* Step 2: 1-Tap Copy Style Presets */}
          <div className="admin-field">
            <label className="admin-label">
              <Sparkles size={13} style={{ verticalAlign: '-2px', marginRight: 5 }} />
              02 · 1-Tap Copy Templates (Or Edit Any Line Below)
            </label>
            <div className="admin-cat-pills">
              {PRESET_TEMPLATES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`quick-size-btn ${
                    poster.categoryTag === preset.categoryTag ? 'active' : ''
                  }`}
                  onClick={() => applyPreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Edition Stamp + Top-Right Category Badge + Badge Colour */}
          <div className="admin-two-col">
            <div className="admin-field">
              <label className="admin-label">Edition Number</label>
              <input
                type="text"
                className="admin-input"
                value={poster.edition}
                onChange={(e) => setPoster((p) => ({ ...p, edition: e.target.value }))}
                placeholder="EDITION 11"
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Top-Right Category Pill</label>
              <input
                type="text"
                className="admin-input"
                value={poster.categoryTag}
                onChange={(e) =>
                  setPoster((p) => ({ ...p, categoryTag: e.target.value }))
                }
                placeholder="STATEMENT RUGS"
              />
            </div>
          </div>

          <div className="admin-two-col">
            <div className="admin-field">
              <label className="admin-label">Pill Colour</label>
              <select
                className="admin-input"
                value={poster.tagTone}
                onChange={(e) => setPoster((p) => ({ ...p, tagTone: e.target.value }))}
              >
                <option value="olive">Tuftly Olive Moss</option>
                <option value="rose">Tuftly Dusty Rose</option>
                <option value="espresso">Rich Espresso</option>
              </select>
            </div>

            <div className="admin-field">
              <label className="admin-label">3-Dot Yarn Swatches</label>
              <div className="admin-color-pickers">
                {poster.swatches.map((hex, idx) => (
                  <label key={idx} className="admin-color-chip">
                    <input
                      type="color"
                      value={hex}
                      onChange={(e) => {
                        const next = [...poster.swatches];
                        next[idx] = e.target.value;
                        setPoster((p) => ({ ...p, swatches: next }));
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Headlines & Subline */}
          <div className="admin-field">
            <label className="admin-label">Small Olive Eyebrow</label>
            <input
              type="text"
              className="admin-input"
              value={poster.eyebrow}
              onChange={(e) => setPoster((p) => ({ ...p, eyebrow: e.target.value }))}
            />
          </div>

          <div className="admin-two-col">
            <div className="admin-field">
              <label className="admin-label">Headline Line 1 (Bold Black)</label>
              <input
                type="text"
                className="admin-input"
                value={poster.headlineBold}
                onChange={(e) =>
                  setPoster((p) => ({ ...p, headlineBold: e.target.value }))
                }
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Headline Line 2 (Italic Rose)</label>
              <input
                type="text"
                className="admin-input"
                value={poster.headlineItalic}
                onChange={(e) =>
                  setPoster((p) => ({ ...p, headlineItalic: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Short Description Line</label>
            <input
              type="text"
              className="admin-input"
              value={poster.subline}
              onChange={(e) => setPoster((p) => ({ ...p, subline: e.target.value }))}
            />
          </div>

          <div className="admin-two-col">
            <div className="admin-field">
              <label className="admin-label">Bottom Callout Prompt</label>
              <input
                type="text"
                className="admin-input"
                value={poster.ctaPrompt}
                onChange={(e) =>
                  setPoster((p) => ({ ...p, ctaPrompt: e.target.value }))
                }
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">WhatsApp Number</label>
              <input
                type="text"
                className="admin-input"
                value={poster.whatsappDisplay}
                onChange={(e) =>
                  setPoster((p) => ({ ...p, whatsappDisplay: e.target.value }))
                }
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
