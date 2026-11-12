import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Drako } from '@/components/Drako';

import { find, H, W, type Model, type State } from './engine';
import { BoxArt, DoorArt, EggArt, GemArt, KeyArt, SpikeArt, SwitchArt } from './TileArt';
import { COLORS } from './theme';
import type { FlipGame } from './useFlipGame';

const STARS = [
  [0.15, 0.2], [0.6, 0.12], [0.85, 0.4], [0.35, 0.55], [0.75, 0.75], [0.2, 0.85], [0.5, 0.32],
];

function Cell({ r, c, cell, children }: { r: number; c: number; cell: number; children: ReactNode }) {
  return <View style={[styles.cell, { left: c * cell, top: r * cell, width: cell, height: cell }]}>{children}</View>;
}

function Box({ r, c, cell }: { r: number; c: number; cell: number }) {
  const left = useSharedValue(c * cell);
  const top = useSharedValue(r * cell);
  useEffect(() => {
    left.set(withTiming(c * cell, { duration: 150 }));
    top.set(withTiming(r * cell, { duration: 90 }));
  }, [r, c, cell, left, top]);
  const style = useAnimatedStyle(() => ({ left: left.get(), top: top.get() }));
  return (
    <Animated.View style={[styles.cell, { width: cell, height: cell }, style]}>
      <BoxArt size={cell * 0.92} />
    </Animated.View>
  );
}

function Face({ M, view, s, cell }: { M: Model; view: State; s: number; cell: number }) {
  const g = M.base[s];
  const cave = s === 1;
  const tiles: ReactNode[] = [];
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      const ch = g[r][c];
      const k = `${r}-${c}`;
      if (ch === '#') {
        const top = r === 0 || g[r - 1][c] !== '#';
        tiles.push(
          <Cell key={k} r={r} c={c} cell={cell}>
            <View style={[styles.rock, { backgroundColor: cave ? COLORS.caveRock : COLORS.dirt }]}>
              {top && <View style={[styles.rockTop, { backgroundColor: cave ? COLORS.caveRockTop : COLORS.grass, height: cell * (cave ? 0.22 : 0.3) }]} />}
            </View>
          </Cell>,
        );
      } else if (ch === '^') {
        tiles.push(
          <Cell key={k} r={r} c={c} cell={cell}>
            <View style={styles.bottom}>
              <SpikeArt size={cell} />
            </View>
          </Cell>,
        );
      } else if (ch === 'G') {
        tiles.push(<Cell key={k} r={r} c={c} cell={cell}><EggArt size={cell * 0.86} /></Cell>);
      } else if (ch === '*' && !view.gem) {
        tiles.push(<Cell key={k} r={r} c={c} cell={cell}><GemArt size={cell * 0.8} cave={cave} /></Cell>);
      } else if (ch === 'k' && !((view.got >> find(M.keys, s, r, c)) & 1)) {
        tiles.push(<Cell key={k} r={r} c={c} cell={cell}><KeyArt size={cell * 0.84} /></Cell>);
      } else if (ch === 'D') {
        const open = !!((view.open >> find(M.doors, s, r, c)) & 1);
        tiles.push(
          <Cell key={k} r={r} c={c} cell={cell}>
            <View style={{ opacity: open ? 0.2 : 1 }}><DoorArt size={cell * 0.94} /></View>
          </Cell>,
        );
      } else if (ch === 'b') {
        tiles.push(<Cell key={k} r={r} c={c} cell={cell}><SwitchArt size={cell} on={view.tog === 1} /></Cell>);
      } else if (ch === 'x' || ch === 'y') {
        const color = ch === 'x' ? COLORS.blue : COLORS.pinkBlock;
        const isSolid = (ch === 'x') === (view.tog === 0);
        tiles.push(
          <Cell key={k} r={r} c={c} cell={cell}>
            <View style={[styles.block, isSolid ? { backgroundColor: color, borderColor: 'rgba(255,255,255,0.6)' } : { borderColor: color, borderStyle: 'dashed', opacity: 0.75 }]} />
          </Cell>,
        );
      }
    }
  }
  return (
    <>
      {cave ? (
        <LinearGradient colors={['#2F2070', '#120B33']} style={StyleSheet.absoluteFill}>
          {STARS.map(([sx, sy], i) => (
            <View key={i} style={[styles.star, { left: `${sx * 100}%`, top: `${sy * 100}%` }]} />
          ))}
        </LinearGradient>
      ) : (
        <LinearGradient colors={['#7FD3FF', '#D9F4FF']} style={StyleSheet.absoluteFill}>
          <View style={[styles.sunDisc, { width: cell * 1.3, height: cell * 1.3, borderRadius: cell }]} />
          <View style={[styles.cloud, { width: cell * 1.4, height: cell * 0.55, borderRadius: cell }]} />
        </LinearGradient>
      )}
      {tiles}
      {view.boxes.map((b, i) => (b[0] === s ? <Box key={`box${i}`} r={b[1]} c={b[2]} cell={cell} /> : null))}
    </>
  );
}

/** The two-sided board: a card that flips over on its horizontal axis, with Drako drawn on top. */
export function Board({ game, cell }: { game: FlipGame; cell: number }) {
  const { M, view, rot, x, y, drakoOpacity, drakoScale, face, mood } = game;
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ perspective: 1400 }, { rotateX: `${rot.get()}deg` }] }));
  const frontStyle = useAnimatedStyle(() => ({ opacity: rot.get() < 90 ? 1 : 0 }));
  const backStyle = useAnimatedStyle(() => ({ opacity: rot.get() >= 90 ? 1 : 0 }));
  const drakoStyle = useAnimatedStyle(() => ({
    opacity: drakoOpacity.get(),
    transform: [{ translateX: x.get() * cell }, { translateY: y.get() * cell }, { scale: drakoScale.get() }],
  }));
  return (
    <View style={{ width: cell * W, height: cell * H }}>
      <Animated.View style={[StyleSheet.absoluteFill, cardStyle]}>
        <Animated.View style={[styles.face, frontStyle]}>
          <Face M={M} view={view} s={0} cell={cell} />
        </Animated.View>
        <Animated.View style={[styles.face, styles.caveFace, backStyle]}>
          <Face M={M} view={view} s={1} cell={cell} />
        </Animated.View>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.drako, { width: cell, height: cell }, drakoStyle]}>
        <View style={{ transform: [{ scaleX: face }] }}>
          <Drako size={cell} mood={mood} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  face: {
    ...StyleSheet.absoluteFill,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  caveFace: { borderColor: '#B9A6FF', transform: [{ rotateX: '180deg' }] },
  cell: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  rock: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 6, overflow: 'hidden', borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.2)' },
  rockTop: { width: '100%' },
  bottom: { position: 'absolute', bottom: 0 },
  block: { position: 'absolute', top: 2, left: 2, right: 2, bottom: 2, borderRadius: 7, borderWidth: 3 },
  star: { position: 'absolute', width: 3, height: 3, borderRadius: 2, backgroundColor: '#FFFFFF' },
  sunDisc: { position: 'absolute', right: '6%', top: '3%', backgroundColor: '#FFE27A', boxShadow: '0 0 0 8px rgba(255,226,122,0.35)' },
  cloud: { position: 'absolute', left: '12%', top: '10%', backgroundColor: 'rgba(255,255,255,0.9)' },
  drako: { position: 'absolute', left: 0, top: 0 },
});
