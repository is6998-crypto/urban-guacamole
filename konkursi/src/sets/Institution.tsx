// The institution: lobby, interview room, office corridor and the front of the building.
// Cool, even light. World units, floor at y = 0.
import React from 'react';
import { INSTITUTION_NAME, PALETTE } from '../config';
import { WallClock } from '../devices/Clock';
import { FONT } from '../fonts';
import { TXT } from '../text';
import { Bottle, GreyChair, NamePlate, Plant, Sheet } from './Props';

const P = PALETTE;

/** x positions in the lobby. */
export const LOBBY = {
  glass: { x0: -780, x1: -560 },
  desk: { x0: -470, x1: -150, top: -230 },
  plant: -90,
  chairs: [60, 170, 280, 390],
  clock: { x: 225, y: -500, r: 60 },
  meeting: { x0: 520, x1: 720 },
};

const InstWall: React.FC<{ x0?: number; x1?: number }> = ({ x0 = -1600, x1 = 1600 }) => (
  <g>
    <rect x={x0} y={-1200} width={x1 - x0} height={1200} fill={P.wall} />
    <rect x={x0} y={-1200} width={x1 - x0} height={300} fill="#E8EEF4" />
    {Array.from({ length: 16 }, (_, i) => (
      <rect key={i} x={x0 + i * 200} y={-900} width={3} height={680} fill="#CCD8E3" />
    ))}
    <rect x={x0} y={-220} width={x1 - x0} height={220} fill="#C9D6E2" />
    <rect x={x0} y={-226} width={x1 - x0} height={8} fill="#B4C4D4" />
    <rect x={x0} y={0} width={x1 - x0} height={900} fill="#B6C5D4" />
    {Array.from({ length: 10 }, (_, i) => (
      <rect key={`f${i}`} x={x0} y={30 + i * 70} width={x1 - x0} height={2} fill="#A5B6C8" />
    ))}
    {Array.from({ length: 6 }, (_, i) => (
      <rect key={`l${i}`} x={x0 + 150 + i * 540} y={-1040} width={300} height={16} rx={8} fill="#FFFFFF" opacity={0.9} />
    ))}
  </g>
);

export const GlassDoor: React.FC<{ open?: number; x0?: number; x1?: number; outside?: string }> = ({ open = 0, x0 = LOBBY.glass.x0, x1 = LOBBY.glass.x1, outside = '#CFE3F2' }) => {
  const w = x1 - x0;
  const h = 640;
  return (
    <g>
      <rect x={x0 - 14} y={-h - 14} width={w + 28} height={h + 14} fill={P.instDark} />
      <rect x={x0} y={-h} width={w} height={h} fill={outside} />
      {/* outside: trees and the street in daylight */}
      <ellipse cx={x0 + w * 0.3} cy={-h * 0.45} rx={70} ry={90} fill="#8FB89A" opacity={0.8} />
      <ellipse cx={x0 + w * 0.78} cy={-h * 0.5} rx={60} ry={80} fill="#7FAA8B" opacity={0.8} />
      <rect x={x0} y={-120} width={w} height={120} fill="#D9DEE3" />
      {/* two sliding leaves */}
      {[0, 1].map((k) => {
        const lx = x0 + k * (w / 2) + (k === 0 ? -open * w * 0.45 : open * w * 0.45);
        return (
          <g key={k}>
            <rect x={lx} y={-h} width={w / 2} height={h} fill="#FFFFFF" opacity={0.18} />
            <rect x={lx} y={-h} width={w / 2} height={h} fill="none" stroke={P.instDark} strokeWidth={8} />
            <path d={`M ${lx + 20} ${-h + 40} L ${lx + 60} ${-h + 40} L ${lx + 20} ${-h + 160} Z`} fill="#FFFFFF" opacity={0.25} />
            <rect x={lx + (k === 0 ? w / 2 - 22 : 14)} y={-380} width={8} height={120} rx={4} fill="#9AA5B1" />
          </g>
        );
      })}
    </g>
  );
};

export const Lobby: React.FC<{ time: string; meetingDoor?: number; glassOpen?: number }> = ({ time, meetingDoor = 0, glassOpen = 0 }) => {
  const d = LOBBY.desk;
  const m = LOBBY.meeting;
  return (
    <g>
      <InstWall />
      <GlassDoor open={glassOpen} />
      {/* reception sign */}
      <rect x={d.x0 + 10} y={-620} width={d.x1 - d.x0 - 20} height={76} rx={6} fill={P.instDark} />
      <text x={(d.x0 + d.x1) / 2} y={-571} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={27} fill="#F4F1EA">
        {INSTITUTION_NAME}
      </text>
      <Plant x={LOBBY.plant} y={0} s={1.1} />
      {LOBBY.chairs.map((x) => (
        <GreyChair key={x} x={x} />
      ))}
      <WallClock time={time} x={LOBBY.clock.x} y={LOBBY.clock.y} r={LOBBY.clock.r} />
      {/* door to the meeting room with its sign */}
      <rect x={m.x0 - 14} y={-640} width={m.x1 - m.x0 + 28} height={640} fill={P.instDark} />
      <rect x={m.x0} y={-626} width={m.x1 - m.x0} height={626} fill="#2E4566" />
      <rect x={m.x0} y={-626} width={(m.x1 - m.x0) * (1 - meetingDoor * 0.8)} height={626} fill={P.instMid} />
      <rect x={m.x0 + 16} y={-320} width={10} height={70} rx={5} fill="#E9EEF3" opacity={1 - meetingDoor} />
      <rect x={m.x0 - 30} y={-736} width={m.x1 - m.x0 + 60} height={66} rx={6} fill="#F4F1EA" />
      <text x={(m.x0 + m.x1) / 2} y={-693} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={28} fill={P.instDark}>
        {TXT.sallaTakimeve}
      </text>
    </g>
  );
};

/** Reception desk, drawn in front of the secretary. */
export const ReceptionDesk: React.FC = () => {
  const d = LOBBY.desk;
  return (
    <g>
      <rect x={d.x0} y={d.top} width={d.x1 - d.x0} height={-d.top} fill={P.instDark} />
      <rect x={d.x0 - 10} y={d.top - 14} width={d.x1 - d.x0 + 20} height={18} rx={4} fill="#F4F1EA" />
      <rect x={d.x0} y={d.top + 4} width={d.x1 - d.x0} height={20} fill="#2E4566" />
      <rect x={d.x0 + 30} y={d.top + 70} width={d.x1 - d.x0 - 60} height={4} fill={P.instMid} opacity={0.6} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------
// Interview room

export const ROOM = { seats: [-250, 0, 250], tableTop: -205, candidate: { x: 0, y: 270, s: 1.22 }, door: { x0: -860, x1: -660 } };

export const RoomBack: React.FC<{ door?: number }> = ({ door = 0 }) => (
  <g>
    <InstWall x0={-1600} x1={1600} />
    <rect x={-560} y={-820} width={420} height={460} fill="#F4F1EA" />
    <rect x={-546} y={-806} width={392} height={432} fill="#CFE3F2" />
    <ellipse cx={-430} cy={-520} rx={90} ry={110} fill="#9CC2A6" opacity={0.7} />
    <rect x={-546} y={-450} width={392} height={76} fill="#B8CFE0" />
    <rect x={-354} y={-806} width={8} height={432} fill="#F4F1EA" />
    <path d="M -546 -806 L -420 -806 L -546 -600 Z" fill="#FFFFFF" opacity={0.25} />
    {/* daylight from the window */}
    <path d="M -546 -374 L -154 -374 L 300 0 L -300 0 Z" fill="#FFFFFF" opacity={0.12} />
    {/* door candidates come in through */}
    <rect x={ROOM.door.x0 - 14} y={-640} width={ROOM.door.x1 - ROOM.door.x0 + 28} height={640} fill={P.instDark} />
    <rect x={ROOM.door.x0} y={-626} width={ROOM.door.x1 - ROOM.door.x0} height={626} fill="#2E4566" />
    <rect x={ROOM.door.x0} y={-626} width={(ROOM.door.x1 - ROOM.door.x0) * (1 - door * 0.8)} height={626} fill={P.instMid} />
    {/* commission chair backs */}
    {ROOM.seats.map((x) => (
      <g key={x}>
        <rect x={x - 52} y={-410} width={104} height={170} rx={16} fill="#2E3F5C" />
        <rect x={x - 6} y={-240} width={12} height={40} fill="#22223B" />
      </g>
    ))}
  </g>
);

/** The long table, drawn in front of the commission. */
export const RoomTable: React.FC<{ sheets?: boolean; plates?: boolean }> = ({ sheets = true, plates = true }) => (
  <g>
    <rect x={-470} y={ROOM.tableTop} width={940} height={-ROOM.tableTop} fill={P.instMid} />
    <rect x={-470} y={ROOM.tableTop} width={940} height={26} fill="#7B97B4" />
    <rect x={-486} y={ROOM.tableTop - 14} width={972} height={16} rx={4} fill="#F4F1EA" />
    {plates && ROOM.seats.map((x) => <NamePlate key={x} x={x} y={ROOM.tableTop - 12} />)}
    {sheets && ROOM.seats.map((x) => <Sheet key={`s${x}`} x={x + 70} y={ROOM.tableTop - 16} w={60} h={10} />)}
    <Bottle x={-130} y={ROOM.tableTop - 12} s={0.9} />
    <Bottle x={125} y={ROOM.tableTop - 12} s={0.9} />
  </g>
);

/** The chair the candidate sits on, seen from behind (foreground). */
export const CandidateChair: React.FC<{ x?: number; y?: number; s?: number }> = ({ x = ROOM.candidate.x, y = ROOM.candidate.y, s = ROOM.candidate.s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-50} y={-136} width={100} height={22} rx={8} fill="#3D5A80" />
    <rect x={-40} y={-114} width={6} height={114} fill="#22223B" />
    <rect x={34} y={-114} width={6} height={114} fill="#22223B" />
  </g>
);
export const CandidateChairBack: React.FC<{ x?: number; y?: number; s?: number }> = ({ x = ROOM.candidate.x, y = ROOM.candidate.y, s = ROOM.candidate.s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-48} y={-300} width={96} height={150} rx={14} fill="#2E3F5C" opacity={0.96} />
  </g>
);

// ---------------------------------------------------------------------------------------
// Office corridor (Scene 7)

export const Corridor: React.FC<{ time: string; doorOpen?: number }> = ({ time }) => (
  <g>
    <InstWall />
    <rect x={-240} y={-660} width={260} height={660} fill={P.instDark} />
    <rect x={-226} y={-646} width={232} height={646} fill="#9C7A5B" />
    <rect x={-206} y={-610} width={192} height={250} fill="#A9876A" />
    <rect x={-206} y={-330} width={192} height={300} fill="#A9876A" />
    <rect x={-30} y={-330} width={14} height={60} rx={6} fill="#D9D9D9" />
    <circle cx={-23} cy={-250} r={7} fill="#8A8F96" />
    <rect x={-170} y={-720} width={120} height={36} rx={4} fill="#F4F1EA" />
    <rect x={-150} y={-706} width={80} height={6} rx={3} fill={P.instDark} opacity={0.6} />
    <WallClock time={time} x={220} y={-640} r={46} />
    {/* coat stand */}
    <rect x={420} y={-560} width={10} height={560} fill="#5E4A38" />
    <ellipse cx={425} cy={-4} rx={60} ry={8} fill="#5E4A38" />
    {[-1, 1].map((sd) => <rect key={sd} x={425 + sd * 6 - 3} y={-560} width={6} height={40} transform={`rotate(${sd * 40} 425 -560)`} fill="#5E4A38" />)}
  </g>
);

export const CoatOnStand: React.FC = () => (
  <g>
    <path d="M 410 -540 C 380 -520 370 -420 375 -280 L 470 -280 C 478 -420 466 -520 440 -540 Z" fill="#4A4E57" />
    <path d="M 425 -540 L 440 -540 C 466 -520 478 -420 470 -280 L 440 -280 Z" fill="#383B42" />
  </g>
);

// ---------------------------------------------------------------------------------------
// Front of the building (Scene 7)

export const STEPS = { top: -150, base: 0, door: { x0: -170, x1: 170 } };

export const BuildingFront: React.FC<{ light: 'midday' | 'afternoon' }> = ({ light }) => {
  const sky = light === 'midday' ? ['#BFD9EE', '#E8F1F8'] : ['#F2C9A0', '#F7E3C8'];
  return (
    <g>
      <defs>
        <linearGradient id={`sky-${light}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect x={-2000} y={-2200} width={4000} height={2400} fill={`url(#sky-${light})`} />
      {light === 'afternoon' && <circle cx={-700} cy={-1100} r={110} fill="#FFE1B0" opacity={0.9} />}
      <rect x={-1100} y={-1500} width={2200} height={1350} fill={P.wall} />
      <rect x={-1100} y={-1500} width={2200} height={30} fill={P.instDark} />
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => (
          <rect key={`${r}-${c}`} x={-1040 + c * 236} y={-1420 + r * 280} width={180} height={200} fill={P.instMid} opacity={0.85} />
        )),
      )}
      <rect x={-260} y={-560} width={520} height={30} fill={P.instDark} />
      <rect x={STEPS.door.x0 - 20} y={-540} width={STEPS.door.x1 - STEPS.door.x0 + 40} height={390} fill={P.instDark} />
      <rect x={STEPS.door.x0} y={-530} width={STEPS.door.x1 - STEPS.door.x0} height={380} fill="#9DB8D0" />
      <rect x={-4} y={-530} width={8} height={380} fill={P.instDark} />
      {/* steps */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-420 - i * 60} y={-150 + i * 38} width={840 + i * 120} height={40} fill={i % 2 ? '#C9D1DA' : '#D5DCE3'} />
      ))}
      <rect x={-2000} y={0} width={4000} height={400} fill="#BFC6CD" />
      <rect x={-2000} y={0} width={4000} height={8} fill="#A9B1B9" />
      {/* trees */}
      {[-800, 820].map((x) => (
        <g key={x}>
          <rect x={x - 10} y={-320} width={20} height={320} fill="#6B5240" />
          <ellipse cx={x} cy={-420} rx={130} ry={150} fill="#6E9E7A" />
          <ellipse cx={x + 40} cy={-460} rx={80} ry={90} fill="#7FAF8A" />
        </g>
      ))}
      {light === 'afternoon' && <rect x={-2000} y={-2200} width={4000} height={2600} fill="#E9A23B" opacity={0.08} />}
    </g>
  );
};
