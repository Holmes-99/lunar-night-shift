# Lunar Night Shift

Team SHEclipse, NASA Space Apps Challenge 2026: **Build a Junior Astronaut Mission Trainer**

You command a small Moon base at the lunar south pole. You have 14 days of sunlight to get ready, then 14 days of darkness to keep your crew alive. Balance life support, radiation shielding, power and food to survive the lunar night.

Live game: _add the Netlify link here_

## Current status

The prototype has a bilingual title screen and a 28-day mission counter. Resource management and solar storm effects are in development.

## Run it locally

You need [Node.js](https://nodejs.org) (LTS) and Git.

```bash
git clone https://github.com/Holmes-99/lunar-night-shift.git
cd lunar-night-shift
npm install
npm run dev
```

Open the localhost link it prints. The page reloads every time you save a file.

Note: localhost only works on your own computer. To share, push to `main` and use the Netlify link.

## Who edits what

| File | Owner |
|---|---|
| `index.html`, `style.css`, `src/ui.js` | UI dev |
| `src/main.js`, `src/sim.js`, `src/events.js` | Lead dev |
| `public/data/balance.json`, `public/data/donki-events.json` | Science and data lead |
| `public/data/text-en.json`, `public/data/text-ar.json`, `public/audio/` | Story and sound |
| `public/art/` | Artist |

## Team rules

1. `main` must always work. Run `npm run dev` and check before you push.
2. Always `git pull` before you start and before you push.
3. Small commits with clear messages.
4. Two people never edit the same file at the same time (use VS Code Live Share if you need to).
5. All visible text goes in `text-en.json` and `text-ar.json`, never hard-coded in JS.

## Deploy (Netlify)

Netlify is connected to this repo. Every push to `main` builds with `npm run build` and publishes `dist/`.

## NASA data and resources

- NASA DONKI space weather database (real solar flares, CMEs, SEP events)
- NASA LRO Diviner lunar temperature data
- NASA ISS ECLSS figures (oxygen per crew member per day)
- NASA Fission Surface Power project (40 kW reactor target)

## References

_List every external resource here: sounds, music, fonts, libraries, images._

## AI disclosure

_Describe where and how AI tools were used (code help, planning, text)._
