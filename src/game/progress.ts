import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

export type Progress = {
  stars: Record<number, number>;
  gems: Record<number, boolean>;
  sound: boolean;
  tilt: boolean;
  seenHow: boolean;
};

const KEY = 'flip-world-progress-v1';
let state: Progress = { stars: {}, gems: {}, sound: true, tilt: true, seenHow: false };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

export async function loadProgress() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch {
    // keep defaults when storage is unavailable
  }
  emit();
}

export function updateProgress(fn: (p: Progress) => Progress) {
  state = fn(state);
  emit();
  AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
}

export const getProgress = () => state;

export function useProgress() {
  return useSyncExternalStore(
    cb => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    getProgress,
  );
}

export const isUnlocked = (p: Progress, i: number) => i === 0 || (p.stars[i - 1] ?? 0) > 0;
export const starsFor = (moves: number, par: number) => (moves <= par ? 3 : moves <= par + 4 ? 2 : 1);
