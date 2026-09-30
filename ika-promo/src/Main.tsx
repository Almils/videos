import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, pop} from './anim';
import {Squid, Expression} from './components/Squid';
import {Bubble, InkBlot, Sweep} from './components/ui';
import {LogoScene, HelloScene, WelcomeScene} from './scenes/Intro';
import {StatusScene, DrainedScene} from './scenes/Problem';
import {FlipScene, DWalletScene, ZeroTrustScene, SpeedScene, BuildScene} from './scenes/Tech';
import {SlamScene, EndScene} from './scenes/Outro';
import {Cue, SceneId, TIMED, VO_FROM, cueFrame, sceneAt, talkAt} from './timeline';
import {C} from './theme';

const COMPONENTS: Record<SceneId, React.FC<{d: number}>> = {
  logo: LogoScene,
  hello: HelloScene,
  welcome: WelcomeScene,
  status: StatusScene,
  drained: DrainedScene,
  flip: FlipScene,
  dwallet: DWalletScene,
  zerotrust: ZeroTrustScene,
  speed: SpeedScene,
  build: BuildScene,
  slam: SlamScene,
  end: EndScene,
};

/* ───────── Mascot direction per scene ───────── */

type Beat = {
  expr: Expression;
  wave?: number;
  look?: [number, number];
  bubble?: {text: string; hl: string[]; light?: boolean; color?: string; delay?: number; cue?: Cue};
};

const BEATS: Partial<Record<SceneId, Beat>> = {
  hello: {expr: 'happy', wave: 1, bubble: {text: "gm! I'm Ika.", hl: ['Ika'], delay: 8}},
  welcome: {expr: 'grin', look: [1, -0.2]},
  status: {expr: 'smug', look: [1, -0.5], bubble: {text: 'wrap it, bridge it, pray.', hl: ['pray'], light: true, cue: 'wrap'}},
  drained: {expr: 'ugh', bubble: {text: 'ser… the bridge is gone.', hl: ['gone'], color: C.red, delay: 30}},
  flip: {expr: 'wink', look: [1, -0.4], bubble: {text: 'move the signature, not the asset.', hl: ['signature'], cue: 'dont'}},
  dwallet: {expr: 'happy', look: [1, -0.3], bubble: {text: 'one wallet, every chain.', hl: ['every', 'chain'], color: C.yellow, delay: 24}},
  zerotrust: {expr: 'smug', look: [1, 0], bubble: {text: 'nobody signs alone. not even me.', hl: ['alone'], color: C.lime, delay: 24}},
  speed: {expr: 'wow', look: [1, -0.6], bubble: {text: 'sub-second. no cap.', hl: ['sub-second'], color: C.cyan, delay: 20}},
  build: {expr: 'grin', look: [1, -0.4], bubble: {text: 'BTC DeFi, zero wrappers.', hl: ['zero', 'wrappers'], light: true, delay: 24}},
  slam: {expr: 'grin'},
  end: {expr: 'happy', wave: 1, look: [-1, 0]},
};

const MascotLayer: React.FC = () => {
  const f = useCurrentFrame();
  const hello = sceneAt('hello');
  const welcome = sceneAt('welcome');
  const status = sceneAt('status');
  const drained = sceneAt('drained');
  const slam = sceneAt('slam');
  const end = sceneAt('end');
  if (f < hello.from) return null;

  // position keyframes: [frame, x, y, size]
  const K: [number, number, number, number][] = [
    [hello.from, 960, 530, 270],
    [welcome.from, 960, 530, 270],
    [welcome.from + 28, 640, 500, 300],
    [status.from - 14, 640, 500, 300],
    [status.from + 16, 150, 915, 150],
    [slam.from - 1, 150, 915, 150],
    [slam.from, 1690, 890, 200],
    [end.from - 1, 1690, 890, 200],
    [end.from, 1530, 470, 250],
  ];
  const frames = K.map((k) => k[0]);
  const at = (i: number) => interpolate(f, frames, K.map((k) => k[i]), {...clamp, easing: easeInOut});
  const x = at(1);
  const y = at(2);
  const size = at(3);

  const scene = [...TIMED].reverse().find((s) => f >= s.from)!;
  const beat = BEATS[scene.id];
  if (!beat) return null;
  const local = f - scene.from;

  // Pop in on hello, re-pop on each hard cut, squash when landing in the corner
  const intro = pop(f, hello.from + 4, {damping: 9, stiffness: 150});
  const land = pop(f, status.from + 16, {damping: 7, stiffness: 260});
  const landSquash = f > status.from + 16 ? 1 - (1 - land) * 0.5 : 1;
  const cutPop = scene.id === 'slam' || scene.id === 'end' ? pop(f, scene.from, {damping: 10, stiffness: 220}) : 1;
  // Slam: hop on every word
  const hop = (['no1', 'no2', 'just'] as const).reduce((a, c) => {
    const t = f - cueFrame(c);
    return a + (t >= 0 && t < 24 ? Math.sin((t / 24) * Math.PI) * 44 : 0);
  }, 0);
  const talk = talkAt(f);
  // Ink squirt recoil at the end of 'drained'
  const recoil = interpolate(f, [drained.from + drained.frames - 20, drained.from + drained.frames - 12, drained.from + drained.frames + 6], [1, 0.72, 1], clamp);
  const wave = (beat.wave ?? 0) * pop(f, scene.from + 20, {damping: 20});
  const scale = intro * cutPop;
  const h = size * 1.25;

  const expr: Expression =
    scene.id === 'drained' && local > drained.frames - 22 ? 'wow' : scene.id === 'slam' && local < 124 ? 'wow' : beat.expr;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: x - size / 2,
          top: y - h / 2 - hop,
          transform: `scale(${scale})`,
          transformOrigin: '50% 90%',
        }}
      >
        <Squid size={size} expression={expr} wave={wave} look={beat.look} talk={talk} squash={landSquash * recoil * (1 + talk * 0.035)} />
      </div>
      {beat.bubble && (
        <div style={{position: 'absolute', left: x + size * 0.42, top: y - h * 0.58, transform: 'translateY(-100%)'}}>
          <Bubble
            key={scene.id}
            text={beat.bubble.text}
            hl={beat.bubble.hl}
            start={beat.bubble.cue ? cueFrame(beat.bubble.cue) : scene.from + (beat.bubble.delay ?? 16)}
            hlColor={beat.bubble.color ?? C.pink}
            light={beat.bubble.light}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ───────── Transitions between scenes ───────── */

const Transitions: React.FC = () => {
  const s = (id: SceneId) => sceneAt(id).from;
  return (
    <>
      <Sweep at={s('status')} colors={[C.pink, C.paper]} />
      <Sweep at={s('drained')} colors={[C.red, '#120509']} dur={28} />
      <InkBlot at={s('flip')} x={190} y={900} color={C.ink} dur={40} />
      <Sweep at={s('dwallet')} colors={[C.pink, C.violet]} />
      <Sweep at={s('zerotrust')} colors={[C.lime, C.ink]} />
      <Sweep at={s('speed')} colors={[C.yellow, C.cyan]} />
      <Sweep at={s('build')} colors={[C.pink, C.paper]} />
    </>
  );
};

export const IkaPromo: React.FC<{vo?: boolean; music?: boolean; sfx?: boolean}> = ({vo, music, sfx}) => (
  <AbsoluteFill style={{background: C.ink}}>
    {TIMED.map((s) => {
      const Comp = COMPONENTS[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={s.id}>
          <Comp d={s.frames} />
        </Sequence>
      );
    })}
    <Transitions />
    <MascotLayer />
    {sfx && <Audio src={staticFile('sfx.wav')} volume={vo ? 0.5 : 0.9} />}
    {vo && (
      <Sequence from={VO_FROM} name="voice-over">
        <Audio src={staticFile('vo.wav')} />
      </Sequence>
    )}
    {music && <Audio src={staticFile('music.mp3')} volume={0.25} />}
  </AbsoluteFill>
);
