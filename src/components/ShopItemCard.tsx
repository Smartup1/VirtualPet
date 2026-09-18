import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@styles/colors";
import { radius, shadow, spacing } from "@styles/theme";

type MenuRoute = "loja" | "conquistas" | "minijogos" | "missoes";

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: MenuRoute) => void;
}

const MENU_WIDTH = 220;

const MENU_ITEMS: { key: MenuRoute; label: string; icon: string; color: string }[] = [
  { key: "loja", label: "Loja", icon: "🛒", color: colors.primary },
  { key: "conquistas", label: "Conquistas", icon: "🏆", color: colors.happiness },
  { key: "minijogos", label: "Minijogos", icon: "🎲", color: colors.secondary },
  { key: "missoes", label: "Missões diárias", icon: "📅", color: colors.hygiene },
];

export default function SideMenu({ visible, onClose, onNavigate }: SideMenuProps) {
  const translateX = useSharedValue(-MENU_WIDTH);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(visible ? 0 : -MENU_WIDTH, { duration: 250 });
    overlayOpacity.value = withTiming(visible ? 1 : 0, { duration: 250 });
  }, [visible]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <>
      {visible && (
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
      )}
      <Animated.View style={[styles.panel, panelStyle]}>
        <LinearGradient
          colors={["#FFFFFF", "#FFF6E8"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        <Text style={styles.title}>CapyPet</Text>
        <View style={styles.titleUnderline} />

        {MENU_ITEMS.map((item) => (
          <Pressable
            key={item.key}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            onPress={() => onNavigate(item.key)}
          >
            <View style={[styles.itemIconBadge, { backgroundColor: `${item.color}26` }]}>
              <Text style={styles.itemIcon}>{item.icon}</Text>
            </View>
            <Text style={styles.itemLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    zIndex: 10,
  },
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: MENU_WIDTH,
    overflow: "hidden",
    paddingTop: 60,
    paddingHorizontal: spacing.md,
    zIndex: 11,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    ...shadow.card,
    shadowOpacity: 0.3,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primaryDark,
    letterSpacing: 0.3,
  },
  titleUnderline: {
    width: 36,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginBottom: spacing.lg,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
  },
  itemPressed: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  itemIconBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  itemIcon: {
    fontSize: 16,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textDark,
  },
});
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@styles/colors";
import { radius, shadow, spacing } from "@styles/theme";

type MenuRoute = "loja" | "conquistas" | "minijogos" | "missoes";

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: MenuRoute) => void;
}

const MENU_WIDTH = 220;

const MENU_ITEMS: { key: MenuRoute; label: string; icon: string; color: string }[] = [
  { key: "loja", label: "Loja", icon: "🛒", color: colors.primary },
  { key: "conquistas", label: "Conquistas", icon: "🏆", color: colors.happiness },
  { key: "minijogos", label: "Minijogos", icon: "🎲", color: colors.secondary },
  { key: "missoes", label: "Missões diárias", icon: "📅", color: colors.hygiene },
];

export default function SideMenu({ visible, onClose, onNavigate }: SideMenuProps) {
  const translateX = useSharedValue(-MENU_WIDTH);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(visible ? 0 : -MENU_WIDTH, { duration: 250 });
    overlayOpacity.value = withTiming(visible ? 1 : 0, { duration: 250 });
  }, [visible]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <>
      {visible && (
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
      )}
      <Animated.View style={[styles.panel, panelStyle]}>
        <LinearGradient
          colors={["#FFFFFF", "#FFF6E8"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        <Text style={styles.title}>CapyPet</Text>
        <View style={styles.titleUnderline} />

        {MENU_ITEMS.map((item) => (
          <Pressable
            key={item.key}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            onPress={() => onNavigate(item.key)}
          >
            <View style={[styles.itemIconBadge, { backgroundColor: `${item.color}26` }]}>
              <Text style={styles.itemIcon}>{item.icon}</Text>
            </View>
            <Text style={styles.itemLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    zIndex: 10,
  },
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: MENU_WIDTH,
    overflow: "hidden",
    paddingTop: 60,
    paddingHorizontal: spacing.md,
    zIndex: 11,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    ...shadow.card,
    shadowOpacity: 0.3,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primaryDark,
    letterSpacing: 0.3,
  },
  titleUnderline: {
    width: 36,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginBottom: spacing.lg,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
  },
  itemPressed: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  itemIconBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  itemIcon: {
    fontSize: 16,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textDark,
  },
});
