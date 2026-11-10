// Scene 6 — Pyetja. The only audible scene: the question in two voices (split), the merge,
// Suela's answer, the hard cut, Era's pause and answer, the commission's reaction.
import React from 'react';
import { AbsoluteFill, Freeze, useCurrentFrame } from 'remotion';
import { DIVIDER_W, PALETTE, PANE_W } from '../config';
import { LipSync } from '../devices/LipSync';
import { Divider, Pane } from '../devices/Split';
import { Full, Shot, ShotCtx } from '../devices/View';
import { EASE, kf, ks, lerp, prog, s } from '../lib/anim';
import { Hand, Person, reach } from '../rig/Person';
import { ANETARJA, ERA, KRYETARI, SUELA } from '../rig/cast';
import { ROOM, RoomBack, RoomTable } from '../sets/Institution';
import { Pen, Plant, Sheet } from '../sets/Props';
import { EVENTS, SHOTS, sec } from '../timeline';
import { REST, Stage, mixArm } from './common';
import { useAt, useShotSpan, useTl } from './kit';
import { Commission } from './S4S5';

const POV = { cx: 0, cy: -330, zoom: 3.0 };

/** The chair from the candidate's point of view, medium shot. */
const ChairPOV: React.FC<{ mood: 'bored' | 'warm' | 'neutral'; lip?: number; pickAt?: number }> = ({ mood, lip = 0, pickAt = -999 }) => {
  const frame = useCurrentFrame();
  const pick = prog(frame, pickAt, pickAt + s(0.5));
  const sheetY = lerp(ROOM.tableTop - 16, -228, pick);
  const held = { l: reach(KRYETARI, -1, -34, sheetY + 128 + 14, { fore: 0.5, hand: 'grip' }), r: reach(KRYETARI, 1, 34, sheetY + 128 + 14, { fore: 0.5, hand: 'grip' }) };
  const face =
    mood === 'bored'
      ? { lid: 0.42, browL: -0.15, browR: -0.15, smile: -0.12, lookY: 0.55 }
      : mood === 'warm'
        ? { smile: 0.8, squint: 0.3, browL: 0.35, browR: 0.35 }
        : { lid: 0.12, smile: 0 };
  return (
    <Stage cam={POV} light="cool">
      <RoomBack />
      <Commission frame={frame} chair={{ legs: { kind: 'sit' }, headTilt: mood === 'bored' ? 3 : mood === 'warm' ? -3 : 0, armL: mixArm(REST, held.l, pick), armR: mixArm(REST, held.r, pick), face }} chairLip={lip} />
      <RoomTable sheets={false} />
      {pick < 1 && <Sheet x={70} y={ROOM.tableTop - 16} w={60} h={10} />}
      {pick > 0 && <g transform={`translate(0 ${sheetY}) scale(1 ${lerp(0.15, 1, pick)})`}><Sheet x={0} y={0} w={64} h={62} lines={5} /></g>}
    </Stage>
  );
};

/** 6a — the question, split, with the two voices overlapping. */
const Question: React.FC = () => {
  const tl = useTl();
  const { abs } = useShotSpan('s6', SHOTS.s6.a);
  const at = useAt('s6', SHOTS.s6.a);
  const pickAt = at(EVENTS.sheetPickup);
  return (
    <AbsoluteFill>
      <Pane side="L">
        <LipSync vo="vo1" tl={tl} shotFrom={abs}>
          {(o) => <ChairPOV mood="bored" lip={o} pickAt={pickAt} />}
        </LipSync>
      </Pane>
      <Pane side="R">
        <LipSync vo="vo2" tl={tl} shotFrom={abs}>
          {(o) => <ChairPOV mood="warm" lip={o} pickAt={pickAt} />}
        </LipSync>
      </Pane>
      <Divider />
    </AbsoluteFill>
  );
};

/** 6b — the divider fades, the panes slide together and dissolve into one frame. */
const Merge: React.FC = () => {
  const frame = useCurrentFrame();
  const slide = prog(frame, 0, s(1.8), EASE);
  const full = prog(frame, s(1.2), s(2.5), EASE);
  const divider = 1 - prog(frame, 0, sec(EVENTS.mergeDividerFade));
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Full>
        <ChairPOV mood="neutral" pickAt={-999} />
      </Full>
      <AbsoluteFill style={{ opacity: 1 - full }}>
        <Pane side="L" dx={(PANE_W / 2) * slide}>
          <ChairPOV mood="bored" pickAt={-999} />
        </Pane>
        <Pane side="R" dx={(-PANE_W / 2) * slide} opacity={1 - 0.5 * slide}>
          <ChairPOV mood="warm" pickAt={-999} />
        </Pane>
        <Divider opacity={divider} />
      </AbsoluteFill>
      {void DIVIDER_W}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------
// The candidates, full-frame close-ups at eye level (the commission's point of view)

const CANDIDATE_CAM = { cx: 0, cy: -272, zoom: 4.2 };

const CandidateSide: React.FC = () => (
  <g>
    <rect x={-1600} y={-1200} width={3200} height={1200} fill={PALETTE.wall} />
    <rect x={-1600} y={-220} width={3200} height={220} fill="#C9D6E2" />
    <rect x={-1600} y={-226} width={3200} height={8} fill="#B4C4D4" />
    <rect x={-1600} y={0} width={3200} height={900} fill="#B6C5D4" />
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-1600 + i * 200 + 60} y={-900} width={3} height={680} fill="#CCD8E3" />)}
    <rect x={150} y={-640} width={210} height={640} fill={PALETTE.instDark} />
    <rect x={164} y={-626} width={182} height={626} fill={PALETTE.instMid} />
    <Plant x={-330} y={0} s={1.15} />
    <rect x={-250} y={-600} width={160} height={110} fill="#F4F1EA" />
    <rect x={-240} y={-590} width={140} height={90} fill="#8DA9C4" opacity={0.6} />
    <rect x={-240} y={-540} width={140} height={40} fill="#3D5A80" opacity={0.5} />
  </g>
);

const Candidate: React.FC<{ who: 'suela' | 'era'; lip?: number; pose: Parameters<typeof Person>[0]['pose'] }> = ({ who, lip, pose }) => (
  <Full>
    <Stage cam={CANDIDATE_CAM} light="cool">
      <CandidateSide />
      <Person look={who === 'suela' ? SUELA : ERA} pose={{ legs: { kind: 'sit' }, ...pose }} lipOpen={lip} />
    </Stage>
  </Full>
);

/** The commission, medium, full frame. */
const CommissionMedium: React.FC<{ chair: Parameters<typeof Person>[0]['pose']; female: Parameters<typeof Person>[0]['pose']; glow?: number; sheetsWrite?: boolean }> = ({ chair, female, glow = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <Full>
      <Stage cam={{ cx: 0, cy: -330, zoom: 2.05 }} light="cool">
        <RoomBack />
        <Commission frame={frame} chair={chair} female={female} male={{ legs: { kind: 'sit' }, face: { lid: 0.15 } }} />
        {glow > 0 && <ellipse cx={0} cy={-260} rx={60} ry={40} fill="#DCEBFF" opacity={0.35 * glow} />}
        <RoomTable sheets />
      </Stage>
    </Full>
  );
};

const gestures = (frame: number, look = SUELA, amount = 1) => {
  const t = frame / 30;
  const beat = Math.max(0, Math.sin(t * 2.1)) * amount;
  return {
    armL: reach(look, -1, -46 - beat * 12, -84 - beat * 22, { fore: 0.6, hand: beat > 0.4 ? 'open' : 'relaxed', wr: -beat * 20 }),
    armR: reach(look, 1, 44 + beat * 8, -80 - Math.max(0, Math.sin(t * 2.1 + 1.2)) * 18 * amount, { fore: 0.6, hand: 'relaxed' }),
  };
};

/** 6c — Suela answers at once, steady, with a cutaway to the commission. */
const SuelaAnswer: React.FC = () => {
  const tl = useTl();
  const frame = useCurrentFrame();
  const { abs } = useShotSpan('s6', SHOTS.s6.c);
  const at = useAt('s6', SHOTS.s6.c);
  const [c0, c1] = EVENTS.suelaCutaway.map(at);
  const t = frame / 30;
  if (frame >= c0 && frame < c1) {
    const nod = Math.sin(t * 4) * 5;
    const write = Math.sin(t * 14) * 4;
    return (
      <CommissionMedium
        glow={1}
        chair={{ legs: { kind: 'sit' }, headPitch: 18, face: { lookY: 1, lid: 0.25, smile: 0.1 }, armL: reach(KRYETARI, -1, -18, 10, { hand: 'grip' }), armR: reach(KRYETARI, 1, 14, 12, { hand: 'grip' }) }}
        female={{
          legs: { kind: 'sit' },
          turn: 0.1,
          headPitch: 6 + nod,
          armR: reach(ANETARJA, 1, 58 + write, -60, { fore: 0.5, hand: 'grip', hold: <Pen x={0} y={14} rotate={-30} len={30} /> }),
          face: { browL: 0.45, browR: 0.45, smile: 0.35, lookY: 0.3 },
        }}
      />
    );
  }
  return (
    <LipSync vo="vo3" tl={tl} shotFrom={abs}>
      {(o) => <Candidate who="suela" lip={o} pose={{ ...gestures(frame), headPitch: Math.sin(t * 1.3) * 2, headTilt: Math.sin(t * 0.7) * 1.5, face: { lookX: 0, lookY: 0, browL: 0.1 + o * 0.15, browR: 0.1 + o * 0.15, smile: 0.12 } }} />}
    </LipSync>
  );
};

/** 6d — hard cut: Era, four seconds of silence. */
const EraPause: React.FC = () => {
  const frame = useCurrentFrame();
  const open = ks(frame, [[0.3, 0], [0.6, 0.32], [1.0, 0.32], [1.3, 0]]);
  const lookY = ks(frame, [[1.2, 0], [1.6, 1], [2.0, 1], [2.5, -1], [3.0, -1], [3.4, 0]]);
  const lookX = ks(frame, [[2.0, 0], [2.5, 0.4], [3.0, 0.4], [3.4, 0]]);
  const pitch = ks(frame, [[1.2, 0], [1.6, 9], [2.0, 9], [2.5, -9], [3.0, -9], [3.4, 0]]);
  const swallow = ks(frame, [[3.3, 0], [3.5, 1], [3.75, 0]]);
  return (
    <Candidate
      who="era"
      lip={open}
      pose={{
        headPitch: pitch + swallow * 5,
        shrug: swallow * 0.4,
        face: { lookX, lookY, browL: 0.35 - lookY * 0.1, browR: 0.35 - lookY * 0.1, worry: 0.45, lid: swallow * 0.4, smile: -0.1 },
      }}
    />
  );
};

/** Era's hands under the table, twisting a pen. */
const PenHands: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const twist = Math.sin(t * 5) * 28;
  return (
    <Full>
      <Stage cam={{ cx: 960, cy: 540, zoom: 1 }} light="cool">
        <rect width={1920} height={1080} fill="#2B2D42" />
        <rect width={1920} height={200} fill="#151627" />
        <ellipse cx={720} cy={1000} rx={420} ry={330} fill="#25273A" />
        <ellipse cx={1220} cy={1000} rx={420} ry={330} fill="#22243A" />
        <g transform={`translate(960 610) rotate(${twist}) scale(5.5)`}>
          <Pen x={0} y={0} rotate={90} len={80} />
        </g>
        {([-1, 1] as const).map((sd) => (
          <g key={sd}>
            <path d={`M ${960 + sd * 520} 1120 L ${960 + sd * 300} 640 L ${960 + sd * 170} 640 L ${960 + sd * 260} 1120 Z`} fill={PALETTE.navy} />
            <rect x={960 + sd * 235 - 60} y={610} width={120} height={40} rx={10} fill="#FBFAF6" transform={`rotate(${sd * 60} ${960 + sd * 235} 630)`} />
            <g transform={`translate(${960 + sd * (250 + Math.sin(t * 5 + sd) * 8)} ${585 + Math.sin((twist * Math.PI) / 180) * 190 * sd}) rotate(${sd < 0 ? -70 : 70}) scale(9)`}>
              <Hand skin={ERA.skin} shade={ERA.skinShade} shape="grip" side={sd === -1 ? 1 : -1} />
            </g>
          </g>
        ))}
      </Stage>
    </Full>
  );
};

/** 6e — Era answers, hesitantly; cutaway to her hands. */
const EraAnswer: React.FC = () => {
  const tl = useTl();
  const frame = useCurrentFrame();
  const { abs } = useShotSpan('s6', SHOTS.s6.e);
  const at = useAt('s6', SHOTS.s6.e);
  const [c0, c1] = EVENTS.eraCutaway.map(at);
  const t = frame / 30;
  if (frame >= c0 && frame < c1) return <PenHands />;
  const search = Math.sin(t * 1.15);
  const up = Math.max(0, Math.sin(t * 0.8 + 1)) > 0.75 ? 1 : 0;
  return (
    <LipSync vo="vo4" tl={tl} shotFrom={abs}>
      {(o) => (
        <Candidate
          who="era"
          lip={o}
          pose={{
            ...gestures(frame, ERA, 0.35),
            headTilt: search * 4,
            headPitch: up ? -7 : Math.sin(t * 0.9) * 4,
            face: { lookX: search * 0.65, lookY: up ? -0.8 : 0.25, browL: 0.35, browR: 0.25, worry: 0.45, smile: -0.05 },
          }}
        />
      )}
    </LipSync>
  );
};

/** 6f — the chair beams and writes; the female member is puzzled. */
const Reaction: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const nod = Math.sin(t * 6) * 6 * (1 - prog(frame, s(1.5), s(3)));
  const write = prog(frame, s(1.6), s(2.0));
  const look = prog(frame, s(1.0), s(1.6));
  return (
    <CommissionMedium
      chair={{
        legs: { kind: 'sit' },
        headPitch: nod + write * 12,
        armR: mixArm(REST, reach(KRYETARI, 1, 46 + Math.sin(t * 13) * 5 * write, -58, { fore: 0.5, hand: 'grip', hold: <Pen x={0} y={14} rotate={-30} len={30} /> }), write),
        face: { smile: 0.85, squint: 0.3, browL: 0.25, browR: 0.25, lookY: write * 0.8 },
      }}
      female={{ legs: { kind: 'sit' }, turn: lerp(0.1, 0.55, look), headTilt: look * 4, face: { lookX: look * 0.95, browL: look * 0.7, browR: look * 0.05, worry: look * 0.25, smile: -0.1 * look } }}
    />
  );
};

/** 6g — the last frame of 6f, held and dimmed to 50%. */
const Hold: React.FC<{ lastFrameOfF: number }> = ({ lastFrameOfF }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ShotCtx.Provider value={{ dur: lastFrameOfF + 1 }}>
        <Freeze frame={lastFrameOfF}>
          <Reaction />
        </Freeze>
      </ShotCtx.Provider>
      <AbsoluteFill style={{ background: '#000', opacity: 0.5 * prog(frame, 0, s(0.3)) }} />
    </AbsoluteFill>
  );
};

const S6Shot: React.FC<{ span: readonly [number, number]; children: React.ReactNode; name: string }> = ({ span, children, name }) => {
  const { from, dur } = useShotSpan('s6', span);
  return (
    <Shot from={from} dur={dur} name={name}>
      {children}
    </Shot>
  );
};

export const Scene6: React.FC = () => {
  const f = useShotSpan('s6', SHOTS.s6.f);
  return (
    <>
      <S6Shot span={SHOTS.s6.a} name="6a question">
        <Question />
      </S6Shot>
      <S6Shot span={SHOTS.s6.b} name="6b merge">
        <Merge />
      </S6Shot>
      <S6Shot span={SHOTS.s6.c} name="6c Suela">
        <SuelaAnswer />
      </S6Shot>
      <S6Shot span={SHOTS.s6.d} name="6d pause">
        <EraPause />
      </S6Shot>
      <S6Shot span={SHOTS.s6.e} name="6e Era">
        <EraAnswer />
      </S6Shot>
      <S6Shot span={SHOTS.s6.f} name="6f reaction">
        <Reaction />
      </S6Shot>
      <S6Shot span={SHOTS.s6.g} name="6g hold">
        <Hold lastFrameOfF={f.dur - 1} />
      </S6Shot>
    </>
  );
};
void kf;
