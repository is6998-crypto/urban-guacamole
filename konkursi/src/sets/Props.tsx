// Small props, drawn in world units. Flat shapes, one shadow tone each.
import React from 'react';
import { PALETTE } from '../config';

export const Folder: React.FC<{ x?: number; y?: number; w?: number; h?: number; rotate?: number; open?: number }> = ({ x = 0, y = 0, w = 70, h = 92, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={3} fill={PALETTE.navy} />
    <rect x={-w / 2} y={-h / 2} width={w * 0.12} height={h} rx={2} fill="#132541" />
    <rect x={-w / 2 + w * 0.3} y={-h / 2 + h * 0.18} width={w * 0.45} height={h * 0.12} rx={1.5} fill="#F4F1EA" opacity={0.85} />
  </g>
);

/** Folder seen edge-on, for carrying under an arm. */
export const FolderEdge: React.FC<{ x?: number; y?: number; len?: number; rotate?: number }> = ({ x = 0, y = 0, len = 92, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <rect x={-6} y={-len / 2} width={12} height={len} rx={2} fill={PALETTE.navy} />
    <rect x={-2} y={-len / 2 + 2} width={4} height={len - 4} fill="#F4F1EA" opacity={0.9} />
  </g>
);

export const Mug: React.FC<{ x: number; y: number; color: string; shade: string; s?: number; steam?: number }> = ({ x, y, color, shade, s = 1, steam = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {steam > 0 && (
      <g fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.45}>
        <path d={`M -10 -70 C ${-18 + steam * 4} -88 ${-2 - steam * 4} -98 -10 -116`} />
        <path d={`M 10 -72 C ${2 - steam * 4} -92 ${18 + steam * 4} -100 10 -122`} />
      </g>
    )}
    <path d="M 30 -50 C 52 -50 52 -18 30 -18" fill="none" stroke={shade} strokeWidth={9} />
    <rect x={-32} y={-62} width={64} height={62} rx={8} fill={color} />
    <rect x={8} y={-62} width={24} height={62} rx={8} fill={shade} opacity={0.6} />
    <ellipse cx={0} cy={-62} rx={32} ry={7} fill={shade} />
    <ellipse cx={0} cy={-61} rx={26} ry={5} fill="#5B3A22" />
  </g>
);

export const CoffeeCup: React.FC<{ x: number; y: number; s?: number; level?: number }> = ({ x, y, s = 1, level = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={34} ry={8} fill="#E6DED0" />
    <ellipse cx={0} cy={0} rx={34} ry={8} fill="#FBF8F2" />
    <path d="M 18 -26 C 34 -26 34 -8 18 -8" fill="none" stroke="#EDE7DC" strokeWidth={6} />
    <path d="M -22 -34 L 22 -34 L 17 -2 L -17 -2 Z" fill="#FBF8F2" />
    <path d="M 6 -34 L 22 -34 L 17 -2 L 8 -2 Z" fill="#E2DACB" />
    <ellipse cx={0} cy={-34} rx={22} ry={5} fill="#EDE7DC" />
    <ellipse cx={0} cy={-34 + (1 - level) * 8} rx={19 - (1 - level) * 3} ry={3.6} fill="#5B3A22" />
  </g>
);

export const Glass: React.FC<{ x: number; y: number; s?: number; level?: number; tint?: string }> = ({ x, y, s = 1, level = 0.6, tint = '#E9A23B' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -16 -70 L 16 -70 L 13 0 L -13 0 Z" fill="#FFFFFF" opacity={0.28} />
    <path d={`M ${-16 + 3 * (1 - level)} ${-70 + 70 * (1 - level)} L ${16 - 3 * (1 - level)} ${-70 + 70 * (1 - level)} L 13 0 L -13 0 Z`} fill={tint} opacity={0.85} />
    <path d="M -12 -66 L -9 -4" stroke="#FFFFFF" strokeWidth={3} opacity={0.5} />
    <ellipse cx={0} cy={-70} rx={16} ry={3} fill="none" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.6} />
  </g>
);

export const Bottle: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -12 0 L -12 -52 C -12 -60 -6 -64 -5 -70 L -5 -78 L 5 -78 L 5 -70 C 6 -64 12 -60 12 -52 L 12 0 Z" fill="#CFE3F2" opacity={0.85} />
    <rect x={-6} y={-86} width={12} height={9} rx={2} fill="#3D5A80" />
    <rect x={-12} y={-40} width={24} height={16} fill="#8DA9C4" />
    <rect x={2} y={-58} width={6} height={56} fill="#FFFFFF" opacity={0.35} />
  </g>
);

export const NamePlate: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -46 0 L 46 0 L 40 -26 L -40 -26 Z" fill="#F4F1EA" />
    <path d="M -46 0 L 46 0 L 46 3 L -46 3 Z" fill="#B8C4D0" />
    <rect x={-26} y={-16} width={52} height={4} rx={2} fill={PALETTE.instDark} opacity={0.7} />
  </g>
);

export const Sheet: React.FC<{ x: number; y: number; w?: number; h?: number; rotate?: number; lines?: number }> = ({ x, y, w = 60, h = 80, rotate = 0, lines = 6 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#FFFFFF" />
    {Array.from({ length: lines }, (_, i) => (
      <rect key={i} x={-w / 2 + 8} y={-h / 2 + 12 + i * ((h - 24) / lines)} width={(w - 16) * (i % 3 === 2 ? 0.6 : 1)} height={2.4} fill="#B9C3CE" />
    ))}
  </g>
);

export const Pen: React.FC<{ x?: number; y?: number; rotate?: number; len?: number }> = ({ x = 0, y = 0, rotate = 0, len = 60 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <rect x={-3} y={-len / 2} width={6} height={len} rx={3} fill="#22223B" />
    <rect x={-3} y={-len / 2} width={6} height={len * 0.18} rx={2} fill="#8DA9C4" />
    <path d={`M -3 ${len / 2 - 2} L 3 ${len / 2 - 2} L 0 ${len / 2 + 7} Z`} fill="#D9D9D9" />
  </g>
);

export const Clipboard: React.FC<{ x?: number; y?: number; rotate?: number; s?: number }> = ({ x = 0, y = 0, rotate = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
    <rect x={-30} y={-40} width={60} height={80} rx={4} fill="#A47B57" />
    <rect x={-25} y={-32} width={50} height={68} fill="#FFFFFF" />
    <rect x={-12} y={-45} width={24} height={10} rx={3} fill="#9AA3AD" />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={-19} y={-22 + i * 11} width={i === 2 ? 26 : 38} height={3} fill="#B9C3CE" />
    ))}
  </g>
);

export const Diploma: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 160, h = 118 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 + 6} y={-h / 2 + 8} width={w} height={h} fill="#000" opacity={0.12} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#4A3424" />
    <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h - 16} fill="#F7F1E3" />
    <rect x={-w / 2 + 16} y={-h / 2 + 16} width={w - 32} height={h - 32} fill="none" stroke="#C9A45C" strokeWidth={2} />
    <rect x={-w * 0.28} y={-h * 0.26} width={w * 0.56} height={6} rx={3} fill="#3D5A80" opacity={0.75} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={-w * 0.32} y={-h * 0.08 + i * 12} width={w * 0.64 * (i === 2 ? 0.7 : 1)} height={3} rx={1.5} fill="#9C9483" />
    ))}
    <circle cx={w * 0.26} cy={h * 0.26} r={11} fill="#C0392B" opacity={0.85} />
    <path d={`M ${w * 0.22} ${h * 0.3} L ${w * 0.2} ${h * 0.42} L ${w * 0.25} ${h * 0.36} L ${w * 0.29} ${h * 0.42} L ${w * 0.28} ${h * 0.3} Z`} fill="#C0392B" opacity={0.85} />
  </g>
);

export const DeskLamp: React.FC<{ x: number; y: number; on?: number }> = ({ x, y, on = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    {on > 0 && <path d="M 30 -150 L -110 0 L 150 0 Z" fill={PALETTE.lamp} opacity={0.22 * on} />}
    <ellipse cx={0} cy={0} rx={32} ry={7} fill="#2B2D42" />
    <path d="M -3 -4 L 6 -96 L 12 -96 L 3 -4 Z" fill="#2B2D42" />
    <path d="M 6 -96 L 52 -150 L 58 -144 L 12 -90 Z" fill="#2B2D42" />
    <path d="M 30 -170 L 80 -140 L 60 -112 L 14 -140 Z" fill="#3D5A80" />
    {on > 0 && <ellipse cx={36} cy={-126} rx={20} ry={8} fill={PALETTE.lamp} opacity={on} transform="rotate(32 36 -126)" />}
  </g>
);

export const Plant: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-40, -20, 0, 18, 36, -55, 50].map((a, i) => (
      <ellipse key={i} cx={0} cy={-150} rx={14} ry={70} fill={i % 2 ? '#4E8A5E' : '#3F7350'} transform={`rotate(${a} 0 -60) translate(0 ${-10 - (i % 3) * 14})`} />
    ))}
    <path d="M -42 -70 L 42 -70 L 32 0 L -32 0 Z" fill="#E7E2D8" />
    <path d="M 10 -70 L 42 -70 L 32 0 L 6 0 Z" fill="#CFC8BB" />
  </g>
);

/** A grey waiting-room chair, front view. */
export const GreyChair: React.FC<{ x: number; y?: number }> = ({ x, y = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-46} y={-250} width={92} height={120} rx={14} fill="#9AA5B1" />
    <rect x={-50} y={-136} width={100} height={22} rx={8} fill="#8693A0" />
    <rect x={-40} y={-114} width={6} height={114} fill="#5E6A77" />
    <rect x={34} y={-114} width={6} height={114} fill="#5E6A77" />
  </g>
);
