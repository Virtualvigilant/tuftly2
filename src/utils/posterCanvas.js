/**
 * TUFTLY 1080x1920 ROUNDED-CORNER PNG STATUS POSTER ENGINE
 * --------------------------------------------------------
 * Renders the exact Tuftly Edition Status Card onto an HTML5 <canvas>
 * with true alpha-transparent 56px rounded outer corners, crisp Google Fonts,
 * yarn swatch pill, top-left Tuftly medallion, and bottom WhatsApp concierge bar.
 */

const W = 1080;
const H = 1920;

const C = {
  creamCard: '#FBF8F3',
  espresso: '#1E1A16',
  inkMuted: '#5F554B',
  rose: '#C2737A',
  olive: '#58622D',
  gold: '#D5B075',
  white: '#FFFDF9',
};

const imageCache = new Map();

export function loadImageElement(src) {
  if (!src) return Promise.reject(new Error('Missing image source'));
  if (imageCache.has(src)) return Promise.resolve(imageCache.get(src));

  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith('data:') && !src.startsWith('blob:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Could not load image: ${src}`));
    img.src = src;
  });
}

/**
 * Extracts 3 distinct, visually pleasing yarn palette colours from an image
 * using lightweight colour-bucket clustering so uploaded photos immediately
 * get matching 3-dot yarn swatches.
 */
export async function extractYarnPalette(imageSrc) {
  try {
    const img = await loadImageElement(imageSrc);
    const sampleSize = 64;
    const cnv = document.createElement('canvas');
    cnv.width = sampleSize;
    cnv.height = sampleSize;
    const ctx = cnv.getContext('2d');
    // Sample central 75% where the rug/bag sits
    const sx = img.width * 0.125;
    const sy = img.height * 0.125;
    const sw = img.width * 0.75;
    const sh = img.height * 0.75;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sampleSize, sampleSize);
    const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);

    const buckets = new Map();
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const key = `${Math.round(r / 32)},${Math.round(g / 32)},${Math.round(b / 32)}`;
      const prev = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0 };
      prev.count += 1;
      prev.r += r;
      prev.g += g;
      prev.b += b;
      buckets.set(key, prev);
    }

    const sorted = [...buckets.values()]
      .map((b) => {
        const r = Math.round(b.r / b.count);
        const g = Math.round(b.g / b.count);
        const bl = Math.round(b.b / b.count);
        const max = Math.max(r, g, bl);
        const min = Math.min(r, g, bl);
        const sat = max === 0 ? 0 : (max - min) / max;
        // Boost slightly saturated yarn tones so floors don't dominate all 3 dots
        return { r, g, b: bl, score: b.count * (1 + sat * 1.35) };
      })
      .sort((a, b) => b.score - a.score);

    const chosen = [];
    for (const cand of sorted) {
      const farEnough = chosen.every(
        (c) => Math.hypot(c.r - cand.r, c.g - cand.g, c.b - cand.b) > 58
      );
      if (farEnough) chosen.push(cand);
      if (chosen.length === 3) break;
    }

    while (chosen.length < 3) {
      chosen.push(sorted[chosen.length] || { r: 194, g: 115, b: 122 });
    }

    return chosen.map(
      (c) =>
        `#${[c.r, c.g, c.b]
          .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'))
          .join('')}`
    );
  } catch {
    return ['#F7F2E8', '#C2737A', '#58622D'];
  }
}

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawTrackedText(ctx, text, x, y, trackingPx, align = 'left') {
  const chars = [...String(text)];
  if (!chars.length) return 0;
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const totalWidth =
    widths.reduce((acc, w) => acc + w, 0) + trackingPx * Math.max(0, chars.length - 1);

  let cursorX = x;
  if (align === 'right') cursorX = x - totalWidth;
  if (align === 'center') cursorX = x - totalWidth / 2;

  for (let i = 0; i < chars.length; i += 1) {
    ctx.fillText(chars[i], cursorX, y);
    cursorX += widths[i] + trackingPx;
  }
  return totalWidth;
}

function wrapLines(ctx, text, maxWidth, maxLines = 2) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let current = words[0];

  for (let i = 1; i < words.length; i += 1) {
    const test = `${current} ${words[i]}`;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      lines.push(current);
      current = words[i];
      if (lines.length === maxLines - 1) {
        for (let j = i + 1; j < words.length; j += 1) {
          current += ` ${words[j]}`;
        }
        break;
      }
    }
  }
  lines.push(current);
  return lines.slice(0, maxLines);
}

export async function renderStatusPosterToCanvas(canvas, config) {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const [logoImg, productImg] = await Promise.all([
    loadImageElement('/images/tuftly-logo.jpg'),
    loadImageElement(config.image),
  ]);

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  // 1. Outer Rounded Card Clip (56px radius, transparent outside!)
  ctx.save();
  roundRectPath(ctx, 0, 0, W, H, 56);
  ctx.clip();

  // Warm Cream Background
  ctx.fillStyle = C.creamCard;
  ctx.fillRect(0, 0, W, H);

  // Subtle Monk's-Cloth Woven Texture Dots
  ctx.fillStyle = 'rgba(88, 98, 45, 0.045)';
  for (let y = 0; y < H; y += 26) {
    for (let x = 0; x < W; x += 26) {
      ctx.beginPath();
      ctx.arc(x, y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = 'rgba(194, 115, 122, 0.045)';
  for (let y = 13; y < H; y += 26) {
    for (let x = 13; x < W; x += 26) {
      ctx.beginPath();
      ctx.arc(x, y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Top Tri-Tone Accent Bar
  const topGrad = ctx.createLinearGradient(0, 0, W, 0);
  topGrad.addColorStop(0, C.olive);
  topGrad.addColorStop(0.55, C.rose);
  topGrad.addColorStop(1, C.gold);
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, W, 12);

  // 2. TOP HEADER ROW (Top-Left Tuftly Medallion + Top-Right Category Pill)
  const padX = 52;
  const headerCenterY = 126;

  // Logo gradient ring
  const logoCx = padX + 42;
  const logoCy = headerCenterY;
  ctx.save();
  ctx.shadowColor = 'rgba(30, 26, 22, 0.18)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;
  const ringGrad = ctx.createLinearGradient(logoCx - 42, logoCy - 42, logoCx + 42, logoCy + 42);
  ringGrad.addColorStop(0, C.rose);
  ringGrad.addColorStop(1, C.olive);
  ctx.fillStyle = ringGrad;
  ctx.beginPath();
  ctx.arc(logoCx, logoCy, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // White inner ring + Circular Logo
  ctx.fillStyle = C.white;
  ctx.beginPath();
  ctx.arc(logoCx, logoCy, 38.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(logoCx, logoCy, 36, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(logoImg, logoCx - 36, logoCy - 36, 72, 72);
  ctx.restore();

  // TUFTLY Wordmark + Subtitle
  ctx.fillStyle = C.espresso;
  ctx.font = '700 38px "Cormorant Garamond", Georgia, serif';
  ctx.textBaseline = 'alphabetic';
  drawTrackedText(ctx, 'TUFTLY', padX + 100, headerCenterY + 2, 4.8, 'left');

  ctx.fillStyle = C.rose;
  ctx.font = '700 12.5px "Plus Jakarta Sans", sans-serif';
  drawTrackedText(
    ctx,
    (config.brandSub || 'BESPOKE ATELIER').toUpperCase(),
    padX + 101,
    headerCenterY + 24,
    2.7,
    'left'
  );

  // Top-Right Edition Stamp + Category Pill
  const rightEdge = W - padX;
  ctx.fillStyle = C.inkMuted;
  ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
  drawTrackedText(
    ctx,
    `${(config.edition || 'EDITION 01').toUpperCase()} · KENYA`,
    rightEdge,
    headerCenterY - 18,
    2.5,
    'right'
  );

  const tagText = (config.categoryTag || 'CUSTOM RUGS').toUpperCase();
  ctx.font = '800 15.5px "Plus Jakarta Sans", sans-serif';
  const charWidths = [...tagText].map((c) => ctx.measureText(c).width);
  const tagTextW =
    charWidths.reduce((a, b) => a + b, 0) + 1.7 * Math.max(0, tagText.length - 1);
  const pillW = tagTextW + 44;
  const pillH = 40;
  const pillX = rightEdge - pillW;
  const pillY = headerCenterY - 6;

  const tagBg =
    config.tagTone === 'rose'
      ? C.rose
      : config.tagTone === 'espresso'
        ? C.espresso
        : C.olive;

  ctx.save();
  ctx.shadowColor = 'rgba(30, 26, 22, 0.24)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = tagBg;
  roundRectPath(ctx, pillX, pillY, pillW, pillH, 999);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = C.white;
  drawTrackedText(ctx, tagText, pillX + pillW / 2, pillY + 25.5, 1.7, 'center');

  // 3. CENTER HERO PHOTO WINDOW (976 x 1020)
  const imgX = padX;
  const imgY = 192;
  const imgW = W - padX * 2;
  const imgH = 1020;

  // White mat border + drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(30, 26, 22, 0.22)';
  ctx.shadowBlur = 44;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = C.white;
  roundRectPath(ctx, imgX, imgY, imgW, imgH, 34);
  ctx.fill();
  ctx.restore();

  // Inner Clipped Image with Focus X/Y & Zoom
  const inPad = 6;
  const ix = imgX + inPad;
  const iy = imgY + inPad;
  const iw = imgW - inPad * 2;
  const ih = imgH - inPad * 2;

  ctx.save();
  roundRectPath(ctx, ix, iy, iw, ih, 28);
  ctx.clip();
  ctx.fillStyle = '#E8DFD1';
  ctx.fillRect(ix, iy, iw, ih);

  const zoom = Number(config.zoom) || 1;
  const focusX = (Number(config.focusX ?? 50) / 100);
  const focusY = (Number(config.focusY ?? 50) / 100);

  const scale = Math.max(iw / productImg.width, ih / productImg.height) * zoom;
  const drawW = productImg.width * scale;
  const drawH = productImg.height * scale;
  const dx = ix + (iw - drawW) * focusX;
  const dy = iy + (ih - drawH) * focusY;
  ctx.drawImage(productImg, dx, dy, drawW, drawH);

  // Top-left photo watermark pill ("HAND-TUFTED TO ORDER")
  const cornerLabel = (config.photoBadge || 'HAND-TUFTED TO ORDER').toUpperCase();
  if (cornerLabel) {
    ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
    const cw =
      [...cornerLabel].reduce((acc, ch) => acc + ctx.measureText(ch).width, 0) +
      1.8 * Math.max(0, cornerLabel.length - 1) +
      34;
    ctx.fillStyle = 'rgba(30, 26, 22, 0.72)';
    roundRectPath(ctx, ix + 18, iy + 18, cw, 34, 999);
    ctx.fill();
    ctx.fillStyle = C.white;
    drawTrackedText(ctx, cornerLabel, ix + 18 + cw / 2, iy + 40, 1.8, 'center');
  }

  // Bottom-right 3-Dot Yarn Swatch Pill
  const swatchLabel = 'CUSTOM COLOURS';
  ctx.font = '800 12.5px "Plus Jakarta Sans", sans-serif';
  const swTextW =
    [...swatchLabel].reduce((acc, ch) => acc + ctx.measureText(ch).width, 0) +
    1.5 * (swatchLabel.length - 1);
  const swPillW = 68 + swTextW + 28;
  const swPillH = 38;
  const swPillX = ix + iw - swPillW - 18;
  const swPillY = iy + ih - swPillH - 18;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = 'rgba(255, 253, 249, 0.95)';
  roundRectPath(ctx, swPillX, swPillY, swPillW, swPillH, 999);
  ctx.fill();
  ctx.restore();

  const swatches = config.swatches?.length === 3 ? config.swatches : ['#F7F2E8', '#C2737A', '#58622D'];
  swatches.forEach((hex, idx) => {
    const cx = swPillX + 22 + idx * 16;
    const cy = swPillY + swPillH / 2;
    ctx.fillStyle = C.white;
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hex;
    ctx.beginPath();
    ctx.arc(cx, cy, 9.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = C.espresso;
  drawTrackedText(ctx, swatchLabel, swPillX + 74, swPillY + 23.5, 1.5, 'left');

  ctx.restore(); // end hero image clip

  // 4. EDITORIAL AD COPY BLOCK
  const copyTopY = 1360;

  // Rose dash + Olive Eyebrow
  ctx.fillStyle = C.rose;
  roundRectPath(ctx, padX + 4, copyTopY - 6, 32, 3, 2);
  ctx.fill();

  ctx.fillStyle = C.olive;
  ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
  drawTrackedText(
    ctx,
    (config.eyebrow || 'HANDCRAFTED BESPOKE PIECE').toUpperCase(),
    padX + 48,
    copyTopY,
    2.6,
    'left'
  );

  // Bold Sans Headline (auto-constrained to card width so long titles never clip)
  const maxCopyW = W - padX * 2 - 8;
  ctx.fillStyle = C.espresso;
  ctx.font = '800 52px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(config.headlineBold || 'Tailored To Your', padX + 4, copyTopY + 62, maxCopyW);

  // Italic Dusty-Rose Serif Headline
  ctx.fillStyle = C.rose;
  ctx.font = 'italic 700 60px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(config.headlineItalic || 'Exact Space & Style.', padX + 4, copyTopY + 122, maxCopyW);

  // Subline (wrapped cleanly up to 2 lines)
  ctx.fillStyle = C.inkMuted;
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  const subLines = wrapLines(ctx, config.subline || '', W - padX * 2 - 16, 2);
  subLines.forEach((ln, idx) => {
    ctx.fillText(ln, padX + 4, copyTopY + 166 + idx * 31);
  });

  // 5. BOTTOM SIGNATURE CONCIERGE CAPSULE
  const barY = H - 82 - 84;
  const barH = 84;
  const barW = W - padX * 2;

  ctx.save();
  ctx.shadowColor = 'rgba(30, 26, 22, 0.34)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 14;
  ctx.fillStyle = C.espresso;
  roundRectPath(ctx, padX, barY, barW, barH, 999);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = C.white;
  ctx.font = '800 19.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    config.ctaPrompt || 'Want This Piece? Reply "THIS"',
    padX + 32,
    barY + 38
  );

  ctx.fillStyle = '#D5C7B4';
  ctx.font = '500 13.5px "Plus Jakarta Sans", sans-serif';
  drawTrackedText(
    ctx,
    config.ctaSub || 'Any Size · Nationwide Delivery Across Kenya',
    padX + 32,
    barY + 60,
    0.7,
    'left'
  );

  // Right Olive WhatsApp Pill inside Bar
  const waText = `WhatsApp ${config.whatsappDisplay || '0118 899 336'}`;
  ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
  const waW = ctx.measureText(waText).width + 54;
  const waH = 54;
  const waX = padX + barW - waW - 15;
  const waY = barY + (barH - waH) / 2;

  ctx.fillStyle = C.olive;
  roundRectPath(ctx, waX, waY, waW, waH, 999);
  ctx.fill();

  ctx.fillStyle = C.white;
  ctx.fillText(waText, waX + 27, waY + 34);

  // Subtle Rounded Card Hairline Outline (so rounded silhouette pops on light viewers too)
  ctx.strokeStyle = 'rgba(30, 26, 22, 0.14)';
  ctx.lineWidth = 4;
  roundRectPath(ctx, 2, 2, W - 4, H - 4, 54);
  ctx.stroke();

  ctx.restore(); // end outer rounded card clip
}
