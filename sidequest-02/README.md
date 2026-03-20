## Project Title
Sidequest 02: Joyful Blob

---
## Group Members
Henrietta van Niekerk | hevannie | 21008705

---
## Description
A joyful take on the Week 2 Example 03 platformer. The blob's movement and environment were redesigned to express joy and bubbliness. Gravity is lighter so the blob feels floaty, jumps are big and generous, and acceleration is snappy and responsive. The blob squashes wide when it lands and stretches tall when it jumps (squash-and-stretch). The world uses a warm pastel palette - soft blue/peach gradient sky, coral floor, and lavender/seafoam/peach/sky-blue platforms with rounded corners. The blob is sunshine yellow with a glossy highlight to look like a bubble.

Bonus mischief mechanic: seven colorful bubble items are placed across the platforms. When the blob bumps into one, it launches away and falls off the map. A counter in the HUD tracks how many have been bumped. The goal is to knock them all off.

---
## Setup and Interaction Instructions
Opens directly in the browser via GitHub Pages - no setup needed.
- Move: A/D or arrow keys
- Jump: Space, W, or up arrow
- Try to bump all the colored bubble items off the platforms

---
## Iteration Notes

### Post-Playtest
1. Lowered `wobbleFreq` from 0.9 to 0.32 and slowed `tSpeed` from 0.028 to 0.009 - the original high-frequency noise made the blob look nervous and jittery rather than joyful, so switching to fewer, slower, rounder bumps fixed the emotional read.
2. Added an idle bop (vertical sine wave) and a small side sway so the blob feels alive and jiving even when not moving, rather than just sitting still waiting for input.
3. Made squash and stretch significantly more dramatic - landing squash increased to 2.2 and jump stretch to -1.1, with a slower decay (0.76) so the deformation is actually visible before it snaps back.

### Post-Showcase
No showcase for this sidequest.

---
## Assets
No external assets. All visuals are generated with p5.js.

---
## References
Cochrane, K. (2026). *GBDA302 W2 Example 03* [Course code example]. University of Waterloo.
Used as the platformer base (blob physics, AABB collision system, platform array structure).

---
