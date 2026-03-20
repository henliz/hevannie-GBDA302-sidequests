// sketch.js - sidequest 05: drift
// top-down balloon camera over a northern landscape at night
// move the mouse to steer - the camera lazily drifts, like a hot air balloon
// float directly over things to discover them

const WORLD_W = 3600;
const WORLD_H = 2800;

// ---- camera ----
let camX, camY;
let breatheT = 0;

// ---- world layers ----
let bgStars      = [];
let forestTrees  = [];
let solTrees     = [];   // solitary scattered trees
let villageHouses = [];
let riverCurve   = [];
let fieldShapes  = [];
let discoveries  = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  noStroke();
  camX = 740;
  camY = 1340;   // start near the village

  buildStars();
  buildFields();
  buildForests();
  buildSolitaryTrees();
  buildVillage();
  buildRiver();
  buildDiscoveries();
}

// ---- generation ----

function buildStars() {
  bgStars = [];
  for (let i = 0; i < 500; i++) {
    bgStars.push({
      wx: random(WORLD_W), wy: random(WORLD_H),
      r: random(0.5, 2.1), phase: random(TWO_PI),
    });
  }
}

function buildFields() {
  fieldShapes = [
    { pts: [[280,640],[960,620],[990,1080],[260,1100]],   col: [8, 13, 7]  },
    { pts: [[1080,560],[1760,540],[1790,920],[1060,940]], col: [9, 11, 6]  },
    { pts: [[1820,1280],[2560,1260],[2540,1720],[1800,1740]], col: [7,12,8] },
    { pts: [[360,1480],[940,1460],[960,1960],[340,1980]], col: [10,12, 7]  },
    { pts: [[2120,560],[2740,545],[2760,900],[2100,915]], col: [8, 10, 6]  },
    { pts: [[580,2080],[1460,2060],[1480,2500],[560,2510]], col: [9,13, 8] },
    { pts: [[1100,1700],[1700,1680],[1720,2100],[1080,2120]], col: [8,12,7] },
  ];
}

function buildForests() {
  forestTrees = [];
  let clusters = [
    { cx: 460,  cy: 330,  rx: 250, ry: 180, n: 80  },
    { cx: 2680, cy: 1880, rx: 310, ry: 210, n: 95  },
    { cx: 1720, cy: 2250, rx: 210, ry: 150, n: 60  },
    { cx: 200,  cy: 1880, rx: 155, ry: 120, n: 42  },
    { cx: 3150, cy: 680,  rx: 220, ry: 165, n: 65  },
    { cx: 2960, cy: 2360, rx: 170, ry: 130, n: 46  },
    { cx: 1300, cy: 380,  rx: 180, ry: 130, n: 50  },
  ];
  for (let cl of clusters) {
    for (let i = 0; i < cl.n; i++) {
      let a = random(TWO_PI), d = sqrt(random());
      forestTrees.push({
        x: cl.cx + cos(a) * d * cl.rx,
        y: cl.cy + sin(a) * d * cl.ry,
        r: random(16, 40),
      });
    }
  }
}

function buildSolitaryTrees() {
  solTrees = [];
  for (let i = 0; i < 55; i++) {
    solTrees.push({
      wx: random(200, WORLD_W - 200),
      wy: random(200, WORLD_H - 200),
      r: random(9, 18),
    });
  }
}

function buildVillage() {
  villageHouses = [];
  let cx = 930, cy = 1640;
  let slots = [
    [-130,-95],[ 20,-100],[145, -50],[-200,-20],
    [ 70,  -5],[-60,  65],[165,  75],[-150, 100],
    [  5, 110],[120, 140],[-60, 175],[ 80, 185],
  ];
  for (let [dx, dy] of slots) {
    let w = random(22, 42), h = random(14, 27);
    villageHouses.push({
      x: cx + dx - w / 2, y: cy + dy - h / 2,
      w, h,
      lit:   random() > 0.20,
      phase: random(TWO_PI),
      tall:  random() < 0.12,   // one or two taller buildings (church-like)
    });
  }
}

function buildRiver() {
  riverCurve = [
    { x: -50,        y: 1340 },
    { x: 530,        y: 1180 },
    { x: 1080,       y: 1020 },
    { x: 1640,       y: 980  },
    { x: 2150,       y: 1060 },
    { x: 2640,       y: 1180 },
    { x: 3020,       y: 1100 },
    { x: WORLD_W+50, y: 1160 },
  ];
}

function buildDiscoveries() {
  discoveries = [];

  // --- 1: campfire with huddled figures ---
  discoveries.push({
    wx: 740, wy: 2020, radius: 460, label: 'a campfire',
    drawFn(wx, wy, a) {
      let ctx   = drawingContext;
      let pulse = 0.8 + 0.2 * sin(frameCount * 0.09);
      let g     = ctx.createRadialGradient(wx, wy, 0, wx, wy, 90 * pulse);
      g.addColorStop(0, `rgba(215,95,18,${a/255 * 0.6 * pulse})`);
      g.addColorStop(1, 'rgba(215,95,18,0)');
      ctx.save(); ctx.fillStyle = g; ctx.fillRect(wx-100, wy-100, 200, 200); ctx.restore();

      let f = frameCount;
      fill(195, 65, 12, a);   ellipse(wx, wy, 10+sin(f*0.17)*3, 15+sin(f*0.13)*5);
      fill(225, 155, 32, a*0.85); ellipse(wx, wy-5, 6, 10);
      fill(248, 228, 100, a*0.65); ellipse(wx, wy-9, 3, 5);

      // seated figures around the fire
      let seats = [[-22,14],[22,14],[0,-22]];
      for (let [sx, sy] of seats) {
        fill(18, 14, 10, a);
        noStroke();
        ellipse(wx+sx, wy+sy, 10, 8);        // body blob
        ellipse(wx+sx, wy+sy-6, 7, 7);       // head
      }
    },
  });

  // --- 2: owl in the north forest ---
  discoveries.push({
    wx: 448, wy: 298, radius: 390, label: 'an owl',
    drawFn(wx, wy, a) {
      let blink   = floor(frameCount / 80) % 9 === 0;
      let headT   = sin(frameCount * 0.008) * 10;
      let hx      = wx + headT * 0.4;

      // body
      fill(52, 42, 30, a); noStroke();
      ellipse(wx, wy+2, 24, 30);
      // wing hints
      fill(42, 33, 22, a);
      ellipse(wx - 13, wy+4, 10, 22);
      ellipse(wx + 13, wy+4, 10, 22);
      // head
      fill(62, 50, 36, a);
      ellipse(hx, wy-13, 20, 20);
      // ear tufts
      fill(52, 42, 30, a);
      triangle(hx-7, wy-20, hx-4, wy-28, hx-1, wy-20);
      triangle(hx+7, wy-20, hx+4, wy-28, hx+1, wy-20);
      // facial disc
      fill(88, 74, 56, a*0.6);
      ellipse(hx, wy-12, 16, 16);
      // eyes
      if (!blink) {
        fill(240, 205, 45, a);
        ellipse(hx-5, wy-13, 7, 7);
        ellipse(hx+5, wy-13, 7, 7);
        fill(8, 8, 8, a);
        ellipse(hx-4.5, wy-13, 3.5, 3.5);
        ellipse(hx+5.5, wy-13, 3.5, 3.5);
      } else {
        stroke(52, 42, 30, a); strokeWeight(1.5);
        line(hx-7, wy-13, hx-3, wy-13);
        line(hx+3, wy-13, hx+7, wy-13);
        noStroke();
      }
      // perch branch
      stroke(38, 28, 18, a*0.7); strokeWeight(3);
      line(wx-28, wy+14, wx+28, wy+14);
      noStroke();
    },
  });

  // --- 3: firefly field ---
  let flies = Array.from({length:28}, (_,i) => ({
    ox: random(-110,110), oy: random(-80,80),
    phase: random(TWO_PI), spd: random(0.035,0.085),
  }));
  discoveries.push({
    wx: 2060, wy: 1520, radius: 500, label: 'fireflies',
    drawFn(wx, wy, a) {
      for (let f of flies) {
        let fx    = wx + f.ox + sin(frameCount*f.spd + f.phase)*28;
        let fy    = wy + f.oy + cos(frameCount*f.spd*0.7 + f.phase)*18;
        let pulse = 0.5 + 0.5 * sin(frameCount*0.07 + f.phase);
        noStroke();
        fill(150, 230, 85, a * pulse);    ellipse(fx, fy, 4, 4);
        fill(150, 230, 85, a*0.18*pulse); ellipse(fx, fy, 18, 18);
      }
    },
  });

  // --- 4: lighthouse on the lake shore ---
  discoveries.push({
    wx: 2400, wy: 495, radius: 430, label: 'a lighthouse',
    drawFn(wx, wy, a) {
      fill(30, 24, 18, a); noStroke();
      rect(wx-6, wy-32, 12, 32, 2);
      rect(wx-9, wy, 18, 8, 1);       // base

      let ba = frameCount * 0.04;
      let ctx = drawingContext;
      ctx.save();
      for (let side of [-1,1]) {
        let ang = ba * side;
        let bx  = wx + cos(ang)*110, by = (wy-28) + sin(ang)*110;
        let bg  = ctx.createLinearGradient(wx, wy-28, bx, by);
        bg.addColorStop(0, `rgba(245,220,130,${a/255*0.5})`);
        bg.addColorStop(1, 'rgba(245,220,130,0)');
        ctx.strokeStyle = bg; ctx.lineWidth = 18;
        ctx.beginPath(); ctx.moveTo(wx, wy-28); ctx.lineTo(bx, by); ctx.stroke();
      }
      ctx.restore();
      noStroke();
      fill(250, 230, 140, a); ellipse(wx, wy-30, 10, 10);
    },
  });

  // --- 5: fox wandering in the south field ---
  discoveries.push({
    wx: 1320, wy: 2180, radius: 430, label: 'a fox',
    drawFn(wx, wy, a) {
      let phase = frameCount * 0.018;
      let fx    = wx + sin(phase) * 50;
      let bob   = abs(sin(phase * 2)) * 2.5;
      let dir   = cos(phase) > 0 ? 1 : -1;

      noStroke();
      // body
      fill(185, 90, 28, a);
      ellipse(fx, wy+bob, 32, 17);
      // head
      fill(200, 105, 35, a);
      ellipse(fx + dir*16, wy-2+bob, 17, 15);
      // snout
      fill(215, 160, 110, a);
      ellipse(fx + dir*23, wy+1+bob, 11, 8);
      // nose
      fill(30, 18, 12, a);
      ellipse(fx + dir*27, wy+1+bob, 3, 2.5);
      // ear
      fill(185, 90, 28, a);
      triangle(fx+dir*13, wy-9+bob, fx+dir*17, wy-17+bob, fx+dir*20, wy-9+bob);
      // inner ear
      fill(220, 130, 110, a*0.7);
      triangle(fx+dir*14, wy-9+bob, fx+dir*17, wy-14+bob, fx+dir*19, wy-9+bob);
      // tail
      stroke(200, 110, 38, a); strokeWeight(7); noFill();
      bezier(fx-dir*15, wy+bob, fx-dir*28, wy-6+bob, fx-dir*24, wy-18+bob, fx-dir*14, wy-16+bob);
      noStroke();
      fill(245, 238, 225, a); ellipse(fx-dir*14, wy-16+bob, 8, 8); // tail tip
    },
  });

  // --- 6: northern lights bloom - a clearing where the aurora is vivid ---
  discoveries.push({
    wx: 1680, wy: 740, radius: 450, label: 'northern lights',
    drawFn(wx, wy, a) {
      let t   = frameCount * 0.009;
      let ctx = drawingContext;
      let curtains = [
        { dx:-110, col:[0,210,95],   w:70  },
        { dx: -45, col:[20,185,155], w:55  },
        { dx:  15, col:[0,220,80],   w:80  },
        { dx:  80, col:[70,155,210], w:60  },
        { dx: 140, col:[140,80,210], w:50  },
      ];
      for (let c of curtains) {
        let wave = sin(t + c.dx*0.02) * 36;
        let cx   = wx + c.dx + wave;
        for (let seg = 0; seg < 28; seg++) {
          let f0  = seg/28, f1 = (seg+1)/28;
          let sy0 = wy - 160 + f0*320, sy1 = wy - 160 + f1*320;
          let w0  = sin(t+c.dx*0.015+sy0*0.006)*30, w1 = sin(t+c.dx*0.015+sy1*0.006)*30;
          let mid = sin(f0*PI);
          fill(c.col[0], c.col[1], c.col[2], a * 0.48 * mid);
          noStroke();
          quad(cx+w0-c.w/2, sy0, cx+w0+c.w/2, sy0, cx+w1+c.w/2, sy1, cx+w1-c.w/2, sy1);
        }
      }
      // glow pool on ground
      let g = ctx.createRadialGradient(wx, wy, 0, wx, wy, 130);
      g.addColorStop(0, `rgba(0,200,90,${a/255*0.18})`);
      g.addColorStop(1, 'rgba(0,200,90,0)');
      ctx.save(); ctx.fillStyle = g; ctx.fillRect(wx-140, wy-140, 280, 280); ctx.restore();
    },
  });
}

// ---- main draw loop ----

function draw() {
  breatheT += 0.003;
  let bx = (noise(breatheT)      - 0.5) * 9;
  let by = (noise(breatheT + 10) - 0.5) * 9;

  let targetX = map(mouseX, 0, width,  0, WORLD_W - width)  + bx;
  let targetY = map(mouseY, 0, height, 0, WORLD_H - height) + by;
  camX = lerp(camX, targetX, 0.026);
  camY = lerp(camY, targetY, 0.026);

  push();
  translate(-camX, -camY);

  drawSky();
  drawFields();
  drawPaths();
  drawRiver();
  drawLake();
  drawSmallPond();
  drawForests();
  drawSolitaryTrees();
  drawVillage();
  drawDiscoveriesLayer();

  pop();

  drawVignette();
  drawHint();
}

// ---- sky: stars + aurora borealis ----

function drawSky() {
  // base sky
  fill(3, 4, 8);
  noStroke();
  rect(0, 0, WORLD_W, WORLD_H);

  // aurora bands - undulating vertical curtains over the whole world
  let t   = frameCount * 0.006;
  let ctx = drawingContext;
  let bands = [
    { cx: WORLD_W*0.09, col:[0,195,85],   spread: WORLD_W*0.19 },
    { cx: WORLD_W*0.28, col:[15,178,145], spread: WORLD_W*0.15 },
    { cx: WORLD_W*0.50, col:[0,212,75],   spread: WORLD_W*0.22 },
    { cx: WORLD_W*0.67, col:[65,148,205], spread: WORLD_W*0.14 },
    { cx: WORLD_W*0.84, col:[125,75,200], spread: WORLD_W*0.16 },
    { cx: WORLD_W*0.38, col:[35,192,118], spread: WORLD_W*0.12 },
  ];
  for (let b of bands) {
    let wave = sin(t + b.cx * 0.0009) * 160;
    let bx   = b.cx + wave;
    let g    = ctx.createRadialGradient(bx, WORLD_H*0.48, 0, bx, WORLD_H*0.48, b.spread);
    g.addColorStop(0, `rgba(${b.col[0]},${b.col[1]},${b.col[2]},0.13)`);
    g.addColorStop(1, `rgba(${b.col[0]},${b.col[1]},${b.col[2]},0)`);
    ctx.save(); ctx.fillStyle = g;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H); ctx.restore();
  }

  // stars
  for (let s of bgStars) {
    let twinkle = 0.68 + 0.32 * sin(frameCount * 0.038 + s.phase);
    fill(205, 212, 232, 130 * twinkle);
    noStroke();
    ellipse(s.wx, s.wy, s.r * 2, s.r * 2);
  }
}

// ---- terrain ----

function drawFields() {
  for (let f of fieldShapes) {
    fill(...f.col); noStroke();
    beginShape();
    for (let [px, py] of f.pts) vertex(px, py);
    endShape(CLOSE);
  }
}

function drawPaths() {
  // dirt paths radiating from the village
  stroke(22, 16, 10, 160); strokeWeight(5); noFill();
  let vc = [930, 1640];
  let pathEnds = [[300,1200],[1600,1580],[920,2300],[200,1680]];
  for (let [ex, ey] of pathEnds) {
    let mx = (vc[0]+ex)/2 + random(-60,60), my = (vc[1]+ey)/2 + random(-40,40);
    beginShape();
    curveVertex(vc[0], vc[1]);
    curveVertex(vc[0], vc[1]);
    curveVertex(mx, my);
    curveVertex(ex, ey);
    curveVertex(ex, ey);
    endShape();
  }
  noStroke();
}

function drawRiver() {
  stroke(7, 14, 24); strokeWeight(16); noFill();
  beginShape();
  for (let p of riverCurve) curveVertex(p.x, p.y);
  endShape();
  stroke(12, 24, 40, 65); strokeWeight(6);
  beginShape();
  for (let p of riverCurve) curveVertex(p.x-3, p.y-3);
  endShape();
  noStroke();
}

function drawLake() {
  // base
  fill(5, 9, 18); noStroke();
  ellipse(2400, 640, 400, 275);

  // aurora reflection inside the lake - vivid green/teal pools
  let t = frameCount * 0.006;
  for (let [col, ox, oy, w, h] of [
    [[0,185,85],  -40, 10, 170, 100],
    [[15,175,145], 20,-10, 130,  80],
    [[65,145,200], -10, 35, 100,  60],
  ]) {
    let wave = sin(t + ox * 0.04) * 12;
    fill(col[0], col[1], col[2], 38);
    ellipse(2400 + ox + wave, 640 + oy, w, h);
  }

  // shimmer streaks
  let lx = 2400, ly = 622;
  for (let i = 0; i < 7; i++) {
    let ry = ly + i*11 + sin(t + i*0.75)*5;
    let rw = (58-i*7) * (0.78 + 0.22*sin(t*1.4+i));
    stroke(125, 150, 175, 28 + 20*sin(t+i)); strokeWeight(1.5);
    line(lx-rw, ry, lx+rw, ry);
  }
  noStroke();
}

function drawSmallPond() {
  fill(5, 8, 16); noStroke();
  ellipse(600, 2260, 130, 88);
  // faint aurora reflection
  let t = frameCount * 0.007;
  fill(0, 170, 80, 30 + 12*sin(t)); ellipse(598, 2258, 80, 46);
  stroke(110, 140, 165, 22 + 14*sin(t*1.3)); strokeWeight(1);
  line(575, 2256, 622, 2256);
  noStroke();
}

function drawForests() {
  for (let t of forestTrees) {
    fill(5, 9, 5, 215); noStroke();
    ellipse(t.x, t.y, t.r*2, t.r*1.5);
    fill(7, 12, 6, 75);
    ellipse(t.x - t.r*0.15, t.y - t.r*0.1, t.r, t.r*0.7);
  }
}

function drawSolitaryTrees() {
  for (let t of solTrees) {
    fill(5, 9, 5, 190); noStroke();
    ellipse(t.wx, t.wy, t.r*2, t.r*1.5);
  }
}

function drawVillage() {
  for (let h of villageHouses) {
    let hh = h.tall ? h.h * 2.2 : h.h;
    fill(h.tall ? 16 : 11, h.tall ? 12 : 8, h.tall ? 10 : 7);
    noStroke();
    rect(h.x, h.y - (hh - h.h), h.w, hh, 1);

    if (h.lit && !h.tall) {
      let pulse = 0.88 + 0.12*sin(frameCount*0.014 + h.phase);
      let wx = h.x + h.w*0.28, wy = h.y + h.h*0.22;
      let ww = h.w*0.28, wh = h.h*0.34;
      fill(185, 105, 30, 195*pulse); rect(wx, wy, ww, wh, 1);
      let ctx = drawingContext;
      let g = ctx.createRadialGradient(wx+ww/2, wy+wh/2, 0, wx+ww/2, wy+wh/2, 24);
      g.addColorStop(0, `rgba(185,105,30,${0.24*pulse})`);
      g.addColorStop(1, 'rgba(185,105,30,0)');
      ctx.save(); ctx.fillStyle = g; ctx.fillRect(wx-22, wy-22, ww+44, wh+44); ctx.restore();
    }
    // tall building: lit top window
    if (h.tall) {
      let pulse = 0.85 + 0.15*sin(frameCount*0.01 + h.phase);
      fill(185, 105, 30, 160*pulse);
      ellipse(h.x + h.w/2, h.y - (hh-h.h) + 8, 6, 7);
    }
  }
}

// ---- discoveries ----

function drawDiscoveriesLayer() {
  let ccx = camX + width  / 2;
  let ccy = camY + height / 2;

  for (let d of discoveries) {
    let dx   = ccx - d.wx, dy = ccy - d.wy;
    let dist = sqrt(dx*dx + dy*dy);
    let a    = constrain(map(dist, d.radius*0.55, d.radius, 220, 8), 8, 220);
    d.drawFn(d.wx, d.wy, a);

    if (a > 130) {
      let la = map(a, 130, 220, 0, 170);
      textSize(constrain(width*0.016, 7, 13));
      textAlign(CENTER, BOTTOM);
      fill(195, 185, 172, la); noStroke();
      text(d.label, d.wx, d.wy - 52);
    }
  }
}

// ---- screen-space overlays ----

function drawVignette() {
  let ctx  = drawingContext;
  let grad = ctx.createRadialGradient(
    width/2, height/2, height*0.15,
    width/2, height/2, height*0.82
  );
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.78)');
  ctx.save(); ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height); ctx.restore();
}

function drawHint() {
  if (frameCount > 400) return;
  let a = frameCount < 300 ? 175 : map(frameCount, 300, 400, 175, 0);
  textSize(constrain(width*0.016, 7, 13));
  textAlign(CENTER, BOTTOM);
  fill(88, 82, 74, a); noStroke();
  text('move the mouse to drift - float over things to find them', width/2, height-14);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
