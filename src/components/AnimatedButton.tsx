import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { colors } from "@styles/colors";
import { radius, shadow, spacing } from "@styles/theme";

interface AnimatedButtonProps {
  label: string;
  icon?: string;
  color?: string;
  onPress: () => void;
  style?: ViewStyle;
}

const AnimatedPressable =
  Animated.createAnimatedComponent(Pressable);

export default function AnimatedButton({
  label,
  icon,
  color = colors.primary,
  onPress,
  style,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
      {
        translateY: translateY.value,
      },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.93, {
      damping: 12,
      stiffness: 300,
    });

    translateY.value = withSpring(3, {
      damping: 12,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 250,
    });

    translateY.value = withSpring(0, {
      damping: 10,
      stiffness: 250,
    });
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: color,
        },
        style,
        animatedStyle,
      ]}
    >
      {icon ? (
        <Text style={styles.icon}>
          {icon}
        </Text>
      ) : null}

      <Text style={styles.label}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,

    minHeight: 82,

    borderRadius: radius.lg,

    paddingVertical: spacing.md,

    alignItems: "center",
    justifyContent: "center",

    ...shadow.button,
  },

  icon: {
    fontSize: 32,

    marginBottom: 4,
  },

  label: {
    color: colors.white,

    fontWeight: "800",

    fontSize: 14,

    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },
});