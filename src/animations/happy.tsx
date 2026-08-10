// src/animations/happy.ts
import { useSharedValue, withSpring, withTiming, useAnimatedStyle, withSequence } from 'react-native-reanimated';
import { useEffect } from 'react';

export const useHappyAnimation = (isPlaying: boolean) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      // Sequência de pulo: sobe, desce, volta ao normal
      scale.value = withSequence(
        withTiming(1.15, { duration: 150 }),
        withTiming(0.95, { duration: 100 }),
        withTiming(1, { duration: 150 })
      );
      
      translateY.value = withSequence(
        withTiming(-20, { duration: 200 }),
        withTiming(0, { duration: 200 })
      );

      // Reset após 1.5 segundos
      setTimeout(() => {
        scale.value = withSpring(1);
        translateY.value = withSpring(0);
      }, 1500);
    }
  }, [isPlaying]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return { happyStyle: animatedStyle };
};