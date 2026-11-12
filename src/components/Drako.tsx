import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export type DrakoMood = 'idle' | 'happy' | 'ouch';

/** Small round Drako used on the board, matching the web Flip World. */
export function Drako({ size, mood = 'idle' }: { size: number; mood?: DrakoMood }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 46 46">
      <Path d="M38 34 Q46 36 44 26" stroke="#1D9E75" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Ellipse cx={7} cy={29} rx={5} ry={8.5} fill="#5DCAA5" transform="rotate(-28 7 29)" />
      <Ellipse cx={39} cy={29} rx={5} ry={8.5} fill="#5DCAA5" transform="rotate(28 39 29)" />
      <Path d="M10 12 L14 2 L18 12Z M28 12 L32 2 L36 12Z" fill="#FAC775" />
      <Circle cx={23} cy={25} r={17} fill="#1D9E75" />
      <Ellipse cx={23} cy={31} rx={9.5} ry={7} fill="#9FE1CB" />
      {mood === 'happy' ? (
        <Path d="M13 22 Q17 17 21 22 M25 22 Q29 17 33 22" stroke="#04342C" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      ) : mood === 'ouch' ? (
        <Path d="M14 19 L20 24 M20 19 L14 24 M26 19 L32 24 M32 19 L26 24" stroke="#04342C" strokeWidth={2.4} strokeLinecap="round" />
      ) : (
        <>
          <Circle cx={17} cy={22} r={5} fill="#fff" />
          <Circle cx={29} cy={22} r={5} fill="#fff" />
          <Circle cx={19} cy={23} r={2.6} fill="#04342C" />
          <Circle cx={31} cy={23} r={2.6} fill="#04342C" />
          <Circle cx={20} cy={22} r={0.9} fill="#fff" />
          <Circle cx={32} cy={22} r={0.9} fill="#fff" />
        </>
      )}
      {mood === 'happy' ? (
        <>
          <Path d="M17 29 Q23 38 29 29Z" fill="#04342C" />
          <Path d="M20 32.5 Q23 35 26 32.5" fill="#ff7aa8" />
        </>
      ) : mood === 'ouch' ? (
        <Ellipse cx={23} cy={31.5} rx={3} ry={3.6} fill="#04342C" />
      ) : (
        <Path d="M18 30 Q23 35 28 30" stroke="#04342C" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      )}
      <Circle cx={11.5} cy={28} r={2.6} fill="#ED93B1" opacity={0.85} />
      <Circle cx={34.5} cy={28} r={2.6} fill="#ED93B1" opacity={0.85} />
    </Svg>
  );
}
