import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONTS } from '@/game/theme';

import { ChunkyButton } from './ChunkyButton';

const ROWS = [
  ['◀▶', 'Drako walks left and right, but he can’t jump.'],
  ['📱', 'Turn your phone upside down to flip the world, or tap FLIP. Its other side is a cave. Up turns into down, so Drako falls somewhere new.'],
  ['🥚', 'Reach the golden egg. It may be on the sun side or the cave side.'],
  ['🔑', 'Keys open doors. Walk into a door while you have a key.'],
  ['🔷', 'A crystal switch swaps the blue and pink blocks.'],
  ['📦', 'Walk into a box to push it. A box can fill a spike pit.'],
  ['⚠️', 'Spikes say ouch. You go back one step, no game over.'],
];

export function HowToPlay({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <View style={styles.panel}>
          <Text style={styles.title}>How to play</Text>
          <ScrollView contentContainerStyle={styles.list}>
            {ROWS.map(([icon, text]) => (
              <View key={icon} style={styles.row}>
                <View style={styles.icon}>
                  <Text style={styles.iconText}>{icon}</Text>
                </View>
                <Text style={styles.text}>{text}</Text>
              </View>
            ))}
          </ScrollView>
          <ChunkyButton label="Got it" color={COLORS.teal} shade={COLORS.tealDark} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(15,8,45,0.5)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  panel: { backgroundColor: COLORS.white, borderRadius: 30, padding: 20, width: '100%', maxWidth: 380, maxHeight: '90%', gap: 12, borderBottomWidth: 9, borderBottomColor: '#E1DBFA' },
  title: { fontFamily: FONTS.display, fontSize: 30, color: COLORS.grape, textAlign: 'center' },
  list: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F4F1FF', borderRadius: 16, padding: 10 },
  icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 3, borderBottomColor: COLORS.lilac },
  iconText: { fontSize: 20, fontFamily: FONTS.display, color: COLORS.grape },
  text: { flex: 1, fontFamily: FONTS.body, fontSize: 15, color: COLORS.ink, lineHeight: 20 },
});
