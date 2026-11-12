/**
 * Flip World rules, the same rules as the web version.
 * Tiles: # rock, ^ spikes, G golden egg, * crystal (bonus), S start,
 * k key, D door (walk into it holding a key to open it), b switch (entering it swaps x and y blocks),
 * x blue block (solid until the switch is hit), y pink block (solid after), B box (push it; it falls and fills spike pits).
 * Flipping moves Drako to the other side at row H-1-r, same column, then gravity pulls him down.
 */
export const W = 7;
export const H = 9;

export type Level = { name: string; par: number; sun: string[]; cave: string[]; hint?: string };
export type Pos = [side: number, row: number, col: number];
export type Action = 'L' | 'R' | 'F';

export type State = {
  s: number;
  r: number;
  c: number;
  keys: number;
  got: number;
  open: number;
  tog: number;
  gem: boolean;
  boxes: Pos[];
};

export type GameEvent =
  | { t: 'walk'; c: number }
  | { t: 'push'; i: number; c: number }
  | { t: 'door'; i: number }
  | { t: 'flip'; s: number; r: number }
  | { t: 'fall'; rows: number; r: number }
  | { t: 'boxfall'; i: number; r: number }
  | { t: 'key'; i: number }
  | { t: 'gem' }
  | { t: 'switch'; tog: number };

export type Model = { base: string[][][]; keys: Pos[]; doors: Pos[]; start: State; startBad: Outcome };
type Outcome = 'dead' | 'win' | null;

export type StepResult =
  | { blocked: 'edge' | 'door' | 'box' | 'wall' | 'flip' }
  | { blocked?: undefined; st: State; ev: GameEvent[]; dead: boolean; win: boolean };

export const clone = (st: State): State => ({ ...st, boxes: st.boxes.map(b => [...b] as Pos) });
export const find = (list: Pos[], s: number, r: number, c: number) => list.findIndex(p => p[0] === s && p[1] === r && p[2] === c);
const boxAt = (st: State, s: number, r: number, c: number) => st.boxes.findIndex(b => b[0] === s && b[1] === r && b[2] === c);

export function load(L: Level): Model {
  const base = [L.sun, L.cave].map(g => g.map(row => [...row]));
  const st: State = { s: 0, r: 0, c: 0, keys: 0, got: 0, open: 0, tog: 0, gem: false, boxes: [] };
  const keys: Pos[] = [];
  const doors: Pos[] = [];
  base.forEach((g, s) =>
    g.forEach((row, r) =>
      row.forEach((ch, c) => {
        if (ch === 'S') {
          st.s = s; st.r = r; st.c = c; row[c] = '.';
        } else if (ch === 'B') {
          st.boxes.push([s, r, c]); row[c] = '.';
        } else if (ch === 'k') keys.push([s, r, c]);
        else if (ch === 'D') doors.push([s, r, c]);
      }),
    ),
  );
  const M: Model = { base, keys, doors, start: st, startBad: null };
  M.startBad = stabilize(M, st, []);
  return M;
}

export function solid(M: Model, st: State, s: number, r: number, c: number): boolean {
  if (r >= H || c < 0 || c >= W) return true;
  const ch = M.base[s][r][c];
  if (ch === '#') return true;
  if (ch === 'x') return st.tog === 0;
  if (ch === 'y') return st.tog === 1;
  if (ch === 'D') return !((st.open >> find(M.doors, s, r, c)) & 1);
  return boxAt(st, s, r, c) >= 0;
}

function enter(M: Model, st: State, ev: GameEvent[]): Outcome {
  const { s, r, c } = st;
  const ch = M.base[s][r][c];
  if (ch === '^' && boxAt(st, s, r, c) < 0) return 'dead';
  if (ch === 'G') return 'win';
  if (ch === '*' && !st.gem) {
    st.gem = true;
    ev.push({ t: 'gem' });
  }
  if (ch === 'k') {
    const i = find(M.keys, s, r, c);
    if (!((st.got >> i) & 1)) {
      st.got |= 1 << i;
      st.keys++;
      ev.push({ t: 'key', i });
    }
  }
  if (ch === 'b') {
    st.tog ^= 1;
    ev.push({ t: 'switch', tog: st.tog });
  }
  return null;
}

function fallDrako(M: Model, st: State, ev: GameEvent[]): Outcome {
  let rows = 0;
  let res: Outcome = null;
  while (!solid(M, st, st.s, st.r + 1, st.c)) {
    st.r++;
    rows++;
    const n = ev.length;
    res = enter(M, st, ev);
    if (res || ev.length > n) {
      ev.splice(n, 0, { t: 'fall', rows, r: st.r });
      rows = 0;
    }
    if (res) break;
  }
  if (rows) ev.push({ t: 'fall', rows, r: st.r });
  return res;
}

/** Boxes rest on rock, blocks, doors, other boxes, Drako and special tiles; a box that drops into spikes stays there. */
function boxBlocked(M: Model, st: State, s: number, r: number, c: number) {
  if (solid(M, st, s, r, c)) return true;
  if (s === st.s && r === st.r && c === st.c) return true;
  return 'Gk*b'.includes(M.base[s][r][c]);
}

function settleBoxes(M: Model, st: State, ev: GameEvent[]) {
  let moved = true;
  while (moved) {
    moved = false;
    st.boxes.forEach((b, i) => {
      const [s, r, c] = b;
      if (M.base[s][r][c] === '^') return;
      if (!boxBlocked(M, st, s, r + 1, c)) {
        b[1]++;
        moved = true;
        ev.push({ t: 'boxfall', i, r: b[1] });
      }
    });
  }
}

function stabilize(M: Model, st: State, ev: GameEvent[]): Outcome {
  let res = enter(M, st, ev);
  for (let k = 0; k < 30 && !res; k++) {
    settleBoxes(M, st, ev);
    if (solid(M, st, st.s, st.r + 1, st.c)) break;
    res = fallDrako(M, st, ev);
  }
  return res;
}

export function step(M: Model, st0: State, a: Action): StepResult {
  const st = clone(st0);
  const ev: GameEvent[] = [];
  if (a === 'L' || a === 'R') {
    const d = a === 'L' ? -1 : 1;
    const nc = st.c + d;
    if (nc < 0 || nc >= W) return { blocked: 'edge' };
    if (M.base[st.s][st.r][nc] === 'D') {
      const di = find(M.doors, st.s, st.r, nc);
      if (!((st.open >> di) & 1)) {
        if (!st.keys) return { blocked: 'door' };
        st.keys--;
        st.open |= 1 << di;
        ev.push({ t: 'door', i: di });
      }
    }
    const bi = boxAt(st, st.s, st.r, nc);
    if (bi >= 0) {
      const bc = nc + d;
      if (bc < 0 || bc >= W || solid(M, st, st.s, st.r, bc) || !'.^'.includes(M.base[st.s][st.r][bc])) return { blocked: 'box' };
      st.boxes[bi][2] = bc;
      ev.push({ t: 'push', i: bi, c: bc });
    } else if (solid(M, st, st.s, st.r, nc)) return { blocked: 'wall' };
    st.c = nc;
    ev.push({ t: 'walk', c: nc });
  } else {
    const ns = 1 - st.s;
    const nr = H - 1 - st.r;
    if (solid(M, st, ns, nr, st.c)) return { blocked: 'flip' };
    st.s = ns;
    st.r = nr;
    ev.push({ t: 'flip', s: ns, r: nr });
  }
  const res = stabilize(M, st, ev);
  return { st, ev, dead: res === 'dead', win: res === 'win' };
}

const stateKey = (st: State) =>
  [st.s, st.r, st.c, st.keys, st.got, st.open, st.tog, st.boxes.map(b => b.join('.')).sort().join('|')].join(',');

/** Shortest list of actions from st to the egg, or null. `limit` caps how many states are searched. */
export function solve(M: Model, st: State, limit = 300000): Action[] | null {
  const seen = new Set([stateKey(st)]);
  let q: { st: State; p: Action[] }[] = [{ st, p: [] }];
  let n = 0;
  while (q.length) {
    const nq: typeof q = [];
    for (const it of q) {
      for (const a of ['L', 'R', 'F'] as const) {
        const res = step(M, it.st, a);
        if (res.blocked || res.dead) continue;
        if (res.win) return [...it.p, a];
        const k = stateKey(res.st);
        if (seen.has(k)) continue;
        seen.add(k);
        if (++n > limit) return null;
        nq.push({ st: res.st, p: [...it.p, a] });
      }
    }
    q = nq;
  }
  return null;
}
