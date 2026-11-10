import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Person } from '../rig/Person';
import { SUELA, ERA, QEMAJLI, KRYETARI, ANETARJA, ANETARI, SEKRETARJA, KAMARIERI, extra } from '../rig/cast';

export const CastTest: React.FC = () => {
  const cast = [SUELA, ERA, QEMAJLI, KRYETARI, ANETARJA, ANETARI, SEKRETARJA, KAMARIERI, extra(0), extra(1)];
  return (
    <AbsoluteFill style={{ background: '#DDE5ED' }}>
      <svg width={1920} height={1080}>
        {cast.map((c, i) => (
          <Person key={c.id} look={c} x={110 + i * 185} y={600} scale={1.15} pose={{ face: { smile: i === 2 ? 0.8 : 0.1 } }} />
        ))}
        <Person look={SUELA} x={300} y={2650} scale={5.2} pose={{ face: { lookX: 0.4 } }} />
        <Person look={ERA} x={800} y={2650} scale={5.2} pose={{ face: { smile: 0.9, open: 0.5, squint: 0.5 }, headTilt: -6 }} />
        <Person look={KRYETARI} x={1300} y={2650} scale={5.2} pose={{ face: { lid: 0.35, smile: -0.2 } }} />
        <Person look={SUELA} x={1720} y={1080} scale={1.1} pose={{ turn: 0.7, legs: { kind: 'walk', phase: 1 }, armL: { sh: -14, el: 20 }, armR: { sh: 18, el: 30 } }} />
      </svg>
    </AbsoluteFill>
  );
};
