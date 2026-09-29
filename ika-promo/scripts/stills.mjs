// Usage: node scripts/stills.mjs 66 240 426 ...  → out/frames/f_<n>.jpg
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const frames = process.argv.slice(2).map(Number);
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'IkaPromo', browserExecutable});
for (const frame of frames) {
  await renderStill({composition, serveUrl, frame, output: `out/frames/f_${frame}.jpg`, imageFormat: 'jpeg', jpegQuality: 80, browserExecutable, scale: 0.5});
  console.log('ok', frame);
}
