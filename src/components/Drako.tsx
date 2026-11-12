import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export type DrakoMood = 'idle' | 'happy' | 'ouch';

const OUT = '#0B4F45';
const HEAD = '#2CC79A';
const HEAD_SHADE = '#1FAE85';
const FACE = '#BDF5E3';
const HORN = '#FFD27A';
const HORN_DARK = '#D99A2B';
const FIN = '#FF9FD6';
const FIN_DARK = '#E06AAE';
const EYE = '#1D1B2E';
const BLUSH = '#FF8FB8';
const MOUTH = '#7A1F45';

function Eyes({ mood }: { mood: DrakoMood }) {
  if (mood === 'happy') {
    return <Path d="M10.6 28 Q14.6 22.4 18.6 28 M29.4 28 Q33.4 22.4 37.4 28" stroke={EYE} strokeWidth={2.8} fill="none" strokeLinecap="round" />;
  }
  if (mood === 'ouch') {
    return (
      <>
        <Path d="M10.8 23.6 L17.6 26.6 L10.8 29.6 M37.2 23.6 L30.4 26.6 L37.2 29.6" stroke={EYE} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9.4 31.4 Q8 34.4 9.6 35.6 Q11.4 34.6 9.4 31.4Z" fill="#7FD3FF" stroke="#3A8FD0" strokeWidth={0.8} />
      </>
    );
  }
  return (
    <>
      <Ellipse cx={14.6} cy={26.6} rx={5} ry={5.8} fill={EYE} />
      <Ellipse cx={33.4} cy={26.6} rx={5} ry={5.8} fill={EYE} />
      <Circle cx={16.4} cy={24.2} r={2.1} fill="#fff" />
      <Circle cx={35.2} cy={24.2} r={2.1} fill="#fff" />
      <Circle cx={12.9} cy={29.2} r={1.05} fill="#fff" />
      <Circle cx={31.7} cy={29.2} r={1.05} fill="#fff" />
    </>
  );
}

function Mouth({ mood }: { mood: DrakoMood }) {
  if (mood === 'happy') {
    return (
      <>
        <Path d="M20 33.4 Q24 40.6 28 33.4 Z" fill={MOUTH} stroke={EYE} strokeWidth={1.3} strokeLinejoin="round" />
        <Path d="M21.8 36.4 Q24 38.4 26.2 36.4" fill="#FF7AA8" />
      </>
    );
  }
  if (mood === 'ouch') {
    return <Ellipse cx={24} cy={35.4} rx={2.2} ry={2.6} fill={MOUTH} stroke={EYE} strokeWidth={1.2} />;
  }
  return (
    <>
      <Path d="M20.4 34 Q22.2 36.6 24 34.2 Q25.8 36.6 27.6 34" stroke={EYE} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M25.4 35.4 L26 37.2 L26.8 35.3Z" fill="#fff" stroke={EYE} strokeWidth={0.6} strokeLinejoin="round" />
    </>
  );
}

/** Drako the baby dragon, head only, drawn cute: chubby round head, soft horns, big sparkly eyes, a tiny "w" mouth and pink cheeks. */
export function Drako({ size, mood = 'idle' }: { size: number; mood?: DrakoMood }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel="Drako the baby dragon">
      <Path d="M14.4 13.4 Q12.2 6.6 9.6 4.6 Q8.2 4.2 8.4 5.8 Q9.6 10.6 10.6 15.4Z" fill={HORN} stroke={HORN_DARK} strokeWidth={1.3} strokeLinejoin="round" />
      <Path d="M33.6 13.4 Q35.8 6.6 38.4 4.6 Q39.8 4.2 39.6 5.8 Q38.4 10.6 37.4 15.4Z" fill={HORN} stroke={HORN_DARK} strokeWidth={1.3} strokeLinejoin="round" />
      <Path d="M4.8 22 Q-0.6 19.6 0.6 25.4 Q1.4 29 5.2 28.6Z" fill={FIN} stroke={FIN_DARK} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M43.2 22 Q48.6 19.6 47.4 25.4 Q46.6 29 42.8 28.6Z" fill={FIN} stroke={FIN_DARK} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M21.4 9.6 Q22.6 3.8 24.6 3.6 Q26.2 4.2 26.8 9.6Z" fill={FIN} stroke={FIN_DARK} strokeWidth={1.2} strokeLinejoin="round" />

      <Path d="M24 8.6 C36.4 8.6 44 16.4 44 27 C44 37.8 35.6 45 24 45 C12.4 45 4 37.8 4 27 C4 16.4 11.6 8.6 24 8.6Z" fill={HEAD} stroke={OUT} strokeWidth={1.8} />
      <Path d="M8.6 33.8 C10.6 40 16.6 43.6 24 43.6 C31.4 43.6 37.4 40 39.4 33.8 C36 37.4 30.6 39.4 24 39.4 C17.4 39.4 12 37.4 8.6 33.8Z" fill={HEAD_SHADE} opacity={0.6} />
      <Ellipse cx={24} cy={35} rx={9.4} ry={6.4} fill={FACE} />
      <Circle cx={21.6} cy={30.6} r={0.65} fill={OUT} />
      <Circle cx={26.4} cy={30.6} r={0.65} fill={OUT} />
      <Circle cx={20.4} cy={14.4} r={1.2} fill={HEAD_SHADE} />
      <Circle cx={24} cy={13} r={1.4} fill={HEAD_SHADE} />
      <Circle cx={27.6} cy={14.4} r={1.2} fill={HEAD_SHADE} />

      <Eyes mood={mood} />
      <Mouth mood={mood} />
      <Ellipse cx={9.2} cy={33.2} rx={3.8} ry={2.4} fill={BLUSH} opacity={0.85} />
      <Ellipse cx={38.8} cy={33.2} rx={3.8} ry={2.4} fill={BLUSH} opacity={0.85} />
      <Path d="M11.4 16.6 Q14.6 12.6 19.4 11.8" stroke="#fff" strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.55} />
    </Svg>
  );
}
