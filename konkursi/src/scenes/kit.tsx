// Shared helpers for scenes.
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Freeze, Sequence, useCurrentFrame } from 'remotion';
import { FPS } from '../config';
import { Shot } from '../devices/View';
import { Split } from '../devices/Split';
import { EVENTS, SCENES, SceneId, Span, Timeline, sec } from '../timeline';

export const TlCtx = createContext<Timeline | null>(null);
export const useTl = () => {
  const tl = useContext(TlCtx);
  if (!tl) throw new Error('Timeline missing');
  return tl;
};

/** Frame range of a shot relative to its scene, plus its absolute start (for lip-sync). */
export const useShotSpan = (scene: SceneId, span: Span) => {
  const tl = useTl();
  const s0 = tl.f(SCENES[scene].span[0]);
  const from = tl.f(span[0]);
  return { from: from - s0, dur: Math.max(1, tl.f(span[1]) - from), abs: from };
};

/** Seconds since the start of the current shot. */
export const useT = () => useCurrentFrame() / FPS;

/** Brief time → frame relative to the current shot. */
export const useAt = (scene: SceneId, span: Span) => {
  const tl = useTl();
  const from = tl.f(span[0]);
  return (briefSec: number) => tl.f(briefSec) - from;
};

export const SceneShot: React.FC<{ scene: SceneId; span: Span; children: React.ReactNode; name?: string }> = ({ scene, span, children, name }) => {
  const { from, dur } = useShotSpan(scene, span);
  return (
    <Shot from={from} dur={dur} name={name}>
      {children}
    </Shot>
  );
};

export const WIPE = sec(EVENTS.splitWipe);

/** A split-screen shot. `wipeIn`/`wipeOut` open or close the split on this shot. */
export const SplitShot: React.FC<{
  scene: SceneId;
  span: Span;
  left: React.ReactNode;
  right: React.ReactNode;
  wipeIn?: boolean;
  wipeOut?: boolean;
  name?: string;
}> = ({ scene, span, left, right, wipeIn, wipeOut, name }) => {
  const { from, dur } = useShotSpan(scene, span);
  return (
    <Shot from={from} dur={dur} name={name}>
      <Split left={left} right={right} wipeIn={wipeIn ? [0, WIPE] : undefined} wipeOut={wipeOut ? [dur - WIPE, dur] : undefined} />
    </Shot>
  );
};

/** Render a scene held on one of its frames (for wipes over a neighbour and the Scene 9 freeze). */
export const Frozen: React.FC<{ frame: number; children: React.ReactNode }> = ({ frame, children }) => (
  <Freeze frame={frame}>
    <AbsoluteFill>{children}</AbsoluteFill>
  </Freeze>
);

/** Run children for `dur` frames starting at `from`, inside the current Sequence. */
export const Span_: React.FC<{ from: number; dur: number; children: React.ReactNode }> = ({ from, dur, children }) => (
  <Sequence from={from} durationInFrames={dur} layout="none">
    {children}
  </Sequence>
);
