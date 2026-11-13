// Level 1 flow: title -> name -> invitation -> flight -> base intro -> 5 days -> quiz -> results.

import { t, setLang, getLang } from "./i18n.js";
import { sfx, setMuted, isMuted } from "./audio.js";
import { createScene } from "./scene.js";
import { createLevel1, DAYS, SYSTEMS, EVENTS } from "./level1.js";
import { AMIRA, OMAR, TARDI, ENVELOPE, GLOBE } from "./art.js";
import { SOURCES } from "./data.js";

const ui = document.getElementById("ui");
const hud = document.getElementById("hud");
const modal = document.getElementById("modal");
const tardi = document.getElementById("tardi");
const tardiBubble = document.getElementById("tardi-bubble");
const app = document.getElementById("app");

let scene = null;
let game = null;
let alloc = null;
let playerName = "";
let currentScreen = null;

function save(k, v) {
  try { localStorage.setItem(k, v); } catch (e) {}
}
function load(k) {
  try { return localStorage.getItem(k); } catch (e) { return null; }
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const arrow = () => (getLang() === "ar" ? "⬅" : "➜");

function show(html, cls = "") {
  ui.innerHTML = `<div class="screen ${cls}">${html}</div>`;
  return ui.firstElementChild;
}

function on(sel, fn, root = ui) {
  const el = root.querySelector(sel);
  if (el) el.addEventListener("click", (e) => { sfx.click(); fn(e); });
  return el;
}

function say(key, vars) {
  tardiBubble.textContent = t(key, vars);
  tardi.classList.remove("hidden");
  tardiBubble.classList.remove("pop");
  void tardiBubble.offsetWidth;
  tardiBubble.classList.add("pop");
}

function confetti(n = 60) {
  const box = document.getElementById("confetti");
  const colors = ["#ffd23f", "#ff7a2f", "#2fb5a3", "#2fa8ff", "#ff6b9a", "#ffffff"];
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.style.left = Math.random() * 100 + "%";
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * 0.6 + "s";
    p.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(p);
    setTimeout(() => p.remove(), 4000);
  }
}

// Top bar: language, sound, sources
function refreshTopbar() {
  document.getElementById("btn-lang").textContent = t("lang");
  document.getElementById("btn-sound").textContent = isMuted() ? "🔇" : "🔊";
  document.getElementById("btn-sources").title = t("sources");
}
document.getElementById("btn-lang").onclick = () => {
  sfx.click();
  setLang(getLang() === "en" ? "ar" : "en");
  save("lang", getLang());
  refreshTopbar();
  if (currentScreen) currentScreen();
  if (game) renderHud();
};
document.getElementById("btn-sound").onclick = () => {
  setMuted(!isMuted());
  refreshTopbar();
  sfx.click();
};
document.getElementById("btn-sources").onclick = () => { sfx.click(); openSources(); };

function openSources() {
  modal.innerHTML = `
    <div class="card modal-card">
      <h2>📚 ${t("sourcesTitle")}</h2>
      <ul class="sources">${SOURCES.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>
      <p class="muted">${t("sourcesNote")}</p>
      <p class="muted small">${t("disclaimer")}</p>
      <button class="btn" id="m-close">${t("close")}</button>
    </div>`;
  modal.classList.remove("hidden");
  modal.querySelector("#m-close").onclick = () => { sfx.click(); modal.classList.add("hidden"); };
}

// ---------- Screens ----------

function titleScreen() {
  currentScreen = titleScreen;
  app.classList.add("space-bg");
  show(`
    <div class="title-wrap">
      <div class="rocket">🚀</div>
      <h1 class="game-title">${t("gameTitle")}</h1>
      <p class="level-title">${t("levelTitle")}</p>
      <button class="btn big glow" id="go">${t("start")}</button>
      <p class="muted small">${t("team")}</p>
      <p class="muted tiny">${t("disclaimer")}</p>
    </div>`, "center");
  on("#go", nameScreen);
}

function nameScreen() {
  currentScreen = nameScreen;
  show(`
    <div class="card pop-in narrow">
      <div class="big-emoji">👩‍🚀🧑‍🚀</div>
      <h2>${t("nameAsk")}</h2>
      <input id="name" maxlength="16" placeholder="${t("namePh")}" value="${esc(playerName || load("name") || "")}" autocomplete="off" />
      <button class="btn big" id="go">${t("openLetter")}</button>
    </div>`, "center");
  const input = ui.querySelector("#name");
  input.focus();
  const go = () => {
    playerName = input.value.trim() || (getLang() === "ar" ? "رائد الفضاء" : "Astronaut");
    save("name", playerName);
    letterScreen();
  };
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") { sfx.click(); go(); } });
  on("#go", go);
}

function letterScreen() {
  currentScreen = letterScreen;
  const el = show(`
    <div class="letter-stage">
      ${ENVELOPE}
      <div class="letter card">
        <div class="letter-head">✦ ${t("letterTitle")} ✦</div>
        <p class="letter-body">${esc(t("letterBody", { name: playerName })).replaceAll("\n", "<br>")}</p>
        <p class="letter-sign">${t("letterSign")}</p>
        <button class="btn big glow" id="go">${t("accept")}</button>
      </div>
    </div>`, "center");
  setTimeout(() => { el.classList.add("opened"); sfx.open(); }, 500);
  setTimeout(() => el.classList.add("reading"), 1600);
  on("#go", () => { confetti(80); sfx.win(); setTimeout(travelScreen, 700); });
}

function travelScreen() {
  currentScreen = travelScreen;
  const el = show(`
    <div class="card pop-in travel">
      <h2>✈️ ${t("travelTitle")}</h2>
      ${GLOBE}
      <div class="fact-box"><b>🔍 ${t("realFact")}</b><p>${t("travelFact")}</p></div>
      <button class="btn big" id="go" disabled>${t("continue")}</button>
    </div>`, "center");
  sfx.whoosh();
  const path = el.querySelector(".flight-path");
  const plane = el.querySelector(".plane");
  const len = path.getTotalLength();
  const start = performance.now();
  const btn = el.querySelector("#go");
  function step(now) {
    const k = Math.min(1, (now - start) / 3200);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const p = path.getPointAtLength(len * e);
    plane.setAttribute("x", p.x - 13);
    plane.setAttribute("y", p.y + 9);
    path.style.strokeDashoffset = String(-now / 30);
    if (k < 1 && document.body.contains(plane)) requestAnimationFrame(step);
    else { btn.disabled = false; btn.classList.add("glow"); el.querySelector(".pin-to").classList.add("ping"); }
  }
  requestAnimationFrame(step);
  on("#go", arriveAtBase);
}

function arriveAtBase() {
  app.classList.remove("space-bg");
  game = createLevel1();
  if (!scene) scene = createScene(document.getElementById("scene"));
  syncScene();
  hud.classList.remove("hidden");
  renderHud();
  document.getElementById("tardi-body").innerHTML = TARDI;
  introScreen(0);
}

const INTRO = [
  { key: "amira1", hl: null, face: "amira" },
  { key: "amira2", hl: "all", face: "amira" },
  { key: "amira3", hl: "power", face: "amira" },
  { key: "amira4", hl: "water", face: "amira" },
  { key: "amira5", hl: "plants", face: "amira" },
  { key: "amira6", hl: "crew", face: "amira" },
  { key: "amira7", hl: "air", face: "amira" },
  { key: "amira8", hl: null, face: "omar" }
];

function introScreen(i) {
  currentScreen = () => introScreen(i);
  const step = INTRO[i];
  highlight(step.hl);
  show(`
    <div class="dialog slide-up">
      <div class="dialog-face">${step.face === "omar" ? OMAR : AMIRA}</div>
      <div class="dialog-text">
        <div class="dialog-name">${step.face === "omar" ? "Omar · عمر" : "Amira · أميرة"}</div>
        <p class="typewriter">${t(step.key, { name: esc(playerName) })}</p>
        <div class="dialog-actions">
          <span class="dots">${INTRO.map((_, j) => `<i class="${j === i ? "on" : ""}"></i>`).join("")}</span>
          <button class="btn ghost small" id="skip">${t("skip")}</button>
          <button class="btn" id="go">${t("next")} ${arrow()}</button>
        </div>
      </div>
    </div>`, "bottom");
  if (i === INTRO.length - 1) say("tardiHi");
  on("#go", () => (i + 1 < INTRO.length ? introScreen(i + 1) : (highlight(null), eventScreen())));
  on("#skip", () => { highlight(null); say("tardiHi"); eventScreen(); });
}

function highlight(key) {
  hud.querySelectorAll(".meter").forEach((m) => m.classList.toggle("pulse", key === "all" || m.dataset.key === key));
}

// ---------- HUD ----------

function renderHud() {
  const s = game.state;
  const power = s.today ? s.today.power : 100;
  const plantColor = s.plantsHealth > 60 ? "#4caf50" : s.plantsHealth > 0 ? "#e0a030" : "#9b6b3f";
  const items = [
    { key: "power", icon: "⚡", label: t("power"), val: power, max: 100, text: String(power), color: "#ffd23f" },
    { key: "water", icon: "💧", label: t("water"), val: s.water, max: 35, text: t("liters", { n: s.water }), color: "#3aa0ff", warn: s.water < 6 },
    { key: "air", icon: "🫧", label: t("air"), val: 100, max: 100, text: t("free"), color: "#9be7ff", free: true },
    { key: "food", icon: "🥫", label: t("food"), val: s.food, max: 15, text: t("packs", { n: s.food }), color: "#ff9f5a" },
    { key: "plants", icon: "🌱", label: t("plants"), val: s.plantsGrowth, max: 100, text: Math.round(s.plantsGrowth) + "%", color: plantColor },
    { key: "crew", icon: "😊", label: t("crew"), val: s.crew, max: 100, text: s.crew + "%", color: s.crew > 50 ? "#2fb5a3" : "#ff6b6b", warn: s.crew < 40 },
    { key: "science", icon: "🔬", label: t("science"), val: s.science, max: game.SCIENCE_GOAL, text: `${s.science}/${game.SCIENCE_GOAL}`, color: "#b98cff" }
  ];
  hud.innerHTML = `
    <div class="hud-day">${t("dayOf", { d: Math.min(s.day, DAYS), n: DAYS })}</div>
    ${items.map((m) => `
      <div class="meter ${m.free ? "free" : ""} ${m.warn ? "warn" : ""}" data-key="${m.key}">
        <span class="m-icon">${m.icon}</span>
        <div class="m-body">
          <div class="m-top"><span>${m.label}</span><b>${m.text}</b></div>
          <div class="m-bar"><i style="width:${Math.max(0, Math.min(100, (m.val / m.max) * 100))}%;background:${m.color}"></i></div>
        </div>
      </div>`).join("")}`;
}

function syncScene() {
  const s = game.state;
  scene.setWater(Math.min(1, s.water / 35));
  scene.setPlants(s.plantsGrowth / 100, s.plantsHealth / 100);
}

// ---------- Day loop ----------

function eventScreen() {
  currentScreen = eventScreen;
  const id = game.eventId();
  const ev = EVENTS[id];
  scene.setTime(0.32);
  scene.setDust(id === "dust");
  scene.setPanelsDirty(id === "dust" ? 0.7 : 0);
  if (id !== "calm") sfx.alert();
  show(`
    <div class="card event-card pop-in">
      <div class="event-day">${t("dayOf", { d: game.state.day, n: DAYS })}</div>
      <div class="event-icon">${ev.icon}</div>
      <h2>${t("ev" + id + "T")}</h2>
      <p>${t("ev" + id + "X")}</p>
      <div class="choices">
        ${ev.choices.map((c) => `<button class="btn choice" data-c="${c}">${t(c)}</button>`).join("")}
      </div>
      <div class="fact-box small"><b>🔍 ${t("realFact")}</b><p>${t(ev.fact)}</p></div>
    </div>`, "center");
  ui.querySelectorAll(".choice").forEach((b) => b.addEventListener("click", () => {
    sfx.click();
    game.startDay(b.dataset.c);
    if (b.dataset.c === "dustA") { scene.setPanelsDirty(0); scene.setDust(false); }
    allocScreen();
  }));
}

// Start with an even split so kids have to think about what each system really needs.
function defaultAlloc(power) {
  const each = Math.floor(power / 4 / 5) * 5;
  return { water: each, plants: each, protect: each, science: each };
}

function allocScreen() {
  currentScreen = allocScreen;
  renderHud();
  const power = game.state.today.power;
  alloc = alloc && game.state.day > 1 ? clampAlloc({ ...alloc }, power) : defaultAlloc(power);
  show(`
    <div class="panel alloc slide-up">
      <div class="alloc-head">
        <h3>⚡ ${t("allocTitle")}</h3>
        <div class="power-left" id="left"></div>
      </div>
      <div class="power-bar" id="pbar">${SYSTEMS.map((k) => `<i class="seg seg-${k}"></i>`).join("")}</div>
      ${SYSTEMS.map((k) => `
        <div class="row" data-k="${k}">
          <label>${t("sys_" + k)}</label>
          <button class="step" data-d="-5">−</button>
          <input type="range" min="0" max="${power}" step="5" value="${alloc[k]}" />
          <button class="step" data-d="5">+</button>
          <b class="val"></b>
          <span class="pv"></span>
        </div>`).join("")}
      <button class="btn big glow" id="run">${t("runDay")}</button>
    </div>`, "bottom");
  ui.querySelectorAll(".row").forEach((row) => {
    const k = row.dataset.k;
    const input = row.querySelector("input");
    input.addEventListener("input", () => { setAlloc(k, +input.value); sfx.slide(); });
    row.querySelectorAll(".step").forEach((b) => b.addEventListener("click", () => { setAlloc(k, alloc[k] + +b.dataset.d); sfx.slide(); }));
  });
  on("#run", runDay);
  updateAlloc();
}

function clampAlloc(a, power) {
  let total = SYSTEMS.reduce((s, k) => s + a[k], 0);
  for (const k of ["science", "protect", "plants", "water"]) {
    if (total <= power) break;
    const cut = Math.min(a[k], total - power);
    a[k] -= cut;
    total -= cut;
  }
  return a;
}

function setAlloc(k, v) {
  const power = game.state.today.power;
  const others = SYSTEMS.reduce((s, j) => s + (j === k ? 0 : alloc[j]), 0);
  alloc[k] = Math.max(0, Math.min(v, power - others));
  updateAlloc();
}

function updateAlloc() {
  const power = game.state.today.power;
  const p = game.preview(alloc);
  const used = SYSTEMS.reduce((s, k) => s + alloc[k], 0);
  ui.querySelector("#left").innerHTML = `<b class="${power - used > 0 ? "has" : ""}">${t("powerLeft", { n: power - used })}</b>`;
  ui.querySelectorAll(".seg").forEach((seg, i) => { seg.style.width = (alloc[SYSTEMS[i]] / 100) * 100 + "%"; });
  ui.querySelectorAll(".row").forEach((row) => {
    const k = row.dataset.k;
    row.querySelector("input").value = alloc[k];
    row.querySelector(".val").textContent = alloc[k];
    const pv = row.querySelector(".pv");
    let txt = "";
    let ok = true;
    if (k === "water") {
      const n = Math.round(p.waterChange * 10) / 10;
      txt = t("pvWater", { pct: Math.round(p.recovery * 100), sign: n >= 0 ? "+" : "", n });
      ok = game.state.water + p.waterChange > 3;
    }
    if (k === "plants") { txt = p.plantsOk ? t("pvPlantsOk") : t("pvPlantsBad"); ok = p.plantsOk; }
    if (k === "protect") { txt = p.need ? t("pvProtectNeed", { n: p.need }) : t("pvProtectNone"); ok = p.protectOk; }
    if (k === "science") { txt = t("pvScience", { n: p.scienceGain }); ok = true; }
    pv.textContent = txt;
    pv.className = "pv " + (ok ? "ok" : "bad");
    row.classList.toggle("bad", !ok);
  });
  say(game.tip(alloc));
}

function runDay() {
  currentScreen = null;
  const before = { ...game.state };
  const out = game.endDay({ ...alloc });
  const s = game.state;
  show(`<div class="running"><div class="sun-spin">☀️</div><p>${t("dayRunning", { d: s.day })}</p></div>`, "top");
  tardi.classList.add("hidden");
  scene.setDrilling(alloc.science > 0);
  scene.playDay(6.5, () => {
    scene.setDrilling(false);
    scene.setDust(false);
    syncScene();
    renderHud();
    reportScreen(out, before);
  });
  // update the base halfway through the day so kids see it change
  setTimeout(() => { syncScene(); renderHud(); }, 3200);
}

function reportScreen(out) {
  currentScreen = () => reportScreen(out);
  const s = game.state;
  const goodCount = out.filter((o) => o.good).length;
  goodCount >= out.length - 1 ? sfx.good() : sfx.bad();
  if (goodCount === out.length) scene.celebrate();
  const last = game.isLastDay() || s.failed;
  show(`
    <div class="card report pop-in">
      <h2>🌙 ${t("reportTitle", { d: s.day })}</h2>
      <ul class="outcomes">
        ${out.map((o, i) => `<li class="${o.good ? "good" : "bad"}" style="animation-delay:${i * 0.15}s"><span>${o.icon}</span>${t(o.key, { ...(o.vars || {}), reason: o.vars && o.vars.reasonKey ? t(o.vars.reasonKey) : "" })}</li>`).join("")}
      </ul>
      <button class="btn big" id="go">${last ? t("finishMission") : t("nextDay")} ${arrow()}</button>
    </div>`, "center");
  on("#go", () => {
    if (s.failed) return resultScreen();
    if (game.isLastDay()) return quizScreen(0, 0);
    game.nextDay();
    renderHud();
    eventScreen();
  });
}

// ---------- Quiz ----------

const QUIZ = [
  { q: "q1", a: ["q1a", "q1b", "q1c"], e: "q1e" },
  { q: "q2", a: ["q2a", "q2b", "q2c"], e: "q2e" },
  { q: "q3", a: ["q3a", "q3b", "q3c"], e: "q3e" }
];

function quizScreen(i, score) {
  currentScreen = () => quizScreen(i, score);
  const item = QUIZ[i];
  const order = [0, 1, 2].sort(() => Math.random() - 0.5);
  show(`
    <div class="card quiz pop-in">
      <div class="event-day">🎓 ${t("quizTitle")} · ${i + 1}/3</div>
      ${i === 0 ? `<p class="muted">${t("quizIntro")}</p>` : ""}
      <h2>${t(item.q)}</h2>
      <div class="choices">${order.map((j) => `<button class="btn choice" data-j="${j}">${t(item.a[j])}</button>`).join("")}</div>
      <div class="fact-box small hidden" id="exp"></div>
      <button class="btn big hidden" id="go">${t("next")} ${arrow()}</button>
    </div>`, "center");
  let answered = false;
  ui.querySelectorAll(".choice").forEach((b) => b.addEventListener("click", () => {
    if (answered) return;
    answered = true;
    const right = b.dataset.j === "0";
    right ? sfx.good() : sfx.bad();
    ui.querySelectorAll(".choice").forEach((x) => x.classList.add(x.dataset.j === "0" ? "right" : "dim"));
    if (!right) b.classList.add("wrong");
    const exp = ui.querySelector("#exp");
    exp.innerHTML = `<p>${right ? "" : t("wrong")}${t(item.e)}</p>`;
    exp.classList.remove("hidden");
    ui.querySelector("#go").classList.remove("hidden");
    if (right) confetti(25);
    score += right ? 1 : 0;
  }));
  on("#go", () => (i + 1 < QUIZ.length ? quizScreen(i + 1, score) : resultScreen()));
}

// ---------- Results + Black Box ----------

function resultScreen() {
  currentScreen = resultScreen;
  const s = game.state;
  const stars = game.stars();
  save("level1Stars", String(Math.max(stars, +(load("level1Stars") || 0))));
  tardi.classList.add("hidden");
  hud.classList.add("hidden");
  const reasons = [t("star1"), t("star2"), t("star3", { g: game.SCIENCE_GOAL })];
  show(`
    <div class="card results pop-in">
      <h1>${s.failed ? "🛑 " + t("resultFail") : "🎉 " + t("resultTitle")}</h1>
      ${s.failed ? `<p>${t("resultFailX")}</p>` : ""}
      <div class="stars">${[0, 1, 2].map((i) => `<span class="star ${i < stars ? "lit" : ""}" style="animation-delay:${0.3 + i * 0.35}s">★</span>`).join("")}</div>
      <ul class="star-reasons">${reasons.map((r, i) => `<li class="${i < stars ? "got" : ""}">${i < stars ? "✅" : "⬜"} ${r}</li>`).join("")}</ul>
      <div class="stats">
        <div><b>${s.crew}%</b><span>${t("statCrew")}</span></div>
        <div><b>${s.science}</b><span>${t("statScience")}</span></div>
        <div><b>${t("liters", { n: s.water })}</b><span>${t("statWater")}</span></div>
        <div><b>${Math.round(s.plantsGrowth)}%</b><span>${t("statPlants")}</span></div>
      </div>
      <p class="muted small">${t("plantsNote")}</p>
      <h3>🗃️ ${t("blackBox")}</h3>
      <div class="blackbox">
        ${s.blackBox.map((d) => `
          <div class="bb-day">
            <div class="bb-head"><b>${t("bbDay", { d: d.day })}</b> ${EVENTS[d.event].icon} ${t("ev" + d.event + "T")}</div>
            <div class="bb-choice">${d.choice !== "ok" ? "👉 " + t(d.choice) : ""}</div>
            <div class="bb-split">⚡${d.power} → ${t("bbSplit", { w: d.alloc.water, p: d.alloc.plants, s: d.alloc.protect, c: d.alloc.science })}</div>
            <ul>${d.out.filter((o) => !o.good).map((o) => `<li>${o.icon} ${t(o.key, { ...(o.vars || {}), reason: o.vars && o.vars.reasonKey ? t(o.vars.reasonKey) : "" })}</li>`).join("") || "<li>✅</li>"}</ul>
          </div>`).join("")}
      </div>
      <div class="teaser">
        <div class="teaser-sky"></div>
        <div><h3>${t("teaserT")}</h3><p>${t("teaserX")}</p><span class="locked">${t("locked")}</span></div>
      </div>
      <button class="btn big" id="again">${t("playAgain")}</button>
    </div>`, "center scroll");
  if (stars > 0) {
    sfx.win();
    confetti(120);
    scene.celebrate();
    for (let i = 0; i < stars; i++) setTimeout(() => sfx.star(), 500 + i * 350);
  }
  on("#again", () => {
    game = createLevel1();
    alloc = null;
    hud.classList.remove("hidden");
    syncScene();
    renderHud();
    eventScreen();
  });
}

// ---------- Boot ----------

setLang(load("lang") === "ar" ? "ar" : "en");
refreshTopbar();
titleScreen();
