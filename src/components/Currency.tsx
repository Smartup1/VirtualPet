import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@styles/colors";
import { radius, shadow, spacing } from "@styles/theme";

interface CurrencyProps {
  coins: number;
  gems: number;
}

export default function Currency({ coins, gems }: CurrencyProps) {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <Text style={styles.icon}>🪙</Text>
        <Text style={styles.value}>{coins}</Text>
      </View>
      <View style={styles.pill}>
        <Text style={styles.icon}>💎</Text>
        <Text style={styles.value}>{gems}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    gap: 4,
    ...shadow.card,
  },
  icon: {
    fontSize: 14,
  },
  value: {
    fontWeight: "700",
    color: colors.textDark,
    fontSize: 13,
  },
});
