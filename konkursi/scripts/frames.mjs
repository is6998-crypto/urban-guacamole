// Render arbitrary frames of the film for checking: node scripts/frames.mjs out/dir 12.5 30 ...
// Times are in seconds on the film clock (placeholder VO), written as <dir>/t<time>.png
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const [dir, ...times] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
const fallback = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable = process.env.REMOTION_BROWSER ?? (existsSync(fallback) ? fallback : null);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const comp = await selectComposition({ serveUrl, id: 'Konkursi', browserExecutable });
for (const t of times) {
  const frame = Math.round(Number(t) * comp.fps);
  await renderStill({ serveUrl, composition: comp, frame, output: path.join(dir, `t${t}.png`), browserExecutable, scale: Number(process.env.SCALE ?? 0.5) });
  console.log('rendered', t);
}
