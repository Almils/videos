import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease, pop, prog, rand} from '../anim';
import {Bg, Label, Line, Mono, Pill} from '../components/ui';
import {C, FONT, MONO} from '../theme';

/* A floating "junk" card in the web3 collage */
const Junk: React.FC<{x: number; y: number; start: number; rot: number; children: React.ReactNode; bg?: string; w?: number; depth?: number}> = ({
  x,
  y,
  start,
  rot,
  children,
  bg = '#fff',
  w = 260,
  depth = 1,
}) => {
  const f = useCurrentFrame();
  const s = pop(f, start, {damping: 12, stiffness: 160});
  const drift = f * 0.35 * depth;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - drift,
        top: y + Math.sin((f + x) * 0.03) * 8,
        width: w,
        padding: 20,
        borderRadius: 18,
        background: bg,
        boxShadow: '0 20px 50px rgba(20,10,30,0.18)',
        transform: `scale(${s}) rotate(${rot}deg)`,
        fontFamily: FONT,
      }}
    >
      {children}
    </div>
  );
};

const Bar: React.FC<{w: number; c?: string; h?: number}> = ({w, c = '#E7E4EC', h = 12}) => (
  <div style={{width: w, height: h, borderRadius: h, background: c, marginTop: 10}} />
);

/* 4 ─ "Moving crypto in 2026: wrap it, bridge it… and pray." */
export const StatusScene: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const shake = f > 150 && f < 162 ? Math.sin(f * 3) * 6 : 0;
  return (
    <AbsoluteFill>
      <Bg color={C.paper} dots="rgba(10,9,13,0.08)" vignette={false} />

      {/* background collage of today's cross-chain "solutions" */}
      <Junk x={1180} y={90} start={6} rot={-4} depth={0.6}>
        <Mono size={16}>bridge.exe</Mono>
        <div style={{fontWeight: 800, fontSize: 34, marginTop: 6}}>Lock → Mint</div>
        <Bar w={180} />
        <Bar w={120} c={C.cyan} />
      </Junk>
      <Junk x={1540} y={240} start={14} rot={5} bg={C.yellow} w={230} depth={1.1}>
        <div style={{fontWeight: 800, fontSize: 30}}>5-of-8 multisig</div>
        <Mono size={16} color="#6b5200" style={{marginTop: 8}}>
          (it's just some guys)
        </Mono>
      </Junk>
      <Junk x={1260} y={430} start={22} rot={-2} depth={0.8}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 52, height: 52, borderRadius: 26, background: C.btc, color: '#fff', fontWeight: 900, fontSize: 30, display: 'grid', placeItems: 'center'}}>
            w
          </div>
          <div>
            <div style={{fontWeight: 800, fontSize: 30}}>wBTC</div>
            <Mono size={15}>an IOU wearing a BTC costume</Mono>
          </div>
        </div>
      </Junk>
      <Junk x={1620} y={560} start={30} rot={7} bg={C.ink} w={240} depth={1.3}>
        <div style={{color: '#fff', fontWeight: 800, fontSize: 28}}>Custodian</div>
        <Mono size={15} color={C.pinkSoft} style={{marginTop: 6}}>
          not your keys ¯\_(ツ)_/¯
        </Mono>
      </Junk>
      <Junk x={1120} y={720} start={38} rot={3} bg={C.pinkSoft} w={250} depth={0.9}>
        <div style={{fontWeight: 800, fontSize: 30, color: '#fff'}}>trust me bro</div>
        <Mono size={15} color="#fff" style={{marginTop: 6}}>
          audited* (*vibes)
        </Mono>
      </Junk>
      <Junk x={1500} y={860} start={46} rot={-5} depth={1.2} w={220}>
        <Mono size={16}>tx status</Mono>
        <div style={{fontWeight: 800, fontSize: 28, marginTop: 4, color: C.coral}}>pending… 47m</div>
      </Junk>

      {/* left: the title */}
      <div style={{position: 'absolute', left: 120, top: 130, transform: `translateX(${shake}px)`}}>
        <Label n="00" text="Web3, currently" color={C.coral} dark={false} start={4} />
        <div style={{height: 24}} />
        <Line start={10} size={118} color={C.ink}>
          Moving crypto
        </Line>
        <Line start={16} size={118} color={C.ink}>
          in 2026:
        </Line>
        <div style={{display: 'flex', gap: 18, marginTop: 56, alignItems: 'center'}}>
          <Pill start={70} bg={C.violet} size={70} rot={-3}>
            Wrap it.
          </Pill>
          <Pill start={100} bg={C.cyan} color={C.ink} size={70} rot={2}>
            Bridge it.
          </Pill>
        </div>
        <div style={{marginTop: 22, marginLeft: 120}}>
          <Pill start={146} bg={C.pink} size={96} rot={-4}>
            …and pray. 🙏
          </Pill>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 5 ─ Billions drained */
const HACKS = [
  {name: 'Ronin Bridge', year: '2022', amt: 625},
  {name: 'Wormhole', year: '2022', amt: 326},
  {name: 'Nomad Bridge', year: '2022', amt: 190},
];

export const DrainedScene: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const hits = HACKS.map((_, i) => 34 + i * 26);
  const lastHit = hits.filter((h) => f >= h).pop() ?? -100;
  const k = f - lastHit;
  const shake = k >= 0 && k < 10 ? (1 - k / 10) * 14 : 0;
  const sx = Math.sin(f * 2.3) * shake;
  const sy = Math.cos(f * 3.1) * shake;
  const total = HACKS.reduce((a, h, i) => a + (f >= hits[i] ? h.amt : 0), 0);
  const shown = Math.round(interpolate(f, [lastHit, lastHit + 16], [total - (HACKS.find((_, i) => hits[i] === lastHit)?.amt ?? 0), total], clamp));
  const flash = k >= 0 && k < 6 ? (1 - k / 6) * 0.25 : 0;

  return (
    <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px)`}}>
      <Bg color="#120509" dots="rgba(255,59,48,0.10)" />
      <AbsoluteFill style={{background: `radial-gradient(circle at 70% 50%, ${C.red}33, transparent 60%)`}} />

      <div style={{position: 'absolute', left: 120, top: 220}}>
        <Label n="!!" text="Meanwhile" color={C.red} start={0} />
        <div style={{height: 24}} />
        <Line start={4} size={130}>
          Billions
        </Line>
        <Line start={10} size={130} color={C.red}>
          drained.
        </Line>
        <div style={{marginTop: 50, fontFamily: MONO, fontSize: 30, color: 'rgba(255,255,255,0.6)'}}>
          bridge losses: <span style={{color: '#fff', fontWeight: 700, fontSize: 44}}>−${shown.toLocaleString('en-US')}M</span>
          <span style={{fontSize: 22}}> …and counting</span>
        </div>
      </div>

      {/* hack cards slamming onto a stack */}
      {HACKS.map((h, i) => {
        const s = pop(f, hits[i] - 8, {damping: 14, stiffness: 320});
        const stamp = pop(f, hits[i] + 4, {damping: 10, stiffness: 300});
        const rot = [-6, 4, -2][i];
        return (
          <div
            key={h.name}
            style={{
              position: 'absolute',
              left: 1100 + i * 40,
              top: 190 + i * 210,
              width: 620,
              height: 180,
              borderRadius: 22,
              background: '#1E1015',
              border: '2px solid rgba(255,255,255,0.12)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              transform: `translateY(${(1 - s) * -300}px) scale(${1 + (1 - s) * 0.4}) rotate(${rot}deg)`,
              opacity: f < hits[i] - 8 ? 0 : 1,
              padding: '28px 34px',
              fontFamily: FONT,
              color: '#fff',
            }}
          >
            <Mono size={18} color="rgba(255,255,255,0.5)">
              {h.year} · cross-chain bridge
            </Mono>
            <div style={{fontWeight: 800, fontSize: 48, marginTop: 8, letterSpacing: '-0.03em'}}>{h.name}</div>
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.red, marginTop: 6}}>−${h.amt}M</div>
            <div
              style={{
                position: 'absolute',
                right: 30,
                top: 50,
                padding: '6px 18px',
                border: `5px solid ${C.red}`,
                borderRadius: 10,
                color: C.red,
                fontWeight: 900,
                fontSize: 40,
                letterSpacing: '0.06em',
                transform: `rotate(-12deg) scale(${f < hits[i] + 4 ? 0 : 2 - stamp})`,
                opacity: f < hits[i] + 4 ? 0 : Math.min(1, stamp),
              }}
            >
              DRAINED
            </div>
          </div>
        );
      })}

      {/* falling coins */}
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {Array.from({length: 18}).map((_, i) => {
          const st = hits[i % 3] + (i % 6) * 2;
          const t = (f - st) / 60;
          if (t < 0) return null;
          const x = 1150 + rand(i) * 650;
          const y = 300 + rand(i + 4) * 300 + t * t * 900;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${t * 400 * (rand(i + 1) - 0.5)})`} opacity={Math.max(0, 1 - t)}>
              <ellipse rx={16 * Math.abs(Math.cos(t * 8 + i))} ry={16} fill={C.yellow} stroke="#B8860B" strokeWidth={3} />
            </g>
          );
        })}
      </svg>
      <AbsoluteFill style={{background: C.red, opacity: flash, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};
