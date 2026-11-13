// Entry point: loads data files, sets the language, wires the title screen.
// Owner: lead dev

import { createSim } from "./sim.js";
import { loadEvents } from "./events.js";
import { initUI, showScreen } from "./ui.js";

let lang = "en";
let text = {};

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return res.json();
}

async function setLanguage(newLang) {
  lang = newLang;
  text = await loadJSON(`/data/text-${lang}.json`);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-text]").forEach((el) => {
    const key = el.dataset.text;
    if (text[key]) el.textContent = text[key];
  });
}

async function start() {
  const balance = await loadJSON("/data/balance.json");
  const events = await loadEvents();
  await setLanguage("en");

  document.getElementById("btn-lang").addEventListener("click", () => {
    setLanguage(lang === "en" ? "ar" : "en");
  });

  document.getElementById("btn-start").addEventListener("click", () => {
    const sim = createSim(balance, events);
    initUI(sim, () => text);
    showScreen("screen-game");
  });
}

start();
