import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calculator,
  Camera,
  Download,
  ExternalLink,
  FileText,
  FlipHorizontal,
  Lock,
  Maximize2,
  Printer,
  Share2,
  Sparkles,
  Unlock,
  X,
} from 'lucide-react';
import { formatKES } from '../data/tuftlyConfig';
import {
  buildSpacePreviewUrl,
  calculateYarnRequirements,
  processDesignToStencilAndRug,
  renderClientQuoteToCanvas,
} from '../utils/tuftingToolkitEngine';
import TrueScaleProjector from './TrueScaleProjector.jsx';

const SIZE_PRESETS_CM = [40, 60, 80, 100, 120, 160];

export default function TuftingToolkit({ initialProduct, onNotify }) {
  const [activeSubTool, setActiveSubTool] = useState('stencil'); // 'stencil' | 'yarn' | 'quote'
  const [designSrc, setDesignSrc] = useState(
    initialProduct?.image || '/images/rug-savanna-contour.jpg'
  );
  const [publicImgPath, setPublicImgPath] = useState(
    initialProduct?.image && !initialProduct.image.startsWith('data:')
      ? initialProduct.image
      : '/images/rug-savanna-contour.jpg'
  );

  // Stencil settings
  const [numColors, setNumColors] = useState(8);
  const [mirror, setMirror] = useState(true);
  const [previewMode, setPreviewMode] = useState('rug'); // 'stencil' | 'rug' | 'compare'
  const [comparePos, setComparePos] = useState(50);
  const [projectorOpen, setProjectorOpen] = useState(false);
  const [projectorZoom, setProjectorZoom] = useState(1);

  // Processed outputs
  const [processing, setProcessing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [stencilUrl, setStencilUrl] = useState('');
  const [outlineUrl, setOutlineUrl] = useState('');
  const [rugPreviewUrl, setRugPreviewUrl] = useState('');
  const [colors, setColors] = useState([]);

  // Yarn Calculator settings
  const [unit, setUnit] = useState('cm'); // 'cm' | 'in'
  const [widthCm, setWidthCm] = useState(100);
  const [heightCm, setHeightCm] = useState(70);
  const [lockRatio, setLockRatio] = useState(true);
  const [gramsPerRoll, setGramsPerRoll] = useState(100);
  const [pricePerRoll, setPricePerRoll] = useState(280);
  const [gramsPerSqm, setGramsPerSqm] = useState(1350);

  // Client Quote settings
  const [quoteId] = useState(() => `q-${Date.now().toString(36)}`);
  const [customerName, setCustomerName] = useState('');
  const [quotePriceKES, setQuotePriceKES] = useState(12500);
  const [deliveryTime, setDeliveryTime] = useState('10 – 14 days');
  const [validDays, setValidDays] = useState(14);
  const [customerNotes, setCustomerNotes] = useState(
    'Hand-tufted plush wool with non-slip cotton backing'
  );
  const [qrPreviewUrl, setQrPreviewUrl] = useState('');
  const [canShareFiles, setCanShareFiles] = useState(false);

  const uploadInputRef = useRef(null);
  const quoteCanvasRef = useRef(null);
  const objUrlRef = useRef(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.canShare === 'function') {
      try {
        const f = new File([''], 'quote.png', { type: 'image/png' });
        setCanShareFiles(navigator.canShare({ files: [f] }));
      } catch {
        setCanShareFiles(false);
      }
    }
    return () => {
      if (objUrlRef.current) URL.revokeObjectURL(objUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!initialProduct) return;
    setDesignSrc(initialProduct.image);
    setPublicImgPath(
      !initialProduct.image.startsWith('data:') ? initialProduct.image : ''
    );
    if (initialProduct.sizes?.[0]?.price) {
      setQuotePriceKES(initialProduct.sizes[0].price);
    }
  }, [initialProduct]);

  // Run K-Means stencil + realistic tufted wool rug generator whenever image/numColors/mirror changes
  useEffect(() => {
    let cancelled = false;
    setProcessing(true);
    processDesignToStencilAndRug(designSrc, { numColors, mirror })
      .then((res) => {
        if (cancelled) return;
        setAspectRatio(res.aspectRatio || 1);
        setStencilUrl(res.stencilDataUrl);
        setOutlineUrl(res.outlineDataUrl || res.stencilDataUrl);
        setRugPreviewUrl(res.rugPreviewDataUrl);
        setColors(res.colors);
        setHeightCm((prevH) =>
          lockRatio
            ? Math.max(25, Math.round(widthCm / (res.aspectRatio || 1)))
            : prevH
        );
        // Cache latest rug preview in localStorage so same-device Floor AR preview always works even for local uploads
        try {
          window.localStorage.setItem(
            `tuftly_quote_img_${quoteId}`,
            res.rugPreviewDataUrl
          );
        } catch {
          // ignore quota
        }
      })
      .catch(() => {
        if (!cancelled) onNotify?.('Could not process that image.', 'error');
      })
      .finally(() => {
        if (!cancelled) setProcessing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [designSrc, numColors, mirror]);

  const handleUploadDesign = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objUrlRef.current) URL.revokeObjectURL(objUrlRef.current);
    const url = URL.createObjectURL(file);
    objUrlRef.current = url;
    setDesignSrc(url);
    setPublicImgPath('');
    onNotify?.('Design converted into tufting stencil & 3D rug preview!');
    if (uploadInputRef.current) uploadInputRef.current.value = '';
  };

  const handleWidthChange = (nextW) => {
    const cleanW = Math.max(20, Number(nextW) || 20);
    setWidthCm(cleanW);
    if (lockRatio && aspectRatio > 0) {
      setHeightCm(Math.max(20, Math.round(cleanW / aspectRatio)));
    }
  };

  const handleHeightChange = (nextH) => {
    const cleanH = Math.max(20, Number(nextH) || 20);
    setHeightCm(cleanH);
    if (lockRatio && aspectRatio > 0) {
      setWidthCm(Math.max(20, Math.round(cleanH * aspectRatio)));
    }
  };

  const handleRemoveColor = (colorId) => {
    setColors((prev) => {
      if (prev.length <= 1) return prev;
      const filtered = prev.filter((c) => c.id !== colorId);
      const sum = filtered.reduce((acc, c) => acc + c.ratio, 0) || 1;
      return filtered.map((c, idx) => ({
        ...c,
        ratio: c.ratio / sum,
        name: `Colour ${idx + 1}`,
      }));
    });
  };

  const yarnCalc = useMemo(
    () =>
      calculateYarnRequirements({
        colors,
        widthCm,
        heightCm,
        gramsPerSqm,
        gramsPerRoll,
        pricePerRoll,
      }),
    [colors, widthCm, heightCm, gramsPerSqm, gramsPerRoll, pricePerRoll]
  );

  // Render Client Quote sheet whenever quote tab is active or quote inputs change
  useEffect(() => {
    const url = buildSpacePreviewUrl({
      quoteId,
      widthCm,
      heightCm,
      customerName,
      priceKES: quotePriceKES,
      publicImageUrl: publicImgPath,
      colors,
    });
    setQrPreviewUrl(url);

    if (activeSubTool !== 'quote' || !quoteCanvasRef.current || !rugPreviewUrl) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (!quoteCanvasRef.current) return;
      renderClientQuoteToCanvas(quoteCanvasRef.current, {
        quoteId,
        studioName: 'TUFTLY',
        studioTagline: 'Bespoke Tufting Atelier · Nairobi, Kenya',
        customerName: customerName.trim() || 'Valued Client',
        widthCm,
        heightCm,
        priceKES: quotePriceKES,
        deliveryTime,
        validDays,
        notes: customerNotes,
        rugImage: rugPreviewUrl,
        publicImageUrl: publicImgPath,
        colors,
        whatsapp: '0118 899 336',
      }).catch(() => {});
    }, 60);

    return () => window.clearTimeout(timer);
  }, [
    activeSubTool,
    quoteId,
    customerName,
    widthCm,
    heightCm,
    quotePriceKES,
    deliveryTime,
    validDays,
    customerNotes,
    rugPreviewUrl,
    publicImgPath,
    colors,
  ]);

  const handleDownloadStencil = () => {
    if (!stencilUrl) return;
    const a = document.createElement('a');
    a.href = stencilUrl;
    a.download = `Tuftly_Stencil_${widthCm}x${heightCm}cm_${mirror ? 'Mirrored' : 'Normal'}.png`;
    a.click();
    onNotify?.('Downloaded tufting stencil PNG!');
  };

  const handleDownloadQuoteImage = () => {
    if (!quoteCanvasRef.current) return;
    quoteCanvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const slug = (customerName || 'client')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Tuftly_Client_Quote_${slug}_${widthCm}x${heightCm}cm.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      onNotify?.('Saved Client Quote image!');
    }, 'image/png');
  };

  const handleSaveQuotePdf = () => {
    if (!quoteCanvasRef.current) return;
    const dataUrl = quoteCanvasRef.current.toDataURL('image/jpeg', 0.95);
    const win = window.open('', '_blank');
    if (!win) {
      onNotify?.('Allow pop-ups to print/save PDF, or use Save Quote Image.', 'error');
      return;
    }
    win.document.write(`<!doctype html>
      <html>
        <head>
          <title>Tuftly Client Quote — ${customerName || 'Client'}</title>
          <style>
            @page { size: A4 portrait; margin: 0; }
            html, body { margin: 0; padding: 0; background: #FBF8F3; display: flex; justify-content: center; }
            img { width: 100%; max-width: 210mm; height: auto; display: block; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="setTimeout(() => { window.print(); }, 250);" />
        </body>
      </html>`);
    win.document.close();
  };

  const handleShareQuoteWhatsApp = () => {
    if (!quoteCanvasRef.current) return;
    quoteCanvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'Tuftly_Quote.png', { type: 'image/png' });
      try {
        await navigator.share({
          files: [file],
          title: 'Tuftly Custom Rug Quote',
          text: `Here is your custom Tuftly rug quote (${widthCm} × ${heightCm} cm). Preview it on your floor: ${qrPreviewUrl}`,
        });
      } catch {
        // user dismissed
      }
    }, 'image/png');
  };

  const displayW = unit === 'in' ? Math.round(widthCm / 2.54) : widthCm;
  const displayH = unit === 'in' ? Math.round(heightCm / 2.54) : heightCm;

  return (
    <div className="toolkit-shell">
      {/* Top 3-Tool Selector Bar (Matching the Video's TOOLS Bar!) */}
      <div className="toolkit-header-bar">
        <div>
          <span className="eyebrow">Atelier Production Suite</span>
          <h2 className="serif-display" style={{ fontSize: '1.95rem', marginTop: '0.2rem' }}>
            Stencil, Yarn Calculator &amp; Client Quote
          </h2>
        </div>

        <div className="toolkit-subtabs">
          <button
            type="button"
            className={`toolkit-subtab ${activeSubTool === 'stencil' ? 'active' : ''}`}
            onClick={() => setActiveSubTool('stencil')}
          >
            <Sparkles size={16} />
            1 · Stencil &amp; Rug Preview
          </button>
          <button
            type="button"
            className={`toolkit-subtab ${activeSubTool === 'yarn' ? 'active' : ''}`}
            onClick={() => setActiveSubTool('yarn')}
          >
            <Calculator size={16} />
            2 · Yarn Calculator
          </button>
          <button
            type="button"
            className={`toolkit-subtab ${activeSubTool === 'quote' ? 'active' : ''}`}
            onClick={() => setActiveSubTool('quote')}
          >
            <FileText size={16} />
            3 · Client Quote + QR
          </button>
        </div>
      </div>

      {/* =======================================================
          SUB-TOOL 1: STENCIL & REALISTIC RUG PREVIEW
         ======================================================= */}
      {activeSubTool === 'stencil' && (
        <div className="poster-studio-grid">
          <section className="admin-panel">
            <div className="admin-panel-head" style={{ marginBottom: '1rem' }}>
              <div>
                <span className="eyebrow">
                  {mirror ? '✓ Already Mirrored for Tufting' : 'Front-Facing View'}
                </span>
                <h3 className="serif-display" style={{ fontSize: '1.7rem', marginTop: '0.25rem' }}>
                  {previewMode === 'stencil'
                    ? 'Tufting Frame Stencil'
                    : previewMode === 'rug'
                      ? 'Plush 3D Rug Simulation'
                      : 'Drag to Compare'}
                </h3>
              </div>
              {processing && (
                <span style={{ fontSize: '0.78rem', color: 'var(--rose)' }}>
                  Processing...
                </span>
              )}
            </div>

            {/* Interactive Preview Stage */}
            <div className="stencil-stage">
              {previewMode === 'stencil' && stencilUrl && (
                <img src={stencilUrl} alt="Tufting stencil" className="stencil-img" />
              )}
              {previewMode === 'rug' && rugPreviewUrl && (
                <img src={rugPreviewUrl} alt="Simulated tufted rug" className="stencil-img rug-shadow" />
              )}
              {previewMode === 'compare' && rugPreviewUrl && (
                <div className="compare-container">
                  <img src={designSrc} alt="Original design" className="stencil-img" />
                  <div
                    className="compare-overlay"
                    style={{ clipPath: `inset(0 ${100 - comparePos}% 0 0)` }}
                  >
                    <img src={rugPreviewUrl} alt="Rug simulation" className="stencil-img" />
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={95}
                    value={comparePos}
                    onChange={(e) => setComparePos(Number(e.target.value))}
                    className="compare-slider"
                    aria-label="Compare original photo with tufted rug preview"
                  />
                </div>
              )}
            </div>

            <div className="poster-download-bar">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleDownloadStencil}
              >
                <Download size={15} />
                Download Stencil
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setProjectorOpen(true)}
              >
                <Maximize2 size={15} />
                1:1 Scale Projector ({widthCm}×{heightCm} cm)
              </button>
              <button
                type="button"
                className="btn btn-rose btn-sm"
                onClick={() => setActiveSubTool('yarn')}
              >
                <Calculator size={15} />
                Calculate Yarn →
              </button>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-form">
              <div className="admin-field">
                <label className="admin-label">Upload Client Artwork, Pet, Logo or Rug Idea</label>
                <button
                  type="button"
                  className="btn btn-rose"
                  onClick={() => uploadInputRef.current?.click()}
                >
                  <Camera size={17} />
                  Upload Design Photo from Phone / PC
                </button>
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleUploadDesign}
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">View Mode</label>
                <div className="chip-grid">
                  <button
                    type="button"
                    className={`est-chip ${previewMode === 'rug' ? 'active' : ''}`}
                    onClick={() => setPreviewMode('rug')}
                  >
                    <strong>Preview as a Rug</strong>
                    <span>3D plush wool simulation</span>
                  </button>
                  <button
                    type="button"
                    className={`est-chip ${previewMode === 'stencil' ? 'active' : ''}`}
                    onClick={() => setPreviewMode('stencil')}
                  >
                    <strong>Tufting Stencil</strong>
                    <span>Clean colour zones</span>
                  </button>
                  <button
                    type="button"
                    className={`est-chip ${previewMode === 'compare' ? 'active' : ''}`}
                    onClick={() => setPreviewMode('compare')}
                  >
                    <strong>Compare Slider</strong>
                    <span>Photo vs. tufted rug</span>
                  </button>
                </div>
              </div>

              {/* Target Physical Rug Size (Synced with 1:1 Projector & Yarn Calculator!) */}
              <div className="admin-field">
                <label className="admin-label">
                  Target Rug Dimensions on Monk&apos;s Cloth (cm — For 1:1 Scale Projection)
                </label>
                <div className="yarn-dim-row">
                  <input
                    type="number"
                    min={15}
                    className="admin-input"
                    value={widthCm}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    aria-label="Target rug width in cm"
                  />
                  <span style={{ fontWeight: 700, color: 'var(--ink-muted)' }}>×</span>
                  <input
                    type="number"
                    min={15}
                    className="admin-input"
                    value={heightCm}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    aria-label="Target rug height in cm"
                  />
                  <button
                    type="button"
                    className="icon-circle-btn"
                    title={lockRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                    onClick={() => setLockRatio((l) => !l)}
                  >
                    {lockRatio ? <Lock size={15} /> : <Unlock size={15} />}
                  </button>
                </div>
              </div>

              <div className="admin-two-col">
                <div className="slider-box">
                  <div className="est-label" style={{ marginBottom: 4 }}>
                    <span>Yarn Colours</span>
                    <strong>{numColors} shades</strong>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={12}
                    value={numColors}
                    onChange={(e) => setNumColors(Number(e.target.value))}
                  />
                </div>

                <div className="slider-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ fontSize: '0.88rem', display: 'block' }}>
                      Mirror for Frame
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                      Flips stencil horizontally
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`btn btn-sm ${mirror ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setMirror((m) => !m)}
                  >
                    <FlipHorizontal size={15} />
                    {mirror ? 'Mirrored' : 'Normal'}
                  </button>
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label">
                  Detected Yarn Palette ({colors.length} Colours — Tap Any Dot to Tweak)
                </label>
                <div className="admin-color-pickers">
                  {colors.map((c, idx) => (
                    <label key={c.id} className="admin-color-chip">
                      <input
                        type="color"
                        value={c.hex}
                        onChange={(e) => {
                          const next = [...colors];
                          next[idx] = { ...next[idx], hex: e.target.value };
                          setColors(next);
                        }}
                      />
                      <span>
                        {c.name} ({Math.round(c.ratio * 100)}%)
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =======================================================
          SUB-TOOL 2: YARN & COST CALCULATOR (KSh)
         ======================================================= */}
      {activeSubTool === 'yarn' && (
        <div className="poster-studio-grid">
          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <span className="eyebrow">Yarn &amp; Material Cost Calculator</span>
                <h3 className="serif-display" style={{ fontSize: '1.85rem', marginTop: '0.2rem' }}>
                  {widthCm} × {heightCm} cm · {yarnCalc.totalGrams} g
                </h3>
              </div>
              <div className="unit-toggle-pill">
                <button
                  type="button"
                  className={unit === 'cm' ? 'active' : ''}
                  onClick={() => setUnit('cm')}
                >
                  cm
                </button>
                <button
                  type="button"
                  className={unit === 'in' ? 'active' : ''}
                  onClick={() => setUnit('in')}
                >
                  in
                </button>
              </div>
            </div>

            <div className="admin-form">
              <div className="admin-field">
                <label className="admin-label">Quick Rug Width Presets</label>
                <div className="admin-cat-pills">
                  {SIZE_PRESETS_CM.map((presetW) => (
                    <button
                      key={presetW}
                      type="button"
                      className={`quick-size-btn ${widthCm === presetW ? 'active' : ''}`}
                      onClick={() => handleWidthChange(presetW)}
                    >
                      {presetW} cm
                    </button>
                  ))}
                </div>
              </div>

              <div className="yarn-dim-row">
                <div className="admin-field" style={{ flex: 1 }}>
                  <label className="admin-label">Width ({unit})</label>
                  <input
                    type="number"
                    min={15}
                    className="admin-input"
                    value={displayW}
                    onChange={(e) =>
                      handleWidthChange(
                        unit === 'in'
                          ? Math.round(Number(e.target.value) * 2.54)
                          : e.target.value
                      )
                    }
                  />
                </div>

                <button
                  type="button"
                  className="icon-circle-btn"
                  style={{ marginTop: 22 }}
                  title={lockRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                  onClick={() => setLockRatio((l) => !l)}
                >
                  {lockRatio ? <Lock size={15} /> : <Unlock size={15} />}
                </button>

                <div className="admin-field" style={{ flex: 1 }}>
                  <label className="admin-label">Height ({unit})</label>
                  <input
                    type="number"
                    min={15}
                    className="admin-input"
                    value={displayH}
                    onChange={(e) =>
                      handleHeightChange(
                        unit === 'in'
                          ? Math.round(Number(e.target.value) * 2.54)
                          : e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="admin-two-col">
                <div className="admin-field">
                  <label className="admin-label">Grams per Yarn Roll / Cone</label>
                  <input
                    type="number"
                    min={25}
                    step={25}
                    className="admin-input"
                    value={gramsPerRoll}
                    onChange={(e) => setGramsPerRoll(Number(e.target.value))}
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-label">Price per Roll (KSh)</label>
                  <input
                    type="number"
                    min={50}
                    step={10}
                    className="admin-input"
                    value={pricePerRoll}
                    onChange={(e) => setPricePerRoll(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label">
                  Cut-Pile Gun Density (g/m² — Standard ~ 1,350 g/m²)
                </label>
                <input
                  type="number"
                  min={600}
                  max={2600}
                  step={50}
                  className="admin-input"
                  value={gramsPerSqm}
                  onChange={(e) => setGramsPerSqm(Number(e.target.value))}
                />
              </div>

              {/* Cost & Profit Summary Card */}
              <div className="yarn-summary-card">
                <div className="yarn-summary-row">
                  <span>Total Yarn Needed ({yarnCalc.totalRolls} rolls)</span>
                  <strong>{formatKES(yarnCalc.totalYarnCost)}</strong>
                </div>
                <div className="yarn-summary-row">
                  <span>Monk&apos;s Cloth + Latex Backing Est.</span>
                  <strong>{formatKES(yarnCalc.backingEstimate)}</strong>
                </div>
                <div className="yarn-summary-row total">
                  <span>Est. Material Cost</span>
                  <strong>{formatKES(yarnCalc.totalMaterialCost)}</strong>
                </div>
                <div className="yarn-summary-row retail">
                  <span>Suggested Client Retail Price</span>
                  <strong>{formatKES(yarnCalc.suggestedRetail)}</strong>
                </div>

                <button
                  type="button"
                  className="btn btn-rose"
                  style={{ width: '100%', marginTop: '0.65rem' }}
                  onClick={() => {
                    setQuotePriceKES(yarnCalc.suggestedRetail);
                    setActiveSubTool('quote');
                    onNotify?.(
                      `Applied ${formatKES(yarnCalc.suggestedRetail)} to Client Quote!`
                    );
                  }}
                >
                  <FileText size={16} />
                  Create Client Quote ({formatKES(yarnCalc.suggestedRetail)}) →
                </button>
              </div>
            </div>
          </section>

          {/* Right: Per-Colour Roll & Gram Breakdown */}
          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <span className="eyebrow">Roll Shopping List</span>
                <h3 className="serif-display" style={{ fontSize: '1.8rem', marginTop: '0.2rem' }}>
                  {yarnCalc.totalRolls} Rolls Across {yarnCalc.rows.length} Colours
                </h3>
              </div>
            </div>

            <div className="yarn-color-list">
              {yarnCalc.rows.map((row) => (
                <div key={row.id} className="yarn-color-row">
                  <span
                    className="yarn-color-dot"
                    style={{ backgroundColor: row.hex }}
                  />
                  <div className="yarn-color-meta">
                    <strong>
                      {row.name} · {row.grams} g · {row.rolls}{' '}
                      {row.rolls === 1 ? 'roll' : 'rolls'}
                    </strong>
                    <span>{row.percent}% of design area</span>
                  </div>
                  <div className="yarn-color-price">{formatKES(row.cost)}</div>
                  {yarnCalc.rows.length > 1 && (
                    <button
                      type="button"
                      className="yarn-remove-btn"
                      title="Exclude background colour"
                      onClick={() => handleRemoveColor(row.id)}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginTop: '1rem' }}>
              Estimate calibrated for a cut-pile tufting gun (~{(gramsPerSqm / 1000).toFixed(2)} kg yarn per m²). Shipping not included.
            </p>
          </section>
        </div>
      )}

      {/* =======================================================
          SUB-TOOL 3: CLIENT QUOTE + FLOOR AR QR CODE
         ======================================================= */}
      {activeSubTool === 'quote' && (
        <div className="poster-studio-grid">
          <section className="admin-panel poster-preview-panel">
            <div className="admin-panel-head" style={{ marginBottom: '0.9rem' }}>
              <div>
                <span className="eyebrow">Ready-Made Tuftly Quote</span>
                <h3 className="serif-display" style={{ fontSize: '1.75rem', marginTop: '0.2rem' }}>
                  Client Quote Preview
                </h3>
              </div>
              <a
                href={qrPreviewUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
                title="Test the customer QR 'See in your space' page"
              >
                <ExternalLink size={14} />
                Test Floor AR
              </a>
            </div>

            <div className="quote-canvas-stage">
              <canvas ref={quoteCanvasRef} className="quote-live-canvas" />
            </div>

            <div className="poster-download-bar">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={handleDownloadQuoteImage}
              >
                <Download size={15} />
                Save Image
              </button>
              <button
                type="button"
                className="btn btn-rose btn-sm"
                style={{ flex: 1 }}
                onClick={handleSaveQuotePdf}
              >
                <Printer size={15} />
                Save PDF
              </button>
              {canShareFiles && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleShareQuoteWhatsApp}
                >
                  <Share2 size={15} />
                  Share
                </button>
              )}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <span className="eyebrow">100% Tuftly Branded</span>
                <h3 className="serif-display" style={{ fontSize: '1.85rem', marginTop: '0.25rem' }}>
                  Quote Details for Your Client
                </h3>
              </div>
            </div>

            <div className="admin-form">
              <div className="admin-two-col">
                <div className="admin-field">
                  <label className="admin-label">Customer Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Wanjiku / Brian"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-label">Total Client Price (KSh)</label>
                  <input
                    type="number"
                    min={500}
                    step={100}
                    className="admin-input"
                    value={quotePriceKES}
                    onChange={(e) => setQuotePriceKES(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="admin-two-col">
                <div className="admin-field">
                  <label className="admin-label">Rug Width (cm)</label>
                  <input
                    type="number"
                    min={20}
                    className="admin-input"
                    value={widthCm}
                    onChange={(e) => handleWidthChange(e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Rug Height (cm)</label>
                  <input
                    type="number"
                    min={20}
                    className="admin-input"
                    value={heightCm}
                    onChange={(e) => handleHeightChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-two-col">
                <div className="admin-field">
                  <label className="admin-label">Delivery / Crafting Time</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 2 weeks / 10 – 14 days"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-label">Quote Valid (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    className="admin-input"
                    value={validDays}
                    onChange={(e) => setValidDays(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label">Notes for the Customer</label>
                <input
                  type="text"
                  className="admin-input"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Includes non-slip backing & complimentary colour consultation"
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">
                  Optional Hosted Rug Image URL (For Cross-Device QR Scan)
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={publicImgPath}
                  onChange={(e) => setPublicImgPath(e.target.value)}
                  placeholder="/images/rug-savanna-contour.jpg or https://..."
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* True-Scale 1:1 Calibrated Projector Modal for Tracing Onto Monk's Cloth */}
      {projectorOpen && (
        <TrueScaleProjector
          stencilUrl={stencilUrl}
          outlineUrl={outlineUrl}
          widthCm={widthCm}
          heightCm={heightCm}
          onChangeWidthCm={handleWidthChange}
          onChangeHeightCm={handleHeightChange}
          mirror={mirror}
          onToggleMirror={() => setMirror((m) => !m)}
          onClose={() => setProjectorOpen(false)}
        />
      )}
    </div>
  );
}
