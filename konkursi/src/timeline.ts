// The film's clock. Every scene, shot, event and card is listed here in SECONDS on the
// brief's clock (sections 7 and 8, with the placeholder voice-over lengths).
// Retime anything by editing this file only. `sec()` is the only seconds→frames conversion.
//
// Scene 6 stretches to fit the recorded voice-over: shots 6a, 6c and 6e grow or shrink by
// (real length − placeholder), and everything after each of them shifts by the same amount.
import { FPS, VO, VoId } from './config';
import { TXT } from './text';

/** The only seconds→frames conversion in the project. */
export const sec = (s: number) => Math.round(s * FPS);

export type Span = readonly [start: number, end: number];

export const SCENES = {
  s1: { name: 'Hapja', span: [0, 8] },
  s2: { name: 'Mëngjesi', span: [8, 36] },
  s3: { name: 'CV-të', span: [36, 58] },
  s4: { name: 'Para intervistës', span: [58, 90] },
  s5: { name: 'Fillimi i intervistës', span: [90, 108] },
  s6: { name: 'Pyetja', span: [108, 164] },
  s7: { name: 'Pas intervistave', span: [164, 194] },
  s8: { name: 'Rezultati', span: [194, 214] },
  s9: { name: 'Mbyllja', span: [214, 240] },
} as const satisfies Record<string, { name: string; span: Span }>;
export type SceneId = keyof typeof SCENES;

/** Shots, in brief seconds. Split scenes cut both panes together unless noted. */
export const SHOTS = {
  s2: {
    alarm: [8, 12], bed: [12, 16], bath: [16, 21], wardrobe: [21, 26], kitchen: [26, 31], hallway: [31, 36],
  },
  s3: { drop: [36, 40], pan: [40, 53], pull: [53, 58] },
  s4: { a: [58, 65], b: [65, 71], c: [71, 78], d: [78, 85], e: [85, 90] },
  s5: { a: [90, 96], b: [96, 102], c: [102, 108] },
  s6: {
    a: [108, 113], // question, split
    b: [113, 116], // merge
    c: [116, 132], // Suela answers (cutaway 123–126)
    d: [132, 136], // Era pauses
    e: [136, 154], // Era answers (cutaway 144–146)
    f: [154, 159], // reaction
    g: [159, 164], // dimmed hold + cards
  },
  s7: { a: [164, 171], b: [171, 178], c: [178, 185], d: [185, 194] },
  s8: { a: [194, 197], b: [197, 204], c: [204, 214] },
  s9: { freeze: [214, 223], fade: [223, 225], black: [225, 240] },
} as const satisfies Record<string, Record<string, Span>>;

/** Moments inside shots, in brief seconds. */
export const EVENTS = {
  splitWipe: 0.5, // split screen opens/closes over this many seconds
  // Scene 2
  alarmFlip: 10, // 06:59 → 07:00, alarm lights and vibrates
  alarmSwipe: 11, // hand swipes it off
  doorClose: 35, // both front doors close on this frame
  // Scene 3
  circles: { nota: 42, pervoja: 45, certifikata: 48, gjuhet: 51 },
  circleDraw: 0.5,
  // Scene 6
  sheetPickup: 108.5,
  vo1Start: 109.0,
  vo2Start: 109.4,
  mergeDividerFade: 0.4,
  vo3Start: 116.3,
  suelaCutaway: [123, 126] as Span,
  vo4Start: 136.0,
  eraCutaway: [144, 146] as Span,
  // Scene 9
  desaturate: [214, 223] as Span,
  fadeToBlack: [223, 225] as Span,
} as const;

export type CardKind = 'black' | 'full' | 'fullCentre' | 'shared' | 'paneL' | 'paneR' | 'hashtag';
export type Card = { span: Span; kind: CardKind; text: string };
export const CARD_FADE = 0.3;

/** Text cards: times run from fade-in start to fade-out end. */
export const CARDS: Card[] = [
  { span: [1.0, 4.0], kind: 'black', text: TXT.dyKandidate },
  { span: [4.5, 7.5], kind: 'black', text: TXT.njeVendPune },
  { span: [17.0, 20.0], kind: 'shared', text: TXT.njejtaDite },
  { span: [22.0, 25.0], kind: 'shared', text: TXT.njejtiVend },
  { span: [40.0, 42.5], kind: 'full', text: TXT.njejtatStudime },
  { span: [43.0, 45.5], kind: 'full', text: TXT.notaMeTeMira },
  { span: [46.0, 48.5], kind: 'full', text: TXT.meShumePervoje },
  { span: [49.0, 52.5], kind: 'full', text: TXT.meShumeCert },
  { span: [54.0, 57.5], kind: 'full', text: TXT.njeraPakMe },
  { span: [85.0, 89.5], kind: 'paneL', text: TXT.njeraPret },
  { span: [85.5, 89.5], kind: 'paneR', text: TXT.tjetraTakim },
  { span: [103.0, 107.0], kind: 'paneL', text: TXT.neKohe },
  { span: [103.5, 107.0], kind: 'paneR', text: TXT.minutaVone },
  { span: [159.3, 161.5], kind: 'fullCentre', text: TXT.njejtaPyetje },
  { span: [161.8, 164.0], kind: 'fullCentre', text: TXT.dyPergjigje },
  { span: [186.0, 190.0], kind: 'paneL', text: TXT.njeraPretPergjigjen },
  { span: [186.5, 190.0], kind: 'paneR', text: TXT.kryetariDel },
  { span: [190.5, 194.0], kind: 'paneR', text: TXT.njejtinNjeri },
  { span: [215.0, 218.8], kind: 'shared', text: TXT.punaNukShkoi },
  { span: [219.2, 222.5], kind: 'shared', text: TXT.shkoiTeAjo },
  { span: [225.0, 228.5], kind: 'black', text: TXT.nepotizmi },
  { span: [229.0, 232.5], kind: 'black', text: TXT.merita },
  { span: [233.0, 236.5], kind: 'black', text: TXT.raportojeni },
  { span: [237.0, 240.0], kind: 'hashtag', text: TXT.hashtag },
];

/** Brief time of the review still for each scene (out/stills/scene-0N.png). */
export const STILL_AT: Record<SceneId, number> = {
  s1: 2.5,
  s2: 29.5, // kitchen: both invitation emails
  s3: 56.0, // four circles on Suela's CV
  s4: 74.5, // lobby notes vs café laughter
  s5: 100.3, // the two handshakes
  s6: 120.0, // Suela answering
  s7: 191.5, // waiting vs the toast
  s8: 200.5, // rejection email vs "E mora punën!"
  s9: 217.0, // freeze with the first closing card
};

// ---------------------------------------------------------------------------------------
// Voice-over driven timing

export type VoInfo = { exists: boolean; duration: number };
export type VoMap = Record<VoId, VoInfo>;

export const placeholderVo = (): VoMap =>
  Object.fromEntries(Object.entries(VO).map(([k, v]) => [k, { exists: false, duration: v.placeholder }])) as VoMap;

const lenOf = (vo: VoMap, id: VoId) => vo[id].duration;

/** Stretch points: at brief time `at`, everything later shifts by `by` seconds. */
const stretchPoints = (vo: VoMap) => {
  // 6a ends 0.1 s after the later of the two overlapping questions ends.
  const questionEnd = Math.max(EVENTS.vo1Start - 108 + lenOf(vo, 'vo1'), EVENTS.vo2Start - 108 + lenOf(vo, 'vo2'));
  const questionEndPh = Math.max(EVENTS.vo1Start - 108 + VO.vo1.placeholder, EVENTS.vo2Start - 108 + VO.vo2.placeholder);
  return [
    { at: SHOTS.s6.a[1], by: questionEnd - questionEndPh },
    { at: SHOTS.s6.c[1], by: lenOf(vo, 'vo3') - VO.vo3.placeholder },
    { at: SHOTS.s6.e[1], by: lenOf(vo, 'vo4') - VO.vo4.placeholder },
  ];
};

export type Timeline = ReturnType<typeof buildTimeline>;

export const buildTimeline = (vo: VoMap) => {
  const points = stretchPoints(vo);
  /** Brief seconds → real seconds. */
  const t = (s: number) => s + points.filter((p) => s >= p.at - 1e-6).reduce((a, p) => a + p.by, 0);
  /** Brief seconds → frame. */
  const f = (s: number) => sec(t(s));
  /** A brief span → { from, dur } in frames. */
  const span = (sp: Span) => {
    const from = f(sp[0]);
    return { from, dur: Math.max(1, f(sp[1]) - from) };
  };
  const total = f(SCENES.s9.span[1]);

  const voStart = {
    vo1: f(EVENTS.vo1Start),
    vo2: f(EVENTS.vo2Start),
    vo3: f(EVENTS.vo3Start),
    vo4: f(EVENTS.vo4Start),
  } satisfies Record<VoId, number>;
  const voDur = Object.fromEntries((Object.keys(VO) as VoId[]).map((k) => [k, sec(lenOf(vo, k))])) as Record<VoId, number>;

  /** The question subtitle runs from VO1's start to 0.5 s after VO2 ends (1:49.0–1:53.4). */
  const questionSubtitle = { from: voStart.vo1, dur: voStart.vo2 + voDur.vo2 + sec(0.5) - voStart.vo1 };

  return { vo, t, f, span, total, voStart, voDur, questionSubtitle, fps: FPS };
};
