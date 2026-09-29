import {FPS} from './theme';

// Every scene's length lives here. When the ElevenLabs voice-over lands,
// only these durations need re-timing to the audio.
export type SceneId =
  | 'logo'
  | 'hello'
  | 'welcome'
  | 'status'
  | 'drained'
  | 'flip'
  | 'dwallet'
  | 'zerotrust'
  | 'speed'
  | 'build'
  | 'slam'
  | 'end';

export type Scene = {
  id: SceneId;
  seconds: number;
  vo: string;
};

export const SCENES: Scene[] = [
  {id: 'logo', seconds: 2.2, vo: ''},
  {id: 'hello', seconds: 3.6, vo: "gm! I'm Ika. That's Japanese for squid."},
  {id: 'welcome', seconds: 2.6, vo: 'Welcome to Ika.'},
  {id: 'status', seconds: 5.2, vo: 'Moving crypto in 2026: wrap it, bridge it… and pray.'},
  {id: 'drained', seconds: 4.4, vo: 'Billions later, bridges are still getting drained.'},
  {id: 'flip', seconds: 5.0, vo: "Ika flips it. Don't move the asset. Move the signature."},
  {id: 'dwallet', seconds: 5.6, vo: 'dWallets give your smart contract a native address on Bitcoin, Ethereum, Solana — any chain.'},
  {id: 'zerotrust', seconds: 5.4, vo: 'Every signature needs you and the network. Nobody signs alone. Not even Ika.'},
  {id: 'speed', seconds: 4.4, vo: 'Sub-second signing. Ten thousand a second. Hundreds of nodes.'},
  {id: 'build', seconds: 5.0, vo: 'Native Bitcoin DeFi. AI agents with real wallets. One program, every chain.'},
  {id: 'slam', seconds: 4.2, vo: 'No bridges. No wrapping. Just ink.'},
  {id: 'end', seconds: 4.4, vo: 'Ika. Sign anything, on any chain.'},
];

export const sec = (s: number) => Math.round(s * FPS);

export type TimedScene = Scene & {from: number; frames: number};

export const TIMED: TimedScene[] = (() => {
  let from = 0;
  return SCENES.map((s) => {
    const t = {...s, from, frames: sec(s.seconds)};
    from += t.frames;
    return t;
  });
})();

export const TOTAL_FRAMES = TIMED.reduce((a, s) => a + s.frames, 0);

export const sceneAt = (id: SceneId) => TIMED.find((s) => s.id === id)!;
