import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Currency from "@components/Currency";
import ShopItemCard from "@components/ShopItemCard";
import { colors } from "@styles/colors";
import { radius, spacing } from "@styles/theme";
import { usePetStore } from "@store/petStore";
import { SHOP_ITEMS } from "@constants/shopItems";
import { ShopCategory } from "@ptypes/index";

const TABS: { key: ShopCategory; label: string }[] = [
  { key: "accessory", label: "Acessórios" },
  { key: "food", label: "Comida" },
  { key: "boost", label: "Boosts" },
];

export default function ShopScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ShopCategory>("accessory");

  const wallet = usePetStore((s) => s.wallet);
  const inventory = usePetStore((s) => s.inventory);
  const equippedAccessory = usePetStore((s) => s.equippedAccessory);
  const purchaseItem = usePetStore((s) => s.purchaseItem);
  const equipAccessory = usePetStore((s) => s.equipAccessory);

  const items = SHOP_ITEMS.filter((item) => item.category === activeTab);

  function handleBuy(itemId: string) {
    // Feedback de erro pode virar um toast/snackbar no futuro.
    // Por ora, a compra falha silenciosamente se não puder pagar (botão já fica desabilitado).
    purchaseItem(itemId);
  }

  return (
    <LinearGradient
      colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backLabel}>← Voltar</Text>
          </Pressable>
          <Currency coins={wallet.coins} gems={wallet.gems} />
        </View>

        <Text style={styles.title}>Loja</Text>

        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.grid}>
          {items.map((item) => {
            const owned = inventory.includes(item.id);
            const canAfford = item.currency === "coins" ? wallet.coins >= item.price : wallet.gems >= item.price;
            return (
              <ShopItemCard
                key={item.id}
                item={item}
                owned={owned}
                equipped={equippedAccessory === item.id}
                canAfford={canAfford}
                onBuy={() => handleBuy(item.id)}
                onEquip={() => equipAccessory(equippedAccessory === item.id ? null : item.id)}
              />
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  backButton: {
    paddingVertical: spacing.xs,
  },
  backLabel: {
    fontWeight: "700",
    color: colors.textDark,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primaryDark,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textLight,
  },
  tabLabelActive: {
    color: colors.white,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
