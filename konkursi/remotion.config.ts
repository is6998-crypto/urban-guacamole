import { existsSync } from 'node:fs';
import { Config } from '@remotion/cli/config';

// Use an already-installed Chromium headless shell when there is one (set REMOTION_BROWSER to
// point at yours); otherwise Remotion downloads its own the first time it renders.
const browser = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
if (browser && existsSync(browser)) Config.setBrowserExecutable(browser);

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setConcurrency(4);
