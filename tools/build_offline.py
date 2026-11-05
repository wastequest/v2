#!/usr/bin/env python3
"""Build dist/WasteQuest_offline.html: one self-contained HTML file for schools without reliable internet.

What it does, starting from index.html:
  * inlines css/*.css <link> tags as <style> blocks
  * inlines every <script src> between the build:scripts markers, each prefixed with a /* path */ comment
  * turns quoted local image paths ("assets/....jpg|jpeg|png|gif|svg") in the HTML and the scripts into data: URIs
    (paths built at run time, such as the lab video posters, are left alone: they come from the zip pack)
  * appends a small bilingual "offline copy" note

Usage:  python3 tools/build_offline.py            # writes dist/WasteQuest_offline.html
        python3 tools/build_offline.py --check    # exit 1 if the committed file is out of date
Standard library only.
"""
import base64, mimetypes, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "dist" / "WasteQuest_offline.html"
START = "<!-- build:scripts (build.py inlines the scripts between these markers) -->"
END = "<!-- /build:scripts -->"
IMG = re.compile(r'(["\'])(assets/[A-Za-z0-9_./-]+\.(?:jpe?g|png|gif|svg|webp))\1')

OFFLINE_NOTE = """<div id="wqOffNote" role="note" style="margin:12px auto;max-width:1100px;padding:10px 14px;border-radius:10px;background:#fff7d6;border:1px solid #e6c860;font-size:.9rem"></div>
<script>(() => { const N = {
  en: "<b>Offline copy.</b> Games, quizzes, labs and the screen-only event mode work without internet. Camera scan and phone event mode need internet. Lab videos play only from the offline pack (zip). Your coded progress record is kept on this device and sent automatically when you are online again.",
  bm: "<b>Salinan luar talian.</b> Permainan, kuiz, makmal dan mod acara skrin sahaja berfungsi tanpa internet. Imbasan kamera dan mod acara telefon memerlukan internet. Video makmal hanya dimainkan daripada pek luar talian (zip). Rekod kemajuan berkod anda disimpan pada peranti ini dan dihantar secara automatik apabila anda kembali dalam talian." };
  const paint = () => { document.getElementById("wqOffNote").innerHTML = N[WQ.lang] || N.en; };
  WQ.on("route", paint); paint(); })();</script>
"""

_cache = {}
def data_uri(rel):
    if rel not in _cache:
        p = ROOT / rel
        if not p.is_file():
            raise SystemExit(f"build_offline: missing image {rel}")
        mime = mimetypes.guess_type(p.name)[0] or "application/octet-stream"
        _cache[rel] = f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()
    return _cache[rel]

def inline_images(text):
    return IMG.sub(lambda m: m.group(1) + data_uri(m.group(2)) + m.group(1), text)

def build():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">',
                  lambda m: "<style>\n" + (ROOT / m.group(1)).read_text(encoding="utf-8") + "\n</style>", html)
    a, b = html.index(START), html.index(END)
    srcs = re.findall(r'<script src="([^"]+)"></script>', html[a:b])
    parts = []
    for s in srcs:
        js = (ROOT / s).read_text(encoding="utf-8")
        if "</script" in js.lower():
            raise SystemExit(f"build_offline: {s} contains '</script', which would end the inline block")
        parts.append(f"<script>/* {s} */\n{inline_images(js)}\n</script>\n")
    html = html[:a] + START + "\n" + "".join(parts) + html[b:]
    head, tail = html[:a], html[a:]
    html = inline_images(head) + tail
    html = html.replace("</body>", OFFLINE_NOTE + "</body>", 1)
    return html

if __name__ == "__main__":
    out = build()
    if "--check" in sys.argv:
        cur = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
        if cur != out:
            sys.exit("dist/WasteQuest_offline.html is out of date: run python3 tools/build_offline.py")
        print("offline pack is up to date"); sys.exit(0)
    OUT.write_text(out, encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)} ({len(out.encode()) / 1e6:.2f} MB, {len(_cache)} images inlined)")
