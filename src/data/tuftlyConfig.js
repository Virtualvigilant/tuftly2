/**
 * TUFTLY STUDIO CONFIGURATION & CATALOG
 * -------------------------------------
 * Update your WhatsApp number, Instagram handle, and prices here —
 * every ordering button across the website updates automatically.
 */

export const BRAND_CONFIG = {
  name: 'Tuftly',
  tagline: 'Bespoke Tufting Atelier',
  location: 'Nairobi, Kenya · Nationwide & East Africa Delivery',
  // WhatsApp number in international format (Kenya +254, leading 0 removed)
  whatsappNumber: '254118899336',
  // Replace with your real Instagram username (without @)
  instagramHandle: 'tuftly.atelier',
  email: 'hello@tuftly.co.ke',
  currency: 'KSh',
  hours: 'Mon – Sat · 9:00 AM – 6:00 PM EAT',
  depositNote: '50% deposit via M-Pesa or Bank Transfer to begin crafting',
  // Passcode to unlock the Studio Admin page (visit /#admin)
  adminPasscode: 'tuftly2026',
};

export function formatKES(amount) {
  return `KSh ${Number(amount).toLocaleString('en-KE')}`;
}

export function buildWhatsAppUrl(message) {
  const cleanNumber = BRAND_CONFIG.whatsappNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildInstagramUrl() {
  const handle = BRAND_CONFIG.instagramHandle.replace(/^@/, '');
  return `https://instagram.com/${handle}`;
}

export const CATEGORIES = [
  { id: 'all', label: 'All Pieces' },
  { id: 'rugs', label: 'Sculptural Rugs' },
  { id: 'wall-art', label: 'Gallery Wall Art' },
  { id: 'handbags', label: "Women's Handbags" },
];

export const PILLARS = [
  {
    number: '01',
    id: 'rugs',
    title: 'Sculptural Rugs',
    startingPrice: 9500,
    description:
      'Plush, hand-carved area rugs and organic silhouettes tailored to anchor living rooms, bedrooms, and studios.',
    image: '/images/rug-savanna-contour.jpg',
  },
  {
    number: '02',
    id: 'wall-art',
    title: 'Gallery Wall Art',
    startingPrice: 6800,
    description:
      'Three-dimensional tactile tapestries and oak-framed wool reliefs that bring acoustic warmth and quiet drama to walls.',
    image: '/images/wallart-botanical-relief.jpg',
  },
  {
    number: '03',
    id: 'handbags',
    title: "Women's Handbags",
    startingPrice: 5800,
    description:
      'Statement hand-tufted totes and evening clutches finished with supple leather trims, lined interiors, and brushed brass.',
    image: '/images/bag-rose-cloud.jpg',
  },
];

export const PRODUCTS = [
  {
    id: 'savanna-contour-rug',
    name: 'Savanna Contour',
    category: 'rugs',
    categoryLabel: 'Sculptural Rug',
    badge: 'Signature Piece',
    image: '/images/rug-savanna-contour.jpg',
    leadTime: '10 – 14 days',
    pile: '18mm Hand-Carved Cut Pile',
    materials: 'Premium wool-acrylic blend, natural monk’s cloth, non-slip cotton canvas backing',
    description:
      'An organic, free-form silhouette sculpted with layered 3D relief channels in warm ivory, oat linen, and muted olive moss.',
    palette: ['#F7F2E8', '#D9CCB8', '#5D6632'],
    sizes: [
      { label: 'Accent · 80 × 120 cm', price: 11500 },
      { label: 'Studio · 120 × 180 cm', price: 21000 },
      { label: 'Living · 160 × 230 cm', price: 34500 },
      { label: 'Grand · 200 × 300 cm', price: 52000 },
    ],
  },
  {
    id: 'rose-atelier-rug',
    name: 'Blush Arch No. 02',
    category: 'rugs',
    categoryLabel: 'Sculptural Rug',
    badge: 'Client Favourite',
    image: '/images/rug-rose-atelier.jpg',
    leadTime: '10 – 16 days',
    pile: '16mm Beveled Plush Pile',
    materials: 'Soft combed yarn, hand-sheared architectural arches, reinforced wool binding',
    description:
      'Architectural arches and gentle botanical waves rendered in our signature dusty rose, warm cream, and soft oat tones.',
    palette: ['#C57D82', '#F8F3EB', '#DFB6B2'],
    sizes: [
      { label: 'Accent · 80 × 120 cm', price: 10500 },
      { label: 'Studio · 120 × 180 cm', price: 19500 },
      { label: 'Living · 160 × 230 cm', price: 32000 },
      { label: 'Grand · 200 × 300 cm', price: 48500 },
    ],
  },
  {
    id: 'boucle-dune-rug',
    name: 'Dune Ripple Runner & Rug',
    category: 'rugs',
    categoryLabel: 'Sculptural Rug',
    badge: 'Minimalist Edition',
    image: '/images/rug-boucle-dune.jpg',
    leadTime: '10 – 14 days',
    pile: 'Dual-Height Cut & Loop Bouclé',
    materials: 'Textured high-low loop & cut yarn, breathable natural latex, cotton twill edge',
    description:
      'Monochrome tonal serenity. Sculpted topographic ridges create subtle shadow play across hallways and serene bedrooms.',
    palette: ['#FBF8F2', '#EAE1D2', '#CBBFA9'],
    sizes: [
      { label: 'Runner · 70 × 200 cm', price: 14500 },
      { label: 'Studio · 120 × 180 cm', price: 20500 },
      { label: 'Living · 160 × 230 cm', price: 33500 },
      { label: 'Grand · 200 × 300 cm', price: 50000 },
    ],
  },
  {
    id: 'botanical-relief-wallart',
    name: 'Moss & Linen Relief',
    category: 'wall-art',
    categoryLabel: 'Gallery Wall Art',
    badge: '3D Sculpture',
    image: '/images/wallart-botanical-relief.jpg',
    leadTime: '7 – 12 days',
    pile: 'Multi-Depth 12mm – 26mm Relief',
    materials: 'Varied wool textures, concealed solid timber hanging cleat, archival felt back',
    description:
      'A gallery-scale textile landscape combining plush moss-olive ridges, creamy bouclé dunes, and whisper-soft dusty rose accents.',
    palette: ['#5D6632', '#F4EDE2', '#C57D82'],
    sizes: [
      { label: 'Medium · 50 × 70 cm', price: 8500 },
      { label: 'Gallery · 70 × 100 cm', price: 14500 },
      { label: 'Statement · 90 × 130 cm', price: 22500 },
    ],
  },
  {
    id: 'rose-horizon-wallart',
    name: 'Rose Horizon Tondo',
    category: 'wall-art',
    categoryLabel: 'Gallery Wall Art',
    badge: 'Oak Framed',
    image: '/images/wallart-rose-horizon.jpg',
    leadTime: '7 – 10 days',
    pile: '15mm Sculpted Velvet Cut',
    materials: 'Hand-tufted yarn inlaid inside a slim natural white oak circular frame',
    description:
      'A serene circular textile medallion capturing sunset dunes in blush rose, warm ivory, and sand — ready to hang out of the box.',
    palette: ['#C57D82', '#F8F4EC', '#D6C7B2'],
    sizes: [
      { label: 'Compact · 45 cm Diameter', price: 7200 },
      { label: 'Gallery · 65 cm Diameter', price: 12800 },
      { label: 'Feature · 85 cm Diameter', price: 18500 },
    ],
  },
  {
    id: 'rose-cloud-tote',
    name: 'The Rose Cloud Tote',
    category: 'handbags',
    categoryLabel: "Women's Handbag",
    badge: 'Limited Batch',
    image: '/images/bag-rose-cloud.jpg',
    leadTime: '5 – 8 days',
    pile: 'Dense 10mm Micro-Tuft',
    materials: 'Hand-tufted wool body, structured camel leather handles, satin-cotton lining, magnetic brass clasp',
    description:
      'Playful yet unmistakably poised. A structured mini tote featuring swirling dusty rose and cream wool contours with tailored leather handles.',
    palette: ['#C57D82', '#FBF8F3', '#A6754B'],
    sizes: [
      { label: 'Mini Tote · 24 × 20 × 10 cm', price: 6800 },
      { label: 'Day Tote · 32 × 26 × 12 cm', price: 9200 },
    ],
  },
  {
    id: 'olive-atelier-clutch',
    name: 'The Olive Atelier Shoulder Bag',
    category: 'handbags',
    categoryLabel: "Women's Handbag",
    badge: 'Evening Edit',
    image: '/images/bag-olive-atelier.jpg',
    leadTime: '5 – 8 days',
    pile: 'Carved 10mm Checker-Wave Pile',
    materials: 'Sculpted olive & ivory tuft, tan leather piping, detachable brushed gold chain, interior zip pocket',
    description:
      'Designed for gallery openings and effortless dinners. Tactile olive and ivory wool relief framed with warm leather trim and a gold chain.',
    palette: ['#5D6632', '#F6F1E7', '#B8955A'],
    sizes: [
      { label: 'Shoulder Clutch · 25 × 15 × 7 cm', price: 5800 },
      { label: 'Evening Medium · 29 × 18 × 8 cm', price: 7500 },
    ],
  },
];

export const RUG_PRICING_TIERS = [
  {
    tier: 'Accent & Bedside',
    dimensions: '70 × 110 cm',
    areaLabel: 'Compact',
    priceFrom: 9500,
    priceTo: 12500,
    idealFor: 'Bedside landings, reading nooks, vanity corners & statement entryways',
    turnaround: '7 – 10 days',
  },
  {
    tier: 'Hallway Runner',
    dimensions: '70 × 200 cm',
    areaLabel: 'Linear',
    priceFrom: 14500,
    priceTo: 18500,
    idealFor: 'Corridors, kitchen islands, balcony thresholds & narrow galleries',
    turnaround: '8 – 12 days',
  },
  {
    tier: 'Studio & Lounge',
    dimensions: '120 × 180 cm',
    areaLabel: 'Most Popular',
    featured: true,
    priceFrom: 19500,
    priceTo: 24500,
    idealFor: 'Coffee table anchoring, home offices, nursery & boutique dressing rooms',
    turnaround: '10 – 14 days',
  },
  {
    tier: 'Living Room Classic',
    dimensions: '160 × 230 cm',
    areaLabel: 'Generous',
    priceFrom: 32000,
    priceTo: 38500,
    idealFor: 'Full seating suites, queen/king bedrooms & open-plan lounges',
    turnaround: '14 – 18 days',
  },
  {
    tier: 'Grand Bespoke',
    dimensions: '200 × 300 cm+',
    areaLabel: 'Architectural',
    priceFrom: 48500,
    priceTo: 65000,
    idealFor: 'Expansive living spaces, dining rooms, luxury hospitality & private studios',
    turnaround: '18 – 24 days',
  },
];

export const OTHER_PRICING_SUMMARY = [
  {
    category: 'Gallery Wall Art',
    subtitle: 'Mounted or Oak-Framed 3D Tapestries',
    tiers: [
      { name: 'Small Accent (40 × 55 cm)', price: 'From KSh 6,800' },
      { name: 'Gallery Medium (60 × 85 cm)', price: 'From KSh 12,500' },
      { name: 'Statement Large (90 × 130 cm)', price: 'From KSh 21,000' },
    ],
  },
  {
    category: "Women's Handbags",
    subtitle: 'Hand-Tufted & Leather-Finished',
    tiers: [
      { name: 'Evening Shoulder Clutch', price: 'From KSh 5,800' },
      { name: 'Structured Mini Tote', price: 'From KSh 6,800' },
      { name: 'Bespoke Monogram Day Tote', price: 'From KSh 9,200' },
    ],
  },
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Consultation & Palette',
    description:
      'Share your room photo, preferred dimensions, or handbag moodboard over WhatsApp or Instagram DM. We guide yarn shades and proportions at no extra cost.',
  },
  {
    step: '02',
    title: 'Digital Sketch & Quote',
    description:
      'Receive a scaled design mockup and transparent KSh quote. Once approved, a 50% deposit secures your slot on our studio frame.',
  },
  {
    step: '03',
    title: 'Hand-Tufting & Carving',
    description:
      'Every line is tufted strand-by-strand, bonded with odourless latex, and meticulously hand-sheared for crisp, sculptural 3D depth.',
  },
  {
    step: '04',
    title: 'Finishing & White-Glove Delivery',
    description:
      'Backed in breathable cotton canvas or tailored leather trim, photographed for your final approval, and delivered wrapped in reusable cotton dust bags.',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How do I place an order or request a custom design?',
    answer:
      'Simply tap any "Order on WhatsApp" or "Inquire on Instagram" button on this site. Your chosen piece, size, or custom estimator brief is pre-filled for you so we can immediately confirm yarn colours, timeline, and delivery details.',
  },
  {
    question: 'Can I customize the colours, shape, or size of any rug, wall art, or handbag?',
    answer:
      'Yes — every Tuftly piece is tufted to order. You can adjust colours to match your interior palette, request an organic free-form silhouette, add subtle initials to a handbag, or commission a completely original design.',
  },
  {
    question: 'What are the payment terms and lead times?',
    answer:
      'A 50% deposit via M-Pesa or Bank Transfer initiates crafting, with the remaining 50% payable upon viewing final studio photos prior to dispatch. Handbags take 5–8 days, wall art 7–12 days, and rugs 10–21 days depending on scale.',
  },
  {
    question: 'How do I care for a hand-tufted rug or handbag?',
    answer:
      'For rugs, light suction-only vacuuming (without a harsh beater bar) keeps the pile plush; blot spills gently with a damp cloth and mild wool soap. Handbags arrive lightly Scotchgard-protected and include a breathable cotton dust bag.',
  },
  {
    question: 'Where do you deliver?',
    answer:
      'We offer doorstep courier delivery across Nairobi and reliable nationwide parcel dispatch across Kenya (Mombasa, Kisumu, Nakuru, Eldoret, Nanyuki & beyond), as well as international shipping across East Africa and worldwide.',
  },
];
