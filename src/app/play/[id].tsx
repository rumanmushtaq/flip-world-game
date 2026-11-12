import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChunkyButton } from '@/components/ChunkyButton';
import { Board } from '@/game/Board';
import { H, W } from '@/game/engine';
import { LEVELS } from '@/game/levels';
import { updateProgress, useProgress } from '@/game/progress';
import { COLORS, FONTS } from '@/game/theme';
import { useFlipGame } from '@/game/useFlipGame';
import { useTilt } from '@/game/useTilt';

function IconButton({ label, icon, onPress, off }: { label: string; icon: string; onPress: () => void; off?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.ib, off && styles.ibOff, pressed && styles.ibPressed]}>
      <Text style={styles.ibText}>{icon}</Text>
    </Pressable>
  );
}

function PlayScreen({ index }: { index: number }) {
  const g = useFlipGame(index);
  const p = useProgress();
  const [cell, setCell] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const night = g.view.s === 1;

  const upside = useTilt(p.tilt && !g.won, g.requestFlip);
  const uiTurn = useSharedValue(0);
  useEffect(() => {
    uiTurn.set(withTiming(upside ? 180 : 0, { duration: 450 }));
  }, [upside, uiTurn]);
  const turnStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${uiTurn.get()}deg` }] }));

  const onStageLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setCell(Math.max(20, Math.floor(Math.min(width / W, height / H, 64))));
  };
  const onTouchStart = (e: GestureResponderEvent) => {
    touch.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
  };
  const onTouchEnd = (e: GestureResponderEvent) => {
    const t = touch.current;
    touch.current = null;
    if (!t) return;
    let dx = e.nativeEvent.pageX - t.x;
    let dy = e.nativeEvent.pageY - t.y;
    if (upside) {
      dx = -dx;
      dy = -dy;
    }
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
    if (Math.abs(dx) > Math.abs(dy)) void g.act(dx < 0 ? 'L' : 'R');
    else void g.act('F');
  };

  const last = index === LEVELS.length - 1;
  const keysText = g.M.keys.length ? ` · 🔑 ${g.view.keys}` : '';

  return (
    <LinearGradient colors={night ? [COLORS.caveTop, COLORS.caveLow] : [COLORS.skyTop, COLORS.skyLow]} style={styles.fill}>
      <SafeAreaView style={styles.fill}>
        <Animated.View style={[styles.screen, turnStyle]}>
          <View style={styles.top}>
            <IconButton label="Back to levels" icon="⟵" onPress={() => router.back()} />
            <View style={styles.titleBox}>
              <Text numberOfLines={1} style={styles.title}>
                {g.L.name}
              </Text>
              <Text style={styles.sub}>
                Level {index + 1} · par {g.L.par}
              </Text>
            </View>
            <IconButton label="Undo" icon="↶" onPress={() => void g.undo()} />
            <IconButton label="Restart level" icon="⟲" onPress={() => void g.reset()} />
            <IconButton label="Hint" icon="💡" onPress={g.hint} />
            <IconButton label="Sound on or off" icon="🔊" off={!p.sound} onPress={() => updateProgress(s => ({ ...s, sound: !s.sound }))} />
          </View>
          <View style={styles.hud}>
            <Text style={[styles.pill, night && styles.pillNight]}>{night ? '🌙 Cave side' : '☀️ Sun side'}</Text>
            <Text style={styles.pill}>
              Moves {g.moves} / {g.L.par}
            </Text>
            <Text style={styles.pill}>
              💎 {g.view.gem ? 1 : 0}/1{keysText}
            </Text>
          </View>
          {g.L.hint ? <Text style={[styles.hint, night && styles.hintNight]}>{g.L.hint}</Text> : null}
          <View style={styles.stage} onLayout={onStageLayout} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {cell > 0 && <Board game={g} cell={cell} />}
            {g.toast && (
              <View pointerEvents="none" style={styles.toast}>
                <Text style={styles.toastText}>{g.toast.msg}</Text>
              </View>
            )}
          </View>
          <View style={styles.pad}>
            <ChunkyButton accessibilityLabel="Walk left" color={COLORS.blue} shade={COLORS.blueDark} glow={g.glow === 'L'} onPress={() => void g.act('L')} style={styles.padSide}>
              <Text style={styles.arrow}>◀</Text>
            </ChunkyButton>
            <ChunkyButton accessibilityLabel="Flip the world" color={COLORS.coral} shade={COLORS.coralDark} glow={g.glow === 'F'} onPress={() => void g.act('F')} style={styles.padMid}>
              <Text style={styles.arrow}>⇅</Text>
              <Text style={styles.flipLabel}>FLIP</Text>
            </ChunkyButton>
            <ChunkyButton accessibilityLabel="Walk right" color={COLORS.blue} shade={COLORS.blueDark} glow={g.glow === 'R'} onPress={() => void g.act('R')} style={styles.padSide}>
              <Text style={styles.arrow}>▶</Text>
            </ChunkyButton>
          </View>
          {p.tilt && <Text style={[styles.tip, night && { color: '#E6DEFF' }]}>📱 Tip: turn your phone upside down to flip</Text>}
        </Animated.View>

        {g.won && (
          <View style={styles.over}>
            <View style={styles.panel}>
              <Text style={styles.bigStars}>
                {[1, 2, 3].map(i => (
                  <Text key={i} style={{ color: i <= g.won!.stars ? COLORS.starOn : COLORS.starOff }}>
                    ★
                  </Text>
                ))}
              </Text>
              <Text style={styles.winTitle}>{g.won.stars === 3 ? 'Perfect flip!' : 'Egg rescued!'}</Text>
              <Text style={styles.winText}>
                {g.won.moves} moves (par {g.L.par}){g.won.gem ? ' · 💎 crystal found' : ''}.{g.won.stars < 3 ? ` Finish in ${g.L.par} moves for 3 stars.` : ''}
              </Text>
              <ChunkyButton
                label={last ? 'All levels done!' : 'Next level'}
                color={COLORS.teal}
                shade={COLORS.tealDark}
                onPress={() => (last ? router.back() : router.replace({ pathname: '/play/[id]', params: { id: String(index + 1) } }))}
              />
              <View style={styles.row}>
                <ChunkyButton label="Replay" size="sm" onPress={() => void g.reset()} />
                <ChunkyButton label="Levels" size="sm" color={COLORS.blue} shade={COLORS.blueDark} onPress={() => router.back()} />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

export default function Play() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const index = Math.min(LEVELS.length - 1, Math.max(0, Number(id) || 0));
  return <PlayScreen key={index} index={index} />;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  screen: { flex: 1, paddingHorizontal: 14, paddingVertical: 8, gap: 8 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  titleBox: { flex: 1, minWidth: 0 },
  title: { fontFamily: FONTS.display, fontSize: 19, color: COLORS.white, textShadowColor: 'rgba(40,20,100,0.6)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 0 },
  sub: { fontFamily: FONTS.bodyBlack, fontSize: 12, color: COLORS.white },
  ib: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 5, borderBottomColor: '#C9C0F2' },
  ibOff: { opacity: 0.5 },
  ibPressed: { transform: [{ translateY: 3 }], borderBottomWidth: 2 },
  ibText: { fontSize: 18, color: COLORS.ink, fontFamily: FONTS.bodyBlack },
  hud: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  pill: { backgroundColor: 'rgba(255,255,255,0.92)', color: COLORS.ink, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 11, fontFamily: FONTS.bodyBlack, fontSize: 13, overflow: 'hidden' },
  pillNight: { backgroundColor: '#3A2A8A', color: '#FFE08A' },
  hint: { backgroundColor: 'rgba(255,255,255,0.95)', color: COLORS.ink, borderRadius: 16, padding: 9, fontFamily: FONTS.bodyBlack, fontSize: 14, textAlign: 'center', overflow: 'hidden' },
  hintNight: { backgroundColor: '#3A2A8A', color: COLORS.white },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  toast: { position: 'absolute', top: 6, alignSelf: 'center', backgroundColor: COLORS.white, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 16, boxShadow: '0 8px 16px rgba(20,10,60,0.25)' },
  toastText: { fontFamily: FONTS.bodyBlack, fontSize: 14, color: COLORS.ink },
  pad: { flexDirection: 'row', gap: 10 },
  padSide: { flex: 1 },
  padMid: { flex: 1.25, paddingVertical: 8 },
  arrow: { fontSize: 28, color: COLORS.white, fontFamily: FONTS.display },
  flipLabel: { fontSize: 18, color: COLORS.white, fontFamily: FONTS.display, marginTop: -4 },
  tip: { textAlign: 'center', fontFamily: FONTS.body, fontSize: 12, color: COLORS.inkSoft },
  over: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(15,8,45,0.45)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  panel: { backgroundColor: COLORS.white, borderRadius: 30, padding: 22, width: '100%', maxWidth: 360, alignItems: 'center', gap: 12, borderBottomWidth: 9, borderBottomColor: '#E1DBFA' },
  bigStars: { fontSize: 46, letterSpacing: 6 },
  winTitle: { fontFamily: FONTS.display, fontSize: 30, color: COLORS.grape },
  winText: { fontFamily: FONTS.body, fontSize: 15, color: '#5B5288', textAlign: 'center', lineHeight: 21 },
  row: { flexDirection: 'row', gap: 8 },
});
