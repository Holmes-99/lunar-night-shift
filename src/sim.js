// Simulation core: the day tick and the four systems.
// Owner: lead dev
// Rule: no DOM code in this file. It only changes the state object.

export function createSim(balance, events) {
  const state = {
    day: 1,
    totalDays: balance.mission.totalDays,
    isNight: false,
    oxygenKg: 0,
    waterKg: 0,
    foodKg: 0,
    batteryKWh: 0,
    radiationMSv: 0,
    sciencePoints: 0,
    crew: [],
    log: []
  };

  function endDay() {
    // TODO (hackathon): apply power, life support, food, radiation, events
    state.day += 1;
    state.isNight = state.day > balance.mission.dayLength;
    return state;
  }

  function isOver() {
    return state.day > state.totalDays;
  }

  return { state, endDay, isOver, balance, events };
}
