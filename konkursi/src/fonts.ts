import { continueRender, delayRender, staticFile } from 'remotion';
import faces from '../public/fonts/faces.json';

// Inter from Google Fonts (400, 600, 700), downloaded once into public/fonts by
// scripts/fetch-fonts.mjs so that renders never depend on the network.
// The "latin" block covers ë, Ë and ç (U+00CB, U+00E7, U+00EB).
export const FONT = 'Inter';

let loaded = false;
export const ensureFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading Inter');
  Promise.all(
    (faces as { weight: string; file: string; range: string }[]).map((f) => {
      const face = new FontFace(FONT, `url(${staticFile(`fonts/${f.file}`)}) format('woff2')`, {
        weight: f.weight,
        style: 'normal',
        unicodeRange: f.range,
      });
      (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
      return face.load();
    }),
  )
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
ensureFonts();
