import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
  onMenuPress?: () => void;
}

export default function TopBar({
  petName,
  level,
  xp,
  xpToNextLevel,
  coins,
  gems,
  onMenuPress,
}: TopBarProps) {
  const xpPercent = Math.min(100, (xp / xpToNextLevel) * 100);

  return (
    <View style={styles.container}>
      <Pressable style={styles.menuButton} onPress={onMenuPress} hitSlop={8}>
        <LinearGradient
          colors={["#FFFFFF", "#F3EFE8"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>

      <View style={styles.levelBadge}>
        <LinearGradient
          colors={["#FFFFFF", "#F3EFE8"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <Text style={styles.levelText}>Nv. {level}</Text>
        <View style={styles.xpTrack}>
          <LinearGradient
            colors={[colors.secondary, "#8B7CFF"]}
            style={[styles.xpFill, { width: `${xpPercent}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
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
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    ...shadow.card,
  },
  menuIcon: {
    fontSize: 16,
    color: colors.textDark,
  },
  levelBadge: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    width: 70,
    overflow: "hidden",
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
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textDark,
    letterSpacing: 0.3,
  },
});
