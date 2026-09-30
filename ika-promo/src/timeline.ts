import {FPS} from './theme';
import vo from './vo.json';

// Scene starts and every animation cue come from a forced alignment of the
// ElevenLabs read (scripts/align_vo.py → src/vo.json). Times in vo.json
// are seconds on the voice-over's own clock; the VO starts after the logo pre-roll.
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

export type Cue = keyof typeof vo.cues;

export const sec = (s: number) => Math.round(s * FPS);

export const PREROLL = vo.preroll;
export const VO_FROM = sec(PREROLL);

/** Absolute video frame at which a VO word starts. */
export const cueFrame = (c: Cue) => sec(PREROLL + vo.cues[c]);

const ORDER: SceneId[] = ['logo', 'hello', 'welcome', 'status', 'drained', 'flip', 'dwallet', 'zerotrust', 'speed', 'build', 'slam', 'end'];
const startOf = (id: SceneId) => (id === 'logo' ? 0 : sec(PREROLL + (vo.scenes as Record<string, number>)[id]));

export const TOTAL_FRAMES = sec(PREROLL + vo.cues.voEnd + vo.tail);

export type TimedScene = {id: SceneId; from: number; frames: number};

export const TIMED: TimedScene[] = ORDER.map((id, i) => {
  const from = startOf(id);
  const to = i + 1 < ORDER.length ? startOf(ORDER[i + 1]) : TOTAL_FRAMES;
  return {id, from, frames: to - from};
});

export const sceneAt = (id: SceneId) => TIMED.find((s) => s.id === id)!;

/** Frame of a VO cue relative to the start of `scene` (for use inside a Sequence). */
export const at = (scene: SceneId, c: Cue, offset = 0) => cueFrame(c) - sceneAt(scene).from + offset;

/** Lip-sync level (0..1) at an absolute video frame. */
export const talkAt = (frame: number) => {
  const i = frame - VO_FROM;
  return i >= 0 && i < vo.env.length ? vo.env[i] : 0;
};
