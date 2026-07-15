import React from "react";
import { StyleSheet, Text, ViewStyle } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors } from "@styles/colors";
import { radius, shadow, spacing } from "@styles/theme";

interface AnimatedButtonProps {
  label: string;
  icon?: string;
  color?: string;
  onPress: () => void;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AnimatedButton({ label, icon, color = colors.primary, onPress, style }: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => (scale.value = withTiming(0.92, { duration: 100 }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: 100 }))}
      onPress={onPress}
      style={[styles.button, { backgroundColor: color }, style, animatedStyle]}
    >
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={styles.label}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.button,
  },
  icon: {
    fontSize: 22,
    marginBottom: 2,
  },
  label: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 12,
  },
});
