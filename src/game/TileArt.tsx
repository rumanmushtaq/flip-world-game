import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

type P = { size: number };

export const SpikeArt = ({ size }: P) => (
  <Svg width={size} height={size * 0.6} viewBox="0 0 30 18" preserveAspectRatio="none">
    <Path d="M0 18 L5 2 L10 18 L15 2 L20 18 L25 2 L30 18Z" fill="#ff5d8f" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />
  </Svg>
);

export const EggArt = ({ size }: P) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Ellipse cx={20} cy={19} rx={9.5} ry={12} fill="#ffd34d" stroke="#e0a100" strokeWidth={2} />
    <Ellipse cx={16.5} cy={14} rx={2.5} ry={3.5} fill="#fff6c9" />
    <Path d="M3 26 Q20 36 37 26 L35 33 Q20 41 5 33Z" fill="#b5793a" />
    <Path d="M5 28 Q20 35 35 28 M7 31 Q20 37 33 31" stroke="#7a4a1f" strokeWidth={1.6} fill="none" />
  </Svg>
);

export const GemArt = ({ size, cave }: P & { cave: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Path d="M20 5 L33 16 L20 35 L7 16Z" fill={cave ? '#ff8de0' : '#7ee3ff'} stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
    <Path d="M7 16 H33 M14 16 L20 5 L26 16 L20 35Z" stroke="#fff" strokeWidth={1.4} fill="none" opacity={0.75} />
  </Svg>
);

export const KeyArt = ({ size }: P) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Circle cx={13} cy={20} r={8} fill="none" stroke="#ffc22e" strokeWidth={5} />
    <Path d="M21 20 H36 M31 20 V27 M36 20 V25" stroke="#ffc22e" strokeWidth={5} strokeLinecap="round" />
    <Circle cx={13} cy={20} r={8} fill="none" stroke="#fff3b0" strokeWidth={1.5} />
  </Svg>
);

export const DoorArt = ({ size }: P) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Rect x={5} y={1} width={30} height={39} rx={4} fill="#9a5b2c" stroke="#5e3410" strokeWidth={2.5} />
    <Path d="M12 7 V37 M20 7 V37 M28 7 V37" stroke="#7a4518" strokeWidth={2} />
    <Circle cx={20} cy={19} r={4.5} fill="#ffc22e" stroke="#7a4518" strokeWidth={1.5} />
    <Path d="M20 21 V27" stroke="#5e3410" strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

export const BoxArt = ({ size }: P) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Rect x={2} y={2} width={36} height={36} rx={5} fill="#d9954b" />
    <Path d="M7 7 L33 33 M33 7 L7 33" stroke="#a8682c" strokeWidth={4.5} strokeLinecap="round" />
    <Rect x={2} y={2} width={36} height={36} rx={5} fill="none" stroke="#7a4a1f" strokeWidth={3} />
  </Svg>
);

export const SwitchArt = ({ size, on }: P & { on: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Rect x={3} y={31} width={34} height={8} rx={3} fill="#5c5480" />
    <Ellipse cx={20} cy={30} rx={11} ry={7} fill={on ? '#ff6fae' : '#4aa8ff'} stroke={on ? '#c43d7c' : '#1f6fc0'} strokeWidth={2} />
    <Ellipse cx={17} cy={27.5} rx={4} ry={1.6} fill="#fff" opacity={0.6} />
  </Svg>
);
