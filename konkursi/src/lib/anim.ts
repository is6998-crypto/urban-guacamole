import { Easing, interpolate } from 'remotion';
import { FPS } from '../config';

/** Ease-in-out used for every character and camera move. */
export const EASE = Easing.inOut(Easing.cubic);
export const EASE_OUT = Easing.out(Easing.cubic);

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Eased 0→1 progress of `frame` between frames a and b. */
export const prog = (frame: number, a: number, b: number, ease = EASE) =>
  b <= a ? (frame >= b ? 1 : 0) : ease(clamp01((frame - a) / (b - a)));

/** Seconds (relative to the current shot) → frames. Uses the project FPS. */
export const s = (secs: number) => Math.round(secs * FPS);

type Key = readonly [frame: number, value: number];
/** Piecewise eased keyframes: kf(frame, [[0, 0], [30, 1], [60, 0.5]]). Holds before/after. */
export const kf = (frame: number, keys: readonly Key[], ease = EASE) => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (frame <= f1) return lerp(v0, v1, prog(frame, f0, f1, ease));
  }
  return keys[keys.length - 1][1];
};

/** Keyframes in seconds of the current shot. */
export const ks = (frame: number, keys: readonly Key[], ease = EASE) =>
  kf(frame, keys.map(([t, v]) => [s(t), v] as const), ease);

export const lin = (frame: number, a: number, b: number, v0: number, v1: number) =>
  interpolate(frame, [a, b], [v0, v1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** Deterministic pseudo-random in [0, 1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Eyelid closure from automatic blinks: one blink every 3–5 s, 5 frames long.
 * `frame` is a global frame so blinks keep their rhythm across cuts.
 */
export const blinkAt = (frame: number, seed: number) => {
  let t = Math.round(rand(seed) * 60);
  let i = 0;
  while (t + 6 < frame && i < 400) {
    t += Math.round((3 + 2 * rand(seed * 13.37 + i)) * FPS);
    i++;
  }
  const d = frame - t;
  if (d < 0 || d > 5) return 0;
  return [0.55, 1, 1, 0.6, 0.25, 0][d];
};

/** Slow breathing, −1..1. */
export const breath = (frame: number, seed = 0) => Math.sin((frame / FPS) * ((2 * Math.PI) / 3.8) + seed * 2.1);

/** Small secondary sway for hair and clothing, −1..1. */
export const sway = (frame: number, seed = 0, period = 2.6) => Math.sin((frame / FPS) * ((2 * Math.PI) / period) + seed * 1.7);
