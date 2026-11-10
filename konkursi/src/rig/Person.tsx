// The character rig. Every character is the same SVG component with a different `look`;
// poses and expressions are keyed per shot. Units: one head = 64, a standing adult is
// ~7 heads (448) tall, with the feet at (0, 0) and up being −y.
import React, { useId } from 'react';
import { useCurrentFrame } from 'remotion';
import { blinkAt, breath, sway } from '../lib/anim';

// ---------------------------------------------------------------------------------------
// Types

export type HairStyle = 'ponytail' | 'loose' | 'receding' | 'combed' | 'bob' | 'short' | 'bun' | 'young' | 'plain';
export type TopKind = 'blazer' | 'blouse' | 'leather' | 'suit' | 'cardigan' | 'jacket' | 'shirt' | 'coat' | 'simple';

export type Look = {
  id: string;
  skin: string;
  skinShade: string;
  lip: string;
  iris: string;
  hair: string;
  hairShade: string;
  brow: string;
  hairStyle: HairStyle;
  male?: boolean;
  build: { shoulder: number; waist: number; hip: number; jaw: number; neck?: number };
  top: { kind: TopKind; color: string; shade: string; inner: string; innerShade?: string; tie?: string; apron?: string };
  trousers: string;
  trousersShade: string;
  shoes: string;
  earrings?: 'silverStud' | 'goldHoop';
  watch?: 'silver' | 'gold';
  glasses?: boolean;
  moustache?: boolean;
  beard?: boolean;
  /** Extras: simplified face. */
  simple?: boolean;
};

export type HandShape = 'relaxed' | 'open' | 'fist' | 'point' | 'grip' | 'flat';
export type ArmPose = {
  /** Upper arm swing, degrees. + = away from the body. */
  sh: number;
  /** Elbow bend, degrees. + = forearm folds up toward the body's centre. */
  el: number;
  /** Wrist, degrees. */
  wr?: number;
  /** Foreshortening of the whole arm toward camera, 0..0.7. */
  fore?: number;
  hand?: HandShape;
  /** Drawn in hand space (wrist at origin, fingers toward +y). */
  hold?: React.ReactNode;
  /** Draw the arm behind the torso. */
  behind?: boolean;
};
export type Legs =
  | { kind: 'stand'; spread?: number }
  | { kind: 'sit' }
  | { kind: 'walk'; phase: number; stride?: number; depth?: boolean }
  | { kind: 'none' };
export type Face = {
  lookX?: number;
  lookY?: number;
  /** Extra eyelid closure 0..1 on top of blinks. */
  lid?: number;
  browL?: number;
  browR?: number;
  /** + = inner ends up (worried / sad), − = inner ends down (stern). */
  worry?: number;
  /** Mouth openness 0..1 (0 closed, ~0.35 half-open, 1 open). */
  open?: number;
  /** −1 frown .. 1 big smile. */
  smile?: number;
  /** Lower lids up: laughing / squinting, 0..1. */
  squint?: number;
  teeth?: boolean;
  blinks?: boolean;
};
export type Pose = {
  view?: 'front' | 'back';
  /** −1..1: face and body turned toward screen left (−) or right (+). */
  turn?: number;
  /** Upper body rotation about the pelvis, degrees. */
  lean?: number;
  headTilt?: number;
  /** Head pitch: + looks down (nod), − looks up. */
  headPitch?: number;
  shrug?: number;
  breathe?: number;
  armL?: ArmPose;
  armR?: ArmPose;
  legs?: Legs;
  face?: Face;
  /** Override the top (e.g. Scene 2 before the blazer goes on). */
  top?: Partial<Look['top']>;
  /** Blink/breath seed. */
  seed?: number;
  /** Pelvis height override (feet at 0): −236 standing, −128 seated. Animate to sit or stand. */
  pelvisY?: number;
};

// ---------------------------------------------------------------------------------------
// Hands

export const Hand: React.FC<{ skin: string; shade: string; shape?: HandShape; side?: 1 | -1; nails?: boolean }> = ({
  skin,
  shade,
  shape = 'relaxed',
  side = 1,
}) => {
  const curl = { relaxed: 0.32, open: 0, fist: 1, point: 1, grip: 0.62, flat: 0.08 }[shape];
  const spread = shape === 'open' ? 1 : 0;
  const fingers = [
    { x: -6.2, len: 17 },
    { x: -2.1, len: 19.5 },
    { x: 2.1, len: 18.5 },
    { x: 6.2, len: 15 },
  ].map((f) => (side === 1 ? f : { ...f, x: -f.x }));
  const fingerCurl = (i: number) => (shape === 'point' && i === (side === 1 ? 3 : 0) ? 0 : curl);
  return (
    <g>
      {fingers.map((fg, i) => {
        const c = fingerCurl(i);
        const len = fg.len * (1 - 0.62 * c);
        const rot = (fg.x / 6) * 7 * spread;
        return (
          <g key={i} transform={`translate(${fg.x * (1 + spread * 0.15)} 16) rotate(${rot})`}>
            <rect x={-2.2} y={0} width={4.4} height={len + 2} rx={2.2} fill={i === 3 ? shade : skin} />
          </g>
        );
      })}
      <rect x={-8.6} y={-1} width={17.2} height={20} rx={6.5} fill={skin} />
      <path d={`M ${side * 8.6} 4 L ${side * 8.6} 16 Q ${side * 3} 19 ${-side * 2} 18 Z`} fill={shade} opacity={0.55} />
      <g transform={`translate(${-side * 7} 5) rotate(${side * (28 + curl * 25)})`}>
        <rect x={-2.6} y={0} width={5.2} height={14 - curl * 3} rx={2.6} fill={skin} />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------
// Head

const Eye: React.FC<{ cx: number; lid: number; squint: number; lookX: number; lookY: number; iris: string; skin: string; sx: number; uid: string }> = ({
  cx,
  lid,
  squint,
  lookX,
  lookY,
  iris,
  skin,
  sx,
  uid,
}) => {
  const cy = -1;
  const rx = 4.9;
  const ry = 3.2;
  const eyePath = `M ${cx - rx} ${cy} Q ${cx - rx * 0.3} ${cy - ry * 1.45} ${cx + rx * 0.2} ${cy - ry * 1.2} Q ${cx + rx * 0.85} ${cy - ry * 0.7} ${cx + rx} ${cy + 0.3} Q ${cx + rx * 0.2} ${cy + ry * 1.15} ${cx - rx} ${cy} Z`;
  const lidY = cy - ry * 1.5 + lid * ry * 2.7;
  const lowY = cy + ry * 1.3 - squint * ry * 1.6;
  const clip = `eye-${uid}-${cx < 0 ? 'l' : 'r'}`;
  return (
    <g transform={`translate(${cx} 0) scale(${sx} 1) translate(${-cx} 0)`}>
      <defs>
        <clipPath id={clip}>
          <path d={eyePath} />
        </clipPath>
      </defs>
      <path d={eyePath} fill="#FBFAF7" />
      <g clipPath={`url(#${clip})`}>
        <circle cx={cx + lookX * 1.9} cy={cy + lookY * 1.2} r={2.65} fill={iris} />
        <circle cx={cx + lookX * 1.9} cy={cy + lookY * 1.2} r={1.3} fill="#17141C" />
        <circle cx={cx + lookX * 1.9 + 0.9} cy={cy + lookY * 1.2 - 0.9} r={0.6} fill="#fff" />
        <rect x={cx - rx - 1} y={cy - ry * 2} width={rx * 2 + 2} height={lidY - (cy - ry * 2)} fill={skin} />
        <rect x={cx - rx - 1} y={lowY} width={rx * 2 + 2} height={ry * 3} fill={skin} />
      </g>
      {/* lash line follows the upper lid */}
      <path
        d={`M ${cx - rx - 0.6} ${Math.min(lidY, cy) + 0.2} Q ${cx} ${lidY - (lid > 0.9 ? -0.5 : 1.4)} ${cx + rx + 0.4} ${Math.min(lidY, cy) + 0.6} L ${cx + rx + 0.2} ${Math.min(lidY, cy) + 1.5} Q ${cx} ${lidY + 0.1} ${cx - rx - 0.3} ${Math.min(lidY, cy) + 1.2} Z`}
        fill="#2A2026"
      />
    </g>
  );
};

const Brow: React.FC<{ cx: number; raise: number; worry: number; color: string; sx: number; male?: boolean }> = ({ cx, raise, worry, color, sx, male }) => {
  const side = cx < 0 ? -1 : 1;
  const y = -9.6 - raise * 2.6;
  const inner = cx - side * 4.6;
  const outer = cx + side * 5.2;
  const innerY = y - worry * 2.2 + (male ? 0.3 : 0);
  const outerY = y + 0.9 + worry * 0.8;
  const t = male ? 2.1 : 1.6;
  return (
    <g transform={`translate(${cx} 0) scale(${sx} 1) translate(${-cx} 0)`}>
      <path
        d={`M ${inner} ${innerY} Q ${cx} ${y - 1.6} ${outer} ${outerY} L ${outer - side * 0.4} ${outerY + t * 0.6} Q ${cx} ${y - 1.6 + t} ${inner} ${innerY + t} Z`}
        fill={color}
      />
    </g>
  );
};

const Mouth: React.FC<{ open: number; smile: number; lip: string; teeth?: boolean; x: number }> = ({ open, smile, lip, teeth, x }) => {
  const cy = 17.6;
  const w = 6.4 + smile * 1.5 + open * 0.6;
  const cornerY = cy - smile * 1.6 + open * 0.8;
  const upY = cy - 0.6 - open * 1.4 + smile * 0.6;
  const lowY = cy + 0.8 + open * 8.2 + Math.max(0, smile) * 2.4;
  if (open < 0.06) {
    const mid = cy + smile * 2.2;
    return (
      <g transform={`translate(${x} 0)`}>
        <path d={`M ${-w} ${cornerY} Q 0 ${mid - 0.4} ${w} ${cornerY} Q 0 ${mid + 1.6} ${-w} ${cornerY} Z`} fill="#6E2E33" />
        <path d={`M ${-w * 0.62} ${cornerY + 1.4 + smile * 0.5} Q 0 ${mid + 4.2} ${w * 0.62} ${cornerY + 1.4 + smile * 0.5} Q 0 ${mid + 1.9} ${-w * 0.62} ${cornerY + 1.4 + smile * 0.5} Z`} fill={lip} opacity={0.7} />
      </g>
    );
  }
  const inner = `M ${-w} ${cornerY} Q 0 ${upY - 1.2} ${w} ${cornerY} Q 0 ${lowY + 1.2} ${-w} ${cornerY} Z`;
  return (
    <g transform={`translate(${x} 0)`}>
      <path d={inner} fill="#4A1F27" />
      {(teeth || smile > 0.25) && (
        <path d={`M ${-w * 0.8} ${cornerY - 0.2} Q 0 ${upY - 1.0} ${w * 0.8} ${cornerY - 0.2} L ${w * 0.7} ${cornerY + 1.4} Q 0 ${upY + 2.2} ${-w * 0.7} ${cornerY + 1.4} Z`} fill="#F7F3EC" />
      )}
      <ellipse cx={0} cy={lowY - 1.6 - open * 1.2} rx={w * 0.45} ry={Math.max(0.5, open * 2.2)} fill="#B4515B" opacity={0.85} />
      <path d={`M ${-w * 0.8} ${lowY - 0.2} Q 0 ${lowY + 2.6} ${w * 0.8} ${lowY - 0.2} Q 0 ${lowY + 0.9} ${-w * 0.8} ${lowY - 0.2} Z`} fill={lip} opacity={0.75} />
    </g>
  );
};

/** Hair drawn behind the face. */
const HairBack: React.FC<{ look: Look; t: number; view: 'front' | 'back' }> = ({ look, t, view }) => {
  const c = look.hair;
  const s = look.hairShade;
  switch (look.hairStyle) {
    case 'loose':
      return (
        <g>
          {view === 'back' ? (
            <path d={`M -27 -6 C -30 -30 -16 -37 0 -37 C 16 -37 30 -30 27 -6 C 29 16 ${31 + t} 40 ${29 + t * 1.5} 58 L ${-29 + t * 1.5} 58 C ${-31 + t} 40 -29 16 -27 -6 Z`} fill={c} />
          ) : (
            <path d={`M -27 -6 C -30 -30 -16 -37 0 -37 C 16 -37 30 -30 27 -6 C 29 16 ${31 + t} 40 ${30 + t * 1.5} 58 L ${17 + t} 58 C 16 44 14 34 12 26 L -12 26 C -14 34 -16 44 ${-17 + t} 58 L ${-30 + t * 1.5} 58 C ${-31 + t} 40 -29 16 -27 -6 Z`} fill={s} />
          )}
        </g>
      );
    case 'bob':
      return <path d={`M -27 -4 C -29 -30 -15 -37 0 -37 C 15 -37 29 -30 27 -4 C 28 14 ${28 + t} 30 ${26 + t} 40 L ${-26 + t} 40 C ${-28 + t} 30 -28 14 -27 -4 Z`} fill={view === 'back' ? c : s} />;
    case 'ponytail':
      return (
        <g>
          <path d={view === 'back' ? `M 4 22 C ${16 + t} 30 ${20 + t * 2} 46 ${15 + t * 3} 66 C ${11 + t * 3} 54 ${8 + t} 40 0 28 Z` : `M 8 20 C ${22 + t} 28 ${27 + t * 2} 44 ${24 + t * 3} 60 C ${20 + t * 3} 50 ${16 + t} 38 6 28 Z`} fill={view === 'back' ? c : s} transform={view === 'back' ? 'translate(-6 -6)' : undefined} />
          {view === 'back' && <rect x={-5} y={14} width={8} height={5} rx={2} fill="#1d1b22" />}
        </g>
      );
    case 'bun':
      return <ellipse cx={0} cy={-36} rx={13} ry={10} fill={view === 'back' ? c : s} />;
    default:
      return null;
  }
};

/** Hair drawn over the face (or over the whole head from behind). */
const HairFront: React.FC<{ look: Look; turn: number; view: 'front' | 'back' }> = ({ look, turn, view }) => {
  const c = look.hair;
  const s = look.hairShade;
  const tx = turn * 2.4;
  if (view === 'back') {
    const cap = 'M -25 6 C -27 -26 -14 -35 0 -35 C 14 -35 27 -26 25 6 C 24 18 18 26 0 28 C -18 26 -24 18 -25 6 Z';
    if (look.hairStyle === 'receding' || look.hairStyle === 'short' || look.hairStyle === 'young' || look.hairStyle === 'combed' || look.hairStyle === 'plain')
      return <path d="M -24.5 4 C -26 -26 -13 -34.5 0 -34.5 C 13 -34.5 26 -26 24.5 4 C 23 14 17 20 0 21 C -17 20 -23 14 -24.5 4 Z" fill={c} />;
    return <path d={cap} fill={c} />;
  }
  switch (look.hairStyle) {
    case 'ponytail':
      return (
        <g transform={`translate(${tx} 0)`}>
          <path d="M -24.5 4 C -27 -24 -14 -35.5 0 -35.5 C 14 -35.5 27 -24 24.5 4 C 23.5 -8 21 -16 15 -21 C 9 -24 3 -24 -1 -27 C -6 -22 -14 -20 -20 -14 C -23 -9 -24 -3 -24.5 4 Z" fill={c} />
          <path d="M 24.5 4 C 23.5 -8 21 -16 15 -21 C 18 -19 22 -14 24 -6 Z" fill={s} />
          <path d="M -1 -27 C 4 -24 10 -23 15 -21 C 9 -26 4 -28 -1 -27 Z" fill={s} opacity={0.5} />
        </g>
      );
    case 'loose':
      return (
        <g transform={`translate(${tx} 0)`}>
          <path d="M -27 14 C -29 -22 -16 -36.5 2 -36.5 C 17 -36.5 28 -26 27 10 C 25 0 23 -10 19 -16 C 12 -22 3 -24 -7 -22 C -13 -15 -19 -10 -22 -2 C -24 4 -25 9 -27 14 Z" fill={c} />
          <path d="M -7 -22 C -16 -25 -21 -16 -22 -2 C -24 -12 -20 -24 -11 -29 Z" fill={s} opacity={0.6} />
          <path d="M 27 10 C 28 22 29 34 27 46 C 24 34 23 22 21 4 C 23 4 25 6 27 10 Z" fill={c} />
          <path d="M -27 14 C -29 26 -30 36 -28 46 C -25 36 -23 24 -22 10 Z" fill={c} />
        </g>
      );
    case 'receding':
      return (
        <g transform={`translate(${tx} 0)`}>
          <path d="M -24 6 C -25 -10 -22 -20 -16 -24 C -17 -16 -19 -8 -20 4 Z" fill={c} />
          <path d="M 24 6 C 25 -10 22 -20 16 -24 C 17 -16 19 -8 20 4 Z" fill={c} />
          <path d="M -12 -31 C -6 -34 6 -34 12 -31 C 6 -32 -6 -32 -12 -31 Z" fill={c} opacity={0.8} />
        </g>
      );
    case 'combed':
      return (
        <g transform={`translate(${tx} 0)`}>
          <path d="M -24 2 C -26 -24 -12 -35 2 -35 C 16 -35 26 -25 24 2 C 23 -10 20 -18 13 -22 C 4 -25 -8 -24 -14 -22 C -19 -18 -22 -10 -24 2 Z" fill={c} />
          <path d="M -14 -22 C -10 -28 0 -30 8 -29 C 0 -27 -8 -25 -14 -22 Z" fill={s} />
        </g>
      );
    case 'bob':
      return (
        <g transform={`translate(${tx} 0)`}>
          <path d="M -26 22 C -29 -20 -15 -36 1 -36 C 17 -36 29 -22 26 22 C 24 6 22 -8 18 -15 C 12 -21 4 -22 -6 -20 C -14 -18 -20 -10 -22 0 C -24 8 -25 14 -26 22 Z" fill={c} />
          <path d="M 26 22 C 27 30 27 36 25 40 C 23 30 22 18 22 8 Z" fill={s} />
        </g>
      );
    case 'bun':
      return (
        <g transform={`translate(${tx} 0)`}>
          <path d="M -24 0 C -26 -24 -13 -34.5 0 -34.5 C 13 -34.5 26 -24 24 0 C 22 -12 18 -20 10 -24 C 3 -26 -4 -26 -10 -24 C -18 -20 -22 -12 -24 0 Z" fill={c} />
          <path d="M -10 -24 C -4 -28 4 -28 10 -24 C 4 -26 -4 -26 -10 -24 Z" fill={s} />
        </g>
      );
    case 'short':
    case 'young':
      return (
        <g transform={`translate(${tx} 0)`}>
          <path d="M -24 -2 C -25 -26 -12 -35 1 -35 C 15 -35 26 -25 24 -2 C 23 -12 20 -19 14 -22 C 6 -25 -6 -25 -13 -22 C -19 -19 -23 -12 -24 -2 Z" fill={c} />
          {look.hairStyle === 'young' && <path d="M -13 -22 C -6 -30 10 -30 16 -22 C 8 -25 -4 -26 -13 -22 Z" fill={s} />}
        </g>
      );
    default:
      return <path d="M -24 -4 C -25 -26 -12 -35 0 -35 C 12 -35 25 -26 24 -4 C 20 -18 12 -24 0 -24 C -12 -24 -20 -18 -24 -4 Z" fill={c} />;
  }
};

export const HeadBackHair: React.FC<{ look: Look; frame: number; seed: number }> = ({ look, frame, seed }) => (
  <HairBack look={look} t={sway(frame, seed, 3.1) * 1.2} view="front" />
);

export const Head: React.FC<{ look: Look; pose: Pose; frame: number; lipOpen?: number }> = ({ look, pose, frame, lipOpen }) => {
  const uid = useId().replace(/:/g, '');
  const view = pose.view ?? 'front';
  const turn = pose.turn ?? 0;
  const f = pose.face ?? {};
  const seed = pose.seed ?? look.id.length * 3.1;
  const blink = f.blinks === false ? 0 : blinkAt(frame, seed);
  const lid = Math.min(1, Math.max(f.lid ?? 0, blink));
  const t = sway(frame, seed, 3.1) * 1.2;
  const jaw = look.build.jaw;
  const face = `M ${-22.5 * jaw} -6 C ${-22.5 * jaw} -27 -12 -33 0 -33 C 12 -33 ${22.5 * jaw} -27 ${22.5 * jaw} -6 C ${22.5 * jaw} 9 ${16 * jaw} ${22 + (look.male ? 1 : 0)} 0 ${31.5 + (look.male ? 0.5 : 0)} C ${-16 * jaw} ${22 + (look.male ? 1 : 0)} ${-22.5 * jaw} 9 ${-22.5 * jaw} -6 Z`;
  const fx = turn * 5.2;
  const farL = turn > 0 ? 1 : 1 - 0.32 * -turn; // left eye shrinks when turning left
  const farR = turn < 0 ? 1 : 1 - 0.32 * turn;
  const open = lipOpen ?? f.open ?? 0;

  if (view === 'back') {
    return (
      <g>
        <HairBack look={look} t={t} view="back" />
        <ellipse cx={-22.5 * jaw} cy={3} rx={3.4} ry={6} fill={look.skinShade} />
        <ellipse cx={22.5 * jaw} cy={3} rx={3.4} ry={6} fill={look.skinShade} />
        <path d={face} fill={look.skinShade} />
        <HairFront look={look} turn={0} view="back" />
      </g>
    );
  }

  return (
    <g>
      {/* ears */}
      <ellipse cx={-22 * jaw + turn * 2} cy={3} rx={3.6} ry={6.2} fill={look.skinShade} opacity={turn > 0.5 ? 0 : 1} />
      <ellipse cx={22 * jaw + turn * 2} cy={3} rx={3.6} ry={6.2} fill={look.skinShade} opacity={turn < -0.5 ? 0 : 1} />
      <path d={face} fill={look.skin} />
      {/* one soft cel-shadow tone: the side away from the light */}
      <path d={`M ${12 * jaw + fx * 0.3} -30 C ${21 * jaw} -24 ${22.5 * jaw} -14 ${22.5 * jaw} -6 C ${22.5 * jaw} 9 ${16 * jaw} 22 0 31.5 C ${10 * jaw} 22 ${15 * jaw} 8 ${15 * jaw} -6 C ${15 * jaw} -16 ${14 * jaw} -24 ${12 * jaw + fx * 0.3} -30 Z`} fill={look.skinShade} opacity={0.45} />
      {!look.simple && <ellipse cx={-12 + fx} cy={10} rx={4.5} ry={2.6} fill="#E58C8A" opacity={look.male ? 0.08 : 0.16} />}
      {!look.simple && <ellipse cx={12 + fx} cy={10} rx={4.5} ry={2.6} fill="#E58C8A" opacity={look.male ? 0.08 : 0.16} />}
      {look.simple ? (
        <g>
          <ellipse cx={-9 + fx} cy={-1} rx={1.8} ry={lid > 0.6 ? 0.4 : 1.9} fill="#2A2026" />
          <ellipse cx={9 + fx} cy={-1} rx={1.8} ry={lid > 0.6 ? 0.4 : 1.9} fill="#2A2026" />
          <path d={`M ${-4 + fx} 17 Q ${fx} ${18.5 + (f.smile ?? 0) * 2} ${4 + fx} 17`} stroke="#6E2E33" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <Eye cx={-9.6 + fx} lid={lid} squint={f.squint ?? 0} lookX={f.lookX ?? 0} lookY={f.lookY ?? 0} iris={look.iris} skin={look.skin} sx={farL} uid={uid} />
          <Eye cx={9.6 + fx} lid={lid} squint={f.squint ?? 0} lookX={f.lookX ?? 0} lookY={f.lookY ?? 0} iris={look.iris} skin={look.skin} sx={farR} uid={uid} />
          <Brow cx={-9.8 + fx} raise={f.browL ?? 0} worry={f.worry ?? 0} color={look.brow} sx={farL} male={look.male} />
          <Brow cx={9.8 + fx} raise={f.browR ?? 0} worry={f.worry ?? 0} color={look.brow} sx={farR} male={look.male} />
          {/* nose */}
          <path d={`M ${fx * 1.35 + 0.5} 1.5 C ${fx * 1.35 + 2.5} 6 ${fx * 1.35 + 3.8} 9 ${fx * 1.35 + 2.6} 10.6 C ${fx * 1.35 + 1} 11.6 ${fx * 1.35 - 1.6} 11.4 ${fx * 1.35 - 3} 10.6 C ${fx * 1.35 - 1} 10.2 ${fx * 1.35 + 1.4} 9 ${fx * 1.35 + 0.5} 1.5 Z`} fill={look.skinShade} />
          {look.moustache && (
            <path d={`M ${fx - 9.5} 15.6 C ${fx - 7} 10.6 ${fx - 2} 11.6 ${fx} 12.6 C ${fx + 2} 11.6 ${fx + 7} 10.6 ${fx + 9.5} 15.6 C ${fx + 5} 14.6 ${fx + 2} 15 ${fx} 15.4 C ${fx - 2} 15 ${fx - 5} 14.6 ${fx - 9.5} 15.6 Z`} fill={look.hair} />
          )}
          <Mouth open={open} smile={f.smile ?? 0} lip={look.lip} teeth={f.teeth} x={fx} />
          {look.beard && (
            <path d={`M ${-22 * jaw} -2 C ${-21 * jaw} 12 ${-14 * jaw} 26 0 32.5 C ${14 * jaw} 26 ${21 * jaw} 12 ${22 * jaw} -2 C ${20 * jaw} 10 ${14} 13 ${fx + 8} 15 C ${fx + 8} 22 ${fx + 4} 25 ${fx} 25 C ${fx - 4} 25 ${fx - 8} 22 ${fx - 8} 15 C ${-14} 13 ${-20 * jaw} 10 ${-22 * jaw} -2 Z`} fill={look.hair} opacity={0.92} />
          )}
        </g>
      )}
      <HairFront look={look} turn={turn} view="front" />
      {look.glasses && (
        <g transform={`translate(${fx} 0)`} fill="none" stroke="#2B2A33" strokeWidth={1.3}>
          <rect x={-16.5} y={-5.5} width={13} height={9} rx={1.6} />
          <rect x={3.5} y={-5.5} width={13} height={9} rx={1.6} />
          <path d="M -3.5 -2 Q 0 -3.4 3.5 -2" />
          <path d="M -16.5 -3 L -22 -4" />
          <path d="M 16.5 -3 L 22 -4" />
        </g>
      )}
      {look.earrings === 'silverStud' && (
        <g>
          <circle cx={-22.4 * jaw + turn * 2} cy={8.8} r={1.4} fill="#D9DDE3" opacity={turn > 0.5 ? 0 : 1} />
          <circle cx={22.4 * jaw + turn * 2} cy={8.8} r={1.4} fill="#D9DDE3" opacity={turn < -0.5 ? 0 : 1} />
        </g>
      )}
      {look.earrings === 'goldHoop' && (
        <g fill="none" stroke="#D4A537" strokeWidth={1.2}>
          <circle cx={-22.6 * jaw + turn * 2} cy={11.6} r={3} opacity={turn > 0.5 ? 0 : 1} />
          <circle cx={22.6 * jaw + turn * 2} cy={11.6} r={3} opacity={turn < -0.5 ? 0 : 1} />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------------------
// Body

const UPPER = 80;
const FORE = 76;

const Arm: React.FC<{ side: -1 | 1; pose: ArmPose; look: Look; top: Look['top']; x: number; y: number }> = ({ side, pose, look, top, x, y }) => {
  const upperRot = side === -1 ? pose.sh : -pose.sh;
  const foreRot = side === -1 ? -pose.el : pose.el;
  const fs = 1 - (pose.fore ?? 0);
  const sleeve = top.kind === 'blouse' ? top.inner : top.color;
  const sleeveShade = top.kind === 'blouse' ? top.innerShade ?? '#DAD6CE' : top.shade;
  const cuff = top.kind === 'blazer' || top.kind === 'suit' || top.kind === 'jacket' || top.kind === 'coat' ? top.inner : undefined;
  const w = look.male ? 10.5 : 9.2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${upperRot})`}>
      <g transform={`scale(1 ${fs})`}>
        <rect x={-w} y={-8} width={w * 2} height={UPPER + 12} rx={w} fill={sleeve} />
        <rect x={side === 1 ? 0 : -w} y={-4} width={w} height={UPPER + 6} rx={w * 0.5} fill={sleeveShade} opacity={0.5} />
      </g>
      <g transform={`translate(0 ${UPPER * fs}) rotate(${foreRot})`}>
        <rect x={-w + 0.8} y={-6} width={(w - 0.8) * 2} height={FORE + 6} rx={w - 0.8} fill={sleeve} />
        {cuff && <rect x={-w + 1.6} y={FORE - 6} width={(w - 1.6) * 2} height={6} rx={2} fill={cuff} />}
        {look.watch && side === 1 && <rect x={-w + 1} y={FORE - (cuff ? 12 : 6)} width={(w - 1) * 2} height={4.6} rx={1.5} fill={look.watch === 'gold' ? '#D4A537' : '#C9CED6'} />}
        <g transform={`translate(0 ${FORE}) rotate(${(pose.wr ?? 0) * (side === -1 ? 1 : -1)})`}>
          <Hand skin={look.skin} shade={look.skinShade} shape={pose.hand} side={side === -1 ? 1 : -1} />
          {pose.hold}
        </g>
      </g>
    </g>
  );
};

const Torso: React.FC<{ look: Look; top: Look['top']; view: 'front' | 'back'; breathe: number }> = ({ look, top, view, breathe }) => {
  const S = look.build.shoulder;
  const W = look.build.waist;
  const H = look.build.hip;
  const nk = look.build.neck ?? (look.male ? 10 : 8);
  const by = breathe * 0.8;
  const long = top.kind === 'coat' ? 150 : top.kind === 'blazer' || top.kind === 'suit' || top.kind === 'leather' || top.kind === 'jacket' ? 16 : 6;
  const body = `M ${-nk} ${-137 + by} L ${-S * 0.62} ${-131 + by} Q ${-S} ${-128 + by} ${-S} ${-111} L ${-W} -52 Q ${-W - 1} -18 ${-H} ${long} L ${H} ${long} Q ${W + 1} -18 ${W} -52 L ${S} ${-111} Q ${S} ${-128 + by} ${S * 0.62} ${-131 + by} L ${nk} ${-137 + by} Z`;
  const shade = `M ${S * 0.35} ${-130 + by} Q ${S} ${-128 + by} ${S} ${-111} L ${W} -52 Q ${W + 1} -18 ${H} ${long} L ${H * 0.5} ${long} Q ${W * 0.55} -20 ${W * 0.55} -52 L ${S * 0.55} -110 Z`;
  const neck = (
    <g>
      <rect x={-nk} y={-160} width={nk * 2} height={28} fill={look.skin} />
      <rect x={-nk} y={-160} width={nk * 2} height={10} fill={look.skinShade} opacity={0.55} />
    </g>
  );
  if (view === 'back') {
    return (
      <g>
        {neck}
        <path d={body} fill={top.kind === 'blouse' ? top.inner : top.color} />
        <path d={shade} fill={top.kind === 'blouse' ? top.innerShade ?? '#DAD6CE' : top.shade} opacity={0.55} />
        <path d={`M ${-nk - 3} ${-137 + by} Q 0 ${-128 + by} ${nk + 3} ${-137 + by} L ${nk + 2} ${-133 + by} Q 0 ${-124 + by} ${-nk - 2} ${-133 + by} Z`} fill={top.shade} />
        {top.apron && <path d={`M ${-W} -52 L ${W} -52 L ${W + 4} 12 L ${-W - 4} 12 Z`} fill="none" />}
      </g>
    );
  }
  const inner = top.inner;
  const innerShade = top.innerShade ?? '#DAD6CE';
  return (
    <g>
      {neck}
      <path d={body} fill={top.kind === 'blouse' ? inner : top.color} />
      <path d={shade} fill={top.kind === 'blouse' ? innerShade : top.shade} opacity={0.5} />
      {top.kind === 'blazer' && (
        <g>
          <path d={`M ${-nk - 1} ${-137 + by} L ${nk + 1} ${-137 + by} L 0 -84 Z`} fill={inner} />
          <path d={`M ${-nk - 1} ${-137 + by} L ${-nk - 6} ${-128 + by} L -2 -100 Z M ${nk + 1} ${-137 + by} L ${nk + 6} ${-128 + by} L 2 -100 Z`} fill={innerShade} />
          <path d={`M ${-nk - 1} ${-137 + by} L ${-S * 0.42} ${-128 + by} L -14 -100 L 0 -84 Z`} fill={top.shade} />
          <path d={`M ${nk + 1} ${-137 + by} L ${S * 0.42} ${-128 + by} L 14 -100 L 0 -84 Z`} fill={top.shade} />
          <circle cx={0} cy={-74} r={2.4} fill="#0f1d33" />
          <circle cx={0} cy={-52} r={2.4} fill="#0f1d33" />
          <path d={`M 0 -84 L 0 ${long}`} stroke="#0f1d33" strokeWidth={1} opacity={0.5} />
        </g>
      )}
      {top.kind === 'blouse' && (
        <g>
          <path d={`M ${-nk - 1} ${-137 + by} L ${-nk - 8} ${-128 + by} L -2 -112 Z M ${nk + 1} ${-137 + by} L ${nk + 8} ${-128 + by} L 2 -112 Z`} fill={innerShade} />
          <path d={`M 0 -112 L 0 ${long}`} stroke={innerShade} strokeWidth={1.2} />
        </g>
      )}
      {(top.kind === 'suit' || top.kind === 'jacket' || top.kind === 'coat') && (
        <g>
          <path d={`M ${-nk - 1} ${-137 + by} L ${nk + 1} ${-137 + by} L 0 -72 Z`} fill={inner} />
          {top.tie && <path d={`M -3.4 -134 L 3.4 -134 L 5 -126 L 3 -86 L 0 -78 L -3 -86 L -5 -126 Z`} fill={top.tie} />}
          {top.tie && <path d="M -3.4 -134 L 3.4 -134 L 2 -127 L -2 -127 Z" fill="#000" opacity={0.25} />}
          <path d={`M ${-nk - 1} ${-137 + by} L ${-S * 0.44} ${-128 + by} L -16 -96 L 0 -72 Z`} fill={top.shade} />
          <path d={`M ${nk + 1} ${-137 + by} L ${S * 0.44} ${-128 + by} L 16 -96 L 0 -72 Z`} fill={top.shade} />
          <circle cx={0} cy={-60} r={2.4} fill="#000" opacity={0.35} />
          {top.kind === 'coat' && <circle cx={0} cy={-20} r={2.6} fill="#000" opacity={0.35} />}
        </g>
      )}
      {top.kind === 'leather' && (
        <g>
          <path d={`M ${-nk - 4} ${-137 + by} L ${nk + 4} ${-137 + by} L 14 ${long} L -14 ${long} Z`} fill={inner} />
          <path d={`M ${-nk + 1} ${-137 + by} L 0 -116 L ${nk - 1} ${-137 + by} Z`} fill={look.skin} />
          <path d={`M ${-nk - 4} ${-137 + by} L ${-nk - 14} ${-124 + by} L -6 -112 L 0 -116 Z M ${nk + 4} ${-137 + by} L ${nk + 14} ${-124 + by} L 6 -112 L 0 -116 Z`} fill={innerShade} />
          <path d={`M ${-nk - 4} ${-138 + by} L ${-S * 0.62} ${-130 + by} L -30 -102 L -16 -92 L -13 ${long} Z`} fill={top.shade} opacity={0.55} />
          <path d={`M ${nk + 4} ${-138 + by} L ${S * 0.62} ${-130 + by} L 30 -102 L 16 -92 L 13 ${long} Z`} fill={top.shade} opacity={0.55} />
        </g>
      )}
      {top.kind === 'cardigan' && (
        <g>
          <path d={`M ${-nk - 1} ${-137 + by} L ${nk + 1} ${-137 + by} L 0 -78 Z`} fill={inner} />
          <path d={`M 0 -78 L 0 ${long}`} stroke={top.shade} strokeWidth={2} />
          {[-66, -48, -30, -12].map((yy) => (
            <circle key={yy} cx={0} cy={yy} r={1.8} fill={top.shade} />
          ))}
        </g>
      )}
      {top.kind === 'shirt' && (
        <g>
          <path d={`M ${-nk - 1} ${-137 + by} L ${-nk - 8} ${-128 + by} L -2 -116 Z M ${nk + 1} ${-137 + by} L ${nk + 8} ${-128 + by} L 2 -116 Z`} fill={top.shade} />
          <path d={`M 0 -116 L 0 ${long}`} stroke={top.shade} strokeWidth={1.2} />
        </g>
      )}
      {top.kind === 'simple' && <path d={`M ${-nk - 2} ${-137 + by} Q 0 ${-124 + by} ${nk + 2} ${-137 + by}`} stroke={top.shade} strokeWidth={2.5} fill="none" />}
      {top.apron && <path d={`M ${-W + 2} -46 L ${W - 2} -46 L ${W + 4} 120 L ${-W - 4} 120 Z`} fill={top.apron} />}
    </g>
  );
};

const LegShape: React.FC<{ look: Look; hipRot: number; knee: number; len?: number; shoe?: boolean; side: -1 | 1 }> = ({ look, hipRot, knee, len = 1, side }) => {
  const thigh = 112 * len;
  const shin = 108 * len;
  return (
    <g transform={`rotate(${hipRot})`}>
      <path d={`M -15 -6 L 15 -6 L 12 ${thigh} L -11 ${thigh} Z`} fill={look.trousers} />
      <path d={`M ${side * 3} -6 L ${side * 15} -6 L ${side * 12} ${thigh} L ${side * 5} ${thigh} Z`} fill={look.trousersShade} opacity={0.6} />
      <g transform={`translate(0 ${thigh}) rotate(${knee})`}>
        <path d={`M -11.5 -4 L 12 -4 L 10 ${shin} L -9.5 ${shin} Z`} fill={look.trousers} />
        <path d={`M ${side * 3} -4 L ${side * 12} -4 L ${side * 10} ${shin} L ${side * 4} ${shin} Z`} fill={look.trousersShade} opacity={0.6} />
        <path d={`M -10.5 ${shin - 4} L 10.5 ${shin - 4} Q 18 ${shin + 2} 17 ${shin + 10} L -11 ${shin + 10} Q -12 ${shin + 2} -10.5 ${shin - 4} Z`} fill={look.shoes} />
      </g>
    </g>
  );
};

const LegsDraw: React.FC<{ look: Look; legs: Legs }> = ({ look, legs }) => {
  if (legs.kind === 'none') return null;
  if (legs.kind === 'sit') {
    return (
      <g>
        {([-1, 1] as const).map((sd) => (
          <g key={sd} transform={`translate(${sd * 21} 0)`}>
            <path d={`M -16 -8 L 16 -8 Q 20 18 15 32 L -13 32 Q -18 18 -16 -8 Z`} fill={look.trousers} />
            <path d={`M -12 30 L 12 30 L 10 118 L -9.5 118 Z`} fill={look.trousers} />
            <path d={`M ${sd * 2} 30 L ${sd * 12} 30 L ${sd * 10} 118 L ${sd * 4} 118 Z`} fill={look.trousersShade} opacity={0.6} />
            <path d={`M -11 114 L 11 114 Q 15 122 13 128 L -12 128 Q -14 122 -11 114 Z`} fill={look.shoes} />
          </g>
        ))}
      </g>
    );
  }
  if (legs.kind === 'walk') {
    const st = legs.stride ?? 22;
    const a = Math.sin(legs.phase) * st;
    const kneeA = Math.max(0, Math.sin(legs.phase + Math.PI / 2)) * st * 1.1;
    const kneeB = Math.max(0, Math.sin(legs.phase - Math.PI / 2)) * st * 1.1;
    if (legs.depth) {
      // walking toward or away from the camera: legs alternate in length
      const la = 1 - 0.07 * Math.max(0, Math.sin(legs.phase));
      const lb = 1 - 0.07 * Math.max(0, -Math.sin(legs.phase));
      return (
        <g>
          <g transform="translate(-20 0)"><LegShape look={look} hipRot={0} knee={0} len={la} side={-1} /></g>
          <g transform="translate(20 0)"><LegShape look={look} hipRot={0} knee={0} len={lb} side={1} /></g>
        </g>
      );
    }
    return (
      <g>
        <g transform="translate(-3 0)"><LegShape look={look} hipRot={-a} knee={kneeB} side={-1} /></g>
        <g transform="translate(3 0)"><LegShape look={look} hipRot={a} knee={kneeA} side={1} /></g>
      </g>
    );
  }
  const sp = legs.spread ?? 0;
  return (
    <g>
      <g transform={`translate(${-20 - sp} 0)`}><LegShape look={look} hipRot={sp * 0.15} knee={0} side={-1} /></g>
      <g transform={`translate(${20 + sp} 0)`}><LegShape look={look} hipRot={-sp * 0.15} knee={0} side={1} /></g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------
// The whole person

export const PELVIS_STAND = -236;
export const PELVIS_SIT = -128;

export type PersonProps = {
  look: Look;
  pose?: Pose;
  x?: number;
  y?: number;
  scale?: number;
  flip?: boolean;
  /** Mouth openness override (lip-sync). */
  lipOpen?: number;
  /** Frame for blinks/breathing; defaults to the current frame. */
  frame?: number;
};

export const Person: React.FC<PersonProps> = ({ look, pose = {}, x = 0, y = 0, scale = 1, flip, lipOpen, frame: frameProp }) => {
  const cur = useCurrentFrame();
  const frame = frameProp ?? cur;
  const view = pose.view ?? 'front';
  const legs = pose.legs ?? { kind: 'stand' };
  const top = { ...look.top, ...(pose.top ?? {}) } as Look['top'];
  const seed = pose.seed ?? look.id.length;
  const br = breath(frame, seed) * (pose.breathe ?? 1);
  const pelvisY = pose.pelvisY ?? (legs.kind === 'sit' ? PELVIS_SIT : PELVIS_STAND);
  const bob = legs.kind === 'walk' ? -Math.abs(Math.cos(legs.phase)) * 4 : 0;
  const shrug = (pose.shrug ?? 0) * -6 + br * -0.8;
  const S = look.build.shoulder;
  const armL = pose.armL ?? { sh: 6, el: 6, hand: 'relaxed' };
  const armR = pose.armR ?? { sh: 6, el: 6, hand: 'relaxed' };
  const turn = pose.turn ?? 0;
  // A turned body narrows a little.
  const bodySx = 1 - Math.abs(turn) * 0.12;
  const headT = `translate(0 ${-148 + shrug * 0.5}) rotate(${pose.headTilt ?? 0}) translate(0 ${-30 + (pose.headPitch ?? 0) * 0.12}) scale(1 ${1 - Math.abs(pose.headPitch ?? 0) * 0.004})`;
  const arms = (behind: boolean) => (
    <g>
      {!!armL.behind === behind && <Arm side={-1} pose={armL} look={look} top={top} x={-S + 8} y={-121 + shrug} />}
      {!!armR.behind === behind && <Arm side={1} pose={armR} look={look} top={top} x={S - 8} y={-121 + shrug} />}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <g transform={`translate(0 ${pelvisY + bob})`}>
        <LegsDraw look={look} legs={legs} />
        <g transform={`rotate(${pose.lean ?? 0}) scale(${bodySx} ${1 + br * 0.004})`}>
          {view === 'front' && (
            <g transform={headT}>
              <g transform={`scale(${1 / bodySx} 1)`}>
                <HeadBackHair look={look} frame={frame} seed={seed} />
              </g>
            </g>
          )}
          {arms(true)}
          <Torso look={look} top={top} view={view} breathe={br} />
          <g transform={headT}>
            <g transform={`scale(${1 / bodySx} 1)`}>
              <Head look={look} pose={{ ...pose, seed }} frame={frame} lipOpen={lipOpen} />
            </g>
          </g>
          {arms(false)}
        </g>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------
// Two-bone IK: place a wrist at a point in the upper body's frame (origin at the pelvis).

export const shoulderOf = (look: Look, side: -1 | 1, shrug = 0) => ({ x: side * (look.build.shoulder - 8), y: -121 - shrug * 6 });

export const reach = (
  look: Look,
  side: -1 | 1,
  tx: number,
  ty: number,
  opts: { fore?: number; hand?: HandShape; wr?: number; hold?: React.ReactNode; shrug?: number; elbowIn?: boolean; elbow?: 'down' | 'up' | 'out' | 'in'; behind?: boolean } = {},
): ArmPose => {
  const sh = shoulderOf(look, side, opts.shrug ?? 0);
  const l1 = UPPER * (1 - (opts.fore ?? 0));
  const l2 = FORE;
  const dx = tx - sh.x;
  const dy = ty - sh.y;
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 1), l1 + l2 - 0.5);
  const a = Math.atan2(dy, dx);
  const b = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  const cands = [a + b, a - b].map((ang) => ({ x: sh.x + l1 * Math.cos(ang), y: sh.y + l1 * Math.sin(ang) }));
  // elbows hang down by default; 'out' / 'in' / 'up' choose the other solution on request
  const mode = opts.elbow ?? (opts.elbowIn ? 'in' : 'down');
  const score = (p: { x: number; y: number }) => (mode === 'down' ? p.y : mode === 'up' ? -p.y : mode === 'out' ? side * p.x : -side * p.x);
  const e = cands.sort((p, q) => score(q) - score(p))[0];
  const deg = (r: number) => (r * 180) / Math.PI;
  const r1 = deg(Math.atan2(-(e.x - sh.x), e.y - sh.y));
  const ux = tx - e.x;
  const uy = ty - e.y;
  const r2 = deg(Math.atan2(-ux, uy));
  let rel = r2 - r1;
  while (rel > 180) rel -= 360;
  while (rel < -180) rel += 360;
  return side === -1
    ? { sh: r1, el: -rel, fore: opts.fore, hand: opts.hand, wr: opts.wr, hold: opts.hold, behind: opts.behind }
    : { sh: -r1, el: rel, fore: opts.fore, hand: opts.hand, wr: opts.wr, hold: opts.hold, behind: opts.behind };
};

/** Convert a world point to a person's upper-body frame (for `reach`). */
export const toBody = (p: { x: number; y: number; scale?: number; pelvisY?: number; lean?: number; flip?: boolean }, wx: number, wy: number) => {
  const sc = p.scale ?? 1;
  const px = p.x;
  const py = p.y + (p.pelvisY ?? PELVIS_STAND) * sc;
  let lx = (wx - px) / sc;
  const ly = (wy - py) / sc;
  if (p.flip) lx = -lx;
  const r = (-(p.lean ?? 0) * Math.PI) / 180;
  return { x: lx * Math.cos(r) - ly * Math.sin(r), y: lx * Math.sin(r) + ly * Math.cos(r) };
};
