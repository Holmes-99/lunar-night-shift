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
