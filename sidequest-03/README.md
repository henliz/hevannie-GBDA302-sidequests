## Project Title
Sidequest 03: Front Desk

---
## Group Members
Henrietta van Niekerk | hevannie | 21008705

---
## Description
A short visual novel set during a night shift at a small office building. Three visitors arrive and each decision puts two competing resources in tension: Trust (the human meter) and Standing (Hensley's approval / company protocol). Sometimes kindness helps both. Usually it does not.

Choices branch to different scene text AND affect both stats. Four endings based on the Trust/Standing combo at the end: threaded the needle, good human/bad employee, good employee/bad human, or two meetings Monday.

Bonus: Two stats tracked simultaneously across all three scenes. The flash animation after each choice shows both changes at once so the tradeoff is immediately visible.

Split across three files: story.js (all narrative data and stat values), ui.js (all drawing), sketch.js (state machine and p5 loop).

---
## Setup and Interaction Instructions
Opens directly in the browser via GitHub Pages - no setup needed.
- Click to advance text (clicking while typing skips to the end of the current line)
- Click a choice button to make a decision
- Three visitors, three choices, one of three endings

---
## Iteration Notes

### Post-Playtest
1. Added a drawn start screen with rain particles and a city silhouette - the original dropped straight into the story with no entry point, which felt abrupt and gave no sense of setting before the first line of text.
2. Replaced the emoji-corner scene staging with a fully drawn room (desk, lamp with radial glow, animated window that changes per scene) - the abstract emoji layout was not communicating the night-shift atmosphere clearly enough.
3. Redesigned from one stat to two competing resources (Trust and Standing) after playtesting revealed that a single moral meter felt too simple - most choices had an obvious right answer, but adding the boss-approval tension made every decision genuinely uncomfortable.
4. Rewrote all scene dialogue to be more atmospheric and understated, added colored left-edge accents on choice buttons (warm amber for trust-leaning, cool blue for standing-leaning) so the tradeoff reads visually before the numbers appear, and made the room itself react to the running stats - lamp warmth tied to trust, monitor tint tied to standing, faint ambient wall overlay shifts with the combined mood.

### Post-Showcase
No showcase for this sidequest.

---
## Assets
No external assets. All visuals use p5.js drawing and system emoji.

---
## References
Pope, L. (2013). *Papers, Please* [Video game]. 3909 LLC.
Used as tonal and mechanical reference for the moral weight of small bureaucratic decisions.

---
