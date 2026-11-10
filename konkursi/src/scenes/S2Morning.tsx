// Scene 2 — Mëngjesi. Two mornings in perfect sync: every shot is one component rendered
// for Suela (left) and Era (right) on the same frames.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { INSTITUTION_NAME } from '../config';
import { Phone } from '../devices/Phone';
import { View } from '../devices/View';
import { EASE, kf, ks, lerp, prog, s } from '../lib/anim';
import { Hand, Person, PELVIS_STAND, reach, toBody } from '../rig/Person';
import { ERA, SUELA } from '../rig/cast';
import { BathroomBack, Bedspread, BedroomBack, HALL, HallDoor, HallwayBack, KitchenCounter, MirrorRoom, Sink, Splash, WardrobeFrame, Who } from '../sets/Apartment';
import { Light } from '../sets/Light';
import { Folder, FolderEdge } from '../sets/Props';
import { TXT } from '../text';
import { EVENTS, SHOTS } from '../timeline';
import { SplitShot, useAt } from './kit';

const lookOf = (who: Who) => (who === 'suela' ? SUELA : ERA);
const PYJAMA = '#B9C6D8';

// 0:08–0:12 — the alarm, top-down on the bedside table
const Alarm: React.FC<{ who: Who }> = () => {
  const frame = useCurrentFrame();
  const at = useAt('s2', SHOTS.s2.alarm);
  const flip = at(EVENTS.alarmFlip);
  const swipe = at(EVENTS.alarmSwipe);
  const drag = prog(frame, swipe, swipe + s(0.5));
  const screen =
    frame < flip
      ? ({ kind: 'lock', time: '06:59' } as const)
      : drag < 1
        ? ({ kind: 'alarm', time: '07:00', swipe: drag } as const)
        : ({ kind: 'lock', time: '07:00' } as const);
  // hand: in from the bottom right, finger on the slider, drag, out
  const hx = kf(frame, [[swipe - s(0.5), 980], [swipe, 372], [swipe + s(0.5), 600], [swipe + s(0.9), 1000]]);
  const hy = kf(frame, [[swipe - s(0.5), 1200], [swipe, 850], [swipe + s(0.5), 832], [swipe + s(0.9), 1220]]);
  return (
    <AbsoluteFill>
      <View cam={{ cx: 480, cy: 540, zoom: 1 }} bg="#9C7350">
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={0} y={i * 82} width={960} height={3} fill="#8A6444" opacity={0.6} />
        ))}
        <circle cx={70} cy={90} r={150} fill="#D9C7A6" />
        <circle cx={70} cy={90} r={110} fill="#E8DCC4" />
        <rect x={700} y={60} width={220} height={300} rx={8} fill="#3D5A80" transform="rotate(8 810 210)" />
        <rect x={712} y={70} width={30} height={280} fill="#2E4566" transform="rotate(8 810 210)" />
        <ellipse cx={220} cy={840} rx={70} ry={70} fill="#FFFFFF" opacity={0.35} />
        <Phone screen={screen} vibrate={frame >= flip && drag < 0.05} x={480} y={560} scale={1.2} rotate={-6} />
        <g transform={`translate(${hx} ${hy}) rotate(150)`}>
          <rect x={-30} y={-420} width={60} height={420} rx={30} fill={PYJAMA} />
          <g transform="scale(4.6)">
            <Hand skin={SUELA.skin} shade={SUELA.skinShade} shape="point" side={-1} />
          </g>
        </g>
      </View>
      <Light kind="morning" />
    </AbsoluteFill>
  );
};

// 0:12–0:16 — sits up in bed, stretches, rubs her eyes
const Bed: React.FC<{ who: Who }> = ({ who }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const look = lookOf(who);
  const lean = ks(frame, [[0.1, -82], [1.5, 0]]);
  const stretch = prog(frame, s(1.5), s(2.1)) - prog(frame, s(2.6), s(3.0));
  const rub = prog(frame, s(2.9), s(3.2)) - prog(frame, s(3.75), s(4.0));
  const rubWiggle = Math.sin(t * 22) * 3 * rub;
  const down = { sh: 8, el: 18, hand: 'relaxed' as const };
  const up = { sh: 168, el: 12, hand: 'open' as const };
  const eyeL = reach(look, -1, -10 + rubWiggle, -168, { fore: 0.5, hand: 'fist' });
  const eyeR = reach(look, 1, 10 - rubWiggle, -168, { fore: 0.5, hand: 'fist' });
  const mixArm = (a: typeof down, b: typeof up, c: typeof eyeL) => ({
    sh: lerp(lerp(a.sh, b.sh, stretch), c.sh, rub),
    el: lerp(lerp(a.el, b.el, stretch), c.el, rub),
    fore: (c.fore ?? 0) * rub,
    hand: rub > 0.5 ? 'fist' : stretch > 0.5 ? 'open' : 'relaxed',
  });
  const lid = Math.max(ks(frame, [[0, 1], [0.9, 1], [1.4, 0.45], [1.6, 0.85], [2.7, 0.85], [3.0, 0.4], [4, 0.25]]), 0);
  return (
    <AbsoluteFill>
      <View cam={{ cx: -215, cy: -350, zoom: 3.3 }}>
        <BedroomBack who={who} />
        <Person
          look={look}
          x={-205}
          y={-186 - PELVIS_STAND}
          pose={{
            legs: { kind: 'none' },
            lean,
            top: { kind: 'blouse', inner: PYJAMA, innerShade: '#9DAAC0' },
            armL: mixArm(down, up, eyeL) as never,
            armR: mixArm(down, up, eyeR) as never,
            shrug: stretch * 0.9,
            headTilt: stretch * -6,
            face: { lid, open: stretch * 0.75, squint: stretch * 0.6, smile: stretch * -0.2, browL: stretch * 0.3, browR: stretch * 0.3 },
          }}
        />
        <Bedspread who={who} />
      </View>
      <Light kind="morning" />
    </AbsoluteFill>
  );
};

// 0:16–0:21 — splash at the sink; we are the mirror
const Bath: React.FC<{ who: Who }> = ({ who }) => {
  const frame = useCurrentFrame();
  const look = lookOf(who);
  const cup = prog(frame, s(0.4), s(1.0)) - prog(frame, s(1.7), s(2.3));
  const bend = ks(frame, [[0, 0], [0.5, 1], [1.0, 0.6], [1.8, 0.6], [2.3, 0]]);
  const sinkL = reach(look, -1, -34, -40, { hand: 'open' });
  const sinkR = reach(look, 1, 34, -40, { hand: 'open' });
  const faceL = reach(look, -1, -7, -168, { fore: 0.55, hand: 'grip' });
  const faceR = reach(look, 1, 7, -168, { fore: 0.55, hand: 'grip' });
  const arm = (a: typeof sinkL, b: typeof faceL) => ({ sh: lerp(a.sh, b.sh, cup), el: lerp(a.el, b.el, cup), fore: (b.fore ?? 0) * cup, hand: cup > 0.4 ? ('grip' as const) : ('open' as const) });
  const breathe = prog(frame, s(2.8), s(3.5)) - prog(frame, s(3.9), s(4.7));
  return (
    <AbsoluteFill>
      <View cam={{ cx: 0, cy: -372, zoom: 3.4 }}>
        <BathroomBack />
        <Person
          look={look}
          y={bend * 18}
          pose={{
            headPitch: bend * 14,
            armL: arm(sinkL, faceL),
            armR: arm(sinkR, faceR),
            shrug: breathe * 1.1,
            top: { kind: 'blouse' },
            face: { lid: Math.max(cup, breathe * 0.6), lookY: bend * 0.4, open: breathe * 0.12, browL: breathe * 0.2, browR: breathe * 0.2 },
          }}
        />
        <Splash x={0} y={-360} t={(frame - s(0.85)) / s(0.6)} />
        <Sink />
      </View>
      <Light kind="morning" amount={0.8} />
    </AbsoluteFill>
  );
};

// 0:21–0:26 — the blazer in the wardrobe mirror
const Wardrobe: React.FC<{ who: Who }> = ({ who }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const look = lookOf(who);
  const on = prog(frame, s(1.1), s(1.7));
  const collar = prog(frame, s(1.7), s(2.1)) - prog(frame, s(3.6), s(4.1));
  const back = 1 - prog(frame, s(1.0), s(1.6));
  const tug = Math.sin(t * 15) * 3 * collar;
  const behindArm = (side: -1 | 1) => ({ sh: -18, el: 24, hand: 'relaxed' as const, behind: true, wr: 0, fore: 0, side });
  const atCollar = (side: -1 | 1) => reach(look, side, side * 15, -142 + tug, { fore: 0.35, hand: 'grip' });
  const restArm = { sh: 7, el: 10, hand: 'relaxed' as const };
  const armFor = (side: -1 | 1) => {
    if (back > 0.5) return behindArm(side);
    const c = atCollar(side);
    return { sh: lerp(restArm.sh, c.sh, collar), el: lerp(restArm.el, c.el, collar), fore: (c.fore ?? 0) * collar, hand: collar > 0.4 ? ('grip' as const) : ('relaxed' as const) };
  };
  const pose = {
    armL: armFor(-1),
    armR: armFor(1),
    shrug: back * 0.6 + Math.sin(on * Math.PI) * 0.5,
    face: { lookY: collar * 0.5, smile: prog(frame, s(4.0), s(4.6)) * 0.25 },
    headPitch: collar * 8,
  };
  const reveal = -470 + on * 560;
  const clip = `blazer-${who}`;
  return (
    <AbsoluteFill>
      <View cam={{ cx: 0, cy: -320, zoom: 2.15 }}>
        <MirrorRoom who={who} />
        <Person look={look} pose={{ ...pose, top: { kind: 'blouse' } }} />
        <defs>
          <clipPath id={clip}>
            <rect x={-400} y={-480} width={800} height={reveal + 480} />
          </clipPath>
        </defs>
        {on > 0 && (
          <g clipPath={`url(#${clip})`}>
            <Person look={look} pose={pose} />
          </g>
        )}
        <WardrobeFrame />
      </View>
      <Light kind="morning" amount={0.7} />
    </AbsoluteFill>
  );
};

// 0:26–0:31 — coffee and the invitation email
const Kitchen: React.FC<{ who: Who }> = ({ who }) => {
  const frame = useCurrentFrame();
  const look = lookOf(who);
  const rise = 1 - prog(frame, 0, s(0.7));
  const py = 560 + rise * 260;
  return (
    <AbsoluteFill>
      <View cam={{ cx: 480, cy: 540, zoom: 1 }}>
        <KitchenCounter who={who} steam={Math.sin(frame / 12)} />
        <g transform={`translate(0 ${rise * 260})`}>
          <path d="M 300 1120 L 360 860 L 470 860 L 470 1120 Z" fill="#1D3557" />
          <rect x={352} y={848} width={124} height={26} rx={8} fill="#FBFAF6" />
          <ellipse cx={420} cy={840} rx={70} ry={52} fill={look.skin} />
        </g>
        <Phone
          x={560}
          y={py}
          scale={1.05}
          rotate={-4}
          screen={{ kind: 'mail', sender: INSTITUTION_NAME, subject: TXT.ftese, body: who === 'suela' ? TXT.fteseSuela : TXT.fteseEra }}
        />
        <g transform={`translate(0 ${rise * 260})`}>
          <rect x={386} y={700} width={40} height={120} rx={20} fill={look.skin} transform="rotate(-14 406 760)" />
          <rect x={390} y={760} width={34} height={70} rx={17} fill={look.skinShade} opacity={0.4} transform="rotate(-14 406 760)" />
        </g>
      </View>
      <Light kind="morning" amount={0.8} />
    </AbsoluteFill>
  );
};

// 0:31–0:36 — touches the diploma, takes the folder, leaves; the door closes at 0:35
const Hallway: React.FC<{ who: Who }> = ({ who }) => {
  const frame = useCurrentFrame();
  const at = useAt('s2', SHOTS.s2.hallway);
  const close = at(EVENTS.doorClose);
  const look = lookOf(who);
  const t = frame / 30;
  // walk from the desk to the door, through it, then out of sight behind the wall
  const x = kf(frame, [[s(1.9), -100], [s(3.0), 150], [s(3.4), 236], [close - s(0.55), 300], [close - s(0.35), 420]]);
  const walking = frame > s(1.9) && frame < close - s(0.35);
  const phase = (t - 1.9) * 8.5;
  const turn = kf(frame, [[0, -0.35], [s(1.6), -0.35], [s(2.0), 0.6]]);
  const inside = frame > s(3.25);
  const scale = inside ? kf(frame, [[s(3.25), 1], [close - s(0.4), 0.92]]) : 1;
  const doorOpen = kf(frame, [[s(2.6), 0], [s(3.1), 1], [close - s(0.5), 1], [close, 0]]);
  const touch = prog(frame, s(0.3), s(0.8)) - prog(frame, s(1.2), s(1.5));
  const pick = prog(frame, s(1.2), s(1.55));
  const carried = frame > s(1.55);
  const handle = prog(frame, s(2.5), s(2.75)) - prog(frame, s(2.95), s(3.15));
  const place = { x, y: 0, scale };
  const dip = toBody(place, HALL.diploma.x + 74, HALL.diploma.y + 52);
  const desk = toBody(place, -235, -232);
  const hdl = toBody(place, 152, -300);
  const rest = { sh: 6, el: 12, hand: 'relaxed' as const };
  const tA = reach(look, -1, dip.x, dip.y, { hand: 'point' });
  const tD = reach(look, -1, desk.x, desk.y, { hand: 'grip' });
  const armL = carried
    ? { sh: 4, el: 28, hand: 'grip' as const, hold: <FolderEdge x={0} y={24} len={96} rotate={-8} /> }
    : touch > 0
      ? { sh: lerp(rest.sh, tA.sh, touch), el: lerp(rest.el, tA.el, touch), hand: 'point' as const }
      : { sh: lerp(rest.sh, tD.sh, Math.sin(pick * Math.PI)), el: lerp(rest.el, tD.el, Math.sin(pick * Math.PI)), hand: 'grip' as const };
  const tH = reach(look, 1, hdl.x, hdl.y, { hand: 'grip' });
  const armR = handle > 0 ? { sh: lerp(rest.sh, tH.sh, handle), el: lerp(rest.el, tH.el, handle), hand: 'grip' as const } : walking ? { sh: 6 + Math.sin(phase) * 8, el: 14, hand: 'relaxed' as const } : rest;
  const clip = `doorway-${who}`;
  const person = (
    <Person
      look={look}
      x={x}
      scale={scale}
      pose={{
        turn,
        legs: walking ? { kind: 'walk', phase, stride: 20 } : { kind: 'stand' },
        armL,
        armR,
        lean: touch * -4,
        face: { lookX: frame < s(1.7) ? -0.7 : 0.6, lookY: touch * -0.6 + pick * 0.8, smile: touch * 0.15 },
        headPitch: pick * 10 - touch * 6,
      }}
    />
  );
  return (
    <AbsoluteFill>
      <View cam={{ cx: 0, cy: -340, zoom: 1.42 }}>
        <HallwayBack folderOnDesk={!carried && pick < 0.9} />
        {/* the corner she straightens */}
        <defs>
          <clipPath id={clip}>
            <rect x={HALL.door.x0} y={HALL.door.top} width={HALL.door.x1 - HALL.door.x0} height={-HALL.door.top + 2} />
          </clipPath>
        </defs>
        {frame < close - s(0.3) && (inside ? <g clipPath={`url(#${clip})`}>{person}</g> : person)}
        <HallDoor open={doorOpen} />
        {!carried && pick > 0.2 && pick < 0.9 && <Folder x={-235} y={-236} w={110} h={14} />}
      </View>
      <Light kind="morning" amount={0.7} />
    </AbsoluteFill>
  );
};

const both = (C: React.FC<{ who: Who }>) => ({ left: <C who="suela" />, right: <C who="era" /> });

export const Scene2: React.FC = () => (
  <>
    <SplitShot scene="s2" span={SHOTS.s2.alarm} {...both(Alarm)} wipeIn name="2 alarm" />
    <SplitShot scene="s2" span={SHOTS.s2.bed} {...both(Bed)} name="2 bed" />
    <SplitShot scene="s2" span={SHOTS.s2.bath} {...both(Bath)} name="2 bath" />
    <SplitShot scene="s2" span={SHOTS.s2.wardrobe} {...both(Wardrobe)} name="2 wardrobe" />
    <SplitShot scene="s2" span={SHOTS.s2.kitchen} {...both(Kitchen)} name="2 kitchen" />
    <SplitShot scene="s2" span={SHOTS.s2.hallway} {...both(Hallway)} wipeOut name="2 hallway" />
  </>
);

export const Scene1: React.FC = () => <AbsoluteFill style={{ background: '#000' }} />;
void EASE;
