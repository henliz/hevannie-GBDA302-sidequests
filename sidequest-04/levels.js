// levels.js - all level data for sidequest 04
// each level is a 2D array - sketch.js loops over this to place every tile
//
// tile key:
//   0 = wall      (impassable)
//   1 = floor     (walkable)
//   2 = node      (collect all to activate exit)
//   3 = hazard    (resets player to start, keeps collected nodes)
//   4 = exit      (only active when all nodes collected)
//   5 = start     (player spawn, treated as floor at runtime)
//
// map structure: vertical corridors at cols 1, 7, 14
//                horizontal corridors at rows 1, 6, 11
//                all other cells are sealed walls
//
// hazard placement rule: for each pair of adjacent vertical corridors,
// at most 2 of the 3 connecting horizontal rows can have a hazard -
// there must always be at least one clear route between every section

const T_WALL   = 0;
const T_FLOOR  = 1;
const T_NODE   = 2;
const T_HAZARD = 3;
const T_EXIT   = 4;
const T_START  = 5;

const LEVELS = [

  // ---- SECTOR A - gentle intro, 6 nodes, 2 hazards ----
  // one hazard on the top corridor (row 1) and one on the mid (row 6)
  // every section still has at least one clear route to every other section
  {
    name: 'SECTOR  A',
    map: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 2, 1, 3, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0], // top row:  node col2, hazard col4, node col11
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0], // sides:    nodes col1 + col7
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 0], // mid row:  hazard col10
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0], // side:     node col14
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 4, 0], // bot row:  node col8, exit col14
    ],
  },

  // ---- SECTOR B - 8 nodes, 4 hazards ----
  // two hazards per horizontal pair - the only clear col1->col7 path is row 11
  // the only clear col7->col14 path is row 1, so routing actually matters now
  {
    name: 'SECTOR  B',
    map: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 1, 3, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0], // top row:  hazard col3, nodes col5 + col10
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0], // side:     node col1
      [0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0], // center:   node col7
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0], // side:     node col14
      [0, 1, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 0], // mid row:  hazards col4 + col10
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0], // center:   node col7
      [0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0], // side:     node col1
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 1, 1, 4, 0], // bot row:  node col6, hazard col11, exit col14
    ],
  },

];
