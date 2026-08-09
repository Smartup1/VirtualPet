import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "@styles/colors";
import { radius, shadow, spacing } from "@styles/theme";
import { ShopItem } from "@ptypes/index";

interface ShopItemCardProps {
  item: ShopItem;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  onBuy: () => void;
  onEquip?: () => void;
}

export default function ShopItemCard({
  item,
  owned,
  equipped,
  canAfford,
  onBuy,
  onEquip,
}: ShopItemCardProps) {
  const isAccessory = item.category === "accessory";
  const priceIcon = item.currency === "coins" ? "🪙" : "💎";

  return (
    <View style={[styles.card, equipped && styles.cardEquipped]}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>

      {isAccessory && owned ? (
        <Pressable
          style={[styles.button, equipped ? styles.buttonEquipped : styles.buttonSecondary]}
          onPress={onEquip}
        >
          <Text style={styles.buttonLabel}>{equipped ? "Equipado" : "Equipar"}</Text>
        </Pressable>
      ) : (
        <Pressable
          style={[styles.button, !canAfford && styles.buttonDisabled]}
          onPress={onBuy}
          disabled={!canAfford}
        >
          <Text style={[styles.buttonLabel, !canAfford && styles.buttonLabelDisabled]}>
            {priceIcon} {item.price}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: "center",
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  cardEquipped: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  name: {
    fontWeight: "700",
    fontSize: 13,
    color: colors.textDark,
    textAlign: "center",
  },
  description: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: "center",
    marginVertical: spacing.xs,
    minHeight: 28,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonEquipped: {
    backgroundColor: colors.hygiene,
  },
  buttonDisabled: {
    backgroundColor: colors.barBackground,
  },
  buttonLabel: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 12,
  },
  buttonLabelDisabled: {
    color: colors.textLight,
  },
});
