import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease, easeInOut, pop, prog, rand, typed} from '../anim';
import {Bg, ChainIcon, IkaMark, Label, Line, Mono, Pill} from '../components/ui';
import {C, FONT, MONO} from '../theme';
import {at} from '../timeline';

const Card: React.FC<{style?: React.CSSProperties; children: React.ReactNode; dark?: boolean}> = ({style, children, dark}) => (
  <div
    style={{
      position: 'absolute',
      borderRadius: 24,
      background: dark ? '#17151D' : '#fff',
      border: dark ? '2px solid rgba(255,255,255,0.1)' : 'none',
      boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
      fontFamily: FONT,
      color: dark ? '#fff' : C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

/* 6 ─ The Flip: don't move the asset, move the signature */
export const FlipScene: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const move2 = at('flip', 'move2');
  const strike = prog(f, at('flip', 'asset', 16), 12);
  const flip = prog(f, move2 + 2, 20, easeInOut);
  const dontOut = prog(f, move2 - 4, 8);
  const flipsPill = pop(f, at('flip', 'ikaFlip', -3));
  const flipsOut = prog(f, at('flip', 'dont', -8), 8);

  // diagram
  const bridgeIn = pop(f, at('flip', 'ikaFlip', -6));
  const bridgeX = prog(f, at('flip', 'flips'), 14);
  const sigAt = at('flip', 'signature', -4);
  const sigIn = prog(f, sigAt, 40, easeInOut);
  const ok = pop(f, sigAt + 38);

  return (
    <AbsoluteFill>
      <Bg color={C.ink} dots="rgba(255,255,255,0.05)" />
      <div style={{position: 'absolute', left: 120, top: 250}}>
        <Label n="01" text="The flip" color={C.pink} start={2} />
        <div style={{position: 'absolute', top: 70, opacity: 1 - flipsOut, transform: `translateY(${flipsOut * -30}px)`}}>
          <Pill start={at('flip', 'ikaFlip', -3)} bg={C.pink} size={96} rot={-3 * flipsPill}>
            Ika flips it. ↻
          </Pill>
        </div>
        <div style={{height: 24}} />
        <div style={{position: 'relative', height: 136}}>
          <div style={{opacity: 1 - dontOut, transform: `translateY(${dontOut * -40}px)`}}>
            <Line start={at('flip', 'dont', -3)} size={120}>
              Don't move
            </Line>
          </div>
          <div style={{position: 'absolute', top: 0, opacity: dontOut, transform: `translateY(${(1 - dontOut) * 30}px)`}}>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 120, letterSpacing: '-0.045em', lineHeight: 1, color: '#fff'}}>Move</div>
          </div>
        </div>
        <div style={{position: 'relative', height: 150}}>
          {/* card-flip: squash "the asset." shut, pop "the signature." open */}
          <div style={{position: 'absolute', top: 0, transform: `scaleY(${Math.max(0, 1 - flip * 2)})`, transformOrigin: '50% 55%'}}>
            <Line start={at('flip', 'asset', -5)} size={120} color="rgba(255,255,255,0.9)">
              the asset.
            </Line>
            <div style={{position: 'absolute', left: -10, top: 62, height: 12, width: 560 * strike, background: C.pink, borderRadius: 6}} />
          </div>
          <div style={{position: 'absolute', top: 0, transform: `scaleY(${Math.max(0, flip * 2 - 1)})`, transformOrigin: '50% 55%'}}>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 120, letterSpacing: '-0.045em', lineHeight: 1, color: C.pink, whiteSpace: 'nowrap'}}>
              the signature.
            </div>
          </div>
        </div>
      </div>

      {/* Right: diagram */}
      <div style={{position: 'absolute', left: 1080, top: 150, width: 740, height: 780}}>
        {/* Bitcoin lane */}
        <Card dark style={{left: 0, top: 440, width: 740, height: 260, padding: 30}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <ChainIcon chain="btc" size={46} />
            <div style={{fontWeight: 800, fontSize: 34}}>Bitcoin</div>
            <Mono size={18} style={{marginLeft: 'auto'}}>
              native L1
            </Mono>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 34}}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                background: C.btc,
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontSize: 56,
                fontWeight: 900,
                boxShadow: `0 0 ${40 * ok}px ${C.btc}`,
              }}
            >
              ₿
            </div>
            <div>
              <div style={{fontWeight: 800, fontSize: 30}}>Real BTC. Stays home.</div>
              <Mono size={18} style={{marginTop: 6}}>
                bc1q…ika · no wrap · no IOU
              </Mono>
            </div>
            <div
              style={{
                marginLeft: 'auto',
                transform: `scale(${ok})`,
                background: C.lime,
                color: C.ink,
                fontWeight: 800,
                fontSize: 22,
                padding: '10px 16px',
                borderRadius: 12,
              }}
            >
              ✓ tx confirmed
            </div>
          </div>
        </Card>

        {/* Program on top */}
        <Card dark style={{left: 120, top: 0, width: 500, height: 150, padding: 28, display: 'flex', alignItems: 'center', gap: 22}}>
          <IkaMark size={80} />
          <div>
            <div style={{fontWeight: 800, fontSize: 30}}>Your smart contract</div>
            <Mono size={18} style={{marginTop: 6}}>
              on Sui · Solana
            </Mono>
          </div>
        </Card>

        {/* old way: bridge, crossed out */}
        <div
          style={{
            position: 'absolute',
            left: -40,
            top: 250,
            transform: `scale(${bridgeIn}) rotate(-4deg)`,
            opacity: 1 - prog(f, sigAt - 16, 14),
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 22,
              color: 'rgba(255,255,255,0.7)',
              border: '2px dashed rgba(255,255,255,0.35)',
              borderRadius: 14,
              padding: '14px 20px',
              position: 'relative',
            }}
          >
            ₿ → 🌉 bridge → wBTC
            <svg width={340} height={70} style={{position: 'absolute', left: 0, top: -6}}>
              <line x1={10} y1={36} x2={10 + 320 * bridgeX} y2={36} stroke={C.red} strokeWidth={7} strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* signature path */}
        <svg width={740} height={780} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <path
            d="M370,150 C370,260 470,300 470,340 C470,380 370,400 370,440"
            fill="none"
            stroke={C.pink}
            strokeWidth={5}
            strokeDasharray="12 12"
            strokeDashoffset={-f * 1.5}
            opacity={prog(f, sigAt - 10, 10)}
          />
        </svg>
        {(() => {
          const t = sigIn;
          // cubic along the path approx
          const p0 = [370, 150];
          const p1 = [370, 260];
          const p2 = [470, 300];
          const p3 = [470, 340];
          const q = t < 0.5 ? t * 2 : (t - 0.5) * 2;
          const bez = (a: number[], b: number[], c: number[], e: number[], u: number) =>
            [0, 1].map((k) => (1 - u) ** 3 * a[k] + 3 * (1 - u) ** 2 * u * b[k] + 3 * (1 - u) * u * u * c[k] + u ** 3 * e[k]);
          const pos = t < 0.5 ? bez(p0, p1, p2, p3, q) : bez([470, 340], [470, 380], [370, 400], [370, 440], q);
          if (t <= 0 || t >= 1) return null;
          return (
            <div
              style={{
                position: 'absolute',
                left: pos[0] - 90,
                top: pos[1] - 34,
                width: 180,
                height: 68,
                borderRadius: 34,
                background: C.pink,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 26,
                boxShadow: `0 0 50px ${C.pink}`,
              }}
            >
              ✍ signature
            </div>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};

/* 7 ─ dWallets: one program, every chain */
const CHAINS = [
  {chain: 'btc' as const, name: 'Bitcoin', addr: 'bc1q7x…k4ika', x: 60, y: 60},
  {chain: 'eth' as const, name: 'Ethereum', addr: '0x1ka0…9f3E', x: 560, y: 60},
  {chain: 'sol' as const, name: 'Solana', addr: 'IKAs9w…pQ2m', x: 60, y: 560},
  {chain: 'sui' as const, name: 'Sui', addr: '0x5ui…ika1', x: 560, y: 560},
];

export const DWalletScene: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const center = pop(f, at('dwallet', 'smart', -3));
  const chainAt = [at('dwallet', 'bitcoin', -3), at('dwallet', 'ethereum', -3), at('dwallet', 'solana', -3), at('dwallet', 'anyChain', -3)];
  return (
    <AbsoluteFill>
      <Bg color={C.violet} dots="rgba(255,255,255,0.12)" />
      <div style={{position: 'absolute', left: 120, top: 250}}>
        <Label n="02" text="dWallets" color="#fff" start={2} />
        <div style={{height: 24}} />
        <Line start={at('dwallet', 'dwallets', -3)} size={116}>
          One program.
        </Line>
        <Line start={at('dwallet', 'anyChain', -4)} size={116}>
          Every chain.
        </Line>
        <div style={{display: 'flex', gap: 14, marginTop: 40}}>
          <Pill start={at('dwallet', 'bitcoin', 20)} bg="#fff" color={C.violet} size={34}>
            ✓ native addresses
          </Pill>
          <Pill start={at('dwallet', 'solana', 20)} bg={C.ink} size={34}>
            ✓ zero wrapping
          </Pill>
        </div>
      </div>

      <div style={{position: 'absolute', left: 1000, top: 100, width: 860, height: 880}}>
        <svg width={860} height={880} style={{position: 'absolute', overflow: 'visible'}}>
          {CHAINS.map((c, i) => {
            const t = prog(f, chainAt[i] - 16, 16);
            const x1 = 430;
            const y1 = 440;
            const x2 = c.x + 130;
            const y2 = c.y + 80;
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * t} y2={y1 + (y2 - y1) * t} stroke="#fff" strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={f * -1.2} opacity={0.7} />
                {t >= 1 && (
                  <circle cx={x1 + (x2 - x1) * (((f - chainAt[i]) / 50) % 1)} cy={y1 + (y2 - y1) * (((f - chainAt[i]) / 50) % 1)} r={7} fill={C.yellow} />
                )}
              </g>
            );
          })}
        </svg>
        {CHAINS.map((c, i) => {
          const s = pop(f, chainAt[i]);
          return (
            <Card key={c.name} style={{left: c.x, top: c.y, width: 280, padding: 22, transform: `scale(${s})`}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <ChainIcon chain={c.chain} size={48} />
                <div style={{fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em'}}>{c.name}</div>
              </div>
              <Mono size={18} color="#6D6878" style={{marginTop: 12}}>
                {c.addr}
              </Mono>
            </Card>
          );
        })}
        <Card
          dark
          style={{
            left: 250,
            top: 350,
            width: 360,
            padding: 26,
            transform: `scale(${center})`,
            background: C.ink,
            border: `3px solid ${C.pink}`,
            boxShadow: `0 0 0 ${8 + Math.sin(f * 0.1) * 4}px ${C.pink}33, 0 30px 70px rgba(0,0,0,0.4)`,
          }}
        >
          <Mono size={16} color={C.pinkSoft}>
            dWallet
          </Mono>
          <div style={{fontWeight: 800, fontSize: 36, marginTop: 6}}>your_program</div>
          <div style={{display: 'flex', gap: 8, marginTop: 14}}>
            {[C.btc, C.eth, C.sol, C.sui].map((col, i) => (
              <div key={i} style={{width: 34, height: 8, borderRadius: 4, background: col, opacity: prog(f, chainAt[i], 10)}} />
            ))}
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/* 8 ─ Zero-trust 2PC-MPC: you + ⅔ of the network */
export const ZeroTrustScene: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const toggle = prog(f, at('zerotrust', 'notEven', -2), 10);
  const litAt = at('zerotrust', 'network', -8);
  const alone = at('zerotrust', 'alone', -4);
  const N = 12;
  const lit = Math.min(N, Math.floor(Math.max(0, f - litAt) / 3));
  const threshold = Math.ceil((N * 2) / 3);
  const merge = prog(f, alone, 22, easeInOut);
  const sealed = pop(f, alone + 18);
  const cx = 1440;
  const cy = 540;
  return (
    <AbsoluteFill>
      <Bg color={C.ink} dots="rgba(255,255,255,0.05)" />
      <div style={{position: 'absolute', left: 120, top: 250}}>
        <Label n="03" text="2PC-MPC" color={C.lime} start={2} />
        <div style={{height: 24}} />
        <Line start={at('zerotrust', 'nobody', -3)} size={120}>
          Nobody
        </Line>
        <Line start={at('zerotrust', 'signs', -3)} size={120} color={C.lime}>
          signs alone.
        </Line>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 44}}>
          <div style={{width: 76, height: 42, borderRadius: 21, background: toggle > 0.5 ? C.lime : '#3A3743', position: 'relative'}}>
            <div style={{position: 'absolute', top: 5, left: 5 + toggle * 34, width: 32, height: 32, borderRadius: 16, background: '#fff'}} />
          </div>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 32, color: '#fff'}}>Zero-trust</div>
        </div>
        <Mono size={22} style={{marginTop: 26, lineHeight: 1.6}}>
          you + ⅔ of the network → 1 signature
          <br />
          <span style={{color: C.pinkSoft}}>not even Ika can sign without you.</span>
        </Mono>
      </div>

      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {/* network ring */}
        <circle cx={cx} cy={cy} r={260} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2} strokeDasharray="4 10" />
        {Array.from({length: N}).map((_, i) => {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2 + f * 0.003;
          const x = cx + 110 + Math.cos(a) * 230 * (1 - merge * 0.55);
          const y = cy + Math.sin(a) * 230 * (1 - merge * 0.55);
          const on = i < lit;
          const s = pop(f, 8 + i * 2);
          return (
            <g key={i}>
              {on && <line x1={x} y1={y} x2={cx + 110} y2={cy} stroke={C.lime} strokeWidth={2} opacity={0.35 * (1 - merge)} />}
              <circle cx={x} cy={y} r={20 * s} fill={on ? C.lime : '#2A2733'} stroke={on ? '#fff' : 'rgba(255,255,255,0.2)'} strokeWidth={3} />
            </g>
          );
        })}
      </svg>
      {/* network count */}
      <div
        style={{
          position: 'absolute',
          left: cx + 110 - 110,
          top: cy - 50,
          width: 220,
          textAlign: 'center',
          fontFamily: MONO,
          color: '#fff',
          opacity: 1 - merge,
        }}
      >
        <div style={{fontSize: 18, color: C.mute}}>NETWORK</div>
        <div style={{fontSize: 52, fontWeight: 700, color: lit >= threshold ? C.lime : '#fff'}}>
          {lit}/{N}
        </div>
        <div style={{fontSize: 16, color: lit >= threshold ? C.lime : C.mute}}>{lit >= threshold ? '≥ ⅔ ✓' : 'need ⅔'}</div>
      </div>

      {/* user share */}
      <div
        style={{
          position: 'absolute',
          left: interpolate(merge, [0, 1], [1010, 1400]),
          top: cy - 70,
          width: 140,
          height: 140,
          borderRadius: 70,
          background: C.pink,
          display: 'grid',
          placeItems: 'center',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 30,
          color: '#fff',
          transform: `scale(${pop(f, at('zerotrust', 'you', -3))})`,
          boxShadow: `0 0 40px ${C.pink}88`,
          opacity: 1 - sealed,
        }}
      >
        🔑 You
      </div>

      {/* sealed signature */}
      <div
        style={{
          position: 'absolute',
          left: cx + 110 - 180,
          top: cy - 90,
          width: 360,
          height: 180,
          borderRadius: 30,
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${sealed}) rotate(${(1 - sealed) * 10}deg)`,
          fontFamily: FONT,
          boxShadow: `0 0 0 10px ${C.lime}, 0 30px 80px rgba(0,0,0,0.5)`,
        }}
      >
        <div style={{fontWeight: 900, fontSize: 52, color: C.ink, letterSpacing: '-0.03em'}}>✓ SIGNED</div>
        <Mono size={18} color="#6D6878">
          you ∧ ⅔ network
        </Mono>
      </div>
    </AbsoluteFill>
  );
};

/* 9 ─ Speed */
export const SpeedScene: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const stats = [
    {big: '<1s', unit: 'signing latency', start: at('speed', 'sub', -3), color: C.ink},
    {big: '10,000', unit: 'signatures / sec', start: at('speed', 'ten', -3), color: C.ink, count: 10000},
    {big: '100s', unit: 'of signer nodes', start: at('speed', 'hundreds', -3), color: C.ink},
  ];
  return (
    <AbsoluteFill>
      <Bg color={C.cyan} dots="rgba(10,9,13,0.08)" />
      {/* speed streaks */}
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {Array.from({length: 22}).map((_, i) => {
          const y = rand(i) * 1080;
          const len = 200 + rand(i + 2) * 500;
          const x = ((f * (30 + rand(i + 5) * 40) + rand(i + 7) * 3000) % 3000) - 700;
          return <rect key={i} x={2400 - x} y={y} width={len} height={3 + rand(i + 9) * 4} rx={3} fill="#fff" opacity={0.35} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 120, top: 150}}>
        <Label n="04" text="Speed" color={C.ink} dark={false} start={2} />
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 330, display: 'flex', justifyContent: 'space-between'}}>
        {stats.map((s, i) => {
          const p = pop(f, s.start, {damping: 12, stiffness: 200});
          const n = s.count ? Math.round(interpolate(f, [s.start, s.start + 36], [0, s.count], {...clamp, easing: ease})) : null;
          return (
            <div key={i} style={{transform: `translateY(${(1 - p) * 120}px)`, opacity: Math.min(1, p * 1.5)}}>
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 190, letterSpacing: '-0.06em', color: s.color, lineHeight: 1}}>
                {n !== null ? n.toLocaleString('en-US') : s.big}
              </div>
              <div style={{fontFamily: MONO, fontSize: 30, color: C.ink, marginTop: 14, opacity: 0.75}}>{s.unit}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 120, bottom: 150, right: 120, display: 'flex', justifyContent: 'flex-end'}}>
        <Pill start={at('speed', 'hundreds', 18)} bg={C.ink} size={44} rot={-2}>
          the fastest zero-trust MPC network
        </Pill>
      </div>
    </AbsoluteFill>
  );
};

/* 10 ─ Build */
const CODE = [
  {t: '// your Sui program, signing on Bitcoin', c: '#8B8794'},
  {t: 'let dwallet = ika::dwallet(&cap);', c: '#fff'},
  {t: 'let tx  = btc::transfer(to, 0.5);', c: '#fff'},
  {t: 'let sig = dwallet.sign(tx); // you + ⅔', c: C.pinkSoft},
  {t: 'btc::broadcast(sig);        // real BTC', c: C.lime},
];

export const BuildScene: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  let budget = Math.max(0, Math.floor((f - 20) * 1.2));
  const ed = pop(f, 8, {damping: 14});
  return (
    <AbsoluteFill>
      <Bg color={C.paper} dots="rgba(10,9,13,0.08)" vignette={false} />
      <div style={{position: 'absolute', left: 120, top: 250}}>
        <Label n="05" text="Build" color={C.pink} dark={false} start={2} />
        <div style={{height: 24}} />
        <Line start={6} size={112} color={C.ink}>
          Build what
        </Line>
        <Line start={12} size={112} color={C.ink}>
          bridges <span style={{color: C.pink}}>couldn't.</span>
        </Line>
      </div>

      <Card
        dark
        style={{
          left: 1040,
          top: 190,
          width: 780,
          height: 420,
          background: '#141219',
          transform: `translateY(${(1 - ed) * 80}px) scale(${0.95 + ed * 0.05})`,
          opacity: ed,
          overflow: 'hidden',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
          {[C.red, C.yellow, C.lime].map((c) => (
            <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
          ))}
          <Mono size={16} style={{marginLeft: 14}}>
            vault.move
          </Mono>
          <Mono size={14} style={{marginLeft: 'auto'}} color="#5d5967">
            illustrative
          </Mono>
        </div>
        <div style={{padding: '24px 28px', fontFamily: MONO, fontSize: 25, lineHeight: 1.75}}>
          {CODE.map((l, i) => {
            const n = Math.min(l.t.length, budget);
            budget -= n;
            const typing = n > 0 && n < l.t.length;
            return (
              <div key={i} style={{display: 'flex', whiteSpace: 'pre'}}>
                <span style={{color: '#4a4654', width: 40}}>{i + 1}</span>
                <span style={{color: l.c}}>{l.t.slice(0, n)}</span>
                {typing && <span style={{width: 12, background: C.pink}} />}
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{position: 'absolute', left: 1040, top: 650, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20}}>
        <Pill start={at('build', 'native', -3)} bg={C.btc} size={40} rot={-2}>
          ₿ Native BTC DeFi
        </Pill>
        <Pill start={at('build', 'ai', -3)} bg={C.violet} size={40} rot={2}>
          🤖 AI agents w/ real wallets
        </Pill>
        <Pill start={at('build', 'oneProgram', -3)} bg={C.ink} size={40} rot={-1}>
          🌐 One program, every chain
        </Pill>
      </div>
    </AbsoluteFill>
  );
};
