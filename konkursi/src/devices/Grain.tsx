// Static paper grain over the whole frame (section 3), at GRAIN_OPACITY.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GRAIN_OPACITY, HEIGHT, WIDTH } from '../config';

export const Grain: React.FC = () =>
  GRAIN_OPACITY > 0 ? (
    <AbsoluteFill style={{ opacity: GRAIN_OPACITY, mixBlendMode: 'multiply', pointerEvents: 'none' }}>
      <svg width={WIDTH} height={HEIGHT}>
        <filter id="paper-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={7} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={WIDTH} height={HEIGHT} filter="url(#paper-grain)" />
      </svg>
    </AbsoluteFill>
  ) : null;
