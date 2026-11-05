// Smoke test for WasteQuest: crawls every in-app route (#/...) it can reach from the registries and from links on
// each page, in English and Bahasa Melayu, as a kid and as an adult, at desktop and phone width.
// Fails (exit 1) on: uncaught page errors, console errors, failed or 4xx/5xx local requests, links to routes that
// show "Page not found", horizontal scrolling at phone width, and axe-core accessibility violations.
//
//   npm i --no-save playwright@1.63.0 axe-core@4.14.0 && npx playwright install chromium
//   node tools/smoke.mjs                                  # serves the repo itself on a free port
//   BASE_URL=http://localhost:8000/ node tools/smoke.mjs  # or test a running server
//   ROUTES=game/sort,labs node tools/smoke.mjs            # only these routes (no link crawl)
//
// Modules are resolved from the current directory, so run it where they are installed.
// External hosts (fonts, analytics, PeerJS, Google Apps Script) are blocked: the app must cope without them.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(join(process.cwd(), 'noop.js'));
const { chromium } = require('playwright');
const axePath = require.resolve('axe-core/axe.min.js');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const freePort = () => new Promise((ok, fail) => {
  const s = createServer().listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => ok(port)); }).on('error', fail);
});
async function serve() {
  const port = await freePort();
  const proc = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', root], { stdio: 'ignore' });
  const base = `http://127.0.0.1:${port}/`;
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base)).ok) return { base, stop: () => proc.kill() }; } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  proc.kill();
  throw new Error('static server did not start');
}

const runs = [
  { name: 'en adults desktop', lang: 'en', aud: 'adults', viewport: { width: 1280, height: 800 }, axe: true },
  { name: 'bm kids phone', lang: 'bm', aud: 'kids', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, axe: true },
  { name: 'bm teacher desktop', lang: 'bm', aud: 'teacher', viewport: { width: 1280, height: 800 } },
  { name: 'en teens phone', lang: 'en', aud: 'teens', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
];
const NOT_FOUND = /Page not found\.|Halaman tidak dijumpai\./;
// Routes that change state when merely opened, or are not pages: never visit.
const SKIP = [/^class\/(host|join)\b.*\/\w{4,}/];

const server = process.env.BASE_URL ? { base: process.env.BASE_URL.replace(/\/?$/, '/'), stop() {} } : await serve();
const origin = new URL(server.base).origin;
const browser = await chromium.launch();
let failures = 0, visited = 0;

try {
  for (const run of runs) {
    const { name, lang, aud, axe, ...opts } = run;
    const context = await browser.newContext({ ...opts, serviceWorkers: 'block' });
    await context.route(url => new URL(url).origin !== origin, r => r.abort());
    await context.addInitScript(([l, a]) => { try { localStorage.setItem('wq-lang', l); localStorage.setItem('wq-aud', a); } catch {} }, [lang, aud]);
    const page = await context.newPage();
    let problems = [];
    page.on('pageerror', e => problems.push(`page error: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|net::|Failed to load resource/.test(m.text())) problems.push(`console error: ${m.text()}`); });
    page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(origin)) problems.push(`HTTP ${r.status()} ${r.url()}`); });
    page.on('requestfailed', r => { if (r.url().startsWith(origin) && !/\.(mp4|webm)$/.test(r.url())) problems.push(`request failed: ${r.url()}`); });
    page.on('dialog', d => d.dismiss());
    await page.goto(server.base + '#/home', { waitUntil: 'load' });
    await page.waitForFunction(() => typeof WQ !== 'undefined' && document.querySelector('#view').children.length);

    const fixed = process.env.ROUTES ? process.env.ROUTES.split(',') : null;
    const queue = fixed || await page.evaluate(() => ['home', 'games', 'badges',
      ...Object.keys(WQ.pages).filter(p => p !== 'home'), ...Object.keys(WQ.games).map(g => 'game/' + g),
      ...(WQ.labs || []).map(l => 'lab/' + l.id)]);
    const seen = new Set(queue), from = new Map();
    for (let i = 0; i < queue.length; i++) {
      const route = queue[i];
      if (SKIP.some(re => re.test(route))) continue;
      problems = [];
      await page.evaluate(r => { location.hash = '#/' + r; }, route);
      await page.waitForTimeout(250);
      await page.waitForLoadState('networkidle').catch(() => {});
      visited++;
      const info = await page.evaluate(() => ({
        text: document.querySelector('#view').innerText.slice(0, 400),
        overflow: document.documentElement.scrollWidth - innerWidth,
        h1: document.querySelectorAll('#view h1').length,
        links: [...document.querySelectorAll('a[href^="#/"]')].map(a => decodeURI(a.getAttribute('href').slice(2)).replace(/\/$/, '')),
      }));
      if (NOT_FOUND.test(info.text)) problems.push(`shows "page not found"${from.has(route) ? ` (linked from #/${from.get(route)})` : ''}`);
      if (info.overflow > 1) problems.push(`page scrolls sideways by ${info.overflow}px`);
      if (!fixed) for (const l of info.links) if (!seen.has(l) && seen.size < 400) { seen.add(l); from.set(l, route); queue.push(l); }
      if (axe) {
        if (!(await page.evaluate(() => !!window.axe))) await page.addScriptTag({ path: axePath });
        const v = await page.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map(v =>
          `axe ${v.impact} ${v.id}: ${v.help} — ` + v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ') + (v.nodes.length > 3 ? ` (+${v.nodes.length - 3} more)` : '')));
        problems.push(...v);
      }
      const uniq = [...new Set(problems)];
      if (uniq.length) { failures += uniq.length; console.log(`FAIL ${name} #/${route}`); uniq.forEach(p => console.log('     ' + p)); }
    }
    console.log(`---- ${name}: ${queue.length} routes`);
    await context.close();
  }
} finally {
  await browser.close();
  server.stop();
}
console.log(failures ? `\n${failures} problem(s) across ${visited} page visits.` : `\nNo problems across ${visited} page visits.`);
process.exit(failures ? 1 : 0);
