import { useRef, useState } from 'react';
import { Easing, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import type { DrakoMood } from '@/components/Drako';

import { clone, load, solve, step, type Action, type GameEvent, type State } from './engine';
import { LEVELS } from './levels';
import { starsFor, updateProgress } from './progress';
import { buzz, sfx } from './sfx';

const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
const FLIP_MS = 620;
const flipEase = Easing.bezier(0.55, -0.25, 0.35, 1.25);

type Snapshot = { st: State; moves: number };
export type WinInfo = { stars: number; gem: boolean; moves: number };

/** Runs one level: applies the rules engine, then plays its events back as animations. */
export function useFlipGame(index: number) {
  const L = LEVELS[index];
  const [M] = useState(() => load(L));
  const [view, setView] = useState<State>(() => clone(M.start));
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState<WinInfo | null>(null);
  const [mood, setMood] = useState<DrakoMood>('idle');
  const [face, setFace] = useState(1);
  const [toast, setToast] = useState<{ msg: string; id: number } | null>(null);
  const [glow, setGlow] = useState<Action | null>(null);

  const stRef = useRef(M.start);
  const movesRef = useRef(0);
  const busy = useRef(false);
  const done = useRef(false);
  const queuedFlip = useRef(false);
  const hist = useRef<Snapshot[]>([]);
  const toastId = useRef(0);

  const x = useSharedValue(M.start.c);
  const y = useSharedValue(M.start.r);
  const rot = useSharedValue(M.start.s ? 180 : 0);
  const drakoOpacity = useSharedValue(1);
  const drakoScale = useSharedValue(1);

  const showToast = (msg: string) => {
    const id = ++toastId.current;
    setToast({ msg, id });
    setTimeout(() => setToast(t => (t && t.id === id ? null : t)), 1500);
  };

  const play = async (ev: GameEvent[], V: State) => {
    for (const e of ev) {
      switch (e.t) {
        case 'walk':
          V.c = e.c;
          x.set(withTiming(e.c, { duration: 150 }));
          sfx('step');
          await wait(150);
          break;
        case 'push':
          V.boxes[e.i][2] = e.c;
          setView(clone(V));
          sfx('push');
          break;
        case 'door':
          V.open |= 1 << e.i;
          V.keys--;
          setView(clone(V));
          sfx('door');
          showToast('🔓 Door open!');
          await wait(160);
          break;
        case 'flip':
          drakoOpacity.set(0);
          sfx('flip');
          buzz('medium');
          rot.set(withTiming(e.s ? 180 : 0, { duration: FLIP_MS, easing: flipEase }));
          await wait(FLIP_MS + 20);
          V.s = e.s;
          V.r = e.r;
          y.set(e.r);
          setView(clone(V));
          drakoOpacity.set(1);
          drakoScale.set(withSequence(withTiming(0.3, { duration: 0 }), withSpring(1)));
          await wait(120);
          break;
        case 'fall': {
          const ms = 90 * e.rows + 60;
          V.r = e.r;
          y.set(withTiming(e.r, { duration: ms, easing: Easing.in(Easing.quad) }));
          await wait(ms);
          sfx('land');
          buzz('light');
          break;
        }
        case 'boxfall':
          V.boxes[e.i][1] = e.r;
          setView(clone(V));
          await wait(70);
          break;
        case 'key':
          V.got |= 1 << e.i;
          V.keys++;
          setView(clone(V));
          sfx('gem');
          showToast('🔑 Key found!');
          break;
        case 'gem':
          V.gem = true;
          setView(clone(V));
          sfx('gem');
          showToast('💎 Crystal found!');
          break;
        case 'switch':
          V.tog = e.tog;
          setView(clone(V));
          sfx('switch');
          break;
      }
    }
  };

  const restore = async (snap: Snapshot) => {
    if (snap.st.s !== stRef.current.s) {
      drakoOpacity.set(0);
      rot.set(withTiming(snap.st.s ? 180 : 0, { duration: FLIP_MS, easing: flipEase }));
      await wait(FLIP_MS + 20);
    }
    stRef.current = snap.st;
    movesRef.current = snap.moves;
    setMoves(snap.moves);
    x.set(snap.st.c);
    y.set(snap.st.r);
    setView(clone(snap.st));
    drakoOpacity.set(1);
  };

  const finish = () => {
    done.current = true;
    const stars = starsFor(movesRef.current, L.par);
    const gem = stRef.current.gem;
    updateProgress(p => ({
      ...p,
      stars: { ...p.stars, [index]: Math.max(p.stars[index] ?? 0, stars) },
      gems: gem ? { ...p.gems, [index]: true } : p.gems,
    }));
    setMood('happy');
    sfx('win');
    buzz('success');
    const r = stRef.current.r;
    y.set(withSequence(withTiming(r - 0.35, { duration: 160 }), withTiming(r, { duration: 160 }), withTiming(r - 0.35, { duration: 160 }), withTiming(r, { duration: 160 })));
    setTimeout(() => setWon({ stars, gem, moves: movesRef.current }), 900);
  };

  const act = async (a: Action): Promise<void> => {
    if (busy.current || done.current) return;
    setGlow(null);
    if (a !== 'F') setFace(a === 'L' ? -1 : 1);
    const res = step(M, stRef.current, a);
    if (res.blocked) {
      sfx('bump');
      buzz('light');
      if (a === 'F') {
        const base = stRef.current.s ? 180 : 0;
        rot.set(withSequence(withTiming(base + 22, { duration: 140 }), withTiming(base - 8, { duration: 120 }), withTiming(base, { duration: 100 })));
        showToast('A block is in the way on the other side!');
      } else {
        const c = stRef.current.c;
        x.set(withSequence(withTiming(c + (a === 'L' ? -0.15 : 0.15), { duration: 80 }), withTiming(c, { duration: 120 })));
        if (res.blocked === 'door') showToast('Locked! Find a 🔑 key first.');
        if (res.blocked === 'box') showToast('The box is stuck.');
      }
      return;
    }
    busy.current = true;
    hist.current.push({ st: stRef.current, moves: movesRef.current });
    movesRef.current++;
    setMoves(movesRef.current);
    await play(res.ev, clone(stRef.current));
    stRef.current = res.st;
    setView(clone(res.st));
    if (res.dead) {
      setMood('ouch');
      sfx('ouch');
      buzz('error');
      showToast('Ouch! Spikes. One step back.');
      await wait(700);
      const snap = hist.current.pop();
      if (snap) await restore(snap);
      setMood('idle');
    } else if (res.win) {
      finish();
    }
    busy.current = false;
    if (queuedFlip.current) {
      queuedFlip.current = false;
      await act('F');
    }
  };

  /** Flips coming from turning the phone wait for the current move to finish instead of being dropped. */
  const requestFlip = () => {
    if (busy.current) queuedFlip.current = true;
    else void act('F');
  };

  const undo = async () => {
    if (busy.current || done.current) return;
    const snap = hist.current.pop();
    if (!snap) return;
    busy.current = true;
    setGlow(null);
    await restore(snap);
    busy.current = false;
  };

  const reset = async () => {
    if (busy.current) return;
    busy.current = true;
    done.current = false;
    hist.current = [];
    setWon(null);
    setMood('idle');
    setGlow(null);
    await restore({ st: M.start, moves: 0 });
    busy.current = false;
  };

  const hint = () => {
    if (busy.current || done.current) return;
    const path = solve(M, stRef.current, 200000);
    if (!path) {
      showToast('Stuck? Try ↶ undo.');
      return;
    }
    setGlow(path[0]);
    showToast(path[0] === 'F' ? 'Hint: flip now!' : path[0] === 'L' ? 'Hint: walk left' : 'Hint: walk right');
  };

  return { L, M, view, moves, won, mood, face, toast, glow, x, y, rot, drakoOpacity, drakoScale, act, requestFlip, undo, reset, hint };
}

export type FlipGame = ReturnType<typeof useFlipGame>;
