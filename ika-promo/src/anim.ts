import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ease = Easing.bezier(0.22, 1, 0.36, 1); // expo-ish out
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);

/** 0→1 over `dur` frames starting at `start`, eased. */
export const prog = (f: number, start: number, dur: number, e = ease) =>
  interpolate(f, [start, start + dur], [0, 1], {...clamp, easing: e});

export const pop = (f: number, start: number, cfg: {damping?: number; stiffness?: number; mass?: number} = {}) =>
  spring({
    frame: f - start,
    fps: FPS,
    config: {damping: cfg.damping ?? 12, stiffness: cfg.stiffness ?? 180, mass: cfg.mass ?? 0.8},
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Deterministic pseudo-random in [0,1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** How many characters of `text` are visible when typing at `cps` chars/sec. */
export const typed = (text: string, f: number, start: number, cps = 32) =>
  text.slice(0, Math.max(0, Math.floor(((f - start) / FPS) * cps)));
