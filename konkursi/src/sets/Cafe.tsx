// The café (Scene 4) and the same room at night as the bar (Scenes 7–9).
import React from 'react';
import { PALETTE } from '../config';

const P = PALETTE;
export const CAFE = { table: { x0: -250, x1: 110, top: -200 }, seatEra: -200, seatQ: 60, window: { x0: -620, x1: 260, y0: -720, y1: -300 } };

export const CafeRoom: React.FC<{ night?: boolean }> = ({ night }) => {
  const w = CAFE.window;
  return (
    <g>
      <rect x={-1600} y={-1200} width={3200} height={1200} fill={night ? '#6E4A33' : P.cafeLight} />
      <rect x={-1600} y={-300} width={3200} height={300} fill={night ? '#4C2F1E' : P.cafeWood} />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={-1600 + i * 140} y={-300} width={4} height={300} fill={night ? '#3B2416' : '#74502F'} />
      ))}
      <rect x={-1600} y={-306} width={3200} height={10} fill={night ? '#5C3A25' : '#A57249'} />
      <rect x={-1600} y={0} width={3200} height={900} fill={night ? '#3A2416' : '#6E4A2E'} />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={`f${i}`} x={-1600} y={36 + i * 60} width={3200} height={3} fill={night ? '#2B1A10' : '#5E3D25'} />
      ))}
      {/* the big window */}
      <rect x={w.x0 - 18} y={w.y0 - 18} width={w.x1 - w.x0 + 36} height={w.y1 - w.y0 + 36} fill={night ? '#3B2416' : '#7A5233'} />
      <rect x={w.x0} y={w.y0} width={w.x1 - w.x0} height={w.y1 - w.y0} fill={night ? P.dusk : '#DCEAF3'} />
      {/* street outside */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={w.x0 + 30 + i * 220} y={w.y0 + 70 + (i % 2) * 40} width={170} height={w.y1 - w.y0} fill={night ? '#1F2740' : '#C4D3DE'} />
      ))}
      {night
        ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={w.x0 + 60 + i * 100} y={w.y0 + 140 + (i % 3) * 50} width={22} height={18} fill={P.lamp} opacity={0.8} />)
        : [0, 1, 2, 3].map((i) => <rect key={i} x={w.x0 + 60 + i * 220} y={w.y0 + 130} width={40} height={50} fill="#EEF4F8" />)}
      <rect x={(w.x0 + w.x1) / 2 - 6} y={w.y0} width={12} height={w.y1 - w.y0} fill={night ? '#3B2416' : '#7A5233'} />
      {!night && <path d={`M ${w.x0} ${w.y1} L ${w.x1} ${w.y1} L ${w.x1 + 300} 0 L ${w.x0 + 100} 0 Z`} fill="#FFF3D6" opacity={0.18} />}
      {/* counter and coffee machine */}
      <rect x={420} y={-260} width={700} height={260} fill={night ? '#3B2416' : '#7A5233'} />
      <rect x={410} y={-276} width={720} height={20} rx={4} fill={night ? '#8E6A4A' : '#C89A6A'} />
      <rect x={560} y={-430} width={190} height={156} rx={10} fill="#B9C0C7" />
      <rect x={560} y={-430} width={190} height={34} rx={10} fill="#8F979F" />
      <rect x={600} y={-360} width={20} height={40} fill="#2B2D42" />
      <rect x={690} y={-360} width={20} height={40} fill="#2B2D42" />
      <rect x={800} y={-330} width={60} height={56} rx={6} fill="#F4F1EA" />
      {/* shelves with cups / bottles */}
      <rect x={440} y={-620} width={660} height={12} fill={night ? '#3B2416' : '#7A5233'} />
      {Array.from({ length: 7 }, (_, i) =>
        night ? (
          <rect key={i} x={470 + i * 88} y={-700} width={26} height={80} rx={6} fill={['#7A9E7E', '#C0843A', '#8E5A7A', '#5E7A9A'][i % 4]} opacity={0.9} />
        ) : (
          <rect key={i} x={470 + i * 88} y={-660} width={46} height={40} rx={6} fill="#F4F1EA" />
        ),
      )}
      {/* pendant lamps */}
      {[-420, -60, 700].map((x) => (
        <g key={x}>
          <rect x={x - 2} y={-1200} width={4} height={330} fill="#2B1A10" />
          <path d={`M ${x - 46} -820 Q ${x} -900 ${x + 46} -820 Z`} fill={night ? P.cafeAmber : '#2B2D42'} />
          <ellipse cx={x} cy={-818} rx={18} ry={7} fill={P.lamp} opacity={night ? 1 : 0.7} />
          {night && <ellipse cx={x} cy={-700} rx={260} ry={200} fill={P.cafeAmber} opacity={0.14} />}
        </g>
      ))}
    </g>
  );
};

/** A wooden café chair, side view, seen from the front-ish. Drawn behind the sitter. */
export const CafeChairBack: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-44} y={-360} width={88} height={20} rx={6} fill="#5E3D25" />
    <rect x={-40} y={-344} width={10} height={210} fill="#5E3D25" />
    <rect x={30} y={-344} width={10} height={210} fill="#5E3D25" />
  </g>
);
export const CafeChairSeat: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-48} y={-136} width={96} height={16} rx={5} fill="#74502F" />
    <rect x={-42} y={-120} width={8} height={120} fill="#5E3D25" />
    <rect x={34} y={-120} width={8} height={120} fill="#5E3D25" />
  </g>
);

/** The window table, drawn in front of the sitters. */
export const CafeTable: React.FC<{ night?: boolean; children?: React.ReactNode }> = ({ night, children }) => {
  const t = CAFE.table;
  return (
    <g>
      <rect x={(t.x0 + t.x1) / 2 - 10} y={t.top} width={20} height={-t.top} fill={night ? '#2B1A10' : '#4A2F1C'} />
      <ellipse cx={(t.x0 + t.x1) / 2} cy={-6} rx={70} ry={10} fill={night ? '#2B1A10' : '#4A2F1C'} />
      <rect x={t.x0} y={t.top - 14} width={t.x1 - t.x0} height={22} rx={6} fill={night ? '#6E4A33' : '#A57249'} />
      <rect x={t.x0} y={t.top + 2} width={t.x1 - t.x0} height={6} rx={3} fill={night ? '#4C2F1E' : '#8B5E3C'} />
      {children}
    </g>
  );
};
