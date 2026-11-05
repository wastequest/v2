# WasteQuest v2

WasteQuest is a bilingual (English / Bahasa Melayu) Waste-to-Wealth learning module from Universiti Putra Malaysia
(Department of Chemical and Environmental Engineering, Faculty of Engineering; Dr Wan Azlina Wan Ab Karim Ghani and team).
It has games, virtual-lab simulations, 15 hands-on labs with narrated videos, a live class quiz, missions, an eBook
and a printable micro-credential certificate, for kids (7–12), teens (13–17), adults and teachers.

This repository is the v2 preview. It is a static site with no framework and no build step for the online version:
what is in the repository is what gets served.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The single page. Loads `css/app.css`, `css/v2.css` and every script in `js/` in order, then calls `WQ.start()`. |
| `js/core.js` | `WQ`: language (`WQ.lang`, `WQ.t({en,bm})`), audience (`WQ.aud`, `WQ.pick({kids,teens,adults})`), storage (`WQ.store`, keys prefixed `wq-`), hash router (`#/view/arg…`), badges, toasts, usage counter. |
| `js/games/`, `js/sims/` | Games (sort, match, crossword/word search, myth, quiz) and simulations (pH, compost, eco-enzyme, cash, footprint). Each calls `WQ.registerGame(id, {title, desc, icon, badge, mount})`; route `#/game/<id>`. |
| `js/labs.js`, `js/learn.js` | Hands-on labs (`#/labs`, `#/lab/<id>`) and the 7-chapter Academy (`#/learn/<n>`). |
| `js/class.js`, `js/event.js` | Live class battle and event mode. Phones connect peer-to-peer with PeerJS, loaded from a CDN only when needed. |
| `js/teacher.js`, `js/cert.js` | Teacher hub (lesson plans, rubrics, credential framework) and the final quest + certificate. |
| `js/town/` | The pixel-art town home screen, building banners, cover art, rewards (XP, coins, shop). |
| `js/data/` | Question bank (`questions.js`) and research data collection (`track.js`, see below). |
| `js/missions.js`, `js/scan.js`, `js/creator.js`, `js/share.js`, `js/book.js` | Missions, camera scanner, creator dashboard link, share page with QR code, eBook flipbook. |
| `js/vendor/` | Third-party code kept as-is: StPageFlip (`page-flip.js`) and qrcodejs (`qrcode.js`). |
| `assets/` | Images, lab posters and the narrated lab videos (`assets/videos/v2/<lab>_<en|bm>.mp4` + `<lab>.jpg`). |
| `dist/` | Downloads: the single-file offline copy and the booklet/eBook PDFs. |
| `booklet.html` | Print layout used to make the booklet PDFs. |
| `manifest.webmanifest`, `sw.js` | Lets phones and Chromebooks install WasteQuest as an app, and keeps it working when school Wi-Fi drops: page, CSS and JS are network-first with a cached fallback; images are cache-first; videos and PDFs are never cached. |
| `tools/` | Offline-pack build and the checks below. |

A module renders into `#view` from its `mount(el, {args, relang})` and returns a cleanup function, which the router
calls before the next page. `relang` is true when the same page is re-drawn after a language switch. Per-module CSS
goes in `WQ.css(id, text)`.

## Run it locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000/. Any static server works.

## Offline copy

`dist/WasteQuest_offline.html` is the whole app in one file, for schools without reliable internet. Rebuild it after
changing anything in `index.html`, `css/` or `js/`:

```sh
python3 tools/build_offline.py
```

It inlines the stylesheets and scripts and turns quoted local image paths into `data:` URIs. Lab videos are not
inlined; they come with the offline zip pack.

## Checks

| Check | Command |
| --- | --- |
| Every referenced local file exists, every lab has its videos, every script parses | `python3 tools/check_assets.py` |
| The offline copy matches the sources | `python3 tools/build_offline.py --check` |
| Every route, in EN and BM, as kid/teen/adult/teacher, at desktop and 390 px: no script errors, no missing files, no "page not found" links, no sideways scrolling, no axe-core accessibility violations | `npm i --no-save playwright@1.63.0 axe-core@4.14.0 && npx playwright install chromium && node tools/smoke.mjs` |

`.github/workflows/checks.yml` runs all three on every push and pull request.

## Data and privacy

- **Usage counter**: GoatCounter (`wastequest.goatcounter.com`) counts page opens and a few events. No cookies, no names.
- **Research data**: `js/data/track.js` keeps coded, anonymous records (random player id, answers, scores, optional
  age band / user type / area) in the browser and uploads them in batches to a Google Apps Script endpoint. Players can
  opt out on `#/privacy`; after opting out nothing is queued or sent.
- Progress, badges and certificates are stored only in the browser (`localStorage`).

Open content, safety and privacy questions from the latest review are in [`docs/OPEN-QUESTIONS.md`](docs/OPEN-QUESTIONS.md).

`index.html` has `<meta name="robots" content="noindex">` until the project lead approves public listing.
