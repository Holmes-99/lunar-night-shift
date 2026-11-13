// Tiny sound effects made with the Web Audio API (no sound files needed).

let ctx = null;
let muted = false;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = "sine", vol = 0.15) {
  if (muted) return;
  const a = ac();
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, a.currentTime + start);
  g.gain.setValueAtTime(0, a.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, a.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + start + dur);
  o.connect(g).connect(a.destination);
  o.start(a.currentTime + start);
  o.stop(a.currentTime + start + dur + 0.05);
}

function noise(dur, vol = 0.08) {
  if (muted) return;
  const a = ac();
  const buf = a.createBuffer(1, a.sampleRate * dur, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 900;
  const g = a.createGain();
  g.gain.value = vol;
  src.connect(f).connect(g).connect(a.destination);
  src.start();
}

export const sfx = {
  click() { tone(660, 0, 0.08, "triangle", 0.1); },
  slide() { tone(420, 0, 0.04, "sine", 0.04); },
  open() { tone(523, 0, 0.12, "triangle"); tone(784, 0.1, 0.18, "triangle"); },
  whoosh() { noise(0.9, 0.12); },
  alert() { tone(880, 0, 0.15, "square", 0.06); tone(660, 0.18, 0.15, "square", 0.06); },
  good() { tone(523, 0, 0.12); tone(659, 0.1, 0.12); tone(784, 0.2, 0.2); },
  bad() { tone(330, 0, 0.18, "sawtooth", 0.06); tone(247, 0.16, 0.25, "sawtooth", 0.06); },
  star() { tone(988, 0, 0.12, "triangle"); tone(1319, 0.08, 0.25, "triangle"); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, "triangle", 0.12)); }
};

export function setMuted(m) {
  muted = m;
}

export function isMuted() {
  return muted;
}
