import { Accelerometer } from 'expo-sensors';
import { useEffect, useEffectEvent, useState } from 'react';

const THRESHOLD = 0.6;
const SETTLE_MS = 500;

/**
 * Watches the phone's tilt. Each time the phone is turned over (portrait to upside-down portrait, or back),
 * `onTurn` runs once. The sign of the first clear reading counts as "upright", so it works whichever way the
 * platform reports gravity. Returns true while the phone is upside down, so the screen can turn its content over.
 */
export function useTilt(enabled: boolean, onTurn: () => void) {
  const [upside, setUpside] = useState(false);
  const turned = useEffectEvent((isUpside: boolean) => {
    setUpside(isUpside);
    onTurn();
  });

  useEffect(() => {
    if (!enabled) return;
    let base = 0;
    let current = 0;
    let lastChange = 0;
    let cancelled = false;
    let sub: { remove: () => void } | null = null;
    Accelerometer.isAvailableAsync()
      .then(ok => {
        if (!ok || cancelled) return;
        Accelerometer.setUpdateInterval(100);
        sub = Accelerometer.addListener(({ y }) => {
          if (Math.abs(y) < THRESHOLD) return;
          const sign = Math.sign(y);
          if (!base) {
            base = sign;
            current = sign;
            return;
          }
          const now = Date.now();
          if (sign !== current && now - lastChange > SETTLE_MS) {
            current = sign;
            lastChange = now;
            turned(sign !== base);
          }
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [enabled]);

  return enabled && upside;
}
