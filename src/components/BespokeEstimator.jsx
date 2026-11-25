import React, { useMemo, useState } from 'react';
import { Check, Copy, Instagram, MessageCircle } from 'lucide-react';
import { buildInstagramUrl, buildWhatsAppUrl, formatKES } from '../data/tuftlyConfig';

const PIECE_TYPES = [
  { id: 'rug', label: 'Custom Rug', sub: 'Any shape or dimension' },
  { id: 'wall-art', label: 'Wall Art', sub: 'Mounted or oak framed' },
  { id: 'handbag', label: 'Handbag', sub: 'Tote or evening clutch' },
];

const FINISHES = [
  { id: 'plush', label: 'Plush Cut Pile', sub: 'Velvety, uniform softness', multiplier: 1.0 },
  { id: 'boucle', label: 'Cut & Loop Bouclé', sub: 'Textural tonal depth', multiplier: 1.1 },
  { id: 'sculpted', label: 'Sculpted 3D Relief', sub: 'Hand-sheared contours', multiplier: 1.18 },
];

const PALETTES = [
  {
    id: 'tuftly-signature',
    name: 'Tuftly Signature (Cream, Rose & Olive)',
    swatches: ['#F7F2E8', '#C27B80', '#5D6632'],
  },
  {
    id: 'warm-neutrals',
    name: 'Warm Linen, Oat & Espresso',
    swatches: ['#FBF8F3', '#D6C6B0', '#3C322A'],
  },
  {
    id: 'terracotta-blush',
    name: 'Terracotta, Blush & Sand',
    swatches: ['#B86B55', '#DFA9A5', '#EFE5D6'],
  },
  {
    id: 'custom-palette',
    name: 'Custom Palette (Send Photo)',
    swatches: ['#5D6632', '#C27B80', '#B8955A'],
  },
];

const WALL_PRESETS = [
  { id: 'small', label: 'Compact · 45 × 60 cm', base: 7200, days: '7 – 9 days' },
  { id: 'medium', label: 'Gallery · 70 × 100 cm', base: 13800, days: '9 – 12 days' },
  { id: 'large', label: 'Statement · 95 × 135 cm', base: 22000, days: '12 – 15 days' },
];

const BAG_PRESETS = [
  { id: 'clutch', label: 'Evening Shoulder Clutch', base: 5800, days: '5 – 7 days' },
  { id: 'mini-tote', label: 'Structured Mini Tote', base: 6800, days: '6 – 8 days' },
  { id: 'day-tote', label: 'Monogram Day Tote', base: 9200, days: '7 – 10 days' },
];

const QUICK_RUG_SIZES = [
  { label: '70×110', w: 70, l: 110 },
  { label: '120×180', w: 120, l: 180 },
  { label: '160×230', w: 160, l: 230 },
  { label: '200×300', w: 200, l: 300 },
];

export default function BespokeEstimator() {
  const [pieceType, setPieceType] = useState('rug');
  const [rugWidth, setRugWidth] = useState(120);
  const [rugLength, setRugLength] = useState(180);
  const [wallPreset, setWallPreset] = useState('medium');
  const [bagPreset, setBagPreset] = useState('mini-tote');
  const [finishId, setFinishId] = useState('sculpted');
  const [paletteId, setPaletteId] = useState('tuftly-signature');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const estimate = useMemo(() => {
    const finish = FINISHES.find((f) => f.id === finishId) || FINISHES[0];
    const palette = PALETTES.find((p) => p.id === paletteId) || PALETTES[0];

    let basePrice = 0;
    let sizeDescription = '';
    let leadTime = '10 – 14 days';

    if (pieceType === 'rug') {
      const sqMeters = (rugWidth / 100) * (rugLength / 100);
      // Luxury studio rate calibrated smoothly to the KSh pricing guide
      basePrice = Math.max(8500, Math.round((sqMeters * 8600 + 2000) / 500) * 500);
      sizeDescription = `${rugWidth} × ${rugLength} cm (${sqMeters.toFixed(2)} m²)`;
      leadTime =
        sqMeters < 1.2
          ? '7 – 10 days'
          : sqMeters < 2.6
            ? '10 – 14 days'
            : sqMeters < 4.5
              ? '14 – 18 days'
              : '18 – 24 days';
    } else if (pieceType === 'wall-art') {
      const preset = WALL_PRESETS.find((w) => w.id === wallPreset) || WALL_PRESETS[1];
      basePrice = preset.base;
      sizeDescription = preset.label;
      leadTime = preset.days;
    } else {
      const preset = BAG_PRESETS.find((b) => b.id === bagPreset) || BAG_PRESETS[1];
      basePrice = preset.base;
      sizeDescription = preset.label;
      leadTime = preset.days;
    }

    const low = Math.round((basePrice * finish.multiplier) / 500) * 500;
    const high = Math.round((low * 1.12) / 500) * 500;

    return {
      low,
      high,
      finish,
      palette,
      sizeDescription,
      leadTime,
      pieceLabel: PIECE_TYPES.find((p) => p.id === pieceType)?.label || 'Custom Piece',
    };
  }, [pieceType, rugWidth, rugLength, wallPreset, bagPreset, finishId, paletteId]);

  const briefText = `Hello Tuftly! I'd love to commission a bespoke piece:\n• Type: ${estimate.pieceLabel}\n• Scale: ${estimate.sizeDescription}\n• Pile Finish: ${estimate.finish.label}\n• Colour Mood: ${estimate.palette.name}\n• Estimated Range: ${formatKES(estimate.low)} – ${formatKES(estimate.high)}${
    notes.trim() ? `\n• Notes: ${notes.trim()}` : ''
  }\n\nPlease let me know your earliest studio slot!`;

  const handleInstagramCopy = async () => {
    try {
      await navigator.clipboard.writeText(briefText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    } catch {
      // Clipboard may be unavailable in restricted contexts; still open Instagram
    }
    window.open(buildInstagramUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="estimator" className="section-pad">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Bespoke Studio Concierge</span>
          <h2 className="serif-display section-title">
            Configure your <span className="serif-italic">custom commission</span>
          </h2>
          <p className="section-lead">
            Have a specific room dimension, wall alcove, or dream handbag colourway in mind?
            Use our interactive estimator to preview your KSh investment and send your
            brief straight to our WhatsApp or Instagram inbox.
          </p>
        </div>

        <div className="estimator-shell">
          <div className="estimator-controls">
            {/* Step 1: Piece Type */}
            <div className="est-group">
              <div className="est-label">
                <span>01 · Select Creation</span>
              </div>
              <div className="chip-grid">
                {PIECE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`est-chip ${pieceType === type.id ? 'active' : ''}`}
                    onClick={() => setPieceType(type.id)}
                  >
                    <strong>{type.label}</strong>
                    <span>{type.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Scale / Dimensions */}
            <div className="est-group">
              <div className="est-label">
                <span>02 · Dimensions &amp; Scale</span>
                <strong>{estimate.sizeDescription}</strong>
              </div>

              {pieceType === 'rug' && (
                <>
                  <div className="slider-grid">
                    <div className="slider-box">
                      <div className="est-label" style={{ marginBottom: 0 }}>
                        <span>Width</span>
                        <strong>{rugWidth} cm</strong>
                      </div>
                      <input
                        type="range"
                        min={60}
                        max={240}
                        step={10}
                        value={rugWidth}
                        onChange={(e) => setRugWidth(Number(e.target.value))}
                        aria-label="Rug width in centimeters"
                      />
                    </div>
                    <div className="slider-box">
                      <div className="est-label" style={{ marginBottom: 0 }}>
                        <span>Length</span>
                        <strong>{rugLength} cm</strong>
                      </div>
                      <input
                        type="range"
                        min={90}
                        max={320}
                        step={10}
                        value={rugLength}
                        onChange={(e) => setRugLength(Number(e.target.value))}
                        aria-label="Rug length in centimeters"
                      />
                    </div>
                  </div>
                  <div className="quick-size-row">
                    {QUICK_RUG_SIZES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        className={`quick-size-btn ${
                          rugWidth === preset.w && rugLength === preset.l ? 'active' : ''
                        }`}
                        onClick={() => {
                          setRugWidth(preset.w);
                          setRugLength(preset.l);
                        }}
                      >
                        {preset.label} cm
                      </button>
                    ))}
                  </div>
                </>
              )}

              {pieceType === 'wall-art' && (
                <div className="chip-grid">
                  {WALL_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={`est-chip ${wallPreset === preset.id ? 'active' : ''}`}
                      onClick={() => setWallPreset(preset.id)}
                    >
                      <strong>{preset.label.split('·')[0].trim()}</strong>
                      <span>{preset.label.split('·')[1].trim()}</span>
                    </button>
                  ))}
                </div>
              )}

              {pieceType === 'handbag' && (
                <div className="chip-grid">
                  {BAG_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={`est-chip ${bagPreset === preset.id ? 'active' : ''}`}
                      onClick={() => setBagPreset(preset.id)}
                    >
                      <strong>{preset.label}</strong>
                      <span>From {formatKES(preset.base)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Pile & Sculpting */}
            <div className="est-group">
              <div className="est-label">
                <span>03 · Texture &amp; Carving Finish</span>
              </div>
              <div className="chip-grid">
                {FINISHES.map((finish) => (
                  <button
                    key={finish.id}
                    type="button"
                    className={`est-chip ${finishId === finish.id ? 'active' : ''}`}
                    onClick={() => setFinishId(finish.id)}
                  >
                    <strong>{finish.label}</strong>
                    <span>{finish.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Yarn Palette */}
            <div className="est-group">
              <div className="est-label">
                <span>04 · Yarn Colour Mood</span>
              </div>
              <div className="palette-grid">
                {PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    type="button"
                    className={`palette-option ${paletteId === palette.id ? 'active' : ''}`}
                    onClick={() => setPaletteId(palette.id)}
                  >
                    <span className="palette-dots">
                      {palette.swatches.map((hex) => (
                        <span key={hex} style={{ backgroundColor: hex }} />
                      ))}
                    </span>
                    <span className="palette-option-name">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Optional Inspiration Notes */}
            <div className="est-group">
              <label htmlFor="custom-notes" className="est-label">
                <span>05 · Design Notes (Optional)</span>
              </label>
              <textarea
                id="custom-notes"
                className="est-textarea"
                placeholder="E.g. Organic wavy outline to match a cream bouclé sofa, or subtle initials on a dusty rose mini tote..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Live Concierge Summary Card */}
          <aside className="estimator-summary" aria-live="polite">
            <span className="summary-eyebrow">Live Studio Estimate</span>
            <h3 className="summary-title">{estimate.pieceLabel}</h3>

            <div className="summary-price-box">
              <div className="summary-price-main">
                {formatKES(estimate.low)} – {formatKES(estimate.high)}
              </div>
              <div className="summary-price-sub">
                50% deposit ({formatKES(Math.round(estimate.low / 2))}) initiates crafting
              </div>
            </div>

            <ul className="summary-specs">
              <li>
                <span>Scale</span>
                <strong>{estimate.sizeDescription}</strong>
              </li>
              <li>
                <span>Texture</span>
                <strong>{estimate.finish.label}</strong>
              </li>
              <li>
                <span>Palette</span>
                <strong>{estimate.palette.name.split('(')[0].trim()}</strong>
              </li>
              <li>
                <span>Est. Turnaround</span>
                <strong>{estimate.leadTime}</strong>
              </li>
            </ul>

            <div className="summary-actions">
              <a
                href={buildWhatsAppUrl(briefText)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-rose"
              >
                <MessageCircle size={17} />
                Send Brief on WhatsApp
              </a>

              <button
                type="button"
                className="btn btn-summary-ig"
                onClick={handleInstagramCopy}
              >
                {copied ? <Check size={16} /> : <Instagram size={16} />}
                {copied ? 'Brief Copied! Opening Instagram...' : 'Copy Brief & DM on Instagram'}
                {!copied && <Copy size={14} style={{ opacity: 0.7 }} />}
              </button>
            </div>

            {copied && (
              <div className="copy-feedback">
                Your custom brief is copied — simply paste it into our Instagram DM.
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
