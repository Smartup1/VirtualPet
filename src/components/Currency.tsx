import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@styles/colors";
import { radius, shadow, spacing } from "@styles/theme";

interface CurrencyProps {
  coins: number;
  gems: number;
}

export default function Currency({ coins, gems }: CurrencyProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.pill, { shadowColor: colors.coin }]}>
        <LinearGradient
          colors={["#FFFFFF", "#FFF3D6"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={[styles.iconBadge, { backgroundColor: `${colors.coin}33` }]}>
          <Text style={styles.icon}>🪙</Text>
        </View>
        <Text style={styles.value}>{coins}</Text>
      </View>

      <View style={[styles.pill, { shadowColor: colors.gem }]}>
        <LinearGradient
          colors={["#FFFFFF", "#DFFAFB"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={[styles.iconBadge, { backgroundColor: `${colors.gem}33` }]}>
          <Text style={styles.icon}>💎</Text>
        </View>
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
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 6,
    overflow: "hidden",
    ...shadow.card,
    shadowOpacity: 0.25,
  },
  iconBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 11,
  },
  value: {
    fontWeight: "700",
    color: colors.textDark,
    fontSize: 13,
    paddingRight: 4,
  },
});
