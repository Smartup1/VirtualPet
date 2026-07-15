import { useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";

/**
 * Animação disparada manualmente (chame `play()`) quando o pet come:
 * um pequeno pulo + squash and stretch.
 */
export function useEatAnimation() {
  const translateY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  function play() {
    translateY.value = withSequence(
      withTiming(-20, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );
    scaleY.value = withSequence(
      withTiming(0.85, { duration: 100 }),
      withTiming(1.1, { duration: 120 }),
      withTiming(1, { duration: 120 })
    );
    scaleX.value = withSequence(
      withTiming(1.1, { duration: 100 }),
      withTiming(0.95, { duration: 120 }),
      withTiming(1, { duration: 120 })
    );
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
    ],
  }));

  return { animatedStyle, play };
}
