import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { getProgress } from './progress';

const SOURCES = {
  tap: require('@/assets/sounds/tap.wav'),
  step: require('@/assets/sounds/step.wav'),
  bump: require('@/assets/sounds/bump.wav'),
  land: require('@/assets/sounds/land.wav'),
  flip: require('@/assets/sounds/flip.wav'),
  gem: require('@/assets/sounds/gem.wav'),
  ouch: require('@/assets/sounds/ouch.wav'),
  push: require('@/assets/sounds/push.wav'),
  door: require('@/assets/sounds/door.wav'),
  switch: require('@/assets/sounds/switch.wav'),
  win: require('@/assets/sounds/win.wav'),
};
export type Sfx = keyof typeof SOURCES;

const players: Partial<Record<Sfx, AudioPlayer>> = {};

export function initSfx() {
  setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(() => {});
}

export function sfx(name: Sfx) {
  if (!getProgress().sound) return;
  try {
    let p = players[name];
    if (!p) {
      p = createAudioPlayer(SOURCES[name]);
      players[name] = p;
    }
    p.seekTo(0).catch(() => {});
    p.play();
  } catch {
    // a missing sound never stops the game
  }
}

type Buzz = 'light' | 'medium' | 'success' | 'error';
export function buzz(kind: Buzz) {
  if (Platform.OS === 'web') return;
  const run =
    kind === 'success' ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    : kind === 'error' ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    : Haptics.impactAsync(kind === 'light' ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
  run.catch(() => {});
}
