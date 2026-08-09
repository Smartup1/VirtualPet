import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors } from "@styles/colors";
import { radius, shadow, spacing } from "@styles/theme";

type MenuRoute = "loja" | "conquistas" | "minijogos" | "missoes";

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: MenuRoute) => void;
}

const MENU_WIDTH = 220;

const MENU_ITEMS: { key: MenuRoute; label: string; icon: string }[] = [
  { key: "loja", label: "Loja", icon: "🛒" },
  { key: "conquistas", label: "Conquistas", icon: "🏆" },
  { key: "minijogos", label: "Minijogos", icon: "🎲" },
  { key: "missoes", label: "Missões diárias", icon: "📅" },
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
        <Text style={styles.title}>CapyPet</Text>
        {MENU_ITEMS.map((item) => (
          <Pressable key={item.key} style={styles.item} onPress={() => onNavigate(item.key)}>
            <Text style={styles.itemIcon}>{item.icon}</Text>
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
    backgroundColor: colors.card,
    paddingTop: 60,
    paddingHorizontal: spacing.md,
    zIndex: 11,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    ...shadow.card,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primaryDark,
    marginBottom: spacing.lg,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  itemIcon: {
    fontSize: 18,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textDark,
  },
});
