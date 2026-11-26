import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Eye,
  EyeOff,
  FlipHorizontal,
  Grid,
  Lock,
  Maximize2,
  RotateCcw,
  Ruler,
  Unlock,
  X,
} from 'lucide-react';

const CALIBRATION_STORAGE_KEY = 'tuftly_projector_px_per_cm_v1';

/**
 * TRUE-SCALE 1:1 MONK'S CLOTH PROJECTOR
 * -------------------------------------
 * Projects the stencil at exact `widthCm x heightCm` physical proportions with:
 *  - Interactive 10.0 cm x 10.0 cm physical tape-measure calibration square
 *  - Centimeter rulers & 10 cm registration grid (+ crosshairs for panning large rugs in sections!)
 *  - Optional 4 cm cloth hemming / tack-strip allowance border
 *  - 3 high-contrast tracing modes (Neon Outlines on Black, Colour Stencil, Black Lines on White)
 *  - Scale Lock + Drag/Step Panning so 2-meter rugs can be traced accurately in tiles without losing 1:1 scale
 */
export default function TrueScaleProjector({
  stencilUrl,
  outlineUrl,
  widthCm,
  heightCm,
  onChangeWidthCm,
  onChangeHeightCm,
  mirror,
  onToggleMirror,
  onClose,
}) {
  const containerRef = useRef(null);
  const dragRef = useRef(null);

  const [pxPerCm, setPxPerCm] = useState(() => {
    try {
      const saved = Number(window.localStorage.getItem(CALIBRATION_STORAGE_KEY));
      if (saved >= 1.5 && saved <= 80) return saved;
    } catch {
      // ignore
    }
    // Smart initial fit based on viewport height while preserving exact cm ratio
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const fit = Math.min((vw * 0.72) / (widthCm || 100), (vh * 0.72) / (heightCm || 70));
    return Math.max(2, Math.round(fit * 10) / 10);
  });

  const [scaleLocked, setScaleLocked] = useState(false);
  const [showCalibBox, setShowCalibBox] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showHemMargin, setShowHemMargin] = useState(true);
  const [visualMode, setVisualMode] = useState('outline-dark'); // 'outline-dark' | 'stencil' | 'outline-light'
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const updatePxPerCm = (nextVal) => {
    if (scaleLocked) return;
    const clamped = Math.max(1.5, Math.min(85, Math.round(Number(nextVal) * 100) / 100));
    setPxPerCm(clamped);
    try {
      window.localStorage.setItem(CALIBRATION_STORAGE_KEY, String(clamped));
    } catch {
      // ignore
    }
  };

  const fitEntireRugOnScreen = () => {
    if (scaleLocked) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight - (hudCollapsed ? 20 : 130);
    const fit = Math.min((vw * 0.82) / widthCm, (vh * 0.8) / heightCm);
    updatePxPerCm(fit);
    setPan({ x: 0, y: 0 });
  };

  const toggleBrowserFullscreen = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // ignore if restricted
    }
  };

  // Keyboard shortcuts for hands-free adjustments while standing near the tufting frame!
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        updatePxPerCm(pxPerCm + 0.2);
      } else if (e.key === '-' || e.key === '_') {
        updatePxPerCm(pxPerCm - 0.2);
      } else if (e.key === 'ArrowLeft') {
        setPan((p) => ({ ...p, x: p.x + 10 * pxPerCm }));
      } else if (e.key === 'ArrowRight') {
        setPan((p) => ({ ...p, x: p.x - 10 * pxPerCm }));
      } else if (e.key === 'ArrowUp') {
        setPan((p) => ({ ...p, y: p.y + 10 * pxPerCm }));
      } else if (e.key === 'ArrowDown') {
        setPan((p) => ({ ...p, y: p.y - 10 * pxPerCm }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const rugWidthPx = widthCm * pxPerCm;
  const rugHeightPx = heightCm * pxPerCm;
  const tenCmPx = 10 * pxPerCm;
  const hemPx = 4 * pxPerCm; // 4 cm monk's cloth fold/hem margin

  const gridLines = useMemo(() => {
    const cols = Math.floor(widthCm / 10);
    const rows = Math.floor(heightCm / 10);
    return {
      vLines: Array.from({ length: cols }, (_, i) => (i + 1) * 10),
      hLines: Array.from({ length: rows }, (_, i) => (i + 1) * 10),
    };
  }, [widthCm, heightCm]);

  const onPointerDown = (e) => {
    if (e.target.closest('.proj-hud') || e.target.closest('.proj-fab')) return;
    dragRef.current = {
      sx: e.clientX,
      sy: e.clientY,
      ox: pan.x,
      oy: pan.y,
    };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    setPan({
      x: dragRef.current.ox + (e.clientX - dragRef.current.sx),
      y: dragRef.current.oy + (e.clientY - dragRef.current.sy),
    });
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const panByCm = (dxCm, dyCm) => {
    setPan((p) => ({
      x: p.x + dxCm * pxPerCm,
      y: p.y + dyCm * pxPerCm,
    }));
  };

  const isLightBg = visualMode === 'outline-light';
  const gridStroke = isLightBg ? 'rgba(0, 0, 0, 0.28)' : 'rgba(0, 255, 200, 0.34)';
  const frameStroke = isLightBg ? '#d11f3e' : '#00ffcc';

  return (
    <div
      ref={containerRef}
      className="projector-backdrop"
      style={{ background: isLightBg ? '#ffffff' : '#000000' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Floating Re-Open HUD Pill When Toolbar Is Hidden */}
      {hudCollapsed && (
        <button
          type="button"
          className="proj-fab"
          onClick={() => setHudCollapsed(false)}
        >
          <Eye size={15} />
          Show Controls ({widthCm}×{heightCm} cm)
        </button>
      )}

      {/* Top Calibration & Scale Control Bar */}
      {!hudCollapsed && (
        <div className="proj-hud">
          <div className="proj-hud-row">
            {/* Exact Physical Rug Size */}
            <div className="proj-group">
              <span className="proj-group-label">Rug Size (cm)</span>
              <input
                type="number"
                min={15}
                value={widthCm}
                onChange={(e) => onChangeWidthCm(Number(e.target.value))}
                className="proj-num-input"
                aria-label="Rug width in cm"
              />
              <span>×</span>
              <input
                type="number"
                min={15}
                value={heightCm}
                onChange={(e) => onChangeHeightCm(Number(e.target.value))}
                className="proj-num-input"
                aria-label="Rug height in cm"
              />
              <span style={{ opacity: 0.7, fontSize: '0.76rem' }}>cm</span>
            </div>

            {/* 1:1 Physical Tape-Measure Calibration Controls */}
            <div className="proj-group proj-calib-group">
              <Ruler size={15} color="#00ffcc" />
              <span className="proj-group-label">1:1 Scale Calibration</span>
              <button
                type="button"
                className="proj-step-btn"
                disabled={scaleLocked}
                onClick={() => updatePxPerCm(pxPerCm - 1)}
              >
                −1
              </button>
              <button
                type="button"
                className="proj-step-btn"
                disabled={scaleLocked}
                onClick={() => updatePxPerCm(pxPerCm - 0.1)}
              >
                −0.1
              </button>
              <input
                type="range"
                min={1.5}
                max={60}
                step={0.05}
                disabled={scaleLocked}
                value={pxPerCm}
                onChange={(e) => updatePxPerCm(e.target.value)}
                style={{ width: 135, accentColor: '#00ffcc' }}
              />
              <button
                type="button"
                className="proj-step-btn"
                disabled={scaleLocked}
                onClick={() => updatePxPerCm(pxPerCm + 0.1)}
              >
                +0.1
              </button>
              <button
                type="button"
                className="proj-step-btn"
                disabled={scaleLocked}
                onClick={() => updatePxPerCm(pxPerCm + 1)}
              >
                +1
              </button>
              <strong style={{ fontSize: '0.78rem', minWidth: 68, color: '#00ffcc' }}>
                {pxPerCm.toFixed(2)} px/cm
              </strong>
              <button
                type="button"
                className={`proj-pill-btn ${scaleLocked ? 'locked' : ''}`}
                onClick={() => setScaleLocked((l) => !l)}
                title="Lock calibration so scale cannot change while panning/tracing"
              >
                {scaleLocked ? <Lock size={13} /> : <Unlock size={13} />}
                {scaleLocked ? 'Scale Locked' : 'Lock Scale'}
              </button>
            </div>

            {/* Right Actions */}
            <div className="proj-group">
              <button
                type="button"
                className="proj-pill-btn"
                onClick={toggleBrowserFullscreen}
              >
                <Maximize2 size={13} />
                Fullscreen
              </button>
              <button
                type="button"
                className="proj-pill-btn"
                onClick={() => setHudCollapsed(true)}
                title="Hide toolbar for clean projection"
              >
                <EyeOff size={13} />
                Hide Bar
              </button>
              <button
                type="button"
                className="proj-pill-btn danger"
                onClick={onClose}
              >
                <X size={14} />
                Exit
              </button>
            </div>
          </div>

          {/* Second Row: Visual Tracing Mode, Grid, 10cm Target & Pan */}
          <div className="proj-hud-row secondary">
            <div className="proj-group">
              <span className="proj-group-label">Trace Mode:</span>
              <button
                type="button"
                className={`proj-pill-btn ${visualMode === 'outline-dark' ? 'active' : ''}`}
                onClick={() => setVisualMode('outline-dark')}
              >
                Neon Lines (Best)
              </button>
              <button
                type="button"
                className={`proj-pill-btn ${visualMode === 'stencil' ? 'active' : ''}`}
                onClick={() => setVisualMode('stencil')}
              >
                Colour Zones
              </button>
              <button
                type="button"
                className={`proj-pill-btn ${visualMode === 'outline-light' ? 'active' : ''}`}
                onClick={() => setVisualMode('outline-light')}
              >
                Black on White
              </button>
            </div>

            <div className="proj-group">
              <button
                type="button"
                className={`proj-pill-btn ${showCalibBox ? 'active' : ''}`}
                onClick={() => setShowCalibBox((v) => !v)}
              >
                <Ruler size={13} />
                10 cm Target Square
              </button>
              <button
                type="button"
                className={`proj-pill-btn ${showGrid ? 'active' : ''}`}
                onClick={() => setShowGrid((v) => !v)}
              >
                <Grid size={13} />
                10 cm Grid
              </button>
              <button
                type="button"
                className={`proj-pill-btn ${showHemMargin ? 'active' : ''}`}
                onClick={() => setShowHemMargin((v) => !v)}
              >
                4 cm Hem Border
              </button>
              <button
                type="button"
                className={`proj-pill-btn ${mirror ? 'active' : ''}`}
                onClick={onToggleMirror}
              >
                <FlipHorizontal size={13} />
                {mirror ? 'Mirrored ✓' : 'Un-Mirrored'}
              </button>
            </div>

            {/* 10 cm Step Pan Controls (For Large Rugs!) */}
            <div className="proj-group">
              <span className="proj-group-label">Pan 10cm:</span>
              <button type="button" className="proj-step-btn" onClick={() => panByCm(10, 0)} title="Pan Left 10cm">
                <ArrowLeft size={13} />
              </button>
              <button type="button" className="proj-step-btn" onClick={() => panByCm(0, 10)} title="Pan Up 10cm">
                <ArrowUp size={13} />
              </button>
              <button type="button" className="proj-step-btn" onClick={() => panByCm(0, -10)} title="Pan Down 10cm">
                <ArrowDown size={13} />
              </button>
              <button type="button" className="proj-step-btn" onClick={() => panByCm(-10, 0)} title="Pan Right 10cm">
                <ArrowRight size={13} />
              </button>
              <button
                type="button"
                className="proj-pill-btn"
                onClick={() => setPan({ x: 0, y: 0 })}
                title="Re-center projection"
              >
                <RotateCcw size={12} />
                Center
              </button>
              {!scaleLocked && (
                <button
                  type="button"
                  className="proj-pill-btn"
                  onClick={fitEntireRugOnScreen}
                >
                  Fit Screen
                </button>
              )}
            </div>
          </div>

          <div className="proj-calib-hint">
            <strong>How to get exact 1:1 scale on your monk&apos;s cloth:</strong> Hold a real tape measure against the glowing{' '}
            <strong style={{ color: '#00ffcc' }}>10.0 cm × 10.0 cm square</strong> on your cloth and adjust{' '}
            <strong>1:1 Scale Calibration</strong> until it measures exactly <strong>10 cm</strong> — then click{' '}
            <strong>Lock Scale</strong> and trace! (Drag anywhere to pan large rugs in sections.)
          </div>
        </div>
      )}

      {/* TRUE-SCALE PROJECTION STAGE */}
      <div className="proj-stage">
        <div
          className="proj-rug-frame"
          style={{
            width: `${rugWidthPx}px`,
            height: `${rugHeightPx}px`,
            transform: `translate(${pan.x}px, ${pan.y}px)`,
            outline: `2.5px solid ${frameStroke}`,
          }}
        >
          {/* Optional 4 cm Outer Monk's Cloth Hemming / Cut Allowance */}
          {showHemMargin && (
            <div
              style={{
                position: 'absolute',
                left: -hemPx,
                top: -hemPx,
                right: -hemPx,
                bottom: -hemPx,
                border: `2px dashed ${isLightBg ? 'rgba(209,31,62,0.55)' : 'rgba(255,180,0,0.65)'}`,
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  color: isLightBg ? '#b31935' : '#ffc43d',
                }}
              >
                +4 cm Hem Margin ({widthCm + 8} × {heightCm + 8} cm cloth)
              </span>
            </div>
          )}

          {/* Top & Left Physical Dimension Labels */}
          <div
            className="proj-dim-banner top"
            style={{ color: frameStroke }}
          >
            ← {widthCm} cm ({(widthCm / 2.54).toFixed(1)} in) →
          </div>
          <div
            className="proj-dim-banner left"
            style={{ color: frameStroke }}
          >
            ↑ {heightCm} cm ({(heightCm / 2.54).toFixed(1)} in) ↓
          </div>

          {/* Exact Width x Height Stencil Image */}
          <img
            src={visualMode === 'stencil' ? stencilUrl : outlineUrl || stencilUrl}
            alt="True-scale rug projection"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              display: 'block',
              filter: visualMode === 'outline-light' ? 'invert(1) contrast(1.6)' : 'none',
            }}
          />

          {/* 10 cm Physical Grid + Registration Crosshairs */}
          {showGrid && (
            <svg
              width={rugWidthPx}
              height={rugHeightPx}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
              {gridLines.vLines.map((cmVal) => {
                const x = cmVal * pxPerCm;
                return (
                  <g key={`v-${cmVal}`}>
                    <line
                      x1={x}
                      y1={0}
                      x2={x}
                      y2={rugHeightPx}
                      stroke={gridStroke}
                      strokeWidth={cmVal % 20 === 0 ? 1.5 : 0.8}
                      strokeDasharray={cmVal % 20 === 0 ? 'none' : '4 4'}
                    />
                    <text
                      x={x + 4}
                      y={14}
                      fill={frameStroke}
                      fontSize="11"
                      fontWeight="700"
                    >
                      {cmVal}
                    </text>
                  </g>
                );
              })}

              {gridLines.hLines.map((cmVal) => {
                const y = cmVal * pxPerCm;
                return (
                  <g key={`h-${cmVal}`}>
                    <line
                      x1={0}
                      y1={y}
                      x2={rugWidthPx}
                      y2={y}
                      stroke={gridStroke}
                      strokeWidth={cmVal % 20 === 0 ? 1.5 : 0.8}
                      strokeDasharray={cmVal % 20 === 0 ? 'none' : '4 4'}
                    />
                    <text
                      x={4}
                      y={y - 4}
                      fill={frameStroke}
                      fontSize="11"
                      fontWeight="700"
                    >
                      {cmVal}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}

          {/* 10.0 cm x 10.0 cm Physical Tape-Measure Calibration Target Square */}
          {showCalibBox && (
            <div
              className="proj-calib-square"
              style={{
                width: `${tenCmPx}px`,
                height: `${tenCmPx}px`,
              }}
            >
              <span>10.0 × 10.0 cm</span>
              <small>Measure on cloth</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
