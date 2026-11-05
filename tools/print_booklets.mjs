// Print the facilitator booklets (booklet.html) to dist/WasteQuest_Booklet_EN.pdf and _BM.pdf.
// Run this after changing lab, lesson, game or teacher content, so the printed copy matches the site.
//
//   npm i --no-save playwright@1.63.0 && npx playwright install chromium
//   node tools/print_booklets.mjs           # serves the repo itself on a free port
//
// Needs internet for the Google Fonts (Nunito, Baloo 2, Pixelify Sans); without them the PDF falls back to
// system fonts. Modules are resolved from the current directory, so run it where playwright is installed.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(join(process.cwd(), 'noop.js'));
const { chromium } = require('playwright');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const port = await new Promise((ok, fail) => { const s = createServer().listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => ok(port)); }).on('error', fail); });
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', root], { stdio: 'ignore' });
const base = `http://127.0.0.1:${port}/`;
for (let i = 0; i < 50; i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }

const browser = await chromium.launch();
try {
  const context = await browser.newContext();
  await context.route(/goatcounter|zgo\.at|script\.google/, r => r.abort());
  for (const [lang, name] of [['en', 'EN'], ['bm', 'BM']]) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}booklet.html?lang=${lang}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);   // QR codes and late layout
    const fonts = await page.evaluate(() => [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))]);
    if (errors.length) throw new Error(`booklet.html?lang=${lang}: ${errors.join('; ')}`);
    const out = join(root, 'dist', `WasteQuest_Booklet_${name}.pdf`);
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
    console.log(`wrote dist/WasteQuest_Booklet_${name}.pdf (fonts: ${fonts.join(', ') || 'system fallback'})`);
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
