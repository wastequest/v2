/* WasteQuest v2 — #/share for teachers and partners: QR + link, embed snippet, Google Classroom links, downloads.
   Also handles ?embed=1 (hides the footer; language toggle stays). QR lib: qrcodejs 1.0.0, vendored in js/vendor/qrcode.js (works offline). */
(() => {
  const W = WQ, L = (en, bm) => ({ en, bm }), X = o => W.esc(W.t(o));
  if (new URLSearchParams(location.search).get("embed") === "1") {
    document.body.classList.add("wq-embed");
    document.head.insertAdjacentHTML("beforeend", "<style>body.wq-embed .v2foot{display:none}</style>");
  }
  const T = {
    title: L("Share WasteQuest", "Kongsi WasteQuest"),
    sub: L("For teachers and partners: a QR code, a website embed, Google Classroom links and downloads.", "Untuk guru dan rakan kongsi: kod QR, benaman laman web, pautan Google Classroom dan muat turun."),
    qr: L("QR code and link", "Kod QR dan pautan"),
    qrNote: L("Show this on a screen or print it. Scanning opens WasteQuest straight away; no sign-up.", "Paparkan pada skrin atau cetak. Imbasan terus membuka WasteQuest; tiada pendaftaran."),
    qrOff: L("The QR code could not be drawn here. Use the link below instead.", "Kod QR tidak dapat dipaparkan di sini. Guna pautan di bawah."),
    qrAlt: L("QR code that opens", "Kod QR yang membuka"), link: L("link", "pautan"), code: L("embed code", "kod benaman"),
    offNote: L("You are using an offline copy, so the QR code and links point to the public website.", "Anda menggunakan salinan luar talian, jadi kod QR dan pautan menghala ke laman web awam."),
    copy: L("Copy", "Salin"), copied: L("Copied", "Disalin"), copyFail: L("Select the text and copy it by hand.", "Pilih teks dan salin secara manual."),
    embed: L("Put WasteQuest on your website", "Letak WasteQuest di laman web anda"),
    embedNote: L("Paste this code into your web page. It fits phones and laptops. Embed mode hides the footer; the language button stays.", "Tampal kod ini ke halaman web anda. Ia muat pada telefon dan komputer riba. Mod benaman menyembunyikan bahagian bawah; butang bahasa kekal."),
    cls: L("Google Classroom", "Google Classroom"),
    clsNote: L("Each button opens Google Classroom so you can post that activity to your class.", "Setiap butang membuka Google Classroom supaya anda boleh hantar aktiviti itu kepada kelas anda."),
    games: L("Games and quizzes", "Permainan dan kuiz"), labs: L("Hands-on labs", "Makmal amali"),
    toCls: L("Share to Classroom", "Kongsi ke Classroom"),
    dl: L("Downloads", "Muat turun"),
    dlNote: L("For places with weak internet. The offline file opens in any browser, even from a USB stick.", "Untuk tempat yang internetnya lemah. Fail luar talian dibuka dalam mana-mana pelayar, walaupun dari pemacu USB."),
    off: L("Offline file (one page)", "Fail luar talian (satu halaman)"), pack: L("Offline pack with lab videos (zip)", "Pek luar talian dengan video makmal (zip)"),
    bEN: L("Facilitator booklet (English, PDF)", "Buku panduan fasilitator (Inggeris, PDF)"), bBM: L("Facilitator booklet (Bahasa Melayu, PDF)", "Buku panduan fasilitator (Bahasa Melayu, PDF)"),
    eEN: L("WasteQuest eBook (English, PDF)", "eBuku WasteQuest (Inggeris, PDF)"), eBM: L("WasteQuest eBook (Bahasa Melayu, PDF)", "eBuku WasteQuest (Bahasa Melayu, PDF)"), eRead: L("Read the eBook online", "Baca eBuku dalam talian"),
  };
  // the public address: this page's own address when served over http(s), else (offline file / USB copy) the public site
  const SITE = "https://wastequest.github.io/";
  const base = () => /^https?:$/.test(location.protocol) ? location.origin + location.pathname.replace(/index\.html$/, "") : SITE;
  const copyBox = (id, text) => `<div class="sh-copy"><textarea id="${id}" aria-label="${X(T.copy)}: ${X(id === "shUrl" ? T.link : T.code)}" readonly rows="${text.length > 90 ? 4 : 1}">${W.esc(text)}</textarea><button type="button" class="btn alt" data-copy="${id}">${X(T.copy)}</button></div>`;
  const clsLink = (hash, name) => `<li><span>${X(name)}</span><a class="btn alt" target="_blank" rel="noopener" href="https://classroom.google.com/share?url=${encodeURIComponent(base() + hash)}">${X(T.toCls)}</a></li>`;
  W.css("share", `.sh-copy{display:flex;gap:8px;align-items:flex-start;margin-top:8px}.sh-copy textarea{flex:1;min-width:0;font:13px/1.4 monospace;padding:8px;border:2px solid #5d6a7c;border-radius:8px;resize:vertical}
.sh-qr{display:flex;justify-content:center;padding:12px;background:#fff;border-radius:12px;width:max-content;max-width:100%;margin:8px auto}.sh-qr img,.sh-qr canvas{max-width:100%;height:auto}
.sh-list{list-style:none;padding:0;margin:8px 0}.sh-list li{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e6ecf1}.sh-list .btn{padding:6px 14px;font-size:.9rem;flex:none}
.sh-dl{display:grid;gap:8px;padding-left:1.2em}.sh-dl a{display:inline-block;padding:4px 0}
@media (max-width:420px){.sh-copy{flex-direction:column;align-items:stretch}.sh-list li{flex-wrap:wrap}}`);

  W.registerPage("share", { mount(el) {
    const url = base(), games = Object.values(W.games).sort((a, b) => a.order - b.order), labs = W.labs || [];
    const iframe = `<div style="position:relative;width:100%;max-width:1100px;aspect-ratio:4/5;max-height:90vh;margin:auto"><iframe src="${url}?embed=1#/home" title="WasteQuest" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:12px" allow="camera; fullscreen" loading="lazy"></iframe></div>`;
    el.innerHTML = W.head("🔗", T.title, T.sub) +
      `<section class="card"><h2>${X(T.qr)}</h2><p class="small">${X(T.qrNote)}</p>${/^https?:$/.test(location.protocol) ? "" : `<p class="small">${X(T.offNote)}</p>`}<div class="sh-qr" id="shQR" role="img" aria-label="${X(T.qrAlt)} ${W.esc(url)}"></div>${copyBox("shUrl", url)}</section>
      <section class="card"><h2>${X(T.embed)}</h2><p class="small">${X(T.embedNote)}</p>${copyBox("shEmbed", iframe)}</section>
      <section class="card"><h2>${X(T.cls)}</h2><p class="small">${X(T.clsNote)}</p>
        <h3>${X(T.games)}</h3><ul class="sh-list">${games.map(g => clsLink("#/game/" + g.id, g.title)).join("")}</ul>
        <h3>${X(T.labs)}</h3><ul class="sh-list">${labs.map(l => clsLink("#/lab/" + l.id, l.title)).join("")}</ul></section>
      <section class="card"><h2>${X(T.dl)}</h2><p class="small">${X(T.dlNote)}</p><ul class="sh-dl">
        <li><a href="dist/WasteQuest_offline.html" download>${X(T.off)}</a></li><li><a href="https://github.com/wastequest/wastequest.github.io/releases/download/v2026.1/WasteQuest_offline_pack.zip">${X(T.pack)}</a></li>
        <li><a href="dist/WasteQuest_Booklet_EN.pdf" target="_blank" rel="noopener">${X(T.bEN)}</a></li><li><a href="dist/WasteQuest_Booklet_BM.pdf" target="_blank" rel="noopener">${X(T.bBM)}</a></li>
        <li><a href="dist/WasteQuest_eBook_EN.pdf" target="_blank" rel="noopener">${X(T.eEN)}</a></li><li><a href="dist/WasteQuest_eBook_BM.pdf" target="_blank" rel="noopener">${X(T.eBM)}</a></li><li><a href="#/book">📖 ${X(T.eRead)}</a></li></ul></section>`;
    W.$$("[data-copy]", el).forEach(b => b.onclick = async () => {
      const ta = W.$("#" + b.dataset.copy, el);
      try { await navigator.clipboard.writeText(ta.value); W.toast(W.t(T.copied)); } catch (er) { ta.select(); W.toast(W.t(T.copyFail)); }
    });
    const box = W.$("#shQR", el);
    try { if (!window.QRCode) throw new Error("no QR lib");
      new QRCode(box, { text: url, width: 220, height: 220, correctLevel: QRCode.CorrectLevel.M });
      box.querySelectorAll("img,canvas").forEach(n => { n.setAttribute("alt", ""); n.setAttribute("aria-hidden", "true"); }); box.removeAttribute("title");
    } catch (er) { box.removeAttribute("role"); box.removeAttribute("aria-label"); box.textContent = W.t(T.qrOff); }
  } });
})();
