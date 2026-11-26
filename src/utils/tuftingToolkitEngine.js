import QRCode from 'qrcode';
import { loadImageElement } from './posterCanvas';

/**
 * Quantizes an image into `numColors` flat yarn regions via fast K-Means,
 * computes exact area % per colour for the Yarn Calculator, and renders both:
 *  1) A clean Tufting Stencil (optionally mirrored for back-of-frame projection)
 *  2) A realistic Plush Hand-Tufted Wool Rug preview with carved 3D bevels & fiber grain
 */
export async function processDesignToStencilAndRug(
  imageSrc,
  { numColors = 8, mirror = true, maxDim = 520 } = {}
) {
  const img = await loadImageElement(imageSrc);
  let w = img.width;
  let h = img.height;
  if (w > maxDim || h > maxDim) {
    if (w >= h) {
      h = Math.max(64, Math.round((h * maxDim) / w));
      w = maxDim;
    } else {
      w = Math.max(64, Math.round((w * maxDim) / h));
      h = maxDim;
    }
  }

  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = w;
  srcCanvas.height = h;
  const sctx = srcCanvas.getContext('2d');
  if (mirror) {
    sctx.translate(w, 0);
    sctx.scale(-1, 1);
  }
  sctx.drawImage(img, 0, 0, w, h);
  const srcData = sctx.getImageData(0, 0, w, h).data;

  // Sample pixels for fast K-Means clustering (stride 3)
  const samples = [];
  for (let i = 0; i < srcData.length; i += 12) {
    if (srcData[i + 3] >= 120) {
      samples.push([srcData[i], srcData[i + 1], srcData[i + 2]]);
    }
  }

  const k = Math.max(2, Math.min(12, Number(numColors) || 8));
  if (samples.length === 0) {
    throw new Error('Image appears completely transparent.');
  }

  // Deterministic K-Means++ style spread initialization
  const centroids = [samples[Math.floor(samples.length / 2)].slice()];
  while (centroids.length < k) {
    let bestSample = samples[0];
    let bestDist = -1;
    const step = Math.max(1, Math.floor(samples.length / 180));
    for (let i = 0; i < samples.length; i += step) {
      const s = samples[i];
      let minD = Infinity;
      for (const c of centroids) {
        const d = (s[0] - c[0]) ** 2 + (s[1] - c[1]) ** 2 + (s[2] - c[2]) ** 2;
        if (d < minD) minD = d;
      }
      if (minD > bestDist) {
        bestDist = minD;
        bestSample = s;
      }
    }
    centroids.push(bestSample.slice());
  }

  // 7 fast K-Means iterations
  for (let iter = 0; iter < 7; iter += 1) {
    const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
    for (let i = 0; i < samples.length; i += 1) {
      const p = samples[i];
      let bestIdx = 0;
      let bestD = Infinity;
      for (let c = 0; c < k; c += 1) {
        const cen = centroids[c];
        const d = (p[0] - cen[0]) ** 2 + (p[1] - cen[1]) ** 2 + (p[2] - cen[2]) ** 2;
        if (d < bestD) {
          bestD = d;
          bestIdx = c;
        }
      }
      sums[bestIdx][0] += p[0];
      sums[bestIdx][1] += p[1];
      sums[bestIdx][2] += p[2];
      sums[bestIdx][3] += 1;
    }
    for (let c = 0; c < k; c += 1) {
      if (sums[c][3] > 0) {
        centroids[c][0] = Math.round(sums[c][0] / sums[c][3]);
        centroids[c][1] = Math.round(sums[c][1] / sums[c][3]);
        centroids[c][2] = Math.round(sums[c][2] / sums[c][3]);
      }
    }
  }

  // Assign every pixel + smooth isolated 1px speckles with a quick majority pass
  const totalPixels = w * h;
  const rawLabels = new Uint8Array(totalPixels);
  const opaqueMask = new Uint8Array(totalPixels);

  for (let idx = 0; idx < totalPixels; idx += 1) {
    const off = idx * 4;
    if (srcData[off + 3] < 120) continue;
    opaqueMask[idx] = 1;
    const r = srcData[off];
    const g = srcData[off + 1];
    const b = srcData[off + 2];
    let bestIdx = 0;
    let bestD = Infinity;
    for (let c = 0; c < k; c += 1) {
      const cen = centroids[c];
      const d = (r - cen[0]) ** 2 + (g - cen[1]) ** 2 + (b - cen[2]) ** 2;
      if (d < bestD) {
        bestD = d;
        bestIdx = c;
      }
    }
    rawLabels[idx] = bestIdx;
  }

  // 3x3 mode smoothing so stencil regions look clean and tuftable
  const labels = new Uint8Array(rawLabels);
  const countsTmp = new Uint8Array(k);
  for (let y = 1; y < h - 1; y += 1) {
    for (let x = 1; x < w - 1; x += 1) {
      const idx = y * w + x;
      if (!opaqueMask[idx]) continue;
      countsTmp.fill(0);
      let topC = rawLabels[idx];
      let topV = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        const rowOff = (y + dy) * w + x;
        for (let dx = -1; dx <= 1; dx += 1) {
          const lb = rawLabels[rowOff + dx];
          const nv = countsTmp[lb] + 1;
          countsTmp[lb] = nv;
          if (nv > topV) {
            topV = nv;
            topC = lb;
          }
        }
      }
      labels[idx] = topC;
    }
  }

  // Count pixel coverage per colour
  const pixelCounts = new Array(k).fill(0);
  let activeOpaque = 0;
  for (let idx = 0; idx < totalPixels; idx += 1) {
    if (opaqueMask[idx]) {
      pixelCounts[labels[idx]] += 1;
      activeOpaque += 1;
    }
  }

  // Build STENCIL canvas (clean flat regions + crisp contour guide lines)
  const stencilCanvas = document.createElement('canvas');
  stencilCanvas.width = w;
  stencilCanvas.height = h;
  const stCtx = stencilCanvas.getContext('2d');
  const stImg = stCtx.createImageData(w, h);

  // Build RUG PREVIEW canvas (un-mirrored so customer sees true front orientation! + wool tuft texture & carved bevels)
  const rugCanvas = document.createElement('canvas');
  rugCanvas.width = w;
  rugCanvas.height = h;
  const rgCtx = rugCanvas.getContext('2d');
  const rgImg = rgCtx.createImageData(w, h);

  let seed = 1337;
  const nextRand = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return (seed & 0xffff) / 0xffff - 0.5;
  };

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const idx = y * w + x;
      const stOff = idx * 4;

      if (!opaqueMask[idx]) {
        stImg.data[stOff + 3] = 0;
        continue;
      }

      const cIdx = labels[idx];
      const [cr, cg, cb] = centroids[cIdx];

      // Detect region boundary for stencil outline & carved rug bevel
      let isEdge = false;
      if (x > 0 && x < w - 1 && y > 0 && y < h - 1) {
        if (
          labels[idx - 1] !== cIdx ||
          labels[idx + 1] !== cIdx ||
          labels[idx - w] !== cIdx ||
          labels[idx + w] !== cIdx
        ) {
          isEdge = true;
        }
      }

      // Stencil pixel
      if (isEdge) {
        stImg.data[stOff] = Math.max(0, cr - 55);
        stImg.data[stOff + 1] = Math.max(0, cg - 55);
        stImg.data[stOff + 2] = Math.max(0, cb - 55);
      } else {
        stImg.data[stOff] = cr;
        stImg.data[stOff + 1] = cg;
        stImg.data[stOff + 2] = cb;
      }
      stImg.data[stOff + 3] = 255;

      // Rug pixel (un-mirror x if stencil was mirrored, so rug preview reads forward!)
      const rx = mirror ? w - 1 - x : x;
      const rgOff = (y * w + rx) * 4;

      // Tactile wool micro-loop & fiber shadow modulation
      const tuftLoop =
        Math.sin(rx * 1.9 + y * 0.4) * 7 +
        Math.cos(y * 1.9 - rx * 0.4) * 7 +
        nextRand() * 20;
      const bevelShade = isEdge ? -28 : 0;
      const delta = tuftLoop + bevelShade;

      rgImg.data[rgOff] = Math.max(0, Math.min(255, Math.round(cr + delta)));
      rgImg.data[rgOff + 1] = Math.max(0, Math.min(255, Math.round(cg + delta)));
      rgImg.data[rgOff + 2] = Math.max(0, Math.min(255, Math.round(cb + delta)));
      rgImg.data[rgOff + 3] = 255;
    }
  }

  stCtx.putImageData(stImg, 0, 0);
  rgCtx.putImageData(rgImg, 0, 0);

  // Build sorted colour breakdown (largest yarn area first)
  const colors = centroids
    .map(([r, g, b], idx) => {
      const hex = `#${[r, g, b]
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')}`;
      const ratio = activeOpaque > 0 ? pixelCounts[idx] / activeOpaque : 0;
      return {
        id: `color-${idx}`,
        hex,
        ratio,
      };
    })
    .filter((c) => c.ratio > 0.002)
    .sort((a, b) => b.ratio - a.ratio)
    .map((c, i) => ({
      ...c,
      name: `Colour ${i + 1}`,
    }));

  return {
    aspectRatio: img.width / img.height,
    stencilDataUrl: stencilCanvas.toDataURL('image/png'),
    rugPreviewDataUrl: rugCanvas.toDataURL('image/jpeg', 0.92),
    colors,
  };
}

/**
 * Calculates grams, roll count, and KSh cost per yarn colour for a given rug size.
 * Default cut-pile tufting density ~ 1,350 g/m² (matching industry tufting gun usage).
 */
export function calculateYarnRequirements({
  colors = [],
  widthCm = 80,
  heightCm = 60,
  gramsPerSqm = 1350,
  gramsPerRoll = 100,
  pricePerRoll = 280,
}) {
  const areaSqm = Math.max(0.04, (Number(widthCm) / 100) * (Number(heightCm) / 100));
  const totalGramsEstimate = Math.round(areaSqm * Number(gramsPerSqm));
  const rollWeight = Math.max(10, Number(gramsPerRoll) || 100);
  const unitPrice = Math.max(0, Number(pricePerRoll) || 0);

  let totalRolls = 0;
  let totalYarnCost = 0;

  const rows = colors.map((c) => {
    const grams = Math.max(2, Math.round(totalGramsEstimate * c.ratio));
    const rolls = Math.max(1, Math.ceil(grams / rollWeight));
    const cost = rolls * unitPrice;
    totalRolls += rolls;
    totalYarnCost += cost;
    return {
      ...c,
      grams,
      rolls,
      cost,
      percent: Math.round(c.ratio * 1000) / 10,
    };
  });

  // Backing cloth + latex glue estimate (~KSh 1,200 per m²)
  const backingEstimate = Math.round((areaSqm * 1200) / 50) * 50;
  const totalMaterialCost = totalYarnCost + backingEstimate;

  return {
    areaSqm,
    totalGrams: totalGramsEstimate,
    totalRolls,
    totalYarnCost,
    backingEstimate,
    totalMaterialCost,
    suggestedRetail: Math.max(
      1500,
      Math.round((totalMaterialCost * 2.6 + 1200) / 100) * 100
    ),
    rows,
  };
}

/**
 * Builds the shareable "/preview" URL for the QR code so scanning the quote
 * opens the "See this rug in your space" floor camera viewer on any phone.
 */
export function buildSpacePreviewUrl({
  quoteId,
  widthCm,
  heightCm,
  customerName,
  priceKES,
  publicImageUrl,
  colors = [],
}) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://tuftly.vercel.app';
  const params = new URLSearchParams();
  params.set('w', String(Math.round(widthCm || 100)));
  params.set('h', String(Math.round(heightCm || 70)));
  if (quoteId) params.set('qid', quoteId);
  if (customerName) params.set('client', customerName.slice(0, 32));
  if (priceKES) params.set('price', String(Math.round(priceKES)));
  if (publicImageUrl && /^https?:\/\/|^\//.test(publicImageUrl)) {
    params.set('img', publicImageUrl);
  }
  if (colors.length) {
    params.set(
      'pal',
      colors
        .slice(0, 6)
        .map((c) => c.hex.replace('#', ''))
        .join('-')
    );
  }
  return `${origin}/preview?${params.toString()}`;
}

/**
 * Renders the branded Tuftly Client Quote Sheet (1240 x 1754 portrait sheet)
 * with Tuftly logo, client details, realistic rug preview, all yarn colours,
 * KSh pricing + 50% M-Pesa deposit, and scannable Floor Preview QR Code.
 */
export async function renderClientQuoteToCanvas(canvas, quote) {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const qrUrl = buildSpacePreviewUrl(quote);
  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    width: 240,
    margin: 1,
    color: {
      dark: '#1E1A16',
      light: '#FFFDF9',
    },
  });

  const [logoImg, rugImg, qrImg] = await Promise.all([
    loadImageElement('/images/tuftly-logo.jpg'),
    loadImageElement(quote.rugImage),
    loadImageElement(qrDataUrl),
  ]);

  const W = 1240;
  const H = 1754;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background paper
  ctx.fillStyle = '#FBF8F3';
  ctx.fillRect(0, 0, W, H);

  // Top olive-rose-gold bar
  const topGrad = ctx.createLinearGradient(0, 0, W, 0);
  topGrad.addColorStop(0, '#58622D');
  topGrad.addColorStop(0.55, '#C2737A');
  topGrad.addColorStop(1, '#D5B075');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, W, 14);

  const pad = 76;

  // Header: Logo + Studio Name + QUOTE badge
  ctx.save();
  ctx.beginPath();
  ctx.arc(pad + 44, 110, 44, 0, Math.PI * 2);
  ctx.fillStyle = '#C2737A';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(pad + 44, 110, 40, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(logoImg, pad + 4, 70, 80, 80);
  ctx.restore();

  ctx.fillStyle = '#1E1A16';
  ctx.font = '700 44px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(quote.studioName || 'TUFTLY', pad + 106, 108);

  ctx.fillStyle = '#C2737A';
  ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    (quote.studioTagline || 'BESPOKE TUFTING ATELIER · NAIROBI, KENYA').toUpperCase(),
    pad + 108,
    132
  );

  ctx.textAlign = 'right';
  ctx.fillStyle = '#1E1A16';
  ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CLIENT QUOTE', W - pad, 104);

  const todayStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  ctx.fillStyle = '#6E6459';
  ctx.font = '500 17px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    `Date: ${todayStr}  ·  Valid: ${quote.validDays || 14} days`,
    W - pad,
    134
  );
  ctx.textAlign = 'left';

  // Divider
  ctx.strokeStyle = 'rgba(30, 26, 22, 0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, 182);
  ctx.lineTo(W - pad, 182);
  ctx.stroke();

  // Client Greeting Row
  ctx.fillStyle = '#6E6459';
  ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PREPARED FOR', pad, 222);

  ctx.fillStyle = '#1E1A16';
  ctx.font = '700 34px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(quote.customerName || 'Valued Client', pad, 260);

  if (quote.notes) {
    ctx.textAlign = 'right';
    ctx.fillStyle = '#58622D';
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(quote.notes.slice(0, 68), W - pad, 254);
    ctx.textAlign = 'left';
  }

  // Center Framed Rug Preview Box (y = 292 .. 1082)
  const boxX = pad;
  const boxY = 292;
  const boxW = W - pad * 2;
  const boxH = 770;

  ctx.fillStyle = '#F2EBE0';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 28);
  ctx.fill();

  // Fit rug image cleanly inside box preserving true aspect ratio!
  const innerPad = 38;
  const maxRW = boxW - innerPad * 2;
  const maxRH = boxH - innerPad * 2;
  const rScale = Math.min(maxRW / rugImg.width, maxRH / rugImg.height);
  const rw = rugImg.width * rScale;
  const rh = rugImg.height * rScale;
  const rx = boxX + (boxW - rw) / 2;
  const ry = boxY + (boxH - rh) / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(30, 26, 22, 0.24)';
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 16;
  ctx.beginPath();
  ctx.roundRect(rx, ry, rw, rh, 18);
  ctx.clip();
  ctx.drawImage(rugImg, rx, ry, rw, rh);
  ctx.restore();

  // Bottom Specs + Colours + QR Code Grid (y = 1106 .. 1465)
  const specY = 1115;

  // Column 1: Specifications
  ctx.fillStyle = '#847A6E';
  ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SPECIFICATIONS', pad, specY);

  const wIn = Math.round((Number(quote.widthCm) || 100) / 2.54);
  const hIn = Math.round((Number(quote.heightCm) || 70) / 2.54);

  const specRows = [
    ['Dimensions', `${quote.widthCm} × ${quote.heightCm} cm (${wIn} × ${hIn} in)`],
    ['Yarn Colours', `${quote.colors?.length || 1} Hand-Tufted Shades`],
    ['Crafting Time', quote.deliveryTime || '10 – 14 days'],
    ['Pile & Backing', 'Plush 3D Wool · Non-Slip Backing'],
  ];

  specRows.forEach(([label, val], idx) => {
    const ryPos = specY + 40 + idx * 44;
    ctx.fillStyle = '#6E6459';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(label, pad, ryPos);
    ctx.fillStyle = '#1E1A16';
    ctx.font = '700 19px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(val, pad + 150, ryPos);
  });

  // Column 2: Yarn Colours Swatch List (up to 10 colours in 2 mini columns)
  const col2X = 635;
  ctx.fillStyle = '#847A6E';
  ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('YARN PALETTE', col2X, specY);

  const displayColors = (quote.colors || []).slice(0, 10);
  displayColors.forEach((c, idx) => {
    const subCol = Math.floor(idx / 5);
    const row = idx % 5;
    const cx = col2X + subCol * 165;
    const cy = specY + 34 + row * 38;

    ctx.fillStyle = c.hex;
    ctx.beginPath();
    ctx.arc(cx + 11, cy - 6, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(30,26,22,0.18)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#1E1A16';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(c.name || `Colour ${idx + 1}`, cx + 30, cy);
  });

  // Column 3: QR Code ("Scan to see this rug on your own floor")
  const qrBoxSize = 186;
  const qrX = W - pad - qrBoxSize;
  const qrY = specY - 6;

  ctx.fillStyle = '#FFFDF9';
  ctx.strokeStyle = 'rgba(30,26,22,0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(qrX - 10, qrY - 10, qrBoxSize + 20, qrBoxSize + 20, 18);
  ctx.fill();
  ctx.stroke();

  ctx.drawImage(qrImg, qrX, qrY, qrBoxSize, qrBoxSize);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#58622D';
  ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Scan to see this rug', qrX + qrBoxSize / 2, qrY + qrBoxSize + 30);
  ctx.fillText('on your own floor', qrX + qrBoxSize / 2, qrY + qrBoxSize + 48);
  ctx.textAlign = 'left';

  // Bottom Total Investment & Payment Terms Card (y = 1490 .. 1678)
  const footY = 1492;
  const footH = 186;
  ctx.fillStyle = '#1E1A16';
  ctx.beginPath();
  ctx.roundRect(pad, footY, W - pad * 2, footH, 28);
  ctx.fill();

  const totalPrice = Number(quote.priceKES) || 15000;
  const deposit = Math.round(totalPrice / 2);

  ctx.fillStyle = '#E0979C';
  ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TOTAL CUSTOM INVESTMENT', pad + 42, footY + 48);

  ctx.fillStyle = '#FFFDF9';
  ctx.font = '700 62px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(`KSh ${totalPrice.toLocaleString('en-KE')}`, pad + 42, footY + 114);

  ctx.fillStyle = '#D5C7B4';
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    `50% Deposit to Begin: KSh ${deposit.toLocaleString('en-KE')}  ·  50% Balance Upon Completion`,
    pad + 42,
    footY + 152
  );

  // Right WhatsApp Contact Badge inside Footer
  ctx.textAlign = 'right';
  ctx.fillStyle = '#A8B868';
  ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`WhatsApp ${quote.whatsapp || '0118 899 336'}`, W - pad - 42, footY + 92);

  ctx.fillStyle = '#D5C7B4';
  ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('M-Pesa & Bank Transfer Accepted', W - pad - 42, footY + 124);
  ctx.textAlign = 'left';

  return { qrUrl };
}
