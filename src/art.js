// Hand-drawn SVG characters (original designs).

export const AMIRA = `
<svg viewBox="0 0 120 120" class="avatar-svg" aria-hidden="true">
  <circle cx="60" cy="60" r="58" fill="#ffe3c2"/>
  <path d="M22 120c4-26 18-38 38-38s34 12 38 38z" fill="#ffffff"/>
  <path d="M48 84l12 14 12-14" fill="#2fb5a3"/>
  <path d="M30 62c0-22 13-38 30-38s30 16 30 38c0 10-4 20-10 26H40c-6-6-10-16-10-26z" fill="#2fb5a3"/>
  <ellipse cx="60" cy="58" rx="20" ry="22" fill="#c98b5e"/>
  <circle cx="52" cy="56" r="3" fill="#2b1d14"/>
  <circle cx="68" cy="56" r="3" fill="#2b1d14"/>
  <circle cx="53" cy="55" r="1" fill="#fff"/>
  <circle cx="69" cy="55" r="1" fill="#fff"/>
  <path d="M52 67q8 7 16 0" stroke="#7a3b23" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="47" cy="64" r="3" fill="#ff8f8f" opacity=".5"/>
  <circle cx="73" cy="64" r="3" fill="#ff8f8f" opacity=".5"/>
  <path d="M84 96c6-6 10-4 12 0-4 2-8 4-12 0z" fill="#4caf50"/>
</svg>`;

export const OMAR = `
<svg viewBox="0 0 120 120" class="avatar-svg" aria-hidden="true">
  <circle cx="60" cy="60" r="58" fill="#cfe8ff"/>
  <path d="M22 120c4-26 18-38 38-38s34 12 38 38z" fill="#ff7a2f"/>
  <ellipse cx="60" cy="56" rx="21" ry="23" fill="#d8a07a"/>
  <path d="M39 50c0-16 10-24 21-24s21 8 21 24c-6-8-14-10-21-10s-15 2-21 10z" fill="#2b1d14"/>
  <circle cx="52" cy="56" r="3" fill="#2b1d14"/>
  <circle cx="68" cy="56" r="3" fill="#2b1d14"/>
  <path d="M52 67q8 6 16 0" stroke="#7a3b23" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <rect x="44" y="84" width="32" height="8" rx="3" fill="#ffd23f"/>
</svg>`;

export const TARDI = `
<svg viewBox="0 0 140 110" class="tardi-svg" aria-hidden="true">
  <g class="tardi-legs" fill="#c7b9e8">
    <ellipse cx="34" cy="86" rx="9" ry="12"/>
    <ellipse cx="56" cy="92" rx="9" ry="12"/>
    <ellipse cx="82" cy="92" rx="9" ry="12"/>
    <ellipse cx="104" cy="86" rx="9" ry="12"/>
  </g>
  <ellipse cx="70" cy="60" rx="52" ry="36" fill="#e3d9ff"/>
  <path d="M30 52q40-20 80 0" stroke="#c7b9e8" stroke-width="4" fill="none"/>
  <path d="M26 66q44-16 88 0" stroke="#c7b9e8" stroke-width="4" fill="none"/>
  <ellipse cx="34" cy="58" rx="20" ry="18" fill="#efe8ff"/>
  <circle cx="28" cy="54" r="5" fill="#2b1d3f"/>
  <circle cx="44" cy="54" r="5" fill="#2b1d3f"/>
  <circle cx="29.5" cy="52.5" r="1.6" fill="#fff"/>
  <circle cx="45.5" cy="52.5" r="1.6" fill="#fff"/>
  <ellipse cx="36" cy="66" rx="5" ry="4" fill="#ff8fb1"/>
  <circle cx="20" cy="64" r="4" fill="#ffb3c7" opacity=".7"/>
  <circle cx="52" cy="64" r="4" fill="#ffb3c7" opacity=".7"/>
</svg>`;

export const ENVELOPE = `
<div class="envelope">
  <div class="env-back"></div>
  <div class="env-letter"></div>
  <div class="env-front"></div>
  <div class="env-flap"></div>
  <div class="env-seal">★</div>
</div>`;

// Simple globe with a flight arc for the travel scene.
export const GLOBE = `
<svg viewBox="0 0 400 300" class="globe-svg" aria-hidden="true">
  <defs>
    <radialGradient id="ocean" cx="40%" cy="35%">
      <stop offset="0" stop-color="#6ec6ff"/>
      <stop offset="1" stop-color="#1c5fb8"/>
    </radialGradient>
  </defs>
  <circle cx="200" cy="150" r="130" fill="url(#ocean)"/>
  <path d="M96 92c22-18 52-20 66-6 10 10-4 26 8 36s30 6 34 22-12 30-28 34-24 30-40 32-26-18-36-34-24-30-20-50 4-24 16-34z" fill="#7ed37b"/>
  <path d="M230 70c26-12 62-6 80 14s10 38-6 46-34-2-44 10-6 36-24 42-30-16-30-36 4-30 10-44 2-24 14-32z" fill="#7ed37b"/>
  <path d="M150 200c10-4 22 2 24 14s-6 34-14 46-16 6-18-10-4-44 8-50z" fill="#d9a066"/>
  <circle class="pin-from" cx="262" cy="118" r="6" fill="#ff4d6d"/>
  <circle class="pin-to" cx="158" cy="222" r="7" fill="#ffd23f"/>
  <path class="flight-path" d="M262 118 Q 250 30 158 222" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 7"/>
  <text class="plane" font-size="26">✈️</text>
</svg>`;
