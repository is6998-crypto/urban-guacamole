// Analog wall clock: white face, black hands, set to an exact "HH:MM".
import React from 'react';

export const clockAngles = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return { hour: ((h % 12) + m / 60) * 30, minute: m * 6 };
};

export const WallClock: React.FC<{ time: string; x: number; y: number; r: number; rim?: string }> = ({ time, x, y, r, rim = '#22223B' }) => {
  const { hour, minute } = clockAngles(time);
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r * 1.08} fill="#000" opacity={0.12} cx={r * 0.06} cy={r * 0.08} />
      <circle r={r} fill={rim} />
      <circle r={r * 0.9} fill="#FFFFFF" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x={-r * (i % 3 === 0 ? 0.035 : 0.022)}
          y={-r * 0.84}
          width={r * (i % 3 === 0 ? 0.07 : 0.044)}
          height={r * (i % 3 === 0 ? 0.16 : 0.09)}
          fill="#22223B"
          transform={`rotate(${i * 30})`}
        />
      ))}
      <rect x={-r * 0.045} y={-r * 0.5} width={r * 0.09} height={r * 0.6} rx={r * 0.04} fill="#111" transform={`rotate(${hour})`} />
      <rect x={-r * 0.03} y={-r * 0.74} width={r * 0.06} height={r * 0.84} rx={r * 0.03} fill="#111" transform={`rotate(${minute})`} />
      <circle r={r * 0.06} fill="#111" />
    </g>
  );
};
