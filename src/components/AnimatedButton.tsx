import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";

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

// escurece uma cor hex — usada pra gerar o tom de baixo do gradiente
// e a "borda" do bisel inferior, a partir da cor base do botão
function darkenColor(hex: string, amount = 0.22): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(255 * amount));
  const b = Math.max(0, (num & 0x0000ff) - Math.round(255 * amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// clareia uma cor hex — topo do gradiente, dá o "pico de luz" do botão
function lightenColor(hex: string, amount = 0.18): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * amount));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

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
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.93, { damping: 12, stiffness: 300 });
    translateY.value = withSpring(3, { damping: 12, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 250 });
    translateY.value = withSpring(0, { damping: 10, stiffness: 250 });
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[
        styles.buttonOuter,
        style,
        animatedStyle,
        { shadowColor: color }, // sombra colorida com a cor do próprio botão, em vez de preto genérico
      ]}
    >
      <View style={styles.buttonInner}>
        {/* corpo em gradiente (claro em cima, escuro embaixo) em vez de cor chapada */}
        <LinearGradient
          colors={[lightenColor(color), color, darkenColor(color)]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* brilho vidrado na metade superior — efeito "botão de doce" */}
        <View style={styles.glossHighlight} pointerEvents="none" />

        {/* bisel inferior escuro — dá espessura/3D, como se o botão tivesse volume real */}
        <View
          style={[styles.bottomBevel, { backgroundColor: darkenColor(color, 0.38) }]}
          pointerEvents="none"
        />

        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <Text style={styles.label}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  buttonOuter: {
    flex: 1,
    minHeight: 82,
    borderRadius: radius.lg,
    ...shadow.button,
    shadowOpacity: 0.3,
  },
  buttonInner: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  glossHighlight: {
    position: "absolute",
    top: 3,
    left: 6,
    right: 6,
    height: "48%",
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  bottomBevel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 7,
    opacity: 0.55,
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
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
