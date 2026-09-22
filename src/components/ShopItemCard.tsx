import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@styles/colors";
import { radius, shadow, spacing } from "@styles/theme";
import { ShopItem } from "@ptypes/index";

interface ShopItemCardProps {
  item: ShopItem;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  onBuy: () => void;
  onEquip: () => void;
}

const CURRENCY_ICON: Record<ShopItem["currency"], string> = {
  coins: "🪙",
  gems: "💎",
};

export default function ShopItemCard({
  item,
  owned,
  equipped,
  canAfford,
  onBuy,
  onEquip,
}: ShopItemCardProps) {
  const isAccessory = item.category === "accessory";
  // Itens de comida/boost são consumíveis: sempre podem ser comprados de novo
  // (desde que dê pra pagar). Só acessórios ficam "donos" para sempre.
  const canBuy = isAccessory ? !owned && canAfford : canAfford;

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={["#FFFFFF", "#FFF8EE"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {equipped && (
        <View style={styles.equippedBadge}>
          <Text style={styles.equippedBadgeText}>Equipado</Text>
        </View>
      )}

      <View style={styles.iconBadge}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.priceRow}>
        <Text style={styles.priceIcon}>{CURRENCY_ICON[item.currency]}</Text>
        <Text style={styles.priceValue}>{item.price}</Text>
      </View>

      {isAccessory && owned ? (
        <Pressable
          onPress={onEquip}
          style={({ pressed }) => [
            styles.actionButton,
            equipped ? styles.actionButtonUnequip : styles.actionButtonEquip,
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Text
            style={[
              styles.actionLabel,
              equipped ? styles.actionLabelUnequip : styles.actionLabelEquip,
            ]}
          >
            {equipped ? "Remover" : "Equipar"}
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={onBuy}
          disabled={!canBuy}
          style={({ pressed }) => [
            styles.actionButton,
            styles.actionButtonBuy,
            !canBuy && styles.actionButtonDisabled,
            pressed && canBuy && styles.actionButtonPressed,
          ]}
        >
          <Text style={[styles.actionLabel, styles.actionLabelBuy]}>
            {!canAfford ? "Sem saldo" : "Comprar"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const CARD_WIDTH = "48%";

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: "center",
    overflow: "hidden",
    ...shadow.card,
  },
  equippedBadge: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 1,
  },
  equippedBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "700",
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: `${colors.primary}1F`,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  icon: {
    fontSize: 28,
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textDark,
    textAlign: "center",
  },
  description: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: "center",
    marginTop: 2,
    minHeight: 28,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  priceIcon: {
    fontSize: 13,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textDark,
  },
  actionButton: {
    width: "100%",
    borderRadius: radius.pill,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionButtonBuy: {
    backgroundColor: colors.primary,
  },
  actionButtonEquip: {
    backgroundColor: colors.secondary,
  },
  actionButtonUnequip: {
    backgroundColor: colors.barBackground,
  },
  actionButtonDisabled: {
    backgroundColor: colors.barBackground,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  actionLabelBuy: {
    color: colors.white,
  },
  actionLabelEquip: {
    color: colors.white,
  },
  actionLabelUnequip: {
    color: colors.textLight,
  },
});
