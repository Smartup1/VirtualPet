import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Currency from "./Currency";
import { colors } from "@styles/colors";
import { radius, shadow, spacing } from "@styles/theme";

interface TopBarProps {
  petName: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  gems: number;
}

export default function TopBar({ petName, level, xp, xpToNextLevel, coins, gems }: TopBarProps) {
  const xpPercent = Math.min(100, (xp / xpToNextLevel) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>Nv. {level}</Text>
        <View style={styles.xpTrack}>
          <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
        </View>
      </View>
      <Text style={styles.name}>{petName}</Text>
      <Currency coins={coins} gems={gems} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  levelBadge: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    width: 70,
    ...shadow.card,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textDark,
    textAlign: "center",
  },
  xpTrack: {
    height: 4,
    backgroundColor: colors.barBackground,
    borderRadius: radius.pill,
    marginTop: 4,
    overflow: "hidden",
  },
  xpFill: {
    height: "100%",
    backgroundColor: colors.secondary,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textDark,
  },
});
