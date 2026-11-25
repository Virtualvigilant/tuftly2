import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
`;

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Plus Jakarta Sans', -apple-system, sans-serif";

const C = {
  linenOuter: '#EFE6D8',
  creamCard: '#FBF8F3',
  espresso: '#1E1A16',
  inkMuted: '#5F554B',
  rose: '#C2737A',
  roseSoft: '#F6E4E6',
  olive: '#58622D',
  oliveSoft: '#EAEDE0',
  gold: '#D5B075',
  white: '#FFFDF9',
};

export interface PosterSpec {
  id: string;
  outName: string;
  edition: string;
  image: string;
  objectPosition: string;
  categoryTag: string;
  tagTone: 'olive' | 'rose' | 'espresso';
  eyebrow: string;
  headlineBold: string;
  headlineItalic: string;
  subline: string;
  swatches: [string, string, string];
}

export const POSTER_SPECS: PosterSpec[] = [
  {
    id: 'Poster01',
    outName: '01_Tuftly_Status_Cloud_Name_Rug.png',
    edition: 'EDITION 01',
    image: 'status-rugs/rug-01.jpg',
    objectPosition: '50% 48%',
    categoryTag: 'CUSTOM NAME RUGS',
    tagTone: 'olive',
    eyebrow: 'PERSONALIZED BEDROOM & KIDS SPACES',
    headlineBold: 'Spell Their Name',
    headlineItalic: 'In Plush 3D Wool.',
    subline: 'Custom cloud & name rugs in any font or colour — starting from KSh 1,500.',
    swatches: ['#5A3B26', '#EAE0CB', '#8A6345'],
  },
  {
    id: 'Poster02',
    outName: '02_Tuftly_Status_ManUtd_Club_Crest.png',
    edition: 'EDITION 02',
    image: 'status-rugs/rug-02.jpg',
    objectPosition: '50% 76%',
    categoryTag: 'CLUB & FAN RUGS',
    tagTone: 'rose',
    eyebrow: 'MATCHDAY & LOUNGE STATEMENT',
    headlineBold: 'Your Club. Your Crest.',
    headlineItalic: 'Tufted For True Fans.',
    subline: 'Any football badge, team crest, or emblem handcrafted with razor-sharp detail.',
    swatches: ['#C81F25', '#F4C424', '#F7F5F0'],
  },
  {
    id: 'Poster03',
    outName: '03_Tuftly_Status_Pink_Wavy_Checker.png',
    edition: 'EDITION 03',
    image: 'status-rugs/rug-03.jpg',
    objectPosition: '50% 50%',
    categoryTag: 'BOLD STATEMENT',
    tagTone: 'rose',
    eyebrow: 'CONTEMPORARY POP LIVING',
    headlineBold: 'Wake Up Every',
    headlineItalic: 'Corner Of Your Space.',
    subline: 'Vibrant wavy checkerboard rugs custom-sized to fit your exact floor dimensions.',
    swatches: ['#EC2F87', '#181619', '#F8F5F0'],
  },
  {
    id: 'Poster04',
    outName: '04_Tuftly_Status_Modern_Minimal_Wave.png',
    edition: 'EDITION 04',
    image: 'status-rugs/rug-04.jpg',
    objectPosition: '50% 54%',
    categoryTag: 'MODERN LUXURY',
    tagTone: 'espresso',
    eyebrow: 'ARCHITECTURAL LIVING ROOMS',
    headlineBold: 'Quiet Luxury',
    headlineItalic: 'You Can Feel Underfoot.',
    subline: 'Sculpted monochrome & tonal wave carpets tailored to anchor your sofa suite.',
    swatches: ['#1D1C21', '#F4F1EC', '#9E93AC'],
  },
  {
    id: 'Poster05',
    outName: '05_Tuftly_Status_Olive_Scallop_Rug.png',
    edition: 'EDITION 05',
    image: 'status-rugs/rug-05.jpg',
    objectPosition: '50% 50%',
    categoryTag: 'ORGANIC SHAPES',
    tagTone: 'olive',
    eyebrow: 'BOTANICAL FREE-FORM CONTOURS',
    headlineBold: 'Break Free From',
    headlineItalic: 'Ordinary Rectangles.',
    subline: 'Organic scalloped silhouettes hand-carved in lush, calming botanical shades.',
    swatches: ['#2E5924', '#9BC25B', '#F7F3EA'],
  },
  {
    id: 'Poster06',
    outName: '06_Tuftly_Status_Earth_Puzzle_Carpet.png',
    edition: 'EDITION 06',
    image: 'status-rugs/rug-06.jpg',
    objectPosition: '50% 58%',
    categoryTag: 'GRAND AREA RUGS',
    tagTone: 'espresso',
    eyebrow: 'WARM EARTH-TONE STATEMENT',
    headlineBold: 'Artisan Warmth',
    headlineItalic: 'For Grand Spaces.',
    subline: 'Large-scale lounge & hallway carpets tufted to order in your interior palette.',
    swatches: ['#2E323B', '#DFB678', '#B85427'],
  },
  {
    id: 'Poster07',
    outName: '07_Tuftly_Status_God_Loves_You_Rug.png',
    edition: 'EDITION 07',
    image: 'status-rugs/rug-07.jpg',
    objectPosition: '50% 48%',
    categoryTag: 'FAITH & QUOTES',
    tagTone: 'olive',
    eyebrow: 'UPLIFTING BEDSIDE ACCENTS',
    headlineBold: 'Words That Warm',
    headlineItalic: 'Your Home Every Day.',
    subline: 'Custom quote, affirmation & bedside accent rugs — starting from KSh 1,500.',
    swatches: ['#3C4621', '#EFEAD8', '#232912'],
  },
  {
    id: 'Poster08',
    outName: '08_Tuftly_Status_Pink_Heart_Home.png',
    edition: 'EDITION 08',
    image: 'status-rugs/rug-08.jpg',
    objectPosition: '50% 66%',
    categoryTag: 'COZY ACCENTS',
    tagTone: 'rose',
    eyebrow: 'SWEET ENTRYWAYS & BEDROOMS',
    headlineBold: 'Fall In Love',
    headlineItalic: 'The Moment You Step In.',
    subline: 'Plush heart-shaped welcome & bedside rugs crafted soft in your favourite colour.',
    swatches: ['#F3B8CE', '#FBF8F6', '#DF95B2'],
  },
  {
    id: 'Poster09',
    outName: '09_Tuftly_Status_Custom_Script_Name.png',
    edition: 'EDITION 09',
    image: 'status-rugs/rug-09.jpg',
    objectPosition: '50% 72%',
    categoryTag: 'PERFECT GIFT IDEA',
    tagTone: 'rose',
    eyebrow: 'DIE-CUT SIGNATURE SCRIPT',
    headlineBold: 'Any Name, Sculpted',
    headlineItalic: 'Into Unforgettable Art.',
    subline: 'Custom script cutout rugs — a thoughtful handmade gift for birthdays & new homes.',
    swatches: ['#B96B7F', '#FAF7F5', '#994E62'],
  },
  {
    id: 'Poster10',
    outName: '10_Tuftly_Status_Rockstar_Studio_Icon.png',
    edition: 'EDITION 10',
    image: 'status-rugs/rug-10.jpg',
    objectPosition: '50% 52%',
    categoryTag: 'GAMING & LOGOS',
    tagTone: 'espresso',
    eyebrow: 'SETUP, STUDIO & BRAND SERIES',
    headlineBold: 'Level Up Your',
    headlineItalic: 'Setup Or Studio Floor.',
    subline: 'Gaming icons, business logos & custom symbols tufted in ultra-dense wool pile.',
    swatches: ['#E29008', '#151414', '#FAF8F5'],
  },
];

export const TuftlyStatusPoster: React.FC<{ spec: PosterSpec }> = ({ spec }) => {
  const tagBg =
    spec.tagTone === 'olive'
      ? C.olive
      : spec.tagTone === 'rose'
        ? C.rose
        : C.espresso;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
      }}
    >
      <style>{FONT_STYLE}</style>

      {/* Edge-to-Edge Rounded Card (Zero Outer Frame, Crisp Rounded Corners!) */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 56,
          backgroundColor: C.creamCard,
          backgroundImage: `
            radial-gradient(rgba(88,98,45,0.045) 1px, transparent 1px),
            radial-gradient(rgba(194,115,122,0.045) 1px, transparent 1px)
          `,
          backgroundSize: '26px 26px',
          backgroundPosition: '0 0, 13px 13px',
          border: '2.5px solid rgba(30,26,22,0.12)',
          padding: '78px 52px 82px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Signature Top Accent Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 11,
            background: `linear-gradient(90deg, ${C.olive} 0%, ${C.rose} 55%, ${C.gold} 100%)`,
          }}
        />

        {/* TOP ROW: Top-Left Tuftly Logo Lockup + Top-Right Category Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 22,
            marginTop: 4,
          }}
        >
          {/* Unmistakable Top-Left Tuftly Emblem & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <div
              style={{
                padding: 4,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.rose}, ${C.olive})`,
                boxShadow: '0 10px 24px rgba(30,26,22,0.18)',
              }}
            >
              <Img
                src={staticFile('media/tuftly-logo.jpg')}
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2.5px solid #FFFDF9',
                  display: 'block',
                }}
              />
            </div>

            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 38,
                  letterSpacing: '0.13em',
                  color: C.espresso,
                  lineHeight: 0.95,
                }}
              >
                TUFTLY
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 12.5,
                  letterSpacing: '0.22em',
                  color: C.rose,
                  textTransform: 'uppercase',
                  marginTop: 5,
                }}
              >
                Bespoke Rug Atelier
              </div>
            </div>
          </div>

          {/* Top-Right Edition & Category Pill */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.22em',
                color: C.inkMuted,
              }}
            >
              {spec.edition} · KENYA
            </span>
            <div
              style={{
                padding: '10px 22px',
                borderRadius: 999,
                background: tagBg,
                color: C.white,
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 15.5,
                letterSpacing: '0.11em',
                textTransform: 'uppercase',
                boxShadow: '0 10px 24px -8px rgba(30,26,22,0.32)',
              }}
            >
              {spec.categoryTag}
            </div>
          </div>
        </div>

        {/* CENTER HERO RUG WINDOW + SIGNATURE 3-DOT YARN PALETTE PILL */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 1020,
            borderRadius: 34,
            overflow: 'hidden',
            border: '6px solid #FFFDF9',
            boxShadow: '0 24px 54px -18px rgba(30,26,22,0.28)',
            background: '#E8DFD1',
            flexShrink: 0,
          }}
        >
          <Img
            src={staticFile(spec.image)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: spec.objectPosition,
            }}
          />

          {/* Subtle Top-Left Watermark Seal Inside Photo Corner (Survives Cropping/Screenshots!) */}
          <div
            style={{
              position: 'absolute',
              top: 18,
              left: 18,
              padding: '7px 16px',
              borderRadius: 999,
              background: 'rgba(30,26,22,0.68)',
              backdropFilter: 'blur(8px)',
              color: C.white,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 13.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            HAND-TUFTED TO ORDER
          </div>

          {/* Signature Yarn Swatch Pill Bottom-Right of Photo */}
          <div
            style={{
              position: 'absolute',
              right: 18,
              bottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 16px 8px 11px',
              borderRadius: 999,
              background: 'rgba(255,253,249,0.94)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 12px 28px rgba(0,0,0,0.22)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {spec.swatches.map((hex, i) => (
                <span
                  key={hex + i}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: hex,
                    border: '2.5px solid #FFFDF9',
                    marginLeft: i === 0 ? 0 : -6,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 12.5,
                letterSpacing: '0.12em',
                color: C.espresso,
                textTransform: 'uppercase',
              }}
            >
              Custom Colours
            </span>
          </div>
        </div>

        {/* EDITORIAL AD COPY BLOCK */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '18px 8px 14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ width: 32, height: 2.5, background: C.rose, borderRadius: 2 }} />
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: '0.2em',
                color: C.olive,
                textTransform: 'uppercase',
              }}
            >
              {spec.eyebrow}
            </span>
          </div>

          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 52,
              lineHeight: 1.0,
              letterSpacing: '-0.025em',
              color: C.espresso,
            }}
          >
            {spec.headlineBold}
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 58,
              lineHeight: 0.98,
              color: C.rose,
              marginTop: 2,
            }}
          >
            {spec.headlineItalic}
          </div>

          <p
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 21.5,
              lineHeight: 1.38,
              color: C.inkMuted,
              margin: '12px 0 0',
            }}
          >
            {spec.subline}
          </p>
        </div>

        {/* SIGNATURE BOTTOM CONCIERGE CAPSULE */}
        <div
          style={{
            background: C.espresso,
            borderRadius: 999,
            padding: '14px 16px 14px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 16px 36px -12px rgba(30,26,22,0.42)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 19,
                color: C.white,
                letterSpacing: '0.02em',
              }}
            >
              Want This Piece? Reply &ldquo;THIS&rdquo;
            </span>
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 13.5,
                color: '#D5C7B4',
                letterSpacing: '0.06em',
              }}
            >
              Any Size · Nationwide Delivery Across Kenya
            </span>
          </div>

          <div
            style={{
              padding: '14px 26px',
              borderRadius: 999,
              background: C.olive,
              color: C.white,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            WhatsApp 0118 899 336
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
