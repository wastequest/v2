/* WasteQuest eBook (route #/book/<page>): the whole module as a page-turning book, EN/BM, reading level = "Who's playing?".
   Pages are built from the same data as the site (js/labs.js, js/learn.js WQ.learnChapters, js/data/questions.js,
   WQ.renderTeacherPrint) plus the book-only text below, laid out on 480x680 design pages and scaled to fit.
   Page turning: StPageFlip (js/vendor/page-flip.js, MIT). PDF: the same pages on A5 (print CSS; build_v2.py ebook).
   SOURCES (book-only text): Zero-Plastic Hero 2024 facts from site/js/labs.js (v1 ZPH page; group numbers, links and school name
   left out per PLAN_v2.md); partner text from pitch_mbsj/WasteQuest_Proposal_1page.docx (general version);
   glossary facts as cited in js/data/questions.js and js/labs.js (methane GWP 28: IPCC AR5; microplastics < 5 mm: NOAA;
   open burning s.29A EQA 1974; Scope 3 cat. 5: GHG Protocol; eco-enzyme 1:3:10). */
(() => {
if (typeof WQ === "undefined") return;
{ const q = new URLSearchParams(location.search); if (/^(en|bm)$/.test(q.get("lang"))) WQ.lang = q.get("lang"); if (/^(kids|teens|adults|teacher)$/.test(q.get("aud"))) WQ.aud = q.get("aud"); }   // headless PDF build
const W = WQ, t = W.t, E = W.esc, X = o => E(t(o)), L = (en, bm) => ({ en, bm });
let PW = 480, PH = 680;   // design page size; phones get 340x520 so text stays readable
const SMALL = () => innerWidth < 560, SITE = "https://wastequest.github.io/";
const AUTHORS = "Wan Azlina Wan Ab Karim Ghani, Shafreeza Sobri, Izzudin Ibrahim, Nur Syakina Jamali, Mohamad Faiz Mukhtar Gunam Resul, Salmiaton Ali";

/* ---------- UI + book text ---------- */
const S = {
  bind: L("Binding your book…", "Menjilid buku anda…"),
  prev: L("Previous page", "Halaman sebelum"), next: L("Next page", "Halaman seterusnya"),
  toc: L("Contents", "Kandungan"), snd: L("Page sound", "Bunyi halaman"), pdf: L("PDF", "PDF"), pdfL: L("Download PDF", "Muat turun PDF"),
  fs: L("Full screen", "Skrin penuh"), lvl: L("Reading level", "Tahap bacaan"), page: L("Page", "Halaman"),
  aud: { kids: L("Kids 7–12", "Kanak-kanak 7–12"), teens: L("Teens 13–17", "Remaja 13–17"), adults: L("Adults", "Dewasa"), teacher: L("Teacher", "Guru") },
  watch: L("▶ Watch the video", "▶ Tonton video"), scan: L("Scan to watch", "Imbas untuk menonton"),
  vidMissing: L("This copy has no video file. Open the website or the offline pack to watch it.", "Salinan ini tiada fail video. Buka laman web atau pek luar talian untuk menontonnya."),
  close: L("Close", "Tutup"),
  quiz: L("Quick quiz", "Kuiz pantas"), quizH: L("Tap an answer to check it.", "Tekan satu jawapan untuk menyemaknya."),
  right: L("Correct!", "Betul!"), wrong: L("Not quite. Try another answer.", "Belum tepat. Cuba jawapan lain."), key: L("Answers", "Jawapan"),
  cont: L("continued", "sambungan"), part: L("Part", "Bahagian"),
  site: L("Open on the website", "Buka di laman web"), play: L("Play", "Main"), tryLab: L("Try the lab", "Cuba makmal"),
  hint: L("Swipe, tap the arrows or use the ← → keys to turn the page.", "Leret, tekan anak panah atau guna kekunci ← → untuk menyelak halaman."),
  fact: L("Did you know?", "Tahukah anda?"), notes: L("My notes", "Catatan saya"),
  sub: L("The Waste-to-Wealth Book", "Buku Sisa kepada Kekayaan"), tag: L("Learn it · Play it · Make it", "Belajar · Main · Hasilkan"),
  ed: L("eBook · 2026 edition", "eBuku · Edisi 2026"), by: L("Written by", "Ditulis oleh"),
  dept: L("Department of Chemical and Environmental Engineering, Faculty of Engineering, Universiti Putra Malaysia", "Jabatan Kejuruteraan Kimia dan Alam Sekitar, Fakulti Kejuruteraan, Universiti Putra Malaysia"),
  open: L("Play WasteQuest", "Main WasteQuest"),
  badge: L("Bookworm", "Ulat Buku"), badgeD: L("Read the WasteQuest eBook to the last page", "Baca eBuku WasteQuest hingga halaman terakhir"),
  // lab labels
  ages: L("Ages", "Umur"), diff: L("Difficulty", "Kesukaran"), heat: L("Needs heat", "Perlu haba"), noHeat: L("No heat", "Tanpa haba"),
  sup: { light: L("Light supervision", "Pengawasan ringan"), close: L("Close supervision", "Pengawasan rapi"), adult: L("Adult does hot or sharp steps", "Orang dewasa buat langkah panas atau tajam") },
  waste: L("Waste used", "Sisa digunakan"), product: L("Product", "Produk"), cost: L("Cost", "Kos"), time: L("Time", "Masa"),
  why: L("Why it matters", "Mengapa ia penting"), env: L("Environment", "Alam sekitar"), econ: L("Economy", "Ekonomi"), soc: L("Society", "Masyarakat"),
  mats: L("You need", "Anda perlukan"), steps: L("Steps", "Langkah-langkah"), safety: L("Safety first", "Keselamatan dahulu"),
  sci: L("The science", "Sainsnya"), teach: L("Teacher tip", "Tip guru"), ext: L("Challenge", "Cabaran"), refl: L("Think about it", "Fikirkan"),
  gate: L("Age and supervision", "Umur dan pengawasan"), photo: L("Photo", "Foto"),
  credit: L("Photos and posters: UPM chemical engineering students, Faculty of Engineering.", "Foto dan poster: pelajar kejuruteraan kimia UPM, Fakulti Kejuruteraan."),
  lvlN: { kids: L("Kids level", "Tahap kanak-kanak"), teens: L("Teens level", "Tahap remaja"), adults: L("Adults level", "Tahap dewasa") },
  code: L("Arduino sketch", "Lakaran Arduino"), lab: L("Lab", "Makmal"), glance: L("Labs at a glance", "Ringkasan makmal")
};

/* parts: colour, banner building, opener text */
const PARTS = {
  welcome: { c: "#0098dc", n: 1, t: L("Welcome to Eco-City", "Selamat Datang ke Bandar Eko"), s: L("A little island town that needs your help.", "Sebuah bandar pulau kecil yang memerlukan bantuan anda.") },
  learn: { c: "#93388f", n: 2, b: "academy", t: L("The Academy: Learn", "Akademi: Belajar"), s: L("Seven short lessons on where waste goes and how to turn it into something useful.", "Tujuh pelajaran ringkas tentang ke mana sisa pergi dan cara menukarnya menjadi sesuatu yang berguna.") },
  play: { c: "#ea323c", n: 3, b: "recycle", t: L("Play: Games, Missions & the Arena", "Main: Permainan, Misi & Arena"), s: L("Games, virtual labs, real-world missions, class battles and certificates.", "Permainan, makmal maya, misi dunia sebenar, pertandingan kelas dan sijil.") },
  make: { c: "#1e6f50", n: 4, b: "maker", t: L("Make: Maker Lab & Compost Farm", "Hasilkan: Makmal Pereka & Ladang Kompos"), s: L("15 hands-on labs that turn real waste into useful things.", "15 makmal amali yang menukar sisa sebenar menjadi barang berguna.") },
  heroes: { c: "#f77622", n: 5, b: "arena", t: L("Hall of Heroes", "Dewan Wira"), s: L("10 waste-to-wealth projects by UPM chemical engineering students, 2024.", "10 projek sisa kepada kekayaan oleh pelajar kejuruteraan kimia UPM, 2024.") },
  adults: { c: "#0069aa", n: 6, b: "market", t: L("For Parents, Teachers & Partners", "Untuk Ibu Bapa, Guru & Rakan Kongsi"), s: L("Running WasteQuest with a class, a community or a company.", "Melaksanakan WasteQuest bersama kelas, komuniti atau syarikat.") },
  back: { c: "#1a1932", n: 7, t: L("Words, Index & Credits", "Istilah, Indeks & Penghargaan"), s: L("", "") }
};
const DIST = [
  ["academy", "🏫", L("Academy", "Akademi"), L("Lessons, quick quizzes and your certificate.", "Pelajaran, kuiz pantas dan sijil anda."), "learn"],
  ["recycle", "♻️", L("Recycling Plant", "Loji Kitar Semula"), L("Sorting and word games, and the camera scan-and-sort helper.", "Permainan mengasing dan perkataan, serta pembantu imbas-dan-asing kamera."), "play"],
  ["compost", "🌱", L("Compost Farm", "Ladang Kompos"), L("Compost, eco-enzyme and growing labs.", "Makmal kompos, eko-enzim dan bercucuk tanam."), "make"],
  ["maker", "🛠️", L("Maker Lab", "Makmal Pereka"), L("Craft and science labs: candles, soap, bags, bricks and more.", "Makmal kraf dan sains: lilin, sabun, beg, bata dan banyak lagi."), "make"],
  ["market", "🏪", L("Market", "Pasar"), L("Money from waste, your footprint and the town shop.", "Wang daripada sisa, jejak anda dan kedai bandar."), "play"],
  ["arena", "🏟️", L("Arena", "Arena"), L("Live class battles and Event Town.", "Pertandingan kelas langsung dan Bandar Acara."), "play"]
];

/* ---------- small helpers ---------- */
const H2 = (icon, txt, a) => `<h2 class="bk-h2"${a ? ` data-a="${a}"` : ""}><span aria-hidden="true">${icon}</span> ${txt}</h2>`;
const H3 = txt => `<h3 class="bk-h3">${txt}</h3>`;
const p = html => `<p>${html}</p>`;
const note = (cls, html) => `<div class="note ${cls}">${html}</div>`;
const list = (items, tag = "ul", cls = "") => `<${tag} class="bk-list ${cls}">${items.map(i => `<li>${i}</li>`).join("")}</${tag}>`;
const goBtn = (href, txt) => `<p class="bk-gop"><a class="bk-go" href="${href}">${txt}</a></p>`;
const lvl = () => W.aud === "kids" ? "kids" : W.aud === "teens" ? "teens" : "adults";
const art = (w, h, fn) => { try { const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.imageSmoothingEnabled = false; if (fn(c, x) === false) return ""; return c.toDataURL(); } catch (e) { return ""; } };
const ARTC = {};
const townImg = st => ARTC["town" + st] ??= art(400, 300, (c, x) => { const A = W.townArt; if (!A) return false; const s = {}; A.DISTRICTS.forEach(d => s[d] = st); A.draw(x, { states: s, t: 900 }); });
const bannerImg = id => ARTC["b" + id] ??= art(400, 120, c => { const A = W.townArt; if (!A || !A.banner) return false; A.banner(c, id, 3); });
const coverImg = id => ARTC["c" + id] ??= art(160, 100, c => W.labCovers ? W.labCovers.draw(c, id) : false);
const robotImg = () => ARTC.robot ??= art(24, 24, (c, x) => { const A = W.townArt; if (!A || !A.robot) return false; A.robot(x, 12, 21); });
const pix = (src, cls, alt = "") => src ? `<img class="pix ${cls}" src="${src}" alt="${E(alt)}">` : "";

/* questions: dedupe across the whole book */
let usedQ;
const KEYS = { candle: ["candle", "cooking oil", "wax"], petfood: ["pet", "fish", "food waste"], treasure: ["soap", "lye", "oil"], litmus: ["pH", "indicator", "acid", "cabbage", "telang"],
  odour: ["coffee", "odour", "smell", "charcoal"], watering: ["water", "sensor", "drip"], enzyme: ["enzyme", "ferment"], ecobrick: ["ecobrick", "eco-brick", "bottle"],
  compost: ["compost", "worm"], bioplastic: ["bioplastic", "starch"], vgarden: ["garden", "plant", "soil"], hydro: ["hydropon", "nutrient", "plant"],
  fused: ["plastic bag", "LDPE", "melt", "fume", "PVC"], lifebuoy: ["float", "bubble", "density"], sleepbag: ["insulat", "bubble wrap", "homeless", "textile"] };
const TOPIC = { candle: "labs", petfood: "labs", treasure: "labs", litmus: "ph", odour: "circular", watering: "sdg", enzyme: "enzyme", ecobrick: "plastics", compost: "compost",
  bioplastic: "plastics", vgarden: "compost", hydro: "circular", fused: "plastics", lifebuoy: "plastics", sleepbag: "circular" };
function pickQ(keys, topic, n = 3) {
  const tr = lvl() === "kids" ? "kids" : null, txt = q => (q.q.en + " " + q.a.map(a => a.en).join(" ")).toLowerCase();
  const score = q => keys.reduce((s, k) => s + (txt(q).includes(k.toLowerCase()) ? 2 : 0), 0) + (q.topic === topic ? 1 : 0) + (tr && q.tracks.includes(tr) ? .5 : 0);
  const out = W.questions.filter(q => !usedQ.has(q.id)).map(q => [score(q), q]).filter(([s]) => s >= 1).sort((a, b) => b[0] - a[0]).slice(0, n).map(([, q]) => q);
  out.forEach(q => usedQ.add(q.id));
  return out;
}
/* quiz -> blocks: header + one block per question + print-only answer key */
function quizBlocks(qs, id) {
  if (!qs.length) return [];
  return [`<div class="bk-qhd">${H3("✅ " + X(S.quiz))}<p class="bk-qhint">${X(S.quizH)}</p></div>`,
    ...qs.map((q, i) => `<div class="bk-q" data-c="${q.c}" data-why="${E(t(q.why))}"><p class="bk-qq"><b>${i + 1}.</b> ${X(q.q)}</p><div class="bk-opts">${q.a.map((a, j) => `<button type="button" data-qa="${j}">${"ABCD"[j]}. ${X(a)}</button>`).join("")}</div><p class="bk-fb" aria-live="polite"></p></div>`),
    `<p class="bk-key">${X(S.key)}: ${qs.map((q, i) => `${i + 1} ${"ABCD"[q.c]}`).join(" · ")}</p>`];
}
const learnQ = ch => { const all = [...(ch.qc.kids || []), ...(ch.qc.teens || [])]; return (lvl() === "kids" ? (ch.qc.kids || all) : [...(ch.qc.teens || []), ...(ch.qc.kids || [])]).slice(0, 3).length ? (lvl() === "kids" ? (ch.qc.kids || all) : [...(ch.qc.teens || []), ...(ch.qc.kids || [])]).slice(0, 3) : all.slice(0, 3); };
const videoBlock = id => {
  const v2 = W.labV2 && W.labV2.has(id);
  return v2 ? `<figure class="bk-vid"><a class="bk-vthumb" href="#/lab/${id}" data-vid="${id}" aria-label="${X(S.watch)}"><img src="assets/videos/v2/${id}.jpg" alt="" onerror="this.remove()"><span class="bk-play" aria-hidden="true">▶</span></a>
    <figcaption><button type="button" class="bk-vbtn" data-vid="${id}">${X(S.watch)}</button><span class="bk-qrw"><span class="bk-qr" data-qr="${SITE}#/lab/${id}"></span><small>${X(S.scan)}</small></span></figcaption></figure>` : "";
};

/* ---------- sections ---------- */
/* section = { part, run, a (anchor), toc (title for contents), blocks: [html], opener?: true (full page) } */
function buildSections() {
  usedQ = new Set();
  const out = [], labs = W.labs, R = robotImg();
  const sec = (part, a, toc, blocks, extra = {}) => out.push({ part, a, toc, run: toc, blocks: blocks.filter(Boolean), ...extra });
  const opener = part => out.push({ part, opener: true, a: "part-" + part, html: openerHTML(part) });

  /* front matter */
  out.push({ part: "front", fixed: true, cls: "bk-cover", html: coverHTML(), hard: true });
  out.push({ part: "front", fixed: true, html: titleHTML() });
  sec("front", "how", t({ en: "How to use this book", bm: "Cara menggunakan buku ini" }), [
    H2("📖", X({ en: "How to use this book", bm: "Cara menggunakan buku ini" }), "how"),
    `<div class="bk-kitar">${pix(R, "bk-robot", "Kitar")}<p class="bk-bubble">${X({ en: "Hi! I'm Kitar, the recycling robot of Eco-City. I'll be your guide. Let's turn waste into wealth!", bm: "Hai! Saya Kitar, robot kitar semula Bandar Eko. Saya akan menjadi pemandu anda. Jom tukar sisa jadi harta!" })}</p></div>`,
    list([
      t({ en: "📖 <b>Turn pages:</b> swipe, tap the arrows, or use the ← → keys. Tap <b>Contents</b> to jump.", bm: "📖 <b>Selak halaman:</b> leret, tekan anak panah atau guna kekunci ← →. Tekan <b>Kandungan</b> untuk melompat." }),
      t({ en: "▶ <b>Videos</b> play right on the page: tap the picture.", bm: "▶ <b>Video</b> dimainkan terus pada halaman: tekan gambarnya." }),
      t({ en: "✅ <b>Quick quizzes:</b> tap an answer to check it.", bm: "✅ <b>Kuiz pantas:</b> tekan jawapan untuk menyemaknya." }),
      t({ en: "🔗 <b>Green buttons</b> open the matching game or lab on the WasteQuest website.", bm: "🔗 <b>Butang hijau</b> membuka permainan atau makmal yang sepadan di laman web WasteQuest." }),
      t({ en: "🧒 <b>Reading level:</b> choose Kids, Teens, Adults or Teacher in the toolbar. Lessons, science notes and quizzes change to match.", bm: "🧒 <b>Tahap bacaan:</b> pilih Kanak-kanak, Remaja, Dewasa atau Guru dalam bar alat. Pelajaran, nota sains dan kuiz akan berubah mengikutnya." }),
      t({ en: "⬇️ <b>PDF:</b> download the whole book to print or share.", bm: "⬇️ <b>PDF:</b> muat turun seluruh buku untuk dicetak atau dikongsi." })
    ], "ul", "bk-plain"),
    H3(X({ en: "Look out for these signs", bm: "Perhatikan tanda-tanda ini" })),
    `<div class="bk-signs">${[["⛔", { en: "Danger: an adult does this step", bm: "Bahaya: orang dewasa melakukan langkah ini" }], ["⚠️", { en: "Take care", bm: "Berhati-hati" }], ["🔬", { en: "The science behind a step", bm: "Sains di sebalik langkah" }], ["🧑‍🏫", { en: "Tip for teachers", bm: "Tip untuk guru" }]].map(([i, d]) => `<div><b>${i}</b><span>${X(d)}</span></div>`).join("")}</div>`
  ]);
  out.push({ part: "front", tocPage: true, a: "toc", run: t(S.toc) });   // filled in after the other sections exist

  /* part 1 */
  opener("welcome");
  sec("welcome", "story", t({ en: "The story of Eco-City", bm: "Kisah Bandar Eko" }), [
    H2("🏝️", X({ en: "The story of Eco-City", bm: "Kisah Bandar Eko" }), "story"),
    p(X({ en: "Eco-City is a little island town. Its people throw away a lot: food scraps, bottles, bags, old clothes and broken gadgets. The rubbish piles up, the sky turns grey and the river starts to smell.", bm: "Bandar Eko ialah sebuah bandar pulau kecil. Penduduknya membuang banyak barang: sisa makanan, botol, beg, pakaian lama dan gajet rosak. Sampah bertimbun, langit menjadi kelabu dan sungai mula berbau." })),
    `<div class="bk-two">${townImg(0) ? `<figure>${pix(townImg(0), "bk-town")}<figcaption>${X({ en: "Before: a messy, smoggy town", bm: "Sebelum: bandar yang bersepah dan berjerebu" })}</figcaption></figure><figure>${pix(townImg(3), "bk-town")}<figcaption>${X({ en: "After: a clean, green town", bm: "Selepas: bandar yang bersih dan hijau" })}</figcaption></figure>` : ""}</div>`,
    p(X({ en: "Every time you learn something, play a game, finish a mission or make something useful from waste, one part of the town gets cleaner. Clean all six districts and Eco-City shines again!", bm: "Setiap kali anda mempelajari sesuatu, bermain permainan, menyiapkan misi atau menghasilkan sesuatu yang berguna daripada sisa, satu bahagian bandar menjadi lebih bersih. Bersihkan keenam-enam daerah dan Bandar Eko akan bersinar semula!" })),
    goBtn("#/home", "🏝️ " + X({ en: "Visit your town", bm: "Lawati bandar anda" }))
  ]);
  sec("welcome", "districts", t({ en: "The six districts", bm: "Enam daerah" }), [
    H2("🗺️", X({ en: "The six districts", bm: "Enam daerah" }), "districts"),
    p(X({ en: "Each district of Eco-City is one part of WasteQuest, and one part of this book.", bm: "Setiap daerah di Bandar Eko ialah satu bahagian WasteQuest, dan satu bahagian buku ini." })),
    ...DIST.map(([id, i, n, d, part]) => `<div class="bk-dist">${pix(bannerImg(id), "bk-ban")}<div><b>${i} ${X(n)}</b><span>${X(d)}</span><small>${X(S.part)} ${PARTS[part].n}: ${X(PARTS[part].t)}</small></div></div>`)
  ]);
  sec("welcome", "who", t({ en: "Who is this book for?", bm: "Untuk siapa buku ini?" }), [
    H2("👋", X({ en: "Who is this book for?", bm: "Untuk siapa buku ini?" }), "who"),
    p(X({ en: "Everyone! Pick your reading level in the toolbar and the book changes to match.", bm: "Semua orang! Pilih tahap bacaan anda dalam bar alat dan buku akan berubah mengikutnya." })),
    ...[["🧒", S.aud.kids, { en: "Start with the story, play the games in Part 3 and try the no-heat labs in Part 4 (look for “No heat”). Do every hot or sharp step with an adult.", bm: "Mulakan dengan kisah ini, main permainan di Bahagian 3 dan cuba makmal tanpa haba di Bahagian 4 (cari “Tanpa haba”). Lakukan setiap langkah panas atau tajam bersama orang dewasa." }],
      ["🧑", S.aud.teens, { en: "Read the lessons in Part 2 with the science notes, take the quick quizzes and aim for the Zero-Waste Champion certificate.", bm: "Baca pelajaran di Bahagian 2 bersama nota sains, jawab kuiz pantas dan sasarkan sijil Juara Sifar Sisa." }],
      ["🧑‍💼", S.aud.adults, { en: "Community groups, university students and company staff: the labs, the business and ESG notes and the Waste-to-Wealth Practitioner certificate are for you.", bm: "Kumpulan komuniti, pelajar universiti dan kakitangan syarikat: makmal, nota perniagaan dan ESG serta sijil Pengamal Sisa kepada Kekayaan adalah untuk anda." }],
      ["🧑‍🏫", S.aud.teacher, { en: "Teachers and facilitators: Part 6 has session plans, safety rules, rubrics, curriculum links and how to run Class Battle. Teacher tips appear in every lab.", bm: "Guru dan fasilitator: Bahagian 6 mengandungi rancangan sesi, peraturan keselamatan, rubrik, pautan kurikulum dan cara mengendalikan Pertandingan Kelas. Tip guru dipaparkan dalam setiap makmal." }]]
      .map(([i, n, d]) => `<div class="bk-aud"><b>${i}</b><div><h3 class="bk-h3">${X(n)}</h3><p>${X(d)}</p></div></div>`)
  ]);
  sec("welcome", "w2w", t({ en: "What is waste-to-wealth?", bm: "Apakah sisa kepada kekayaan?" }), [
    H2("💎", X({ en: "What is waste-to-wealth?", bm: "Apakah sisa kepada kekayaan?" }), "w2w"),
    p(X({ en: "<b>Waste-to-wealth (W2W)</b> means seeing rubbish as a resource. Used cooking oil can become a candle or soap, fruit peels become eco-enzyme, food scraps become compost and plastic becomes bricks, bags and planters.", bm: "<b>Sisa kepada kekayaan (W2W)</b> bermaksud melihat sampah sebagai sumber. Minyak masak terpakai boleh menjadi lilin atau sabun, kulit buah menjadi eko-enzim, sisa makanan menjadi kompos dan plastik menjadi bata, beg dan pasu." }).replace(/&lt;(\/?b)&gt;/g, "<$1>")),
    `<div class="bk-3">${[["🌍", S.env, { en: "Less rubbish in landfills, drains, rivers and the sea.", bm: "Kurang sampah di tapak pelupusan, longkang, sungai dan laut." }], ["💰", S.econ, { en: "Free materials become products people value, and new small businesses.", bm: "Bahan percuma menjadi produk yang dihargai dan perniagaan kecil baharu." }], ["🤝", S.soc, { en: "Skills, teamwork and cleaner, healthier neighbourhoods.", bm: "Kemahiran, kerja berpasukan dan kejiranan yang lebih bersih serta sihat." }]].map(([i, h, d]) => `<div><b>${i} ${X(h)}</b><span>${X(d)}</span></div>`).join("")}</div>`,
    p(X({ en: "WasteQuest supports the UN Sustainable Development Goals, especially SDG 12 (responsible consumption and production), SDG 13 (climate action) and SDG 15 (life on land).", bm: "WasteQuest menyokong Matlamat Pembangunan Mampan PBB, terutamanya SDG 12 (penggunaan dan pengeluaran bertanggungjawab), SDG 13 (tindakan iklim) dan SDG 15 (kehidupan di darat)." })),
    `<figure class="bk-sdg"><img src="assets/sdg-strip.jpeg" alt="SDG 12, 13, 15"></figure>`
  ]);

  /* part 2: Learn */
  opener("learn");
  (W.learnChapters || []).forEach((ch, n) => {
    const box = document.createElement("div"); box.innerHTML = ch.body(true);
    const blocks = [...box.children].map(e => e.outerHTML);
    sec("learn", "learn-" + ch.id, t(ch.title), [
      `<div class="bk-chk">${X({ en: "Lesson", bm: "Pelajaran" })} ${n + 1}</div>`, H2(ch.icon, X(ch.title), "learn-" + ch.id), ...blocks,
      W.aud === "teacher" && ch.note ? note("warn", `🧑‍🏫 <b>${X(S.teach)}:</b> ${X(ch.note)}`) : "",
      ...quizBlocks(learnQ(ch).map(q => ({ ...q, id: "x" })), ch.id),
      goBtn(`#/learn/${n + 1}`, "📘 " + X(S.site))
    ], { lesson: n + 1 });
  });

  /* part 3: Play */
  opener("play");
  const games = Object.values(W.games).sort((a, b) => a.order - b.order);
  const gcard = g => `<div class="bk-game" data-a="game-${g.id}"><span class="bk-gi" aria-hidden="true">${g.icon}</span><div><b>${X(g.title)}</b><span>${X(g.desc)}</span><small>${X(S.ages)} ${E(g.ages || "7+")}</small></div><a class="bk-go sm" href="#/game/${g.id}">${X(S.play)}</a></div>`;
  sec("play", "games", t({ en: "Games & virtual labs", bm: "Permainan & makmal maya" }), [
    H2("🎮", X({ en: "Games & virtual labs", bm: "Permainan & makmal maya" }), "games"),
    p(X({ en: "Every game and simulation earns a badge and coins for your town. Tap <b>Play</b> to open it.", bm: "Setiap permainan dan simulasi memberi lencana dan syiling untuk bandar anda. Tekan <b>Main</b> untuk membukanya." }).replace(/&lt;(\/?b)&gt;/g, "<$1>")),
    H3("🎮 " + X({ en: "Games", bm: "Permainan" })), ...games.filter(g => g.kind === "game").map(gcard),
    H3("🧪 " + X({ en: "Simulations: virtual labs", bm: "Simulasi: makmal maya" })), ...games.filter(g => g.kind === "sim").map(gcard),
    ...quizBlocks(pickQ(["bin", "sort", "recycl"], "sorting"), "games")
  ]);
  sec("play", "missions", t({ en: "Missions, scan & your town", bm: "Misi, imbasan & bandar anda" }), [
    H2("🏠", X({ en: "Missions, scan & your town", bm: "Misi, imbasan & bandar anda" }), "missions"),
    H3("✅ " + X({ en: "Home Missions", bm: "Misi di Rumah" })),
    p(X({ en: "Real jobs to do at home, school or work: sort the family's recyclables, start a compost bottle, refuse single-use plastic for a week. Tick the steps, then finish the mission to upgrade the town. No photos are stored.", bm: "Tugasan sebenar di rumah, sekolah atau tempat kerja: asingkan bahan kitar semula keluarga, mulakan botol kompos, tolak plastik sekali guna selama seminggu. Tandakan langkah, kemudian selesaikan misi untuk menaik taraf bandar. Tiada foto disimpan." })),
    goBtn("#/missions", "✅ " + X({ en: "Open Home Missions", bm: "Buka Misi di Rumah" })),
    H3("📷 " + X({ en: "Scan and sort", bm: "Imbas dan asingkan" })),
    p(X({ en: "Point your camera at an item. WasteQuest makes a guess on your own device (nothing is uploaded), you correct it if needed, and it tells you which SWCorp bin to use: blue for paper, orange for plastic and metal, brown for glass. It never decides on hazardous waste.", bm: "Halakan kamera anda pada sesuatu barang. WasteQuest membuat tekaan pada peranti anda sendiri (tiada apa dimuat naik), anda membetulkannya jika perlu, dan ia memberitahu tong SWCorp yang perlu digunakan: biru untuk kertas, oren untuk plastik dan logam, coklat untuk kaca. Ia tidak pernah membuat keputusan tentang sisa berbahaya." })),
    goBtn("#/scan", "📷 " + X({ en: "Open Scan", bm: "Buka Imbasan" })),
    H3("🪙 " + X({ en: "Coins, shop & avatar", bm: "Syiling, kedai & avatar" })),
    p(X({ en: "Right answers, badges and missions earn coins and XP. Spend coins in the Market shop on decorations for your town and accessories for your avatar.", bm: "Jawapan betul, lencana dan misi memberi syiling dan XP. Belanjakan syiling di kedai Pasar untuk hiasan bandar dan aksesori avatar anda." })),
    goBtn("#/shop", "🏪 " + X({ en: "Open the shop", bm: "Buka kedai" }))
  ]);
  sec("play", "arena", t({ en: "Class Battle & Event Town", bm: "Pertandingan Kelas & Bandar Acara" }), [
    H2("🏟️", X({ en: "Class Battle & Event Town", bm: "Pertandingan Kelas & Bandar Acara" }), "arena"),
    p(X({ en: "<b>Class Battle:</b> the teacher hosts a live quiz on the projector and students join with a code on their phones. No accounts are needed. Team mode works without phones.", bm: "<b>Pertandingan Kelas:</b> guru menganjurkan kuiz langsung di projektor dan murid menyertai dengan kod di telefon. Tiada akaun diperlukan. Mod pasukan berfungsi tanpa telefon." }).replace(/&lt;(\/?b)&gt;/g, "<$1>")),
    goBtn("#/class", "🏟️ " + X({ en: "Open Class Battle", bm: "Buka Pertandingan Kelas" })),
    p(X({ en: "<b>Event Town:</b> a whole crowd cleans one shared town on the big screen. Each right answer upgrades a district. Great for school events, recycling days and booths. A screen-only mode works without internet.", bm: "<b>Bandar Acara:</b> seluruh orang ramai membersihkan satu bandar bersama di skrin besar. Setiap jawapan betul menaik taraf satu daerah. Sesuai untuk acara sekolah, hari kitar semula dan reruai. Mod skrin sahaja berfungsi tanpa internet." }).replace(/&lt;(\/?b)&gt;/g, "<$1>")),
    goBtn("#/event", "🎉 " + X({ en: "Open Event Town", bm: "Buka Bandar Acara" }))
  ]);
  sec("play", "certs", t({ en: "Badges & certificates", bm: "Lencana & sijil" }), [
    H2("🏅", X({ en: "Badges & certificates", bm: "Lencana & sijil" }), "certs"),
    p(X({ en: "Collect badges from games, lessons and labs. Then pass the final quest for your track and print your own certificate of completion.", bm: "Kumpul lencana daripada permainan, pelajaran dan makmal. Kemudian lulus misi akhir laluan anda dan cetak sijil penyempurnaan anda sendiri." })),
    ...[["🌱", { en: "Junior Eco-Hero", bm: "Wira Eko Junior" }, S.aud.kids, { en: "10 questions from the kids track · pass mark 70% · earn at least 3 game badges", bm: "10 soalan daripada laluan kanak-kanak · markah lulus 70% · peroleh sekurang-kurangnya 3 lencana permainan" }],
      ["🏆", { en: "Zero-Waste Champion", bm: "Juara Sifar Sisa" }, S.aud.teens, { en: "15 questions from the teens track · pass mark 75% · at least 5 badges, including 1 lab badge", bm: "15 soalan daripada laluan remaja · markah lulus 75% · sekurang-kurangnya 5 lencana, termasuk 1 lencana makmal" }],
      ["🎓", { en: "Waste-to-Wealth Practitioner", bm: "Pengamal Sisa kepada Kekayaan" }, S.aud.adults, { en: "20 questions from the adults track · pass mark 80% · at least 2 lab badges + a W2W product pitch, verified by a teacher", bm: "20 soalan daripada laluan dewasa · markah lulus 80% · sekurang-kurangnya 2 lencana makmal + pembentangan produk W2W, disahkan guru" }]]
      .map(([i, n, a, d]) => `<div class="bk-cert"><b aria-hidden="true">${i}</b><div><h3 class="bk-h3">${X(n)}</h3><small>${X(a)}</small><p>${X(d)}</p></div></div>`),
    note("ok", X({ en: "These are non-credit certificates of completion issued by the WasteQuest programme.", bm: "Ini ialah sijil penyempurnaan tanpa kredit yang dikeluarkan oleh program WasteQuest." })),
    goBtn("#/cert", "🎓 " + X({ en: "Open Certificates", bm: "Buka Sijil" }))
  ]);

  /* part 4: Make */
  opener("make");
  sec("make", "rules", t({ en: "Golden safety rules", bm: "Peraturan keselamatan emas" }), [
    H2("🦺", X({ en: "Golden safety rules", bm: "Peraturan keselamatan emas" }), "rules"),
    list([{ en: "Read the whole lab before you start, and get everything ready.", bm: "Baca seluruh makmal sebelum mula, dan sediakan semua bahan." },
      { en: "⛔ Steps marked ADULT (heat, hot oil, lye, sharp tools) are done by an adult only.", bm: "⛔ Langkah bertanda ORANG DEWASA (haba, minyak panas, alkali kuat, alat tajam) dilakukan oleh orang dewasa sahaja." },
      { en: "⛔ Never melt or burn plastic: it gives off toxic fumes. Open burning is an offence in Malaysia.", bm: "⛔ Jangan sekali-kali mencairkan atau membakar plastik: ia membebaskan wasap toksik. Pembakaran terbuka ialah satu kesalahan di Malaysia." },
      { en: "Use clean, dry waste only. Never use medical waste, broken glass or chemical containers.", bm: "Guna sisa yang bersih dan kering sahaja. Jangan guna sisa perubatan, kaca pecah atau bekas bahan kimia." },
      { en: "Never eat or taste anything in a lab, and wash your hands afterwards.", bm: "Jangan makan atau rasa apa-apa dalam makmal, dan basuh tangan selepas itu." },
      { en: "For a burn: cool it under cool running water for 20 minutes and tell an adult.", bm: "Jika melecur: sejukkan di bawah air paip yang sejuk selama 20 minit dan beritahu orang dewasa." }].map(o => X(o)), "ol", "bk-rules"),
    H3("📋 " + X(S.glance)),
    `<table class="tbl bk-glance"><thead><tr><th>${X(S.lab)}</th><th>${X(S.ages)}</th><th>⏱</th><th>🔥</th></tr></thead><tbody>${labs.map(l => `<tr><td><a href="#/lab/${l.id}" data-go="lab-${l.id}">${l.icon} ${X(l.title)}</a></td><td>${l.min}+</td><td>${l.mins}′</td><td>${l.heat ? "🔥" : "–"}</td></tr>`).join("")}</tbody></table>`
  ]);
  labs.forEach((l, i) => {
    let n = 0; const lv = lvl(), x = W.aud !== "kids", gate = W.labGate && W.labGate[l.id], poster = l.posters && l.posters[0];
    const chips = [`${X(S.ages)} ${l.min}+`, `⏱ ${X(l.time)}`, `${X(S.diff)} ${"★".repeat(l.diff)}${"☆".repeat(3 - l.diff)}`, X(S.sup[l.sup]), l.heat ? "🔥 " + X(S.heat) : "🌿 " + X(S.noHeat), ...l.sdgs.map(s => "SDG " + s)];
    sec("make", "lab-" + l.id, t(l.title), [
      `<div class="bk-labhd" data-a="lab-${l.id}">${pix(coverImg(l.id), "bk-cov")}<div class="bk-chk">${X(S.lab)} ${i + 1}</div><h2 class="bk-h2"><span aria-hidden="true">${l.icon}</span> ${X(l.title)}</h2><p class="bk-hook">${X(l.hook)}</p></div>`,
      `<div class="bk-chips">${chips.map(c => `<span class="${/🔥|adult|dewasa/i.test(c) ? "red" : ""}">${c}</span>`).join("")}</div>`,
      gate ? note("warn", `🧒 <b>${X(S.gate)}:</b> ${X(gate)}`) : "",
      `<dl class="bk-meta"><div><dt>${X(S.waste)}</dt><dd>${X(l.waste)}</dd></div><div><dt>${X(S.product)}</dt><dd>${X(l.product)}</dd></div><div><dt>${X(S.cost)}</dt><dd>${X(l.cost)}</dd></div></dl>`,
      videoBlock(l.id),
      H3("🌏 " + X(S.why)),
      `<div class="bk-3 why"><div><b>🌍 ${X(S.env)}</b><span>${X(l.why.env)}</span></div><div><b>💰 ${X(S.econ)}</b><span>${X(l.why.econ)}</span></div><div><b>🤝 ${X(S.soc)}</b><span>${X(l.why.soc)}</span></div></div>`,
      H3("🧺 " + X(S.mats)),
      `<ul class="bk-list bk-mats">${l.mats.map(m => m.h ? `<li class="bk-lh">${X(m.h)}</li>` : `<li>${X(m)}</li>`).join("")}</ul>`,
      l.table ? `<div class="bk-tbl"><table class="tbl"><thead><tr>${l.table.head.map(h => `<th>${X(h)}</th>`).join("")}</tr></thead><tbody>${l.table.rows.map(r => `<tr>${r.map(c => `<td>${X(c)}</td>`).join("")}</tr>`).join("")}</tbody></table><p class="small muted">${X(l.table.note)}</p></div>` : "",
      H3("🪜 " + X(S.steps)),
      `<ul class="bk-list bk-steps">${l.steps.map(s => s.h ? `<li class="bk-lh">${X(s.h)}</li>` : `<li><b class="bk-n">${++n}</b><span>${X(s)}${x && s.x ? `<em class="bk-x">🔬 ${X(s.x)}</em>` : ""}</span></li>`).join("")}</ul>`,
      l.code && x ? `<p class="bk-cl"><b>💻 ${X(S.code)}</b></p><pre class="bk-pre">${E(l.code)}</pre>` : "",
      H3("🦺 " + X(S.safety)),
      ...l.safety.map(s => note(s.lv, `${s.lv === "danger" ? "⛔" : "⚠️"} ${X(s)}`)),
      H3(`🔬 ${X(S.sci)} <span class="bk-tag">${X(S.lvlN[lv])}</span>`), p(X(W.pick(l.sci))),
      W.aud === "teacher" ? note("ok", `🧑‍🏫 <b>${X(S.teach)}:</b> ${X(l.teach)}`) : "",
      H3("🚀 " + X(S.ext)), list(l.ext.map(X), "ol"),
      H3("💭 " + X(S.refl)), list(l.refl.map(X)),
      poster ? `<figure class="bk-poster"><img src="${poster.src}" alt="${X(poster.cap)}"><figcaption>${X(poster.cap)}. ${X(S.credit)}</figcaption></figure>` : "",
      ...quizBlocks(pickQ(KEYS[l.id] || [], TOPIC[l.id] || "labs"), l.id),
      goBtn(`#/lab/${l.id}`, "🧪 " + X(S.site))
    ]);
  });

  /* part 5: Hall of Heroes */
  opener("heroes");
  const Z = (i, n, img, lab, d) => ({ i, n, img, lab, d });
  const ZP = [
    Z("🧱", L("Eco-brick furniture", "Perabot eko-bata"), "assets/zph/ecobricks.jpg", "ecobrick", L("Bottles packed hard with plastic, glued into a stool with a cushion. The team costed it at about RM 10.50 a stool.", "Botol dipadatkan dengan plastik, dilekatkan menjadi bangku berkusyen. Pasukan mengira kosnya kira-kira RM 10.50 sebuah bangku.")),
    Z("👜", L("Eco-Viva bag", "Beg Eco-Viva"), "assets/zph/fused-plarn.jpg", "fused", L("Plastic bags cut into zig-zag yarn and ironed into a drawstring bag.", "Beg plastik digunting menjadi benang zig-zag dan diseterika menjadi beg serut.")),
    Z("🛍️", L("Tote bags", "Beg tote"), "assets/zph/ecobags.jpg", "ecobrick", L("Tough, water-resistant totes made from foil-lined plastic packaging.", "Beg tote yang kuat dan kalis air daripada pembungkus plastik berlapik kerajang.")),
    Z("🟫", L("Coasters & tiles", "Pelapik cawan & jubin"), "assets/zph/tiles.jpg", null, L("Plastic waste shaped into hexagon tiles and bottle-cap coasters.", "Sisa plastik dibentuk menjadi jubin heksagon dan pelapik cawan daripada penutup botol.")),
    Z("🪴", L("Vertical garden", "Taman menegak"), "assets/zph/vgarden-1.jpg", "vgarden", L("Hanging bottle planters on a frame, watered by an Arduino moisture sensor and pump.", "Pasu botol tergantung pada rangka, disiram oleh sensor kelembapan dan pam Arduino.")),
    Z("🛌", L("Sleeping bags", "Beg tidur"), "assets/zph/sleepingbag.jpg", "sleepbag", L("Bubble wrap and cloth squares sewn into a 3-in-1 mat, blanket and sleeping bag for homeless people.", "Petak balutan gelembung dan kain dijahit menjadi tikar, selimut dan beg tidur 3-dalam-1 untuk golongan gelandangan.")),
    Z("🥬", L("Hydroponics", "Hidroponik"), "assets/zph/hydro-1.jpg", "hydro", L("Bottle hydroponics inside a mini rain shelter house with a roof of flattened bottles.", "Hidroponik botol di dalam rumah perlindungan hujan mini berbumbung botol yang dileperkan.")),
    Z("☂️", L("Umbrella & tote bag", "Payung & beg tote"), "assets/zph/fused-umbrella.jpg", "fused", L("Ironed plastic bags as fabric and ironed straws as ribs: a mini umbrella that opens and closes.", "Beg plastik yang diseterika sebagai fabrik dan straw yang diseterika sebagai rusuk: payung mini yang boleh dibuka dan ditutup.")),
    Z("🛟", L("Lifebuoy model", "Model pelampung"), "assets/zph/lifebuoy-1.jpg", "lifebuoy", L("Layers of bubble wrap rolled into a ring and covered with tarpaulin. A model for learning, not a safety device.", "Lapisan balutan gelembung digulung menjadi gelang dan dibalut kanvas. Model untuk pembelajaran, bukan alat keselamatan.")),
    Z("🌱", L("Bio-pots", "Bio-pasu"), "assets/zph/biopots.jpg", "bioplastic", L("Plant pots made from home-made bioplastic instead of plastic.", "Pasu tanaman daripada bioplastik buatan sendiri sebagai ganti plastik."))
  ];
  sec("heroes", "zph", t({ en: "Zero-Plastic Hero 2024", bm: "Zero-Plastic Hero 2024" }), [
    H2("🦸", X({ en: "Zero-Plastic Hero 2024", bm: "Zero-Plastic Hero 2024" }), "zph"),
    p(X({ en: "Zero-Plastic Hero was a service-learning (SULAM) programme of the UPM course ENG3104 Engineers and Society. Chemical engineering students built prototypes from plastic waste and showed secondary school pupils in Selangor how to separate, collect and recycle plastic, and how plastic waste can have real economic value.", bm: "Zero-Plastic Hero ialah program pembelajaran servis (SULAM) bagi kursus UPM ENG3104 Jurutera dan Masyarakat. Pelajar kejuruteraan kimia membina prototaip daripada sisa plastik dan menunjukkan kepada murid sekolah menengah di Selangor cara mengasingkan, mengumpul dan mengitar semula plastik, serta bagaimana sisa plastik boleh mempunyai nilai ekonomi sebenar." })),
    `<div class="bk-nums">${[["400", { en: "pupils and teachers reached", bm: "murid dan guru dicapai" }], ["80", { en: "UPM students and lecturers", bm: "pelajar dan pensyarah UPM" }], ["10", { en: "prototypes", bm: "prototaip" }]].map(([n, d]) => `<div><b>${n}</b><span>${X(d)}</span></div>`).join("")}</div>`,
    p(X({ en: "Five of their ideas became WasteQuest labs. Here are all ten heroes' projects.", bm: "Lima idea mereka menjadi makmal WasteQuest. Inilah kesemua sepuluh projek wira tersebut." })),
    ...ZP.map((z, k) => { const lab = z.lab && labs.find(x => x.id === z.lab);
      return `<div class="bk-hero"><img src="${z.img}" alt="${X(z.n)}"><div><b>${k + 1}. ${z.i} ${X(z.n)}</b><span>${X(z.d)}</span>${lab ? `<a class="bk-go sm" href="#/lab/${lab.id}" data-go="lab-${lab.id}">${lab.icon} ${X(S.tryLab)}</a>` : `<small class="bk-red">⛔ ${X({ en: "Showcase only: melting plastic gives off toxic fumes. Try Eco-Bricks (no heat) instead.", bm: "Pameran sahaja: mencairkan plastik membebaskan wasap toksik. Cuba Eko-Bata (tanpa haba)." })}</small>`}</div></div>`; }),
    H3("🙏 " + X({ en: "Advisor and supervisors", bm: "Penasihat dan penyelia" })),
    p(`<b>${X({ en: "Programme advisor", bm: "Penasihat program" })}:</b> Prof. Ir. Dr. Wan Azlina Wan Ab Karim Ghani`),
    p(["Prof. Madya Dr. Norhafizah Hj. Abdullah", "Prof. Madya Dr. Salmiaton Ali", "Prof. Madya Datin Ir. Dr. Siti Aslina Hussain", "Prof. Madya Dr. Rozita Omar", "Prof. Madya Ir. Dr. Shamsul Izhar Siajam", "Dr. Nordin Hj. Sabli", "Dr. Shafreeza Sobri", "Dr. Nur Syakina Jamali", "Dr. Mohamad Faiz Mukhtar Gunam Resul", "Dr. Halimatun Sakdiah Zainuddin"].join(" · ")),
    `<p class="small muted">${X({ en: "Thank you to every ENG3104 2024 group and the school that hosted the programme. Photos: the student groups; no photos of school pupils are shown.", bm: "Terima kasih kepada setiap kumpulan ENG3104 2024 dan sekolah yang menjadi tuan rumah program. Foto: kumpulan pelajar; tiada foto murid sekolah dipaparkan." })}</p>`
  ]);

  /* part 6: grown-ups */
  opener("adults");
  sec("adults", "partners", t({ en: "Bring WasteQuest to your group", bm: "Bawa WasteQuest ke kumpulan anda" }), [
    H2("🤝", X({ en: "Bring WasteQuest to your group", bm: "Bawa WasteQuest ke kumpulan anda" }), "partners"),
    p(X({ en: "WasteQuest is free. It opens from a link or QR code on any phone, tablet or laptop, with no sign-up, no names and no app to install, and an offline copy works where the signal is weak.", bm: "WasteQuest adalah percuma. Ia dibuka daripada pautan atau kod QR pada mana-mana telefon, tablet atau komputer riba, tanpa pendaftaran, tanpa nama dan tanpa aplikasi untuk dipasang, dan salinan luar talian berfungsi di tempat yang isyaratnya lemah." })),
    H3("👥 " + X({ en: "Who it is for", bm: "Untuk siapa" })),
    list([[{ en: "Schools and district education offices", bm: "Sekolah dan pejabat pendidikan daerah" }, { en: "class mode, quizzes, labs and a 20-minute core lesson.", bm: "mod kelas, kuiz, makmal dan pelajaran teras 20 minit." }],
      [{ en: "Local councils", bm: "Pihak berkuasa tempatan" }, { en: "Event Town at recycling days and booths, a website embed and a totals-only report.", bm: "Bandar Acara pada hari kitar semula dan reruai, benaman laman web dan laporan jumlah sahaja." }],
      [{ en: "Companies (ESG / CSR)", bm: "Syarikat (ESG / CSR)" }, { en: "staff engagement and community events, with reach and learning figures for sustainability reports.", bm: "penglibatan kakitangan dan acara komuniti, dengan angka capaian dan pembelajaran untuk laporan kemampanan." }],
      [{ en: "NGOs and community groups", bm: "NGO dan kumpulan komuniti" }, { en: "residents' workshops, home missions and the offline copy.", bm: "bengkel penduduk, misi di rumah dan salinan luar talian." }],
      [{ en: "Universities", bm: "Universiti" }, { en: "outreach and service-learning, with a ready before-and-after learning check.", bm: "jangkauan dan pembelajaran servis, dengan semakan pembelajaran sebelum dan selepas yang sedia ada." }],
      [{ en: "Event organisers", bm: "Penganjur acara" }, { en: "a self-running booth mode with a “next visitor” reset.", bm: "mod reruai yang berjalan sendiri dengan butang set semula “pelawat seterusnya”." }]].map(([h, d]) => `<b>${X(h)}:</b> ${X(d)}`)),
    H3("🗓️ " + X({ en: "What a pilot looks like", bm: "Bagaimana rupa sesuatu rintis" })),
    list([{ en: "<b>Demo and scope:</b> a 30-minute demo; agree the audience, venues, length and what should be reported.", bm: "<b>Demo dan skop:</b> demo 30 minit; persetujuan tentang khalayak, lokasi, tempoh dan perkara yang perlu dilaporkan." },
      { en: "<b>Local check:</b> the partner checks sorting rules and wording for their area; permissions are agreed (parent consent for under-18s).", bm: "<b>Semakan tempatan:</b> rakan kongsi menyemak peraturan pengasingan dan perkataan untuk kawasan mereka; kebenaran dipersetujui (persetujuan ibu bapa bagi bawah 18 tahun)." },
      { en: "<b>Run:</b> a 4–6 week trial or one school term; players do a 5-question check before and after.", bm: "<b>Pelaksanaan:</b> percubaan 4–6 minggu atau satu penggal persekolahan; pemain menjawab semakan 5 soalan sebelum dan selepas." },
      { en: "<b>Review:</b> an evaluation summary, then a joint decision to continue, change or stop.", bm: "<b>Semakan:</b> ringkasan penilaian, kemudian keputusan bersama untuk meneruskan, mengubah atau menghentikan." }].map(o => t(o)), "ol"),
    H3("📊 " + X({ en: "WasteQuest and ESG reporting", bm: "WasteQuest dan pelaporan ESG" })),
    p(X({ en: "Waste is a standard topic in sustainability reporting (for example GRI 306: Waste 2020), and waste generated in operations is Scope 3, category 5 under the GHG Protocol. Bursa Malaysia requires listed issuers to include a sustainability statement in the annual report. A WasteQuest programme can give coded, name-free figures on reach and learning (before-and-after checks) to support the engagement part of such reports. It does not measure tonnes of waste diverted.", bm: "Sisa ialah topik standard dalam pelaporan kemampanan (contohnya GRI 306: Waste 2020), dan sisa yang dijana dalam operasi ialah Skop 3, kategori 5 di bawah GHG Protocol. Bursa Malaysia mewajibkan syarikat tersenarai menyertakan penyata kemampanan dalam laporan tahunan. Program WasteQuest boleh memberi angka berkod tanpa nama tentang capaian dan pembelajaran (semakan sebelum dan selepas) untuk menyokong bahagian penglibatan dalam laporan sedemikian. Ia tidak mengukur tan sisa yang dilencongkan." })),
    H3("✉️ " + X({ en: "Contact", bm: "Hubungi" })),
    p(`Prof. Ir. Dr. Wan Azlina Wan Ab Karim Ghani, ${X(S.dept)}. <b>wanazlina@upm.edu.my</b>`)
  ]);
  const tb = document.createElement("div");
  try { W.renderTeacherPrint && W.renderTeacherPrint(tb); } catch (e) { tb.innerHTML = ""; }
  const tsec = [...tb.querySelectorAll(".th-psec")];
  const flat = s => { const h = s.querySelector("h2"), title = h ? h.textContent.trim().replace(/^[^\p{L}\p{N}]+/u, "") : ""; if (h) h.remove(); return { title, blocks: [...s.children].map(e => e.outerHTML) }; };
  const ids = ["overview", "plans", "credential", "safety", "rubrics", "curriculum", "class", "users", "credits"];
  const ticon = ["📋", "🗓️", "🎓", "🦺", "📝", "🏫", "🏟️", "🤝", "🙏"];
  const order = [2, 0, 1, 3, 4, 5, 6, 7, 8];   // certificates first, then the rest of the Teacher Hub
  order.forEach(k => { const s = tsec[k]; if (!s) return; const f = flat(s);
    sec("adults", "t-" + ids[k], f.title, [k === 0 ? `<div class="bk-chk">${X({ en: "Teacher guide", bm: "Panduan guru" })}</div>` : "", H2(ticon[k], E(f.title), "t-" + ids[k]), ...f.blocks]); });

  /* part 7: back matter */
  opener("back");
  sec("back", "glossary", t({ en: "Glossary", bm: "Glosari" }), [H2("🔤", X({ en: "Glossary", bm: "Glosari" }), "glossary"),
    `<p class="small muted">${X({ en: "Each word with its Bahasa Melayu name.", bm: "Setiap istilah bersama nama Bahasa Inggerisnya." })}</p>`,
    ...GLOSS.slice().sort((a, b) => t(a[0]).localeCompare(t(b[0]), W.lang === "bm" ? "ms" : "en")).map(g => `<p class="bk-gl"><b>${X(g[0])}</b> <i>(${E(W.lang === "bm" ? g[0].en : g[0].bm)})</i>: ${X(g[1])}</p>`)]);
  out.push({ part: "back", index: true, a: "index", run: t({ en: "Index", bm: "Indeks" }), toc: t({ en: "Index", bm: "Indeks" }) });
  sec("back", "credits", t({ en: "Credits & sources", bm: "Penghargaan & sumber" }), [H2("🙏", X({ en: "Credits & sources", bm: "Penghargaan & sumber" }), "credits"),
    p(`<b>${X(S.by)}:</b> ${AUTHORS}. ${X(S.dept)}.`),
    p(X({ en: "<b>Lab ideas, photos and posters:</b> UPM chemical engineering students (ENG3104 Engineers and Society, 2024 and 2025). Lab guides checked and corrected by the WasteQuest team.", bm: "<b>Idea makmal, foto dan poster:</b> pelajar kejuruteraan kimia UPM (ENG3104 Jurutera dan Masyarakat, 2024 dan 2025). Panduan makmal disemak dan dibetulkan oleh pasukan WasteQuest." }).replace(/&lt;(\/?b)&gt;/g, "<$1>")),
    p(X({ en: "<b>Videos:</b> made by the WasteQuest team in 2026 from the students' demonstrations, narrated with synthetic voices. <b>Pixel art:</b> original drawings made for WasteQuest.", bm: "<b>Video:</b> dihasilkan oleh pasukan WasteQuest pada 2026 daripada demonstrasi pelajar, dengan suara sintetik. <b>Seni piksel:</b> lukisan asli untuk WasteQuest." }).replace(/&lt;(\/?b)&gt;/g, "<$1>")),
    H3("📚 " + X({ en: "Main sources", bm: "Sumber utama" })),
    list(["SWCorp, via The Star (2 Jan 2024): Malaysian solid waste 39,078 t/day, 1.17 kg/person/day, household composition.",
      "IPCC Fifth Assessment Report (2013), WG1 ch. 8: methane GWP100 = 28.", "US NOAA: microplastics are pieces smaller than 5 mm.",
      "Ellen MacArthur Foundation: circular economy principles.", "Environmental Quality Act 1974 (Malaysia), s.29A: open burning.",
      "Solid Waste and Public Cleansing Management Act 2007 (Act 672).", "GHG Protocol Corporate Value Chain (Scope 3) Standard; GRI 306: Waste 2020; Bursa Malaysia Main Market Listing Requirements.",
      "MQA Guidelines to Good Practices: Micro-credentials (2020) and Quality Verification of Stand-Alone Micro-credentials (2023).",
      "Global Ecobrick Alliance; US CDC (Aedes life cycle); WSAVA (pet treats); IMO LSA Code (lifebuoys); Kratky (2009) hydroponics.",
      `${X({ en: "Every lab and lesson lists its own sources on the website.", bm: "Setiap makmal dan pelajaran menyenaraikan sumbernya sendiri di laman web." })}`]),
    H3("🧩 " + X({ en: "Software and fonts", bm: "Perisian dan fon" })),
    p("StPageFlip (MIT) · qrcodejs (MIT) · Pixelify Sans, Nunito, Baloo 2 (SIL Open Font License)."),
    `<p class="small muted">© 2026 Universiti Putra Malaysia. ${X(S.ed)}.</p>`
  ]);
  out.push({ part: "back", fixed: true, cls: "bk-cover bk-backc", html: backHTML(), hard: true, last: true });
  return out;
}

const GLOSS = [
  [L("Waste-to-wealth (W2W)", "Sisa kepada kekayaan (W2W)"), L("Turning waste into products or resources with value.", "Menukar sisa menjadi produk atau sumber yang bernilai.")],
  [L("Circular economy", "Ekonomi kitaran"), L("An economy that keeps materials in use and designs out waste and pollution.", "Ekonomi yang mengekalkan bahan dalam kegunaan serta mereka bentuk tanpa sisa dan pencemaran.")],
  [L("Waste hierarchy", "Hierarki sisa"), L("Waste options ranked from best (refuse, reduce) to last choice (disposal).", "Pilihan pengurusan sisa disusun daripada terbaik (tolak, kurangkan) hingga pilihan terakhir (pelupusan).")],
  [L("Landfill", "Tapak pelupusan"), L("A site where waste is buried in the ground.", "Tapak tempat sisa ditimbus di dalam tanah.")],
  [L("Leachate", "Larut resap"), L("Polluted liquid that drains out of waste in a landfill.", "Cecair tercemar yang mengalir keluar daripada sisa di tapak pelupusan.")],
  [L("Methane", "Metana"), L("A greenhouse gas (CH₄) made when food waste rots without oxygen; about 28 times stronger than CO₂ over 100 years.", "Gas rumah hijau (CH₄) yang terhasil apabila sisa makanan reput tanpa oksigen; kira-kira 28 kali lebih kuat daripada CO₂ dalam tempoh 100 tahun.")],
  [L("Greenhouse gas", "Gas rumah hijau"), L("A gas that traps heat in the atmosphere, such as carbon dioxide and methane.", "Gas yang memerangkap haba di atmosfera, seperti karbon dioksida dan metana.")],
  [L("Aerobic", "Aerobik"), L("With oxygen.", "Dengan oksigen.")],
  [L("Anaerobic", "Anaerobik"), L("Without oxygen.", "Tanpa oksigen.")],
  [L("Compost", "Kompos"), L("A dark, crumbly soil improver made when microbes break down food and garden waste with air.", "Bahan penyubur tanah yang gelap dan rapuh, terhasil apabila mikrob menguraikan sisa makanan dan taman dengan udara.")],
  [L("Vermicompost", "Vermikompos"), L("Compost made with the help of worms.", "Kompos yang dihasilkan dengan bantuan cacing.")],
  [L("Eco-enzyme", "Eko-enzim"), L("A liquid made by fermenting sugar, fruit peels and water (1:3:10) for about 3 months.", "Cecair yang dihasilkan dengan menapai gula, kulit buah dan air (1:3:10) selama kira-kira 3 bulan.")],
  [L("Fermentation", "Penapaian"), L("Microbes breaking down sugar without oxygen, making acids, gas or alcohol.", "Mikrob menguraikan gula tanpa oksigen, menghasilkan asid, gas atau alkohol.")],
  [L("pH", "pH"), L("A scale from 0 to 14 that shows how acidic or alkaline a liquid is; 7 is neutral.", "Skala 0 hingga 14 yang menunjukkan keasidan atau kealkalian cecair; 7 ialah neutral.")],
  [L("Indicator", "Penunjuk"), L("A substance that changes colour with pH, like purple-cabbage or bunga telang juice.", "Bahan yang berubah warna mengikut pH, seperti jus kubis ungu atau bunga telang.")],
  [L("Bioplastic", "Bioplastik"), L("Plastic made from plants, for example starch, instead of petroleum.", "Plastik yang dibuat daripada tumbuhan, contohnya kanji, dan bukan petroleum.")],
  [L("Microplastics", "Mikroplastik"), L("Plastic pieces smaller than 5 mm.", "Kepingan plastik yang lebih kecil daripada 5 mm.")],
  [L("Ecobrick", "Eko-bata"), L("A plastic bottle packed hard with clean, dry plastic, used as a building block.", "Botol plastik yang dipadatkan dengan plastik bersih dan kering, digunakan sebagai blok binaan.")],
  [L("Upcycling", "Kitar naik"), L("Turning waste into a product of higher value.", "Menukar sisa menjadi produk yang lebih tinggi nilainya.")],
  [L("Recycling", "Kitar semula"), L("Processing used materials into new raw materials.", "Memproses bahan terpakai menjadi bahan mentah baharu.")],
  [L("Used cooking oil (UCO)", "Minyak masak terpakai"), L("Oil left after frying; it can become candles, soap or biodiesel.", "Minyak yang tinggal selepas menggoreng; boleh dijadikan lilin, sabun atau biodiesel.")],
  [L("Saponification", "Saponifikasi"), L("The reaction of fat or oil with a strong alkali that makes soap.", "Tindak balas lemak atau minyak dengan alkali kuat yang menghasilkan sabun.")],
  [L("Hydroponics", "Hidroponik"), L("Growing plants in water with nutrients, without soil.", "Menanam tumbuhan dalam air bernutrien, tanpa tanah.")],
  [L("Insulation", "Penebat"), L("Material that slows the movement of heat, often by trapping still air.", "Bahan yang memperlahankan pergerakan haba, selalunya dengan memerangkap udara pegun.")],
  [L("Buoyancy", "Keapungan"), L("The upward push of water that makes things float.", "Daya tolakan ke atas oleh air yang menyebabkan objek terapung.")],
  [L("Open burning", "Pembakaran terbuka"), L("Burning waste in the open air; an offence in Malaysia (Environmental Quality Act 1974, s.29A).", "Membakar sisa di udara terbuka; satu kesalahan di Malaysia (Akta Kualiti Alam Sekeliling 1974, s.29A).")],
  [L("Act 672", "Akta 672"), L("The Solid Waste and Public Cleansing Management Act 2007, which includes separating waste at source.", "Akta Pengurusan Sisa Pepejal dan Pembersihan Awam 2007, yang merangkumi pengasingan sisa di punca.")],
  [L("SWCorp", "SWCorp"), L("The Solid Waste Management and Public Cleansing Corporation, the Malaysian agency for solid waste.", "Perbadanan Pengurusan Sisa Pepejal dan Pembersihan Awam, agensi sisa pepejal Malaysia.")],
  [L("SDGs", "SDG"), L("The UN Sustainable Development Goals: 17 global goals for 2030.", "Matlamat Pembangunan Mampan PBB: 17 matlamat global untuk 2030.")],
  [L("ESG", "ESG"), L("Environmental, social and governance: how an organisation manages these risks and impacts.", "Alam sekitar, sosial dan tadbir urus: cara organisasi mengurus risiko dan impak ini.")],
  [L("Scope 3 emissions", "Pelepasan Skop 3"), L("Indirect emissions in an organisation's value chain; waste from operations is Scope 3, category 5.", "Pelepasan tidak langsung dalam rantaian nilai organisasi; sisa daripada operasi ialah Skop 3, kategori 5.")],
  [L("Micro-credential", "Mikro-kredensial"), L("A short, focused course with assessed learning outcomes and a certificate.", "Kursus ringkas dan berfokus dengan hasil pembelajaran yang ditaksir dan sijil.")]
];

/* ---------- full pages ---------- */
function coverHTML() {
  return `<div class="bk-cv"><img class="bk-logos" src="assets/logos-upm.jpeg" alt="Universiti Putra Malaysia"><h1>Waste<b>Quest</b></h1><p class="bk-cvs">${X(S.sub)}</p><p class="bk-cvt">${X(S.tag)}</p></div>
    ${pix(townImg(3), "bk-cvtown")}<div class="bk-cvf">${pix(robotImg(), "bk-robot sm")}<span>${X(S.ed)}<br><small>EN · BM</small></span></div>`;
}
function titleHTML() {
  return `<div class="bk-tp"><h1>Waste<b>Quest</b></h1><p class="bk-cvs">${X(S.sub)}</p><p><b>${X(S.by)}</b><br>${AUTHORS}</p><p class="small">${X(S.dept)}</p>
    <p class="small">${X({ en: "The WasteQuest website, games and videos: ", bm: "Laman web, permainan dan video WasteQuest: " })}<b>wastequest.github.io</b></p>
    <p class="small muted">© 2026 Universiti Putra Malaysia. ${X(S.ed)}.</p><p class="bk-hintp">${X(S.hint)}</p></div>`;
}
function openerHTML(part) {
  const P = PARTS[part], img = part === "welcome" ? townImg(3) : P.b ? bannerImg(P.b) : townImg(3);
  return `<div class="bk-op" style="--pc:${P.c}"><span class="bk-opn">${X(S.part)} ${P.n}</span><h1>${X(P.t)}</h1>${P.s.en ? `<p>${X(P.s)}</p>` : ""}${pix(img, "bk-opart")}${part === "make" || part === "learn" ? pix(robotImg(), "bk-robot op") : ""}</div>`;
}
function backHTML() {
  return `<div class="bk-cv"><h1>Waste<b>Quest</b></h1><p class="bk-cvs">${X({ en: "A free bilingual game for learning to sort, reduce and reuse waste.", bm: "Permainan dwibahasa percuma untuk belajar mengasing, mengurang dan mengguna semula sisa." })}</p></div>
    ${pix(townImg(3), "bk-cvtown")}<div class="bk-cvf bk-bf"><span class="bk-qr big" data-qr="${SITE}"></span><span><b>${X(S.open)}</b><br>wastequest.github.io</span><img class="bk-logos sm" src="assets/logos-upm.jpeg" alt="UPM"></div>`;
}

/* ---------- pagination (on a hidden 480x680 page) ---------- */
const PART_LABEL = part => part === "front" ? "WasteQuest" : `${t(S.part)} ${PARTS[part].n} · ${t(PARTS[part].t)}`;
function shell(part, run) {
  const c = PARTS[part] ? PARTS[part].c : "#1e6f50";
  return `<div class="bk-in" style="--pc:${c}"><div class="bk-run"><span>${E(PART_LABEL(part))}</span><span>${E(run || "")}</span></div><div class="bk-body"></div><div class="bk-foot"><span>WasteQuest</span><b class="bk-pno"></b></div></div>`;
}
async function paginate(sections, onProgress) {
  const meas = document.createElement("div"); meas.className = "bk-meas" + (PW < 480 ? " bk-small" : ""); meas.style.cssText = `--pw:${PW}px;--ph:${PH}px`; document.body.appendChild(meas);
  const pages = [], anchors = {}, tocRows = [];
  let body = null, cur = null, contN = 0, floats = [], flushing = false;   // floats: pictures moved to the next page top (like LaTeX) so text fills the gap
  const fits = () => { const l = body.lastElementChild; return !l || l.offsetTop + l.offsetHeight <= body.clientHeight; };
  const close = () => { if (cur) { pages.push(cur); cur.html = body.innerHTML; } cur = null; body = null; };
  const open = (s, cont) => { close(); meas.innerHTML = shell(s.part, cont ? `${s.run} (${t(S.cont)})` : s.run); body = meas.querySelector(".bk-body"); cur = { part: s.part, run: s.run, shell: true }; floats.splice(0).forEach(f => place(f, s)); };
  const rightSide = () => pages.length % 2 === 0;   // with a single cover, right-hand pages have even indexes
  const filler = () => { close(); pages.push({ part: "front", fixed: true, html: fillerHTML(contN++) }); };
  const toEl = h => { const d = document.createElement("div"); d.innerHTML = h; return d.firstElementChild; };
  const isHead = e => /^H[1-4]$/.test(e.tagName) || e.classList.contains("bk-chk") || e.classList.contains("bk-qhd");
  const mark = e => { (e.matches("[data-a]") ? [e] : []).concat([...e.querySelectorAll("[data-a]")]).forEach(x => { if (!(x.dataset.a in anchors)) anchors[x.dataset.a] = pages.length; }); };
  const KEEP = ".bk-q,.bk-vid,.bk-hero,.bk-dist,.bk-game,.bk-labhd,.note,.bk-two,.bk-nums,.bk-signs,.bk-chips,.bk-meta,.bk-aud,.bk-cert,.bk-kitar,.bk-qhd,.bk-opts";
  const blocky = e => ![...e.childNodes].some(n => n.nodeType === 3 ? n.textContent.trim() : n.hasAttribute("data-i"));
  const stack = e => (e.matches("table") ? [e] : [...e.querySelectorAll("table")]).forEach(tb => {   // phone: wide tables become stacked cards
    const hd = tb.tHead && tb.tHead.rows[0] ? [...tb.tHead.rows[0].cells].map(c => c.textContent.trim()) : null;
    if (!hd || hd.length < 3 || tb.classList.contains("bk-glance")) return;
    tb.classList.add("bk-stack"); [...tb.tBodies].forEach(b => [...b.rows].forEach(r => [...r.cells].forEach((c, i) => hd[i] && c.setAttribute("data-l", hd[i]))));
  });
  const tagInline = e => e.querySelectorAll("*").forEach(x => { if (getComputedStyle(x).display.startsWith("inline")) x.setAttribute("data-i", ""); });   // data-i = inline box, measured while attached   // never split a line of inline chips/words
  const free = () => { const l = body.lastElementChild; return body.clientHeight - (l ? l.offsetTop + l.offsetHeight : 0); };
  function split(e, parent = body) {                    // returns [part that fits, rest] or null; nested containers split recursively
    let items, mk, gen = false;
    if (/^(UL|OL)$/.test(e.tagName)) { items = [...e.children]; mk = () => e.cloneNode(false); }
    else if (e.tagName === "TABLE" && e.tBodies[0]) { items = [...e.tBodies[0].rows]; mk = () => { const c = e.cloneNode(false); if (e.tHead) c.appendChild(e.tHead.cloneNode(true)); c.appendChild(document.createElement("tbody")); return c; }; }
    else if (/^(DIV|SECTION|DL)$/.test(e.tagName) && !e.matches(KEEP) && blocky(e) && free() > body.clientHeight * .25) { items = [...e.children]; mk = () => e.cloneNode(false); gen = true; }
    else if (e.tagName === "P" && !e.children.length) {   // plain paragraph: cut between words (binary search for the most that fit)
      const w = e.textContent.trim().split(/\s+/), a = e.cloneNode(false); parent.appendChild(a);
      let lo = 0, hi = w.length;
      while (lo < hi) { const m = (lo + hi + 1) >> 1; a.textContent = w.slice(0, m).join(" "); if (fits()) lo = m; else hi = m - 1; }
      a.remove();
      if (lo < 8 || w.length - lo < 5) return null;     // no one-line scraps
      const b = e.cloneNode(false); a.textContent = w.slice(0, lo).join(" "); b.textContent = w.slice(lo).join(" ");
      return [a, b];
    }
    else return null;
    if (!items.length || (!gen && items.length < 2)) return null;
    const hostOf = c => c.tBodies ? c.tBodies[0] : c;
    const a = mk(), host = hostOf(a); parent.appendChild(a);
    let k = 0;
    for (; k < items.length; k++) { host.appendChild(items[k].cloneNode(true)); if (!fits()) { host.lastElementChild.remove(); break; } }
    if (k === items.length) { a.remove(); return [e, null]; }
    let head = items.slice(0, k), rest = items.slice(k);
    if (gen) {
      const sub = split(rest[0], host);
      if (sub && sub[1]) { head.push(sub[0]); rest = [sub[1], ...rest.slice(1)]; }
      else while (head.length && isHead(head[head.length - 1])) rest.unshift(head.pop());   // no orphan headings
    }
    a.remove();
    if (!head.length) return null;
    const build = list => { const c = mk(), h = hostOf(c); list.forEach(x => h.appendChild(x.cloneNode(true))); return c; };
    const b = build(rest);
    if (e.tagName === "OL") b.setAttribute("start", (+e.getAttribute("start") || 1) + k);
    return [build(head), b];
  }
  function place(e, s) {
    body.appendChild(e);
    if (fits()) { mark(e); return; }
    e.remove();
    if (!flushing && body.firstElementChild && e.matches(".bk-vid,.bk-poster,.bk-sdg,.bk-two") && free() > body.clientHeight * .2) { floats.push(e); return; }
    const empty = !body.firstElementChild;
    const sp = split(e);
    if (sp && sp[1]) { body.appendChild(sp[0]); mark(sp[0]); open(s, true); return place(sp[1], s); }
    if (!empty) {                                       // keep a heading with what follows it
      const carry = [];
      while (body.lastElementChild && isHead(body.lastElementChild) && body.children.length > carry.length + 1) carry.unshift(body.lastElementChild);
      carry.forEach(c => c.remove()); open(s, true); carry.forEach(c => body.appendChild(c)); return place(e, s);
    }
    const kids = [...e.children];
    if (kids.length === 1 && e.matches("div,section") && !e.matches(KEEP) && blocky(e)) return place(kids[0], s);
    if (kids.length > 1 && /^(DIV|SECTION|UL|OL|DL)$/.test(e.tagName) && !e.matches(KEEP) && blocky(e)) { kids.forEach(k => place(k, s)); return; }
    body.appendChild(e); mark(e); e.classList.add("bk-clip"); open(s, true);   // cannot fit even an empty page: clip it
  }
  for (let si = 0; si < sections.length; si++) {
    const s = sections[si];
    if (s.fixed) { close(); if (s.last && pages.length % 2 === 1) pages.push({ part: "back", fixed: true, html: notesHTML() }); pages.push({ part: s.part, fixed: true, html: s.html, cls: s.cls, hard: s.hard }); continue; }
    if (s.opener) { close(); if (!rightSide()) filler(); anchors[s.a] = pages.length; pages.push({ part: s.part, fixed: true, html: s.html, opener: true }); tocRows.push({ part: s.part }); continue; }
    if (s.tocPage) { s.blocks = tocBlocks(sections); }
    if (s.index) { s.blocks = indexBlocks(sections); }
    open(s, false);
    if (s.a) anchors[s.a] = pages.length;
    for (const h of s.blocks) { const e = toEl(h); if (!e) continue; if (PW < 480) stack(e); body.appendChild(e); tagInline(e);
      const late = [...e.querySelectorAll("img")].filter(i => !i.complete);   // an image still loading would be measured too short
      if (late.length) await Promise.race([Promise.all(late.map(i => i.decode().catch(() => {}))), new Promise(r => setTimeout(r, 8000))]);
      e.remove(); place(e, s); }
    flushing = true; floats.splice(0).forEach(f => place(f, s)); flushing = false;
    if (si % 8 === 0) { onProgress && onProgress(si / sections.length); await new Promise(r => setTimeout(r)); }
  }
  close(); meas.remove();
  // page numbers + contents/index numbers
  pages.forEach((pg, i) => { pg.n = i; if (pg.html) pg.html = pg.html.replace(/data-to="([^"]+)">000</g, (m, a) => `data-to="${a}">${anchors[a] ?? "–"}<`); });
  return { pages, anchors };
}
function fillerHTML(i) {
  const pool = W.questions.filter(q => q.tracks.includes(lvl() === "kids" ? "kids" : "teens"));
  const q = pool.length ? pool[(i * 37 + 11) % pool.length] : null;
  return `<div class="bk-fill">${pix(robotImg(), "bk-robot")}<h2 class="bk-h2">💡 ${X(S.fact)}</h2>${q ? `<p>${X(q.why)}</p>` : ""}</div>`;
}
function notesHTML() { return `<div class="bk-in" style="--pc:#1a1932"><div class="bk-run"><span>WasteQuest</span><span>${X(S.notes)}</span></div><div class="bk-body bk-lines"><h2 class="bk-h2">✏️ ${X(S.notes)}</h2>${"<i></i>".repeat(17)}</div><div class="bk-foot"><span>WasteQuest</span><b class="bk-pno"></b></div></div>`; }
function tocBlocks(sections) {
  const rows = []; let part = null, items = [];
  const flush = () => { if (part) rows.push(`<div class="bk-tocp" style="--pc:${PARTS[part].c}"><a href="#" data-go="part-${part}"><b>${PARTS[part].n}. ${X(PARTS[part].t)}</b><b class="bk-pn" data-to="part-${part}">000</b></a></div>`, items.length ? `<ul class="bk-toc">${items.join("")}</ul>` : ""); items = []; };
  sections.forEach(s => {
    if (s.part === "front") return;
    if (s.opener) { flush(); part = s.part; return; }
    if (s.a && s.toc) items.push(`<li><a href="#" data-go="${s.a}"><span>${E(s.toc)}</span><b class="bk-pn" data-to="${s.a}">000</b></a></li>`);
  });
  flush();
  return [H2("📑", X(S.toc), "toc0"), ...rows.filter(Boolean)];
}
function indexBlocks(sections) {
  const ent = [];
  sections.forEach(s => { if (s.a && typeof s.toc === "string" && !s.opener && s.part !== "front" && !s.index) ent.push([s.toc, s.a]); });
  (W.labs || []).forEach(l => ent.push([t(l.product), "lab-" + l.id], [t(l.waste), "lab-" + l.id]));
  Object.values(W.games).forEach(g => ent.push([t(g.title), "game-" + g.id]));
  const seen = new Set(), loc = W.lang === "bm" ? "ms" : "en";
  const uniq = ent.filter(([k, a]) => { const key = k.toLowerCase() + a; if (seen.has(key)) return false; seen.add(key); return true; }).sort((a, b) => a[0].localeCompare(b[0], loc));
  return [H2("🔎", X({ en: "Index", bm: "Indeks" }), "index0"), `<ul class="bk-toc bk-idx">${uniq.map(([k, a]) => `<li><a href="#" data-go="${a}"><span>${E(k)}</span><b class="bk-pn" data-to="${a}">000</b></a></li>`).join("")}</ul>`];
}

/* ---------- sound ---------- */
let ac = null;
const sndOn = () => W.store.get("book-snd") !== "0";
function flipSound() {
  if (!sndOn()) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const n = Math.floor(ac.sampleRate * .32), b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) { const x = i / n; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - x, 2.5) * Math.min(1, x / .08) * (.6 + .4 * Math.sin(x * 40)); }
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    f.type = "bandpass"; f.frequency.value = 2200; f.Q.value = .6; g.gain.value = .22;
    s.buffer = b; s.connect(f).connect(g).connect(ac.destination); s.start();
  } catch (e) {}
}

/* ---------- page + print builders ---------- */
const CACHE = {};
const pageEl = (pg, i) => {
  const d = document.createElement("div");
  d.className = "bk-pg" + (pg.cls ? " " + pg.cls : "") + (i % 2 ? " bk-l" : " bk-r");
  if (pg.hard) d.dataset.density = "hard";
  d.innerHTML = pg.shell ? shellDone(pg, i) : pg.html.replace('<b class="bk-pno"></b>', `<b class="bk-pno">${i}</b>`);
  if (pg.fixed && !pg.html.startsWith('<div class="bk-in')) d.innerHTML = `<div class="bk-in bk-full" style="--pc:${PARTS[pg.part] ? PARTS[pg.part].c : "#1e6f50"}">${pg.html}</div>`;
  return d;
};
const shellDone = (pg, i) => { const d = document.createElement("div"); d.innerHTML = shell(pg.part, pg.contRun || pg.run); d.querySelector(".bk-body").innerHTML = pg.html; d.querySelector(".bk-pno").textContent = i; return d.innerHTML; };
function qrAll(root) { if (!window.QRCode) return; root.querySelectorAll("[data-qr]").forEach(q => { if (q.firstChild) return; try { new QRCode(q, { text: q.dataset.qr, width: 160, height: 160, correctLevel: QRCode.CorrectLevel.M }); } catch (e) {} }); }

/* ---------- the page ---------- */
W.addBadge("book", { icon: "📖", name: S.badge, desc: S.badgeD });
W.registerPage("book", { mount(el, { args }) {
  document.body.classList.add("bk-on");
  el.innerHTML = `<div class="bk-wrap" id="bkWrap"><div class="bk-bar" role="toolbar" aria-label="eBook">
      <button type="button" data-b="prev" aria-label="${X(S.prev)}">◀</button>
      <button type="button" data-b="toc">📑 <span class="bk-hide">${X(S.toc)}</span></button>
      <span class="bk-count" aria-live="polite"></span>
      <button type="button" data-b="next" aria-label="${X(S.next)}">▶</button>
      <label class="bk-lvl"><span class="bk-hide">${X(S.lvl)}</span><select data-b="aud" aria-label="${X(S.lvl)}">${["kids", "teens", "adults", "teacher"].map(a => `<option value="${a}"${W.aud === a ? " selected" : ""}>${X(S.aud[a])}</option>`).join("")}</select></label>
      <button type="button" data-b="snd" aria-pressed="${sndOn()}" aria-label="${X(S.snd)}">${sndOn() ? "🔊" : "🔇"}</button>
      <a class="bk-pdf" data-b="pdf" href="dist/WasteQuest_eBook_${W.lang === "bm" ? "BM" : "EN"}.pdf" download aria-label="${X(S.pdfL)}">⬇️ ${X(S.pdf)}</a>
      <button type="button" data-b="fs" aria-label="${X(S.fs)}">⛶</button>
</div>
    <div class="bk-stagebox"><div class="bk-load">📖 ${X(S.bind)} <span id="bkPct"></span></div><div class="bk-stage" id="bkStage"></div>
      <button type="button" class="bk-side l" data-b="prev" aria-label="${X(S.prev)}">‹</button><button type="button" class="bk-side r" data-b="next" aria-label="${X(S.next)}">›</button></div>
    <p class="bk-tip small muted">${X(S.hint)}</p></div>
    <div class="bk-print" id="bkPrint" aria-hidden="true"></div>
    <dialog class="bk-dlg" id="bkDlg"><div class="bk-dlgv"></div><button type="button" class="btn" data-b="close">${X(S.close)}</button></dialog>`;
  const small = SMALL(); [PW, PH] = small ? [340, 520] : [480, 680];
  el.style.setProperty("--pw", PW + "px"); el.style.setProperty("--ph", PH + "px"); el.classList.toggle("bk-small", small);
  const $ = s => el.querySelector(s), wrap = $("#bkWrap"), stage = $("#bkStage"), dlg = $("#bkDlg");
  let pf = null, total = 0, dead = false, pagesData = null;
  const startAt = Math.max(0, parseInt(args[0], 10) || 0);
  const printMode = /[?&]print\b/.test(location.search);

  const fit = () => {
    const box = $(".bk-stagebox"), fsOn = document.fullscreenElement === wrap;
    const w = box.clientWidth, barH = wrap.querySelector(".bk-bar").offsetHeight;
    const h = Math.max(420, fsOn ? innerHeight - barH - 16 : small ? innerHeight - barH - 40 : innerHeight - Math.max(0, box.getBoundingClientRect().top + scrollY) - 34);
    const portrait = w < 660, pw = Math.min(portrait ? w : w / 2, h * PW / PH), k = pw / PW;
    stage.style.height = Math.round(pw * PH / PW) + "px"; stage.style.width = w + "px";
    stage.style.setProperty("--k", k.toFixed(4));
  };
  const count = () => { if (!pf) return; const i = pf.getCurrentPageIndex(); $(".bk-count").textContent = `${t(S.page)} ${i} / ${total - 1}`;
    try { history.replaceState(null, "", "#/book/" + i); } catch (e) {}
    if (i >= total - 2) W.award("book"); };
  const go = n => { if (!pf) return; n = Math.max(0, Math.min(total - 1, n)); pf.flip ? pf.flip(n) : pf.turnToPage(n); };

  const onClick = e => {
    const b = e.target.closest("[data-b]");
    if (b) { const k = b.dataset.b;
      if (k === "prev") pf && pf.flipPrev(); else if (k === "next") pf && pf.flipNext();
      else if (k === "toc") pagesData && go(pagesData.anchors.toc ?? 3);
      else if (k === "snd") { W.store.set("book-snd", sndOn() ? "0" : "1"); b.setAttribute("aria-pressed", sndOn()); b.textContent = sndOn() ? "🔊" : "🔇"; if (sndOn()) flipSound(); }
      else if (k === "fs") { if (document.fullscreenElement) document.exitFullscreen(); else wrap.requestFullscreen && wrap.requestFullscreen().catch(() => {}); }
      else if (k === "pdf" && location.protocol === "file:") { e.preventDefault(); window.print(); }
      else if (k === "close") dlg.close();
      return; }
    const g = e.target.closest("[data-go]");
    if (g && pagesData && g.dataset.go in pagesData.anchors) { e.preventDefault(); go(pagesData.anchors[g.dataset.go]); return; }
    const v = e.target.closest("[data-vid]");
    if (v) { e.preventDefault(); const id = v.dataset.vid, box = dlg.querySelector(".bk-dlgv");
      box.innerHTML = `<video controls autoplay playsinline poster="assets/videos/v2/${id}.jpg" src="assets/videos/v2/${id}_${W.lang === "bm" ? "bm" : "en"}.mp4"></video>`;
      box.querySelector("video").addEventListener("error", () => { box.innerHTML = `<p class="note warn">🎬 ${X(S.vidMissing)}</p>`; });
      W.track("video/" + id); dlg.showModal(); return; }
    const a = e.target.closest("[data-qa]");
    if (a && !a.disabled) { const q = a.closest(".bk-q"), ok = +a.dataset.qa === +q.dataset.c, fb = q.querySelector(".bk-fb");
      W.beep(ok);
      if (ok) { a.classList.add("right"); q.querySelectorAll("[data-qa]").forEach(x => x.disabled = true); fb.className = "bk-fb ok"; fb.textContent = `${t(S.right)} ${q.dataset.why}`; W.rw && W.rw.add && W.rw.add(1, "answer", "book-" + q.querySelector(".bk-qq").textContent.slice(0, 60)); }
      else { a.classList.add("wrong"); a.disabled = true; fb.className = "bk-fb no"; fb.textContent = t(S.wrong); } }
  };
  el.addEventListener("click", onClick);
  dlg.addEventListener("close", () => { dlg.querySelector(".bk-dlgv").innerHTML = ""; });
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  const onKey = e => { if (dlg.open || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return; if (e.key === "ArrowRight") pf && pf.flipNext(); else if (e.key === "ArrowLeft") pf && pf.flipPrev(); };
  const onResize = () => { if (SMALL() !== small) W.route(); else fit(); };
  const onFs = () => { fit(); pf && pf.update(); };
  $("[data-b=aud]").onchange = e => W.setAud(e.target.value);
  addEventListener("keydown", onKey); addEventListener("resize", onResize); document.addEventListener("fullscreenchange", onFs);

  (async () => {
    try { await Promise.race([Promise.all(["700 20px 'Pixelify Sans'", "400 15px Nunito", "800 15px Nunito"].map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 2500))]); } catch (e) {}
    const key = W.lang + "|" + W.aud + "|" + PW;
    if (!CACHE[key]) {
      const sections = buildSections();
      // preload every image so the measured layout matches the final one
      const srcs = new Set(); sections.forEach(s => [s.html || "", ...(s.blocks || [])].forEach(h => h.replace(/<img[^>]+src="([^"]+)"/g, (m, u) => srcs.add(u))));
      await Promise.race([Promise.all([...srcs].map(u => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = u; }))), new Promise(r => setTimeout(r, 6000))]);
      if (dead) return;
      CACHE[key] = await paginate(sections, f => { const s = el.querySelector("#bkPct"); if (s) s.textContent = Math.round(f * 100) + "%"; });
    }
    if (dead) return;
    pagesData = CACHE[key]; total = pagesData.pages.length;
    const els = pagesData.pages.map(pageEl);
    // print copy: same pages, eager images, QR codes
    const pr = $("#bkPrint"); pr.style.setProperty("--pk", Math.min(559.37 / PW, 793.7 / PH).toFixed(4)); els.forEach(p => { const c = p.cloneNode(true); c.className = "bk-ppg"; pr.appendChild(c); }); qrAll(pr);
    $(".bk-load").remove();
    fit();
    els.forEach(p => stage.appendChild(p)); qrAll(stage);
    if (small && !printMode) wrap.scrollIntoView({ block: "start" });
    if (printMode) { document.body.classList.add("bk-printready"); return; }
    pf = new St.PageFlip(stage, { width: PW, height: PH, size: "stretch", minWidth: 330, maxWidth: 2000, minHeight: 300, maxHeight: 3000,
      showCover: true, usePortrait: true, mobileScrollSupport: true, disableFlipByClick: true, flippingTime: 700, maxShadowOpacity: .45, startPage: Math.min(startAt, total - 1) });
    pf.loadFromHTML(els);
    pf.on("flip", count); pf.on("changeOrientation", count); pf.on("init", count);
    pf.on("changeState", e => { if (e.data === "flipping") flipSound(); });
    count();
  })();

  return () => { dead = true; el.removeEventListener("click", onClick); el.classList.remove("bk-small"); el.style.removeProperty("--pw"); el.style.removeProperty("--ph"); document.body.classList.remove("bk-on", "bk-printready"); removeEventListener("keydown", onKey); removeEventListener("resize", onResize); document.removeEventListener("fullscreenchange", onFs);
    try { pf && pf.destroy(); } catch (e) {} if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); };
}});

/* ---------- styles ---------- */
W.css("book", `
body.bk-on #view{max-width:1400px}
.bk-wrap{display:flex;flex-direction:column;gap:10px}
.bk-wrap:fullscreen{background:#1a1932;padding:8px;justify-content:center}
.bk-bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;background:#f9e6cf;border:3px solid #1a1932;box-shadow:var(--shadow);padding:6px 8px}
.bk-bar button,.bk-bar a,.bk-bar select{font-family:var(--pix);font-weight:600;font-size:1rem;background:#fff;border:3px solid #1a1932;border-radius:0;padding:4px 10px;color:#1a1932;text-decoration:none;min-height:40px;cursor:pointer}
.bk-bar button:hover,.bk-bar a:hover{background:#ffeb57}
.bk-bar .bk-pdf{background:#5ac54f}
.bk-count{font-family:var(--pix);font-weight:600;min-width:9ch;text-align:center}
.bk-lvl{display:flex;gap:6px;align-items:center;font-family:var(--pix);font-weight:600}
@media (max-width:560px){.bk-hide{display:none}.bk-bar{gap:4px;padding:4px}.bk-bar button,.bk-bar a,.bk-bar select{padding:2px 7px;min-height:36px;font-size:.9rem}.bk-bar select{max-width:110px}.bk-count{min-width:0}}
.bk-stagebox{position:relative;min-height:320px}
.bk-stage{margin:0 auto}
.bk-load{font-family:var(--pix);font-size:1.3rem;text-align:center;padding:80px 10px}
.bk-side{position:absolute;top:50%;transform:translateY(-50%);z-index:5;width:44px;height:64px;font-size:2.2rem;line-height:1;border:3px solid #1a1932;background:#f9e6cf;box-shadow:var(--shadow);cursor:pointer;opacity:.85}
.bk-side.l{left:0}.bk-side.r{right:0}
@media (max-width:700px){.bk-side{display:none}}
.bk-tip{text-align:center;margin:0}
.bk-wrap:fullscreen .bk-tip{display:none}
/* pages */
.bk-pg{background:#fffaf0;overflow:hidden}
.bk-pg.bk-l{box-shadow:inset -14px 0 18px -14px rgba(26,25,50,.35)}
.bk-pg.bk-r{box-shadow:inset 14px 0 18px -14px rgba(26,25,50,.35)}
.bk-in{width:var(--pw,480px);height:var(--ph,680px);transform-origin:0 0;transform:scale(var(--k,1));display:flex;flex-direction:column;padding:22px 26px 0;font:14px/1.45 Nunito,system-ui,sans-serif;color:#1a1932;background:#fffaf0;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.bk-run{display:flex;justify-content:space-between;gap:10px;font:600 10.5px var(--pix);color:var(--pc);border-bottom:3px solid var(--pc);padding-bottom:4px;margin-bottom:10px;white-space:nowrap;overflow:hidden}
.bk-run span:last-child{overflow:hidden;text-overflow:ellipsis}
.bk-body{flex:1;min-height:0;overflow:hidden;position:relative}
.bk-body>*{margin:0 0 9px}
.bk-foot{height:34px;flex:none;display:flex;align-items:center;justify-content:space-between;font:600 11px var(--pix);color:#4a4a6a}
.bk-l .bk-foot{flex-direction:row-reverse}
.bk-pno{background:var(--pc);color:#fff;min-width:28px;text-align:center;padding:2px 6px;border:2px solid #1a1932}
.bk-in h1,.bk-in h2,.bk-in h3{font-family:var(--pix)}
.bk-h2,.bk-in .bk-body h2{font-size:21px;line-height:1.15;color:var(--pc);margin:0 0 8px}
.bk-h3,.bk-in .bk-body h3{font-size:15.5px;margin:12px 0 5px}
.bk-in p,.bk-in li{font-size:13.5px}
.bk-in a{color:#0069aa}
.bk-in .small{font-size:11.5px}
.bk-in .note{border:2px solid #1a1932!important;box-shadow:2px 2px 0 rgba(26,25,50,.3)!important;padding:6px 9px;font-size:12.5px;border-radius:0!important}
.bk-in .tbl{width:100%;max-width:100%;font-size:11px;border-collapse:collapse}.bk-in td,.bk-in th{overflow-wrap:break-word;hyphens:auto}
.bk-in .tbl td,.bk-in .tbl th,.bk-in .th-tbl td:first-child{min-width:0}.bk-in .th-rub,.bk-in .th-risk,.bk-in .th-lo{font-size:10px}.bk-in .tbl td *{white-space:normal}.bk-in .tbl .tag{font-size:9.5px;padding:1px 4px}.bk-in .th-risk,.bk-in .th-lo{font-size:9.5px}.bk-in .tbl th{overflow-wrap:anywhere;hyphens:none}
.bk-in .tbl th,.bk-in .tbl td{border:1.5px solid #1a1932;padding:3px 5px;vertical-align:top}
.bk-in .tbl th{background:#f9e6cf}
.bk-in .tablewrap{overflow:visible}
.bk-in img{max-width:100%}
.bk-clip{max-height:100%;overflow:hidden}
.bk-stack thead{display:none}.bk-stack,.bk-stack tbody,.bk-stack tr,.bk-stack td{display:block;width:100%}
.bk-in .bk-stack tr{border:2px solid #1a1932;margin-bottom:6px;background:#fff}.bk-in .bk-stack td{border:0;border-bottom:1px dashed #d8c4aa;padding:3px 6px}
.bk-stack td[data-l]::before{content:attr(data-l) ": ";font-weight:800;color:#4a4a6a}
.pix{image-rendering:pixelated;display:block}
.bk-chk{font:600 12px var(--pix);color:#fff;background:var(--pc);display:inline-block;padding:2px 8px;border:2px solid #1a1932;margin-bottom:4px!important}
.bk-list{padding-left:20px}.bk-list li+li{margin-top:3px}
.bk-plain{list-style:none;padding:0}.bk-plain li{padding:5px 8px;background:#f9e6cf;border-left:4px solid var(--pc);margin-top:5px}
.bk-gop{text-align:right}
.bk-go{display:inline-block;font:600 13px var(--pix);background:#5ac54f;color:#1a1932!important;border:2px solid #1a1932;box-shadow:2px 2px 0 rgba(26,25,50,.35);padding:4px 10px;text-decoration:none}
.bk-go.sm{font-size:11.5px;padding:2px 8px;flex:none;align-self:center}
/* front */
.bk-full{padding:0}
.bk-cover .bk-in{background:linear-gradient(#94fdff,#c7f3ff 55%,#5ac54f 55.2%)}
.bk-cv{padding:30px 30px 8px;text-align:center}
.bk-cv h1{font-size:64px;line-height:1;margin:14px 0 6px;color:#1a1932}.bk-cv h1 b,.bk-tp h1 b{color:#1e6f50}
.bk-cvs{font:600 19px var(--pix);margin:4px 0}.bk-cvt{font:700 15px Nunito;margin:4px 0;color:#1e6f50}
.bk-logos{height:54px;border:3px solid #1a1932;background:#fff;padding:4px;margin:0 auto}.bk-logos.sm{height:40px}
.bk-cvtown{width:calc(100% - 40px);aspect-ratio:4/3;height:auto;margin:4px auto 0;border:3px solid #1a1932;box-shadow:4px 4px 0 rgba(26,25,50,.35)}
.bk-cvf{display:flex;align-items:center;justify-content:center;gap:14px;font:600 15px var(--pix);padding:16px 20px}
.bk-bf{justify-content:space-between}
.bk-robot{width:72px;height:72px}.bk-robot.sm{width:56px;height:56px}.bk-robot.op{width:96px;height:96px;margin:10px auto 0}
.bk-tp{padding:60px 40px;display:flex;flex-direction:column;gap:12px;height:100%;text-align:center}
.bk-tp h1{font-size:48px;margin:0}
@media print{.bk-hintp{display:none}}
.bk-small .bk-cv{padding:16px 16px 4px}.bk-small .bk-cv h1{font-size:46px;margin:8px 0 4px}.bk-small .bk-cvs{font-size:16px}.bk-small .bk-logos{height:42px}.bk-small .bk-cvf{padding:10px 14px}
.bk-small .bk-tp{padding:30px 22px;gap:9px}.bk-small .bk-tp h1{font-size:38px}.bk-small .bk-op{padding:34px 20px}.bk-small .bk-op h1{font-size:29px}.bk-small .bk-op p{font-size:14px}
.bk-small .bk-in{padding:16px 18px 0}.bk-small .bk-3{grid-template-columns:1fr}.bk-small .bk-3>div{flex-direction:row;flex-wrap:wrap;gap:2px 6px}.bk-small .bk-ban{width:104px;height:31px}.bk-small .bk-hero img{width:96px;height:72px}.bk-small .bk-fill{padding:24px}.bk-small .bk-robot.op{width:72px;height:72px}
.bk-small .bk-run span:first-child{max-width:55%;overflow:hidden;text-overflow:ellipsis}
.bk-hintp{margin-top:auto!important;font:600 13px var(--pix);color:#0069aa}
.bk-op{height:100%;background:var(--pc);color:#fff;padding:60px 34px;display:flex;flex-direction:column;gap:14px;text-align:center}
.bk-op h1{font-size:38px;line-height:1.1;margin:0;text-shadow:3px 3px 0 #1a1932}
.bk-op p{font-size:16px;font-weight:700}
.bk-opn{font:600 15px var(--pix);background:#1a1932;align-self:center;padding:3px 12px}
.bk-opart{width:100%;border:3px solid #1a1932;box-shadow:4px 4px 0 rgba(26,25,50,.4);margin-top:auto}
.bk-fill{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:40px;text-align:center;background:#f9e6cf}
.bk-fill p{font-size:16px}
.bk-lines i{display:block;border-bottom:1.5px solid #c9b8a4;height:28px}
.bk-kitar{display:flex;gap:10px;align-items:center}
.bk-bubble{background:#f9e6cf;border:2px solid #1a1932;padding:8px 10px;margin:0;font-weight:700}
.bk-signs{display:grid;grid-template-columns:1fr 1fr;gap:6px}.bk-signs div{display:flex;gap:6px;align-items:center;font-size:12.5px;background:#fff;border:2px solid #1a1932;padding:4px 6px}.bk-signs b{font-size:18px}
/* contents/index */
.bk-tocp a,.bk-toc a{display:flex;justify-content:space-between;gap:8px;text-decoration:none;color:#1a1932}
.bk-tocp{border-bottom:3px solid var(--pc);margin:10px 0 3px!important}.bk-tocp b{font:600 14px var(--pix);color:var(--pc)}
.bk-toc{list-style:none;padding:0}.bk-toc li{font-size:12.5px;margin:0}.bk-toc a span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bk-toc a:after{content:"";order:1;flex:1;border-bottom:1.5px dotted #b9a68f;margin-bottom:4px}.bk-toc .bk-pn{order:2;font-weight:800}
.bk-idx{columns:2;column-gap:16px}.bk-idx li{break-inside:avoid;font-size:11.5px}
/* blocks */
.bk-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}.bk-two figure{margin:0}.bk-two figcaption{font-size:11px;text-align:center}
.bk-town{width:100%;aspect-ratio:4/3;border:2px solid #1a1932}
.bk-dist{display:flex;gap:8px;align-items:center;background:#f9e6cf;border:2px solid #1a1932;padding:5px}
.bk-ban{width:150px;height:45px;flex:none;border:2px solid #1a1932}
.bk-dist div{display:flex;flex-direction:column;line-height:1.25}.bk-dist b{font:600 14px var(--pix)}.bk-dist span{font-size:12px}.bk-dist small{font-size:10.5px;color:#4a4a6a}
.bk-aud,.bk-cert{display:flex;gap:10px;align-items:flex-start;border-bottom:2px dashed #d8c4aa;padding-bottom:6px}.bk-aud>b,.bk-cert>b{font-size:30px}.bk-aud .bk-h3,.bk-cert .bk-h3{margin:0}
.bk-aud p,.bk-cert p{margin:2px 0 0}
.bk-3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.bk-3>div{background:#f9e6cf;border:2px solid #1a1932;padding:6px;display:flex;flex-direction:column;gap:3px;font-size:12px}.bk-3 b{font:600 12.5px var(--pix)}
.bk-sdg img{width:100%;border:2px solid #1a1932}.bk-sdg{margin:0}
.bk-game{display:flex;gap:8px;align-items:center;background:#f9e6cf;border:2px solid #1a1932;padding:5px 7px}.bk-gi{font-size:26px}
.bk-game div{display:flex;flex-direction:column;flex:1;line-height:1.25}.bk-game b{font:600 13.5px var(--pix)}.bk-game span{font-size:12px}.bk-game small{font-size:10.5px;color:#4a4a6a}
.bk-rules li{font-weight:700}
.bk-glance td:nth-child(n+2),.bk-glance th:nth-child(n+2){text-align:center;white-space:nowrap}.bk-glance a{text-decoration:none;color:#1a1932}
/* labs */
.bk-labhd{position:relative}.bk-cov{width:100%;aspect-ratio:8/5;border:3px solid #1a1932;margin-bottom:8px}
.bk-hook{font-weight:700;font-size:14px!important;margin:0}
.bk-chips{display:flex;flex-wrap:wrap;gap:4px}.bk-chips span{font:600 10.5px var(--pix);background:#fff;border:2px solid #1a1932;padding:1px 6px}.bk-chips span.red{background:#ffd6d6}
.bk-meta{display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;margin:0;font-size:12px}.bk-meta div:last-child{grid-column:1/-1}.bk-meta dt{font-weight:800;color:#4a4a6a;font-size:11px}.bk-meta dd{margin:0}
.bk-in .ln-svg{max-height:calc(var(--ph) * .62)}.bk-in .ln-binp{min-width:0;overflow-wrap:break-word;hyphens:auto}.bk-small .ln-bins{grid-template-columns:1fr}.bk-small .ln-svg{max-height:none}
.bk-vid{margin:0;display:flex;flex-direction:column;gap:5px}
.bk-vthumb{position:relative;display:block;border:3px solid #1a1932;background:#000;aspect-ratio:16/9;overflow:hidden}
.bk-vthumb img{width:100%;height:100%;object-fit:cover;display:block}
.bk-play{position:absolute;inset:0;margin:auto;width:64px;height:64px;display:grid;place-items:center;font-size:30px;color:#1a1932;background:#ffeb57;border:3px solid #1a1932;box-shadow:3px 3px 0 rgba(26,25,50,.5)}
.bk-vid figcaption{display:flex;align-items:center;justify-content:space-between;gap:8px}
.bk-vbtn{font:600 13px var(--pix);background:#ffeb57;border:2px solid #1a1932;padding:4px 10px;cursor:pointer}
.bk-qrw{display:none}
.bk-why span{font-size:11.5px}
.bk-lh{list-style:none;font:600 13px var(--pix);color:var(--pc);margin-left:-18px!important}
.bk-steps{list-style:none;padding:0}.bk-steps li{display:flex;gap:7px;align-items:flex-start}
.bk-n{flex:none;width:22px;height:22px;display:grid;place-items:center;background:var(--pc);color:#fff;font:600 12px var(--pix);border:2px solid #1a1932;margin-top:1px}
.bk-x{display:block;font-style:normal;font-size:12px;color:#4a4a6a;margin-top:2px}
.bk-pre{font-size:9px;line-height:1.3;background:#10243a;color:#e8f1ff;padding:6px;white-space:pre-wrap;word-break:break-word}
.bk-tag{font:600 10.5px var(--pix);background:#fff;border:2px solid #1a1932;padding:1px 6px;color:#1a1932;vertical-align:middle}
.bk-poster{margin:0;text-align:center}.bk-poster img{max-height:300px;width:auto;border:2px solid #1a1932;margin:0 auto;display:block}.bk-poster figcaption{font-size:10.5px;color:#4a4a6a}
/* quiz */
.bk-qhd .bk-h3{margin:10px 0 0}.bk-qhint{font-size:11.5px!important;color:#4a4a6a;margin:0}
.bk-q{background:#f9e6cf;border:2px solid #1a1932;padding:6px 8px}
.bk-qq{margin:0 0 4px;font-weight:700}
.bk-opts{display:flex;flex-direction:column;gap:4px}
.bk-opts button{text-align:left;font:600 12.5px Nunito,sans-serif;background:#fff;border:2px solid #1a1932;padding:4px 8px;cursor:pointer;color:#1a1932}
.bk-opts button:hover:not(:disabled){background:#ffeb57}
.bk-opts button.right{background:#99e65f}.bk-opts button.wrong{background:#ffb3b3;text-decoration:line-through}
.bk-opts button:disabled{cursor:default}
.bk-fb{margin:4px 0 0;font-size:12px!important;font-weight:700}.bk-fb:empty{display:none}.bk-fb.ok{color:#1e6f50}.bk-fb.no{color:#c42430}
.bk-key{visibility:hidden;font-size:10.5px!important;text-align:right;margin:0!important}
/* heroes */
.bk-nums{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.bk-nums div{background:var(--pc);color:#fff;border:2px solid #1a1932;padding:6px;text-align:center;display:flex;flex-direction:column}.bk-nums b{font:700 24px var(--pix)}.bk-nums span{font-size:11px}
.bk-hero{display:flex;gap:8px;background:#f9e6cf;border:2px solid #1a1932;padding:5px}
.bk-hero img{width:120px;height:90px;object-fit:cover;flex:none;border:2px solid #1a1932}
.bk-hero div{display:flex;flex-direction:column;gap:3px;line-height:1.25;align-items:flex-start}.bk-hero b{font:600 13.5px var(--pix)}.bk-hero span{font-size:12px}
.bk-red{color:#c42430;font-size:11px}
.bk-gl{font-size:12.5px!important;margin:0 0 5px!important}.bk-gl i{color:#4a4a6a}
/* video dialog */
.bk-dlg{border:3px solid #1a1932;padding:8px;background:#1a1932;max-width:min(960px,96vw);width:96vw}
.bk-dlg::backdrop{background:rgba(26,25,50,.75)}
.bk-dlg video{width:100%;max-height:78vh;display:block;background:#000}
.bk-dlg .btn{margin-top:8px}
/* hidden measuring page + print copy */
.bk-meas{position:fixed;left:-20000px;top:0;visibility:hidden;pointer-events:none}
.bk-meas .bk-in{transform:none}
.bk-print{display:none}
@media print{
  @page{size:148mm 210mm;margin:0}
  body.bk-on>*:not(main),body.bk-on #view>*:not(.bk-print),body.bk-on .toastbox{display:none!important}
  body.bk-on,body.bk-on main{background:#fff!important;margin:0!important;padding:0!important;max-width:none!important}
  body.bk-on .bk-print{display:block!important}
  .bk-ppg{width:148mm;height:210mm;overflow:hidden;break-after:page;page-break-after:always;position:relative}
  .bk-ppg:last-child{break-after:auto}
  .bk-ppg .bk-in{transform:scale(var(--pk,1.1654))}
  .bk-ppg .bk-play,.bk-ppg .bk-vbtn,.bk-ppg .bk-go,.bk-ppg .bk-qhint{display:none!important}
  .bk-ppg .bk-qrw{display:flex;align-items:center;gap:6px;font-size:10px}
  .bk-ppg .bk-qr{width:56px;height:56px;display:block}.bk-ppg .bk-qr img,.bk-ppg .bk-qr canvas{width:56px!important;height:56px!important}
  .bk-ppg .bk-qr.big,.bk-ppg .bk-qr.big img,.bk-ppg .bk-qr.big canvas{width:84px!important;height:84px!important}
  .bk-ppg .bk-key{visibility:visible;color:#4a4a6a}
  .bk-ppg .bk-opts button{padding:2px 6px}
}
.bk-qr.big{display:none}
@media print{.bk-qr.big{display:block}}
`);
})();
