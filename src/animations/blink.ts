import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";

/**
 * Simula o piscar dos olhos: escala vertical do "olho" vai a quase 0 e volta,
 * com uma pausa aleatória entre cada piscada para parecer mais natural.
 */
export function useBlinkAnimation() {
  const scaleY = useSharedValue(1);

  useEffect(() => {
    scaleY.value = withRepeat(
      withSequence(
        withDelay(2000 + Math.random() * 2000, withTiming(0.1, { duration: 90 })),
        withTiming(1, { duration: 90 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
  }));

  return animatedStyle;
}
