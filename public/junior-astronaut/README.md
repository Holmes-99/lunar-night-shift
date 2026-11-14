# Level 1: Junior Astronaut (Atacama Desert + Training Center)

This folder is **Level 1** of the team game. Open `index.html` in a browser to play.

- Prologue: bedroom, invitation, flight
- Atacama Desert: fix the map, 3 discoveries, the hill, why NASA picked this desert
- Training Center: 4 hands-on rooms (air, water, atmosphere layers, food), fitting room with a spacesuit, hidden secrets
- The Level 2 door leads into Razan's 5 walk-in rooms

# Junior Astronaut

A 3D educational space adventure for children aged 7 to 12, built by team SHEclipse for the NASA Space Apps Challenge 2026 ("Build a Junior Astronaut Mission Trainer").

The player receives a mysterious invitation, is flown by spaceship to a desert, and learns step by step what it takes to explore Mars. Nuri, a small alien AI companion, explains and gives hints but never solves a challenge for the player. The game runs in English and Arabic.

## Play it

Open `index.html` in a modern browser. An internet connection is needed the first time, because the page loads Three.js and its fonts from a CDN. There is nothing to install or build.

Controls: WASD or arrow keys to walk, Shift to run, Space to jump, drag to look around, E to interact. On phones and tablets there is an on-screen joystick.

## What is in the game so far

**Prologue: The Invitation**
- A space-themed bedroom with a glowing box to open
- A full-screen invitation addressed to the player by name
- A spaceship with a green beam, and a flight over mountains and the sea
- Landing in a mystery desert and meeting Nuri

**Level 1: The Secrets of the Atacama Desert**
- Task 1: fix a broken world-map puzzle to find out where you are (Atacama Desert, Chile)
- Free exploration with three discoveries: very dry ground, wind-shaped rocks and dunes, and life in the desert
- A hilltop view where Nuri explains how Mars differs from Earth
- The Junior Astronaut Training Academy appears, leading to Level 2

Level 2 (the Training Academy) is not built yet.

## Science

The facts in the game are kept consistent with NASA sources. The Atacama Desert is used by scientists, including NASA-supported teams, as a Mars analog: a place on Earth that is similar to Mars in some ways, such as being extremely dry.

This project is not an official NASA product and does not use the NASA logo.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The current game: prologue and Level 1, in one self-contained page |
| `prototypes/level1-science-stations.html` | An earlier Level 1 with packing, a soil lab, a salt rock, a rover drive and a telescope |
| `prototypes/red-base-explorer-3d.html` | An earlier 3D prototype: running a Mars base for seven sols |
| `prototypes/mission-red-base.html` | The first 2D prototype of the Mars base game |

## Notes

- Sounds and music are generated in the browser with the Web Audio API, so there are no audio files.
- Nuri's free-text chat and read-aloud voice only work when the game is opened as a Claude artifact. Elsewhere, Nuri answers from a fixed set of questions and hints.

## Update (14 Nov): kid-friendly pass

Changes made on top of Razan's version:

- **Quieter:** no more talking beeps for Nuri or the explorer on every line, and the background music is softer.
- **Less talking, more pictures:** lines are shorter, they type in, and every conversation has a **Skip** button. The three discoveries (and three new secret ones) now show as big picture stickers with one short sentence, collected in a sticker tray at the top.
- **New 3D explorer:** a jointed character with knees, elbows and ankles, a new face (eyes with irises and shine, eyebrows that move, blush), a bouncy ponytail and a training suit with a backpack. Smooth walk, run, idle breathing, look-around, jump and landing animations.
- **Nuri:** looks where the explorer is walking, then turns to face you when you stop or when it talks. New glowing antennae, hover glow, a chest light, and its mouth moves while it talks.
- **Richer Atacama:** cardon cacti, desert grass, a flowering-desert patch around the little plant, a salt lagoon with flamingos that walk and feed, radio telescope dishes, grazing vicuñas, dust devils and a condor overhead.
- **Secret stickers:** walk to the flamingos, the radio dishes or the vicuñas to find bonus discoveries.

Open `index.html` in a browser (it loads Three.js from cdnjs). On the Netlify site it is at `/junior-astronaut/`.

## Level 4: Life on Mars (the base is already built)

When the capsule lands on Mars, Level 4 starts. The first crew already built the base, so the goal is to **keep it running**: maintain it, fix it, grow it.

- **The base:** habitat, life support (oxygen maker, ice melter, water recycler), power station (solar panels and batteries), 2 greenhouses, radiation shield walls, a science lab, a radio station to talk to Mission Control, a rover garage, and the 3D printer.
- **6 meters:** water, oxygen, power, food, shielding and crew safety, plus your own energy and the rover battery.
- **Every sol:** morning report (with Nuri's scan for problems), inspect the base (problems show a wrench sign), decide (switch machines on or off, fix, clean, harvest, recycle), one surprise event (dust storm, water system failure, greenhouse problem, solar storm radiation alert, marsquake), and an end-of-day card showing what got better or worse.
- **Fixing:** clean dusty panels, fix leaks and clogged air filters with spare parts (3D-print them from Mars soil or order them from Earth), repair cracked walls with soil, and work out what sick plants need (dry soil needs water, soggy soil needs the fan).
- **Rover missions (no fighting):** claim 6 new places, study rock samples in the lab, repair a far solar station, and rescue a stuck astronaut.
- **Your flag:** drive to an orange flag and press E to plant your own flag there. Pick one of 31 country flags or design your own (colors, pattern, picture, your name). It also flies over the base. Each place gives a real Mars fact.
- **Real space weather (NASA DONKI):** the morning report shows how busy the real Sun was in the last 7 days. A busy Sun brings more and stronger radiation storms. If NASA can't be reached, the game says so and uses real archived storms instead.
- **Protect your team from radiation:** when a solar storm warning arrives (after the radio delay), you choose: everyone into the shelter (safe, but nobody tends the plants), pump water into the shelter walls (safe anywhere in the base, costs 3 power tonight), or keep working (+15 credits of science, but a big team dose). The team dose is tracked.
- **Dust storm decision:** 10 seconds to choose: fold the solar panels away (no power until it ends, panels stay clean) or leave them out (a little power, but dusty panels and maybe a cracked one).
- **Camera:** press C or the Photo button to take photos of the base, your flag, storms, the crew. The album lets you save them or send them to Earth (uses 1 power, arrives after the radio delay, Mission Control replies).
- **Endless play:** Level 4 never ends. Long missions (harvest, send photos, keep the team safe in a storm, build walls, study, fix, stay healthy) keep coming, three at a time, and each one raises your base rank.
- **Long days with a pause:** one sol lasts about 3.5 minutes (2.5 minutes of day). The pause button next to the clock stops time so you can think.
- **Mars Credits:** the coins from Levels 1 to 3 carry over. Earn more from daily jobs, fixes, harvests, science, exploring and rescues. Spend them on base upgrades, rover upgrades and new suit colors. Credits can't buy air or water.
- **Orders from Earth** go through the radio station and take 1 to 2 sols to land, so you plan ahead.
- **Build mode:** the base is done, but you can still move, add or remove pieces.
- After sol 3, two more astronauts land, so the base needs more of everything.
- If crew safety hits zero, the crew goes to the shelter (nobody is hurt) and you replay that sol. Nothing changes while you are away from the game; the base waits for you.

Real facts used: Curiosity measuring about 0.7 millisieverts a day on Mars, NASA's 600 millisievert career radiation limit, Orion's storm shelter and water as a radiation shield, InSight's dusty solar panels, NASA CHAPEA (4 volunteers, 378 days in a 3D-printed pretend Mars home), about 0.84 kg of oxygen and about 4 liters of water per person per day, the space station recycling 98% of its water, dust devils cleaning Spirit's panels, the zinnias Scott Kelly saved on the space station, Earth-Mars radio delay of 3 to 22 minutes, and launch windows every 26 months.
