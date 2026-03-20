## Project Title
Sidequest 05: Drift

---
## Group Members
Henrietta van Niekerk | hevannie | 21008705

---
## Description
A top-down camera piece set over a sleeping nighttime landscape. The world (3400x2600 units) is larger than the screen - the camera drifts lazily toward wherever the mouse is pointing, like steering a hot air balloon by leaning. Moving the mouse to the far edges of the screen pulls the camera across the map; the lag in the lerp is the whole feeling.

Forests, a winding river, a reflective lake, and a small village with lit windows are distributed across the world. Four things are hidden in the landscape and reveal themselves only when the camera floats directly over them.

Bonus: six hidden discoveries - a campfire with figures sitting around it, an owl perched in the north forest (blinking, slow head-turn), a firefly field, a lighthouse with a rotating beam, a fox wandering back and forth in the south field, and a vivid northern lights curtain over a clearing in the north.

---
## Setup and Interaction Instructions
Opens directly in the browser via GitHub Pages - no setup needed.
- Move the mouse to steer the camera - the camera lags behind intentionally
- Float over things to discover them (discovery fades in as the camera center approaches)
- No clicking required - exploration is the interaction

---
## Iteration Notes

### Post-Playtest
1. Switched from an auto-scrolling vertical camera to a mouse-steered top-down pan after the original felt passive and linear - the map approach creates genuine exploration and a sense of a world that extends beyond what is visible.
2. Added Perlin noise breathing to the camera position so the view gently sways even when the mouse is still - without this the camera felt locked and rigid when held in place, which broke the floating quality.
3. Set discovery alpha to near-zero at distance (alpha 10) and only fully visible when the camera center is within the discovery radius - early testing had them too visible from far away, which removed the feeling of finding something.

### Post-Showcase
No showcase for this sidequest.

---
## Assets
No external assets. All visuals use p5.js drawing primitives and drawingContext gradient API.

---
## References
No external references.

---
