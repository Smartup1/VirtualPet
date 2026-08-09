import React from "react";
import { View, StyleSheet } from "react-native";
import AnimatedButton from "./AnimatedButton";
import { colors } from "@styles/colors";
import { spacing } from "@styles/theme";
import { PetAction } from "@ptypes/index";

interface BottomActionsProps {
  onAction: (action: PetAction) => void;
}

export default function BottomActions({ onAction }: BottomActionsProps) {
  return (
    <View style={styles.container}>
      <AnimatedButton label="Comer" icon="🍖" color={colors.hunger} onPress={() => onAction("feed")} />
      <AnimatedButton label="Brincar" icon="🎮" color={colors.happiness} onPress={() => onAction("play")} />
      <AnimatedButton label="Dormir" icon="😴" color={colors.sleep} onPress={() => onAction("sleep")} />
      <AnimatedButton label="Banho" icon="🛁" color={colors.hygiene} onPress={() => onAction("bathe")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
});
