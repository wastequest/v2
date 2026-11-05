/* Sort It Out! — drag waste into Malaysian SWCorp colour bins (blue paper / orange plastic & metal / brown glass)
   Level 2 adds compost, general and hazardous waste. */
(() => {
const T={
 en:{hint:"Drag the item into a bin, or tap a bin.",l1:"Level 1 · 3 bins",l2:"Level 2 · 6 bins",
  good:["Great job!","Correct!","Well sorted!","Super!"],bad:"Not quite, try another bin!",was:"It goes in:",now:(n,i,k)=>`Item ${i} of ${k}: ${n}.`,keys:"Keyboard: press 1–3 (or 1–6) to pick a bin.",
  endT:"Round complete!",endS:(s,n)=>`You sorted ${s} of ${n} items right on the first try.`,again:"Play again",next:"Try Level 2",map:"All games",best:"Best",stars:"stars",goal:"Sort 9 or more right on the first try to earn the Sorting Star badge!",lvl:"Level",score:"Score"},
 bm:{hint:"Seret barang ke dalam tong, atau tekan tong.",l1:"Tahap 1 · 3 tong",l2:"Tahap 2 · 6 tong",
  good:["Bagus!","Betul!","Hebat!","Syabas!"],bad:"Belum tepat, cuba tong lain!",was:"Tong yang betul:",now:(n,i,k)=>`Barang ${i} daripada ${k}: ${n}.`,keys:"Papan kekunci: tekan 1–3 (atau 1–6) untuk memilih tong.",
  endT:"Pusingan tamat!",endS:(s,n)=>`Anda mengasingkan ${s} daripada ${n} barang dengan betul pada cubaan pertama.`,again:"Main lagi",next:"Cuba Tahap 2",map:"Semua permainan",best:"Terbaik",stars:"bintang",goal:"Asingkan 9 atau lebih dengan betul pada cubaan pertama untuk lencana Bintang Pengasing!",lvl:"Tahap",score:"Skor"}
};
const BINS={
 blue:{i:"📄",en:["Blue bin","Paper"],bm:["Tong biru","Kertas"]},
 orange:{i:"🥫",en:["Orange bin","Plastic & metal"],bm:["Tong oren","Plastik & logam"]},
 brown:{i:"🫙",en:["Brown bin","Glass"],bm:["Tong coklat","Kaca"]},
 green:{i:"🌱",en:["Compost","Food & garden waste"],bm:["Kompos","Sisa makanan & taman"]},
 grey:{i:"🗑️",en:["General waste","Cannot be recycled"],bm:["Sisa am","Tidak boleh dikitar semula"]},
 red:{i:"⚠️",en:["Hazardous","Special drop-off"],bm:["Berbahaya","Pusat kutipan khas"]}
};
// [emoji, bin, level, en name, bm name, en fact, bm fact]
const ITEMS=[
 ["📰","blue",1,"Old newspaper","Surat khabar lama","Paper can be recycled 5–7 times before the fibres get too short.","Kertas boleh dikitar semula 5–7 kali sebelum seratnya terlalu pendek."],
 ["📦","blue",1,"Cardboard box","Kotak kadbod","Flatten boxes first so they take less space in the bin.","Leperkan kotak dahulu supaya tidak memenuhi ruang tong."],
 ["📓","blue",1,"Used exercise book","Buku latihan terpakai","Remove plastic covers. The paper inside is recyclable.","Tanggalkan sampul plastik. Kertas di dalamnya boleh dikitar semula."],
 ["✉️","blue",1,"Envelope","Sampul surat","Envelopes go with paper, even the ones with windows.","Sampul surat dimasukkan bersama kertas, termasuk sampul bertingkap."],
 ["🧴","orange",1,"Shampoo bottle (rinsed)","Botol syampu (dibilas)","Rinse plastic bottles so they don't make other recyclables dirty.","Bilas botol plastik supaya tidak mengotorkan bahan kitar semula lain."],
 ["🥫","orange",1,"Food tin can","Tin makanan","Metal cans can be recycled again and again without losing quality.","Tin logam boleh dikitar semula berulang kali tanpa hilang kualiti."],
 ["🛍️","orange",1,"Clean plastic bag","Beg plastik bersih","Better still: bring your own reusable bag!","Lebih baik lagi: bawa beg guna semula sendiri!"],
 ["🪣","orange",1,"Broken plastic pail","Baldi plastik pecah","Hard plastics can be shredded and made into new products.","Plastik keras boleh dicincang dan dijadikan produk baharu."],
 ["🫙","brown",1,"Glass jam jar","Balang kaca jem","Glass can be recycled endlessly. Remove the lid first.","Kaca boleh dikitar semula tanpa had. Tanggalkan penutupnya dahulu."],
 ["🍶","brown",1,"Glass sauce bottle","Botol kicap kaca","Rinse it. Glass bottles become new bottles.","Bilas dahulu. Botol kaca dijadikan botol baharu."],
 ["🍌","green",2,"Banana peel","Kulit pisang","Food is the biggest part of Malaysian household waste (30.6%). Compost it!","Makanan ialah bahagian terbesar sisa domestik Malaysia (30.6%). Komposkan!"],
 ["🥚","green",2,"Eggshells","Kulit telur","Crushed eggshells add calcium to compost.","Kulit telur yang dihancurkan menambah kalsium dalam kompos."],
 ["☕","green",2,"Used coffee grounds","Hampas kopi","Waste-to-wealth: dried coffee grounds make an odour neutraliser (Lab 5).","Sisa kepada kekayaan: hampas kopi kering jadi penyerap bau (Makmal 5)."],
 ["🍂","green",2,"Dry leaves","Daun kering","Dry leaves are 'browns'. Compost needs browns and greens.","Daun kering ialah bahan 'perang'. Kompos perlukan bahan perang dan hijau."],
 ["🍊","green",2,"Fruit peels","Kulit buah","Waste-to-wealth: fruit peels + sugar + water = eco-enzyme (Lab 7).","Sisa kepada kekayaan: kulit buah + gula + air = eko-enzim (Makmal 7)."],
 ["😷","grey",2,"Used face mask","Pelitup muka terpakai","Masks are mixed materials and unhygienic, so they cannot be recycled.","Pelitup muka diperbuat daripada bahan campuran dan tidak bersih, jadi tidak boleh dikitar semula."],
 ["🧻","grey",2,"Used tissue","Tisu terpakai","Dirty tissue paper fibres are too short and soiled to recycle.","Tisu kotor mempunyai serat terlalu pendek dan tercemar untuk dikitar semula."],
 ["🪞","grey",2,"Broken mirror","Cermin pecah","Tricky! Mirror glass has a coating, so it is NOT put with bottles and jars. Wrap it safely.","Hati-hati, ini mengelirukan! Kaca cermin bersalut, jadi TIDAK dicampur dengan botol dan balang. Balut dengan selamat."],
 ["🥡","grey",2,"Oily food container","Bekas makanan berminyak","Food-soiled containers spoil recycling. Clean ones are better!","Bekas yang tercemar sisa makanan merosakkan kitar semula. Bekas bersih lebih baik!"],
 ["🔋","red",2,"Old battery","Bateri lama","Batteries contain heavy metals. Take them to an e-waste collection point.","Bateri mengandungi logam berat. Hantar ke pusat kutipan e-sisa."],
 ["📱","red",2,"Old phone","Telefon lama","E-waste contains valuable metals, and toxic ones too. Use an e-waste drop-off.","E-sisa mengandungi logam berharga dan juga toksik. Hantar ke pusat e-sisa."],
 ["💊","red",2,"Expired medicine","Ubat tamat tempoh","Return expired medicine to a pharmacy or clinic. Never flush it.","Pulangkan ubat tamat tempoh ke farmasi atau klinik. Jangan buang ke tandas."],
 ["💡","red",2,"Fluorescent lamp","Lampu kalimantang","Fluorescent lamps contain mercury. Handle with care!","Lampu kalimantang mengandungi merkuri. Kendalikan dengan berhati-hati!"]
];
const ROUND=10, LV_BINS={1:["blue","orange","brown"],2:["blue","orange","brown","green","grey","red"]};
let lvl=1, deck=[], idx=0, score=0, tries=0, firstTry=0, busy=false, done=false, nextT=null, focusEnd=false;
// move on after the "correct" pause; also run straight away if the page is left or re-rendered mid-pause
function advance(){
  clearTimeout(nextT);nextT=null;tries=0;idx++;busy=false;
  if(idx>=deck.length){done=true;focusEnd=true;WQ.best("sort"+lvl,score);if(firstTry>=9)WQ.award("sort");else if(firstTry>=8)WQ.confetti();}
}

WQ.css("sort",`
.sg-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:4px 0 12px}
.sg-lv{display:flex;gap:8px;flex-wrap:wrap}.sg-lv button{background:#f9e6cf;color:#1a1932;border:3px solid #1a1932;padding:6px 14px;min-height:40px;font-family:var(--pix,inherit);font-weight:700;box-shadow:3px 3px 0 rgba(26,25,50,.3)}
.sg-lv button:hover{background:#ffeb57}.sg-lv button[aria-pressed=true]{background:#5ac54f;color:#1a1932}
.sg-stage{min-height:210px;display:grid;place-items:center}
.sg-item{touch-action:none;user-select:none;-webkit-user-select:none;background:#fff;border-radius:28px;box-shadow:var(--shadow);padding:16px 22px;text-align:center;cursor:grab;width:min(260px,80vw);position:relative;z-index:5}
.sg-item .em{font-size:5rem;line-height:1.1}.sg-item .nm{font-family:"Baloo 2",Nunito,system-ui,sans-serif;font-weight:800;font-size:1.35rem}
.sg-item.drag{cursor:grabbing;box-shadow:0 18px 40px rgba(29,53,87,.3);transition:none}.sg-item.snap{transition:transform .25s}
.sg-hint{color:var(--muted);text-align:center;margin:8px 0 14px;font-weight:600}
.sg-bins{display:grid;gap:12px;grid-template-columns:repeat(var(--n,3),minmax(0,1fr))}
.sg-bin{border-radius:18px 18px 26px 26px;color:#fff;padding:14px 8px 16px;text-align:center;min-height:130px;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;box-shadow:inset 0 -10px 0 rgba(0,0,0,.15),var(--shadow);position:relative;transition:transform .12s}
.sg-bin:before{content:"";position:absolute;top:-10px;left:6%;right:6%;height:16px;border-radius:10px;background:inherit;filter:brightness(.85)}
.sg-bin .bi{font-size:1.8rem}.sg-bin .bl{font-family:"Baloo 2",Nunito,system-ui,sans-serif;font-weight:800;font-size:1.05rem;line-height:1.1;overflow-wrap:anywhere}.sg-bin .bs{font-size:.78rem;line-height:1.15;font-weight:700}
.sg-bin .k{position:absolute;top:8px;left:10px;min-width:1.5em;padding:0 4px;background:#fffaf2;color:#1a1932;border:2px solid #1a1932;font:700 .8rem/1.3 var(--pix,inherit)}
.sg-bin.hover{transform:scale(1.07)}.sg-bin:focus-visible{z-index:2}
.b-blue{background:var(--blue)}.b-orange{background:var(--orange);color:#1a1932}.b-brown{background:var(--brown)}.b-green{background:#1e6f50}.b-grey{background:var(--grey)}.b-red{background:#b4202a}
.sg-toast{min-height:56px;margin:4px auto 0;max-width:640px;background:#fff;border-radius:16px;padding:12px 16px;box-shadow:var(--shadow);display:flex;gap:10px;align-items:flex-start;font-weight:600;opacity:0;transition:opacity .2s}
.sg-toast.on{opacity:1}.sg-toast .ti{font-size:1.6rem;line-height:1}
.sg-toast.good{border-left:8px solid var(--grass)}.sg-toast.bad{border-left:8px solid var(--red)}
.sg-end{text-align:center;max-width:520px;margin:0 auto}.sg-end h2:focus{outline:none;box-shadow:none}.sg-stars{font-size:3rem;letter-spacing:6px}
.sg-vh{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (max-width:700px){.sg-bins{gap:8px;grid-template-columns:repeat(min(var(--n,3),3),minmax(0,1fr))}.sg-bin{min-height:112px;padding:30px 4px 14px}.sg-bin .bs{display:none}.sg-bin .bl{font-size:.98rem}.sg-item{padding:10px 18px}.sg-item .em{font-size:3.4rem}.sg-stage{min-height:170px}.sg-toast{padding:8px 12px;font-size:.95rem}}
@media (pointer:coarse){.sg-bin .k{display:none}.sg-bin{padding-top:14px}}
`);

WQ.registerGame("sort",{order:1,kind:"game",icon:"🗑️",ages:"7+",
  title:{en:"Sort It Out!",bm:"Asingkan Sampah!"},
  desc:{en:"Drag each item into the right Malaysian recycling bin.",bm:"Seret setiap barang ke dalam tong kitar semula yang betul."},
  badge:{icon:"🗑️",name:{en:"Sorting Star",bm:"Bintang Pengasing"},desc:{en:"3 stars in Sort It Out",bm:"3 bintang dalam Asingkan Sampah"}},
  mount(el,{relang}){
    const L=()=>T[WQ.lang], $=s=>el.querySelector(s);
    el.innerHTML=WQ.head("🗑️",this.title,this.desc)+`
      <div class="sg-bar"><div class="sg-lv" role="group" aria-label="${L().lvl}"><button data-lvl="1"></button><button data-lvl="2"></button></div>
      <span class="spacer"></span><span class="pill"><span aria-hidden="true">⭐</span><span class="sg-vh">${L().score}:</span> <span id="sgScore">0</span></span><span class="pill"><span aria-hidden="true">📦</span> <span id="sgProg"></span></span></div>
      <div id="sgPlay"><div class="sg-stage"><div class="sg-item" id="sgItem"><div class="em" id="sgEm" aria-hidden="true"></div><div class="nm" id="sgNm"></div></div></div>
      <p class="sg-vh" id="sgNow" role="status"></p>
      <div class="sg-toast" id="sgToast" role="status" aria-live="polite"><span class="ti" id="sgTi" aria-hidden="true"></span><span id="sgTt"></span></div>
      <p class="sg-hint">${L().hint}<span class="sg-vh"> ${L().keys}</span></p><div class="sg-bins" id="sgBins"></div></div>
      <div id="sgEnd" hidden></div>`;
    el.querySelectorAll("[data-lvl]").forEach(b=>{b.textContent=L()["l"+b.dataset.lvl];b.onclick=()=>{lvl=+b.dataset.lvl;start();};});
    function start(){
      clearTimeout(nextT);nextT=null;
      const pool=ITEMS.filter(it=>LV_BINS[lvl].includes(it[1])&&(lvl===2||it[2]===1));
      const mix=WQ.shuffle(pool), firsts=LV_BINS[lvl].map(b=>mix.find(it=>it[1]===b));
      deck=WQ.shuffle(firsts.concat(mix.filter(it=>!firsts.includes(it))).slice(0,ROUND));
      idx=0;score=0;firstTry=0;tries=0;busy=false;done=false;focusEnd=false;render();
    }
    function render(){
      el.querySelectorAll("[data-lvl]").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.lvl===lvl));
      $("#sgPlay").hidden=done;$("#sgEnd").hidden=!done;
      $("#sgScore").textContent=score;$("#sgProg").textContent=`${Math.min(idx+1,deck.length)}/${deck.length}`;
      if(done) return showEnd();
      const ids=LV_BINS[lvl], box=$("#sgBins"); box.style.setProperty("--n",ids.length);
      box.innerHTML=ids.map((id,n)=>{const b=BINS[id][WQ.lang];return `<button class="sg-bin b-${id}" data-bin="${id}"><span class="k">${n+1}</span><span class="bi" aria-hidden="true">${BINS[id].i}</span><span class="bl">${b[0]}</span><span class="bs">${b[1]}</span></button>`}).join("");
      box.querySelectorAll(".sg-bin").forEach(b=>b.onclick=()=>drop(b.dataset.bin));
      const it=deck[idx], nm=WQ.lang==="en"?it[3]:it[4];$("#sgEm").textContent=it[0];$("#sgNm").textContent=nm;
      $("#sgToast").className="sg-toast";$("#sgTi").textContent="";$("#sgTt").textContent="";
      $("#sgNow").textContent=L().now(nm,idx+1,deck.length);
    }
    function drop(bin){
      if(busy||done) return; const it=deck[idx], binEl=$(`.sg-bin[data-bin="${bin}"]`), t=$("#sgToast"), fact=WQ.lang==="en"?it[5]:it[6];
      if(!binEl) return;
      if(bin===it[1]){
        busy=true;WQ.beep(true);WQ.anim(binEl,"pop");
        if(tries===0){score+=10;firstTry++;}else score+=5;
        const g=L().good;t.className="sg-toast on good";$("#sgTi").textContent="✅";$("#sgTt").textContent=g[Math.floor(Math.random()*g.length)]+" "+fact;
        $("#sgScore").textContent=score;
        nextT=setTimeout(()=>{advance();render();},1600);
      }else{
        tries++;WQ.beep(false);WQ.anim($("#sgItem"),"shake");t.className="sg-toast on bad";$("#sgTi").textContent="🤔";
        $("#sgTt").textContent=tries>=2?`${L().was} ${BINS[it[1]][WQ.lang][0]} (${BINS[it[1]][WQ.lang][1]}). ${fact}`:L().bad;
      }
    }
    function showEnd(){
      const n=deck.length, stars=firstTry>=9?3:firstTry>=7?2:1, l=L();
      $("#sgEnd").innerHTML=`<div class="card sg-end"><h2 tabindex="-1" id="sgEndH">${l.endT}</h2><div class="sg-stars" role="img" aria-label="${stars}/3 ${l.stars}">${"⭐".repeat(stars)}${"☆".repeat(3-stars)}</div>
        <p>${l.endS(firstTry,n)}</p><p><b>⭐ ${score}</b> · ${l.best}: ${WQ.best("sort"+lvl)}</p>${firstTry<9?`<p class="note warn">${l.goal}</p>`:""}
        <div class="row" style="justify-content:center"><button class="btn" id="sgA">${l.again}</button>${lvl===1?`<button class="btn blue" id="sgN">${l.next}</button>`:""}<a class="btn alt" href="#/games">${l.map}</a></div></div>`;
      $("#sgA").onclick=start; if($("#sgN")) $("#sgN").onclick=()=>{lvl=2;start();};
      if(focusEnd){focusEnd=false;$("#sgEndH").focus({preventScroll:true});}
    }
    // drag with pointer events (mouse + touch); tapping a bin also works; number keys pick a bin
    const item=$("#sgItem"); let sx,sy,on=false,over=null;
    const binAt=(x,y)=>{item.style.visibility="hidden";const b=document.elementFromPoint(x,y);item.style.visibility="";return b&&b.closest(".sg-bin");};
    item.addEventListener("pointerdown",e=>{if(busy||done||e.button>0)return;on=true;sx=e.clientX;sy=e.clientY;try{item.setPointerCapture(e.pointerId);}catch(er){}item.classList.add("drag");item.classList.remove("snap");});
    item.addEventListener("pointermove",e=>{if(!on)return;item.style.transform=`translate(${e.clientX-sx}px,${e.clientY-sy}px) rotate(${(e.clientX-sx)/20}deg)`;
      const b=binAt(e.clientX,e.clientY);if(b!==over){over&&over.classList.remove("hover");over=b;over&&over.classList.add("hover");}});
    const end=e=>{if(!on)return;on=false;item.classList.remove("drag");item.classList.add("snap");item.style.transform="";
      if(over){over.classList.remove("hover");if(e.type==="pointerup")drop(over.dataset.bin);over=null;}};
    item.addEventListener("pointerup",end);item.addEventListener("pointercancel",end);
    const key=e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.repeat||(e.target.closest&&e.target.closest("input,textarea,select")))return;
      const n=+e.key, ids=LV_BINS[lvl]; if(n>=1&&n<=ids.length&&!done){e.preventDefault();drop(ids[n-1]);}};
    document.addEventListener("keydown",key);
    if(nextT) advance();
    if(relang&&deck.length) render(); else start();
    return ()=>{document.removeEventListener("keydown",key);if(nextT)advance();};
  }});
})();
