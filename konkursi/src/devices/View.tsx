// Camera and panes. A shot draws its location in "world" units (one head = 64) and a View
// maps a world point to the centre of the pane at a zoom, with the default slow push-in.
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { PANE_H, PANE_W } from '../config';
import { EASE, lerp, prog } from '../lib/anim';

export const PaneCtx = createContext({ w: PANE_W, h: PANE_H });
export const ShotCtx = createContext({ dur: 1 });

export const useShot = () => useContext(ShotCtx);
export const usePane = () => useContext(PaneCtx);

/** A shot: a Sequence that also tells its children how long it lasts. */
export const Shot: React.FC<{ from: number; dur: number; children: React.ReactNode; name?: string }> = ({ from, dur, children, name }) => (
  <Sequence from={from} durationInFrames={dur} name={name} layout="none">
    <ShotCtx.Provider value={{ dur }}>{children}</ShotCtx.Provider>
  </Sequence>
);

export type Cam = { cx: number; cy: number; zoom: number };

/**
 * Renders world-space SVG through a camera. By default the shot pushes in from 1.00 to 1.04
 * over its length (ease-in-out); pass `still` for static shots, or `to` for an explicit move.
 */
export const View: React.FC<{
  cam: Cam;
  to?: Cam;
  moveFrom?: number;
  moveTo?: number;
  still?: boolean;
  push?: number;
  bg?: string;
  children: React.ReactNode;
  filter?: string;
}> = ({ cam, to, moveFrom, moveTo, still, push = 0.04, bg, children, filter }) => {
  const frame = useCurrentFrame();
  const { dur } = useShot();
  const { w, h } = usePane();
  const m = to ? prog(frame, moveFrom ?? 0, moveTo ?? dur) : 0;
  const cx = lerp(cam.cx, to?.cx ?? cam.cx, m);
  const cy = lerp(cam.cy, to?.cy ?? cam.cy, m);
  const z = lerp(cam.zoom, to?.zoom ?? cam.zoom, m) * (still || to ? 1 : 1 + push * EASE(Math.min(1, frame / Math.max(1, dur - 1))));
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', inset: 0, background: bg, filter }}>
      <g transform={`translate(${w / 2} ${h / 2}) scale(${z}) translate(${-cx} ${-cy})`}>{children}</g>
    </svg>
  );
};

/** A full-frame (1920×1080) layer. */
export const Full: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <PaneCtx.Provider value={{ w: PANE_W * 2, h: PANE_H }}>
    <AbsoluteFill style={{ overflow: 'hidden', ...style }}>{children}</AbsoluteFill>
  </PaneCtx.Provider>
);
