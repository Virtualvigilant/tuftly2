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
  roseBright: '#E0979C',
  roseSoft: '#F8E6E7',
  olive: '#5D6632',
  gold: '#D8B37C',
  white: '#FFFDF9',
};

const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
`;
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Plus Jakarta Sans', -apple-system, sans-serif";

const Pill: React.FC<{ text: string; bg: string; color?: string; delay?: number }> = ({
  text,
  bg,
  color = C.white,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 180 } });
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: '13px 28px',
        borderRadius: 999,
        background: bg,
        color,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        transform: `scale(${interpolate(pop, [0, 1], [0.5, 1])})`,
        opacity: pop,
        boxShadow: '0 14px 32px rgba(0,0,0,0.22)',
      }}
    >
      {text}
    </div>
  );
};

/* Vertical 9:16 Reels / TikTok / WhatsApp Status Cut (Synced to exact same 32s ElevenLabs VO!) */
export const TuftlyReels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: C.espresso }}>
      <style>{FONT_STYLE}</style>
      <Audio src={staticFile('media/bg-groove.mp3')} volume={0.85} />

      {/* 0–105f: Kinetic Hook */}
      <Sequence from={0} durationInFrames={105}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 40%, #372D26 0%, ${C.espresso} 72%)`,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 64,
            gap: 22,
          }}
        >
          <Pill text="Bespoke Tufting Atelier" bg={C.olive} delay={2} />
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 96, lineHeight: 0.96, color: C.cream }}>
            TRANSFORM
          </div>
          <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 112, lineHeight: 0.95, color: C.roseBright }}>
            Your Space &amp; Style
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: '0.2em', color: C.sand }}>
            HANDCRAFTED LUXURY · KENYA
          </div>
          <div style={{ marginTop: 34 }}>
            <Img
              src={staticFile('media/tuftly-logo.jpg')}
              style={{
                width: 210,
                height: 210,
                borderRadius: '50%',
                border: '6px solid #FBF8F3',
                boxShadow: '0 22px 60px rgba(197,125,130,0.4)',
                transform: `scale(${spring({ frame: frame - 36, fps, config: { damping: 11, stiffness: 140 } })})`,
              }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 105–270f: Live Tufting Action Full Vertical */}
      <Sequence from={105} durationInFrames={165}>
        <AbsoluteFill style={{ background: C.espresso }}>
          <OffthreadVideo
            src={staticFile('media/user-tufting-clip.mp4')}
            muted
            playbackRate={1.85}
            startFrom={0}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <AbsoluteFill
            style={{
              background: 'linear-gradient(180deg, rgba(20,16,13,0.72) 0%, transparent 32%, transparent 62%, rgba(20,16,13,0.88) 100%)',
              padding: '90px 56px 110px',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
              <Pill text="Meet Tuftly" bg={C.rose} delay={4} />
              <div style={{ fontFamily: SERIF, fontSize: 78, fontWeight: 600, color: C.white, lineHeight: 0.96 }}>
                Tufted &amp; Carved <span style={{ fontStyle: 'italic', color: C.roseBright }}>By Hand</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Pill text="Plush Wool" bg={C.olive} delay={22} />
              <Pill text="Custom Colours" bg="rgba(255,253,249,0.2)" delay={30} />
              <Pill text="Made to Order" bg="rgba(255,253,249,0.2)" delay={38} />
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* 270–365f: Statement Rugs */}
      <Sequence from={270} durationInFrames={95}>
        <AbsoluteFill style={{ background: C.cream, padding: '74px 44px', gap: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Pill text="Statement Rugs" bg={C.olive} delay={0} />
            <Pill text="From KSh 9,500" bg={C.rose} delay={8} />
          </div>
          <div style={{ flex: 1.15, borderRadius: 32, overflow: 'hidden', border: '6px solid #FFFDF9', boxShadow: '0 24px 54px rgba(31,27,23,0.22)' }}>
            <Img src={staticFile('media/hero-rug.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 0.95, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            <div style={{ borderRadius: 28, overflow: 'hidden', border: '5px solid #FFFDF9' }}>
              <Img src={staticFile('media/user-rug-checker.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ borderRadius: 28, overflow: 'hidden', border: '5px solid #FFFDF9' }}>
              <Img src={staticFile('media/user-rug-portrait.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 365–450f: Custom Car Rugs */}
      <Sequence from={365} durationInFrames={85}>
        <AbsoluteFill style={{ background: C.espresso, padding: '74px 44px', gap: 26 }}>
          <Pill text="Custom Car Rugs" bg={C.rose} delay={2} />
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 70, lineHeight: 0.98, color: C.white }}>
            UPGRADE EVERY <span style={{ fontFamily: SERIF, fontStyle: 'italic', color: C.roseBright }}>DRIVE</span>.
          </div>
          <div style={{ flex: 1, borderRadius: 32, overflow: 'hidden', border: '5px solid #FFFDF9' }}>
            <Img src={staticFile('media/car-rug-interior.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 0.85, borderRadius: 32, overflow: 'hidden', border: '5px solid #FFFDF9' }}>
            <Img src={staticFile('media/car-rug-pair.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 450–545f: Women's Handbags */}
      <Sequence from={450} durationInFrames={95}>
        <AbsoluteFill style={{ background: C.roseSoft, padding: '74px 44px', gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Pill text="Women's Handbags" bg={C.rose} delay={0} />
            <Pill text="From KSh 5,800" bg={C.espresso} delay={8} />
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 22 }}>
            {['media/bag-rose-tote.jpg', 'media/user-bag-heart-brown.jpg', 'media/user-bag-floral.jpg', 'media/bag-olive-clutch.jpg'].map((img) => (
              <div key={img} style={{ borderRadius: 28, overflow: 'hidden', border: '5px solid #FFFDF9', boxShadow: '0 20px 44px rgba(31,27,23,0.2)' }}>
                <Img src={staticFile(img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 545–640f: Wall Art, Cushions & Desk Rugs */}
      <Sequence from={545} durationInFrames={95}>
        <AbsoluteFill style={{ background: C.linen, padding: '74px 44px', gap: 24 }}>
          <Pill text="3D Wall Art, Cushions & More" bg={C.olive} delay={2} />
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 22 }}>
            {['media/wallart-moss.jpg', 'media/wallart-tondo.jpg', 'media/user-cushions.jpg', 'media/user-desk-rugs.jpg'].map((img) => (
              <div key={img} style={{ borderRadius: 28, overflow: 'hidden', border: '5px solid #FFFDF9' }}>
                <Img src={staticFile(img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 640–810f: Custom Offer Card */}
      <Sequence from={640} durationInFrames={170}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${C.cream} 0%, ${C.linen} 100%)`,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 58,
            textAlign: 'center',
            gap: 32,
          }}
        >
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 48, color: C.espresso, letterSpacing: '0.06em' }}>
            CUSTOM MADE TO YOUR VIBE
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Pill text="Rugs" bg={C.olive} delay={8} />
            <Pill text="Car Rugs" bg={C.espresso} delay={16} />
            <Pill text="Handbags" bg={C.rose} delay={24} />
            <Pill text="Wall Art" bg={C.gold} color={C.espresso} delay={32} />
          </div>
          <div
            style={{
              width: '100%',
              background: C.white,
              borderRadius: 38,
              padding: '56px 42px',
              boxShadow: '0 30px 70px -20px rgba(31,27,23,0.22)',
              display: 'flex',
              flexDirection: 'column',
              gap: 28,
            }}
          >
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, lineHeight: 1.08, color: C.espresso }}>
              Pick Your Colours &amp; Size
            </div>
            <div>
              <Pill text="Free Design Consultation" bg={C.olive} delay={42} />
            </div>
            <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 54, color: C.rose, lineHeight: 1.08 }}>
              Fast Delivery Across Kenya
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 810–960f: Spotlight Logo & WhatsApp Finale */}
      <Sequence from={810} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 40%, #342A23 0%, ${C.espresso} 68%, #0E0C0A 100%)`,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 64,
            gap: 24,
          }}
        >
          <div
            style={{
              padding: 14,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(197,125,130,0.7), rgba(133,147,72,0.6))',
              boxShadow: '0 0 100px rgba(197,125,130,0.42)',
            }}
          >
            <Img
              src={staticFile('media/tuftly-logo.jpg')}
              style={{ width: 290, height: 290, borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 112, fontWeight: 700, letterSpacing: '0.14em', color: C.white, lineHeight: 1 }}>
            TUFTLY
          </div>
          <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 46, color: C.roseBright }}>
            Craft You Can Feel.
          </div>
          <div
            style={{
              marginTop: 26,
              padding: '26px 52px',
              borderRadius: 999,
              background: C.olive,
              color: C.white,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 42,
              boxShadow: '0 22px 54px rgba(93,102,50,0.55)',
            }}
          >
            WhatsApp 0118 899 336
          </div>
          <div style={{ fontFamily: SANS, fontSize: 22, letterSpacing: '0.18em', color: C.sand, textTransform: 'uppercase' }}>
            Order Today · Nairobi, Kenya
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
