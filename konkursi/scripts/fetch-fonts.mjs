// Downloads Inter (400, 600, 700; latin + latin-ext) from Google Fonts into public/fonts/
// so renders never depend on the network. Run once: node scripts/fetch-fonts.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const CSS_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
// A modern browser UA makes Google Fonts serve woff2 with unicode-range blocks.
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const KEEP = ['latin', 'latin-ext'];

const css = await (await fetch(CSS_URL, { headers: { 'User-Agent': UA } })).text();
mkdirSync('public/fonts', { recursive: true });
const faces = [];
for (const block of css.split('/* ').slice(1)) {
  const subset = block.slice(0, block.indexOf(' */')).trim();
  if (!KEEP.includes(subset)) continue;
  const weight = /font-weight:\s*(\d+)/.exec(block)[1];
  const url = /url\((https:[^)]+)\)/.exec(block)[1];
  const range = /unicode-range:\s*([^;]+);/.exec(block)[1].trim();
  const file = `inter-${weight}-${subset}.woff2`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(`public/fonts/${file}`, buf);
  faces.push({ weight, subset, file, range });
  console.log(file, buf.length, 'bytes');
}
writeFileSync('public/fonts/faces.json', JSON.stringify(faces, null, 2) + '\n');
