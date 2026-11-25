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

const C = {
  cream: '#FBF8F3',
  linen: '#F1E8DA',
  sand: '#E4D8C5',
  espresso: '#1F1B17',
  rose: '#C57D82',
  roseBright: '#E59CA1',
  roseSoft: '#F8E6E7',
  olive: '#5D6632',
  oliveBright: '#859348',
  gold: '#D8B37C',
  white: '#FFFDF9',
};

const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
`;
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Plus Jakarta Sans', -apple-system, sans-serif";

const Pill: React.FC<{
  text: string;
  bg: string;
  color?: string;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
}> = ({ text, bg, color = C.white, delay = 0, size = 'md' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 195, mass: 0.7 },
  });
  const pad = size === 'lg' ? '18px 36px' : size === 'sm' ? '9px 20px' : '13px 26px';
  const fs = size === 'lg' ? 27 : size === 'sm' ? 17 : 21;

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
        fontSize: fs,
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
        transform: `scale(${interpolate(pop, [0, 1], [0.45, 1])}) translateY(${interpolate(pop, [0, 1], [20, 0])}px)`,
        opacity: interpolate(pop, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' }),
        boxShadow: '0 14px 32px -10px rgba(20,16,12,0.34)',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

const StatusWatermark: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [20, 40, 1075, 1092], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        right: 42,
        bottom: 112,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '8px 18px 8px 8px',
        borderRadius: 999,
        background: dark ? 'rgba(31,27,23,0.78)' : 'rgba(255,253,249,0.92)',
        backdropFilter: 'blur(12px)',
        border: dark ? '1px solid rgba(255,253,249,0.2)' : '1px solid rgba(31,27,23,0.1)',
        opacity,
        boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
      }}
    >
      <Img
        src={staticFile('media/tuftly-logo.jpg')}
        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
      />
      <span
        style={{
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 21,
          letterSpacing: '0.12em',
          color: dark ? C.cream : C.espresso,
        }}
      >
        TUFTLY
      </span>
    </div>
  );
};

/* =====================================================================
   SCENE 1 (0–105f / 0.0s–3.5s): Orbiting Luxury Collage + Kinetic Burst
   ===================================================================== */
const LuxeScene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const l1 = spring({ frame: frame - 5, fps, config: { damping: 13, stiffness: 170 } });
  const l2 = spring({ frame: frame - 14, fps, config: { damping: 13, stiffness: 170 } });
  const l3 = spring({ frame: frame - 23, fps, config: { damping: 13, stiffness: 170 } });
  const seal = spring({ frame: frame - 42, fps, config: { damping: 11, stiffness: 140 } });

  const wipeY = interpolate(frame, [164, 180], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const corners = [
    { img: 'media/hero-rug.jpg', x: 56, y: 155, w: 235, h: 265, rot: -9, d: 6 },
    { img: 'media/bag-rose-tote.jpg', x: 785, y: 165, w: 235, h: 275, rot: 8, d: 12 },
    { img: 'media/car-rug-pair.jpg', x: 58, y: 1455, w: 255, h: 255, rot: 7, d: 18 },
    { img: 'media/wallart-tondo.jpg', x: 775, y: 1445, w: 245, h: 265, rot: -8, d: 24 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 48%, #382E26 0%, ${C.espresso} 66%, #120F0C 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Ambient glowing studio orbs */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 420 + Math.sin(frame / 14) * 30,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197,125,130,0.36), transparent 70%)',
          filter: 'blur(34px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 60,
          bottom: 360 + Math.cos(frame / 15) * 30,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(133,147,72,0.3), transparent 70%)',
          filter: 'blur(34px)',
        }}
      />

      {/* 4 Orbiting Corner Product Cards */}
      {corners.map((c, idx) => {
        const p = spring({ frame: frame - c.d, fps, config: { damping: 13, stiffness: 130 } });
        const bob = Math.sin((frame + idx * 20) / 13) * 14;
        return (
          <div
            key={c.img}
            style={{
              position: 'absolute',
              left: c.x,
              top: c.y + bob,
              width: c.w,
              height: c.h,
              borderRadius: 30,
              overflow: 'hidden',
              border: '4px solid rgba(251,248,243,0.28)',
              boxShadow: '0 26px 56px rgba(0,0,0,0.5)',
              transform: `scale(${p}) rotate(${c.rot + Math.sin(frame / 18) * 2.5}deg)`,
              opacity: p,
            }}
          >
            <Img src={staticFile(c.img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        );
      })}

      {/* Center Kinetic Stack */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 54px',
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Pill text="Bespoke Hand-Tufted Luxury" bg={C.olive} delay={2} size="sm" />
        </div>

        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 94,
            letterSpacing: '-0.03em',
            lineHeight: 0.96,
            color: C.cream,
            transform: `translateY(${interpolate(l1, [0, 1], [65, 0])}px) scale(${interpolate(l1, [0, 1], [0.85, 1])})`,
            opacity: l1,
          }}
        >
          TRANSFORM
        </div>

        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 112,
            lineHeight: 0.95,
            color: C.roseBright,
            marginTop: 6,
            transform: `translateY(${interpolate(l2, [0, 1], [65, 0])}px)`,
            opacity: l2,
            textShadow: '0 10px 40px rgba(197,125,130,0.45)',
          }}
        >
          Your Space
          <br />&amp; Style
        </div>

        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: '0.24em',
            color: C.sand,
            marginTop: 22,
            transform: `translateY(${interpolate(l3, [0, 1], [35, 0])}px)`,
            opacity: l3,
          }}
        >
          PURE HANDCRAFTED TEXTURE
        </div>

        {/* Tuftly Studio Emblem Pill */}
        <div
          style={{
            marginTop: 42,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '14px 36px 14px 16px',
            borderRadius: 999,
            background: 'rgba(251,248,243,0.14)',
            border: '1.5px solid rgba(251,248,243,0.32)',
            backdropFilter: 'blur(12px)',
            transform: `scale(${interpolate(seal, [0, 1], [0.4, 1])})`,
            opacity: seal,
          }}
        >
          <Img
            src={staticFile('media/tuftly-logo.jpg')}
            style={{ width: 82, height: 82, borderRadius: '50%', objectFit: 'cover', border: '3px solid #FBF8F3' }}
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 44, letterSpacing: '0.12em', color: C.white, lineHeight: 1 }}>
              TUFTLY
            </div>
            <div style={{ fontFamily: SANS, fontSize: 15, letterSpacing: '0.16em', color: C.roseBright, textTransform: 'uppercase', marginTop: 4 }}>
              Rugs · Bags · Wall Art · Car Rugs
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Silky Vertical Shutter Wipe */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: C.linen,
          transform: `translateY(${wipeY}%)`,
          zIndex: 40,
        }}
      />
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 2 (105–255f / 3.5s–8.5s): Live Tufting + Carving Split-Stage
   ===================================================================== */
const LuxeScene2: React.FC = () => {
  const frame = useCurrentFrame(); // 0..261 (6.0s..14.7s)
  const { fps } = useVideoConfig();

  const vidIn = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 140 } });
  const cardIn = spring({ frame: frame - 10, fps, config: { damping: 13, stiffness: 150 } });
  const thumbsIn = spring({ frame: frame - 24, fps, config: { damping: 13, stiffness: 150 } });
  // Switches right at 10.2s ("sculpted in plush 3D relief") -> local frame 126!
  const isCarving = frame >= 126;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${C.cream} 0%, ${C.linen} 100%)`,
        padding: '108px 46px 108px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* Top Framed Live Video Stage */}
      <div
        style={{
          height: 820,
          borderRadius: 38,
          overflow: 'hidden',
          position: 'relative',
          border: '6px solid #FFFDF9',
          boxShadow: '0 30px 66px -18px rgba(31,27,23,0.32)',
          transform: `scale(${interpolate(vidIn, [0, 1], [0.92, 1])})`,
          flexShrink: 0,
          background: C.espresso,
        }}
      >
        {!isCarving ? (
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
            playbackRate={1.4}
            startFrom={265}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}

        <div style={{ position: 'absolute', top: 26, left: 26 }}>
          <Pill
            key={isCarving ? 'c' : 't'}
            text={isCarving ? 'Hand-Carved 3D Relief' : 'Tufted Strand by Strand'}
            bg={isCarving ? C.rose : C.olive}
            delay={0}
            size="sm"
          />
        </div>
      </div>

      {/* Elevated Broadcast Editorial Card */}
      <div
        style={{
          background: C.white,
          borderRadius: 34,
          padding: '32px 36px',
          border: '1.5px solid rgba(31,27,23,0.08)',
          boxShadow: '0 26px 56px -20px rgba(31,27,23,0.2)',
          transform: `translateY(${interpolate(cardIn, [0, 1], [55, 0])}px)`,
          opacity: cardIn,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 4, background: C.rose, borderRadius: 4 }} />
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 19, letterSpacing: '0.22em', color: C.olive }}>
            MEET TUFTLY
          </span>
          <div style={{ width: 48, height: 4, background: C.olive, borderRadius: 4 }} />
        </div>

        <h2 style={{ fontFamily: SERIF, fontSize: 66, fontWeight: 600, lineHeight: 0.96, color: C.espresso, margin: 0 }}>
          Every Piece <span style={{ fontStyle: 'italic', color: C.rose }}>Sculpted</span> Exclusively For You.
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 4 }}>
          <Pill text="Plush Wool" bg={C.espresso} delay={16} size="sm" />
          <Pill text="Custom Colours" bg={C.rose} delay={22} size="sm" />
          <Pill text="Made to Order" bg={C.olive} delay={28} size="sm" />
        </div>
      </div>

      {/* Bottom Dual Accent Strip */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 22,
          transform: `translateY(${interpolate(thumbsIn, [0, 1], [45, 0])}px)`,
          opacity: thumbsIn,
        }}
      >
        <div style={{ borderRadius: 28, overflow: 'hidden', border: '5px solid #FFFDF9', boxShadow: '0 18px 40px -14px rgba(31,27,23,0.22)' }}>
          <Img src={staticFile('media/atelier-craft.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ borderRadius: 28, overflow: 'hidden', border: '5px solid #FFFDF9', boxShadow: '0 18px 40px -14px rgba(31,27,23,0.22)' }}>
          <Img src={staticFile('media/user-rug-rack.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 3A (255–340f / 8.5s–11.3s): Statement Rugs Bento Grid
   ===================================================================== */
const LuxeScene3ARugs: React.FC = () => {
  const frame = useCurrentFrame(); // 0..85
  const { fps } = useVideoConfig();

  const topIn = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 150 } });
  const b1In = spring({ frame: frame - 10, fps, config: { damping: 13, stiffness: 150 } });
  const b2In = spring({ frame: frame - 16, fps, config: { damping: 13, stiffness: 150 } });
  const barIn = spring({ frame: frame - 22, fps, config: { damping: 13, stiffness: 160 } });
  const zoom = interpolate(frame, [0, 85], [1, 1.07]);

  return (
    <AbsoluteFill
      style={{
        background: C.cream,
        padding: '108px 46px 108px',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pill text="01 · Statement Rugs" bg={C.olive} delay={0} size="md" />
        <Pill text="From KSh 1,500" bg={C.rose} delay={8} size="md" />
      </div>

      <h2 style={{ fontFamily: SERIF, fontSize: 64, fontWeight: 600, color: C.espresso, margin: 0, lineHeight: 0.98 }}>
        Floor Art That <span style={{ fontStyle: 'italic', color: C.rose }}>Anchors</span> Any Room
      </h2>

      {/* Hero Wide Rug Card */}
      <div
        style={{
          height: 640,
          borderRadius: 34,
          overflow: 'hidden',
          border: '6px solid #FFFDF9',
          boxShadow: '0 28px 64px -18px rgba(31,27,23,0.28)',
          transform: `translateY(${interpolate(topIn, [0, 1], [-60, 0])}px)`,
          opacity: topIn,
          flexShrink: 0,
        }}
      >
        <Img
          src={staticFile('media/hero-rug.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(frame, [0, 85], [1.08, 1])})` }}
        />
      </div>

      {/* Bottom 2 Tall Cards */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <div
          style={{
            borderRadius: 30,
            overflow: 'hidden',
            border: '5px solid #FFFDF9',
            boxShadow: '0 22px 50px -16px rgba(31,27,23,0.26)',
            transform: `translateY(${interpolate(b1In, [0, 1], [90, 0])}px)`,
            opacity: b1In,
          }}
        >
          <Img src={staticFile('media/user-rug-checker.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})` }} />
        </div>
        <div
          style={{
            borderRadius: 30,
            overflow: 'hidden',
            border: '5px solid #FFFDF9',
            boxShadow: '0 22px 50px -16px rgba(31,27,23,0.26)',
            transform: `translateY(${interpolate(b2In, [0, 1], [90, 0])}px)`,
            opacity: b2In,
          }}
        >
          <Img src={staticFile('media/user-rug-portrait.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})` }} />
        </div>
      </div>

      {/* Bottom Offer Bar */}
      <div
        style={{
          background: C.espresso,
          color: C.cream,
          borderRadius: 999,
          padding: '18px 32px',
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: '0.08em',
          transform: `translateY(${interpolate(barIn, [0, 1], [40, 0])}px)`,
          opacity: barIn,
        }}
      >
        LIVING ROOMS · BEDROOMS · RUNNERS · CUSTOM SHAPES
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 3B (340–420f / 11.3s–14.0s): Bespoke Car Rugs Vertical Hero + PiP
   ===================================================================== */
const LuxeScene3BCarRugs: React.FC = () => {
  const frame = useCurrentFrame(); // 0..80
  const { fps } = useVideoConfig();

  const slideIn = spring({ frame, fps, config: { damping: 14, stiffness: 155 } });
  const pipPop = spring({ frame: frame - 12, fps, config: { damping: 12, stiffness: 160 } });

  return (
    <AbsoluteFill style={{ background: C.espresso, overflow: 'hidden' }}>
      <Img
        src={staticFile('media/v-car-rug.jpg')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${interpolate(frame, [0, 80], [1.02, 1.1])})`,
          filter: 'brightness(0.86)',
        }}
      />

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(20,16,13,0.88) 0%, rgba(20,16,13,0.32) 45%, rgba(20,16,13,0.85) 100%)',
        }}
      />

      {/* Top Kinetic Callout */}
      <div
        style={{
          position: 'absolute',
          top: 112,
          left: 52,
          right: 52,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          alignItems: 'flex-start',
        }}
      >
        <Pill text="02 · Bespoke Car Rugs" bg={C.rose} delay={3} size="md" />
        <h2
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 82,
            lineHeight: 0.96,
            color: C.white,
            margin: 0,
            transform: `translateY(${interpolate(slideIn, [0, 1], [50, 0])}px)`,
            opacity: slideIn,
          }}
        >
          UPGRADE EVERY <span style={{ fontFamily: SERIF, fontStyle: 'italic', color: C.roseBright, fontWeight: 600 }}>DRIVE</span>.
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Pill text="Tailored Cabin Fit" bg={C.olive} delay={12} size="sm" />
          <Pill text="Non-Slip Grip" bg="rgba(255,253,249,0.22)" delay={18} size="sm" />
          <Pill text="Your Colours" bg="rgba(255,253,249,0.22)" delay={24} size="sm" />
        </div>
      </div>

      {/* Bottom Floating Tilted PiP Pair Card */}
      <div
        style={{
          position: 'absolute',
          left: 52,
          bottom: 185,
          width: 650,
          height: 410,
          borderRadius: 32,
          overflow: 'hidden',
          border: '6px solid #FFFDF9',
          boxShadow: '0 32px 80px rgba(0,0,0,0.58)',
          transform: `scale(${interpolate(pipPop, [0, 1], [0.7, 1])}) rotate(${interpolate(pipPop, [0, 1], [-6, -2])}deg)`,
          opacity: pipPop,
        }}
      >
        <Img src={staticFile('media/car-rug-pair.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            background: 'rgba(31,27,23,0.88)',
            color: C.cream,
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
   SCENE 4A (420–510f / 14.0s–17.0s): Women's Handbags Editorial Showcase
   ===================================================================== */
const LuxeScene4AHangbags: React.FC = () => {
  const frame = useCurrentFrame(); // 0..90
  const { fps } = useVideoConfig();

  const heroIn = spring({ frame: frame - 3, fps, config: { damping: 13, stiffness: 150 } });
  const sideBags = [
    { img: 'media/user-bag-heart-brown.jpg', label: 'Heart Bags', d: 9 },
    { img: 'media/user-bag-floral.jpg', label: 'Clutches', d: 15 },
    { img: 'media/bag-olive-clutch.jpg', label: 'Chain Bags', d: 21 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(165deg, ${C.roseSoft} 0%, ${C.cream} 55%, ${C.linen} 100%)`,
        padding: '108px 46px 118px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pill text="03 · Women's Handbags" bg={C.rose} delay={0} size="md" />
        <Pill text="From KSh 3,800" bg={C.espresso} delay={8} size="md" />
      </div>

      <h2 style={{ fontFamily: SERIF, fontSize: 66, fontWeight: 600, color: C.espresso, margin: 0, lineHeight: 0.98 }}>
        Wearable Art That <span style={{ fontStyle: 'italic', color: C.rose }}>Turns Heads</span>
      </h2>

      {/* Asymmetric Split: Left Tall Fashion Hero + Right 3-Card Column */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.18fr 0.82fr', gap: 22 }}>
        <div
          style={{
            borderRadius: 34,
            overflow: 'hidden',
            border: '6px solid #FFFDF9',
            boxShadow: '0 28px 62px -18px rgba(31,27,23,0.28)',
            position: 'relative',
            transform: `scale(${interpolate(heroIn, [0, 1], [0.9, 1])})`,
            opacity: heroIn,
          }}
        >
          <Img
            src={staticFile('media/v-fashion-bag.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(frame, [0, 90], [1, 1.06])})` }}
          />
          <div
            style={{
              position: 'absolute',
              left: 20,
              bottom: 20,
              background: 'rgba(255,253,249,0.92)',
              color: C.espresso,
              padding: '10px 22px',
              borderRadius: 999,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Structured Mini &amp; Day Totes
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>
          {sideBags.map((b) => {
            const p = spring({ frame: frame - b.d, fps, config: { damping: 13, stiffness: 160 } });
            return (
              <div
                key={b.img}
                style={{
                  flex: 1,
                  minHeight: 0,
                  borderRadius: 26,
                  overflow: 'hidden',
                  border: '5px solid #FFFDF9',
                  boxShadow: '0 20px 44px -16px rgba(31,27,23,0.24)',
                  position: 'relative',
                  transform: `translateX(${interpolate(p, [0, 1], [80, 0])}px)`,
                  opacity: p,
                }}
              >
                <Img src={staticFile(b.img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div
                  style={{
                    position: 'absolute',
                    left: 12,
                    bottom: 12,
                    background: 'rgba(31,27,23,0.82)',
                    color: C.white,
                    padding: '5px 14px',
                    borderRadius: 999,
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {b.label}
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
   SCENE 4B (510–600f / 17.0s–20.0s): 3D Wall Art, Cushions & Desk Rugs
   ===================================================================== */
const LuxeScene4BWallArt: React.FC = () => {
  const frame = useCurrentFrame(); // 0..90
  const { fps } = useVideoConfig();

  const bottomTiles = [
    { img: 'media/wallart-tondo.jpg', tag: 'Tondos', d: 10 },
    { img: 'media/user-cushions.jpg', tag: '3D Cushions', d: 16 },
    { img: 'media/user-desk-rugs.jpg', tag: 'Desk Rugs', d: 22 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: C.linen,
        padding: '108px 46px 118px',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pill text="04 · 3D Wall & Desk Art" bg={C.olive} delay={0} size="md" />
        <Pill text="Custom Sculpted" bg={C.espresso} delay={8} size="md" />
      </div>

      <h2 style={{ fontFamily: SERIF, fontSize: 64, fontWeight: 600, color: C.espresso, margin: 0, lineHeight: 0.98 }}>
        Dress Your Walls, Desks &amp; <span style={{ fontStyle: 'italic', color: C.rose }}>Home</span>
      </h2>

      {/* Top Dual Feature: Live Hanging Video + 3D Moss Tapestry */}
      <div style={{ flex: 1.25, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <div style={{ borderRadius: 30, overflow: 'hidden', border: '5px solid #FFFDF9', boxShadow: '0 24px 52px -16px rgba(31,27,23,0.28)', background: C.espresso }}>
          <OffthreadVideo
            src={staticFile('media/user-tufting-clip.mp4')}
            muted
            playbackRate={1.05}
            startFrom={410}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ borderRadius: 30, overflow: 'hidden', border: '5px solid #FFFDF9', boxShadow: '0 24px 52px -16px rgba(31,27,23,0.28)' }}>
          <Img src={staticFile('media/wallart-moss.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* Bottom 3-Card Row */}
      <div style={{ flex: 0.85, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
        {bottomTiles.map((t) => {
          const p = spring({ frame: frame - t.d, fps, config: { damping: 13, stiffness: 160 } });
          return (
            <div
              key={t.img}
              style={{
                borderRadius: 26,
                overflow: 'hidden',
                border: '5px solid #FFFDF9',
                position: 'relative',
                boxShadow: '0 18px 40px -14px rgba(31,27,23,0.22)',
                transform: `scale(${interpolate(p, [0, 1], [0.75, 1])})`,
                opacity: p,
              }}
            >
              <Img src={staticFile(t.img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  bottom: 12,
                  background: 'rgba(255,253,249,0.94)',
                  color: C.espresso,
                  padding: '5px 12px',
                  borderRadius: 999,
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {t.tag}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 5 (600–756f / 20.0s–25.2s): StarTimes-Style Broadcast Offer Stage
   ===================================================================== */
const LuxeScene5Offer: React.FC = () => {
  const frame = useCurrentFrame(); // 0..187 (30.15s..36.4s)
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame: frame - 6, fps, config: { damping: 13, stiffness: 145 } });
  // Morphs right as Adrian says "and enjoy free design advice" (~32.7s -> local frame 76)
  const beat2 = spring({ frame: frame - 76, fps, config: { damping: 12, stiffness: 165 } });

  const peekers = [
    { img: 'media/rug-rose.jpg', x: 48, y: 170, rot: -8 },
    { img: 'media/user-bag-neon.jpg', x: 800, y: 180, rot: 8 },
    { img: 'media/car-rug-pair.jpg', x: 52, y: 1490, rot: 7 },
    { img: 'media/user-slippers.jpg', x: 796, y: 1480, rot: -7 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 48%, #FFFDF9 0%, ${C.linen} 70%, #E5DAC8 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 48px',
        overflow: 'hidden',
      }}
    >
      {peekers.map((pk, idx) => {
        const p = spring({ frame: frame - (10 + idx * 5), fps, config: { damping: 14, stiffness: 130 } });
        const bob = Math.sin((frame + idx * 18) / 13) * 12;
        return (
          <div
            key={pk.img}
            style={{
              position: 'absolute',
              left: pk.x,
              top: pk.y + bob,
              width: 225,
              height: 255,
              borderRadius: 28,
              overflow: 'hidden',
              border: '5px solid #FFFDF9',
              boxShadow: '0 22px 48px -16px rgba(31,27,23,0.26)',
              transform: `scale(${p}) rotate(${pk.rot}deg)`,
              opacity: p,
            }}
          >
            <Img src={staticFile(pk.img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        );
      })}

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 26, zIndex: 10 }}>
        <div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: '0.07em', color: C.espresso }}>
            CUSTOM MADE TO YOUR VIBE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8 }}>
            <div style={{ width: 110, height: 5, background: C.rose, borderRadius: 4 }} />
            <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 38, color: C.olive }}>
              Level Up Your Space
            </span>
            <div style={{ width: 110, height: 5, background: C.olive, borderRadius: 4 }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          <Pill text="Rugs" bg={C.olive} delay={10} size="md" />
          <Pill text="Car Rugs" bg={C.espresso} delay={16} size="md" />
          <Pill text="Handbags" bg={C.rose} delay={22} size="md" />
          <Pill text="Wall Art" bg={C.gold} color={C.espresso} delay={28} size="md" />
        </div>

        {/* Morphing Broadcast Offer Card */}
        <div
          style={{
            width: '100%',
            minHeight: 430,
            background: 'rgba(255,253,249,0.95)',
            borderRadius: 42,
            border: '2px solid rgba(31,27,23,0.08)',
            boxShadow: '0 36px 80px -22px rgba(31,27,23,0.24)',
            position: 'relative',
            overflow: 'hidden',
            transform: `scale(${interpolate(cardIn, [0, 1], [0.85, 1])})`,
            opacity: cardIn,
          }}
        >
          {/* Beat 1 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: '48px 42px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
              opacity: interpolate(frame, [66, 76], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: '0.18em', color: C.rose }}>
              100% PERSONALIZED
            </span>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, lineHeight: 1.06, color: C.espresso }}>
              Pick Your Colours.
              <br />
              Choose Your Exact Size.
            </div>
          </div>

          {/* Beat 2 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: '48px 42px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 24,
              opacity: beat2,
              transform: `scale(${interpolate(beat2, [0, 1], [0.85, 1])})`,
            }}
          >
            <Pill text="FREE DESIGN ADVICE" bg={C.olive} delay={78} size="lg" />
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, lineHeight: 1.08, color: C.espresso }}>
              Fast Doorstep Delivery
              <br />
              <span style={{ color: C.rose }}>Across Kenya</span>
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 21, color: '#6C6257' }}>
              50% M-Pesa Deposit Starts Crafting
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 6 (756–900f / 25.2s–30.0s): Spotlight Logo & WhatsApp Status CTA
   ===================================================================== */
const LuxeScene6Finale: React.FC = () => {
  const frame = useCurrentFrame(); // 0..144
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 125 } });
  const ctaIn = spring({ frame: frame - 24, fps, config: { damping: 14, stiffness: 150 } });
  const flareX = interpolate(frame, [0, 115], [-380, 1180]);
  const pulse = 1 + Math.sin(frame / 9) * 0.03;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, #332922 0%, ${C.espresso} 66%, #0E0C0A 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 54px',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: flareX,
          top: 480,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,235,205,0.48) 0%, rgba(197,125,130,0.24) 45%, transparent 72%)',
          filter: 'blur(26px)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <div
          style={{
            padding: 14,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(197,125,130,0.7), rgba(133,147,72,0.6))',
            boxShadow: '0 0 100px rgba(197,125,130,0.42)',
            transform: `scale(${interpolate(logoIn, [0, 1], [0.45, 1])})`,
            opacity: logoIn,
          }}
        >
          <Img
            src={staticFile('media/tuftly-logo.jpg')}
            style={{ width: 290, height: 290, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        <div style={{ fontFamily: SERIF, fontSize: 112, fontWeight: 700, letterSpacing: '0.14em', color: C.white, marginTop: 28, lineHeight: 1, opacity: logoIn }}>
          TUFTLY
        </div>

        <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, color: C.roseBright, marginTop: 8, opacity: logoIn }}>
          Craft You Can Feel.
        </div>

        <div
          style={{
            marginTop: 46,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
            transform: `translateY(${interpolate(ctaIn, [0, 1], [40, 0])}px)`,
            opacity: ctaIn,
          }}
        >
          <div
            style={{
              padding: '26px 54px',
              borderRadius: 999,
              background: C.olive,
              color: C.white,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 42,
              letterSpacing: '0.04em',
              boxShadow: '0 24px 56px rgba(93,102,50,0.58)',
              transform: `scale(${pulse})`,
            }}
          >
            WhatsApp 0118 899 336
          </div>

          <div
            style={{
              padding: '14px 32px',
              borderRadius: 999,
              background: 'rgba(251,248,243,0.14)',
              border: '1.5px solid rgba(251,248,243,0.3)',
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: '0.12em',
              color: C.roseBright,
              textTransform: 'uppercase',
            }}
          >
            Reply &ldquo;HELLO&rdquo; on Status to Order
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TuftlyStatusLuxe: React.FC = () => {
  const frame = useCurrentFrame();
  const isDark = frame < 180 || (frame >= 558 && frame < 670) || frame >= 1092;

  return (
    <AbsoluteFill style={{ backgroundColor: C.espresso }}>
      <style>{FONT_STYLE}</style>
      <Audio src={staticFile('media/master-adrian-luxe.mp3')} volume={1} />

      <Sequence from={0} durationInFrames={180}>
        <LuxeScene1 />
      </Sequence>
      <Sequence from={180} durationInFrames={261}>
        <LuxeScene2 />
      </Sequence>
      <Sequence from={441} durationInFrames={117}>
        <LuxeScene3ARugs />
      </Sequence>
      <Sequence from={558} durationInFrames={112}>
        <LuxeScene3BCarRugs />
      </Sequence>
      <Sequence from={670} durationInFrames={123}>
        <LuxeScene4AHangbags />
      </Sequence>
      <Sequence from={793} durationInFrames={112}>
        <LuxeScene4BWallArt />
      </Sequence>
      <Sequence from={905} durationInFrames={187}>
        <LuxeScene5Offer />
      </Sequence>
      <Sequence from={1092} durationInFrames={273}>
        <LuxeScene6Finale />
      </Sequence>

      <StatusWatermark dark={isDark} />
    </AbsoluteFill>
  );
};
