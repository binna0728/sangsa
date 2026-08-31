/* 『상사(相思): 청평사의 뱀』 — 게임 엔진
   비주얼노벨 + 컷신 + 오방굿 리듬 전투 */
(() => {
"use strict";
const $ = s => document.querySelector(s);
const wait = ms => new Promise(r => setTimeout(r, ms));
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const IMG = "assets/img/", VID = "assets/video/", AUD = "assets/audio/";

/* 터치 기기 여부 (레인 버튼 크기·안내문 분기) — fit()보다 먼저 선언 */
const IS_TOUCH = matchMedia("(pointer:coarse)").matches || "ontouchstart" in window;

/* ───────── stage scaling ───────── */
const stage = $("#stage");
function fit(){
  const vw = (visualViewport && visualViewport.width) || innerWidth, vh = (visualViewport && visualViewport.height) || innerHeight;
  const s = Math.min(vw/1600, vh/900);
  stage.style.transform = `scale(${s})`;
  // 세로로 든 휴대폰: 가로 회전 안내
  document.body.classList.toggle("portrait", IS_TOUCH && vh > vw);
}
addEventListener("resize", fit); if(window.visualViewport) visualViewport.addEventListener("resize", fit); addEventListener("orientationchange", ()=>setTimeout(fit,300)); fit();
/* 모바일: 시작 버튼에서 전체화면 + 가로 고정 시도 (실패해도 무시) */
async function goFullscreen(){
  if(!IS_TOUCH) return;
  try{ const el=document.documentElement; if(el.requestFullscreen) await el.requestFullscreen({navigationUI:"hide"}); }catch(e){}
  try{ if(screen.orientation && screen.orientation.lock) await screen.orientation.lock("landscape"); }catch(e){}
  setTimeout(fit,400);
}

/* ───────── save ───────── */
const SAVE_KEY = "sangsa_save_v1";
let save = { chapter: 0, cleared: [], endings: [], techs: [], diff: "normal" };
try { const s = localStorage.getItem(SAVE_KEY); if (s) save = Object.assign(save, JSON.parse(s)); } catch(e){}
function persist(){ try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch(e){} }

/* ───────── settings ───────── */
const settings = { auto:false, voice:true };
/* ───────── 난이도 ─────────  (save.diff 에 저장) */
const DIFF = {
  easy:   { label:"쉬움",   window:200, perfect:95, density:0.75, dbl:0.0, extra:0.5, won:0.45, heroDmg:0.6, enDmg:1.3,  clear:55 },
  normal: { label:"보통",   window:160, perfect:70, density:1.0,  dbl:1.0, extra:1.0, won:0.75, heroDmg:1.0, enDmg:1.0,  clear:40 },
  hard:   { label:"어려움", window:125, perfect:55, density:1.15, dbl:1.6, extra:1.5, won:0.95, heroDmg:1.45,enDmg:0.85, clear:30 }
};
const diff = () => DIFF[save.diff] || DIFF.normal;

/* ───────── audio ───────── */
const Audio_ = {
  bgm:null, bgmName:null, vol:{bgm:.55, sfx:.9, voice:1},
  sfx:{}, voiceEl:null, unlocked:false,
  play(name, {loop=true, fade=900}={}) {
    if (this.bgmName === name) return;
    const old = this.bgm;
    if (old) this.fadeOut(old, fade);
    if (!name) { this.bgm=null; this.bgmName=null; return; }
    const a = new Audio(AUD+"bgm/"+name+".m4a"); a.loop=loop; a.volume=0;
    a.play().catch(()=>{});
    this.bgm=a; this.bgmName=name;
    const t0=performance.now();
    const step=()=>{ const k=clamp((performance.now()-t0)/fade,0,1); a.volume=this.vol.bgm*k; if(k<1&&this.bgm===a) requestAnimationFrame(step); };
    step();
  },
  fadeOut(a, ms){ const v0=a.volume, t0=performance.now();
    const step=()=>{ const k=clamp((performance.now()-t0)/ms,0,1); a.volume=v0*(1-k); if(k<1) requestAnimationFrame(step); else {a.pause(); a.src="";} }; step(); },
  duck(on){ if(this.bgm) this.bgm.volume = this.vol.bgm*(on?.35:1); },
  sfx_(name, vol=1){ const a=new Audio(AUD+"sfx/"+name+".mp3"); a.volume=this.vol.sfx*vol; a.play().catch(()=>{}); return a; },
  voice(id){ this.stopVoice(); if(!settings.voice||!id) return null;
    const a=new Audio(AUD+"voice/"+id+".mp3"); a.volume=0; this.voiceEl=a; a.play().catch(()=>{});
    // 짧은 페이드인 — 앞머리가 툭 튀지 않게
    const t0=performance.now(), V=this.vol.voice;
    const fin=()=>{ const k=clamp((performance.now()-t0)/70,0,1); if(this.voiceEl!==a) return; a.volume=V*k; if(k<1) requestAnimationFrame(fin); };
    fin(); return a; },
  // 대사를 넘길 때 소리를 뚝 끊지 않고 짧게 페이드아웃 (말 중간 잘림 방지)
  stopVoice(){ const a=this.voiceEl; if(!a) return; this.voiceEl=null;
    const v0=a.volume, t0=performance.now();
    const step=()=>{ const k=clamp((performance.now()-t0)/130,0,1); a.volume=v0*(1-k);
      if(k<1) requestAnimationFrame(step); else { a.pause(); a.src=""; } }; step(); }
};

/* ───────── helpers ───────── */
const bg = { cur:"A" };
function setBg(name, {kb=true, filter=""}={}){
  const A=$("#bgA"), B=$("#bgB");
  const next = bg.cur==="A"?B:A, prev = bg.cur==="A"?A:B;
  next.style.backgroundImage = name?`url(${IMG}${name}.jpg)`:"none";
  next.style.filter = filter;
  next.classList.toggle("kb", kb);
  next.style.opacity=1; prev.style.opacity=0;
  bg.cur = bg.cur==="A"?"B":"A";
}
function flash(ms=160, color="#fff"){ const f=$("#flash"); f.style.background=color; f.style.transition="none"; f.style.opacity=.95; requestAnimationFrame(()=>{ f.style.transition=`opacity ${ms}ms ease`; f.style.opacity=0; }); }
let shakeT=0;
function shake(ms=380, amp=14){ const t0=performance.now();
  const step=()=>{ const k=(performance.now()-t0)/ms; if(k>=1){ stage.style.marginLeft="0"; stage.style.marginTop="0"; return; }
    const a=amp*(1-k); stage.style.marginLeft=(Math.random()*2-1)*a+"px"; stage.style.marginTop=(Math.random()*2-1)*a+"px"; requestAnimationFrame(step); }; step(); }
async function fadeTo(black, ms=800){ const f=$("#fade"); f.style.transition=`opacity ${ms}ms ease`; f.style.opacity=black?1:0; await wait(ms); }
function show(id, on=true){ $(id).classList.toggle("hidden", !on); }
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.style.opacity=1; clearTimeout(t._t); t._t=setTimeout(()=>t.style.opacity=0, 2200); }

/* one-shot "advance" promise: click / key / auto */
let advanceResolve=null, advancePending=false;
function waitAdvance(){ if(advancePending){ advancePending=false; return Promise.resolve(); } return new Promise(r=>advanceResolve=r); }
function advance(){ if(advanceResolve){ const r=advanceResolve; advanceResolve=null; r(); } else advancePending=true; }
stage.addEventListener("pointerdown", e=>{ if(e.target.closest("button,.lk,.ch")) return; if(!$("#dlg").classList.contains("hidden")) advance(); });
addEventListener("keydown", e=>{ if(e.code==="Space"||e.code==="Enter"){ if(!$("#dlg").classList.contains("hidden")){ e.preventDefault(); advance(); } } });

/* ───────── preload ───────── */
function collectImages(){
  const set=new Set(["key_title","blur_title","por_seola","por_mu","por_mansin","por_mul","por_dok","por_wongwi","en_snake","en_mul","en_dok","en_wongwi"]);
  STORY.techniques.forEach(t=>set.add(t.img));
  const walk=sc=>{ (sc||[]).forEach(s=>{ if(s.bg) set.add(s.bg); if(s.type==="image") set.add(s.src); if(s.keyframe) set.add(s.keyframe); }); };
  STORY.chapters.forEach(c=>walk(c.scenes)); Object.values(STORY.endings).forEach(e=>walk(e.scenes));
  return [...set];
}
function preload(list, onProg){
  let done=0; return Promise.all(list.map(n=>new Promise(res=>{ const im=new Image(); const ext=n.startsWith("por_")||n.startsWith("en_")?".png":".jpg";
    im.onload=im.onerror=()=>{ done++; onProg(done/list.length); res(); }; im.src=IMG+n+ext; })));
}

/* ───────── dialog ───────── */
const LEFT = new Set(["seola"]);
function portraitFor(who){ const c=STORY.cast[who]; return c&&c.portrait?c.portrait:null; }
let typing=null;
async function runDialog(scene){
  show("#dlg"); show("#battle",false); show("#choice",false);
  if(scene.bg) setBg(scene.bg,{filter:scene.filter==="sepia"?"sepia(.7) contrast(.9) brightness(.85)":""});
  const L=$("#porL"), R=$("#porR");
  let lastL=null,lastR=null;
  for(const line of scene.lines){
    const who=line.who, cast=STORY.cast[who]||STORY.cast.nar;
    const por=portraitFor(who);
    // portraits
    if(por){
      if(LEFT.has(who)){ if(lastL!==por){ L.src=IMG+por+".png"; lastL=por; } L.classList.add("show"); L.classList.remove("dim"); R.classList.add("dim"); }
      else { if(lastR!==por){ R.src=IMG+por+".png"; lastR=por; } R.classList.add("show"); R.classList.remove("dim"); L.classList.add("dim"); }
    } else { L.classList.add("dim"); R.classList.add("dim"); }
    L.classList.toggle("pain", who==="seola"&&line.pose==="pain");
    // name
    const nm=$("#name"); if(cast.name){ nm.textContent=cast.name; nm.style.color=cast.color; nm.classList.remove("hide"); } else nm.classList.add("hide");
    const tx=$("#text"); tx.className = who==="nar"?"nar":who==="sys"?"sys":"";
    if(line.fx==="shake"){ shake(500,12); Audio_.sfx_("roar",.5); }
    // voice
    const v = line.voice ? Audio_.voice(line.voice) : null;
    // typewriter
    advancePending=false;
    await typeText(tx, line.text);
    $("#next").style.visibility="visible";
    if(settings.auto){
      const minWait = Math.max(1400, line.text.length*55);
      await Promise.race([waitAdvance(), (async()=>{ await wait(minWait); if(v&&!v.ended&&!v.paused){ await new Promise(r=>{v.onended=r; v.onerror=r;}); } })()]);
    } else await waitAdvance();
    if(skipping) break;
  }
  Audio_.stopVoice();
  L.classList.remove("show","pain"); R.classList.remove("show");
  L.classList.remove("dim"); R.classList.remove("dim");
}
function typeText(el, text){
  return new Promise(res=>{
    el.textContent=""; $("#next").style.visibility="hidden";
    let i=0; const speed=28; let doneFn=()=>{ el.textContent=text; typing=null; res(); };
    typing = { finish:doneFn };
    const step=()=>{ if(typing!==null && typing.finish!==doneFn) return; if(i>=text.length){ doneFn(); return; }
      el.textContent += text[i++]; setTimeout(step, /[…。.!?—]/.test(text[i-1])?speed*6:speed); };
    step();
  });
}
// clicking while typing finishes the line
const _adv=advance;
stage.addEventListener("pointerdown", e=>{ if(typing&&!e.target.closest("button,.lk,.ch")){ const f=typing.finish; typing=null; f(); } }, true);
addEventListener("keydown", e=>{ if((e.code==="Space"||e.code==="Enter")&&typing){ const f=typing.finish; typing=null; f(); } }, true);

let skipping=false;
$("#tAuto").onclick=e=>{ settings.auto=!settings.auto; e.target.classList.toggle("on",settings.auto); if(settings.auto) advance(); };
$("#tVoice").onclick=e=>{ settings.voice=!settings.voice; e.target.classList.toggle("on",settings.voice); if(!settings.voice) Audio_.stopVoice(); };
$("#tSkip").onclick=()=>{ skipping=true; if(typing){ const f=typing.finish; typing=null; f(); } setTimeout(advance,30); };

/* ───────── cutscene (video / image) ───────── */
async function runVideo(scene){
  show("#dlg",false); show("#battle",false);
  const v=$("#video"), cap=$("#caption");
  setBg(scene.bg,{kb:true});
  let done=false, resolved=false;
  await fadeTo(true,500);
  const finish=()=>{ if(resolved) return; resolved=true; };
  const p=new Promise(res=>{ finish._r=res; });
  const end=()=>{ if(done) return; done=true; finish._r(); };
  v.onended=end; v.onerror=()=>{ end(); };
  v.src=VID+scene.src+".mp4"; v.style.display="block"; v.currentTime=0;
  Audio_.duck(true);
  show("#skip"); $("#skip").onclick=end;
  const ok = await new Promise(res=>{ v.oncanplay=()=>res(true); v.onerror=()=>res(false); setTimeout(()=>res(false), 6000); });
  await fadeTo(false,500);
  if(ok){ v.play().catch(()=>end()); }
  else { v.style.display="none"; Audio_.duck(false); setTimeout(end, 5500); }
  let capT=null;
  if(scene.caption){ cap.textContent=scene.caption; capT=setTimeout(()=>{ if(!done) cap.classList.add("show"); }, 600); }
  await p;
  clearTimeout(capT); cap.classList.remove("show"); show("#skip",false);
  await fadeTo(true,400);
  v.pause(); v.style.display="none"; v.removeAttribute("src"); v.load();
  Audio_.duck(false);
  await fadeTo(false,400);
}
async function runImage(scene){
  show("#dlg",false); show("#battle",false);
  const cap=$("#caption");
  await fadeTo(true,400); setBg(scene.src,{kb:true}); await fadeTo(false,600);
  if(scene.caption){ cap.textContent=scene.caption; cap.classList.add("show"); }
  await Promise.race([wait(3600), new Promise(r=>{ const h=e=>{ stage.removeEventListener("pointerdown",h); r(); }; stage.addEventListener("pointerdown",h); })]);
  cap.classList.remove("show");
}

/* ───────── chapter card ───────── */
async function chapterCard(n, t){
  show("#dlg",false); show("#battle",false);
  await fadeTo(true,500);
  $("#chapter .n").textContent=n; $("#chapter .t").textContent=t;
  const line=$("#chapter .line"); line.style.animation="none"; void line.offsetWidth; line.style.animation="";
  show("#chapter"); await fadeTo(false,600); Audio_.sfx_("bell",.6);
  await wait(2600); await fadeTo(true,600); show("#chapter",false);
}

/* ───────── battle : 오방굿 ───────── */
const TECH = Object.fromEntries(STORY.techniques.map(t=>[t.id,t]));
const KEYMAP = {"Digit1":0,"Digit2":1,"Digit3":2,"Digit4":3,"Digit5":4,"KeyD":0,"KeyF":1,"KeyG":2,"KeyH":3,"KeyJ":4,"Numpad1":0,"Numpad2":1,"Numpad3":2,"Numpad4":3,"Numpad5":4};
function makeChart(lanes, beats, bpm, hard){
  // returns notes: {t(ms), lane, kind:'note'|'won'}
  const beat=60000/bpm, notes=[]; let t=2600;
  const nL=lanes.length, D=diff();
  let prev=-1;
  for(let b=0;b<beats;b++){
    const phase=b/beats;
    const density = (hard?0.9:0.7)*D.density;
    if(b%8===7 && b>8 && Math.random()<D.won){ notes.push({t:t, lane:-1, kind:"won"}); }
    else if(Math.random()<density||b%4===0){
      let l=Math.floor(Math.random()*nL); if(nL>1&&l===prev&&Math.random()<.6) l=(l+1)%nL; prev=l;
      notes.push({t:t, lane:l, kind:"note"});
      if(hard&&phase>.4&&Math.random()<.35*D.dbl){ notes.push({t:t+beat/2, lane:(l+1)%nL, kind:"note"}); }
      if(phase>.7&&Math.random()<(hard?.45:.25)*D.extra){ notes.push({t:t+beat/2, lane:Math.floor(Math.random()*nL), kind:"note"}); }
    }
    t+=beat;
  }
  return notes;
}
function runBattle(scene){
  return new Promise(async resolve=>{
    show("#dlg",false); show("#choice",false);
    const en=STORY.enemies[scene.enemy];
    const lanes=scene.lanes.map(id=>TECH[id]);
    const hard=!!scene.phase2;
    await fadeTo(true,400);
    setBg(scene.keyframe||scene.bg,{kb:false,filter:"brightness(.55) saturate(.9)"});
    Audio_.play(scene.bgm||"battle");
    show("#battle");
    $("#heroImg").src=IMG+"por_seola.png";
    const eimg=$("#enemyImg"); eimg.src=IMG+en.img+".png"; eimg.style.height=en.img==="en_snake"?"760px":"680px";
    $("#enName").innerHTML=en.name+" <small>한(恨)</small>";
    // lane buttons
    const lanesEl=$("#lanes"); lanesEl.innerHTML="";
    lanes.forEach((t,i)=>{ const d=document.createElement("div"); d.className="lk"; d.style.borderColor=t.color; d.style.color=t.color; d.innerHTML=`<span style="color:${t.color==="#f2f2f2"?"#fff":t.color};text-shadow:0 0 8px #000">${t.short}</span><small>${i+1}</small>`; d.dataset.lane=i; lanesEl.appendChild(d); });
    // intro
    const bs=$("#bstart"); bs.querySelector(".en").textContent=en.name; bs.querySelector(".ln").textContent="“"+en.line+"”";
    bs.querySelector(".keys").innerHTML=lanes.map((t,i)=>`<div class="kk" style="border-color:${t.color};color:${t.color}"><span style="color:#fff">${i+1}</span></div>`).join("");
    const D0=diff();
    bs.querySelector(".help").innerHTML = (scene.tutorial
      ? (IS_TOUCH
        ? "구슬이 아래 원에 닿는 순간 <b>같은 색의 원을 탭</b>하세요. (양손 엄지로!)<br>붉은 <b style='color:#ff5a4c'>원한(怨)</b> 구슬은 아무 원이나 탭해 막아냅니다. 장단 10연속마다 오방 기술이 터집니다."
        : "구슬이 아래 원에 닿는 순간 같은 색의 키(숫자 <b>1~5</b> 또는 <b>D F G H J</b>)를 누르거나 원을 클릭하세요.<br>붉은 <b style='color:#ff5a4c'>원한(怨)</b> 구슬은 아무 키나 눌러 막아냅니다. 장단 10연속마다 오방 기술이 터집니다.")
      : `사용 가능한 오방 기술: ${lanes.map(t=>`<b style="color:${t.color}">${t.name.split(" · ")[1]}</b>`).join(" · ")}${hard?"<br><span style='color:#ff8a7a'>한의 절정 — 장단이 빨라지고 겹칩니다.</span>":""}`)
      + `<br><span style="color:#9b8a66">난이도 · ${D0.label}</span>`;
    show("#bstart"); await fadeTo(false,500);
    await new Promise(r=>{ $("#bgo").onclick=r; });
    show("#bstart",false);

    /* state */
    const cv=$("#bcanvas"), cx=cv.getContext("2d");
    const notes=makeChart(lanes, scene.length, scene.bpm, hard);
    const st={ hero:100, en:100, combo:0, maxCombo:0, hits:{}, t0:performance.now()+400, ended:false, fx:[], hitAnim:{} , cutQueue:[] };
    lanes.forEach(t=>st.hits[t.id]=0);
    const APPROACH=1500, JUDGE_Y=735, SPAWN_Y=-60, LANE_GAP=IS_TOUCH?148:114, LANE_X0=800-(lanes.length-1)*LANE_GAP/2; // 터치 기기는 버튼이 커서 간격도 넓힘
    const beat=60000/scene.bpm, D=diff();
    let beatIdx=0;
    const judgeEl=$("#judge"), comboEl=$("#combo");
    function showJudge(txt,color){ judgeEl.textContent=txt; judgeEl.style.color=color; judgeEl.style.opacity=1; judgeEl.style.transform="translateX(-50%) scale(1.25)"; clearTimeout(judgeEl._t); judgeEl._t=setTimeout(()=>{judgeEl.style.opacity=0;},420); setTimeout(()=>judgeEl.style.transform="translateX(-50%) scale(1)",80); }
    function updBars(){ $("#hpHero").style.width=st.hero+"%"; $("#hpHeroT").textContent=Math.ceil(st.hero); $("#hpEn").style.width=st.en+"%"; $("#hpEnT").textContent=Math.ceil(st.en);
      comboEl.style.opacity=st.combo>=3?1:0; comboEl.querySelector(".c").textContent=st.combo; }
    function dmgEnemy(v){ st.en=clamp(st.en-v,0,100); eimg.classList.add("hit"); setTimeout(()=>eimg.classList.remove("hit"),120); }
    function dmgHero(v){ st.hero=clamp(st.hero-v,0,100); shake(300,10); flash(140,"rgba(184,34,43,.35)"); }
    async function cutin(tech, finisher){
      const c=$("#cutin"); c.style.backgroundImage=`url(${IMG}${tech.img}.jpg)`; c.querySelector(".t").innerHTML=`${tech.name.replace(" · ","<br>")}<br><small>${finisher?"— 씻김 —":"오방굿"}</small>`;
      c.style.display="block"; flash(200,"#fff"); Audio_.sfx_("slash",1); Audio_.sfx_("bell",.8);
      await wait(finisher?1600:1100); c.style.display="none"; flash(160,tech.color);
    }
    /* input */
    const pressLane=(l)=>{ if(st.ended) return; const now=performance.now()-st.t0;
      const btn=lanesEl.children[l]; if(btn){ btn.classList.add("press"); setTimeout(()=>btn.classList.remove("press"),90); }
      // find nearest un-hit note on this lane OR won note within window
      let best=null,bd=1e9;
      for(const n of notes){ if(n.hit) continue; const d=Math.abs(n.t-now); if(d>D.window) continue;
        if(n.kind==="won"||n.lane===l){ if(d<bd){bd=d;best=n;} } }
      if(!best){ // whiff
        if(now>2000){ st.combo=0; showJudge("빗나감","#8a8a8a"); } Audio_.sfx_("janggu",.25); updBars(); return; }
      best.hit=true;
      const perfect=bd<D.perfect;
      if(best.kind==="won"){ showJudge(perfect?"막아냄!":"막음","#ff8a7a"); Audio_.sfx_("bell",.9); st.combo++; st.fx.push({type:"parry",x:800,y:JUDGE_Y,t:now}); }
      else { const tech=lanes[l]; st.hits[tech.id]++; st.combo++;
        const mult=1+Math.min(st.combo,30)*0.04;
        dmgEnemy((perfect?3.2:2.1)*mult*(hard?0.8:1)*D.enDmg*(100/Math.max(60,scene.length*1.9)));
        showJudge(perfect?"딱!":"좋음", perfect?"#ffd166":"#9fd8ff"); Audio_.sfx_("slash",perfect?.7:.45); Audio_.sfx_("janggu",.5);
        st.fx.push({type:"hit",x:LANE_X0+l*LANE_GAP,y:JUDGE_Y,t:now,color:tech.color,perfect});
        st.fx.push({type:"slash",t:now,color:tech.color});
      }
      st.maxCombo=Math.max(st.maxCombo,st.combo);
      if(st.combo>0&&st.combo%10===0){ // 기술 발동
        const favId=Object.entries(st.hits).sort((a,b)=>b[1]-a[1])[0][0]; const tech=TECH[favId];
        dmgEnemy(9); st.cutQueue.push(tech);
      }
      updBars();
    };
    const onKey=e=>{ if(e.repeat) return; if(KEYMAP[e.code]!==undefined){ const l=KEYMAP[e.code]; if(l<lanes.length){ e.preventDefault(); pressLane(l);} else { pressLane(0); } }
      else if(e.code==="Space"){ e.preventDefault(); // parry only
        const now=performance.now()-st.t0; const n=notes.find(n=>!n.hit&&n.kind==="won"&&Math.abs(n.t-now)<D.window); if(n) pressLane(0); } };
    addEventListener("keydown",onKey);
    lanesEl.onpointerdown=e=>{ const d=e.target.closest(".lk"); if(d) pressLane(+d.dataset.lane); };
    cv.onpointerdown=e=>{ const r=cv.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width*1600; let l=Math.round((x-LANE_X0)/LANE_GAP); l=clamp(l,0,lanes.length-1); pressLane(l); };

    /* render loop */
    let cutBusy=false;
    const loop=async()=>{
      if(st.ended) return;
      const now=performance.now()-st.t0;
      // beat pulse
      const bi=Math.floor((now-2600)/beat); if(bi>beatIdx&&now>2600){ beatIdx=bi; if(bi%2===0) Audio_.sfx_("janggu",.12); }
      // misses
      for(const n of notes){ if(!n.hit&&!n.missed&&now-n.t>D.window){ n.missed=true; n.hit=true; st.combo=0;
        if(n.kind==="won"){ dmgHero((hard?16:12)*D.heroDmg); showJudge("원한!","#ff5a4c"); Audio_.sfx_("roar",.35); }
        else { dmgHero((hard?7:5)*D.heroDmg); showJudge("놓침","#8a8a8a"); } updBars(); } }
      // draw
      cx.clearRect(0,0,1600,900);
      // lane guides
      lanes.forEach((t,i)=>{ const x=LANE_X0+i*LANE_GAP; const g=cx.createLinearGradient(0,80,0,JUDGE_Y); g.addColorStop(0,"rgba(255,255,255,0)"); g.addColorStop(1,t.color+"55");
        cx.fillStyle=g; cx.fillRect(x-30,60,60,JUDGE_Y-60);
        cx.beginPath(); cx.arc(x,JUDGE_Y,38,0,Math.PI*2); cx.strokeStyle=t.color; cx.lineWidth=3; cx.globalAlpha=.9; cx.stroke(); cx.globalAlpha=1; });
      // judge line
      cx.fillStyle="rgba(255,255,255,.18)"; cx.fillRect(LANE_X0-70,JUDGE_Y-1,LANE_GAP*(lanes.length-1)+140,2);
      // notes
      for(const n of notes){ if(n.hit) continue; const dt=n.t-now; if(dt>APPROACH||dt<-D.window) continue;
        const y=JUDGE_Y-(dt/APPROACH)*(JUDGE_Y-SPAWN_Y);
        if(n.kind==="won"){ // 원한 : wide red, spans lanes
          const x=800; cx.save(); cx.translate(x,y); cx.rotate(now/300);
          const r=34+6*Math.sin(now/90); const g=cx.createRadialGradient(0,0,4,0,0,r); g.addColorStop(0,"#fff0f0"); g.addColorStop(.35,"#ff4a3c"); g.addColorStop(1,"rgba(120,0,0,0)");
          cx.fillStyle=g; cx.beginPath(); cx.arc(0,0,r*1.4,0,Math.PI*2); cx.fill();
          cx.strokeStyle="#ff8a7a"; cx.lineWidth=3; for(let k=0;k<4;k++){ cx.beginPath(); cx.moveTo(0,0); cx.lineTo(Math.cos(k*Math.PI/2)*r*1.5,Math.sin(k*Math.PI/2)*r*1.5); cx.stroke(); }
          cx.fillStyle="#fff"; cx.font="bold 26px serif"; cx.textAlign="center"; cx.textBaseline="middle"; cx.fillText("怨",0,1); cx.restore();
        } else { const t=lanes[n.lane], x=LANE_X0+n.lane*LANE_GAP;
          const g=cx.createRadialGradient(x-8,y-8,3,x,y,32); g.addColorStop(0,"#fff"); g.addColorStop(.3,t.color); g.addColorStop(1,t.color+"00");
          cx.fillStyle=g; cx.beginPath(); cx.arc(x,y,40,0,Math.PI*2); cx.fill();
          cx.beginPath(); cx.arc(x,y,24,0,Math.PI*2); cx.fillStyle=t.color; cx.fill(); cx.strokeStyle="#fff"; cx.lineWidth=2; cx.stroke();
          cx.fillStyle=t.color==="#f2f2f2"?"#222":"#fff"; cx.font="bold 22px serif"; cx.textAlign="center"; cx.textBaseline="middle"; cx.fillText(t.short,x,y+1); }
      }
      // fx
      st.fx=st.fx.filter(f=>now-f.t<520);
      for(const f of st.fx){ const k=(now-f.t)/520;
        if(f.type==="hit"){ cx.globalAlpha=1-k; cx.strokeStyle=f.color; cx.lineWidth=6*(1-k)+1; cx.beginPath(); cx.arc(f.x,f.y,40+k*90,0,Math.PI*2); cx.stroke();
          if(f.perfect){ cx.strokeStyle="#fff"; cx.beginPath(); cx.arc(f.x,f.y,20+k*140,0,Math.PI*2); cx.stroke(); } cx.globalAlpha=1; }
        else if(f.type==="slash"){ // ink slash across enemy
          cx.save(); cx.globalAlpha=(1-k)*.9; cx.translate(1180,470); cx.rotate(-0.6+(f.t%7)/10); cx.strokeStyle=f.color; cx.lineCap="round"; cx.lineWidth=18*(1-k)+2;
          cx.beginPath(); cx.moveTo(-260*k-120,0); cx.bezierCurveTo(-60,-40,60,40,260*k+120,0); cx.stroke(); cx.strokeStyle="#fff"; cx.lineWidth=4; cx.stroke(); cx.restore(); }
        else if(f.type==="parry"){ cx.globalAlpha=1-k; cx.strokeStyle="#ffd166"; cx.lineWidth=8; cx.beginPath(); cx.arc(f.x,f.y,60+k*300,0,Math.PI*2); cx.stroke(); cx.globalAlpha=1; }
      }
      // cutin queue
      if(st.cutQueue.length&&!cutBusy){ cutBusy=true; const t=st.cutQueue.shift(); cutin(t,false).then(()=>cutBusy=false); }
      // end conditions
      const lastT=notes[notes.length-1].t;
      if(st.en<=0){ st.ended=true; return finish(true); }
      if(st.hero<=0){ st.ended=true; return finish(false); }
      if(now>lastT+900){ st.ended=true; return finish(st.en<=D.clear); }
      requestAnimationFrame(loop);
    };
    async function finish(win){
      removeEventListener("keydown",onKey); lanesEl.onpointerdown=null; cv.onpointerdown=null;
      const m=$("#bmsg");
      if(win){
        const favId=Object.entries(st.hits).sort((a,b)=>b[1]-a[1])[0][0];
        await cutin(TECH[favId],true);
        Audio_.sfx_("purify",1); eimg.style.filter="brightness(3) blur(6px)"; eimg.style.opacity=0; eimg.style.transition="all 1.4s";
        m.textContent="— 해원 —"; m.style.opacity=1; await wait(1800);
        if(scene.learn){ const t=TECH[scene.learn]; if(!save.techs.includes(t.id)) save.techs.push(t.id); if(scene.learn==="baek"&&!save.techs.includes("heuk")) save.techs.push("heuk"); persist(); }
      } else {
        m.textContent="신기가 다했다……"; m.style.opacity=1; Audio_.sfx_("roar",.7); await wait(1800);
      }
      m.style.opacity=0; eimg.style.filter=""; eimg.style.opacity=1; eimg.style.transition="";
      await fadeTo(true,600); show("#battle",false); cx.clearRect(0,0,1600,900);
      if(win) resolve({win:true, combo:st.maxCombo});
      else { // retry
        await fadeTo(false,300); const again=await runBattle(scene); resolve(again);
      }
    }
    updBars(); requestAnimationFrame(loop);
  });
}

/* ───────── choice ───────── */
function runChoice(scene){
  return new Promise(async res=>{
    show("#dlg",false); setBg(scene.bg,{kb:true});
    const c=$("#choice"); c.innerHTML=`<div class="p">${scene.prompt}</div>`+scene.options.map(o=>`<div class="ch" data-id="${o.id}"><div class="a">${o.label}</div><div class="b">${o.sub}</div></div>`).join("");
    show("#choice"); await fadeTo(false,500);
    c.querySelectorAll(".ch").forEach(el=>el.onclick=()=>{ Audio_.sfx_("bell",.8); show("#choice",false); res(el.dataset.id); });
  });
}

/* ───────── scene runner ───────── */
async function runScenes(scenes){
  for(const sc of scenes){
    if(skipping && sc.type!=="battle" && sc.type!=="choice") continue;
    if(sc.type==="dialog"){ if(!$("#dlg").classList.contains("hidden")===false){ await fadeTo(false,300); } await runDialog(sc);
      // 전투 없이 대화로 습득하는 기술(3장 흙묶기) — 갤러리 해금용 저장
      if(sc.learn && !save.techs.includes(sc.learn)){ save.techs.push(sc.learn); persist(); } }
    else if(sc.type==="video"){ await runVideo(sc); }
    else if(sc.type==="image"){ await runImage(sc); }
    else if(sc.type==="battle"){ skipping=false; const r=await runBattle(sc); await fadeTo(false,400); }
    else if(sc.type==="choice"){ skipping=false; const id=await runChoice(sc); return id; }
  }
  return null;
}
async function playChapter(idx){
  const ch=STORY.chapters[idx]; skipping=false;
  save.chapter=idx; persist();
  await chapterCard(ch.title, ch.subtitle);
  Audio_.play(ch.bgm);
  await fadeTo(false,600);
  const result=await runScenes(ch.scenes);
  await fadeTo(true,700);
  if(!save.cleared.includes(ch.id)) save.cleared.push(ch.id); persist();
  return result;
}
async function playEnding(id){
  const e=STORY.endings[id]; skipping=false;
  await chapterCard("終", e.title); Audio_.play(e.bgm); await fadeTo(false,600);
  await runScenes(e.scenes); await fadeTo(true,800);
  if(!save.endings.includes(id)) save.endings.push(id); persist();
  await credits(id);
}
async function credits(id){
  show("#dlg",false);
  const c=$("#credits");
  c.innerHTML=`<div class="roll">
    <h1>상사 · 相思</h1><div>청평사의 뱀</div>
    <h2>결말</h2><div>${STORY.endings[id].title}${id==="ssitgim"?" — 진(眞)":""}</div>
    <h2>원작 설화</h2><div>춘천 청평사 「공주와 상사뱀」 전설<br>구성폭포 · 공주굴 · 회전문 · 영지 · 삼층석탑(공주탑)</div>
    <h2>기획 · 시나리오 · 프로그램</h2><div>코코딩랩 빛나 × Claude</div>
    <h2>캐릭터 · 배경 · 키프레임</h2><div>GPT Image 2 (Higgsfield)</div>
    <h2>컷신 애니메이션</h2><div>Seedance 2.5 (Higgsfield)</div>
    <h2>음악 · 효과음</h2><div>Sonilo Music · Mirelo (Higgsfield)</div>
    <h2>목소리</h2><div>Qwen Audio TTS (Higgsfield)<br>설아 · 무영 · 오봉 만신 · 도깨비 · 물귀신 · 사공 · 나레이션</div>
    <h2>오방(五方)</h2><div>동방청제 · 남방적제 · 중앙황제 · 서방백제 · 북방흑제</div>
    <br><br><div style="font-size:30px;color:#fff">그건 이름 없던 한 사람의, 이름이다.</div><br><br>
    <div style="font-size:18px;color:#9b8a66">${save.endings.length<2?"회전문을 다시 돌아 나오면, 다른 결말이 기다립니다.":"두 결말을 모두 보셨습니다. 고맙습니다."}</div>
  </div>`;
  show("#credits"); await fadeTo(false,800);
  await Promise.race([wait(34000), new Promise(r=>{ const h=()=>{stage.removeEventListener("pointerdown",h); r();}; setTimeout(()=>stage.addEventListener("pointerdown",h),3000); })]);
  await fadeTo(true,800); show("#credits",false);
  title();
}
async function playFrom(idx){
  await fadeTo(true,500); show("#title",false);
  for(let i=idx;i<STORY.chapters.length;i++){
    const r=await playChapter(i);
    if(r){ await playEnding(r); return; }
  }
  title();
}

/* ───────── title ───────── */
async function title(){
  show("#dlg",false); show("#battle",false); show("#choice",false); show("#credits",false);
  setBg("key_title",{kb:true});
  Audio_.play("title");
  const hasSave=save.chapter>0||save.cleared.length>0;
  $("#mCont").disabled=!hasSave; $("#mContLabel").textContent=hasSave?`${STORY.chapters[Math.min(save.chapter,4)].title} ${STORY.chapters[Math.min(save.chapter,4)].subtitle}`:"기록 없음";
  diffLabel();
  show("#title"); await fadeTo(false,900);
}
$("#mStart").onclick=()=>{ save.chapter=0; persist(); playFrom(0); };
const DIFF_ORDER=["easy","normal","hard"];
function diffLabel(){ $("#mDiffLabel").textContent=diff().label; }
$("#mDiff").onclick=()=>{ const i=DIFF_ORDER.indexOf(save.diff||"normal"); save.diff=DIFF_ORDER[(i+1)%3]; persist(); diffLabel(); Audio_.sfx_("janggu",.5); toast(`난이도 — ${diff().label} (${save.diff==="easy"?"판정 넉넉·피해 적음":save.diff==="hard"?"판정 좁음·구슬 많음":"기본"})`); };
$("#mCont").onclick=()=>{ playFrom(Math.min(save.chapter, 4)); };
$("#mChap").onclick=()=>{
  const c=$("#choice"); c.innerHTML=`<div class="p">어느 장(章)부터 들을까</div>`+STORY.chapters.map((ch,i)=>{ const ok=i===0||save.cleared.includes(STORY.chapters[i-1].id)||save.endings.length>0; return `<div class="ch" data-i="${i}" style="${ok?"":"opacity:.35;pointer-events:none"}"><div class="a">${ch.title} · ${ch.subtitle}</div><div class="b">${ok?"":"이전 장을 먼저 지나야 합니다"}</div></div>`; }).join("")+`<div class="ch" data-i="-1"><div class="a">돌아가기</div></div>`;
  show("#title",false); show("#choice");
  c.querySelectorAll(".ch").forEach(el=>el.onclick=()=>{ const i=+el.dataset.i; show("#choice",false); if(i<0) show("#title"); else playFrom(i); });
};
$("#mGallery").onclick=()=>{
  const c=$("#choice"); const got=save.techs.length?save.techs:[];
  c.innerHTML=`<div class="p">오방(五方) 기술 — 귀멸의 '호흡'에 해당하는 설아의 굿</div>`+STORY.techniques.map(t=>{ const ok=got.includes(t.id)||save.endings.length>0; return `<div class="ch" data-img="${ok?t.img:""}" style="border-color:${t.color}"><div class="a" style="color:${ok?t.color==="#f2f2f2"?"#fff":t.color:"#666"}">${ok?t.name:"？？？ · ？？？"}</div><div class="b">${ok?t.desc:"아직 받지 못한 신(神)"}</div></div>`; }).join("")+`<div class="ch" data-img="back"><div class="a">돌아가기</div></div>`;
  show("#title",false); show("#choice");
  c.querySelectorAll(".ch").forEach(el=>el.onclick=async()=>{ const im=el.dataset.img; if(im==="back"){ show("#choice",false); show("#title"); return; } if(!im) return;
    const cu=$("#cutin"); const t=STORY.techniques.find(x=>x.img===im); cu.style.backgroundImage=`url(${IMG}${im}.jpg)`; cu.querySelector(".t").innerHTML=t.name.replace(" · ","<br>")+"<br><small>오방굿</small>"; show("#battle"); $("#heroImg").src=""; $("#enemyImg").src=""; $("#bui").style.display="none"; $("#lanes").innerHTML=""; cu.style.display="block"; flash(200);
    await new Promise(r=>{ const h=()=>{stage.removeEventListener("pointerdown",h); r();}; setTimeout(()=>stage.addEventListener("pointerdown",h),300); });
    cu.style.display="none"; show("#battle",false); $("#bui").style.display=""; });
};

/* ───────── boot ───────── */
(async()=>{
  const list=collectImages();
  await preload(list, p=>{ $("#loadBar").style.width=(p*100)+"%"; $("#loadS").textContent=`불러오는 중 ${Math.round(p*100)}%`; });
  $("#loadS").textContent="준비되었습니다";
  show("#loadGo");
  await new Promise(r=>$("#loadGo").onclick=r);
  Audio_.unlocked=true; goFullscreen();
  // iOS 오디오 언락: 첫 제스처 안에서 무음 재생
  try{ const u=new Audio(AUD+"sfx/janggu.mp3"); u.volume=0.01; u.play().catch(()=>{}); }catch(e){}
  $("#load").style.transition="opacity .8s"; $("#load").style.opacity=0; setTimeout(()=>show("#load",false),800);
  title();
})();
})();
