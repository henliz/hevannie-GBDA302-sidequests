// sketch.js - sidequest 04: grid runner
// state machine + rendering for a tile-based level crawler
// level data lives in levels.js - this file just loops over it

// ---- game state ----
let gameState   = 'title';  // 'title' | 'play' | 'trans_out' | 'trans_in' | 'end'
let levelIdx    = 0;
let level       = null;
let TILE        = 50;
let OX          = 0;   // canvas offset X (centers level)
let OY          = 0;   // canvas offset Y

// ---- player ----
let player = { x: 0, y: 0, dx: 0, dy: 0, size: 0 };
let startX  = 0,  startY  = 0;  // respawn position
let lastDX  = 1,  lastDY  = 0;  // direction memory for drawing facing arrow

// ---- nodes ----
let collected;   // Set of 'row,col' strings for collected nodes
let totalNodes;  // total in current level (computed from map)

// ---- transition ----
let transAlpha  = 0;   // 0-255 black overlay for level fade
let titleTimer  = 0;   // frames spent on title card

// ---- flash on hazard hit ----
let hitFlash    = 0;   // frames of red screen flash remaining

const SPEED       = 0;   // placeholder - computed per level in loadLevel
const TRANS_SPEED = 6;
const HIT_DUR     = 18;

// ---- palette ----
const C_WALL_D   = [6,   6,   10 ];
const C_WALL_L   = [10,  10,  16 ];
const C_FLOOR    = [14,  16,  24 ];
const C_FLOOR_G  = [20,  22,  34 ];  // floor grid line
const C_NODE     = [0,   215, 190];  // cyan-mint
const C_HAZ      = [215, 48,  62 ];  // neon red
const C_EXIT_D   = [20,  35,  22 ];  // exit dim
const C_EXIT_A   = [45,  230, 105];  // exit active
const C_PLAYER   = [255, 195, 45 ];  // warm gold
const C_TEXT     = [175, 168, 158];
const C_MUTED    = [90,  84,  76 ];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  noStroke();
  loadLevel(0);
}

// ---- level loading ----

function loadLevel(idx) {
  levelIdx = idx;
  level    = LEVELS[idx];

  let rows = level.map.length;
  let cols = level.map[0].length;

  // tile size that fits the canvas - leave a small margin
  TILE = floor(min((width  * 0.96) / cols,
                   (height * 0.96) / rows));

  OX = floor((width  - cols * TILE) / 2);
  OY = floor((height - rows * TILE) / 2);

  collected  = new Set();
  totalNodes = 0;

  // scan map: count nodes, find player start
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let t = level.map[r][c];
      if (t === T_NODE)  totalNodes++;
      if (t === T_START) { startX = OX + c * TILE + TILE / 2;
                           startY = OY + r * TILE + TILE / 2; }
    }
  }

  player.x    = startX;
  player.y    = startY;
  player.dx   = 0;
  player.dy   = 0;
  player.size = TILE * 0.48;

  lastDX = 1; lastDY = 0;
  hitFlash   = 0;
}

// ---- tile helpers ----

function tileAt(px, py) {
  let col = floor((px - OX) / TILE);
  let row = floor((py - OY) / TILE);
  let map = level.map;
  if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return T_WALL;
  return map[row][col];
}

function isWall(px, py) {
  return tileAt(px, py) === T_WALL;
}

// ---- main loop ----

function draw() {
  background(...C_WALL_D);

  if (gameState === 'title') {
    drawTiles();
    drawPlayer();
    drawTitleCard();
    titleTimer++;
    if (titleTimer > 110) gameState = 'play';
    return;
  }

  if (gameState === 'end') {
    drawEndScreen();
    return;
  }

  // trans_out: fade to black, then load next level and flip to trans_in
  if (gameState === 'trans_out') {
    drawTiles();
    drawPlayer();
    drawHUD();
    transAlpha = min(transAlpha + TRANS_SPEED, 255);
    fill(0, 0, 0, transAlpha);
    noStroke();
    rect(0, 0, width, height);
    if (transAlpha >= 255) {
      if (levelIdx + 1 < LEVELS.length) {
        loadLevel(levelIdx + 1);
        titleTimer  = 0;
        gameState   = 'trans_in';
        transAlpha  = 255;
      } else {
        gameState = 'end';
      }
    }
    return;
  }

  if (gameState === 'trans_in') {
    drawTiles();
    drawPlayer();
    drawHUD();
    transAlpha = max(transAlpha - TRANS_SPEED, 0);
    fill(0, 0, 0, transAlpha);
    noStroke();
    rect(0, 0, width, height);
    // show level label as it fades in
    if (transAlpha > 80) {
      textSize(constrain(width * 0.038, 18, 34));
      textAlign(CENTER, CENTER);
      fill(255, 255, 255, transAlpha * 0.8);
      text(level.name, width / 2, height / 2);
    }
    if (transAlpha <= 0) gameState = 'play';
    return;
  }

  // ---- gameState === 'play' ----
  movePlayer();
  checkTile();
  drawTiles();
  drawPlayer();
  drawHUD();

  // red flash on hazard hit
  if (hitFlash > 0) {
    fill(200, 30, 40, map(hitFlash, 0, HIT_DUR, 0, 90));
    noStroke();
    rect(0, 0, width, height);
    hitFlash--;
  }
}

// ---- movement + collision ----

function movePlayer() {
  let spd   = TILE * 0.065;
  let vx    = 0, vy = 0;

  if (keyIsDown(LEFT_ARROW)  || keyIsDown(65)) vx = -spd;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) vx =  spd;
  if (keyIsDown(UP_ARROW)    || keyIsDown(87)) vy = -spd;
  if (keyIsDown(DOWN_ARROW)  || keyIsDown(83)) vy =  spd;

  // save last direction for the facing indicator
  if (vx !== 0 || vy !== 0) { lastDX = vx; lastDY = vy; }

  let hw = player.size * 0.46;

  // x and y resolved independently - lets player slide along walls
  if (vx !== 0) {
    let ex = vx > 0 ? player.x + hw + vx : player.x - hw + vx;
    if (!isWall(ex, player.y - hw + 1) && !isWall(ex, player.y + hw - 1)) {
      player.x += vx;
    }
  }
  if (vy !== 0) {
    let ey = vy > 0 ? player.y + hw + vy : player.y - hw + vy;
    if (!isWall(player.x - hw + 1, ey) && !isWall(player.x + hw - 1, ey)) {
      player.y += vy;
    }
  }
}

// ---- tile interaction (collect nodes, trigger hazard/exit) ----

function checkTile() {
  let col = floor((player.x - OX) / TILE);
  let row = floor((player.y - OY) / TILE);
  let key = `${row},${col}`;
  let map = level.map;
  if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return;

  let t = map[row][col];

  if (t === T_NODE && !collected.has(key)) {
    collected.add(key);
  }

  if (t === T_HAZARD) {
    player.x = startX;
    player.y = startY;
    hitFlash  = HIT_DUR;
  }

  if (t === T_EXIT && collected.size >= totalNodes) {
    gameState  = 'trans_out';
    transAlpha = 0;
  }
}

// ---- tile renderer (this is the assignment - loop over the array) ----

function drawTiles() {
  let rows = level.map.length;
  let cols = level.map[0].length;

  // loop over every cell in the 2D array and draw the matching tile type
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let tile = level.map[r][c];
      let x    = OX + c * TILE;
      let y    = OY + r * TILE;

      drawTile(tile, x, y, r, c);
    }
  }
}

function drawTile(tile, x, y, r, c) {
  let cx = x + TILE / 2;
  let cy = y + TILE / 2;

  if (tile === T_WALL) {
    // dark block - faint lighter inner line for texture
    fill(...C_WALL_D);
    noStroke();
    rect(x, y, TILE, TILE);
    stroke(...C_WALL_L);
    strokeWeight(1);
    noFill();
    rect(x + 2, y + 2, TILE - 4, TILE - 4);
    noStroke();
    return;
  }

  // all non-wall tiles: draw floor base first
  fill(...C_FLOOR);
  noStroke();
  rect(x, y, TILE, TILE);
  // faint grid border
  stroke(...C_FLOOR_G);
  strokeWeight(0.5);
  noFill();
  rect(x, y, TILE, TILE);
  noStroke();

  if (tile === T_FLOOR || tile === T_START) return;  // just floor

  if (tile === T_NODE) {
    // skip already-collected nodes - show empty floor
    if (collected.has(`${r},${c}`)) return;

    // pulsing glow
    let pulse = 0.78 + 0.22 * sin(frameCount * 0.048 + r * 0.7 + c * 0.5);
    let gr    = TILE * 0.7 * pulse;
    let ctx   = drawingContext;
    let glow  = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr);
    glow.addColorStop(0,   `rgba(0, 215, 190, ${0.38 * pulse})`);
    glow.addColorStop(0.5, `rgba(0, 200, 175, ${0.14 * pulse})`);
    glow.addColorStop(1,   'rgba(0, 200, 175, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - gr, cy - gr, gr * 2, gr * 2);

    // inner orb
    let rs = TILE * 0.16 * pulse;
    fill(180, 255, 248);
    noStroke();
    ellipse(cx, cy, rs * 2, rs * 2);
    fill(0, 215, 190);
    ellipse(cx, cy, rs * 3.2, rs * 3.2);
    fill(0, 215, 190, 80);
    ellipse(cx, cy, rs * 5, rs * 5);
    return;
  }

  if (tile === T_HAZARD) {
    // red-tinted floor
    fill(38, 12, 16);
    noStroke();
    rect(x, y, TILE, TILE);

    // animated X - flickers
    let flick = 0.65 + 0.35 * sin(frameCount * 0.18 + c * 1.3);
    let m     = TILE * 0.22;
    stroke(215, 48, 62, 220 * flick);
    strokeWeight(constrain(TILE * 0.045, 1.5, 3));
    line(x + m, y + m, x + TILE - m, y + TILE - m);
    line(x + TILE - m, y + m, x + m, y + TILE - m);
    noStroke();

    // subtle red corner glow
    let ctx  = drawingContext;
    let ghaz = ctx.createRadialGradient(cx, cy, 0, cx, cy, TILE * 0.55);
    ghaz.addColorStop(0, 'rgba(215, 48, 62, 0.22)');
    ghaz.addColorStop(1, 'rgba(215, 48, 62, 0)');
    ctx.fillStyle = ghaz;
    ctx.fillRect(x, y, TILE, TILE);
    return;
  }

  if (tile === T_EXIT) {
    let active = collected.size >= totalNodes;
    let col    = active ? C_EXIT_A : C_EXIT_D;

    // tinted floor
    fill(active ? 10 : 14, active ? 28 : 16, active ? 14 : 20);
    noStroke();
    rect(x, y, TILE, TILE);

    if (active) {
      // radial exit glow
      let pulse  = 0.8 + 0.2 * sin(frameCount * 0.055);
      let ctx    = drawingContext;
      let gexit  = ctx.createRadialGradient(cx, cy, 0, cx, cy, TILE * 0.9 * pulse);
      gexit.addColorStop(0,   `rgba(45, 230, 105, ${0.45 * pulse})`);
      gexit.addColorStop(0.6, `rgba(45, 230, 105, ${0.12 * pulse})`);
      gexit.addColorStop(1,   'rgba(45, 230, 105, 0)');
      ctx.fillStyle = gexit;
      ctx.fillRect(x - TILE * 0.4, y - TILE * 0.4, TILE * 1.8, TILE * 1.8);

      // expanding ring animation
      let ringR = (frameCount * 1.4 % (TILE * 1.0));
      stroke(45, 230, 105, map(ringR, 0, TILE, 160, 0));
      strokeWeight(1.5);
      noFill();
      ellipse(cx, cy, ringR * 2, ringR * 2);
      noStroke();
    }

    // portal circle
    stroke(...col, active ? 200 : 90);
    strokeWeight(constrain(TILE * 0.04, 1.5, 2.5));
    noFill();
    ellipse(cx, cy, TILE * 0.52, TILE * 0.52);
    // inner dot
    fill(...col, active ? 200 : 80);
    noStroke();
    ellipse(cx, cy, TILE * 0.14, TILE * 0.14);
  }
}

// ---- player renderer ----

function drawPlayer() {
  let px = player.x, py = player.y;
  let s  = player.size;

  // outer glow
  let ctx  = drawingContext;
  let gp   = ctx.createRadialGradient(px, py, 0, px, py, s * 1.8);
  gp.addColorStop(0,   'rgba(255, 195, 45, 0.32)');
  gp.addColorStop(0.5, 'rgba(255, 195, 45, 0.10)');
  gp.addColorStop(1,   'rgba(255, 195, 45, 0)');
  ctx.fillStyle = gp;
  ctx.fillRect(px - s * 2, py - s * 2, s * 4, s * 4);

  // body square
  fill(...C_PLAYER);
  noStroke();
  let hw = s * 0.42;
  rect(px - hw, py - hw, hw * 2, hw * 2, constrain(TILE * 0.06, 2, 5));

  // direction indicator - small bright dot on the leading edge
  let mag  = sqrt(lastDX * lastDX + lastDY * lastDY);
  let ndx  = mag > 0 ? lastDX / mag : 1;
  let ndy  = mag > 0 ? lastDY / mag : 0;
  fill(255, 240, 180);
  ellipse(px + ndx * hw * 0.7, py + ndy * hw * 0.7,
          constrain(TILE * 0.09, 3, 7),
          constrain(TILE * 0.09, 3, 7));
}

// ---- HUD ----

function drawHUD() {
  let sz    = constrain(width * 0.020, 10, 16);
  let allIn = collected.size >= totalNodes;

  textSize(sz);
  noStroke();

  // level name - top left
  textAlign(LEFT, TOP);
  fill(...C_MUTED);
  text(level.name, 14, 12);

  // node count - top right
  textAlign(RIGHT, TOP);
  fill(allIn ? color(...C_EXIT_A) : color(...C_NODE));
  text(`NODES  ${collected.size} / ${totalNodes}`, width - 14, 12);

  // prompt when all nodes in - blinking
  if (allIn) {
    let blink = floor(frameCount / 20) % 2 === 0;
    if (blink) {
      textSize(constrain(width * 0.016, 8, 13));
      textAlign(CENTER, BOTTOM);
      fill(...C_EXIT_A);
      text('exit active - reach the portal', width / 2, height - 12);
    }
  }

  // wasd hint on first level only, fades out after 200 frames
  if (levelIdx === 0 && frameCount < 200) {
    let a = frameCount < 120 ? 255 : map(frameCount, 120, 200, 255, 0);
    textSize(constrain(width * 0.015, 7, 12));
    textAlign(CENTER, BOTTOM);
    fill(...C_MUTED, a);
    text('wasd / arrow keys to move', width / 2, height - constrain(height * 0.04, 22, 32));
  }
}

// ---- title card (shown briefly at start + between levels) ----

function drawTitleCard() {
  let a = titleTimer < 20  ? map(titleTimer, 0,  20,  0, 255) :
          titleTimer > 80  ? map(titleTimer, 80, 110, 255, 0) : 255;

  fill(0, 0, 0, a * 0.75);
  noStroke();
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  textSize(constrain(width * 0.038, 18, 32));
  fill(255, 255, 255, a);
  text('GRID  RUNNER', width / 2, height * 0.44);

  textSize(constrain(width * 0.022, 10, 18));
  fill(...C_MUTED, a);
  text('collect all nodes to activate the exit', width / 2, height * 0.56);
}

// ---- end screen ----

function drawEndScreen() {
  background(...C_WALL_D);

  textAlign(CENTER, CENTER);
  noStroke();

  textSize(constrain(width * 0.016, 8, 13));
  fill(...C_MUTED);
  text('GRID  RUNNER', width / 2, height * 0.28);

  textSize(constrain(width * 0.046, 22, 42));
  fill(...C_EXIT_A);
  text('ALL SECTORS CLEAR', width / 2, height * 0.42);

  textSize(constrain(width * 0.024, 11, 19));
  fill(...C_TEXT);
  text('signal fully restored', width / 2, height * 0.54);

  // play again
  let btnW = constrain(width * 0.22, 120, 200);
  let btnH = constrain(height * 0.07, 36, 50);
  let bx   = width / 2 - btnW / 2;
  let by   = height * 0.66;
  let hov  = mouseX > bx && mouseX < bx + btnW && mouseY > by && mouseY < by + btnH;

  fill(hov ? color(...C_FLOOR_G) : color(10, 12, 18));
  stroke(40, 38, 35);
  strokeWeight(1);
  rect(bx, by, btnW, btnH, 4);
  noStroke();

  textSize(constrain(width * 0.022, 10, 18));
  fill(hov ? color(...C_EXIT_A) : color(...C_TEXT));
  text('play again', width / 2, by + btnH / 2);
}

function mousePressed() {
  if (gameState === 'end') {
    loadLevel(0);
    titleTimer = 0;
    gameState  = 'title';
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  loadLevel(levelIdx);  // recompute TILE + offsets for new canvas size
}
