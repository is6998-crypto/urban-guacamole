// Scene 3: two CVs on a white table, seen from above. World units centred on the table.
import React from 'react';
import { PALETTE, SURNAME_ERA, SURNAME_SUELA, UNIVERSITY } from '../config';
import { FONT } from '../fonts';
import { Person } from '../rig/Person';
import { ERA, SUELA } from '../rig/cast';
import { CV } from '../text';

export const PAPER = { w: 600, h: 848 };
export const CV_X = { suela: -330, era: 330 };
/** Row centres (y, relative to the paper centre) of the four rows that differ. */
export const ROW_Y = { studimet: -200, nota: -70, pervoja: 60, certifikata: 190, gjuhet: 320 };

const Filler: React.FC<{ y: number; n?: number; x0?: number }> = ({ y, n = 2, x0 = -260 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <rect key={i} x={x0} y={y + i * 16} width={[460, 400, 430][i % 3]} height={6} rx={3} fill="#DADDE2" />
    ))}
  </g>
);

const Row: React.FC<{ y: number; label: string; value: string }> = ({ y, label, value }) => (
  <g>
    <text x={-260} y={y - 8} fontFamily={FONT} fontWeight={600} fontSize={21} fill={PALETTE.instDark}>
      {label}
    </text>
    <text x={-260} y={y + 26} fontFamily={FONT} fontWeight={400} fontSize={27} fill={PALETTE.ink}>
      {value}
    </text>
  </g>
);

export const CvPaper: React.FC<{ who: 'suela' | 'era' }> = ({ who }) => {
  const look = who === 'suela' ? SUELA : ERA;
  const v = who === 'suela' ? CV.suela : CV.era;
  const name = who === 'suela' ? `Suela${SURNAME_SUELA ? ` ${SURNAME_SUELA}` : ''}` : `Era${SURNAME_ERA ? ` ${SURNAME_ERA}` : ''}`;
  const clip = `portrait-${who}`;
  return (
    <g>
      <rect x={-PAPER.w / 2} y={-PAPER.h / 2} width={PAPER.w} height={PAPER.h} fill="#FFFFFF" />
      <rect x={-PAPER.w / 2} y={-PAPER.h / 2} width={PAPER.w} height={10} fill={PALETTE.instDark} />
      {/* formal portrait */}
      <defs>
        <clipPath id={clip}>
          <rect x={-260} y={-390} width={124} height={150} rx={4} />
        </clipPath>
      </defs>
      <rect x={-260} y={-390} width={124} height={150} rx={4} fill="#DDE5ED" />
      <g clipPath={`url(#${clip})`}>
        <Person look={look} x={-198} y={-390 + 150 + 280} scale={0.95} pose={{ face: { smile: 0.15, blinks: false } }} frame={0} />
      </g>
      <text x={-110} y={-330} fontFamily={FONT} fontWeight={700} fontSize={40} fill={PALETTE.ink}>
        {name}
      </text>
      <Filler y={-300} n={2} x0={-110} />
      <rect x={-260} y={-226} width={520} height={2} fill="#E3E6EA" />
      <Row y={ROW_Y.studimet} label={CV.labels.studimet} value={`${CV.master}, ${UNIVERSITY}`} />
      <Filler y={ROW_Y.studimet + 44} n={2} />
      <Row y={ROW_Y.nota} label={CV.labels.nota} value={v.nota} />
      <Filler y={ROW_Y.nota + 44} n={2} />
      <Row y={ROW_Y.pervoja} label={CV.labels.pervoja} value={v.pervoja} />
      <Filler y={ROW_Y.pervoja + 44} n={2} />
      <Row y={ROW_Y.certifikata} label={CV.labels.certifikata} value={v.certifikata} />
      <Filler y={ROW_Y.certifikata + 44} n={2} />
      <Row y={ROW_Y.gjuhet} label={CV.labels.gjuhet} value={v.gjuhet} />
      <Filler y={ROW_Y.gjuhet + 44} n={3} />
    </g>
  );
};

/** A hand-drawn marker circle around a row, drawn on as `p` goes 0→1. 6 px stroke on screen. */
export const MarkerCircle: React.FC<{ y: number; p: number }> = ({ y, p }) => {
  if (p <= 0) return null;
  const d = `M 240 ${y - 30} C 300 ${y - 10} 296 ${y + 44} 120 ${y + 52} C -60 ${y + 60} -270 ${y + 50} -284 ${y + 12} C -296 ${y - 24} -170 ${y - 58} 20 ${y - 56} C 170 ${y - 54} 262 ${y - 40} 276 ${y - 12}`;
  return (
    <path d={d} fill="none" stroke={PALETTE.marker} strokeWidth={6} strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
  );
};

export const FolderCover: React.FC<{ open: number }> = ({ open }) => (
  // Hinged along the top edge: lifts and flips up out of the way.
  <g transform={`translate(0 ${-PAPER.h / 2 - 22}) scale(1 ${1 - open * 2}) translate(0 ${PAPER.h / 2 + 22})`} opacity={open > 0.5 ? Math.max(0, 1 - (open - 0.5) * 2.2) : 1}>
    <rect x={-PAPER.w / 2 - 20} y={-PAPER.h / 2 - 22} width={PAPER.w + 40} height={PAPER.h + 44} rx={8} fill={open > 0.5 ? '#2A4570' : PALETTE.navy} />
    {open <= 0.5 && <rect x={-PAPER.w / 2 - 20} y={-PAPER.h / 2 - 22} width={PAPER.w + 40} height={30} rx={8} fill="#132541" />}
  </g>
);
