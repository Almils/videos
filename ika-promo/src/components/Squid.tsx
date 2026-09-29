import React from 'react';
import {useCurrentFrame} from 'remotion';

export type Expression = 'happy' | 'wow' | 'ugh' | 'wink' | 'smug' | 'grin';

type Props = {
  size?: number;
  expression?: Expression;
  wave?: number; // 0..1 how raised the waving tentacle is
  look?: [number, number]; // pupil direction, -1..1
  squash?: number; // 1 = neutral; <1 squashed, >1 stretched
  tilt?: number; // degrees
  seed?: number;
  energy?: number; // tentacle wiggle multiplier
  style?: React.CSSProperties;
};

const OUT = '#2A0A18';
const BODY_TOP = '#FF6A9B';
const BODY_BOT = '#FF2D6F';
const LIMB = '#FF3F7C';
const LIMB_DARK = '#E0205C';

type Pt = [number, number];

/** Builds a tapered, filled tentacle polygon along a wiggling spine. */
const tentacle = (
  base: Pt,
  angle: number,
  length: number,
  width: number,
  f: number,
  phase: number,
  amp: number,
  curl: number,
): {d: string; tip: Pt; spine: Pt[]} => {
  const N = 14;
  const spine: Pt[] = [base];
  let a = angle;
  let [x, y] = base;
  const seg = length / N;
  for (let i = 1; i <= N; i++) {
    const t = i / N;
    a += Math.sin(f * 0.11 + phase + t * 3.1) * amp * t * 0.22 + curl * t * t * 0.18;
    x += Math.cos(a) * seg;
    y += Math.sin(a) * seg;
    spine.push([x, y]);
  }
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const p = spine[i];
    const q = spine[Math.min(N, i + 1)];
    const r = spine[Math.max(0, i - 1)];
    const dx = q[0] - r[0];
    const dy = q[1] - r[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = (width / 2) * (1 - (i / N) * 0.72);
    left.push([p[0] + nx * w, p[1] + ny * w]);
    right.push([p[0] - nx * w, p[1] - ny * w]);
  }
  const pts = [...left, ...right.reverse()];
  const d = 'M' + pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' L') + ' Z';
  return {d, tip: spine[N], spine};
};

export const Squid: React.FC<Props> = ({
  size = 220,
  expression = 'happy',
  wave = 0,
  look = [0, 0],
  squash = 1,
  tilt = 0,
  seed = 0,
  energy = 1,
  style,
}) => {
  const f = useCurrentFrame() + seed * 37;

  // Idle float & breathing
  const bob = Math.sin(f * 0.075) * 5;
  const breathe = 1 + Math.sin(f * 0.075 + 1.2) * 0.018;
  const finFlap = Math.sin(f * 0.16) * 7;

  // Blink every ~3.3s for 6 frames
  const bt = (f + 40) % 200;
  const blink = bt < 7 ? Math.abs(Math.cos((bt / 7) * Math.PI)) : 1;
  const eyeOpen = expression === 'ugh' ? 1 : Math.max(0.08, blink);

  const lx = look[0] * 5;
  const ly = look[1] * 4;

  // Tentacles: 8 arms along the mantle's bottom edge
  const arms = Array.from({length: 8}).map((_, i) => {
    const t = i / 7; // 0..1 left→right
    const bx = 74 + t * 92;
    const by = 184 + Math.sin(t * Math.PI) * 10;
    const outer = i === 0 || i === 7;
    let angle = Math.PI / 2 - (t - 0.5) * 2.2;
    let length = outer ? 74 : 52 - Math.abs(t - 0.5) * 8;
    let curl = (0.5 - t) * 2.2 * -1; // tips curl outward
    let amp = (outer ? 1.3 : 0.9) * energy;
    if (i === 7 && wave > 0) {
      // raise the right outer arm and wave it
      angle = angle + (-0.3 - angle) * wave + Math.sin(f * 0.32) * 0.45 * wave;
      curl = curl * (1 - wave) - 1.3 * wave;
      length = 74 + wave * 10;
      amp = amp * (1 - wave * 0.7);
    }
    return {...tentacle([bx, by], angle, length, outer ? (i === 7 && wave > 0 ? 17 + wave * 4 : 17) : 21, f, i * 0.9 + seed, amp, curl), outer, i};
  });

  const eye = (cx: number, wink: boolean) => {
    if (expression === 'ugh') {
      // >_< squint
      const s = cx < 120 ? 1 : -1;
      return (
        <path
          d={`M${cx - 11 * s},${128} L${cx + 9 * s},${138} L${cx - 11 * s},${148}`}
          fill="none"
          stroke={OUT}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    }
    if (wink) {
      return (
        <path d={`M${cx - 12},${140} Q${cx},${128} ${cx + 12},${140}`} fill="none" stroke={OUT} strokeWidth={6} strokeLinecap="round" />
      );
    }
    const big = expression === 'wow' ? 1.12 : 1;
    return (
      <g transform={`translate(${cx} 138) scale(${big} ${eyeOpen * big})`}>
        <ellipse rx={18} ry={20} fill="#fff" stroke={OUT} strokeWidth={4.5} />
        <circle cx={lx} cy={ly + 2} r={11} fill={OUT} />
        <circle cx={lx - 4} cy={ly - 3} r={4.2} fill="#fff" />
        <circle cx={lx + 4} cy={ly + 7} r={1.8} fill="#fff" />
      </g>
    );
  };

  const mouth = (() => {
    switch (expression) {
      case 'wow':
        return <ellipse cx={120} cy={170} rx={9} ry={11} fill={OUT} />;
      case 'ugh':
        return (
          <path d="M104,172 Q112,164 120,172 Q128,180 136,172" fill="none" stroke={OUT} strokeWidth={5.5} strokeLinecap="round" />
        );
      case 'smug':
        return <path d="M108,168 Q124,176 136,162" fill="none" stroke={OUT} strokeWidth={5.5} strokeLinecap="round" />;
      case 'grin':
        return (
          <g>
            <path d="M100,160 Q120,190 140,160 Z" fill={OUT} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
            <path d="M104,162 L136,162 L134,166 L106,166 Z" fill="#fff" />
          </g>
        );
      default:
        return (
          <g>
            <path d="M106,162 Q120,184 134,162 Z" fill={OUT} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
            <ellipse cx={121} cy={172} rx={6} ry={3.5} fill="#FF8FB1" />
          </g>
        );
    }
  })();

  return (
    <div style={{width: size, height: size * (300 / 240), ...style}}>
      <svg
        viewBox="0 -10 240 300"
        width="100%"
        height="100%"
        style={{
          overflow: 'visible',
          transform: `translateY(${bob}px) rotate(${tilt}deg) scale(${1 / Math.sqrt(squash)}, ${squash})`,
          transformOrigin: '50% 90%',
        }}
      >
        <defs>
          <linearGradient id={`sq-body-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={BODY_TOP} />
            <stop offset="1" stopColor={BODY_BOT} />
          </linearGradient>
        </defs>

        {/* ground shadow */}
        <ellipse cx={120} cy={282} rx={70 - bob} ry={8} fill="#000" opacity={0.18} />

        {/* fins */}
        <g transform={`rotate(${-finFlap} 80 70)`}>
          <path d="M84,58 C52,40 22,52 12,82 C38,92 62,96 76,100 Z" fill={LIMB} stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
        </g>
        <g transform={`rotate(${finFlap} 160 70)`}>
          <path d="M156,58 C188,40 218,52 228,82 C202,92 178,96 164,100 Z" fill={LIMB} stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
        </g>

        {/* tentacles: outline pass then fill pass so joints read clean */}
        {arms.map((a) => (
          <path key={`o${a.i}`} d={a.d} fill={OUT} stroke={OUT} strokeWidth={10} strokeLinejoin="round" />
        ))}
        {arms.map((a) => (
          <g key={`f${a.i}`}>
            <path d={a.d} fill={a.outer ? LIMB_DARK : LIMB} />
            {a.spine
              .filter((_, k) => k > 4 && k % 4 === 1)
              .map((p, k) => (
                <circle key={k} cx={p[0]} cy={p[1]} r={2.6 - k * 0.3} fill="#FFC2D6" opacity={0.85} />
              ))}
          </g>
        ))}

        {/* mantle */}
        <g transform={`translate(120 120) scale(${breathe} ${2 - breathe}) translate(-120 -120)`}>
          <path
            d="M120,6 C156,30 184,74 186,124 C188,174 158,200 120,200 C82,200 52,174 54,124 C56,74 84,30 120,6 Z"
            fill={`url(#sq-body-${seed})`}
            stroke={OUT}
            strokeWidth={5.5}
            strokeLinejoin="round"
          />
          {/* sheen */}
          <path d="M92,48 C80,70 74,92 76,112" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.55} />
          <circle cx={78} cy={124} r={3.5} fill="#fff" opacity={0.55} />
          {/* chromatophore spots */}
          <circle cx={128} cy={46} r={5} fill="#E01C5B" opacity={0.55} />
          <circle cx={146} cy={70} r={4} fill="#E01C5B" opacity={0.5} />
          <circle cx={118} cy={76} r={3.2} fill="#E01C5B" opacity={0.45} />
          <circle cx={156} cy={98} r={3} fill="#E01C5B" opacity={0.45} />
          <circle cx={136} cy={94} r={2.4} fill="#E01C5B" opacity={0.4} />

          {/* face */}
          <ellipse cx={82} cy={160} rx={11} ry={6.5} fill="#FFB0C9" opacity={0.9} />
          <ellipse cx={158} cy={160} rx={11} ry={6.5} fill="#FFB0C9" opacity={0.9} />
          {eye(98, false)}
          {eye(142, expression === 'wink')}
          {mouth}
        </g>
      </svg>
    </div>
  );
};
