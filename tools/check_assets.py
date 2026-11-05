#!/usr/bin/env python3
"""Static checks for WasteQuest (standard library only).

  * every local file named in index.html, booklet.html, css/*.css and js/**/*.js exists
    (quoted "assets/...", "dist/...", "js/...", "css/..." paths, src/href attributes and CSS url())
  * every lab id listed in the V2 set in js/labs.js has its poster and both narrated videos
  * every <script src> in index.html is a file, and each JS file parses (node --check, if node is installed)
  * no JS file contains "</script", which would break the inlined offline pack

Usage: python3 tools/check_assets.py
"""
import pathlib, re, shutil, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
problems = []

sources = [ROOT / "index.html", ROOT / "booklet.html", ROOT / "manifest.webmanifest", ROOT / "sw.js", *sorted((ROOT / "css").glob("*.css")), *sorted((ROOT / "js").rglob("*.js"))]
REF = re.compile(r'''(?:["'(`]|url\()\s*((?:assets|dist|js|css)/[A-Za-z0-9_./ -]+?\.[A-Za-z0-9]{2,5})\s*(?=["')`?#])''')
checked = 0
for src in sources:
    text = src.read_text(encoding="utf-8")
    for m in REF.finditer(text):
        rel = m.group(1)
        if "${" in rel:
            continue
        checked += 1
        if not (ROOT / rel).is_file():
            line = text.count("\n", 0, m.start()) + 1
            problems.append(f"{src.relative_to(ROOT)}:{line}: missing file {rel}")
    if src.suffix == ".js" and "</script" in text.lower() and "vendor" not in src.parts:
        problems.append(f"{src.relative_to(ROOT)}: contains '</script' (breaks the inlined offline pack)")

labs = (ROOT / "js" / "labs.js").read_text(encoding="utf-8")
m = re.search(r'const V2=new Set\("([^"]+)"', labs)
if not m:
    problems.append("js/labs.js: could not find the V2 lab video set")
else:
    for lab in m.group(1).split():
        for rel in (f"assets/videos/v2/{lab}.jpg", f"assets/videos/v2/{lab}_en.mp4", f"assets/videos/v2/{lab}_bm.mp4"):
            checked += 1
            if not (ROOT / rel).is_file():
                problems.append(f"js/labs.js: lab '{lab}' is missing {rel}")

if shutil.which("node"):
    for js in sorted((ROOT / "js").rglob("*.js")):
        r = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
        if r.returncode:
            problems.append(f"{js.relative_to(ROOT)}: syntax error\n{r.stderr.strip()}")

for p in problems:
    print(p)
print(f"Checked {len(sources)} files, {checked} local references.")
if problems:
    sys.exit(f"{len(problems)} problem(s).")
print("All good.")
