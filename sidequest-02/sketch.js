// sidequest 02 - joyful blob
// base: GBDA302 W2 Example 03 (platformer with AABB collision)
// redesigned for joy: floaty gravity, big jumps, squash/stretch, pastel world
// bonus: mischief mechanic - bump the little bubble items off the platforms

// ---- colour palette - easy to swap from one place ----
const BG_TOP    = [210, 232, 255]; // soft sky blue
const BG_BOT    = [255, 230, 200]; // warm peach at the horizon
const BLOB_COL  = [255, 210, 55];  // sunshine yellow - main character
const FLOOR_COL = [255, 165, 120]; // coral floor
const PLAT_COLS = [
  [185, 155, 255], // lavender
  [120, 215, 195], // seafoam
  [255, 185, 150], // peach
  [145, 205, 255], // sky blue
];

let floorY;

let blob = {
  x: 80, y: 0,

  r: 28,
  points: 52,
  wobble: 9,        // medium deformation - rounds out with the low freq
  wobbleFreq: 0.32, // LOW = few big smooth bumps, not many small nervous ones
  t: 0,
  tSpeed: 0.009,    // slow graceful animation - joy is confident, not jittery

  vx: 0, vy: 0,
  accel: 0.7,       // snappy - joy is responsive
  maxRun: 5.5,      // zippy
  gravity: 0.45,    // light - joy is floaty
  jumpV: -13.5,     // big generous jump

  onGround: false,
  frictionAir: 0.998,
  frictionGround: 0.90, // a little slidey - playful feel

  squash: 0,        // >0 = squashed wide on land, <0 = stretched tall on jump
};

let platforms = [];
let items = [];    // the mischievous little bubble guys

function setup() {
  createCanvas(640, 360);
  floorY = height - 40;

  noStroke();
  textFont('sans-serif');
  textSize(13);

  blob.y = floorY - blob.r - 1;

  // colorful platforms - each gets its own pastel
  platforms = [
    { x: 0,   y: floorY,       w: width, h: height - floorY, col: FLOOR_COL },
    { x: 100, y: floorY - 75,  w: 130,   h: 12, col: PLAT_COLS[0] },
    { x: 290, y: floorY - 130, w: 100,   h: 12, col: PLAT_COLS[1] },
    { x: 430, y: floorY - 195, w: 140,   h: 12, col: PLAT_COLS[2] },
    { x: 510, y: floorY - 80,  w: 100,   h: 12, col: PLAT_COLS[3] },
  ];

  spawnItems();
}

// little bubble items to bump around - the mischief bonus
function spawnItems() {
  let ir = 10; // item radius
  items = [
    makeItem(60,  floorY - ir,          [255, 120, 160]), // pink
    makeItem(220, floorY - ir,          [120, 200, 255]), // blue
    makeItem(400, floorY - ir,          [160, 240, 140]), // mint
    makeItem(155, floorY - 75 - ir,     [200, 140, 255]), // on lavender step
    makeItem(335, floorY - 130 - ir,    [130, 220, 175]), // on seafoam step
    makeItem(490, floorY - 195 - ir,    [255, 160, 120]), // on peach step
    makeItem(552, floorY - 80 - ir,     [160, 215, 255]), // on sky step
  ];
}

function makeItem(x, y, col) {
  return { x, y, r: 10, vx: 0, vy: 0, col, bumped: false };
}

function draw() {
  drawBg();

  // platforms with rounded corners - friendlier than sharp rects
  for (const p of platforms) {
    fill(...p.col);
    rect(p.x, p.y, p.w, p.h, 8);
  }

  // horizontal input
  let move = 0;
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW))  move -= 1; // A or left
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) move += 1; // D or right

  blob.vx += blob.accel * move;
  blob.vx *= blob.onGround ? blob.frictionGround : blob.frictionAir;
  blob.vx  = constrain(blob.vx, -blob.maxRun, blob.maxRun);
  blob.vy += blob.gravity;

  // AABB collision box (same approach as example 03)
  let box = { x: blob.x - blob.r, y: blob.y - blob.r, w: blob.r * 2, h: blob.r * 2 };

  // X pass
  box.x += blob.vx;
  for (const s of platforms) {
    if (overlap(box, s)) {
      if (blob.vx > 0) box.x = s.x - box.w;
      else if (blob.vx < 0) box.x = s.x + s.w;
      blob.vx = 0;
    }
  }

  // Y pass
  let wasOnGround = blob.onGround;
  box.y += blob.vy;
  blob.onGround = false;

  for (const s of platforms) {
    if (overlap(box, s)) {
      if (blob.vy > 0) {
        box.y = s.y - box.h;
        blob.vy = 0;
        blob.onGround = true;
      } else if (blob.vy < 0) {
        box.y = s.y + s.h;
        blob.vy = 0;
      }
    }
  }

  // squash on landing, stretch on jump (triggered in keyPressed)
  if (!wasOnGround && blob.onGround) blob.squash = 2.2; // pancake on landing

  blob.x = box.x + box.w / 2;
  blob.y = box.y + box.h / 2;
  blob.x = constrain(blob.x, blob.r, width - blob.r);

  blob.t += blob.tSpeed;

  // items before the blob so blob draws on top
  updateItems();
  drawBlob(blob);

  drawHUD();
}

function drawBg() {
  let ctx = drawingContext;
  let g = ctx.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, `rgb(${BG_TOP.join(',')})`);
  g.addColorStop(1, `rgb(${BG_BOT.join(',')})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

function drawBlob(b) {
  push();

  // idle bop - rhythmic vertical bounce, always going, very much a vibe
  let bopY  = sin(frameCount * 0.08) * 6;
  // tiny side sway for that jiving feeling
  let bopX  = sin(frameCount * 0.05) * 2.5;
  // lean in the direction of movement - leans harder the faster it goes
  let lean  = b.vx * 0.045;

  translate(b.x + bopX, b.y + bopY);
  rotate(lean);

  // squash/stretch - MUCH more dramatic, slow decay so you can see it
  let sx = 1 + b.squash * 0.55;  // way wider when landing
  let sy = 1 - b.squash * 0.45;  // way flatter when landing
  scale(sx, sy);
  b.squash *= 0.76; // slower decay = squash hangs around longer

  // gentle breathing pulse on top of the noise wobble
  let breathe = sin(b.t * 7) * 2.5;

  fill(...BLOB_COL);
  beginShape();
  for (let i = 0; i < b.points; i++) {
    const a = (i / b.points) * TAU;
    const n = noise(
      cos(a) * b.wobbleFreq + 100,
      sin(a) * b.wobbleFreq + 100,
      b.t
    );
    const r = b.r + breathe + map(n, 0, 1, -b.wobble, b.wobble);
    vertex(cos(a) * r, sin(a) * r);
  }
  endShape(CLOSE);

  // glossy highlight - bubbly and round
  fill(255, 255, 255, 140);
  ellipse(-b.r * 0.28, -b.r * 0.32, b.r * 0.55, b.r * 0.42);

  pop();
}

function updateItems() {
  for (let item of items) {
    if (!item.bumped) {
      // circle-circle distance check - cleaner than AABB for round things
      if (dist(blob.x, blob.y, item.x, item.y) < blob.r + item.r) {
        // launch away from the blob, inheriting some of its speed
        let dir = item.x >= blob.x ? 1 : -1;
        item.vx = dir * (3.5 + abs(blob.vx) * 0.6);
        item.vy = -6.5;
        item.bumped = true;
      }
    } else {
      // little physics for bumped items
      item.vy += 0.5;
      item.vx *= 0.99;
      item.x  += item.vx;
      item.y  += item.vy;
    }

    // draw while on screen
    if (item.y < height + 40) {
      noStroke();
      fill(...item.col);
      ellipse(item.x, item.y, item.r * 2, item.r * 2);

      // little shine spot for bubble look
      fill(255, 255, 255, 155);
      ellipse(item.x - item.r * 0.3, item.y - item.r * 0.35, item.r * 0.5, item.r * 0.45);
    }
  }
}

function drawHUD() {
  let bumped = items.filter(i => i.bumped).length;
  fill(80, 55, 110, 210);
  text(`bumped: ${bumped} / ${items.length}   |   move: A/D or arrows   jump: space / W / up`, 10, 18);
}

// AABB overlap test - straight from example 03
function overlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function keyPressed() {
  if (
    (key === ' ' || key === 'W' || key === 'w' || keyCode === UP_ARROW) &&
    blob.onGround
  ) {
    blob.vy = blob.jumpV;
    blob.onGround = false;
    blob.squash = -1.1; // tall and thin on jump - very dramatic stretch
  }
}
