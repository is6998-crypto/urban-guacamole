// Project-wide settings. Timings live in src/timeline.ts; on-screen strings in src/text.ts.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Burn in subtitles for the four VO lines. */
export const SHOW_SUBTITLES = true;

/** Reception sign and email sender. */
export const INSTITUTION_NAME = '[Emri i institucionit]';
/** CV education line. */
export const UNIVERSITY = '[Universiteti]';
/** Appended to the first names on the CV headers when set. */
export const SURNAME_SUELA = '';
export const SURNAME_ERA = '';
/** Reporting hotline or website on the closing card. */
export const REPORT_LINE = '[linja / uebfaqja]';
/** Final card. */
export const HASHTAG = '#JavaKundërKorrupsionit';
/** Final card logo, relative to public/. An empty 240×120 outlined box is drawn if it is missing. */
export const LOGO_PATH = 'logo.png';

/** Paper-grain overlay opacity (0 turns it off). */
export const GRAIN_OPACITY = 0.04;
/** Scene 9 freeze: how much colour is taken out by the end of the hold (0.7 = 70% desaturated). */
export const FREEZE_DESATURATION = 0.7;

export const PANE_W = WIDTH / 2; // 960
export const PANE_H = HEIGHT; // 1080
export const DIVIDER_W = 6;

export const PALETTE = {
  ink: '#22223B',
  offWhite: '#F4F1EA',
  wall: '#DDE5ED',
  instMid: '#8DA9C4',
  instDark: '#3D5A80',
  cafeLight: '#F2D7A6',
  cafeAmber: '#E9A23B',
  cafeWood: '#8B5E3C',
  dusk: '#2E3A59',
  lamp: '#FFD58A',
  navy: '#1D3557',
  marker: '#E63946',
  cvTable: '#ECECEC',
} as const;

/** Voice-over files (in public/audio/) and their placeholder lengths in seconds. */
export const VO = {
  vo1: { file: 'vo1_kryetari_suela.wav', placeholder: 3.5 },
  vo2: { file: 'vo2_kryetari_era.wav', placeholder: 3.5 },
  vo3: { file: 'vo3_suela.wav', placeholder: 15 },
  vo4: { file: 'vo4_era.wav', placeholder: 17 },
} as const;
export type VoId = keyof typeof VO;
