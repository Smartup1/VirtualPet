// src/animations/dance.ts
import {
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useEffect } from 'react';

// Animação de dança: balanço lateral (rotate) + pulo no ritmo (translateY)
// + esticar/achatar (squash & stretch) combinados, pra dar sensação real
// de "passinho de dança" em vez de só um pulo único.
export const useDanceAnimation = (isDancing: boolean) => {
  const rotate = useSharedValue(0);
  const bounce = useSharedValue(0);
  const squash = useSharedValue(1);

  useEffect(() => {
    if (isDancing) {
      // 4 "batidas" de balanço esquerda/direita
      rotate.value = withSequence(
        withTiming(-9, { duration: 170 }),
        withTiming(9, { duration: 170 }),
        withTiming(-9, { duration: 170 }),
        withTiming(9, { duration: 170 }),
        withTiming(-5, { duration: 150 }),
        withTiming(5, { duration: 150 }),
        withTiming(0, { duration: 160 })
      );

      // pulos acompanhando o balanço
      bounce.value = withSequence(
        withTiming(-13, { duration: 170 }),
        withTiming(0, { duration: 170 }),
        withTiming(-13, { duration: 170 }),
        withTiming(0, { duration: 170 }),
        withTiming(-7, { duration: 150 }),
        withTiming(0, { duration: 150 }),
        withTiming(0, { duration: 160 })
      );

      // achatar/esticar em cada pulo, pra dar elasticidade
      squash.value = withSequence(
        withTiming(1.07, { duration: 170 }),
        withTiming(0.94, { duration: 170 }),
        withTiming(1.07, { duration: 170 }),
        withTiming(0.94, { duration: 170 }),
        withTiming(1, { duration: 310 })
      );

      const timeout = setTimeout(() => {
        rotate.value = withSpring(0);
        bounce.value = withSpring(0);
        squash.value = withSpring(1);
      }, 1350);

      return () => clearTimeout(timeout);
    }
  }, [isDancing]);

  const danceStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounce.value },
      { rotate: `${rotate.value}deg` },
      { scaleX: 2 - squash.value },
      { scaleY: squash.value },
    ],
  }));

  return { danceStyle };
};
