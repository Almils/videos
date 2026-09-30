import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {pop, prog, rand} from '../anim';
import {Bg, IkaMark, Mono} from '../components/ui';
import {C, FONT} from '../theme';
import {at} from '../timeline';

const Slam: React.FC<{text: string; start: number; color?: string; strike?: boolean; size?: number}> = ({
  text,
  start,
  color = '#fff',
  strike,
  size = 250,
}) => {
  const f = useCurrentFrame();
  const s = pop(f, start, {damping: 10, stiffness: 320, mass: 0.6});
  const st = prog(f, start + 20, 10);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          position: 'relative',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: size,
          letterSpacing: '-0.06em',
          color,
          transform: `scale(${2.2 - 1.2 * s})`,
          opacity: Math.min(1, s * 2),
          whiteSpace: 'nowrap',
        }}
      >
        {text}
        {strike && (
          <div style={{position: 'absolute', left: -20, top: '52%', height: size * 0.09, width: `calc(${st * 100}% + 40px)`, background: C.ink, borderRadius: 20}} />
        )}
      </div>
    </AbsoluteFill>
  );
};

/* 11 ─ No bridges. No wrapping. Just ink. */
export const SlamScene: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const A = at('slam', 'no1', -2);
  const B = at('slam', 'no2', -4);
  const Cc = at('slam', 'just', -4);
  const inkAt = at('slam', 'ink', -2);
  if (f < B)
    return (
      <AbsoluteFill>
        <Bg color={C.pink} dots="rgba(255,255,255,0.12)" />
        <Slam text="NO BRIDGES." start={A} strike />
      </AbsoluteFill>
    );
  if (f < Cc)
    return (
      <AbsoluteFill>
        <Bg color={C.violet} dots="rgba(255,255,255,0.12)" />
        <Slam text="NO WRAPPING." start={B + 4} strike size={230} />
      </AbsoluteFill>
    );
  // JUST INK. with ink droplet confetti
  const k = f - inkAt + 4;
  return (
    <AbsoluteFill>
      <Bg color={C.lime} dots="rgba(10,9,13,0.1)" />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {Array.from({length: 46}).map((_, i) => {
          const t = Math.max(0, (k - 4) / 70);
          const a = rand(i) * Math.PI * 2;
          const v = 500 + rand(i + 1) * 900;
          const x = 960 + Math.cos(a) * v * t;
          const y = 540 + Math.sin(a) * v * t * 0.7 + t * t * 500;
          const colors = [C.ink, C.pink, C.violet, C.yellow, '#fff', C.cyan];
          const r = 6 + rand(i + 2) * 14;
          const shape = i % 3;
          if (k < 4) return null;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${t * 720 * (rand(i + 3) - 0.5)})`}>
              {shape === 0 && <circle r={r} fill={colors[i % colors.length]} />}
              {shape === 1 && <rect x={-r} y={-r / 2} width={r * 2} height={r} rx={2} fill={colors[i % colors.length]} />}
              {shape === 2 && <path d={`M0,${-r * 1.3} C${r},0 ${r},${r} 0,${r} C${-r},${r} ${-r},0 0,${-r * 1.3} Z`} fill={colors[i % colors.length]} />}
            </g>
          );
        })}
      </svg>
      <Slam text="JUST INK." start={Cc + 4} color={C.ink} size={280} />
    </AbsoluteFill>
  );
};

/* 12 ─ End card */
export const EndScene: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const ring = prog(f, 0, 50);
  const mark = pop(f, at('end', 'ikaEnd', -4));
  const word = prog(f, at('end', 'ikaEnd', 2), 22);
  const tag = prog(f, at('end', 'sign', -4), 20);
  const url = prog(f, at('end', 'anyChainEnd', 12), 24);
  return (
    <AbsoluteFill>
      <Bg color={C.ink} dots="rgba(255,255,255,0.04)" />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <circle cx={650} cy={480} r={80 + ring * 240} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} opacity={1 - ring * 0.4} />
        <circle cx={650} cy={480} r={40 + ring * 520} fill="none" stroke={C.pink} strokeWidth={2} opacity={(1 - ring) * 0.8} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 36}}>
        <div style={{transform: `scale(${mark}) rotate(${(1 - mark) * -40}deg)`}}>
          <IkaMark size={170} />
        </div>
        <div style={{overflow: 'hidden'}}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 850,
              fontSize: 200,
              letterSpacing: '-0.06em',
              color: '#fff',
              lineHeight: 1,
              transform: `translateX(${(1 - word) * -100}%)`,
            }}
          >
            Ika<span style={{color: C.pink}}>.</span>
          </div>
        </div>
        <div style={{width: 220}} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 640,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 40,
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '-0.01em',
          opacity: tag,
          transform: `translateY(${(1 - tag) * 20}px)`,
        }}
      >
        Sign anything. On any chain. <span style={{color: C.pink}}>Zero trust.</span>
      </div>
      <div style={{position: 'absolute', bottom: 110, width: '100%', display: 'flex', justifyContent: 'center', opacity: url}}>
        <Mono size={26} color="rgba(255,255,255,0.55)">
          ika.xyz  ·  Sui  ·  Solana
        </Mono>
      </div>
    </AbsoluteFill>
  );
};
