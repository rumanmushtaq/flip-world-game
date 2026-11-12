import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { sfx } from '@/game/sfx';
import { COLORS, FONTS } from '@/game/theme';

type Props = {
  label?: string;
  children?: ReactNode;
  onPress: () => void;
  color?: string;
  shade?: string;
  size?: 'lg' | 'md' | 'sm';
  glow?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Big game button with a solid bottom edge that squashes when pressed. */
export function ChunkyButton({ label, children, onPress, color = COLORS.grape, shade = COLORS.grapeDark, size = 'lg', glow, accessibilityLabel, style }: Props) {
  const pad = size === 'lg' ? 16 : size === 'md' ? 12 : 9;
  const font = size === 'lg' ? 24 : size === 'md' ? 19 : 16;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={() => {
        sfx('tap');
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: color, borderBottomColor: shade, paddingVertical: pad, borderBottomWidth: pressed ? 3 : 7, transform: [{ translateY: pressed ? 4 : 0 }] },
        glow && styles.glow,
        style,
      ]}
    >
      {children ?? <Text style={[styles.label, { fontSize: font }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 18px rgba(20,10,60,0.25)',
  },
  glow: { boxShadow: '0 0 0 5px #FFD34D, 0 0 24px 8px rgba(255,211,77,0.8)' },
  label: { fontFamily: FONTS.display, color: COLORS.white, letterSpacing: 0.4 },
});
