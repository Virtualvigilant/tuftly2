import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const COLORS = {
  cream: '#FBF8F3',
  linen: '#F1E8DA',
  sand: '#E4D8C5',
  espresso: '#1F1B17',
  espressoSoft: '#2E2822',
  rose: '#C57D82',
  roseBright: '#E0979C',
  roseSoft: '#F8E6E7',
  olive: '#5D6632',
  oliveBright: '#859348',
  oliveSoft: '#ECF0DF',
  gold: '#D8B37C',
  white: '#FFFDF9',
};

const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
`;

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Plus Jakarta Sans', -apple-system, sans-serif";

const PillBadge: React.FC<{
  text: string;
  bg: string;
  color?: string;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
}> = ({ text, bg, color = COLORS.white, delay = 0, size = 'md' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.7 },
  });
  const pad =
    size === 'lg'
      ? '16px 34px'
      : size === 'sm'
        ? '8px 18px'
        : '11px 24px';
  const fontSize = size === 'lg' ? 28 : size === 'sm' ? 16 : 21;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: pad,
        borderRadius: 999,
        background: bg,
        color,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        transform: `scale(${interpolate(pop, [0, 1], [0.45, 1])}) translateY(${interpolate(pop, [0, 1], [24, 0])}px)`,
        opacity: interpolate(pop, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' }),
        boxShadow: '0 14px 34px -12px rgba(20,16,12,0.32)',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

const CornerWatermark: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [20, 40, 1075, 1092], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        right: 44,
        bottom: 36,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 18px 8px 9px',
        borderRadius: 999,
        background: dark ? 'rgba(31,27,23,0.72)' : 'rgba(255,253,249,0.88)',
        backdropFilter: 'blur(12px)',
        border: dark
          ? '1px solid rgba(255,253,249,0.16)'
          : '1px solid rgba(31,27,23,0.1)',
        opacity,
        boxShadow: '0 10px 28px rgba(0,0,0,0.14)',
      }}
    >
      <Img
        src={staticFile('media/tuftly-logo.jpg')}
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
      <span
        style={{
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: '0.12em',
          color: dark ? COLORS.cream : COLORS.espresso,
        }}
      >
        TUFTLY
      </span>
    </div>
  );
};

/* =====================================================================
   SCENE 1 (0–105f / 0.0s–3.5s): Kinetic Luxury Hook Opener
   ===================================================================== */
const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const orbFloat1 = Math.sin(frame / 14) * 28;
  const orbFloat2 = Math.cos(frame / 16) * 34;

  const line1 = spring({ frame: frame - 6, fps, config: { damping: 13, stiffness: 170 } });
  const line2 = spring({ frame: frame - 15, fps, config: { damping: 13, stiffness: 170 } });
  const line3 = spring({ frame: frame - 24, fps, config: { damping: 13, stiffness: 170 } });
  const logoPop = spring({ frame: frame - 52, fps, config: { damping: 11, stiffness: 140 } });

  // Curtain wipe out at frames 164..180
  const wipeX = interpolate(frame, [164, 180], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const floatingSwatches = [
    { img: 'media/bag-rose-tote.jpg', x: 140, y: 150, size: 150, speed: 0.9, rot: -10 },
    { img: 'media/rug-savanna.jpg', x: 1620, y: 130, size: 170, speed: 1.1, rot: 9 },
    { img: 'media/user-bag-heart-brown.jpg', x: 190, y: 740, size: 155, speed: 1.2, rot: 12 },
    { img: 'media/wallart-tondo.jpg', x: 1590, y: 720, size: 165, speed: 0.85, rot: -8 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, #372D26 0%, ${COLORS.espresso} 68%, #13100D 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Glowing animated studio orbs */}
      <div
        style={{
          position: 'absolute',
          left: 260,
          top: 120 + orbFloat1,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197,125,130,0.34), transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 220,
          bottom: 80 + orbFloat2,
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(133,147,72,0.28), transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Floating orbiting product medallions */}
      {floatingSwatches.map((sw, idx) => {
        const pop = spring({
          frame: frame - (10 + idx * 7),
          fps,
          config: { damping: 14, stiffness: 120 },
        });
        const bob = Math.sin((frame + idx * 25) / 14) * 16;
        return (
          <div
            key={sw.img}
            style={{
              position: 'absolute',
              left: sw.x,
              top: sw.y + bob,
              width: sw.size,
              height: sw.size,
              borderRadius: 28,
              overflow: 'hidden',
              border: '3px solid rgba(251,248,243,0.22)',
              boxShadow: '0 24px 54px rgba(0,0,0,0.45)',
              transform: `scale(${pop}) rotate(${sw.rot + Math.sin(frame / 20) * 3}deg)`,
              opacity: interpolate(pop, [0, 1], [0, 0.92]),
            }}
          >
            <Img
              src={staticFile(sw.img)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        );
      })}

      {/* Center Kinetic Typography + Emblem Burst */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 120px',
        }}
      >
        <div
          style={{
            marginBottom: 24,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <PillBadge text="Bespoke Hand-Tufted Luxury · Kenya" bg={COLORS.olive} delay={2} size="sm" />
        </div>

        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 98,
            letterSpacing: '-0.03em',
            lineHeight: 0.98,
            color: COLORS.cream,
            transform: `translateY(${interpolate(line1, [0, 1], [70, 0])}px) scale(${interpolate(line1, [0, 1], [0.85, 1])})`,
            opacity: line1,
          }}
        >
          TRANSFORM
        </div>

        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 124,
            lineHeight: 0.96,
            color: COLORS.roseBright,
            transform: `translateY(${interpolate(line2, [0, 1], [70, 0])}px) scale(${interpolate(line2, [0, 1], [0.85, 1])})`,
            opacity: line2,
            textShadow: '0 10px 40px rgba(197,125,130,0.4)',
          }}
        >
          Your Space &amp; Style
        </div>

        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 32,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: COLORS.sand,
            marginTop: 18,
            transform: `translateY(${interpolate(line3, [0, 1], [40, 0])}px)`,
            opacity: line3,
          }}
        >
          WITH PURE HANDCRAFTED TEXTURE
        </div>

        {/* Tuftly Circular Emblem Pop */}
        <div
          style={{
            marginTop: 42,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            padding: '14px 36px 14px 16px',
            borderRadius: 999,
            background: 'rgba(251,248,243,0.12)',
            border: '1.5px solid rgba(251,248,243,0.28)',
            backdropFilter: 'blur(12px)',
            transform: `scale(${interpolate(logoPop, [0, 1], [0.4, 1])})`,
            opacity: logoPop,
          }}
        >
          <Img
            src={staticFile('media/tuftly-logo.jpg')}
            style={{
              width: 78,
              height: 78,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #FBF8F3',
            }}
          />
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 42,
                letterSpacing: '0.12em',
                color: COLORS.white,
                lineHeight: 1,
              }}
            >
              TUFTLY
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 15,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: COLORS.roseBright,
                marginTop: 4,
              }}
            >
              Rugs · Bags · Wall Art · Car Rugs
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Diagonal Linen Transition Wipe */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: COLORS.linen,
          transform: `translateX(${wipeX}%)`,
          zIndex: 30,
        }}
      />
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 2 (105–270f / 3.5s–9.0s): Live Tufting Action + Craft Card
   ===================================================================== */
const Scene2CraftAction: React.FC = () => {
  const frame = useCurrentFrame(); // local 0..165
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 140 } });
  const showCarvingClip = frame >= 126;
  const miniPop1 = spring({ frame: frame - 26, fps, config: { damping: 13, stiffness: 150 } });
  const miniPop2 = spring({ frame: frame - 40, fps, config: { damping: 13, stiffness: 150 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.linen} 100%)`,
        padding: 58,
        display: 'flex',
        flexDirection: 'row',
        gap: 54,
        alignItems: 'center',
      }}
    >
      {/* Left: Live Tufting & Carving Video Frame */}
      <div
        style={{
          width: 720,
          height: 964,
          borderRadius: 36,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 32px 70px -20px rgba(31,27,23,0.34)',
          border: '6px solid #FFFDF9',
          transform: `scale(${interpolate(cardIn, [0, 1], [0.92, 1])})`,
          flexShrink: 0,
          background: COLORS.espresso,
        }}
      >
        {!showCarvingClip ? (
          <OffthreadVideo
            src={staticFile('media/user-tufting-clip.mp4')}
            muted
            playbackRate={2.3}
            startFrom={0}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <OffthreadVideo
            src={staticFile('media/user-tufting-clip.mp4')}
            muted
            playbackRate={1.35}
            startFrom={265}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}

        {/* Dynamic Live Process Badge */}
        <div style={{ position: 'absolute', top: 28, left: 28 }}>
          <PillBadge
            key={showCarvingClip ? 'carve' : 'tuft'}
            text={showCarvingClip ? 'Hand-Carved 3D Relief' : 'Tufted Strand by Strand'}
            bg={showCarvingClip ? COLORS.rose : COLORS.olive}
            delay={0}
            size="sm"
          />
        </div>

        {/* Subtle bottom studio gradient tag */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '50px 32px 26px',
            background: 'linear-gradient(transparent, rgba(24,20,16,0.78))',
            color: COLORS.white,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 20,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Real Artisan Studio Craft · Zero Mass Production
        </div>
      </div>

      {/* Right: StarTimes-inspired Editorial Motion Graphics Card */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 26,
          transform: `translateX(${interpolate(cardIn, [0, 1], [80, 0])}px)`,
          opacity: cardIn,
        }}
      >
        {/* Header with signature double-line bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 64, height: 4, background: COLORS.rose, borderRadius: 4 }} />
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: COLORS.olive,
            }}
          >
            MEET TUFTLY
          </span>
          <div style={{ width: 64, height: 4, background: COLORS.olive, borderRadius: 4 }} />
        </div>

        <h1
          style={{
            fontFamily: SERIF,
            fontSize: 92,
            fontWeight: 600,
            lineHeight: 0.96,
            color: COLORS.espresso,
            margin: 0,
          }}
        >
          Every Stitch, <span style={{ fontStyle: 'italic', color: COLORS.rose }}>Sculpted</span> to Perfection.
        </h1>

        {/* Elevated Frosted Promo Card */}
        <div
          style={{
            background: COLORS.white,
            borderRadius: 30,
            padding: '34px 36px',
            border: '1.5px solid rgba(31,27,23,0.08)',
            boxShadow: '0 24px 54px -22px rgba(31,27,23,0.16)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <PillBadge text="Plush Wool Pile" bg={COLORS.espresso} delay={16} size="sm" />
            <PillBadge text="Custom Colours" bg={COLORS.rose} delay={24} size="sm" />
            <PillBadge text="Made to Order" bg={COLORS.olive} delay={32} size="sm" />
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 26,
              lineHeight: 1.48,
              color: '#524940',
              margin: 0,
            }}
          >
            Bold statements or serene minimalism — every piece is custom tufted and sheared by hand exclusively for you.
          </p>
        </div>

        {/* Two Animated Floating Accent Thumbnails */}
        <div style={{ display: 'flex', gap: 22 }}>
          <div
            style={{
              flex: 1,
              height: 215,
              borderRadius: 24,
              overflow: 'hidden',
              border: '4px solid #FFFDF9',
              boxShadow: '0 18px 40px -16px rgba(31,27,23,0.25)',
              transform: `translateY(${interpolate(miniPop1, [0, 1], [40, 0])}px)`,
              opacity: miniPop1,
            }}
          >
            <Img
              src={staticFile('media/atelier-craft.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div
            style={{
              flex: 1,
              height: 215,
              borderRadius: 24,
              overflow: 'hidden',
              border: '4px solid #FFFDF9',
              boxShadow: '0 18px 40px -16px rgba(31,27,23,0.25)',
              transform: `translateY(${interpolate(miniPop2, [0, 1], [40, 0])}px)`,
              opacity: miniPop2,
            }}
          >
            <Img
              src={staticFile('media/user-rug-rack.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 3A (270–365f / 9.0s–12.15s): Statement Rugs Multi-Frame + Price Pop
   ===================================================================== */
const Scene3ARugs: React.FC = () => {
  const frame = useCurrentFrame(); // 0..95
  const { fps } = useVideoConfig();

  const leftIn = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 150 } });
  const midIn = spring({ frame: frame - 7, fps, config: { damping: 14, stiffness: 150 } });
  const rightIn = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 150 } });
  const barIn = spring({ frame: frame - 16, fps, config: { damping: 12, stiffness: 170 } });

  const slowZoom = interpolate(frame, [0, 95], [1, 1.08]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.cream,
        padding: '40px 52px 36px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top Category Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <PillBadge text="01 · Statement Rugs" bg={COLORS.olive} delay={0} size="md" />
          <span
            style={{
              fontFamily: SERIF,
              fontSize: 48,
              fontWeight: 600,
              color: COLORS.espresso,
            }}
          >
            Floor Art That Anchors Any Room
          </span>
        </div>
        <PillBadge text="From KSh 1,500" bg={COLORS.rose} delay={12} size="md" />
      </div>

      {/* 3-Panel Dynamic Staggered Showcase */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.95fr 1.25fr 0.95fr', gridTemplateRows: 'minmax(0, 1fr)', gap: 26 }}>
        {/* Left: User's Wavy Checkerboard Rug */}
        <div
          style={{
            borderRadius: 30,
            overflow: 'hidden',
            border: '5px solid #FFFDF9',
            boxShadow: '0 26px 60px -20px rgba(31,27,23,0.28)',
            transform: `translateY(${interpolate(leftIn, [0, 1], [110, 0])}px)`,
            opacity: leftIn,
            minHeight: 0,
          }}
        >
          <Img
            src={staticFile('media/user-rug-checker.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${slowZoom})`,
            }}
          />
        </div>

        {/* Center: Hero Luxury Sculpted Rug */}
        <div
          style={{
            borderRadius: 30,
            overflow: 'hidden',
            border: '6px solid #FFFDF9',
            boxShadow: '0 32px 72px -18px rgba(31,27,23,0.34)',
            transform: `translateY(${interpolate(midIn, [0, 1], [-90, 0])}px)`,
            opacity: midIn,
            position: 'relative',
          }}
        >
          <Img
            src={staticFile('media/hero-rug.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${interpolate(frame, [0, 95], [1.08, 1])})`,
            }}
          />
        </div>

        {/* Right: User's Portrait Rug + Tuftly Rose Arch stacked */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            minHeight: 0,
            height: '100%',
            transform: `translateY(${interpolate(rightIn, [0, 1], [110, 0])}px)`,
            opacity: rightIn,
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: 0,
              borderRadius: 28,
              overflow: 'hidden',
              border: '5px solid #FFFDF9',
              boxShadow: '0 22px 50px -18px rgba(31,27,23,0.26)',
            }}
          >
            <Img
              src={staticFile('media/user-rug-portrait.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${slowZoom})` }}
            />
          </div>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              borderRadius: 28,
              overflow: 'hidden',
              border: '5px solid #FFFDF9',
              boxShadow: '0 22px 50px -18px rgba(31,27,23,0.26)',
            }}
          >
            <Img
              src={staticFile('media/rug-savanna.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Floating Offer Strip */}
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          background: COLORS.espresso,
          color: COLORS.cream,
          borderRadius: 999,
          padding: '15px 38px',
          transform: `translateY(${interpolate(barIn, [0, 1], [50, 0])}px)`,
          opacity: barIn,
          boxShadow: '0 20px 50px -15px rgba(31,27,23,0.45)',
        }}
      >
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: '0.1em', color: COLORS.roseBright }}>
          CUSTOM SIZES &amp; ORGANIC SHAPES
        </span>
        <span style={{ opacity: 0.4 }}>•</span>
        <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 22 }}>
          Living Rooms · Bedrooms · Hallway Runners · Custom Art Rugs
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 3B (365–450f / 12.15s–15.0s): Luxury Custom Car Rugs Spotlight
   ===================================================================== */
const Scene3BCarRugs: React.FC = () => {
  const frame = useCurrentFrame(); // 0..85
  const { fps } = useVideoConfig();

  const slideIn = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
  const cardPop = spring({ frame: frame - 12, fps, config: { damping: 13, stiffness: 160 } });
  const zoom = interpolate(frame, [0, 85], [1.02, 1.1]);

  return (
    <AbsoluteFill style={{ background: COLORS.espresso, overflow: 'hidden' }}>
      {/* Full-Bleed Interior Car Rug Shot */}
      <Img
        src={staticFile('media/car-rug-interior.jpg')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${zoom}) translateX(${interpolate(slideIn, [0, 1], [60, 0])}px)`,
          filter: 'brightness(0.84)',
        }}
      />

      {/* Gradient Scrim */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(90deg, rgba(20,16,13,0.88) 0%, rgba(20,16,13,0.48) 50%, rgba(20,16,13,0.12) 100%)',
        }}
      />

      {/* Left Bold Kinetic Callout */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 110,
          width: 780,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div>
          <PillBadge text="02 · Bespoke Car Rugs" bg={COLORS.rose} delay={4} size="md" />
        </div>
        <h2
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 84,
            lineHeight: 0.98,
            color: COLORS.white,
            margin: 0,
            transform: `translateY(${interpolate(slideIn, [0, 1], [50, 0])}px)`,
            opacity: slideIn,
          }}
        >
          UPGRADE EVERY <span style={{ fontFamily: SERIF, fontStyle: 'italic', color: COLORS.roseBright, fontWeight: 600 }}>DRIVE</span>.
        </h2>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 28,
            lineHeight: 1.45,
            color: '#E9DFD2',
            margin: 0,
            maxWidth: 620,
          }}
        >
          Custom-fitted plush tufted car floor mats tailored to your cabin colours with heavy-duty non-slip backing.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 8 }}>
          <PillBadge text="Tailored Fit" bg={COLORS.olive} delay={16} size="sm" />
          <PillBadge text="Non-Slip Backing" bg="rgba(255,253,249,0.18)" delay={22} size="sm" />
          <PillBadge text="Your Colours" bg="rgba(255,253,249,0.18)" delay={28} size="sm" />
        </div>
      </div>

      {/* Right Floating Picture-in-Picture Pair Card */}
      <div
        style={{
          position: 'absolute',
          right: 68,
          bottom: 92,
          width: 620,
          height: 390,
          borderRadius: 30,
          overflow: 'hidden',
          border: '6px solid #FFFDF9',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
          transform: `scale(${interpolate(cardPop, [0, 1], [0.72, 1])}) rotate(${interpolate(cardPop, [0, 1], [6, -1.5])}deg)`,
          opacity: cardPop,
        }}
      >
        <Img
          src={staticFile('media/car-rug-pair.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 18,
            left: 18,
            background: 'rgba(31,27,23,0.85)',
            color: COLORS.cream,
            padding: '8px 18px',
            borderRadius: 999,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Front &amp; Full-Cabin Custom Sets
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 4A (450–545f / 15.0s–18.15s): Women's Handbags Fashion Parade
   ===================================================================== */
const Scene4AHandbags: React.FC = () => {
  const frame = useCurrentFrame(); // 0..95
  const { fps } = useVideoConfig();

  const bags = [
    { img: 'media/bag-rose-tote.jpg', label: 'Structured Totes', rot: -3.5, delay: 4 },
    { img: 'media/user-bag-heart-brown.jpg', label: 'Heart Editions', rot: 2.5, delay: 10 },
    { img: 'media/user-bag-floral.jpg', label: 'Evening Clutches', rot: -2, delay: 16 },
    { img: 'media/bag-olive-clutch.jpg', label: 'Chain Shoulder Bags', rot: 3, delay: 22 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(155deg, ${COLORS.roseSoft} 0%, ${COLORS.cream} 55%, ${COLORS.linen} 100%)`,
        padding: '48px 54px',
        overflow: 'hidden',
      }}
    >
      {/* Top Editorial Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 38,
        }}
      >
        <div>
          <PillBadge text="03 · Women's Handbags" bg={COLORS.rose} delay={0} size="md" />
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 72,
              fontWeight: 600,
              color: COLORS.espresso,
              margin: '12px 0 0',
              lineHeight: 1,
            }}
          >
            Wearable Art That <span style={{ fontStyle: 'italic', color: COLORS.rose }}>Turns Heads</span>
          </h2>
        </div>

        <div
          style={{
            background: COLORS.espresso,
            color: COLORS.white,
            padding: '22px 38px',
            borderRadius: 26,
            textAlign: 'right',
            boxShadow: '0 22px 48px -14px rgba(31,27,23,0.34)',
          }}
        >
          <div style={{ fontFamily: SANS, fontSize: 15, letterSpacing: '0.2em', color: COLORS.roseBright, textTransform: 'uppercase', fontWeight: 700 }}>
            Hand-Tufted Bags
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 700, lineHeight: 1.05 }}>
            From KSh 3,800
          </div>
        </div>
      </div>

      {/* 4-Card Fashion Gallery Sweep */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, height: 680 }}>
        {bags.map((bag, i) => {
          const p = spring({ frame: frame - bag.delay, fps, config: { damping: 12, stiffness: 150 } });
          const bob = Math.sin((frame + i * 18) / 15) * 8;
          return (
            <div
              key={bag.img}
              style={{
                background: COLORS.white,
                borderRadius: 30,
                padding: 14,
                boxShadow: '0 28px 60px -20px rgba(31,27,23,0.26)',
                display: 'flex',
                flexDirection: 'column',
                transform: `translateY(${interpolate(p, [0, 1], [130, 0]) + bob}px) rotate(${interpolate(p, [0, 1], [bag.rot * 3, bag.rot])}deg)`,
                opacity: p,
              }}
            >
              <div style={{ flex: 1, borderRadius: 22, overflow: 'hidden' }}>
                <Img
                  src={staticFile(bag.img)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${interpolate(frame, [0, 95], [1, 1.07])})`,
                  }}
                />
              </div>
              <div
                style={{
                  padding: '16px 10px 8px',
                  textAlign: 'center',
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 20,
                  color: COLORS.espresso,
                  letterSpacing: '0.03em',
                }}
              >
                {bag.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 4B (545–640f / 18.15s–21.3s): 3D Wall Art, Cushions & Desk Rugs
   ===================================================================== */
const Scene4BWallArtAndMore: React.FC = () => {
  const frame = useCurrentFrame(); // 0..95
  const { fps } = useVideoConfig();

  const tiles = [
    { img: 'media/wallart-moss.jpg', tag: '3D Wall Art', delay: 4 },
    { img: 'media/wallart-tondo.jpg', tag: 'Framed Tondos', delay: 11 },
    { img: 'media/user-cushions.jpg', tag: '3D Cushions', delay: 18 },
    { img: 'media/user-desk-rugs.jpg', tag: 'Desk & Quote Rugs', delay: 25 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.linen,
        padding: 50,
        display: 'grid',
        gridTemplateColumns: '0.88fr 1.12fr',
        gap: 44,
        alignItems: 'center',
      }}
    >
      {/* Left: Real Video Wall Reveal */}
      <div
        style={{
          height: 980,
          borderRadius: 34,
          overflow: 'hidden',
          border: '6px solid #FFFDF9',
          boxShadow: '0 30px 66px -18px rgba(31,27,23,0.32)',
          position: 'relative',
          background: COLORS.espresso,
        }}
      >
        <OffthreadVideo
          src={staticFile('media/user-tufting-clip.mp4')}
          muted
          playbackRate={1.05}
          startFrom={410}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 26, left: 26 }}>
          <PillBadge text="04 · Gallery Wall Art & More" bg={COLORS.olive} delay={2} size="sm" />
        </div>
      </div>

      {/* Right: Dynamic 2x2 Tile Grid + Animated Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, height: 980, minHeight: 0 }}>
        <div style={{ flexShrink: 0 }}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 58,
              fontWeight: 600,
              color: COLORS.espresso,
              margin: 0,
              lineHeight: 1,
            }}
          >
            Dress Your Walls, Desks &amp; <span style={{ fontStyle: 'italic', color: COLORS.rose }}>Home</span>
          </h2>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <PillBadge text="Custom 3D Wall Art" bg={COLORS.espresso} delay={10} size="sm" />
            <PillBadge text="Desk Art & Cushions" bg={COLORS.rose} delay={18} size="sm" />
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20 }}>
          {tiles.map((tile) => {
            const pop = spring({ frame: frame - tile.delay, fps, config: { damping: 13, stiffness: 160 } });
            return (
              <div
                key={tile.img}
                style={{
                  borderRadius: 26,
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: 0,
                  border: '5px solid #FFFDF9',
                  boxShadow: '0 20px 44px -16px rgba(31,27,23,0.24)',
                  transform: `scale(${interpolate(pop, [0, 1], [0.78, 1])})`,
                  opacity: pop,
                }}
              >
                <Img
                  src={staticFile(tile.img)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${interpolate(frame, [0, 95], [1, 1.07])})`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 16,
                    bottom: 16,
                    background: 'rgba(255,253,249,0.92)',
                    color: COLORS.espresso,
                    padding: '7px 16px',
                    borderRadius: 999,
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 16,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {tile.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 5 (640–810f / 21.3s–27.0s): StarTimes-Style Bold Custom Offer Stage
   ===================================================================== */
const Scene5OfferStage: React.FC = () => {
  const frame = useCurrentFrame(); // 0..170
  const { fps } = useVideoConfig();

  const headerPop = spring({ frame: frame - 3, fps, config: { damping: 14, stiffness: 160 } });
  const cardPop = spring({ frame: frame - 10, fps, config: { damping: 13, stiffness: 140 } });

  // Two snappy offer beats inside the centerpiece card (synced to Adrian @ 32.7s)
  const beat2 = spring({ frame: frame - 76, fps, config: { damping: 12, stiffness: 160 } });

  const sideFlankers = [
    { img: 'media/rug-rose.jpg', side: 'left', top: 150, rot: -8 },
    { img: 'media/user-bag-neon.jpg', side: 'left', top: 610, rot: 7 },
    { img: 'media/car-rug-pair.jpg', side: 'right', top: 160, rot: 8 },
    { img: 'media/user-slippers.jpg', side: 'right', top: 600, rot: -7 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, #FFFDF9 0%, ${COLORS.linen} 72%, #E5DAC8 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Flanking gently bobbing product cards */}
      {sideFlankers.map((item, idx) => {
        const pop = spring({ frame: frame - (14 + idx * 6), fps, config: { damping: 14, stiffness: 130 } });
        const bob = Math.sin((frame + idx * 20) / 14) * 12;
        return (
          <div
            key={item.img}
            style={{
              position: 'absolute',
              [item.side]: 54,
              top: item.top + bob,
              width: 255,
              height: 295,
              borderRadius: 28,
              overflow: 'hidden',
              border: '6px solid #FFFDF9',
              boxShadow: '0 24px 52px -18px rgba(31,27,23,0.26)',
              transform: `scale(${pop}) rotate(${item.rot}deg)`,
              opacity: pop,
            }}
          >
            <Img
              src={staticFile(item.img)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        );
      })}

      {/* Center Broadcast Promo Card */}
      <div
        style={{
          width: 1120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 28,
          zIndex: 10,
        }}
      >
        {/* StarTimes-style Top Header with Bold Rules */}
        <div
          style={{
            transform: `translateY(${interpolate(headerPop, [0, 1], [-40, 0])}px)`,
            opacity: headerPop,
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 44,
              letterSpacing: '0.08em',
              color: COLORS.espresso,
              textTransform: 'uppercase',
            }}
          >
            CUSTOM MADE TO YOUR VIBE
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              marginTop: 8,
            }}
          >
            <div style={{ width: 150, height: 5, background: COLORS.rose, borderRadius: 4 }} />
            <span
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 38,
                color: COLORS.olive,
              }}
            >
              Level Up Your Space
            </span>
            <div style={{ width: 150, height: 5, background: COLORS.olive, borderRadius: 4 }} />
          </div>
        </div>

        {/* Sequential Coloured Category Pills */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <PillBadge text="Rugs" bg={COLORS.olive} delay={12} size="md" />
          <PillBadge text="Car Rugs" bg={COLORS.espresso} delay={20} size="md" />
          <PillBadge text="Handbags" bg={COLORS.rose} delay={28} size="md" />
          <PillBadge text="Wall Art" bg={COLORS.gold} color={COLORS.espresso} delay={36} size="md" />
        </div>

        {/* Floating Elevated Glassmorphic Offer Box */}
        <div
          style={{
            width: '100%',
            minHeight: 370,
            background: 'rgba(255,253,249,0.92)',
            borderRadius: 40,
            border: '2px solid rgba(31,27,23,0.08)',
            boxShadow: '0 36px 80px -24px rgba(31,27,23,0.22)',
            padding: '48px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            transform: `scale(${interpolate(cardPop, [0, 1], [0.85, 1])})`,
            opacity: cardPop,
          }}
        >
          {/* Beat 1 inside card (0..78f) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: '44px 56px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 18,
              opacity: interpolate(frame, [68, 78], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              transform: `translateY(${interpolate(frame, [68, 78], [0, -35], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}px)`,
            }}
          >
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: COLORS.rose,
              }}
            >
              100% PERSONALIZED FOR YOU
            </span>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 64,
                lineHeight: 1.06,
                color: COLORS.espresso,
              }}
            >
              Pick Your Colours.
              <br />
              Choose Your Exact Size.
            </div>
          </div>

          {/* Beat 2 inside card (78..170f) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: '44px 56px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 24,
              opacity: beat2,
              transform: `scale(${interpolate(beat2, [0, 1], [0.85, 1])})`,
            }}
          >
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              <PillBadge text="FREE DESIGN ADVICE" bg={COLORS.olive} delay={78} size="lg" />
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 58,
                lineHeight: 1.08,
                color: COLORS.espresso,
              }}
            >
              Fast Doorstep Delivery
              <span style={{ color: COLORS.rose }}> Across Kenya</span>
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 22,
                color: '#6C6257',
                letterSpacing: '0.06em',
              }}
            >
              50% M-Pesa Deposit to Start Crafting · Crafted in 5–21 Days
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 6 (810–960f / 27.0s–32.0s): Cinema Spotlight Logo & WhatsApp CTA
   ===================================================================== */
const Scene6Finale: React.FC = () => {
  const frame = useCurrentFrame(); // 0..150
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 120 } });
  const ctaIn = spring({ frame: frame - 28, fps, config: { damping: 14, stiffness: 150 } });
  const flareX = interpolate(frame, [0, 120], [-420, 1750]);
  const pulse = 1 + Math.sin(frame / 10) * 0.025;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, #312821 0%, ${COLORS.espresso} 65%, #0F0D0B 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Sweeping Warm Spotlight Lens Flare (StarTimes Cinema Outro Energy!) */}
      <div
        style={{
          position: 'absolute',
          left: flareX,
          top: 260,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,235,205,0.45) 0%, rgba(197,125,130,0.22) 40%, transparent 72%)',
          filter: 'blur(26px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        {/* Illuminated Circular Tuftly Logo */}
        <div
          style={{
            position: 'relative',
            padding: 14,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(197,125,130,0.6), rgba(133,147,72,0.55))',
            boxShadow: '0 0 90px rgba(197,125,130,0.38)',
            transform: `scale(${interpolate(logoIn, [0, 1], [0.45, 1])})`,
            opacity: logoIn,
          }}
        >
          <Img
            src={staticFile('media/tuftly-logo.jpg')}
            style={{
              width: 270,
              height: 270,
              borderRadius: '50%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        <div
          style={{
            fontFamily: SERIF,
            fontSize: 108,
            fontWeight: 600,
            letterSpacing: '0.16em',
            color: COLORS.white,
            marginTop: 26,
            lineHeight: 1,
            transform: `translateY(${interpolate(logoIn, [0, 1], [35, 0])}px)`,
            opacity: logoIn,
          }}
        >
          TUFTLY
        </div>

        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 40,
            color: COLORS.roseBright,
            marginTop: 6,
            opacity: logoIn,
          }}
        >
          Craft You Can Feel.
        </div>

        {/* WhatsApp & Order CTA Lockup */}
        <div
          style={{
            marginTop: 42,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
            transform: `translateY(${interpolate(ctaIn, [0, 1], [40, 0])}px)`,
            opacity: ctaIn,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 18,
              padding: '22px 54px',
              borderRadius: 999,
              background: COLORS.olive,
              color: COLORS.white,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 38,
              letterSpacing: '0.06em',
              boxShadow: '0 22px 54px rgba(93,102,50,0.55)',
              transform: `scale(${pulse})`,
            }}
          >
            <span>WhatsApp</span>
            <span style={{ color: '#E8F0C4' }}>0118 899 336</span>
          </div>

          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: COLORS.roseBright,
            }}
          >
            Reply &ldquo;HELLO&rdquo; or Message Us Today · Nairobi, Kenya
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TuftlyCommercial: React.FC = () => {
  const frame = useCurrentFrame();
  const isDarkScene = frame < 180 || (frame >= 558 && frame < 670) || frame >= 1092;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.espresso }}>
      <style>{FONT_STYLE}</style>
      <Audio src={staticFile('media/master-adrian-luxe.mp3')} volume={1} />

      <Sequence from={0} durationInFrames={180}>
        <Scene1Hook />
      </Sequence>

      <Sequence from={180} durationInFrames={261}>
        <Scene2CraftAction />
      </Sequence>

      <Sequence from={441} durationInFrames={117}>
        <Scene3ARugs />
      </Sequence>

      <Sequence from={558} durationInFrames={112}>
        <Scene3BCarRugs />
      </Sequence>

      <Sequence from={670} durationInFrames={123}>
        <Scene4AHandbags />
      </Sequence>

      <Sequence from={793} durationInFrames={112}>
        <Scene4BWallArtAndMore />
      </Sequence>

      <Sequence from={905} durationInFrames={187}>
        <Scene5OfferStage />
      </Sequence>

      <Sequence from={1092} durationInFrames={273}>
        <Scene6Finale />
      </Sequence>

      <CornerWatermark dark={isDarkScene} />
    </AbsoluteFill>
  );
};
