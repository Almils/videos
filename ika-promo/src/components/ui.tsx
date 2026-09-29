import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, pop, prog, typed} from '../anim';
import {C, FONT, MONO} from '../theme';

/* ───────────── Backgrounds ───────────── */

export const Bg: React.FC<{color: string; dots?: string; vignette?: boolean; drift?: boolean}> = ({
  color,
  dots,
  vignette = true,
  drift = true,
}) => {
  const f = useCurrentFrame();
  const o = drift ? (f * 0.25) % 36 : 0;
  return (
    <AbsoluteFill style={{background: color}}>
      {dots && (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(${dots} 1.6px, transparent 1.7px)`,
            backgroundSize: '36px 36px',
            backgroundPosition: `${o}px ${o}px`,
          }}
        />
      )}
      {vignette && (
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.35) 100%)'}} />
      )}
    </AbsoluteFill>
  );
};

/* ───────────── Speech bubble (types like the reference) ───────────── */

export const Bubble: React.FC<{
  text: string;
  hl?: string[];
  start?: number;
  hlColor?: string;
  light?: boolean;
  cps?: number;
  width?: number;
}> = ({text, hl = [], start = 0, hlColor = C.pink, light = false, cps = 30, width}) => {
  const f = useCurrentFrame();
  const s = pop(f, start, {damping: 13, stiffness: 220});
  const shown = typed(text, f, start + 4, cps);
  const done = shown.length >= text.length;
  const caret = !done || Math.floor(f / 18) % 2 === 0;

  // Colour highlighted words as they type.
  const words = shown.split(/(\s+)/);
  return (
    <div
      style={{
        transform: `scale(${s})`,
        transformOrigin: '0% 100%',
        display: 'inline-flex',
        alignItems: 'center',
        minWidth: width,
        padding: '12px 20px',
        borderRadius: 14,
        background: light ? '#fff' : '#0B0A0E',
        border: `2.5px solid ${light ? C.ink : '#fff'}`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        fontFamily: FONT,
        fontWeight: 650,
        fontSize: 26,
        letterSpacing: '-0.01em',
        color: light ? C.ink : '#fff',
        whiteSpace: 'pre',
      }}
    >
      {words.map((w, i) => {
        const clean = w.replace(/[.,!?…]/g, '');
        const isHl = hl.some((h) => h.toLowerCase() === clean.toLowerCase());
        return (
          <span key={i} style={{color: isHl ? hlColor : undefined}}>
            {w}
          </span>
        );
      })}
      <span style={{display: 'inline-block', width: 3, height: 28, marginLeft: 3, background: caret ? hlColor : 'transparent'}} />
    </div>
  );
};

/* ───────────── Section label: "■ 01 — THE FLIP" ───────────── */

export const Label: React.FC<{n: string; text: string; color: string; start?: number; dark?: boolean}> = ({
  n,
  text,
  color,
  start = 0,
  dark = true,
}) => {
  const f = useCurrentFrame();
  const t = prog(f, start, 18);
  const str = `${n} — ${text}`;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: MONO,
        fontSize: 20,
        letterSpacing: '0.18em',
        color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(10,9,13,0.65)',
        opacity: t,
        transform: `translateX(${(1 - t) * -20}px)`,
      }}
    >
      <div style={{width: 12, height: 12, background: color, transform: `rotate(${(1 - t) * 90}deg)`}} />
      {typed(str.toUpperCase(), f, start, 40)}
    </div>
  );
};

/* ───────────── Masked line reveal for big titles ───────────── */

export const Line: React.FC<{
  children: React.ReactNode;
  start: number;
  size?: number;
  color?: string;
  weight?: number;
  dur?: number;
  style?: React.CSSProperties;
}> = ({children, start, size = 120, color = '#fff', weight = 800, dur = 26, style}) => {
  const f = useCurrentFrame();
  const t = prog(f, start, dur);
  return (
    <div style={{overflow: 'hidden', paddingBottom: size * 0.12, marginBottom: -size * 0.12}}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1.0,
          letterSpacing: '-0.045em',
          color,
          transform: `translateY(${(1 - t) * 110}%) rotate(${(1 - t) * 4}deg)`,
          transformOrigin: '0% 100%',
          whiteSpace: 'nowrap',
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ───────────── Word pill (kinetic typography) ───────────── */

export const Pill: React.FC<{
  children: React.ReactNode;
  start: number;
  bg?: string;
  color?: string;
  size?: number;
  rot?: number;
  style?: React.CSSProperties;
}> = ({children, start, bg = C.ink, color = '#fff', size = 88, rot = 0, style}) => {
  const f = useCurrentFrame();
  const s = pop(f, start, {damping: 11, stiffness: 240});
  return (
    <div
      style={{
        display: 'inline-block',
        padding: `${size * 0.06}px ${size * 0.2}px ${size * 0.1}px`,
        borderRadius: size * 0.22,
        background: bg,
        color,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '-0.04em',
        lineHeight: 1.05,
        transform: `scale(${s}) rotate(${rot * s}deg)`,
        opacity: f < start ? 0 : 1,
        boxShadow: '0 14px 40px rgba(0,0,0,0.25)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ───────────── Transitions ───────────── */

/** Diagonal colour band sweep. The last colour fully covers the frame at `at`. */
export const Sweep: React.FC<{at: number; colors: string[]; dur?: number}> = ({at, colors, dur = 36}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at - dur / 2, at + dur / 2], [0, 1], clamp);
  if (t <= 0 || t >= 1) return null;
  const lagStep = 0.1;
  const lagMax = lagStep * (colors.length - 1);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {colors.map((c, i) => {
        const lag = i * lagStep;
        const tt = Math.min(1, Math.max(0, (t - lag) / (1 - lagMax)));
        const e = easeInOut(tt);
        const x = interpolate(e, [0, 1], [-6600, 2600]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: -660,
              left: x,
              width: 6000,
              height: 2400,
              background: c,
              transform: 'skewX(-24deg)',
              boxShadow: `0 0 90px 40px ${c}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Squid-ink blot that grows from a point, holds, then drains. */
export const InkBlot: React.FC<{at: number; x: number; y: number; color?: string; dur?: number}> = ({
  at,
  x,
  y,
  color = C.ink,
  dur = 36,
}) => {
  const f = useCurrentFrame();
  const inT = prog(f, at - dur / 2, dur / 2, (v) => v * v * (3 - 2 * v));
  const outT = prog(f, at + 4, dur / 2);
  if (inT <= 0 || outT >= 1) return null;
  const R = 2400 * inT;
  const blobs = Array.from({length: 11}).map((_, i) => {
    const a = (i / 11) * Math.PI * 2 + 0.3;
    const d = R * (0.55 + ((i * 37) % 10) / 30);
    return {cx: x + Math.cos(a) * d * 0.55, cy: y + Math.sin(a) * d * 0.55, r: R * (0.28 + ((i * 53) % 7) / 40)};
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 1 - outT, filter: `blur(${outT * 20}px)`}}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <g fill={color}>
          <circle cx={x} cy={y} r={R * 0.6} />
          {blobs.map((b, i) => (
            <circle key={i} {...b} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ───────────── Ika glyph (squid mark) ───────────── */

export const IkaMark: React.FC<{size?: number; color?: string; bg?: string}> = ({size = 120, color = '#fff', bg = C.pink}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={0} y={0} width={100} height={100} rx={26} fill={bg} />
    <path d="M50,14 C64,24 72,38 72,52 C72,62 64,68 50,68 C36,68 28,62 28,52 C28,38 36,24 50,14 Z" fill={color} />
    <path d="M32,34 C24,32 18,36 16,44 C22,45 27,46 30,47 Z" fill={color} />
    <path d="M68,34 C76,32 82,36 84,44 C78,45 73,46 70,47 Z" fill={color} />
    {[36, 45, 55, 64].map((x, i) => (
      <path
        key={i}
        d={`M${x},66 Q${x + (i < 2 ? -4 : 4)},78 ${x + (i < 2 ? -1 : 1)},86`}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
      />
    ))}
    <circle cx={43} cy={52} r={3.6} fill={bg} />
    <circle cx={57} cy={52} r={3.6} fill={bg} />
  </svg>
);

/* ───────────── Chain chip ───────────── */

export const ChainIcon: React.FC<{chain: 'btc' | 'eth' | 'sol' | 'sui'; size?: number}> = ({chain, size = 64}) => {
  const s = size;
  if (chain === 'btc')
    return (
      <svg width={s} height={s} viewBox="0 0 64 64">
        <circle cx={32} cy={32} r={32} fill={C.btc} />
        <text x={32} y={45} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill="#fff" transform="rotate(12 32 32)">
          ₿
        </text>
      </svg>
    );
  if (chain === 'eth')
    return (
      <svg width={s} height={s} viewBox="0 0 64 64">
        <circle cx={32} cy={32} r={32} fill={C.eth} />
        <path d="M32 10 L46 33 L32 41 L18 33 Z" fill="#fff" opacity={0.95} />
        <path d="M32 44 L46 36 L32 55 L18 36 Z" fill="#fff" opacity={0.75} />
      </svg>
    );
  if (chain === 'sol')
    return (
      <svg width={s} height={s} viewBox="0 0 64 64">
        <defs>
          <linearGradient id="solg" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={C.solViolet} />
            <stop offset="1" stopColor={C.sol} />
          </linearGradient>
        </defs>
        <circle cx={32} cy={32} r={32} fill="#111" />
        {[18, 30, 42].map((y, i) => (
          <path key={i} d={`M${i === 1 ? 20 : 16} ${y} L48 ${y} L${i === 1 ? 44 : 48} ${y + 6} L${i === 1 ? 16 : 16} ${y + 6} Z`} fill="url(#solg)" transform={i === 1 ? '' : 'skewX(-18) translate(8 0)'} />
        ))}
      </svg>
    );
  return (
    <svg width={s} height={s} viewBox="0 0 64 64">
      <circle cx={32} cy={32} r={32} fill={C.sui} />
      <path d="M32 12 C40 24 46 30 46 38 C46 46 40 52 32 52 C24 52 18 46 18 38 C18 30 24 24 32 12 Z" fill="#fff" />
    </svg>
  );
};

export const Mono: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({
  children,
  size = 22,
  color = C.mute,
  style,
}) => <div style={{fontFamily: MONO, fontSize: size, color, letterSpacing: '0.02em', ...style}}>{children}</div>;
