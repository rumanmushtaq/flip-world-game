import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChunkyButton } from '@/components/ChunkyButton';
import { Drako } from '@/components/Drako';
import { HowToPlay } from '@/components/HowToPlay';
import { updateProgress, useProgress } from '@/game/progress';
import { COLORS, FONTS } from '@/game/theme';

function Logo() {
  const rot = useSharedValue(0);
  useEffect(() => {
    rot.set(withRepeat(withSequence(withDelay(1800, withTiming(180, { duration: 900 })), withDelay(1800, withTiming(360, { duration: 900 }))), -1));
  }, [rot]);
  const card = useAnimatedStyle(() => ({ transform: [{ perspective: 900 }, { rotateX: `${rot.get()}deg` }] }));
  const front = useAnimatedStyle(() => ({ opacity: rot.get() % 360 < 90 || rot.get() % 360 >= 270 ? 1 : 0 }));
  const back = useAnimatedStyle(() => ({ opacity: rot.get() % 360 >= 90 && rot.get() % 360 < 270 ? 1 : 0 }));
  return (
    <Animated.View style={[styles.logo, card]}>
      <Animated.View style={[styles.logoFace, front]}>
        <LinearGradient colors={['#74D0FF', '#C6EFFF']} style={styles.half}>
          <View style={styles.sun} />
          <Text style={[styles.word, styles.flipWord]}>FLIP</Text>
        </LinearGradient>
        <View style={styles.horizon} />
        <LinearGradient colors={['#2A1C63', '#120B33']} style={styles.half}>
          <Text style={[styles.word, styles.worldWord]}>WORLD</Text>
        </LinearGradient>
        <View style={styles.logoDrako}>
          <Drako size={72} mood="happy" />
        </View>
      </Animated.View>
      <Animated.View style={[styles.logoFace, styles.logoBack, back]}>
        <LinearGradient colors={['#2A1C63', '#120B33']} style={styles.half}>
          <Text style={[styles.word, { color: COLORS.sun, textShadowColor: COLORS.grape }]}>WORLD</Text>
        </LinearGradient>
        <View style={styles.horizon} />
        <LinearGradient colors={['#74D0FF', '#C6EFFF']} style={styles.half}>
          <Text style={[styles.word, styles.flipWord, { transform: [{ rotate: '180deg' }] }]}>FLIP</Text>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

function Toggle({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: on }} onPress={onPress} style={[styles.toggle, !on && styles.toggleOff]}>
      <Text style={styles.toggleText}>
        {label} {on ? 'on' : 'off'}
      </Text>
    </Pressable>
  );
}

export default function Title() {
  const p = useProgress();
  const [how, setHow] = useState(false);
  const [goAfterHow, setGoAfterHow] = useState(false);
  return (
    <LinearGradient colors={[COLORS.skyTop, COLORS.skyLow]} style={styles.fill}>
      <SafeAreaView style={styles.screen}>
        <Logo />
        <Text style={styles.tag}>
          Drako can’t jump. To go up, <Text style={{ color: COLORS.grape }}>turn your phone upside down</Text> and flip the whole world.
        </Text>
        <View style={styles.row}>
          <ChunkyButton
            label="▶ Play"
            color={COLORS.coral}
            shade={COLORS.coralDark}
            onPress={() => {
              if (p.seenHow) router.push('/levels');
              else {
                setGoAfterHow(true);
                setHow(true);
              }
            }}
          />
          <ChunkyButton label="How to play" onPress={() => setHow(true)} />
        </View>
        <View style={styles.row}>
          <Toggle label="📱 Tilt to flip" on={p.tilt} onPress={() => updateProgress(s => ({ ...s, tilt: !s.tilt }))} />
          <Toggle label="🔊 Sound" on={p.sound} onPress={() => updateProgress(s => ({ ...s, sound: !s.sound }))} />
        </View>
      </SafeAreaView>
      <HowToPlay
        visible={how}
        onClose={() => {
          setHow(false);
          updateProgress(s => ({ ...s, seenHow: true }));
          if (goAfterHow) {
            setGoAfterHow(false);
            router.push('/levels');
          }
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22, paddingHorizontal: 16 },
  logo: { width: '86%', maxWidth: 380, aspectRatio: 1 / 1.05 },
  logoFace: { ...StyleSheet.absoluteFill, borderRadius: 34, overflow: 'hidden', borderWidth: 5, borderColor: COLORS.white, boxShadow: '0 20px 40px rgba(20,10,60,0.3)' },
  logoBack: { transform: [{ rotateX: '180deg' }] },
  half: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  horizon: { height: 16, backgroundColor: '#A5673A', borderTopWidth: 7, borderTopColor: '#5FD35A' },
  sun: { position: 'absolute', top: 16, right: 22, width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.sun, boxShadow: '0 0 0 10px rgba(255,211,77,0.3)' },
  word: { fontFamily: FONTS.display, fontSize: 64, color: COLORS.white, letterSpacing: 2, textShadowOffset: { width: 0, height: 5 }, textShadowRadius: 0 },
  flipWord: { textShadowColor: '#FF8A3D' },
  worldWord: { color: COLORS.sun, textShadowColor: COLORS.grape, transform: [{ rotate: '180deg' }] },
  logoDrako: { position: 'absolute', alignSelf: 'center', top: '50%', marginTop: -66 },
  tag: { fontFamily: FONTS.bodyBlack, fontSize: 17, color: COLORS.ink, textAlign: 'center', maxWidth: 330, lineHeight: 24 },
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  toggle: { backgroundColor: COLORS.white, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, borderBottomWidth: 4, borderBottomColor: COLORS.lilac },
  toggleOff: { opacity: 0.6 },
  toggleText: { fontFamily: FONTS.bodyBlack, fontSize: 14, color: COLORS.ink },
});
