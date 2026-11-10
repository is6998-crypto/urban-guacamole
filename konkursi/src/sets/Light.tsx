// Lighting by location (section 3), laid over a pane as flat colour washes.
import React from 'react';
import { AbsoluteFill } from 'remotion';

export type LightKind = 'morning' | 'cool' | 'warm' | 'amber' | 'dusk' | 'midday' | 'afternoon' | 'none';

export const Light: React.FC<{ kind: LightKind; amount?: number; from?: 'left' | 'right' }> = ({ kind, amount = 1, from = 'left' }) => {
  if (kind === 'none') return null;
  const dir = from === 'left' ? '110deg' : '250deg';
  const layers: Record<Exclude<LightKind, 'none'>, React.CSSProperties[]> = {
    morning: [
      { background: `linear-gradient(${dir}, rgba(255,214,140,0.30), rgba(255,214,140,0) 60%)`, mixBlendMode: 'screen' },
      { background: 'rgba(255, 228, 170, 0.10)', mixBlendMode: 'multiply' },
    ],
    cool: [{ background: 'linear-gradient(180deg, rgba(220,232,245,0.10), rgba(141,169,196,0.10))', mixBlendMode: 'multiply' }],
    warm: [
      { background: `radial-gradient(ellipse at 50% 25%, rgba(255,214,150,0.28), rgba(255,214,150,0) 70%)`, mixBlendMode: 'screen' },
      { background: 'rgba(242, 215, 166, 0.16)', mixBlendMode: 'multiply' },
    ],
    amber: [
      { background: 'rgba(40, 24, 18, 0.42)', mixBlendMode: 'multiply' },
      { background: 'radial-gradient(ellipse at 50% 30%, rgba(233,162,59,0.32), rgba(233,162,59,0) 65%)', mixBlendMode: 'screen' },
    ],
    dusk: [
      { background: 'rgba(46, 58, 89, 0.55)', mixBlendMode: 'multiply' },
      { background: 'radial-gradient(ellipse at 40% 45%, rgba(255,213,138,0.30), rgba(255,213,138,0) 55%)', mixBlendMode: 'screen' },
    ],
    midday: [{ background: 'linear-gradient(180deg, rgba(255,250,235,0.14), rgba(255,250,235,0))', mixBlendMode: 'screen' }],
    afternoon: [
      { background: `linear-gradient(${dir}, rgba(255,170,90,0.30), rgba(255,170,90,0.05) 70%)`, mixBlendMode: 'screen' },
      { background: 'rgba(233, 162, 59, 0.12)', mixBlendMode: 'multiply' },
    ],
  };
  return (
    <>
      {layers[kind].map((st, i) => (
        <AbsoluteFill key={i} style={{ ...st, opacity: amount, pointerEvents: 'none' }} />
      ))}
    </>
  );
};
