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
  linen: '#F3EBE0',
  espresso: '#1D1814',
  rose: '#C87279',
  roseBright: '#F2A3A9',
  roseDeep: '#99484F',
  olive: '#56612B',
  oliveBright: '#8FA049',
  oliveDeep: '#2D3415',
  gold: '#E3BC7A',
  white: '#FFFDF9',
};

const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
`;
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Plus Jakarta Sans', -apple-system, sans-serif";

const SlapSticker: React.FC<{
  text: string;
  bg: string;
  color?: string;
  rotate?: number;
  delay?: number;
  fontSize?: number;
}> = ({ text, bg, color = C.white, rotate = -3, delay = 0, fontSize = 24 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 220, mass: 0.65 },
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 30px',
        borderRadius: 18,
        background: bg,
        color,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        border: '3px solid #FFFDF9',
        boxShadow: '0 16px 34px rgba(0,0,0,0.32)',
        transform: `scale(${interpolate(s, [0, 1], [1.7, 1])}) rotate(${rotate}deg)`,
        opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

const SpinningSeal: React.FC<{ size?: number }> = ({ size = 230 }) => {
  const frame = useCurrentFrame();
  const rot = (frame * 1.4) % 360;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg
        viewBox="0 0 240 240"
        style={{
          width: '100%',
          height: '100%',
          transform: `rotate(${rot}deg)`,
        }}
      >
        <defs>
          <path
            id="sealCircle"
            d="M 120, 120 m -94, 0 a 94,94 0 1,1 188,0 a 94,94 0 1,1 -188,0"
          />
        </defs>
        <text
          fill={C.gold}
          fontFamily={SANS}
          fontSize="15.5"
          fontWeight="800"
          letterSpacing="4.2"
        >
          <textPath href="#sealCircle">
            • 100% HAND-TUFTED • TUFTLY ATELIER KENYA
          </textPath>
        </text>
      </svg>
      <Img
        src={staticFile('media/tuftly-logo.jpg')}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: size * 0.64,
          height: size * 0.64,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '4px solid #FFFDF9',
          boxShadow: '0 14px 36px rgba(0,0,0,0.4)',
        }}
      />
    </div>
  );
};

/* =====================================================================
   SCENE 1 (0–99f / 0.0s–3.3s): Bold Kinetic Poster Slam ("BORING SPACES? GO BESPOKE!")
   ===================================================================== */
const PopScene1Hook: React.FC = () => {
  const frame = useCurrentFrame(); // 0..128 (0.0s..4.28s)
  const { fps } = useVideoConfig();

  const slam1 = spring({ frame: frame - 3, fps, config: { damping: 11, stiffness: 200 } });
  // Crosses out "ORDINARY DECOR?" and slams "GO BESPOKE!" right at 2.15s (frame 64) when Adalina says "Go bespoke with Tuftly!"
  const strike = interpolate(frame, [56, 66], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const slam2 = spring({ frame: frame - 64, fps, config: { damping: 11, stiffness: 190 } });
  const cardsIn = spring({ frame: frame - 72, fps, config: { damping: 12, stiffness: 160 } });

  const stickers = [
    { img: 'media/user-rug-uno.jpg', x: 75, y: 1200, rot: -10 },
    { img: 'media/user-bag-neon.jpg', x: 405, y: 1165, rot: 2 },
    { img: 'media/car-rug-pair.jpg', x: 725, y: 1205, rot: 9 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(155deg, ${C.oliveDeep} 0%, ${C.espresso} 52%, #2B191B 100%)`,
        padding: '115px 52px 115px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Top Spinning Seal */}
      <SpinningSeal size={215} />

      {/* Crossed-out "Boring Spaces?" */}
      <div
        style={{
          position: 'relative',
          marginTop: 28,
          transform: `scale(${interpolate(slam1, [0, 1], [0.5, 1])})`,
          opacity: slam1,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 64,
            color: 'rgba(251,248,243,0.72)',
            letterSpacing: '-0.02em',
          }}
        >
          ORDINARY DECOR?
        </span>
        <div
          style={{
            position: 'absolute',
            left: '-4%',
            top: '50%',
            width: `${strike * 1.08}%`,
            height: 11,
            background: C.rose,
            borderRadius: 8,
            transform: 'rotate(-4deg)',
          }}
        />
      </div>

      {/* Giant "GO BESPOKE!" Burst */}
      <div
        style={{
          marginTop: 18,
          transform: `scale(${interpolate(slam2, [0, 1], [0.4, 1])})`,
          opacity: slam2,
        }}
      >
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 108, lineHeight: 0.94, color: C.white, letterSpacing: '-0.03em' }}>
          GO BESPOKE
        </div>
        <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 96, lineHeight: 0.95, color: C.roseBright }}>
          With Tuftly!
        </div>
      </div>

      {/* 3 Popping Tilted Product Cards */}
      {stickers.map((st, i) => (
        <div
          key={st.img}
          style={{
            position: 'absolute',
            left: st.x,
            top: st.y + Math.sin((frame + i * 16) / 10) * 10,
            width: 275,
            height: 335,
            borderRadius: 28,
            overflow: 'hidden',
            border: '6px solid #FFFDF9',
            boxShadow: '0 26px 56px rgba(0,0,0,0.5)',
            transform: `scale(${cardsIn}) rotate(${st.rot}deg)`,
            opacity: cardsIn,
          }}
        >
          <Img src={staticFile(st.img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ))}

      <div style={{ position: 'absolute', bottom: 155 }}>
        <SlapSticker text="Handcrafted in Kenya" bg={C.olive} rotate={-2} delay={80} fontSize={23} />
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 2 (99–246f / 3.3s–8.2s): Triple-Ribbon Kinetic Motion Wall
   ===================================================================== */
const PopScene2TripleWall: React.FC = () => {
  const frame = useCurrentFrame(); // 0..147
  const { fps } = useVideoConfig();

  const b1 = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 150 } });
  const b2 = spring({ frame: frame - 9, fps, config: { damping: 14, stiffness: 150 } });
  const b3 = spring({ frame: frame - 16, fps, config: { damping: 14, stiffness: 150 } });

  const stripImgs = [
    'media/user-rug-checker.jpg',
    'media/bag-rose-tote.jpg',
    'media/user-bag-heart-pink.jpg',
    'media/wallart-moss.jpg',
    'media/user-cushions.jpg',
    'media/user-slippers.jpg',
    'media/rug-savanna.jpg',
  ];
  const scrollX = -frame * 6.5;

  return (
    <AbsoluteFill
      style={{
        background: C.cream,
        padding: '108px 42px 115px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        overflow: 'hidden',
      }}
    >
      {/* Band 1: Live Tufting & Carving Video */}
      <div
        style={{
          height: 690,
          borderRadius: 36,
          overflow: 'hidden',
          position: 'relative',
          border: '6px solid #1D1814',
          boxShadow: '0 24px 50px -16px rgba(0,0,0,0.32)',
          transform: `translateX(${interpolate(b1, [0, 1], [-220, 0])}px)`,
          opacity: b1,
          flexShrink: 0,
        }}
      >
        <OffthreadVideo
          src={staticFile('media/user-tufting-clip.mp4')}
          muted
          playbackRate={frame < 112 ? 2.0 : 1.4}
          startFrom={frame < 112 ? 15 : 270}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 24, left: 24 }}>
          <SlapSticker
            text={frame < 112 ? 'Live Studio Tufting' : '3D Precision Carving'}
            bg={C.rose}
            rotate={-2}
            delay={4}
            fontSize={20}
          />
        </div>
      </div>

      {/* Band 2: Continuous Scrolling Filmstrip Carousel */}
      <div
        style={{
          height: 455,
          borderRadius: 32,
          background: C.espresso,
          padding: '22px 0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          transform: `translateX(${interpolate(b2, [0, 1], [220, 0])}px)`,
          opacity: b2,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 20,
            paddingLeft: 24,
            transform: `translateX(${scrollX}px)`,
          }}
        >
          {[...stripImgs, ...stripImgs].map((img, idx) => (
            <div
              key={`${img}-${idx}`}
              style={{
                width: 315,
                height: 410,
                borderRadius: 22,
                overflow: 'hidden',
                flexShrink: 0,
                border: '4px solid #FFFDF9',
              }}
            >
              <Img src={staticFile(img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Band 3: Bold Statement Banner */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          borderRadius: 34,
          background: `linear-gradient(135deg, ${C.olive} 0%, ${C.oliveDeep} 100%)`,
          padding: '32px 38px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: C.white,
          transform: `translateY(${interpolate(b3, [0, 1], [90, 0])}px)`,
          opacity: b3,
          boxShadow: '0 24px 50px -16px rgba(45,52,21,0.45)',
        }}
      >
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, lineHeight: 1.02 }}>
          WE TUFT YOUR IMAGINATION
        </div>
        <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 40, color: C.gold, marginTop: 10 }}>
          Rugs · Car Rugs · Handbags · Wall Art · Gifts
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 3A (246–330f / 8.2s–11.0s): Fanned Rug Deck + Slap Price Tag
   ===================================================================== */
const PopScene3ARugsDeck: React.FC = () => {
  const frame = useCurrentFrame(); // 0..84
  const { fps } = useVideoConfig();

  const fan = spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 140 } });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, #FFFDF9 0%, ${C.linen} 100%)`,
        padding: '112px 48px 118px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <SlapSticker text="Statement Area & Quote Rugs" bg={C.espresso} rotate={-2} delay={0} fontSize={22} />
        <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: 72, color: C.espresso, margin: '22px 0 0', lineHeight: 0.98 }}>
          BOLD RUGS,
          <br />
          <span style={{ fontFamily: SERIF, fontStyle: 'italic', color: C.rose, fontSize: 82 }}>Zero Limits.</span>
        </h2>
      </div>

      {/* 3-Card Fanning Deck */}
      <div style={{ position: 'relative', width: '100%', height: 960, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* Left Back Card */}
        <div
          style={{
            position: 'absolute',
            width: 580,
            height: 740,
            borderRadius: 34,
            overflow: 'hidden',
            border: '7px solid #FFFDF9',
            boxShadow: '0 24px 54px rgba(0,0,0,0.22)',
            transform: `translateX(${interpolate(fan, [0, 1], [0, -165])}px) rotate(${interpolate(fan, [0, 1], [0, -10])}deg) scale(0.9)`,
          }}
        >
          <Img src={staticFile('media/user-rug-uno.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Right Back Card */}
        <div
          style={{
            position: 'absolute',
            width: 580,
            height: 740,
            borderRadius: 34,
            overflow: 'hidden',
            border: '7px solid #FFFDF9',
            boxShadow: '0 24px 54px rgba(0,0,0,0.22)',
            transform: `translateX(${interpolate(fan, [0, 1], [0, 165])}px) rotate(${interpolate(fan, [0, 1], [0, 10])}deg) scale(0.9)`,
          }}
        >
          <Img src={staticFile('media/rug-rose.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Center Front Hero Card */}
        <div
          style={{
            position: 'relative',
            width: 650,
            height: 820,
            borderRadius: 38,
            overflow: 'hidden',
            border: '8px solid #FFFDF9',
            boxShadow: '0 36px 80px rgba(31,27,23,0.36)',
            transform: `scale(${interpolate(fan, [0, 1], [0.82, 1])})`,
          }}
        >
          <Img
            src={staticFile('media/user-rug-checker.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(frame, [0, 84], [1, 1.07])})` }}
          />
        </div>

        {/* Slap Price Sticker */}
        <div style={{ position: 'absolute', right: 34, bottom: 48 }}>
          <SlapSticker text="From KSh 1,500" bg={C.rose} rotate={5} delay={16} fontSize={34} />
        </div>
      </div>

      {/* Feature Check Pills */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <SlapSticker text="✓ Living Room" bg={C.olive} rotate={-1} delay={18} fontSize={19} />
        <SlapSticker text="✓ Bedroom" bg={C.olive} rotate={1} delay={24} fontSize={19} />
        <SlapSticker text="✓ Custom Shapes" bg={C.olive} rotate={-1} delay={30} fontSize={19} />
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 3B (330–414f / 11.0s–13.8s): Puzzle-Split Car Rugs Showcase
   ===================================================================== */
const PopScene3BCarRugs: React.FC = () => {
  const frame = useCurrentFrame(); // 0..84
  const { fps } = useVideoConfig();

  const slide = spring({ frame, fps, config: { damping: 14, stiffness: 150 } });

  return (
    <AbsoluteFill style={{ background: C.espresso, overflow: 'hidden' }}>
      {/* Top Half Sliding From Left */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '52%',
          overflow: 'hidden',
          transform: `translateX(${interpolate(slide, [0, 1], [-1080, 0])}px)`,
        }}
      >
        <Img
          src={staticFile('media/car-rug-interior.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(frame, [0, 84], [1, 1.08])})` }}
        />
      </div>

      {/* Bottom Half Sliding From Right */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '52%',
          overflow: 'hidden',
          transform: `translateX(${interpolate(slide, [0, 1], [1080, 0])}px)`,
        }}
      >
        <Img
          src={staticFile('media/car-rug-pair.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(frame, [0, 84], [1.08, 1])})` }}
        />
      </div>

      {/* Center Bold Kinetic Belt */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
        <div
          style={{
            background: C.espresso,
            borderTop: '5px solid #FFFDF9',
            borderBottom: '5px solid #FFFDF9',
            padding: '30px 48px',
            width: '108%',
            transform: `rotate(-3deg) scale(${interpolate(slide, [0, 1], [0.6, 1])})`,
            textAlign: 'center',
            boxShadow: '0 28px 70px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.white, lineHeight: 1 }}>
            CUSTOM <span style={{ color: C.roseBright }}>CAR RUGS</span>
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: '0.18em', color: C.gold, marginTop: 10 }}>
            TAILORED TO YOUR CABIN · NON-SLIP BACKING
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 4A (414–504f / 13.8s–16.8s): Magazine-Cover Handbags Edit
   ===================================================================== */
const PopScene4ABags: React.FC = () => {
  const frame = useCurrentFrame(); // 0..90
  const { fps } = useVideoConfig();

  const minis = [
    { img: 'media/user-bag-heart-pink.jpg', y: 390, d: 8 },
    { img: 'media/user-bag-neon.jpg', y: 760, d: 15 },
    { img: 'media/user-bag-cozy1.jpg', y: 1130, d: 22 },
  ];

  return (
    <AbsoluteFill style={{ background: C.espresso, overflow: 'hidden' }}>
      <Img
        src={staticFile('media/v-fashion-bag.jpg')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${interpolate(frame, [0, 90], [1, 1.07])})`,
          filter: 'brightness(0.84)',
        }}
      />
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(20,16,13,0.75) 0%, transparent 35%, rgba(20,16,13,0.85) 100%)',
        }}
      />

      {/* Magazine Masthead */}
      <div style={{ position: 'absolute', top: 112, left: 52, right: 52 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 116, lineHeight: 0.88, color: C.white, letterSpacing: '-0.02em' }}>
          THE BAG
          <br />
          <span style={{ fontStyle: 'italic', color: C.roseBright }}>Edit.</span>
        </div>
      </div>

      {/* Cascading Floating Mini Polaroids on Right */}
      {minis.map((m, i) => {
        const p = spring({ frame: frame - m.d, fps, config: { damping: 12, stiffness: 165 } });
        return (
          <div
            key={m.img}
            style={{
              position: 'absolute',
              right: 48,
              top: m.y,
              width: 290,
              height: 335,
              borderRadius: 26,
              overflow: 'hidden',
              border: '6px solid #FFFDF9',
              boxShadow: '0 24px 54px rgba(0,0,0,0.48)',
              transform: `translateX(${interpolate(p, [0, 1], [140, 0])}px) rotate(${i % 2 === 0 ? -4 : 4}deg)`,
              opacity: p,
            }}
          >
            <Img src={staticFile(m.img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        );
      })}

      {/* Bottom Price Callout */}
      <div style={{ position: 'absolute', left: 52, bottom: 155, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
        <SlapSticker text="Handbags From KSh 3,800" bg={C.rose} rotate={-2} delay={12} fontSize={30} />
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: C.cream, letterSpacing: '0.08em' }}>
          TOTES · HEART BAGS · CLUTCHES
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 4B (504–594f / 16.8s–19.8s): 4-Quadrant Spotlight Pulse
   ===================================================================== */
const PopScene4BQuad: React.FC = () => {
  const frame = useCurrentFrame(); // 0..126 ("3D wall art, cushions, slides, and desk rugs!")
  const activeIdx = Math.min(3, Math.floor(frame / 31));

  const quads = [
    { img: 'media/wallart-moss.jpg', label: '3D Wall Art' },
    { img: 'media/user-cushions.jpg', label: '3D Cushions' },
    { img: 'media/user-slippers.jpg', label: 'Tufted Slides' },
    { img: 'media/user-desk-rugs.jpg', label: 'Desk & Quote Rugs' },
  ];

  return (
    <AbsoluteFill
      style={{
        background: C.linen,
        padding: '112px 44px 118px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 22,
      }}
    >
      {quads.map((q, idx) => {
        const isActive = idx === activeIdx;
        return (
          <div
            key={q.img}
            style={{
              borderRadius: 32,
              overflow: 'hidden',
              position: 'relative',
              border: isActive ? `7px solid ${C.rose}` : '5px solid #FFFDF9',
              boxShadow: isActive ? '0 26px 60px rgba(200,114,121,0.45)' : '0 18px 40px rgba(0,0,0,0.18)',
              transform: `scale(${isActive ? 1.03 : 0.98})`,
            }}
          >
            <Img src={staticFile(q.img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div
              style={{
                position: 'absolute',
                left: 18,
                bottom: 18,
                background: isActive ? C.rose : 'rgba(29,24,20,0.84)',
                color: C.white,
                padding: '10px 22px',
                borderRadius: 999,
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 20,
              }}
            >
              {q.label}
            </div>
          </div>
        );
      })}

      {/* Center Floating Medallion */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
        <SlapSticker text="Endless Custom Ideas!" bg={C.espresso} rotate={-3} delay={4} fontSize={28} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 5 (594–750f / 19.8s–25.0s): 1-2-3 Animated "How to Order" Stepper
   ===================================================================== */
const PopScene5Stepper: React.FC = () => {
  const frame = useCurrentFrame(); // 0..194 (26.15s..32.62s)
  const { fps } = useVideoConfig();

  const steps = [
    {
      num: '01',
      title: 'Send Your Idea or Pick a Piece',
      sub: 'Choose any colours, size, shape, or custom photo',
      img: 'media/rug-savanna.jpg',
      bg: C.olive,
      delay: 44,
    },
    {
      num: '02',
      title: 'Free Mockup & Clear Quote',
      sub: '50% M-Pesa deposit kicks off studio crafting',
      img: 'media/bag-rose-tote.jpg',
      bg: C.rose,
      delay: 78,
    },
    {
      num: '03',
      title: 'Fast Delivery Across Kenya',
      sub: 'Hand-carved & delivered straight to your door',
      img: 'media/wallart-tondo.jpg',
      bg: C.espresso,
      delay: 122,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${C.cream} 0%, ${C.linen} 100%)`,
        padding: '118px 48px 124px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <SlapSticker text="Simple & Seamless" bg={C.olive} rotate={-2} delay={0} fontSize={20} />
        <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: 66, color: C.espresso, margin: '20px 0 0', lineHeight: 1 }}>
          ORDER IN <span style={{ color: C.rose }}>3 EASY STEPS</span>
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {steps.map((st) => {
          const p = spring({ frame: frame - st.delay, fps, config: { damping: 13, stiffness: 155 } });
          return (
            <div
              key={st.num}
              style={{
                background: C.white,
                borderRadius: 34,
                padding: '28px 30px',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                boxShadow: '0 26px 56px -18px rgba(29,24,20,0.2)',
                border: '2px solid rgba(29,24,20,0.06)',
                transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
                opacity: p,
              }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: '50%',
                  background: st.bg,
                  color: C.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 46,
                  flexShrink: 0,
                }}
              >
                {st.num}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.espresso, lineHeight: 1.15 }}>
                  {st.title}
                </div>
                <div style={{ fontFamily: SANS, fontSize: 22, color: '#63594F', marginTop: 6 }}>
                  {st.sub}
                </div>
              </div>

              <Img
                src={staticFile(st.img)}
                style={{ width: 135, height: 150, borderRadius: 22, objectFit: 'cover', flexShrink: 0 }}
              />
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 42, color: C.olive }}>
        Crafted Fresh in Nairobi · Shipped Countrywide
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
   SCENE 6 (750–900f / 25.0s–30.0s): Bold Olive-Gold WhatsApp Status Finale
   ===================================================================== */
const PopScene6Finale: React.FC = () => {
  const frame = useCurrentFrame(); // 0..150
  const { fps } = useVideoConfig();

  const popIn = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 140 } });
  const btnIn = spring({ frame: frame - 22, fps, config: { damping: 13, stiffness: 160 } });
  const bounceY = Math.sin(frame / 6) * 8;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, #3D4520 0%, ${C.espresso} 68%, #100D0B 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 52px',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Expanding Concentric Pulse Rings */}
      {[0, 1, 2].map((r) => {
        const prog = ((frame * 1.4 + r * 50) % 150) / 150;
        return (
          <div
            key={r}
            style={{
              position: 'absolute',
              width: 340 + prog * 760,
              height: 340 + prog * 760,
              borderRadius: '50%',
              border: '2px solid rgba(227,188,122,0.3)',
              opacity: 1 - prog,
            }}
          />
        );
      })}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <div style={{ transform: `scale(${popIn})`, opacity: popIn }}>
          <SpinningSeal size={310} />
        </div>

        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 82, color: C.white, lineHeight: 0.98, marginTop: 26, opacity: popIn }}>
          LET&apos;S TUFT
          <br />
          <span style={{ fontFamily: SERIF, fontStyle: 'italic', color: C.roseBright, fontSize: 96 }}>Yours Today!</span>
        </div>

        <div
          style={{
            marginTop: 42,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            transform: `scale(${btnIn})`,
            opacity: btnIn,
          }}
        >
          <div
            style={{
              padding: '28px 56px',
              borderRadius: 999,
              background: C.rose,
              color: C.white,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 44,
              border: '4px solid #FFFDF9',
              boxShadow: '0 24px 60px rgba(200,114,121,0.55)',
            }}
          >
            WhatsApp 0118 899 336
          </div>

          <div
            style={{
              transform: `translateY(${bounceY}px)`,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: '0.14em',
              color: C.gold,
              textTransform: 'uppercase',
            }}
          >
            ↓ Reply &ldquo;HELLO&rdquo; on Status to Order ↓
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TuftlyStatusPop: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.espresso }}>
      <style>{FONT_STYLE}</style>
      <Audio src={staticFile('media/master-adalina-pop.mp3')} volume={1} />

      <Sequence from={0} durationInFrames={128}>
        <PopScene1Hook />
      </Sequence>
      <Sequence from={128} durationInFrames={207}>
        <PopScene2TripleWall />
      </Sequence>
      <Sequence from={335} durationInFrames={114}>
        <PopScene3ARugsDeck />
      </Sequence>
      <Sequence from={449} durationInFrames={93}>
        <PopScene3BCarRugs />
      </Sequence>
      <Sequence from={542} durationInFrames={117}>
        <PopScene4ABags />
      </Sequence>
      <Sequence from={659} durationInFrames={126}>
        <PopScene4BQuad />
      </Sequence>
      <Sequence from={785} durationInFrames={194}>
        <PopScene5Stepper />
      </Sequence>
      <Sequence from={979} durationInFrames={275}>
        <PopScene6Finale />
      </Sequence>
    </AbsoluteFill>
  );
};
