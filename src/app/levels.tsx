import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LEVELS, LEVELS_PER_WORLD, WORLDS } from '@/game/levels';
import { isUnlocked, useProgress } from '@/game/progress';
import { sfx } from '@/game/sfx';
import { COLORS, FONTS } from '@/game/theme';

const Stars = ({ n }: { n: number }) => (
  <Text style={styles.stars}>
    {[1, 2, 3].map(i => (
      <Text key={i} style={{ color: i <= n ? COLORS.starOn : COLORS.starOff }}>
        ★
      </Text>
    ))}
  </Text>
);

export default function Levels() {
  const p = useProgress();
  const total = LEVELS.reduce((a, _, i) => a + (p.stars[i] ?? 0), 0);
  const nextI = LEVELS.findIndex((_, i) => isUnlocked(p, i) && !p.stars[i]);

  return (
    <LinearGradient colors={[COLORS.skyTop, COLORS.skyLow]} style={styles.fill}>
      <SafeAreaView style={styles.fill} edges={['top', 'left', 'right']}>
        <View style={styles.head}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>⟵</Text>
          </Pressable>
          <Text style={styles.h1}>Choose a level</Text>
          <Text style={styles.total}>
            ★ {total} / {LEVELS.length * 3}
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.list}>
          {WORLDS.map((w, wi) => {
            const ids = Array.from({ length: LEVELS_PER_WORLD }, (_, k) => wi * LEVELS_PER_WORLD + k);
            const ws = ids.reduce((a, i) => a + (p.stars[i] ?? 0), 0);
            return (
              <View key={w.name} style={styles.world}>
                <LinearGradient colors={[w.dark, w.light]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.whead}>
                  <Text style={styles.wicon}>{w.icon}</Text>
                  <View style={styles.flex}>
                    <Text style={styles.wname}>{w.name}</Text>
                    <Text style={styles.wsub}>
                      World {wi + 1} · levels {ids[0] + 1}–{ids[ids.length - 1] + 1}
                    </Text>
                  </View>
                  <Text style={styles.wstars}>
                    ★ {ws}/{ids.length * 3}
                  </Text>
                </LinearGradient>
                <View style={styles.grid}>
                  {ids.map(i => {
                    const open = isUnlocked(p, i);
                    return (
                      <Pressable
                        key={i}
                        accessibilityRole="button"
                        accessibilityLabel={`Level ${i + 1}, ${LEVELS[i].name}${open ? '' : ', locked'}`}
                        onPress={() => {
                          if (!open) {
                            sfx('bump');
                            return;
                          }
                          sfx('tap');
                          router.push({ pathname: '/play/[id]', params: { id: String(i) } });
                        }}
                        style={({ pressed }) => [styles.lv, !open && styles.locked, i === nextI && styles.next, pressed && styles.pressed]}
                      >
                        <LinearGradient colors={open ? [w.light, w.light, w.dark, w.dark] : ['#C9C0F2', '#C9C0F2']} locations={open ? [0, 0.5, 0.5, 1] : undefined} style={styles.num}>
                          <Text style={styles.numText}>{open ? i + 1 : '🔒'}</Text>
                        </LinearGradient>
                        <View style={styles.meta}>
                          <Text numberOfLines={1} style={[styles.name, !open && { color: '#9A92C4' }]}>
                            {LEVELS[i].name}
                          </Text>
                          <Stars n={p.stars[i] ?? 0} />
                          <Text style={styles.small}>
                            Par {LEVELS[i].par} · 💎 {p.gems[i] ? '1' : '0'}/1
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  flex: { flex: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10 },
  back: { width: 46, height: 46, borderRadius: 15, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 5, borderBottomColor: '#C9C0F2' },
  backText: { fontSize: 22, color: COLORS.ink, fontFamily: FONTS.bodyBlack },
  h1: { flex: 1, fontFamily: FONTS.display, fontSize: 26, color: COLORS.white, textShadowColor: '#5B4BD6', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 0 },
  total: { backgroundColor: COLORS.white, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12, fontFamily: FONTS.display, color: '#B7791F', overflow: 'hidden' },
  list: { paddingHorizontal: 16, paddingBottom: 40, gap: 18 },
  world: { gap: 10 },
  whead: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 20 },
  wicon: { fontSize: 28 },
  wname: { fontFamily: FONTS.display, fontSize: 21, color: COLORS.white, textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 0 },
  wsub: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.white },
  wstars: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10, fontFamily: FONTS.display, color: '#B7791F', overflow: 'hidden' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  lv: { width: '48.5%', flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 20, backgroundColor: COLORS.white, borderBottomWidth: 7, borderBottomColor: COLORS.lilac },
  locked: { backgroundColor: '#ECE8FB' },
  next: { boxShadow: '0 0 0 4px #FFD34D' },
  pressed: { transform: [{ translateY: 3 }], borderBottomWidth: 4 },
  num: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: FONTS.display, fontSize: 22, color: COLORS.white, textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 0 },
  meta: { flex: 1, minWidth: 0 },
  name: { fontFamily: FONTS.display, fontSize: 15, color: COLORS.ink },
  stars: { fontSize: 15, letterSpacing: 1 },
  small: { fontFamily: FONTS.body, fontSize: 11, color: COLORS.inkSoft },
});
