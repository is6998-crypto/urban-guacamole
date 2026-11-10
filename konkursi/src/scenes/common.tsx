// Small staging helpers shared by scenes.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { View, Cam } from '../devices/View';
import { kf, lerp, prog, s } from '../lib/anim';
import { ArmPose, HandShape, Look, PELVIS_SIT, PELVIS_STAND, reach } from '../rig/Person';
import { Light, LightKind } from '../sets/Light';

/** A pane: a camera view of a world, with the location's light over it. */
export const Stage: React.FC<{ cam: Cam; to?: Cam; moveFrom?: number; moveTo?: number; still?: boolean; light?: LightKind; lightAmount?: number; bg?: string; children: React.ReactNode }> = ({
  cam,
  to,
  moveFrom,
  moveTo,
  still,
  light = 'none',
  lightAmount = 1,
  bg,
  children,
}) => (
  <AbsoluteFill>
    <View cam={cam} to={to} moveFrom={moveFrom} moveTo={moveTo} still={still} bg={bg}>
      {children}
    </View>
    <Light kind={light} amount={lightAmount} />
  </AbsoluteFill>
);

/** Walk along keyed x positions (seconds → x). Returns x, whether walking, and a leg phase. */
export const walkPath = (frame: number, keys: readonly (readonly [number, number])[], stride = 0.11) => {
  const fk = keys.map(([t, v]) => [s(t), v] as const);
  const x = kf(frame, fk);
  const xPrev = kf(frame - 1, fk);
  const moving = Math.abs(x - xPrev) > 0.25;
  // phase follows distance travelled so feet do not slide
  let dist = 0;
  for (let i = 1; i < fk.length; i++) {
    const [f0, v0] = fk[i - 1];
    const [f1, v1] = fk[i];
    if (frame >= f1) dist += Math.abs(v1 - v0);
    else if (frame > f0) dist += Math.abs(x - v0);
  }
  return { x, moving, phase: dist * stride, dir: Math.sign(x - xPrev) };
};

/** Pelvis height for sitting down (u 0→1) or standing up (u 1→0). */
export const sitY = (u: number) => lerp(PELVIS_STAND, PELVIS_SIT, u);
export const legsFor = (u: number, walking?: { phase: number }) =>
  walking ? ({ kind: 'walk', phase: walking.phase, stride: 20 } as const) : u > 0.5 ? ({ kind: 'sit' } as const) : ({ kind: 'stand' } as const);

/** Blend between two arm poses. */
export const mixArm = (a: ArmPose, b: ArmPose, t: number, hand?: HandShape): ArmPose => ({
  ...(t < 0.5 ? a : b),
  sh: lerp(a.sh, b.sh, t),
  el: lerp(a.el, b.el, t),
  wr: lerp(a.wr ?? 0, b.wr ?? 0, t),
  fore: lerp(a.fore ?? 0, b.fore ?? 0, t),
  hand: hand ?? (t < 0.5 ? a.hand : b.hand),
});

export const REST: ArmPose = { sh: 6, el: 12, hand: 'relaxed' };

/** Silent talking: mouth flaps with small pauses. */
export const talk = (frame: number, seed = 0, amount = 0.55) => {
  const t = frame / 30;
  const env = Math.sin(t * 1.7 + seed) > -0.55 ? 1 : 0;
  return env * amount * (0.5 - 0.5 * Math.cos(t * 2 * Math.PI * 6.5 + seed));
};

/** A held reach toward a point, eased in over [a, b] and out over [c, d] (seconds). */
export const reachWindow = (frame: number, look: Look, side: -1 | 1, target: { x: number; y: number }, w: [number, number, number, number], opts: Parameters<typeof reach>[4] = {}, rest: ArmPose = REST) => {
  const u = prog(frame, s(w[0]), s(w[1])) - prog(frame, s(w[2]), s(w[3]));
  return mixArm(rest, reach(look, side, target.x, target.y, opts), u, u > 0.5 ? opts.hand : rest.hand);
};
