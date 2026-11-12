import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { loadProgress } from '@/game/progress';
import { initSfx } from '@/game/sfx';
import { COLORS } from '@/game/theme';

SplashScreen.preventAutoHideAsync();
initSfx();
loadProgress();

export default function RootLayout() {
  const [loaded, error] = useFonts({ LilitaOne_400Regular, Nunito_800ExtraBold, Nunito_900Black });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.skyTop }, animation: 'fade' }} />
    </>
  );
}
