# Junior Astronaut Mission Trainer

Team SHEclipse, NASA Space Apps Challenge 2026: **Build a Junior Astronaut Mission Trainer**

A browser game for kids aged 7 to 12. A young engineer gets an invitation to train for space, starts at a test base in Earth's Atacama Desert, then loses Earth's protections level by level on the way to a Moon or Mars base.

| Level | Theme | Status |
|---|---|---|
| 1 | Earth, the Safe Home (Atacama analog base) | Playable |
| 2 | Losing Earth's Protection | Planned |
| 3 | Entering Space | Planned |
| 4 | Building a Space Base | Planned |
| 5 | Survival Challenge | Planned |

Live game: _add the Netlify link here_

## Level 1 in short

- Invitation letter, flight to Chile, and a 3D low-poly Atacama base with a day and night cycle
- 5 turn-based days: each day an event card (dust, extreme sun, cold night, leak, drill find, supply truck), then the player splits 100 power units between water recycling, greenhouse, protection and science
- Live preview of what each split will do, plus tips from Tardi the tardigrade
- Air is shown as FREE to set up Level 2 (losing Earth's protection)
- End of mission: 3-question quiz, 1 to 3 stars, and a Black Box timeline of every decision
- English and Arabic (right to left), sound effects, and an in-game Data & sources screen

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

| File | What it does | Owner |
|---|---|---|
| `src/main.js` | Screens and game flow | UI dev |
| `style.css`, `index.html` | Look and layout | UI dev |
| `src/level1.js` | Level 1 rules: days, events, scoring | Lead dev |
| `src/scene.js` | 3D Atacama base (Three.js) | Lead dev |
| `src/data.js` | Real NASA numbers and source links | Science and data lead |
| `public/data/donki-events.json` | Real solar events for later levels | Science and data lead |
| `src/i18n.js` | All English and Arabic text | Story and sound |
| `src/audio.js` | Sound effects | Story and sound |
| `src/art.js` | Characters (Amira, Omar, Tardi) | Artist |

## Team rules

1. `main` must always work. Run `npm run dev` and check before you push.
2. Always `git pull` before you start and before you push.
3. Small commits with clear messages.
4. Two people never edit the same file at the same time (use VS Code Live Share if you need to).
5. All visible text goes in `src/i18n.js` (both languages), never hard-coded in other files.

## Deploy (Netlify)

Netlify is connected to this repo. Every push to `main` builds with `npm run build` and publishes `dist/`.

## NASA data and resources

Level 1 uses (full links in `src/data.js` and the in-game Data & sources screen):

- NASA ARADS project: Mars drill tests in the Atacama Desert (2017)
- NASA Life Support Baseline Values and Assumptions Document (2022): 0.84 kg oxygen and 2.5 L water per astronaut per day
- ISS water recycling (98%) and Veggie lettuce growth (33 days)
- NASA Space Radiation Analysis Group: Earth's atmosphere and magnetic field as a shield
- NASA InSight dust on solar panels, LRO Moon temperatures (fun facts)

Later levels: NASA DONKI space weather database (real solar flares and particle events).

## References

- [Three.js](https://threejs.org) (MIT license) for the 3D scene
- All 3D models, characters and sounds are made in code by the team (no outside assets yet)

_Add every new external resource here: sounds, music, fonts, libraries, images._

## AI disclosure

_Describe where and how AI tools were used (code help, planning, text)._
