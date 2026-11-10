// Review stills: one frame per scene, at full resolution, into out/stills/scene-0N.png.
// The frame for each scene is STILL_AT in src/timeline.ts (rendered through the ReviewStill composition).
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const fallback = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable = process.env.REMOTION_BROWSER ?? (existsSync(fallback) ? fallback : null);
mkdirSync('out/stills', { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
for (let n = 1; n <= 9; n++) {
  const inputProps = { scene: `s${n}` };
  const composition = await selectComposition({ serveUrl, id: 'ReviewStill', inputProps, browserExecutable });
  const output = `out/stills/scene-0${n}.png`;
  await renderStill({ serveUrl, composition, inputProps, frame: composition.props.stillFrame, output, browserExecutable });
  console.log(output);
}
