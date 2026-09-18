import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@styles/colors";
import { radius, spacing } from "@styles/theme";

// abaixo desse valor, a barra pulsa pra chamar atenção do jogador
const CRITICAL_THRESHOLD = 25;

// clareia uma cor hex — usada pra gerar o segundo tom do gradiente
// de cada barra a partir da cor base (colors.hunger, colors.sleep, etc.)
function lightenColor(hex: string, amount = 0.35): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * amount));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

interface StatusBarItemProps {
  label: string;
  value: number; // 0-100
  color: string;
  icon: string; // emoji ou caminho de ícone
}

export function StatusBarItem({ label, value, color, icon }: StatusBarItemProps) {
  const width = useSharedValue(value);
  const pulse = useSharedValue(0);

  const isCritical = value < CRITICAL_THRESHOLD;

  useEffect(() => {
    width.value = withTiming(value, { duration: 400 });
  }, [value]);

  // liga/desliga o pulso de alerta quando o status entra/sai do crítico
  useEffect(() => {
    if (isCritical) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 550 }),
          withTiming(0, { duration: 550 })
        ),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(0, { duration: 250 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCritical]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.12 + pulse.value * 0.38,
  }));

  const badgeScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.1 }],
  }));

  return (
    <View style={styles.row}>
      {/* halo pulsante atrás do ícone quando o status está crítico */}
      <Animated.View
        pointerEvents="none"
        style={[styles.iconGlow, glowStyle, { backgroundColor: color }]}
      />

      <Animated.View
        style={[styles.iconBadge, badgeScaleStyle, { backgroundColor: `${color}26` }]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </Animated.View>

      <View style={styles.barColumn}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.valueText, isCritical && { color }]}>
            {Math.round(value)}%
          </Text>
        </View>

        <View style={styles.track}>
          <Animated.View style={[styles.fillWrapper, fillStyle]}>
            <LinearGradient
              colors={[color, lightenColor(color)]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
            {/* brilho vidrado no topo do preenchimento, dá volume à barra */}
            <View style={styles.fillShine} />
          </Animated.View>
        </View>
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
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconGlow: {
    position: "absolute",
    left: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 15,
  },
  barColumn: {
    flex: 1,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textLight,
  },
  valueText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textDark,
  },
  track: {
    height: 11,
    backgroundColor: colors.barBackground,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  fillWrapper: {
    height: "100%",
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  fillShine: {
    position: "absolute",
    top: 1,
    left: 2,
    right: 2,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
});
