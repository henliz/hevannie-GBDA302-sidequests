// sketch.js - Front Desk
// state machine for a small visual novel about a night shift
// story data in story.js, drawing in ui.js

// ---- game state ----
let gameState = 'start';   // 'start' | 'play' | 'end'
let sceneId   = 'intro';
let lineIndex = 0;
let charIndex = 0.0;
let trust     = 0;
let standing  = 0;         // boss / company approval - second resource
let endingReached = null;

let choicesVisible = false;
let hoveredChoice  = -1;
let restartHovered = false;

// trust/standing flash after a choice
let flashTrust    = 0;
let flashStanding = 0;
let flashAlpha    = 0;

let rain = [];

const TYPE_SPEED = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  noStroke();
  initRain();
}

function initRain() {
  rain = [];
  for (let i = 0; i < 120; i++) {
    rain.push({
      x:     random(width),
      y:     random(height),
      speed: random(7, 16),
      len:   random(10, 24)
    });
  }
}

function updateRain() {
  for (let r of rain) {
    r.y += r.speed;
    r.x -= r.speed * 0.22;
    if (r.y > height) { r.y = -r.len; r.x = random(width); }
  }
}

function draw() {
  if (gameState === 'start') {
    updateRain();
    drawStartScreen(rain);
    return;
  }

  if (gameState === 'end') {
    restartHovered = drawEndScreen(endingReached, trust, standing, restartHovered);
    return;
  }

  // ---- gameState === 'play' ----
  let scene = SCENES[sceneId];
  if (!scene) return;

  let line = scene.lines[lineIndex];
  if (charIndex < line.length) charIndex = min(charIndex + TYPE_SPEED, line.length);

  let typingDone = charIndex >= line.length;
  let lastLine   = lineIndex >= scene.lines.length - 1;

  choicesVisible = typingDone && lastLine && scene.choices != null;

  drawSceneArea(scene.visual, trust, standing);

  let canAdvance = typingDone && !choicesVisible && (!lastLine || scene.next != null);
  drawTextPanel(scene.speaker, line.substring(0, floor(charIndex)), canAdvance);

  if (choicesVisible) hoveredChoice = drawChoiceButtons(scene.choices);

  if (flashAlpha > 0) {
    drawChoiceFlash(flashTrust, flashStanding, flashAlpha);
    flashAlpha -= 5;
  }
}

function mousePressed() {
  if (gameState === 'start') { gameState = 'play'; return; }

  if (gameState === 'end') {
    if (restartHovered) resetGame();
    return;
  }

  let scene      = SCENES[sceneId];
  if (!scene) return;
  let line       = scene.lines[lineIndex];
  let typingDone = charIndex >= line.length;
  let lastLine   = lineIndex >= scene.lines.length - 1;

  if (choicesVisible && hoveredChoice >= 0) {
    let choice  = scene.choices[hoveredChoice];
    trust      += choice.trust;
    standing   += choice.standing;
    flashTrust    = choice.trust;
    flashStanding = choice.standing;
    flashAlpha    = 255;
    goToScene(choice.next);
    return;
  }

  if (!typingDone)  { charIndex = line.length; return; }
  if (!lastLine)    { lineIndex++; charIndex = 0; return; }

  if (!scene.choices && scene.next) {
    if (scene.next === 'ending') goToEnding();
    else goToScene(scene.next);
    return;
  }

  if (!scene.choices && !scene.next) gameState = 'end';
}

function goToEnding() {
  let highTrust    = trust    >= TRUST_HIGH;
  let highStanding = standing >= STANDING_HIGH;

  let id;
  if      ( highTrust &&  highStanding) id = 'ending_both_high';
  else if ( highTrust && !highStanding) id = 'ending_human';
  else if (!highTrust &&  highStanding) id = 'ending_corporate';
  else                                  id = 'ending_both_low';

  endingReached = id;
  goToScene(id);
}

function goToScene(id) {
  sceneId = id; lineIndex = 0; charIndex = 0;
  choicesVisible = false; hoveredChoice = -1;
}

function resetGame() {
  gameState = 'start'; sceneId = 'intro';
  lineIndex = 0; charIndex = 0;
  trust = 0; standing = 0;
  endingReached = null; choicesVisible = false; flashAlpha = 0;
  initRain();
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); initRain(); }
