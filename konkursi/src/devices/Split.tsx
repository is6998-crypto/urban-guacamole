// Split screen: two 960×1080 panes with a 6 px off-white divider in the centre.
// Suela is always the left pane. Opens and closes with a 0.5 s wipe from the centre line.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { DIVIDER_W, PALETTE, PANE_H, PANE_W } from '../config';
import { prog } from '../lib/anim';
import { PaneCtx } from './View';

export const Pane: React.FC<{ side: 'L' | 'R'; children: React.ReactNode; reveal?: number; dx?: number; opacity?: number }> = ({
  side,
  children,
  reveal = 1,
  dx = 0,
  opacity = 1,
}) => {
  // reveal 0..1: how much of the pane is visible, growing outward from the centre line.
  const hidden = (1 - reveal) * 100;
  const clip = side === 'L' ? `inset(0 0 0 ${hidden}%)` : `inset(0 ${hidden}% 0 0)`;
  return (
    <PaneCtx.Provider value={{ w: PANE_W, h: PANE_H }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: side === 'L' ? 0 : PANE_W,
          width: PANE_W,
          height: PANE_H,
          overflow: 'hidden',
          clipPath: clip,
          transform: `translateX(${dx}px)`,
          opacity,
        }}
      >
        {children}
      </div>
    </PaneCtx.Provider>
  );
};

export const Divider: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div style={{ position: 'absolute', top: 0, left: PANE_W - DIVIDER_W / 2, width: DIVIDER_W, height: PANE_H, background: PALETTE.offWhite, opacity }} />
);

/**
 * `wipeIn` / `wipeOut`: frame ranges (relative to this component's Sequence) of the
 * opening and closing wipes. Whatever is underneath shows outside the panes during a wipe.
 */
export const Split: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  wipeIn?: [number, number];
  wipeOut?: [number, number];
}> = ({ left, right, wipeIn, wipeOut }) => {
  const frame = useCurrentFrame();
  let reveal = 1;
  if (wipeIn) reveal = Math.min(reveal, prog(frame, wipeIn[0], wipeIn[1]));
  if (wipeOut) reveal = Math.min(reveal, 1 - prog(frame, wipeOut[0], wipeOut[1]));
  return (
    <AbsoluteFill>
      <Pane side="L" reveal={reveal}>{left}</Pane>
      <Pane side="R" reveal={reveal}>{right}</Pane>
      <Divider />
    </AbsoluteFill>
  );
};
