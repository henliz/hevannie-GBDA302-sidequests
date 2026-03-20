## Project Title
Sidequest 04: Grid Runner

---
## Group Members
Henrietta van Niekerk | hevannie | 21008705

---
## Description
A top-down tile crawler where the player navigates corridor grids collecting signal nodes to unlock the exit portal. Each level is stored as a 2D array in levels.js - sketch.js loops over the array to dynamically place every tile, obstacle, and pickup at runtime. Two levels: Sector A introduces the layout, Sector B reuses the same corridor skeleton but replaces safe tiles with hazards, forcing careful routing.

Hazards reset the player to start but keep collected nodes - punishing but not cruel. The exit portal stays dim until all nodes are collected, then it activates and pulses.

Bonus: Sector B loads automatically with a fade transition when Sector A is cleared.

Split across two files: levels.js (all level data as 2D arrays), sketch.js (tile renderer, player movement, state machine).

---
## Setup and Interaction Instructions
Opens directly in the browser via GitHub Pages - no setup needed.
- WASD or arrow keys to move
- Collect all glowing nodes to activate the exit portal
- Reach the portal to advance to the next sector
- Hazard tiles (X marks) reset position - collected nodes are kept

---
## Iteration Notes

### Post-Playtest
1. Switched from a closed-room dungeon layout to an outer-ring + mid-corridor structure after early testing revealed that hand-designing fully-connected tile maps was error-prone - the corridor skeleton guarantees every non-wall tile is reachable from start without needing pathfinding validation.
2. Added node-keeping on hazard reset (instead of losing all progress) after the first version felt too punishing - losing all collected nodes to a single bad tile made players avoid exploring entirely, which defeated the point of the level.
3. Added a brief title card on load and a fade transition between levels instead of a hard cut - the abrupt scene swap felt jarring in testing and gave no sense that a new level had loaded.

### Post-Showcase
No showcase for this sidequest.

---
## Assets
No external assets. All visuals use p5.js drawing primitives and drawingContext gradients.

---
## References
No external references. Level design structure loosely inspired by classic grid-based puzzle games (Sokoban, early Zelda dungeons) but implemented from scratch.

---
