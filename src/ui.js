// All screens: HUD, day panel, storm pop-up, debrief.
// Owner: UI dev
// Rule: reads sim.state, calls sim.endDay(). Never changes state directly.

export function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

export function initUI(sim, getText) {
  const hud = document.getElementById("hud");

  function render() {
    const t = getText();
    const s = sim.state;
    hud.textContent = `${t.day || "Day"} ${s.day} / ${s.totalDays}`;
    document.getElementById("app").classList.toggle("night", s.isNight);
  }

  document.getElementById("btn-end-day").onclick = () => {
    sim.endDay();
    if (sim.isOver()) {
      showScreen("screen-debrief");
      return;
    }
    render();
  };

  render();
}
