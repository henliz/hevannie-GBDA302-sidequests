// ui.js - all drawing functions for Front Desk
// sketch.js calls these - nothing here knows about game state

// ---- palette ----
const C_BG      = [14, 12, 10];
const C_WALL    = [22, 18, 15];
const C_FLOOR   = [42, 30, 20];
const C_DESK    = [55, 40, 27];
const C_PANEL   = [18, 15, 13];
const C_BORDER  = [55, 46, 40];
const C_SPEAKER = [225, 165, 85];
const C_TEXT    = [208, 200, 190];
const C_MUTED   = [110, 100, 92];
const C_BTN_BG  = [28, 24, 20];
const C_BTN_HOV = [46, 40, 34];
const C_BTN_BDR = [72, 62, 54];
const C_TRUST_P = [130, 200, 160];
const C_TRUST_N = [200, 115, 100];

const SCENE_RATIO = 0.50; // scene area is top 50% of canvas

// ---- start screen ----

function drawStartScreen(rain) {
  let ctx = drawingContext;

  // deep night sky gradient
  let sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#060810');
  sky.addColorStop(1, '#0e1018');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // rain streaks across the whole screen
  stroke(160, 175, 200, 28);
  strokeWeight(1);
  for (let r of rain) {
    line(r.x, r.y, r.x - r.len * 0.3, r.y + r.len);
  }
  noStroke();

  // city silhouette - simple rectangles, various heights
  let buildings = [
    { x: 0,           w: width * 0.10, h: height * 0.28 },
    { x: width * 0.08,w: width * 0.07, h: height * 0.38 },
    { x: width * 0.14,w: width * 0.12, h: height * 0.22 },
    { x: width * 0.24,w: width * 0.08, h: height * 0.45 }, // the Aldren
    { x: width * 0.31,w: width * 0.10, h: height * 0.30 },
    { x: width * 0.40,w: width * 0.13, h: height * 0.20 },
    { x: width * 0.52,w: width * 0.09, h: height * 0.35 },
    { x: width * 0.60,w: width * 0.14, h: height * 0.25 },
    { x: width * 0.73,w: width * 0.10, h: height * 0.40 },
    { x: width * 0.82,w: width * 0.10, h: height * 0.28 },
    { x: width * 0.91,w: width * 0.10, h: height * 0.18 },
  ];

  let groundY = height * 0.78;

  for (let b of buildings) {
    fill(12, 14, 18);
    noStroke();
    rect(b.x, groundY - b.h, b.w, b.h + height * 0.25);

    // scattered lit windows - warm yellow dots
    let cols = floor(b.w / 12);
    let rows = floor(b.h / 14);
    for (let c = 1; c < cols; c++) {
      for (let r = 1; r < rows - 1; r++) {
        // not every window is lit - use a consistent pseudo-random check
        let seed = (b.x + c * 7 + r * 13) % 17;
        if (seed < 6) {
          let wx = b.x + c * (b.w / cols);
          let wy = groundY - b.h + r * (b.h / rows);
          // slight flicker on a few windows using frameCount
          let flicker = (seed === 3) ? (sin(frameCount * 0.08 + seed) > 0.5 ? 1 : 0) : 1;
          if (flicker) {
            fill(200, 180, 100, 160);
            rect(wx - 2, wy - 3, 5, 7);
          }
        }
      }
    }
  }

  // the Aldren lobby glow - warm pool of light at ground level
  let aldrenX = width * 0.24 + width * 0.04;
  let ctx2 = drawingContext;
  let lobbyGlow = ctx2.createRadialGradient(aldrenX, groundY, 0, aldrenX, groundY, width * 0.10);
  lobbyGlow.addColorStop(0, 'rgba(220, 170, 80, 0.35)');
  lobbyGlow.addColorStop(1, 'rgba(220, 170, 80, 0)');
  ctx2.fillStyle = lobbyGlow;
  ctx2.beginPath();
  ctx2.arc(aldrenX, groundY, width * 0.10, 0, Math.PI * 2);
  ctx2.fill();

  // ground / street
  fill(8, 10, 14);
  noStroke();
  rect(0, groundY, width, height - groundY);

  // wet street reflection - faint upside-down city
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.scale(1, -1);
  ctx.translate(0, -(groundY * 2));
  for (let b of buildings) {
    ctx.fillStyle = '#0e111a';
    ctx.fillRect(b.x, groundY - b.h, b.w, b.h * 0.5);
  }
  ctx.restore();

  // ---- title text ----
  // glow behind title
  let titleY = height * 0.36;
  let titleGlow = ctx.createRadialGradient(width / 2, titleY, 0, width / 2, titleY, width * 0.28);
  titleGlow.addColorStop(0, 'rgba(200, 160, 70, 0.12)');
  titleGlow.addColorStop(1, 'rgba(200, 160, 70, 0)');
  ctx.fillStyle = titleGlow;
  ctx.fillRect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  noStroke();

  // building name - small, top
  textSize(constrain(width * 0.018, 10, 15));
  fill(110, 100, 88);
  text('ALDREN BUILDING  -  NIGHT SHIFT', width / 2, height * 0.22);

  // main title
  textSize(constrain(width * 0.09, 38, 82));
  fill(215, 190, 140);
  text('FRONT DESK', width / 2, titleY);

  // thin rule under title
  stroke(80, 68, 52, 180);
  strokeWeight(1);
  let rw = constrain(width * 0.28, 120, 280);
  line(width / 2 - rw / 2, titleY + constrain(width * 0.06, 26, 52),
       width / 2 + rw / 2, titleY + constrain(width * 0.06, 26, 52));
  noStroke();

  // blinking start prompt
  let blink = floor(frameCount / 30) % 2 === 0;
  if (blink) {
    textSize(constrain(width * 0.020, 10, 16));
    fill(140, 128, 112);
    text('click anywhere to begin', width / 2, height * 0.58);
  }
}

// ---- end / summary screen ----

function drawEndScreen(endingId, trust, standing, restartHovered) {
  background(...C_BG);

  let cx = width / 2;

  // ending label and flavour line based on which combo was reached
  let endTitle, endNote;
  if (endingId === 'ending_both_high') {
    endTitle = 'You threaded the needle.';
    endNote  = 'Good log. Good people.';
  } else if (endingId === 'ending_human') {
    endTitle = 'Good at the human parts.';
    endNote  = 'The paperwork will sort itself out.';
  } else if (endingId === 'ending_corporate') {
    endTitle = 'Clean record.';
    endNote  = 'Efficient. Commended. Quiet.';
  } else {
    endTitle = 'Two meetings Monday.';
    endNote  = 'The log tells a different story.';
  }

  textAlign(CENTER, CENTER);
  noStroke();

  textSize(constrain(width * 0.018, 10, 15));
  fill(90, 80, 70);
  text('FRONT DESK', cx, height * 0.18);

  textSize(constrain(width * 0.044, 20, 40));
  fill(...C_SPEAKER);
  text(endTitle, cx, height * 0.29);

  textSize(constrain(width * 0.023, 10, 19));
  fill(...C_MUTED);
  text(endNote, cx, height * 0.38);

  // ---- two stat bars ----
  let bw  = constrain(width * 0.34, 130, 300);
  let bh  = constrain(height * 0.011, 5, 9);
  let bx  = cx - bw / 2;
  let mid = bx + bw / 2;
  let statLabelSize = constrain(width * 0.019, 9, 15);

  function drawStatBar(label, value, maxVal, col, by) {
    textSize(statLabelSize);
    textAlign(RIGHT, CENTER);
    fill(...C_MUTED);
    text(label, bx - 10, by + bh / 2);

    // track
    fill(35, 30, 26);
    rect(bx, by, bw, bh, bh / 2);

    // fill from center
    let fw = constrain(map(abs(value), 0, maxVal, 0, bw / 2), 0, bw / 2);
    fill(col);
    if (value >= 0) rect(mid, by, fw, bh);
    else            rect(mid - fw, by, fw, bh);

    // center tick
    fill(80, 70, 62);
    rect(mid - 1, by - 2, 2, bh + 4);

    // value label
    textSize(statLabelSize);
    textAlign(LEFT, CENTER);
    fill(col);
    text(`${value > 0 ? '+' : ''}${value}`, bx + bw + 10, by + bh / 2);
  }

  let trustCol    = trust    >= 0 ? color(...C_TRUST_P)        : color(...C_TRUST_N);
  let standingCol = standing >= 0 ? color(140, 180, 220)       : color(200, 140, 100);

  drawStatBar('TRUST',    trust,    45, trustCol,    height * 0.49);
  drawStatBar('STANDING', standing, 20, standingCol, height * 0.49 + bh * 3.5);

  // play again button
  let btnW = constrain(width * 0.22, 120, 200);
  let btnH = constrain(height * 0.07, 36, 52);
  let btnX = cx - btnW / 2;
  let btnY = height * 0.68;

  fill(restartHovered ? color(...C_BTN_HOV) : color(...C_BTN_BG));
  stroke(...C_BTN_BDR);
  strokeWeight(1);
  rect(btnX, btnY, btnW, btnH, 5);
  noStroke();

  textSize(constrain(width * 0.022, 10, 18));
  textAlign(CENTER, CENTER);
  fill(restartHovered ? color(...C_SPEAKER) : color(...C_TEXT));
  text('play again', cx, btnY + btnH / 2);

  return mouseX >= btnX && mouseX <= btnX + btnW &&
         mouseY >= btnY && mouseY <= btnY + btnH;
}

// ---- scene room ----

function drawSceneArea(visual, trust, standing) {
  let sh = height * SCENE_RATIO;

  // wall bg
  background(...C_WALL);

  // ambient mood tint - reacts to combined trust + standing
  // warm when doing good on both, cool when trust is low, grey when both low
  let moodAlpha = 18;
  if (trust >= 20 && standing >= 5)        fill(200, 155, 60,  moodAlpha); // threaded needle - warm gold
  else if (trust > 5 && standing < 0)      fill(180, 120, 80,  moodAlpha); // human but flagged - amber
  else if (trust < 0 && standing > 5)      fill(80,  120, 170, moodAlpha); // corporate - cold blue
  else if (trust < 0 && standing < 0)      fill(90,  80,  70,  moodAlpha); // both low - dull brown-grey
  else                                      fill(0,   0,   0,   0);         // neutral - no tint
  noStroke();
  rect(0, 0, width, sh);

  // window (right side) - style depends on scene bg
  let wx = width * 0.64, wy = sh * 0.06, ww = width * 0.30, wh = sh * 0.68;
  drawWindow(visual.bg, wx, wy, ww, wh, sh);

  // floor strip
  noStroke();
  fill(...C_FLOOR);
  rect(0, sh * 0.80, width, sh * 0.22);

  // desk surface
  fill(...C_DESK);
  noStroke();
  let dx = width * 0.08, dy = sh * 0.71, dw = width * 0.54, dh = sh * 0.075;
  rect(dx, dy, dw, dh, 2);
  // desk front panel
  fill(44, 32, 21);
  rect(dx + 2, dy + dh, dw - 4, sh * 0.06, 2);

  // lamp glow - radial gradient
  let lx = dx + dw * 0.82, ly = dy - sh * 0.01;
  let ctx = drawingContext;
  // lamp warmth reacts to trust - bright amber when high, dims and cools when low
  let lampR, lampG, lampB, lampA;
  if      (trust >= 20)  { lampR = 255; lampG = 205; lampB = 80;  lampA = 0.38; } // warm + bright
  else if (trust >= 5)   { lampR = 245; lampG = 195; lampB = 88;  lampA = 0.28; } // default warm
  else if (trust >= 0)   { lampR = 220; lampG = 185; lampB = 100; lampA = 0.22; } // slightly dimmed
  else                   { lampR = 175; lampG = 185; lampB = 210; lampA = 0.16; } // cold/dim - choices weigh
  let glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, sh * 0.38);
  glow.addColorStop(0, `rgba(${lampR}, ${lampG}, ${lampB}, ${lampA})`);
  glow.addColorStop(1, `rgba(${lampR}, ${lampG}, ${lampB}, 0)`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(lx, ly, sh * 0.38, 0, Math.PI * 2);
  ctx.fill();

  // lamp pole
  stroke(85, 68, 50);
  strokeWeight(constrain(width * 0.004, 2, 4));
  line(lx, dy, lx, dy - sh * 0.26);
  noStroke();

  // lamp shade (small triangle)
  fill(95, 76, 56);
  let ls = constrain(width * 0.028, 12, 22);
  triangle(lx - ls, dy - sh * 0.26, lx + ls, dy - sh * 0.26, lx, dy - sh * 0.34);

  // bulb
  fill(255, 235, 155, 210);
  noStroke();
  ellipse(lx, dy - sh * 0.26, constrain(width * 0.01, 4, 8));

  // monitor on desk
  let mx = dx + dw * 0.22;
  let ms = constrain(width * 0.055, 22, 44);
  fill(28, 25, 22);
  rect(mx - ms * 0.6, dy - ms * 1.1, ms * 1.2, ms * 0.95, 2);
  // screen glow - tint reacts to standing: clean blue when protocol is good, reddish when it isn't
  let sR, sG, sB;
  if      (standing >= 10) { sR = 14;  sG = 42;  sB = 72;  } // clean protocol - bright cool blue
  else if (standing >= 0)  { sR = 18;  sG = 32;  sB = 52;  } // default
  else if (standing >= -5) { sR = 35;  sG = 22;  sB = 28;  } // flagged - warning tinge
  else                     { sR = 52;  sG = 18;  sB = 18;  } // in the red
  fill(sR, sG, sB, 180);
  rect(mx - ms * 0.45, dy - ms * 0.95, ms * 0.9, ms * 0.68, 1);
  // stand
  fill(28, 25, 22);
  rect(mx - ms * 0.12, dy - ms * 0.15, ms * 0.24, ms * 0.18);

  // coffee cup
  let cx2 = dx + dw * 0.44, cy2 = dy + dh * 0.3;
  let cs  = constrain(width * 0.012, 5, 10);
  fill(35, 28, 22);
  rect(cx2 - cs * 0.6, cy2 - cs, cs * 1.2, cs * 1.4, 1);
  fill(30, 20, 14);
  ellipse(cx2, cy2 - cs * 0.9, cs, cs * 0.4); // coffee surface

  // visitor silhouette (only if present)
  if (visual.visitor) drawVisitor(visual.visitor, sh);

  // both meters - stacked top-right
  let statSize = constrain(width * 0.018, 9, 15);
  textSize(statSize);
  textAlign(RIGHT, TOP);
  noStroke();

  fill(trust >= 0 ? color(...C_TRUST_P) : color(...C_TRUST_N));
  text(`TRUST      ${trust > 0 ? '+' : ''}${trust}`, width - 14, 12);

  fill(standing >= 0 ? color(140, 180, 220) : color(200, 140, 100));
  text(`STANDING   ${standing > 0 ? '+' : ''}${standing}`, width - 14, 12 + statSize * 1.6);
}

function drawWindow(bg, wx, wy, ww, wh, sh) {
  let ctx = drawingContext;

  // window backing
  if (bg === 'morning_warm') {
    let g = ctx.createLinearGradient(wx, wy, wx, wy + wh);
    g.addColorStop(0, '#1a0f08');
    g.addColorStop(0.5, '#5c2e10');
    g.addColorStop(1, '#c47030');
    ctx.fillStyle = g;
  } else if (bg === 'morning_mid') {
    let g = ctx.createLinearGradient(wx, wy, wx, wy + wh);
    g.addColorStop(0, '#10141a');
    g.addColorStop(1, '#3a5068');
    ctx.fillStyle = g;
  } else if (bg === 'morning_grey') {
    let g = ctx.createLinearGradient(wx, wy, wx, wy + wh);
    g.addColorStop(0, '#0e0e10');
    g.addColorStop(1, '#28282e');
    ctx.fillStyle = g;
  } else if (bg === 'cold') {
    let g = ctx.createLinearGradient(wx, wy, wx, wy + wh);
    g.addColorStop(0, '#080c12');
    g.addColorStop(1, '#0c1420');
    ctx.fillStyle = g;
  } else if (bg === 'rain') {
    let g = ctx.createLinearGradient(wx, wy, wx, wy + wh);
    g.addColorStop(0, '#060810');
    g.addColorStop(1, '#0a0e16');
    ctx.fillStyle = g;
  } else {
    // night default
    let g = ctx.createLinearGradient(wx, wy, wx, wy + wh);
    g.addColorStop(0, '#050608');
    g.addColorStop(1, '#080c12');
    ctx.fillStyle = g;
  }
  ctx.fillRect(wx, wy, ww, wh);

  // city dots in the window (night/rain/cold scenes)
  if (bg === 'night' || bg === 'rain' || bg === 'cold') {
    noStroke();
    for (let i = 0; i < 22; i++) {
      let seed  = i * 137.5 % 1;
      let seed2 = i * 73.1 % 1;
      let seed3 = i * 29.7 % 1;
      let dotX  = wx + seed  * ww;
      let dotY  = wy + seed2 * wh * 0.85;
      let warm  = seed3 > 0.5;
      // cold scenes make city lights bluer
      if (bg === 'cold') fill(140, 165, 210, 120);
      else               fill(warm ? 200 : 160, warm ? 175 : 175, warm ? 100 : 200, 120);
      ellipse(dotX, dotY, 2, 2);
    }
  }

  // rain streaks on glass
  if (bg === 'rain') {
    stroke(160, 180, 210, 35);
    strokeWeight(1);
    let t = frameCount * 0.8;
    for (let i = 0; i < 14; i++) {
      let rx = wx + ((i * 47.3 + t * 0.6) % ww);
      let ry = wy + ((i * 31.7 + t) % wh);
      let rl = random(8, 22); // randomness is ok here, streaks are decorative
      line(rx, ry, rx - rl * 0.2, ry + rl);
    }
    noStroke();
  }

  // cold - frost at bottom of window
  if (bg === 'cold') {
    fill(180, 210, 230, 22);
    rect(wx, wy + wh * 0.82, ww, wh * 0.18);
  }

  // morning warm - sun glow
  if (bg === 'morning_warm') {
    let sg = ctx.createRadialGradient(wx + ww * 0.5, wy + wh, 0, wx + ww * 0.5, wy + wh, ww * 0.8);
    sg.addColorStop(0, 'rgba(255, 150, 50, 0.45)');
    sg.addColorStop(1, 'rgba(255, 150, 50, 0)');
    ctx.fillStyle = sg;
    ctx.fillRect(wx, wy, ww, wh);
  }

  // window frame grid lines
  stroke(28, 24, 20);
  strokeWeight(constrain(width * 0.003, 1.5, 3));
  noFill();
  rect(wx, wy, ww, wh);
  // horizontal divider
  line(wx, wy + wh * 0.5, wx + ww, wy + wh * 0.5);
  // vertical divider
  line(wx + ww * 0.5, wy, wx + ww * 0.5, wy + wh);
  noStroke();
}

function drawVisitor(type, sh) {
  // all visitors appear at the left side - the lobby door
  // drawn as simple dark silhouettes - expressionistic not realistic
  let vx = width * 0.03;
  let vy = sh * 0.15;
  let alpha = 200;

  fill(16, 13, 11, alpha);
  noStroke();

  if (type === 'woman') {
    // slightly shorter, coat silhouette - wider at shoulders and hem
    let bw = constrain(width * 0.058, 24, 46);
    let bh = sh * 0.44;
    ellipse(vx + bw / 2, vy, bw * 0.6, bw * 0.6);                        // head
    // coat body - trapezoid using vertex
    beginShape();
    vertex(vx + bw * 0.08, vy + bw * 0.28);
    vertex(vx + bw * 0.92, vy + bw * 0.28);
    vertex(vx + bw, vy + bh);
    vertex(vx,      vy + bh);
    endShape(CLOSE);

  } else if (type === 'man') {
    // taller, squarer - clipboard visible
    let bw = constrain(width * 0.055, 22, 42);
    let bh = sh * 0.52;
    ellipse(vx + bw / 2, vy, bw * 0.55, bw * 0.55);                      // head
    rect(vx + bw * 0.08, vy + bw * 0.25, bw * 0.84, bh, 2);              // body
    // clipboard in hand
    fill(55, 48, 38, 160);
    rect(vx + bw * 0.78, vy + bh * 0.4, bw * 0.38, bw * 0.5, 1);

  } else if (type === 'elder') {
    // shorter, slightly hunched - rounded silhouette
    let bw = constrain(width * 0.052, 20, 40);
    let bh = sh * 0.36;
    fill(16, 13, 11, alpha);
    ellipse(vx + bw / 2, vy + bh * 0.05, bw * 0.55, bw * 0.55);         // head
    beginShape();
    vertex(vx + bw * 0.1, vy + bw * 0.3);
    vertex(vx + bw * 0.9, vy + bw * 0.3);
    vertex(vx + bw * 0.85, vy + bh);
    vertex(vx + bw * 0.15, vy + bh);
    endShape(CLOSE);
    // scarf hint
    fill(60, 70, 85, 120);
    ellipse(vx + bw / 2, vy + bw * 0.42, bw * 0.68, bw * 0.2);

  } else if (type === 'elder_in') {
    // elder seated in the chair by the window
    // placed slightly right so they're by the window side
    let ex = width * 0.55, ey = sh * 0.55;
    let ew = constrain(width * 0.042, 18, 34);
    fill(16, 13, 11, 160);
    ellipse(ex, ey, ew * 0.55, ew * 0.55);                                // head
    rect(ex - ew * 0.4, ey + ew * 0.22, ew * 0.8, ew * 0.6, 1);         // body seated
    // jacket/blanket hint
    fill(38, 44, 52, 100);
    ellipse(ex, ey + ew * 0.42, ew * 0.9, ew * 0.45);
  }
}

// ---- text panel ----

function drawTextPanel(speaker, displayText, showContinue) {
  let py  = height * SCENE_RATIO;
  let ph  = height - py;
  let padX = constrain(width * 0.065, 22, 58);
  let padT = constrain(ph * 0.13, 12, 20);

  noStroke();
  fill(...C_PANEL);
  rect(0, py, width, ph);

  stroke(...C_BORDER);
  strokeWeight(1);
  line(0, py, width, py);
  noStroke();

  let textStartY = py + padT;
  if (speaker) {
    textSize(constrain(width * 0.020, 10, 16));
    textAlign(LEFT, TOP);
    fill(...C_SPEAKER);
    text(speaker.toUpperCase(), padX, textStartY);
    textStartY += constrain(ph * 0.17, 16, 26);
  }

  textSize(constrain(width * 0.026, 12, 20));
  textAlign(LEFT, TOP);
  fill(...C_TEXT);
  textLeading(constrain(ph * 0.28, 24, 36));
  text(displayText, padX, textStartY, width - padX * 2, ph * 0.60);

  if (showContinue) {
    let blink = floor(frameCount / 26) % 2 === 0;
    if (blink) {
      textSize(constrain(width * 0.017, 9, 13));
      textAlign(RIGHT, BOTTOM);
      fill(...C_MUTED);
      text('click to continue >', width - padX, height - constrain(ph * 0.09, 8, 14));
    }
  }
}

// ---- choice buttons ----

// each button gets a subtle left-edge accent based on whether the choice
// leans toward trust (warm amber) or standing (cool blue) - hints at the
// tradeoff without spelling out numbers - players feel it before they read it
function drawChoiceButtons(choices) {
  let py      = height * SCENE_RATIO;
  let ph      = height - py;
  let padX    = constrain(width * 0.065, 22, 58);
  let btnH    = constrain(ph * 0.23, 34, 50);
  let gap     = constrain(ph * 0.07, 7, 14);
  let btnW    = width - padX * 2;
  let startY  = py + constrain(ph * 0.22, 20, 36);
  let accentW = constrain(width * 0.004, 2, 4);

  let hovered = -1;

  for (let i = 0; i < choices.length; i++) {
    let bx = padX;
    let by = startY + i * (btnH + gap);
    let c  = choices[i];

    let isHov = mouseX >= bx && mouseX <= bx + btnW &&
                mouseY >= by && mouseY <= by + btnH;
    if (isHov) hovered = i;

    fill(isHov ? color(...C_BTN_HOV) : color(...C_BTN_BG));
    stroke(...C_BTN_BDR);
    strokeWeight(1);
    rect(bx, by, btnW, btnH, 5);
    noStroke();

    // left accent: warm = human/trust, cool = protocol/standing, dim red = costs both
    let accentAlpha = isHov ? 230 : 150;
    let nt = c.trust || 0, ns = c.standing || 0;
    if      (nt > 0 && nt > ns)  fill(220, 165, 75,  accentAlpha); // warm amber
    else if (ns > 0 && ns >= nt) fill(120, 160, 210, accentAlpha); // cool blue
    else                          fill(170, 90,  85,  accentAlpha); // costs both
    rect(bx, by, accentW, btnH, 2);

    textSize(constrain(width * 0.022, 11, 18));
    textAlign(LEFT, CENTER);
    fill(isHov ? color(...C_SPEAKER) : color(...C_TEXT));
    text(c.label, bx + accentW + 12, by + btnH / 2);
  }

  return hovered;
}

// ---- choice flash - shows both trust and standing change briefly ----

function drawChoiceFlash(trustVal, standingVal, alpha) {
  if (alpha <= 0) return;
  let cy = height * SCENE_RATIO * 0.76;
  let spacing = constrain(width * 0.12, 50, 100);
  let sz = constrain(width * 0.036, 17, 32);

  textSize(sz);
  textAlign(CENTER, CENTER);
  noStroke();

  // trust change on the left
  let tc = trustVal >= 0 ? color(...C_TRUST_P, alpha) : color(...C_TRUST_N, alpha);
  fill(tc);
  text((trustVal > 0 ? '+' : '') + trustVal, width / 2 - spacing, cy);

  // standing change on the right
  let sc = standingVal >= 0 ? color(140, 180, 220, alpha) : color(200, 140, 100, alpha);
  fill(sc);
  text((standingVal > 0 ? '+' : '') + standingVal, width / 2 + spacing, cy);

  // small labels below
  textSize(constrain(width * 0.015, 8, 12));
  fill(180, 170, 160, alpha * 0.6);
  text('trust',    width / 2 - spacing, cy + sz * 0.9);
  text('standing', width / 2 + spacing, cy + sz * 0.9);
}
