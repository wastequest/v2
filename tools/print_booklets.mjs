// Print the PDFs in dist/ from the live pages, so the printed copies match the site:
//   dist/WasteQuest_Booklet_EN.pdf / _BM.pdf   facilitator booklet (booklet.html, A4)
//   dist/WasteQuest_eBook_EN.pdf / _BM.pdf     eBook (#/book in print mode, A5, teacher reading level)
// Run this after changing lab, lesson, game or teacher content.
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
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.route(/goatcounter|zgo\.at|script\.google/, r => r.abort());
  const jobs = [];
  for (const [lang, name] of [['en', 'EN'], ['bm', 'BM']]) {
    jobs.push({ lang, url: `booklet.html?lang=${lang}`, out: `WasteQuest_Booklet_${name}.pdf` });
    jobs.push({ lang, url: `?print&lang=${lang}&aud=teacher#/book`, out: `WasteQuest_eBook_${name}.pdf`, ready: 'body.bk-printready' });
  }
  for (const { lang, url, out: file, ready } of jobs) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + url, { waitUntil: 'networkidle' });
    if (ready) await page.waitForSelector(ready, { timeout: 180000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);   // QR codes and late layout
    const fonts = await page.evaluate(() => [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))]);
    if (errors.length) throw new Error(`${url}: ${errors.join('; ')}`);
    await page.pdf({ path: join(root, 'dist', file), preferCSSPageSize: true, printBackground: true });
    console.log(`wrote dist/${file} (fonts: ${fonts.join(', ') || 'system fallback'})`);
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
