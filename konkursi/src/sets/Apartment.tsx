// The two apartments (identical layouts; only the mug and the bedspread differ).
// World units: floor at y = 0, one head = 64.
import React from 'react';
import { PALETTE } from '../config';
import { Diploma, DeskLamp, Folder, Mug } from './Props';

export type Who = 'suela' | 'era';
export const MUG = { suela: { c: '#3E7CC2', s: '#2C5E99' }, era: { c: '#F2C14E', s: '#D19E2C' } };
export const BEDSPREAD = { suela: { c: '#8E949D', s: '#737983' }, era: { c: '#D3BE98', s: '#B9A37C' } };

const WALL = '#EFE5D4';
const WALL_SHADE = '#E2D5BF';
const FLOOR = '#B98E66';

const Wall: React.FC<{ x0?: number; x1?: number; color?: string }> = ({ x0 = -1400, x1 = 1400, color = WALL }) => (
  <g>
    <rect x={x0} y={-1100} width={x1 - x0} height={1100} fill={color} />
    <rect x={x0} y={-30} width={x1 - x0} height={30} fill="#F7F1E6" />
    <rect x={x0} y={0} width={x1 - x0} height={900} fill={FLOOR} />
    {Array.from({ length: 12 }, (_, i) => (
      <rect key={i} x={x0} y={24 + i * 52} width={x1 - x0} height={2} fill="#A57B55" opacity={0.6} />
    ))}
  </g>
);

const MorningWindow: React.FC<{ x: number; y: number; w: number; h: number; evening?: boolean }> = ({ x, y, w, h, evening }) => (
  <g>
    <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} fill="#F8F4EC" />
    <defs>
      <linearGradient id={`win-${evening ? 'e' : 'm'}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={evening ? '#26304D' : '#CFE3F2'} />
        <stop offset="1" stopColor={evening ? '#4A5A86' : '#FCE9C0'} />
      </linearGradient>
    </defs>
    <rect x={x} y={y} width={w} height={h} fill={`url(#win-${evening ? 'e' : 'm'})`} />
    {!evening && <circle cx={x + w * 0.72} cy={y + h * 0.35} r={w * 0.11} fill="#FFF3D1" />}
    {evening && [0.2, 0.45, 0.7].map((k, i) => <rect key={i} x={x + w * k} y={y + h * (0.55 + (i % 2) * 0.1)} width={w * 0.12} height={h} fill="#1B2238" />)}
    {evening && [0.25, 0.5, 0.74].map((k, i) => <rect key={`l${i}`} x={x + w * k} y={y + h * 0.72} width={6} height={6} fill="#FFD58A" />)}
    <rect x={x + w / 2 - 5} y={y} width={10} height={h} fill="#F8F4EC" />
    <rect x={x} y={y + h / 2 - 5} width={w} height={10} fill="#F8F4EC" />
    <rect x={x - 30} y={y - 30} width={44} height={h + 70} rx={8} fill="#E8D9BE" />
    <rect x={x + w - 14} y={y - 30} width={44} height={h + 70} rx={8} fill="#E8D9BE" />
  </g>
);

// ---------------------------------------------------------------------------------------
// Bedroom (Scene 2, shot "bed")

export const BedroomBack: React.FC<{ who: Who }> = () => (
  <g>
    <Wall />
    <MorningWindow x={-380} y={-760} w={300} h={300} />
    {/* sunlight on the wall and bed */}
    <path d="M -380 -460 L -80 -460 L 260 -120 L -60 -120 Z" fill="#FFE2A0" opacity={0.28} />
    {/* bedside table */}
    <rect x={-700} y={-210} width={170} height={210} fill="#9C7350" />
    <rect x={-700} y={-210} width={170} height={16} fill="#B58A63" />
    <rect x={-680} y={-160} width={130} height={4} fill="#7E5B3E" />
    <rect x={-560} y={-210} width={30} height={210} fill="#7E5B3E" opacity={0.5} />
    {/* lamp */}
    <rect x={-640} y={-300} width={10} height={90} fill="#D9C7A6" />
    <path d="M -680 -300 L -590 -300 L -605 -370 L -665 -370 Z" fill="#F4E6C8" />
    {/* phone on the table */}
    <rect x={-606} y={-216} width={44} height={8} rx={3} fill="#1b1c24" />
    {/* headboard and bed */}
    <rect x={-520} y={-380} width={30} height={380} rx={6} fill="#8B6B4E" />
    <rect x={-500} y={-160} width={820} height={110} rx={10} fill="#F4F1EA" />
    <rect x={-500} y={-60} width={820} height={60} fill="#8B6B4E" />
    <ellipse cx={-400} cy={-182} rx={92} ry={30} fill="#FFFFFF" />
    <ellipse cx={-392} cy={-172} rx={84} ry={20} fill="#E8E3D8" opacity={0.6} />
  </g>
);

/** The bedspread drawn over the sitting/lying figure. */
export const Bedspread: React.FC<{ who: Who; fold?: number }> = ({ who, fold = 0 }) => {
  const b = BEDSPREAD[who];
  const top = -196 - fold * 6;
  return (
    <g>
      <path d={`M -290 ${top} C -200 ${top - 18} 0 ${top - 24} 180 ${top - 8} C 260 ${top} 320 -170 330 -150 L 330 -40 L -300 -40 C -306 -100 -300 -160 -290 ${top} Z`} fill={b.c} />
      <path d={`M -290 ${top} C -200 ${top - 18} 0 ${top - 24} 180 ${top - 8} C 120 ${top + 14} -150 ${top + 18} -292 ${top + 12} Z`} fill={b.s} opacity={0.7} />
      <path d="M 40 -170 C 80 -140 120 -120 200 -112" fill="none" stroke={b.s} strokeWidth={6} opacity={0.6} />
      <rect x={-300} y={-48} width={630} height={12} fill={b.s} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------
// Bathroom (we are the mirror)

export const BathroomBack: React.FC = () => (
  <g>
    <rect x={-1400} y={-1100} width={2800} height={1100} fill="#DCE7EA" />
    {Array.from({ length: 30 }, (_, i) => (
      <rect key={`v${i}`} x={-1400 + i * 96} y={-1100} width={3} height={1100} fill="#C8D6DA" />
    ))}
    {Array.from({ length: 12 }, (_, i) => (
      <rect key={`h${i}`} x={-1400} y={-1100 + i * 96} width={2800} height={3} fill="#C8D6DA" />
    ))}
    {/* door behind her, towel, shelf */}
    <rect x={160} y={-640} width={220} height={640} fill="#F4F1EA" />
    <rect x={176} y={-624} width={188} height={624} fill="#E8E1D4" />
    <circle cx={190} cy={-320} r={8} fill="#B9AE9B" />
    <rect x={-380} y={-560} width={120} height={14} rx={4} fill="#C9C1B3" />
    <rect x={-360} y={-546} width={8} height={30} fill="#C9C1B3" />
    <path d="M -370 -520 L -270 -520 L -278 -300 L -362 -300 Z" fill="#E9A23B" opacity={0.85} />
    <path d="M -320 -520 L -270 -520 L -278 -300 L -320 -300 Z" fill="#C9862C" opacity={0.6} />
    <rect x={-400} y={-700} width={180} height={10} rx={4} fill="#FFFFFF" />
    <rect x={-380} y={-736} width={22} height={36} rx={5} fill="#8DA9C4" />
    <rect x={-344} y={-728} width={18} height={28} rx={5} fill="#F2D7A6" />
    <path d="M -1400 -1100 L -700 -1100 L -200 -200 L -1400 -200 Z" fill="#FFF1CF" opacity={0.2} />
  </g>
);

export const Sink: React.FC = () => (
  <g>
    <rect x={-330} y={-286} width={660} height={300} fill="#F4F1EA" />
    <rect x={-330} y={-286} width={660} height={20} fill="#FFFFFF" />
    <rect x={-300} y={-250} width={600} height={260} fill="#E3DED3" />
    <rect x={-150} y={-200} width={6} height={60} rx={3} fill="#B9AE9B" opacity={0.6} />
    <rect x={144} y={-200} width={6} height={60} rx={3} fill="#B9AE9B" opacity={0.6} />
    <ellipse cx={0} cy={-286} rx={190} ry={18} fill="#D5DEE2" />
    <rect x={-12} y={-330} width={24} height={46} rx={6} fill="#C6CDD3" />
    <rect x={-46} y={-336} width={92} height={14} rx={7} fill="#D9DFE4" />
  </g>
);

/** Water drops thrown up from cupped hands. t: 0..1 through the splash. */
export const Splash: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  if (t <= 0 || t >= 1) return null;
  const drops = [
    [-30, -40], [-12, -60], [14, -55], [34, -38], [-44, -12], [46, -16], [0, -70], [-24, -26], [26, -24],
  ];
  return (
    <g transform={`translate(${x} ${y})`}>
      {drops.map(([dx, dy], i) => {
        const p = Math.min(1, t * 1.4);
        return <ellipse key={i} cx={dx * (0.4 + p)} cy={dy * (0.3 + p) + p * p * 50} rx={4} ry={6} fill="#BFE0F0" opacity={0.85 * (1 - t)} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------
// Wardrobe with a full-length mirror (we see her reflection)

export const MirrorRoom: React.FC<{ who: Who }> = ({ who }) => (
  <g>
    <rect x={-800} y={-1100} width={1600} height={1100} fill="#E8DECD" />
    <rect x={-800} y={0} width={1600} height={600} fill="#B48A63" />
    <rect x={-200} y={-720} width={240} height={240} fill="#F8F4EC" />
    <rect x={-188} y={-708} width={216} height={216} fill="#FCE9C0" />
    <rect x={-80} y={-708} width={8} height={216} fill="#F8F4EC" />
    <rect x={100} y={-200} width={500} height={110} rx={10} fill="#F4F1EA" />
    <rect x={100} y={-110} width={500} height={110} fill={BEDSPREAD[who].c} />
  </g>
);

export const WardrobeFrame: React.FC = () => (
  <g>
    <defs>
      <mask id="mirror-hole">
        <rect x={-2000} y={-2000} width={4000} height={4000} fill="#fff" />
        <rect x={-210} y={-700} width={420} height={820} rx={6} fill="#000" />
      </mask>
    </defs>
    <g mask="url(#mirror-hole)">
      <rect x={-2000} y={-2000} width={4000} height={4000} fill="#A67C55" />
      <rect x={-560} y={-2000} width={14} height={4000} fill="#8E6845" />
      <rect x={546} y={-2000} width={14} height={4000} fill="#8E6845" />
      <rect x={-520} y={-260} width={18} height={90} rx={9} fill="#D9C7A6" />
      <rect x={502} y={-260} width={18} height={90} rx={9} fill="#D9C7A6" />
      <rect x={-232} y={-722} width={464} height={864} rx={10} fill="#C9CED6" />
    </g>
    <rect x={-210} y={-700} width={420} height={820} fill="#FFFFFF" opacity={0.08} />
    <path d="M -160 -700 L -60 -700 L -210 -380 L -210 -560 Z" fill="#FFFFFF" opacity={0.18} />
  </g>
);

// ---------------------------------------------------------------------------------------
// Kitchen counter close-up (pane pixel coordinates, 960×1080)

export const KitchenCounter: React.FC<{ who: Who; steam: number }> = ({ who, steam }) => (
  <g>
    <rect x={0} y={0} width={960} height={1080} fill="#EFE3CE" />
    {Array.from({ length: 10 }, (_, i) => (
      <rect key={i} x={i * 110} y={0} width={4} height={640} fill="#E0D1B7" />
    ))}
    {Array.from({ length: 6 }, (_, i) => (
      <rect key={`h${i}`} x={0} y={i * 110} width={960} height={4} fill="#E0D1B7" />
    ))}
    <rect x={0} y={640} width={960} height={440} fill="#C9A27A" />
    <rect x={0} y={640} width={960} height={26} fill="#DDBA92" />
    <path d="M 0 0 L 420 0 L 120 640 L 0 640 Z" fill="#FFF0CC" opacity={0.25} />
    <Mug x={180} y={800} color={MUG[who].c} shade={MUG[who].s} s={2.2} steam={steam} />
  </g>
);

// ---------------------------------------------------------------------------------------
// Hallway: framed diploma above a small desk, front door (Scenes 2, 7, 8, 9)

export const HALL = { diploma: { x: -200, y: -560 }, desk: { x0: -330, x1: -70, top: -230 }, door: { x0: 140, x1: 340, top: -640 } };

export const HallwayBack: React.FC<{ evening?: boolean; folderOnDesk?: boolean; lamp?: number; folderOpen?: number }> = ({ evening, folderOnDesk = true, lamp = 0 }) => {
  const d = HALL.desk;
  return (
    <g>
      <Wall color={evening ? '#D9CCB6' : WALL} />
      <rect x={-1400} y={-1100} width={420} height={1100} fill={WALL_SHADE} opacity={0.6} />
      <MorningWindow x={-900} y={-760} w={240} h={300} evening={evening} />
      {/* coat hooks */}
      <rect x={470} y={-560} width={180} height={14} rx={4} fill="#8B6B4E" />
      {[500, 560, 620].map((x) => <rect key={x} x={x} y={-548} width={8} height={26} rx={4} fill="#5E4A38" />)}
      <path d="M 552 -522 C 530 -480 530 -380 545 -300 L 600 -300 C 610 -380 600 -480 578 -522 Z" fill={evening ? '#5E6A7A' : '#7B8A9A'} />
      {/* doorway */}
      <rect x={HALL.door.x0 - 16} y={HALL.door.top - 16} width={HALL.door.x1 - HALL.door.x0 + 32} height={-HALL.door.top + 16} fill="#F8F4EC" />
      <rect x={HALL.door.x0} y={HALL.door.top} width={HALL.door.x1 - HALL.door.x0} height={-HALL.door.top} fill={evening ? '#3A4462' : '#F6EBD3'} />
      <rect x={HALL.door.x0} y={-60} width={HALL.door.x1 - HALL.door.x0} height={60} fill={evening ? '#2E3650' : '#E6D6B8'} />
      {/* desk */}
      <rect x={d.x0} y={d.top} width={d.x1 - d.x0} height={18} fill="#9C7350" />
      <rect x={d.x0 + 10} y={d.top + 18} width={14} height={-d.top - 18} fill="#7E5B3E" />
      <rect x={d.x1 - 24} y={d.top + 18} width={14} height={-d.top - 18} fill="#7E5B3E" />
      <rect x={d.x0 + 24} y={d.top + 18} width={d.x1 - d.x0 - 48} height={46} fill="#8B6545" />
      <rect x={(d.x0 + d.x1) / 2 - 14} y={d.top + 38} width={28} height={6} rx={3} fill="#C9A27A" />
      <Diploma x={HALL.diploma.x} y={HALL.diploma.y} />
      {folderOnDesk && <Folder x={-250} y={d.top - 4} w={110} h={14} />}
      {lamp > 0 && <DeskLamp x={-300} y={d.top} on={lamp} />}
      {lamp > 0 && <rect x={-1400} y={-1100} width={2800} height={1100} fill={PALETTE.lamp} opacity={0} />}
    </g>
  );
};

/** The front door leaf, hinged on its right side. open: 0 closed .. 1 wide open. */
export const HallDoor: React.FC<{ open: number }> = ({ open }) => {
  const { x0, x1, top } = HALL.door;
  const w = (x1 - x0) * (1 - open * 0.82);
  return (
    <g>
      <rect x={x1 - w} y={top} width={w} height={-top} fill="#7D5A3C" />
      <rect x={x1 - w + w * 0.12} y={top + 40} width={w * 0.76} height={220} fill="#8E6A4A" />
      <rect x={x1 - w + w * 0.12} y={top + 300} width={w * 0.76} height={280} fill="#8E6A4A" />
      <circle cx={x1 - w + Math.max(10, w * 0.1)} cy={-300} r={8} fill="#D9C7A6" />
      {open > 0.05 && <rect x={x1 - w - 6} y={top} width={6} height={-top} fill="#000" opacity={0.15} />}
    </g>
  );
};
