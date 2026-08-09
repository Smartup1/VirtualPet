import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors } from "@styles/colors";
import { radius, spacing } from "@styles/theme";

interface StatusBarItemProps {
  label: string;
  value: number; // 0-100
  color: string;
  icon: string; // emoji ou caminho de ícone
}

export function StatusBarItem({ label, value, color, icon }: StatusBarItemProps) {
  const width = useSharedValue(value);

  useEffect(() => {
    width.value = withTiming(value, { duration: 400 });
  }, [value]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

interface StatusBarsProps {
  hunger: number;
  happiness: number;
  sleep: number;
  hygiene: number;
}

export default function StatusBars({ hunger, happiness, sleep, hygiene }: StatusBarsProps) {
  return (
    <View style={styles.container}>
      <StatusBarItem label="Fome" value={hunger} color={colors.hunger} icon="🍖" />
      <StatusBarItem label="Felicidade" value={happiness} color={colors.happiness} icon="😊" />
      <StatusBarItem label="Sono" value={sleep} color={colors.sleep} icon="😴" />
      <StatusBarItem label="Higiene" value={hygiene} color={colors.hygiene} icon="🛁" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  icon: {
    fontSize: 16,
    width: 22,
    textAlign: "center",
  },
  track: {
    flex: 1,
    height: 10,
    backgroundColor: colors.barBackground,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
  },
});
