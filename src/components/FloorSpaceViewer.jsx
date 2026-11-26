import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  ImagePlus,
  MessageCircle,
  RotateCcw,
} from 'lucide-react';
import { buildWhatsAppUrl, formatKES } from '../data/tuftlyConfig';

export default function FloorSpaceViewer({ onBackToSite }) {
  const params = new URLSearchParams(window.location.search);
  const widthCm = Number(params.get('w')) || 100;
  const heightCm = Number(params.get('h')) || 70;
  const clientName = params.get('client') || '';
  const priceKES = Number(params.get('price')) || 0;
  const qid = params.get('qid') || '';
  const urlImg = params.get('img') || '';

  const [rugSrc, setRugSrc] = useState(() => {
    if (qid) {
      try {
        const cached = window.localStorage.getItem(`tuftly_quote_img_${qid}`);
        if (cached) return cached;
      } catch {
        // ignore
      }
    }
    return urlImg || '/images/rug-savanna-contour.jpg';
  });

  const [unit, setUnit] = useState('cm');
  const [cameraActive, setCameraActive] = useState(false);
  const [roomPhoto, setRoomPhoto] = useState('');
  const [cameraError, setCameraError] = useState('');

  // Interactive floor placement transform
  const [pos, setPos] = useState({ x: 0, y: 80 });
  const [scale, setScale] = useState(1.0);
  const [tilt, setTilt] = useState(52);
  const [rotateZ, setRotateZ] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const dragRef = useRef(null);
  const roomInputRef = useRef(null);
  const rugInputRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => () => stopCamera(), []);

  const startFloorCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      setRoomPhoto('');
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch {
      setCameraError(
        'Camera access is unavailable on this device/browser — upload a photo of your floor below instead!'
      );
    }
  };

  const handleRoomUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    setRoomPhoto(URL.createObjectURL(file));
  };

  const handleRugUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRugSrc(URL.createObjectURL(file));
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({
      x: dragRef.current.origX + dx,
      y: dragRef.current.origY + dy,
    });
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const sizeText =
    unit === 'in'
      ? `${Math.round(widthCm / 2.54)} × ${Math.round(heightCm / 2.54)} in`
      : `${widthCm} × ${heightCm} cm`;

  const approveWaUrl = buildWhatsAppUrl(
    `Hello Tuftly!${clientName ? ` This is ${clientName}.` : ''} I just previewed my ${widthCm} × ${heightCm} cm rug in my space${
      priceKES ? ` (${formatKES(priceKES)})` : ''
    } and would love to proceed with the order!`
  );

  const inSpaceMode = cameraActive || Boolean(roomPhoto);

  return (
    <div
      className="space-viewer-page"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Top Bar */}
      <header className="space-viewer-topbar">
        <button
          type="button"
          className="space-back-btn"
          onClick={() => {
            stopCamera();
            onBackToSite();
          }}
        >
          <ArrowLeft size={16} />
          Tuftly Store
        </button>

        <div className="space-brand-pill">
          <img src="/images/tuftly-logo.jpg" alt="Tuftly" />
          <span>TUFTLY FLOOR PREVIEW</span>
        </div>
      </header>

      {!inSpaceMode ? (
        /* Entry Card — Matching "See this rug in your space" from the Video! */
        <main className="space-entry-main">
          <h1 className="space-title">See this rug in your space</h1>
          <p className="space-sub">
            Tap the button below, then point your phone camera at your floor.
          </p>

          <div className="space-rug-card" onClick={startFloorCamera} role="button" tabIndex={0}>
            <img src={rugSrc} alt="Custom Tuftly rug preview" />
            <button type="button" className="space-cta-pill" onClick={startFloorCamera}>
              <Camera size={19} />
              See it in my space
            </button>
          </div>

          {cameraError && <p className="space-error">{cameraError}</p>}

          <div className="space-size-bar">
            <span>Rug size {sizeText}</span>
            <div className="unit-toggle-pill dark">
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

          <div className="space-alt-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ color: '#fbf8f3', borderColor: 'rgba(251,248,243,0.28)' }}
              onClick={() => roomInputRef.current?.click()}
            >
              <ImagePlus size={15} />
              Or Upload Floor Photo
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ color: '#fbf8f3', borderColor: 'rgba(251,248,243,0.28)' }}
              onClick={() => rugInputRef.current?.click()}
            >
              Swap Rug Image
            </button>
            <a
              href={approveWaUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm"
            >
              <MessageCircle size={15} />
              Approve Quote on WhatsApp
            </a>
          </div>
        </main>
      ) : (
        /* Live Interactive 3D Floor AR Stage */
        <main className="space-ar-stage">
          {cameraActive ? (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="space-bg-media"
            />
          ) : (
            <img src={roomPhoto} alt="Your room floor" className="space-bg-media" />
          )}

          {/* Draggable 3D Perspective-Tilted Rug */}
          <div
            className="space-draggable-rug"
            onPointerDown={onPointerDown}
            style={{
              transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) perspective(950px) rotateX(${tilt}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
            }}
          >
            <img src={rugSrc} alt="Rug on floor" draggable={false} />
          </div>

          {/* Floating Bottom AR Controls */}
          <div className="space-ar-controls">
            <div className="space-ar-sliders">
              <label>
                <span>Size</span>
                <input
                  type="range"
                  min={0.35}
                  max={1.9}
                  step={0.03}
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                />
              </label>
              <label>
                <span>Floor Tilt</span>
                <input
                  type="range"
                  min={0}
                  max={68}
                  value={tilt}
                  onChange={(e) => setTilt(Number(e.target.value))}
                />
              </label>
              <label>
                <span>Rotate</span>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={rotateZ}
                  onChange={(e) => setRotateZ(Number(e.target.value))}
                />
              </label>
            </div>

            <div className="space-ar-btns">
              <button
                type="button"
                className="btn btn-sm btn-outline"
                style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={() => {
                  setPos({ x: 0, y: 80 });
                  setScale(1);
                  setTilt(52);
                  setRotateZ(0);
                }}
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={() => {
                  stopCamera();
                  setRoomPhoto('');
                }}
              >
                Exit AR
              </button>
              <a
                href={approveWaUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-rose"
              >
                <MessageCircle size={15} />
                Order {sizeText}
              </a>
            </div>
          </div>
        </main>
      )}

      <input
        ref={roomInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleRoomUpload}
      />
      <input
        ref={rugInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleRugUpload}
      />
    </div>
  );
}
