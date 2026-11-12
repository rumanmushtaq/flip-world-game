import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export type DrakoMood = 'idle' | 'happy' | 'ouch';

const OUT = '#0B4F45';
const HEAD = '#22B08A';
const SCALE = '#169672';
const MUZZLE = '#9BEBD2';
const FRILL = '#FF8FD0';
const FRILL_DARK = '#D9559F';
const HORN = '#FFB347';
const HORN_DARK = '#B86A00';
const BLUSH = '#FF8FB8';

function Eyes({ mood }: { mood: DrakoMood }) {
  if (mood === 'happy') {
    return <Path d="M11.5 22 Q16 16.5 20.5 22 M27.5 22 Q32 16.5 36.5 22" stroke={OUT} strokeWidth={2.6} fill="none" strokeLinecap="round" />;
  }
  if (mood === 'ouch') {
    return <Path d="M12.5 16.5 L19.5 23 M19.5 16.5 L12.5 23 M28.5 16.5 L35.5 23 M35.5 16.5 L28.5 23" stroke={OUT} strokeWidth={2.4} strokeLinecap="round" />;
  }
  return (
    <>
      <Ellipse cx={16} cy={20} rx={5.4} ry={6.2} fill="#fff" stroke={OUT} strokeWidth={1.4} />
      <Ellipse cx={32} cy={20} rx={5.4} ry={6.2} fill="#fff" stroke={OUT} strokeWidth={1.4} />
      <Ellipse cx={17} cy={21.2} rx={3} ry={3.5} fill="#112233" />
      <Ellipse cx={31} cy={21.2} rx={3} ry={3.5} fill="#112233" />
      <Circle cx={18.2} cy={19.6} r={1.2} fill="#fff" />
      <Circle cx={32.2} cy={19.6} r={1.2} fill="#fff" />
      <Circle cx={16} cy={23} r={0.6} fill="#fff" />
      <Circle cx={30} cy={23} r={0.6} fill="#fff" />
    </>
  );
}

function Mouth({ mood }: { mood: DrakoMood }) {
  if (mood === 'happy') {
    return (
      <>
        <Path d="M17.5 36 Q24 44.5 30.5 36 Z" fill="#5A1530" stroke={OUT} strokeWidth={1.4} strokeLinejoin="round" />
        <Path d="M20.6 39.2 Q24 41.8 27.4 39.2" fill="#FF7AA8" />
      </>
    );
  }
  if (mood === 'ouch') {
    return <Path d="M17.6 38.4 q1.6 -1.6 3.2 0 q1.6 1.6 3.2 0 q1.6 -1.6 3.2 0 q1.6 1.6 3.2 0" stroke={OUT} strokeWidth={1.7} fill="none" strokeLinecap="round" />;
  }
  return (
    <>
      <Path d="M18 36.6 Q24 41.4 30 36.6" stroke={OUT} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <Path d="M26.2 38.2 L27.2 40.6 L28.3 37.8Z" fill="#fff" stroke={OUT} strokeWidth={0.7} strokeLinejoin="round" />
    </>
  );
}

/** Drako the baby dragon, head only: curved horns, pink side fins and crown spikes, a light snout, big eyes and one tiny fang. */
export function Drako({ size, mood = 'idle' }: { size: number; mood?: DrakoMood }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel="Drako the baby dragon">
      <Path d="M13.6 9.6 Q8.4 4.4 4.6 1.8 Q8.2 8.6 9.4 13.4Z" fill={HORN} stroke={HORN_DARK} strokeWidth={1.3} strokeLinejoin="round" />
      <Path d="M34.4 9.6 Q39.6 4.4 43.4 1.8 Q39.8 8.6 38.6 13.4Z" fill={HORN} stroke={HORN_DARK} strokeWidth={1.3} strokeLinejoin="round" />
      <Path d="M5.6 19 L0.6 14.6 L1.4 21.4 L-0.4 25.4 L5.4 25.2Z" fill={FRILL} stroke={FRILL_DARK} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M42.4 19 L47.4 14.6 L46.6 21.4 L48.4 25.4 L42.6 25.2Z" fill={FRILL} stroke={FRILL_DARK} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M19.4 6.6 L21.6 1.6 L24 6 L26.4 1.6 L28.6 6.6Z" fill={FRILL} stroke={FRILL_DARK} strokeWidth={1.2} strokeLinejoin="round" />

      <Path
        d="M24 5.4 C34.6 5.4 41.6 11 42.8 19.6 C43.8 26.4 44.2 31.6 41.2 36.6 C37.8 42.4 31.6 45.4 24 45.4 C16.4 45.4 10.2 42.4 6.8 36.6 C3.8 31.6 4.2 26.4 5.2 19.6 C6.4 11 13.4 5.4 24 5.4Z"
        fill={HEAD}
        stroke={OUT}
        strokeWidth={1.8}
      />
      <Circle cx={21} cy={9.6} r={1} fill={SCALE} />
      <Circle cx={24} cy={8.4} r={1.1} fill={SCALE} />
      <Circle cx={27} cy={9.6} r={1} fill={SCALE} />

      <Path d="M24 27.6 C32.6 27.6 37.4 31 37.4 35.4 C37.4 40.4 31.6 43.4 24 43.4 C16.4 43.4 10.6 40.4 10.6 35.4 C10.6 31 15.4 27.6 24 27.6Z" fill={MUZZLE} />
      <Ellipse cx={20.6} cy={31.6} rx={1.3} ry={0.95} fill={OUT} />
      <Ellipse cx={27.4} cy={31.6} rx={1.3} ry={0.95} fill={OUT} />

      {mood === 'ouch' ? (
        <Path d="M11 12.4 L19 14.6 M37 12.4 L29 14.6" stroke={OUT} strokeWidth={1.9} strokeLinecap="round" />
      ) : (
        <Path d="M11.6 12.6 Q15.8 10.2 20 12.4 M28 12.4 Q32.2 10.2 36.4 12.6" stroke={OUT} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      )}
      <Eyes mood={mood} />
      <Mouth mood={mood} />
      <Ellipse cx={9.4} cy={29} rx={3} ry={1.9} fill={BLUSH} opacity={0.8} />
      <Ellipse cx={38.6} cy={29} rx={3} ry={1.9} fill={BLUSH} opacity={0.8} />
      <Path d="M12.6 10.8 Q15.6 8.2 19 8" stroke="#fff" strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.5} />
    </Svg>
  );
}
