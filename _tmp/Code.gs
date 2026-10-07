/* WasteQuest data collector + creator dashboard (Google Apps Script, bound to a Google Sheet).
   Paste this whole file into Extensions > Apps Script. See SETUP_GUIDE.md.
   - doPost: receives batches from the site (js/data/track.js), validates, removes duplicates by event id,
     appends rows to sheet "events", returns {ok:true, ack:[ids]}. The site deletes only acknowledged events.
   - doGet?view=dashboard: totals-only HTML dashboard. Shown ONLY to the script owner (the "Only myself"
     deployment makes Google ask for sign-in; this code also refuses anyone who is not the owner).
   - rebuildSummary (time trigger every 15 min): writes sheet "summary" (long table) for Looker Studio.
   Groups smaller than MIN_GROUP players are hidden in the dashboard and summary. */

const COLS = ["schema", "event_id", "batch_id", "player", "session", "client_time", "server_time", "seq", "type", "module",
  "lang", "aud", "age", "utype", "area", "item", "answer", "score", "max", "secs", "value", "extra"];
const KEYS = { event_id: "id", client_time: "time" };
const MIN_GROUP = 5, MAX_BATCH = 50;

function sheet_(name, header) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); if (header) { sh.appendRow(header); sh.setFrozenRows(1); } }
  return sh;
}
const json_ = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const clip_ = (v, n) => (v === undefined || v === null) ? "" : typeof v === "number" ? (isFinite(v) ? v : "") : String(v).slice(0, n || 80);

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: "bad json" }); }
  const evs = body && Array.isArray(body.e) ? body.e.slice(0, MAX_BATCH) : null;
  if (!evs) return json_({ ok: false, error: "no events" });
  // validate before taking the lock
  const valid = evs.filter(ev => ev && /^[a-z0-9-]{8,60}$/.test(String(ev.id)) && /^[a-z0-9_]{1,24}$/.test(String(ev.type)));
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json_({ ok: false, error: "busy" });          // client retries later
  try {
    const sh = sheet_("events", COLS), last = sh.getLastRow();
    // ponytail: reads the whole event_id column per request; fine to ~100k rows (rotate the sheet then, see guide)
    const seen = new Set(last > 1 ? sh.getRange(2, 2, last - 1, 1).getValues().map(r => r[0]) : []);
    const now = new Date().toISOString(), rows = [], ack = [];
    valid.forEach(ev => {
      ack.push(String(ev.id));
      if (seen.has(ev.id)) return;
      seen.add(ev.id);
      rows.push(COLS.map(c => c === "schema" ? clip_(body.v) : c === "batch_id" ? clip_(body.b, 20) : c === "server_time" ? now
        : clip_(ev[KEYS[c] || c], c === "extra" ? 300 : 80)));
    });
    if (rows.length) sh.getRange(last + 1, 1, rows.length, COLS.length).setValues(rows);
    SpreadsheetApp.flush();
    return json_({ ok: true, ack: ack });
  } finally { lock.releaseLock(); }
}

/* ---------- aggregates (totals only) ---------- */
function aggregates_() {
  const sh = sheet_("events", COLS), n = sh.getLastRow() - 1;
  const rows = n > 0 ? sh.getRange(2, 1, n, COLS.length).getValues() : [];
  const I = {}; COLS.forEach((c, i) => I[c] = i);
  const players = {}, sessions = new Set(), pre = {}, post = {}, survey = {}, starts = {}, finishes = {}, views = {}, secs = {}, exits = {}, returns = {};
  rows.forEach(r => {
    const p = r[I.player], ty = r[I.type], m = r[I.module];
    if (!p) return;
    const P = players[p] = players[p] || {};
    ["age", "utype", "area", "lang"].forEach(k => { if (r[I[k]]) P[k] = r[I[k]]; });
    sessions.add(r[I.session]);
    if (ty === "pre_done" && !(p in pre)) pre[p] = { form: m, score: +r[I.score] };
    if (ty === "post_done" && !(p in post)) post[p] = { form: m, score: +r[I.score] };
    if (ty === "survey") (survey[r[I.item]] = survey[r[I.item]] || []).push(+r[I.value]);
    if (ty === "start") (starts[m] = starts[m] || new Set()).add(p);
    if (ty === "finish") (finishes[m] = finishes[m] || new Set()).add(p);
    if (ty === "view") views[m] = (views[m] || 0) + 1;
    if ((ty === "leave" || ty === "exit") && +r[I.secs] > 0) (secs[m] = secs[m] || []).push(+r[I.secs]);
    if (ty === "exit") exits[m] = (exits[m] || 0) + 1;
    if (ty === "session" && +r[I.value] > 0) returns[p] = Math.max(returns[p] || 0, +r[I.value]);
  });
  const ids = Object.keys(players), mean = a => a.length ? Math.round(a.reduce((s, x) => s + x, 0) / a.length * 100) / 100 : "";
  const median = a => { if (!a.length) return ""; const b = a.slice().sort((x, y) => x - y), h = b.length >> 1; return b.length % 2 ? b[h] : (b[h - 1] + b[h]) / 2; };
  const groupBy = k => { const g = {}; ids.forEach(p => { const v = players[p][k] || "(skipped)"; g[v] = (g[v] || 0) + 1; });
    return Object.keys(g).sort().map(v => [v, g[v] < MIN_GROUP ? "<" + MIN_GROUP : g[v]]); };
  const gain = {}; Object.keys(post).forEach(p => { if (pre[p] && pre[p].form === post[p].form) (gain[pre[p].form] = gain[pre[p].form] || []).push([pre[p].score, post[p].score]); });
  const mods = Array.from(new Set(Object.keys(starts).concat(Object.keys(views)))).sort();
  return {
    updated: new Date().toISOString(), players: ids.length, sessions: sessions.size, events: rows.length,
    age: groupBy("age"), utype: groupBy("utype"), area: groupBy("area"), lang: groupBy("lang"),
    gain: Object.keys(gain).map(f => { const a = gain[f]; return a.length < MIN_GROUP ? [f, "<" + MIN_GROUP, "", "", ""]
      : [f, a.length, mean(a.map(x => x[0])), mean(a.map(x => x[1])), mean(a.map(x => x[1] - x[0]))]; }),
    preOnly: Object.keys(pre).length, postOnly: Object.keys(post).length,
    pages: mods.map(m => [m, views[m] || 0, starts[m] ? starts[m].size : "", finishes[m] ? finishes[m].size : "",
      starts[m] && starts[m].size ? Math.round((finishes[m] ? finishes[m].size : 0) / starts[m].size * 100) + "%" : "", median(secs[m] || []), exits[m] || 0]),
    survey: Object.keys(survey).sort().map(k => [k, survey[k].length < MIN_GROUP ? "<" + MIN_GROUP : survey[k].length, survey[k].length < MIN_GROUP ? "" : mean(survey[k])]),
    returners: Object.keys(returns).length, returnDays: median(Object.keys(returns).map(p => returns[p]))
  };
}

/* ---------- summary sheet for Looker Studio (long format: section, group, metric, value) ---------- */
function rebuildSummary() {
  const a = aggregates_(), out = [["section", "group", "metric", "value", "updated"]], u = a.updated;
  const add = (s, g, m, v) => out.push([s, g, m, v, u]);
  add("overview", "all", "players", a.players); add("overview", "all", "sessions", a.sessions); add("overview", "all", "events", a.events);
  add("overview", "all", "players returning (1+ days later)", a.returners); add("overview", "all", "median days to return", a.returnDays);
  ["age", "utype", "area", "lang"].forEach(k => a[k].forEach(r => add(k, r[0], "players", r[1])));
  a.gain.forEach(r => { add("learning", r[0], "matched pre/post pairs", r[1]); add("learning", r[0], "pre mean (of 5)", r[2]); add("learning", r[0], "post mean (of 5)", r[3]); add("learning", r[0], "mean gain", r[4]); });
  a.pages.forEach(r => { add("pages", r[0], "views", r[1]); add("pages", r[0], "players started", r[2]); add("pages", r[0], "players finished", r[3]);
    add("pages", r[0], "completion", r[4]); add("pages", r[0], "median active seconds", r[5]); add("pages", r[0], "last page before leaving", r[6]); });
  a.survey.forEach(r => { add("survey", r[0], "answers", r[1]); add("survey", r[0], "mean (1-5)", r[2]); });
  const sh = sheet_("summary"); sh.clearContents(); sh.getRange(1, 1, out.length, 5).setValues(out);
}

/* run once from the editor: creates the 15-minute trigger */
function setupTrigger() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === "rebuildSummary").forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("rebuildSummary").timeBased().everyMinutes(15).create();
  rebuildSummary();
}

/* ---------- creator dashboard ---------- */
function doGet(e) {
  const view = e && e.parameter && e.parameter.view;
  if (view !== "dashboard") return json_({ ok: true, service: "WasteQuest collector" });
  const me = Session.getEffectiveUser().getEmail(), who = Session.getActiveUser().getEmail();
  if (!who || who !== me) return HtmlService.createHtmlOutput("<p>Not allowed. Sign in with the owner's Google account and use the dashboard link.</p>");
  const a = aggregates_(), esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const tbl = (head, rows) => `<table><tr>${head.map(h => `<th>${esc(h)}</th>`).join("")}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table>`;
  const html = `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>WasteQuest dashboard</title>
<style>body{font:16px/1.45 system-ui,sans-serif;background:#f9e6cf;color:#1a1932;margin:0;padding:16px;max-width:1000px}
h1,h2{font-family:monospace}section{background:#fff;border:3px solid #1a1932;box-shadow:4px 4px 0 rgba(26,25,50,.35);padding:12px;margin:0 0 16px;overflow-x:auto}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #1a1932;padding:4px 8px;text-align:left}th{background:#ffeb57}.k{font:700 2rem monospace}
.g{display:flex;gap:12px;flex-wrap:wrap}.g div{background:#fff;border:3px solid #1a1932;padding:8px 14px}</style>
<h1>WasteQuest: totals</h1><p>Updated ${esc(a.updated)} · totals only · groups under ${MIN_GROUP} players hidden (&lt;${MIN_GROUP}). Raw rows stay in the Sheet.</p>
<div class="g"><div><div class="k">${a.players}</div>player codes</div><div><div class="k">${a.sessions}</div>visits</div><div><div class="k">${a.returners}</div>came back another day</div><div><div class="k">${a.events}</div>events</div></div>
<section><h2>Who</h2><div class="g">${tbl(["Age band", "Players"], a.age)}${tbl(["User type", "Players"], a.utype)}${tbl(["Area", "Players"], a.area)}${tbl(["Language", "Players"], a.lang)}</div></section>
<section><h2>Learning gain (5-question check, matched pairs)</h2>${tbl(["Form", "Pairs", "Before (of 5)", "After (of 5)", "Mean gain"], a.gain)}<p>Pre-checks done: ${a.preOnly} · final checks done: ${a.postOnly}</p></section>
<section><h2>Pages: use, completion, drop-off</h2>${tbl(["Page", "Views", "Players started", "Players finished", "Completion", "Median active s", "Last page before leaving"], a.pages)}</section>
<section><h2>1-minute survey (1-5)</h2><p>S1 separate waste this week · S2 try a waste-to-wealth activity · S3 enjoyment · S4 ease</p>${tbl(["Item", "Answers", "Mean"], a.survey)}</section>`;
  return HtmlService.createHtmlOutput(html).setTitle("WasteQuest dashboard");
}
