// Scene 4 — Para intervistës (lobby | café) and Scene 5 — Fillimi i intervistës.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Phone } from '../devices/Phone';
import { View } from '../devices/View';
import { kf, ks, lerp, prog, s } from '../lib/anim';
import { Hand, Person, PELVIS_SIT, reach, toBody } from '../rig/Person';
import { ANETARI, ANETARJA, ERA, KAMARIERI, KRYETARI, QEMAJLI, SEKRETARJA, SUELA } from '../rig/cast';
import { CAFE, CafeChairBack, CafeChairSeat, CafeRoom, CafeTable } from '../sets/Cafe';
import { CandidateChair, CandidateChairBack, LOBBY, Lobby, ReceptionDesk, ROOM, RoomBack, RoomTable } from '../sets/Institution';
import { Light } from '../sets/Light';
import { Clipboard, CoffeeCup, FolderEdge, Folder } from '../sets/Props';
import { SHOTS } from '../timeline';
import { REST, Stage, mixArm, reachWindow, sitY, talk, walkPath } from './common';
import { SplitShot } from './kit';

const folderInHand = <FolderEdge x={0} y={26} len={96} rotate={-6} />;
const CAFE_WIDE = { cx: -60, cy: -420, zoom: 0.95 };
const LOBBY_WIDE = { cx: -200, cy: -400, zoom: 0.72 };

const Secretary: React.FC<{ x?: number; look?: number; gesture?: number; talkAmt?: number; frame: number; clipboard?: boolean; pitch?: number; smile?: number }> = ({ x = -310, look = 0, gesture = 0, talkAmt = 0, frame, clipboard = true, pitch = 0, smile = 0.2 }) => {
  const hold = reach(SEKRETARJA, -1, -16, -74, { fore: 0.35, hand: 'grip', hold: clipboard ? <Clipboard x={4} y={28} rotate={-80} s={0.9} /> : undefined });
  const other = reach(SEKRETARJA, 1, 14, -70, { fore: 0.35, hand: 'grip' });
  const point = { sh: 72, el: 8, hand: 'open' as const, wr: -10 };
  return (
    <Person
      look={SEKRETARJA}
      x={x}
      pose={{
        turn: 0.35,
        armL: clipboard ? hold : REST,
        armR: mixArm(clipboard ? other : REST, point, gesture),
        headPitch: pitch,
        face: { lookX: look, lookY: pitch > 6 ? 0.9 : 0, open: talk(frame, 2, talkAmt), smile },
      }}
    />
  );
};

// ---------------------------------------------------------------------------------------
// Scene 4

const S4aL: React.FC = () => {
  const frame = useCurrentFrame();
  const w = walkPath(frame, [[0.9, -700], [4.6, -130]]);
  return (
    <Stage cam={LOBBY_WIDE} light="cool">
      <Lobby time="09:40" glassOpen={ks(frame, [[0.3, 0], [0.9, 1], [2.6, 1], [3.2, 0]])} />
      <Secretary frame={frame} look={frame > s(4) ? -0.6 : 0} pitch={frame > s(4) ? 0 : 10} />
      <ReceptionDesk />
      <Person
        look={SUELA}
        x={w.x}
        pose={{
          turn: frame > s(4.6) ? -0.4 : 0.55,
          legs: w.moving ? { kind: 'walk', phase: w.phase } : { kind: 'stand' },
          armL: { sh: 4, el: 26, hand: 'grip', hold: folderInHand },
          armR: w.moving ? { sh: 6 + Math.sin(w.phase) * 10, el: 14, hand: 'relaxed' } : REST,
          face: { lookX: frame < s(2.5) ? 0.8 : frame < s(4) ? 0.2 : -0.6, lookY: frame < s(2.5) ? -0.3 : 0 },
        }}
      />
    </Stage>
  );
};

const CafeScene: React.FC<{ children: React.ReactNode; cam: { cx: number; cy: number; zoom: number }; table?: React.ReactNode; night?: boolean }> = ({ children, cam, table, night }) => (
  <Stage cam={cam} light={night ? 'amber' : 'warm'}>
    <CafeRoom night={night} />
    <CafeChairBack x={CAFE.seatEra - 30} />
    <CafeChairBack x={CAFE.seatQ + 30} />
    {children}
    <CafeTable night={night}>{table}</CafeTable>
  </Stage>
);

const S4aR: React.FC = () => {
  const frame = useCurrentFrame();
  const era = walkPath(frame, [[0.6, 260], [2.3, CAFE.seatEra]]);
  const q = walkPath(frame, [[0, -60], [2.6, -60], [4.2, CAFE.seatQ]]);
  const eraSit = prog(frame, s(2.4), s(3.4));
  const qSit = prog(frame, s(4.3), s(5.3));
  const pull = prog(frame, s(0.3), s(1.0)) - prog(frame, s(2.2), s(2.6));
  const chairX = CAFE.seatEra - 30 - pull * 40;
  const chairB = toBody({ x: q.x, y: 0 }, chairX + 30, -350);
  return (
    <CafeScene cam={CAFE_WIDE}>
      <CafeChairSeat x={CAFE.seatEra} />
      <CafeChairSeat x={CAFE.seatQ} />
      <Person
        look={ERA}
        x={era.x}
        pose={{
          pelvisY: sitY(eraSit),
          legs: era.moving ? { kind: 'walk', phase: era.phase } : eraSit > 0.5 ? { kind: 'sit' } : { kind: 'stand' },
          turn: era.moving ? -0.55 : 0.45,
          face: { smile: 0.6, lookX: 0.6 },
          armR: { sh: 4, el: 20, hand: 'grip' },
        }}
      />
      <Person
        look={QEMAJLI}
        x={q.x}
        pose={{
          pelvisY: sitY(qSit),
          legs: q.moving ? { kind: 'walk', phase: q.phase } : qSit > 0.5 ? { kind: 'sit' } : { kind: 'stand' },
          turn: q.moving ? 0.55 : -0.45,
          lean: pull * -8,
          armL: mixArm(REST, reach(QEMAJLI, -1, chairB.x, chairB.y, { hand: 'grip' }), pull),
          armR: mixArm(REST, { sh: 50, el: 30, hand: 'open' }, prog(frame, s(1.2), s(1.6)) - prog(frame, s(2.4), s(2.8))),
          face: { smile: 0.85, lookX: -0.6, open: talk(frame, 1, 0.3) },
        }}
      />
    </CafeScene>
  );
};

const S4bL: React.FC = () => {
  const frame = useCurrentFrame();
  const gesture = prog(frame, s(3.6), s(4.2)) - prog(frame, s(5.4), s(5.9));
  return (
    <Stage cam={{ cx: -215, cy: -350, zoom: 2.4 }} light="cool">
      <Lobby time="09:45" />
      <Secretary frame={frame} gesture={gesture} pitch={frame > s(1.4) && frame < s(3.3) ? 14 : 0} look={frame > s(3.3) ? 0.5 : 0.4} talkAmt={frame > s(3.5) && frame < s(5) ? 0.4 : 0} smile={frame > s(3.3) ? 0.5 : 0.15} />
      <ReceptionDesk />
      <Person
        look={SUELA}
        x={-90}
        pose={{
          turn: frame > s(5.4) ? 0.35 : -0.6,
          armL: { sh: 4, el: 26, hand: 'grip', hold: folderInHand },
          face: { lookX: frame > s(5.4) ? 0.5 : -0.7, open: frame > s(0.4) && frame < s(2.2) ? talk(frame, 0, 0.45) : 0, smile: 0.25 },
          headPitch: frame > s(5.0) && frame < s(5.4) ? 8 : 0,
        }}
      />
    </Stage>
  );
};

const S4bR: React.FC = () => {
  const frame = useCurrentFrame();
  const c1 = ks(frame, [[0.3, -320], [1.6, 0]]);
  const c2 = ks(frame, [[2.1, -320], [3.4, 0]]);
  const handY = frame < s(1.9) ? 690 + c1 : 680 + c2;
  const handX = frame < s(1.9) ? 360 : 610;
  const out = prog(frame, s(3.6), s(4.4));
  return (
    <AbsoluteFill>
      <View cam={{ cx: 480, cy: 540, zoom: 1 }}>
        <rect width={960} height={1080} fill="#E9C99A" />
        <rect x={0} y={0} width={960} height={380} fill="#D9B27E" />
        <ellipse cx={200} cy={160} rx={160} ry={60} fill="#F4E1BC" opacity={0.6} />
        <rect x={-20} y={380} width={1000} height={720} fill="#A57249" />
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-20} y={420 + i * 86} width={1000} height={3} fill="#8B5E3C" opacity={0.6} />)}
        {/* Era's and Qemajli's hands resting at the table edge */}
        <path d="M 60 1100 L 120 930 L 230 940 L 220 1100 Z" fill="#1D3557" />
        <ellipse cx={190} cy={920} rx={58} ry={40} fill={ERA.skin} />
        <path d="M 900 1100 L 830 920 L 700 930 L 720 1100 Z" fill="#6B4429" />
        <ellipse cx={740} cy={905} rx={66} ry={44} fill={QEMAJLI.skin} />
        <rect x={790} y={895} width={50} height={22} rx={6} fill="#D4A537" transform="rotate(-20 815 906)" />
        <CoffeeCup x={360} y={690 + c1} s={2.6} />
        {frame > s(2.1) && <CoffeeCup x={610} y={680 + c2} s={2.6} />}
        {/* waiter's arm from above */}
        <g transform={`translate(${handX + out * 200} ${handY - 120 - out * 500})`}>
          <path d="M -60 -900 L 60 -900 L 46 0 L -46 0 Z" fill="#1E1E24" />
          <g transform="translate(0 -6) scale(5.2)">
            <Hand skin={KAMARIERI.skin} shade={KAMARIERI.skinShade} shape="grip" side={1} />
          </g>
        </g>
      </View>
      <Light kind="warm" />
    </AbsoluteFill>
  );
};

const S4cL: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const folderOpen = (
    <g transform="translate(-16 18) rotate(-6)">
      <Folder x={0} y={0} w={120} h={86} />
      <rect x={-54} y={-38} width={50} height={76} fill="#FFFFFF" />
      <rect x={4} y={-38} width={50} height={76} fill="#FFFFFF" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-48} y={-28 + i * 13} width={38} height={3} fill="#B9C3CE" />)}
      {[0, 1, 2, 3, 4].map((i) => <rect key={`r${i}`} x={10} y={-28 + i * 13} width={i === 4 ? 20 : 38} height={3} fill="#B9C3CE" />)}
    </g>
  );
  return (
    <Stage cam={{ cx: 170, cy: -250, zoom: 3.0 }} light="cool">
      <Lobby time="09:50" />
      <Person
        look={SUELA}
        x={170}
        pose={{
          legs: { kind: 'sit' },
          armL: reach(SUELA, -1, -58, -40, { fore: 0.4, hand: 'grip' }),
          armR: reach(SUELA, 1, 58, -38, { fore: 0.4, hand: 'grip' }),
          headPitch: 16 + Math.sin(t * 1.3) * 2,
          face: { lookY: 0.95, lookX: Math.sin(t * 2.2) * 0.5, open: talk(frame, 4, 0.22), worry: 0.15 },
        }}
      />
      <g transform="translate(186 -166) scale(1 0.8)">{folderOpen}</g>
    </Stage>
  );
};

const S4cR: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const laugh = prog(frame, s(2.2), s(2.8)) - prog(frame, s(5.6), s(6.4));
  const g = (k: number) => Math.sin(t * 3.1 + k);
  return (
    <CafeScene cam={{ cx: -75, cy: -340, zoom: 2.15 }} table={<><CoffeeCup x={-150} y={-214} s={0.6} /><CoffeeCup x={20} y={-214} s={0.6} /></>}>
      <CafeChairSeat x={CAFE.seatEra} />
      <CafeChairSeat x={CAFE.seatQ} />
      <Person
        look={ERA}
        x={CAFE.seatEra}
        pose={{
          legs: { kind: 'sit' },
          turn: 0.45,
          headPitch: -14 * laugh,
          headTilt: -5 * laugh,
          shrug: laugh * (0.35 + 0.25 * Math.abs(Math.sin(t * 9))),
          armR: mixArm(REST, reach(ERA, 1, 10, -95, { fore: 0.4, hand: 'relaxed' }), laugh),
          face: { smile: 0.4 + laugh * 0.6, open: laugh * (0.6 + 0.25 * Math.abs(Math.sin(t * 9))), squint: laugh * 0.7, teeth: laugh > 0.3, lookX: 0.7 * (1 - laugh) },
        }}
      />
      <Person
        look={QEMAJLI}
        x={CAFE.seatQ}
        pose={{
          legs: { kind: 'sit' },
          turn: -0.45,
          lean: g(0) * 4,
          armL: { sh: 55 + g(0.4) * 30, el: 70 + g(1.2) * 40, hand: 'open', wr: g(2) * 20 },
          armR: { sh: 40 + g(2.2) * 35, el: 90 + g(0.7) * 30, hand: g(1) > 0 ? 'open' : 'point', wr: g(3) * 25 },
          headTilt: g(0.5) * 4,
          face: { smile: 0.8, open: talk(frame, 3, 0.6), browL: 0.3 + g(1) * 0.3, browR: 0.3 + g(1) * 0.3, lookX: -0.6 },
        }}
      />
    </CafeScene>
  );
};

const S4dL: React.FC = () => {
  const frame = useCurrentFrame();
  const up = prog(frame, s(1.0), s(1.5)) - prog(frame, s(2.9), s(3.2));
  const fix = prog(frame, s(3.1), s(3.5)) - prog(frame, s(4.0), s(4.3));
  const stand = prog(frame, s(4.3), s(6.4));
  const pelvisY = sitY(1 - stand);
  return (
    <Stage cam={{ cx: 212, cy: -402, zoom: 3.4 }} to={{ cx: 212, cy: -500, zoom: 3.0 }} moveFrom={s(4.3)} moveTo={s(6.6)} light="cool">
      <Lobby time="09:55" />
      <Person
        look={SUELA}
        x={170}
        pose={{
          pelvisY,
          legs: stand > 0.5 ? { kind: 'stand' } : { kind: 'sit' },
          armL: fix > 0 ? reach(SUELA, -1, -22, -86 + Math.sin(frame * 0.6) * 3, { fore: 0.3, hand: 'grip' }) : { sh: 4, el: 30, hand: 'grip', hold: folderInHand },
          armR: fix > 0 ? reach(SUELA, 1, 22, -86 + Math.sin(frame * 0.6) * 3, { fore: 0.3, hand: 'grip' }) : REST,
          headPitch: lerp(14, -14, up) * (1 - fix) + fix * 8,
          face: { lookY: lerp(0.9, -1, up) * (1 - fix) + fix * 0.6, lookX: up * 0.3, browL: up * 0.35, browR: up * 0.35, worry: up * 0.2 },
        }}
      />
    </Stage>
  );
};

const S4dR: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const rise = prog(frame, s(2.2), s(3.0)) - prog(frame, s(4.8), s(5.8));
  const hand = prog(frame, s(2.8), s(3.3)) - prog(frame, s(5.6), s(6.2));
  const wave = prog(frame, s(3.3), s(3.6)) - prog(frame, s(5.0), s(5.4));
  const phoneUp = 1 - prog(frame, s(4.4), s(5.2));
  const eraPlace = { x: CAFE.seatEra, y: 0, pelvisY: lerp(PELVIS_SIT, -172, rise) };
  const qx = -20;
  const shoulder = { x: CAFE.seatEra + 40, y: eraPlace.pelvisY - 116 };
  const qBody = toBody({ x: qx, y: 0, pelvisY: PELVIS_SIT }, shoulder.x, shoulder.y);
  const phoneLift = prog(frame, 0, s(0.4)) * (1 - prog(frame, s(4.4), s(5.2)));
  const phoneAt = { x: CAFE.seatEra + 22, y: lerp(-215, -292, phoneLift) };
  const phoneHand = toBody({ x: CAFE.seatEra, y: 0, pelvisY: lerp(PELVIS_SIT, -172, rise) }, phoneAt.x, phoneAt.y + 56);
  return (
    <CafeScene cam={{ cx: -115, cy: -360, zoom: 2.35 }} table={<CoffeeCup x={-150} y={-214} s={0.6} level={0.5} />}>
      <CafeChairSeat x={CAFE.seatEra} />
      <Person
        look={ERA}
        x={CAFE.seatEra}
        pose={{
          pelvisY: eraPlace.pelvisY,
          legs: { kind: 'sit' },
          turn: 0.3,
          lean: rise * 5,
          armR: reach(ERA, 1, phoneHand.x, phoneHand.y, { fore: 0.5, hand: 'grip' }),
          headPitch: phoneUp * 14 * (1 - hand),
          face: { lookY: phoneUp * (1 - hand) * 0.9, lookX: hand * 0.8, browL: rise * 0.4, browR: rise * 0.4, smile: 0.15 + hand * 0.6, open: rise * 0.2 },
        }}
      />
      <Person
        look={QEMAJLI}
        x={qx}
        pose={{
          legs: { kind: 'sit' },
          turn: -0.55,
          lean: -6 * hand,
          armL: mixArm(REST, reach(QEMAJLI, -1, qBody.x, qBody.y, { hand: 'open' }), hand),
          armR: mixArm(REST, { sh: 40, el: 120, hand: 'open', wr: Math.sin(t * 11) * 25 }, wave),
          face: { smile: 0.9, open: wave * talk(frame, 2, 0.5), lookX: -0.8, browL: 0.3, browR: 0.3 },
        }}
      />
      <Phone x={phoneAt.x} y={phoneAt.y} scale={0.2} rotate={-10} screen={{ kind: 'lock', time: '10:20' }} />
    </CafeScene>
  );
};

const S4eL: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const grip = 0.55 + prog(frame, s(0.5), s(2.5)) * 0.4;
  const tremble = Math.sin(t * 31) * 1.2;
  return (
    <AbsoluteFill>
      <View cam={{ cx: 480, cy: 540, zoom: 1 }}>
        <rect width={960} height={1080} fill="#C9D6E2" />
        <ellipse cx={250} cy={900} rx={260} ry={300} fill="#25273A" />
        <ellipse cx={710} cy={900} rx={260} ry={300} fill="#25273A" />
        <g transform={`translate(${tremble} 0)`}>
          <rect x={150} y={380} width={660} height={500} rx={14} fill="#1D3557" />
          <rect x={150} y={380} width={70} height={500} rx={10} fill="#132541" />
          {([-1, 1] as const).map((sd) => {
            const x = sd < 0 ? 210 : 750;
            return (
              <g key={sd}>
                <path d={`M ${x - sd * 230} 1100 L ${x - sd * 150} 700 L ${x - sd * 40} 660 L ${x + sd * 30} 1100 Z`} fill="#1D3557" />
                <rect x={x - 58} y={640} width={34} height={110} rx={10} fill="#FBFAF6" transform={`rotate(${sd * 20} ${x - 40} 690)`} />
                {sd > 0 && <rect x={x - 70} y={630} width={26} height={100} rx={8} fill="#C9CED6" transform="rotate(20 730 690)" />}
                <g transform={`translate(${x + sd * 10} 640) rotate(${sd < 0 ? -78 : 78}) scale(7)`}>
                  <Hand skin={SUELA.skin} shade={SUELA.skinShade} shape={grip > 0.8 ? 'grip' : 'relaxed'} side={sd === -1 ? 1 : -1} />
                </g>
              </g>
            );
          })}
        </g>
      </View>
      <Light kind="cool" />
    </AbsoluteFill>
  );
};

const S4eR: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const pat = Math.max(0, Math.sin(t * Math.PI * 4)) * 50;
  return (
    <AbsoluteFill>
      <View cam={{ cx: 480, cy: 540, zoom: 1 }}>
        <rect width={960} height={1080} fill="#D9B27E" />
        <rect x={-20} y={300} width={1000} height={800} fill="#A57249" />
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-20} y={340 + i * 86} width={1000} height={3} fill="#8B5E3C" opacity={0.6} />)}
        <CoffeeCup x={360} y={640} s={3.6} level={0.5} />
        <g transform={`translate(700 ${700 - pat})`}>
          <path d="M 60 0 L 300 -260 L 420 -160 L 130 80 Z" fill="#6B4429" />
          <rect x={60} y={-36} width={80} height={36} rx={10} fill="#D4A537" transform="rotate(-42 100 -18)" />
          <g transform="rotate(48) scale(7)">
            <Hand skin={QEMAJLI.skin} shade={QEMAJLI.skinShade} shape="flat" side={-1} />
          </g>
        </g>
      </View>
      <Light kind="warm" />
    </AbsoluteFill>
  );
};

export const Scene4: React.FC = () => (
  <>
    <SplitShot scene="s4" span={SHOTS.s4.a} left={<S4aL />} right={<S4aR />} wipeIn name="4a" />
    <SplitShot scene="s4" span={SHOTS.s4.b} left={<S4bL />} right={<S4bR />} name="4b" />
    <SplitShot scene="s4" span={SHOTS.s4.c} left={<S4cL />} right={<S4cR />} name="4c" />
    <SplitShot scene="s4" span={SHOTS.s4.d} left={<S4dL />} right={<S4dR />} name="4d" />
    <SplitShot scene="s4" span={SHOTS.s4.e} left={<S4eL />} right={<S4eR />} name="4e" />
  </>
);

// ---------------------------------------------------------------------------------------
// Scene 5

const S5aL: React.FC = () => {
  const frame = useCurrentFrame();
  const door = ks(frame, [[0.5, 0], [1.3, 1]]);
  const sec = walkPath(frame, [[0.9, 660], [1.8, 590]]);
  const su = walkPath(frame, [[3.8, 300], [6, 470]]);
  const call = prog(frame, s(1.9), s(2.3)) - prog(frame, s(3.6), s(4.0));
  return (
    <Stage cam={{ cx: 462, cy: -420, zoom: 1.5 }} light="cool">
      <Lobby time="10:00" meetingDoor={door} />
      {door > 0.4 && (
        <Person
          look={SEKRETARJA}
          x={sec.x}
          pose={{
            turn: -0.5,
            legs: sec.moving ? { kind: 'walk', phase: sec.phase } : { kind: 'stand' },
            armL: mixArm(REST, { sh: 62, el: 30, hand: 'open', wr: Math.sin(frame * 0.5) * 12 }, call),
            armR: reach(SEKRETARJA, 1, 14, -70, { fore: 0.35, hand: 'grip', hold: <Clipboard x={-4} y={28} rotate={80} s={0.9} /> }),
            face: { open: call > 0.3 ? talk(frame, 1, 0.5) : 0, smile: 0.35, lookX: -0.7 },
          }}
        />
      )}
      <Person
        look={SUELA}
        x={su.x}
        pose={{
          turn: frame > s(1.6) ? 0.55 : 0.2,
          legs: su.moving ? { kind: 'walk', phase: su.phase } : { kind: 'stand' },
          armL: { sh: 4, el: 26, hand: 'grip', hold: folderInHand },
          face: { lookX: frame > s(1.4) ? 0.8 : 0, browL: 0.2, browR: 0.2, smile: frame > s(3) ? 0.2 : 0 },
        }}
      />
    </Stage>
  );
};

const S5aR: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const w = walkPath(frame, [[0.7, -700], [3.6, -140]], 0.085);
  const pant = 0.5 + 0.5 * Math.sin(t * 9);
  return (
    <Stage cam={LOBBY_WIDE} light="cool">
      <Lobby time="10:37" glassOpen={ks(frame, [[0.2, 0], [0.7, 1], [2.4, 1], [3.0, 0]])} />
      <Secretary frame={frame} x={-310} clipboard pitch={10} />
      <ReceptionDesk />
      <Person
        look={ERA}
        x={w.x}
        pose={{
          turn: 0.6,
          lean: w.moving ? 4 : 0,
          legs: w.moving ? { kind: 'walk', phase: w.phase, stride: 26 } : { kind: 'stand' },
          armR: reachWindow(frame, ERA, 1, { x: 24, y: -196 }, [1.2, 1.6, 3.2, 3.8], { fore: 0.3, hand: 'open' }),
          armL: { sh: 4, el: 28, hand: 'grip', hold: folderInHand },
          shrug: 0.35 * pant,
          face: { open: 0.25 + 0.15 * pant, worry: 0.35, browL: 0.3, browR: 0.3, lookX: 0.6 },
        }}
      />
    </Stage>
  );
};

/** The commission, seated behind the table. */
export const Commission: React.FC<{
  frame: number;
  chair?: Parameters<typeof Person>[0]['pose'];
  female?: Parameters<typeof Person>[0]['pose'];
  male?: Parameters<typeof Person>[0]['pose'];
  chairLip?: number;
}> = ({ chair, female, male, chairLip }) => (
  <g>
    <Person look={ANETARJA} x={ROOM.seats[0]} pose={{ legs: { kind: 'sit' }, turn: 0.15, face: { smile: 0.15 }, ...female }} />
    <Person look={KRYETARI} x={ROOM.seats[1]} pose={{ legs: { kind: 'sit' }, face: { lid: 0.3 }, ...chair }} lipOpen={chairLip} />
    <Person look={ANETARI} x={ROOM.seats[2]} pose={{ legs: { kind: 'sit' }, turn: -0.15, ...male }} />
  </g>
);

const ROOM_MED = { cx: 0, cy: -360, zoom: 1.15 };

const S5bL: React.FC = () => {
  const frame = useCurrentFrame();
  const w = walkPath(frame, [[0, -560], [1.6, -330], [2.5, -330], [2.8, -80], [3.5, -80], [3.8, 170], [4.4, 170], [4.9, 0]]);
  const near = prog(frame, s(4.6), s(5.2));
  const sit = prog(frame, s(5.2), s(5.9));
  const shake = (a: number) => prog(frame, s(a), s(a + 0.3)) - prog(frame, s(a + 0.55), s(a + 0.8));
  const sh = [shake(1.7), shake(2.95), shake(3.95)];
  const handY = -250 + Math.sin(frame * 0.9) * 4;
  const su = { x: w.x, y: near * ROOM.candidate.y, scale: 1 + near * (ROOM.candidate.s - 1) };
  const tgt = toBody({ ...su, pelvisY: sitY(sit) }, w.x + 66, handY);
  const memberArm = (i: number) => mixArm(REST, reach(i === 1 ? KRYETARI : i === 0 ? ANETARJA : ANETARI, -1, -14, -40, { fore: 0.55, hand: 'open' }), sh[i]);
  const shaking = Math.max(...sh);
  return (
    <Stage cam={ROOM_MED} light="cool">
      <RoomBack />
      <Commission
        frame={frame}
        female={{ legs: { kind: 'sit' }, armL: memberArm(0), face: { smile: 0.4, lookX: -0.2 } }}
        chair={{ legs: { kind: 'sit' }, armL: memberArm(1), face: { lid: 0.3, smile: 0.05 } }}
        male={{ legs: { kind: 'sit' }, armL: memberArm(2), face: { smile: 0.15 } }}
      />
      <RoomTable />
      <CandidateChair />
      <Person
        look={SUELA}
        x={su.x}
        y={su.y}
        scale={su.scale}
        pose={{
          view: 'back',
          pelvisY: sitY(sit),
          legs: w.moving ? { kind: 'walk', phase: w.phase } : sit > 0.5 ? { kind: 'sit' } : { kind: 'stand' },
          armR: mixArm(REST, reach(SUELA, 1, tgt.x, tgt.y, { fore: 0.4, hand: 'open' }), shaking),
          armL: { sh: 4, el: 24, hand: 'grip', hold: frame < s(5) ? folderInHand : undefined },
        }}
      />
      {sit > 0.3 && <CandidateChairBack />}
    </Stage>
  );
};

const S5bR: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const w = walkPath(frame, [[0, -560], [1.6, -110], [4.6, -110], [5.1, 0]]);
  const stand = prog(frame, s(0.8), s(1.7)) - prog(frame, s(4.8), s(5.6));
  const wave = prog(frame, s(1.8), s(2.1)) - prog(frame, s(2.8), s(3.0));
  const shake = prog(frame, s(3.0), s(3.4)) - prog(frame, s(4.3), s(4.7));
  const near = prog(frame, s(4.6), s(5.3));
  const sit = prog(frame, s(5.3), s(6.0));
  const pump = Math.sin(t * 9) * 5 * shake;
  const chairPlace = { x: 0, y: 0, pelvisY: sitY(1 - stand) };
  const meet = { x: -58, y: -262 + pump };
  const cb = toBody(chairPlace, meet.x, meet.y);
  const su = { x: w.x, y: near * ROOM.candidate.y, scale: 1 + near * (ROOM.candidate.s - 1) };
  const eb = toBody({ ...su, pelvisY: sitY(sit) }, meet.x - 4, meet.y + 6);
  return (
    <Stage cam={ROOM_MED} light="cool">
      <RoomBack />
      <Commission
        frame={frame}
        female={{ legs: { kind: 'sit' }, face: { smile: 0.2, lookX: 0.4 } }}
        chair={{
          pelvisY: chairPlace.pelvisY,
          legs: stand > 0.5 ? { kind: 'stand' } : { kind: 'sit' },
          armR: shake > 0 ? reach(KRYETARI, 1, cb.x + 10, cb.y + 4, { fore: 0.4, hand: 'grip' }) : mixArm(REST, { sh: 50, el: 125, hand: 'open', wr: Math.sin(t * 12) * 28 }, wave),
          armL: mixArm(REST, reach(KRYETARI, -1, cb.x - 8, cb.y - 2, { fore: 0.4, hand: 'grip' }), shake),
          face: { smile: 0.25 + stand * 0.75, teeth: stand > 0.5, squint: stand * 0.35, browL: stand * 0.4, browR: stand * 0.4, open: wave * talk(frame, 1, 0.4) },
        }}
        male={{ legs: { kind: 'sit' }, face: { smile: 0.1 } }}
      />
      <RoomTable />
      <CandidateChair />
      <Person
        look={ERA}
        x={su.x}
        y={su.y}
        scale={su.scale}
        pose={{
          view: 'back',
          pelvisY: sitY(sit),
          legs: w.moving ? { kind: 'walk', phase: w.phase } : sit > 0.5 ? { kind: 'sit' } : { kind: 'stand' },
          armR: mixArm(REST, reach(ERA, 1, eb.x, eb.y, { fore: 0.4, hand: 'grip' }), shake),
          armL: { sh: 4, el: 24, hand: 'grip', hold: frame < s(5) ? folderInHand : undefined },
          shrug: 0.3 * (0.5 + 0.5 * Math.sin(t * 7)),
        }}
      />
      {sit > 0.3 && <CandidateChairBack />}
    </Stage>
  );
};

const S5c: React.FC<{ who: 'suela' | 'era' }> = ({ who }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <Stage cam={{ cx: 0, cy: -300, zoom: 1.0 }} still light="cool">
      <RoomBack />
      <Commission
        frame={frame}
        female={{ legs: { kind: 'sit' }, face: { smile: who === 'suela' ? 0.3 : 0.15, lookY: 0.2 } }}
        chair={{ legs: { kind: 'sit' }, face: who === 'suela' ? { lid: 0.35, smile: -0.05 } : { smile: 0.75, teeth: false, browL: 0.25, browR: 0.25 } }}
        male={{ legs: { kind: 'sit' } }}
      />
      <RoomTable />
      <CandidateChair />
      <Person
        look={who === 'suela' ? SUELA : ERA}
        x={ROOM.candidate.x}
        y={ROOM.candidate.y}
        scale={ROOM.candidate.s}
        pose={{ view: 'back', legs: { kind: 'sit' }, shrug: who === 'era' ? 0.3 * (0.5 + 0.5 * Math.sin(t * 6)) : 0, breathe: who === 'era' ? 2.5 : 1 }}
      />
      <CandidateChairBack />
    </Stage>
  );
};

export const Scene5: React.FC = () => (
  <>
    <SplitShot scene="s5" span={SHOTS.s5.a} left={<S5aL />} right={<S5aR />} name="5a" />
    <SplitShot scene="s5" span={SHOTS.s5.b} left={<S5bL />} right={<S5bR />} name="5b" />
    <SplitShot scene="s5" span={SHOTS.s5.c} left={<S5c who="suela" />} right={<S5c who="era" />} name="5c" />
  </>
);
void kf;
void LOBBY;
