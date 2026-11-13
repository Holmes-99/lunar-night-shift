// Level 1 game logic: 5 days at the Atacama test base.
// Pure state, no DOM. The UI reads state and calls the functions below.

import { CREW_SIZE, REAL } from "./data.js";

export const DAYS = 5;
export const BASE_POWER = 100;
export const SYSTEMS = ["water", "plants", "protect", "science"];

const WATER_NEED = CREW_SIZE * REAL.waterLPerDay; // 7.5 L per day for the crew
const RECYCLER_FULL = 30; // power units for full recycling
const PLANTS_MIN = 15;
const SCIENCE_GOAL = 150;

// Event cards. "need" = protection units needed today.
export const EVENTS = {
  calm: { icon: "☀️", choices: ["ok"], fact: "factCalm" },
  dust: { icon: "🌬️", choices: ["dustA", "dustB"], fact: "factDust" },
  uv: { icon: "🔆", choices: ["ok"], need: 20, reason: "reasonUV", fact: "factUV" },
  cold: { icon: "🥶", choices: ["ok"], need: 20, reason: "reasonCold", fact: "factCold" },
  drill: { icon: "🦠", choices: ["drillA", "drillB"], fact: "factDrill" },
  leak: { icon: "💦", choices: ["leakA", "leakB"], fact: "factLeak" },
  truck: { icon: "🚚", choices: ["truckA", "truckB"], fact: "factTruck" }
};

function shuffle(arr, rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createLevel1(rnd = Math.random) {
  // Day 1 is always calm (tutorial). Days 2-5 draw 4 different events, so every run is different.
  const pool = shuffle(["dust", "uv", "cold", "drill", "leak", "truck"], rnd).slice(0, 4);
  const state = {
    day: 1,
    events: ["calm", ...pool],
    water: 20, // liters in the tank
    food: DAYS * CREW_SIZE, // food packs (1 pack = 1 astronaut-day)
    plantsGrowth: 0, // % of the way to a lettuce harvest
    plantsHealth: 100,
    crew: 80, // wellbeing 0-100
    science: 0,
    waterEverDry: false,
    unprotectedDays: 0,
    blackBox: [],
    today: null,
    failed: false
  };

  function eventId() {
    return state.events[state.day - 1];
  }

  // Called after the player picks a choice on the event card.
  function startDay(choice) {
    const ev = eventId();
    const t = { event: ev, choice, power: BASE_POWER, need: EVENTS[ev].need || 0, scienceMult: 1, waterDelta: 0, plantBonus: 0, scienceBonus: 0 };
    if (choice === "dustA") t.scienceMult = 0.5;
    if (choice === "dustB") t.power = 65;
    if (choice === "drillA") { t.scienceBonus = 25; t.waterDelta = -5; }
    if (choice === "drillB") t.scienceBonus = 5;
    if (choice === "leakA") t.scienceMult = 0.5;
    if (choice === "leakB") t.waterDelta = -6;
    if (choice === "truckA") t.waterDelta = 15;
    if (choice === "truckB") t.plantBonus = 20;
    state.today = t;
    return t;
  }

  // What would happen with this split. Used for the live preview and the real result.
  function preview(alloc) {
    const t = state.today;
    const recovery = REAL.issWaterRecovery * Math.min(1, alloc.water / RECYCLER_FULL);
    const waterLoss = WATER_NEED * (1 - recovery);
    const waterChange = t.waterDelta - waterLoss;
    const plantsOk = alloc.plants >= PLANTS_MIN;
    const protectOk = alloc.protect >= t.need;
    const scienceGain = Math.round(alloc.science * t.scienceMult) + t.scienceBonus;
    const used = SYSTEMS.reduce((s, k) => s + alloc[k], 0);
    return { recovery, waterChange, plantsOk, protectOk, need: t.need, scienceGain, wasted: t.power - used };
  }

  function endDay(alloc) {
    const t = state.today;
    const p = preview(alloc);
    const out = [];
    let crewDelta = 0;

    state.water = Math.round((state.water + p.waterChange) * 10) / 10;
    if (state.water <= 0) {
      state.water = 0;
      state.waterEverDry = true;
      crewDelta -= 20;
      out.push({ good: false, key: "outWaterDry", icon: "💧" });
    } else {
      out.push({ good: p.recovery > 0.6, key: "outWaterOk", icon: "💧", vars: { pct: Math.round(p.recovery * 100), n: state.water } });
    }

    if (p.plantsOk) {
      state.plantsGrowth = Math.min(100, state.plantsGrowth + 3 + (alloc.plants - PLANTS_MIN) * 0.1 + t.plantBonus);
      state.plantsHealth = Math.min(100, state.plantsHealth + 10);
      crewDelta += 4;
      out.push({ good: true, key: "outPlantsGrow", icon: "🌱", vars: { n: Math.round(state.plantsGrowth) } });
    } else {
      state.plantsHealth = Math.max(0, state.plantsHealth - 30);
      state.plantsGrowth = Math.min(100, state.plantsGrowth + t.plantBonus);
      crewDelta -= 5;
      out.push({ good: false, key: "outPlantsWilt", icon: "🥀" });
    }

    if (t.need > 0) {
      if (p.protectOk) {
        out.push({ good: true, key: "outProtectOk", icon: "🛡️" });
      } else {
        crewDelta -= 15;
        state.unprotectedDays += 1;
        out.push({ good: false, key: "outProtectBad", icon: "🛡️", vars: { reasonKey: EVENTS[t.event].reason } });
      }
    } else if (alloc.protect > 0) {
      out.push({ good: false, key: "outProtectExtra", icon: "🛡️", vars: { n: alloc.protect } });
    }

    if (p.scienceGain > 0) {
      state.science += p.scienceGain;
      out.push({ good: true, key: "outScience", icon: "🔬", vars: { n: p.scienceGain } });
    }

    if (p.wasted > 0) out.push({ good: false, key: "outWasted", icon: "⚡", vars: { n: p.wasted } });

    state.food = Math.max(0, state.food - CREW_SIZE);
    if (crewDelta >= 0) crewDelta += 3;
    state.crew = Math.max(0, Math.min(100, state.crew + crewDelta));
    if (crewDelta > 0) out.push({ good: true, key: "outCrewHappy", icon: "😊" });

    state.blackBox.push({ day: state.day, event: t.event, choice: t.choice, alloc: { ...alloc }, power: t.power, out, crew: state.crew, water: state.water });

    if (state.crew <= 0) state.failed = true;
    return out;
  }

  function nextDay() {
    state.day += 1;
    state.today = null;
  }

  function isLastDay() {
    return state.day >= DAYS;
  }

  function stars() {
    if (state.failed) return 0;
    let s = 1;
    if (state.crew >= 60 && !state.waterEverDry && state.unprotectedDays === 0) s = 2;
    if (s === 2 && state.science >= SCIENCE_GOAL && state.plantsHealth > 0) s = 3;
    return s;
  }

  // A short, scripted "smart buddy" tip based on the current situation.
  function tip(alloc) {
    const p = preview(alloc);
    if (state.water + p.waterChange < 5) return "tipWaterLow";
    if (state.today.need > alloc.protect) return "tipProtect";
    if (!p.plantsOk) return "tipPlants";
    if (p.wasted > 0) return "tipWasted";
    if (alloc.science === 0) return "tipScience";
    return "tipBalanced";
  }

  return { state, eventId, startDay, preview, endDay, nextDay, isLastDay, stars, tip, SCIENCE_GOAL, PLANTS_MIN, RECYCLER_FULL };
}
