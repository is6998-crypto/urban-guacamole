// A generic phone (no brand). Drawn in its own units: 300 × 620, centred on (0, 0).
// Status bars carry no clock: only the times listed in the brief are ever shown.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FONT } from '../fonts';

export const PHONE_W = 300;
export const PHONE_H = 620;

export type Screen =
  | { kind: 'lock'; time: string }
  | { kind: 'alarm'; time: string; swipe?: number }
  | { kind: 'mail'; sender: string; subject: string; body: string }
  | { kind: 'messages'; contact: string; bubble: string; bubbleIn?: number }
  | { kind: 'off' }
  | { kind: 'back' };

const StatusBar: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const c = dark ? '#1c1c24' : '#ffffff';
  return (
    <g fill={c} opacity={0.85}>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={196 + i * 7 - 150} y={-286 + (3 - i) * 3} width={4.5} height={6 + i * 3} rx={1} />
      ))}
      <rect x={82} y={-285} width={26} height={13} rx={3} fill="none" stroke={c} strokeWidth={1.6} />
      <rect x={85} y={-282} width={17} height={7} rx={1.5} />
      <rect x={109} y={-281} width={2.5} height={5} rx={1} />
    </g>
  );
};

const Html: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, children, style }) => (
  <foreignObject x={x} y={y} width={w} height={h}>
    <div style={{ fontFamily: FONT, width: w, height: h, overflow: 'hidden', ...style }}>{children}</div>
  </foreignObject>
);

export const PhoneScreen: React.FC<{ screen: Screen }> = ({ screen }) => {
  const frame = useCurrentFrame();
  const sx = -PHONE_W / 2 + 12;
  const sy = -PHONE_H / 2 + 12;
  const sw = PHONE_W - 24;
  const sh = PHONE_H - 24;
  switch (screen.kind) {
    case 'off':
      return <rect x={sx} y={sy} width={sw} height={sh} rx={34} fill="#0d0e14" />;
    case 'back':
      return null;
    case 'lock':
      return (
        <g>
          <defs>
            <linearGradient id="ph-lock" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0" stopColor="#3D5A80" />
              <stop offset="1" stopColor="#22223B" />
            </linearGradient>
          </defs>
          <rect x={sx} y={sy} width={sw} height={sh} rx={34} fill="url(#ph-lock)" />
          <circle cx={60} cy={120} r={120} fill="#8DA9C4" opacity={0.18} />
          <StatusBar />
          <path d="M -8 -240 L -8 -246 A 8 8 0 0 1 8 -246 L 8 -240" fill="none" stroke="#fff" strokeWidth={2} opacity={0.8} />
          <rect x={-11} y={-241} width={22} height={16} rx={3} fill="#fff" opacity={0.8} />
          <text x={0} y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={92} fill="#fff" letterSpacing={-2}>
            {screen.time}
          </text>
          <rect x={-60} y={272} width={120} height={5} rx={2.5} fill="#fff" opacity={0.7} />
        </g>
      );
    case 'alarm': {
      const pulse = 0.5 + 0.5 * Math.sin(frame * 0.9);
      const knob = -96 + (screen.swipe ?? 0) * 192;
      return (
        <g>
          <defs>
            <linearGradient id="ph-alarm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFD58A" />
              <stop offset="1" stopColor="#E9A23B" />
            </linearGradient>
          </defs>
          <rect x={sx} y={sy} width={sw} height={sh} rx={34} fill="url(#ph-alarm)" />
          <StatusBar dark />
          <g transform={`translate(0 -200) scale(${1 + pulse * 0.08}) rotate(${Math.sin(frame * 1.7) * 9})`} fill="#22223B">
            <path d="M -22 14 C -22 -10 -16 -24 0 -24 C 16 -24 22 -10 22 14 L 28 22 L -28 22 Z" />
            <circle cx={0} cy={28} r={6} />
            <rect x={-3} y={-31} width={6} height={8} rx={3} />
          </g>
          <text x={0} y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={92} fill="#22223B" letterSpacing={-2}>
            {screen.time}
          </text>
          <rect x={-120} y={200} width={240} height={56} rx={28} fill="#22223B" opacity={0.18} />
          <circle cx={knob} cy={228} r={22} fill="#22223B" />
          <path d={`M ${knob - 6} 220 L ${knob + 4} 228 L ${knob - 6} 236`} fill="none" stroke="#FFD58A" strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    }
    case 'mail':
      return (
        <g>
          <rect x={sx} y={sy} width={sw} height={sh} rx={34} fill="#FBFBFD" />
          <rect x={sx} y={sy} width={sw} height={96} rx={34} fill="#EEF2F7" />
          <rect x={sx} y={sy + 60} width={sw} height={36} fill="#EEF2F7" />
          <StatusBar dark />
          <path d="M -112 -236 L -124 -224 L -112 -212" fill="none" stroke="#3D5A80" strokeWidth={3.5} strokeLinecap="round" />
          <g transform="translate(108 -224)" fill="none" stroke="#3D5A80" strokeWidth={2.6}>
            <rect x={-14} y={-10} width={28} height={20} rx={3} />
            <path d="M -14 -9 L 0 2 L 14 -9" />
          </g>
          <circle cx={-100} cy={-158} r={22} fill="#3D5A80" />
          <g transform="translate(-100 -158)" fill="#fff">
            <path d="M -11 -2 L 0 -10 L 11 -2 Z" />
            <rect x={-9} y={0} width={3} height={8} />
            <rect x={-1.5} y={0} width={3} height={8} />
            <rect x={6} y={0} width={3} height={8} />
            <rect x={-12} y={8} width={24} height={3} />
          </g>
          <Html x={-70} y={-176} w={196} h={40}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1c1c28', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{screen.sender}</div>
          </Html>
          <rect x={-126} y={-118} width={252} height={1.5} fill="#E2E6EC" />
          <Html x={-126} y={-104} w={252} h={90}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1c1c28', lineHeight: 1.2 }}>{screen.subject}</div>
          </Html>
          <Html x={-126} y={-12} w={252} h={240}>
            <div style={{ fontSize: 19, fontWeight: 400, color: '#3a3a48', lineHeight: 1.45 }}>{screen.body}</div>
          </Html>
          <rect x={-60} y={272} width={120} height={5} rx={2.5} fill="#1c1c28" opacity={0.5} />
        </g>
      );
    case 'messages': {
      const inP = screen.bubbleIn ?? 1;
      return (
        <g>
          <rect x={sx} y={sy} width={sw} height={sh} rx={34} fill="#F3F5F8" />
          <rect x={sx} y={sy} width={sw} height={110} rx={34} fill="#FFFFFF" />
          <rect x={sx} y={sy + 70} width={sw} height={40} fill="#FFFFFF" />
          <rect x={sx} y={sy + 109} width={sw} height={1.5} fill="#E2E6EC" />
          <StatusBar dark />
          <path d="M -112 -236 L -124 -224 L -112 -212" fill="none" stroke="#3D5A80" strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={-72} cy={-224} r={19} fill="#E9A23B" />
          <text x={-72} y={-217} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={19} fill="#fff">
            {screen.contact.slice(0, 1)}
          </text>
          <text x={-44} y={-217} fontFamily={FONT} fontWeight={700} fontSize={21} fill="#1c1c28">
            {screen.contact}
          </text>
          <g opacity={inP} transform={`translate(0 ${(1 - inP) * 16})`}>
            <Html x={-126} y={-120} w={230} h={200}>
              <div style={{ display: 'inline-block', background: '#FFFFFF', color: '#1c1c28', fontSize: 21, lineHeight: 1.35, padding: '14px 16px', borderRadius: '20px 20px 20px 6px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
                {screen.bubble}
              </div>
            </Html>
          </g>
          <rect x={-126} y={226} width={252} height={34} rx={17} fill="#FFFFFF" stroke="#E2E6EC" />
          <rect x={-60} y={272} width={120} height={5} rx={2.5} fill="#1c1c28" opacity={0.5} />
        </g>
      );
    }
  }
};

/** The phone body. `vibrate` adds three short arcs on each side and a 2 px shake (silent). */
export const Phone: React.FC<{ screen: Screen; vibrate?: boolean; x?: number; y?: number; scale?: number; rotate?: number; color?: string }> = ({
  screen,
  vibrate,
  x = 0,
  y = 0,
  scale = 1,
  rotate = 0,
  color = '#1b1c24',
}) => {
  const frame = useCurrentFrame();
  const shake = vibrate ? (frame % 2 === 0 ? 2 : -2) / scale : 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {vibrate &&
        [-1, 1].map((side) => (
          <g key={side} fill="none" stroke="#22223B" strokeWidth={6} strokeLinecap="round" opacity={0.8}>
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M ${side * (PHONE_W / 2 + 24 + i * 22)} ${-40 - i * 14} Q ${side * (PHONE_W / 2 + 34 + i * 26)} 0 ${side * (PHONE_W / 2 + 24 + i * 22)} ${40 + i * 14}`} />
            ))}
          </g>
        ))}
      <g transform={`translate(${shake} 0)`}>
        <rect x={-PHONE_W / 2} y={-PHONE_H / 2} width={PHONE_W} height={PHONE_H} rx={46} fill={color} />
        {screen.kind === 'back' ? (
          <g>
            <rect x={-PHONE_W / 2 + 4} y={-PHONE_H / 2 + 4} width={PHONE_W - 8} height={PHONE_H - 8} rx={42} fill="#2a2c38" />
            <rect x={-PHONE_W / 2 + 26} y={-PHONE_H / 2 + 26} width={78} height={110} rx={22} fill="#1b1c24" />
            <circle cx={-PHONE_W / 2 + 65} cy={-PHONE_H / 2 + 60} r={18} fill="#0e0f14" />
            <circle cx={-PHONE_W / 2 + 65} cy={-PHONE_H / 2 + 104} r={18} fill="#0e0f14" />
          </g>
        ) : (
          <PhoneScreen screen={screen} />
        )}
        {screen.kind !== 'back' && <rect x={-36} y={-PHONE_H / 2 + 22} width={72} height={18} rx={9} fill="#0b0b10" />}
      </g>
    </g>
  );
};
