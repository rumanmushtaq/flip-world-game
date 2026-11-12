// Writes the game's short sound effects as 16-bit mono WAV files into assets/sounds.
// Each sound is a list of tones: [startHz, endHz, seconds, wave, volume, delaySeconds].
// Run: node scripts/make-sounds.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const RATE = 22050;
const SOUNDS = {
  tap: [[880, 880, 0.06, 'sine', 0.3, 0]],
  step: [[560, 500, 0.07, 'triangle', 0.35, 0]],
  bump: [[170, 120, 0.12, 'square', 0.18, 0]],
  land: [[190, 70, 0.16, 'sine', 0.8, 0]],
  flip: [[260, 900, 0.32, 'sine', 0.4, 0], [900, 260, 0.3, 'triangle', 0.2, 0.3]],
  gem: [1047, 1319, 1568, 2093].map((f, i) => [f, f, 0.18, 'triangle', 0.35, i * 0.06]),
  ouch: [[520, 140, 0.4, 'saw', 0.25, 0]],
  push: [[200, 150, 0.12, 'square', 0.18, 0]],
  door: [[392, 392, 0.12, 'triangle', 0.4, 0], [523, 523, 0.2, 'triangle', 0.4, 0.1]],
  switch: [[660, 990, 0.1, 'square', 0.18, 0], [990, 660, 0.1, 'square', 0.12, 0.08]],
  win: [523, 659, 784, 1047, 784, 1047].map((f, i) => [f, f, 0.32, 'triangle', 0.4, i * 0.13]),
};

function wave(kind, phase) {
  const p = phase % 1;
  if (kind === 'square') return p < 0.5 ? 1 : -1;
  if (kind === 'triangle') return 1 - 4 * Math.abs(p - 0.5);
  if (kind === 'saw') return 2 * p - 1;
  return Math.sin(2 * Math.PI * p);
}

function render(tones) {
  const len = Math.ceil(RATE * Math.max(...tones.map(t => t[2] + t[5])) + RATE * 0.03);
  const out = new Float32Array(len);
  for (const [f1, f2, dur, kind, vol, delay] of tones) {
    const start = Math.floor(delay * RATE), n = Math.floor(dur * RATE);
    let phase = 0;
    for (let i = 0; i < n && start + i < len; i++) {
      const t = i / n;
      const f = f1 * Math.pow(f2 / f1, t);
      phase += f / RATE;
      const env = Math.min(1, i / (RATE * 0.008)) * Math.pow(1 - t, 2);
      out[start + i] += wave(kind, phase) * vol * env;
    }
  }
  return out;
}

function toWav(samples) {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(RATE, 24); buf.writeUInt32LE(RATE * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32000), 44 + i * 2));
  return buf;
}

mkdirSync('assets/sounds', { recursive: true });
for (const [name, tones] of Object.entries(SOUNDS)) writeFileSync(`assets/sounds/${name}.wav`, toWav(render(tones)));
console.log('wrote', Object.keys(SOUNDS).length, 'sounds');
