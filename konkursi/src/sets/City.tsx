// Street (tracking from behind) and the bus interior (Scene 7). Pane pixel coordinates.
import React from 'react';
import { PALETTE } from '../config';
import { lerp } from '../lib/anim';

const mixHex = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, t));
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
};

/**
 * One-point perspective street. `travel` is how far the camera has moved (world metres);
 * lamp posts and trees come toward the camera and slide outward.
 */
export const StreetPerspective: React.FC<{ travel: number; w?: number; h?: number }> = ({ travel, w = 960, h = 1080 }) => {
  const vx = w / 2;
  const vy = h * 0.42;
  const items: React.ReactNode[] = [];
  // depth z: 1 (far) .. 0 (at camera). Objects repeat every 12 m.
  for (let k = 0; k < 7; k++) {
    for (const side of [-1, 1]) {
      const raw = (k * 12 + (side > 0 ? 6 : 0) - travel) % 84;
      const d = (raw + 84) % 84; // distance ahead, 0..84 m
      if (d < 2) continue;
      const sc = 12 / d; // perspective scale
      const x = vx + side * 330 * sc;
      const yBase = vy + 300 * sc;
      const op = Math.min(1, (84 - d) / 20);
      if (k % 2 === 0) {
        items.push(
          <g key={`${(84 - d).toFixed(2)}|${k}${side}`} opacity={op}>
            <rect x={x - 4 * sc} y={yBase - 300 * sc} width={8 * sc} height={300 * sc} fill="#3D4A5C" />
            <rect x={x - 22 * sc * side - 4 * sc} y={yBase - 300 * sc} width={26 * sc} height={8 * sc} fill="#3D4A5C" />
            <ellipse cx={x - 26 * sc * side} cy={yBase - 290 * sc} rx={10 * sc} ry={5 * sc} fill="#F4F1EA" />
          </g>,
        );
      } else {
        items.push(
          <g key={`${(84 - d).toFixed(2)}|${k}${side}`} opacity={op}>
            <rect x={x - 5 * sc} y={yBase - 180 * sc} width={10 * sc} height={180 * sc} fill="#6B5240" />
            <ellipse cx={x} cy={yBase - 240 * sc} rx={70 * sc} ry={85 * sc} fill="#6E9E7A" />
          </g>,
        );
      }
    }
  }
  // nearer objects (larger) are drawn last
  items.sort((a, b) => Number((a as React.ReactElement).key?.toString().split('|')[0]) - Number((b as React.ReactElement).key?.toString().split('|')[0]));
  return (
    <g>
      <rect x={0} y={0} width={w} height={vy} fill="#CFE0EE" />
      {/* facades */}
      <path d={`M 0 0 L ${vx - 90} ${vy - 150} L ${vx - 90} ${vy + 10} L 0 ${h * 0.86} Z`} fill="#D6CFC2" />
      <path d={`M ${w} 0 L ${vx + 90} ${vy - 150} L ${vx + 90} ${vy + 10} L ${w} ${h * 0.86} Z`} fill="#C8D2DB" />
      {Array.from({ length: 8 }, (_, i) => {
        const t = ((i * 0.13 + travel * 0.011) % 1 + 1) % 1;
        const e = Math.pow(t, 2.2);
        const xl = lerp(vx - 90, -40, e);
        const xr = lerp(vx + 90, w + 40, e);
        const top = lerp(vy - 130, -40, e);
        const hh = lerp(60, 600, e);
        return (
          <g key={i} opacity={Math.min(1, t * 4)}>
            <rect x={xl - lerp(6, 90, e)} y={top} width={lerp(6, 90, e)} height={hh} fill="#9DB0C2" opacity={0.7} />
            <rect x={xr} y={top} width={lerp(6, 90, e)} height={hh} fill="#9DB0C2" opacity={0.7} />
          </g>
        );
      })}
      {/* road and pavements */}
      <path d={`M ${vx - 90} ${vy + 10} L ${vx + 90} ${vy + 10} L ${w} ${h * 0.86} L ${w} ${h} L 0 ${h} L 0 ${h * 0.86} Z`} fill="#C5C8CC" />
      <path d={`M ${vx - 40} ${vy + 10} L ${vx + 40} ${vy + 10} L ${w * 0.78} ${h} L ${w * 0.22} ${h} Z`} fill="#8E949B" />
      {Array.from({ length: 6 }, (_, i) => {
        const t = ((i / 6 + travel * 0.02) % 1 + 1) % 1;
        const e = Math.pow(t, 2);
        const y = lerp(vy + 14, h, e);
        return <rect key={i} x={vx - lerp(1, 8, e)} y={y} width={lerp(2, 16, e)} height={lerp(4, 60, e)} fill="#F4F1EA" opacity={0.8} />;
      })}
      {items}
    </g>
  );
};

/** Bus interior with the city sliding past; `dusk` 0..1 turns the light to evening. */
export const BusInterior: React.FC<{ slide: number; dusk: number; pillarX?: number }> = ({ slide, dusk, pillarX = 720 }) => {
  const sky = mixHex('#CFE0EE', PALETTE.dusk, dusk);
  const sky2 = mixHex('#F2E6CF', '#7A6A8E', dusk);
  const bld = mixHex('#9DB0C2', '#1F2740', dusk);
  return (
    <g>
      <defs>
        <linearGradient id="bus-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky} />
          <stop offset="1" stopColor={sky2} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={960} height={1080} fill={mixHex('#B9C3CC', '#3A4560', dusk)} />
      {/* window */}
      <rect x={-20} y={150} width={1000} height={520} fill="url(#bus-sky)" />
      {Array.from({ length: 10 }, (_, i) => {
        const x = ((i * 190 - slide) % 1900 + 1900) % 1900 - 300;
        const hh = 180 + ((i * 73) % 5) * 60;
        return (
          <g key={i}>
            <rect x={x} y={670 - hh} width={150} height={hh} fill={bld} />
            {Array.from({ length: 3 }, (_, r) => (
              <rect key={r} x={x + 24 + (r % 2) * 56} y={670 - hh + 30 + r * 50} width={30} height={22} fill={dusk > 0.5 ? PALETTE.lamp : '#E6EEF4'} opacity={dusk > 0.5 ? (dusk - 0.5) * 2 : 0.6} />
            ))}
          </g>
        );
      })}
      {Array.from({ length: 6 }, (_, i) => {
        const x = ((i * 330 - slide * 1.8) % 1980 + 1980) % 1980 - 300;
        return <ellipse key={i} cx={x} cy={600} rx={70} ry={90} fill={mixHex('#6E9E7A', '#2A3A40', dusk)} />;
      })}
      <rect x={-20} y={150} width={1000} height={520} fill="#FFFFFF" opacity={0.06} />
      {/* window frame and pillars */}
      <rect x={-20} y={130} width={1000} height={26} fill="#5E6A77" />
      <rect x={-20} y={664} width={1000} height={30} fill="#5E6A77" />
      <rect x={pillarX} y={130} width={34} height={564} fill="#5E6A77" />
      <rect x={0} y={694} width={960} height={400} fill={mixHex('#8A96A3', '#2B3348', dusk)} />
      {/* yellow grab pole */}
      <rect x={846} y={0} width={18} height={1080} fill="#E0B23E" />
      <rect x={846} y={0} width={6} height={1080} fill="#F2CF6E" />
    </g>
  );
};

export const BusSeat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-80} y={-280} width={160} height={180} rx={20} fill="#3D5A80" />
    <rect x={-80} y={-280} width={160} height={40} rx={18} fill="#2E4566" />
    <rect x={-90} y={-130} width={180} height={34} rx={10} fill="#2E4566" />
  </g>
);
