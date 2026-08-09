import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

/**
 * Animação de "zzz" flutuando + leve balanço do corpo enquanto dorme.
 * `active` controla se a animação deve rodar (baseado no mood === "sleeping").
 */
export function useSleepAnimation(active: boolean) {
  const rotate = useSharedValue(0);
  const zOpacity = useSharedValue(0);

  useEffect(() => {
    if (active) {
      rotate.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 1000 }),
          withTiming(3, { duration: 1000 })
        ),
        -1,
        true
      );
      zOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        false
      );
    } else {
      rotate.value = withTiming(0, { duration: 300 });
      zOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [active]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotate.value}deg` }],
  }));

  const zStyle = useAnimatedStyle(() => ({
    opacity: zOpacity.value,
  }));

  return { bodyStyle, zStyle };
}
