import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease, pop, prog, rand, typed} from '../anim';
import {Bg, IkaMark, Mono} from '../components/ui';
import {C, FONT, MONO} from '../theme';
import {at} from '../timeline';

const RAY_COLORS = [C.pink, C.violet, C.cyan, C.lime, C.yellow, C.coral];

/* 1 ─ Logo burst */
export const LogoScene: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const s = pop(f, 6, {damping: 9, stiffness: 140});
  const rayT = prog(f, 10, 50);
  const rayOut = prog(f, d - 30, 24);
  const ring = prog(f, 4, 40);
  const exit = prog(f, d - 14, 14, (v) => v * v);
  return (
    <AbsoluteFill>
      <Bg color="#18161D" dots="rgba(255,255,255,0.05)" />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <svg width={1200} height={1200} viewBox="-600 -600 1200 1200" style={{position: 'absolute'}}>
          {Array.from({length: 24}).map((_, i) => {
            const a = (i / 24) * Math.PI * 2 + f * 0.004;
            const r0 = 170 + rayOut * 200;
            const len = (50 + rand(i) * 70) * rayT * (1 - rayOut);
            return (
              <line
                key={i}
                x1={Math.cos(a) * r0}
                y1={Math.sin(a) * r0}
                x2={Math.cos(a) * (r0 + len)}
                y2={Math.sin(a) * (r0 + len)}
                stroke={RAY_COLORS[i % RAY_COLORS.length]}
                strokeWidth={5}
                strokeLinecap="round"
              />
            );
          })}
          <circle r={140 + ring * 12} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={6 * (1 - exit)} opacity={ring} />
          <circle r={140 + ring * 12} fill="rgba(255,255,255,0.04)" opacity={ring} />
        </svg>
        <div style={{transform: `scale(${s * (1 - exit)}) rotate(${(1 - s) * -30}deg)`, filter: `drop-shadow(0 20px 60px ${C.pink}88)`}}>
          <IkaMark size={200} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 2 ─ Hello: mascot is drawn by the global MascotLayer; this scene adds the design-tool frame. */
export const HelloScene: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const sel = prog(f, 70, 16);
  const selOut = prog(f, d - 16, 12);
  const jp = pop(f, at('hello', 'japanese', -3));
  const sq = pop(f, at('hello', 'squid', -3), {damping: 8, stiffness: 260});
  const w = 290;
  const h = 330;
  return (
    <AbsoluteFill>
      <Bg color={C.ink} dots="rgba(255,255,255,0.05)" />
      {/* burst particles as mascot pops out of the logo */}
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {Array.from({length: 28}).map((_, i) => {
          const t = prog(f, 0, 50);
          const a = rand(i + 3) * Math.PI * 2;
          const dist = 120 + rand(i + 9) * 380;
          return (
            <circle
              key={i}
              cx={960 + Math.cos(a) * dist * t}
              cy={540 + Math.sin(a) * dist * t + t * t * 60}
              r={(4 + rand(i) * 8) * (1 - t)}
              fill={RAY_COLORS[i % RAY_COLORS.length]}
            />
          );
        })}
      </svg>
      {/* Figma-ish selection frame */}
      <div
        style={{
          position: 'absolute',
          left: 960 - w / 2,
          top: 540 - h / 2 - 10,
          width: w,
          height: h,
          border: `2px solid ${C.cyan}`,
          opacity: sel * (1 - selOut),
          transform: `scale(${0.9 + sel * 0.1})`,
        }}
      >
        {[
          [-7, -7],
          [w - 7, -7],
          [-7, h - 7],
          [w - 7, h - 7],
        ].map(([x, y], i) => (
          <div key={i} style={{position: 'absolute', left: x - 2, top: y - 2, width: 12, height: 12, background: '#fff', border: `2px solid ${C.cyan}`}} />
        ))}
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            background: C.cyan,
            color: C.ink,
            fontFamily: MONO,
            fontSize: 16,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
          }}
        >
          ika.squid — 240×300
        </div>
      </div>
      {/* イカ = squid tag */}
      <div
        style={{
          position: 'absolute',
          left: 1180,
          top: 610,
          transform: `scale(${jp}) rotate(${-6 * jp}deg)`,
          opacity: 1 - selOut,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div style={{fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: 64, color: '#fff', fontWeight: 700}}>イカ</div>
        <div style={{transform: `scale(${sq})`, transformOrigin: '0% 50%'}}>
          <Mono size={30} color={C.pinkSoft}>
            = squid
          </Mono>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 3 ─ Welcome to Ika */
export const WelcomeScene: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const wAt = at('welcome', 'ikaWelcome', -6);
  const word = interpolate(f, [wAt, wAt + 22], [0, 1], {...clamp, easing: ease});
  const bars = [C.pink, C.violet, C.cyan, C.lime, C.yellow];
  const exit = prog(f, d - 12, 12, (v) => v * v);
  return (
    <AbsoluteFill>
      <Bg color={C.ink} dots="rgba(255,255,255,0.05)" />
      <div style={{position: 'absolute', left: 900, top: 330, transform: `translateY(${exit * -40}px)`, opacity: 1 - exit}}>
        <div style={{fontFamily: MONO, fontSize: 34, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em', height: 44}}>
          {typed('welcome to', f, at('welcome', 'welcome', -4), 30)}
          <span style={{opacity: Math.floor(f / 15) % 2 ? 0 : 1}}>_</span>
        </div>
        <div style={{overflow: 'hidden', height: 290}}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 850,
              fontSize: 300,
              letterSpacing: '-0.06em',
              lineHeight: 1,
              color: '#fff',
              transform: `translateY(${(1 - word) * 100}%)`,
            }}
          >
            Ika<span style={{color: C.pink}}>.</span>
          </div>
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 26}}>
          {bars.map((c, i) => {
            const t = prog(f, wAt + 14 + i * 4, 18);
            return <div key={i} style={{width: 92 * t, height: 12, borderRadius: 6, background: c}} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
