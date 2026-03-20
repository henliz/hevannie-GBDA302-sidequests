// sidequest 01 - cherry blossom splash
// sakura petals falling into an ocean.. that's the whole vision
// pastel blue sky, seafoam waves, pink petals, soft everything

let petals = [];
let waveOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);

  // scatter petals on load so it doesn't start empty and sad
  for (let i = 0; i < 90; i++) {
    petals.push(new Petal(true));
  }
}

function draw() {
  drawSky();
  drawWaves();

  for (let p of petals) {
    p.update();
    p.show();
  }

  drawSplash();

  waveOffset += 0.009;
}

// soft pastel sky - cornflower blue fading into lavender into seafoam
function drawSky() {
  let ctx = drawingContext;
  let grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0,    'hsl(212, 52%, 88%)');  // soft cornflower
  grad.addColorStop(0.45, 'hsl(268, 28%, 91%)');  // lavender whisper
  grad.addColorStop(1,    'hsl(168, 38%, 84%)');  // seafoam horizon
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

// layered ocean waves - front ones are more opaque and lower
function drawWaves() {
  let layers = [
    { baseY: 0.76, amp: 20, freq: 0.011, speed: 0.9,  col: 'hsla(168, 44%, 72%, 0.32)' },
    { baseY: 0.80, amp: 15, freq: 0.014, speed: 1.3,  col: 'hsla(192, 50%, 74%, 0.42)' },
    { baseY: 0.84, amp: 12, freq: 0.017, speed: 0.75, col: 'hsla(178, 46%, 68%, 0.52)' },
    { baseY: 0.88, amp: 9,  freq: 0.021, speed: 1.1,  col: 'hsla(183, 48%, 66%, 0.64)' },
    { baseY: 0.92, amp: 6,  freq: 0.025, speed: 1.5,  col: 'hsla(172, 52%, 62%, 0.78)' },
  ];

  for (let lyr of layers) {
    let ctx = drawingContext;
    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let x = 0; x <= width; x += 3) {
      let y = height * lyr.baseY + sin(x * lyr.freq + waveOffset * lyr.speed) * lyr.amp;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = lyr.col;
    ctx.fill();
  }
}

// cherry blossom petals - falling not floating, different vibe
class Petal {
  constructor(scatter = false) {
    this.init(scatter);
  }

  init(scatter = false) {
    this.x          = random(width);
    this.y          = scatter ? random(height * 0.85) : random(-30, -5);
    this.size       = random(7, 17);
    this.vx         = random(-0.4, 0.4);
    this.vy         = random(0.5, 1.3);   // drifting down
    this.hue        = random(330, 358);   // blush pink range
    this.sat        = random(18, 50);     // low sat = pastel
    this.bri        = random(88, 98);     // high brightness keeps them light
    this.alpha      = random(52, 82);
    this.angle      = random(TWO_PI);
    this.spin       = random(-0.018, 0.018);
    this.swaySpeed  = random(0.006, 0.016);
    this.swayAmt    = random(0.3, 0.8);
    this.swayOffset = random(TWO_PI);
  }

  update() {
    this.x     += this.vx + sin(frameCount * this.swaySpeed + this.swayOffset) * this.swayAmt;
    this.y     += this.vy;
    this.angle += this.spin;

    if (this.y > height + 25) this.init();
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    noStroke();

    // main petal body
    fill(this.hue, this.sat, this.bri, this.alpha);
    ellipse(0, 0, this.size * 0.65, this.size);

    // second ellipse offset slightly for that little notch-at-the-tip look
    fill(this.hue, this.sat - 6, this.bri + 2, this.alpha * 0.55);
    ellipse(this.size * 0.14, 0, this.size * 0.5, this.size * 0.75);
    pop();
  }
}

function drawSplash() {
  textAlign(CENTER, CENTER);
  let cx = width / 2;
  let cy = height * 0.40;

  // soft pink glow cloud behind the text - not too dramatic
  noStroke();
  for (let i = 5; i >= 1; i--) {
    fill(335, 30, 97, i * 4.5);
    ellipse(cx, cy, 380 * i * 0.26, 170 * i * 0.26);
  }

  // main name - deep dusty blue so it reads on the light bg
  textStyle(BOLD);
  textSize(constrain(width * 0.086, 24, 84));
  fill(225, 38, 48, 94);
  text('hevannie', cx, cy - height * 0.055);

  // course label in a softer tone
  textStyle(NORMAL);
  textSize(constrain(width * 0.026, 10, 24));
  fill(200, 30, 52, 76);
  text('GBDA302  ·  sidequests', cx, cy + height * 0.022);

  // thin divider - barely there, just vibes
  stroke(335, 22, 72, 38);
  strokeWeight(1);
  let lw = constrain(width * 0.22, 70, 200);
  line(cx - lw / 2, cy + height * 0.062, cx + lw / 2, cy + height * 0.062);

  // the little message - main character energy, no overdoing it
  noStroke();
  textSize(constrain(width * 0.02, 9, 17));
  fill(290, 22, 52, 68);
  textStyle(ITALIC);
  text('this.. this is my sidequest 1, the setup screen – enjoy :)', cx, cy + height * 0.1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
