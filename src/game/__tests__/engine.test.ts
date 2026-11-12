import { describe, expect, it } from '@jest/globals';

import { H, load, solve, step, type Level } from '../engine';
import { LEVELS, LEVELS_PER_WORLD, WORLDS } from '../levels';

const blank = Array(H).fill('.......');
const level = (sun: string[], cave: string[] = blank): Level => ({ name: 't', par: 0, sun, cave });

describe('levels', () => {
  it('has 4 worlds of 12 levels', () => {
    expect(LEVELS).toHaveLength(WORLDS.length * LEVELS_PER_WORLD);
  });

  it.each(LEVELS.map((L, i) => [i + 1, L.name, L] as const))('level %i (%s) is solved in exactly par moves', (_n, _name, L) => {
    const M = load(L);
    expect(M.startBad).toBeNull();
    expect(solve(M, M.start)?.length).toBe(L.par);
  });
});

describe('rules', () => {
  it('flipping mirrors the row onto the other side, then Drako falls', () => {
    const M = load(level(['.......', '.......', '.......', '.......', '.......', '.......', '.......', 'S......', '#######']));
    const res = step(M, M.start, 'F');
    if (res.blocked) throw new Error('flip was blocked');
    expect([res.st.s, res.st.r, res.st.c]).toEqual([1, H - 1, 0]);
    expect(res.ev[0]).toEqual({ t: 'flip', s: 1, r: 1 });
  });

  it('a door blocks until Drako carries a key', () => {
    const M = load(level(['.......', '.......', '.......', '.......', '.......', '.......', '.......', 'S.D....', '#######']));
    const toDoor = step(M, M.start, 'R');
    if (toDoor.blocked) throw new Error('walk was blocked');
    expect(step(M, toDoor.st, 'R')).toEqual({ blocked: 'door' });

    const M2 = load(level(['.......', '.......', '.......', '.......', '.......', '.......', '.......', 'SkD....', '#######']));
    const withKey = step(M2, M2.start, 'R');
    if (withKey.blocked) throw new Error('walk was blocked');
    expect(withKey.st.keys).toBe(1);
    const through = step(M2, withKey.st, 'R');
    if (through.blocked) throw new Error('door stayed shut');
    expect(through.st.keys).toBe(0);
    expect(through.st.c).toBe(2);
  });

  it('a pushed box falls into a spike pit and becomes a safe floor', () => {
    const M = load(level(['.......', '.......', '.......', '.......', '.......', '.......', 'SB.....', '##^####', '#######']));
    const push = step(M, M.start, 'R');
    if (push.blocked) throw new Error('push was blocked');
    expect(push.st.boxes[0]).toEqual([0, 7, 2]);
    const walk = step(M, push.st, 'R');
    if (walk.blocked) throw new Error('walk was blocked');
    expect(walk.dead).toBe(false);
    expect([walk.st.r, walk.st.c]).toEqual([6, 2]);
  });

  it('the switch swaps blue and pink blocks', () => {
    const M = load(level(['.......', '.......', '.......', '.......', '.......', '.......', '.......', 'Sb.....', 'xx#####']));
    const res = step(M, M.start, 'R');
    if (res.blocked) throw new Error('walk was blocked');
    expect(res.st.tog).toBe(1);
    expect(res.ev.some(e => e.t === 'switch')).toBe(true);
  });
});
