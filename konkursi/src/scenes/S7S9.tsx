// Scene 7 — Pas intervistave, Scene 8 — Rezultati, Scene 9 — Mbyllja.
import React from 'react';
import { AbsoluteFill, Freeze, useCurrentFrame } from 'remotion';
import { FREEZE_DESATURATION, INSTITUTION_NAME, PALETTE } from '../config';
import { Phone } from '../devices/Phone';
import { ShotCtx, View } from '../devices/View';
import { kf, ks, lerp, prog, s } from '../lib/anim';
import { Hand, Person, PELVIS_SIT, PELVIS_STAND, reach, toBody } from '../rig/Person';
import { ERA, KRYETARI, QEMAJLI, SUELA, extra } from '../rig/cast';
import { HallwayBack, HALL } from '../sets/Apartment';
import { CAFE, CafeChairBack, CafeChairSeat, CafeRoom, CafeTable } from '../sets/Cafe';
import { BusInterior, BusSeat, StreetPerspective } from '../sets/City';
import { BuildingFront, CoatOnStand, Corridor } from '../sets/Institution';
import { Light } from '../sets/Light';
import { Folder, FolderEdge, Glass } from '../sets/Props';
import { TXT } from '../text';
import { EVENTS, SCENES, SHOTS } from '../timeline';
import { REST, Stage, mixArm, sitY, talk, walkPath } from './common';
import { SplitShot, useShotSpan, useTl } from './kit';

const underArm = { sh: 2, el: 36, hand: 'grip' as const, hold: <FolderEdge x={0} y={10} len={96} rotate={70} /> };

// ---------------------------------------------------------------------------------------
// Scene 7

const S7aL: React.FC = () => {
  const frame = useCurrentFrame();
  const w = walkPath(frame, [[0.3, 0], [3.3, 380]], 0.12);
  const y = ks(frame, [[0.6, -150], [3.0, 0]]);
  const scale = ks(frame, [[0.3, 0.96], [3.3, 1.05]]);
  const breathIn = prog(frame, s(3.8), s(4.8)) - prog(frame, s(5.3), s(6.3));
  return (
    <Stage cam={{ cx: 140, cy: -560, zoom: 0.85 }} light="midday">
      <BuildingFront light="midday" />
      <Person
        look={SUELA}
        x={w.x}
        y={y}
        scale={scale}
        pose={{
          turn: w.moving ? 0.45 : 0.15,
          legs: w.moving ? { kind: 'walk', phase: w.phase } : { kind: 'stand' },
          armL: underArm,
          armR: w.moving ? { sh: 6 + Math.sin(w.phase) * 9, el: 14, hand: 'relaxed' } : REST,
          shrug: breathIn * 1.1,
          headPitch: breathIn * -8,
          face: { lid: breathIn * 0.75, open: breathIn * 0.15, browL: breathIn * 0.25, browR: breathIn * 0.25, smile: prog(frame, s(6.0), s(6.8)) * 0.2 },
        }}
      />
    </Stage>
  );
};

const S7aR: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const lock = prog(frame, s(0.3), s(0.8)) - prog(frame, s(2.2), s(2.6));
  const w = walkPath(frame, [[2.6, -70], [3.7, 330]]);
  const facing = frame > s(2.5);
  const coatOn = prog(frame, s(4.2), s(5.2));
  const collar = prog(frame, s(5.3), s(5.7)) - prog(frame, s(6.3), s(6.8));
  const keyBody = toBody({ x: -70, y: 0 }, -23, -252);
  const pose = {
    view: facing ? ('front' as const) : ('back' as const),
    turn: w.moving ? 0.5 : facing ? -0.2 : 0,
    legs: w.moving ? ({ kind: 'walk', phase: w.phase } as const) : ({ kind: 'stand' } as const),
    armR: facing
      ? collar > 0
        ? reach(KRYETARI, 1, 16, -146, { fore: 0.35, hand: 'grip' })
        : mixArm(REST, { sh: 30, el: 60, hand: 'grip' }, prog(frame, s(3.7), s(4.1)) - coatOn)
      : mixArm(REST, reach(KRYETARI, 1, keyBody.x, keyBody.y, { hand: 'grip', wr: Math.sin(t * 6) * 20 }), lock),
    armL: collar > 0 ? reach(KRYETARI, -1, -16, -146, { fore: 0.35, hand: 'grip' }) : coatOn > 0 && coatOn < 1 ? { sh: -20, el: 30, hand: 'relaxed' as const, behind: true } : REST,
    shrug: Math.sin(coatOn * Math.PI) * 0.6,
    face: { lid: 0.2, smile: 0.25 },
  };
  const clip = 'coat-on';
  return (
    <Stage cam={{ cx: 90, cy: -400, zoom: 1.45 }} light="cool">
      <Corridor time="16:00" />
      {frame < s(4.0) && <CoatOnStand />}
      <Person look={KRYETARI} x={w.x} pose={pose} />
      <defs>
        <clipPath id={clip}>
          <rect x={-800} y={-480} width={1600} height={coatOn * 700} />
        </clipPath>
      </defs>
      {coatOn > 0 && (
        <g clipPath={`url(#${clip})`}>
          <Person look={KRYETARI} x={w.x} pose={{ ...pose, top: { kind: 'coat', color: '#4A4E57', shade: '#383B42' } }} />
        </g>
      )}
    </Stage>
  );
};

const COAT = { kind: 'coat' as const, color: '#4A4E57', shade: '#383B42' };

const S7bL: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const phase = t * 6.2;
  return (
    <AbsoluteFill>
      <View cam={{ cx: 480, cy: 540, zoom: 1 }}>
        <StreetPerspective travel={t * 1.7} />
        {[0, 1].map((i) => {
          const d = 40 - ((t * 2.6 + i * 18) % 36);
          const sc = 12 / Math.max(4, d);
          return <Person key={i} look={extra(i + 1)} x={480 + (i ? 1 : -1) * 250 * sc} y={454 + 300 * sc * 0.9} scale={0.16 * sc} pose={{ legs: { kind: 'walk', phase: t * 7 + i, depth: true }, armL: { sh: 6 + Math.sin(t * 7 + i) * 8, el: 12 } }} />;
        })}
        <Person
          look={SUELA}
          x={480}
          y={1250 + Math.abs(Math.cos(phase)) * 6}
          scale={2.25}
          pose={{ view: 'back', legs: { kind: 'walk', phase, depth: true }, armL: underArm, armR: { sh: 6 + Math.sin(phase) * 6, el: 12, hand: 'relaxed' } }}
        />
      </View>
      <Light kind="midday" />
    </AbsoluteFill>
  );
};

const S7bR: React.FC = () => {
  const frame = useCurrentFrame();
  const w = walkPath(frame, [[0.4, 0], [6.6, -900]], 0.11);
  const y = ks(frame, [[0.6, -150], [2.6, 0]]);
  return (
    <Stage cam={{ cx: -140, cy: -560, zoom: 0.85 }} light="afternoon" lightAmount={0.9}>
      <BuildingFront light="afternoon" />
      <Person
        look={KRYETARI}
        x={w.x}
        y={y}
        pose={{ top: COAT, turn: -0.5, legs: w.moving ? { kind: 'walk', phase: w.phase } : { kind: 'stand' }, armL: { sh: 6 + Math.sin(w.phase) * 9, el: 12 }, armR: { sh: 6 - Math.sin(w.phase) * 9, el: 12 }, face: { smile: 0.3 } }}
      />
    </Stage>
  );
};

const S7cL: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const dusk = prog(frame, s(0.5), s(6.8));
  return (
    <AbsoluteFill>
      <View cam={{ cx: 480, cy: 540, zoom: 1 }}>
        <BusInterior slide={t * 160} dusk={dusk} pillarX={300} />
        <BusSeat x={500} y={1000} s={2.1} />
        <Person
          look={SUELA}
          x={470}
          y={1000 + 128 * 2.1 - 128 * 2.1}
          scale={2.1}
          pose={{
            legs: { kind: 'sit' },
            turn: -0.35,
            headTilt: -13,
            lean: -3,
            armL: reach(SUELA, -1, -18, -52, { fore: 0.5, hand: 'relaxed', hold: <FolderEdge x={0} y={10} len={96} rotate={90} /> }),
            armR: reach(SUELA, 1, 20, -48, { fore: 0.5, hand: 'relaxed' }),
            face: { lookX: -0.9, lid: 0.35, worry: 0.15 },
          }}
        />
      </View>
      <Light kind="dusk" amount={dusk * 0.7} />
    </AbsoluteFill>
  );
};

const Bar: React.FC<{ cam: { cx: number; cy: number; zoom: number }; children: React.ReactNode; table?: React.ReactNode }> = ({ cam, children, table }) => (
  <Stage cam={cam} light="amber">
    <CafeRoom night />
    <CafeChairBack x={CAFE.seatEra - 30} />
    <CafeChairBack x={CAFE.seatQ + 30} />
    <CafeChairSeat x={CAFE.seatEra} />
    <CafeChairSeat x={CAFE.seatQ} />
    {children}
    <CafeTable night>{table}</CafeTable>
  </Stage>
);

const S7cR: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const wave = prog(frame, s(1.5), s(2.0)) - prog(frame, s(5.5), s(6.2));
  return (
    <Bar cam={{ cx: -60, cy: -420, zoom: 0.95 }} table={<Glass x={20} y={-214} s={0.7} level={0.7} />}>
      <Person
        look={QEMAJLI}
        x={CAFE.seatQ}
        pose={{ legs: { kind: 'sit' }, turn: 0.3, armR: mixArm(REST, { sh: 120, el: 40, hand: 'open', wr: Math.sin(t * 10) * 25 }, wave), face: { smile: 0.9, teeth: wave > 0.5, lookX: 0.7, browL: 0.3, browR: 0.3 } }}
      />
    </Bar>
  );
};

const DeskChair: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-46} y={-140} width={92} height={18} rx={6} fill="#5E4A38" />
    <rect x={-40} y={-122} width={8} height={122} fill="#4A3A2C" />
    <rect x={32} y={-122} width={8} height={122} fill="#4A3A2C" />
    <rect x={30} y={-330} width={12} height={200} rx={4} fill="#4A3A2C" />
  </g>
);

/** Suela at the hallway desk in the evening, under her diploma. */
const DeskScene: React.FC<{ frame: number; folderClose?: number; phase: 'wait' | 'read' | 'after'; cam?: { cx: number; cy: number; zoom: number }; to?: { cx: number; cy: number; zoom: number } }> = ({ frame, folderClose = 0, phase, cam = { cx: -130, cy: -370, zoom: 2.0 }, to }) => {
  const t = frame / 30;
  const glance = phase === 'wait' ? (Math.sin(t * 0.9) > 0.6 ? 1 : 0) : 0;
  const lookUp = phase === 'after' ? prog(frame, s(0.0), s(0.6)) - prog(frame, s(1.8), s(2.4)) : 0;
  const close = folderClose;
  const sx = -14;
  const place = { x: sx, y: 0, pelvisY: PELVIS_SIT };
  const folderHand = toBody(place, -150 + 40 * (1 - close), -238);
  const phoneHand = { x: -10, y: -70 };
  const holdPhone = phase !== 'after' || close < 0.05;
  return (
    <Stage cam={cam} to={to} moveFrom={0} moveTo={s(9)} light="dusk" lightAmount={0.85}>
      <HallwayBack evening lamp={1} folderOnDesk={false} />
      {/* the folder on the desk, its cover closing */}
      <g>
        <Folder x={-150} y={-236} w={120} h={12} />
        <g transform={`translate(-210 -236) scale(${lerp(-1, 1, close)} 1)`}>
          <rect x={0} y={-8} width={120} height={10} rx={2} fill={close > 0.5 ? PALETTE.navy : '#FFFFFF'} />
        </g>
      </g>
      <DeskChair x={sx} />
      <Person
        look={SUELA}
        x={sx}
        pose={{
          legs: { kind: 'sit' },
          turn: -0.55,
          headPitch: phase === 'after' ? lerp(8, -10, lookUp) + close * 14 : glance ? -6 : 12,
          armL: phase === 'after' && close > 0 ? reach(SUELA, -1, folderHand.x, folderHand.y, { hand: 'flat', wr: -30 }) : reach(SUELA, -1, -24, -64, { fore: 0.5, hand: 'grip' }),
          armR: holdPhone ? reach(SUELA, 1, phoneHand.x + 20, phoneHand.y + 4, { fore: 0.5, hand: 'grip', hold: <Phone x={-2} y={30} scale={0.11} rotate={180} screen={{ kind: 'back' }} /> }) : REST,
          face: {
            lookX: phase === 'after' ? lerp(-0.2, -0.85, lookUp) : glance ? -0.8 : 0.2,
            lookY: phase === 'after' ? lerp(0.6, -0.9, lookUp) + close * 1.2 : glance ? -0.6 : 0.85,
            worry: phase === 'wait' ? 0.2 : 0.45,
            smile: phase === 'after' ? -0.25 : 0,
            lid: phase === 'after' ? 0.25 : 0.1,
          },
        }}
      />
      {void HALL}
    </Stage>
  );
};

const S7dL: React.FC = () => {
  const frame = useCurrentFrame();
  return <DeskScene frame={frame} phase="wait" />;
};

/** The chair and Qemajli at the bar: hug, sit, toast. */
const S7dR: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const w = walkPath(frame, [[0, 260], [1.3, -110]]);
  const hug = prog(frame, s(1.2), s(1.7)) - prog(frame, s(2.9), s(3.3));
  const qStand = prog(frame, s(0.6), s(1.3)) - prog(frame, s(3.3), s(4.3));
  const chairSit = prog(frame, s(3.6), s(4.6));
  const cx = frame < s(3.3) ? w.x : lerp(-110, CAFE.seatEra, prog(frame, s(3.3), s(3.8)));
  const qx = lerp(CAFE.seatQ, -10, qStand);
  const grab = prog(frame, s(4.5), s(4.9));
  const lift = prog(frame, s(4.9), s(5.5));
  const toast = prog(frame, s(5.8), s(6.6));
  const clink = Math.max(0, 1 - Math.abs(t - 6.8) / 0.25);
  const gy = lerp(-216, lerp(-300, -360, toast), lift);
  const gC = { x: lerp(-150, -95, toast) + clink * 6, y: gy };
  const gQ = { x: lerp(20, -45, toast) - clink * 6, y: gy };
  const chairPlace = { x: cx, y: 0, pelvisY: sitY(chairSit) };
  const qPlace = { x: qx, y: 0, pelvisY: sitY(1 - qStand) };
  const pat = Math.sin(t * 14) * 6;
  const hugArmChair = reach(KRYETARI, 1, toBody(chairPlace, qx + 30, -350).x, toBody(chairPlace, qx + 30, -350).y, { hand: 'open', elbowIn: true });
  const hugArmQ = reach(QEMAJLI, -1, toBody(qPlace, cx - 30, -346 + pat).x, toBody(qPlace, cx - 30, -346 + pat).y, { hand: 'open', elbowIn: true });
  const glassArm = (look: typeof KRYETARI, place: typeof chairPlace, side: -1 | 1, g: { x: number; y: number }) => {
    const b = toBody(place, g.x, g.y + 10);
    return reach(look, side, b.x, b.y, { fore: 0.3, hand: 'grip' });
  };
  const seated = frame > s(4.6);
  return (
    <Bar cam={{ cx: -60, cy: -380, zoom: 1.55 }} table={!seated || grab < 0.05 ? <><Glass x={-150} y={-214} s={0.7} level={0.7} /><Glass x={20} y={-214} s={0.7} level={0.7} /></> : undefined}>
      <Person
        look={KRYETARI}
        x={cx}
        pose={{
          top: COAT,
          pelvisY: chairPlace.pelvisY,
          legs: frame < s(1.3) ? { kind: 'walk', phase: w.phase } : chairSit > 0.5 ? { kind: 'sit' } : { kind: 'stand' },
          turn: seated ? 0.45 : -0.2 + hug * 0.7,
          armR: seated ? mixArm(REST, glassArm(KRYETARI, chairPlace, 1, gC), grab) : mixArm(REST, hugArmChair, hug),
          armL: REST,
          face: { smile: 0.85, teeth: hug > 0.5 || clink > 0, squint: 0.3, open: seated && toast > 0.5 ? 0.3 : talk(frame, 4, 0.2) },
        }}
      />
      <Person
        look={QEMAJLI}
        x={qx}
        pose={{
          pelvisY: qPlace.pelvisY,
          legs: qStand > 0.5 ? { kind: 'stand' } : { kind: 'sit' },
          turn: seated ? -0.45 : -0.5,
          armL: seated ? mixArm(REST, glassArm(QEMAJLI, qPlace, -1, gQ), grab) : mixArm(REST, hugArmQ, hug),
          face: { smile: 0.95, teeth: true, squint: 0.4, open: 0.3 + talk(frame, 2, 0.2) },
        }}
      />
      {seated && grab >= 0.05 && (
        <>
          <Glass x={gC.x} y={gC.y} s={0.7} level={0.7} />
          <Glass x={gQ.x} y={gQ.y} s={0.7} level={0.7} />
        </>
      )}
    </Bar>
  );
};

export const Scene7: React.FC = () => (
  <>
    <SplitShot scene="s7" span={SHOTS.s7.a} left={<S7aL />} right={<S7aR />} wipeIn name="7a" />
    <SplitShot scene="s7" span={SHOTS.s7.b} left={<S7bL />} right={<S7bR />} name="7b" />
    <SplitShot scene="s7" span={SHOTS.s7.c} left={<S7cL />} right={<S7cR />} name="7c" />
    <SplitShot scene="s7" span={SHOTS.s7.d} left={<S7dL />} right={<S7dR />} name="7d" />
  </>
);

// ---------------------------------------------------------------------------------------
// Scene 8

const HandPhone: React.FC<{ look: typeof SUELA; sleeve: string; cuff?: string; watch?: string; screen: Parameters<typeof Phone>[0]['screen']; vibrate?: boolean; bg: React.ReactNode; light: 'dusk' | 'amber'; scale?: number }> = ({ look, sleeve, cuff, watch, screen, vibrate, bg, light, scale = 1.05 }) => (
  <AbsoluteFill>
    <View cam={{ cx: 480, cy: 540, zoom: 1 }}>
      {bg}
      <path d="M 300 1120 L 360 860 L 470 860 L 470 1120 Z" fill={sleeve} />
      {cuff && <rect x={352} y={848} width={124} height={26} rx={8} fill={cuff} />}
      {watch && <rect x={356} y={826} width={116} height={22} rx={8} fill={watch} />}
      <ellipse cx={420} cy={840} rx={70} ry={52} fill={look.skin} />
      <Phone x={560} y={560} scale={scale} rotate={-4} screen={screen} vibrate={vibrate} />
      <rect x={386} y={700} width={40} height={120} rx={20} fill={look.skin} transform="rotate(-14 406 760)" />
    </View>
    <Light kind={light} amount={0.6} />
  </AbsoluteFill>
);

const eveningBg = (
  <g>
    <rect width={960} height={1080} fill="#4A4F66" />
    <ellipse cx={200} cy={260} rx={260} ry={200} fill={PALETTE.lamp} opacity={0.25} />
    <rect x={0} y={760} width={960} height={320} fill="#6E5440" />
  </g>
);
const barBg = (
  <g>
    <rect width={960} height={1080} fill="#4C2F1E" />
    <ellipse cx={480} cy={200} rx={420} ry={220} fill={PALETTE.cafeAmber} opacity={0.22} />
  </g>
);

const S8aL: React.FC = () => <HandPhone look={SUELA} sleeve={PALETTE.navy} cuff="#FBFAF6" watch="#C9CED6" screen={{ kind: 'back' }} vibrate bg={eveningBg} light="dusk" scale={0.9} />;

const S8aR: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <View cam={{ cx: 480, cy: 540, zoom: 1 }}>
        <rect width={960} height={1080} fill="#3B2416" />
        <rect x={-20} y={300} width={1000} height={800} fill="#6E4A33" />
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-20} y={340 + i * 86} width={1000} height={3} fill="#4C2F1E" opacity={0.7} />)}
        <Glass x={190} y={720} s={3.6} level={0.6} />
        <Glass x={780} y={700} s={3.6} level={0.4} />
        <Phone x={480} y={690} scale={0.75} rotate={-78} screen={{ kind: 'back' }} vibrate={frame % 30 < 22} />
      </View>
      <Light kind="amber" amount={0.7} />
    </AbsoluteFill>
  );
};

const S8bL: React.FC = () => (
  <HandPhone look={SUELA} sleeve={PALETTE.navy} cuff="#FBFAF6" watch="#C9CED6" bg={eveningBg} light="dusk" screen={{ kind: 'mail', sender: INSTITUTION_NAME, subject: TXT.rezultati, body: TXT.rezultatiBody }} />
);

const S8bR: React.FC = () => {
  const frame = useCurrentFrame();
  return <HandPhone look={QEMAJLI} sleeve="#6B4429" watch="#D4A537" bg={barBg} light="amber" screen={{ kind: 'messages', contact: TXT.contactEra, bubble: TXT.bubbleEra, bubbleIn: prog(frame, s(0.3), s(0.8)) }} />;
};

const S8cL: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const cut = s(5.0);
  if (frame < cut) {
    // close-up: her eyes travel across the email twice, then rise to the diploma
    const pass = (a: number) => prog(frame, s(a), s(a + 1.8));
    const lookX = frame < s(2.4) ? lerp(-0.75, 0.75, pass(0.4)) : frame < s(4.2) ? lerp(-0.75, 0.75, pass(2.4)) : lerp(0.75, -0.8, prog(frame, s(4.2), s(4.7)));
    const up = prog(frame, s(4.2), s(4.7));
    return (
      <AbsoluteFill>
        <View cam={{ cx: -10, cy: -300, zoom: 4.4 }}>
          <HallwayBack evening lamp={1} folderOnDesk={false} />
          <Person
            look={SUELA}
            x={-30}
            pose={{
              legs: { kind: 'sit' },
              turn: -0.2,
              headPitch: lerp(12, -10, up),
              face: { lookX, lookY: lerp(0.8, -0.9, up), worry: 0.25 + up * 0.25, browL: up * 0.2, browR: up * 0.2, smile: -0.1 - up * 0.15 },
            }}
          />
          <ellipse cx={-20} cy={-280} rx={70} ry={50} fill="#DCEBFF" opacity={0.18 * (1 - up)} />
        </View>
        <Light kind="dusk" amount={0.8} />
      </AbsoluteFill>
    );
  }
  void t;
  return (
    <ShotCtx.Provider value={{ dur: s(5) }}>
      <DeskScene frame={frame - cut} phase="after" folderClose={prog(frame - cut, s(2.4), s(4.4))} />
    </ShotCtx.Provider>
  );
};

const S8cR: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const show = prog(frame, s(0.4), s(1.0)) - prog(frame, s(3.6), s(4.2));
  const laugh = prog(frame, s(1.4), s(1.9)) - prog(frame, s(5.0), s(5.6));
  const toast = prog(frame, s(5.6), s(6.6));
  const clink = Math.max(0, 1 - Math.abs(t - 6.9) / 0.25);
  const chairPlace = { x: CAFE.seatEra, y: 0, pelvisY: PELVIS_SIT };
  const qPlace = { x: CAFE.seatQ, y: 0, pelvisY: PELVIS_SIT };
  const gy = lerp(-300, -366, toast);
  const gC = { x: lerp(-150, -82, toast) + clink * 6, y: gy };
  const gQ = { x: lerp(20, -50, toast) - clink * 6, y: gy };
  const phoneAt = { x: lerp(10, -60, show), y: lerp(-290, -330, show) };
  const pb = toBody(qPlace, phoneAt.x + 10, phoneAt.y + 40);
  const gArm = (look: typeof KRYETARI, place: typeof chairPlace, side: -1 | 1, g: { x: number; y: number }) => {
    const b = toBody(place, g.x, g.y + 10);
    return reach(look, side, b.x, b.y, { fore: 0.3, hand: 'grip' });
  };
  const bounce = laugh * Math.abs(Math.sin(t * 9)) * 0.3;
  return (
    <Bar cam={{ cx: -70, cy: -370, zoom: 1.85 }}>
      <Person
        look={KRYETARI}
        x={chairPlace.x}
        pose={{
          top: COAT,
          legs: { kind: 'sit' },
          turn: 0.45,
          headPitch: -12 * laugh,
          shrug: bounce,
          armR: gArm(KRYETARI, chairPlace, 1, gC),
          face: { smile: 0.75 + laugh * 0.25, teeth: true, open: laugh * 0.7, squint: 0.3 + laugh * 0.4, lookX: 0.8, lookY: show * 0.5 },
        }}
      />
      <Person
        look={QEMAJLI}
        x={qPlace.x}
        pose={{
          legs: { kind: 'sit' },
          turn: -0.45,
          headPitch: -12 * laugh,
          shrug: bounce,
          armL: gArm(QEMAJLI, qPlace, -1, gQ),
          armR: mixArm(REST, reach(QEMAJLI, 1, pb.x, pb.y, { fore: 0.3, hand: 'grip' }), show),
          face: { smile: 1, teeth: true, open: laugh * 0.75 + 0.1, squint: 0.5, lookX: -0.8 },
        }}
      />
      {show > 0.05 && <Phone x={phoneAt.x} y={phoneAt.y} scale={0.16} rotate={-60} screen={{ kind: 'back' }} />}
      <Glass x={gC.x} y={gC.y} s={0.7} level={0.5} />
      <Glass x={gQ.x} y={gQ.y} s={0.7} level={0.4} />
      {void PELVIS_STAND}
    </Bar>
  );
};

export const Scene8: React.FC = () => (
  <>
    <SplitShot scene="s8" span={SHOTS.s8.a} left={<S8aL />} right={<S8aR />} name="8a" />
    <SplitShot scene="s8" span={SHOTS.s8.b} left={<S8bL />} right={<S8bR />} name="8b" />
    <SplitShot scene="s8" span={SHOTS.s8.c} left={<S8cL />} right={<S8cR />} name="8c" />
  </>
);

// ---------------------------------------------------------------------------------------
// Scene 9 — freeze the last split frame, desaturate, fade to black

export const Scene9: React.FC = () => {
  const tl = useTl();
  const frame = useCurrentFrame();
  const s9 = tl.f(SCENES.s9.span[0]);
  const s8 = tl.f(SCENES.s8.span[0]);
  const last8 = s9 - s8 - 1;
  const desat = prog(frame, tl.f(EVENTS.desaturate[0]) - s9, tl.f(EVENTS.desaturate[1]) - s9);
  const black = prog(frame, tl.f(EVENTS.fadeToBlack[0]) - s9, tl.f(EVENTS.fadeToBlack[1]) - s9);
  const shotC = useShotSpan('s8', SHOTS.s8.c);
  void shotC;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ filter: `saturate(${1 - FREEZE_DESATURATION * desat})`, opacity: 1 - black }}>
        <Freeze frame={last8}>
          <Scene8 />
        </Freeze>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
void kf;
void Hand;
void ERA;
