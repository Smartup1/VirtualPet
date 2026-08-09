import React, { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface FoodAnimationProps {
  visible: boolean;
  onFinish: () => void;
}

export default function FoodAnimation({
  visible,
  onFinish,
}: FoodAnimationProps) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      return;
    }

    // posição inicial
    x.value = 0;
    y.value = 0;
    scale.value = 1;
    rotate.value = 0;

    opacity.value = withTiming(1, {
      duration: 150,
    });

    // Carne sobe em direção à boca
    x.value = withTiming(0, {
      duration: 850,
    });

    y.value = withSequence(
      withTiming(-height * 0.34, {
        duration: 850,
      }),
      withTiming(-height * 0.36, {
        duration: 120,
      })
    );

    rotate.value = withSequence(
      withTiming(-15, {
        duration: 250,
      }),
      withTiming(15, {
        duration: 250,
      }),
      withTiming(0, {
        duration: 250,
      })
    );

    // Pequeno aumento ao chegar na boca
    scale.value = withSequence(
      withTiming(1.1, {
        duration: 650,
      }),
      withSpring(0.2, {
        damping: 10,
        stiffness: 250,
      })
    );

    // desaparece depois de chegar na boca
    opacity.value = withDelay(
      700,
      withTiming(0, {
        duration: 250,
      })
    );

    setTimeout(() => {
      onFinish();
    }, 1000);
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: x.value,
      },
      {
        translateY: y.value,
      },
      {
        scale: scale.value,
      },
      {
        rotate: `${rotate.value}deg`,
      },
    ],

    opacity: opacity.value,
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.food,
        animatedStyle,
      ]}
    >
      <Text style={styles.meat}>
        🥩
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  food: {
    position: "absolute",

    left: width / 2 - 25,
    bottom: height * 0.20,

    width: 50,
    height: 50,

    alignItems: "center",
    justifyContent: "center",

    zIndex: 100,
  },

  meat: {
    fontSize: 42,
  },
});